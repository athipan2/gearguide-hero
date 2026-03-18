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
    specs: [{ label: "น้ำหนัก", value: "ชาย ~232 กรัม (US 9) / หญิง ~190 กรัม (US 8)" }, { label: "Drop", value: "8mm" }, { label: "พื้นรองเท้า", value: "ZoomX" }, { label: "พื้นนอก", value: "Rubber Waffle" }, { label: "เหมาะกับ", value: "Race / Tempo Run" }, { label: "ระยะทาง", value: "10K – Marathon" }],
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
    <div className="space-y-1 md:space-y-2.5 group">
      <div className="flex justify-between items-end gap-2">
        <span className="text-[8px] md:text-[10px] font-semibold uppercase tracking-[0.2em] text-slate-500 group-hover:text-primary transition-colors break-words">{label}</span>
        <span className="text-[10px] md:text-sm font-semibold text-primary tabular-nums shrink-0">{score.toFixed(1)}</span>
      </div>
      <div className="h-1.5 md:h-2.5 w-full bg-slate-50 rounded-full overflow-hidden border border-slate-200/30 relative">
        <div
          className="h-full bg-gradient-to-r from-primary to-primary/70 rounded-full transition-all duration-1000 ease-out shadow-[0_0_12px_rgba(31,61,43,0.15)] relative z-10 overflow-hidden"
          style={{ width: `${(score / 5) * 100}%` }}
        >
          <div className="absolute inset-0 bg-[linear-gradient(45deg,rgba(255,255,255,0.15)_25%,transparent_25%,transparent_50%,rgba(255,255,255,0.15)_50%,rgba(255,255,255,0.15)_75%,transparent_75%,transparent)] bg-[length:1rem_1rem] animate-[shimmer_2s_linear_infinite]" />
        </div>
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
      <div className="min-h-screen bg-white">
        <Navbar className="bg-white/80" />
        <ReviewDetailSkeleton />
        <Footer />
      </div>
    );
  }

  if (!review) {
    return (
      <div className="min-h-screen bg-white">
        <Navbar className="bg-white/80" />
        <div className="container mx-auto px-4 py-20 text-center">
          <h1 className="font-heading text-3xl font-semibold mb-4">ไม่พบรีวิว</h1>
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
    <div className="min-h-screen bg-white">
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
      <Navbar className="bg-white/80" />

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
        <div className="md:min-w-full md:mx-0 md:px-0">
          <div className="grid md:grid-cols-[35fr_65fr] gap-3 md:gap-12 mb-4 md:mb-16 items-center">
            <div className="relative px-12 md:px-0">
              <div className="absolute inset-0 bg-grid opacity-20 pointer-events-none" />
              <ImageGallery
                mainImage={review.image_url || ""}
                images={review.images}
                alt={review.name}
                badge={review.badge}
                badgeClassName={badgeColors[review.badge || ""] || "bg-primary text-primary-foreground"}
                badgeIcon={<Award className="h-4 w-4" />}
              />
            </div>

            <div className="flex flex-col justify-center space-y-4 md:space-y-6">
              <div className="space-y-1 md:space-y-2">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-1 bg-accent" />
                  <p className="text-[9px] md:text-sm font-semibold text-slate-400 uppercase tracking-[0.3em]">{review.brand} // {review.category}</p>
                </div>
                <h1 className="font-heading text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-semibold text-primary leading-[0.9] tracking-tighter uppercase break-words overflow-hidden">
                  {review.name.split(' ').map((word, i) => (
                    <span key={i} className={i % 2 === 0 ? "" : "text-transparent bg-clip-text bg-gradient-to-r from-accent to-orange-500"}>
                      {word}{" "}
                    </span>
                  ))}
                </h1>
              </div>

              <div className="flex flex-wrap items-center gap-3 md:gap-4">
                <div className="flex items-center gap-3 md:gap-4 bg-primary text-primary-foreground rounded-2xl px-6 py-4 md:px-10 md:py-8 shadow-2xl relative overflow-hidden group">
                  <div className="absolute inset-0 bg-grid opacity-10" />
                  <span className="font-heading text-4xl md:text-7xl font-semibold tracking-tighter">{review.overall_rating}</span>
                  <div className="relative z-10">
                    <div className="scale-90 md:scale-125 origin-left">
                      <RatingStars rating={review.overall_rating} />
                    </div>
                    <p className="text-[8px] md:text-[10px] font-semibold uppercase tracking-[0.2em] text-white/40 mt-1">CORE SCORE</p>
                  </div>
                </div>

                <div className="border-2 border-slate-100 rounded-2xl px-6 py-4 md:px-10 md:py-8">
                  <p className="text-[8px] md:text-[10px] font-semibold uppercase tracking-[0.2em] text-slate-400 mb-1">MSRP / PRICE</p>
                  <span className="font-heading text-2xl md:text-4xl font-semibold text-primary tracking-tight">{review.price}</span>
                </div>
              </div>

              <div className="relative">
                <Quote className="absolute -top-4 -left-2 h-8 w-8 text-accent/10 -z-10" />
                <p className="text-muted-foreground text-sm md:text-xl leading-relaxed pl-4 md:pl-6 border-l-2 border-accent/30 font-medium max-w-2xl">
                  {review.intro}
                </p>
              </div>

              {/* Mobile Ratings & Specs */}
              <div className="lg:hidden space-y-8 pt-4">
                <div className="space-y-4">
                  <h3 className="font-heading font-semibold text-primary text-xs uppercase tracking-[0.2em] flex items-center gap-2">
                    <div className="w-1 h-3.5 bg-accent rounded-full" />
                    คะแนนแต่ละด้าน (RATINGS)
                  </h3>
                  <div className="space-y-4">
                    {review.ratings.map((r) => (
                      <RatingBar key={r.label} label={r.label} score={r.score} />
                    ))}
                  </div>
                </div>

                <div className="space-y-6">
                  <h3 className="font-heading font-semibold text-primary text-xs uppercase tracking-[0.2em] flex items-center gap-2 mb-6">
                    <div className="w-1 h-3.5 bg-accent rounded-full" />
                    สเปคทางเทคนิค (SPECS)
                  </h3>
                  <div className="grid grid-cols-1 gap-4">
                    {[
                      { icon: Scale, label: "น้ำหนัก (WEIGHT)", value: review.specs?.find(s => s.label.toLowerCase().includes('weight') || s.label.includes('น้ำหนัก'))?.value || '-' },
                      { icon: ArrowDown, label: "DROP", value: review.specs?.find(s => s.label.toLowerCase().includes('drop'))?.value || '-' },
                      { icon: Layers, label: "พื้นรองเท้า (MIDSOLE)", value: review.specs?.find(s => s.label.toLowerCase().includes('midsole') || s.label.includes('พื้นรองเท้า'))?.value || '-' },
                      { icon: Footprints, label: "พื้นนอก (OUTSOLE)", value: review.specs?.find(s => s.label.toLowerCase().includes('outsole') || s.label.includes('พื้นนอก'))?.value || '-' },
                    ].map((spec, i) => (
                      <div key={i} className="flex items-center gap-4">
                        <div className="h-10 w-10 rounded-xl bg-slate-100/50 flex items-center justify-center text-slate-400">
                          <spec.icon className="h-5 w-5" />
                        </div>
                        <div className="flex flex-col">
                          <span className="text-[8px] font-semibold text-slate-400 tracking-widest">{spec.label}</span>
                          <span className="font-semibold text-sm text-slate-700">{spec.value}</span>
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
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            {/* Pros / Cons */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 md:gap-12">
              <div className="transition-all duration-500 group">
                <div className="flex items-center justify-between mb-6 md:mb-10">
                  <h3 className="font-heading font-semibold text-emerald-700 flex items-center gap-3 uppercase tracking-[0.2em] text-[10px] md:text-xs">
                    <div className="h-8 w-8 rounded-xl bg-emerald-50 flex items-center justify-center">
                      <ThumbsUp className="h-4 w-4" />
                    </div>
                    PROS / จุดเด่น
                  </h3>
                  <div className="h-px flex-1 bg-slate-100 ml-4 hidden md:block" />
                </div>
                <ul className="space-y-4 md:space-y-6">
                  {review.pros.map((p) => (
                    <li key={p} className="flex items-start gap-4 text-[13px] md:text-lg font-semibold text-slate-700 leading-snug group/item">
                      <div className="h-5 w-5 rounded-full bg-emerald-500 flex items-center justify-center shrink-0 mt-0.5 shadow-lg shadow-emerald-500/20 group-hover/item:scale-110 transition-transform">
                        <Check className="h-3 w-3 text-white" />
                      </div>
                      {p}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="transition-all duration-500 group">
                <div className="flex items-center justify-between mb-6 md:mb-10">
                  <h3 className="font-heading font-semibold text-rose-700 flex items-center gap-3 uppercase tracking-[0.2em] text-[10px] md:text-xs">
                    <div className="h-8 w-8 rounded-xl bg-rose-50 flex items-center justify-center">
                      <ThumbsDown className="h-4 w-4" />
                    </div>
                    CONS / จุดด้อย
                  </h3>
                  <div className="h-px flex-1 bg-slate-100 ml-4 hidden md:block" />
                </div>
                <ul className="space-y-4 md:space-y-6">
                  {review.cons.map((c) => (
                    <li key={c} className="flex items-start gap-4 text-[13px] md:text-lg font-semibold text-slate-700 leading-snug group/item">
                      <div className="h-5 w-5 rounded-full bg-rose-500 flex items-center justify-center shrink-0 mt-0.5 shadow-lg shadow-rose-500/20 group-hover/item:scale-110 transition-transform">
                        <X className="h-3 w-3 text-white" />
                      </div>
                      {c}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Sections */}
            <div className="space-y-10 md:space-y-16 pt-8 md:pt-12">
              {review.sections.map((s) => (
                <div key={s.title} className="transition-all duration-300">
                  <h2 className="font-heading text-xl md:text-3xl font-semibold text-primary uppercase tracking-tight flex items-center gap-4 mb-4 md:mb-6 leading-none">
                    <span className="h-6 md:h-8 w-1.5 bg-accent rounded-full" />
                    {s.title}
                  </h2>
                  <p className="text-muted-foreground text-[15px] md:text-lg leading-relaxed whitespace-pre-wrap font-medium">{s.body}</p>
                </div>
              ))}
            </div>

            {/* Verdict */}
              <div className="bg-primary rounded-[2rem] md:rounded-[3rem] p-8 md:p-20 shadow-2xl relative overflow-hidden group text-center border-4 border-accent/20">
                <div className="absolute inset-0 bg-grid opacity-10" />
              <div className="absolute top-0 right-0 w-96 h-96 bg-accent opacity-10 blur-[100px] -translate-y-1/2 translate-x-1/2 pointer-events-none" />
              <div className="absolute bottom-0 left-0 w-96 h-96 bg-emerald-400 opacity-5 blur-[100px] translate-y-1/2 -translate-x-1/2 pointer-events-none" />

              <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-[0.03] pointer-events-none" />

              <div className="relative z-10 max-w-4xl mx-auto">
                <div className="inline-flex items-center gap-2 md:gap-3 px-6 py-2 md:px-8 md:py-3 bg-white/10 backdrop-blur-md border border-white/10 text-white rounded-full text-[9px] md:text-xs font-semibold uppercase tracking-[0.4em] mb-8 md:mb-12 shadow-2xl">
                  <Zap className="h-3.5 w-3.5 md:h-4 md:w-4 fill-accent text-accent animate-pulse" />
                  GEARTRAIL VERDICT
                </div>

                <h2 className="font-heading text-2xl md:text-6xl lg:text-7xl font-semibold text-white mb-10 md:mb-16 leading-[1.1] tracking-tighter">
                  "{review.verdict}"
                </h2>

                <div className="flex flex-col md:flex-row items-center justify-center gap-6">
                  <CTAButton variant="hero" className="h-14 md:h-20 px-10 md:px-20 rounded-full text-base md:text-2xl w-full md:w-auto shadow-2xl shadow-accent/20 hover:scale-105 active:scale-95 transition-all duration-300 bg-accent text-white border-none" />

                  <div className="flex items-center gap-4 text-white/60 text-xs font-semibold uppercase tracking-widest">
                    <div className="h-px w-8 bg-white/20" />
                    Trusted by Runners
                    <div className="h-px w-8 bg-white/20" />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <aside className="space-y-8">
            <div className="hidden lg:block space-y-12 sticky top-24">
              <div className="p-2">
                <h3 className="font-heading font-semibold text-primary text-[10px] uppercase tracking-[0.2em] flex items-center gap-2 mb-8">
                  <div className="w-1 h-3.5 bg-accent rounded-full" />
                  คะแนนแต่ละด้าน (RATINGS)
                </h3>
                <div className="space-y-6">
                  {review.ratings.map((r) => (
                    <RatingBar key={r.label} label={r.label} score={r.score} />
                  ))}
                </div>
              </div>

              <div className="pt-10 border-t border-slate-200 p-2">
                <h3 className="font-heading font-semibold text-primary text-[10px] uppercase tracking-[0.2em] flex items-center gap-2 mb-8">
                  <div className="w-1 h-3.5 bg-accent rounded-full" />
                  สเปคทางเทคนิค (SPECS)
                </h3>
                <div className="grid grid-cols-1 gap-4">
                  {[
                    { icon: Scale, label: "น้ำหนัก (WEIGHT)", value: review.specs?.find(s => s.label.toLowerCase().includes('weight') || s.label.includes('น้ำหนัก'))?.value || '-' },
                    { icon: ArrowDown, label: "DROP", value: review.specs?.find(s => s.label.toLowerCase().includes('drop'))?.value || '-' },
                    { icon: Layers, label: "พื้นรองเท้า (MIDSOLE)", value: review.specs?.find(s => s.label.toLowerCase().includes('midsole') || s.label.includes('พื้นรองเท้า'))?.value || '-' },
                    { icon: Footprints, label: "พื้นนอก (OUTSOLE)", value: review.specs?.find(s => s.label.toLowerCase().includes('outsole') || s.label.includes('พื้นนอก'))?.value || '-' },
                  ].map((spec, i) => (
                    <div key={i} className="flex items-center gap-4 group">
                      <div className="h-10 w-10 rounded-xl bg-slate-100/50 flex items-center justify-center text-slate-400 group-hover:bg-primary group-hover:text-white transition-all">
                        <spec.icon className="h-5 w-5" />
                      </div>
                      <div className="flex flex-col">
                        <span className="text-[8px] font-semibold text-slate-400 tracking-widest">{spec.label}</span>
                        <span className="font-semibold text-sm text-slate-700">{spec.value}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-4">
                <div className="border-t border-slate-200 pt-8 mb-6">
                  <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-widest mb-2">Price Estimate</p>
                  <p className="font-heading font-semibold text-primary text-4xl">{review.price}</p>
                </div>
                <CTAButton className="w-full h-16 rounded-2xl shadow-xl shadow-accent/10" isSidebar />
              </div>
            </div>

            {/* Additional Sidebar Block (Newsletter) */}
            <div className="bg-primary rounded-3xl p-8 text-primary-foreground relative overflow-hidden shadow-xl shadow-primary/20">
              <div className="relative z-10 space-y-4">
                <h4 className="font-heading font-semibold text-2xl leading-tight">ติดตามรีวิวใหม่ล่าสุด</h4>
                <p className="text-primary-foreground/70 text-sm font-medium">ไม่พลาดทุกการอัปเดตอุปกรณ์วิ่งและโปรโมชั่นเด็ด</p>
                <Button variant="secondary" className="w-full rounded-xl font-semibold py-6 h-auto text-primary">สมัครรับข่าวสาร</Button>
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

          <CTAButton variant="hero" className="flex-1 h-12 rounded-2xl font-semibold text-xs uppercase tracking-wider shadow-xl shadow-primary/20" isSidebar />
        </div>
      </div>

      {/* Spacer for sticky footer */}
      <div className="h-24 lg:hidden" />

      <Footer />
    </div>
  );
}
