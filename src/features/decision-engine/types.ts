import { Category } from '../compare/v2/types';

/**
 * 1. BEHAVIOR TRACKING (ANALYTICS)
 */

export type EventType =
  | 'view_product'
  | 'view_decision'
  | 'click_compare'
  | 'click_buy'
  | 'scroll_depth'
  | 'drop_off_point'
  | 'vote_product'
  | 'share_ranking';

export interface AnalyticsEvent {
  id: string;
  type: EventType;
  timestamp: number;
  userId?: string;
  sessionId: string;
  category?: Category;
  productId?: string;
  intentId?: string;
  metadata?: Record<string, unknown>;
}

/**
 * 2. PERSONALIZATION
 */

export interface UserProfile {
  id: string;
  weightKg?: number;
  experience?: 'beginner' | 'intermediate' | 'advanced';
  runningStyle?: 'forefoot' | 'midfoot' | 'heel';
  preferredCushioning?: 'soft' | 'firm' | 'balanced';
  pastBehavior: {
    clickedProducts: string[];
    purchasedCategories: Category[];
    votedProducts: string[];
  };
}

/**
 * 3. ADAPTIVE SCORING
 */

export interface AdaptiveModifiers {
  behaviorScore: number; // CTR, conversions (0-1)
  crowdScore: number;    // popularity, votes (0-1)
  personalizationScore: number; // match with user profile (0-1)
}

/**
 * 4. AI EXPLAINER
 */

export interface AIExplanation {
  productId: string;
  whyForYou: string;    // Personalized: "Because you're an advanced runner..."
  whoNotFor: string;    // Caveat: "Not ideal if you prioritize battery..."
  confidence: number;
}

/**
 * 5. GROWTH LOOP
 */

export interface ProductVote {
  productId: string;
  count: number;
  trendingScore: number;
}

/**
 * 9. EXPERIMENTATION
 */

export interface Experiment {
  id: string;
  name: string;
  variant: 'A' | 'B';
  active: boolean;
  kpis: string[];
}
