import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { ShoppingCart } from 'lucide-react';
import { cn } from '@/lib/utils';

interface StickyBuyCTAProps {
  productName: string;
  price: string;
  affiliateUrl: string;
  onConvert?: () => void;
}

/**
 * Sticky Conversion Component.
 * Appears when the user has scrolled past the main hero,
 * keeping the decision actionable.
 */
export const StickyBuyCTA: React.FC<StickyBuyCTAProps> = ({
  productName,
  price,
  affiliateUrl,
  onConvert
}) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      // Show after 600px of scroll
      setIsVisible(window.scrollY > 600);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleClick = () => {
    // Analytics tracking (GA4 / Meta Pixel)
    const win = window as unknown as Record<string, unknown>;
    if (typeof win.gtag === 'function') {
      (win.gtag as (command: string, action: string, params: Record<string, unknown>) => void)('event', 'affiliate_conversion', {
        product_name: productName,
        value: price,
        currency: 'THB'
      });
    }
    onConvert?.();
  };

  return (
    <div className={cn(
      "fixed bottom-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-xl border-t border-slate-100 p-4 transition-all duration-500 transform",
      isVisible ? "translate-y-0" : "translate-y-full"
    )}>
      <div className="container mx-auto flex items-center justify-between gap-4">
        <div className="hidden sm:block">
          <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Buying Decision</p>
          <p className="font-bold text-slate-800 truncate max-w-[200px]">{productName}</p>
        </div>

        <div className="flex-1 flex items-center justify-between sm:justify-end gap-6">
          <div className="text-right">
            <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Best Price</p>
            <p className="text-xl font-black text-primary">{price}</p>
          </div>

          <Button
            className="rounded-full px-8 h-12 bg-accent text-accent-foreground font-black uppercase tracking-wider hover:bg-accent/90"
            onClick={handleClick}
            asChild
          >
            <a href={affiliateUrl} target="_blank" rel="noopener noreferrer">
              Get Deal <ShoppingCart className="ml-2 w-4 h-4" />
            </a>
          </Button>
        </div>
      </div>
    </div>
  );
};
