import { ProductVote } from '../decision-engine/types';
import { Category } from '../compare/v2/types';

/**
 * GROWTH LOOP ENGINE
 * Manages voting, popularity tracking, and social proof.
 */

export class GrowthEngine {
  /**
   * 5. GROWTH LOOP: deterministic ranking IDs for shareability.
   */
  public static generateRankingId(category: Category, productIds: string[], intentId?: string): string {
    const sortedIds = [...productIds].sort().join(':');
    const base = `${category}:${sortedIds}${intentId ? `:${intentId}` : ''}`;
    // In production, use a hash or base64 to shorten
    return btoa(base);
  }

  /**
   * Anti-spam logic: in production this would verify tokens or rate-limit IPs.
   */
  public static processVote(productId: string, userId?: string): boolean {
    // Logic for incrementing crowd score
    console.log(`[Growth] Vote recorded for product ${productId} by user ${userId || 'anon'}`);
    return true;
  }

  /**
   * 6. DATA MOAT: Lifespan Tracking & proprietary data
   */
  public static getPopularityScore(productId: string, voteData: ProductVote[]): number {
    const data = voteData.find(v => v.productId === productId);
    if (!data) return 0.5; // neutral starting point

    // Exponential decay formula can be used here for trending products
    return Math.min(1.0, data.trendingScore);
  }
}
