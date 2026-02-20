import heroBanner from "@/assets/hero-banner.jpg";
import { Button } from "@/components/ui/button";
import { ArrowRight, TrendingUp } from "lucide-react";
import { SearchBar } from "./SearchBar";

export function HeroSection() {
  return (
    <section className="relative min-h-[85vh] flex items-center overflow-hidden">
      <div className="absolute inset-0">
        <img
          src={heroBanner}
          alt="Trail runner at golden hour in mountains"
          className="w-full h-full object-cover object-center scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-primary via-primary/60 to-transparent md:bg-gradient-to-r md:from-primary/90 md:via-primary/40" />
      </div>

      <div className="relative container mx-auto px-4 py-12 md:py-20">
        <div className="max-w-3xl space-y-10">
          <div className="space-y-6">
            <div className="inline-flex items-center gap-2 bg-accent text-accent-foreground px-4 py-1.5 rounded-full text-[10px] md:text-xs font-bold uppercase tracking-widest shadow-lg mb-2 animate-in fade-in slide-in-from-top-10 duration-700">
              <TrendingUp className="h-3.5 w-3.5" />
              Trusted by 10,000+ Runners
            </div>

            <h1 className="font-heading text-4xl sm:text-5xl md:text-7xl lg:text-8xl font-black text-primary-foreground leading-[0.9] tracking-tighter animate-in fade-in slide-in-from-bottom-10 duration-1000 delay-200 fill-mode-both">
              GEAR FOR THE <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent via-orange-400 to-yellow-300">WILD SIDE</span>
            </h1>

            <p className="text-primary-foreground/90 text-xl md:text-2xl max-w-xl font-medium leading-relaxed animate-in fade-in slide-in-from-bottom-10 duration-1000 delay-400 fill-mode-both">
              รีวิวจริง ทดสอบจริง สำหรับนักวิ่ง สายเทรล และนักผจญภัยที่ต้องการข้อมูลที่แม่นยำที่สุด
            </p>
          </div>

          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-10 duration-1000 delay-600 fill-mode-both">
            <SearchBar className="max-w-xl" />

            <div className="flex flex-wrap gap-4">
              <Button variant="hero" size="lg" className="rounded-full px-10">
                ดูรีวิวล่าสุด
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              <Button
                variant="outline"
                size="lg"
                className="rounded-full bg-white/10 text-white border-white/20 hover:bg-white/20 backdrop-blur-md px-10"
              >
                เปรียบเทียบอุปกรณ์
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
