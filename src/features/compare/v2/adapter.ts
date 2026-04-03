import { ComparisonResult, Product } from './types';

/**
 * ADAPTER FUNCTIONS: Engine Output -> UI Props
 *
 * These functions bridge the gap between the algorithmic engine
 * and the presentation components.
 */

export const EngineAdapter = {
  /**
   * Maps engine result to DecisionHero props.
   */
  toDecisionHero(result: ComparisonResult, products: Product[]) {
    const winner = result.rankedProducts[0];
    const product = products.find(p => p.id === winner.productId)!;

    return {
      productName: product.name,
      brand: product.brand,
      imageUrl: product.imageUrl,
      score: winner.score,
      verdict: result.verdict,
      price: `฿${product.price.toLocaleString()}`,
      affiliateUrl: (product as unknown as Record<string, unknown>).affiliateUrl as string | undefined,
    };
  },

  /**
   * Maps engine result to InsightCard props array.
   */
  toInsightCards(result: ComparisonResult) {
    return result.insights.map(insight => ({
      type: insight.type,
      metricLabel: insight.metricLabel,
      message: insight.message
    }));
  },

  /**
   * Maps engine result to CompareSnapshot props.
   */
  toCompareSnapshot(result: ComparisonResult, products: Product[]) {
    if (products.length < 2) return null;

    const p1 = products[0];
    const p2 = products[1];

    const metrics = result.metricComparisons.map(m => ({
      label: m.label,
      p1Value: m.values[0],
      p2Value: m.values[1],
      winner: m.winnerIndex === 0 ? 1 : m.winnerIndex === 1 ? 2 : null as (1 | 2 | null)
    }));

    return {
      product1Name: p1.name,
      product2Name: p2.name,
      metrics
    };
  }
};
