import { useState, useEffect, useCallback } from "react";
import useEmblaCarousel from "embla-carousel-react";
import { ChevronLeft, ChevronRight, ZoomIn } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogTrigger,
  DialogTitle,
  DialogDescription
} from "@/components/ui/dialog";
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

export function ImageGallery({
  mainImage,
  images,
  alt,
  badge,
  badgeClassName,
  badgeIcon,
  isCompact
}: ImageGalleryProps) {
  const allImages = [mainImage, ...images].filter(Boolean);

  const [selectedIndex, setSelectedIndex] = useState(0);
  const [emblaRef, emblaApi] = useEmblaCarousel({
    loop: true
  });

  const scrollPrev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi?.scrollNext(), [emblaApi]);
  const scrollTo = useCallback((i: number) => emblaApi?.scrollTo(i), [emblaApi]);

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setSelectedIndex(emblaApi.selectedScrollSnap());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    onSelect();
    emblaApi.on("select", onSelect);
  }, [emblaApi, onSelect]);

  // =========================
  // ✅ SINGLE IMAGE
  // =========================
  if (allImages.length <= 1) {
    return (
      <Dialog>
        <DialogTrigger asChild>
          <div
            className={cn(
              "relative w-full bg-white overflow-hidden",
              "h-[60vh] md:h-auto md:aspect-[4/3]",
              "-mx-3 md:mx-0",
              isCompact
                ? "rounded-none md:rounded-2xl shadow-xl"
                : "rounded-none md:rounded-[2rem] shadow-2xl"
            )}
          >
            <img
              src={allImages[0]}
              alt={alt}
              className="w-full h-full object-contain"
              loading="eager"
            />

            {/* Zoom */}
            <div className="absolute inset-0 flex items-center justify-center bg-black/0 hover:bg-black/5 transition">
              <ZoomIn className="opacity-0 hover:opacity-100 text-white w-8 h-8" />
            </div>

            {/* Badge */}
            {badge && (
              <div
                className={cn(
                  "absolute top-4 left-4 px-4 py-1.5 text-xs font-bold rounded-full shadow-lg z-20",
                  badgeClassName || "bg-primary text-white"
                )}
              >
                {badgeIcon}
                {badge}
              </div>
            )}
          </div>
        </DialogTrigger>

        {/* Zoom View */}
        <DialogContent className="bg-black/90 backdrop-blur-sm border-none max-w-[95vw] max-h-[95vh] p-0 flex items-center justify-center">
          <DialogTitle className="sr-only">{alt}</DialogTitle>
          <DialogDescription className="sr-only">zoom image</DialogDescription>

          <img
            src={allImages[0]}
            className="max-w-full max-h-[90vh] object-contain"
          />
        </DialogContent>
      </Dialog>
    );
  }

  // =========================
  // ✅ MULTIPLE IMAGES
  // =========================
  return (
    <div className="w-full space-y-4">
      {/* HERO */}
      <div
        className={cn(
          "relative w-full bg-white overflow-hidden group",
          "h-[60vh] md:h-auto md:aspect-[4/3]",
          "-mx-3 md:mx-0",
          isCompact
            ? "rounded-none md:rounded-2xl shadow-xl"
            : "rounded-none md:rounded-[2rem] shadow-2xl"
        )}
      >
        {/* swipe hint */}
        <div className="absolute inset-y-0 left-0 w-10 bg-gradient-to-r from-black/5 to-transparent z-10 md:hidden" />
        <div className="absolute inset-y-0 right-0 w-10 bg-gradient-to-l from-black/5 to-transparent z-10 md:hidden" />

        <div ref={emblaRef} className="overflow-hidden h-full">
          <div className="flex h-full">
            {allImages.map((img, i) => (
              <div key={i} className="flex-[0_0_100%] h-full">
                <Dialog>
                  <DialogTrigger asChild>
                    <img
                      src={img}
                      alt={`${alt}-${i}`}
                      className="w-full h-full object-contain cursor-zoom-in"
                      loading={i === 0 ? "eager" : "lazy"}
                    />
                  </DialogTrigger>

                  <DialogContent className="bg-black/90 backdrop-blur-sm border-none max-w-[95vw] max-h-[95vh] p-0 flex items-center justify-center">
                    <img
                      src={img}
                      className="max-w-full max-h-[90vh] object-contain"
                    />
                  </DialogContent>
                </Dialog>
              </div>
            ))}
          </div>
        </div>

        {/* Badge */}
        {badge && (
          <div
            className={cn(
              "absolute top-4 left-4 px-4 py-1.5 text-xs font-bold rounded-full shadow-lg z-20",
              badgeClassName || "bg-primary text-white"
            )}
          >
            {badgeIcon}
            {badge}
          </div>
        )}

        {/* arrows */}
        <Button
          size="icon"
          variant="ghost"
          onClick={scrollPrev}
          className="hidden md:flex absolute left-3 top-1/2 -translate-y-1/2"
        >
          <ChevronLeft />
        </Button>

        <Button
          size="icon"
          variant="ghost"
          onClick={scrollNext}
          className="hidden md:flex absolute right-3 top-1/2 -translate-y-1/2"
        >
          <ChevronRight />
        </Button>

        {/* counter */}
        <div className="absolute bottom-4 right-4 bg-black/60 text-white text-xs px-3 py-1 rounded-full">
          {selectedIndex + 1} / {allImages.length}
        </div>
      </div>

      {/* THUMBNAILS */}
      <div className="flex gap-3 overflow-x-auto pb-2">
        {allImages.map((img, i) => (
          <button
            key={i}
            onClick={() => scrollTo(i)}
            className={cn(
              "w-20 h-20 rounded-xl overflow-hidden border-2 bg-white",
              i === selectedIndex
                ? "border-primary scale-105 shadow"
                : "opacity-60"
            )}
          >
            <img
              src={img}
              className="w-full h-full object-contain"
              loading="lazy"
            />
          </button>
        ))}
      </div>
    </div>
  );
}