import { Star, StarHalf } from "lucide-react";

interface RatingStarsProps {
  rating: number;
  maxRating?: number;
}

export function RatingStars({ rating, maxRating = 5 }: RatingStarsProps) {
  const full = Math.floor(rating);
  const hasHalf = rating - full >= 0.5;
  const empty = maxRating - full - (hasHalf ? 1 : 0);

  return (
    <div className="flex items-center gap-0.5">
      {Array.from({ length: full }).map((_, i) => (
        <Star key={`f${i}`} className="h-4 w-4 fill-rating text-rating" />
      ))}
      {hasHalf && <StarHalf className="h-4 w-4 fill-rating text-rating" />}
      {Array.from({ length: empty }).map((_, i) => (
        <Star key={`e${i}`} className="h-4 w-4 text-muted-foreground/30" />
      ))}
      <span className="ml-1.5 text-sm font-semibold text-foreground">{rating.toFixed(1)}</span>
    </div>
  );
}
