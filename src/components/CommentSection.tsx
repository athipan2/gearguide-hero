import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { MessageSquare, Send, User, Star } from "lucide-react";
import { toast } from "sonner";
import { RatingStars } from "./RatingStars";

interface Comment {
  id: string;
  content: string;
  user_name: string | null;
  created_at: string;
  rating: number | null;
}

interface CommentSectionProps {
  reviewId?: string;
  articleId?: string;
}

export function CommentSection({ reviewId, articleId }: CommentSectionProps) {
  const { user } = useAuth();
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState("");
  const [rating, setRating] = useState<number>(0);
  const [hoveredRating, setHoveredRating] = useState<number>(0);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const referenceId = reviewId || articleId;

  const fetchComments = useCallback(async () => {
    if (!referenceId) return;

    setLoading(true);
    let query = supabase
      .from("comments")
      .select("id, content, user_name, created_at, rating")
      .order("created_at", { ascending: false });

    if (reviewId) query = query.eq("review_id", reviewId);
    if (articleId) query = query.eq("article_id", articleId);

    const { data, error } = await query;

    if (!error && data) {
      setComments(data as Comment[]);
    }
    setLoading(false);
  }, [reviewId, articleId, referenceId]);

  useEffect(() => {
    fetchComments();
  }, [fetchComments]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      toast.error("กรุณาเข้าสู่ระบบเพื่อแสดงความคิดเห็น");
      return;
    }
    if (!newComment.trim()) return;

    setSubmitting(true);
    const { error } = await supabase.from("comments").insert({
      content: newComment,
      user_id: user.id,
      user_name: user.email?.split("@")[0] || "ผู้ใช้งาน",
      review_id: reviewId,
      article_id: articleId,
      rating: rating > 0 ? rating : null,
    });

    if (error) {
      toast.error("เกิดข้อผิดพลาดในการส่งข้อความ");
    } else {
      setNewComment("");
      setRating(0);
      toast.success("ส่งข้อความแล้ว");
      fetchComments();
    }
    setSubmitting(false);
  };

  return (
    <section className="mt-20 md:mt-32 border-t border-slate-100 pt-16 md:pt-24">
      <div className="mb-10 md:mb-16">
        <h2 className="font-heading text-2xl md:text-4xl font-black text-primary tracking-tighter uppercase flex items-center gap-3">
          <span className="h-8 md:h-10 w-1.5 bg-accent rounded-full" />
          ถาม-ตอบ & ความคิดเห็น
        </h2>
        <p className="text-muted-foreground text-sm md:text-lg mt-2 font-medium">ร่วมพูดคุย สอบถาม หรือแชร์ประสบการณ์การใช้งานของคุณ</p>
      </div>

      {/* Form */}
      <div className="bg-white rounded-[2rem] p-6 md:p-10 mb-16 border border-slate-200 shadow-sm">
        <h3 className="font-semibold mb-4 flex items-center gap-2">
          {user ? `ร่วมแบ่งปันประสบการณ์ในฐานะ ${user.email?.split("@")[0]}` : "ร่วมพูดคุยกับเรา"}
        </h3>
        <form onSubmit={handleSubmit} className="space-y-6">
          {reviewId && (
            <div className="flex flex-col gap-3 mb-4">
              <span className="text-xs font-black uppercase tracking-widest text-muted-foreground/70">ให้คะแนนรองเท้าคู่นี้:</span>
              <div className="flex gap-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setRating(star)}
                    onMouseEnter={() => setHoveredRating(star)}
                    onMouseLeave={() => setHoveredRating(0)}
                    className="focus:outline-none transition-transform active:scale-90"
                  >
                    <Star
                      className={`h-6 w-6 ${
                        (hoveredRating || rating) >= star
                          ? "fill-rating text-rating"
                          : "text-muted-foreground/30"
                      }`}
                    />
                  </button>
                ))}
                {rating > 0 && (
                  <span className="ml-2 text-sm font-bold text-primary">{rating}.0 / 5.0</span>
                )}
              </div>
            </div>
          )}
          <Textarea
            placeholder={user ? "เขียนคำถามหรือความคิดเห็นของคุณที่นี่..." : "กรุณาเข้าสู่ระบบเพื่อร่วมแสดงความคิดเห็น"}
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            disabled={!user || submitting}
            className="min-h-[120px] bg-slate-50/50 border-slate-200 rounded-xl p-4 focus:ring-accent focus:border-accent"
          />
          <div className="flex justify-end">
            <Button
              type="submit"
              disabled={!user || submitting || !newComment.trim()}
              variant="cta"
              className="h-12 px-8 rounded-full font-bold shadow-lg shadow-primary/10 transition-all hover:scale-105"
            >
              {submitting ? "กำลังส่ง..." : "ส่งความเห็น"}
              <Send className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </form>
      </div>

      {/* List */}
      <div className="space-y-6">
        {loading ? (
          <p className="text-center text-muted-foreground py-10">กำลังโหลดความเห็น...</p>
        ) : comments.length === 0 ? (
          <div className="text-center py-10 bg-muted/20 rounded-xl">
            <p className="text-muted-foreground">ยังไม่มีใครถามเลย เป็นคนแรกที่เริ่มการสนทนาสิ!</p>
          </div>
        ) : (
          comments.map((comment) => (
            <div key={comment.id} className="flex gap-4 group">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                <User className="h-5 w-5 text-primary" />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-bold text-sm text-foreground">
                    {comment.user_name}
                  </span>
                  {comment.rating && (
                    <div className="ml-2 flex items-center">
                      <RatingStars rating={comment.rating} />
                    </div>
                  )}
                  <span className="text-xs text-muted-foreground">
                    {new Date(comment.created_at).toLocaleDateString("th-TH", {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </span>
                </div>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  {comment.content}
                </p>
              </div>
            </div>
          ))
        )}
      </div>
    </section>
  );
}
