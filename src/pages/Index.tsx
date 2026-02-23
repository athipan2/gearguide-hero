import { Navbar } from "@/components/Navbar";
import { HeroSection } from "@/components/HeroSection";
import { CategorySection } from "@/components/CategorySection";
import { FeaturedReviews } from "@/components/FeaturedReviews";
import { LatestGuides } from "@/components/LatestGuides";
import { ComparisonTable } from "@/components/ComparisonTable";
import { NewsletterCTA } from "@/components/NewsletterCTA";
import { Footer } from "@/components/Footer";
import { SEOHead } from "@/components/SEOHead";
import { ShoeWizard } from "@/components/ShoeWizard";
import { useState, useEffect } from "react";

const Index = () => {
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
        title="GearTrail — รีวิวอุปกรณ์วิ่ง เทรล แคมป์ปิ้ง"
        description="รีวิวจริง ทดสอบจริง รองเท้าวิ่ง อุปกรณ์เทรล เดินป่า แคมป์ปิ้ง พร้อมเปรียบเทียบราคาและสเปค อัปเดต 2026"
        canonical="https://gearguide-hero.lovable.app/"
      />
      <Navbar />
      <main>
        <HeroSection onShowWizard={() => setShowWizard(true)} />
        <CategorySection />
        <FeaturedReviews />
        <LatestGuides />
        <ComparisonTable />
        <NewsletterCTA />
        {showWizard && <ShoeWizard onClose={() => setShowWizard(false)} />}
      </main>
      <Footer />
    </div>
  );
};

export default Index;
