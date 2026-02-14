import { useParams, Link } from "react-router-dom";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { RatingStars } from "@/components/RatingStars";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  ExternalLink, ArrowLeft, ThumbsUp, ThumbsDown, Award,
  Weight, Ruler, Footprints, Shield, Zap, Wind, ChevronRight
} from "lucide-react";

const reviewData: Record<string, {
  name: string; brand: string; category: string; price: string; image: string;
  badge?: string; overallRating: number;
  ratings: { label: string; score: number }[];
  specs: { label: string; value: string }[];
  pros: string[]; cons: string[];
  verdict: string; intro: string; sections: { title: string; body: string }[];
}> = {
  "nike-vaporfly-3": {
    name: "Nike Vaporfly 3",
    brand: "Nike",
    category: "รองเท้าวิ่งถนน",
    price: "฿8,500",
    image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&h=600&fit=crop",
    badge: "Top Pick",
    overallRating: 4.8,
    ratings: [
      { label: "ความเบา", score: 4.9 },
      { label: "แรงคืนตัว", score: 5.0 },
      { label: "ความทนทาน", score: 3.8 },
      { label: "ความคุ้มค่า", score: 3.5 },
      { label: "ความสบาย", score: 4.7 },
    ],
    specs: [
      { label: "น้ำหนัก", value: "196g (US 9)" },
      { label: "Drop", value: "8mm" },
      { label: "พื้นรองเท้า", value: "ZoomX + Carbon Plate" },
      { label: "พื้นนอก", value: "Rubber Waffle" },
      { label: "เหมาะกับ", value: "Race / Tempo Run" },
      { label: "ระยะทาง", value: "10K – Marathon" },
    ],
    pros: [
      "เบาที่สุดในกลุ่ม Racing Shoes",
      "ZoomX foam ให้แรงคืนตัวชั้นนำ",
      "Carbon plate ช่วย propulsion ดีเยี่ยม",
      "ทรงเท้ากว้างขึ้นจากรุ่นเดิม",
    ],
    cons: [
      "ราคาสูงกว่าคู่แข่ง",
      "ทนทานได้ราว 300-400 กม.",
      "ไม่เหมาะกับวิ่งซ้อมทั่วไป",
    ],
    intro: "Nike Vaporfly 3 ยังคงเป็นมาตรฐานของรองเท้าแข่งวิ่งระดับ Elite ด้วยชุดพื้น ZoomX ที่ให้แรงคืนตัวสูงสุดในตลาด ผสานกับแผ่น Carbon Plate ที่ช่วยส่งแรงไปข้างหน้าอย่างมีประสิทธิภาพ",
    sections: [
      {
        title: "ความรู้สึกขณะวิ่ง",
        body: "ตั้งแต่ก้าวแรกจะรู้สึกถึงความเบาและแรงดีดที่ชัดเจน พื้น ZoomX ให้ความนุ่มแต่ไม่หยุ่นจนเสียความเสถียร ทำให้วิ่งเร็วได้อย่างมั่นใจ เหมาะกับ pace ที่เร็วกว่า 5:00/km ขึ้นไป",
      },
      {
        title: "การเกาะถนน",
        body: "พื้นนอก Rubber Waffle ยึดเกาะได้ดีบนถนนแห้ง แต่ในสภาพเปียกจะลื่นเล็กน้อย ไม่แนะนำให้ใช้บนเส้นทางที่มีน้ำขัง",
      },
      {
        title: "ความทนทาน",
        body: "จากการทดสอบ 350 กม. พบว่า ZoomX เริ่มยุบตัวเล็กน้อยที่ส้นเท้า แต่ยังคงประสิทธิภาพได้ดี สำหรับใช้แข่งอย่างเดียวสามารถใช้ได้หลายเรส",
      },
    ],
    verdict: "Nike Vaporfly 3 ยังคงเป็นตัวเลือกอันดับ 1 สำหรับนักวิ่งที่ต้องการ PR ในการแข่ง แม้ราคาจะสูงแต่ประสิทธิภาพคุ้มค่าทุกบาท เหมาะกับนักวิ่งที่จริงจังเรื่องเวลา",
  },
  "salomon-speedcross-6": {
    name: "Salomon Speedcross 6",
    brand: "Salomon",
    category: "รองเท้าวิ่งเทรล",
    price: "฿5,900",
    image: "https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=800&h=600&fit=crop",
    badge: "แนะนำ",
    overallRating: 4.6,
    ratings: [
      { label: "การเกาะถนน", score: 4.9 },
      { label: "ความทนทาน", score: 4.5 },
      { label: "การกันน้ำ", score: 4.3 },
      { label: "ความคุ้มค่า", score: 4.2 },
      { label: "ความสบาย", score: 4.0 },
    ],
    specs: [
      { label: "น้ำหนัก", value: "310g (US 9)" },
      { label: "Drop", value: "10mm" },
      { label: "พื้นรองเท้า", value: "EnergyCell+" },
      { label: "พื้นนอก", value: "Contagrip MA" },
      { label: "เหมาะกับ", value: "Trail / Mud / Technical" },
      { label: "ระยะทาง", value: "5K – Ultra" },
    ],
    pros: ["เกาะพื้นดินเปียกและโคลนได้ยอดเยี่ยม", "ทนทานมาก", "ระบบเชือกรัดเร็ว Quicklace", "ปกป้องเท้าจากหินได้ดี"],
    cons: ["หนักกว่าคู่แข่ง", "แข็งเกินไปสำหรับบางคน", "ไม่เหมาะวิ่งถนน"],
    intro: "Salomon Speedcross 6 เป็นรองเท้าเทรลในตำนานที่ถูกปรับปรุงให้ดีขึ้นอีก โดยเฉพาะเรื่องการเกาะพื้นที่ลื่นและเปียก",
    sections: [
      { title: "การเกาะพื้น", body: "ดอกยาง Contagrip MA ให้การยึดเกาะที่ดีที่สุดในสภาพโคลนและดินเปียก ดอกยางลึกกัดพื้นได้ดี" },
      { title: "ความสบาย", body: "พื้นค่อนข้างแข็งเมื่อเทียบกับรุ่นอื่น เหมาะกับคนที่ชอบความ firm และ supportive" },
    ],
    verdict: "Speedcross 6 คือ king of mud running ถ้าคุณวิ่งเทรลสายเปียก สายโคลน นี่คือตัวเลือกแรก",
  },
};

const badgeColors: Record<string, string> = {
  "แนะนำ": "bg-badge-recommended text-accent-foreground",
  "คุ้มค่าที่สุด": "bg-badge-best-value text-accent-foreground",
  "Top Pick": "bg-badge-top-pick text-accent-foreground",
};

function RatingBar({ label, score }: { label: string; score: number }) {
  return (
    <div className="flex items-center gap-3">
      <span className="text-sm text-muted-foreground w-24 shrink-0">{label}</span>
      <div className="flex-1 h-2.5 bg-muted rounded-full overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-primary to-accent rounded-full transition-all duration-700"
          style={{ width: `${(score / 5) * 100}%` }}
        />
      </div>
      <span className="text-sm font-semibold text-foreground w-8 text-right">{score.toFixed(1)}</span>
    </div>
  );
}

export default function ReviewDetail() {
  const { slug } = useParams<{ slug: string }>();
  const review = slug ? reviewData[slug] : undefined;

  if (!review) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container mx-auto px-4 py-20 text-center">
          <h1 className="font-heading text-3xl font-bold mb-4">ไม่พบรีวิว</h1>
          <Link to="/">
            <Button variant="cta">กลับหน้าหลัก</Button>
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Breadcrumb */}
      <div className="container mx-auto px-4 py-4">
        <nav className="flex items-center gap-1 text-sm text-muted-foreground">
          <Link to="/" className="hover:text-primary transition-colors">หน้าหลัก</Link>
          <ChevronRight className="h-3.5 w-3.5" />
          <span className="hover:text-primary transition-colors cursor-pointer">{review.category}</span>
          <ChevronRight className="h-3.5 w-3.5" />
          <span className="text-foreground font-medium">{review.name}</span>
        </nav>
      </div>

      <article className="container mx-auto px-4 pb-16">
        {/* Header */}
        <div className="grid md:grid-cols-2 gap-8 mb-12">
          <div className="relative rounded-2xl overflow-hidden bg-muted aspect-[4/3]">
            <img src={review.image} alt={review.name} className="w-full h-full object-cover" />
            {review.badge && (
              <div className={`absolute top-4 left-4 px-4 py-1.5 rounded-full text-sm font-bold flex items-center gap-1.5 ${badgeColors[review.badge] || "bg-primary text-primary-foreground"}`}>
                <Award className="h-4 w-4" />
                {review.badge}
              </div>
            )}
          </div>

          <div className="flex flex-col justify-center space-y-5">
            <div>
              <p className="text-sm font-medium text-muted-foreground uppercase tracking-wider">{review.brand} · {review.category}</p>
              <h1 className="font-heading text-3xl md:text-4xl font-bold text-foreground mt-1">{review.name}</h1>
            </div>

            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 bg-muted rounded-xl px-4 py-2.5">
                <span className="font-heading text-3xl font-bold text-foreground">{review.overallRating}</span>
                <div>
                  <RatingStars rating={review.overallRating} />
                  <p className="text-xs text-muted-foreground mt-0.5">คะแนนรวม</p>
                </div>
              </div>
              <span className="font-heading text-2xl font-bold text-foreground">{review.price}</span>
            </div>

            <p className="text-muted-foreground leading-relaxed">{review.intro}</p>

            {/* Sticky CTA for desktop */}
            <div className="flex gap-3 pt-2">
              <Button variant="hero" size="lg" className="flex-1 md:flex-none">
                ดูราคาล่าสุด
                <ExternalLink className="ml-2 h-5 w-5" />
              </Button>
              <Button variant="outline" size="lg">เปรียบเทียบ</Button>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Pros / Cons */}
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="bg-badge-recommended/5 border border-badge-recommended/20 rounded-xl p-5">
                <h3 className="font-heading font-semibold text-badge-recommended flex items-center gap-2 mb-3">
                  <ThumbsUp className="h-5 w-5" />
                  ข้อดี
                </h3>
                <ul className="space-y-2">
                  {review.pros.map((p) => (
                    <li key={p} className="flex items-start gap-2 text-sm text-foreground">
                      <span className="text-badge-recommended mt-0.5">✓</span>
                      {p}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="bg-destructive/5 border border-destructive/20 rounded-xl p-5">
                <h3 className="font-heading font-semibold text-destructive flex items-center gap-2 mb-3">
                  <ThumbsDown className="h-5 w-5" />
                  ข้อเสีย
                </h3>
                <ul className="space-y-2">
                  {review.cons.map((c) => (
                    <li key={c} className="flex items-start gap-2 text-sm text-foreground">
                      <span className="text-destructive mt-0.5">✗</span>
                      {c}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Review sections */}
            {review.sections.map((s) => (
              <div key={s.title}>
                <h2 className="font-heading text-xl font-bold text-foreground mb-3">{s.title}</h2>
                <p className="text-muted-foreground leading-relaxed">{s.body}</p>
              </div>
            ))}

            {/* Verdict */}
            <div className="bg-primary/5 border border-primary/20 rounded-xl p-6">
              <h2 className="font-heading text-xl font-bold text-foreground flex items-center gap-2 mb-3">
                <Award className="h-5 w-5 text-cta" />
                สรุป
              </h2>
              <p className="text-foreground leading-relaxed">{review.verdict}</p>
              <Button variant="cta" size="lg" className="mt-4">
                ดูราคาล่าสุด
                <ExternalLink className="ml-2 h-5 w-5" />
              </Button>
            </div>
          </div>

          {/* Sidebar */}
          <aside className="space-y-6">
            {/* Ratings breakdown */}
            <div className="bg-card rounded-xl border p-5 space-y-4 sticky top-20">
              <h3 className="font-heading font-semibold text-foreground">คะแนนแต่ละด้าน</h3>
              {review.ratings.map((r) => (
                <RatingBar key={r.label} label={r.label} score={r.score} />
              ))}
            </div>

            {/* Specs */}
            <div className="bg-card rounded-xl border p-5">
              <h3 className="font-heading font-semibold text-foreground mb-4">สเปค</h3>
              <dl className="space-y-3">
                {review.specs.map((s) => (
                  <div key={s.label} className="flex justify-between text-sm">
                    <dt className="text-muted-foreground">{s.label}</dt>
                    <dd className="font-medium text-foreground">{s.value}</dd>
                  </div>
                ))}
              </dl>
            </div>

            {/* Sticky CTA sidebar */}
            <div className="bg-cta/10 rounded-xl border border-cta/30 p-5 text-center sticky top-[26rem]">
              <p className="font-heading font-bold text-foreground text-lg mb-1">{review.price}</p>
              <Button variant="hero" className="w-full">
                ดูราคาล่าสุด
                <ExternalLink className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </aside>
        </div>
      </article>

      {/* Mobile sticky CTA */}
      <div className="lg:hidden fixed bottom-0 inset-x-0 bg-card/95 backdrop-blur-md border-t p-3 z-50">
        <div className="flex items-center gap-3">
          <div>
            <p className="font-heading font-bold text-foreground">{review.price}</p>
            <RatingStars rating={review.overallRating} />
          </div>
          <Button variant="hero" className="flex-1">
            ดูราคาล่าสุด
            <ExternalLink className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </div>

      <Footer />
    </div>
  );
}
