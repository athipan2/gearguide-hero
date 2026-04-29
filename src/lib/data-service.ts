
import { supabase } from "@/integrations/supabase/client";
import { sheetsClient } from "./google-sheets";

// Toggle this to switch between Supabase and Google Sheets
const USE_GOOGLE_SHEETS = import.meta.env.VITE_USE_GOOGLE_SHEETS === 'true';

interface SheetReview {
  id: string;
  name?: string;
  brand?: string;
  published?: boolean | string;
  created_at?: string;
  [key: string]: unknown;
}

export const dataService = {
  async getReviews(options?: {
    brand?: string;
    limit?: number;
    order?: { column: string; ascending?: boolean };
    publishedOnly?: boolean;
  }) {
    const { brand, limit, order, publishedOnly = true } = options || {};

    if (USE_GOOGLE_SHEETS) {
      let data = await sheetsClient.select<SheetReview>('reviews');

      // Filter published
      if (publishedOnly) {
        data = data.filter(r => r.published === true || r.published === 'TRUE' || r.published === 'true');
      }

      // Filter brand
      if (brand) {
        data = data.filter(r =>
          (r.name && typeof r.name === 'string' && r.name.toLowerCase().includes(brand.toLowerCase())) ||
          (r.brand && typeof r.brand === 'string' && r.brand.toLowerCase().includes(brand.toLowerCase()))
        );
      }

      // Sort
      if (order) {
        data.sort((a, b) => {
          const valA = a[order.column];
          const valB = b[order.column];

          // Safer comparison
          const cmpA = (valA !== null && valA !== undefined) ? String(valA) : '';
          const cmpB = (valB !== null && valB !== undefined) ? String(valB) : '';

          if (cmpA < cmpB) return order.ascending ? -1 : 1;
          if (cmpA > cmpB) return order.ascending ? 1 : -1;
          return 0;
        });
      } else {
        // Default sort by created_at desc
        data.sort((a, b) => {
          const dateA = new Date(String(a.created_at || 0)).getTime();
          const dateB = new Date(String(b.created_at || 0)).getTime();
          return dateB - dateA;
        });
      }

      // Limit
      if (limit) {
        data = data.slice(0, limit);
      }

      return data;
    }

    let query = supabase.from("reviews").select("*");

    if (publishedOnly) {
      query = query.eq("published", true);
    }

    if (brand) {
      query = query.ilike("name", `%${brand}%`);
    }

    if (order) {
      query = query.order(order.column, { ascending: order.ascending ?? false });
    } else {
      query = query.order("created_at", { ascending: false });
    }

    if (limit) {
      query = query.limit(limit);
    }

    const { data, error } = await query;
    if (error) throw error;
    return data;
  },

  async getReviewById(id: string) {
    if (USE_GOOGLE_SHEETS) {
      try {
        const results = await sheetsClient.select<Record<string, unknown>>('reviews', id);
        return results[0] || null;
      } catch (err) {
        console.error("Error getting review by id from sheets:", err);
        return null;
      }
    }
    const { data, error } = await supabase.from("reviews").select("*").eq("id", id).maybeSingle();
    if (error) throw error;
    return data;
  },

  async saveReview(payload: Record<string, unknown>, id?: string) {
    if (USE_GOOGLE_SHEETS) {
      try {
        if (id) {
          return await sheetsClient.update('reviews', id, payload);
        } else {
          const newId = crypto.randomUUID();
          return await sheetsClient.insert('reviews', { ...payload, id: newId, created_at: new Date().toISOString() });
        }
      } catch (err) {
        console.error("Error saving review to sheets:", err);
        throw err;
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
