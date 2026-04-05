import { useMemo } from 'react';
import { Experiment, UserExperimentAssignment } from '../types';
import { ExperimentEngine } from '../experiment';

/**
 * EXPERIMENT HOOK
 * Provides the assigned variant and config for a given experiment.
 */

export const useExperiment = (userId: string, experiment: Experiment) => {
  const assignment: UserExperimentAssignment = useMemo(() => {
    if (!experiment.active) {
      return {
        experimentId: experiment.id,
        variantId: 'control',
        assignedAt: Date.now()
      };
    }
    return ExperimentEngine.getAssignment(userId, experiment);
  }, [userId, experiment]);

  const variantConfig = useMemo(() => {
    const variant = experiment.variants.find(v => v.id === assignment.variantId);
    return variant?.config || experiment.variants[0].config;
  }, [assignment, experiment]);

  return {
    assignment,
    config: variantConfig,
    isTest: assignment.variantId !== 'control'
  };
};
