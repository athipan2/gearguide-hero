import { RatingStars } from "@/components/RatingStars";
import { Button } from "@/components/ui/button";
import { ExternalLink, ThumbsUp, ThumbsDown, Plus } from "lucide-react";
import { Link } from "react-router-dom";
import { useComparisonStore } from "@/lib/comparison-store";
import { toast } from "sonner";
import { getOptimizedImageUrl } from "@/lib/utils";

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
}

const badgeColors: Record<string, string> = {
  "แนะนำ": "bg-badge-recommended text-accent-foreground",
  "คุ้มค่าที่สุด": "bg-badge-best-value text-accent-foreground",
  "Top Pick": "bg-badge-top-pick text-accent-foreground",
};

export function ProductCard({ name, brand, image, rating, price, badge, pros, cons, specs, ratings, slug, affiliateUrl, createdAt }: ProductCardProps) {
  const isNew = createdAt ? (new Date().getTime() - new Date(createdAt).getTime()) < (30 * 24 * 60 * 60 * 1000) : false;

  const weight = specs?.find(s => s.label.toLowerCase().includes('weight') || s.label.includes('น้ำหนัก'))?.value;
  const drop = specs?.find(s => s.label.toLowerCase().includes('drop'))?.value;

  return (
    <div className="group bg-card rounded-2xl md:rounded-3xl border border-neutral-200 overflow-hidden shadow-sm hover:shadow-md transition-all duration-200">
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
              NEW
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
      <div className="p-5 md:p-6 space-y-5">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <span className="w-6 h-0.5 bg-accent rounded-full" />
            <p className="text-[10px] md:text-xs font-bold text-muted-foreground uppercase tracking-sporty">{brand}</p>
          </div>
          <h3 className="font-heading font-semibold text-lg md:text-xl text-card-foreground line-clamp-2 uppercase tracking-tight group-hover:text-primary transition-colors leading-snug">{name}</h3>
        </div>

        <div className="flex items-center justify-between border-y border-neutral-100 py-4">
          <RatingStars rating={rating} />
          <span className="font-heading font-bold text-xl md:text-2xl text-primary italic-prohibited">{price}</span>
        </div>

        {/* Pros / Cons */}
        <div className="grid grid-cols-2 gap-3 text-xs py-0.5">
          <div className="space-y-2">
            {pros.slice(0, 2).map((p) => (
              <div key={p} className="flex items-start gap-1.5 text-emerald-600">
                <ThumbsUp className="h-3.5 w-3.5 mt-0.5 shrink-0" />
                <span className="text-slate-600 line-clamp-2 leading-relaxed font-medium">{p}</span>
              </div>
            ))}
          </div>
          <div className="space-y-2">
            {cons.slice(0, 2).map((c) => (
              <div key={c} className="flex items-start gap-1.5 text-rose-500">
                <ThumbsDown className="h-3.5 w-3.5 mt-0.5 shrink-0" />
                <span className="text-slate-600 line-clamp-2 leading-relaxed font-medium">{c}</span>
              </div>
            ))}
          </div>
        </div>

        {/* CTAs */}
        <div className="grid grid-cols-2 gap-1.5 pt-1 md:flex md:flex-wrap lg:grid lg:grid-cols-3">
          <Button
            variant="outline"
            size="sm"
            className="w-full border-primary/20 hover:bg-primary/5 text-xs font-bold uppercase tracking-sporty h-10 md:h-9 rounded-lg px-1 md:px-2"
            onClick={() => {
              useComparisonStore.getState().addItem({
                name, brand, image, rating, price, slug, weight, drop,
                badge,
                specs,
                aspectRatings: ratings
              });
              toast.success(`เพิ่ม ${name} เข้าสู่การเปรียบเทียบ`);
            }}
          >
            COMPARE
          </Button>

          {slug ? (
            <Button variant="outline" size="sm" className="w-full text-xs font-bold uppercase tracking-sporty h-10 md:h-9 rounded-lg px-1 md:px-2" asChild>
              <Link to={`/review/${slug}`}>REVIEW</Link>
            </Button>
          ) : (
            <Button variant="outline" size="sm" className="w-full text-xs font-bold uppercase tracking-sporty h-10 md:h-9 rounded-lg px-1 md:px-2">REVIEW</Button>
          )}

          <Button variant="cta" size="sm" className="col-span-2 lg:col-span-1 text-xs font-bold uppercase tracking-sporty h-11 md:h-9 rounded-lg px-1 md:px-2 bg-accent text-white" asChild={!!affiliateUrl}>
            {affiliateUrl ? (
              <a href={affiliateUrl} target="_blank" rel="noopener noreferrer nofollow">
                ดูราคา
                <ExternalLink className="ml-1 h-3 w-3 shrink-0" />
              </a>
            ) : (
              <div className="flex items-center justify-center">
                ดูราคา
                <ExternalLink className="ml-1 h-3 w-3 shrink-0" />
              </div>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
