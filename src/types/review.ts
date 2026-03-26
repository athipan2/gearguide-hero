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
  highlight?: boolean;
}

export interface ReviewRating {
  label: string;
  score: number;
}

export interface ReviewSectionData {
  title?: string;
  title_en?: string;
  body?: string;
  body_en?: string;
  items?: string[] | SpecItem[];
  items_en?: string[] | SpecItem[];
  type: SectionType;
  props?: Record<string, unknown>;
}

export interface ReviewData {
  id?: string;
  slug?: string;
  name: string;
  name_en?: string;
  brand: string;
  category: string;
  category_en?: string;
  price: string;
  price_en?: string;
  image_url: string | null;
  images: string[];
  badge: string | null;
  badge_en?: string | null;
  overall_rating: number;
  ratings: ReviewRating[];
  ratings_en?: ReviewRating[];
  specs: SpecItem[];
  specs_en?: SpecItem[];
  pros: string[];
  pros_en?: string[];
  cons: string[];
  cons_en?: string[];
  verdict: string | null;
  verdict_en?: string | null;
  intro: string | null;
  intro_en?: string | null;
  sections: ReviewSectionData[];
  affiliate_url: string | null;
  cta_text: string | null;
  cta_text_en?: string | null;
  // New fields for high-detail refactor
  shopee_url?: string | null;
  lazada_url?: string | null;
  test_conditions?: {
    terrain: string;
    weather: string;
    distance: string;
  };
  test_conditions_en?: {
    terrain: string;
    weather: string;
    distance: string;
  };
}
