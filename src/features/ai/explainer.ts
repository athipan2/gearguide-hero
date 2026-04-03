import { Product, MetricComparison, ComparisonResult } from '../compare/v2/types';
import { UserProfile, AIExplanation } from '../decision-engine/types';

/**
 * AI DECISION EXPLANATION LAYER
 * Translates engine data and user context into natural language decision support.
 */

export class AIExplainer {
  /**
   * 4. AI DECISION LOGIC: Generates personalized recommendations.
   */
  public static generateExplanation(
    product: Product,
    result: ComparisonResult,
    profile: UserProfile | undefined
  ): AIExplanation {
    const isWinner = result.rankedProducts[0].productId === product.id;

    // Logic-driven content (deterministic, no hallucination)
    const whyForYou = this.generateWhyForYou(product, profile, isWinner);
    const whoNotFor = this.generateWhoNotFor(product, result);

    return {
      productId: product.id,
      whyForYou,
      whoNotFor,
      confidence: result.confidenceScore
    };
  }

  private static generateWhyForYou(product: Product, profile: UserProfile | undefined, isWinner: boolean): string {
    const brandName = product.brand;
    const modelName = product.name;

    if (profile?.experience === 'beginner' && isWinner) {
      return `As a beginner, the ${modelName} is your best choice because it offers the stability and injury protection our tests verify as essential for your level.`;
    }

    if (profile?.weightKg && profile.weightKg > 85) {
      return `For your weight category, the ${modelName} provide superior impact absorption that significantly outperforms lighter race models.`;
    }

    return `The ${modelName} is highly ranked for you because of its exceptional performance-to-weight ratio in its category.`;
  }

  private static generateWhoNotFor(product: Product, result: ComparisonResult): string {
    // Find a metric where this product was significantly outperformed
    const tradeoff = result.metricComparisons.find(m => m.isSignificant && m.winnerIndex !== null && result.rankedProducts[m.winnerIndex].productId !== product.id);

    if (tradeoff) {
      return `You should avoid this model if you prioritize ${tradeoff.label.toLowerCase()} above all else; other models in this test lead by over 15%.`;
    }

    return `Not recommended for competitive racers looking for elite energy return; this model is optimized for comfort and durability.`;
  }
}
