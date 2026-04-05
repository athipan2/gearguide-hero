# Conversion Optimization Engine (V4)

## 1. Architecture Overview

The Conversion Engine is designed to maximize affiliate revenue through data-driven A/B testing and behavioral adaptation. It integrates with the existing Analytics and Personalization layers to create a self-optimizing loop.

### Core Pipeline:
1. **Assignment**: `ExperimentEngine` assigns a user to a variant deterministically via hashing.
2. **Execution**: `useExperiment` hook provides the UI with variant-specific configurations.
3. **Behavioral Adaptation**: `useCTA` hook modifies messaging based on real-time scroll depth and product interactions.
4. **Tracking**: `ConversionTracker` attributes all Buy-intent actions to active experiments.
5. **Evaluation**: `ExperimentEvaluator` calculates the statistical winner based on CTR and Revenue.

## 2. Sample Experiment Configuration

```typescript
const CTA_EXPERIMENT: Experiment = {
  id: 'cta-copy-test-01',
  name: 'Buy CTA Copy Optimization',
  active: true,
  startDate: 1711929600000,
  targetMetric: 'CONVERSION',
  variants: [
    {
      id: 'control',
      label: 'Default',
      weight: 0.5,
      config: { ctaText: 'Buy Now', urgency: false }
    },
    {
      id: 'test-a',
      label: 'Performance Focus',
      weight: 0.5,
      config: { ctaText: 'Get the Performance Edge', urgency: true }
    }
  ]
};
```

## 3. Adaptive CTA Logic (Behavioral Trigger)

The system automatically switches from a "Soft" CTA to an "Aggressive" CTA when:
- **Scroll Depth > 70%**: Indicates high user interest in the content.
- **Products Viewed >= 2**: Indicates the user is actively comparing options.

## 4. Key Metrics Tracked
- **Impressions**: Number of times a decision or product was viewed.
- **Clicks**: Number of affiliate link clicks.
- **Conversions**: Attributed sales/revenue (via postback or tracking).
- **CTR**: Click-Through Rate per variant.
- **RPU**: Revenue Per User.

## 5. Experiment Evaluation Logic
The engine uses a threshold-based evaluation (Min 100 samples) to ensure findings are not due to noise. It sorts variants by Conversion Rate to identify the most effective UI/Copy combinations.
