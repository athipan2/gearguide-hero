import { ReviewData, ReviewSectionData } from "@/types/review";
import { ReviewHero } from "./sections/ReviewHero";
import { ReviewSpecs } from "./sections/ReviewSpecs";
import { ReviewProsCons } from "./sections/ReviewProsCons";
import { ReviewWhoIsThisFor } from "./sections/ReviewWhoIsThisFor";
import { ReviewGallery } from "./sections/ReviewGallery";
import { ReviewComparison } from "./sections/ReviewComparison";
import { ReviewVerdict } from "./sections/ReviewVerdict";
import { cn } from "@/lib/utils";

interface SectionRendererProps {
  section: ReviewSectionData;
  review: ReviewData;
  userRating?: { average: number; count: number } | null;
}

export const SectionRenderer = ({ section, review, userRating }: SectionRendererProps) => {
  switch (section.type) {
    case 'hero':
      return <ReviewHero review={review} userRating={userRating} />;

    case 'specs':
      return (
        <ReviewSpecs
          specs={review.specs}
          title={section.title || "KEY SPECS"}
          className="lg:hidden" // Only show in main flow if not in sidebar
        />
      );

    case 'pros_cons':
      return <ReviewProsCons pros={review.pros} cons={review.cons} />;

    case 'who_is_this_for': {
      const suitable = review.specs
        ?.filter(s => s.label.includes('เหมาะกับ') || s.label.includes('ระยะ'))
        ?.map(s => s.value) || [];
      const notSuitable = review.cons?.slice(0, 2) || [];

      return (
        <ReviewWhoIsThisFor
          suitable={suitable}
          notSuitable={notSuitable}
        />
      );
    }

    case 'gallery':
      return <ReviewGallery images={review.images} name={review.name} />;

    case 'comparison':
      return <ReviewComparison review={review} />;

    case 'verdict':
      return (
        <ReviewVerdict
          verdict={review.verdict || ""}
          affiliateUrl={review.affiliate_url}
          ctaText={review.cta_text}
        />
      );

    case 'content':
      return (
        <div className="group bg-white/40 md:bg-transparent p-8 md:p-0 rounded-3xl border border-primary/5 md:border-none shadow-sm md:shadow-none">
          {section.title && (
            <h2 className="font-heading text-2xl md:text-3xl font-semibold text-primary flex items-center gap-6 mb-8 md:mb-12 leading-none group-hover:translate-x-2 transition-transform duration-700">
              <span className="h-10 md:h-12 w-3 bg-accent rounded-full shadow-lg shadow-accent/20" />
              {section.title}
            </h2>
          )}
          <div className="md:border-l-[4px] border-primary/10 md:pl-16 max-w-[800px] mx-auto lg:mx-0">
            {section.body?.split('\n').filter(line => line.trim()).map((paragraph, idx) => {
              if (paragraph.trim().startsWith('-') || paragraph.trim().startsWith('•')) {
                return (
                  <div key={idx} className="flex items-start gap-3 mb-6 last:mb-0">
                    <div className="h-1.5 w-1.5 rounded-full bg-accent mt-2.5 shrink-0" />
                    <p className="text-slate-600 text-base leading-relaxed">
                      {paragraph.trim().substring(1).trim()}
                    </p>
                  </div>
                );
              }
              return (
                <p key={idx} className="text-slate-600 text-base leading-relaxed mb-8 last:mb-0 whitespace-pre-wrap">
                  {paragraph}
                </p>
              );
            })}
          </div>
        </div>
      );

    default:
      return null;
  }
};
