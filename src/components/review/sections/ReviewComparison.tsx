import { ReviewData } from "@/types/review";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Scale, ChevronRight, Check, X } from "lucide-react";
import { RatingStars } from "@/components/RatingStars";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

interface ReviewComparisonProps {
  review: ReviewData;
}

export const ReviewComparison = ({ review }: ReviewComparisonProps) => {
  const [similar, setSimilar] = useState<ReviewData[]>([]);

  useEffect(() => {
    const fetchSimilar = async () => {
      const { data } = await supabase
        .from("reviews")
        .select("*")
        .eq("category", review.category)
        .eq("published", true)
        .neq("slug", review.slug)
        .limit(2);

      if (data) {
        setSimilar(data as unknown as ReviewData[]);
      }
    };
    fetchSimilar();
  }, [review.category, review.slug]);

  if (similar.length === 0) return null;

  return (
    <section className="bg-white p-6 md:p-8 rounded-none md:rounded-3xl border-y md:border-2 border-slate-100 shadow-sm md:shadow-none space-y-8 md:space-y-12 overflow-hidden">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 md:gap-8">
        <div className="space-y-4">
          <h2 className="font-heading text-2xl md:text-3xl font-bold text-primary flex items-center gap-3">
            <span className="w-8 h-1 bg-accent rounded-full" />
            Product Comparison
          </h2>
          <p className="text-sm md:text-base text-slate-500 font-medium">
            เปรียบเทียบกับรุ่นที่ใกล้เคียงที่สุดในตลาด เพื่อหาคู่ที่ใช่สำหรับคุณ
          </p>
        </div>
        <Link to="/compare">
          <Button variant="outline" className="rounded-full gap-2 text-xs font-bold uppercase tracking-widest h-12 px-8 border-2 hover:bg-primary/5">
            <Scale className="h-4 w-4" />
            Compare More
            <ChevronRight className="h-4 w-4" />
          </Button>
        </Link>
      </div>

      <div className="grid md:grid-cols-2 gap-8 md:gap-12">
        {similar.map((item, idx) => (
          <div key={idx} className="bg-slate-50/50 md:bg-white md:border border-slate-100 p-6 md:p-8 rounded-3xl hover:shadow-2xl hover:shadow-primary/5 transition-all group overflow-hidden relative">
             <div className="absolute top-0 right-0 h-32 w-32 bg-primary/5 -mr-16 -mt-16 rounded-full group-hover:scale-150 transition-transform duration-700" />

            <div className="relative z-10 flex flex-col sm:flex-row gap-6">
              <div className="w-full sm:w-32 h-32 rounded-2xl overflow-hidden border bg-white shrink-0">
                <img src={item.image_url || ""} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" alt={item.name} />
              </div>

              <div className="flex-1 space-y-4">
                <div className="space-y-1">
                  <p className="text-[10px] font-bold text-accent uppercase tracking-widest">{item.brand}</p>
                  <h3 className="font-heading font-bold text-lg md:text-xl text-primary leading-tight line-clamp-2 h-10 md:h-12 italic-prohibited">{item.name}</h3>
                </div>

                <div className="flex items-center gap-3">
                  <RatingStars rating={item.overall_rating} />
                  <span className="text-sm font-bold text-primary">{item.overall_rating.toFixed(1)}</span>
                </div>

                <div className="space-y-3 py-2">
                   <div className="flex items-start gap-2 text-emerald-600">
                    <Check className="h-3.5 w-3.5 mt-0.5" />
                    <span className="text-[10px] md:text-xs font-bold text-slate-500 uppercase tracking-widest leading-none">KEY ADVANTAGE: {item.pros[0]}</span>
                   </div>
                   <div className="flex items-start gap-2 text-rose-500">
                    <X className="h-3.5 w-3.5 mt-0.5" />
                    <span className="text-[10px] md:text-xs font-bold text-slate-500 uppercase tracking-widest leading-none">WEAKNESS: {item.cons[0]}</span>
                   </div>
                </div>

                <div className="flex items-center justify-between gap-4 pt-2">
                  <span className="text-lg md:text-xl font-heading font-bold text-primary italic-prohibited">{item.price}</span>
                  <Link to={`/review/${item.slug}`}>
                    <Button variant="ghost" className="rounded-full h-10 px-6 text-xs font-bold uppercase tracking-widest hover:bg-primary/5 text-primary">
                      Details
                      <ChevronRight className="h-4 w-4 ml-1" />
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};
