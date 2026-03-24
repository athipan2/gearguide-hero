import { Check, X } from "lucide-react";

interface ReviewWhoIsThisForProps {
  suitable: string[];
  notSuitable: string[];
}

export const ReviewWhoIsThisFor = ({ suitable, notSuitable }: ReviewWhoIsThisForProps) => {
  return (
    <div className="bg-primary text-white rounded-[3rem] p-8 md:p-12 shadow-2xl shadow-primary/20 relative overflow-hidden group">
      <div className="absolute top-0 right-0 w-48 h-48 bg-white/5 blur-3xl rounded-full" />
      <h3 className="font-heading text-2xl md:text-3xl font-bold mb-12 flex items-center gap-4">
        <span className="w-2.5 h-8 bg-accent rounded-full" />
        เหมาะกับคุณไหม?
      </h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-12">
        <div className="space-y-8">
          <p className="text-xs font-bold text-accent uppercase tracking-[0.2em]">✅ เหมาะสำหรับ</p>
          <ul className="space-y-3">
            {suitable.map((item, i) => (
              <li key={i} className="flex items-start gap-3 text-sm font-medium text-white/90">
                <Check className="h-4 w-4 text-accent mt-0.5 shrink-0" />
                {item}
              </li>
            ))}
          </ul>
        </div>
        <div className="space-y-4">
          <p className="text-xs font-bold text-rose-400 uppercase tracking-[0.2em]">❌ ไม่เหมาะสำหรับ</p>
          <ul className="space-y-3">
            {notSuitable.map((item, i) => (
              <li key={i} className="flex items-start gap-3 text-sm font-medium text-white/70">
                <X className="h-4 w-4 text-rose-400 mt-0.5 shrink-0" />
                {item}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};
