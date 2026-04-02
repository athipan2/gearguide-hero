import { ComparisonMetric, CategoryEngine, Category } from '../types/gear';

export const ROAD_METRICS: ComparisonMetric[] = [
  { id: 'weightG', label: 'Weight', betterIs: 'LOWER', threshold: 0.1 },
  { id: 'dropMm', label: 'Drop', betterIs: 'NEUTRAL', threshold: 0.2 },
  { id: 'stackHeightMm', label: 'Stack Height', betterIs: 'HIGHER', threshold: 0.1 },
];

export const WATCH_METRICS: ComparisonMetric[] = [
  { id: 'gpsBatteryHrs', label: 'GPS Battery', betterIs: 'HIGHER', threshold: 0.15 },
  { id: 'weightG', label: 'Weight', betterIs: 'LOWER', threshold: 0.1 },
  { id: 'hasMaps', label: 'Full Maps', betterIs: 'HIGHER', threshold: 0.5 },
];

export const Engines: Record<Category, CategoryEngine> = {
  road: {
    category: 'road',
    metrics: ROAD_METRICS,
    getVerdict: (p1, p2) => {
      // Basic heuristic: check if p1 wins more metrics than p2
      const w1 = ROAD_METRICS.filter(m => (p1.specs as any)[m.id] < (p2.specs as any)[m.id] && m.betterIs === 'LOWER').length;
      const w2 = ROAD_METRICS.filter(m => (p2.specs as any)[m.id] < (p1.specs as any)[m.id] && m.betterIs === 'LOWER').length;
      return w1 > w2 ? `${p1.name} wins on performance weight.` : `${p2.name} is the lighter option.`;
    }
  },
  trail: {
    category: 'trail',
    metrics: ROAD_METRICS,
    getVerdict: (p1, p2) => "Comparing Trail Shoes..."
  },
  watch: {
    category: 'watch',
    metrics: WATCH_METRICS,
    getVerdict: (p1, p2) => {
      const b1 = (p1.specs as any).gpsBatteryHrs;
      const b2 = (p2.specs as any).gpsBatteryHrs;
      return b1 > b2 ? `${p1.name} offers superior battery endurance.` : `${p2.name} is more compact but has less battery.`;
    }
  }
};
