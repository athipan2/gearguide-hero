import { useEffect, useState } from "react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { FileText, Image, Eye, EyeOff, Plus, ExternalLink, ArrowRight, Pencil } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

interface RecentReview {
  id: string;
  name: string;
  brand: string;
  updated_at: string;
  published: boolean;
}

export default function AdminDashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState({ total: 0, published: 0, drafts: 0, media: 0 });
  const [recentReviews, setRecentReviews] = useState<RecentReview[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const [statsRes, mediaRes, reviewsRes] = await Promise.all([
        supabase.from("reviews").select("id, published"),
        supabase.from("media_library").select("id", { count: "exact", head: true }),
        supabase.from("reviews")
          .select("id, name, brand, updated_at, published")
          .order("updated_at", { ascending: false })
          .limit(5)
      ]);

      const all = statsRes.data || [];
      setStats({
        total: all.length,
        published: all.filter((r) => r.published).length,
        drafts: all.filter((r) => !r.published).length,
        media: mediaRes.count || 0,
      });

      setRecentReviews(reviewsRes.data || []);
    };
    fetchData();
  }, []);

  const cards = [
    { label: "รีวิวทั้งหมด", value: stats.total, icon: FileText, color: "text-primary", bg: "bg-primary/10" },
    { label: "เผยแพร่แล้ว", value: stats.published, icon: Eye, color: "text-green-600", bg: "bg-green-50" },
    { label: "แบบร่าง", value: stats.drafts, icon: EyeOff, color: "text-orange-500", bg: "bg-orange-50" },
    { label: "ไฟล์ Media", value: stats.media, icon: Image, color: "text-cta", bg: "bg-cta/10" },
  ];

  return (
    <AdminLayout>
      <div className="mb-8">
        <h1 className="font-heading text-3xl font-bold text-foreground">Dashboard</h1>
        <p className="text-muted-foreground mt-1">ยินดีต้อนรับกลับมา, {user?.email}</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {cards.map((c) => (
          <div key={c.label} className="bg-card border rounded-xl p-6 transition-all hover:shadow-md">
            <div className={`${c.bg} ${c.color} w-12 h-12 rounded-xl flex items-center justify-center mb-4`}>
              <c.icon className="h-6 w-6" />
            </div>
            <div>
              <p className="font-heading text-3xl font-bold text-foreground">{c.value}</p>
              <p className="text-sm font-medium text-muted-foreground">{c.label}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <div className="bg-card border rounded-xl shadow-sm overflow-hidden">
            <div className="p-6 border-b flex items-center justify-between">
              <h2 className="font-heading text-lg font-bold text-foreground">รีวิวอัปเดตล่าสุด</h2>
              <Button asChild variant="ghost" size="sm" className="text-primary hover:text-primary hover:bg-primary/10">
                <Link to="/admin/reviews">
                  ดูทั้งหมด <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="bg-muted/50 text-muted-foreground font-medium border-b">
                  <tr>
                    <th className="px-6 py-3">สินค้า</th>
                    <th className="px-6 py-3">แบรนด์</th>
                    <th className="px-6 py-3">สถานะ</th>
                    <th className="px-6 py-3 text-right">จัดการ</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {recentReviews.length > 0 ? (
                    recentReviews.map((r) => (
                      <tr key={r.id} className="hover:bg-muted/30 transition-colors">
                        <td className="px-6 py-4 font-medium text-foreground">{r.name}</td>
                        <td className="px-6 py-4 text-muted-foreground">{r.brand}</td>
                        <td className="px-6 py-4">
                          <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                            r.published ? "bg-green-100 text-green-700" : "bg-amber-100 text-amber-700"
                          }`}>
                            {r.published ? "เผยแพร่แล้ว" : "แบบร่าง"}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <Button asChild variant="ghost" size="icon">
                            <Link to={`/admin/reviews/${r.id}`}>
                              <Pencil className="h-4 w-4" />
                            </Link>
                          </Button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={4} className="px-6 py-10 text-center text-muted-foreground">
                        ไม่พบข้อมูลรีวิว
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <div>
          <div className="bg-card border rounded-xl p-6 shadow-sm">
            <h2 className="font-heading text-lg font-bold text-foreground mb-4 flex items-center gap-2">
              <Plus className="h-5 w-5 text-primary" />
              ทางลัดจัดการ
            </h2>
            <div className="grid gap-3">
              <Button asChild variant="outline" className="w-full justify-start h-12 hover:bg-primary/5 hover:text-primary hover:border-primary/30 transition-all">
                <Link to="/admin/reviews/new">
                  <Plus className="mr-2 h-4 w-4" />
                  เพิ่มรีวิวใหม่
                </Link>
              </Button>
              <Button asChild variant="outline" className="w-full justify-start h-12 hover:bg-primary/5 hover:text-primary hover:border-primary/30 transition-all">
                <Link to="/admin/media">
                  <Image className="mr-2 h-4 w-4" />
                  จัดการคลังสื่อ (Media)
                </Link>
              </Button>
              <Button asChild variant="outline" className="w-full justify-start h-12 hover:bg-primary/5 hover:text-primary hover:border-primary/30 transition-all">
                <Link to="/" target="_blank">
                  <ExternalLink className="mr-2 h-4 w-4" />
                  เปิดดูหน้าเว็บไซต์
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
