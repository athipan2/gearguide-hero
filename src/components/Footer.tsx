import { Mountain } from "lucide-react";
import { useTranslation } from "@/hooks/useTranslation";

export function Footer() {
  const { t } = useTranslation();

  return (
    <footer className="bg-primary text-primary-foreground">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          <div className="col-span-2 md:col-span-1">
            <a href="/" className="flex items-center gap-2 font-heading font-bold text-xl mb-3">
              <Mountain className="h-6 w-6" />
              GEARTRAIL
            </a>
            <p className="text-primary-foreground/70 text-sm">{t("footer.about_text")}</p>
          </div>
          <div>
            <h4 className="font-heading font-semibold mb-3">{t("home.categories_title")}</h4>
            <ul className="space-y-2 text-sm text-primary-foreground/70">
              <li><a href="/category/รองเท้าวิ่งถนน" className="hover:text-primary-foreground transition-colors">{t("nav.shoes")}</a></li>
              <li><a href="/category/อุปกรณ์วิ่งเทรล" className="hover:text-primary-foreground transition-colors">{t("nav.gear")}</a></li>
              <li><a href="/category/camping-gear" className="hover:text-primary-foreground transition-colors">{t("nav.camping")}</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-heading font-semibold mb-3">{t("footer.quick_links")}</h4>
            <ul className="space-y-2 text-sm text-primary-foreground/70">
              <li><a href="/" className="hover:text-primary-foreground transition-colors">{t("home.featured_title")}</a></li>
              <li><a href="/compare" className="hover:text-primary-foreground transition-colors">{t("nav.compare")}</a></li>
              <li><a href="#" className="hover:text-primary-foreground transition-colors">{t("nav.best")}</a></li>
              <li><a href="/guides" className="hover:text-primary-foreground transition-colors">{t("nav.guides")}</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-heading font-semibold mb-3">{t("footer.about")}</h4>
            <ul className="space-y-2 text-sm text-primary-foreground/70">
              <li><a href="#" className="hover:text-primary-foreground transition-colors">{t("footer.contact")}</a></li>
              <li><a href="#" className="hover:text-primary-foreground transition-colors">Affiliate Disclosure</a></li>
            </ul>
          </div>
        </div>
        <div className="border-t border-primary-foreground/20 mt-8 pt-8 text-center text-sm text-primary-foreground/50">
          {t("footer.copyright")}
        </div>
      </div>
    </footer>
  );
}
