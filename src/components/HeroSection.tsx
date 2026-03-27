import heroBanner from "@/assets/hero-banner.jpg";
import { Button } from "@/components/ui/button";
import { ArrowRight, TrendingUp, Sparkles } from "lucide-react";
import { SearchBar } from "./SearchBar";
import { useTranslation } from "@/hooks/useTranslation";

interface HeroSectionProps {
  onShowWizard?: () => void;
}

export function HeroSection({ onShowWizard }: HeroSectionProps) {
  const { t } = useTranslation();
  return (
    <section className="relative min-h-[90vh] flex items-center overflow-hidden bg-primary">
      {/* Background with Grid & Image */}
      <div className="absolute inset-0">
        <img
          src={heroBanner}
          alt="Trail runner at golden hour in mountains"
          className="w-full h-full object-cover object-center scale-105 opacity-60"
        />
        <div className="absolute inset-0 bg-grid opacity-20" />
        <div className="absolute inset-0 bg-gradient-to-t from-primary via-primary/40 to-transparent md:bg-gradient-to-r md:from-primary md:via-primary/20 md:to-transparent" />
      </div>

      {/* Decorative Sharp Lines */}
      <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-accent/20 blur-3xl rounded-full" />
      <div className="absolute top-1/4 -left-12 w-64 h-1 bg-accent/50 rotate-[35deg] blur-sm hidden md:block" />
      <div className="absolute top-1/3 -left-12 w-48 h-1 bg-accent/30 rotate-[35deg] blur-sm hidden md:block" />

      <div className="relative container mx-auto px-4 py-12 md:py-20">
        <div className="max-w-4xl space-y-10">
          <div className="space-y-6">
            <div className="inline-flex items-center gap-2 bg-accent text-accent-foreground px-4 py-1.5 rounded-lg text-[10px] md:text-xs font-semibold uppercase tracking-sporty shadow-2xl mb-2 animate-in fade-in slide-in-from-left-10 duration-500 ease-out">
              <TrendingUp className="h-3.5 w-3.5" />
              {t('hero.trusted')}
            </div>

            <div className="relative">
              <h1 className="font-heading text-5xl md:text-6xl lg:text-8xl font-bold text-primary-foreground leading-tight md:leading-[1.1] tracking-tight-compact animate-in fade-in slide-in-from-bottom-20 duration-700 delay-100 fill-mode-both italic-prohibited">
                {t('hero.title_part1')} <br className="hidden sm:block" />
                {t('hero.title_part2')}<span className="text-transparent bg-clip-text bg-gradient-to-r from-accent via-orange-400 to-yellow-300">{t('hero.title_part3')}</span>{t('hero.title_part4')}
              </h1>
              <div className="absolute -top-4 -left-4 w-12 h-12 border-t-4 border-l-4 border-accent/40 hidden md:block" />
            </div>

            <p className="text-primary-foreground/90 text-lg md:text-xl max-w-2xl font-medium leading-relaxed animate-in fade-in slide-in-from-bottom-10 duration-700 delay-300 fill-mode-both border-l-4 border-accent pl-6 py-2">
              {t('hero.subtitle')}
            </p>
          </div>

          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-10 duration-700 delay-500 fill-mode-both">
            <div className="relative max-w-xl group">
              <div className="absolute -inset-1 bg-gradient-to-r from-accent to-orange-500 rounded-2xl blur opacity-10 group-hover:opacity-25 transition duration-500" />
              <SearchBar className="relative" />
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <Button variant="hero" size="lg" className="rounded-full px-10 w-full sm:w-auto tracking-tight-compact text-lg h-14 font-semibold">
                <span className="flex items-center">
                  {t('hero.latest_reviews')}
                  <ArrowRight className="ml-2 h-5 w-5" />
                </span>
              </Button>
              <Button
                variant="outline"
                size="lg"
                className="rounded-full bg-white/5 text-white border-white/20 hover:bg-white/10 backdrop-blur-md px-10 w-full sm:w-auto tracking-tight-compact text-lg h-14 font-semibold"
                onClick={onShowWizard}
              >
                <span className="flex items-center">
                  <Sparkles className="mr-2 h-5 w-5 text-accent" />
                  {t('hero.gear_wizard')}
                </span>
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll indicator for sporty feel */}
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 hidden md:flex flex-col items-center gap-2 text-primary-foreground/40 animate-bounce">
        <span className="text-[10px] uppercase font-semibold tracking-sporty">{t('hero.scroll')}</span>
        <div className="w-px h-12 bg-gradient-to-b from-accent to-transparent" />
      </div>
    </section>
  );
}
