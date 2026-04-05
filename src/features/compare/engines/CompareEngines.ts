import { ComparisonMetric, CategoryEngine, Category, ProductGear } from '../../../types/gear';

export const ROAD_METRICS: ComparisonMetric[] = [
  { id: 'weightG', label: 'Weight', betterIs: 'LOWER', threshold: 0.1 },
  { id: 'energyReturn', label: 'Energy Return', betterIs: 'HIGHER', threshold: 0.05 },
  { id: 'stackHeightMm', label: 'Stack Height', betterIs: 'HIGHER', threshold: 0.1 },
  { id: 'price', label: 'Price', betterIs: 'LOWER', threshold: 0.15 },
];

export const WATCH_METRICS: ComparisonMetric[] = [
  { id: 'gpsBatteryHrs', label: 'GPS Battery', betterIs: 'HIGHER', threshold: 0.15 },
  { id: 'weightG', label: 'Weight', betterIs: 'LOWER', threshold: 0.1 },
  { id: 'hasMaps', label: 'Full Maps', betterIs: 'HIGHER', threshold: 0.5 },
  { id: 'hrAccuracy', label: 'HR Accuracy', betterIs: 'HIGHER', threshold: 0.05 },
];

/**
 * Core "Smart" comparison logic.
 * Determines a balanced verdict based on metric wins and significant differences.
 */
function calculateSmartVerdict(p1: ProductGear, p2: ProductGear, metrics: ComparisonMetric[]): string {
  let p1Wins = 0;
  let p2Wins = 0;
  const p1Significant: string[] = [];
  const p2Significant: string[] = [];

  metrics.forEach(m => {
    const gear1 = p1 as unknown as Record<string, unknown>;
    const gear2 = p2 as unknown as Record<string, unknown>;
    const specs1 = (p1.specs || {}) as unknown as Record<string, unknown>;
    const specs2 = (p2.specs || {}) as unknown as Record<string, unknown>;

    const v1 = (gear1[m.id] ?? specs1[m.id]) as number | undefined;
    const v2 = (gear2[m.id] ?? specs2[m.id]) as number | undefined;

    if (v1 === undefined || v2 === undefined) return;

    const diff = Math.abs(v1 - v2);
    const avg = (v1 + v2) / 2;
    const relDiff = avg !== 0 ? diff / avg : 0;
    const isSignificant = relDiff >= m.threshold;

    if (m.betterIs === 'LOWER') {
      if (v1 < v2) {
        p1Wins++;
        if (isSignificant) p1Significant.push(m.label);
      } else if (v2 < v1) {
        p2Wins++;
        if (isSignificant) p2Significant.push(m.label);
      }
    } else if (m.betterIs === 'HIGHER') {
      if (v1 > v2) {
        p1Wins++;
        if (isSignificant) p1Significant.push(m.label);
      } else if (v2 > v1) {
        p2Wins++;
        if (isSignificant) p2Significant.push(m.label);
      }
    }
  });

  // Case 1: p1 has clear significant advantages
  if (p1Significant.length > 0 && p2Significant.length === 0) {
    return `${p1.name} has a clear edge in ${p1Significant.join(' and ')}.`;
  }

  // Case 2: p2 has clear significant advantages
  if (p2Significant.length > 0 && p1Significant.length === 0) {
    return `${p2.name} is the superior choice for ${p2Significant.join(' and ')}.`;
  }

  // Case 3: Both have significant but different advantages (The "Nuanced" Verdict)
  if (p1Significant.length > 0 && p2Significant.length > 0) {
    return `${p1.name} wins on ${p1Significant[0]}, but ${p2.name} is better for ${p2Significant[0]}.`;
  }

  // Case 4: No significant differences, fallback to simple win count
  if (p1Wins > p2Wins) return `${p1.name} is slightly more competitive across more metrics.`;
  if (p2Wins > p1Wins) return `${p2.name} offers a better overall balance for these specs.`;

  return "Both options are highly competitive with nearly identical performance profiles.";
}

export const Engines: Record<Category, CategoryEngine> = {
  road: {
    category: 'road',
    metrics: ROAD_METRICS,
    getVerdict: (p1, p2) => calculateSmartVerdict(p1, p2, ROAD_METRICS)
  },
  trail: {
    category: 'trail',
    metrics: ROAD_METRICS, // Placeholder
    getVerdict: (p1, p2) => calculateSmartVerdict(p1, p2, ROAD_METRICS)
  },
  watch: {
    category: 'watch',
    metrics: WATCH_METRICS,
    getVerdict: (p1, p2) => calculateSmartVerdict(p1, p2, WATCH_METRICS)
  }
};
