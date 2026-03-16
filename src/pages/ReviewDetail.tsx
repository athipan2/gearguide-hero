import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { RatingStars } from "@/components/RatingStars";
import { ImageGallery } from "@/components/ImageGallery";
import { SEOHead } from "@/components/SEOHead";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { CommentSection } from "@/components/CommentSection";
import { RelatedReviews } from "@/components/RelatedReviews";
import { useComparisonStore } from "@/lib/comparison-store";
import { toast } from "sonner";
import { ReviewDetailSkeleton } from "@/components/ReviewSkeleton";
import {
  ExternalLink, ArrowLeft, ThumbsUp, ThumbsDown, Award,
  ChevronRight, Plus, Check, X, Zap, Quote, Share2,
  Scale, ArrowDown, Layers, Footprints, Target, Route
} from "lucide-react";

interface ReviewData {
  id?: string;
  name: string; brand: string; category: string; price: string; image_url: string | null;
  images: string[];
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
    images: [
      "https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=800&h=600&fit=crop"
    ],
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
    images: [],
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
    <div className="space-y-2">
      <div className="flex justify-between items-center text-[11px] font-black uppercase tracking-[0.1em]">
        <span className="text-muted-foreground/70">{label}</span>
        <span className="text-primary font-bold">{score.toFixed(1)} / 5.0</span>
      </div>
      <div className="h-2 w-full bg-muted/50 rounded-full overflow-hidden border border-border/10">
        <div
          className="h-full bg-primary rounded-full transition-all duration-1000 ease-out shadow-[0_0_8px_rgba(31,61,43,0.2)]"
          style={{ width: `${(score / 5) * 100}%` }}
        />
      </div>
    </div>
  );
}

export default function ReviewDetail() {
  const { slug } = useParams<{ slug: string }>();
  const [review, setReview] = useState<ReviewData | undefined>(undefined);
  const [userRating, setUserRating] = useState<{ average: number; count: number } | null>(null);
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
          images: (data.images as unknown as string[]) || [],
          ratings: (data.ratings as unknown as ReviewData["ratings"]) || [],
          specs: (data.specs as unknown as ReviewData["specs"]) || [],
          pros: (data.pros as unknown as string[]) || [],
          cons: (data.cons as unknown as string[]) || [],
          intro: data.intro, verdict: data.verdict,
          sections: (data.sections as unknown as ReviewData["sections"]) || [],
          affiliate_url: data.affiliate_url, cta_text: data.cta_text,
        });

        // Fetch aggregate rating from comments
        const { data: ratingData } = await supabase
          .from("comments")
          .select("rating")
          .eq("review_id", data.id)
          .not("rating", "is", null);

        if (ratingData && ratingData.length > 0) {
          const sum = ratingData.reduce((acc, curr) => acc + (curr.rating || 0), 0);
          setUserRating({
            average: sum / ratingData.length,
            count: ratingData.length
          });
        }
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
        <ReviewDetailSkeleton />
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
    <div className="min-h-screen bg-white overflow-x-hidden">
      <SEOHead
        title={`${review.name} รีวิว — GearTrail`}
        description={`รีวิว ${review.name} จาก ${review.brand}: ${(review.intro || "").slice(0, 120)}...`}
        image={review.image_url || undefined}
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

      <article className="container mx-auto px-4 pb-16 md:pb-24 pt-2 md:pt-0">
        {/* Header */}
        <div className="grid md:grid-cols-2 gap-3 md:gap-12 mb-4 md:mb-16 items-center">
          <ImageGallery
            mainImage={review.image_url || ""}
            images={review.images}
            alt={review.name}
            badge={review.badge}
            badgeClassName={badgeColors[review.badge || ""] || "bg-primary text-primary-foreground"}
            badgeIcon={<Award className="h-4 w-4" />}
          />

          <div className="flex flex-col justify-center space-y-4 md:space-y-8">
            <div className="space-y-1 md:space-y-2">
              <p className="text-[9px] md:text-sm font-black text-accent uppercase tracking-[0.3em]">{review.brand} // {review.category}</p>
              <h1 className="font-heading text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black text-primary leading-[0.9] tracking-tighter uppercase">{review.name}</h1>
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center gap-4 md:gap-6">
              <div className="flex items-center gap-3 md:gap-4 bg-primary text-primary-foreground rounded-2xl px-3 py-1.5 md:px-6 md:py-4 shadow-lg w-fit">
                <span className="font-heading text-2xl md:text-5xl font-black">{review.overall_rating}</span>
                <div>
                  <div className="scale-90 md:scale-100 origin-left">
                    <RatingStars rating={review.overall_rating} />
                  </div>
                  <p className="text-[8px] md:text-[10px] font-bold uppercase tracking-widest opacity-60 mt-0.5">Overall Performance</p>
                </div>
              </div>

              {userRating && (
                <div className="flex items-center gap-3 md:gap-4 bg-card border-2 border-primary/10 rounded-2xl px-3 py-1.5 md:px-6 md:py-4 w-fit">
                  <span className="font-heading text-xl md:text-3xl font-black text-primary">{userRating.average.toFixed(1)}</span>
                  <div>
                    <div className="scale-75 md:scale-90 origin-left">
                      <RatingStars rating={userRating.average} />
                    </div>
                    <p className="text-[8px] md:text-[10px] font-bold uppercase tracking-widest text-muted-foreground mt-0.5">Real Runner Rating ({userRating.count})</p>
                  </div>
                </div>
              )}

              <div className="space-y-0 md:space-y-1">
                <p className="text-[9px] md:text-[10px] font-black uppercase tracking-widest text-muted-foreground">Price Estimate</p>
                <span className="font-heading text-xl md:text-3xl font-black text-primary">{review.price}</span>
              </div>
            </div>

            <p className="text-muted-foreground text-sm md:text-lg leading-relaxed border-l-4 border-accent pl-4 md:pl-6 py-1 md:py-2 italic font-medium">
              "{review.intro}"
            </p>

            {/* Mobile Ratings & Specs */}
            <div className="lg:hidden grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 pb-2">
              <div className="bg-card rounded-2xl border border-border/60 p-5 space-y-5 shadow-sm">
                <h3 className="font-heading font-black text-primary text-xs uppercase tracking-widest flex items-center gap-2">
                  <div className="w-1 h-4 bg-accent rounded-full" />
                  คะแนนแต่ละด้าน
                </h3>
                <div className="space-y-5">
                  {review.ratings.map((r) => (
                    <RatingBar key={r.label} label={r.label} score={r.score} />
                  ))}
                </div>
              </div>
              <div className="bg-card rounded-2xl border border-border/60 p-5 shadow-sm">
                <h3 className="font-heading font-black text-primary text-xs uppercase tracking-widest flex items-center gap-2 mb-5">
                  <div className="w-1 h-4 bg-accent rounded-full" />
                  สเปคทางเทคนิค
                </h3>
                <div className="grid grid-cols-2 sm:grid-cols-1 gap-3">
                  {[
                    { icon: Scale, label: "น้ำหนัก", value: review.specs?.find(s => s.label.toLowerCase().includes('weight') || s.label.includes('น้ำหนัก'))?.value || '-' },
                    { icon: ArrowDown, label: "Drop", value: review.specs?.find(s => s.label.toLowerCase().includes('drop'))?.value || '-' },
                    { icon: Layers, label: "พื้นรองเท้า", value: review.specs?.find(s => s.label.toLowerCase().includes('midsole') || s.label.includes('พื้นรองเท้า'))?.value || '-' },
                    { icon: Footprints, label: "พื้นนอก", value: review.specs?.find(s => s.label.toLowerCase().includes('outsole') || s.label.includes('พื้นนอก'))?.value || '-' },
                    { icon: Target, label: "เหมาะกับ", value: review.specs?.find(s => s.label.toLowerCase().includes('suitable') || s.label.includes('เหมาะกับ'))?.value || '-' },
                    { icon: Route, label: "ระยะทาง", value: review.specs?.find(s => s.label.toLowerCase().includes('distance') || s.label.includes('ระยะทาง'))?.value || '-' },
                  ].map((spec, i) => (
                    <div key={i} className="flex items-center gap-2 md:gap-3 p-2.5 md:p-3 rounded-xl bg-muted/30 border border-border/20">
                      <div className="w-7 h-7 md:w-8 md:h-8 rounded-lg bg-background flex items-center justify-center text-primary shrink-0 border border-border/10">
                        <spec.icon className="w-3.5 h-3.5 md:w-4 md:h-4" />
                      </div>
                      <div className="flex flex-col min-w-0">
                        <span className="text-[8px] md:text-[9px] uppercase font-bold text-muted-foreground/70 tracking-wider leading-none mb-1">{spec.label}</span>
                        <span className="font-bold text-[11px] md:text-xs truncate text-foreground leading-tight">{spec.value}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex flex-wrap gap-3 md:gap-4 pt-2 md:pt-4">
              <CTAButton className="flex-1 md:flex-none rounded-full h-12 md:h-14 px-8 md:px-10 shadow-xl text-sm md:text-base" />
              <Button
                variant="outline"
                size="lg"
                className="flex-1 md:flex-none rounded-full h-12 md:h-14 px-8 md:px-10 border-primary/20 text-sm md:text-base"
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
                    drop,
                    specs: review.specs,
                    aspectRatings: review.ratings
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
          <div className="lg:col-span-2 space-y-6">
            {/* Pros / Cons */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="bg-card border border-border/60 rounded-2xl p-6 shadow-sm hover:shadow-md transition-all duration-300">
                <h3 className="font-heading font-black text-badge-recommended flex items-center gap-2 mb-6 uppercase tracking-widest text-xs">
                  <ThumbsUp className="h-5 w-5" /> PROS / จุดเด่น
                </h3>
                <ul className="space-y-4">
                  {review.pros.map((p) => (
                    <li key={p} className="flex items-start gap-3 text-sm font-semibold text-muted-foreground hover:text-foreground transition-colors leading-snug">
                      <div className="h-5 w-5 rounded-full bg-badge-recommended/10 flex items-center justify-center shrink-0 mt-0.5">
                        <Check className="h-3 w-3 text-badge-recommended" />
                      </div>
                      {p}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="bg-card border border-border/60 rounded-2xl p-6 shadow-sm hover:shadow-md transition-all duration-300">
                <h3 className="font-heading font-black text-destructive flex items-center gap-2 mb-6 uppercase tracking-widest text-xs">
                  <ThumbsDown className="h-5 w-5" /> CONS / จุดด้อย
                </h3>
                <ul className="space-y-4">
                  {review.cons.map((c) => (
                    <li key={c} className="flex items-start gap-3 text-sm font-semibold text-muted-foreground hover:text-foreground transition-colors leading-snug">
                      <div className="h-5 w-5 rounded-full bg-destructive/10 flex items-center justify-center shrink-0 mt-0.5">
                        <X className="h-3 w-3 text-destructive" />
                      </div>
                      {c}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Sections */}
            <div className="space-y-6 md:space-y-10 pt-2 md:pt-4">
              {review.sections.map((s) => (
                <div key={s.title} className="bg-card border border-border/60 rounded-3xl p-6 md:p-10 shadow-sm hover:shadow-md transition-all duration-300">
                  <h2 className="font-heading text-xl md:text-4xl font-black text-primary uppercase tracking-tight flex items-center gap-3 mb-8 leading-none">
                    <span className="h-8 md:h-10 w-1.5 bg-accent rounded-full" />
                    {s.title}
                  </h2>
                  <p className="text-muted-foreground text-base md:text-xl leading-relaxed whitespace-pre-wrap font-medium">{s.body}</p>
                </div>
              ))}
            </div>

            {/* Verdict */}
            <div className="bg-card border-2 border-primary/20 rounded-[2.5rem] p-8 md:p-12 shadow-2xl relative overflow-hidden group text-center">
              <div className="absolute -top-24 -right-24 w-64 h-64 bg-primary/5 rounded-full blur-3xl group-hover:bg-primary/10 transition-colors" />
              <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-primary/5 rounded-full blur-3xl group-hover:bg-primary/10 transition-colors" />

              <div className="relative z-10">
                <div className="inline-flex items-center gap-2 px-6 py-2 bg-black text-white rounded-full text-[10px] md:text-xs font-black uppercase tracking-[0.2em] mb-10 shadow-xl">
                  <Zap className="h-4 w-4 fill-primary text-primary" />
                  GEARTRAIL VERDICT
                </div>
                <h2 className="font-heading text-2xl md:text-5xl lg:text-6xl font-black text-foreground mb-12 leading-[1.1] tracking-tighter italic">
                  "{review.verdict}"
                </h2>
                <CTAButton variant="hero" className="h-16 md:h-20 px-12 md:px-20 rounded-full text-lg md:text-2xl w-full md:w-auto shadow-2xl shadow-primary/30 hover:scale-105 transition-all duration-300" />
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <aside className="space-y-8">
            <div className="hidden lg:block bg-card rounded-2xl border border-border/60 p-8 space-y-8 sticky top-24 shadow-sm">
              <div>
                <h3 className="font-heading font-black text-primary text-xs uppercase tracking-widest flex items-center gap-2 mb-6">
                  <div className="w-1 h-4 bg-accent rounded-full" />
                  คะแนนแต่ละด้าน
                </h3>
                <div className="space-y-5">
                  {review.ratings.map((r) => (
                    <RatingBar key={r.label} label={r.label} score={r.score} />
                  ))}
                </div>
              </div>

              <div className="pt-8 border-t border-border/40">
                <h3 className="font-heading font-black text-primary text-xs uppercase tracking-widest flex items-center gap-2 mb-6">
                  <div className="w-1 h-4 bg-accent rounded-full" />
                  สเปคทางเทคนิค
                </h3>
                <dl className="space-y-4">
                  {review.specs.map((s) => (
                    <div key={s.label} className="flex justify-between items-center text-sm border-b border-border/40 pb-3 last:border-0 last:pb-0">
                      <dt className="text-muted-foreground font-medium">{s.label}</dt>
                      <dd className="font-black text-foreground">{s.value}</dd>
                    </div>
                  ))}
                </dl>
              </div>

              <div className="pt-4">
                <div className="bg-accent/5 rounded-2xl border border-accent/10 p-5 text-center mb-4">
                  <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest mb-1">Price Estimate</p>
                  <p className="font-heading font-black text-primary text-2xl">{review.price}</p>
                </div>
                <CTAButton className="w-full h-14 rounded-2xl shadow-lg shadow-accent/10" isSidebar />
              </div>
            </div>

            {/* Additional Sidebar Block (Newsletter) */}
            <div className="bg-primary rounded-3xl p-8 text-primary-foreground relative overflow-hidden shadow-xl shadow-primary/20">
              <div className="relative z-10 space-y-4">
                <h4 className="font-heading font-black text-2xl leading-tight">ติดตามรีวิวใหม่ล่าสุด</h4>
                <p className="text-primary-foreground/70 text-sm font-medium">ไม่พลาดทุกการอัปเดตอุปกรณ์วิ่งและโปรโมชั่นเด็ด</p>
                <Button variant="secondary" className="w-full rounded-xl font-bold py-6 h-auto text-primary">สมัครรับข่าวสาร</Button>
              </div>
              <div className="absolute -bottom-6 -right-6 opacity-10 rotate-12">
                <Zap className="h-32 w-32" />
              </div>
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
      <div className="lg:hidden fixed bottom-0 inset-x-0 bg-white/95 backdrop-blur-xl border-t border-slate-200 p-4 z-50 pb-[max(1rem,env(safe-area-inset-bottom))] shadow-[0_-10px_30px_rgba(0,0,0,0.05)] animate-in slide-in-from-bottom duration-700 ease-out">
        <div className="flex items-center gap-2.5">
          <Button
            variant="outline"
            size="icon"
            className="h-12 w-12 shrink-0 rounded-2xl border-slate-200 bg-white shadow-sm active:scale-90 transition-all"
            onClick={() => {
              if (navigator.share) {
                navigator.share({
                  title: review.name,
                  text: review.intro || "",
                  url: window.location.href,
                }).catch(() => {});
              } else {
                navigator.clipboard.writeText(window.location.href);
                toast.success("คัดลอกลิงก์แล้ว");
              }
            }}
          >
            <Share2 className="w-5 h-5 text-slate-600" />
          </Button>

          <Button
            variant="outline"
            size="icon"
            className="h-12 w-12 shrink-0 rounded-2xl border-slate-200 bg-white shadow-sm active:scale-90 transition-all"
            onClick={() => {
              const weight = review.specs?.find(s => s.label.toLowerCase().includes('weight') || s.label.includes('น้ำหนัก'))?.value;
              const drop = review.specs?.find(s => s.label.toLowerCase().includes('drop'))?.value;
              if (slug) {
                useComparisonStore.getState().addItem({
                  name: review.name,
                  brand: review.brand,
                  image: review.image_url || "",
                  rating: review.overall_rating,
                  price: review.price,
                  slug: slug,
                  weight,
                  drop,
                  specs: review.specs,
                  aspectRatings: review.ratings
                });
                toast.success(`เพิ่ม ${review.name} เข้าสู่การเปรียบเทียบ`);
              }
            }}
          >
            <Plus className="w-5 h-5 text-slate-600" />
          </Button>

          <CTAButton variant="hero" className="flex-1 h-12 rounded-2xl font-black text-xs uppercase tracking-wider shadow-xl shadow-primary/20" isSidebar />
        </div>
      </div>

      {/* Spacer for sticky footer */}
      <div className="h-24 lg:hidden" />

      <Footer />
    </div>
  );
}
