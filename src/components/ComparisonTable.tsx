import { RatingStars } from "@/components/RatingStars";
import { Button } from "@/components/ui/button";
import { ExternalLink, Award, X, Scale } from "lucide-react";
import { useComparisonStore } from "@/lib/comparison-store";

export function ComparisonTable() {
  const { selectedItems, removeItem, clear } = useComparisonStore();

  return (
    <section className="bg-primary/5 py-24 scroll-mt-20" id="compare">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row items-start md:items-end justify-between gap-4 mb-12">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 text-accent font-bold uppercase tracking-[0.2em] text-sm">
              <Scale className="h-4 w-4" />
              Compare Gear
            </div>
            <h2 className="font-heading text-4xl md:text-5xl font-black text-primary tracking-tighter uppercase">
              เปรียบเทียบสเปค
            </h2>
            <p className="text-muted-foreground max-w-lg">
              เลือกสินค้าที่คุณสนใจจากรายการด้านบน (สูงสุด 3 ชิ้น) เพื่อนำมาเปรียบเทียบข้อมูลเชิงลึก
            </p>
          </div>
          {selectedItems.length > 0 && (
            <Button variant="ghost" size="sm" onClick={clear} className="text-muted-foreground hover:text-destructive">
              ล้างทั้งหมด
            </Button>
          )}
        </div>

        {selectedItems.length === 0 ? (
          <div className="bg-card/50 border-2 border-dashed border-primary/10 rounded-3xl p-20 text-center space-y-4">
            <div className="inline-flex items-center justify-center h-16 w-16 rounded-full bg-primary/5 text-primary/40">
              <Scale className="h-8 w-8" />
            </div>
            <div className="space-y-1">
              <p className="text-xl font-bold text-primary/60">ยังไม่มีสินค้าที่เลือก</p>
              <p className="text-muted-foreground">กดปุ่ม "เทียบ" ที่รีวิวด้านบนเพื่อเริ่มการเปรียบเทียบ</p>
            </div>
          </div>
        ) : (
          <>
            {/* Mobile cards */}
            <div className="md:hidden space-y-4">
              {selectedItems.map((item) => (
                <div key={item.name} className="bg-card rounded-2xl border shadow-sm p-5 relative overflow-hidden group">
                  <button
                    onClick={() => removeItem(item.name)}
                    className="absolute top-4 right-4 p-1 hover:bg-destructive/10 hover:text-destructive rounded-full transition-colors"
                  >
                    <X className="h-4 w-4" />
                  </button>

                  <div className="flex gap-4 items-start mb-4">
                    <img src={item.image} alt={item.name} className="w-20 h-20 object-cover rounded-xl" />
                    <div>
                      <p className="text-[10px] font-bold uppercase tracking-widest text-accent">{item.brand}</p>
                      <h3 className="font-heading font-bold text-primary leading-tight line-clamp-2">{item.name}</h3>
                      <div className="flex items-center gap-2 mt-1">
                        <RatingStars rating={item.rating} />
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-2 py-4 border-t border-b border-primary/5 mb-4 text-center">
                    <div>
                      <p className="text-[10px] uppercase text-muted-foreground font-bold">Weight</p>
                      <p className="font-bold text-sm">{item.weight || "-"}</p>
                    </div>
                    <div>
                      <p className="text-[10px] uppercase text-muted-foreground font-bold">Drop</p>
                      <p className="font-bold text-sm">{item.drop || "-"}</p>
                    </div>
                    <div>
                      <p className="text-[10px] uppercase text-muted-foreground font-bold">Price</p>
                      <p className="font-bold text-sm text-accent">{item.price}</p>
                    </div>
                  </div>

                  <Button variant="cta" size="sm" className="w-full">
                    ดูราคา <ExternalLink className="ml-1 h-3.5 w-3.5" />
                  </Button>
                </div>
              ))}
            </div>

            {/* Desktop table */}
            <div className="hidden md:block bg-card rounded-[2rem] border shadow-xl overflow-hidden">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-primary text-primary-foreground">
                    <th className="text-left p-8 text-xs font-black uppercase tracking-widest opacity-60">รุ่นที่เลือก</th>
                    {selectedItems.map((item) => (
                      <th key={item.name} className="p-8 relative min-w-[250px]">
                        <button
                          onClick={() => removeItem(item.name)}
                          className="absolute top-4 right-4 p-1.5 hover:bg-white/10 rounded-full transition-colors"
                        >
                          <X className="h-4 w-4" />
                        </button>
                        <div className="space-y-2 text-center">
                          <img src={item.image} alt={item.name} className="w-32 h-24 mx-auto object-cover rounded-xl shadow-lg border-2 border-white/20" />
                          <div>
                            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-accent">{item.brand}</p>
                            <h3 className="font-heading font-extrabold text-sm leading-tight line-clamp-2 uppercase tracking-tight">{item.name}</h3>
                          </div>
                        </div>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-primary/5">
                  <tr>
                    <td className="p-6 pl-8 text-xs font-bold uppercase tracking-widest text-muted-foreground bg-primary/5">คะแนน</td>
                    {selectedItems.map((item) => (
                      <td key={item.name} className="p-6 text-center">
                        <div className="flex justify-center">
                          <RatingStars rating={item.rating} />
                        </div>
                        <span className="text-sm font-bold mt-1 block">{item.rating}/5.0</span>
                      </td>
                    ))}
                  </tr>
                  <tr>
                    <td className="p-6 pl-8 text-xs font-bold uppercase tracking-widest text-muted-foreground bg-primary/5">น้ำหนัก</td>
                    {selectedItems.map((item) => (
                      <td key={item.name} className="p-6 text-center font-bold text-lg">{item.weight || "N/A"}</td>
                    ))}
                  </tr>
                  <tr>
                    <td className="p-6 pl-8 text-xs font-bold uppercase tracking-widest text-muted-foreground bg-primary/5">Drop</td>
                    {selectedItems.map((item) => (
                      <td key={item.name} className="p-6 text-center font-bold text-lg">{item.drop || "N/A"}</td>
                    ))}
                  </tr>
                  <tr>
                    <td className="p-6 pl-8 text-xs font-bold uppercase tracking-widest text-muted-foreground bg-primary/5">ราคา</td>
                    {selectedItems.map((item) => (
                      <td key={item.name} className="p-6 text-center font-black text-2xl text-accent">{item.price}</td>
                    ))}
                  </tr>
                  <tr>
                    <td className="p-8 pl-8 bg-primary/5"></td>
                    {selectedItems.map((item) => (
                      <td key={item.name} className="p-8 text-center">
                        <Button variant="cta" className="w-full rounded-full h-12">
                          เช็คราคาล่าสุด <ExternalLink className="ml-2 h-4 w-4" />
                        </Button>
                      </td>
                    ))}
                  </tr>
                </tbody>
              </table>
            </div>
          </>
        )}
      </div>
    </section>
  );
}
