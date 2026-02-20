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
      const { data } = await (supabase as any)
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
    <section className="container mx-auto px-4 py-16 bg-muted/30 rounded-3xl my-16">
      <div className="flex items-end justify-between mb-8">
        <div>
          <h2 className="font-heading text-2xl md:text-3xl font-bold text-foreground">คู่มือ & เทคนิคการวิ่ง</h2>
          <p className="text-muted-foreground mt-1">อัปเกรดความรู้เรื่องวิ่งและการดูแลอุปกรณ์</p>
        </div>
        <Link to="/guides" className="hidden md:inline-flex items-center text-sm font-medium text-primary hover:text-accent transition-colors">
          ดูคู่มือทั้งหมด <ArrowRight className="ml-1 h-4 w-4" />
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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
            <div className="p-5">
              <span className="text-[10px] font-bold text-primary uppercase tracking-widest bg-primary/5 px-2 py-1 rounded mb-3 inline-block">
                {article.category}
              </span>
              <h3 className="font-heading font-bold text-foreground group-hover:text-primary transition-colors line-clamp-2 mb-3">
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
