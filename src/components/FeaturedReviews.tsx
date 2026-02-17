import { useEffect, useState } from "react";
import { ProductCard } from "@/components/ProductCard";
import { supabase } from "@/integrations/supabase/client";
import { FastFilters } from "./FastFilters";

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
  slug: string;
  affiliate_url: string | null;
  created_at: string;
}

export function FeaturedReviews() {
  const [products, setProducts] = useState(fallbackProducts);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const { data, error } = await supabase
          .from("reviews")
          .select("name, brand, image_url, overall_rating, price, badge, pros, cons, slug, affiliate_url, created_at")
          .eq("published", true)
          .order("created_at", { ascending: false })
          .limit(8);

        if (error) throw error;

        if (data && data.length > 0) {
          setProducts(
            (data as unknown as ReviewData[]).map((r) => ({
              name: r.name,
              brand: r.brand,
              image: r.image_url || "",
              rating: Number(r.overall_rating),
              price: r.price,
              badge: r.badge || undefined,
              pros: Array.isArray(r.pros) ? (r.pros as string[]) : [],
              cons: Array.isArray(r.cons) ? (r.cons as string[]) : [],
              slug: r.slug,
              affiliateUrl: r.affiliate_url || undefined,
              createdAt: r.created_at,
            }))
          );
        }
      } catch (error) {
        console.error("Error fetching reviews:", error);
      }
    };
    fetchReviews();
  }, []);

  return (
    <section className="container mx-auto px-4 py-16">
      <div className="flex items-end justify-between mb-8">
        <div>
          <h2 className="font-heading text-4xl font-black text-primary tracking-tighter uppercase">รีวิวล่าสุด</h2>
          <p className="text-muted-foreground mt-1">ทดสอบจริง รีวิวจริง อัปเดตทุกสัปดาห์</p>
        </div>
        <a href="#" className="hidden md:inline-flex text-sm font-bold uppercase tracking-widest text-primary hover:text-accent transition-colors">
          ดูทั้งหมด →
        </a>
      </div>

      <FastFilters />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {products.map((p) => (
          <ProductCard key={p.slug || p.name} {...p} />
        ))}
      </div>
    </section>
  );
}
