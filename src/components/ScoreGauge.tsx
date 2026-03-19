import React, { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

interface ScoreGaugeProps {
  score: number;
  maxScore?: number;
  className?: string;
  label?: string;
  strokeWidth?: number;
}

export function ScoreGauge({
  score,
  maxScore = 5,
  className,
  label = "CORE SCORE",
  strokeWidth = 10
}: ScoreGaugeProps) {
  const [offset, setOffset] = useState(0);
  const size = 100; // Base size for internal coordinate system
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const percentage = (score / maxScore) * 100;

  useEffect(() => {
    const progressOffset = circumference - (percentage / 100) * circumference;
    // Small delay to ensure entry animation plays
    const timer = setTimeout(() => {
      setOffset(progressOffset);
    }, 100);
    return () => clearTimeout(timer);
  }, [circumference, percentage]);

  return (
    <div
      className={cn("relative flex items-center justify-center aspect-square w-full h-full", className)}
    >
      <svg
        viewBox={`0 0 ${size} ${size}`}
        className="rotate-[-90deg] w-full h-full"
      >
        {/* Background circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="currentColor"
          strokeWidth={strokeWidth}
          fill="transparent"
          className="text-primary/10"
        />
        {/* Progress circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="currentColor"
          strokeWidth={strokeWidth}
          fill="transparent"
          strokeDasharray={circumference}
          strokeDashoffset={circumference} // Start at full circumference
          style={{
            strokeDashoffset: offset,
            transition: "stroke-dashoffset 1.5s cubic-bezier(0.19, 1, 0.22, 1)",
          }}
          strokeLinecap="round"
          className="text-accent"
        />
      </svg>

      <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
        <span className="font-heading text-[25%] md:text-[30%] font-semibold tracking-tighter text-primary leading-none">
          {score.toFixed(1)}
        </span>
        <span className="text-[6%] md:text-[7%] font-semibold uppercase tracking-widest text-primary/40 mt-[2%]">
          {label}
        </span>
      </div>

      {/* Decorative glow */}
      <div className="absolute inset-0 rounded-full bg-accent/5 blur-xl -z-10" />
    </div>
  );
}
