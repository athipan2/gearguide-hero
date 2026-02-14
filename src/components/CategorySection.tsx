import { Footprints, Mountain, Tent, Watch } from "lucide-react";

const categories = [
  { icon: Footprints, title: "รองเท้าวิ่งถนน", count: 48, color: "bg-primary/10 text-primary" },
  { icon: Mountain, title: "อุปกรณ์วิ่งเทรล", count: 35, color: "bg-accent/10 text-accent" },
  { icon: Tent, title: "Camping Gear", count: 52, color: "bg-badge-recommended/10 text-badge-recommended" },
  { icon: Watch, title: "นาฬิกา GPS", count: 24, color: "bg-badge-best-value/10 text-badge-best-value" },
];

export function CategorySection() {
  return (
    <section className="container mx-auto px-4 py-16">
      <h2 className="font-heading text-2xl md:text-3xl font-bold text-foreground mb-8">หมวดหมู่ยอดนิยม</h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {categories.map((cat) => (
          <a key={cat.title} href="#" className="group bg-card rounded-xl border p-6 hover:shadow-lg hover:border-primary/30 transition-all duration-200">
            <div className={`w-12 h-12 rounded-lg flex items-center justify-center mb-4 ${cat.color} transition-transform group-hover:scale-110`}>
              <cat.icon className="h-6 w-6" />
            </div>
            <h3 className="font-heading font-semibold text-card-foreground">{cat.title}</h3>
            <p className="text-sm text-muted-foreground mt-1">{cat.count} รีวิว</p>
          </a>
        ))}
      </div>
    </section>
  );
}
