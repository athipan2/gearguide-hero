import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Link } from "react-router-dom";
import { Clock, ArrowRight } from "lucide-react";

interface Article {
  id: string;
  slug: string;
  title: string;
  category: string;
  image_url: string | null;
  created_at: string;
}

const fallbackArticles: Article[] = [
  {
    id: "1",
    slug: "how-to-choose-running-shoes",
    title: "วิธีเลือกซื้อรองเท้าวิ่งปี 2026: คู่มือฉบับสมบูรณ์",
    category: "ความรู้พื้นฐาน",
    image_url: "https://images.unsplash.com/photo-1476480862126-209bfaa8edc8?w=800&h=600&fit=crop",
    created_at: new Date().toISOString(),
  },
  {
    id: "2",
    slug: "trail-running-for-beginners",
    title: "เริ่มวิ่งเทรลอย่างไรดี? 5 สิ่งที่มือใหม่ต้องรู้",
    category: "วิ่งเทรล",
    image_url: "https://images.unsplash.com/photo-1551632811-561732d1e306?w=800&h=600&fit=crop",
    created_at: new Date().toISOString(),
  }
];

export function LatestGuides() {
  const [articles, setArticles] = useState<Article[]>([]);

  useEffect(() => {
    const fetchArticles = async () => {
      const { data } = await supabase
        .from("articles")
        .select("id, slug, title, category, image_url, created_at")
        .eq("published", true)
        .order("created_at", { ascending: false })
        .limit(3);

      if (data && data.length > 0) {
        setArticles(data as Article[]);
      } else {
        setArticles(fallbackArticles);
      }
    };
    fetchArticles();
  }, []);

  if (articles.length === 0) return null;

  return (
    <section className="container mx-auto px-4 py-12 md:py-20 bg-muted/30 rounded-[2.5rem] my-12 md:my-20">
      <div className="flex items-end justify-between mb-8 md:mb-12">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="w-8 h-1 bg-accent rounded-full" />
            <span className="text-[10px] md:text-xs font-bold text-accent uppercase tracking-sporty">TIPS & GUIDES</span>
          </div>
          <h2 className="font-heading text-2xl md:text-3xl font-semibold text-foreground uppercase tracking-tight-compact">คู่มือ & เทคนิค</h2>
          <p className="text-xs md:text-sm text-muted-foreground mt-1 max-w-md">อัปเกรดความรู้เรื่องวิ่งและการดูแลอุปกรณ์ พร้อมรีวิวจริงจากผู้ใช้งาน</p>
        </div>
        <Link to="/guides" className="hidden md:inline-flex items-center gap-2 text-xs font-bold uppercase tracking-sporty text-primary hover:text-accent transition-all group">
          ดูคู่มือทั้งหมด
          <span className="group-hover:translate-x-1 transition-transform">→</span>
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
        {articles.map((article) => (
          <Link
            key={article.id}
            to={`/guides/${article.slug}`}
            className="group bg-card rounded-2xl border overflow-hidden hover:shadow-lg transition-all"
          >
            <div className="aspect-video overflow-hidden">
              <img
                src={article.image_url || ""}
                alt={article.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
            </div>
            <div className="p-5 md:p-6">
              <span className="text-[9px] md:text-[10px] font-bold text-primary uppercase tracking-sporty bg-primary/5 px-2.5 py-1 rounded-md mb-3 inline-block">
                {article.category}
              </span>
              <h3 className="font-heading font-semibold text-base md:text-lg text-foreground group-hover:text-primary transition-colors line-clamp-2 mb-3 leading-snug">
                {article.title}
              </h3>
              <div className="flex items-center text-xs text-muted-foreground">
                <Clock className="h-3 w-3 mr-1" />
                {new Date(article.created_at).toLocaleDateString("th-TH")}
              </div>
            </div>
          </Link>
        ))}
      </div>

      <div className="mt-8 md:hidden text-center">
        <Link to="/guides" className="inline-flex items-center text-sm font-medium text-primary">
          ดูคู่มือทั้งหมด <ArrowRight className="ml-1 h-4 w-4" />
        </Link>
      </div>
    </section>
  );
}
