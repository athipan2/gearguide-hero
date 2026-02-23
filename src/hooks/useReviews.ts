import { useQuery } from "@tanstack/react-query";
import { getReviews, getReviewBySlug, Review } from "@/lib/api";
import { toast } from "sonner";

export function useReviews(options?: Parameters<typeof getReviews>[0]) {
  return useQuery({
    queryKey: ["reviews", options],
    queryFn: async () => {
      try {
        return await getReviews(options);
      } catch (error) {
        toast.error("ไม่สามารถโหลดข้อมูลรีวิวได้ กรุณาลองใหม่อีกครั้ง");
        throw error;
      }
    },
  });
}

export function useReview(slug: string) {
  return useQuery({
    queryKey: ["review", slug],
    queryFn: async () => {
      try {
        if (!slug) return null;
        return await getReviewBySlug(slug);
      } catch (error) {
        toast.error("ไม่สามารถโหลดข้อมูลรีวิวได้ กรุณาลองใหม่อีกครั้ง");
        throw error;
      }
    },
    enabled: !!slug,
  });
}
