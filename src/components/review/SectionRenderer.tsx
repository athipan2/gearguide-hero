import { ReviewData, ReviewSectionData } from "@/types/review";
import { ReviewHero } from "./sections/ReviewHero";
import { ReviewSpecs } from "./sections/ReviewSpecs";
import { ReviewGallery } from "./sections/ReviewGallery";
import { ReviewComparison } from "./sections/ReviewComparison";
import { ReviewVerdict } from "./sections/ReviewVerdict";
import { QuickDecision } from "./sections/QuickDecision";
import { ScoreBreakdown } from "./sections/ScoreBreakdown";
import { RealWorldTest } from "./sections/RealWorldTest";
import { DeepDive } from "./sections/DeepDive";
import { useTranslation } from "@/hooks/useTranslation";
import { translateData } from "@/lib/utils";

interface SectionRendererProps {
  section: ReviewSectionData;
  review: ReviewData;
  userRating?: { average: number; count: number } | null;
}

export const SectionRenderer = ({ section, review, userRating }: SectionRendererProps) => {
  const { language } = useTranslation();
  const isEn = language === 'en';

  switch (section.type) {
    case 'hero':
      return <ReviewHero review={review} userRating={userRating} />;

    case 'quick_decision': {
      const specs = (isEn && review.specs_en && review.specs_en.length > 0) ? review.specs_en : review.specs;
      const pros = (isEn && review.pros_en && review.pros_en.length > 0) ? review.pros_en : review.pros;
      const cons = (isEn && review.cons_en && review.cons_en.length > 0) ? review.cons_en : review.cons;

      const suitable = specs
        ?.filter(s =>
          s.label.includes('เหมาะกับ') ||
          s.label.includes('ระยะ') ||
          s.label.includes('Suitable') ||
          s.label.includes('Distance') ||
          s.label.toLowerCase().includes('target')
        )
        ?.map(s => isEn ? translateData(s.value, 'en') : s.value) || [];

      // Combine some default "suitable" from pros if needed, or just use pros/cons
      const combinedSuitable = Array.from(new Set([...suitable, ...pros.slice(0, 2).map(p => isEn ? translateData(p, 'en') : p)]));
      const notSuitable = (cons?.slice(0, 3) || []).map(c => isEn ? translateData(c, 'en') : c);

      return (
        <QuickDecision
          suitable={combinedSuitable}
          notSuitable={notSuitable}
        />
      );
    }

    case 'score_breakdown': {
      const ratings = (isEn && review.ratings_en && review.ratings_en.length > 0) ? review.ratings_en : review.ratings;
      const translatedRatings = ratings?.map(r => ({
        ...r,
        label: isEn ? translateData(r.label, 'en') : r.label
      }));
      return <ScoreBreakdown ratings={translatedRatings} />;
    }

    case 'gallery':
      return <ReviewGallery images={review.images} name={(isEn && review.name_en) ? review.name_en : review.name} />;

    case 'deep_dive': {
      const title = (isEn && section.title_en) ? section.title_en : section.title;
      const body = (isEn && section.body_en) ? section.body_en : section.body;
      return <DeepDive title={title || ""} body={body || ""} />;
    }

    case 'real_world_test': {
      const hasEnConditions = isEn && review.test_conditions_en && Object.keys(review.test_conditions_en).length > 0;
      const conditions = hasEnConditions
        ? review.test_conditions_en
        : (section.props as ReviewData['test_conditions']) || review.test_conditions;

      const performance = (isEn && review.verdict_en) ? review.verdict_en : review.verdict;

      return (
        <RealWorldTest
          terrain={isEn ? translateData(conditions?.terrain, 'en') : conditions?.terrain || (isEn ? "Road / Trail" : "ถนน / เทรล")}
          weather={isEn ? translateData(conditions?.weather, 'en') : conditions?.weather || (isEn ? "Dry / Sunny" : "แดดจัด / พื้นแห้ง")}
          distance={isEn ? translateData(conditions?.distance, 'en') : conditions?.distance || (isEn ? "50km+ Test" : "ทดสอบ 50 กม.+")}
          performance={isEn ? translateData(performance, 'en') : performance || ""}
        />
      );
    }

    case 'specs': {
      const specs = (isEn && review.specs_en && review.specs_en.length > 0) ? review.specs_en : review.specs;
      const translatedSpecs = specs?.map(s => ({
        ...s,
        label: isEn ? translateData(s.label, 'en') : s.label,
        value: isEn ? translateData(s.value, 'en') : s.value
      }));
      const title = (isEn && section.title_en) ? section.title_en : section.title;
      return (
        <ReviewSpecs
          specs={translatedSpecs || []}
          title={isEn ? translateData(title, 'en') : title}
        />
      );
    }

    case 'comparison':
      return <ReviewComparison review={review} />;

    case 'verdict': {
      const verdict = (isEn && review.verdict_en) ? review.verdict_en : review.verdict;
      const ctaText = (isEn && review.cta_text_en) ? review.cta_text_en : review.cta_text;

      return (
        <ReviewVerdict
          verdict={isEn ? translateData(verdict, 'en') : (verdict || "")}
          affiliateUrl={review.affiliate_url}
          ctaText={isEn ? translateData(ctaText, 'en') : (ctaText || "")}
          review={review}
        />
      );
    }

    case 'pros_cons':
      // Legacy support, but we now use quick_decision
      return null;

    case 'who_is_this_for':
      // Legacy support, but we now use quick_decision
      return null;

    case 'content': {
      const title = (isEn && section.title_en) ? section.title_en : section.title;
      const body = (isEn && section.body_en) ? section.body_en : section.body;

      return (
        <section className="bg-white p-6 md:p-8 rounded-none md:rounded-3xl border-y md:border-2 border-slate-100 shadow-sm md:shadow-none space-y-8">
          {title && (
            <h2 className="font-heading text-2xl md:text-3xl font-bold text-primary flex items-center gap-3">
              <span className="w-8 h-1 bg-accent rounded-full" />
              {title}
            </h2>
          )}
          <div className="md:border-l-[4px] border-primary/10 md:pl-16 max-w-[800px]">
            {body?.split('\n').filter(line => line.trim()).map((paragraph, idx) => {
              if (paragraph.trim().startsWith('-') || paragraph.trim().startsWith('•')) {
                return (
                  <div key={idx} className="flex items-start gap-3 mb-6 last:mb-0">
                    <div className="h-1.5 w-1.5 rounded-full bg-accent mt-2.5 shrink-0" />
                    <p className="text-slate-600 text-base md:text-lg leading-relaxed font-medium">
                      {paragraph.trim().substring(1).trim()}
                    </p>
                  </div>
                );
              }
              return (
                <p key={idx} className="text-slate-600 text-base md:text-lg leading-relaxed mb-8 last:mb-0 whitespace-pre-wrap font-medium">
                  {paragraph}
                </p>
              );
            })}
          </div>
        </section>
      );
    }

    default:
      return null;
  }
};
