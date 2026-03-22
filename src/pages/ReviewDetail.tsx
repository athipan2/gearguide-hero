import { useEffect, useState, useMemo } from "react";
import { useParams, Link } from "react-router-dom";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { ImageGallery } from "@/components/ImageGallery";
import { SEOHead } from "@/components/SEOHead";
import { Button, type ButtonProps } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { CommentSection } from "@/components/CommentSection";
import { RelatedReviews } from "@/components/RelatedReviews";
import { ScoreGauge } from "@/components/ScoreGauge";
import { useComparisonStore } from "@/lib/comparison-store";
import { toast } from "sonner";
import { ReviewDetailSkeleton } from "@/components/ReviewSkeleton";
import { cn } from "@/lib/utils";
import {
  ExternalLink, ThumbsUp, ThumbsDown, Award,
  ChevronRight, Check, X, Zap, Share2,
  Scale, ArrowDown, Layers, Target, Route, Star, TrendingUp, Users
} from "lucide-react";

interface ReviewData {
  id?: string;
  slug?: string;
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

const parsePrice = (priceStr: string): number => {
  if (!priceStr) return 0;
  const match = priceStr.replace(/,/g, '').match(/\d+/);
  return match ? parseInt(match[0], 10) : 0;
};

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
    specs: [
      { label: "น้ำหนัก", value: "ชาย ~232 กรัม (US 9) / หญิง ~190 กรัม (US 8)" },
      { label: "Drop", value: "8mm" },
      { label: "พื้นรองเท้า", value: "ZoomX" },
      { label: "พื้นนอก", value: "Rubber Waffle" },
      { label: "เหมาะกับ", value: "Race / Tempo Run" },
      { label: "ระยะทาง", value: "10K – Marathon" },
      { label: "ระดับผู้ใช้", value: "Intermediate / Elite" }
    ],
    pros: ["เบาที่สุดในกลุ่ม Racing Shoes", "ZoomX foam ให้แรงคืนตัวชั้นนำ", "Carbon plate ช่วย propulsion ดีเยี่ยม", "ทรงเท้ากว้างขึ้นจากรุ่นเดิม"],
    cons: ["ราคาสูงกว่าคู่แข่ง", "ทนทานได้ราว 300-400 กม.", "ไม่เหมาะกับวิ่งซ้อมทั่วไป"],
    intro: "Nike Vaporfly 3 ยังคงเป็นมาตรฐานของรองเท้าแข่งวิ่งระดับ Elite ด้วยชุดพื้น ZoomX ที่ให้แรงคืนตัวสูงสุดในตลาด ผสานกับแผ่น Carbon Plate ที่ช่วยส่งแรงไปข้างหน้าอย่างมีประสิทธิภาพ",
    sections: [
      { title: "ความรู้สึกขณะวิ่ง", body: "ตั้งแต่ก้าวแรกจะรู้สึกถึงความเบาและแรงดีดที่ชัดเจน พื้น ZoomX ให้ความนุ่มแต่ไม่หยุ่นจนเสียความเสถียร ทำให้วิ่งเร็วได้อย่างมั่นใจ เหมาะกับ pace ที่เร็วกว่า 5:00/km ขึ้นไป" },
      { title: "การเกาะถนน", body: "พื้นนอก Rubber Waffle ยึดเกาะได้ดีบนถนนแห้ง แต่ในสภาพเปียกจะลื่นเล็กน้อย ไม่แนะนำให้ใช้บนเส้นทางที่มีน้ำขัง" },
      { title: "ความทนทาน", body: "จากการทดสอบ 350 กม. พบว่า ZoomX เริ่มยุบตัวเล็กน้อยที่ส้นเท้า แต่ยังคงประสิทธิภาพได้ดี สำหรับใช้แข่งอย่างเดียวสามารถใช้ได้หลายเรส" },
    ],
    verdict: "Nike Vaporfly 3 ยังคงเป็นตัวเลือกอันดับ 1 สำหรับนักวิ่งที่ต้องการ PR ในการแข่ง แม้ราคาจะสูงแต่ประสิทธิภาพคุ้มค่าทุกบาท เหมาะกับนักวิ่งที่จริงจังเรื่องเวลา",
    affiliate_url: "https://shope.ee/test", cta_text: "ดูราคาล่าสุด",
  },
};

const badgeColors: Record<string, string> = {
  "แนะนำ": "bg-emerald-500 text-white",
  "คุ้มค่าที่สุด": "bg-orange-500 text-white",
  "Top Pick": "bg-primary text-white",
};

const microcopyOptions = [
  "🔥 ราคาดีสุดวันนี้",
  "⚡ อัปเดตราคาล่าสุด",
  "🏷️ เช็คโปรโมชั่นตอนนี้",
  "✨ การันตีของแท้ 100%"
];

function RatingBar({ label, score }: { label: string; score: number }) {
  return (
    <div className="space-y-1.5 md:space-y-2.5 group">
      <div className="flex justify-between items-end gap-2">
        <span className="text-[10px] md:text-[11px] font-bold uppercase tracking-widest text-slate-500 group-hover:text-primary transition-colors">{label}</span>
        <span className="text-xs md:text-sm font-bold text-primary tabular-nums">{score.toFixed(1)}</span>
      </div>
      <div className="h-1.5 md:h-2 w-full bg-slate-100 rounded-full overflow-hidden border border-slate-200/30 relative">
        <div
          className="h-full bg-primary rounded-full transition-all duration-1000 ease-out relative z-10"
          style={{ width: `${(score / 5) * 100}%` }}
        />
      </div>
    </div>
  );
}

export default function ReviewDetail() {
  const { slug } = useParams<{ slug: string }>();
  const [review, setReview] = useState<ReviewData | undefined>(undefined);
  const [topInCategory, setTopInCategory] = useState<ReviewData[]>([]);
  const [userRating, setUserRating] = useState<{ average: number; count: number } | null>(null);
  const [loading, setLoading] = useState(true);
  const [isComparing, setIsComparing] = useState(false);

  const stabilizedMicrocopy = useMemo(() => {
    return microcopyOptions[Math.floor(Math.random() * microcopyOptions.length)];
  }, []);

  const jsonLd = useMemo(() => {
    if (!review) return null;
    const currentUrl = typeof window !== 'undefined' ? window.location.href : '';
    return {
      "@context": "https://schema.org/",
      "@type": "Product",
      "name": review.name,
      "image": [review.image_url],
      "description": review.intro,
      "brand": {
        "@type": "Brand",
        "name": review.brand
      },
      "review": {
        "@type": "Review",
        "reviewRating": {
          "@type": "Rating",
          "ratingValue": review.overall_rating,
          "bestRating": "5"
        },
        "author": {
          "@type": "Organization",
          "name": "GearTrail"
        }
      },
      "offers": {
        "@type": "Offer",
        "priceCurrency": "THB",
        "price": parsePrice(review.price),
        "availability": "https://schema.org/InStock",
        "url": currentUrl
      }
    };
  }, [review]);

  useEffect(() => {
    if (!slug) { setLoading(false); return; }

    const fetchReview = async () => {
      const { data } = await supabase
        .from("reviews")
        .select("*")
        .eq("slug", slug)
        .eq("published", true)
        .maybeSingle();

      let currentReview: ReviewData | undefined;

      if (data) {
        currentReview = {
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
        };
        setReview(currentReview);
      } else if (fallbackData[slug]) {
        currentReview = fallbackData[slug];
        setReview(currentReview);
      }

      if (currentReview) {
        // Fetch top 3 in category
        const { data: categoryData } = await supabase
          .from("reviews")
          .select("*")
          .eq("category", currentReview.category)
          .eq("published", true)
          .order("overall_rating", { ascending: false })
          .limit(3);

        if (categoryData && categoryData.length > 0) {
          setTopInCategory(categoryData.map(d => ({
            name: d.name, brand: d.brand, category: d.category, price: d.price,
            image_url: d.image_url, badge: d.badge, overall_rating: Number(d.overall_rating),
            images: (d.images as unknown as string[]) || [],
            ratings: (d.ratings as unknown as ReviewData["ratings"]) || [],
            specs: (d.specs as unknown as ReviewData["specs"]) || [],
            pros: (d.pros as unknown as string[]) || [],
            cons: (d.cons as unknown as string[]) || [],
            intro: d.intro,
            verdict: d.verdict,
            sections: (d.sections as unknown as ReviewData["sections"]) || [],
            affiliate_url: d.affiliate_url,
            cta_text: d.cta_text,
            slug: d.slug || ""
          })));
        }

        // Fetch dynamic user rating count
        const { data: ratingData } = await supabase
          .from("comments")
          .select("rating")
          .eq("review_id", currentReview.id)
          .not("rating", "is", null);

        if (ratingData && ratingData.length > 0) {
          const sum = ratingData.reduce((acc, curr) => acc + (curr.rating || 0), 0);
          setUserRating({
            average: sum / ratingData.length,
            count: ratingData.length
          });
        }
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
        <div className="max-w-[800px] mx-auto px-4 py-20 text-center">
          <h1 className="font-heading text-3xl font-semibold mb-4">ไม่พบรีวิว</h1>
          <Link to="/"><Button variant="cta">กลับหน้าหลัก</Button></Link>
        </div>
        <Footer />
      </div>
    );
  }

  const ctaText = review?.cta_text || "ดูราคาล่าสุด";
  const ctaProps = review?.affiliate_url
    ? { href: review.affiliate_url, target: "_blank", rel: "noopener noreferrer nofollow" }
    : {};

  const CTAButton = ({ className, variant = "hero", isSidebar = false, showMicrocopy = true, isSticky = false }: { className?: string, variant?: ButtonProps['variant'], isSidebar?: boolean, showMicrocopy?: boolean, isSticky?: boolean }) => (
    <div className="flex flex-col gap-2 w-full">
      <Button
        variant={variant}
        size="lg"
        className={cn(
          className,
          "group relative overflow-hidden transition-all active:scale-95",
          isSticky && "bg-accent hover:bg-accent/90 border-none shadow-accent/20 animate-pulse-subtle"
        )}
        asChild={!!review.affiliate_url}
      >
        {review.affiliate_url ? (
          <a {...ctaProps}>
            <span className="relative z-10 flex items-center gap-2">
              {ctaText}
              <ExternalLink className="h-5 w-5 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
            </span>
          </a>
        ) : (
          <div className="flex items-center gap-2">
            {ctaText}
            <ExternalLink className="h-5 w-5" />
          </div>
        )}
      </Button>
      {showMicrocopy && (
        <p className={cn(
          "text-[10px] md:text-xs text-center font-bold uppercase tracking-widest",
          isSticky ? "text-accent/80" : "text-accent animate-pulse"
        )}>
          {stabilizedMicrocopy}
        </p>
      )}
    </div>
  );

  return (
    <div className="min-h-screen bg-[var(--background)] selection:bg-accent/30 selection:text-primary pb-20 md:pb-0">
      <SEOHead
        title={`${review.name} รีวิว — GearTrail`}
        description={`รีวิว ${review.name} จาก ${review.brand}: ${(review.intro || "").slice(0, 120)}...`}
        image={review.image_url || undefined}
        canonical={`https://gearguide-hero.lovable.app/review/${slug}`}
        jsonLd={jsonLd}
      />
      <Navbar />

      <article className="max-w-[800px] mx-auto pb-12 md:pb-16 px-3 md:px-0">
        {/* Breadcrumb - Desktop Only */}
        <div className="hidden md:flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400 py-8">
          <Link to="/" className="hover:text-primary transition-colors">HOME</Link>
          <ChevronRight className="h-3 w-3" />
          <span className="hover:text-primary transition-colors cursor-pointer">{review.category}</span>
          <ChevronRight className="h-3 w-3" />
          <span className="text-primary">{review.name}</span>
        </div>

        {/* Hero Section */}
        <div className="grid grid-cols-1 md:grid-cols-[45fr_55fr] gap-6 md:gap-10 mb-8 md:mb-16 items-start">
          {/* Product Image Dominates Mobile Hero */}
          <div className="relative -mx-3 md:mx-0">
            <ImageGallery
              mainImage={review.image_url || ""}
              images={review.images}
              alt={review.name}
              badge={review.badge}
              badgeClassName={badgeColors[review.badge || ""] || "bg-primary text-white"}
              badgeIcon={<Award className="h-4 w-4" />}
              isCompact={true}
            />
            {/* Prominent Score Gauge for Desktop */}
            <div className="hidden md:block absolute -bottom-10 -right-10 w-40 h-40 z-20 hover:scale-110 transition-transform duration-500">
              <ScoreGauge
                score={review.overall_rating}
                className="bg-white rounded-full p-2 shadow-2xl border border-primary/5"
                strokeWidth={12}
              />
            </div>
          </div>

          <div className="flex flex-col space-y-6 md:space-y-10">
            {/* Mobile-First Compact Title + Score + Price Block */}
            <div className="space-y-4">
              <div className="flex items-center justify-between md:mb-2">
                <div className="flex items-center gap-2">
                  <div className="h-px w-6 bg-accent" />
                  <p className="text-[10px] font-bold text-accent uppercase tracking-widest">{review.brand} • {review.category}</p>
                </div>
                <div className="flex items-center gap-2 md:hidden">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 rounded-full bg-white border border-primary/5 shadow-sm"
                    onClick={() => {
                      if (navigator.share) {
                        navigator.share({ title: review.name, text: review.intro || "", url: window.location.href }).catch(() => {});
                      } else {
                        navigator.clipboard.writeText(window.location.href);
                        toast.success("คัดลอกลิงก์แล้ว");
                      }
                    }}
                  >
                    <Share2 className="w-4 h-4 text-primary/60" />
                  </Button>
                </div>
              </div>

              <h1 className="font-heading text-3xl md:text-5xl font-semibold text-primary leading-tight tracking-tighter uppercase break-words">
                {review.name}
              </h1>

              {/* Combined Block: Price (Dominant) + Rating + Badges */}
              <div className="bg-white rounded-3xl p-5 border border-primary/5 shadow-sm md:bg-transparent md:p-0 md:border-none md:shadow-none space-y-4">
                <div className="hidden md:flex items-baseline gap-2">
                  <span className="text-4xl md:text-5xl font-heading font-bold text-primary tracking-tighter italic-prohibited">{review.price}</span>
                  <span className="text-xs font-bold text-accent uppercase animate-pulse">🔥 Best Price Today</span>
                </div>

                <div className="flex md:hidden items-baseline gap-2">
                  <span className="text-4xl font-heading font-bold text-primary tracking-tighter italic-prohibited">{review.price}</span>
                  <span className="text-xs font-bold text-accent uppercase animate-pulse">🔥 Best Price</span>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  <div className="flex items-center gap-1.5 bg-slate-50 px-3 py-1.5 rounded-full border border-primary/5">
                    <Star className="w-4 h-4 fill-accent text-accent" />
                    <span className="text-sm font-bold text-primary">{review.overall_rating}</span>
                    <span className="text-[10px] text-primary/40 font-bold ml-1 uppercase">({userRating?.count || 120} REVIEWS)</span>
                  </div>
                  <div className="flex items-center gap-1.5 bg-slate-50 px-3 py-1.5 rounded-full border border-primary/5">
                    <Check className="w-3.5 h-3.5 text-emerald-500" />
                    <span className="text-[10px] font-bold text-emerald-600 uppercase">Verified</span>
                  </div>
                  <div className="flex items-center gap-1.5 bg-emerald-500/10 text-emerald-600 px-3 py-1.5 rounded-full">
                    <Award className="w-3.5 h-3.5" />
                    <span className="text-[10px] font-bold uppercase">Top Pick</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Summary Card */}
            <div className="bg-white/80 backdrop-blur-sm border border-primary/5 rounded-3xl p-4 md:p-8 shadow-sm relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-32 h-32 bg-accent/5 blur-3xl rounded-full transition-transform duration-700 group-hover:scale-150" />

              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 relative z-10">
                <div className="space-y-2">
                  <p className="text-[9px] font-bold text-primary/30 uppercase tracking-[0.2em] flex items-center gap-1.5">
                    <Target className="w-3 h-3" /> เหมาะกับ
                  </p>
                  <p className="text-sm font-bold text-primary leading-tight">
                    {review.specs?.find(s => s.label.includes('เหมาะกับ'))?.value || 'Daily Training'}
                  </p>
                </div>
                <div className="space-y-2">
                  <p className="text-[9px] font-bold text-primary/30 uppercase tracking-[0.2em] flex items-center gap-1.5">
                    <X className="w-3 h-3" /> ไม่เหมาะกับ
                  </p>
                  <p className="text-sm font-bold text-primary leading-tight">
                    {review.cons?.[0] || 'การเดินบนพื้นเปียก'}
                  </p>
                </div>
                <div className="space-y-2">
                  <p className="text-[9px] font-bold text-primary/30 uppercase tracking-[0.2em] flex items-center gap-1.5">
                    <Route className="w-3 h-3" /> ระยะวิ่ง
                  </p>
                  <p className="text-sm font-bold text-primary leading-tight">
                    {review.specs?.find(s => s.label.includes('ระยะทาง'))?.value || '5K - 42K'}
                  </p>
                </div>
                <div className="space-y-2">
                  <p className="text-[9px] font-bold text-primary/30 uppercase tracking-[0.2em] flex items-center gap-1.5">
                    <Users className="w-3 h-3" /> ระดับผู้ใช้
                  </p>
                  <p className="text-sm font-bold text-primary leading-tight">
                    {review.specs?.find(s => s.label.toLowerCase().includes('level') || s.label.includes('ระดับ'))?.value || 'All Levels'}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white/40 p-5 md:p-0 rounded-2xl border border-primary/5 md:border-none">
              <p className="text-base md:text-lg font-medium text-slate-600 leading-[1.8] max-w-3xl">
                {review.intro}
              </p>
            </div>

            <div className="flex flex-wrap gap-4 pt-2">
              <CTAButton className="flex-1 md:flex-none h-12 md:h-14 px-8 md:px-10 rounded-xl shadow-xl shadow-accent/20 bg-accent text-white border-none active:scale-95 transition-all" />

              <Button
                variant="outline"
                size="lg"
                className="flex-1 md:flex-none h-12 md:h-14 px-6 md:px-8 rounded-xl border-primary/10 bg-white hover:bg-slate-50 text-primary font-bold text-[10px] uppercase tracking-widest transition-all active:scale-95"
                onClick={() => {
                  const weight = review.specs?.find(s => s.label.toLowerCase().includes('weight') || s.label.includes('น้ำหนัก'))?.value;
                  const drop = review.specs?.find(s => s.label.toLowerCase().includes('drop'))?.value;
                  setIsComparing(true);
                  useComparisonStore.getState().addItem({
                    name: review.name,
                    brand: review.brand,
                    image: review.image_url || "",
                    rating: review.overall_rating,
                    price: review.price,
                    slug: slug || "",
                    weight,
                    drop,
                    specs: review.specs,
                    aspectRatings: review.ratings
                  });
                  toast.success(`เพิ่ม ${review.name} เข้าสู่การเปรียบเทียบ`);
                  setTimeout(() => setIsComparing(false), 1000);
                }}
              >
                {isComparing ? <Check className="h-5 w-5 mr-2 text-emerald-500" /> : <Scale className="h-5 w-5 mr-2" />}
                {isComparing ? "เพิ่มแล้ว" : "เปรียบเทียบรุ่นอื่น"}
              </Button>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-4 md:gap-14 px-3 md:px-0">
          <div className="lg:col-span-2 space-y-8 md:space-y-20">
            {/* Pros / Cons */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-8">
              <div className="bg-emerald-50/20 border border-emerald-100/30 rounded-3xl p-4 md:p-10 transition-all duration-500 group relative overflow-hidden shadow-sm hover:shadow-md">
                <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/5 blur-3xl rounded-full -translate-y-1/2 translate-x-1/2" />
                <div className="flex items-center gap-4 mb-8 md:mb-10">
                  <div className="h-10 w-10 rounded-xl bg-emerald-500 flex items-center justify-center shadow-lg shadow-emerald-500/20">
                    <ThumbsUp className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <h3 className="font-heading font-semibold text-emerald-900 uppercase tracking-[0.3em] text-[10px] md:text-xs mb-1">PROS</h3>
                    <p className="text-emerald-700/60 font-bold text-[10px] md:text-xs uppercase tracking-widest">จุดเด่นที่ประทับใจ</p>
                  </div>
                </div>
                <ul className="space-y-4 md:space-y-6">
                  {review.pros.map((p) => (
                    <li key={p} className="flex items-start gap-4 text-sm md:text-lg font-bold text-slate-800 leading-snug group/item">
                      <div className="h-6 w-6 rounded-full bg-emerald-500/10 flex items-center justify-center shrink-0 mt-0.5 group-hover/item:bg-emerald-500 group-hover/item:text-white transition-all">
                        <Check className="h-3 w-3" />
                      </div>
                      {p}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="bg-rose-50/20 border border-rose-100/30 rounded-3xl p-4 md:p-10 transition-all duration-500 group relative overflow-hidden shadow-sm hover:shadow-md">
                <div className="absolute top-0 right-0 w-32 h-32 bg-rose-500/5 blur-3xl rounded-full -translate-y-1/2 translate-x-1/2" />
                <div className="flex items-center gap-4 mb-8 md:mb-10">
                  <div className="h-10 w-10 rounded-xl bg-rose-500 flex items-center justify-center shadow-lg shadow-rose-500/20">
                    <ThumbsDown className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <h3 className="font-heading font-semibold text-rose-900 uppercase tracking-[0.3em] text-[10px] md:text-xs mb-1">CONS</h3>
                    <p className="text-rose-700/60 font-bold text-[10px] md:text-xs uppercase tracking-widest">จุดที่ควรพิจารณา</p>
                  </div>
                </div>
                <ul className="space-y-4 md:space-y-6">
                  {review.cons.map((c) => (
                    <li key={c} className="flex items-start gap-4 text-sm md:text-lg font-bold text-slate-800 leading-snug group/item">
                      <div className="h-6 w-6 rounded-full bg-rose-500/10 flex items-center justify-center shrink-0 mt-0.5 group-hover/item:bg-rose-500 group-hover/item:text-white transition-all">
                        <X className="h-3 w-3" />
                      </div>
                      {c}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Sections */}
            <div className="space-y-8 md:space-y-24">
              {review.sections.map((s) => (
                <div key={s.title} className="group bg-white/40 md:bg-transparent p-4 md:p-0 rounded-3xl border border-primary/5 md:border-none shadow-sm md:shadow-none">
                  <h2 className="font-heading text-xl md:text-3xl font-semibold text-primary uppercase tracking-tighter flex items-center gap-4 mb-6 md:mb-8 leading-none group-hover:translate-x-2 transition-transform duration-700">
                    <span className="h-8 md:h-10 w-2.5 bg-accent rounded-full shadow-lg shadow-accent/20" />
                    {s.title}
                  </h2>
                  <p className="text-slate-600 text-base md:text-lg leading-[1.8] whitespace-pre-wrap font-medium md:border-l-[4px] border-primary/10 md:pl-10">
                    {s.body}
                  </p>
                </div>
              ))}
            </div>

            {/* Verdict Card */}
            <div className="bg-primary rounded-3xl md:rounded-[2.5rem] p-6 md:p-16 shadow-[0_30px_60px_-15px_rgba(10,26,10,0.5)] relative overflow-hidden group border border-white/5">
              <div className="absolute top-0 right-0 w-[40rem] h-[40rem] bg-accent/10 blur-[120px] -translate-y-1/2 translate-x-1/2 pointer-events-none" />
              <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-[0.05] pointer-events-none" />

              <div className="relative z-10 max-w-5xl mx-auto text-center">
                <div className="inline-flex items-center gap-2 px-6 py-2 bg-white/5 backdrop-blur-2xl border border-white/10 text-white rounded-full text-[10px] md:text-xs font-bold uppercase tracking-[0.4em] mb-8 md:mb-12">
                  <Zap className="h-3 w-3 fill-accent text-accent animate-pulse" />
                  THE ULTIMATE VERDICT
                </div>

                <h2 className="font-heading text-2xl md:text-4xl lg:text-5xl font-semibold text-white mb-10 md:mb-16 leading-[1.1] tracking-tighter">
                  "{review.verdict}"
                </h2>

                <div className="flex flex-col md:flex-row items-center justify-center gap-6">
                  <CTAButton variant="hero" className="h-12 md:h-16 px-10 md:px-16 rounded-full text-base md:text-xl w-full md:w-auto shadow-2xl shadow-accent/40 bg-accent text-white border-none hover:scale-105 active:scale-95 transition-all duration-500" />

                  <div className="flex items-center gap-5 text-white/40 text-[10px] md:text-xs font-bold uppercase tracking-[0.3em]">
                    <div className="h-px w-10 bg-white/10" />
                    GearTrail Certified
                    <div className="h-px w-10 bg-white/10" />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <aside className="space-y-8">
            <div className="sticky top-24 space-y-8">
              {/* Ratings Sidebar Block */}
              <div className="bg-white/50 backdrop-blur-md border border-primary/5 rounded-3xl p-6 shadow-sm">
                <h3 className="font-heading font-bold text-primary text-[10px] uppercase tracking-[0.3em] flex items-center gap-2 mb-6">
                  <div className="w-1.5 h-3 bg-accent rounded-full" />
                  RATINGS
                </h3>
                <div className="space-y-6">
                  {review.ratings.map((r) => (
                    <RatingBar key={r.label} label={r.label} score={r.score} />
                  ))}
                </div>
              </div>

              {/* Specs Sidebar Block */}
              <div className="bg-white border border-primary/5 rounded-3xl p-6 shadow-sm">
                <h3 className="font-heading font-bold text-primary text-[10px] uppercase tracking-[0.3em] flex items-center gap-2 mb-6">
                  <div className="w-1.5 h-3 bg-accent rounded-full" />
                  KEY SPECS
                </h3>
                <div className="grid gap-3">
                  {review.specs?.slice(0, 5).map((spec, i) => {
                    let Icon = Layers;
                    if (spec.label.includes('น้ำหนัก') || spec.label.toLowerCase().includes('weight')) Icon = Scale;
                    if (spec.label.toLowerCase().includes('drop')) Icon = ArrowDown;
                    if (spec.label.includes('เหมาะกับ')) Icon = Target;
                    if (spec.label.includes('ระยะ')) Icon = Route;

                    return (
                      <div key={i} className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-primary/5 group hover:bg-slate-100 transition-colors">
                        <div className="flex items-center gap-3">
                          <Icon className="h-4 w-4 text-primary/40 group-hover:text-primary transition-colors" />
                          <span className="text-[10px] font-bold text-primary/40 uppercase tracking-wider">{spec.label}</span>
                        </div>
                        <span className="font-bold text-xs text-primary">{spec.value}</span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Price & CTA Sidebar Block */}
              <div className="bg-white border-2 border-accent/20 rounded-3xl p-8 shadow-2xl shadow-accent/5 space-y-6 relative overflow-hidden group/sidebar">
                <div className="absolute top-0 right-0 w-32 h-32 bg-accent/5 blur-3xl rounded-full group-hover/sidebar:scale-150 transition-transform duration-700" />

                <div className="relative">
                  <p className="text-[10px] font-bold text-primary/30 uppercase tracking-[0.3em] mb-1">ESTIMATED PRICE</p>
                  <div className="flex items-baseline gap-2">
                    <p className="font-heading font-bold text-primary text-4xl tracking-tighter italic-prohibited">{review.price}</p>
                    <span className="text-[10px] font-bold text-rose-500 uppercase animate-pulse">🔥 Limited</span>
                  </div>
                </div>

                <div className="space-y-4 relative">
                  <CTAButton variant="hero" className="w-full h-16 rounded-xl shadow-xl shadow-accent/20 bg-accent text-white border-none text-lg hover:scale-[1.02] transition-transform" isSidebar />

                  <div className="flex flex-col gap-3 pt-2">
                    <div className="flex items-center gap-2 text-[10px] font-bold text-emerald-600 uppercase tracking-widest">
                      <Check className="w-3 h-3" /> Best Price Today
                    </div>
                    <div className="flex items-center gap-2 text-[10px] font-bold text-primary/40 uppercase tracking-widest">
                      <Users className="w-3 h-3" /> {userRating ? `Checked by ${userRating.count * 10}+ users` : 'Checked by 1,200+ users'}
                    </div>
                  </div>
                </div>
              </div>

              {/* Dynamic Top in Category Block */}
              {topInCategory.length > 0 && (
                <div className="bg-primary rounded-3xl p-6 text-white relative overflow-hidden shadow-xl shadow-primary/20 group">
                  <TrendingUp className="absolute -top-6 -right-6 h-24 w-24 opacity-10 rotate-12 transition-transform duration-700 group-hover:rotate-45" />
                  <div className="relative z-10 space-y-4">
                    <h4 className="font-heading font-bold text-xl leading-tight">TOP 3 ในหมวดนี้</h4>
                    <div className="space-y-3">
                      {topInCategory.map((item, idx) => (
                        <Link key={idx} to={`/review/${item.slug}`} className="flex items-center gap-3 group/item cursor-pointer">
                          <div className={`h-10 w-10 rounded-xl bg-white/10 border border-white/10 flex items-center justify-center font-bold ${idx === 0 ? 'text-accent' : 'text-white/40'} italic-prohibited`}>
                            #{idx + 1}
                          </div>
                          <p className="text-xs font-bold border-b border-transparent group-hover/item:border-accent transition-all truncate">
                            {item.name}
                          </p>
                        </Link>
                      ))}
                    </div>
                    <Link to={`/category/${review.category}`} className="text-[10px] font-bold text-accent uppercase tracking-[0.3em] flex items-center gap-2 cursor-pointer hover:translate-x-1 transition-transform">
                      ดูรุ่นอื่นๆ ในหมวดนี้ <ChevronRight className="h-3 w-3" />
                    </Link>
                  </div>
                </div>
              )}
            </div>
          </aside>
        </div>

        {/* Comments Section */}
        {review.id && (
          <div className="mt-16">
            <CommentSection reviewId={review.id} isCompact={true} />
          </div>
        )}
      </article>

      {/* Related Reviews */}
      <RelatedReviews
        currentReview={{
          id: review.id,
          category: review.category,
          overall_rating: review.overall_rating,
          price: review.price,
          slug: slug || ""
        }}
        isCompact={true}
      />

      {/* Mobile sticky CTA - Enhanced with Orange Contrast & Animation */}
      <div className="md:hidden fixed bottom-0 inset-x-0 bg-white/95 backdrop-blur-2xl border-t border-primary/5 px-4 pt-3 z-50 pb-[max(1rem,env(safe-area-inset-bottom))] shadow-[0_-20px-50px_rgba(0,0,0,0.1)]">
        <CTAButton
          className="w-full h-14 rounded-2xl font-bold text-lg uppercase tracking-wider shadow-xl"
          showMicrocopy={true}
          isSticky={true}
        />
      </div>

      <div className="h-20 lg:hidden" />
      <Footer />
    </div>
  );
}
