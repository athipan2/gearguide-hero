import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { SEOHead } from "@/components/SEOHead";
import { supabase } from "@/integrations/supabase/client";
import { CommentSection } from "@/components/CommentSection";
import { Button } from "@/components/ui/button";
import { Loader2, ArrowLeft, Calendar, User } from "lucide-react";

interface Article {
  id: string;
  title: string;
  category: string;
  content: string;
  image_url: string | null;
  created_at: string;
}

const fallbackArticles: Record<string, Article> = {
  "how-to-choose-running-shoes": {
    id: "1",
    title: "วิธีเลือกซื้อรองเท้าวิ่งปี 2026: คู่มือฉบับสมบูรณ์",
    content: `การเลือกซื้อรองเท้าวิ่งที่เหมาะกับเท้าและลักษณะการวิ่งของคุณจะช่วยลดอาการบาดเจ็บและเพิ่มประสิทธิภาพการวิ่งได้อย่างมาก

1. ทราบประเภทของเท้า (Arch Type)
ไม่ว่าคุณจะมีเท้าแบน (Flat feet) หรืออุ้งเท้าสูง (High arch) ก็มีผลต่อการรับแรงกระแทก

2. เข้าใจลักษณะการวิ่ง (Pronation)
นักวิ่งที่เท้าบิดเข้าข้างในมากเกินไป (Overpronation) อาจต้องการรองเท้าที่มี Stability

3. เลือกขนาดที่ถูกต้อง
ควรเผื่อที่ว่างด้านหน้าประมาณ 0.5 - 1 ซม. เพราะเท้าจะขยายตัวเมื่อวิ่งนานๆ

4. เลือกระดับการรับแรงกระแทก (Cushioning)
ตามระยะทางที่วิ่งและความชอบส่วนตัว`,
    category: "ความรู้พื้นฐาน",
    image_url: "https://images.unsplash.com/photo-1476480862126-209bfaa8edc8?w=800&h=600&fit=crop",
    created_at: new Date().toISOString(),
  },
  "trail-running-for-beginners": {
    id: "2",
    title: "เริ่มวิ่งเทรลอย่างไรดี? 5 สิ่งที่มือใหม่ต้องรู้",
    content: `จากถนนสู่ป่า การวิ่งเทรลมีความแตกต่างทั้งด้านอุปกรณ์และทักษะ นี่คือคู่มือเบื้องต้นสำหรับคนที่อยากลองสนามเทรลครั้งแรก

1. รองเท้าเทรลเป็นหัวใจสำคัญ
พื้นรองเท้าต้องมีการยึดเกาะ (Lug) ที่ดีเพื่อกันลื่นบนดินหรือหิน

2. อย่ามองข้ามความปลอดภัย
ควรมีอุปกรณ์พื้นฐาน เช่น นกหวีด และผ้าห่มฉุกเฉิน เมื่อเข้าป่า

3. การวิ่งขึ้นและลงเขา
เทคนิคการใช้กล้ามเนื้อจะต่างจากการวิ่งถนนราบๆ แนะนำให้ใช้ก้าวสั้นๆ

4. การเติมพลังงาน
การวิ่งเทรลมักใช้เวลานานกว่าถนนในระยะทางที่เท่ากัน การวางแผนน้ำและพลังงานจึงสำคัญมาก`,
    category: "วิ่งเทรล",
    image_url: "https://images.unsplash.com/photo-1551632811-561732d1e306?w=800&h=600&fit=crop",
    created_at: new Date().toISOString(),
  }
};

export default function ArticleDetail() {
  const { slug } = useParams<{ slug: string }>();
  const [article, setArticle] = useState<Article | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchArticle = async () => {
      setLoading(true);
      const { data, error } = await (supabase as any)
        .from("articles")
        .select("id, title, category, content, image_url, created_at")
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
          <h1 className="text-2xl font-bold mb-4">ไม่พบบทความ</h1>
          <Link to="/guides"><Button>กลับไปหน้าคู่มือ</Button></Link>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <SEOHead
        title={`${article.title} — GearTrail`}
        description={article.title}
      />
      <Navbar />

      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <Link to="/guides" className="inline-flex items-center text-primary hover:text-accent mb-8 transition-colors">
          <ArrowLeft className="h-4 w-4 mr-2" />
          กลับไปหน้าคู่มือ
        </Link>

        <header className="mb-12">
          <div className="flex items-center gap-2 mb-6">
            <span className="text-xs font-black text-accent uppercase tracking-[0.3em]">
              {article.category}
            </span>
          </div>
          <h1 className="font-heading text-4xl md:text-6xl font-black text-primary mb-8 leading-[0.9] tracking-tighter uppercase">
            {article.title}
          </h1>
          <div className="flex items-center gap-8 text-xs font-bold uppercase tracking-widest text-muted-foreground border-t border-b border-primary/5 py-4">
            <div className="flex items-center gap-2">
              <User className="h-4 w-4 text-accent" />
              <span>ทีมงาน GearTrail</span>
            </div>
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-accent" />
              <span>{new Date(article.created_at).toLocaleDateString('th-TH', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}</span>
            </div>
          </div>
        </header>

        {article.image_url && (
          <div className="rounded-[2rem] overflow-hidden mb-16 aspect-[21/9] shadow-2xl relative">
            <img
              src={article.image_url}
              alt={article.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 ring-1 ring-inset ring-black/10" />
          </div>
        )}

        <div className="prose prose-lg max-w-none prose-headings:font-heading prose-headings:font-bold prose-p:text-muted-foreground prose-p:leading-relaxed whitespace-pre-wrap">
          {article.content}
        </div>

        {/* Comments Section */}
        <CommentSection articleId={article.id} />
      </main>

      <Footer />
    </div>
  );
}
