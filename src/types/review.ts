export type SectionType =
  | 'hero'
  | 'specs'
  | 'pros_cons'
  | 'who_is_this_for'
  | 'gallery'
  | 'comparison'
  | 'verdict'
  | 'content';

export interface SpecItem {
  label: string;
  value: string;
  highlight?: boolean;
}

export interface ReviewRating {
  label: string;
  score: number;
}

export interface ReviewSectionData {
  title?: string;
  body?: string;
  items?: string[] | SpecItem[];
  type: SectionType;
  props?: Record<string, any>;
}

export interface ReviewData {
  id?: string;
  slug?: string;
  name: string;
  brand: string;
  category: string;
  price: string;
  image_url: string | null;
  images: string[];
  badge: string | null;
  overall_rating: number;
  ratings: ReviewRating[];
  specs: SpecItem[];
  pros: string[];
  cons: string[];
  verdict: string | null;
  intro: string | null;
  sections: ReviewSectionData[];
  affiliate_url: string | null;
  cta_text: string | null;
}
