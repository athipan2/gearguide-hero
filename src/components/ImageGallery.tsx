import { useState, useEffect, useCallback } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import useEmblaCarousel from "embla-carousel-react";

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
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true });

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setActiveIndex(emblaApi.selectedScrollSnap());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    emblaApi.on("select", onSelect);
  }, [emblaApi, onSelect]);

  const scrollTo = useCallback((index: number) => {
    if (emblaApi) emblaApi.scrollTo(index);
  }, [emblaApi]);

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
      {/* Main image carousel */}
      <div className="relative rounded-[1.5rem] md:rounded-[2rem] overflow-hidden bg-muted shadow-xl md:shadow-2xl aspect-[4/3] group">
        <div className="overflow-hidden h-full w-full" ref={emblaRef}>
          <div className="flex h-full">
            {allImages.map((img, index) => (
              <div className="relative flex-[0_0_100%] min-w-0 h-full" key={index}>
                <img
                  src={img}
                  alt={`${alt} - ${index + 1}`}
                  className="w-full h-full object-cover"
                />
              </div>
            ))}
          </div>
        </div>

        {badge && (
          <div className={`absolute top-4 left-4 md:top-6 md:left-6 px-3 py-1.5 md:px-5 md:py-2 rounded-full text-[10px] md:text-xs font-black uppercase tracking-widest flex items-center gap-2 shadow-xl ${badgeClassName || "bg-primary text-primary-foreground"}`}>
            {badgeIcon}
            {badge}
          </div>
        )}

        {/* Navigation arrows (Hidden on mobile touch) */}
        <Button
          variant="ghost"
          size="icon"
          className="absolute left-3 top-1/2 -translate-y-1/2 bg-background/70 backdrop-blur-sm hover:bg-background/90 opacity-0 md:group-hover:opacity-100 transition-opacity rounded-full hidden md:flex"
          onClick={() => emblaApi?.scrollPrev()}
        >
          <ChevronLeft className="h-5 w-5" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="absolute right-3 top-1/2 -translate-y-1/2 bg-background/70 backdrop-blur-sm hover:bg-background/90 opacity-0 md:group-hover:opacity-100 transition-opacity rounded-full hidden md:flex"
          onClick={() => emblaApi?.scrollNext()}
        >
          <ChevronRight className="h-5 w-5" />
        </Button>

        {/* Counter */}
        <div className="absolute bottom-3 right-3 md:bottom-4 md:right-4 bg-background/70 backdrop-blur-sm text-foreground text-[10px] md:text-xs font-bold px-2 py-0.5 md:px-3 md:py-1 rounded-full">
          {activeIndex + 1} / {allImages.length}
        </div>
      </div>

      {/* Thumbnails */}
      <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar">
        {allImages.map((img, i) => (
          <button
            key={i}
            onClick={() => scrollTo(i)}
            className={`shrink-0 w-12 h-12 md:w-16 md:h-16 rounded-lg overflow-hidden border-2 transition-all ${
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
