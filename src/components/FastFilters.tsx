import { Button } from "@/components/ui/button";
import { useTranslation } from "@/hooks/useTranslation";

interface FilterOption {
  label: string;
  value: string;
}

export function FastFilters() {
  const { t } = useTranslation();

  const distanceOptions: FilterOption[] = [
    { label: t('filters.all'), value: "all" },
    { label: "10K - 21K", value: "10k" },
    { label: "25K - 50K", value: "25k" },
    { label: "Ultra", value: "ultra" },
  ];

  const categories: FilterOption[] = [
    { label: t('filters.all'), value: "all" },
    { label: t('filters.shoes'), value: "shoes" },
    { label: t('filters.packs'), value: "packs" },
    { label: t('filters.watches'), value: "watches" },
    { label: t('filters.others'), value: "others" },
  ];

  return (
    <div className="space-y-6 mb-10 p-4 sm:p-6 bg-card rounded-2xl border border-primary/5 shadow-sm overflow-hidden">
      <div className="space-y-3">
        <h3 className="text-xs font-bold uppercase tracking-widest text-muted-foreground px-1">{t('filters.distance_title')}</h3>
        <div className="flex md:flex-wrap gap-2 overflow-x-auto md:overflow-visible pb-2 md:pb-0 scrollbar-hide -mx-1 px-1">
          {distanceOptions.map((opt) => (
            <Button
              key={opt.value}
              variant={opt.value === "all" ? "default" : "outline"}
              size="sm"
              className="rounded-full px-5 whitespace-nowrap"
            >
              {opt.label}
            </Button>
          ))}
        </div>
      </div>

      <div className="space-y-3">
        <h3 className="text-xs font-bold uppercase tracking-widest text-muted-foreground px-1">{t('filters.category_title')}</h3>
        <div className="flex md:flex-wrap gap-2 overflow-x-auto md:overflow-visible pb-2 md:pb-0 scrollbar-hide -mx-1 px-1">
          {categories.map((opt) => (
            <Button
              key={opt.value}
              variant={opt.value === "all" ? "default" : "outline"}
              size="sm"
              className="rounded-full px-5 whitespace-nowrap"
            >
              {opt.label}
            </Button>
          ))}
        </div>
      </div>
    </div>
  );
}
