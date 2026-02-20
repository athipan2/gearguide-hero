import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ImageGalleryProps {
  mainImage: string;
  images: string[];
  alt: string;
  badge?: string | null;
  badgeClassName?: string;
  badgeIcon?: React.ReactNode;
}

export function ImageGallery({ mainImage, images, alt, badge, badgeClassName, badgeIcon }: ImageGalleryProps) {
  const allImages = [mainImage, ...images].filter(Boolean);
  const [activeIndex, setActiveIndex] = useState(0);

  if (allImages.length <= 1) {
    return (
      <div className="relative rounded-[2rem] overflow-hidden bg-muted shadow-2xl aspect-[4/3]">
        <img src={allImages[0] || ""} alt={alt} className="w-full h-full object-cover hover:scale-105 transition-transform duration-700" />
        {badge && (
          <div className={`absolute top-6 left-6 px-5 py-2 rounded-full text-xs font-black uppercase tracking-widest flex items-center gap-2 shadow-xl ${badgeClassName || "bg-primary text-primary-foreground"}`}>
            {badgeIcon}
            {badge}
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {/* Main image */}
      <div className="relative rounded-[2rem] overflow-hidden bg-muted shadow-2xl aspect-[4/3] group">
        <img
          src={allImages[activeIndex]}
          alt={`${alt} - ${activeIndex + 1}`}
          className="w-full h-full object-cover transition-transform duration-700"
        />
        {badge && (
          <div className={`absolute top-6 left-6 px-5 py-2 rounded-full text-xs font-black uppercase tracking-widest flex items-center gap-2 shadow-xl ${badgeClassName || "bg-primary text-primary-foreground"}`}>
            {badgeIcon}
            {badge}
          </div>
        )}
        {/* Navigation arrows */}
        <Button
          variant="ghost"
          size="icon"
          className="absolute left-3 top-1/2 -translate-y-1/2 bg-background/70 backdrop-blur-sm hover:bg-background/90 opacity-0 group-hover:opacity-100 transition-opacity rounded-full"
          onClick={() => setActiveIndex((prev) => (prev - 1 + allImages.length) % allImages.length)}
        >
          <ChevronLeft className="h-5 w-5" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="absolute right-3 top-1/2 -translate-y-1/2 bg-background/70 backdrop-blur-sm hover:bg-background/90 opacity-0 group-hover:opacity-100 transition-opacity rounded-full"
          onClick={() => setActiveIndex((prev) => (prev + 1) % allImages.length)}
        >
          <ChevronRight className="h-5 w-5" />
        </Button>
        {/* Counter */}
        <div className="absolute bottom-4 right-4 bg-background/70 backdrop-blur-sm text-foreground text-xs font-bold px-3 py-1 rounded-full">
          {activeIndex + 1} / {allImages.length}
        </div>
      </div>

      {/* Thumbnails */}
      <div className="flex gap-2 overflow-x-auto pb-1">
        {allImages.map((img, i) => (
          <button
            key={i}
            onClick={() => setActiveIndex(i)}
            className={`shrink-0 w-16 h-16 rounded-lg overflow-hidden border-2 transition-all ${
              i === activeIndex ? "border-primary ring-2 ring-primary/20" : "border-transparent opacity-60 hover:opacity-100"
            }`}
          >
            <img src={img} alt={`${alt} thumbnail ${i + 1}`} className="w-full h-full object-cover" />
          </button>
        ))}
      </div>
    </div>
  );
}
