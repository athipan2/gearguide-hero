interface DeepDiveProps {
  title: string;
  body: string;
}

export const DeepDive = ({ title, body }: DeepDiveProps) => {
  return (
    <section className="bg-white p-6 md:p-8 rounded-none md:rounded-3xl border-y md:border-2 border-slate-100 shadow-sm md:shadow-none space-y-8">
      <div className="space-y-4">
        <h2 className="font-heading text-2xl md:text-3xl font-bold text-primary flex items-center gap-3">
          <span className="w-8 h-1 bg-accent rounded-full" />
          Detailed Deep Dive: {title}
        </h2>
      </div>

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
};
