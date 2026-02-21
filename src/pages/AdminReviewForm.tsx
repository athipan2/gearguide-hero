import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { Save, ArrowLeft, Plus, X } from "lucide-react";

interface RatingItem { label: string; score: number }
interface SpecItem { label: string; value: string }
interface SectionItem { title: string; body: string }

const defaultForm = {
  name: "", brand: "", category: "", price: "", slug: "",
  image_url: "", badge: "", overall_rating: 0,
  affiliate_url: "", cta_text: "ดูราคาล่าสุด",
  intro: "", verdict: "", published: false,
};


export default function AdminReviewForm() {
  const { id } = useParams();
  const isEdit = !!id && id !== "new";
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useAuth();

  const [form, setForm] = useState(defaultForm);
  const [ratings, setRatings] = useState<RatingItem[]>([{ label: "", score: 0 }]);
  const [specs, setSpecs] = useState<SpecItem[]>([{ label: "", value: "" }]);
  const [pros, setPros] = useState<string[]>([""]);
  const [cons, setCons] = useState<string[]>([""]);
  const [sections, setSections] = useState<SectionItem[]>([{ title: "", body: "" }]);
  const [images, setImages] = useState<string[]>([]);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (isEdit) {
      supabase.from("reviews").select("*").eq("id", id).maybeSingle().then(({ data }) => {
        if (data) {
          setForm({
            name: data.name, brand: data.brand, category: data.category,
            price: data.price, slug: data.slug, image_url: data.image_url || "",
            badge: data.badge || "", overall_rating: Number(data.overall_rating),
            affiliate_url: data.affiliate_url || "", cta_text: data.cta_text || "ดูราคาล่าสุด",
            intro: data.intro || "", verdict: data.verdict || "", published: data.published,
          });
          setRatings((data.ratings as unknown as RatingItem[]) || []);
          setSpecs((data.specs as unknown as SpecItem[]) || []);
          setPros((data.pros as unknown as string[]) || [""]);
          setCons((data.cons as unknown as string[]) || [""]);
          setSections((data.sections as unknown as SectionItem[]) || []);
          setImages((data.images as unknown as string[]) || []);
        }
      });
    }
  }, [id, isEdit]);

  const handleSave = async () => {
    if (!form.name || !form.slug || !form.brand || !form.category || !form.price) {
      toast({ title: "กรุณากรอกข้อมูลที่จำเป็น", variant: "destructive" });
      return;
    }
    setSaving(true);
    const payload = {
      ...form,
      overall_rating: form.overall_rating,
      ratings: JSON.parse(JSON.stringify(ratings.filter((r) => r.label))),
      specs: JSON.parse(JSON.stringify(specs.filter((s) => s.label))),
      pros: JSON.parse(JSON.stringify(pros.filter(Boolean))),
      cons: JSON.parse(JSON.stringify(cons.filter(Boolean))),
      sections: JSON.parse(JSON.stringify(sections.filter((s) => s.title))),
      images: JSON.parse(JSON.stringify(images.filter(Boolean))),
      ...(isEdit ? {} : { created_by: user?.id }),
    };

    const { error } = isEdit
      ? await supabase.from("reviews").update(payload).eq("id", id)
      : await supabase.from("reviews").insert([payload]);

    setSaving(false);
    if (error) {
      console.error("Supabase save error:", error);
      toast({
        title: "บันทึกไม่สำเร็จ",
        description: error.message || "เกิดข้อผิดพลาดในการเชื่อมต่อฐานข้อมูล",
        variant: "destructive"
      });
    } else {
      toast({ title: isEdit ? "อัปเดตแล้ว" : "สร้างรีวิวแล้ว" });
      navigate("/admin/reviews");
    }
  };

  const updateField = (key: string, value: string | number | boolean) =>
    setForm((f) => ({ ...f, [key]: value }));

  return (
    <AdminLayout>
      <div className="flex items-center gap-3 mb-6">
        <Button variant="ghost" size="icon" onClick={() => navigate("/admin/reviews")}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <h1 className="font-heading text-2xl font-bold text-foreground">
          {isEdit ? "แก้ไขรีวิว" : "เพิ่มรีวิวใหม่"}
        </h1>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Main form */}
        <div className="lg:col-span-2 space-y-6">
          {/* Basic info */}
          <div className="bg-card border rounded-xl p-5 space-y-4">
            <h2 className="font-heading font-semibold text-foreground">ข้อมูลพื้นฐาน</h2>
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>ชื่อสินค้า *</Label>
                <Input value={form.name} onChange={(e) => updateField("name", e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label>Slug *</Label>
                <Input value={form.slug} onChange={(e) => updateField("slug", e.target.value)} placeholder="nike-vaporfly-3" />
              </div>
              <div className="space-y-2">
                <Label>แบรนด์ *</Label>
                <Input value={form.brand} onChange={(e) => updateField("brand", e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label>หมวดหมู่ *</Label>
                <Input value={form.category} onChange={(e) => updateField("category", e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label>ราคา *</Label>
                <Input value={form.price} onChange={(e) => updateField("price", e.target.value)} placeholder="฿8,500" />
              </div>
              <div className="space-y-2">
                <Label>คะแนนรวม</Label>
                <Input type="number" step="0.1" min="0" max="5" value={form.overall_rating} onChange={(e) => updateField("overall_rating", parseFloat(e.target.value) || 0)} />
              </div>
              <div className="space-y-2">
                <Label>Badge</Label>
                <Input value={form.badge} onChange={(e) => updateField("badge", e.target.value)} placeholder="Top Pick / แนะนำ / คุ้มค่าที่สุด" />
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label>URL รูปภาพหลัก</Label>
                  {form.image_url && (
                    <button
                      type="button"
                      onClick={() => updateField("image_url", "")}
                      className="text-xs text-destructive hover:underline"
                    >
                      ลบรูป
                    </button>
                  )}
                </div>
                <div className="flex gap-2">
                  <Input
                    value={form.image_url}
                    onChange={(e) => updateField("image_url", e.target.value)}
                    placeholder="https://..."
                    className="flex-1"
                  />
                  {form.image_url && (
                    <img
                      src={form.image_url}
                      alt="preview"
                      className="h-10 w-10 rounded object-cover border shrink-0"
                      onError={(e) => (e.currentTarget.style.display = 'none')}
                    />
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Additional Images */}
          <div className="bg-card border rounded-xl p-5 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="font-heading font-semibold text-foreground">รูปภาพเพิ่มเติม</h2>
              <Button variant="ghost" size="sm" onClick={() => setImages([...images, ""])}>
                <Plus className="h-4 w-4 mr-1" /> เพิ่มรูป
              </Button>
            </div>
            {images.length === 0 && (
              <p className="text-sm text-muted-foreground">ยังไม่มีรูปภาพเพิ่มเติม กดปุ่ม "เพิ่มรูป" เพื่อเพิ่ม URL รูปภาพ</p>
            )}
            {images.map((img, i) => (
              <div key={i} className="flex gap-2 items-center">
                <Input
                  placeholder="https://..."
                  value={img}
                  onChange={(e) => { const n = [...images]; n[i] = e.target.value; setImages(n); }}
                  className="flex-1"
                />
                {img && (
                  <img src={img} alt={`preview ${i}`} className="h-10 w-10 rounded object-cover border shrink-0" />
                )}
                <Button variant="ghost" size="icon" onClick={() => setImages(images.filter((_, j) => j !== i))}>
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>

          {/* Intro & Verdict */}
          <div className="bg-card border rounded-xl p-5 space-y-4">
            <h2 className="font-heading font-semibold text-foreground">เนื้อหา</h2>
            <div className="space-y-2">
              <Label>บทนำ</Label>
              <Textarea value={form.intro} onChange={(e) => updateField("intro", e.target.value)} rows={3} />
            </div>
            <div className="space-y-2">
              <Label>สรุป (Verdict)</Label>
              <Textarea value={form.verdict} onChange={(e) => updateField("verdict", e.target.value)} rows={3} />
            </div>
          </div>

          {/* Ratings */}
          <div className="bg-card border rounded-xl p-5 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="font-heading font-semibold text-foreground">คะแนนแต่ละด้าน</h2>
              <Button variant="ghost" size="sm" onClick={() => setRatings([...ratings, { label: "", score: 0 }])}>
                <Plus className="h-4 w-4 mr-1" /> เพิ่ม
              </Button>
            </div>
            {ratings.map((r, i) => (
              <div key={i} className="flex gap-2 items-center">
                <Input placeholder="ด้าน" value={r.label} onChange={(e) => { const n = [...ratings]; n[i].label = e.target.value; setRatings(n); }} className="flex-1" />
                <Input type="number" step="0.1" min="0" max="5" value={r.score} onChange={(e) => { const n = [...ratings]; n[i].score = parseFloat(e.target.value) || 0; setRatings(n); }} className="w-20" />
                <Button variant="ghost" size="icon" onClick={() => setRatings(ratings.filter((_, j) => j !== i))}><X className="h-4 w-4" /></Button>
              </div>
            ))}
          </div>

          {/* Specs */}
          <div className="bg-card border rounded-xl p-5 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="font-heading font-semibold text-foreground">สเปค</h2>
              <Button variant="ghost" size="sm" onClick={() => setSpecs([...specs, { label: "", value: "" }])}>
                <Plus className="h-4 w-4 mr-1" /> เพิ่ม
              </Button>
            </div>
            {specs.map((s, i) => (
              <div key={i} className="flex gap-2 items-center">
                <Input placeholder="หัวข้อ" value={s.label} onChange={(e) => { const n = [...specs]; n[i].label = e.target.value; setSpecs(n); }} className="flex-1" />
                <Input placeholder="ค่า" value={s.value} onChange={(e) => { const n = [...specs]; n[i].value = e.target.value; setSpecs(n); }} className="flex-1" />
                <Button variant="ghost" size="icon" onClick={() => setSpecs(specs.filter((_, j) => j !== i))}><X className="h-4 w-4" /></Button>
              </div>
            ))}
          </div>

          {/* Pros / Cons */}
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="bg-card border rounded-xl p-5 space-y-3">
              <div className="flex items-center justify-between">
                <h2 className="font-heading font-semibold text-badge-recommended">ข้อดี</h2>
                <Button variant="ghost" size="sm" onClick={() => setPros([...pros, ""])}><Plus className="h-4 w-4" /></Button>
              </div>
              {pros.map((p, i) => (
                <div key={i} className="flex gap-2">
                  <Input value={p} onChange={(e) => { const n = [...pros]; n[i] = e.target.value; setPros(n); }} className="flex-1" />
                  <Button variant="ghost" size="icon" onClick={() => setPros(pros.filter((_, j) => j !== i))}><X className="h-4 w-4" /></Button>
                </div>
              ))}
            </div>
            <div className="bg-card border rounded-xl p-5 space-y-3">
              <div className="flex items-center justify-between">
                <h2 className="font-heading font-semibold text-destructive">ข้อเสีย</h2>
                <Button variant="ghost" size="sm" onClick={() => setCons([...cons, ""])}><Plus className="h-4 w-4" /></Button>
              </div>
              {cons.map((c, i) => (
                <div key={i} className="flex gap-2">
                  <Input value={c} onChange={(e) => { const n = [...cons]; n[i] = e.target.value; setCons(n); }} className="flex-1" />
                  <Button variant="ghost" size="icon" onClick={() => setCons(cons.filter((_, j) => j !== i))}><X className="h-4 w-4" /></Button>
                </div>
              ))}
            </div>
          </div>

          {/* Sections */}
          <div className="bg-card border rounded-xl p-5 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="font-heading font-semibold text-foreground">เนื้อหารีวิว (Sections)</h2>
              <Button variant="ghost" size="sm" onClick={() => setSections([...sections, { title: "", body: "" }])}>
                <Plus className="h-4 w-4 mr-1" /> เพิ่ม
              </Button>
            </div>
            {sections.map((s, i) => (
              <div key={i} className="space-y-2 border-b pb-4 last:border-0">
                <div className="flex gap-2">
                  <Input placeholder="หัวข้อ" value={s.title} onChange={(e) => { const n = [...sections]; n[i].title = e.target.value; setSections(n); }} className="flex-1" />
                  <Button variant="ghost" size="icon" onClick={() => setSections(sections.filter((_, j) => j !== i))}><X className="h-4 w-4" /></Button>
                </div>
                <Textarea placeholder="เนื้อหา" value={s.body} onChange={(e) => { const n = [...sections]; n[i].body = e.target.value; setSections(n); }} rows={3} />
              </div>
            ))}
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-4">
          <div className="bg-card border rounded-xl p-5 space-y-4 lg:sticky lg:top-6">
            <h2 className="font-heading font-semibold text-foreground">การเผยแพร่</h2>
            <div className="flex items-center justify-between">
              <Label>เผยแพร่ทันที</Label>
              <Switch checked={form.published} onCheckedChange={(v) => updateField("published", v)} />
            </div>

            <div className="space-y-2">
              <Label>Affiliate URL</Label>
              <Input value={form.affiliate_url} onChange={(e) => updateField("affiliate_url", e.target.value)} placeholder="https://..." />
            </div>
            <div className="space-y-2">
              <Label>ข้อความปุ่ม CTA</Label>
              <Input value={form.cta_text} onChange={(e) => updateField("cta_text", e.target.value)} />
            </div>

            <Button onClick={handleSave} disabled={saving} className="w-full h-12 lg:h-10">
              <Save className="mr-2 h-4 w-4" />
              {saving ? "กำลังบันทึก..." : "บันทึก"}
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile Sticky Footer */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 p-4 bg-background/80 backdrop-blur-md border-t z-50 flex gap-2">
        <Button variant="outline" className="flex-1 h-12" onClick={() => navigate("/admin/reviews")}>
          ยกเลิก
        </Button>
        <Button onClick={handleSave} disabled={saving} className="flex-[2] h-12">
          <Save className="mr-2 h-4 w-4" />
          {saving ? "บันทึก..." : "บันทึกการเปลี่ยนแปลง"}
        </Button>
      </div>
      <div className="h-20 lg:hidden" /> {/* Spacer for sticky footer */}
    </AdminLayout>
  );
}
