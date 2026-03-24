import { ImageGallery } from "@/components/ImageGallery";

interface ReviewGalleryProps {
  images: string[];
  name: string;
}

export const ReviewGallery = ({ images, name }: ReviewGalleryProps) => {
  if (!images || images.length === 0) return null;

  return (
    <div className="bg-white/40 md:bg-transparent p-8 md:p-0 rounded-3xl border border-primary/5 md:border-none shadow-sm md:shadow-none">
      <h2 className="font-heading text-2xl md:text-3xl font-semibold text-primary flex items-center gap-6 mb-8 md:mb-12 leading-none">
        <span className="h-10 md:h-12 w-3 bg-accent rounded-full shadow-lg shadow-accent/20" />
        Product Gallery
      </h2>
      <div className="rounded-2xl overflow-hidden border border-primary/5">
        <ImageGallery
          mainImage={images[0]}
          images={images}
          alt={name}
        />
      </div>
    </div>
  );
};
