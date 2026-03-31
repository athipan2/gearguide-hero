import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useTranslation } from "@/hooks/useTranslation";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { MessageSquare, Send, User, Star } from "lucide-react";
import { toast } from "sonner";
import { RatingStars } from "./RatingStars";
import { cn } from "@/lib/utils";

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
  isCompact?: boolean;
}

export function CommentSection({ reviewId, articleId, isCompact }: CommentSectionProps) {
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

  const { t, language } = useTranslation();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      toast.error(t('comments.login_required'));
      return;
    }
    if (!newComment.trim()) return;

    setSubmitting(true);
    const { error } = await supabase.from("comments").insert({
      content: newComment,
      user_id: user.id,
      user_name: user.email?.split("@")[0] || t('comments.default_user_name'),
      review_id: reviewId,
      article_id: articleId,
      rating: rating > 0 ? rating : null,
    });

    if (error) {
      toast.error(t('comments.error'));
    } else {
      setNewComment("");
      setRating(0);
      toast.success(t('comments.success'));
      fetchComments();
    }
    setSubmitting(false);
  };

  return (
    <section className={cn(
      "border-t border-slate-100",
      isCompact ? "mt-16 md:mt-24 pt-12 md:pt-16" : "mt-20 md:mt-32 pt-16 md:pt-24"
    )}>
      <div className={cn(isCompact ? "mb-8 md:mb-12" : "mb-10 md:mb-16")}>
        <h2 className={cn(
          "font-heading font-semibold text-primary tracking-tighter uppercase flex items-center gap-3",
          isCompact ? "text-xl md:text-2xl" : "text-2xl md:text-4xl"
        )}>
          <span className={cn("bg-accent rounded-full", isCompact ? "h-6 md:h-8 w-1.5" : "h-8 md:h-10 w-1.5")} />
          {t('comments.title')}
        </h2>
        <p className={cn("text-muted-foreground mt-2 font-medium", isCompact ? "text-xs md:text-base" : "text-sm md:text-lg")}>
          {t('comments.subtitle')}
        </p>
      </div>

      {/* Form */}
      <div className={cn(isCompact ? "mb-12" : "mb-20")}>
        <h3 className={cn(
          "font-heading font-semibold mb-6 flex items-center gap-2 text-primary",
          isCompact ? "text-base md:text-lg" : "text-lg md:text-xl"
        )}>
          {user ? t('comments.user_label', { name: user.email?.split("@")[0] }) : t('comments.guest_label')}
        </h3>
        <form onSubmit={handleSubmit} className="space-y-6">
          {reviewId && (
            <div className="flex flex-col gap-3 mb-4">
              <span className="text-xs font-semibold uppercase tracking-widest text-muted-foreground/70">{t('comments.rating_label')}</span>
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
                  <span className="ml-2 text-sm font-semibold text-primary">{rating}.0 / 5.0</span>
                )}
              </div>
            </div>
          )}
          <Textarea
            placeholder={user ? t('comments.placeholder_user') : t('comments.placeholder_guest')}
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            disabled={!user || submitting}
            className={cn(
              "bg-slate-50 border-slate-200 rounded-2xl focus:ring-accent focus:border-accent transition-all",
              isCompact ? "min-h-[120px] p-4 md:p-6 text-sm md:text-base" : "min-h-[150px] p-6 md:p-8 text-base md:text-lg"
            )}
          />
          <div className="flex justify-end">
            <Button
              type="submit"
              disabled={!user || submitting || !newComment.trim()}
              variant="cta"
              className="h-12 px-8 rounded-full font-semibold shadow-lg shadow-primary/10 transition-all hover:scale-105"
            >
              {submitting ? t('comments.submitting') : t('comments.submit')}
              <Send className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </form>
      </div>

      {/* List */}
      <div className="space-y-6">
        {loading ? (
          <p className="text-center text-muted-foreground py-10">{t('comments.loading')}</p>
        ) : comments.length === 0 ? (
          <div className="text-center py-10 bg-muted/20 rounded-xl">
            <p className="text-muted-foreground">{t('comments.empty')}</p>
          </div>
        ) : (
          comments.map((comment) => (
            <div key={comment.id} className="flex gap-4 group">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                <User className="h-5 w-5 text-primary" />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-semibold text-sm text-foreground">
                    {comment.user_name}
                  </span>
                  {comment.rating && (
                    <div className="ml-2 flex items-center">
                      <RatingStars rating={comment.rating} />
                    </div>
                  )}
                  <span className="text-xs text-muted-foreground">
                    {new Date(comment.created_at).toLocaleDateString(language === 'th' ? "th-TH" : "en-US", {
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
