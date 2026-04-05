import React from 'react';
import { cn } from '@/lib/utils';
import { ShieldCheck, Info } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

interface ConfidenceBarProps {
  score: number; // 0-1
  label?: string;
  className?: string;
}

/**
 * Trust-building Confidence Score.
 * Indicates reliability of comparison data.
 */
export const ConfidenceBar: React.FC<ConfidenceBarProps> = ({
  score,
  label = "Data Reliability Score",
  className
}) => {
  const percentage = Math.round(score * 100);

  const getStatusColor = (s: number) => {
    if (s >= 0.9) return "bg-green-500";
    if (s >= 0.7) return "bg-blue-500";
    return "bg-amber-500";
  };

  const getStatusText = (s: number) => {
    if (s >= 0.9) return "Verified Expert Data";
    if (s >= 0.7) return "High Confidence";
    return "Partial Spec Comparison";
  };

  return (
    <div className={cn("p-4 bg-slate-50 rounded-2xl border border-slate-100", className)}>
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-primary" />
          <span className="text-[10px] font-bold uppercase tracking-widest text-slate-500">{label}</span>
        </div>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger>
              <Info className="w-3 h-3 text-slate-300" />
            </TooltipTrigger>
            <TooltipContent>
              <p className="text-xs">Based on spec completeness and real-world testing data.</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>

      <div className="flex items-center gap-4">
        <div className="flex-1 h-2 bg-slate-200 rounded-full overflow-hidden">
          <div
            className={cn("h-full transition-all duration-1000 ease-out", getStatusColor(score))}
            style={{ width: `${percentage}%` }}
          />
        </div>
        <span className="text-sm font-bold text-slate-700">{percentage}%</span>
      </div>

      <p className="mt-2 text-[10px] font-semibold text-slate-400 uppercase tracking-tighter text-right">
        {getStatusText(score)}
      </p>
    </div>
  );
};
