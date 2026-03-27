export type SectionType =
  | 'hero'
  | 'specs'
  | 'pros_cons'
  | 'who_is_this_for'
  | 'quick_decision'
  | 'score_breakdown'
  | 'gallery'
  | 'comparison'
  | 'verdict'
  | 'content'
  | 'deep_dive'
  | 'real_world_test';

export interface SpecItem {
  label: string;
  value: string;
  label_en?: string;
  value_en?: string;
  highlight?: boolean;
}

export interface ReviewRating {
  label: string;
  label_en?: string;
  score: number;
}

export interface ReviewSectionData {
  title?: string;
  title_en?: string;
  body?: string;
  body_en?: string;
  items?: string[] | SpecItem[];
  items_en?: string[];
  type: SectionType;
  props?: Record<string, unknown>;
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
  pros_en?: string[];
  cons: string[];
  cons_en?: string[];
  verdict: string | null;
  intro: string | null;
  sections: ReviewSectionData[];
  affiliate_url: string | null;
  cta_text: string | null;
  // New fields for high-detail refactor
  shopee_url?: string | null;
  lazada_url?: string | null;
  test_conditions?: {
    terrain: string;
    weather: string;
    distance: string;
  };
  // Localization support
  name_en?: string | null;
  brand_en?: string | null;
  category_en?: string | null;
  badge_en?: string | null;
  verdict_en?: string | null;
  intro_en?: string | null;
  cta_text_en?: string | null;
  test_conditions_en?: {
    terrain: string;
    weather: string;
    distance: string;
  };
}
