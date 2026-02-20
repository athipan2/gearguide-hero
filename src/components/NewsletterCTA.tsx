import { Button } from "@/components/ui/button";
import { Mail } from "lucide-react";

export function NewsletterCTA() {
  return (
    <section className="container mx-auto px-4 py-16">
      <div className="bg-gradient-to-br from-primary via-[#1a3324] to-black rounded-3xl p-8 md:p-16 text-center shadow-2xl relative overflow-hidden group">
        <div className="absolute top-0 right-0 -mt-10 -mr-10 w-60 h-60 bg-cta/20 rounded-full blur-[100px] group-hover:bg-cta/30 transition-colors duration-700" />
        <div className="absolute bottom-0 left-0 -mb-10 -ml-10 w-60 h-60 bg-accent/20 rounded-full blur-[100px] group-hover:bg-accent/30 transition-colors duration-700" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_120%,rgba(231,111,81,0.15),transparent)] pointer-events-none" />

        <div className="relative z-10">
          <div className="bg-primary-foreground/5 w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-6 backdrop-blur-sm border border-white/5">
            <Mail className="h-10 w-10 text-cta" />
          </div>
          <h2 className="font-heading text-3xl md:text-4xl font-black text-primary-foreground mb-4 tracking-tight">
            ไม่พลาดรีวิวใหม่
          </h2>
          <p className="text-primary-foreground/70 mb-10 max-w-lg mx-auto text-lg leading-relaxed">
            รับรีวิวอุปกรณ์ล่าสุด ดีลราคาพิเศษ และ Best Of 2026 ส่งตรงถึงอินบ็อกซ์คุณ
          </p>
          <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto p-1.5 bg-white/5 rounded-2xl backdrop-blur-md border border-white/10">
            <input
              type="email"
              placeholder="อีเมลของคุณ"
              className="flex-1 rounded-xl px-5 py-3 bg-transparent text-primary-foreground placeholder:text-primary-foreground/40 focus:outline-none"
            />
            <Button variant="cta" size="lg" className="rounded-xl shadow-xl">สมัครเลย</Button>
          </div>
        </div>
      </div>
    </section>
  );
}
