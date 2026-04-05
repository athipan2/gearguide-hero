/**
 * CORE TYPE DEFINITIONS FOR SMART COMPARISON ENGINE V2
 */

export type Category = 'road_running' | 'trail_running' | 'sports_watch';

export interface BaseProduct {
  id: string;
  name: string;
  brand: string;
  category: Category;
  price: number;
  imageUrl?: string;
  specs: Record<string, number | string | boolean>;
}

export interface RunningShoe extends BaseProduct {
  category: 'road_running' | 'trail_running';
  specs: {
    weightG: number;
    dropMm: number;
    stackHeightMm: number;
    energyReturn: number; // 0-100 score
    cushioning: number; // 0-100 score
    stability: number; // 0-100 score
    traction: number; // 0-100 score
  };
}

export interface SportsWatch extends BaseProduct {
  category: 'sports_watch';
  specs: {
    gpsBatteryHrs: number;
    weightG: number;
    hrAccuracy: number; // 0-100 score
    hasMaps: boolean;
    hasMusic: boolean;
    screenType: 'AMOLED' | 'MIP' | 'LCD'; // Categorical will be handled by importance/logic
  };
}

export type Product = RunningShoe | SportsWatch;

/**
 * METRIC DEFINITIONS
 */

export type BetterIs = 'HIGHER' | 'LOWER';

export interface MetricDefinition {
  id: string;
  label: string;
  betterIs: BetterIs;
  defaultImportance: number; // 0-1
  thresholdPercent: number; // For significance detection (e.g. 0.05 for 5%)
}

/**
 * INTENT & CONTEXT
 */

export interface IntentConfig {
  id: string;
  label: string;
  importanceOverrides: Record<string, number>;
}

export interface ComparisonContext {
  intentId?: string;
  userProfile?: {
    weightKg?: number;
    experience?: 'beginner' | 'intermediate' | 'advanced';
  };
}

/**
 * RESULTS
 */

export interface MetricComparison {
  metricId: string;
  label: string;
  values: number[]; // Parallel to input products
  normalizedValues: number[];
  winnerIndex: number | null; // Index in input array, null if DRAW
  isSignificant: boolean;
}

export interface ProductScoreBreakdown {
  productId: string;
  totalScore: number;
  metricScores: Record<string, number>; // normalizedValue * importance
}

export interface ComparisonInsight {
  type: 'advantage' | 'tradeoff';
  productId: string;
  metricLabel: string;
  message: string;
}

export interface ComparisonResult {
  rankedProducts: {
    productId: string;
    score: number;
    rank: number;
    metricScores: Record<string, number>;
  }[];
  metricComparisons: MetricComparison[];
  insights: ComparisonInsight[];
  verdict: string;
  confidenceScore: number;
}
