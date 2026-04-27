
import { supabase } from "@/integrations/supabase/client";
import { sheetsClient } from "./google-sheets";

// Toggle this to switch between Supabase and Google Sheets
const USE_GOOGLE_SHEETS = import.meta.env.VITE_USE_GOOGLE_SHEETS === 'true';

export const dataService = {
  async getReviews(filter?: { brand?: string }) {
    if (USE_GOOGLE_SHEETS) {
      let data = await sheetsClient.select<Record<string, unknown>>('reviews');
      if (filter?.brand) {
        data = data.filter(r =>
          r.name?.toLowerCase().includes(filter.brand!.toLowerCase()) ||
          r.brand?.toLowerCase().includes(filter.brand!.toLowerCase())
        );
      }
      return data;
    }
    let query = supabase.from("reviews").select("*").eq("published", true);
    if (filter?.brand) {
      query = query.ilike("name", `%${filter.brand}%`);
    }
    const { data, error } = await query;
    if (error) throw error;
    return data;
  },

  async getReviewById(id: string) {
    if (USE_GOOGLE_SHEETS) {
      const results = await sheetsClient.select<Record<string, unknown>>('reviews', id);
      return results[0] || null;
    }
    const { data, error } = await supabase.from("reviews").select("*").eq("id", id).maybeSingle();
    if (error) throw error;
    return data;
  },

  async saveReview(payload: Record<string, unknown>, id?: string) {
    if (USE_GOOGLE_SHEETS) {
      if (id) {
        return sheetsClient.update('reviews', id, payload);
      } else {
        const newId = crypto.randomUUID();
        return sheetsClient.insert('reviews', { ...payload, id: newId, created_at: new Date().toISOString() });
      }
    }

    if (id) {
      return supabase.from("reviews").update(payload).eq("id", id);
    } else {
      return supabase.from("reviews").insert([payload]);
    }
  },

  async deleteReview(id: string) {
    if (USE_GOOGLE_SHEETS) {
      return sheetsClient.delete('reviews', id);
    }
    return supabase.from("reviews").delete().eq("id", id);
  },

  async uploadImage(file: File) {
    if (USE_GOOGLE_SHEETS) {
      return sheetsClient.upload(file);
    }
    // Supabase upload logic would go here if needed,
    // but usually it's handled via supabase.storage
    throw new Error("Supabase upload not implemented in dataService yet");
  }
};
