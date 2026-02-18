import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { RatingStars } from "@/components/RatingStars";
import { SEOHead } from "@/components/SEOHead";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { CommentSection } from "@/components/CommentSection";
import { RelatedReviews } from "@/components/RelatedReviews";
import { useComparisonStore } from "@/lib/comparison-store";
import { toast } from "sonner";
import {
  ExternalLink, ArrowLeft, ThumbsUp, ThumbsDown, Award,
  ChevronRight, Plus
} from "lucide-react";

interface ReviewData {
  id?: string;
  name: string; brand: string; category: string; price: string; image_url: string | null;
  badge: string | null; overall_rating: number;
  ratings: { label: string; score: number }[];
  specs: { label: string; value: string }[];
  pros: string[]; cons: string[];
  verdict: string | null; intro: string | null;
  sections: { title: string; body: string }[];
  affiliate_url: string | null; cta_text: string | null;
}

// Hardcoded fallback data for when DB is empty
const fallbackData: Record<string, ReviewData> = {
  "nike-vaporfly-3": {
    name: "Nike Vaporfly 3", brand: "Nike", category: "รองเท้าวิ่งถนน", price: "฿8,500",
    image_url: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&h=600&fit=crop",
    badge: "Top Pick", overall_rating: 4.8,
    ratings: [{ label: "ความเบา", score: 4.9 }, { label: "แรงคืนตัว", score: 5.0 }, { label: "ความทนทาน", score: 3.8 }, { label: "ความคุ้มค่า", score: 3.5 }, { label: "ความสบาย", score: 4.7 }],
    specs: [{ label: "น้ำหนัก", value: "196g (US 9)" }, { label: "Drop", value: "8mm" }, { label: "พื้นรองเท้า", value: "ZoomX + Carbon Plate" }, { label: "พื้นนอก", value: "Rubber Waffle" }, { label: "เหมาะกับ", value: "Race / Tempo Run" }, { label: "ระยะทาง", value: "10K – Marathon" }],
    pros: ["เบาที่สุดในกลุ่ม Racing Shoes", "ZoomX foam ให้แรงคืนตัวชั้นนำ", "Carbon plate ช่วย propulsion ดีเยี่ยม", "ทรงเท้ากว้างขึ้นจากรุ่นเดิม"],
    cons: ["ราคาสูงกว่าคู่แข่ง", "ทนทานได้ราว 300-400 กม.", "ไม่เหมาะกับวิ่งซ้อมทั่วไป"],
    intro: "Nike Vaporfly 3 ยังคงเป็นมาตรฐานของรองเท้าแข่งวิ่งระดับ Elite ด้วยชุดพื้น ZoomX ที่ให้แรงคืนตัวสูงสุดในตลาด ผสานกับแผ่น Carbon Plate ที่ช่วยส่งแรงไปข้างหน้าอย่างมีประสิทธิภาพ",
    sections: [
      { title: "ความรู้สึกขณะวิ่ง", body: "ตั้งแต่ก้าวแรกจะรู้สึกถึงความเบาและแรงดีดที่ชัดเจน พื้น ZoomX ให้ความนุ่มแต่ไม่หยุ่นจนเสียความเสถียร ทำให้วิ่งเร็วได้อย่างมั่นใจ เหมาะกับ pace ที่เร็วกว่า 5:00/km ขึ้นไป" },
      { title: "การเกาะถนน", body: "พื้นนอก Rubber Waffle ยึดเกาะได้ดีบนถนนแห้ง แต่ในสภาพเปียกจะลื่นเล็กน้อย ไม่แนะนำให้ใช้บนเส้นทางที่มีน้ำขัง" },
      { title: "ความทนทาน", body: "จากการทดสอบ 350 กม. พบว่า ZoomX เริ่มยุบตัวเล็กน้อยที่ส้นเท้า แต่ยังคงประสิทธิภาพได้ดี สำหรับใช้แข่งอย่างเดียวสามารถใช้ได้หลายเรส" },
    ],
    verdict: "Nike Vaporfly 3 ยังคงเป็นตัวเลือกอันดับ 1 สำหรับนักวิ่งที่ต้องการ PR ในการแข่ง แม้ราคาจะสูงแต่ประสิทธิภาพคุ้มค่าทุกบาท เหมาะกับนักวิ่งที่จริงจังเรื่องเวลา",
    affiliate_url: null, cta_text: "ดูราคาล่าสุด",
  },
  "salomon-speedcross-6": {
    name: "Salomon Speedcross 6", brand: "Salomon", category: "รองเท้าวิ่งเทรล", price: "฿5,900",
    image_url: "https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=800&h=600&fit=crop",
    badge: "แนะนำ", overall_rating: 4.6,
    ratings: [{ label: "การเกาะถนน", score: 4.9 }, { label: "ความทนทาน", score: 4.5 }, { label: "การกันน้ำ", score: 4.3 }, { label: "ความคุ้มค่า", score: 4.2 }, { label: "ความสบาย", score: 4.0 }],
    specs: [{ label: "น้ำหนัก", value: "310g (US 9)" }, { label: "Drop", value: "10mm" }, { label: "พื้นรองเท้า", value: "EnergyCell+" }, { label: "พื้นนอก", value: "Contagrip MA" }, { label: "เหมาะกับ", value: "Trail / Mud / Technical" }, { label: "ระยะทาง", value: "5K – Ultra" }],
    pros: ["เกาะพื้นดินเปียกและโคลนได้ยอดเยี่ยม", "ทนทานมาก", "ระบบเชือกรัดเร็ว Quicklace", "ปกป้องเท้าจากหินได้ดี"],
    cons: ["หนักกว่าคู่แข่ง", "แข็งเกินไปสำหรับบางคน", "ไม่เหมาะวิ่งถนน"],
    intro: "Salomon Speedcross 6 เป็นรองเท้าเทรลในตำนานที่ถูกปรับปรุงให้ดีขึ้นอีก โดยเฉพาะเรื่องการเกาะพื้นที่ลื่นและเปียก",
    sections: [
      { title: "การเกาะพื้น", body: "ดอกยาง Contagrip MA ให้การยึดเกาะที่ดีที่สุดในสภาพโคลนและดินเปียก ดอกยางลึกกัดพื้นได้ดี" },
      { title: "ความสบาย", body: "พื้นค่อนข้างแข็งเมื่อเทียบกับรุ่นอื่น เหมาะกับคนที่ชอบความ firm และ supportive" },
    ],
    verdict: "Speedcross 6 คือ king of mud running ถ้าคุณวิ่งเทรลสายเปียก สายโคลน นี่คือตัวเลือกแรก",
    affiliate_url: null, cta_text: "ดูราคาล่าสุด",
  },
};

const badgeColors: Record<string, string> = {
  "แนะนำ": "bg-badge-recommended text-accent-foreground",
  "คุ้มค่าที่สุด": "bg-badge-best-value text-accent-foreground",
  "Top Pick": "bg-badge-top-pick text-accent-foreground",
};

function RatingBar({ label, score }: { label: string; score: number }) {
  return (
    <div className="flex items-center gap-3">
      <span className="text-sm text-muted-foreground w-24 shrink-0">{label}</span>
      <div className="flex-1 h-2.5 bg-muted rounded-full overflow-hidden">
        <div className="h-full bg-gradient-to-r from-primary to-accent rounded-full transition-all duration-700" style={{ width: `${(score / 5) * 100}%` }} />
      </div>
      <span className="text-sm font-semibold text-foreground w-8 text-right">{score.toFixed(1)}</span>
    </div>
  );
}

export default function ReviewDetail() {
  const { slug } = useParams<{ slug: string }>();
  const [review, setReview] = useState<ReviewData | undefined>(undefined);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!slug) { setLoading(false); return; }

    const fetchReview = async () => {
      const { data } = await supabase
        .from("reviews")
        .select("*")
        .eq("slug", slug)
        .eq("published", true)
        .maybeSingle();

      if (data) {
        setReview({
          id: data.id,
          name: data.name, brand: data.brand, category: data.category, price: data.price,
          image_url: data.image_url, badge: data.badge, overall_rating: Number(data.overall_rating),
          ratings: (data.ratings as unknown as ReviewData["ratings"]) || [],
          specs: (data.specs as unknown as ReviewData["specs"]) || [],
          pros: (data.pros as unknown as string[]) || [],
          cons: (data.cons as unknown as string[]) || [],
          intro: data.intro, verdict: data.verdict,
          sections: (data.sections as unknown as ReviewData["sections"]) || [],
          affiliate_url: data.affiliate_url, cta_text: data.cta_text,
        });
      } else if (fallbackData[slug]) {
        setReview(fallbackData[slug]);
      }
      setLoading(false);
    };
    fetchReview();
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container mx-auto px-4 py-20 text-center">
          <p className="text-muted-foreground">กำลังโหลด...</p>
        </div>
        <Footer />
      </div>
    );
  }

  if (!review) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container mx-auto px-4 py-20 text-center">
          <h1 className="font-heading text-3xl font-bold mb-4">ไม่พบรีวิว</h1>
          <Link to="/"><Button variant="cta">กลับหน้าหลัก</Button></Link>
        </div>
        <Footer />
      </div>
    );
  }

  const ctaText = review.cta_text || "ดูราคาล่าสุด";
  const ctaProps = review.affiliate_url
    ? { href: review.affiliate_url, target: "_blank", rel: "noopener noreferrer nofollow" }
    : {};

  const CTAButton = ({ className, variant = "hero", size = "lg", isSidebar = false }: { className?: string, variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link" | "cta" | "hero", size?: "default" | "sm" | "lg" | "icon", isSidebar?: boolean }) => {
    const iconClass = isSidebar ? "h-4 w-4" : "h-5 w-5";
    return (
      <Button variant={variant} size={size} className={className} asChild={!!review.affiliate_url}>
        {review.affiliate_url ? (
          <a {...ctaProps}>
            {ctaText}
            <ExternalLink className={`ml-2 ${iconClass}`} />
          </a>
        ) : (
          <div className="flex items-center">
            {ctaText}
            <ExternalLink className={`ml-2 ${iconClass}`} />
          </div>
        )}
      </Button>
    );
  };

  return (
    <div className="min-h-screen bg-background">
      <SEOHead
        title={`${review.name} รีวิว — GearTrail`}
        description={`รีวิว ${review.name} จาก ${review.brand}: ${(review.intro || "").slice(0, 120)}...`}
        canonical={`https://gearguide-hero.lovable.app/review/${slug}`}
        jsonLd={{
          "@context": "https://schema.org",
          "@type": "Product",
          name: review.name,
          brand: { "@type": "Brand", name: review.brand },
          image: review.image_url,
          description: review.intro,
          review: {
            "@type": "Review",
            reviewRating: { "@type": "Rating", ratingValue: review.overall_rating, bestRating: 5 },
            author: { "@type": "Organization", name: "GearTrail" },
            reviewBody: review.verdict,
          },
          offers: {
            "@type": "Offer",
            price: review.price.replace(/[^\d]/g, ""),
            priceCurrency: "THB",
            availability: "https://schema.org/InStock",
          },
        }}
      />
      <Navbar />

      {/* Breadcrumb */}
      <div className="container mx-auto px-4 py-4">
        <nav className="flex items-center gap-1 text-sm text-muted-foreground">
          <Link to="/" className="hover:text-primary transition-colors">หน้าหลัก</Link>
          <ChevronRight className="h-3.5 w-3.5" />
          <span className="hover:text-primary transition-colors cursor-pointer">{review.category}</span>
          <ChevronRight className="h-3.5 w-3.5" />
          <span className="text-foreground font-medium">{review.name}</span>
        </nav>
      </div>

      <article className="container mx-auto px-4 pb-24">
        {/* Header */}
        <div className="grid md:grid-cols-2 gap-12 mb-16 items-center">
          <div className="relative rounded-[2rem] overflow-hidden bg-muted shadow-2xl aspect-[4/3]">
            <img src={review.image_url || ""} alt={review.name} className="w-full h-full object-cover hover:scale-105 transition-transform duration-700" />
            {review.badge && (
              <div className={`absolute top-6 left-6 px-5 py-2 rounded-full text-xs font-black uppercase tracking-widest flex items-center gap-2 shadow-xl ${badgeColors[review.badge] || "bg-primary text-primary-foreground"}`}>
                <Award className="h-4 w-4" />
                {review.badge}
              </div>
            )}
          </div>

          <div className="flex flex-col justify-center space-y-8">
            <div className="space-y-2">
              <p className="text-sm font-black text-accent uppercase tracking-[0.3em]">{review.brand} // {review.category}</p>
              <h1 className="font-heading text-4xl md:text-6xl font-black text-primary leading-[0.9] tracking-tighter uppercase">{review.name}</h1>
            </div>

            <div className="flex flex-wrap items-center gap-6">
              <div className="flex items-center gap-4 bg-primary text-primary-foreground rounded-2xl px-6 py-4 shadow-lg">
                <span className="font-heading text-5xl font-black">{review.overall_rating}</span>
                <div>
                  <RatingStars rating={review.overall_rating} />
                  <p className="text-[10px] font-bold uppercase tracking-widest opacity-60 mt-0.5">Overall Performance</p>
                </div>
              </div>
              <div className="space-y-1">
                <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Price Estimate</p>
                <span className="font-heading text-3xl font-black text-primary">{review.price}</span>
              </div>
            </div>

            <p className="text-muted-foreground text-lg leading-relaxed border-l-4 border-accent pl-6 py-2 italic font-medium">
              "{review.intro}"
            </p>

            <div className="flex flex-wrap gap-4 pt-4">
              <CTAButton className="flex-1 md:flex-none rounded-full h-14 px-10 shadow-xl" />
              <Button
                variant="outline"
                size="lg"
                className="rounded-full h-14 px-10 border-primary/20"
                onClick={() => {
                  const weight = review.specs?.find(s => s.label.toLowerCase().includes('weight') || s.label.includes('น้ำหนัก'))?.value;
                  const drop = review.specs?.find(s => s.label.toLowerCase().includes('drop'))?.value;
                  useComparisonStore.getState().addItem({
                    name: review.name,
                    brand: review.brand,
                    image: review.image_url || "",
                    rating: review.overall_rating,
                    price: review.price,
                    slug: slug,
                    weight,
                    drop
                  });
                  toast.success(`เพิ่ม ${review.name} เข้าสู่การเปรียบเทียบ`);
                }}
              >
                <Plus className="h-4 w-4 mr-2" />
                เพิ่มลงเปรียบเทียบ
              </Button>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            {/* Pros / Cons */}
            <div className="grid sm:grid-cols-2 gap-6">
              <div className="bg-card border-2 border-badge-recommended/10 rounded-2xl p-6 shadow-sm">
                <h3 className="font-heading font-black text-badge-recommended flex items-center gap-2 mb-4 uppercase tracking-widest text-sm">
                  <ThumbsUp className="h-5 w-5" /> Pros / จุดเด่น
                </h3>
                <ul className="space-y-3">
                  {review.pros.map((p) => (
                    <li key={p} className="flex items-start gap-3 text-sm font-medium text-foreground/80">
                      <div className="h-5 w-5 rounded-full bg-badge-recommended/10 flex items-center justify-center shrink-0">
                        <span className="text-badge-recommended text-[10px]">✓</span>
                      </div>
                      {p}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="bg-card border-2 border-destructive/10 rounded-2xl p-6 shadow-sm">
                <h3 className="font-heading font-black text-destructive flex items-center gap-2 mb-4 uppercase tracking-widest text-sm">
                  <ThumbsDown className="h-5 w-5" /> Cons / จุดด้อย
                </h3>
                <ul className="space-y-3">
                  {review.cons.map((c) => (
                    <li key={c} className="flex items-start gap-3 text-sm font-medium text-foreground/80">
                      <div className="h-5 w-5 rounded-full bg-destructive/10 flex items-center justify-center shrink-0">
                        <span className="text-destructive text-[10px]">✗</span>
                      </div>
                      {c}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Sections */}
            <div className="space-y-12 pt-8">
              {review.sections.map((s) => (
                <div key={s.title} className="space-y-4">
                  <h2 className="font-heading text-3xl font-black text-primary uppercase tracking-tight flex items-center gap-3">
                    <span className="h-8 w-1.5 bg-accent rounded-full" />
                    {s.title}
                  </h2>
                  <p className="text-muted-foreground text-lg leading-relaxed whitespace-pre-wrap">{s.body}</p>
                </div>
              ))}
            </div>

            {/* Verdict */}
            <div className="bg-primary text-primary-foreground rounded-[2rem] p-10 shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 right-0 p-8 opacity-10">
                <Award className="h-32 w-32" />
              </div>
              <h2 className="font-heading text-3xl font-black mb-4 uppercase tracking-tighter">
                GEARTRAIL VERDICT
              </h2>
              <p className="text-primary-foreground/90 text-xl leading-relaxed font-medium mb-8 border-l-2 border-accent/50 pl-6">
                {review.verdict}
              </p>
              <CTAButton variant="cta" className="h-14 px-10 rounded-full text-base" />
            </div>
          </div>

          {/* Sidebar */}
          <aside className="space-y-6">
            <div className="bg-card rounded-xl border p-5 space-y-4 sticky top-20">
              <h3 className="font-heading font-semibold text-foreground">คะแนนแต่ละด้าน</h3>
              {review.ratings.map((r) => (
                <RatingBar key={r.label} label={r.label} score={r.score} />
              ))}
            </div>
            <div className="bg-card rounded-xl border p-5">
              <h3 className="font-heading font-semibold text-foreground mb-4">สเปค</h3>
              <dl className="space-y-3">
                {review.specs.map((s) => (
                  <div key={s.label} className="flex justify-between text-sm">
                    <dt className="text-muted-foreground">{s.label}</dt>
                    <dd className="font-medium text-foreground">{s.value}</dd>
                  </div>
                ))}
              </dl>
            </div>
            <div className="bg-cta/10 rounded-xl border border-cta/30 p-5 text-center sticky top-[26rem]">
              <p className="font-heading font-bold text-foreground text-lg mb-1">{review.price}</p>
              <CTAButton className="w-full" isSidebar />
            </div>
          </aside>
        </div>
        {/* Comments Section */}
        {review.id && <CommentSection reviewId={review.id} />}
      </article>

      {/* Related Reviews */}
      <RelatedReviews currentReview={{
        id: review.id,
        category: review.category,
        overall_rating: review.overall_rating,
        price: review.price,
        slug: slug
      }} />

      {/* Mobile sticky CTA */}
      <div className="lg:hidden fixed bottom-0 inset-x-0 bg-card/95 backdrop-blur-md border-t p-3 z-50">
        <div className="flex items-center gap-3">
          <div>
            <p className="font-heading font-bold text-foreground">{review.price}</p>
            <RatingStars rating={review.overall_rating} />
          </div>
          <CTAButton className="flex-1" isSidebar />
        </div>
      </div>

      <Footer />
    </div>
  );
}
