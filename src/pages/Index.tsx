import { Navbar } from "@/components/Navbar";
import { HeroSection } from "@/components/HeroSection";
import { CategorySection } from "@/components/CategorySection";
import { FeaturedReviews } from "@/components/FeaturedReviews";
import { LatestGuides } from "@/components/LatestGuides";
import { ComparisonTable } from "@/components/ComparisonTable";
import { NewsletterCTA } from "@/components/NewsletterCTA";
import { Footer } from "@/components/Footer";
import { SEOHead } from "@/components/SEOHead";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <SEOHead
        title="GearTrail — รีวิวอุปกรณ์วิ่ง เทรล แคมป์ปิ้ง"
        description="รีวิวจริง ทดสอบจริง รองเท้าวิ่ง อุปกรณ์เทรล เดินป่า แคมป์ปิ้ง พร้อมเปรียบเทียบราคาและสเปค อัปเดต 2026"
        canonical="https://gearguide-hero.lovable.app/"
      />
      <Navbar />
      <main>
        <HeroSection />
        <CategorySection />
        <FeaturedReviews />
        <LatestGuides />
        <ComparisonTable />
        <NewsletterCTA />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
