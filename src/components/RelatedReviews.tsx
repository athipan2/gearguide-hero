import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { ProductCard } from "./ProductCard";

interface RelatedReview {
  id: string;
  name: string;
  brand: string;
  category: string;
  price: string;
  image_url: string | null;
  overall_rating: number;
  slug: string;
  pros: unknown;
  cons: unknown;
  badge: string | null;
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
}

const parsePrice = (priceStr: string): number => {
  if (!priceStr) return 0;
  // Extract numbers and ignore commas
  const match = priceStr.replace(/,/g, '').match(/\d+/);
  return match ? parseInt(match[0], 10) : 0;
};

export function RelatedReviews({ currentReview }: RelatedReviewsProps) {
  const [related, setRelated] = useState<RelatedReview[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRelated = async () => {
      setLoading(true);
      try {
        const { data, error } = await supabase
          .from("reviews")
          .select("*")
          .eq("published", true)
          .neq("slug", currentReview.slug || "");

        if (error) throw error;

        if (data) {
          const currentPrice = parsePrice(currentReview.price);

          const scored = (data as RelatedReview[]).map((rev) => {
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
    <section className="container mx-auto px-4 py-16 border-t">
      <div className="mb-8">
        <h2 className="font-heading text-3xl font-black text-primary tracking-tighter uppercase">รีวิวที่เกี่ยวข้อง</h2>
        <p className="text-muted-foreground mt-1">สินค้าที่คุณอาจจะสนใจตามความใกล้เคียงของสเปคและราคา</p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {related.map((rev) => (
          <ProductCard
            key={rev.id}
            name={rev.name}
            brand={rev.brand}
            image={rev.image_url || ""}
            rating={Number(rev.overall_rating)}
            price={rev.price}
            badge={rev.badge || undefined}
            pros={Array.isArray(rev.pros) ? (rev.pros as string[]) : []}
            cons={Array.isArray(rev.cons) ? (rev.cons as string[]) : []}
            slug={rev.slug}
            affiliateUrl={rev.affiliate_url}
            createdAt={rev.created_at}
          />
        ))}
      </div>
    </section>
  );
}
