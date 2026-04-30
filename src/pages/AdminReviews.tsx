import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { dataService } from "@/lib/data-service";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Plus, Search, Pencil, Trash2, Eye, EyeOff } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useTranslation } from "@/hooks/useTranslation";

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
  const { t } = useTranslation();

  const fetchReviews = async () => {
    setLoading(true);
    try {
      const data = await dataService.getReviews({ publishedOnly: false });
      setReviews(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Error fetching reviews:", err);
      setReviews([]);
    }
    setLoading(false);
  };

  useEffect(() => { fetchReviews(); }, []);

  const togglePublish = async (id: string, published: boolean) => {
    try {
      await dataService.saveReview({ published: !published }, id);
      fetchReviews();
      toast({ title: !published ? t('admin.published') : t('admin.drafts') });
    } catch (err) {
      toast({ title: t('common.save') + " Error", variant: "destructive" });
    }
  };

  const deleteReview = async (id: string, name: string) => {
    if (!confirm(`${t('common.delete')} "${name}"?`)) return;
    try {
      await dataService.deleteReview(id);
      fetchReviews();
      toast({ title: t('common.delete') + " OK" });
    } catch (err) {
      toast({ title: t('common.delete') + " Error", variant: "destructive" });
    }
  };

  const filtered = Array.isArray(reviews) ? reviews.filter((r) =>
    `${r.name || ""} ${r.brand || ""} ${r.category || ""}`.toLowerCase().includes(search.toLowerCase())
  ) : [];

  return (
    <AdminLayout>
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-heading text-2xl font-bold text-foreground">{t('admin.manage_reviews')}</h1>
        <Button onClick={() => navigate("/admin/reviews/new")}>
          <Plus className="mr-2 h-4 w-4" /> {t('admin.add_review')}
        </Button>
      </div>

      <div className="relative mb-4">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder={t('admin.search_reviews')}
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
                <th className="text-left px-4 py-3 font-medium text-muted-foreground">{t('admin.product_name')}</th>
                <th className="text-left px-4 py-3 font-medium text-muted-foreground hidden md:table-cell">{t('admin.brand')}</th>
                <th className="text-left px-4 py-3 font-medium text-muted-foreground hidden md:table-cell">{t('admin.category')}</th>
                <th className="text-center px-4 py-3 font-medium text-muted-foreground">{t('admin.score')}</th>
                <th className="text-center px-4 py-3 font-medium text-muted-foreground">{t('admin.status')}</th>
                <th className="text-right px-4 py-3 font-medium text-muted-foreground">{t('admin.actions')}</th>
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
                      {r.published ? t('admin.published') : t('admin.drafts')}
                    </Badge>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-1">
                      <Button variant="ghost" size="icon" onClick={() => togglePublish(r.id, r.published)} title={r.published ? t('admin.drafts') : t('admin.published')}>
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
                <tr><td colSpan={6} className="text-center py-8 text-muted-foreground">{loading ? t('common.loading') : t('common.no_results')}</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </AdminLayout>
  );
}
