import { useMemo } from "react";
import { useReviews } from "@/hooks/useReviews";
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
  specs: unknown;
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
  const { data, isLoading } = useReviews({ published: true });

  const related = useMemo(() => {
    if (!data || !currentReview.slug) return [];

    const currentPrice = parsePrice(currentReview.price);
    const filtered = (data as unknown as RelatedReview[]).filter(r => r.slug !== currentReview.slug);

    const scored = filtered.map((rev) => {
      let score = 0;

      // 1. Same category (+10 points)
      if (rev.category === currentReview.category) {
        score += 10;
      }

      // 2. Rating proximity (up to 10 points)
      const ratingDiff = Math.abs(Number(rev.overall_rating) - currentReview.overall_rating);
      score += Math.max(0, 10 - ratingDiff * 2);

      // 3. Price proximity (up to 10 points)
      const revPrice = parsePrice(rev.price);
      if (currentPrice > 0) {
        const priceDiffRatio = Math.abs(revPrice - currentPrice) / currentPrice;
        score += Math.max(0, 10 - priceDiffRatio * 10);
      } else {
        score += 5;
      }

      return { ...rev, score };
    });

    return scored
      .sort((a, b) => (b.score || 0) - (a.score || 0))
      .slice(0, 3);
  }, [data, currentReview]);

  if (isLoading || related.length === 0) return null;

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
            specs={Array.isArray(rev.specs) ? (rev.specs as { label: string; value: string }[]) : []}
            slug={rev.slug}
            affiliateUrl={rev.affiliate_url}
            createdAt={rev.created_at}
          />
        ))}
      </div>
    </section>
  );
}
