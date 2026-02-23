import { supabase } from "@/integrations/supabase/client";
import type { Database } from "@/integrations/supabase/types";

export type Review = Database["public"]["Tables"]["reviews"]["Row"];
export type Article = Database["public"]["Tables"]["articles"]["Row"];

export async function getReviews(options?: {
  category?: string;
  published?: boolean;
  limit?: number;
  order?: { column: keyof Review; ascending?: boolean };
}) {
  let query = supabase.from("reviews").select("*");

  if (options?.published !== undefined) {
    query = query.eq("published", options.published);
  }

  if (options?.category) {
    query = query.eq("category", options.category);
  }

  if (options?.order) {
    query = query.order(options.order.column, { ascending: options.order.ascending ?? false });
  } else {
    query = query.order("created_at", { ascending: false });
  }

  if (options?.limit) {
    query = query.limit(options.limit);
  }

  const { data, error } = await query;
  if (error) throw error;
  return data;
}

export async function getReviewBySlug(slug: string) {
  const { data, error } = await supabase
    .from("reviews")
    .select("*")
    .eq("slug", slug)
    .maybeSingle();

  if (error) throw error;
  return data;
}

export async function getArticles(options?: {
  published?: boolean;
  limit?: number;
}) {
  let query = supabase.from("articles").select("*");

  if (options?.published !== undefined) {
    query = query.eq("published", options.published);
  }

  query = query.order("created_at", { ascending: false });

  if (options?.limit) {
    query = query.limit(options.limit);
  }

  const { data, error } = await query;
  if (error) throw error;
  return data;
}

export async function getArticleBySlug(slug: string) {
  const { data, error } = await supabase
    .from("articles")
    .select("*")
    .eq("slug", slug)
    .maybeSingle();

  if (error) throw error;
  return data;
}
