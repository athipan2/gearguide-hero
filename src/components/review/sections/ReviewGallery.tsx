import useEmblaCarousel from "embla-carousel-react";
import { useState, useCallback, useEffect } from "react";
import { useTranslation } from "@/hooks/useTranslation";
import { cn } from "@/lib/utils";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { ChevronLeft, ChevronRight, Maximize2 } from "lucide-react";

interface ReviewGalleryProps {
  images: string[];
  name: string;
}

export const ReviewGallery = ({ images, name }: ReviewGalleryProps) => {
  const { t } = useTranslation();
  const [emblaRef, emblaApi] = useEmblaCarousel({
    loop: true,
    align: "start",
    skipSnaps: false,
    dragFree: true
  });

  const [selectedIndex, setSelectedIndex] = useState(0);

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setSelectedIndex(emblaApi.selectedScrollSnap());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    onSelect();
    emblaApi.on("select", onSelect);
  }, [emblaApi, onSelect]);

  const scrollTo = useCallback(
    (index: number) => emblaApi && emblaApi.scrollTo(index),
    [emblaApi]
  );

  return (
    <section className="bg-white p-6 md:p-8 rounded-none md:rounded-3xl border-y md:border-2 border-slate-100 shadow-sm md:shadow-none space-y-8 md:space-y-12 overflow-hidden">
      <div className="space-y-4">
        <h2 className="font-heading text-2xl md:text-3xl font-bold text-primary flex items-center gap-3">
          <span className="w-8 h-1 bg-accent rounded-full" />
          {t("review.detailed_gallery")}
        </h2>
        <p className="text-sm md:text-base text-slate-500 font-medium">
          {t("review.gallery_subtitle")}
        </p>
      </div>

      <div className="relative group">
        <div className="overflow-hidden cursor-zoom-in" ref={emblaRef}>
          <div className="flex">
            {images.map((img, i) => (
              <div key={i} className="flex-[0_0_100%] min-w-0 pl-4 first:pl-0">
                <Dialog>
                  <DialogTrigger asChild>
                    <div className="relative aspect-[4/3] md:aspect-[16/9] w-full rounded-2xl md:rounded-[2.5rem] overflow-hidden group/img">
                      <img
                        src={img}
                        alt={`${name} review image ${i + 1}`}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover/img:scale-105"
                        loading={i === 0 ? "eager" : "lazy"}
                      />
                      <div className="absolute inset-0 bg-black/0 group-hover/img:bg-black/10 transition-colors" />
                      <div className="absolute bottom-6 right-6 h-12 w-12 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center text-primary opacity-0 group-hover/img:opacity-100 transition-opacity shadow-xl">
                        <Maximize2 className="h-5 w-5" />
                      </div>
                    </div>
                  </DialogTrigger>
                  <DialogContent className="max-w-[95vw] md:max-w-[90vw] lg:max-w-[80vw] h-auto p-0 border-none bg-transparent shadow-none overflow-hidden">
                    <img src={img} alt={name} className="w-full h-auto object-contain rounded-3xl" />
                  </DialogContent>
                </Dialog>
              </div>
            ))}
          </div>
        </div>

        {/* Custom Navigation */}
        <button
          onClick={() => emblaApi?.scrollPrev()}
          className="absolute left-4 top-1/2 -translate-y-1/2 h-14 w-14 rounded-full bg-white/90 backdrop-blur-sm shadow-xl flex items-center justify-center text-primary opacity-0 group-hover:opacity-100 transition-opacity disabled:opacity-0 z-20"
          disabled={!emblaApi?.canScrollPrev()}
        >
          <ChevronLeft className="h-6 w-6" />
        </button>
        <button
          onClick={() => emblaApi?.scrollNext()}
          className="absolute right-4 top-1/2 -translate-y-1/2 h-14 w-14 rounded-full bg-white/90 backdrop-blur-sm shadow-xl flex items-center justify-center text-primary opacity-0 group-hover:opacity-100 transition-opacity disabled:opacity-0 z-20"
          disabled={!emblaApi?.canScrollNext()}
        >
          <ChevronRight className="h-6 w-6" />
        </button>
      </div>

      {/* Thumbnails */}
      <div className="flex gap-4 md:gap-6 overflow-x-auto whitespace-nowrap scrollbar-hide py-4 md:py-6 max-w-full justify-center">
        {images.map((img, i) => (
          <button
            key={i}
            onClick={() => scrollTo(i)}
            className={cn(
              "relative flex-[0_0_80px] md:flex-[0_0_120px] aspect-square rounded-xl md:rounded-2xl overflow-hidden border-2 transition-all duration-300",
              selectedIndex === i
                ? "border-accent scale-110 shadow-lg shadow-accent/20 opacity-100"
                : "border-transparent opacity-60 hover:opacity-100"
            )}
          >
            <img src={img} className="w-full h-full object-cover" alt={`Thumb ${i}`} />
          </button>
        ))}
      </div>
    </section>
  );
};
