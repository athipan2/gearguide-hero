import { Button, ButtonProps } from "@/components/ui/button";
import { ExternalLink } from "lucide-react";
import { cn } from "@/lib/utils";

interface AffiliateCTAProps extends ButtonProps {
  url?: string | null;
  ctaText?: string;
  productName: string;
}

export function AffiliateCTA({
  url,
  ctaText = "ดูราคาล่าสุด",
  productName,
  className,
  children,
  ...props
}: AffiliateCTAProps) {
  const handleAffiliateClick = () => {
    // tracking click event
    console.log(`[Affiliate Click] Product: ${productName}, URL: ${url}`);

    // In production, you would send this to GA4, Pixel, etc.
    // Example: window.gtag('event', 'affiliate_click', { product_name: productName });
  };

  const content = children || (
    <>
      {ctaText}
      <ExternalLink className="ml-2 h-4 w-4" />
    </>
  );

  if (!url) {
    return (
      <Button className={cn("cursor-not-allowed opacity-70", className)} {...props}>
        {content}
      </Button>
    );
  }

  return (
    <Button
      className={className}
      asChild
      onClick={handleAffiliateClick}
      {...props}
    >
      <a href={url} target="_blank" rel="noopener noreferrer nofollow">
        {content}
      </a>
    </Button>
  );
}
