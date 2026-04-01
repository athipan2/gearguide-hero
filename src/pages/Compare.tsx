import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { ComparisonTable } from "@/components/ComparisonTable";
import { SEOHead } from "@/components/SEOHead";
import { useComparisonStore } from "@/lib/comparison-store";
import { useTranslation } from "@/hooks/useTranslation";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ArrowLeft, Scale } from "lucide-react";

const ComparePage = () => {
  const { selectedItems } = useComparisonStore();
  const { t } = useTranslation();

  return (
    <div className="min-h-screen bg-background bg-noise">
      <SEOHead
        title={t('compare.seo_title')}
        description={t('compare.seo_description')}
        canonical="https://gearguide-hero.lovable.app/compare"
      />
      <Navbar />
      <main className="py-6 md:py-10">
        <div className="container mx-auto px-4 mb-4 md:mb-8">
          <Link to="/" className="inline-flex items-center text-xs md:text-sm font-medium text-muted-foreground hover:text-primary transition-colors mb-4 md:mb-6">
            <ArrowLeft className="mr-2 h-4 w-4" />
            {t('common.back')}
          </Link>

          <div className="flex flex-col gap-1 md:gap-2">
            <div className="inline-flex items-center gap-2 text-accent font-semibold uppercase tracking-[0.2em] text-[10px] md:text-sm">
              <Scale className="h-3 w-3 md:h-4 md:w-4" />
              Comparison Center
            </div>
            <h1 className="font-heading text-3xl md:text-6xl font-semibold text-primary tracking-tighter uppercase leading-tight">
              {t('compare.title')}
            </h1>
          </div>
        </div>

        <ComparisonTable />
      </main>
      <Footer />
    </div>
  );
};

export default ComparePage;
