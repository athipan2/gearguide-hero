import { ReviewData } from "@/types/review";
import { Button } from "@/components/ui/button";
import { ShoppingBag, ExternalLink, Award, ChevronRight } from "lucide-react";
import { useTranslation } from "@/hooks/useTranslation";

interface ReviewVerdictProps {
  verdict: string;
  affiliateUrl: string | null;
  ctaText?: string | null;
  review?: ReviewData;
}

export const ReviewVerdict = ({ verdict, affiliateUrl, ctaText, review }: ReviewVerdictProps) => {
  const { t, language } = useTranslation();

  return (
    <section className="bg-primary p-6 md:p-12 rounded-none md:rounded-[2.5rem] text-white space-y-8 md:space-y-12 overflow-hidden relative group">
      {/* Decorative Blur BG */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-accent/20 blur-[100px] rounded-full -mr-64 -mt-64 group-hover:scale-110 transition-transform duration-[2000ms]" />
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-emerald-500/10 blur-[80px] rounded-full -ml-48 -mb-48" />

      <div className="relative z-10 space-y-4">
        <h2 className="font-heading text-2xl md:text-4xl font-bold uppercase tracking-tighter italic-prohibited flex items-center gap-3 md:gap-4">
          <span className="h-10 md:h-12 w-3 bg-accent rounded-full shadow-lg shadow-accent/20" />
          {t("review.verdict")}
        </h2>
        <p className="text-white/60 text-sm md:text-lg font-medium max-w-xl">
          {t("common.verdict_subtitle")}
        </p>
      </div>

      <div className="relative z-10 grid md:grid-cols-[1fr_400px] gap-8 md:gap-16 items-start">
        <div className="space-y-8">
          <p className="text-xl md:text-3xl font-medium leading-relaxed md:leading-[1.4] text-white">
            "{verdict}"
          </p>

          <div className="flex flex-wrap gap-4 md:gap-8">
             <div className="flex flex-col">
              <span className="text-4xl md:text-6xl font-heading font-bold text-accent tracking-tighter italic-prohibited">{review?.overall_rating.toFixed(1)}</span>
              <span className="text-[10px] md:text-xs font-bold text-white/40 uppercase tracking-[0.3em] mt-1">
                {t("common.overall_rating")}
              </span>
             </div>
             <div className="h-16 w-px bg-white/10 hidden sm:block" />
             <div className="flex flex-col">
              <span className="text-4xl md:text-6xl font-heading font-bold text-white tracking-tighter italic-prohibited">{review?.price}</span>
              <span className="text-[10px] md:text-xs font-bold text-white/40 uppercase tracking-[0.3em] mt-1">
                {t("common.target_price")}
              </span>
             </div>
          </div>
        </div>

        <div className="bg-white/5 backdrop-blur-md border border-white/10 p-8 md:p-12 rounded-[2rem] md:rounded-[3rem] space-y-8">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Award className="h-5 w-5 text-accent" />
              <span className="text-xs md:text-sm font-bold text-accent uppercase tracking-widest leading-none">{t("review.choice")}</span>
            </div>
            <h3 className="font-heading text-xl md:text-2xl font-bold text-white uppercase tracking-tight italic-prohibited">{t("review.grab_pair")}</h3>
          </div>

          <div className="flex flex-col gap-4">
            {review?.shopee_url && (
              <Button
                variant="hero"
                size="lg"
                className="h-14 md:h-16 rounded-2xl bg-[#EE4D2D] hover:bg-[#EE4D2D]/90 text-white border-none text-lg font-bold shadow-2xl shadow-[#EE4D2D]/30"
                asChild
              >
                <a href={review.shopee_url} target="_blank" rel="noopener noreferrer nofollow">
                  <ShoppingBag className="w-5 h-5 mr-3" />
                  CHECK ON SHOPEE
                  <ChevronRight className="w-5 h-5 ml-auto" />
                </a>
              </Button>
            )}

            {review?.lazada_url && (
              <Button
                variant="outline"
                size="lg"
                className="h-14 md:h-16 rounded-2xl border-2 border-white/20 hover:bg-white/5 text-white text-lg font-bold"
                asChild
              >
                <a href={review.lazada_url} target="_blank" rel="noopener noreferrer nofollow">
                  CHECK ON LAZADA
                  <ExternalLink className="w-5 h-5 ml-3" />
                  <ChevronRight className="w-5 h-5 ml-auto opacity-40" />
                </a>
              </Button>
            )}

            {!review?.shopee_url && !review?.lazada_url && affiliateUrl && (
              <Button
                variant="hero"
                size="lg"
                className="h-14 md:h-16 rounded-2xl bg-accent hover:bg-accent/90 text-white border-none text-lg font-bold shadow-2xl shadow-accent/30"
                asChild
              >
                <a href={affiliateUrl} target="_blank" rel="noopener noreferrer nofollow">
                  {ctaText || "BUY NOW"}
                  <ExternalLink className="w-5 h-5 ml-3" />
                  <ChevronRight className="w-5 h-5 ml-auto" />
                </a>
              </Button>
            )}
          </div>

          <div className="flex items-center gap-2 text-[10px] md:text-xs font-bold text-white/40 uppercase tracking-widest justify-center">
            <Check className="w-4 h-4 text-emerald-500" /> {t("common.price_update")}
          </div>
        </div>
      </div>
    </section>
  );
};

const Check = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
  </svg>
);
