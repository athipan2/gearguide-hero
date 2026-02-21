import { useEffect, useState, useRef, useCallback } from "react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Upload, Trash2, Copy, Search, Image as ImageIcon, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";

interface MediaItem {
  id: string;
  file_name: string;
  file_path: string;
  file_size: number | null;
  mime_type: string | null;
  created_at: string;
}

export default function AdminMedia() {
  const [media, setMedia] = useState<MediaItem[]>([]);
  const [search, setSearch] = useState("");
  const [uploading, setUploading] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();
  const { user } = useAuth();

  const fetchMedia = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from("media_library")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Fetch media error:", error);
        toast({
          title: "ไม่สามารถโหลดข้อมูลสื่อได้",
          description: error.message,
          variant: "destructive",
        });
      } else {
        setMedia(data || []);
      }
    } catch (err) {
      console.error("Fetch media unexpected error:", err);
    }
  }, [toast]);

  useEffect(() => { fetchMedia(); }, [fetchMedia]);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files?.length || !user) return;
    setUploading(true);

    for (const file of Array.from(files)) {
      const ext = file.name.split(".").pop();
      const path = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;

      const { error: uploadError } = await supabase.storage
        .from("review-media")
        .upload(path, file, { contentType: file.type });

      if (uploadError) {
        toast({ title: `อัปโหลด ${file.name} ไม่สำเร็จ`, description: uploadError.message, variant: "destructive" });
        continue;
      }

      const { error: insertError } = await supabase.from("media_library").insert({
        file_name: file.name,
        file_path: path,
        file_size: file.size,
        mime_type: file.type,
        uploaded_by: user.id,
      });

      if (insertError) {
        console.error("Insert error:", insertError);
        toast({ title: `บันทึกข้อมูล ${file.name} ไม่สำเร็จ`, description: insertError.message, variant: "destructive" });
      }
    }

    setUploading(false);
    fetchMedia();
    toast({ title: "อัปโหลดสำเร็จ" });
    if (fileRef.current) fileRef.current.value = "";
  };

  const deleteMedia = async (item: MediaItem) => {
    if (!confirm(`คุณแน่ใจหรือไม่ว่าต้องการลบ "${item.file_name}"?`)) return;

    setDeletingId(item.id);
    try {
      // 1. Delete from storage first
      const { error: storageError } = await supabase.storage
        .from("review-media")
        .remove([item.file_path]);

      if (storageError) {
        console.error("Storage delete error:", storageError);
        // Show warning but continue to delete DB record
        toast({
          title: "มีข้อผิดพลาดกับ Storage",
          description: `ไม่สามารถลบไฟล์จากที่เก็บข้อมูลได้ แต่ระบบจะลองลบจากฐานข้อมูลต่อ (${storageError.message})`,
          variant: "destructive"
        });
      }

      // 2. Delete from database
      const { error: dbError } = await supabase
        .from("media_library")
        .delete()
        .eq("id", item.id);

      if (dbError) {
        console.error("Database delete error:", dbError);
        toast({
          title: "ลบไม่สำเร็จ",
          description: `ไม่สามารถลบข้อมูลจากฐานข้อมูลได้: ${dbError.message}`,
          variant: "destructive"
        });
      } else {
        toast({
          title: "ลบสำเร็จ",
          description: `ลบไฟล์ ${item.file_name} เรียบร้อยแล้ว`,
        });
        await fetchMedia();
      }
    } catch (error) {
      console.error("Unexpected delete error:", error);
      toast({
        title: "เกิดข้อผิดพลาดไม่คาดคิด",
        description: error instanceof Error ? error.message : "ไม่สามารถลบไฟล์ได้",
        variant: "destructive"
      });
    } finally {
      setDeletingId(null);
    }
  };

  const copyUrl = (path: string) => {
    const { data } = supabase.storage.from("review-media").getPublicUrl(path);
    navigator.clipboard.writeText(data.publicUrl);
    toast({ title: "คัดลอก URL แล้ว" });
  };

  const getPublicUrl = (path: string) => {
    const { data } = supabase.storage.from("review-media").getPublicUrl(path);
    return data.publicUrl;
  };

  const filtered = media.filter((m) => m.file_name.toLowerCase().includes(search.toLowerCase()));

  return (
    <AdminLayout>
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-heading text-2xl font-bold text-foreground">Media Library</h1>
        <div>
          <input ref={fileRef} type="file" multiple accept="image/*" onChange={handleUpload} className="hidden" />
          <Button onClick={() => fileRef.current?.click()} disabled={uploading}>
            <Upload className="mr-2 h-4 w-4" />
            {uploading ? "กำลังอัปโหลด..." : "อัปโหลด"}
          </Button>
        </div>
      </div>

      <div className="relative mb-4">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input placeholder="ค้นหาไฟล์..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9" />
      </div>

      {filtered.length === 0 ? (
        <div className="text-center py-16 text-muted-foreground">
          <ImageIcon className="h-12 w-12 mx-auto mb-3 opacity-50" />
          <p>ยังไม่มีไฟล์</p>
        </div>
      ) : (
        <div className="bg-card border rounded-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b bg-muted/50">
                  <th className="text-left px-4 py-3 font-medium text-muted-foreground w-16">ID</th>
                  <th className="text-left px-4 py-3 font-medium text-muted-foreground w-24">รูปภาพ</th>
                  <th className="text-left px-4 py-3 font-medium text-muted-foreground">คำอธิบาย</th>
                  <th className="text-right px-4 py-3 font-medium text-muted-foreground w-32">จัดการ</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((m, index) => (
                  <tr key={m.id} className="border-b last:border-0 hover:bg-muted/30">
                    <td className="px-4 py-3 text-muted-foreground">{index + 1}</td>
                    <td className="px-4 py-3">
                      <div className="w-12 h-12 rounded overflow-hidden bg-muted border">
                        {m.mime_type?.startsWith("image/") ? (
                          <img
                            src={getPublicUrl(m.file_path)}
                            alt={m.file_name}
                            className="w-full h-full object-cover"
                            loading="lazy"
                          />
                        ) : (
                          <div className="flex items-center justify-center h-full">
                            <ImageIcon className="h-6 w-6 text-muted-foreground" />
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <p className="font-medium text-foreground">{m.file_name}</p>
                      <p className="text-xs text-muted-foreground">
                        {m.file_size ? `${(m.file_size / 1024).toFixed(0)} KB` : ""} • {m.mime_type}
                      </p>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end gap-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => copyUrl(m.file_path)}
                          title="คัดลอก URL"
                        >
                          <Copy className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => deleteMedia(m)}
                          className="text-destructive hover:bg-destructive/10"
                          title="ลบไฟล์"
                          disabled={deletingId === m.id}
                        >
                          {deletingId === m.id ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : (
                            <Trash2 className="h-4 w-4" />
                          )}
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}
