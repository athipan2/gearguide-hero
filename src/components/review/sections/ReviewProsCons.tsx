import { ThumbsUp, ThumbsDown, Check, X } from "lucide-react";
import { useTranslation } from "@/hooks/useTranslation";

interface ReviewProsConsProps {
  pros: string[];
  cons: string[];
}

export const ReviewProsCons = ({ pros, cons }: ReviewProsConsProps) => {
  const { t } = useTranslation();

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 md:gap-16">
      <div className="bg-emerald-50/40 border border-emerald-100 rounded-2xl md:rounded-3xl p-6 md:p-10 transition-all duration-500 group relative overflow-hidden shadow-sm hover:shadow-md">
        <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/5 blur-3xl rounded-full -translate-y-1/2 translate-x-1/2" />
        <div className="flex items-center gap-4 mb-8 md:mb-10">
          <div className="h-12 w-12 rounded-xl bg-emerald-500 flex items-center justify-center shadow-lg shadow-emerald-500/20">
            <ThumbsUp className="h-6 w-6 text-white" />
          </div>
          <h3 className="font-heading font-semibold text-emerald-900 text-xl md:text-2xl">
            {t('common.pros') || 'จุดเด่น'}
          </h3>
        </div>
        <ul className="space-y-4">
          {pros.map((p, idx) => (
            <li key={idx} className="flex items-start gap-3 text-slate-800 leading-relaxed">
              <Check className="h-5 w-5 text-emerald-500 mt-1 shrink-0" />
              <span>{p}</span>
            </li>
          ))}
        </ul>
      </div>

      <div className="bg-rose-50/40 border border-rose-100 rounded-2xl md:rounded-3xl p-6 md:p-10 transition-all duration-500 group relative overflow-hidden shadow-sm hover:shadow-md">
        <div className="absolute top-0 right-0 w-32 h-32 bg-rose-500/5 blur-3xl rounded-full -translate-y-1/2 translate-x-1/2" />
        <div className="flex items-center gap-4 mb-8 md:mb-10">
          <div className="h-12 w-12 rounded-xl bg-rose-500 flex items-center justify-center shadow-lg shadow-rose-500/20">
            <ThumbsDown className="h-6 w-6 text-white" />
          </div>
          <h3 className="font-heading font-semibold text-rose-900 text-xl md:text-2xl">
            {t('common.cons') || 'จุดควรพิจารณา'}
          </h3>
        </div>
        <ul className="space-y-4">
          {cons.map((c, idx) => (
            <li key={idx} className="flex items-start gap-3 text-slate-800 leading-relaxed">
              <X className="h-5 w-5 text-rose-500 mt-1 shrink-0" />
              <span>{c}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};
