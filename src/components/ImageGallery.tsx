import { useState, useEffect, useCallback } from "react";
import useEmblaCarousel from "embla-carousel-react";
import { ChevronLeft, ChevronRight, ZoomIn } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { cn } from "@/lib/utils";

interface ImageGalleryProps {
  mainImage: string;
  images: string[];
  alt: string;
  badge?: string | null;
  badgeClassName?: string;
  badgeIcon?: React.ReactNode;
  isCompact?: boolean;
}

export function ImageGallery({ mainImage, images, alt, badge, badgeClassName, badgeIcon, isCompact }: ImageGalleryProps) {
  const allImages = [mainImage, ...images].filter(Boolean);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [emblaRef, emblaApi] = useEmblaCarousel({
    loop: true,
    duration: 25,
    skipSnaps: false,
    dragFree: false
  });

  const scrollPrev = useCallback(() => emblaApi && emblaApi.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi && emblaApi.scrollNext(), [emblaApi]);
  const scrollTo = useCallback((index: number) => emblaApi && emblaApi.scrollTo(index), [emblaApi]);

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setSelectedIndex(emblaApi.selectedScrollSnap());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    onSelect();
    emblaApi.on("select", onSelect);
    emblaApi.on("reInit", onSelect);
  }, [emblaApi, onSelect]);

  if (allImages.length <= 1) {
    return (
      <Dialog>
        <DialogTrigger asChild>
          <div className={cn(
            "relative overflow-hidden bg-white aspect-square md:aspect-[4/3] max-h-[60vh] md:max-h-none cursor-zoom-in group p-4",
            "-mx-3 md:mx-0", // Force edge-to-edge on mobile
            isCompact ? "rounded-none md:rounded-2xl shadow-xl" : "rounded-none md:rounded-[2rem] shadow-2xl"
          )}>
            <img
              src={allImages[0] || ""}
              alt={alt}
              className="w-full h-full object-contain md:group-hover:scale-105 transition-transform duration-700 relative z-0"
              loading="eager"
            />
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors flex items-center justify-center z-10">
              <ZoomIn className="text-white opacity-0 group-hover:opacity-100 transition-opacity w-8 h-8" />
            </div>
            {badge && (
              <div className={`absolute top-4 left-4 md:top-6 md:left-6 px-5 py-2 md:px-6 md:py-2.5 rounded-full text-[10px] md:text-xs font-bold uppercase tracking-widest flex items-center gap-2 shadow-xl z-20 ${badgeClassName || "bg-primary text-primary-foreground"}`}>
                {badgeIcon}
                {badge}
              </div>
            )}
          </div>
        </DialogTrigger>
        <DialogContent className="max-w-[95vw] max-h-[95vh] p-0 border-none bg-black/90 backdrop-blur-sm shadow-none flex items-center justify-center">
          <DialogTitle className="sr-only">{alt}</DialogTitle>
          <DialogDescription className="sr-only">รูปขยายของ {alt}</DialogDescription>
          <div className="relative w-full h-full flex items-center justify-center">
            <img src={allImages[0]} alt={alt} className="max-w-full max-h-[90vh] object-contain" />
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <div className={cn(isCompact ? "space-y-3 md:space-y-2" : "space-y-4 md:space-y-3", "w-full")}>
      {/* Main carousel */}
      <div className={cn(
        "relative overflow-hidden bg-white aspect-square md:aspect-[4/3] max-h-[60vh] md:max-h-none group w-full",
        "-mx-3 md:mx-0", // Force edge-to-edge on mobile
        isCompact ? "rounded-none md:rounded-2xl shadow-xl" : "rounded-none md:rounded-[2rem] shadow-2xl",
        "p-4"
      )}>
        {/* Swipe Hint - Gradient edges */}
        <div className="absolute inset-y-0 left-0 w-12 bg-gradient-to-r from-black/5 to-transparent z-10 pointer-events-none md:hidden" />
        <div className="absolute inset-y-0 right-0 w-12 bg-gradient-to-l from-black/5 to-transparent z-10 pointer-events-none md:hidden" />

        <div className="overflow-hidden h-full w-full relative z-0" ref={emblaRef}>
          <div className="flex h-full">
            {allImages.map((img, i) => (
              <div key={i} className="flex-[0_0_100%] min-w-0 relative h-full">
                <Dialog>
                  <DialogTrigger asChild>
                    <div className="w-full h-full cursor-zoom-in">
                      <img
                        src={img}
                        alt={`${alt} - ${i + 1}`}
                        className="w-full h-full object-contain"
                        loading={i === 0 ? "eager" : "lazy"}
                      />
                    </div>
                  </DialogTrigger>
                  <DialogContent className="max-w-[95vw] max-h-[95vh] p-0 border-none bg-black/90 backdrop-blur-sm shadow-none">
                    <DialogTitle className="sr-only">{alt} - รูปที่ {i + 1}</DialogTitle>
                    <DialogDescription className="sr-only">รูปขยายของ {alt} รูปที่ {i + 1}</DialogDescription>
                    <div className="relative w-full h-full flex items-center justify-center">
                      <img src={img} alt={`${alt} - ${i + 1}`} className="max-w-full max-h-[90vh] object-contain" />
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
            ))}
          </div>
        </div>

        {badge && (
          <div className={`absolute top-4 left-4 md:top-6 md:left-6 px-5 py-2 md:px-6 md:py-2.5 rounded-full text-[10px] md:text-xs font-bold uppercase tracking-widest flex items-center gap-2 shadow-xl z-20 ${badgeClassName || "bg-primary text-primary-foreground"}`}>
            {badgeIcon}
            {badge}
          </div>
        )}

        {/* Navigation arrows (hidden on mobile, shown on desktop hover) */}
        <Button
          variant="ghost"
          size="icon"
          className="absolute left-3 top-1/2 -translate-y-1/2 bg-background/70 backdrop-blur-sm hover:bg-background/90 opacity-0 md:group-hover:opacity-100 transition-opacity rounded-full hidden md:flex z-20"
          onClick={scrollPrev}
          aria-label="รูปภาพก่อนหน้า"
        >
          <ChevronLeft className="h-5 w-5" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="absolute right-3 top-1/2 -translate-y-1/2 bg-background/70 backdrop-blur-sm hover:bg-background/90 opacity-0 md:group-hover:opacity-100 transition-opacity rounded-full hidden md:flex z-20"
          onClick={scrollNext}
          aria-label="รูปภาพถัดไป"
        >
          <ChevronRight className="h-5 w-5" />
        </Button>

        {/* Counter */}
        <div className="absolute bottom-4 right-4 bg-primary/90 backdrop-blur-md text-white text-[10px] md:text-xs font-bold px-3 py-1 md:px-4 md:py-1.5 rounded-full z-20 border border-white/10 tracking-widest">
          {selectedIndex + 1} / {allImages.length}
        </div>
      </div>

      {/* Thumbnails */}
      <div className={cn(
        "flex overflow-x-auto pb-4 pt-1 px-0 md:px-0 scrollbar-hide snap-x snap-mandatory gap-3 md:gap-4",
      )}>
        {allImages.map((img, i) => (
          <button
            key={i}
            onClick={() => scrollTo(i)}
            className={cn(
              "shrink-0 overflow-hidden border-2 transition-all snap-start bg-white p-1",
              "w-16 h-16 md:w-24 md:h-24 rounded-xl md:rounded-2xl",
              i === selectedIndex
                ? "border-primary ring-2 md:ring-4 ring-primary/10 scale-105 shadow-lg z-10 opacity-100"
                : "border-transparent opacity-60 hover:opacity-100 hover:scale-105"
            )}
          >
            <img src={img} alt={`${alt} thumbnail ${i + 1}`} className="w-full h-full object-contain" loading="lazy" />
          </button>
        ))}
      </div>
    </div>
  );
}
