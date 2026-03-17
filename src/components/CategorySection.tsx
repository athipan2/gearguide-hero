import { Footprints, Mountain, Tent, Watch } from "lucide-react";
import { Link } from "react-router-dom";

const categories = [
  { icon: Footprints, title: "รองเท้าวิ่งถนน", count: 48, color: "bg-primary/10 text-primary", slug: "รองเท้าวิ่งถนน" },
  { icon: Mountain, title: "อุปกรณ์วิ่งเทรล", count: 35, color: "bg-accent/10 text-accent", slug: "อุปกรณ์วิ่งเทรล" },
  { icon: Tent, title: "Camping Gear", count: 52, color: "bg-badge-recommended/10 text-badge-recommended", slug: "camping-gear" },
  { icon: Watch, title: "นาฬิกา GPS", count: 24, color: "bg-badge-best-value/10 text-badge-best-value", slug: "นาฬิกา-gps" },
];

export function CategorySection() {
  return (
    <section className="relative py-24 overflow-hidden">
      <div className="absolute inset-0 bg-dot-grid opacity-50" />

      <div className="container relative mx-auto px-4">
        <div className="flex items-end justify-between mb-12">
          <div className="space-y-2">
            <div className="w-12 h-1 bg-accent" />
            <h2 className="font-heading text-3xl md:text-5xl font-semibold text-foreground uppercase tracking-tighter">
              EXPLORE <span className="text-primary/40">GEAR</span>
            </h2>
          </div>
          <p className="hidden md:block text-muted-foreground font-medium uppercase tracking-widest text-xs">
            ค้นหาตามประเภทการใช้งาน
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {categories.map((cat) => (
            <Link
              key={cat.title}
              to={`/category/${encodeURIComponent(cat.slug)}`}
              className="group relative bg-card rounded-2xl border-2 border-transparent p-8 hover-card-sporty hover:border-primary/10 overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-24 h-24 bg-primary/5 -mr-8 -mt-8 rounded-full group-hover:scale-150 transition-transform duration-500" />

              <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-6 ${cat.color} transition-all duration-500 group-hover:scale-110 group-hover:rotate-[10deg] shadow-lg`}>
                <cat.icon className="h-8 w-8" />
              </div>

              <h3 className="font-heading font-semibold text-xl text-card-foreground uppercase tracking-tight">{cat.title}</h3>
              <div className="flex items-center gap-2 mt-2">
                <span className="text-sm font-semibold text-muted-foreground/60">{cat.count} ARTICLES</span>
                <div className="flex-1 h-px bg-muted" />
              </div>

              {/* Decorative technical corner */}
              <div className="absolute bottom-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <div className="w-4 h-4 border-r-2 border-b-2 border-accent" />
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
