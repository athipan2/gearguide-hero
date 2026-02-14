import heroBanner from "@/assets/hero-banner.jpg";
import { Button } from "@/components/ui/button";
import { ArrowRight, TrendingUp } from "lucide-react";

export function HeroSection() {
  return (
    <section className="relative overflow-hidden">
      <div className="absolute inset-0">
        <img src={heroBanner} alt="Trail runner at golden hour in mountains" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-r from-foreground/80 via-foreground/50 to-transparent" />
      </div>
      <div className="relative container mx-auto px-4 py-20 md:py-32">
        <div className="max-w-xl space-y-6">
          <div className="inline-flex items-center gap-2 bg-cta/20 text-cta-foreground px-3 py-1 rounded-full text-sm font-medium backdrop-blur-sm">
            <TrendingUp className="h-4 w-4" />
            อัปเดต 2026
          </div>
          <h1 className="font-heading text-4xl md:text-5xl lg:text-6xl font-bold text-primary-foreground leading-tight">
            รีวิวอุปกรณ์<br />
            <span className="text-cta">ที่คุณวางใจได้</span>
          </h1>
          <p className="text-primary-foreground/80 text-lg md:text-xl max-w-md">
            รีวิวจริง ทดสอบจริง สำหรับนักวิ่ง สายเทรล และนักผจญภัย
          </p>
          <div className="flex flex-wrap gap-3">
            <Button variant="hero" size="lg">
              ดูรีวิวล่าสุด
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            <Button variant="outline" size="lg" className="bg-primary-foreground/10 text-primary-foreground border-primary-foreground/30 hover:bg-primary-foreground/20 backdrop-blur-sm">
              เปรียบเทียบอุปกรณ์
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
