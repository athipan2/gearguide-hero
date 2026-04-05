import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Mountain, LogIn, Mail, ArrowLeft } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { ToastAction } from "@/components/ui/toast";
import { useTranslation } from "@/hooks/useTranslation";

export default function AdminLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const { signIn, resendConfirmation } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { t } = useTranslation();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Check for missing Supabase configuration
    const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
    const supabaseKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;

    if (!supabaseUrl || !supabaseKey || supabaseUrl.includes("placeholder")) {
      toast({
        title: t('admin.config_incomplete'),
        description: t('admin.supabase_not_found'),
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      const { error } = await signIn(email, password);
      if (error) {
        console.error("Login error:", error);

        if (error.message === "Email not confirmed") {
          toast({
            title: t('admin.email_unconfirmed'),
            description: t('admin.email_unconfirmed_desc'),
            variant: "default",
            action: (
              <ToastAction
                altText="Resend Confirmation"
                onClick={async () => {
                  const { error: resendError } = await resendConfirmation(email);
                  if (resendError) {
                    toast({
                      title: "Error",
                      description: t('admin.resend_error'),
                      variant: "destructive"
                    });
                  } else {
                    toast({
                      title: t('admin.resend_success'),
                      description: t('admin.resend_success_desc'),
                    });
                  }
                }}
              >
                <Mail className="mr-2 h-4 w-4" />
                {t('admin.resend_confirmation')}
              </ToastAction>
            )
          });
        } else {
          toast({
            title: t('admin.login_failed'),
            description: error.message === "Load failed"
              ? t('admin.login_error_connection')
              : error.message,
            variant: "destructive"
          });
        }
      } else {
        navigate("/admin");
      }
    } catch (err) {
      console.error("Unexpected login error:", err);
      toast({
        title: t('admin.unexpected_error'),
        description: t('admin.try_again'),
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <div className="w-full max-w-sm space-y-6">
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-2"
        >
          <ArrowLeft className="h-4 w-4" />
          {t('admin.back_to_site')}
        </Link>
        <div className="text-center space-y-2">
          <div className="inline-flex items-center gap-2 text-primary">
            <Mountain className="h-8 w-8" />
            <span className="font-heading text-2xl font-bold">GearTrail</span>
          </div>
          <p className="text-muted-foreground">{t('admin.login_title')}</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 bg-card border rounded-xl p-6">
          <div className="space-y-2">
            <Label htmlFor="email">{t('admin.email')}</Label>
            <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">{t('admin.password')}</Label>
            <Input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
          </div>
          <Button type="submit" className="w-full" disabled={loading}>
            <LogIn className="mr-2 h-4 w-4" />
            {loading ? t('admin.logging_in') : t('admin.login')}
          </Button>
        </form>
      </div>
    </div>
  );
}
