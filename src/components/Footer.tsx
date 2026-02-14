import { Mountain } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-primary text-primary-foreground">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          <div className="col-span-2 md:col-span-1">
            <a href="/" className="flex items-center gap-2 font-heading font-bold text-xl mb-3">
              <Mountain className="h-6 w-6" />
              GearTrail
            </a>
            <p className="text-primary-foreground/70 text-sm">รีวิวอุปกรณ์ Outdoor จากการทดสอบจริง เพื่อนักวิ่งและนักผจญภัยทุกคน</p>
          </div>
          <div>
            <h4 className="font-heading font-semibold mb-3">หมวดหมู่</h4>
            <ul className="space-y-2 text-sm text-primary-foreground/70">
              <li><a href="#" className="hover:text-primary-foreground transition-colors">รองเท้าวิ่ง</a></li>
              <li><a href="#" className="hover:text-primary-foreground transition-colors">Trail Gear</a></li>
              <li><a href="#" className="hover:text-primary-foreground transition-colors">Camping</a></li>
              <li><a href="#" className="hover:text-primary-foreground transition-colors">นาฬิกา GPS</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-heading font-semibold mb-3">เนื้อหา</h4>
            <ul className="space-y-2 text-sm text-primary-foreground/70">
              <li><a href="#" className="hover:text-primary-foreground transition-colors">รีวิวล่าสุด</a></li>
              <li><a href="#" className="hover:text-primary-foreground transition-colors">เปรียบเทียบ</a></li>
              <li><a href="#" className="hover:text-primary-foreground transition-colors">Best Of 2026</a></li>
              <li><a href="#" className="hover:text-primary-foreground transition-colors">คู่มือมือใหม่</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-heading font-semibold mb-3">เกี่ยวกับเรา</h4>
            <ul className="space-y-2 text-sm text-primary-foreground/70">
              <li><a href="#" className="hover:text-primary-foreground transition-colors">ทีมงาน</a></li>
              <li><a href="#" className="hover:text-primary-foreground transition-colors">วิธีรีวิว</a></li>
              <li><a href="#" className="hover:text-primary-foreground transition-colors">ติดต่อ</a></li>
              <li><a href="#" className="hover:text-primary-foreground transition-colors">Affiliate Disclosure</a></li>
            </ul>
          </div>
        </div>
        <div className="border-t border-primary-foreground/20 mt-8 pt-8 text-center text-sm text-primary-foreground/50">
          © 2026 GearTrail. All rights reserved. · ราคาและข้อมูลอาจมีการเปลี่ยนแปลง
        </div>
      </div>
    </footer>
  );
}
