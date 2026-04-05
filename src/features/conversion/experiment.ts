import { Experiment, ExperimentVariant, UserExperimentAssignment } from './types';

/**
 * LIGHTWEIGHT EXPERIMENT ENGINE
 * Features: Deterministic assignment, No-latency evaluation, Caching.
 */

export class ExperimentEngine {
  private static STORAGE_KEY = 'gearguide_experiments';

  /**
   * Assigns a variant to a user deterministically using their session/user ID.
   */
  public static getAssignment(
    userId: string,
    experiment: Experiment
  ): UserExperimentAssignment {
    // 1. Check existing assignment in cache
    const existing = this.getStoredAssignments();
    if (existing[experiment.id]) {
      return existing[experiment.id];
    }

    // 2. Deterministic hashing for assignment
    const variant = this.assignVariant(userId, experiment);
    const assignment: UserExperimentAssignment = {
      experimentId: experiment.id,
      variantId: variant.id,
      assignedAt: Date.now()
    };

    // 3. Persist assignment
    this.storeAssignment(assignment);
    return assignment;
  }

  private static assignVariant(userId: string, experiment: Experiment): ExperimentVariant {
    // Simple hash-based assignment
    let hash = 0;
    for (let i = 0; i < userId.length; i++) {
      hash = (hash << 5) - hash + userId.charCodeAt(i);
      hash |= 0; // Convert to 32bit integer
    }

    const normalizedHash = Math.abs(hash) % 100;
    let cumulativeWeight = 0;

    for (const variant of experiment.variants) {
      cumulativeWeight += variant.weight * 100;
      if (normalizedHash < cumulativeWeight) {
        return variant;
      }
    }

    return experiment.variants[0]; // Fallback to control
  }

  private static getStoredAssignments(): Record<string, UserExperimentAssignment> {
    try {
      const stored = localStorage.getItem(this.STORAGE_KEY);
      return stored ? JSON.parse(stored) : {};
    } catch {
      return {};
    }
  }

  private static storeAssignment(assignment: UserExperimentAssignment) {
    const existing = this.getStoredAssignments();
    existing[assignment.experimentId] = assignment;
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(existing));
  }
}
