import React from 'react';
import { Zap, ShieldAlert, ArrowUpRight, Scale } from 'lucide-react';
import { cn } from '@/lib/utils';

interface InsightCardProps {
  type: 'advantage' | 'tradeoff';
  metricLabel: string;
  message: string;
  className?: string;
}

/**
 * Insight Card derived from Actual Engine Data.
 * Minimizes cognitive load by focusing on 'Advantages' or 'Trade-offs'.
 */
export const InsightCard: React.FC<InsightCardProps> = ({
  type,
  metricLabel,
  message,
  className
}) => {
  const isAdvantage = type === 'advantage';

  return (
    <div className={cn(
      "group relative p-6 rounded-3xl border-2 transition-all duration-300 hover:shadow-xl",
      isAdvantage
        ? "bg-green-50 border-green-100 hover:border-green-300"
        : "bg-amber-50 border-amber-100 hover:border-amber-300",
      className
    )}>
      <div className="flex items-start gap-4">
        <div className={cn(
          "p-3 rounded-2xl shrink-0 group-hover:scale-110 transition-transform",
          isAdvantage ? "bg-green-500 text-white" : "bg-amber-500 text-white"
        )}>
          {isAdvantage ? <Zap className="w-6 h-6" /> : <ShieldAlert className="w-6 h-6" />}
        </div>

        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className={cn(
              "text-[10px] font-bold uppercase tracking-[0.2em]",
              isAdvantage ? "text-green-600" : "text-amber-600"
            )}>
              {metricLabel}
            </span>
            {isAdvantage && <div className="h-1 w-8 bg-green-200 rounded-full" />}
          </div>
          <p className="text-slate-800 font-semibold text-lg leading-tight">
            {message}
          </p>
        </div>
      </div>

      <div className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
        <div className={cn(
          "flex items-center gap-1 text-xs font-bold uppercase tracking-widest",
          isAdvantage ? "text-green-600" : "text-amber-600"
        )}>
          Learn More <ArrowUpRight className="w-3 h-3" />
        </div>
      </div>
    </div>
  );
};
