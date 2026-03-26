import { MapPin, CloudRain, Route, Zap } from "lucide-react";
import { useTranslation } from "@/hooks/useTranslation";

interface RealWorldTestProps {
  terrain: string;
  weather: string;
  distance: string;
  performance: string;
}

export const RealWorldTest = ({ terrain, weather, distance, performance }: RealWorldTestProps) => {
  const { t } = useTranslation();

  return (
    <section className="bg-primary p-6 md:p-12 rounded-none md:rounded-[2.5rem] text-white space-y-8 md:space-y-12 overflow-hidden relative group">
      {/* Decorative Blur BG */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-accent/20 blur-[100px] rounded-full -mr-64 -mt-64 group-hover:scale-110 transition-transform duration-[2000ms]" />
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-emerald-500/10 blur-[80px] rounded-full -ml-48 -mb-48" />

      <div className="relative z-10 space-y-4">
        <h2 className="font-heading text-2xl md:text-4xl font-bold uppercase tracking-tighter italic-prohibited flex items-center gap-3 md:gap-4">
          <span className="h-10 md:h-12 w-3 bg-accent rounded-full shadow-lg shadow-accent/20" />
          {t("common.real_world_test")}
        </h2>
        <p className="text-white/60 text-sm md:text-lg font-medium max-w-xl">
          {t("common.real_world_desc")}
        </p>
      </div>

      <div className="relative z-10 grid sm:grid-cols-3 gap-6 md:gap-8">
        {[
          { icon: MapPin, label: t("common.terrain"), value: terrain },
          { icon: CloudRain, label: t("common.weather"), value: weather },
          { icon: Route, label: t("common.distance"), value: distance }
        ].map((item, idx) => (
          <div key={idx} className="bg-white/5 backdrop-blur-md border border-white/10 p-6 md:p-8 rounded-2xl md:rounded-3xl hover:bg-white/10 transition-colors group/item">
            <div className="h-12 w-12 rounded-xl bg-accent/20 flex items-center justify-center text-accent mb-6 group-hover/item:scale-110 transition-transform">
              <item.icon className="h-6 w-6" />
            </div>
            <p className="text-[10px] md:text-xs font-bold text-white/40 uppercase tracking-[0.3em] mb-2">{item.label}</p>
            <p className="text-base md:text-xl font-bold text-white">{item.value}</p>
          </div>
        ))}
      </div>

      {performance && (
        <div className="relative z-10 bg-accent/90 p-8 md:p-12 rounded-[2rem] md:rounded-[3rem] shadow-2xl shadow-accent/20">
          <div className="flex items-center gap-4 mb-6">
            <div className="h-12 w-12 rounded-full bg-white flex items-center justify-center text-accent">
              <Zap className="h-6 w-6" />
            </div>
            <h3 className="font-heading text-xl md:text-2xl font-bold text-white uppercase tracking-tight italic-prohibited">{t("common.performance_summary")}</h3>
          </div>
          <p className="text-white text-lg md:text-2xl font-medium leading-relaxed md:leading-[1.4]">
            "{performance}"
          </p>
        </div>
      )}
    </section>
  );
};
