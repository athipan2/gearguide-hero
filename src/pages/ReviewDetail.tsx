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
import { ScoreGauge } from "@/components/ScoreGauge";
import { useComparisonStore } from "@/lib/comparison-store";
import { toast } from "sonner";
import { ReviewDetailSkeleton } from "@/components/ReviewSkeleton";
import {
  ExternalLink, ArrowLeft, ThumbsUp, ThumbsDown, Award,
  ChevronRight, Plus, Check, X, Zap, Quote, Share2,
  Scale, ArrowDown, Layers, Footprints, Target, Route, Star, TrendingUp, Users
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
    affiliate_url: "https://shope.ee/test", cta_text: "ดูราคาล่าสุด",
  },
};

const badgeColors: Record<string, string> = {
  "แนะนำ": "bg-emerald-500 text-white",
  "คุ้มค่าที่สุด": "bg-orange-500 text-white",
  "Top Pick": "bg-primary text-white",
};

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
  const [userRating, setUserRating] = useState<{ average: number; count: number } | null>(null);
  const [loading, setLoading] = useState(true);
  const [isComparing, setIsComparing] = useState(false);

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
          <h1 className="font-heading text-3xl font-semibold mb-4">ไม่พบรีวิว</h1>
          <Link to="/"><Button variant="cta">กลับหน้าหลัก</Button></Link>
        </div>
        <Footer />
      </div>
    );
  }

  const microcopy = [
    "🔥 ราคาดีสุดวันนี้",
    "⚡ อัปเดตราคาล่าสุด",
    "🏷️ เช็คโปรโมชั่นตอนนี้",
    "✨ การันตีของแท้ 100%"
  ];
  const randomMicrocopy = microcopy[Math.floor(Math.random() * microcopy.length)];

  const ctaText = review.cta_text || "ดูราคาล่าสุด";
  const ctaProps = review.affiliate_url
    ? { href: review.affiliate_url, target: "_blank", rel: "noopener noreferrer nofollow" }
    : {};

  const CTAButton = ({ className, variant = "hero", isSidebar = false }: { className?: string, variant?: any, isSidebar?: boolean }) => (
    <div className="flex flex-col gap-2">
      <Button variant={variant} size="lg" className={`${className} group relative overflow-hidden`} asChild={!!review.affiliate_url}>
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
      {!isSidebar && (
        <p className="text-[10px] md:text-xs text-center font-bold text-accent uppercase tracking-widest animate-pulse">
          {randomMicrocopy}
        </p>
      )}
    </div>
  );

  return (
    <div className="min-h-screen bg-[#f2f1ec] selection:bg-accent/30 selection:text-primary">
      <SEOHead
        title={`${review.name} รีวิว — GearTrail`}
        description={`รีวิว ${review.name} จาก ${review.brand}: ${(review.intro || "").slice(0, 120)}...`}
        image={review.image_url || undefined}
        canonical={`https://gearguide-hero.lovable.app/review/${slug}`}
      />
      <Navbar />

      {/* Breadcrumb */}
      <div className="container mx-auto px-4 pt-8 pb-4">
        <nav className="flex items-center gap-2 text-[10px] md:text-xs font-bold uppercase tracking-[0.2em] text-slate-400">
          <Link to="/" className="hover:text-primary transition-colors">HOME</Link>
          <ChevronRight className="h-3 w-3" />
          <span className="hover:text-primary transition-colors cursor-pointer">{review.category}</span>
          <ChevronRight className="h-3 w-3" />
          <span className="text-primary">{review.name}</span>
        </nav>
      </div>

      <article className="container mx-auto px-4 pb-16 md:pb-24">
        {/* Hero Section */}
        <div className="grid md:grid-cols-[40fr_60fr] gap-8 md:gap-20 mb-16 md:mb-24 items-start">
          <div className="relative">
            <ImageGallery
              mainImage={review.image_url || ""}
              images={review.images}
              alt={review.name}
              badge={review.badge}
              badgeClassName={badgeColors[review.badge || ""] || "bg-primary text-white"}
              badgeIcon={<Award className="h-4 w-4" />}
            />
          </div>

          <div className="flex flex-col space-y-8 md:space-y-10">
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="h-px w-8 bg-accent" />
                <p className="text-[10px] md:text-xs font-bold text-accent uppercase tracking-[0.3em]">{review.brand} // {review.category}</p>
              </div>

              <h1 className="font-heading text-5xl sm:text-6xl md:text-8xl font-semibold text-primary leading-[1.1] tracking-tighter uppercase break-words">
                {review.name}
              </h1>

              <div className="flex items-center gap-4 text-sm font-bold text-primary/60">
                <div className="flex items-center gap-1.5 bg-white/60 px-3 py-1.5 rounded-full border border-primary/5">
                  <Star className="w-4 h-4 fill-accent text-accent" />
                  <span>{review.overall_rating} / 5</span>
                </div>
                <div className="flex items-center gap-1.5 bg-white/60 px-3 py-1.5 rounded-full border border-primary/5">
                  <TrendingUp className="w-4 h-4 text-emerald-500" />
                  <span>ขายดีอันดับ 1 ในหมวด</span>
                </div>
              </div>
            </div>

            {/* Quick Summary Card */}
            <div className="bg-white/80 backdrop-blur-sm border border-primary/5 rounded-[2.5rem] p-8 md:p-10 shadow-sm relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-32 h-32 bg-accent/5 blur-3xl rounded-full transition-transform duration-700 group-hover:scale-150" />

              <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 relative z-10">
                <div className="space-y-2">
                  <p className="text-[9px] font-bold text-primary/30 uppercase tracking-[0.2em] flex items-center gap-1.5">
                    <Target className="w-3 h-3" /> เหมาะกับ
                  </p>
                  <p className="text-sm font-bold text-primary leading-tight">{review.specs?.find(s => s.label.includes('เหมาะกับ'))?.value || 'Daily Training'}</p>
                </div>
                <div className="space-y-2">
                  <p className="text-[9px] font-bold text-primary/30 uppercase tracking-[0.2em] flex items-center gap-1.5">
                    <X className="w-3 h-3" /> ไม่เหมาะกับ
                  </p>
                  <p className="text-sm font-bold text-primary leading-tight">หน้าเท้ากว้างมาก</p>
                </div>
                <div className="space-y-2">
                  <p className="text-[9px] font-bold text-primary/30 uppercase tracking-[0.2em] flex items-center gap-1.5">
                    <Route className="w-3 h-3" /> ระยะวิ่ง
                  </p>
                  <p className="text-sm font-bold text-primary leading-tight">{review.specs?.find(s => s.label.includes('ระยะทาง'))?.value || '10K - Marathon'}</p>
                </div>
                <div className="space-y-2">
                  <p className="text-[9px] font-bold text-primary/30 uppercase tracking-[0.2em] flex items-center gap-1.5">
                    <Users className="w-3 h-3" /> ระดับผู้ใช้
                  </p>
                  <p className="text-sm font-bold text-primary leading-tight">Inter / Elite</p>
                </div>
              </div>
            </div>

            <p className="text-lg md:text-2xl font-medium text-slate-600 leading-[1.8] max-w-3xl">
              {review.intro}
            </p>

            <div className="flex flex-wrap gap-4 pt-4">
              <CTAButton className="flex-1 md:flex-none h-16 md:h-20 px-10 md:px-14 rounded-2xl shadow-2xl shadow-accent/20 bg-accent text-white border-none active:scale-95 transition-all" />

              <Button
                variant="outline"
                size="lg"
                className="flex-1 md:flex-none h-16 md:h-20 px-8 md:px-10 rounded-2xl border-primary/10 bg-white hover:bg-slate-50 text-primary font-bold text-xs uppercase tracking-widest transition-all active:scale-95"
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

        <div className="grid lg:grid-cols-3 gap-16 md:gap-24">
          <div className="lg:col-span-2 space-y-20 md:space-y-32">
            {/* Pros / Cons */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 md:gap-12">
              <div className="bg-emerald-50/20 border border-emerald-100/30 rounded-[2.5rem] p-10 md:p-14 transition-all duration-500 group relative overflow-hidden shadow-sm hover:shadow-md">
                <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/5 blur-3xl rounded-full -translate-y-1/2 translate-x-1/2" />
                <div className="flex items-center gap-5 mb-10 md:mb-14">
                  <div className="h-14 w-14 rounded-2xl bg-emerald-500 flex items-center justify-center shadow-lg shadow-emerald-500/20">
                    <ThumbsUp className="h-7 w-7 text-white" />
                  </div>
                  <div>
                    <h3 className="font-heading font-semibold text-emerald-900 uppercase tracking-[0.3em] text-[10px] md:text-xs mb-1.5">PROS</h3>
                    <p className="text-emerald-700/60 font-bold text-[10px] md:text-xs uppercase tracking-widest">จุดเด่นที่ประทับใจ</p>
                  </div>
                </div>
                <ul className="space-y-6 md:space-y-8">
                  {review.pros.map((p) => (
                    <li key={p} className="flex items-start gap-5 text-base md:text-2xl font-bold text-slate-800 leading-snug group/item">
                      <div className="h-7 w-7 rounded-full bg-emerald-500/10 flex items-center justify-center shrink-0 mt-0.5 group-hover/item:bg-emerald-500 group-hover/item:text-white transition-all">
                        <Check className="h-4 w-4" />
                      </div>
                      {p}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="bg-rose-50/20 border border-rose-100/30 rounded-[2.5rem] p-10 md:p-14 transition-all duration-500 group relative overflow-hidden shadow-sm hover:shadow-md">
                <div className="absolute top-0 right-0 w-32 h-32 bg-rose-500/5 blur-3xl rounded-full -translate-y-1/2 translate-x-1/2" />
                <div className="flex items-center gap-5 mb-10 md:mb-14">
                  <div className="h-14 w-14 rounded-2xl bg-rose-500 flex items-center justify-center shadow-lg shadow-rose-500/20">
                    <ThumbsDown className="h-7 w-7 text-white" />
                  </div>
                  <div>
                    <h3 className="font-heading font-semibold text-rose-900 uppercase tracking-[0.3em] text-[10px] md:text-xs mb-1.5">CONS</h3>
                    <p className="text-rose-700/60 font-bold text-[10px] md:text-xs uppercase tracking-widest">จุดที่ควรพิจารณา</p>
                  </div>
                </div>
                <ul className="space-y-6 md:space-y-8">
                  {review.cons.map((c) => (
                    <li key={c} className="flex items-start gap-5 text-base md:text-2xl font-bold text-slate-800 leading-snug group/item">
                      <div className="h-7 w-7 rounded-full bg-rose-500/10 flex items-center justify-center shrink-0 mt-0.5 group-hover/item:bg-rose-500 group-hover/item:text-white transition-all">
                        <X className="h-4 w-4" />
                      </div>
                      {c}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Sections */}
            <div className="space-y-24 md:space-y-40">
              {review.sections.map((s) => (
                <div key={s.title} className="group">
                  <h2 className="font-heading text-2xl md:text-6xl font-semibold text-primary uppercase tracking-tighter flex items-center gap-6 mb-10 md:mb-14 leading-none group-hover:translate-x-3 transition-transform duration-700">
                    <span className="h-10 md:h-16 w-3 bg-accent rounded-full shadow-lg shadow-accent/20" />
                    {s.title}
                  </h2>
                  <p className="text-slate-600 text-lg md:text-3xl leading-[1.8] whitespace-pre-wrap font-medium border-l-[6px] border-primary/5 pl-8 md:pl-14">
                    {s.body}
                  </p>
                </div>
              ))}
            </div>

            {/* Verdict Card */}
            <div className="bg-primary rounded-[3rem] md:rounded-[5rem] p-12 md:p-32 shadow-[0_50px_100px_-20px_rgba(10,26,10,0.5)] relative overflow-hidden group border border-white/5">
              <div className="absolute top-0 right-0 w-[40rem] h-[40rem] bg-accent/10 blur-[120px] -translate-y-1/2 translate-x-1/2 pointer-events-none" />
              <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-[0.05] pointer-events-none" />

              <div className="relative z-10 max-w-5xl mx-auto text-center">
                <div className="inline-flex items-center gap-3 px-8 py-3 bg-white/5 backdrop-blur-2xl border border-white/10 text-white rounded-full text-[10px] md:text-xs font-bold uppercase tracking-[0.4em] mb-12 md:mb-20">
                  <Zap className="h-4 w-4 fill-accent text-accent animate-pulse" />
                  THE ULTIMATE VERDICT
                </div>

                <h2 className="font-heading text-3xl md:text-7xl lg:text-8xl font-semibold text-white mb-16 md:mb-24 leading-[1.1] tracking-tighter">
                  "{review.verdict}"
                </h2>

                <div className="flex flex-col md:flex-row items-center justify-center gap-8">
                  <CTAButton variant="hero" className="h-16 md:h-24 px-12 md:px-24 rounded-full text-lg md:text-3xl w-full md:w-auto shadow-2xl shadow-accent/40 bg-accent text-white border-none hover:scale-105 active:scale-95 transition-all duration-500" />

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
          <aside className="space-y-12">
            <div className="sticky top-24 space-y-12">
              {/* Ratings Sidebar Block */}
              <div className="bg-white/50 backdrop-blur-md border border-primary/5 rounded-[2.5rem] p-10 shadow-sm">
                <h3 className="font-heading font-bold text-primary text-[10px] uppercase tracking-[0.3em] flex items-center gap-3 mb-10">
                  <div className="w-1.5 h-4 bg-accent rounded-full" />
                  RATINGS
                </h3>
                <div className="space-y-8">
                  {review.ratings.map((r) => (
                    <RatingBar key={r.label} label={r.label} score={r.score} />
                  ))}
                </div>
              </div>

              {/* Specs Sidebar Block */}
              <div className="bg-white/50 backdrop-blur-md border border-primary/5 rounded-[2.5rem] p-10 shadow-sm">
                <h3 className="font-heading font-bold text-primary text-[10px] uppercase tracking-[0.3em] flex items-center gap-3 mb-10">
                  <div className="w-1.5 h-4 bg-accent rounded-full" />
                  TECHNICAL SPECS
                </h3>
                <div className="grid gap-6">
                  {[
                    { icon: Scale, label: "น้ำหนัก (WEIGHT)", value: review.specs?.find(s => s.label.toLowerCase().includes('weight') || s.label.includes('น้ำหนัก'))?.value || '-' },
                    { icon: ArrowDown, label: "DROP", value: review.specs?.find(s => s.label.toLowerCase().includes('drop'))?.value || '-' },
                    { icon: Layers, label: "พื้นรองเท้า (MIDSOLE)", value: review.specs?.find(s => s.label.toLowerCase().includes('midsole') || s.label.includes('พื้นรองเท้า'))?.value || '-' },
                  ].map((spec, i) => (
                    <div key={i} className="flex items-center gap-5 p-4 rounded-2xl bg-[#f2f1ec]/50 border border-transparent hover:border-primary/5 transition-all group">
                      <div className="h-14 w-14 rounded-2xl bg-white border border-primary/5 flex items-center justify-center text-primary/30 shadow-sm group-hover:bg-primary group-hover:text-white transition-all">
                        <spec.icon className="h-6 w-6" />
                      </div>
                      <div className="flex flex-col">
                        <span className="text-[9px] font-bold text-primary/30 tracking-widest uppercase mb-0.5">{spec.label}</span>
                        <span className="font-bold text-base text-primary leading-tight">{spec.value}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Price & CTA Sidebar Block */}
              <div className="bg-white/50 backdrop-blur-md border border-primary/5 rounded-[2.5rem] p-10 shadow-sm space-y-8">
                <div>
                  <p className="text-[10px] font-bold text-primary/30 uppercase tracking-[0.3em] mb-2">ESTIMATED PRICE</p>
                  <p className="font-heading font-bold text-primary text-5xl tracking-tighter italic-prohibited">{review.price}</p>
                </div>
                <CTAButton variant="hero" className="w-full h-20 rounded-2xl shadow-xl shadow-accent/20 bg-accent text-white border-none text-lg" isSidebar />
                <p className="text-[9px] text-center font-bold text-slate-400 uppercase tracking-widest flex items-center justify-center gap-2">
                  <Users className="w-3 h-3" /> เช็คโดยผู้ใช้แล้วกว่า 1,200 ครั้ง
                </p>
              </div>

              {/* Similar Products Block */}
              <div className="bg-primary rounded-[2.5rem] p-10 text-white relative overflow-hidden shadow-xl shadow-primary/20 group">
                <TrendingUp className="absolute -top-6 -right-6 h-32 w-32 opacity-10 rotate-12 transition-transform duration-700 group-hover:rotate-45" />
                <div className="relative z-10 space-y-6">
                  <h4 className="font-heading font-bold text-2xl leading-tight">TOP 3 ในหมวดนี้</h4>
                  <div className="space-y-4">
                    <div className="flex items-center gap-4 group/item cursor-pointer">
                      <div className="h-12 w-12 rounded-xl bg-white/10 border border-white/10 flex items-center justify-center font-bold text-accent italic-prohibited">#1</div>
                      <p className="text-sm font-bold border-b border-transparent group-hover/item:border-accent transition-all">Nike Vaporfly 3</p>
                    </div>
                    <div className="flex items-center gap-4 group/item cursor-pointer">
                      <div className="h-12 w-12 rounded-xl bg-white/10 border border-white/10 flex items-center justify-center font-bold text-white/40 italic-prohibited">#2</div>
                      <p className="text-sm font-bold border-b border-transparent group-hover/item:border-accent transition-all">Asics Metaspeed Sky+</p>
                    </div>
                    <div className="flex items-center gap-4 group/item cursor-pointer">
                      <div className="h-12 w-12 rounded-xl bg-white/10 border border-white/10 flex items-center justify-center font-bold text-white/40 italic-prohibited">#3</div>
                      <p className="text-sm font-bold border-b border-transparent group-hover/item:border-accent transition-all">Adidas Adios Pro 3</p>
                    </div>
                  </div>
                  <p className="text-[10px] font-bold text-accent uppercase tracking-[0.3em] flex items-center gap-2 cursor-pointer hover:translate-x-1 transition-transform">
                    ดูรุ่นอื่นๆ ที่น่าสนใจ <ChevronRight className="h-3 w-3" />
                  </p>
                </div>
              </div>
            </div>
          </aside>
        </div>

        {/* Comments Section */}
        {review.id && (
          <div className="mt-32">
            <CommentSection reviewId={review.id} />
          </div>
        )}
      </article>

      {/* Related Reviews */}
      <RelatedReviews currentReview={{
        id: review.id,
        category: review.category,
        overall_rating: review.overall_rating,
        price: review.price,
        slug: slug || ""
      }} />

      {/* Mobile sticky CTA */}
      <div className="lg:hidden fixed bottom-0 inset-x-0 bg-white/80 backdrop-blur-2xl border-t border-primary/5 p-4 z-50 pb-[max(1.5rem,env(safe-area-inset-bottom))] shadow-[0_-20px_50px_rgba(0,0,0,0.1)]">
        <div className="flex items-center gap-4">
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="icon"
              className="h-16 w-16 shrink-0 rounded-2xl border-primary/10 bg-white shadow-sm active:scale-90 transition-all"
              onClick={() => {
                if (navigator.share) {
                  navigator.share({ title: review.name, text: review.intro || "", url: window.location.href }).catch(() => {});
                } else {
                  navigator.clipboard.writeText(window.location.href);
                  toast.success("คัดลอกลิงก์แล้ว");
                }
              }}
            >
              <Share2 className="w-7 h-7 text-primary/60" />
            </Button>

            <Button
              variant="outline"
              size="icon"
              className="h-16 w-16 shrink-0 rounded-2xl border-primary/10 bg-white shadow-sm active:scale-90 transition-all"
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
              <Scale className="w-7 h-7 text-primary/60" />
            </Button>
          </div>

          <Button
            className="flex-1 h-16 rounded-2xl font-bold text-sm uppercase tracking-widest shadow-2xl shadow-accent/20 bg-accent text-white border-none active:scale-95 transition-all"
            asChild={!!review.affiliate_url}
          >
            {review.affiliate_url ? (
              <a {...ctaProps}>{ctaText}</a>
            ) : (
              <div>{ctaText}</div>
            )}
          </Button>
        </div>
      </div>

      <div className="h-20 lg:hidden" />
      <Footer />
    </div>
  );
}
