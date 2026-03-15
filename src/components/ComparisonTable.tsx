import { RatingStars } from "@/components/RatingStars";
import { Button } from "@/components/ui/button";
import {
  ExternalLink, Award, X, Scale,
  Info, Zap, Shield, Heart, BarChart3,
  Ruler, Weight, Star, LucideIcon
} from "lucide-react";
import { useComparisonStore } from "@/lib/comparison-store";
import { cn } from "@/lib/utils";

const getSpecIcon = (label: string) => {
  const l = label.toLowerCase();
  if (l.includes('weight') || l.includes('น้ำหนัก')) return <Weight className="h-3.5 w-3.5 md:h-4 md:w-4" />;
  if (l.includes('drop')) return <Ruler className="h-3.5 w-3.5 md:h-4 md:w-4" />;
  if (l.includes('เหมาะกับ') || l.includes('suitable')) return <Heart className="h-3.5 w-3.5 md:h-4 md:w-4" />;
  if (l.includes('พื้น') || l.includes('sole')) return <Shield className="h-3.5 w-3.5 md:h-4 md:w-4" />;
  if (l.includes('ระยะ') || l.includes('distance')) return <BarChart3 className="h-3.5 w-3.5 md:h-4 md:w-4" />;
  return <Info className="h-3.5 w-3.5 md:h-4 md:w-4" />;
};

const getRatingIcon = (label: string) => {
  const l = label.toLowerCase();
  if (l.includes('คืนตัว') || l.includes('energy') || l.includes('bounce')) return <Zap className="h-3.5 w-3.5 md:h-4 md:w-4" />;
  if (l.includes('ทนทาน') || l.includes('durability')) return <Shield className="h-3.5 w-3.5 md:h-4 md:w-4" />;
  if (l.includes('สบาย') || l.includes('comfort')) return <Heart className="h-3.5 w-3.5 md:h-4 md:w-4" />;
  if (l.includes('เบา') || l.includes('lightweight')) return <Weight className="h-3.5 w-3.5 md:h-4 md:w-4" />;
  return <Star className="h-3.5 w-3.5 md:h-4 md:w-4" />;
};

export function ComparisonTable() {
  const { selectedItems, removeItem, clear } = useComparisonStore();

  // Find common rating labels
  const commonRatingLabels = selectedItems.length > 0
    ? selectedItems.reduce((acc, item) => {
        const itemLabels = (item.aspectRatings || []).map(r => r.label);
        if (acc === null) return itemLabels;
        return acc.filter(label => itemLabels.includes(label));
      }, null as string[] | null) || []
    : [];

  // Find common spec labels
  const commonSpecLabels = selectedItems.length > 0
    ? selectedItems.reduce((acc, item) => {
        const itemLabels = (item.specs || []).map(s => s.label);
        if (acc === null) return itemLabels;
        return acc.filter(label => itemLabels.includes(label));
      }, null as string[] | null) || []
    : [];

  const SectionHeader = ({ title, icon: Icon }: { title: string; icon: LucideIcon }) => (
    <tr className="bg-primary/10">
      <td colSpan={selectedItems.length + 1} className="py-3 px-4 md:px-8">
        <div className="flex items-center gap-2 text-primary font-bold uppercase tracking-widest text-[10px] md:text-xs">
          <Icon className="h-4 w-4" />
          {title}
        </div>
      </td>
    </tr>
  );

  const LabelCell = ({ children, className }: { children: React.ReactNode; className?: string }) => (
    <td className={cn(
      "sticky left-0 z-10 p-4 md:p-6 md:pl-8 text-[10px] md:text-xs font-bold uppercase tracking-widest text-muted-foreground bg-white/80 backdrop-blur-md border-r border-primary/5",
      className
    )}>
      {children}
    </td>
  );

  return (
    <section className="bg-transparent py-8 md:py-20 scroll-mt-20" id="compare">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row items-start md:items-end justify-between gap-4 mb-8 md:mb-12">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 text-accent font-bold uppercase tracking-[0.2em] text-xs md:text-sm">
              <Scale className="h-4 w-4" />
              Compare Gear
            </div>
            <h2 className="font-heading text-3xl md:text-5xl font-black text-primary tracking-tighter uppercase">
              เปรียบเทียบเชิงลึก
            </h2>
            <p className="text-muted-foreground max-w-lg">
              วิเคราะห์ข้อมูลสเปคและคะแนนทดสอบจริง เพื่อช่วยให้คุณตัดสินใจเลือกอุปกรณ์ที่ใช่ที่สุด
            </p>
          </div>
          {selectedItems.length > 0 && (
            <Button variant="ghost" size="sm" onClick={clear} className="text-muted-foreground hover:text-destructive transition-colors rounded-full px-4">
              ล้างทั้งหมด
            </Button>
          )}
        </div>

        {selectedItems.length === 0 ? (
          <div className="bg-card/50 border-2 border-dashed border-primary/10 rounded-[2rem] p-12 md:p-24 text-center space-y-6">
            <div className="inline-flex items-center justify-center h-20 w-20 rounded-full bg-primary/5 text-primary/40">
              <Scale className="h-10 w-10" />
            </div>
            <div className="space-y-2">
              <p className="text-2xl font-black text-primary/60 uppercase tracking-tight">ยังไม่มีสินค้าที่เลือก</p>
              <p className="text-muted-foreground max-w-xs mx-auto">
                กดปุ่ม "เทียบ" ที่หน้าสินค้าเพื่อนำมาเปรียบเทียบข้อมูลที่นี่
              </p>
            </div>
            <Button variant="cta" className="rounded-full" asChild>
              <a href="/">ไปเลือกสินค้า</a>
            </Button>
          </div>
        ) : (
          <div className="bg-card rounded-[2rem] border shadow-2xl overflow-hidden border-primary/5">
            <div className="overflow-x-auto scrollbar-none">
              <table className="w-full border-collapse min-w-[600px] md:min-w-full">
                <thead>
                  <tr className="bg-primary text-primary-foreground">
                    <th className="sticky left-0 z-20 bg-primary text-left p-6 md:p-10 text-[10px] md:text-xs font-black uppercase tracking-widest opacity-60 min-w-[140px] md:min-w-[240px]">
                      รุ่นที่เปรียบเทียบ
                    </th>
                    {selectedItems.map((item) => (
                      <th key={item.name} className="p-6 md:p-10 relative min-w-[200px] md:min-w-[300px] group">
                        <button
                          onClick={() => removeItem(item.name)}
                          className="absolute top-4 right-4 p-2 bg-white/10 hover:bg-white/20 rounded-full transition-all duration-300 opacity-0 group-hover:opacity-100 scale-75 group-hover:scale-100"
                        >
                          <X className="h-4 w-4" />
                        </button>
                        <div className="space-y-4 text-center">
                          <div className="relative inline-block">
                            <img
                              src={item.image}
                              alt={item.name}
                              className="w-24 h-20 md:w-48 md:h-36 mx-auto object-cover rounded-2xl shadow-2xl border-4 border-white/10 group-hover:scale-105 transition-transform duration-500"
                            />
                            <div className="absolute inset-0 rounded-2xl ring-1 ring-inset ring-black/10" />
                          </div>
                          <div>
                            <p className="text-[9px] md:text-[11px] font-black uppercase tracking-[0.2em] text-accent mb-1">{item.brand}</p>
                            <h3 className="font-heading font-black text-xs md:text-lg leading-tight line-clamp-2 uppercase tracking-tight px-2">{item.name}</h3>
                          </div>
                        </div>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-primary/5">
                  {/* Performance Section */}
                  <SectionHeader title="Performance / คะแนนทดสอบ" icon={Award} />
                  <tr>
                    <LabelCell>คะแนนรวม (Overall)</LabelCell>
                    {selectedItems.map((item) => (
                      <td key={item.name} className="p-6 md:p-8 text-center">
                        <div className="flex flex-col items-center gap-2">
                          <div className="text-2xl md:text-4xl font-black text-primary">{item.rating.toFixed(1)}</div>
                          <div className="scale-90 md:scale-110">
                            <RatingStars rating={item.rating} />
                          </div>
                          <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">จาก 5.0 คะแนน</span>
                        </div>
                      </td>
                    ))}
                  </tr>
                  {commonRatingLabels.map((label) => (
                    <tr key={label} className="hover:bg-primary/[0.02] transition-colors">
                      <LabelCell>
                        <div className="flex items-center gap-2">
                          <div className="p-1.5 rounded-lg bg-primary/5 text-primary">
                            {getRatingIcon(label)}
                          </div>
                          {label}
                        </div>
                      </LabelCell>
                      {selectedItems.map((item) => {
                        const rating = item.aspectRatings?.find(r => r.label === label);
                        return (
                          <td key={item.name} className="p-6 md:p-8 text-center">
                            {rating ? (
                              <div className="space-y-3">
                                <div className="text-base md:text-xl font-bold text-foreground">{rating.score.toFixed(1)}</div>
                                <div className="w-full max-w-[120px] mx-auto h-1.5 bg-muted rounded-full overflow-hidden">
                                  <div
                                    className="h-full bg-gradient-to-r from-primary to-accent rounded-full"
                                    style={{ width: `${(rating.score / 5) * 100}%` }}
                                  />
                                </div>
                              </div>
                            ) : (
                              <span className="text-muted-foreground text-xs italic">N/A</span>
                            )}
                          </td>
                        );
                      })}
                    </tr>
                  ))}

                  {/* Specs Section */}
                  <SectionHeader title="Specifications / สเปคสินค้า" icon={Info} />
                  {commonSpecLabels.map((label) => (
                    <tr key={label} className="hover:bg-primary/[0.02] transition-colors">
                      <LabelCell>
                        <div className="flex items-center gap-2">
                          <div className="p-1.5 rounded-lg bg-primary/5 text-primary">
                            {getSpecIcon(label)}
                          </div>
                          {label}
                        </div>
                      </LabelCell>
                      {selectedItems.map((item) => {
                        const spec = item.specs?.find(s => s.label === label);
                        return (
                          <td key={item.name} className="p-6 md:p-8 text-center">
                            <span className="font-bold text-sm md:text-base text-primary/80">
                              {spec?.value || "N/A"}
                            </span>
                          </td>
                        );
                      })}
                    </tr>
                  ))}

                  {/* Pricing Section */}
                  <SectionHeader title="Pricing / การสั่งซื้อ" icon={Zap} />
                  <tr>
                    <LabelCell>ราคาประมาณการ</LabelCell>
                    {selectedItems.map((item) => (
                      <td key={item.name} className="p-6 md:p-10 text-center">
                        <div className="space-y-4">
                          <span className="font-heading font-black text-xl md:text-3xl text-accent block">{item.price}</span>
                          <Button variant="cta" className="w-full rounded-full h-10 md:h-14 text-[10px] md:text-base px-4 shadow-xl hover:scale-105 transition-transform duration-300">
                            เช็คราคาล่าสุด <ExternalLink className="ml-2 h-4 w-4" />
                          </Button>
                        </div>
                      </td>
                    ))}
                  </tr>
                </tbody>
              </table>
            </div>
            <div className="md:hidden bg-primary text-primary-foreground p-3 text-[10px] text-center font-black uppercase tracking-[0.2em]">
              ← เลื่อนซ้าย-ขวาเพื่อดูข้อมูลรุ่นอื่น →
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
