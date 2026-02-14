import { Navbar } from "@/components/Navbar";
import { HeroSection } from "@/components/HeroSection";
import { CategorySection } from "@/components/CategorySection";
import { FeaturedReviews } from "@/components/FeaturedReviews";
import { ComparisonTable } from "@/components/ComparisonTable";
import { NewsletterCTA } from "@/components/NewsletterCTA";
import { Footer } from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main>
        <HeroSection />
        <CategorySection />
        <FeaturedReviews />
        <ComparisonTable />
        <NewsletterCTA />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
