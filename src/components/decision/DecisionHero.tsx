import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ShoppingCart, Trophy, Star } from 'lucide-react';
import { cn } from '@/lib/utils';

interface DecisionHeroProps {
  productName: string;
  brand: string;
  imageUrl?: string;
  score: number;
  verdict: string;
  price: string;
  affiliateUrl?: string;
  badgeText?: string;
  onBuyClick?: () => void;
}

/**
 * High-conversion Hero for the #1 Recommended Product.
 * Designed to help users decide in <5 seconds.
 */
export const DecisionHero: React.FC<DecisionHeroProps> = ({
  productName,
  brand,
  imageUrl,
  score,
  verdict,
  price,
  affiliateUrl,
  badgeText = "BEST MATCH",
  onBuyClick
}) => {
  return (
    <div className="relative overflow-hidden rounded-[2.5rem] bg-primary text-primary-foreground p-6 md:p-10 shadow-2xl">
      {/* Background patterns */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-accent/10 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none" />

      <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
        <div className="space-y-6">
          <div className="flex items-center gap-3">
            <Badge variant="secondary" className="bg-accent text-accent-foreground font-bold tracking-wider px-3 py-1 animate-pulse">
              <Trophy className="w-3 h-3 mr-1" /> {badgeText}
            </Badge>
            <div className="flex items-center gap-1 text-accent font-bold">
              <Star className="w-4 h-4 fill-current" />
              <span>{score.toFixed(1)} Match Score</span>
            </div>
          </div>

          <div className="space-y-2">
            <p className="text-accent font-semibold uppercase tracking-[0.2em] text-sm">{brand}</p>
            <h1 className="text-4xl md:text-6xl font-heading font-bold leading-tight tracking-tighter uppercase">
              {productName}
            </h1>
          </div>

          <p className="text-lg md:text-xl text-primary-foreground/80 font-medium leading-relaxed italic border-l-4 border-accent pl-6">
            "{verdict}"
          </p>

          <div className="flex flex-col sm:flex-row items-center gap-4 pt-4">
            <Button
              size="lg"
              className="w-full sm:w-auto rounded-full h-14 px-8 text-lg font-bold bg-accent text-accent-foreground hover:bg-accent/90 shadow-xl"
              onClick={onBuyClick}
              asChild={!!affiliateUrl}
            >
              {affiliateUrl ? (
                <a href={affiliateUrl} target="_blank" rel="noopener noreferrer">
                  Buy Now — {price} <ShoppingCart className="ml-2 w-5 h-5" />
                </a>
              ) : (
                <span>Buy Now — {price}</span>
              )}
            </Button>
            <p className="text-sm text-primary-foreground/60 font-semibold uppercase tracking-widest">
              Free Shipping & Returns
            </p>
          </div>
        </div>

        <div className="relative group">
          <div className="absolute inset-0 bg-white/5 rounded-[2rem] blur-2xl group-hover:bg-white/10 transition-colors" />
          <img
            src={imageUrl || "/placeholder.svg"}
            alt={productName}
            className="relative w-full aspect-square object-contain drop-shadow-[0_20px_50px_rgba(0,0,0,0.5)] transform hover:scale-105 transition-transform duration-500"
          />
        </div>
      </div>
    </div>
  );
};
