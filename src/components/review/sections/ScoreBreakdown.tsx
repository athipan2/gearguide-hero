import { ReviewRating } from "@/types/review";
import { cn } from "@/lib/utils";

interface ScoreBreakdownProps {
  ratings: ReviewRating[];
}

export const ScoreBreakdown = ({ ratings }: ScoreBreakdownProps) => {
  return (
    <section className="bg-white p-6 md:p-8 rounded-none md:rounded-3xl border-y md:border-2 border-slate-100 shadow-sm md:shadow-none space-y-8 md:space-y-12">
      <div className="space-y-4">
        <h2 className="font-heading text-2xl md:text-3xl font-bold text-primary flex items-center gap-3">
          <span className="w-8 h-1 bg-accent rounded-full" />
          Expert Score Breakdown
        </h2>
        <p className="text-sm md:text-base text-slate-500 font-medium">
          คะแนนเจาะลึกในแต่ละมิติ จากการทดสอบและรวบรวมข้อมูล
        </p>
      </div>

      <div className="grid sm:grid-cols-2 gap-x-12 gap-y-10">
        {ratings.map((rating) => (
          <div key={rating.label} className="group space-y-3">
            <div className="flex justify-between items-end gap-2">
              <span className="text-sm md:text-base font-bold uppercase tracking-widest text-slate-600 group-hover:text-primary transition-colors duration-300">
                {rating.label}
              </span>
              <div className="flex items-baseline gap-1">
                <span className="text-2xl font-bold text-primary tabular-nums">{rating.score.toFixed(1)}</span>
                <span className="text-xs font-bold text-slate-400">/ 5.0</span>
              </div>
            </div>

            <div className="h-4 w-full bg-slate-100 rounded-full overflow-hidden border border-slate-200/30 relative">
              <div
                className={cn(
                  "h-full rounded-full transition-all duration-1000 ease-out relative z-10",
                  rating.score >= 4.5 ? "bg-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.3)]" :
                  rating.score >= 3.5 ? "bg-primary" : "bg-amber-500"
                )}
                style={{ width: `${(rating.score / 5) * 100}%` }}
              >
                <div className="absolute inset-0 bg-white/20 animate-shimmer" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};
