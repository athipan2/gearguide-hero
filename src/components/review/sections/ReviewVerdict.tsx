import { Zap, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface ReviewVerdictProps {
  verdict: string;
  affiliateUrl?: string | null;
  ctaText?: string | null;
}

export const ReviewVerdict = ({ verdict, affiliateUrl, ctaText = "ดูราคาล่าสุด" }: ReviewVerdictProps) => {
  return (
    <div className="bg-primary rounded-3xl md:rounded-[2.5rem] p-6 md:p-16 shadow-[0_30px_60px_-15px_rgba(10,26,10,0.5)] relative overflow-hidden group border border-white/5">
      <div className="absolute top-0 right-0 w-[40rem] h-[40rem] bg-accent/10 blur-[120px] -translate-y-1/2 translate-x-1/2 pointer-events-none" />
      <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-[0.05] pointer-events-none" />

      <div className="relative z-10 max-w-5xl mx-auto text-center">
        <div className="inline-flex items-center gap-2 px-6 py-3 bg-white/5 backdrop-blur-2xl border border-white/10 text-white rounded-full text-xs font-bold uppercase tracking-[0.4em] mb-12 md:mb-16">
          <Zap className="h-4 w-4 fill-accent text-accent animate-pulse" />
          THE ULTIMATE VERDICT
        </div>

        <h2 className="font-heading text-3xl md:text-5xl font-bold text-white mb-10 md:mb-16 leading-[1.1] tracking-tighter">
          "{verdict}"
        </h2>

        <div className="flex flex-col md:flex-row items-center justify-center gap-8">
          <Button
            variant="hero"
            size="lg"
            className="h-12 md:h-16 px-10 md:px-16 rounded-full text-base md:text-xl w-full md:w-auto shadow-2xl shadow-accent/40 bg-accent text-white border-none hover:scale-105 active:scale-95 transition-all duration-500"
            asChild={!!affiliateUrl}
          >
            {affiliateUrl ? (
              <a href={affiliateUrl} target="_blank" rel="noopener noreferrer nofollow" className="flex items-center gap-2">
                {ctaText}
                <ExternalLink className="h-5 w-5" />
              </a>
            ) : (
              <div className="flex items-center gap-2">
                {ctaText}
                <ExternalLink className="h-5 w-5" />
              </div>
            )}
          </Button>

          <div className="flex items-center gap-5 text-white/40 text-xs font-bold uppercase tracking-[0.3em]">
            <div className="h-px w-10 bg-white/10" />
            GearTrail Certified
            <div className="h-px w-10 bg-white/10" />
          </div>
        </div>
      </div>
    </div>
  );
};
