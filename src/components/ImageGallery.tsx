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
            "relative overflow-hidden bg-muted aspect-[4/3] cursor-zoom-in group",
            isCompact ? "md:rounded-2xl shadow-xl" : "md:rounded-[2rem] shadow-2xl"
          )}>
            <img src={allImages[0] || ""} alt={alt} className="w-full h-full object-cover md:group-hover:scale-105 transition-transform duration-700" />
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors flex items-center justify-center">
              <ZoomIn className="text-white opacity-0 group-hover:opacity-100 transition-opacity w-8 h-8" />
            </div>
            {badge && (
              <div className={`absolute top-4 left-4 md:top-6 md:left-6 px-4 py-1.5 md:px-5 md:py-2 rounded-full text-[10px] md:text-xs font-semibold uppercase tracking-widest flex items-center gap-2 shadow-xl ${badgeClassName || "bg-primary text-primary-foreground"}`}>
                {badgeIcon}
                {badge}
              </div>
            )}
          </div>
        </DialogTrigger>
        <DialogContent className="max-w-[95vw] max-h-[95vh] p-0 border-none bg-transparent shadow-none">
          <DialogTitle className="sr-only">{alt}</DialogTitle>
          <DialogDescription className="sr-only">รูปขยายของ {alt}</DialogDescription>
          <div className="relative w-full h-full flex items-center justify-center">
            <img src={allImages[0]} alt={alt} className="max-w-full max-h-[90vh] object-contain rounded-lg" />
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <div className={cn(isCompact ? "space-y-3 md:space-y-2" : "space-y-4 md:space-y-3")}>
      {/* Main carousel */}
      <div className={cn(
        "relative overflow-hidden bg-muted aspect-[4/3] group w-full",
        isCompact ? "md:rounded-2xl shadow-xl" : "md:rounded-[2rem] shadow-2xl"
      )}>
        <div className="overflow-hidden h-full w-full" ref={emblaRef}>
          <div className="flex h-full">
            {allImages.map((img, i) => (
              <div key={i} className="flex-[0_0_100%] min-w-0 relative h-full">
                <Dialog>
                  <DialogTrigger asChild>
                    <div className="w-full h-full cursor-zoom-in">
                      <img
                        src={img}
                        alt={`${alt} - ${i + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </DialogTrigger>
                  <DialogContent className="max-w-[95vw] max-h-[95vh] p-0 border-none bg-transparent shadow-none">
                    <DialogTitle className="sr-only">{alt} - รูปที่ {i + 1}</DialogTitle>
                    <DialogDescription className="sr-only">รูปขยายของ {alt} รูปที่ {i + 1}</DialogDescription>
                    <div className="relative w-full h-full flex items-center justify-center">
                      <img src={img} alt={`${alt} - ${i + 1}`} className="max-w-full max-h-[90vh] object-contain rounded-lg" />
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
            ))}
          </div>
        </div>

        {badge && (
          <div className={`absolute top-4 left-4 md:top-6 md:left-6 px-4 py-1.5 md:px-5 md:py-2 rounded-full text-[10px] md:text-xs font-semibold uppercase tracking-widest flex items-center gap-2 shadow-xl z-10 ${badgeClassName || "bg-primary text-primary-foreground"}`}>
            {badgeIcon}
            {badge}
          </div>
        )}

        {/* Navigation arrows (hidden on mobile, shown on desktop hover) */}
        <Button
          variant="ghost"
          size="icon"
          className="absolute left-3 top-1/2 -translate-y-1/2 bg-background/70 backdrop-blur-sm hover:bg-background/90 opacity-0 md:group-hover:opacity-100 transition-opacity rounded-full hidden md:flex"
          onClick={scrollPrev}
        >
          <ChevronLeft className="h-5 w-5" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="absolute right-3 top-1/2 -translate-y-1/2 bg-background/70 backdrop-blur-sm hover:bg-background/90 opacity-0 md:group-hover:opacity-100 transition-opacity rounded-full hidden md:flex"
          onClick={scrollNext}
        >
          <ChevronRight className="h-5 w-5" />
        </Button>

        {/* Counter */}
        <div className="absolute bottom-4 right-4 bg-background/70 backdrop-blur-sm text-foreground text-[10px] md:text-xs font-semibold px-3 py-1 rounded-full z-10">
          {selectedIndex + 1} / {allImages.length}
        </div>
      </div>

      {/* Thumbnails */}
      <div className={cn(
        "flex overflow-x-auto pb-2 px-3 md:px-1 scrollbar-hide snap-x snap-mandatory",
        isCompact ? "gap-2" : "gap-2 md:gap-3"
      )}>
        {allImages.map((img, i) => (
          <button
            key={i}
            onClick={() => scrollTo(i)}
            className={cn(
              "shrink-0 overflow-hidden border-2 transition-all snap-start",
              isCompact ? "w-10 h-10 md:w-16 md:h-16 rounded-lg md:rounded-xl" : "w-12 h-12 md:w-20 md:h-20 rounded-xl md:rounded-2xl",
              i === selectedIndex
                ? "border-primary ring-2 md:ring-4 ring-primary/10 scale-95 shadow-lg"
                : "border-transparent opacity-40 hover:opacity-100 hover:scale-105"
            )}
          >
            <img src={img} alt={`${alt} thumbnail ${i + 1}`} className="w-full h-full object-cover" />
          </button>
        ))}
      </div>
    </div>
  );
}
