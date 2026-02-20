import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Plus, Search, Pencil, Trash2, Eye, EyeOff } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface ReviewRow {
  id: string;
  name: string;
  brand: string;
  category: string;
  overall_rating: number;
  published: boolean;
  slug: string;
  updated_at: string;
}

export default function AdminReviews() {
  const [reviews, setReviews] = useState<ReviewRow[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { toast } = useToast();

  const fetchReviews = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("reviews")
      .select("id, name, brand, category, overall_rating, published, slug, updated_at")
      .order("updated_at", { ascending: false });
    if (!error) setReviews(data || []);
    setLoading(false);
  };

  useEffect(() => { fetchReviews(); }, []);

  const togglePublish = async (id: string, published: boolean) => {
    const { error } = await supabase.from("reviews").update({ published: !published }).eq("id", id);
    if (error) {
      toast({ title: "ดำเนินการไม่สำเร็จ", description: error.message, variant: "destructive" });
    } else {
      fetchReviews();
      toast({ title: !published ? "เผยแพร่แล้ว" : "ถอนเผยแพร่แล้ว" });
    }
  };

  const deleteReview = async (id: string, name: string) => {
    if (!confirm(`ลบรีวิว "${name}"?`)) return;
    const { error } = await supabase.from("reviews").delete().eq("id", id);
    if (error) {
      toast({ title: "ลบรีวิวไม่สำเร็จ", description: error.message, variant: "destructive" });
    } else {
      fetchReviews();
      toast({ title: "ลบรีวิวแล้ว" });
    }
  };

  const filtered = reviews.filter((r) =>
    `${r.name} ${r.brand} ${r.category}`.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <AdminLayout>
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-heading text-2xl font-bold text-foreground">จัดการรีวิว</h1>
        <Button onClick={() => navigate("/admin/reviews/new")}>
          <Plus className="mr-2 h-4 w-4" /> เพิ่มรีวิว
        </Button>
      </div>

      <div className="relative mb-4">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="ค้นหารีวิว..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-9"
        />
      </div>

      <div className="bg-card border rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b bg-muted/50">
                <th className="text-left px-4 py-3 font-medium text-muted-foreground">ชื่อสินค้า</th>
                <th className="text-left px-4 py-3 font-medium text-muted-foreground hidden md:table-cell">แบรนด์</th>
                <th className="text-left px-4 py-3 font-medium text-muted-foreground hidden md:table-cell">หมวดหมู่</th>
                <th className="text-center px-4 py-3 font-medium text-muted-foreground">คะแนน</th>
                <th className="text-center px-4 py-3 font-medium text-muted-foreground">สถานะ</th>
                <th className="text-right px-4 py-3 font-medium text-muted-foreground">จัดการ</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((r) => (
                <tr key={r.id} className="border-b last:border-0 hover:bg-muted/30">
                  <td className="px-4 py-3 font-medium text-foreground">{r.name}</td>
                  <td className="px-4 py-3 text-muted-foreground hidden md:table-cell">{r.brand}</td>
                  <td className="px-4 py-3 text-muted-foreground hidden md:table-cell">{r.category}</td>
                  <td className="px-4 py-3 text-center text-foreground">{r.overall_rating}</td>
                  <td className="px-4 py-3 text-center">
                    <Badge variant={r.published ? "default" : "secondary"}>
                      {r.published ? "เผยแพร่" : "แบบร่าง"}
                    </Badge>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-1">
                      <Button variant="ghost" size="icon" onClick={() => togglePublish(r.id, r.published)} title={r.published ? "ถอนเผยแพร่" : "เผยแพร่"}>
                        {r.published ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => navigate(`/admin/reviews/${r.id}`)}>
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => deleteReview(r.id, r.name)}>
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr><td colSpan={6} className="text-center py-8 text-muted-foreground">{loading ? "กำลังโหลด..." : "ไม่พบรีวิว"}</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </AdminLayout>
  );
}
