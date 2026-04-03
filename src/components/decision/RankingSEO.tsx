import React from 'react';
import { Helmet } from 'react-helmet-async';

interface SEOConfig {
  category: string;
  intent?: string;
  topProductName?: string;
}

/**
 * Dynamic SEO Generator based on Ranking Data.
 * Generates high-intent metadata for search engines.
 */
export const RankingSEO: React.FC<SEOConfig> = ({
  category,
  intent,
  topProductName
}) => {
  const categoryLabel = category.replace('_', ' ');
  const title = intent
    ? `Best ${categoryLabel} for ${intent} 2024 — Verified Rankings`
    : `Top 10 Best ${categoryLabel} of 2024 — Expert Comparison`;

  const description = topProductName
    ? `Compare the best ${categoryLabel}. Our tests show that ${topProductName} is the #1 choice for ${intent || 'performance'}. Read our data-driven review.`
    : `Looking for the best ${categoryLabel}? Compare top models based on weight, battery life, and real-world performance data.`;

  return (
    <Helmet>
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:type" content="article" />
      {/* Dynamic Canonical Link */}
      <link rel="canonical" href={`https://geartrail.com/best/${category}${intent ? `/${intent}` : ''}`} />
    </Helmet>
  );
};
