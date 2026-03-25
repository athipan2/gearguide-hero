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

interface SectionRendererProps {
  section: ReviewSectionData;
  review: ReviewData;
  userRating?: { average: number; count: number } | null;
}

export const SectionRenderer = ({ section, review, userRating }: SectionRendererProps) => {
  switch (section.type) {
    case 'hero':
      return <ReviewHero review={review} userRating={userRating} />;

    case 'quick_decision': {
      const suitable = review.specs
        ?.filter(s => s.label.includes('เหมาะกับ') || s.label.includes('ระยะ') || s.label.includes('Suitable') || s.label.includes('Distance'))
        ?.map(s => s.value) || [];

      // Combine some default "suitable" from pros if needed, or just use pros/cons
      const combinedSuitable = Array.from(new Set([...suitable, ...review.pros.slice(0, 2)]));
      const notSuitable = review.cons?.slice(0, 3) || [];

      return (
        <QuickDecision
          suitable={combinedSuitable}
          notSuitable={notSuitable}
        />
      );
    }

    case 'score_breakdown':
      return <ScoreBreakdown ratings={review.ratings} />;

    case 'gallery':
      return <ReviewGallery images={review.images} name={review.name} />;

    case 'deep_dive':
      return <DeepDive title={section.title || ""} body={section.body || ""} />;

    case 'real_world_test': {
      const conditions = (section.props as ReviewData['test_conditions']) || review.test_conditions;
      return (
        <RealWorldTest
          terrain={conditions?.terrain || "Road / Trail"}
          weather={conditions?.weather || "Dry / Sunny"}
          distance={conditions?.distance || "50km+ Test"}
          performance={review.verdict || ""}
        />
      );
    }

    case 'specs':
      return (
        <ReviewSpecs
          specs={review.specs}
          title={section.title || "TECHNICAL SPECIFICATIONS"}
        />
      );

    case 'comparison':
      return <ReviewComparison review={review} />;

    case 'verdict':
      return (
        <ReviewVerdict
          verdict={review.verdict || ""}
          affiliateUrl={review.affiliate_url}
          ctaText={review.cta_text}
          review={review}
        />
      );

    case 'pros_cons':
      // Legacy support, but we now use quick_decision
      return null;

    case 'who_is_this_for':
      // Legacy support, but we now use quick_decision
      return null;

    case 'content':
      return (
        <section className="bg-white p-6 md:p-8 rounded-none md:rounded-3xl border-y md:border-2 border-slate-100 shadow-sm md:shadow-none space-y-8">
          {section.title && (
            <h2 className="font-heading text-2xl md:text-3xl font-bold text-primary flex items-center gap-3">
              <span className="w-8 h-1 bg-accent rounded-full" />
              {section.title}
            </h2>
          )}
          <div className="md:border-l-[4px] border-primary/10 md:pl-16 max-w-[800px]">
            {section.body?.split('\n').filter(line => line.trim()).map((paragraph, idx) => {
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

    default:
      return null;
  }
};
