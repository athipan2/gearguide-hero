import { RatingStars } from "@/components/RatingStars";
import { Button } from "@/components/ui/button";
import {
  ExternalLink, Award, X, Scale,
  Info, Zap, Shield, Heart, BarChart3,
  Ruler, Weight, Star, LucideIcon, Plus
} from "lucide-react";
import { useComparisonStore } from "@/lib/comparison-store";
import { cn } from "@/lib/utils";
import { Link } from "react-router-dom";

const getSpecIcon = (label: string) => {
  const l = label.toLowerCase();
  if (l.includes('weight') || l.includes('น้ำหนัก')) return <Weight className="h-4 w-4" />;
  if (l.includes('drop')) return <Ruler className="h-4 w-4" />;
  if (l.includes('เหมาะกับ') || l.includes('suitable')) return <Heart className="h-4 w-4" />;
  if (l.includes('พื้น') || l.includes('sole')) return <Shield className="h-4 w-4" />;
  if (l.includes('ระยะ') || l.includes('distance')) return <BarChart3 className="h-4 w-4" />;
  return <Info className="h-4 w-4" />;
};

const getRatingIcon = (label: string) => {
  const l = label.toLowerCase();
  if (l.includes('คืนตัว') || l.includes('energy') || l.includes('bounce')) return <Zap className="h-4 w-4" />;
  if (l.includes('ทนทาน') || l.includes('durability')) return <Shield className="h-4 w-4" />;
  if (l.includes('สบาย') || l.includes('comfort')) return <Heart className="h-4 w-4" />;
  if (l.includes('เบา') || l.includes('lightweight')) return <Weight className="h-4 w-4" />;
  return <Star className="h-4 w-4" />;
};

export function ComparisonTable() {
  const { selectedItems, removeItem, clear } = useComparisonStore();

  const item1 = selectedItems[0];
  const item2 = selectedItems[1];

  // Find unique labels from both items
  const allRatingLabels = Array.from(new Set([
    ...(item1?.aspectRatings?.map(r => r.label) || []),
    ...(item2?.aspectRatings?.map(r => r.label) || [])
  ]));

  const allSpecLabels = Array.from(new Set([
    ...(item1?.specs?.map(s => s.label) || []),
    ...(item2?.specs?.map(s => s.label) || [])
  ]));

  const ComparisonRow = ({
    label,
    value1,
    value2,
    icon,
    isRating = false
  }: {
    label: string;
    value1: string | number | null | undefined;
    value2: string | number | null | undefined;
    icon: React.ReactNode;
    isRating?: boolean;
  }) => {
    const num1 = typeof value1 === 'string' ? parseFloat(value1) : (value1 || 0);
    const num2 = typeof value2 === 'string' ? parseFloat(value2) : (value2 || 0);

    return (
      <div className="group relative">
        <div className="grid grid-cols-2 md:grid-cols-[1fr_200px_1fr] items-center border-b border-primary/5 py-3 md:py-6 hover:bg-primary/[0.02] transition-colors rounded-xl px-2">
          {/* Value 1 */}
          <div className="text-center pr-1 md:pr-8">
            {isRating ? (
              <div className="flex flex-col items-center gap-0.5 md:gap-1">
                <span className="text-base md:text-2xl font-semibold text-primary">{value1 ?? '-'}</span>
                <div className="w-full max-w-[60px] md:max-w-[80px] h-1 bg-muted rounded-full overflow-hidden hidden sm:block">
                  <div
                    className="h-full bg-primary"
                    style={{ width: `${(Math.min(5, Math.max(0, num1)) / 5) * 100}%` }}
                  />
                </div>
              </div>
            ) : (
              <span className="text-[10px] md:text-base font-semibold text-foreground leading-tight">{value1 ?? '-'}</span>
            )}
          </div>

          {/* Label */}
          <div className="col-span-2 md:col-span-1 order-first md:order-none mb-1 md:mb-0">
            <div className="flex flex-col items-center justify-center gap-0.5 md:gap-1">
              <div className="p-1 md:p-1.5 rounded-full bg-primary/5 text-primary">
                {icon}
              </div>
              <span className="text-[9px] md:text-xs font-semibold uppercase tracking-widest text-muted-foreground text-center">
                {label}
              </span>
            </div>
          </div>

          {/* Value 2 */}
          <div className="text-center pl-1 md:pl-8">
            {isRating ? (
              <div className="flex flex-col items-center gap-0.5 md:gap-1">
                <span className="text-base md:text-2xl font-semibold text-accent">{value2 ?? '-'}</span>
                <div className="w-full max-w-[60px] md:max-w-[80px] h-1 bg-muted rounded-full overflow-hidden hidden sm:block">
                  <div
                    className="h-full bg-accent"
                    style={{ width: `${(Math.min(5, Math.max(0, num2)) / 5) * 100}%` }}
                  />
                </div>
              </div>
            ) : (
              <span className="text-[10px] md:text-base font-semibold text-foreground leading-tight">{value2 ?? '-'}</span>
            )}
          </div>
        </div>
      </div>
    );
  };

  if (selectedItems.length === 0) {
    return (
      <div className="container mx-auto px-4 py-12 md:py-24">
        <div className="bg-card/50 border-2 border-dashed border-primary/10 rounded-[2rem] p-8 md:p-24 text-center space-y-6">
          <div className="inline-flex items-center justify-center h-20 w-20 rounded-full bg-primary/5 text-primary/40">
            <Scale className="h-10 w-10" />
          </div>
          <div className="space-y-2">
            <p className="text-2xl font-semibold text-primary/60 uppercase tracking-tight">ยังไม่มีสินค้าที่เลือก</p>
            <p className="text-muted-foreground max-w-xs mx-auto">
              กดปุ่ม "เทียบ" ที่หน้าสินค้าเพื่อเริ่มการเปรียบเทียบ (เลือกได้สูงสุด 2 รุ่น)
            </p>
          </div>
          <Button variant="cta" className="rounded-full" asChild>
            <Link to="/">ไปเลือกสินค้า</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <section className="bg-transparent pb-20">
      <div className="container mx-auto px-4">
        {/* Header Section with VS */}
        <div className="relative grid grid-cols-2 md:grid-cols-[1fr_auto_1fr] items-stretch gap-3 md:gap-8 mb-8 md:mb-12">
          {/* Product 1 */}
          <div className="relative group bg-white rounded-2xl md:rounded-3xl p-3 md:p-8 shadow-xl border border-primary/5 text-center flex flex-col justify-between">
            <button
              onClick={() => removeItem(item1.name)}
              className="absolute -top-2 -right-2 p-1.5 md:p-2 bg-destructive text-white rounded-full shadow-lg hover:scale-110 transition-transform z-30"
            >
              <X className="h-3 w-3 md:h-4 md:w-4" />
            </button>
            <div>
              <div className="relative mb-3 md:mb-4">
                <img
                  src={item1.image}
                  alt={item1.name}
                  className="w-full aspect-[4/3] object-cover rounded-xl md:rounded-2xl shadow-inner group-hover:scale-105 transition-transform duration-500"
                />
              </div>
              <div className="space-y-0.5 md:space-y-1">
                <p className="text-[8px] md:text-[10px] font-semibold uppercase tracking-widest text-accent">{item1.brand}</p>
                <h3 className="font-heading font-semibold text-[10px] md:text-xl uppercase tracking-tighter line-clamp-2 md:line-clamp-1 h-6 md:h-auto">{item1.name}</h3>
              </div>
            </div>
            <p className="text-sm md:text-2xl font-semibold text-primary mt-2">{item1.price}</p>
          </div>

          {/* VS Divider */}
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 md:relative md:left-auto md:top-auto md:translate-x-0 md:translate-y-0 z-20 pointer-events-none">
            <div className="w-10 h-10 md:w-20 md:h-20 rounded-full bg-primary flex items-center justify-center text-white font-semibold text-sm md:text-3xl shadow-[0_0_20px_rgba(31,61,43,0.3)] border-2 md:border-4 border-background">
              VS
            </div>
          </div>

          {/* Product 2 / Add Slot */}
          {item2 ? (
            <div className="relative group bg-white rounded-2xl md:rounded-3xl p-3 md:p-8 shadow-xl border border-primary/5 text-center flex flex-col justify-between">
              <button
                onClick={() => removeItem(item2.name)}
                className="absolute -top-2 -right-2 p-1.5 md:p-2 bg-destructive text-white rounded-full shadow-lg hover:scale-110 transition-transform z-30"
              >
                <X className="h-3 w-3 md:h-4 md:w-4" />
              </button>
              <div>
                <div className="relative mb-3 md:mb-4">
                  <img
                    src={item2.image}
                    alt={item2.name}
                    className="w-full aspect-[4/3] object-cover rounded-xl md:rounded-2xl shadow-inner group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
                <div className="space-y-0.5 md:space-y-1">
                  <p className="text-[8px] md:text-[10px] font-semibold uppercase tracking-widest text-accent">{item2.brand}</p>
                  <h3 className="font-heading font-semibold text-[10px] md:text-xl uppercase tracking-tighter line-clamp-2 md:line-clamp-1 h-6 md:h-auto">{item2.name}</h3>
                </div>
              </div>
              <p className="text-sm md:text-2xl font-semibold text-primary mt-2">{item2.price}</p>
            </div>
          ) : (
            <Link
              to="/"
              className="relative group bg-primary/5 border-2 border-dashed border-primary/20 rounded-2xl md:rounded-3xl p-3 md:p-8 flex flex-col items-center justify-center gap-2 md:gap-4 hover:bg-primary/10 transition-colors h-full min-h-[120px] md:min-h-[200px]"
            >
              <div className="w-8 h-8 md:w-16 md:h-16 rounded-full bg-white flex items-center justify-center text-primary shadow-sm">
                <Plus className="h-4 w-4 md:h-8 md:w-8" />
              </div>
              <div className="text-center">
                <p className="font-semibold uppercase tracking-widest text-primary text-[9px] md:text-sm">เพิ่มอีกรุ่น</p>
                <p className="text-[8px] md:text-xs text-muted-foreground mt-0.5 hidden md:block">เพื่อเปรียบเทียบให้เห็นภาพ</p>
              </div>
            </Link>
          )}
        </div>

        {/* Comparison Data */}
        <div className="bg-white rounded-[1.5rem] md:rounded-[2.5rem] p-3 md:p-12 shadow-2xl border border-primary/5 overflow-hidden">
          {/* Summary Section */}
          <div className="mb-8 md:mb-12">
            <div className="flex items-center gap-2 md:gap-3 mb-6 md:mb-8">
              <div className="h-px flex-1 bg-primary/10" />
              <div className="flex items-center gap-1.5 md:gap-2 text-primary font-semibold uppercase tracking-[0.15em] md:tracking-[0.2em] text-[10px] md:text-xs">
                <Award className="h-3.5 w-3.5 md:h-4 md:w-4" /> คะแนนทดสอบ
              </div>
              <div className="h-px flex-1 bg-primary/10" />
            </div>

            <ComparisonRow
              label="คะแนนรวม"
              value1={item1.rating?.toFixed(1)}
              value2={item2?.rating?.toFixed(1)}
              icon={<Star className="h-4 w-4" />}
              isRating
            />

            {allRatingLabels.map(label => (
              <ComparisonRow
                key={label}
                label={label}
                value1={item1.aspectRatings?.find(r => r.label === label)?.score}
                value2={item2?.aspectRatings?.find(r => r.label === label)?.score}
                icon={getRatingIcon(label)}
                isRating
              />
            ))}
          </div>

          {/* Specs Section */}
          <div className="mb-8 md:mb-12">
            <div className="flex items-center gap-2 md:gap-3 mb-6 md:mb-8">
              <div className="h-px flex-1 bg-primary/10" />
              <div className="flex items-center gap-1.5 md:gap-2 text-primary font-semibold uppercase tracking-[0.15em] md:tracking-[0.2em] text-[10px] md:text-xs">
                <Info className="h-3.5 w-3.5 md:h-4 md:w-4" /> ข้อมูลสเปค
              </div>
              <div className="h-px flex-1 bg-primary/10" />
            </div>

            {allSpecLabels.map(label => (
              <ComparisonRow
                key={label}
                label={label}
                value1={item1.specs?.find(s => s.label === label)?.value}
                value2={item2?.specs?.find(s => s.label === label)?.value}
                icon={getSpecIcon(label)}
              />
            ))}
          </div>

          {/* Actions */}
          <div className="grid grid-cols-2 gap-3 md:gap-8 mt-8 md:mt-12 pt-8 md:pt-12 border-t border-primary/10">
            <div className="space-y-4">
              <Button variant="cta" className="w-full rounded-xl md:rounded-2xl h-10 md:h-16 text-[10px] md:text-lg shadow-xl hover:scale-[1.02] transition-transform" asChild>
                <Link to={item1.slug ? `/review/${item1.slug}` : '#'}>
                  <span className="hidden md:inline">อ่านรีวิว</span> {item1.name.split(' ')[0]} <ExternalLink className="ml-1 md:ml-2 h-3 w-3 md:h-4 md:w-4" />
                </Link>
              </Button>
            </div>
            {item2 && (
              <div className="space-y-4">
                <Button variant="cta" className="w-full rounded-xl md:rounded-2xl h-10 md:h-16 text-[10px] md:text-lg shadow-xl hover:scale-[1.02] transition-transform" asChild>
                  <Link to={item2.slug ? `/review/${item2.slug}` : '#'}>
                    <span className="hidden md:inline">อ่านรีวิว</span> {item2.name.split(' ')[0]} <ExternalLink className="ml-1 md:ml-2 h-3 w-3 md:h-4 md:w-4" />
                  </Link>
                </Button>
              </div>
            )}
          </div>

          <div className="mt-8 text-center">
            <Button variant="ghost" size="sm" onClick={clear} className="text-muted-foreground hover:text-destructive transition-colors rounded-full text-[10px] md:text-xs">
              ล้างข้อมูลทั้งหมด
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
