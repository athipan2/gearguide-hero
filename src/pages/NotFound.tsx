import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useTranslation } from "@/hooks/useTranslation";
import { Mountain, ArrowLeft } from "lucide-react";

const NotFound = () => {
  const location = useLocation();
  const { t } = useTranslation();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-background bg-noise relative overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none opacity-10">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-accent blur-[120px] rounded-full" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-primary blur-[120px] rounded-full" />
      </div>

      <div className="relative text-center space-y-8 max-w-lg px-4 animate-in fade-in zoom-in duration-700">
        <div className="flex justify-center">
          <div className="relative">
            <div className="p-8 bg-primary/5 rounded-full border-2 border-primary/10 backdrop-blur-sm">
              <Mountain className="h-20 w-20 text-primary animate-pulse" />
            </div>
            <div className="absolute -top-2 -right-2 bg-accent text-accent-foreground text-[10px] font-semibold px-2 py-1 rounded-sm rotate-12 shadow-lg">
              {t("error.lost_trail")}
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <h1 className="text-8xl md:text-9xl font-semibold text-primary tracking-tighter leading-none">
            404
          </h1>
          <div className="h-1 w-20 bg-accent mx-auto rounded-full" />
          <h2 className="text-3xl md:text-4xl font-semibold text-foreground uppercase tracking-tight">
            {t("error.404_title")}
          </h2>
          <p className="text-muted-foreground text-lg font-medium leading-relaxed">
            {t("error.404_desc")}
          </p>
        </div>

        <div className="pt-6 flex flex-col sm:flex-row items-center justify-center gap-4">
          <Button asChild size="hero" className="rounded-full px-10 w-full sm:w-auto shadow-xl shadow-primary/20">
            <Link to="/">
              {t("error.back_home")}
            </Link>
          </Button>
          <Button asChild variant="outline" size="lg" className="rounded-full px-10 w-full sm:w-auto border-primary/20">
            <button onClick={() => window.history.back()}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              {t("error.back_prev")}
            </button>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
