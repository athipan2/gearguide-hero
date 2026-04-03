import { MetricDefinition, IntentConfig, Category } from './types';

/**
 * 2. ENGINE CONFIGURATION - RUNNING SHOES
 */

export const RUNNING_SHOE_METRICS: MetricDefinition[] = [
  { id: 'weightG', label: 'Weight', betterIs: 'LOWER', defaultImportance: 0.8, thresholdPercent: 0.1 },
  { id: 'stackHeightMm', label: 'Stack Height', betterIs: 'HIGHER', defaultImportance: 0.6, thresholdPercent: 0.05 },
  { id: 'energyReturn', label: 'Energy Return', betterIs: 'HIGHER', defaultImportance: 0.9, thresholdPercent: 0.05 },
  { id: 'cushioning', label: 'Cushioning', betterIs: 'HIGHER', defaultImportance: 0.7, thresholdPercent: 0.1 },
  { id: 'traction', label: 'Traction', betterIs: 'HIGHER', defaultImportance: 0.5, thresholdPercent: 0.1 }
];

export const RUNNING_SHOE_INTENTS: IntentConfig[] = [
  {
    id: 'race',
    label: 'Marathon Race',
    importanceOverrides: {
      weightG: 1.0,
      energyReturn: 1.0,
      cushioning: 0.5,
      traction: 0.3
    }
  },
  {
    id: 'daily',
    label: 'Daily Training',
    importanceOverrides: {
      weightG: 0.4,
      energyReturn: 0.5,
      cushioning: 1.0,
      traction: 0.6
    }
  },
  {
    id: 'ultra',
    label: 'Ultra Trail',
    importanceOverrides: {
      traction: 1.0,
      cushioning: 1.0,
      weightG: 0.5,
      stackHeightMm: 0.8
    }
  }
];

/**
 * 2. ENGINE CONFIGURATION - SPORTS WATCHES
 */

export const SPORTS_WATCH_METRICS: MetricDefinition[] = [
  { id: 'gpsBatteryHrs', label: 'GPS Battery', betterIs: 'HIGHER', defaultImportance: 1.0, thresholdPercent: 0.15 },
  { id: 'weightG', label: 'Weight', betterIs: 'LOWER', defaultImportance: 0.5, thresholdPercent: 0.1 },
  { id: 'hrAccuracy', label: 'HR Accuracy', betterIs: 'HIGHER', defaultImportance: 0.9, thresholdPercent: 0.05 }
];

export const SPORTS_WATCH_INTENTS: IntentConfig[] = [
  {
    id: 'ultramarathon',
    label: 'Ultramarathon',
    importanceOverrides: {
      gpsBatteryHrs: 1.2, // Boosted importance
      weightG: 0.3
    }
  },
  {
    id: 'triathlon',
    label: 'Triathlon',
    importanceOverrides: {
      hrAccuracy: 1.0,
      gpsBatteryHrs: 0.8
    }
  }
];

export const CATEGORY_CONFIGS: Record<Category, { metrics: MetricDefinition[]; intents: IntentConfig[] }> = {
  road_running: { metrics: RUNNING_SHOE_METRICS, intents: RUNNING_SHOE_INTENTS },
  trail_running: { metrics: RUNNING_SHOE_METRICS, intents: RUNNING_SHOE_INTENTS },
  sports_watch: { metrics: SPORTS_WATCH_METRICS, intents: SPORTS_WATCH_INTENTS }
};
