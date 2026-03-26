import { ReviewData } from "@/types/review";
import { RatingStars } from "@/components/RatingStars";
import { Button } from "@/components/ui/button";
import { translateData } from "@/lib/utils";
import { ShoppingBag, ExternalLink, ChevronRight, Share2, Heart } from "lucide-react";
import { useTranslation } from "@/hooks/useTranslation";

interface ReviewHeroProps {
  review: ReviewData;
  userRating?: { average: number; count: number } | null;
}

export const ReviewHero = ({ review, userRating }: ReviewHeroProps) => {
  const { t, language } = useTranslation();
  const isEn = language === 'en';

  return (
    <section className="relative w-full overflow-hidden bg-white">
      {/* Hero Image Container */}
      <div className="relative w-full h-[60vh] md:h-[70vh] lg:h-[80vh] overflow-hidden bg-slate-900">
        <img
          src={review.image_url || ""}
          alt={review.name}
          className="w-full h-full object-cover opacity-90"
          loading="eager"
          // @ts-expect-error adding fetchPriority for performance
          fetchPriority="high"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent" />

        {/* Floating Badges */}
        <div className="absolute top-6 left-6 flex flex-col gap-3 z-20">
          {review.badge && (
            <div className="bg-accent text-white px-4 py-2 rounded-xl text-xs md:text-sm font-bold uppercase tracking-[0.2em] shadow-2xl animate-in fade-in slide-in-from-left duration-700">
              {review.badge}
            </div>
          )}
          <div className="bg-white/10 backdrop-blur-md text-white px-4 py-2 rounded-xl text-[10px] md:text-xs font-bold uppercase tracking-[0.2em] border border-white/20">
            TESTED 2026
          </div>
        </div>

        {/* Action Buttons (Mobile Overlay) */}
        <div className="absolute top-6 right-6 flex gap-3 z-20">
          <button className="h-12 w-12 rounded-full bg-black/20 backdrop-blur-md border border-white/20 flex items-center justify-center text-white hover:bg-white hover:text-black transition-all">
            <Heart className="h-5 w-5" />
          </button>
          <button className="h-12 w-12 rounded-full bg-black/20 backdrop-blur-md border border-white/20 flex items-center justify-center text-white hover:bg-white hover:text-black transition-all">
            <Share2 className="h-5 w-5" />
          </button>
        </div>

        {/* Hero Text Overlay (Mobile & Desktop) */}
        <div className="absolute bottom-0 left-0 right-0 p-6 md:p-12 lg:p-20 z-20 max-w-[1400px] mx-auto w-full">
          <div className="max-w-4xl space-y-6 md:space-y-8">
            <div className="space-y-3 md:space-y-4">
              <div className="flex items-center gap-3">
                <span className="w-10 h-1 bg-accent rounded-full" />
                <span className="text-xs md:text-base font-bold text-accent uppercase tracking-[0.3em]">{review.brand}</span>
              </div>
              <h1 className="font-heading text-5xl md:text-7xl lg:text-9xl font-bold text-white leading-none tracking-tighter italic-prohibited drop-shadow-2xl">
                {(isEn && review.name_en) ? review.name_en : review.name}
              </h1>
            </div>

            <div className="flex flex-wrap items-center gap-8 md:gap-12">
              <div className="flex flex-col">
                <div className="flex items-center gap-3">
                  <RatingStars rating={review.overall_rating} />
                  <span className="text-2xl md:text-3xl font-bold text-white tracking-tighter">{review.overall_rating.toFixed(1)}</span>
                </div>
                <span className="text-[10px] md:text-xs font-bold text-white/60 uppercase tracking-[0.2em] mt-2">
                  {userRating
                    ? t("review.user_count").replace("{count}", userRating.count.toString())
                    : t("review.expert_rating")}
                </span>
              </div>

              <div className="h-12 w-px bg-white/20 hidden sm:block" />

              <div className="flex flex-col">
                <div className="flex items-baseline gap-2">
                   <span className="text-3xl md:text-5xl font-heading font-bold text-accent tracking-tighter italic-prohibited">
                    {(isEn && review.price_en) ? review.price_en : review.price}
                   </span>
                   <span className="text-xs md:text-sm font-bold text-white/40 line-through">฿9,900</span>
                </div>
                <span className="text-[10px] md:text-xs font-bold text-emerald-400 uppercase tracking-[0.2em] mt-2 flex items-center gap-2">
                  <div className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  {t("review.best_price_today")}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Intro Section - Below Hero Image */}
      <div className="px-6 py-12 md:px-12 md:py-20 lg:px-20 max-w-[1400px] mx-auto border-b border-slate-100">
        <div className="grid lg:grid-cols-[1fr_400px] gap-12 md:gap-20 items-start">
          <div className="space-y-8 md:space-y-12">
            <p className="text-2xl md:text-4xl lg:text-5xl font-medium leading-[1.3] text-primary tracking-tight md:max-w-3xl">
              {(isEn && review.intro_en) ? review.intro_en : review.intro}
            </p>

            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              {review.shopee_url && (
                <Button
                  variant="hero"
                  size="lg"
                  className="h-16 px-10 rounded-2xl bg-[#EE4D2D] hover:bg-[#EE4D2D]/90 text-white border-none text-xl font-bold shadow-2xl shadow-[#EE4D2D]/30 flex-1 md:flex-none transform hover:scale-[1.02] transition-all"
                  asChild
                >
                  <a href={review.shopee_url} target="_blank" rel="noopener noreferrer nofollow">
                    <ShoppingBag className="w-6 h-6 mr-3" />
                    CHECK ON SHOPEE
                    <ChevronRight className="w-6 h-6 ml-3" />
                  </a>
                </Button>
              )}

              {review.lazada_url && (
                <Button
                  variant="outline"
                  size="lg"
                  className="h-16 px-10 rounded-2xl border-2 border-[#000083] text-[#000083] hover:bg-[#000083]/5 text-xl font-bold flex-1 md:flex-none"
                  asChild
                >
                  <a href={review.lazada_url} target="_blank" rel="noopener noreferrer nofollow">
                    CHECK ON LAZADA
                    <ExternalLink className="w-6 h-6 ml-3" />
                  </a>
                </Button>
              )}
            </div>
          </div>

          <div className="hidden lg:block bg-slate-50 rounded-[2.5rem] p-10 space-y-8 border border-slate-100">
            <h3 className="font-heading font-bold text-primary text-xs uppercase tracking-[0.3em] flex items-center gap-3">
              <div className="w-2 h-4 bg-accent rounded-full" />
              {t("review.quick_specs")}
            </h3>
            <div className="space-y-6">
              {((isEn && review.specs_en) ? review.specs_en : review.specs).slice(0, 4).map((spec, i) => (
                <div key={i} className="flex justify-between items-center border-b border-slate-200 pb-4 last:border-none">
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                    {isEn ? translateData(spec.label, 'en') : spec.label}
                  </span>
                  <span className="text-sm font-bold text-primary">
                    {isEn ? translateData(spec.value, 'en') : spec.value}
                  </span>
                </div>
              ))}
            </div>
            <button
              onClick={() => document.getElementById('specs')?.scrollIntoView({ behavior: 'smooth' })}
              className="w-full py-4 text-xs font-bold text-accent uppercase tracking-[0.2em] hover:text-primary transition-colors flex items-center justify-center gap-2 border-t border-slate-200 pt-8"
            >
              {t("review.see_all_specs")} <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};
