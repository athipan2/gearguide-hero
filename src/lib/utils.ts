import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Parses a price string (e.g., "฿8,500") into a number.
 * Removes currency symbols and commas.
 */
export const parseThaiPrice = (priceStr: string | null | undefined): number => {
  if (!priceStr) return 0;
  const match = priceStr.replace(/,/g, '').match(/\d+/);
  return match ? parseInt(match[0], 10) : 0;
};

export type ImageVariant = 'thumbnail' | 'card' | 'hero' | 'full';

/**
 * Generates an optimized image URL based on the source and requested variant.
 * Supports Supabase Storage and Unsplash.
 */
export const getOptimizedImageUrl = (url: string | null | undefined, variant: ImageVariant = 'card'): string => {
  if (!url) return '';

  // Standard dimensions and qualities for each variant
  const specs = {
    thumbnail: { w: 200, h: 200, q: 70, fit: 'cover' },
    card: { w: 600, h: 450, q: 80, fit: 'cover' }, // 4:3
    hero: { w: 1200, h: 800, q: 85, fit: 'cover' },
    full: { w: 2000, h: undefined, q: 90, fit: 'contain' }
  }[variant];

  try {
    const urlObj = new URL(url);

    // 1. Handle Unsplash URLs
    if (urlObj.hostname.includes('unsplash.com')) {
      urlObj.searchParams.set('w', specs.w.toString());
      if (specs.h) urlObj.searchParams.set('h', specs.h.toString());
      urlObj.searchParams.set('fit', specs.fit === 'cover' ? 'crop' : 'max');
      urlObj.searchParams.set('q', specs.q.toString());
      urlObj.searchParams.set('auto', 'format');
      return urlObj.toString();
    }

    // 2. Handle Supabase Storage URLs
    // Supabase format: https://[project-ref].supabase.co/storage/v1/object/public/[bucket]/[path]
    // NOTE: Image transformation (/render/image/) is a Pro feature in Supabase.
    // For Free Tier, we must return the original public URL to avoid 404/403 errors.
    if (url.includes('/storage/v1/object/public/')) {
      return url;
    }

    return url;
  } catch (e) {
    // If URL parsing fails, return original
    return url;
  }
};
