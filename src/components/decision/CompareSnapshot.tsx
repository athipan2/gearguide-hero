import React from 'react';
import { cn } from '@/lib/utils';
import { Check, X, Minus } from 'lucide-react';

interface MetricSnapshot {
  label: string;
  p1Value: string | number;
  p2Value: string | number;
  winner: 1 | 2 | null;
}

interface CompareSnapshotProps {
  product1Name: string;
  product2Name: string;
  metrics: MetricSnapshot[];
  className?: string;
}

/**
 * Mobile-First Comparison Snapshot.
 * Focuses on Key Differences rather than a full table.
 */
export const CompareSnapshot: React.FC<CompareSnapshotProps> = ({
  product1Name,
  product2Name,
  metrics,
  className
}) => {
  return (
    <div className={cn("bg-white rounded-[2rem] border border-slate-100 shadow-sm overflow-hidden", className)}>
      <div className="grid grid-cols-[1fr_auto_1fr] bg-slate-50 border-b border-slate-100 px-6 py-4">
        <span className="text-[10px] font-bold uppercase tracking-widest text-primary truncate text-center">{product1Name}</span>
        <div className="px-4 text-[10px] font-bold text-slate-300">VS</div>
        <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400 truncate text-center">{product2Name}</span>
      </div>

      <div className="divide-y divide-slate-50">
        {metrics.map((metric, idx) => (
          <div key={idx} className="grid grid-cols-[1fr_120px_1fr] items-center px-4 py-6 hover:bg-slate-50/50 transition-colors">
            {/* P1 Value */}
            <div className={cn(
              "text-center font-bold text-lg",
              metric.winner === 1 ? "text-primary" : "text-slate-400"
            )}>
              {metric.p1Value}
              {metric.winner === 1 && <Check className="inline-block ml-1 w-4 h-4 text-green-500" />}
            </div>

            {/* Metric Label */}
            <div className="text-center">
              <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400 bg-slate-100 px-3 py-1 rounded-full whitespace-nowrap">
                {metric.label}
              </span>
            </div>

            {/* P2 Value */}
            <div className={cn(
              "text-center font-bold text-lg",
              metric.winner === 2 ? "text-primary" : "text-slate-400"
            )}>
              {metric.p2Value}
              {metric.winner === 2 && <Check className="inline-block ml-1 w-4 h-4 text-green-500" />}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
