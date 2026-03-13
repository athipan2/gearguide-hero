import { RatingStars } from "@/components/RatingStars";
import { Button } from "@/components/ui/button";
import { ExternalLink, Award, X, Scale } from "lucide-react";
import { useComparisonStore } from "@/lib/comparison-store";

export function ComparisonTable() {
  const { selectedItems, removeItem, clear } = useComparisonStore();

  const allRatingLabels = Array.from(
    new Set(
      selectedItems.flatMap(item =>
        (item.aspectRatings || []).map(r => r.label)
      )
    )
  );

  return (
    <section className="bg-primary/5 py-8 md:py-24 scroll-mt-20" id="compare">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row items-start md:items-end justify-between gap-4 mb-8 md:mb-12">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 text-accent font-bold uppercase tracking-[0.2em] text-xs md:text-sm">
              <Scale className="h-4 w-4" />
              Compare Gear
            </div>
            <h2 className="font-heading text-3xl md:text-5xl font-black text-primary tracking-tighter uppercase">
              เปรียบเทียบสเปค
            </h2>
            <p className="text-muted-foreground max-w-lg">
              เลือกสินค้าที่คุณสนใจจากรายการ (สูงสุด 3 ชิ้น) เพื่อนำมาเปรียบเทียบข้อมูลเชิงลึก
            </p>
          </div>
          {selectedItems.length > 0 && (
            <Button variant="ghost" size="sm" onClick={clear} className="text-muted-foreground hover:text-destructive">
              ล้างทั้งหมด
            </Button>
          )}
        </div>

        {selectedItems.length === 0 ? (
          <div className="bg-card/50 border-2 border-dashed border-primary/10 rounded-3xl p-12 md:p-20 text-center space-y-4">
            <div className="inline-flex items-center justify-center h-16 w-16 rounded-full bg-primary/5 text-primary/40">
              <Scale className="h-8 w-8" />
            </div>
            <div className="space-y-1">
              <p className="text-xl font-bold text-primary/60">ยังไม่มีสินค้าที่เลือก</p>
              <p className="text-muted-foreground">กดปุ่ม "เทียบ" ที่รีวิวด้านบนเพื่อเริ่มการเปรียบเทียบ</p>
            </div>
          </div>
        ) : (
          <div className="bg-card rounded-[1.5rem] md:rounded-[2rem] border shadow-xl overflow-hidden">
            <div className="overflow-x-auto scrollbar-none">
              <table className="w-full border-collapse min-w-[600px] md:min-w-full">
                <thead>
                  <tr className="bg-primary text-primary-foreground">
                    <th className="sticky left-0 z-20 bg-primary text-left p-4 md:p-8 text-[10px] md:text-xs font-black uppercase tracking-widest opacity-60 min-w-[120px] md:min-w-[200px]">รุ่นที่เลือก</th>
                    {selectedItems.map((item) => (
                      <th key={item.name} className="p-4 md:p-8 relative min-w-[160px] md:min-w-[250px]">
                        <button
                          onClick={() => removeItem(item.name)}
                          className="absolute top-2 right-2 md:top-4 md:right-4 p-1 md:p-1.5 hover:bg-white/10 rounded-full transition-colors"
                        >
                          <X className="h-3.5 w-3.5 md:h-4 md:w-4" />
                        </button>
                        <div className="space-y-2 text-center">
                          <img src={item.image} alt={item.name} className="w-20 h-16 md:w-32 md:h-24 mx-auto object-cover rounded-lg md:rounded-xl shadow-lg border-2 border-white/20" />
                          <div>
                            <p className="text-[8px] md:text-[10px] font-black uppercase tracking-[0.2em] text-accent">{item.brand}</p>
                            <h3 className="font-heading font-extrabold text-[10px] md:text-sm leading-tight line-clamp-2 uppercase tracking-tight">{item.name}</h3>
                          </div>
                        </div>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-primary/5">
                  <tr>
                    <td className="sticky left-0 z-10 p-4 md:p-6 md:pl-8 text-[10px] md:text-xs font-bold uppercase tracking-widest text-muted-foreground bg-primary/5 backdrop-blur-sm">คะแนนรวม</td>
                    {selectedItems.map((item) => (
                      <td key={item.name} className="p-4 md:p-6 text-center">
                        <div className="flex justify-center scale-75 md:scale-100">
                          <RatingStars rating={item.rating} />
                        </div>
                        <span className="text-xs md:text-sm font-bold mt-1 block">{item.rating}/5.0</span>
                      </td>
                    ))}
                  </tr>
                  {allRatingLabels.map((label) => (
                    <tr key={label}>
                      <td className="sticky left-0 z-10 p-4 md:p-6 md:pl-8 text-[10px] md:text-xs font-bold uppercase tracking-widest text-muted-foreground bg-primary/5 backdrop-blur-sm">{label}</td>
                      {selectedItems.map((item) => {
                        const rating = item.aspectRatings?.find(r => r.label === label);
                        return (
                          <td key={item.name} className="p-4 md:p-6 text-center">
                            {rating ? (
                              <div className="space-y-1">
                                <div className="flex justify-center scale-75 md:scale-90">
                                  <RatingStars rating={rating.score} />
                                </div>
                                <span className="text-[10px] md:text-xs font-bold">{rating.score.toFixed(1)}</span>
                              </div>
                            ) : (
                              <span className="text-muted-foreground text-xs italic">N/A</span>
                            )}
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                  <tr>
                    <td className="sticky left-0 z-10 p-4 md:p-6 md:pl-8 text-[10px] md:text-xs font-bold uppercase tracking-widest text-muted-foreground bg-primary/5 backdrop-blur-sm">น้ำหนัก</td>
                    {selectedItems.map((item) => (
                      <td key={item.name} className="p-4 md:p-6 text-center font-bold text-sm md:text-lg">{item.weight || "N/A"}</td>
                    ))}
                  </tr>
                  <tr>
                    <td className="sticky left-0 z-10 p-4 md:p-6 md:pl-8 text-[10px] md:text-xs font-bold uppercase tracking-widest text-muted-foreground bg-primary/5 backdrop-blur-sm">Drop</td>
                    {selectedItems.map((item) => (
                      <td key={item.name} className="p-4 md:p-6 text-center font-bold text-sm md:text-lg">{item.drop || "N/A"}</td>
                    ))}
                  </tr>
                  <tr>
                    <td className="sticky left-0 z-10 p-4 md:p-6 md:pl-8 text-[10px] md:text-xs font-bold uppercase tracking-widest text-muted-foreground bg-primary/5 backdrop-blur-sm">ราคา</td>
                    {selectedItems.map((item) => (
                      <td key={item.name} className="p-4 md:p-6 text-center font-black text-lg md:text-2xl text-accent">{item.price}</td>
                    ))}
                  </tr>
                  <tr>
                    <td className="sticky left-0 z-10 p-4 md:p-8 md:pl-8 bg-primary/5 backdrop-blur-sm"></td>
                    {selectedItems.map((item) => (
                      <td key={item.name} className="p-4 md:p-8 text-center">
                        <Button variant="cta" className="w-full rounded-full h-10 md:h-12 text-[10px] md:text-base px-2 md:px-4">
                          เช็คราคาล่าสุด <ExternalLink className="ml-1 md:ml-2 h-3 w-3 md:h-4 md:w-4" />
                        </Button>
                      </td>
                    ))}
                  </tr>
                </tbody>
              </table>
            </div>
            <div className="md:hidden bg-primary/5 p-3 text-[10px] text-center text-muted-foreground font-medium border-t border-primary/5">
              ← เลื่อนในแนวนอนเพื่อดูสินค้าชิ้นอื่น →
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
