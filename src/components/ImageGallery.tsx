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
import { cn, getOptimizedImageUrl } from "@/lib/utils";

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
          {/* TASK 1 & 6: Premium Image Container with Mobile Full-Bleed */}
          <div
            className={cn(
              "relative w-screen left-1/2 right-1/2 -translate-x-1/2 md:w-full md:left-auto md:right-auto md:translate-x-0 bg-white overflow-hidden group",
              "w-full min-h-[350px] md:min-h-[550px] rounded-none md:rounded-3xl shadow-2xl transition-transform duration-500 hover:scale-[1.02] cursor-zoom-in p-0"
            )}
          >
            <img
              src={getOptimizedImageUrl(allImages[0], 'hero')}
              alt={alt}
              className="w-full h-full object-cover"
              loading="eager"
              // @ts-expect-error - fetchPriority is a valid but sometimes unrecognized React attribute
              fetchPriority="high"
            />

            {/* Zoom Icon overlay */}
            <div className="absolute inset-0 flex items-center justify-center bg-black/0 hover:bg-black/5 transition-colors">
              <ZoomIn className="opacity-0 group-hover:opacity-100 text-white w-8 h-8 drop-shadow-lg" />
            </div>

            {/* Badge */}
            {badge && (
              <div
                className={cn(
                  "absolute top-4 left-4 px-4 py-1.5 text-xs font-bold rounded-full shadow-lg z-20 flex items-center gap-1.5",
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

          {/* FIX 1: Zoomed images use object-contain to prevent cropping */}
          <img
            src={getOptimizedImageUrl(allImages[0], 'full')}
            className="w-full h-full max-h-[85vh] object-contain"
          />
        </DialogContent>
      </Dialog>
    );
  }

  // =========================
  // ✅ MULTIPLE IMAGES
  // =========================
  return (
    <div className="w-full space-y-8">
      {/* HERO */}
      {/* TASK 1 & 6: Premium Image Container with Mobile Full-Bleed */}
      <div
        className={cn(
          "relative w-screen left-1/2 right-1/2 -translate-x-1/2 md:w-full md:left-auto md:right-auto md:translate-x-0 bg-white overflow-hidden group p-0",
          "w-full min-h-[350px] md:min-h-[550px] rounded-none md:rounded-3xl shadow-2xl transition-transform duration-500 hover:scale-[1.02]"
        )}
      >
        {/* swipe hint gradient edges */}
        <div className="absolute inset-y-0 left-0 w-16 bg-gradient-to-r from-black/10 to-transparent z-10 md:hidden pointer-events-none" />
        <div className="absolute inset-y-0 right-0 w-16 bg-gradient-to-l from-black/10 to-transparent z-10 md:hidden pointer-events-none" />

        <div ref={emblaRef} className="overflow-hidden h-full">
          <div className="flex h-full">
            {allImages.map((img, i) => (
              <div key={i} className="flex-[0_0_100%] h-full relative">
                <Dialog>
                  <DialogTrigger asChild>
                    <img
                      src={getOptimizedImageUrl(img, 'hero')}
                      alt={`${alt}-${i}`}
                      className="w-full h-full object-cover cursor-zoom-in"
                      loading={i === 0 ? "eager" : "lazy"}
                      // @ts-expect-error - fetchPriority is a valid but sometimes unrecognized React attribute
                      fetchPriority={i === 0 ? "high" : undefined}
                    />
                  </DialogTrigger>

                  <DialogContent className="bg-black/90 backdrop-blur-sm border-none max-w-[95vw] max-h-[95vh] p-0 flex items-center justify-center">
                    <DialogTitle className="sr-only">{alt} - {i + 1}</DialogTitle>
                    <DialogDescription className="sr-only">viewing product image {i + 1}</DialogDescription>
                    {/* FIX 1: Zoomed images use object-contain to prevent cropping */}
                    <img
                      src={getOptimizedImageUrl(img, 'full')}
                      className="w-full h-full max-h-[85vh] object-contain"
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
              "absolute top-4 left-4 px-4 py-1.5 text-xs font-bold rounded-full shadow-lg z-20 flex items-center gap-1.5",
              badgeClassName || "bg-primary text-white"
            )}
          >
            {badgeIcon}
            {badge}
          </div>
        )}

        {/* arrows (Desktop) */}
        <Button
          size="icon"
          variant="secondary"
          onClick={scrollPrev}
          className="hidden md:flex absolute left-4 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity bg-white/80 hover:bg-white text-primary rounded-full shadow-xl"
        >
          <ChevronLeft className="h-6 w-6" />
        </Button>

        <Button
          size="icon"
          variant="secondary"
          onClick={scrollNext}
          className="hidden md:flex absolute right-4 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity bg-white/80 hover:bg-white text-primary rounded-full shadow-xl"
        >
          <ChevronRight className="h-6 w-6" />
        </Button>

        {/* counter */}
        <div className="absolute bottom-6 right-6 bg-black/60 backdrop-blur-md text-white text-[10px] md:text-xs font-bold px-4 py-1.5 rounded-full tracking-widest z-20">
          {selectedIndex + 1} / {allImages.length}
        </div>
      </div>

      {/* THUMBNAILS */}
      {/* TASK 4: Spacing system fix gap-4 -> gap-6 */}
      <div className="flex gap-6 overflow-x-auto pb-4 scrollbar-hide">
        {allImages.map((img, i) => (
          <button
            key={i}
            onClick={() => scrollTo(i)}
            className={cn(
              "relative w-20 h-20 md:w-24 md:h-24 rounded-xl md:rounded-2xl overflow-hidden border-2 bg-white transition-all duration-300 shrink-0 p-0",
              i === selectedIndex
                ? "border-accent scale-110 shadow-lg z-10 opacity-100"
                : "border-transparent opacity-40 hover:opacity-80 hover:scale-105"
            )}
          >
            <img
              src={getOptimizedImageUrl(img, 'thumbnail')}
              className="w-full h-full object-cover"
              loading="lazy"
            />
          </button>
        ))}
      </div>
    </div>
  );
}
