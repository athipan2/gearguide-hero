import { useEffect, useState } from "react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { supabase } from "@/integrations/supabase/client";
import { FileText, Image, Eye, EyeOff } from "lucide-react";

export default function AdminDashboard() {
  const [stats, setStats] = useState({ total: 0, published: 0, drafts: 0, media: 0 });

  useEffect(() => {
    const fetchStats = async () => {
      const [reviews, media] = await Promise.all([
        supabase.from("reviews").select("id, published"),
        supabase.from("media_library").select("id", { count: "exact", head: true }),
      ]);
      const all = reviews.data || [];
      setStats({
        total: all.length,
        published: all.filter((r) => r.published).length,
        drafts: all.filter((r) => !r.published).length,
        media: media.count || 0,
      });
    };
    fetchStats();
  }, []);

  const cards = [
    { label: "รีวิวทั้งหมด", value: stats.total, icon: FileText, color: "text-primary" },
    { label: "เผยแพร่แล้ว", value: stats.published, icon: Eye, color: "text-badge-recommended" },
    { label: "แบบร่าง", value: stats.drafts, icon: EyeOff, color: "text-muted-foreground" },
    { label: "ไฟล์ Media", value: stats.media, icon: Image, color: "text-cta" },
  ];

  return (
    <AdminLayout>
      <h1 className="font-heading text-2xl font-bold text-foreground mb-6">Dashboard</h1>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {cards.map((c) => (
          <div key={c.label} className="bg-card border rounded-xl p-5">
            <c.icon className={`h-6 w-6 ${c.color} mb-2`} />
            <p className="font-heading text-3xl font-bold text-foreground">{c.value}</p>
            <p className="text-sm text-muted-foreground">{c.label}</p>
          </div>
        ))}
      </div>
    </AdminLayout>
  );
}
