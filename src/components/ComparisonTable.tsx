import { RatingStars } from "@/components/RatingStars";
import { Button } from "@/components/ui/button";
import { ExternalLink, Award } from "lucide-react";

const items = [
  { rank: 1, name: "Nike Vaporfly 3", brand: "Nike", rating: 4.8, weight: "196g", drop: "8mm", price: "฿8,500", best: true },
  { rank: 2, name: "Adidas Adizero Adios Pro 3", brand: "Adidas", rating: 4.7, weight: "215g", drop: "6.5mm", price: "฿7,900", best: false },
  { rank: 3, name: "Hoka Rocket X 2", brand: "Hoka", rating: 4.5, weight: "220g", drop: "5mm", price: "฿6,500", best: false },
  { rank: 4, name: "New Balance FuelCell RC Elite v2", brand: "New Balance", rating: 4.4, weight: "210g", drop: "4mm", price: "฿7,200", best: false },
];

export function ComparisonTable() {
  return (
    <section className="bg-muted/50 py-16">
      <div className="container mx-auto px-4">
        <div className="flex items-end justify-between mb-8">
          <div>
            <h2 className="font-heading text-2xl md:text-3xl font-bold text-foreground">🏆 Best Racing Shoes 2026</h2>
            <p className="text-muted-foreground mt-1">เปรียบเทียบรองเท้าแข่งวิ่งยอดนิยม</p>
          </div>
        </div>

        {/* Mobile cards */}
        <div className="md:hidden space-y-3">
          {items.map((item) => (
            <div key={item.name} className={`bg-card rounded-xl border p-4 ${item.best ? "ring-2 ring-cta" : ""}`}>
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span className="font-heading font-bold text-lg text-muted-foreground">#{item.rank}</span>
                  {item.best && <Award className="h-5 w-5 text-cta" />}
                </div>
                <span className="font-heading font-bold text-foreground">{item.price}</span>
              </div>
              <h3 className="font-heading font-semibold text-card-foreground">{item.name}</h3>
              <p className="text-xs text-muted-foreground">{item.brand} · {item.weight} · Drop {item.drop}</p>
              <div className="flex items-center justify-between mt-3">
                <RatingStars rating={item.rating} />
                <Button variant="cta" size="sm">
                  ดูราคา <ExternalLink className="ml-1 h-3 w-3" />
                </Button>
              </div>
            </div>
          ))}
        </div>

        {/* Desktop table */}
        <div className="hidden md:block bg-card rounded-xl border overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b bg-muted/50">
                <th className="text-left p-4 text-sm font-medium text-muted-foreground">#</th>
                <th className="text-left p-4 text-sm font-medium text-muted-foreground">ชื่อรุ่น</th>
                <th className="text-left p-4 text-sm font-medium text-muted-foreground">คะแนน</th>
                <th className="text-left p-4 text-sm font-medium text-muted-foreground">น้ำหนัก</th>
                <th className="text-left p-4 text-sm font-medium text-muted-foreground">Drop</th>
                <th className="text-left p-4 text-sm font-medium text-muted-foreground">ราคา</th>
                <th className="p-4"></th>
              </tr>
            </thead>
            <tbody>
              {items.map((item) => (
                <tr key={item.name} className={`border-b last:border-0 hover:bg-muted/30 transition-colors ${item.best ? "bg-cta/5" : ""}`}>
                  <td className="p-4 font-heading font-bold text-muted-foreground flex items-center gap-1">
                    {item.rank}
                    {item.best && <Award className="h-4 w-4 text-cta" />}
                  </td>
                  <td className="p-4">
                    <p className="font-heading font-semibold text-card-foreground">{item.name}</p>
                    <p className="text-xs text-muted-foreground">{item.brand}</p>
                  </td>
                  <td className="p-4"><RatingStars rating={item.rating} /></td>
                  <td className="p-4 text-sm text-foreground">{item.weight}</td>
                  <td className="p-4 text-sm text-foreground">{item.drop}</td>
                  <td className="p-4 font-heading font-bold text-foreground">{item.price}</td>
                  <td className="p-4">
                    <Button variant="cta" size="sm">
                      ดูราคา <ExternalLink className="ml-1 h-3.5 w-3.5" />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}
