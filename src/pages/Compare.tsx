import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { ComparisonTable } from "@/components/ComparisonTable";
import { SEOHead } from "@/components/SEOHead";
import { useComparisonStore } from "@/lib/comparison-store";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ArrowLeft, Scale } from "lucide-react";

const ComparePage = () => {
  const { selectedItems } = useComparisonStore();

  return (
    <div className="min-h-screen bg-background bg-noise">
      <SEOHead
        title="เปรียบเทียบสเปคอุปกรณ์ — GearTrail"
        description="เปรียบเทียบสเปคและราคารองเท้าวิ่ง อุปกรณ์เทรล และอุปกรณ์แคมป์ปิ้งแบบเจาะลึก"
        canonical="https://gearguide-hero.lovable.app/compare"
      />
      <Navbar />
      <main className="py-8 md:py-12">
        <div className="container mx-auto px-4 mb-8">
          <Link to="/" className="inline-flex items-center text-sm font-medium text-muted-foreground hover:text-primary transition-colors mb-6">
            <ArrowLeft className="mr-2 h-4 w-4" />
            กลับหน้าหลัก
          </Link>

          <div className="flex flex-col gap-2">
            <div className="inline-flex items-center gap-2 text-accent font-bold uppercase tracking-[0.2em] text-xs md:text-sm">
              <Scale className="h-4 w-4" />
              Comparison Center
            </div>
            <h1 className="font-heading text-4xl md:text-6xl font-black text-primary tracking-tighter uppercase">
              เปรียบเทียบสเปค
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
