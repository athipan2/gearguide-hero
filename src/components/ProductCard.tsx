import { RatingStars } from "@/components/RatingStars";
import { Button } from "@/components/ui/button";
import { ExternalLink, ThumbsUp, ThumbsDown, Plus } from "lucide-react";
import { Link } from "react-router-dom";
import { useComparisonStore } from "@/lib/comparison-store";
import { toast } from "sonner";

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
  slug?: string;
  affiliateUrl?: string | null;
  createdAt?: string;
}

const badgeColors: Record<string, string> = {
  "แนะนำ": "bg-badge-recommended text-accent-foreground",
  "คุ้มค่าที่สุด": "bg-badge-best-value text-accent-foreground",
  "Top Pick": "bg-badge-top-pick text-accent-foreground",
};

export function ProductCard({ name, brand, image, rating, price, badge, pros, cons, specs, slug, affiliateUrl, createdAt }: ProductCardProps) {
  const isNew = createdAt ? (new Date().getTime() - new Date(createdAt).getTime()) < (30 * 24 * 60 * 60 * 1000) : false;

  const weight = specs?.find(s => s.label.toLowerCase().includes('weight') || s.label.includes('น้ำหนัก'))?.value;
  const drop = specs?.find(s => s.label.toLowerCase().includes('drop'))?.value;

  return (
    <div className="group bg-card rounded-xl border overflow-hidden hover:shadow-[0_20px_50px_rgba(31,61,43,0.2)] hover:border-primary/10 transition-all duration-300 hover:-translate-y-2">
      {/* Image */}
      <div className="relative aspect-[4/3] bg-muted overflow-hidden">
        <img src={image} alt={name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out" loading="lazy" />
        <div className="absolute top-3 left-3 flex flex-col gap-2">
          {isNew && (
            <div className="bg-gradient-to-r from-accent to-orange-500 text-accent-foreground px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider shadow-lg shadow-orange-500/20">
              ใหม่
            </div>
          )}
          {badge && (
            <div className={`px-3 py-1 rounded-full text-xs font-bold shadow-sm ${badgeColors[badge] || "bg-primary text-primary-foreground"}`}>
              {badge}
            </div>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="p-4 md:p-5 space-y-3">
        <div>
          <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">{brand}</p>
          <h3 className="font-heading font-semibold text-lg text-card-foreground mt-0.5 line-clamp-2">{name}</h3>
        </div>

        <div className="flex items-center justify-between">
          <RatingStars rating={rating} />
          <span className="font-heading font-bold text-lg text-foreground">{price}</span>
        </div>

        {/* Pros / Cons */}
        <div className="grid grid-cols-2 gap-3 text-[11px] py-1">
          <div className="space-y-1.5">
            {pros.slice(0, 2).map((p) => (
              <div key={p} className="flex items-start gap-1.5 text-badge-recommended/80">
                <ThumbsUp className="h-3 w-3 mt-0.5 shrink-0" />
                <span className="text-muted-foreground/90 line-clamp-1">{p}</span>
              </div>
            ))}
          </div>
          <div className="space-y-1.5">
            {cons.slice(0, 2).map((c) => (
              <div key={c} className="flex items-start gap-1.5 text-destructive/70">
                <ThumbsDown className="h-3 w-3 mt-0.5 shrink-0" />
                <span className="text-muted-foreground/90 line-clamp-1">{c}</span>
              </div>
            ))}
          </div>
        </div>

        {/* CTAs */}
        <div className="grid grid-cols-2 gap-2 pt-1 md:flex md:flex-wrap">
          <Button
            variant="outline"
            size="sm"
            className="w-full md:flex-1 border-primary/20 hover:bg-primary/5 text-xs h-9"
            onClick={() => {
              useComparisonStore.getState().addItem({ name, brand, image, rating, price, slug, weight, drop });
              toast.success(`เพิ่ม ${name} เข้าสู่การเปรียบเทียบ`);
            }}
          >
            <Plus className="h-3.5 w-3.5 mr-1" />
            เทียบ
          </Button>

          {slug ? (
            <Button variant="outline" size="sm" className="w-full md:flex-1 text-xs h-9" asChild>
              <Link to={`/review/${slug}`}>รีวิวเต็ม</Link>
            </Button>
          ) : (
            <Button variant="outline" size="sm" className="w-full md:flex-1 text-xs h-9">รีวิวเต็ม</Button>
          )}

          <Button variant="cta" size="sm" className="col-span-2 md:flex-1 text-xs h-9" asChild={!!affiliateUrl}>
            {affiliateUrl ? (
              <a href={affiliateUrl} target="_blank" rel="noopener noreferrer nofollow">
                ดูราคา
                <ExternalLink className="ml-1 h-3.5 w-3.5" />
              </a>
            ) : (
              <div className="flex items-center justify-center">
                ดูราคา
                <ExternalLink className="ml-1 h-3.5 w-3.5" />
              </div>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
