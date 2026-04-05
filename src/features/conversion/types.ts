/**
 * CONVERSION OPTIMIZATION ENGINE TYPES
 */

export type TargetMetric = 'CTR' | 'CONVERSION' | 'REVENUE';

export interface VariantConfig {
  ctaText?: string;
  ctaColor?: string;
  layout?: 'compact' | 'expanded';
  showUrgency?: boolean;
  rankingAlgorithm?: string;
  [key: string]: unknown;
}

export interface ExperimentVariant {
  id: string; // 'control' | 'test-a' | 'test-b'
  label: string;
  weight: number; // 0-1 (traffic split)
  config: VariantConfig;
}

export interface Experiment {
  id: string;
  name: string;
  active: boolean;
  startDate: number;
  endDate?: number;
  targetMetric: TargetMetric;
  variants: ExperimentVariant[];
}

export interface UserExperimentAssignment {
  experimentId: string;
  variantId: string;
  assignedAt: number;
}

/**
 * METRICS TRACKING
 */

export interface VariantMetrics {
  variantId: string;
  impressions: number;
  clicks: number;
  conversions: number;
  revenue: number;
}

export interface ExperimentStats {
  experimentId: string;
  metrics: VariantMetrics[];
  winningVariantId?: string;
  confidence: number;
}

/**
 * ADAPTIVE CTA
 */

export type UserIntentState = 'browsing' | 'comparing' | 'high-intent';

export interface CTAConfig {
  text: string;
  urgency: boolean;
  style: 'primary' | 'aggressive' | 'soft';
}
