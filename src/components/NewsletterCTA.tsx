import { Button } from "@/components/ui/button";
import { Mail } from "lucide-react";

export function NewsletterCTA() {
  return (
    <section className="container mx-auto px-4 py-16">
      <div className="bg-primary rounded-2xl p-8 md:p-12 text-center">
        <Mail className="h-10 w-10 text-cta mx-auto mb-4" />
        <h2 className="font-heading text-2xl md:text-3xl font-bold text-primary-foreground mb-2">
          ไม่พลาดรีวิวใหม่
        </h2>
        <p className="text-primary-foreground/70 mb-6 max-w-md mx-auto">
          รับรีวิวอุปกรณ์ล่าสุด ดีลราคาพิเศษ และ Best Of ก่อนใคร
        </p>
        <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
          <input
            type="email"
            placeholder="อีเมลของคุณ"
            className="flex-1 rounded-lg px-4 py-3 bg-primary-foreground/10 text-primary-foreground placeholder:text-primary-foreground/50 border border-primary-foreground/20 focus:outline-none focus:ring-2 focus:ring-cta"
          />
          <Button variant="cta" size="lg">สมัครเลย</Button>
        </div>
      </div>
    </section>
  );
}
