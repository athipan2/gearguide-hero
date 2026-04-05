import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { SEOHead } from "@/components/SEOHead";
import { supabase } from "@/integrations/supabase/client";
import { CommentSection } from "@/components/CommentSection";
import { Button } from "@/components/ui/button";
import { Loader2, ArrowLeft, Calendar, User } from "lucide-react";
import { useTranslation } from "@/hooks/useTranslation";
import { translateData } from "@/lib/translation-utils";

interface Article {
  id: string;
  title: string;
  title_en?: string;
  category: string;
  category_en?: string;
  content: string;
  content_en?: string;
  image_url: string | null;
  created_at: string;
}

const fallbackArticles: Record<string, Article> = {
  "how-to-choose-running-shoes": {
    id: "1",
    title: "วิธีเลือกซื้อรองเท้าวิ่งปี 2026: คู่มือฉบับสมบูรณ์",
    title_en: "How to Choose Running Shoes 2026: Complete Guide",
    content: `การเลือกซื้อรองเท้าวิ่งที่เหมาะกับเท้าและลักษณะการวิ่งของคุณจะช่วยลดอาการบาดเจ็บและเพิ่มประสิทธิภาพการวิ่งได้อย่างมาก

1. ทราบประเภทของเท้า (Arch Type)
ไม่ว่าคุณจะมีเท้าแบน (Flat feet) หรืออุ้งเท้าสูง (High arch) ก็มีผลต่อการรับแรงกระแทก

2. เข้าใจลักษณะการวิ่ง (Pronation)
นักวิ่งที่เท้าบิดเข้าข้างในมากเกินไป (Overpronation) อาจต้องการรองเท้าที่มี Stability

3. เลือกขนาดที่ถูกต้อง
ควรเผื่อที่ว่างด้านหน้าประมาณ 0.5 - 1 ซม. เพราะเท้าจะขยายตัวเมื่อวิ่งนานๆ

4. เลือกระดับการรับแรงกระแทก (Cushioning)
ตามระยะทางที่วิ่งและความชอบส่วนตัว`,
    content_en: `Choosing the right running shoes for your feet and running style will significantly reduce injury risk and improve performance.

1. Know your Arch Type
Whether you have flat feet or a high arch, it affects shock absorption.

2. Understand your Pronation
Runners who overpronate may need stability shoes.

3. Choose the right size
Leave about 0.5 - 1 cm of space in the front, as feet expand during long runs.

4. Select Cushioning level
Based on your distance and personal preference.`,
    category: "ความรู้พื้นฐาน",
    category_en: "Basics",
    image_url: "https://images.unsplash.com/photo-1476480862126-209bfaa8edc8?w=800&h=600&fit=crop",
    created_at: new Date().toISOString(),
  },
  "trail-running-for-beginners": {
    id: "2",
    title: "เริ่มวิ่งเทรลอย่างไรดี? 5 สิ่งที่มือใหม่ต้องรู้",
    title_en: "How to start Trail Running? 5 things beginners must know",
    content: `จากถนนสู่ป่า การวิ่งเทรลมีความแตกต่างทั้งด้านอุปกรณ์และทักษะ นี่คือคู่มือเบื้องต้นสำหรับคนที่อยากลองสนามเทรลครั้งแรก

1. รองเท้าเทรลเป็นหัวใจสำคัญ
พื้นรองเท้าต้องมีการยึดเกาะ (Lug) ที่ดีเพื่อกันลื่นบนดินหรือหิน

2. อย่ามองข้ามความปลอดภัย
ควรมีอุปกรณ์พื้นฐาน เช่น นกหวีด และผ้าห่มฉุกเฉิน เมื่อเข้าป่า

3. การวิ่งขึ้นและลงเขา
เทคนิคการใช้กล้ามเนื้อจะต่างจากการวิ่งถนนราบๆ แนะนำให้ใช้ก้าวสั้นๆ

4. การเติมพลังงาน
การวิ่งเทรลมักใช้เวลานานกว่าถนนในระยะทางที่เท่ากัน การวางแผนน้ำและพลังงานจึงสำคัญมาก`,
    content_en: `Transitioning from road to trail requires different gear and skills. Here's a basic guide for trail beginners.

1. Trail shoes are core
The outsole must have good lugs for traction on dirt or rocks.

2. Don't overlook safety
Always carry basic gear like a whistle and emergency blanket when entering the woods.

3. Running up and down hills
Muscle usage techniques differ from flat road running. Use short steps.

4. Nutrition and Hydration
Trail running often takes longer than road running for the same distance. Planning is key.`,
    category: "วิ่งเทรล",
    category_en: "Trail Running",
    image_url: "https://images.unsplash.com/photo-1551632811-561732d1e306?w=800&h=600&fit=crop",
    created_at: new Date().toISOString(),
  }
};

export default function ArticleDetail() {
  const { slug } = useParams<{ slug: string }>();
  const [article, setArticle] = useState<Article | null>(null);
  const [loading, setLoading] = useState(true);
  const { t, language } = useTranslation();

  useEffect(() => {
    const fetchArticle = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from("articles")
        .select("*")
        .eq("slug", slug)
        .eq("published", true)
        .maybeSingle();

      if (!error && data) {
        setArticle(data as Article);
      } else if (slug && fallbackArticles[slug]) {
        // Use fallback if DB is empty or article not found
        setArticle(fallbackArticles[slug]);
      }
      setLoading(false);
    };
    fetchArticle();
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="flex justify-center py-20">
          <Loader2 className="h-10 w-10 animate-spin text-primary" />
        </div>
        <Footer />
      </div>
    );
  }

  if (!article) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container mx-auto px-4 py-20 text-center">
          <h1 className="text-2xl font-semibold mb-4">{t('common.no_results')}</h1>
          <Link to="/guides"><Button>{t('guides.back_home')}</Button></Link>
        </div>
        <Footer />
      </div>
    );
  }

  const title = translateData(article, 'title', language);
  const content = translateData(article, 'content', language);
  const category = translateData(article, 'category', language);

  return (
    <div className="min-h-screen bg-background">
      <SEOHead
        title={`${title} — GearTrail`}
        description={title}
        image={article.image_url || undefined}
      />
      <Navbar />

      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <Link to="/guides" className="inline-flex items-center text-primary hover:text-accent mb-8 transition-colors">
          <ArrowLeft className="h-4 w-4 mr-2" />
          {t('guides.back_home')}
        </Link>

        <header className="mb-12">
          <div className="flex items-center gap-2 mb-6">
            <span className="text-xs font-semibold text-accent uppercase tracking-[0.3em]">
              {translateTerm(category, language)}
            </span>
          </div>
          <h1 className="font-heading text-3xl md:text-6xl font-semibold text-primary mb-8 leading-[0.9] tracking-tighter uppercase">
            {title}
          </h1>
          <div className="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-8 text-[10px] sm:text-xs font-semibold uppercase tracking-widest text-muted-foreground border-t border-b border-primary/5 py-4">
            <div className="flex items-center gap-2">
              <User className="h-4 w-4 text-accent" />
              <span>{t('guides.author')}</span>
            </div>
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-accent" />
              <span>{new Date(article.created_at).toLocaleDateString(language === 'th' ? 'th-TH' : 'en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}</span>
            </div>
          </div>
        </header>

        {article.image_url && (
          <div className="rounded-2xl md:rounded-[2rem] overflow-hidden mb-8 md:mb-16 aspect-[16/9] md:aspect-[21/9] shadow-2xl relative">
            <img
              src={article.image_url}
              alt={title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 ring-1 ring-inset ring-black/10" />
          </div>
        )}

        <div className="prose prose-base md:prose-lg max-w-none prose-headings:font-heading prose-headings:font-semibold prose-p:text-muted-foreground prose-p:leading-relaxed whitespace-pre-wrap">
          {content}
        </div>

        {/* Comments Section */}
        <CommentSection articleId={article.id} />
      </main>

      <Footer />
    </div>
  );
}
