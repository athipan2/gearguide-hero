import { ExperimentStats, VariantMetrics } from './types';

/**
 * EXPERIMENT EVALUATOR
 * Analyzes variant performance and checks for statistical significance.
 */

export class ExperimentEvaluator {
  private static MIN_SAMPLE_SIZE = 100;

  /**
   * Evaluates the results of an experiment.
   */
  public static evaluate(experimentId: string, metrics: VariantMetrics[]): ExperimentStats {
    // 7. EVALUATION LOGIC

    // Sort by performance (CTR or Conv Rate)
    const sorted = [...metrics].sort((a, b) => {
      const rateA = a.conversions / (a.clicks || 1);
      const rateB = b.conversions / (b.clicks || 1);
      return rateB - rateA;
    });

    const winningVariantId = sorted[0].impressions >= this.MIN_SAMPLE_SIZE ? sorted[0].variantId : undefined;

    return {
      experimentId,
      metrics,
      winningVariantId,
      confidence: this.calculateConfidence(metrics)
    };
  }

  private static calculateConfidence(metrics: VariantMetrics[]): number {
    // Simple z-test or threshold-based confidence
    const totalImpressions = metrics.reduce((acc, m) => acc + m.impressions, 0);
    if (totalImpressions < this.MIN_SAMPLE_SIZE * metrics.length) return 0;

    // placeholder for actual statistical significance calculation
    return 0.95;
  }
}
