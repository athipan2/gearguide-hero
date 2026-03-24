import { Scale } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useComparisonStore } from "@/lib/comparison-store";
import { toast } from "sonner";
import { ReviewData } from "@/types/review";

interface ReviewComparisonProps {
  review: ReviewData;
}

export const ReviewComparison = ({ review }: ReviewComparisonProps) => {
  return (
    <div className="bg-white rounded-3xl p-8 border border-primary/5 shadow-sm relative overflow-hidden group">
      <div className="flex flex-col md:flex-row items-center justify-between gap-8 relative z-10">
        <div className="space-y-2 text-center md:text-left">
          <h3 className="font-heading text-2xl font-bold text-primary">เทียบกับรุ่นอื่นในหมวดเดียวกัน?</h3>
          <p className="text-sm text-slate-500 font-medium">ดูข้อแตกต่างด้านสเปคและราคาก่อนตัดสินใจ</p>
        </div>
        <Button
          variant="outline"
          size="lg"
          className="rounded-xl border-primary/10 hover:bg-slate-50 text-primary font-bold text-xs uppercase tracking-widest px-8"
          onClick={() => {
            const weight = review.specs?.find(s => s.label.toLowerCase().includes('weight') || s.label.includes('น้ำหนัก'))?.value;
            const drop = review.specs?.find(s => s.label.toLowerCase().includes('drop'))?.value;
            useComparisonStore.getState().addItem({
              name: review.name,
              brand: review.brand,
              image: review.image_url || "",
              rating: review.overall_rating,
              price: review.price,
              slug: review.slug || "",
              badge: review.badge || undefined,
              weight,
              drop,
              specs: review.specs,
              aspectRatings: review.ratings
            });
            toast.success(`เพิ่ม ${review.name} เข้าสู่การเปรียบเทียบ`);
          }}
        >
          <Scale className="h-4 w-4 mr-2" /> เปรียบเทียบตอนนี้
        </Button>
      </div>
      <div className="absolute top-0 right-0 w-32 h-32 bg-accent/5 blur-3xl rounded-full translate-x-1/2 -translate-y-1/2" />
    </div>
  );
};
