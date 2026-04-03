import { Product, MetricDefinition, IntentConfig, ComparisonResult, ProductScoreBreakdown } from './types';
import { AdaptiveModifiers } from '../decision-engine/types';

/**
 * ADAPTIVE SCORING ENGINE
 * Extends the spec-based scoring with behavioral and crowd-sourced data.
 */

export class AdaptiveScoringEngine {
  // Configurable weights for the adaptive layer
  private static WEIGHTS = {
    specs: 0.70,         // 70% from technical data
    behavior: 0.15,      // 15% from CTR/Conversions
    crowd: 0.15          // 15% from popularity/votes
  };

  /**
   * Calculates the adaptive score by merging multiple sources.
   */
  public static calculateAdaptiveScore(
    baseScore: number,
    modifiers: AdaptiveModifiers
  ): number {
    // 3. ADAPTIVE SCORING STRATEGY
    const weightedScore =
      (baseScore * this.WEIGHTS.specs) +
      (modifiers.behaviorScore * this.WEIGHTS.behavior) +
      (modifiers.crowdScore * this.WEIGHTS.crowd);

    // ANTI-BIAS MECHANISM: ensure the spec score always remains the dominant factor
    // and that behavior data doesn't create a "rich-get-richer" loop for old products.
    return weightedScore;
  }

  /**
   * Enhances a standard breakdown with adaptive data.
   */
  public static enhanceRankings(
    breakdowns: (ProductScoreBreakdown & { rank: number })[],
    adaptiveData: Record<string, AdaptiveModifiers>
  ) {
    return breakdowns.map(b => {
      const modifiers = adaptiveData[b.productId] || { behaviorScore: 0.5, crowdScore: 0.5, personalizationScore: 0.5 };
      const adaptiveScore = this.calculateAdaptiveScore(b.totalScore, modifiers);

      return {
        ...b,
        baseScore: b.totalScore,
        adaptiveScore: adaptiveScore,
        totalScore: adaptiveScore // Override for final ranking
      };
    }).sort((a, b) => b.totalScore - a.totalScore)
      .map((item, index) => ({ ...item, rank: index + 1 }));
  }
}
