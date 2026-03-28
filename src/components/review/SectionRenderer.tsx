import { ReviewData, ReviewSectionData } from "@/types/review";
import { useTranslation } from "@/hooks/useTranslation";
import { translateData, translateArray, translateTerm } from "@/lib/translation-utils";
import { ReviewHero } from "./sections/ReviewHero";
import { ReviewSpecs } from "./sections/ReviewSpecs";
import { ReviewGallery } from "./sections/ReviewGallery";
import { ReviewComparison } from "./sections/ReviewComparison";
import { ReviewVerdict } from "./sections/ReviewVerdict";
import { QuickDecision } from "./sections/QuickDecision";
import { ScoreBreakdown } from "./sections/ScoreBreakdown";
import { RealWorldTest } from "./sections/RealWorldTest";
import { DeepDive } from "./sections/DeepDive";

interface SectionRendererProps {
  section: ReviewSectionData;
  review: ReviewData;
  userRating?: { average: number; count: number } | null;
}

export const SectionRenderer = ({ section, review, userRating }: SectionRendererProps) => {
  const { t, language } = useTranslation();

  switch (section.type) {
    case 'hero':
      return <ReviewHero review={review} userRating={userRating} />;

    case 'quick_decision': {
      const suitable = (review.specs || [])
        .filter(s => s.label.includes('เหมาะกับ') || s.label.includes('ระยะ') || s.label.includes('Suitable') || s.label.includes('Distance'))
        .map(s => translateTerm(s.value, language));

      const pros = translateArray(review, 'pros', language);
      const cons = translateArray(review, 'cons', language);

      // Combine some default "suitable" from pros if needed, or just use pros/cons
      const combinedSuitable = Array.from(new Set([...suitable, ...pros.slice(0, 2)]));
      const notSuitable = cons.slice(0, 3);

      return (
        <QuickDecision
          suitable={combinedSuitable}
          notSuitable={notSuitable}
        />
      );
    }

    case 'score_breakdown': {
      const localizedRatings = (review.ratings || []).map(r => ({
        ...r,
        label: r.label_en && language === 'en' ? r.label_en : r.label
      }));
      return <ScoreBreakdown ratings={localizedRatings} />;
    }

    case 'gallery':
      return <ReviewGallery images={review.images} name={translateData(review, 'name', language)} />;

    case 'deep_dive':
      return (
        <DeepDive
          title={translateData(section, 'title', language)}
          body={translateData(section, 'body', language)}
        />
      );

    case 'real_world_test': {
      const conditions = (section.props as ReviewData['test_conditions']) || review.test_conditions;
      const conditionsEn = (section.props as Record<string, unknown>)?.test_conditions_en as ReviewData['test_conditions_en'] || review.test_conditions_en;

      const activeConditions = language === 'en' && conditionsEn ? conditionsEn : conditions;

      return (
        <RealWorldTest
          terrain={translateTerm(activeConditions?.terrain || "Road / Trail", language)}
          weather={translateTerm(activeConditions?.weather || "Dry / Sunny", language)}
          distance={translateTerm(activeConditions?.distance || "50km+ Test", language)}
          performance={translateData(review, 'verdict', language)}
        />
      );
    }

    case 'specs': {
      const localizedSpecs = (review.specs || []).map(s => ({
        ...s,
        label: s.label_en && language === 'en' ? s.label_en : translateTerm(s.label, language),
        value: s.value_en && language === 'en' ? s.value_en : translateTerm(s.value, language)
      }));
      return (
        <ReviewSpecs
          specs={localizedSpecs}
          title={translateData(section, 'title', language) || t('common.specs').toUpperCase()}
        />
      );
    }

    case 'comparison':
      return <ReviewComparison review={review} />;

    case 'verdict':
      return (
        <ReviewVerdict
          verdict={translateData(review, 'verdict', language)}
          affiliateUrl={review.affiliate_url}
          ctaText={translateData(review, 'cta_text', language)}
          review={review}
        />
      );

    case 'pros_cons': {
      const pros = translateArray(review, 'pros', language);
      const cons = translateArray(review, 'cons', language);
      return <QuickDecision suitable={pros} notSuitable={cons} />;
    }

    case 'who_is_this_for': {
      const suitable = (review.specs || [])
        .filter(s => s.label.includes('เหมาะกับ') || s.label.includes('ระยะ') || s.label.includes('Suitable') || s.label.includes('Distance'))
        .map(s => translateTerm(s.value, language));
      return <QuickDecision suitable={suitable} notSuitable={[]} />;
    }

    case 'content': {
      const title = translateData(section, 'title', language);
      const body = translateData(section, 'body', language);
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
