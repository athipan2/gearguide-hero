import { useEffect, useState } from "react";
import { ProductCard } from "@/components/ProductCard";
import { supabase } from "@/integrations/supabase/client";
import { FastFilters } from "./FastFilters";
import { Link } from "react-router-dom";
import { ProductCardSkeleton } from "./ReviewSkeleton";
import { getOptimizedImageUrl } from "@/lib/utils";
import { useTranslation } from "@/hooks/useTranslation";

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
  brand: string;
  image_url: string | null;
  overall_rating: number;
  price: string;
  badge: string | null;
  pros: unknown;
  cons: unknown;
  specs: unknown;
  ratings: unknown;
  slug: string;
  affiliate_url: string | null;
  created_at: string;
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
}

export function FeaturedReviews() {
  const [products, setProducts] = useState<MappedProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const { t, language } = useTranslation();

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const { data, error } = await supabase
          .from("reviews")
          .select("name, name_en, brand, image_url, overall_rating, price, price_en, badge, badge_en, pros, pros_en, cons, cons_en, specs, ratings, slug, affiliate_url, created_at")
          .eq("published", true)
          .order("created_at", { ascending: false })
          .limit(8);

        if (error) throw error;

        if (data && data.length > 0) {
          setProducts(
            (data as unknown as (ReviewData & { name_en: string, price_en: string, badge_en: string, pros_en: string[], cons_en: string[] })[]).map((r) => ({
              name: r.name,
              name_en: r.name_en,
              brand: r.brand,
              image: getOptimizedImageUrl(r.image_url, 'card') || "",
              rating: Number(r.overall_rating),
              price: r.price,
              price_en: r.price_en,
              badge: r.badge || undefined,
              badge_en: r.badge_en || undefined,
              pros: Array.isArray(r.pros) ? (r.pros as string[]) : [],
              pros_en: Array.isArray(r.pros_en) ? (r.pros_en as string[]) : [],
              cons: Array.isArray(r.cons) ? (r.cons as string[]) : [],
              cons_en: Array.isArray(r.cons_en) ? (r.cons_en as string[]) : [],
              specs: Array.isArray(r.specs) ? (r.specs as { label: string; value: string }[]) : [],
              ratings: Array.isArray(r.ratings) ? (r.ratings as { label: string; score: number }[]) : [],
              slug: r.slug,
              affiliateUrl: r.affiliate_url || undefined,
              createdAt: r.created_at,
            }))
          );
        } else {
          // If no data in DB, use fallback
          setProducts(fallbackProducts as MappedProduct[]);
        }
      } catch (error) {
        console.error("Error fetching reviews:", error);
        setProducts(fallbackProducts);
      } finally {
        setLoading(false);
      }
    };
    fetchReviews();
  }, []);

  return (
    <section className="container mx-auto px-4 py-16 md:py-24">
      <div className="flex items-end justify-between mb-16 md:mb-24">
        <div className="space-y-8">
          <div className="flex items-center gap-2">
            <span className="w-8 h-1 bg-accent rounded-full" />
            <span className="text-[10px] md:text-xs font-bold text-accent uppercase tracking-sporty">TESTED & REVIEWED</span>
          </div>
          <h2 className="font-heading text-2xl md:text-3xl font-semibold text-primary uppercase">{t("home.featured_title")}</h2>
          <p className="text-base text-muted-foreground max-w-md leading-relaxed">
            {t("common.featured_subtitle")}
          </p>
        </div>
        <Link to="/category" className="hidden md:inline-flex items-center gap-2 text-xs font-bold uppercase tracking-sporty text-primary hover:text-accent transition-all group">
          {t("common.view_all")}
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
