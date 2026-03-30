import { useEffect, useState, useRef, useCallback } from "react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Upload, Trash2, Copy, Search, Image as ImageIcon, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { getOptimizedImageUrl } from "@/lib/utils";
import { useTranslation } from "@/hooks/useTranslation";

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
  const { t } = useTranslation();

  const fetchMedia = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from("media_library")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Fetch media error:", error);
        toast({
          title: t('common.loading') + " " + t('404.title'),
          description: error.message,
          variant: "destructive",
        });
      } else {
        setMedia(data || []);
      }
    } catch (err) {
      console.error("Fetch media unexpected error:", err);
    }
  }, [toast, t]);

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
        toast({ title: `${t('admin.upload')} ${file.name} ${t('404.title')}`, description: uploadError.message, variant: "destructive" });
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
        toast({ title: `${t('common.save')} ${file.name} ${t('404.title')}`, description: insertError.message, variant: "destructive" });
      }
    }

    setUploading(false);
    fetchMedia();
    toast({ title: t('admin.upload') + " OK" });
    if (fileRef.current) fileRef.current.value = "";
  };

  const deleteMedia = async (item: MediaItem) => {
    if (!confirm(`${t('common.delete')} "${item.file_name}"?`)) return;

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
          title: "Storage Error",
          description: `Could not remove from storage but trying DB... (${storageError.message})`,
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
          title: t('common.delete') + " " + t('404.title'),
          description: dbError.message,
          variant: "destructive"
        });
      } else {
        toast({
          title: t('common.delete') + " OK",
          description: item.file_name,
        });
        await fetchMedia();
      }
    } catch (error) {
      console.error("Unexpected delete error:", error);
      toast({
        title: t('404.title'),
        description: error instanceof Error ? error.message : "Error",
        variant: "destructive"
      });
    } finally {
      setDeletingId(null);
    }
  };

  const copyUrl = (path: string) => {
    const { data } = supabase.storage.from("review-media").getPublicUrl(path);
    navigator.clipboard.writeText(data.publicUrl);
    toast({ title: t('admin.copy_url') + " OK" });
  };

  const getPublicUrl = (path: string) => {
    const { data } = supabase.storage.from("review-media").getPublicUrl(path);
    return data.publicUrl;
  };

  const filtered = media.filter((m) => m.file_name.toLowerCase().includes(search.toLowerCase()));

  return (
    <AdminLayout>
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-heading text-2xl font-bold text-foreground">{t('admin.manage_media')}</h1>
        <div>
          <input ref={fileRef} type="file" multiple accept="image/*" onChange={handleUpload} className="hidden" />
          <Button onClick={() => fileRef.current?.click()} disabled={uploading}>
            <Upload className="mr-2 h-4 w-4" />
            {uploading ? t('admin.uploading') : t('admin.upload')}
          </Button>
        </div>
      </div>

      <div className="relative mb-4">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input placeholder={t('admin.search_files')} value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9" />
      </div>

      {filtered.length === 0 ? (
        <div className="text-center py-16 text-muted-foreground">
          <ImageIcon className="h-12 w-12 mx-auto mb-3 opacity-50" />
          <p>{t('admin.no_files')}</p>
        </div>
      ) : (
        <div className="bg-card border rounded-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b bg-muted/50">
                  <th className="text-left px-4 py-3 font-medium text-muted-foreground w-16">{t('admin.id')}</th>
                  <th className="text-left px-4 py-3 font-medium text-muted-foreground w-24">{t('admin.preview')}</th>
                  <th className="text-left px-4 py-3 font-medium text-muted-foreground">{t('admin.description')}</th>
                  <th className="text-right px-4 py-3 font-medium text-muted-foreground w-32">{t('admin.actions')}</th>
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
                            src={getOptimizedImageUrl(getPublicUrl(m.file_path), 'thumbnail')}
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
