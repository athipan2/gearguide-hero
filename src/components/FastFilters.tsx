import { Button } from "@/components/ui/button";

interface FilterOption {
  label: string;
  value: string;
}

const distanceOptions: FilterOption[] = [
  { label: "ทั้งหมด", value: "all" },
  { label: "10K - 21K", value: "10k" },
  { label: "25K - 50K", value: "25k" },
  { label: "Ultra", value: "ultra" },
];

const categories: FilterOption[] = [
  { label: "ทั้งหมด", value: "all" },
  { label: "รองเท้า", value: "shoes" },
  { label: "เป้ / เสื้อกั๊ก", value: "packs" },
  { label: "นาฬิกา", value: "watches" },
  { label: "อุปกรณ์อื่นๆ", value: "others" },
];

export function FastFilters() {
  return (
    <div className="space-y-6 mb-10 p-6 bg-card rounded-2xl border border-primary/5 shadow-sm">
      <div className="space-y-3">
        <h3 className="text-xs font-bold uppercase tracking-widest text-muted-foreground px-1">เลือกระยะทางที่คุณวิ่ง</h3>
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
        <h3 className="text-xs font-bold uppercase tracking-widest text-muted-foreground px-1">หมวดหมู่สินค้า</h3>
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
