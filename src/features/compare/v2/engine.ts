import {
  Product,
  MetricDefinition,
  BetterIs,
  IntentConfig,
  ComparisonResult,
  MetricComparison,
  ComparisonInsight,
  ProductScoreBreakdown
} from './types';

/**
 * SMART COMPARISON ENGINE V2 - CORE IMPLEMENTATION
 *
 * A deterministic, weighted, and explainable decision system for product comparisons.
 */
export class SmartComparisonEngine {
  /**
   * 1. NORMALIZATION LAYER
   * Ensures all metric values are on a 0-1 scale, where 1 is always BETTER.
   */
  public static normalize(value: number, min: number, max: number, betterIs: BetterIs): number {
    if (min === max) return 1.0;
    const clampedValue = Math.max(min, Math.min(max, value));
    const rawNormalized = (clampedValue - min) / (max - min);
    return betterIs === 'HIGHER' ? rawNormalized : 1.0 - rawNormalized;
  }

  /**
   * 2. WEIGHTED SCORING SYSTEM
   * Calculates score for a single product.
   */
  public static calculateScore(
    product: Product,
    metrics: MetricDefinition[],
    intent: IntentConfig | undefined,
    minMaxMap: Record<string, { min: number; max: number }>
  ): ProductScoreBreakdown {
    let totalScore = 0;
    const metricScores: Record<string, number> = {};

    metrics.forEach(m => {
      const productSpecs = product.specs as Record<string, unknown>;
      const value = productSpecs[m.id];
      if (typeof value !== 'number') {
        metricScores[m.id] = 0;
        return;
      }

      const { min, max } = minMaxMap[m.id];
      const normalizedValue = this.normalize(value, min, max, m.betterIs);
      const importance = intent?.importanceOverrides[m.id] ?? m.defaultImportance;

      const weightedValue = normalizedValue * importance;
      metricScores[m.id] = weightedValue;
      totalScore += weightedValue;
    });

    return { productId: product.id, totalScore, metricScores };
  }

  /**
   * 3. MULTI-PRODUCT RANKING ENGINE
   */
  public static rankProducts(
    products: Product[],
    metrics: MetricDefinition[],
    intent: IntentConfig | undefined
  ): (ProductScoreBreakdown & { rank: number })[] {
    const minMaxMap = this.getMinMaxMap(products, metrics);
    const breakdowns = products.map(p => this.calculateScore(p, metrics, intent, minMaxMap));

    return [...breakdowns]
      .sort((a, b) => b.totalScore - a.totalScore)
      .map((b, index) => ({
        ...b,
        rank: index + 1
      }));
  }

  /**
   * 5. METRIC COMPARISON ENGINE
   */
  public static compareMetrics(
    products: Product[],
    metrics: MetricDefinition[]
  ): MetricComparison[] {
    const minMaxMap = this.getMinMaxMap(products, metrics);

    return metrics.map(m => {
      const values = products.map(p => (p.specs as Record<string, unknown>)[m.id] as number);
      const { min, max } = minMaxMap[m.id];

      // Calculate Normalized values for ranking/display
      const normalizedValues = values.map(v =>
        typeof v === 'number' ? this.normalize(v, min, max, m.betterIs) : 0
      );

      // SIGNIFICANCE DETECTION (Threshold %)
      // Detected based on RAW relative difference to avoid normalization-range bias
      const rawMax = Math.max(...values.filter(v => typeof v === 'number'));
      const rawMin = Math.min(...values.filter(v => typeof v === 'number'));
      const rawRelDiff = rawMax !== 0 ? (rawMax - rawMin) / rawMax : 0;
      const isSignificant = rawRelDiff >= m.thresholdPercent;

      const maxNorm = Math.max(...normalizedValues);
      const winnerIndex = normalizedValues.every(v => v === normalizedValues[0]) ? null : normalizedValues.indexOf(maxNorm);

      return {
        metricId: m.id,
        label: m.label,
        values,
        normalizedValues,
        winnerIndex,
        isSignificant
      };
    });
  }

  /**
   * 6. AGGREGATE VERDICT ENGINE
   */
  public static generateVerdict(
    products: Product[],
    ranks: { productId: string; totalScore: number }[],
    comparisons: MetricComparison[],
    metrics: MetricDefinition[],
    intent: IntentConfig | undefined
  ): string {
    if (products.length === 0) return "No products found.";
    const top = products.find(p => p.id === ranks[0].productId)!;
    const winnerIdx = products.findIndex(p => p.id === top.id);
    if (products.length === 1) return `Summary for ${top.name}.`;

    const intentStr = intent ? ` for ${intent.label.toLowerCase()}` : '';
    const runnerUp = products.find(p => p.id === ranks[1].productId)!;
    const gap = (ranks[0].totalScore - ranks[1].totalScore) / (ranks[0].totalScore || 1);

    if (gap < 0.05) {
      return `It's a close match between ${top.name} and ${runnerUp.name}${intentStr}. ${top.name} slightly leads on aggregate specs, but both are elite choices.`;
    }

    // Significant winner - prioritize high importance metrics
    const bestMetric = comparisons
      .filter(c => c.winnerIndex === winnerIdx && c.isSignificant)
      .sort((a, b) => {
        const impA = intent?.importanceOverrides[a.metricId] ?? metrics.find(m => m.id === a.metricId)?.defaultImportance ?? 0;
        const impB = intent?.importanceOverrides[b.metricId] ?? metrics.find(m => m.id === b.metricId)?.defaultImportance ?? 0;
        return impB - impA;
      })[0];

    return `${top.name} is the clear winner${intentStr}, primarily due to its superior ${bestMetric?.label.toLowerCase() || 'overall performance profile'}.`;
  }

  /**
   * 7. EXPLAINABILITY LAYER
   */
  public static generateInsights(
    products: Product[],
    comparisons: MetricComparison[],
    ranks: { productId: string; totalScore: number }[]
  ): ComparisonInsight[] {
    const insights: ComparisonInsight[] = [];
    const winnerId = ranks[0].productId;
    const winnerIdx = products.findIndex(p => p.id === winnerId);

    comparisons.forEach(c => {
      if (c.isSignificant) {
        if (c.winnerIndex === winnerIdx) {
          insights.push({
            type: 'advantage',
            productId: winnerId,
            metricLabel: c.label,
            message: `${products[winnerIdx].name} has a significant advantage in ${c.label.toLowerCase()}.`
          });
        } else if (c.winnerIndex !== null) {
          insights.push({
            type: 'tradeoff',
            productId: winnerId,
            metricLabel: c.label,
            message: `${products[winnerIdx].name} is outperformed in ${c.label.toLowerCase()} by ${products[c.winnerIndex].name}.`
          });
        }
      }
    });

    return insights;
  }

  /**
   * MAIN COMPARISON PIPELINE
   */
  public static compare(
    products: Product[],
    metrics: MetricDefinition[],
    intent: IntentConfig | undefined
  ): ComparisonResult {
    const ranks = this.rankProducts(products, metrics, intent);
    const comparisons = this.compareMetrics(products, metrics);
    const insights = this.generateInsights(products, comparisons, ranks);
    const verdict = this.generateVerdict(products, ranks, comparisons, metrics, intent);

    return {
      rankedProducts: ranks.map(r => ({
        productId: r.productId,
        score: r.totalScore,
        rank: r.rank,
        metricScores: r.metricScores
      })),
      metricComparisons: comparisons,
      insights,
      verdict,
      confidenceScore: this.calculateConfidence(products, metrics)
    };
  }

  private static getMinMaxMap(products: Product[], metrics: MetricDefinition[]): Record<string, { min: number; max: number }> {
    const map: Record<string, { min: number; max: number }> = {};
    metrics.forEach(m => {
      const values = products.map(p => (p.specs as Record<string, unknown>)[m.id]).filter(v => typeof v === 'number') as number[];
      map[m.id] = values.length > 1
        ? { min: Math.min(...values), max: Math.max(...values) }
        : { min: 0, max: values[0] || 1 };
    });
    return map;
  }

  private static calculateConfidence(products: Product[], metrics: MetricDefinition[]): number {
    const total = products.length * metrics.length;
    if (total === 0) return 0;
    let actual = 0;
    products.forEach(p => metrics.forEach(m => { if (typeof (p.specs as Record<string, unknown>)[m.id] === 'number') actual++; }));
    return actual / total;
  }
}
