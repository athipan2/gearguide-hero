import { RatingStars } from "@/components/RatingStars";
import { Button } from "@/components/ui/button";
import { ExternalLink, ThumbsUp, ThumbsDown, Plus } from "lucide-react";
import { Link } from "react-router-dom";
import { useComparisonStore } from "@/lib/comparison-store";
import { toast } from "sonner";
import { getOptimizedImageUrl } from "@/lib/utils";
import { useTranslation } from "@/hooks/useTranslation";

interface ProductCardProps {
  name: string;
  brand: string;
  image: string;
  rating: number;
  price: string;
  badge?: string;
  pros: string[];
  cons: string[];
  specs?: { label: string; value: string }[];
  ratings?: { label: string; score: number }[];
  slug?: string;
  affiliateUrl?: string | null;
  createdAt?: string;
  verdict?: string;
}

const badgeColors: Record<string, string> = {
  "แนะนำ": "bg-badge-recommended text-accent-foreground",
  "คุ้มค่าที่สุด": "bg-badge-best-value text-accent-foreground",
  "Top Pick": "bg-badge-top-pick text-accent-foreground",
};

export function ProductCard({ name, brand, image, rating, price, badge, pros, cons, specs, ratings, slug, affiliateUrl, createdAt, verdict }: ProductCardProps) {
  const { t, language } = useTranslation();
  const isNew = createdAt ? (new Date().getTime() - new Date(createdAt).getTime()) < (30 * 24 * 60 * 60 * 1000) : false;

  const weight = specs?.find(s => s.label.toLowerCase().includes('weight') || s.label.includes('น้ำหนัก'))?.value;
  const drop = specs?.find(s => s.label.toLowerCase().includes('drop'))?.value;

  return (
    <div className="group bg-card rounded-3xl border border-neutral-200 overflow-hidden shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
      {/* Image */}
      <div className="relative aspect-[4/3] md:aspect-square lg:aspect-[4/3] bg-muted overflow-hidden">
        {slug ? (
          <Link to={`/review/${slug}`} className="block w-full h-full cursor-pointer">
            <img
              src={getOptimizedImageUrl(image, 'card')}
              alt={name}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
              loading="lazy"
            />
          </Link>
        ) : (
          <img
            src={getOptimizedImageUrl(image, 'card')}
            alt={name}
            className="w-full h-full object-cover"
            loading="lazy"
          />
        )}

        <div className="absolute top-3 left-3 flex flex-col gap-2 pointer-events-none">
          {isNew && (
            <div className="bg-accent text-accent-foreground px-3 py-1.5 rounded-lg text-xs font-semibold uppercase tracking-sporty shadow-xl">
              {t('common.new')}
            </div>
          )}
          {badge && (
            <div className={`px-3 py-1.5 rounded-lg text-xs font-semibold uppercase tracking-sporty shadow-sm ${badgeColors[badge] || "bg-primary text-primary-foreground"}`}>
              {badge}
            </div>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="p-5 md:p-6 space-y-6">
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-6 h-0.5 bg-accent rounded-full" />
              <p className="text-[10px] md:text-xs font-bold text-muted-foreground uppercase tracking-sporty">{brand}</p>
            </div>
            <RatingStars rating={rating} />
          </div>
          <h3 className="font-heading font-bold text-lg md:text-xl text-card-foreground line-clamp-2 uppercase tracking-tight group-hover:text-primary transition-colors leading-snug">{name}</h3>
        </div>

        <div className="flex items-center justify-between bg-slate-50 rounded-2xl p-4 border border-slate-100">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">{t('common.price')}</span>
          <span className="font-heading font-bold text-xl md:text-2xl text-primary italic-prohibited">{price}</span>
        </div>

        {/* Verdict / Summary */}
        {verdict && (
          <p className="text-xs md:text-sm text-slate-500 line-clamp-2 leading-relaxed italic-prohibited border-l-2 border-accent/20 pl-3">
            {verdict}
          </p>
        )}

        {/* Pros / Cons Compact */}
        <div className="grid grid-cols-1 gap-4 pt-1">
          <div className="grid grid-cols-2 gap-2 md:gap-4">
            <div className="space-y-2.5">
              <p className="text-[10px] font-bold text-emerald-600/60 uppercase tracking-widest flex items-center gap-1.5 whitespace-nowrap">
                <ThumbsUp className="h-3 w-3" /> {t('common.pros')}
              </p>
              <div className="space-y-2">
                {pros.length > 0 ? pros.slice(0, 2).map((p, idx) => (
                  <div key={idx} className="flex items-start gap-2 text-emerald-600">
                    <div className="h-1 w-1 rounded-full bg-emerald-500 mt-1.5 shrink-0" />
                    <span className="text-slate-600 text-[11px] md:text-xs line-clamp-2 leading-tight font-medium">{p}</span>
                  </div>
                )) : (
                  <span className="text-slate-300 text-[10px] italic">No data</span>
                )}
              </div>
            </div>
            <div className="space-y-2.5 border-l border-slate-100 pl-2 md:pl-4">
              <p className="text-[10px] font-bold text-rose-500/60 uppercase tracking-widest flex items-center gap-1.5 whitespace-nowrap">
                <ThumbsDown className="h-3 w-3" /> {t('common.cons')}
              </p>
              <div className="space-y-2">
                {cons.length > 0 ? cons.slice(0, 2).map((c, idx) => (
                  <div key={idx} className="flex items-start gap-2 text-rose-500">
                    <div className="h-1 w-1 rounded-full bg-rose-400 mt-1.5 shrink-0" />
                    <span className="text-slate-600 text-[11px] md:text-xs line-clamp-2 leading-tight font-medium">{c}</span>
                  </div>
                )) : (
                  <span className="text-slate-300 text-[10px] italic">No data</span>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* CTAs */}
        <div className="grid grid-cols-2 gap-2 pt-2 md:flex md:flex-wrap lg:grid lg:grid-cols-2">
          <div className="grid grid-cols-2 gap-2 col-span-2 md:w-full lg:col-span-2">
            <Button
              variant="outline"
              size="sm"
              className="w-full border-primary/10 hover:bg-primary/5 text-[10px] md:text-xs font-bold uppercase tracking-sporty h-11 md:h-10 rounded-xl"
              onClick={() => {
                useComparisonStore.getState().addItem({
                  name, brand, image, rating, price, slug, weight, drop,
                  badge,
                  specs,
                  aspectRatings: ratings
                });
                toast.success(`${t('nav.compare')} ${name}`);
              }}
            >
              <Plus className="w-3 h-3 mr-1" />
              {t('common.compare')}
            </Button>

            {slug ? (
              <Button variant="outline" size="sm" className="w-full border-primary/10 text-[10px] md:text-xs font-bold uppercase tracking-sporty h-11 md:h-10 rounded-xl" asChild>
                <Link to={`/review/${slug}`}>{t('common.review')}</Link>
              </Button>
            ) : (
              <Button variant="outline" size="sm" className="w-full border-primary/10 text-[10px] md:text-xs font-bold uppercase tracking-sporty h-11 md:h-10 rounded-xl">{t('common.review')}</Button>
            )}
          </div>

          <Button variant="cta" size="sm" className="col-span-2 lg:col-span-2 text-[10px] md:text-xs font-bold uppercase tracking-sporty h-12 md:h-11 rounded-xl bg-accent text-white shadow-lg shadow-accent/20 w-full" asChild={!!affiliateUrl}>
            {affiliateUrl ? (
              <a href={affiliateUrl} target="_blank" rel="noopener noreferrer nofollow">
                {t('common.view_price')}
                <ExternalLink className="ml-1 h-3 w-3 shrink-0" />
              </a>
            ) : (
              <div className="flex items-center justify-center">
                {t('common.view_price')}
                <ExternalLink className="ml-1 h-3 w-3 shrink-0" />
              </div>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
