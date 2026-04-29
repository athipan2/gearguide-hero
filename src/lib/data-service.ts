
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

export interface MediaItem {
  id: string;
  file_name: string;
  file_path: string;
  file_size: number | null;
  mime_type: string | null;
  created_at: string;
  uploaded_by?: string;
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

  async getReviewBySlug(slug: string) {
    if (USE_GOOGLE_SHEETS) {
      try {
        const results = await sheetsClient.select<Record<string, unknown>>('reviews');
        return results.find(r => r.slug === slug) || null;
      } catch (err) {
        console.error("Error getting review by slug from sheets:", err);
        return null;
      }
    }
    const { data, error } = await supabase.from("reviews").select("*").eq("slug", slug).maybeSingle();
    if (error) throw error;
    return data;
  },

  async getArticles() {
    if (USE_GOOGLE_SHEETS) {
      try {
        const data = await sheetsClient.select<Record<string, unknown>>('articles');
        return data.filter(a => a.published === true || a.published === 'TRUE' || a.published === 'true');
      } catch (err) {
        console.error("Error getting articles from sheets:", err);
        return [];
      }
    }
    const { data, error } = await supabase.from("articles").select("*").eq("published", true).order("created_at", { ascending: false });
    if (error) throw error;
    return data;
  },

  async getArticleBySlug(slug: string) {
    if (USE_GOOGLE_SHEETS) {
      try {
        const results = await sheetsClient.select<Record<string, unknown>>('articles');
        return results.find(a => a.slug === slug) || null;
      } catch (err) {
        console.error("Error getting article by slug from sheets:", err);
        return null;
      }
    }
    const { data, error } = await supabase.from("articles").select("*").eq("slug", slug).maybeSingle();
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

  async getMedia() {
    if (USE_GOOGLE_SHEETS) {
      try {
        const data = await sheetsClient.select<MediaItem>('media_library');
        // Filter out items that don't have a file_path (might be empty rows)
        return data.filter(item => item.file_path);
      } catch (err) {
        console.error("Error getting media from sheets:", err);
        return [];
      }
    }
    const { data, error } = await supabase
      .from("media_library")
      .select("*")
      .order("created_at", { ascending: false });
    if (error) throw error;
    return data || [];
  },

  async uploadImage(file: File, userId?: string) {
    if (USE_GOOGLE_SHEETS) {
      const result = await sheetsClient.upload(file);
      if (result.success) {
        // Record in media_library table as well
        await sheetsClient.insert('media_library', {
          id: crypto.randomUUID(),
          file_name: file.name,
          file_path: result.directLink || result.url,
          file_size: file.size,
          mime_type: file.type,
          uploaded_by: userId || 'unknown',
          created_at: new Date().toISOString()
        });
      }
      return result;
    }

    // Supabase implementation
    const ext = file.name.split(".").pop();
    const path = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
    const { error: uploadError } = await supabase.storage
      .from("review-media")
      .upload(path, file, { contentType: file.type });

    if (uploadError) throw uploadError;

    const { data: publicData } = supabase.storage.from("review-media").getPublicUrl(path);

    const { error: insertError } = await supabase.from("media_library").insert({
      file_name: file.name,
      file_path: path,
      file_size: file.size,
      mime_type: file.type,
      uploaded_by: userId,
    });

    if (insertError) throw insertError;

    return { success: true, url: publicData.publicUrl, directLink: publicData.publicUrl, path };
  },

  async searchReviews(query: string) {
    if (USE_GOOGLE_SHEETS) {
      try {
        const data = await sheetsClient.select<SheetReview>('reviews');
        const q = query.toLowerCase();
        return data.filter(r =>
          (r.published === true || r.published === 'TRUE' || r.published === 'true') &&
          ((r.name && typeof r.name === 'string' && r.name.toLowerCase().includes(q)) ||
           (r.brand && typeof r.brand === 'string' && r.brand.toLowerCase().includes(q)) ||
           (r.name_en && typeof r.name_en === 'string' && r.name_en.toLowerCase().includes(q)) ||
           (r.brand_en && typeof r.brand_en === 'string' && r.brand_en.toLowerCase().includes(q)))
        );
      } catch (err) {
        console.error("Error searching reviews in sheets:", err);
        return [];
      }
    }
    const { data, error } = await supabase
      .from("reviews")
      .select("*")
      .eq("published", true)
      .or(`name.ilike.%${query}%,brand.ilike.%${query}%,name_en.ilike.%${query}%,brand_en.ilike.%${query}%`)
      .limit(10);
    if (error) throw error;
    return data;
  },

  async deleteMedia(item: MediaItem) {
    if (USE_GOOGLE_SHEETS) {
      return sheetsClient.delete('media_library', item.id);
    }

    // 1. Delete from storage
    const { error: storageError } = await supabase.storage
      .from("review-media")
      .remove([item.file_path]);

    if (storageError) {
      console.warn("Storage delete failed:", storageError);
    }

    // 2. Delete from database
    return supabase.from("media_library").delete().eq("id", item.id);
  }
};
