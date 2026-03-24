import { useEffect, useState, useMemo } from "react";
import { useParams, Link } from "react-router-dom";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { SEOHead } from "@/components/SEOHead";
import { Button, type ButtonProps } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { CommentSection } from "@/components/CommentSection";
import { RelatedReviews } from "@/components/RelatedReviews";
import { useComparisonStore } from "@/lib/comparison-store";
import { toast } from "sonner";
import { ReviewDetailSkeleton } from "@/components/ReviewSkeleton";
import { cn, parseThaiPrice } from "@/lib/utils";
import {
  ExternalLink, ChevronRight, Check, Scale,
  TrendingUp, Users, ArrowDown, Layers, Target, Route
} from "lucide-react";
import { ReviewData, ReviewSectionData } from "@/types/review";
import { SectionRenderer } from "@/components/review/SectionRenderer";
import { ReviewSpecs } from "@/components/review/sections/ReviewSpecs";

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
      { label: "น้ำหนัก", value: "ชาย ~232 กรัม (US 9) / หญิง ~190 กรั0 (US 8)", highlight: true },
      { label: "Drop", value: "8mm", highlight: true },
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
      { type: 'hero' },
      { type: 'who_is_this_for' },
      { type: 'pros_cons' },
      { type: 'content', title: "ความรู้สึกขณะวิ่ง", body: "ตั้งแต่ก้าวแรกจะรู้สึกถึงความเบาและแรงดีดที่ชัดเจน พื้น ZoomX ให้ความนุ่มแต่ไม่หยุ่นจนเสียความเสถียร ทำให้วิ่งเร็วได้อย่างมั่นใจ เหมาะกับ pace ที่เร็วกว่า 5:00/km ขึ้นไป" },
      { type: 'content', title: "การเกาะถนน", body: "พื้นนอก Rubber Waffle ยึดเกาะได้ดีบนถนนแห้ง แต่ในสภาพเปียกจะลื่นเล็กน้อย ไม่แนะนำให้ใช้บนเส้นทางที่มีน้ำขัง" },
      { type: 'content', title: "ความทนทาน", body: "จากการทดสอบ 350 กม. พบว่า ZoomX เริ่มยุบตัวเล็กน้อยที่ส้นเท้า แต่ยังคงประสิทธิภาพได้ดี สำหรับใช้แข่งอย่างเดียวสามารถใช้ได้หลายเรส" },
      { type: 'comparison' },
      { type: 'verdict' }
    ],
    verdict: "Nike Vaporfly 3 ยังคงเป็นตัวเลือกอันดับ 1 สำหรับนักวิ่งที่ต้องการ PR ในการแข่ง แม้ราคาจะสูงแต่ประสิทธิภาพคุ้มค่าทุกบาท เหมาะกับนักวิ่งที่จริงจังเรื่องเวลา",
    affiliate_url: "https://shope.ee/test", cta_text: "ดูราคาล่าสุด",
  },
};

const ratingExplanations: Record<string, string> = {
  "ความเบา": "น้ำหนักรวมส่งผลต่อความล้าเมื่อวิ่งระยะไกล",
  "แรงคืนตัว": "ความเด้งของโฟมที่ช่วยส่งแรงไปข้างหน้า",
  "ความทนทาน": "อายุการใช้งานของพื้นยางและอัปเปอร์",
  "ความคุ้มค่า": "เทียบประสิทธิภาพกับราคาที่จ่ายไป",
  "ความสบาย": "ความนุ่มและการโอบรัดของอัปเปอร์",
  "การเกาะถนน": "ความมั่นใจเมื่อวิ่งบนพื้นผิวที่หลากหลาย",
  "ความเสถียร": "ความมั่นคงของส้นเท้าและกลางเท้า"
};

function RatingBar({ label, score }: { label: string; score: number }) {
  return (
    <div className="space-y-1.5 md:space-y-2.5 group">
      <div className="flex justify-between items-end gap-2">
        <div className="flex flex-col">
          <span className="text-xs md:text-sm font-bold uppercase tracking-widest text-slate-500 group-hover:text-primary transition-colors">{label}</span>
          <span className="text-xs text-slate-400 font-medium leading-tight mt-0.5 hidden md:block">{ratingExplanations[label] || "คะแนนตามเกณฑ์มาตรฐานการทดสอบ"}</span>
        </div>
        <span className="text-sm font-bold text-primary tabular-nums">{score.toFixed(1)}</span>
      </div>
      <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden border border-slate-200/30 relative">
        <div
          className="h-full bg-primary rounded-full transition-all duration-1000 ease-out relative z-10"
          style={{ width: `${(score / 5) * 100}%` }}
        />
        <div className="absolute inset-0 bg-shimmer/10 animate-shimmer -z-0" />
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
        "price": parseThaiPrice(review.price),
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
          sections: (data.sections as unknown as ReviewSectionData[]) || [],
          affiliate_url: data.affiliate_url, cta_text: data.cta_text,
          slug: data.slug
        };
        setReview(currentReview);
      } else if (fallbackData[slug]) {
        currentReview = fallbackData[slug];
        currentReview.slug = slug;
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
            sections: (d.sections as unknown as ReviewSectionData[]) || [],
            affiliate_url: d.affiliate_url,
            cta_text: d.cta_text,
            slug: d.slug || ""
          })));
        }

        // Fetch dynamic user rating count
        if (currentReview.id) {
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
      }

      setLoading(false);
    };
    fetchReview();
  }, [slug]);

  const defaultSections: ReviewSectionData[] = useMemo(() => {
    if (!review) return [];

    // If sections already exist and have the new structure, use them
    if (review.sections.length > 0 && review.sections[0].type) {
      return review.sections;
    }

    // Otherwise, generate default layout from legacy sections and data
    const layout: ReviewSectionData[] = [
      { type: 'hero' },
      { type: 'who_is_this_for' },
      { type: 'pros_cons' }
    ];

    // Add legacy sections
    review.sections.forEach(s => {
      layout.push({ type: 'content', title: s.title, body: s.body });
    });

    layout.push({ type: 'comparison' });
    layout.push({ type: 'verdict' });

    return layout;
  }, [review]);

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

  const ctaText = review.cta_text || "ดูราคาล่าสุด";
  const ctaProps = review.affiliate_url
    ? { href: review.affiliate_url, target: "_blank", rel: "noopener noreferrer nofollow" }
    : {};

  return (
    <div className="min-h-screen bg-[var(--background)] selection:bg-accent/30 selection:text-primary pb-[160px] md:pb-20">
      <SEOHead
        title={`${review.name} รีวิว — GearTrail`}
        description={`รีวิว ${review.name} จาก ${review.brand}: ${(review.intro || "").slice(0, 120)}...`}
        image={review.image_url || undefined}
        canonical={`https://gearguide-hero.lovable.app/review/${slug}`}
        jsonLd={jsonLd}
      />
      <Navbar />

      <article className="max-w-[1400px] mx-auto pb-12 md:pb-16 px-4 md:px-6 lg:px-8">
        <div className="max-w-[800px] mx-auto lg:mx-0">
          <div className="hidden md:flex items-center gap-4 text-xs font-bold uppercase tracking-[0.2em] text-slate-400 py-12">
            <Link to="/" className="hover:text-primary transition-colors">HOME</Link>
            <ChevronRight className="h-3 w-3" />
            <span className="hover:text-primary transition-colors cursor-pointer">{review.category}</span>
            <ChevronRight className="h-3 w-3" />
            <span className="text-primary">{review.name}</span>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-12 md:gap-16 px-3 md:px-0">
          <div className="lg:col-span-2 space-y-12 md:space-y-16">
            {defaultSections.map((section, idx) => (
              <SectionRenderer
                key={idx}
                section={section}
                review={review}
                userRating={userRating}
              />
            ))}
          </div>

          <aside className="space-y-16">
            <div className="space-y-16">
              <div className="bg-white/50 backdrop-blur-md border border-primary/5 rounded-3xl p-8 shadow-sm">
                <h3 className="font-heading font-bold text-primary text-xs uppercase tracking-[0.3em] flex items-center gap-2 mb-8">
                  <div className="w-2 h-4 bg-accent rounded-full" />
                  รายละเอียดคะแนน
                </h3>
                <div className="space-y-8">
                  {review.ratings.map((r) => (
                    <RatingBar key={r.label} label={r.label} score={r.score} />
                  ))}
                </div>
              </div>

              <ReviewSpecs specs={review.specs} />

              <div className="sticky top-24 bg-white border border-neutral-200 rounded-3xl p-8 shadow-sm space-y-8">
                <div className="relative">
                  <p className="text-xs font-bold text-primary/30 uppercase tracking-[0.3em] mb-1">ราคาโดยประมาณ</p>
                  <div className="flex items-baseline gap-2">
                    <p className="font-heading font-bold text-primary text-5xl tracking-tighter italic-prohibited">{review.price}</p>
                    <span className="text-xs font-bold text-rose-500 uppercase animate-pulse">🔥 ราคาดีสุด</span>
                  </div>
                </div>

                <div className="space-y-6 relative">
                  <Button
                    variant="hero"
                    size="lg"
                    className="w-full h-14 rounded-xl shadow-md bg-accent text-white border-none text-lg font-semibold hover:shadow-lg transition-all"
                    asChild={!!review.affiliate_url}
                  >
                    {review.affiliate_url ? (
                      <a {...ctaProps} className="flex items-center gap-2">
                        <span>เช็คราคา + รีวิว Shopee</span>
                        <ExternalLink className="h-5 w-5" />
                      </a>
                    ) : (
                      <div className="flex items-center gap-2">
                        {ctaText}
                        <ExternalLink className="h-5 w-5" />
                      </div>
                    )}
                  </Button>

                  <div className="flex flex-col gap-3 pt-2">
                    <div className="flex items-center gap-2 text-xs font-bold text-emerald-600 uppercase tracking-widest">
                      <Check className="w-4 h-4" /> ตรวจสอบราคาล่าสุดอัตโนมัติ
                    </div>
                    <div className="flex items-center gap-2 text-xs font-bold text-primary/40 uppercase tracking-widest">
                      <Users className="w-4 h-4" /> {userRating ? `มีผู้เข้าชมแล้ว ${userRating.count * 15}+ คน` : 'มีผู้เข้าชมแล้ว 1,200+ คน'}
                    </div>
                  </div>
                </div>
              </div>

              {topInCategory.length > 0 && (
                <div className="bg-primary rounded-3xl p-8 text-white relative overflow-hidden shadow-xl shadow-primary/20 group">
                  <TrendingUp className="absolute -top-6 -right-6 h-24 w-24 opacity-10 rotate-12 transition-transform duration-700 group-hover:rotate-45" />
                  <div className="relative z-10 space-y-8">
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
                    <Link to={`/category/${review.category}`} className="text-xs font-bold text-accent uppercase tracking-[0.3em] flex items-center gap-2 cursor-pointer hover:translate-x-1 transition-transform">
                      ดูรุ่นอื่นๆ ในหมวดนี้ <ChevronRight className="h-3 w-3" />
                    </Link>
                  </div>
                </div>
              )}
            </div>
          </aside>
        </div>

        {review.id && (
          <div className="mt-12 md:mt-16 max-w-[800px] mx-auto lg:mx-0">
            <CommentSection reviewId={review.id} isCompact={true} />
          </div>
        )}
      </article>

      <div className="mt-24 md:mt-32">
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
      </div>

      <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white border-t p-3 shadow-[0_-10px-40px_rgba(0,0,0,0.1)]">
        <div className="flex flex-col gap-3">
          <div className="flex items-center justify-between px-3">
            <div className="flex flex-col">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">ราคาล่าสุด</span>
              <span className="text-xl font-heading font-bold text-primary italic-prohibited">{review.price}</span>
            </div>
            <div className="flex items-center gap-1 bg-accent/10 px-3 py-1 rounded-full">
              <span className="text-xs font-bold text-accent uppercase tracking-widest">เช็คส่วนลดเพิ่ม</span>
            </div>
          </div>
          <div className="px-1">
            <Button
              variant="hero"
              size="lg"
              className="w-full h-14 rounded-xl font-bold text-lg uppercase tracking-wider shadow-xl shadow-accent/20 bg-accent hover:bg-accent/90 border-none"
              asChild={!!review.affiliate_url}
            >
              {review.affiliate_url ? (
                <a {...ctaProps} className="flex items-center gap-2">
                  <span>{ctaText}</span>
                  <ExternalLink className="h-5 w-5" />
                </a>
              ) : (
                <div className="flex items-center gap-2">
                  {ctaText}
                  <ExternalLink className="h-5 w-5" />
                </div>
              )}
            </Button>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
