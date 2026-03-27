import { Mountain } from "lucide-react";
import { useTranslation } from "@/hooks/useTranslation";
import { Link } from "react-router-dom";

export function Footer() {
  const { t } = useTranslation();

  return (
    <footer className="bg-primary text-primary-foreground">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          <div className="col-span-2 md:col-span-1">
            <Link to="/" className="flex items-center gap-2 font-heading font-bold text-xl mb-3">
              <Mountain className="h-6 w-6" />
              GearTrail
            </Link>
            <p className="text-primary-foreground/70 text-sm">{t('footer.tagline')}</p>
          </div>
          <div>
            <h4 className="font-heading font-semibold mb-3">{t('footer.categories')}</h4>
            <ul className="space-y-2 text-sm text-primary-foreground/70">
              <li><Link to="/category/รองเท้าวิ่งถนน" className="hover:text-primary-foreground transition-colors">{t('nav.running_shoes')}</Link></li>
              <li><Link to="/category/อุปกรณ์วิ่งเทรล" className="hover:text-primary-foreground transition-colors">{t('nav.trail_gear')}</Link></li>
              <li><Link to="/category/camping-gear" className="hover:text-primary-foreground transition-colors">{t('nav.camping')}</Link></li>
              <li><Link to="/category/นาฬิกา-gps" className="hover:text-primary-foreground transition-colors">{t('category.gps_watches')}</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-heading font-semibold mb-3">{t('footer.content')}</h4>
            <ul className="space-y-2 text-sm text-primary-foreground/70">
              <li><Link to="/category" className="hover:text-primary-foreground transition-colors">{t('footer.latest_reviews')}</Link></li>
              <li><Link to="/compare" className="hover:text-primary-foreground transition-colors">{t('footer.compare')}</Link></li>
              <li><Link to="#" className="hover:text-primary-foreground transition-colors">{t('footer.best_of')}</Link></li>
              <li><Link to="/guides" className="hover:text-primary-foreground transition-colors">{t('footer.beginner_guide')}</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-heading font-semibold mb-3">{t('footer.about')}</h4>
            <ul className="space-y-2 text-sm text-primary-foreground/70">
              <li><Link to="#" className="hover:text-primary-foreground transition-colors">{t('footer.team')}</Link></li>
              <li><Link to="#" className="hover:text-primary-foreground transition-colors">{t('footer.review_process')}</Link></li>
              <li><Link to="#" className="hover:text-primary-foreground transition-colors">{t('footer.contact')}</Link></li>
              <li><Link to="#" className="hover:text-primary-foreground transition-colors">{t('footer.affiliate')}</Link></li>
            </ul>
          </div>
        </div>
        <div className="border-t border-primary-foreground/20 mt-8 pt-8 text-center text-sm text-primary-foreground/50">
          {t('footer.rights')}
        </div>
      </div>
    </footer>
  );
}
