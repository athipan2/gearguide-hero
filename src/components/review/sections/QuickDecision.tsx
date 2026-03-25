import { CheckCircle2, ChevronRight } from "lucide-react";

interface QuickDecisionProps {
  suitable: string[];
  notSuitable: string[];
}

export const QuickDecision = ({ suitable, notSuitable }: QuickDecisionProps) => {
  return (
    <section className="bg-slate-50 md:bg-white p-6 md:p-8 rounded-none md:rounded-3xl border-y md:border-2 border-slate-100 shadow-sm md:shadow-none space-y-8 md:space-y-12">
      <div className="space-y-4">
         <h2 className="font-heading text-2xl md:text-3xl font-bold text-primary flex items-center gap-3">
          <span className="w-8 h-1 bg-accent rounded-full" />
          Quick Decision
        </h2>
        <p className="text-sm md:text-base text-slate-500 font-medium">
          เพื่อให้คุณตัดสินใจได้เร็วขึ้น นี่คือสรุปกลุ่มเป้าหมายที่เหมาะสมที่สุดสำหรับรุ่นนี้
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-8 md:gap-12">
        {/* Who is this for */}
        <div className="space-y-6 bg-white md:bg-slate-50/50 p-6 rounded-2xl md:p-0">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-600">
              <CheckCircle2 className="h-6 w-6" />
            </div>
            <h3 className="font-heading font-bold text-lg md:text-xl text-emerald-700 uppercase tracking-tight">Who is this for?</h3>
          </div>
          <ul className="space-y-4">
            {suitable.length > 0 ? suitable.map((item, idx) => (
              <li key={idx} className="flex items-start gap-3 group">
                <ChevronRight className="h-4 w-4 text-emerald-500 mt-1 shrink-0 group-hover:translate-x-1 transition-transform" />
                <span className="text-slate-600 text-sm md:text-base leading-relaxed font-medium">
                  {item}
                </span>
              </li>
            )) : (
               <li className="text-slate-400 text-sm italic">No data available</li>
            )}
          </ul>
        </div>

        {/* Who should avoid */}
        <div className="space-y-6 bg-white md:bg-slate-50/50 p-6 rounded-2xl md:p-0">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-rose-500/10 flex items-center justify-center text-rose-600">
              <XCircle className="h-6 w-6" />
            </div>
            <h3 className="font-heading font-bold text-lg md:text-xl text-rose-700 uppercase tracking-tight">Who should avoid?</h3>
          </div>
          <ul className="space-y-4">
            {notSuitable.length > 0 ? notSuitable.map((item, idx) => (
              <li key={idx} className="flex items-start gap-3 group">
                <ChevronRight className="h-4 w-4 text-rose-500 mt-1 shrink-0 group-hover:translate-x-1 transition-transform" />
                <span className="text-slate-600 text-sm md:text-base leading-relaxed font-medium">
                  {item}
                </span>
              </li>
            )) : (
               <li className="text-slate-400 text-sm italic">No data available</li>
            )}
          </ul>
        </div>
      </div>
    </section>
  );
};

const XCircle = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);
