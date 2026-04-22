import { BackendInterface } from "./types";
import { LocalBackend } from "./local-backend";
import { FirebaseBackend } from "./firebase-backend";
import { PocketBaseBackend } from "./pocketbase-backend";
import { supabase } from "@/integrations/supabase/client";

class SupabaseBackend implements BackendInterface {
  async signIn(email: string, password: string) {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    return { user: data.user, session: data.session, error: error as Error | null };
  }
  async signOut() {
    await supabase.auth.signOut();
  }
  async getUser() {
    const { data: { user } } = await supabase.auth.getUser();
    return user;
  }
  async checkRoles(userId: string) {
    const { data } = await supabase.from("user_roles").select("role").eq("user_id", userId);
    const roles = data?.map((r) => r.role) || [];
    return { isAdmin: roles.includes("admin"), isEditor: roles.includes("editor") };
  }
  async getReviews() {
    const { data } = await supabase.from("reviews").select("*").order("created_at", { ascending: false });
    return data || [];
  }
  async getReviewById(id: string) {
    const { data } = await supabase.from("reviews").select("*").or(`id.eq.${id},slug.eq.${id}`).single();
    return data;
  }
  async saveReview(review: any) {
    return await supabase.from("reviews").upsert(review).select().single();
  }
  async deleteReview(id: string) {
    const { error } = await supabase.from("reviews").delete().eq("id", id);
    return { error: error as Error | null };
  }
  async getMedia() {
    const { data } = await supabase.from("media_library").select("*").order("created_at", { ascending: false });
    return data || [];
  }
  async uploadMedia(file: File, bucket: string) {
    const fileName = `${Date.now()}-${file.name}`;
    const { data: uploadData, error: uploadError } = await supabase.storage.from(bucket).upload(fileName, file);
    if (uploadError) return { data: null, error: uploadError as Error };

    const { data: { publicUrl } } = supabase.storage.from(bucket).getPublicUrl(fileName);
    const mediaRecord = {
        url: publicUrl,
        file_name: file.name,
        file_path: fileName,
        file_size: file.size,
        mime_type: file.type,
        bucket
    };
    return await supabase.from("media_library").insert(mediaRecord).select().single();
  }
  async deleteMedia(id: string, path: string, bucket: string) {
    await supabase.storage.from(bucket).remove([path]);
    const { error } = await supabase.from("media_library").delete().eq("id", id);
    return { error: error as Error | null };
  }
  getMediaUrl(path: string, bucket: string) {
    const { data } = supabase.storage.from(bucket).getPublicUrl(path);
    return data.publicUrl;
  }
}

const backendType = import.meta.env.VITE_BACKEND_TYPE || "local";

let backendInstance: BackendInterface;

switch (backendType) {
  case "supabase":
    backendInstance = new SupabaseBackend();
    break;
  case "firebase":
    backendInstance = new FirebaseBackend();
    break;
  case "pocketbase":
    backendInstance = new PocketBaseBackend();
    break;
  case "local":
  default:
    backendInstance = new LocalBackend();
    break;
}

export const backend = backendInstance;
