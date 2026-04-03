import { UserProfile, UserProfile as UserProfileType } from '../decision-engine/types';
import { Product, RunningShoe, SportsWatch } from '../compare/v2/types';

/**
 * PERSONALIZATION ENGINE
 * Generates scoring modifiers based on a user's specific physiology and style.
 */

export class PersonalizationEngine {
  /**
   * Calculates a personalization modifier (0.8 - 1.2) for a specific product.
   */
  public static calculateModifier(
    product: Product,
    profile: UserProfileType | undefined
  ): number {
    // 2. FALLBACK LOGIC: Neutral modifier for anonymous users
    if (!profile) return 1.0;

    let modifier = 1.0;

    // physiological matching (e.g. Weight vs Cushioning)
    if (product.category === 'road_running' || product.category === 'trail_running') {
      const shoe = product as RunningShoe;

      // Heavy runners need more cushioning
      if (profile.weightKg && profile.weightKg > 85) {
        if (shoe.specs.cushioning > 80) modifier += 0.1;
        if (shoe.specs.cushioning < 40) modifier -= 0.1;
      }

      // Experience-based recommendation
      if (profile.experience === 'beginner') {
        if (shoe.specs.stability > 70) modifier += 0.05;
      }
    }

    // Past behavior matching
    if (profile.pastBehavior.clickedProducts.includes(product.id)) {
      modifier += 0.02; // Slight boost for interest
    }

    return Math.min(1.5, Math.max(0.5, modifier));
  }

  /**
   * Real-time vs Cached Strategy:
   * Modifiers are calculated on-the-fly in the frontend to ensure instant response to profile changes.
   */
  public static personalizeRankings(
    products: Product[],
    profile: UserProfileType | undefined
  ): Record<string, number> {
    const modifiers: Record<string, number> = {};
    products.forEach(p => {
      modifiers[p.id] = this.calculateModifier(p, profile);
    });
    return modifiers;
  }
}
