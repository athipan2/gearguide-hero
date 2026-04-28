import { useEffect, useState, useMemo } from "react";
import { ProductCard } from "@/components/ProductCard";
import { dataService } from "@/lib/data-service";
import { FastFilters } from "./FastFilters";
import { Link } from "react-router-dom";
import { ProductCardSkeleton } from "./ReviewSkeleton";
import { getOptimizedImageUrl } from "@/lib/utils";
import { useTranslation } from "@/hooks/useTranslation";
import { translateData, translateArray } from "@/lib/translation-utils";

const fallbackProducts = [
  {
    name: "Nike Vaporfly 3", brand: "Nike",
    image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&h=450&fit=crop",
    rating: 4.8, price: "฿8,500", badge: "Top Pick",
    pros: ["เบามาก", "แรงคืนตัวดี"], cons: ["ราคาสูง", "ทนทานปานกลาง"],
    slug: "nike-vaporfly-3",
  },
  {
    name: "Salomon Speedcross 6", brand: "Salomon",
    image: "https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=600&h=450&fit=crop",
    rating: 4.6, price: "฿5,900", badge: "แนะนำ",
    pros: ["เกาะถนนดี", "กันน้ำ"], cons: ["แข็งนิดหน่อย", "หนักกว่ารุ่นอื่น"],
    slug: "salomon-speedcross-6",
  },
  {
    name: "Naturehike Cloud Up 2", brand: "Naturehike",
    image: "https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?w=600&h=450&fit=crop",
    rating: 4.5, price: "฿3,200", badge: "คุ้มค่าที่สุด",
    pros: ["น้ำหนักเบา", "ราคาดี"], cons: ["ทนฝนปานกลาง", "พื้นที่จำกัด"],
  },
  {
    name: "Garmin Forerunner 265", brand: "Garmin",
    image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&h=450&fit=crop",
    rating: 4.7, price: "฿14,900", badge: "แนะนำ",
    pros: ["AMOLED สวย", "แบตอึด"], cons: ["แพง", "ขนาดใหญ่"],
  },
];

interface ReviewData {
  name: string;
  name_en?: string | null;
  brand: string;
  brand_en?: string | null;
  image_url: string | null;
  overall_rating: number;
  price: string;
  badge: string | null;
  badge_en?: string | null;
  pros: unknown;
  pros_en?: unknown;
  cons: unknown;
  cons_en?: unknown;
  specs: unknown;
  ratings: unknown;
  slug: string;
  affiliate_url: string | null;
  created_at: string;
  verdict?: string | null;
  verdict_en?: string | null;
}

interface MappedProduct {
  name: string;
  brand: string;
  image: string;
  rating: number;
  price: string;
  badge?: string;
  pros: string[];
  cons: string[];
  specs: { label: string; value: string }[];
  ratings?: { label: string; score: number }[];
  slug: string;
  affiliateUrl?: string;
  createdAt?: string;
  verdict?: string;
}

export function FeaturedReviews() {
  const [rawReviews, setRawReviews] = useState<ReviewData[]>([]);
  const [loading, setLoading] = useState(true);
  const { t, language } = useTranslation();

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const data = await dataService.getReviews();
        setRawReviews((data as unknown as ReviewData[]) || []);
      } catch (error) {
        console.error("Error fetching reviews:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchReviews();
  }, []);

  const products = useMemo(() => {
    if (rawReviews.length === 0 && !loading) {
       return fallbackProducts as MappedProduct[];
    }
    return rawReviews.map((r) => ({
      name: translateData(r, 'name', language),
      brand: translateData(r, 'brand', language),
      image: getOptimizedImageUrl(r.image_url, 'card') || "",
      rating: Number(r.overall_rating),
      price: r.price,
      badge: translateData(r, 'badge', language) || undefined,
      pros: translateArray(r, 'pros', language),
      cons: translateArray(r, 'cons', language),
      verdict: translateData(r, 'verdict', language),
      specs: Array.isArray(r.specs) ? (r.specs as { label: string; value: string }[]) : [],
      ratings: Array.isArray(r.ratings) ? (r.ratings as { label: string; score: number }[]) : [],
      slug: r.slug,
      affiliateUrl: r.affiliate_url || undefined,
      createdAt: r.created_at,
    }));
  }, [rawReviews, language, loading]);

  return (
    <section className="container mx-auto px-4 py-16 md:py-24">
      <div className="flex items-end justify-between mb-16 md:mb-24">
        <div className="space-y-8">
          <div className="flex items-center gap-2">
            <span className="w-8 h-1 bg-accent rounded-full" />
            <span className="text-[10px] md:text-xs font-bold text-accent uppercase tracking-sporty">{t('common.tested_reviewed')}</span>
          </div>
          <h2 className="font-heading text-2xl md:text-3xl font-semibold text-primary uppercase">{t('footer.latest_reviews')}</h2>
          <p className="text-base text-muted-foreground max-w-md leading-relaxed">{t('footer.tagline')}</p>
        </div>
        <Link to="/category" className="hidden md:inline-flex items-center gap-2 text-xs font-bold uppercase tracking-sporty text-primary hover:text-accent transition-all group">
          {t('common.all')}
          <span className="group-hover:translate-x-1 transition-transform">→</span>
        </Link>
      </div>

      <FastFilters />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-x-12 gap-y-16">
        {loading
          ? Array.from({ length: 4 }).map((_, i) => <ProductCardSkeleton key={i} />)
          : products.map((p) => (
              <ProductCard key={p.slug || p.name} {...p} />
            ))}
      </div>
    </section>
  );
}
