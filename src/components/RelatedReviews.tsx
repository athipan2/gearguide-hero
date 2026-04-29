import { useEffect, useState } from "react";
import { dataService } from "@/lib/data-service";
import { ProductCard } from "./ProductCard";
import { cn } from "@/lib/utils";
import { useTranslation } from "@/hooks/useTranslation";
import { translateData, translateArray } from "@/lib/translation-utils";

interface RelatedReview {
  id: string;
  name: string;
  name_en?: string;
  brand: string;
  brand_en?: string;
  category: string;
  category_en?: string;
  price: string;
  image_url: string | null;
  overall_rating: number;
  slug: string;
  pros: unknown;
  pros_en?: unknown;
  cons: unknown;
  cons_en?: unknown;
  specs: unknown;
  ratings: unknown;
  badge: string | null;
  badge_en?: string | null;
  affiliate_url: string | null;
  created_at: string;
  score?: number;
}

interface RelatedReviewsProps {
  currentReview: {
    id?: string;
    category: string;
    overall_rating: number;
    price: string;
    slug?: string;
  };
  isCompact?: boolean;
}

const parsePrice = (priceStr: string): number => {
  if (!priceStr) return 0;
  // Extract numbers and ignore commas
  const match = priceStr.replace(/,/g, '').match(/\d+/);
  return match ? parseInt(match[0], 10) : 0;
};

export function RelatedReviews({ currentReview, isCompact }: RelatedReviewsProps) {
  const [related, setRelated] = useState<RelatedReview[]>([]);
  const [loading, setLoading] = useState(true);
  const { t, language } = useTranslation();

  useEffect(() => {
    const fetchRelated = async () => {
      setLoading(true);
      try {
        const data = await dataService.getReviews({ publishedOnly: true });

        if (data) {
          const currentPrice = parsePrice(currentReview.price);

          // Filter out current review
          const filtered = (data as unknown as RelatedReview[]).filter(r => r.slug !== currentReview.slug);

          const scored = filtered.map((rev) => {
            let score = 0;

            // 1. Same category (+10 points)
            if (rev.category === currentReview.category) {
              score += 10;
            }

            // 2. Rating proximity (up to 10 points)
            // Score = 10 - (diff * 2), min 0
            const ratingDiff = Math.abs(Number(rev.overall_rating) - currentReview.overall_rating);
            score += Math.max(0, 10 - ratingDiff * 2);

            // 3. Price proximity (up to 10 points)
            // Score = 10 - (diff_ratio * 10), min 0
            const revPrice = parsePrice(rev.price);
            if (currentPrice > 0) {
              const priceDiffRatio = Math.abs(revPrice - currentPrice) / currentPrice;
              score += Math.max(0, 10 - priceDiffRatio * 10);
            } else {
              score += 5; // Neutral score if current price is unavailable
            }

            return { ...rev, score };
          });

          // Sort by score descending and take the top 3
          const sorted = scored
            .sort((a, b) => (b.score || 0) - (a.score || 0))
            .slice(0, 3);

          setRelated(sorted as RelatedReview[]);
        }
      } catch (err) {
        console.error("Error fetching related reviews:", err);
      } finally {
        setLoading(false);
      }
    };

    if (currentReview.slug) {
      fetchRelated();
    }
  }, [currentReview]);

  if (loading || related.length === 0) return null;

  return (
    <section className={cn(
      "px-4 border-t border-slate-200",
      isCompact ? "max-w-[800px] mx-auto py-12 md:py-16" : "container mx-auto py-16 md:py-24"
    )}>
      <div className={cn(isCompact ? "mb-8 md:mb-12" : "mb-10 md:mb-16")}>
        <h2 className={cn(
          "font-heading font-semibold text-primary tracking-tighter uppercase flex items-center gap-3",
          isCompact ? "text-xl md:text-2xl" : "text-2xl md:text-4xl"
        )}>
          <span className={cn("bg-accent rounded-full", isCompact ? "h-6 md:h-8 w-1.5" : "h-8 md:h-10 w-1.5")} />
          {t('common.related_reviews')}
        </h2>
        <p className={cn("text-muted-foreground mt-2 font-medium", isCompact ? "text-xs md:text-base" : "text-sm md:text-lg")}>
          {t('related.subtitle')}
        </p>
      </div>
      <div className={cn(
        "grid grid-cols-1 sm:grid-cols-2 gap-6 md:gap-8",
        !isCompact && "lg:grid-cols-3"
      )}>
        {related.map((rev) => (
          <ProductCard
            key={rev.id}
            name={translateData(rev as unknown as Record<string, unknown>, 'name', language)}
            brand={translateData(rev as unknown as Record<string, unknown>, 'brand', language)}
            image={rev.image_url || ""}
            rating={Number(rev.overall_rating)}
            price={rev.price}
            badge={translateData(rev as unknown as Record<string, unknown>, 'badge', language) || undefined}
            pros={translateArray(rev as unknown as Record<string, unknown>, 'pros', language)}
            cons={translateArray(rev as unknown as Record<string, unknown>, 'cons', language)}
            specs={Array.isArray(rev.specs) ? (rev.specs as { label: string; value: string }[]) : []}
            ratings={Array.isArray(rev.ratings) ? (rev.ratings as { label: string; score: number }[]) : []}
            slug={rev.slug}
            affiliateUrl={rev.affiliate_url}
            createdAt={rev.created_at}
          />
        ))}
      </div>
    </section>
  );
}
