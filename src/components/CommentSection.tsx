import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { MessageSquare, Send, User } from "lucide-react";
import { toast } from "sonner";

interface Comment {
  id: string;
  content: string;
  user_name: string | null;
  created_at: string;
}

interface CommentSectionProps {
  reviewId?: string;
  articleId?: string;
}

export function CommentSection({ reviewId, articleId }: CommentSectionProps) {
  const { user } = useAuth();
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const referenceId = reviewId || articleId;

  const fetchComments = useCallback(async () => {
    if (!referenceId) return;

    setLoading(true);
    let query = supabase
      .from("comments")
      .select("id, content, user_name, created_at")
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
    });

    if (error) {
      toast.error("เกิดข้อผิดพลาดในการส่งข้อความ");
    } else {
      setNewComment("");
      toast.success("ส่งข้อความแล้ว");
      fetchComments();
    }
    setSubmitting(false);
  };

  return (
    <section className="mt-16 border-t pt-12">
      <div className="flex items-center gap-3 mb-8">
        <MessageSquare className="h-6 w-6 text-primary" />
        <h2 className="font-heading text-2xl font-bold">ถาม-ตอบ & ความคิดเห็น</h2>
      </div>

      {/* Form */}
      <div className="bg-muted/30 rounded-2xl p-6 mb-12 border border-dashed border-primary/20">
        <h3 className="font-semibold mb-4 flex items-center gap-2">
          {user ? `ร่วมแบ่งปันประสบการณ์ในฐานะ ${user.email?.split("@")[0]}` : "ร่วมพูดคุยกับเรา"}
        </h3>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Textarea
            placeholder={user ? "เขียนคำถามหรือความคิดเห็นของคุณที่นี่..." : "กรุณาเข้าสู่ระบบเพื่อร่วมแสดงความคิดเห็น"}
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            disabled={!user || submitting}
            className="min-h-[100px] bg-background"
          />
          <div className="flex justify-end">
            <Button type="submit" disabled={!user || submitting || !newComment.trim()} className="gap-2">
              <Send className="h-4 w-4" />
              {submitting ? "กำลังส่ง..." : "ส่งความเห็น"}
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
