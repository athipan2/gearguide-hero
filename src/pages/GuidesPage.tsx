import { useState, useEffect } from "react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { SEOHead } from "@/components/SEOHead";
import { dataService } from "@/lib/data-service";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Loader2, BookOpen, Clock, ArrowLeft } from "lucide-react";
import { useTranslation } from "@/hooks/useTranslation";
import { translateData } from "@/lib/translation-utils";

interface Article {
  id: string;
  slug: string;
  title: string;
  title_en?: string;
  category: string;
  category_en?: string;
  excerpt: string | null;
  excerpt_en?: string;
  image_url: string | null;
  created_at: string;
}

const fallbackArticles: Article[] = [
  {
    id: "1",
    slug: "how-to-choose-running-shoes",
    title: "วิธีเลือกซื้อรองเท้าวิ่งปี 2026: คู่มือฉบับสมบูรณ์",
    title_en: "How to Choose Running Shoes 2026: Complete Guide",
    excerpt: "การเลือกซื้อรองเท้าวิ่งที่เหมาะกับเท้าและลักษณะการวิ่งของคุณจะช่วยลดอาการบาดเจ็บและเพิ่มประสิทธิภาพการวิ่ง...",
    excerpt_en: "Choosing the right running shoes for your feet and running style will greatly reduce injury and increase performance...",
    category: "ความรู้พื้นฐาน",
    category_en: "Basics",
    image_url: "https://images.unsplash.com/photo-1476480862126-209bfaa8edc8?w=800&h=600&fit=crop",
    created_at: new Date().toISOString(),
  },
  {
    id: "2",
    slug: "trail-running-for-beginners",
    title: "เริ่มวิ่งเทรลอย่างไรดี? 5 สิ่งที่มือใหม่ต้องรู้",
    title_en: "How to start Trail Running? 5 things beginners must know",
    excerpt: "จากถนนสู่ป่า การวิ่งเทรลมีความแตกต่างทั้งด้านอุปกรณ์และทักษะ นี่คือคู่มือเบื้องต้นสำหรับคนที่อยากลองสนามเทรลครั้งแรก...",
    excerpt_en: "From road to trail, trail running differs in both gear and skills. Here is a basic guide for those who want to try...",
    category: "วิ่งเทรล",
    category_en: "Trail Running",
    image_url: "https://images.unsplash.com/photo-1551632811-561732d1e306?w=800&h=600&fit=crop",
    created_at: new Date().toISOString(),
  }
];

export default function GuidesPage() {
  const { t, language } = useTranslation();
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        const data = await dataService.getArticles();
        if (data && data.length > 0) {
          setArticles(data as Article[]);
        } else {
          setArticles(fallbackArticles);
        }
      } catch (err) {
        console.error("Error fetching articles:", err);
        setArticles(fallbackArticles);
      }
      setLoading(false);
    };
    fetchArticles();
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <SEOHead
        title={t('guides.seo_title')}
        description={t('guides.seo_description')}
      />
      <Navbar />

      <main className="container mx-auto px-4 py-8">
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors mb-6"
        >
          <ArrowLeft className="h-4 w-4" />
          {t('common.back')}
        </Link>
        <header className="mb-12 text-center max-w-2xl mx-auto">
          <h1 className="font-heading text-3xl md:text-5xl font-bold text-foreground mb-4">
            {t('guides.title')}
          </h1>
          <p className="text-muted-foreground text-lg">
            {t('guides.subtitle')}
          </p>
        </header>

        {loading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="h-10 w-10 animate-spin text-primary" />
          </div>
        ) : articles.length === 0 ? (
          <div className="text-center py-20 bg-muted/30 rounded-2xl">
            <BookOpen className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">{t('guides.empty')}</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {articles.map((article) => {
              const title = translateData(article, 'title', language);
              const category = translateData(article, 'category', language);
              const excerpt = translateData(article, 'excerpt', language);

              return (
                <Link
                  key={article.id}
                  to={`/guides/${article.slug}`}
                  className="group flex flex-col bg-card rounded-2xl border overflow-hidden hover:shadow-xl hover:border-primary/20 transition-all duration-300"
                >
                  <div className="aspect-[16/9] overflow-hidden bg-muted">
                    <img
                      src={article.image_url || "https://images.unsplash.com/photo-1452626038306-9aae5e071dd3?w=800&h=600&fit=crop"}
                      alt={title}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  </div>
                  <div className="p-6 flex flex-col flex-1">
                    <div className="flex items-center gap-2 mb-3">
                      <span className="text-xs font-bold text-primary uppercase tracking-wider bg-primary/10 px-2 py-1 rounded">
                        {translateTerm(category, language)}
                      </span>
                      <span className="text-xs text-muted-foreground flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {new Date(article.created_at).toLocaleDateString(language === 'th' ? 'th-TH' : 'en-US', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric'
                        })}
                      </span>
                    </div>
                    <h3 className="font-heading text-xl font-bold text-foreground mb-2 group-hover:text-primary transition-colors">
                      {title}
                    </h3>
                    <p className="text-muted-foreground text-sm line-clamp-2 mb-6 flex-1">
                      {excerpt}
                    </p>
                    <Button variant="ghost" className="p-0 h-auto self-start text-primary hover:text-accent group-hover:gap-2 transition-all">
                      {t('common.read_more')} →
                    </Button>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
