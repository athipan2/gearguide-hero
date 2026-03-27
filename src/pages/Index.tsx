import { Navbar } from "@/components/Navbar";
import { HeroSection } from "@/components/HeroSection";
import { CategorySection } from "@/components/CategorySection";
import { FeaturedReviews } from "@/components/FeaturedReviews";
import { LatestGuides } from "@/components/LatestGuides";
import { NewsletterCTA } from "@/components/NewsletterCTA";
import { Footer } from "@/components/Footer";
import { SEOHead } from "@/components/SEOHead";
import { ShoeWizard } from "@/components/ShoeWizard";
import { useState, useEffect } from "react";
import { useTranslation } from "@/hooks/useTranslation";

const Index = () => {
  const { t } = useTranslation();
  const [showWizard, setShowWizard] = useState(false);

  useEffect(() => {
    // Show wizard after a short delay on first visit
    const hasVisited = sessionStorage.getItem("geartrail_visited");
    if (!hasVisited) {
      const timer = setTimeout(() => {
        setShowWizard(true);
        sessionStorage.setItem("geartrail_visited", "true");
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, []);

  return (
    <div className="min-h-screen bg-background bg-noise">
      <SEOHead
        title={t('index.seo_title')}
        description={t('index.seo_description')}
        canonical="https://gearguide-hero.lovable.app/"
      />
      <Navbar />
      <main>
        <HeroSection onShowWizard={() => setShowWizard(true)} />
        <CategorySection />
        <FeaturedReviews />
        <LatestGuides />
        <NewsletterCTA />
        {showWizard && <ShoeWizard onClose={() => setShowWizard(false)} />}
      </main>
      <Footer />
    </div>
  );
};

export default Index;
