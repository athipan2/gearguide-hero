export type Category = 'road' | 'trail' | 'watch';

export interface BaseGear {
  id: string;
  name: string;
  brand: string;
  category: Category;
  price: string;
  overall_rating: number;
  image_url: string | null;
  slug: string;
}

export interface ShoeSpecs {
  weightG: number;
  dropMm: number;
  stackHeightMm?: number;
  cushioning: 'Soft' | 'Firm' | 'Responsive' | 'Max';
  bestFor: string[];
}

export interface WatchSpecs {
  gpsBatteryHrs: number;
  screenType: 'AMOLED' | 'MIP' | 'LCD';
  hasMaps: boolean;
  waterResistance: string;
  weightG: number;
}

export type RunningShoe = BaseGear & {
  specs: ShoeSpecs;
  category: 'road' | 'trail';
};

export type SportsWatch = BaseGear & {
  specs: WatchSpecs;
  category: 'watch';
};

export type ProductGear = RunningShoe | SportsWatch;

export interface ComparisonMetric {
  id: string;
  label: string;
  betterIs: 'HIGHER' | 'LOWER' | 'NEUTRAL';
  threshold: number; // Significant difference threshold (e.g. 0.1 for 10%)
}

export interface CategoryEngine {
  category: Category;
  metrics: ComparisonMetric[];
  getVerdict: (p1: ProductGear, p2: ProductGear) => string;
}
