import React, { useState, useEffect } from "react";
import {
  X, ChevronRight, ChevronLeft, Search, Check,
  Target, Footprints, Zap, Sparkles, ShoppingCart,
  ArrowRight, Scale
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useComparisonStore } from "@/lib/comparison-store";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

type Step = "entry" | "express_brand" | "express_details" | "consult_goal" | "consult_feeling" | "consult_foot" | "result";

interface Recommendation {
  id: string;
  name: string;
  brand: string;
  image_url: string;
  rating: number;
  price: string;
  slug: string;
  weight?: string;
  drop?: string;
  pros?: string[];
  cons?: string[];
  ratings?: { label: string; score: number }[];
}

interface Criteria {
  goal?: string;
  feeling?: string;
  footType?: string;
}

interface Spec {
  label: string;
  value: string;
}

export function ShoeWizard({ onClose }: { onClose: () => void }) {
  const [step, setStep] = useState<Step>("entry");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Express Track Data
  const [brandSearch, setBrandSearch] = useState("");
  const [selectedBrand, setSelectedBrand] = useState("");
  const [size, setSize] = useState("");
  const [color, setColor] = useState("");
  const [usage, setUsage] = useState<"train" | "race">("train");

  // Consultation Track Data
  const [goal, setGoal] = useState("");
  const [feeling, setFeeling] = useState("");
  const [footType, setFootType] = useState("");

  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);

  const fetchRecommendations = async (overrideCriteria?: Criteria) => {
    setLoading(true);
    try {
      let query = supabase.from("reviews").select("*");

      const currentGoal = overrideCriteria?.goal || goal;
      const currentFeeling = overrideCriteria?.feeling || feeling;
      const currentFootType = overrideCriteria?.footType || footType;

      if (step === "express_details") {
        query = query.ilike("name", `%${brandSearch}%`);
      } else {
        // Simple recommendation logic based on tags/columns
        if (currentGoal) query = query.contains("suitable_for", [currentGoal]);
        if (currentFeeling) query = query.eq("feeling", currentFeeling);
        if (currentFootType) query = query.eq("foot_type", currentFootType);
      }

      const { data, error } = await query.limit(3);

      if (error) throw error;

      if (data && data.length > 0) {
        const results = data.map(item => ({
          id: item.id,
          name: item.name,
          brand: item.brand,
          image_url: item.image_url,
          rating: item.rating || 4.5,
          price: item.price,
          slug: item.slug,
          weight: item.specs?.find((s: Spec) => s.label === "น้ำหนัก")?.value,
          drop: item.specs?.find((s: Spec) => s.label === "Drop")?.value,
          pros: item.pros,
          cons: item.cons,
          ratings: item.ratings
        }));
        setRecommendations(results);

        // Automatically add to comparison
        results.forEach(rec => {
          useComparisonStore.getState().addItem({
            name: rec.name,
            brand: rec.brand,
            image: rec.image_url,
            rating: rec.rating,
            price: rec.price,
            slug: rec.slug,
            weight: rec.weight,
            drop: rec.drop,
            aspectRatings: rec.ratings
          });
        });
      } else {
        // Fallback mockup data if DB is empty
        const fallback = [
          {
            id: "1",
            name: "Nike Alphafly 3",
            brand: "Nike",
            image_url: "https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=800",
            rating: 4.9,
            price: "฿9,400",
            slug: "nike-alphafly-3",
            weight: "218g",
            drop: "8mm",
            pros: ["เด้งมาก", "เบาพิเศษ"],
            cons: ["ราคาสูง", "ความทนทานจำกัด"]
          },
          {
            id: "2",
            name: "Hoka Speedgoat 5",
            brand: "Hoka",
            image_url: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800",
            rating: 4.8,
            price: "฿5,600",
            slug: "hoka-speedgoat-5",
            weight: "291g",
            drop: "4mm",
            pros: ["ยึดเกาะดีเยี่ยม", "ซัพพอร์ตดี"],
            cons: ["หน้ารัดเล็กน้อย"]
          }
        ].slice(0, 3);
        setRecommendations(fallback);

        fallback.forEach(rec => {
          useComparisonStore.getState().addItem({
            name: rec.name,
            brand: rec.brand,
            image: rec.image_url,
            rating: rec.rating,
            price: rec.price,
            slug: rec.slug,
            weight: rec.weight,
            drop: rec.drop
          });
        });
      }
    } catch (err) {
      console.error(err);
      toast.error("ไม่สามารถดึงข้อมูลได้");
    } finally {
      setLoading(false);
      setStep("result");
    }
  };

  const handleAddToCompare = (rec: Recommendation) => {
    useComparisonStore.getState().addItem({
      name: rec.name,
      brand: rec.brand,
      image: rec.image_url,
      rating: rec.rating,
      price: rec.price,
      slug: rec.slug,
      weight: rec.weight,
      drop: rec.drop,
      aspectRatings: rec.ratings
    });
    toast.success(`เพิ่ม ${rec.name} ในตารางเปรียบเทียบแล้ว`);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300">
      <div className="bg-background w-full max-w-2xl rounded-[2rem] shadow-2xl overflow-hidden border border-primary/10 flex flex-col max-h-[90vh]">

        {/* Header */}
        <div className="relative p-6 bg-primary text-primary-foreground flex flex-col items-center justify-center text-center overflow-hidden">
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10"></div>
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 hover:bg-white/10 rounded-full transition-colors z-10"
          >
            <X className="h-5 w-5" />
          </button>

          <div className="relative z-10 flex flex-col items-center">
            <div className="flex items-center gap-2 mb-2">
              <div className="h-[2px] w-8 bg-accent"></div>
              <span className="text-[10px] font-black uppercase tracking-[0.3em] text-accent">GearTrail Assistant</span>
              <div className="h-[2px] w-8 bg-accent"></div>
            </div>
            <h2 className="font-heading text-2xl md:text-4xl font-black uppercase tracking-tighter">
              Find Your Perfect Pair
            </h2>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 md:p-10">

          {/* STEP 1: ENTRY */}
          {step === "entry" && (
            <div className="space-y-8 animate-in slide-in-from-bottom-4">
              <div className="text-center space-y-2">
                <p className="text-lg text-muted-foreground">สวัสดีครับ มีรองเท้าคู่ใจที่เล็งไว้ในใจหรือยังครับ?</p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <button
                  onClick={() => setStep("express_brand")}
                  className="group relative p-8 rounded-3xl border-2 border-primary/5 hover:border-primary/20 bg-card hover:bg-primary/5 transition-all text-left"
                >
                  <div className="h-12 w-12 rounded-2xl bg-primary/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                    <Zap className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="font-bold text-xl mb-1">มีรุ่นที่สนใจแล้ว</h3>
                  <p className="text-sm text-muted-foreground">ระบุรุ่นเพื่อดูรีวิวและเช็คราคาได้ทันที</p>
                  <ChevronRight className="absolute bottom-8 right-8 h-6 w-6 text-muted-foreground opacity-0 group-hover:opacity-100 transition-all translate-x-2 group-hover:translate-x-0" />
                </button>

                <button
                  onClick={() => setStep("consult_goal")}
                  className="group relative p-8 rounded-3xl border-2 border-primary/5 hover:border-primary/20 bg-card hover:bg-primary/5 transition-all text-left"
                >
                  <div className="h-12 w-12 rounded-2xl bg-accent/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                    <Target className="h-6 w-6 text-accent" />
                  </div>
                  <h3 className="font-bold text-xl mb-1">อยากให้ช่วยแนะนำ</h3>
                  <p className="text-sm text-muted-foreground">ให้เราช่วยหารองเท้าที่เหมาะกับเป้าหมายและสรีระของคุณ</p>
                  <ChevronRight className="absolute bottom-8 right-8 h-6 w-6 text-muted-foreground opacity-0 group-hover:opacity-100 transition-all translate-x-2 group-hover:translate-x-0" />
                </button>
              </div>
            </div>
          )}

          {/* EXPRESS TRACK: BRAND */}
          {step === "express_brand" && (
            <div className="space-y-6 animate-in slide-in-from-right-4">
              <button onClick={() => setStep("entry")} className="flex items-center gap-1 text-sm text-muted-foreground hover:text-primary">
                <ChevronLeft className="h-4 w-4" /> ย้อนกลับ
              </button>
              <div className="space-y-4">
                <h3 className="text-2xl font-bold">ระบุแบรนด์หรือรุ่นที่คุณมองหา</h3>
                <div className="relative">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                  <Input
                    placeholder="เช่น Nike Alphafly, Hoka Speedgoat..."
                    className="pl-12 h-14 text-lg rounded-2xl"
                    value={brandSearch}
                    onChange={(e) => setBrandSearch(e.target.value)}
                  />
                </div>
              </div>
              <Button
                disabled={!brandSearch}
                className="w-full h-14 rounded-2xl text-lg gap-2"
                onClick={() => setStep("express_details")}
              >
                ต่อไป <ChevronRight className="h-5 w-5" />
              </Button>
            </div>
          )}

          {/* EXPRESS TRACK: DETAILS */}
          {step === "express_details" && (
            <div className="space-y-6 animate-in slide-in-from-right-4">
              <button onClick={() => setStep("express_brand")} className="flex items-center gap-1 text-sm text-muted-foreground hover:text-primary">
                <ChevronLeft className="h-4 w-4" /> ย้อนกลับ
              </button>
              <h3 className="text-2xl font-bold">รายละเอียดเพิ่มเติม</h3>

              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-bold text-muted-foreground mb-2 block uppercase">ไซส์ที่ต้องการ</label>
                    <Input
                      placeholder="เช่น 10 US / 44 EU"
                      value={size}
                      onChange={(e) => setSize(e.target.value)}
                      className="h-12 rounded-xl"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-bold text-muted-foreground mb-2 block uppercase">สีที่ชอบ</label>
                    <Input
                      placeholder="เช่น สีส้ม, ขาว"
                      value={color}
                      onChange={(e) => setColor(e.target.value)}
                      className="h-12 rounded-xl"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-sm font-bold text-muted-foreground mb-2 block uppercase">ลักษณะการใช้งาน</label>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      onClick={() => setUsage("train")}
                      className={`p-4 rounded-xl border-2 transition-all font-bold ${usage === "train" ? "border-primary bg-primary/5 text-primary" : "border-muted text-muted-foreground hover:border-primary/20"}`}
                    >
                      ซ้อมทั่วไป
                    </button>
                    <button
                      onClick={() => setUsage("race")}
                      className={`p-4 rounded-xl border-2 transition-all font-bold ${usage === "race" ? "border-primary bg-primary/5 text-primary" : "border-muted text-muted-foreground hover:border-primary/20"}`}
                    >
                      ใส่ลงแข่ง
                    </button>
                  </div>
                </div>
              </div>

              <Button
                className="w-full h-14 rounded-2xl text-lg"
                onClick={() => fetchRecommendations({})}
                loading={loading}
              >
                ดูผลลัพธ์
              </Button>
            </div>
          )}

          {/* CONSULTATION TRACK: GOAL */}
          {step === "consult_goal" && (
            <div className="space-y-6 animate-in slide-in-from-right-4">
              <button onClick={() => setStep("entry")} className="flex items-center gap-1 text-sm text-muted-foreground hover:text-primary">
                <ChevronLeft className="h-4 w-4" /> ย้อนกลับ
              </button>
              <h3 className="text-2xl font-bold text-center">เป้าหมายหลักในการวิ่งคืออะไร?</h3>
              <div className="grid grid-cols-1 gap-3">
                {[
                  { id: "health", label: "วิ่งเพื่อสุขภาพ / ลดน้ำหนัก", icon: <Sparkles className="h-5 w-5" /> },
                  { id: "marathon", label: "วิ่งมาราธอน (Road Race)", icon: <Zap className="h-5 w-5" /> },
                  { id: "road-long", label: "วิ่งระยะไกล (Long Run)", icon: <Footprints className="h-5 w-5" /> },
                  { id: "trail", label: "วิ่งเทล (Trail Running)", icon: <Target className="h-5 w-5" /> },
                  { id: "ultra-trail", label: "วิ่งเทลระยะไกล (Ultra Trail)", icon: <Zap className="h-5 w-5" /> }
                ].map((item) => (
                  <button
                    key={item.id}
                    onClick={() => { setGoal(item.id); setStep("consult_feeling"); }}
                    className="flex items-center gap-4 p-5 rounded-2xl border-2 border-muted hover:border-primary hover:bg-primary/5 transition-all group"
                  >
                    <div className="h-10 w-10 rounded-xl bg-muted group-hover:bg-primary/20 flex items-center justify-center transition-colors">
                      {item.icon}
                    </div>
                    <span className="font-bold text-lg">{item.label}</span>
                    <ChevronRight className="ml-auto h-5 w-5 text-muted-foreground" />
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* CONSULTATION TRACK: FEELING */}
          {step === "consult_feeling" && (
            <div className="space-y-6 animate-in slide-in-from-right-4">
              <button onClick={() => setStep("consult_goal")} className="flex items-center gap-1 text-sm text-muted-foreground hover:text-primary">
                <ChevronLeft className="h-4 w-4" /> ย้อนกลับ
              </button>
              <h3 className="text-2xl font-bold text-center">ชอบฟีลลิ่งรองเท้าแบบไหน?</h3>
              <div className="grid grid-cols-2 gap-4">
                <button
                  onClick={() => { setFeeling("soft"); setStep("consult_foot"); }}
                  className="p-8 rounded-3xl border-2 border-muted hover:border-primary hover:bg-primary/5 transition-all text-center space-y-4"
                >
                  <div className="h-16 w-16 mx-auto rounded-full bg-primary/10 flex items-center justify-center">
                    <span className="text-3xl">☁️</span>
                  </div>
                  <h4 className="font-bold text-xl">นุ่มซัพพอร์ต</h4>
                  <p className="text-xs text-muted-foreground">ปกป้องเท้า ถนอมเข่า</p>
                </button>
                <button
                  onClick={() => { setFeeling("responsive"); setStep("consult_foot"); }}
                  className="p-8 rounded-3xl border-2 border-muted hover:border-primary hover:bg-primary/5 transition-all text-center space-y-4"
                >
                  <div className="h-16 w-16 mx-auto rounded-full bg-accent/10 flex items-center justify-center">
                    <span className="text-3xl">⚡</span>
                  </div>
                  <h4 className="font-bold text-xl">เบาเด้งทำเวลา</h4>
                  <p className="text-xs text-muted-foreground">เน้นความเร็ว ตอบสนองดี</p>
                </button>
              </div>
            </div>
          )}

          {/* CONSULTATION TRACK: FOOT TYPE */}
          {step === "consult_foot" && (
            <div className="space-y-6 animate-in slide-in-from-right-4">
              <button onClick={() => setStep("consult_feeling")} className="flex items-center gap-1 text-sm text-muted-foreground hover:text-primary">
                <ChevronLeft className="h-4 w-4" /> ย้อนกลับ
              </button>
              <h3 className="text-2xl font-bold text-center">สรีระเท้าของคุณเป็นอย่างไร?</h3>
              <div className="grid grid-cols-2 gap-4">
                <button
                  onClick={() => {
                    setFootType("normal");
                    fetchRecommendations({ footType: "normal" });
                  }}
                  className="p-8 rounded-3xl border-2 border-muted hover:border-primary hover:bg-primary/5 transition-all text-center space-y-4"
                >
                  <div className="h-16 w-16 mx-auto border-2 border-dashed border-primary/20 rounded-full flex items-center justify-center overflow-hidden p-2">
                    <img src="https://images.unsplash.com/photo-1560769629-975ec94e6a86?w=100" className="opacity-40 grayscale" alt="Normal Foot" />
                  </div>
                  <h4 className="font-bold text-xl">อุ้งเท้าปกติ</h4>
                </button>
                <button
                  onClick={() => {
                    setFootType("flat");
                    fetchRecommendations({ footType: "flat" });
                  }}
                  className="p-8 rounded-3xl border-2 border-muted hover:border-primary hover:bg-primary/5 transition-all text-center space-y-4"
                >
                  <div className="h-16 w-16 mx-auto border-2 border-dashed border-primary/20 rounded-full flex items-center justify-center overflow-hidden p-2">
                     <img src="https://images.unsplash.com/photo-1560769629-975ec94e6a86?w=100" className="opacity-40 grayscale scale-x-125" alt="Flat Foot" />
                  </div>
                  <h4 className="font-bold text-xl">เท้าแบน</h4>
                </button>
              </div>
            </div>
          )}

          {/* RESULT STEP */}
          {step === "result" && (
            <div className="space-y-8 animate-in zoom-in-95">
              <div className="text-center space-y-2">
                <div className="h-16 w-16 bg-green-500/10 text-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
                   <Check className="h-8 w-8" />
                </div>
                <h3 className="text-3xl font-black">เราคัดมาให้คุณแล้ว!</h3>
                <p className="text-muted-foreground">{recommendations.length} รุ่นที่เหมาะสมที่สุดกับสรีระและเป้าหมายของคุณ</p>
              </div>

              <div className="space-y-4">
                {recommendations.map((rec, index) => (
                  <div key={rec.id} className="relative group bg-card rounded-3xl border border-primary/5 overflow-hidden flex flex-col md:flex-row gap-6 p-6 hover:shadow-xl transition-all">
                    {index === 0 && (
                      <div className="absolute top-0 left-0 bg-accent text-white px-4 py-1 text-[10px] font-bold uppercase rounded-br-xl">
                        Top Pick
                      </div>
                    )}

                    <div className="w-full md:w-40 h-40 rounded-2xl overflow-hidden shrink-0">
                      <img src={rec.image_url} alt={rec.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                    </div>

                    <div className="flex-1 flex flex-col">
                      <div className="mb-2">
                        <p className="text-[10px] font-bold uppercase text-accent tracking-widest">{rec.brand}</p>
                        <h4 className="text-xl font-bold">{rec.name}</h4>
                      </div>

                      <div className="flex flex-wrap gap-2 mb-4">
                        {rec.pros?.slice(0, 2).map(pro => (
                          <span key={pro} className="text-[10px] bg-green-500/10 text-green-600 px-2 py-1 rounded-full font-bold">✓ {pro}</span>
                        ))}
                      </div>

                      <div className="mt-auto flex items-center justify-between gap-4">
                        <span className="text-2xl font-black text-primary">{rec.price}</span>
                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            className="rounded-full h-10 w-10 p-0"
                            onClick={() => handleAddToCompare(rec)}
                            title="เพิ่มลงตารางเปรียบเทียบ"
                          >
                            <Scale className="h-4 w-4" />
                          </Button>
                          <Button
                            className="rounded-full gap-2 px-6 h-10"
                            onClick={() => {
                              navigate(`/review/${rec.slug}`);
                              onClose();
                            }}
                          >
                            ดูรีวิว <ArrowRight className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="p-6 bg-primary/5 rounded-[2rem] border border-dashed border-primary/20 flex flex-col md:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className="h-12 w-12 bg-white rounded-2xl shadow-sm flex items-center justify-center">
                    <Scale className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h5 className="font-bold">ต้องการเทียบจุดต่าง?</h5>
                    <p className="text-xs text-muted-foreground">เรานำรุ่นที่แนะนำใส่ในตารางเปรียบเทียบให้แล้ว</p>
                  </div>
                </div>
                <Button
                  variant="hero"
                  className="rounded-full"
                  onClick={() => {
                    const el = document.getElementById('compare');
                    if (el) el.scrollIntoView({ behavior: 'smooth' });
                    onClose();
                  }}
                >
                  <Sparkles className="h-4 w-4 mr-2" /> Comparison Mode
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
