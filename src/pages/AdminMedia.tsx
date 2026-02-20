import { useEffect, useState, useRef } from "react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Upload, Trash2, Copy, Search, Image as ImageIcon } from "lucide-react";
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
  const fileRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();
  const { user } = useAuth();

  const fetchMedia = async () => {
    const { data } = await supabase
      .from("media_library")
      .select("*")
      .order("created_at", { ascending: false });
    setMedia(data || []);
  };

  useEffect(() => { fetchMedia(); }, []);

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
    if (!confirm(`ลบ "${item.file_name}"?`)) return;

    try {
      // 1. Delete from storage
      const { error: storageError } = await supabase.storage
        .from("review-media")
        .remove([item.file_path]);

      if (storageError) {
        console.error("Storage delete error:", storageError);
        // We continue even if storage delete fails (e.g. file already gone)
        // so the user can clean up the database record.
      }

      // 2. Delete from database
      const { error: dbError } = await supabase
        .from("media_library")
        .delete()
        .eq("id", item.id);

      if (dbError) {
        console.error("Database delete error:", dbError);
        toast({
          title: "ลบข้อมูลไม่สำเร็จ",
          description: dbError.message,
          variant: "destructive"
        });
      } else {
        toast({ title: "ลบไฟล์สำเร็จแล้ว" });
        fetchMedia();
      }
    } catch (error) {
      console.error("Delete error:", error);
      toast({
        title: "เกิดข้อผิดพลาดในการลบ",
        description: error instanceof Error ? error.message : "เกิดข้อผิดพลาดไม่ทราบสาเหตุ",
        variant: "destructive"
      });
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
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {filtered.map((m) => (
            <div key={m.id} className="bg-card border rounded-xl overflow-hidden group">
              <div className="aspect-square bg-muted relative">
                {m.mime_type?.startsWith("image/") ? (
                  <img src={getPublicUrl(m.file_path)} alt={m.file_name} className="w-full h-full object-cover" loading="lazy" />
                ) : (
                  <div className="flex items-center justify-center h-full">
                    <ImageIcon className="h-8 w-8 text-muted-foreground" />
                  </div>
                )}
                <div className="absolute inset-0 bg-foreground/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                  <Button variant="secondary" size="icon" onClick={() => copyUrl(m.file_path)}>
                    <Copy className="h-4 w-4" />
                  </Button>
                  <Button variant="destructive" size="icon" onClick={() => deleteMedia(m)}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              <div className="p-2 flex items-center justify-between gap-2">
                <div className="min-w-0 flex-1">
                  <p className="text-xs text-foreground truncate" title={m.file_name}>{m.file_name}</p>
                  <p className="text-xs text-muted-foreground">{m.file_size ? `${(m.file_size / 1024).toFixed(0)} KB` : ""}</p>
                </div>
                <div className="flex gap-1 md:hidden">
                  <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => copyUrl(m.file_path)}>
                    <Copy className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive" onClick={() => deleteMedia(m)}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </AdminLayout>
  );
}
