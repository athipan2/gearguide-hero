import { SpecItem } from "@/types/review";
import { cn } from "@/lib/utils";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Info, Settings } from "lucide-react";

interface ReviewSpecsProps {
  specs: SpecItem[];
  title?: string;
  className?: string;
}

export const ReviewSpecs = ({ specs, title = "TECHNICAL SPECIFICATIONS", className }: ReviewSpecsProps) => {
  return (
    <section id="specs" className={cn("bg-white p-6 md:p-12 lg:p-20 rounded-none md:rounded-[2.5rem] border-y md:border-2 border-slate-100 shadow-sm md:shadow-none space-y-8 md:space-y-12", className)}>
      <Accordion type="single" collapsible defaultValue="specs" className="w-full">
        <AccordionItem value="specs" className="border-none">
          <AccordionTrigger className="hover:no-underline py-0 group">
            <div className="flex items-center gap-3 md:gap-6 text-left">
              <span className="w-10 h-1 bg-accent rounded-full" />
              <div className="space-y-1">
                <h2 className="font-heading text-3xl md:text-5xl lg:text-6xl font-bold text-primary uppercase tracking-tighter italic-prohibited">
                  {title}
                </h2>
                <p className="text-xs md:text-base text-slate-400 font-bold uppercase tracking-[0.3em] group-hover:text-accent transition-colors">
                  View full technical details & materials
                </p>
              </div>
            </div>
          </AccordionTrigger>
          <AccordionContent className="pt-12 md:pt-20">
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 md:gap-8">
              {specs.map((spec, idx) => (
                <div
                  key={idx}
                  className={cn(
                    "p-8 rounded-[2rem] border-2 transition-all group",
                    spec.highlight
                      ? "bg-slate-50 border-accent/20 hover:border-accent shadow-xl shadow-accent/5"
                      : "bg-white border-slate-100 hover:border-primary/20"
                  )}
                >
                  <div className="flex items-center gap-2 mb-6">
                    <div className={cn(
                      "h-10 w-10 rounded-xl flex items-center justify-center transition-transform group-hover:scale-110",
                      spec.highlight ? "bg-accent/10 text-accent" : "bg-primary/5 text-primary/40"
                    )}>
                      {spec.highlight ? <Settings className="h-5 w-5" /> : <Info className="h-5 w-5" />}
                    </div>
                  </div>
                  <p className="text-[10px] md:text-xs font-bold text-slate-400 uppercase tracking-[0.2em] mb-2">{spec.label}</p>
                  <p className="text-base md:text-xl font-bold text-primary leading-tight italic-prohibited">{spec.value}</p>
                </div>
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </section>
  );
};
