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
import { Save, ArrowLeft, Plus, X, MoveUp, MoveDown, Upload, Loader2 } from "lucide-react";
import { ReviewSectionData, SpecItem, ReviewRating, SectionType } from "@/types/review";
import { Database, Json } from "@/integrations/supabase/types";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { resizeImage, IMAGE_VARIANTS } from "@/lib/image-utils";
import { getOptimizedImageUrl } from "@/lib/utils";

const defaultForm = {
  name: "", name_en: "", brand: "", brand_en: "", category: "", category_en: "", price: "", slug: "",
  image_url: "", badge: "", badge_en: "", overall_rating: 0,
  affiliate_url: "", cta_text: "ดูราคาล่าสุด", cta_text_en: "View Latest Price",
  shopee_url: "", lazada_url: "",
  intro: "", intro_en: "", verdict: "", verdict_en: "", published: false,
  test_conditions: { terrain: "", weather: "", distance: "" },
  test_conditions_en: { terrain: "", weather: "", distance: "" },
};

const sectionTypes: { label: string; value: SectionType }[] = [
  { label: "Hero", value: "hero" },
  { label: "Quick Decision (Pros/Cons)", value: "quick_decision" },
  { label: "Score Breakdown", value: "score_breakdown" },
  { label: "Technical Specs", value: "specs" },
  { label: "Pros & Cons (Legacy)", value: "pros_cons" },
  { label: "Who is this for? (Legacy)", value: "who_is_this_for" },
  { label: "Gallery", value: "gallery" },
  { label: "Comparison", value: "comparison" },
  { label: "Verdict Card", value: "verdict" },
  { label: "Content Section", value: "content" },
  { label: "Real World Test", value: "real_world_test" },
  { label: "Deep Dive", value: "deep_dive" },
];

export default function AdminReviewForm() {
  const { id } = useParams();
  const isEdit = !!id && id !== "new";
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useAuth();

  const [form, setForm] = useState(defaultForm);
  const [ratings, setRatings] = useState<ReviewRating[]>([{ label: "", label_en: "", score: 0 }]);
  const [specs, setSpecs] = useState<SpecItem[]>([{ label: "", label_en: "", value: "", value_en: "", highlight: false }]);
  const [pros, setPros] = useState<string[]>([""]);
  const [pros_en, setProsEn] = useState<string[]>([""]);
  const [cons, setCons] = useState<string[]>([""]);
  const [cons_en, setConsEn] = useState<string[]>([""]);
  const [sections, setSections] = useState<ReviewSectionData[]>([]);
  const [images, setImages] = useState<string[]>([]);
  const [saving, setSaving] = useState(false);
  const [uploadingCover, setUploadingCover] = useState(false);
  const [uploadingGallery, setUploadingGallery] = useState(false);

  useEffect(() => {
    if (isEdit) {
      supabase.from("reviews").select("*").eq("id", id).maybeSingle().then(({ data, error }) => {
        if (error) {
          console.error("Error fetching review:", error);
          toast({ title: "โหลดข้อมูลไม่สำเร็จ", description: error.message, variant: "destructive" });
          return;
        }
        if (data) {
          console.log("Fetched review data for ID:", id, data);
          setForm({
            name: data.name || "",
            name_en: data.name_en || "",
            brand: data.brand || "",
            brand_en: data.brand_en || "",
            category: data.category || "",
            category_en: data.category_en || "",
            price: data.price || "",
            slug: data.slug || "",
            image_url: data.image_url || "",
            badge: data.badge || "",
            badge_en: data.badge_en || "",
            overall_rating: Number(data.overall_rating) || 0,
            affiliate_url: data.affiliate_url || "",
            cta_text: data.cta_text || "ดูราคาล่าสุด",
            cta_text_en: data.cta_text_en || "View Latest Price",
            shopee_url: data.shopee_url || "",
            lazada_url: data.lazada_url || "",
            // @ts-expect-error - Json type handling
            test_conditions: data.test_conditions || { terrain: "", weather: "", distance: "" },
            // @ts-expect-error - Json type handling
            test_conditions_en: data.test_conditions_en || { terrain: "", weather: "", distance: "" },
            intro: data.intro || "",
            intro_en: data.intro_en || "",
            verdict: data.verdict || "",
            verdict_en: data.verdict_en || "",
            published: !!data.published,
          });

          const loadedRatings = Array.isArray(data.ratings) ? (data.ratings as unknown as ReviewRating[]) : [];
          setRatings(loadedRatings.length > 0 ? loadedRatings : [{ label: "", label_en: "", score: 0 }]);

          const loadedSpecs = Array.isArray(data.specs) ? (data.specs as unknown as SpecItem[]) : [];
          setSpecs(loadedSpecs.length > 0 ? loadedSpecs : [{ label: "", label_en: "", value: "", value_en: "", highlight: false }]);

          const loadedPros = Array.isArray(data.pros) ? (data.pros as unknown as string[]) : [];
          setPros(loadedPros.length > 0 ? loadedPros : [""]);

          const loadedProsEn = Array.isArray(data.pros_en) ? (data.pros_en as unknown as string[]) : [];
          setProsEn(loadedProsEn.length > 0 ? loadedProsEn : [""]);

          const loadedCons = Array.isArray(data.cons) ? (data.cons as unknown as string[]) : [];
          setCons(loadedCons.length > 0 ? loadedCons : [""]);

          const loadedConsEn = Array.isArray(data.cons_en) ? (data.cons_en as unknown as string[]) : [];
          setConsEn(loadedConsEn.length > 0 ? loadedConsEn : [""]);

          setSections(Array.isArray(data.sections) ? (data.sections as unknown as ReviewSectionData[]) : []);
          setImages(Array.isArray(data.images) ? (data.images as unknown as string[]) : []);
        }
      });
    } else {
      // Default sections for new review
      setSections([
        { type: 'hero' },
        { type: 'who_is_this_for' },
        { type: 'pros_cons' },
        { type: 'content', title: "Performance", body: "" },
        { type: 'comparison' },
        { type: 'verdict' }
      ]);
    }
  }, [id, isEdit, toast]);

  const handleSave = async () => {
    console.log("Saving form with ID:", id, "isEdit:", isEdit);
    console.log("Current Form State:", form);
    console.log("Current Pros/Cons State:", { pros, pros_en, cons, cons_en });

    if (!form.name || !form.slug || !form.brand || !form.category || !form.price) {
      const missing = [];
      if (!form.name) missing.push("ชื่อสินค้า");
      if (!form.slug) missing.push("Slug");
      if (!form.brand) missing.push("แบรนด์");
      if (!form.category) missing.push("หมวดหมู่");
      if (!form.price) missing.push("ราคา");

      toast({
        title: "กรุณากรอกข้อมูลที่จำเป็น",
        description: `ยังขาด: ${missing.join(", ")}`,
        variant: "destructive"
      });
      return;
    }

    setSaving(true);
    toast({ title: "กำลังบันทึกข้อมูล..." });

    try {
      const payload: Record<string, unknown> = {
        name: form.name,
        name_en: form.name_en,
        brand: form.brand,
        brand_en: form.brand_en,
        category: form.category,
        category_en: form.category_en,
        price: form.price,
        slug: form.slug,
        image_url: form.image_url,
        badge: form.badge,
        badge_en: form.badge_en,
        overall_rating: Math.round(form.overall_rating * 10) / 10,
        affiliate_url: form.affiliate_url,
        cta_text: form.cta_text,
        cta_text_en: form.cta_text_en,
        shopee_url: form.shopee_url,
        lazada_url: form.lazada_url,
        intro: form.intro,
        intro_en: form.intro_en,
        verdict: form.verdict,
        verdict_en: form.verdict_en,
        published: form.published,
        test_conditions: form.test_conditions,
        test_conditions_en: form.test_conditions_en,
        ratings: ratings.filter((r) => r.label && r.label.trim()).map(r => ({ ...r, score: Math.round(Number(r.score) * 10) / 10 })),
        specs: specs.filter((s) => s.label && s.label.trim()),
        pros: pros.filter(p => typeof p === 'string' && p.trim()),
        pros_en: pros_en.filter(p => typeof p === 'string' && p.trim()),
        cons: cons.filter(c => typeof c === 'string' && c.trim()),
        cons_en: cons_en.filter(c => typeof c === 'string' && c.trim()),
        sections: sections,
        images: images.filter(Boolean),
      };

      if (!isEdit) {
        payload.created_by = user?.id;
      }

      console.log("Payload:", payload);

      const query = isEdit
        ? supabase.from("reviews").update(payload).eq("id", id)
        : supabase.from("reviews").insert([payload]);

      const { error } = await query;

      if (error) {
        console.error("Supabase query error:", error);
        throw error;
      }

      console.log("Save successful");
      toast({ title: isEdit ? "อัปเดตเรียบร้อยแล้ว" : "สร้างรีวิวเรียบร้อยแล้ว" });
      navigate("/admin/reviews");
    } catch (err: unknown) {
      console.error("Detailed save error:", err);
      const error = err as Record<string, unknown>;
      const errorMessage = String(error?.message || error?.details || "เกิดข้อผิดพลาดในการเชื่อมต่อฐานข้อมูล");
      toast({
        title: "บันทึกไม่สำเร็จ",
        description: (
          <div className="mt-2 text-xs space-y-1 overflow-auto max-h-[100px]">
            <p className="font-semibold">{errorMessage}</p>
            {error?.hint && <p>Hint: {String(error.hint)}</p>}
            {error?.code && <p>Code: {String(error.code)}</p>}
          </div>
        ),
        variant: "destructive"
      });
    } finally {
      setSaving(false);
    }
  };

  const generateSlug = (name: string) => {
    return name
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, '')
      .replace(/[\s_]+/g, '-')
      .replace(/^-+|-+$/g, '');
  };

  const updateField = (key: string, value: string | boolean | number | object | null) => {
    console.log(`Updating field: ${key} =`, value);
    setForm((f) => {
      const next = { ...f, [key]: value };
      if (key === 'name' && !isEdit && !f.slug) {
        next.slug = generateSlug(value as string);
      }
      return next;
    });
  };

  const handleCoverUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user) return;

    setUploadingCover(true);
    try {
      // 1. Resize image
      const resizedBlob = await resizeImage(file, IMAGE_VARIANTS.hero);

      // 2. Upload to Supabase
      const ext = file.name.split(".").pop();
      const path = `reviews/${Date.now()}-cover.${ext}`;

      const { error: uploadError } = await supabase.storage
        .from("review-media")
        .upload(path, resizedBlob, { contentType: 'image/jpeg' });

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from("review-media")
        .getPublicUrl(path);

      updateField("image_url", publicUrl);
      toast({ title: "อัปโหลดรูปหน้าปกสำเร็จ" });
    } catch (error) {
      toast({
        title: "อัปโหลดรูปหน้าปกไม่สำเร็จ",
        description: error instanceof Error ? error.message : "เกิดข้อผิดพลาดไม่ทราบสาเหตุ",
        variant: "destructive"
      });
    } finally {
      setUploadingCover(false);
    }
  };

  const handleGalleryUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files?.length || !user) return;

    setUploadingGallery(true);
    const newUrls: string[] = [];

    try {
      for (const file of Array.from(files)) {
        const resizedBlob = await resizeImage(file, IMAGE_VARIANTS.hero);
        const ext = file.name.split(".").pop();
        const path = `reviews/${Date.now()}-gallery-${Math.random().toString(36).slice(2)}.${ext}`;

        const { error: uploadError } = await supabase.storage
          .from("review-media")
          .upload(path, resizedBlob, { contentType: 'image/jpeg' });

        if (uploadError) {
          toast({ title: `อัปโหลด ${file.name} ไม่สำเร็จ`, variant: "destructive" });
          continue;
        }

        const { data: { publicUrl } } = supabase.storage
          .from("review-media")
          .getPublicUrl(path);

        newUrls.push(publicUrl);
      }

      setImages(prev => [...prev, ...newUrls]);
      toast({ title: `อัปโหลด ${newUrls.length} รูปสำเร็จ` });
    } catch (error) {
      toast({
        title: "เกิดข้อผิดพลาดในการอัปโหลด",
        description: error instanceof Error ? error.message : "เกิดข้อผิดพลาดไม่ทราบสาเหตุ",
        variant: "destructive"
      });
    } finally {
      setUploadingGallery(false);
    }
  };

  const moveSection = (index: number, direction: 'up' | 'down') => {
    const newSections = [...sections];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex >= 0 && targetIndex < newSections.length) {
      [newSections[index], newSections[targetIndex]] = [newSections[targetIndex], newSections[index]];
      setSections(newSections);
    }
  };

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
        <div className="lg:col-span-2 space-y-6">
          {/* Media Info */}
          <div className="bg-card border rounded-xl p-5 space-y-4">
            <h2 className="font-heading font-semibold text-foreground">สื่อบันทึก (Images)</h2>
            <div className="grid sm:grid-cols-2 gap-6">
              {/* Cover Image */}
              <div className="space-y-3">
                <Label>รูปหน้าปก (Cover Image) *</Label>
                {form.image_url ? (
                  <div className="relative aspect-[4/3] rounded-lg overflow-hidden border bg-muted">
                    <img
                      src={getOptimizedImageUrl(form.image_url, 'card')}
                      alt="Cover preview"
                      className="w-full h-full object-cover"
                    />
                    <button
                      type="button"
                      onClick={() => updateField("image_url", "")}
                      className="absolute top-2 right-2 p-1.5 bg-black/60 text-white rounded-full hover:bg-black/80 transition-colors"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                ) : (
                  <label className="flex flex-col items-center justify-center aspect-[4/3] rounded-lg border-2 border-dashed border-muted-foreground/25 hover:border-primary/50 hover:bg-primary/5 cursor-pointer transition-all">
                    {uploadingCover ? (
                      <Loader2 className="h-8 w-8 text-primary animate-spin" />
                    ) : (
                      <>
                        <Upload className="h-8 w-8 text-muted-foreground mb-2" />
                        <span className="text-xs text-muted-foreground text-center px-4">
                          คลิกเพื่ออัปโหลดรูปหน้าปก<br />(ขนาดแนะนำ 1200x800)
                        </span>
                      </>
                    )}
                    <input
                      type="file"
                      className="hidden"
                      accept="image/*"
                      onChange={handleCoverUpload}
                      disabled={uploadingCover}
                    />
                  </label>
                )}
              </div>

              {/* Gallery Images */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label>แกลเลอรี (Gallery)</Label>
                  <span className="text-[10px] text-muted-foreground">{images.length} รูป</span>
                </div>

                <div className="grid grid-cols-3 gap-2">
              {Array.isArray(images) && images.map((url, i) => (
                    <div key={i} className="relative aspect-square rounded-md overflow-hidden border bg-muted group">
                      <img
                        src={getOptimizedImageUrl(url, 'thumbnail')}
                        className="w-full h-full object-cover"
                      />
                      <button
                        type="button"
                        onClick={() => setImages(images.filter((_, idx) => idx !== i))}
                        className="absolute top-1 right-1 p-1 bg-black/60 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </div>
                  ))}

                  <label className="flex flex-col items-center justify-center aspect-square rounded-md border-2 border-dashed border-muted-foreground/25 hover:border-primary/50 hover:bg-primary/5 cursor-pointer transition-all">
                    {uploadingGallery ? (
                      <Loader2 className="h-5 w-5 text-primary animate-spin" />
                    ) : (
                      <Plus className="h-5 w-5 text-muted-foreground" />
                    )}
                    <input
                      type="file"
                      className="hidden"
                      multiple
                      accept="image/*"
                      onChange={handleGalleryUpload}
                      disabled={uploadingGallery}
                    />
                  </label>
                </div>
              </div>
            </div>
          </div>

          {/* Basic info */}
          <div className="bg-card border rounded-xl p-5 space-y-4">
            <h2 className="font-heading font-semibold text-foreground">ข้อมูลพื้นฐาน</h2>
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>ชื่อสินค้า (Thai) *</Label>
                <Input value={form.name} onChange={(e) => updateField("name", e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label>Product Name (English)</Label>
                <Input value={form.name_en} onChange={(e) => updateField("name_en", e.target.value)} />
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label>Slug *</Label>
                  {!isEdit && (
                    <button
                      type="button"
                      onClick={() => updateField("slug", generateSlug(form.name))}
                      className="text-[10px] text-primary hover:underline"
                    >
                      รีเฟรช Slug
                    </button>
                  )}
                </div>
                <Input value={form.slug} onChange={(e) => updateField("slug", e.target.value)} placeholder="nike-vaporfly-3" />
              </div>
              <div className="space-y-2">
                <Label>แบรนด์ (Thai) *</Label>
                <Input value={form.brand} onChange={(e) => updateField("brand", e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label>Brand (English)</Label>
                <Input value={form.brand_en} onChange={(e) => updateField("brand_en", e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label>หมวดหมู่ (Thai) *</Label>
                <Input value={form.category} onChange={(e) => updateField("category", e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label>Category (English)</Label>
                <Input value={form.category_en} onChange={(e) => updateField("category_en", e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label>ป้ายกำกับ (Badge - Thai)</Label>
                <Input value={form.badge} onChange={(e) => updateField("badge", e.target.value)} placeholder="แนะนำโดยบรรณาธิการ" />
              </div>
              <div className="space-y-2">
                <Label>Badge (English)</Label>
                <Input value={form.badge_en} onChange={(e) => updateField("badge_en", e.target.value)} placeholder="Editor's Choice" />
              </div>
              <div className="space-y-2">
                <Label>ราคา *</Label>
                <Input value={form.price} onChange={(e) => updateField("price", e.target.value)} placeholder="฿8,500" />
              </div>
              <div className="space-y-2">
                <Label>คะแนนรวม</Label>
                <Input type="number" step="0.1" min="0" max="5" value={form.overall_rating} onChange={(e) => updateField("overall_rating", parseFloat(e.target.value) || 0)} />
              </div>
            </div>
          </div>

          {/* Dynamic Sections Renderer Control */}
          <div className="bg-card border rounded-xl p-5 space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="font-heading font-semibold text-foreground">โครงสร้างหน้า (Layout Sections)</h2>
              <Button variant="outline" size="sm" onClick={() => setSections([...sections, { type: 'content', title: "New Section" }])}>
                <Plus className="h-4 w-4 mr-1" /> เพิ่ม Section
              </Button>
            </div>

            <div className="space-y-4">
              {Array.isArray(sections) && sections.map((section, i) => (
                <div key={i} className="border rounded-lg p-4 bg-slate-50/50 space-y-4">
                  <div className="flex items-center justify-between gap-4">
                    <div className="flex items-center gap-2">
                      <div className="flex flex-col gap-1">
                        <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => moveSection(i, 'up')} disabled={i === 0}>
                          <MoveUp className="h-3 w-3" />
                        </Button>
                        <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => moveSection(i, 'down')} disabled={i === sections.length - 1}>
                          <MoveDown className="h-3 w-3" />
                        </Button>
                      </div>
                      <div className="space-y-1">
                        <Label className="text-[10px] uppercase font-bold text-slate-400">Type</Label>
                        <Select
                          value={section.type}
                          onValueChange={(val: SectionType) => {
                            const next = [...sections];
                            next[i].type = val;
                            setSections(next);
                          }}
                        >
                          <SelectTrigger className="w-[180px] h-8 text-xs">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {sectionTypes.map(t => (
                              <SelectItem key={t.value} value={t.value}>{t.label}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <Button variant="ghost" size="icon" className="text-destructive h-8 w-8" onClick={() => setSections(sections.filter((_, j) => j !== i))}>
                      <X className="h-4 w-4" />
                    </Button>
                  </div>

                  {section.type === 'content' && (
                    <div className="space-y-3 pt-2">
                      <div className="grid sm:grid-cols-2 gap-4">
                        <div className="space-y-1">
                          <Label className="text-xs">หัวข้อ (Thai)</Label>
                          <Input
                            value={section.title || ""}
                            onChange={(e) => {
                              const next = [...sections];
                              next[i].title = e.target.value;
                              setSections(next);
                            }}
                            className="h-8"
                          />
                        </div>
                        <div className="space-y-1">
                          <Label className="text-xs">Title (English)</Label>
                          <Input
                            // @ts-expect-error - Dynamic field
                            value={section.title_en || ""}
                            onChange={(e) => {
                              const next = [...sections];
                              // @ts-expect-error - Dynamic field
                              next[i].title_en = e.target.value;
                              setSections(next);
                            }}
                            className="h-8"
                          />
                        </div>
                      </div>
                      <div className="grid sm:grid-cols-2 gap-4">
                        <div className="space-y-1">
                          <Label className="text-xs">เนื้อหา (Thai)</Label>
                          <Textarea
                            value={section.body || ""}
                            onChange={(e) => {
                              const next = [...sections];
                              next[i].body = e.target.value;
                              setSections(next);
                            }}
                            rows={4}
                          />
                        </div>
                        <div className="space-y-1">
                          <Label className="text-xs">Body (English)</Label>
                          <Textarea
                            // @ts-expect-error - Dynamic field
                            value={section.body_en || ""}
                            onChange={(e) => {
                              const next = [...sections];
                              // @ts-expect-error - Dynamic field
                              next[i].body_en = e.target.value;
                              setSections(next);
                            }}
                            rows={4}
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  {section.type === 'hero' && (
                    <p className="text-[10px] text-slate-400 italic"> renders Image Gallery, Title, Score and Price anchor.</p>
                  )}
                  {section.type === 'specs' && (
                    <p className="text-[10px] text-slate-400 italic"> renders Technical specs grid (Mobile only by default in renderer).</p>
                  )}
                  {section.type === 'pros_cons' && (
                    <p className="text-[10px] text-slate-400 italic"> renders Pros and Cons lists.</p>
                  )}
                  {section.type === 'who_is_this_for' && (
                    <p className="text-[10px] text-slate-400 italic"> renders 'Suitable for' block based on specs and 'Not recommended' based on cons.</p>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Ratings */}
          <div className="bg-card border rounded-xl p-5 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="font-heading font-semibold text-foreground">คะแนนแต่ละด้าน (Ratings)</h2>
              <Button variant="ghost" size="sm" onClick={() => setRatings([...ratings, { label: "", label_en: "", score: 0 }])}>
                <Plus className="h-4 w-4 mr-1" /> เพิ่ม
              </Button>
            </div>
            <div className="space-y-3">
              {Array.isArray(ratings) && ratings.map((r, i) => (
                <div key={i} className="space-y-2 border-b pb-3 last:border-none">
                  <div className="flex gap-2 items-center">
                    <Input placeholder="ด้าน (TH)" value={r.label} onChange={(e) => { const n = [...ratings]; n[i].label = e.target.value; setRatings(n); }} className="flex-1 h-8 text-sm" />
                    <Input placeholder="Label (EN)" value={r.label_en || ""} onChange={(e) => { const n = [...ratings]; n[i].label_en = e.target.value; setRatings(n); }} className="flex-1 h-8 text-sm" />
                    <Input type="number" step="0.1" min="0" max="5" value={r.score} onChange={(e) => { const n = [...ratings]; n[i].score = parseFloat(e.target.value) || 0; setRatings(n); }} className="w-16 h-8 text-sm" />
                    <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setRatings(ratings.filter((_, j) => j !== i))}><X className="h-4 w-4" /></Button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Specs */}
          <div className="bg-card border rounded-xl p-5 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="font-heading font-semibold text-foreground">สเปค (Technical Specs)</h2>
              <Button variant="ghost" size="sm" onClick={() => setSpecs([...specs, { label: "", label_en: "", value: "", value_en: "", highlight: false }])}>
                <Plus className="h-4 w-4 mr-1" /> เพิ่ม
              </Button>
            </div>
            <div className="space-y-4">
              {Array.isArray(specs) && specs.map((s, i) => (
                <div key={i} className="space-y-2 border-b pb-4 last:border-none">
                  <div className="flex gap-2 items-center">
                    <Input placeholder="หัวข้อ (TH)" value={s.label} onChange={(e) => { const n = [...specs]; n[i].label = e.target.value; setSpecs(n); }} className="flex-1 h-8 text-sm" />
                    <Input placeholder="Label (EN)" value={s.label_en || ""} onChange={(e) => { const n = [...specs]; n[i].label_en = e.target.value; setSpecs(n); }} className="flex-1 h-8 text-sm" />
                    <div className="flex items-center gap-1 shrink-0 px-2">
                      <Label className="text-[10px]">Highlight</Label>
                      <Switch
                        checked={s.highlight}
                        onCheckedChange={(v) => { const n = [...specs]; n[i].highlight = v; setSpecs(n); }}
                        className="scale-75"
                      />
                    </div>
                    <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setSpecs(specs.filter((_, j) => j !== i))}><X className="h-4 w-4" /></Button>
                  </div>
                  <div className="flex gap-2">
                    <Input placeholder="ค่า (TH)" value={s.value} onChange={(e) => { const n = [...specs]; n[i].value = e.target.value; setSpecs(n); }} className="flex-1 h-8 text-sm bg-slate-50/50" />
                    <Input placeholder="Value (EN)" value={s.value_en || ""} onChange={(e) => { const n = [...specs]; n[i].value_en = e.target.value; setSpecs(n); }} className="flex-1 h-8 text-sm bg-slate-50/50" />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Pros / Cons */}
          <div className="grid sm:grid-cols-2 gap-4">
            {/* Pros */}
            <div className="bg-card border rounded-xl p-5 space-y-3">
              <div className="flex items-center justify-between">
                <h2 className="font-heading font-semibold text-emerald-600">ข้อดี (Pros)</h2>
                <div className="flex gap-1">
                  <Button variant="ghost" size="sm" className="h-8 text-[10px]" onClick={() => setProsEn([...pros_en, ""])}>+ EN</Button>
                  <Button variant="ghost" size="sm" className="h-8 text-[10px]" onClick={() => setPros([...pros, ""])}>+ TH</Button>
                </div>
              </div>
              <div className="space-y-4">
                <div className="space-y-2">
                   <Label className="text-[10px] text-muted-foreground uppercase">Thai</Label>
                   {Array.isArray(pros) && pros.map((p, i) => (
                    <div key={i} className="flex gap-2">
                      <Input value={p} onChange={(e) => { const n = [...pros]; n[i] = e.target.value; setPros(n); }} className="flex-1 h-8 text-sm" />
                      <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setPros(pros.filter((_, j) => j !== i))}><X className="h-4 w-4" /></Button>
                    </div>
                  ))}
                </div>
                <div className="space-y-2 pt-2 border-t">
                   <Label className="text-[10px] text-muted-foreground uppercase">English</Label>
                   {Array.isArray(pros_en) && pros_en.map((p, i) => (
                    <div key={i} className="flex gap-2">
                      <Input value={p} onChange={(e) => { const n = [...pros_en]; n[i] = e.target.value; setProsEn(n); }} className="flex-1 h-8 text-sm bg-slate-50/50" />
                      <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setProsEn(pros_en.filter((_, j) => j !== i))}><X className="h-4 w-4" /></Button>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Cons */}
            <div className="bg-card border rounded-xl p-5 space-y-3">
              <div className="flex items-center justify-between">
                <h2 className="font-heading font-semibold text-rose-500">ข้อเสีย (Cons)</h2>
                <div className="flex gap-1">
                  <Button variant="ghost" size="sm" className="h-8 text-[10px]" onClick={() => setConsEn([...cons_en, ""])}>+ EN</Button>
                  <Button variant="ghost" size="sm" className="h-8 text-[10px]" onClick={() => setCons([...cons, ""])}>+ TH</Button>
                </div>
              </div>
              <div className="space-y-4">
                <div className="space-y-2">
                   <Label className="text-[10px] text-muted-foreground uppercase">Thai</Label>
                   {Array.isArray(cons) && cons.map((c, i) => (
                    <div key={i} className="flex gap-2">
                      <Input value={c} onChange={(e) => { const n = [...cons]; n[i] = e.target.value; setCons(n); }} className="flex-1 h-8 text-sm" />
                      <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setCons(cons.filter((_, j) => j !== i))}><X className="h-4 w-4" /></Button>
                    </div>
                  ))}
                </div>
                <div className="space-y-2 pt-2 border-t">
                   <Label className="text-[10px] text-muted-foreground uppercase">English</Label>
                   {Array.isArray(cons_en) && cons_en.map((c, i) => (
                    <div key={i} className="flex gap-2">
                      <Input value={c} onChange={(e) => { const n = [...cons_en]; n[i] = e.target.value; setConsEn(n); }} className="flex-1 h-8 text-sm bg-slate-50/50" />
                      <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setConsEn(cons_en.filter((_, j) => j !== i))}><X className="h-4 w-4" /></Button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
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
              <Label>Affiliate URL (Default)</Label>
              <Input value={form.affiliate_url} onChange={(e) => updateField("affiliate_url", e.target.value)} placeholder="https://..." />
            </div>
            <div className="space-y-2">
              <Label>Shopee URL</Label>
              <Input value={form.shopee_url} onChange={(e) => updateField("shopee_url", e.target.value)} placeholder="https://shope.ee/..." />
            </div>
            <div className="space-y-2">
              <Label>Lazada URL</Label>
              <Input value={form.lazada_url} onChange={(e) => updateField("lazada_url", e.target.value)} placeholder="https://s.lazada.co.th/..." />
            </div>
            <div className="space-y-2">
              <Label>ข้อความปุ่ม CTA (Thai)</Label>
              <Input value={form.cta_text} onChange={(e) => updateField("cta_text", e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label>CTA Text (English)</Label>
              <Input value={form.cta_text_en} onChange={(e) => updateField("cta_text_en", e.target.value)} />
            </div>

            <div className="space-y-2 pt-2 border-t">
              <Label>บทนำ (Intro - Thai)</Label>
              <Textarea value={form.intro} onChange={(e) => updateField("intro", e.target.value)} rows={3} className="text-sm" />
            </div>
            <div className="space-y-2">
              <Label>Intro (English)</Label>
              <Textarea value={form.intro_en} onChange={(e) => updateField("intro_en", e.target.value)} rows={3} className="text-sm" />
            </div>
            <div className="space-y-4 pt-2 border-t">
              <h3 className="text-sm font-semibold">Test Conditions (Thai)</h3>
              <div className="grid grid-cols-3 gap-2">
                <Input
                  placeholder="เส้นทาง"
                  // @ts-expect-error - Dynamic field access
                  value={form.test_conditions?.terrain || ""}
                  onChange={(e) => updateField("test_conditions", { ...form.test_conditions, terrain: e.target.value })}
                  className="h-8 text-xs"
                />
                <Input
                  placeholder="สภาพอากาศ"
                  // @ts-expect-error - Dynamic field access
                  value={form.test_conditions?.weather || ""}
                  onChange={(e) => updateField("test_conditions", { ...form.test_conditions, weather: e.target.value })}
                  className="h-8 text-xs"
                />
                <Input
                  placeholder="ระยะทาง"
                  // @ts-expect-error - Dynamic field access
                  value={form.test_conditions?.distance || ""}
                  onChange={(e) => updateField("test_conditions", { ...form.test_conditions, distance: e.target.value })}
                  className="h-8 text-xs"
                />
              </div>
            </div>

            <div className="space-y-4 pt-2 border-t">
              <h3 className="text-sm font-semibold">Test Conditions (English)</h3>
              <div className="grid grid-cols-3 gap-2">
                <Input
                  placeholder="Terrain"
                  // @ts-expect-error - Dynamic field access
                  value={form.test_conditions_en?.terrain || ""}
                  onChange={(e) => updateField("test_conditions_en", { ...form.test_conditions_en, terrain: e.target.value })}
                  className="h-8 text-xs"
                />
                <Input
                  placeholder="Weather"
                  // @ts-expect-error - Dynamic field access
                  value={form.test_conditions_en?.weather || ""}
                  onChange={(e) => updateField("test_conditions_en", { ...form.test_conditions_en, weather: e.target.value })}
                  className="h-8 text-xs"
                />
                <Input
                  placeholder="Distance"
                  // @ts-expect-error - Dynamic field access
                  value={form.test_conditions_en?.distance || ""}
                  onChange={(e) => updateField("test_conditions_en", { ...form.test_conditions_en, distance: e.target.value })}
                  className="h-8 text-xs"
                />
              </div>
            </div>

            <div className="space-y-2 pt-2 border-t">
              <Label>สรุป (Verdict - Thai)</Label>
              <Textarea value={form.verdict} onChange={(e) => updateField("verdict", e.target.value)} rows={3} className="text-sm" />
            </div>
            <div className="space-y-2">
              <Label>Verdict (English)</Label>
              <Textarea value={form.verdict_en} onChange={(e) => updateField("verdict_en", e.target.value)} rows={3} className="text-sm" />
            </div>

            <Button
              type="button"
              onClick={(e) => {
                console.log("Desktop Save button clicked");
                e.preventDefault();
                handleSave();
              }}
              disabled={saving}
              className="w-full h-12 lg:h-10"
            >
              <Save className="mr-2 h-4 w-4" />
              {saving ? "กำลังบันทึก..." : "บันทึก"}
            </Button>
          </div>
        </div>
      </div>

      <div className="lg:hidden fixed bottom-0 left-0 right-0 p-4 bg-background/80 backdrop-blur-md border-t z-50 flex gap-2">
        <Button variant="outline" className="flex-1 h-12" onClick={() => navigate("/admin/reviews")}>
          ยกเลิก
        </Button>
        <Button
          type="button"
          onClick={(e) => {
            console.log("Mobile Save button clicked");
            e.preventDefault();
            handleSave();
          }}
          disabled={saving}
          className="flex-[2] h-12"
        >
          <Save className="mr-2 h-4 w-4" />
          {saving ? "บันทึก..." : "บันทึกการเปลี่ยนแปลง"}
        </Button>
      </div>
      <div className="h-20 lg:hidden" />
    </AdminLayout>
  );
}
