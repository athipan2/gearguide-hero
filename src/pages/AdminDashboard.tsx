import { useEffect, useState } from "react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { dataService } from "@/lib/data-service";
import { FileText, Image, Eye, EyeOff } from "lucide-react";
import { useTranslation } from "@/hooks/useTranslation";

export default function AdminDashboard() {
  const [stats, setStats] = useState({ total: 0, published: 0, drafts: 0, media: 0 });
  const { t } = useTranslation();

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [reviews, media] = await Promise.all([
          dataService.getReviews({ publishedOnly: false }),
          dataService.getMedia(),
        ]);

        const all = Array.isArray(reviews) ? reviews : [];
        const mediaList = Array.isArray(media) ? media : [];

        setStats({
          total: all.length,
          published: all.filter((r: Record<string, unknown>) => r.published === true || r.published === 'TRUE' || r.published === 'true').length,
          drafts: all.filter((r: Record<string, unknown>) => !(r.published === true || r.published === 'TRUE' || r.published === 'true')).length,
          media: mediaList.length,
        });
      } catch (err) {
        console.error("Error fetching dashboard stats:", err);
      }
    };
    fetchStats();
  }, []);

  const cards = [
    { label: t('admin.total_reviews'), value: stats.total, icon: FileText, color: "text-primary" },
    { label: t('admin.published'), value: stats.published, icon: Eye, color: "text-badge-recommended" },
    { label: t('admin.drafts'), value: stats.drafts, icon: EyeOff, color: "text-muted-foreground" },
    { label: t('admin.media_files'), value: stats.media, icon: Image, color: "text-cta" },
  ];

  return (
    <AdminLayout>
      <h1 className="font-heading text-2xl font-bold text-foreground mb-6">{t('admin.dashboard')}</h1>
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
