import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Share2, Link as LinkIcon, Check } from 'lucide-react';
import { toast } from 'sonner';

interface ShareRankingProps {
  category: string;
  intentId?: string;
  productIds: string[];
}

/**
 * Viral Growth Component.
 * Generates deterministic URLs for specific comparisons to encourage sharing.
 */
export const ShareRanking: React.FC<ShareRankingProps> = ({
  category,
  intentId,
  productIds
}) => {
  const [copied, setCopied] = useState(false);

  const generateLink = () => {
    const baseUrl = window.location.origin;
    const ids = productIds.join(',');
    return `${baseUrl}/compare/${category}?items=${ids}${intentId ? `&intent=${intentId}` : ''}`;
  };

  const handleShare = async () => {
    const link = generateLink();

    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Check out this gear comparison!',
          url: link
        });
      } catch (err) {
        console.error('Share failed', err);
      }
    } else {
      await navigator.clipboard.writeText(link);
      setCopied(true);
      toast.success("Comparison link copied to clipboard!");
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="flex flex-col items-center gap-4 p-8 bg-primary/5 rounded-[2.5rem] border border-dashed border-primary/20">
      <div className="text-center">
        <h4 className="font-bold text-lg text-primary">Found this helpful?</h4>
        <p className="text-sm text-muted-foreground">Share this exact comparison with your running group.</p>
      </div>

      <Button
        variant="hero"
        onClick={handleShare}
        className="rounded-full gap-2 px-8"
      >
        {copied ? <Check className="w-4 h-4" /> : <Share2 className="w-4 h-4" />}
        {copied ? "Link Copied" : "Share Comparison"}
      </Button>
    </div>
  );
};
