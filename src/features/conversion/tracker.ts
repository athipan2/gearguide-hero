import { tracker } from '../analytics/tracker';
import { UserExperimentAssignment } from './types';

/**
 * EXPERIMENT TRACKER
 * Hooks into the main analytics tracker to attribute events to experiments.
 */

export class ConversionTracker {
  /**
   * Tracks an impression for a specific experiment variant.
   */
  public static trackImpression(assignment: UserExperimentAssignment) {
    tracker.track('view_decision', {
      metadata: {
        experiment_id: assignment.experimentId,
        variant_id: assignment.variantId
      }
    });
  }

  /**
   * Tracks a click attributed to an experiment.
   */
  public static trackClick(assignment: UserExperimentAssignment, elementId: string) {
    tracker.track('click_buy', {
      metadata: {
        experiment_id: assignment.experimentId,
        variant_id: assignment.variantId,
        element_id: elementId
      }
    });
  }

  /**
   * Tracks a conversion (sale/revenue).
   */
  public static trackConversion(assignment: UserExperimentAssignment, revenue: number) {
    tracker.track('click_buy', {
      metadata: {
        experiment_id: assignment.experimentId,
        variant_id: assignment.variantId,
        revenue,
        is_conversion: true
      }
    });
  }
}
