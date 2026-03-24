import { ReviewData } from "@/types/review";
import { ImageGallery } from "@/components/ImageGallery";
import { ScoreGauge } from "@/components/ScoreGauge";
import { RatingStars } from "@/components/RatingStars";
import { Award, Share2, Zap, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { useMemo } from "react";

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

interface ReviewHeroProps {
  review: ReviewData;
  userRating?: { average: number; count: number } | null;
}

export const ReviewHero = ({ review, userRating }: ReviewHeroProps) => {
  const stabilizedMicrocopy = useMemo(() => {
    return microcopyOptions[Math.floor(Math.random() * microcopyOptions.length)];
  }, []);

  const ctaText = review.cta_text || "ดูราคาล่าสุด";
  const ctaProps = review.affiliate_url
    ? { href: review.affiliate_url, target: "_blank", rel: "noopener noreferrer nofollow" }
    : {};

  const CTAButton = ({ className, isSticky = false }: { className?: string, isSticky?: boolean }) => (
    <div className="flex flex-col gap-2 w-full">
      <Button
        variant="hero"
        size="lg"
        className={cn(
          className,
          "group relative overflow-hidden transition-all active:scale-95 py-4 md:py-6",
          isSticky && "bg-accent hover:bg-accent/90 border-none shadow-accent/20"
        )}
        asChild={!!review.affiliate_url}
      >
        {review.affiliate_url ? (
          <a {...ctaProps} className="flex items-center gap-2">
            <span className="relative z-10 flex items-center gap-2 text-sm md:text-base">
              {ctaText}
              <ExternalLink className="h-5 w-5 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
            </span>
          </a>
        ) : (
          <div className="flex items-center gap-2 text-sm md:text-base">
            {ctaText}
            <ExternalLink className="h-5 w-5" />
          </div>
        )}
      </Button>
      {!isSticky && (
        <div className="flex flex-col items-center gap-1">
          <p className="text-xs text-center font-bold uppercase tracking-[0.2em] text-accent animate-pulse">
            {stabilizedMicrocopy}
          </p>
          <span className="text-xs text-slate-400 font-bold uppercase tracking-widest">อัปเดตราคาล่าสุดวันนี้ • มีรีวิวจริง</span>
        </div>
      )}
    </div>
  );

  return (
    <div className="grid grid-cols-1 md:grid-cols-[60%_40%] gap-8 md:gap-12 mb-16 md:mb-24 items-start">
      <div className="relative md:sticky md:top-24 p-0">
        <ImageGallery
          mainImage={review.image_url || ""}
          images={review.images}
          alt={review.name}
          badge={review.badge}
          badgeClassName={badgeColors[review.badge || ""] || "bg-primary text-white"}
          badgeIcon={<Award className="h-4 w-4" />}
          isCompact={true}
        />
        <div className="hidden md:block absolute -bottom-10 -right-10 w-44 h-44 z-20 hover:scale-110 transition-transform duration-500">
          <ScoreGauge
            score={review.overall_rating}
            className="bg-white rounded-full p-2 shadow-2xl border-4 border-[var(--background)]"
            strokeWidth={12}
          />
        </div>
      </div>

      <div className="flex flex-col space-y-8 md:space-y-12">
        <div className="space-y-6 md:space-y-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="h-px w-8 bg-accent" />
              <p className="text-xs md:text-sm font-bold text-accent uppercase tracking-[0.3em]">{review.brand} • {review.category}</p>
            </div>
            <Button
              variant="ghost"
              size="icon"
              className="h-9 w-9 rounded-full bg-white/50 backdrop-blur-sm border border-primary/5 shadow-sm hover:bg-white transition-all"
              onClick={() => {
                if (navigator.share) {
                  navigator.share({ title: review.name, text: review.intro || "", url: window.location.href }).catch(() => {});
                } else {
                  navigator.clipboard.writeText(window.location.href);
                  toast.success("คัดลอกลิงก์แล้ว");
                }
              }}
            >
              <Share2 className="w-4 h-4 text-primary" />
            </Button>
          </div>

          <h1 className="font-heading text-5xl md:text-6xl font-bold text-primary leading-[1] tracking-tighter uppercase break-words">
            {review.name}
          </h1>

          <div className="grid grid-cols-1 gap-8 pt-4">
            <div className="bg-white rounded-[2rem] p-8 border border-primary/5 shadow-xl shadow-primary/5 space-y-12">
              <div className="flex items-center justify-between border-b border-slate-100 pb-5">
                <div className="flex flex-col">
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">SCORE GAUGE</span>
                  <div className="flex items-center gap-2">
                    <span className="text-4xl font-heading font-bold text-primary">{review.overall_rating}</span>
                    <div className="flex flex-col">
                      <RatingStars rating={review.overall_rating} />
                      <span className="text-xs font-bold text-primary/40 uppercase mt-0.5">({userRating?.count || 120} USERS)</span>
                    </div>
                  </div>
                </div>
                <div className="h-12 w-px bg-slate-100" />
                <div className="flex flex-col items-end">
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">EST. PRICE</span>
                  <span className="text-3xl font-heading font-bold text-primary tracking-tighter italic-prohibited">{review.price}</span>
                </div>
              </div>

              <div className="space-y-6">
                <div className="flex items-start gap-3">
                  <div className="mt-1 h-5 w-5 rounded-full bg-accent/10 flex items-center justify-center shrink-0">
                    <Zap className="h-3 w-3 text-accent fill-accent" />
                  </div>
                  <p className="text-sm md:text-base font-bold text-slate-700 leading-snug">
                    บทสรุป: <span className="font-medium text-slate-600">{review.verdict?.slice(0, 100)}...</span>
                  </p>
                </div>
                <CTAButton className="h-14 rounded-2xl shadow-xl shadow-accent/20 bg-accent text-white border-none active:scale-95 transition-all text-base" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
