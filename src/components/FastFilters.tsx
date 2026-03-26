import { Button } from "@/components/ui/button";
import { useTranslation } from "@/hooks/useTranslation";
import { TranslationKeys } from "@/lib/translations";

interface FilterOption {
  labelKey: TranslationKeys | "";
  value: string;
  staticLabel?: string;
}

export function FastFilters() {
  const { t } = useTranslation();

  const distanceOptions: FilterOption[] = [
    { labelKey: "home.all", value: "all" },
    { labelKey: "", staticLabel: "10K - 21K", value: "10k" },
    { labelKey: "", staticLabel: "25K - 50K", value: "25k" },
    { labelKey: "", staticLabel: "Ultra", value: "ultra" },
  ];

  const categories: FilterOption[] = [
    { labelKey: "home.all", value: "all" },
    { labelKey: "home.shoes", value: "shoes" },
    { labelKey: "home.packs", value: "packs" },
    { labelKey: "home.watches", value: "watches" },
    { labelKey: "home.others", value: "others" },
  ];

  return (
    <div className="space-y-6 mb-10 p-4 sm:p-6 bg-card rounded-2xl border border-primary/5 shadow-sm overflow-hidden">
      <div className="space-y-3">
        <h3 className="text-xs font-bold uppercase tracking-widest text-muted-foreground px-1">{t("home.filter_distance")}</h3>
        <div className="flex md:flex-wrap gap-2 overflow-x-auto md:overflow-visible pb-2 md:pb-0 scrollbar-hide -mx-1 px-1">
          {distanceOptions.map((opt) => (
            <Button
              key={opt.value}
              variant={opt.value === "all" ? "default" : "outline"}
              size="sm"
              className="rounded-full px-5 whitespace-nowrap"
            >
              {opt.labelKey ? t(opt.labelKey) : opt.staticLabel}
            </Button>
          ))}
        </div>
      </div>

      <div className="space-y-3">
        <h3 className="text-xs font-bold uppercase tracking-widest text-muted-foreground px-1">{t("home.filter_category")}</h3>
        <div className="flex md:flex-wrap gap-2 overflow-x-auto md:overflow-visible pb-2 md:pb-0 scrollbar-hide -mx-1 px-1">
          {categories.map((opt) => (
            <Button
              key={opt.value}
              variant={opt.value === "all" ? "default" : "outline"}
              size="sm"
              className="rounded-full px-5 whitespace-nowrap"
            >
              {opt.labelKey ? t(opt.labelKey) : ""}
            </Button>
          ))}
        </div>
      </div>
    </div>
  );
}
