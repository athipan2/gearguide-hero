import React, { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

interface ScoreGaugeProps {
  score: number;
  maxScore?: number;
  className?: string;
  label?: string;
  strokeWidth?: number;
  size?: number; // Visual size in pixels (optional, Tailwind classes preferred)
}

export function ScoreGauge({
  score,
  maxScore = 5,
  className,
  label = "CORE SCORE",
  strokeWidth = 10,
  size
}: ScoreGaugeProps) {
  const [offset, setOffset] = useState(0);
  const coordinateSize = 100; // Base size for internal coordinate system
  const radius = (coordinateSize - strokeWidth) / 2;
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
      className={cn("relative flex items-center justify-center aspect-square", className)}
      style={size ? { width: size, height: size } : undefined}
    >
      <svg
        viewBox={`0 0 ${coordinateSize} ${coordinateSize}`}
        className="rotate-[-90deg] w-full h-full"
      >
        {/* Background circle */}
        <circle
          cx={coordinateSize / 2}
          cy={coordinateSize / 2}
          r={radius}
          stroke="currentColor"
          strokeWidth={strokeWidth}
          fill="transparent"
          className="text-primary/10"
        />
        {/* Progress circle */}
        <circle
          cx={coordinateSize / 2}
          cy={coordinateSize / 2}
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

      <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-[15%]">
        <span className="font-heading text-3xl md:text-5xl font-semibold tracking-tighter text-primary leading-none">
          {score.toFixed(1)}
        </span>
        <span className="text-[8px] md:text-[10px] font-semibold uppercase tracking-widest text-primary/40 mt-1 md:mt-2">
          {label}
        </span>
      </div>

      {/* Decorative glow */}
      <div className="absolute inset-0 rounded-full bg-accent/5 blur-xl -z-10" />
    </div>
  );
}
