import { useEffect, useState, useMemo } from "react";
import { useParams, Link } from "react-router-dom";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { SEOHead } from "@/components/SEOHead";
import { Button } from "@/components/ui/button";
import { dataService } from "@/lib/data-service";
import { CommentSection } from "@/components/CommentSection";
import { RelatedReviews } from "@/components/RelatedReviews";
import { ReviewDetailSkeleton } from "@/components/ReviewSkeleton";
import { parseThaiPrice } from "@/lib/utils";
import { ExternalLink, ChevronRight, ShoppingBag } from "lucide-react";
import { ReviewData, ReviewSectionData } from "@/types/review";
import { SectionRenderer } from "@/components/review/SectionRenderer";
import { useTranslation } from "@/hooks/useTranslation";
import { translateData } from "@/lib/translation-utils";

const fallbackData: Record<string, ReviewData> = {
  "nike-vaporfly-3": {
    name: "Nike Vaporfly 3", brand: "Nike", category: "รองเท้าวิ่งถนน", price: "฿8,500",
    image_url: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=1200&h=800&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=1200&h=800&fit=crop",
      "https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=1200&h=800&fit=crop"
    ],
    badge: "Top Pick", overall_rating: 4.8,
    ratings: [{ label: "Comfort", score: 4.7 }, { label: "Grip", score: 4.2 }, { label: "Durability", score: 3.8 }, { label: "Value", score: 3.5 }],
    specs: [
      { label: "Weight", value: "232g (US 9)", highlight: true },
      { label: "Drop", value: "8mm", highlight: true },
      { label: "ระยะดรอป", value: "5 mm", highlight: true },
      { label: "ระยะที่แนะนำ", value: "มาราธอน", highlight: true },
      { label: "Stack", value: "40mm / 32mm", highlight: true },
      { label: "Material", value: "ZoomX / Carbon Plate" },
      { label: "Width", value: "Standard" }
    ],
    pros: ["เบาที่สุดในกลุ่ม Racing Shoes", "ZoomX foam ให้แรงคืนตัวชั้นนำ", "Carbon plate ช่วย propulsion ดีเยี่ยม", "ทรงเท้ากว้างขึ้นจากรุ่นเดิม"],
    cons: ["ราคาสูงกว่าคู่แข่ง", "ทนทานได้ราว 300-400 กม.", "ไม่เหมาะกับวิ่งซ้อมทั่วไป"],
    intro: "Nike Vaporfly 3 ยังคงเป็นมาตรฐานของรองเท้าแข่งวิ่งระดับ Elite ด้วยชุดพื้น ZoomX ที่ให้แรงคืนตัวสูงสุดในตลาด ผสานกับแผ่น Carbon Plate ที่ช่วยส่งแรงไปข้างหน้าอย่างมีประสิทธิภาพ",
    sections: [
      { type: 'hero' },
      { type: 'quick_decision' },
      { type: 'score_breakdown' },
      { type: 'gallery' },
      { type: 'deep_dive', title: "Upper", body: "AtomKnit 2.0 ให้การระบายอากาศที่ยอดเยี่ยมและล็อคเท้าได้มั่นคงขึ้น" },
      { type: 'deep_dive', title: "Midsole", body: "Full-length ZoomX foam พร้อม Flyplate แผ่นคาร์บอนเต็มความยาว" },
      { type: 'deep_dive', title: "Outsole", body: "ยางบางลงแต่ทนทานขึ้น ดีไซน์ลายวาฟเฟิลใหม่" },
      { type: 'real_world_test', props: { terrain: "Road / Track", weather: "Dry / Hot", distance: "100km total test" } },
      { type: 'specs' },
      { type: 'comparison' },
      { type: 'verdict' }
    ],
    verdict: "Nike Vaporfly 3 ยังคงเป็นตัวเลือกอันดับ 1 สำหรับนักวิ่งที่ต้องการ PR ในการแข่ง แม้ราคาจะสูงแต่ประสิทธิภาพคุ้มค่าทุกบาท เหมาะกับนักวิ่งที่จริงจังเรื่องเวลา",
    affiliate_url: "https://shope.ee/test",
    cta_text: "ดูราคาล่าสุด",
    shopee_url: "https://shope.ee/test",
    lazada_url: "https://s.lazada.co.th/test"
  },
};

export default function ReviewDetail() {
  const { t, language } = useTranslation();
  const { slug } = useParams<{ slug: string }>();
  const [review, setReview] = useState<ReviewData | undefined>(undefined);
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
      try {
        const data = await dataService.getReviewBySlug(slug);

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
            pros_en: (data.pros_en as unknown as string[]) || [],
            cons: (data.cons as unknown as string[]) || [],
            cons_en: (data.cons_en as unknown as string[]) || [],
            intro: data.intro, verdict: data.verdict,
            sections: (data.sections as unknown as ReviewSectionData[]) || [],
            affiliate_url: data.affiliate_url, cta_text: data.cta_text,
            slug: data.slug,
            // @ts-expect-error adding these fields which might not be in the generated types yet but are in our extended ReviewData
            shopee_url: data.shopee_url,
            lazada_url: data.lazada_url,
            test_conditions: data.test_conditions as ReviewData['test_conditions'],
            name_en: data.name_en,
            brand_en: data.brand_en,
            category_en: data.category_en,
            badge_en: data.badge_en,
            verdict_en: data.verdict_en,
            intro_en: data.intro_en,
            cta_text_en: data.cta_text_en,
            test_conditions_en: data.test_conditions_en
          };
          setReview(currentReview);
        } else if (fallbackData[slug]) {
          currentReview = fallbackData[slug];
          currentReview.slug = slug;
          setReview(currentReview);
        }

        // Comments still use direct Supabase for now as it's a dynamic user interaction
        if (currentReview?.id && import.meta.env.VITE_USE_GOOGLE_SHEETS !== 'true') {
          const { data: ratingData } = await (await import("@/integrations/supabase/client")).supabase
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
      } catch (err) {
        console.error("Error fetching review detail:", err);
        if (fallbackData[slug]) {
          setReview(fallbackData[slug]);
        }
      }

      setLoading(false);
    };
    fetchReview();
  }, [slug]);

  const defaultSections: ReviewSectionData[] = useMemo(() => {
    if (!review) return [];

    if (review.sections.length > 0 && review.sections.some(s => s.type === 'quick_decision' || s.type === 'score_breakdown')) {
      return review.sections;
    }

    const layout: ReviewSectionData[] = [
      { type: 'hero' },
      { type: 'quick_decision' },
      { type: 'score_breakdown' },
      { type: 'gallery' }
    ];

    review.sections.forEach(s => {
      if (['hero', 'gallery', 'specs', 'pros_cons'].includes(s.type)) return;
      layout.push(s);
    });

    layout.push({ type: 'specs' });
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
          <h1 className="font-heading text-3xl font-semibold mb-4">{t('common.no_results')}</h1>
          <Link to="/"><Button variant="cta">{t('404.back_home')}</Button></Link>
        </div>
        <Footer />
      </div>
    );
  }

  const localizedName = translateData(review, 'name', language);
  const localizedBrand = translateData(review, 'brand', language);

  return (
    <div className="min-h-screen bg-white pb-[160px] md:pb-20">
      <SEOHead
        title={`${localizedName} ${t('common.verdict')} — GearTrail`}
        description={language === 'th'
          ? `รีวิว ${localizedName} จาก ${localizedBrand}: ${(translateData(review, 'intro', language) || "").slice(0, 120)}...`
          : `Review: ${localizedName} by ${localizedBrand}: ${(translateData(review, 'intro', language) || "").slice(0, 120)}...`
        }
        image={review.image_url || undefined}
        canonical={`https://gearguide-hero.lovable.app/review/${slug}`}
        jsonLd={jsonLd}
      />
      <Navbar />

      <main className="max-w-[1400px] mx-auto">
        <div className="px-4 py-6 md:px-8">
           <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-slate-400 mb-8 overflow-x-auto whitespace-nowrap scrollbar-hide">
            <Link to="/" className="hover:text-primary transition-colors shrink-0">{t('common.home')}</Link>
            <ChevronRight className="h-3 w-3 shrink-0" />
            <Link to={`/category/${encodeURIComponent(review.category)}`} className="hover:text-primary transition-colors shrink-0">{translateData(review, 'category', language) || review.category}</Link>
            <ChevronRight className="h-3 w-3 shrink-0" />
            <span className="text-primary truncate">{localizedName}</span>
          </div>
        </div>

        <div className="space-y-4 md:space-y-8">
          {defaultSections.map((section, idx) => (
            <SectionRenderer
              key={idx}
              section={section}
              review={review}
              userRating={userRating}
            />
          ))}
        </div>

        {review.id && (
          <div className="mt-16 max-w-[800px] mx-auto px-4">
            <div className="bg-white border-t pt-12">
              <h2 className="font-heading text-2xl font-bold mb-8">{t('common.user_reviews')}</h2>
              <CommentSection reviewId={review.id} isCompact={true} />
            </div>
          </div>
        )}

        <div className="mt-24">
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
      </main>

      {/* STICKY BOTTOM CTA (Mobile Only) */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-[100] bg-white border-t p-4 shadow-[0_-10px_40px_rgba(0,0,0,0.1)] flex items-center justify-between gap-4 animate-in slide-in-from-bottom duration-500">
        <div className="flex flex-col">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none mb-1">{t('common.best_price').toUpperCase()}</span>
          <span className="text-lg font-heading font-bold text-primary leading-none italic-prohibited">{review.price}</span>
        </div>
        <div className="flex-1 flex gap-2">
          {review.shopee_url ? (
            <Button
              className="flex-1 bg-[#EE4D2D] hover:bg-[#EE4D2D]/90 h-12 rounded-xl text-white border-none text-sm font-bold shadow-lg shadow-[#EE4D2D]/20"
              asChild
            >
              <a href={review.shopee_url} target="_blank" rel="noopener noreferrer nofollow">
                <ShoppingBag className="w-4 h-4 mr-1.5" />
                SHOPEE
              </a>
            </Button>
          ) : review.affiliate_url && (
            <Button
              className="flex-1 bg-accent hover:bg-accent/90 h-12 rounded-xl text-white border-none text-sm font-bold shadow-lg shadow-accent/20"
              asChild
            >
              <a href={review.affiliate_url} target="_blank" rel="noopener noreferrer nofollow">
                {t('common.buy_now')}
                <ExternalLink className="w-4 h-4 ml-1.5" />
              </a>
            </Button>
          )}
        </div>
      </div>

      <Footer />
    </div>
  );
}
