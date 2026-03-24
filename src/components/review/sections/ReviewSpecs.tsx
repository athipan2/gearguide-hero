import { ReviewData, SpecItem } from "@/types/review";
import { cn } from "@/lib/utils";
import { Layers, Scale, ArrowDown, Target, Route, Zap } from "lucide-react";

interface ReviewSpecsProps {
  specs: SpecItem[];
  title?: string;
  className?: string;
}

const getIcon = (label: string) => {
  const l = label.toLowerCase();
  if (l.includes('weight') || l.includes('น้ำหนัก')) return Scale;
  if (l.includes('drop')) return ArrowDown;
  if (l.includes('เหมาะกับ')) return Target;
  if (l.includes('ระยะ')) return Route;
  if (l.includes('material') || l.includes('วัสดุ')) return Layers;
  return Zap;
};

export const ReviewSpecs = ({ specs, title = "KEY SPECS", className }: ReviewSpecsProps) => {
  return (
    <div className={cn("bg-white border border-primary/5 rounded-3xl p-8 shadow-sm", className)}>
      <h3 className="font-heading font-bold text-primary text-xs uppercase tracking-[0.3em] flex items-center gap-2 mb-8">
        <div className="w-2 h-4 bg-accent rounded-full" />
        {title}
      </h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-3">
        {specs.map((spec, i) => {
          const Icon = getIcon(spec.label);
          return (
            <div
              key={i}
              className={cn(
                "flex items-center justify-between p-4 rounded-xl transition-colors group",
                spec.highlight
                  ? "bg-accent/5 border border-accent/20"
                  : "bg-slate-50 border border-primary/5 hover:bg-slate-100"
              )}
            >
              <div className="flex items-center gap-3">
                <Icon className={cn(
                  "h-5 w-5 transition-colors",
                  spec.highlight ? "text-accent" : "text-primary/40 group-hover:text-primary"
                )} />
                <span className={cn(
                  "text-xs font-bold uppercase tracking-wider",
                  spec.highlight ? "text-accent" : "text-primary/40"
                )}>
                  {spec.label}
                </span>
              </div>
              <span className={cn(
                "font-bold text-sm",
                spec.highlight ? "text-accent" : "text-primary"
              )}>
                {spec.value}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};
