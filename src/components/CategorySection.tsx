import { Footprints, Mountain, Tent, Watch } from "lucide-react";
import { Link } from "react-router-dom";
import { useTranslation } from "@/hooks/useTranslation";

export function CategorySection() {
  const { t } = useTranslation();

  const categories = [
    { icon: Footprints, title: t("nav.shoes"), count: 48, color: "bg-primary/10 text-primary", slug: "รองเท้าวิ่งถนน" },
    { icon: Mountain, title: t("nav.gear"), count: 35, color: "bg-accent/10 text-accent", slug: "อุปกรณ์วิ่งเทรล" },
    { icon: Tent, title: t("nav.camping"), count: 52, color: "bg-badge-recommended/10 text-badge-recommended", slug: "camping-gear" },
    { icon: Watch, title: t("wizard.cat_watch"), count: 24, color: "bg-badge-best-value/10 text-badge-best-value", slug: "นาฬิกา-gps" },
  ];

  return (
    <section className="relative py-16 md:py-24 overflow-hidden">
      <div className="absolute inset-0 bg-dot-grid opacity-50" />

      <div className="container relative mx-auto px-4">
        <div className="flex items-end justify-between mb-10 md:mb-14">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="w-8 h-1 bg-accent rounded-full" />
              <span className="text-[10px] md:text-xs font-bold text-accent uppercase tracking-sporty">CATEGORIES</span>
            </div>
            <h2 className="font-heading text-2xl md:text-4xl font-semibold text-foreground uppercase tracking-tight-compact">
              {t("home.explore")} <span className="text-primary/40">{t("home.gear")}</span>
            </h2>
          </div>
          <p className="hidden md:block text-muted-foreground font-bold uppercase tracking-sporty text-[10px]">
            {t("common.search_category")}
          </p>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          {categories.map((cat) => (
            <Link
              key={cat.title}
              to={`/category/${encodeURIComponent(cat.slug)}`}
              className="group relative bg-card rounded-2xl border-2 border-transparent p-5 md:p-8 hover-card-sporty hover:border-primary/10 overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-24 h-24 bg-primary/5 -mr-8 -mt-8 rounded-full group-hover:scale-150 transition-transform duration-500" />

              <div className={`w-12 h-12 md:w-16 md:h-16 rounded-xl md:rounded-2xl flex items-center justify-center mb-4 md:mb-6 ${cat.color} transition-all duration-500 group-hover:scale-110 group-hover:rotate-[10deg] shadow-lg`}>
                <cat.icon className="h-6 w-6 md:h-8 md:w-8" />
              </div>

              <h3 className="font-heading font-semibold text-sm md:text-xl text-card-foreground uppercase tracking-tight-compact leading-tight mb-1">{cat.title}</h3>
              <div className="flex items-center gap-2 mt-1 md:mt-2">
                <span className="text-[8px] md:text-xs font-bold text-muted-foreground/60 tracking-sporty uppercase whitespace-nowrap">
                  {cat.count} {t("common.articles")}
                </span>
                <div className="flex-1 h-px bg-muted hidden sm:block" />
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
