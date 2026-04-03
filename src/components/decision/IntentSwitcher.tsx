import React from 'react';
import { cn } from '@/lib/utils';
import { Target, Zap, Clock, Mountain } from 'lucide-react';

export interface IntentOption {
  id: string;
  label: string;
  icon: 'race' | 'daily' | 'ultra' | 'trail' | 'watch';
}

interface IntentSwitcherProps {
  options: IntentOption[];
  activeId: string;
  onChange: (id: string) => void;
  className?: string;
}

const IconMap = {
  race: Zap,
  daily: Clock,
  ultra: Zap,
  trail: Mountain,
  watch: Target
};

/**
 * High-engagement Intent Switcher.
 * Triggers re-ranking in the Comparison Engine.
 */
export const IntentSwitcher: React.FC<IntentSwitcherProps> = ({
  options,
  activeId,
  onChange,
  className
}) => {
  return (
    <div className={cn("flex gap-2 overflow-x-auto pb-4 no-scrollbar", className)}>
      {options.map((option) => {
        const Icon = IconMap[option.icon] || Target;
        const isActive = activeId === option.id;

        return (
          <button
            key={option.id}
            onClick={() => onChange(option.id)}
            className={cn(
              "flex flex-col items-center gap-2 px-6 py-4 rounded-3xl transition-all min-w-[120px] border-2",
              isActive
                ? "bg-primary border-primary text-primary-foreground shadow-lg scale-105"
                : "bg-white border-slate-100 text-slate-400 hover:border-primary/20"
            )}
          >
            <div className={cn(
              "p-2 rounded-xl",
              isActive ? "bg-white/20" : "bg-slate-50"
            )}>
              <Icon className="w-5 h-5" />
            </div>
            <span className="text-xs font-bold uppercase tracking-widest whitespace-nowrap">
              {option.label}
            </span>
          </button>
        );
      })}
    </div>
  );
};
