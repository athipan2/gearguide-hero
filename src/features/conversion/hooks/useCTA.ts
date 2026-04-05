import { useState, useEffect } from 'react';
import { UserIntentState, CTAConfig } from '../types';

/**
 * ADAPTIVE CTA HOOK
 * Dynamically adjusts CTA messaging based on user intent and behavioral triggers.
 */

export const useCTA = (scrollDepth: number, productsViewed: number): CTAConfig => {
  const [config, setConfig] = useState<CTAConfig>({
    text: 'Buy Now',
    urgency: false,
    style: 'soft'
  });

  useEffect(() => {
    // 5. ADAPTIVE CTA LOGIC

    // High Intent: User has explored deeply and scrolled significantly
    if (scrollDepth > 70 && productsViewed >= 2) {
      setConfig({
        text: '🔥 Best Choice for You – Buy Now',
        urgency: true,
        style: 'aggressive'
      });
      return;
    }

    // Comparing: User is looking at multiple options
    if (productsViewed >= 3) {
      setConfig({
        text: 'Top Choice for Your Style',
        urgency: false,
        style: 'primary'
      });
      return;
    }

    // Browsing: Default state
    setConfig({
      text: 'View Deals',
      urgency: false,
      style: 'soft'
    });

  }, [scrollDepth, productsViewed]);

  return config;
};
