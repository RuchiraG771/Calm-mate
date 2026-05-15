interface StressHeatmapProps {
  forehead: number;
  eyes: number;
  mouth: number;
  jaw: number;
}

const getColor = (val: number) => {
  if (val < 30) return { dot: "bg-green-500", bar: "bg-green-500" };
  if (val < 60) return { dot: "bg-yellow-500", bar: "bg-yellow-500" };
  return { dot: "bg-red-500", bar: "bg-red-500" };
};

const getTextColor = (val: number) => {
  if (val < 30) return "text-green-400";
  if (val < 60) return "text-yellow-400";
  return "text-red-400";
};

const StressHeatmap = ({ forehead, eyes, mouth, jaw }: StressHeatmapProps) => {
  const regions = [
    { label: "Forehead", value: forehead },
    { label: "Eyes", value: eyes },
    { label: "Mouth", value: mouth },
    { label: "Jaw", value: jaw },
  ];

  return (
    <div className="neural-card p-8 shadow-2xl">
      <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-cyan-400/60 mb-8">Bio-Thermal Heatmap</h3>

      <div className="flex gap-10">
        {/* Face diagram */}
        <div className="flex-shrink-0 w-32 h-40 relative flex flex-col items-center justify-center bg-white/[0.02] border border-white/5 rounded-3xl p-4 shadow-inner">
          {/* Forehead */}
          <div className={`w-20 h-8 rounded-full ${getColor(forehead).dot} opacity-50 blur-sm shadow-[0_0_20px_rgba(255,255,255,0.2)] mb-2`} />
          {/* Eyes */}
          <div className="flex gap-4 mb-4">
            <div className={`w-8 h-6 rounded-full ${getColor(eyes).dot} opacity-50 blur-sm shadow-[0_0_20px_rgba(255,255,255,0.2)]`} />
            <div className={`w-8 h-6 rounded-full ${getColor(eyes).dot} opacity-50 blur-sm shadow-[0_0_20px_rgba(255,255,255,0.2)]`} />
          </div>
          {/* Mouth/Jaw */}
          <div className={`w-14 h-8 rounded-full ${getColor(mouth).dot} opacity-50 blur-sm shadow-[0_0_20px_rgba(255,255,255,0.2)]`} />
        </div>

        {/* Bars */}
        <div className="flex-1 space-y-5">
          {regions.map((r) => (
            <div key={r.label} className="group">
              <div className="flex justify-between text-[10px] font-black uppercase tracking-widest mb-2 px-1">
                <span className="text-white/30 group-hover:text-white transition-colors">{r.label}</span>
                <span className={`${getTextColor(r.value)}`}>{Math.round(r.value)}%</span>
              </div>
              <div className="h-1.5 bg-white/5 rounded-full overflow-hidden border border-white/5 shadow-inner">
                <div
                  className={`h-full rounded-full transition-all duration-1000 ${getColor(r.value).bar}`}
                  style={{ width: `${r.value}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Legend */}
      <div className="flex items-center justify-center gap-8 mt-10 p-4 bg-white/[0.02] rounded-2xl border border-white/5">
        <div className="flex items-center gap-2">
          <div className="w-1.5 h-1.5 rounded-full bg-green-500 shadow-[0_0_5px_rgba(34,197,94,0.5)]" /> 
          <span className="text-[8px] font-black uppercase tracking-widest text-white/20">Nominal</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-1.5 h-1.5 rounded-full bg-yellow-500 shadow-[0_0_5px_rgba(234,179,8,0.5)]" />
          <span className="text-[8px] font-black uppercase tracking-widest text-white/20">Elevated</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-1.5 h-1.5 rounded-full bg-red-500 shadow-[0_0_5px_rgba(239,68,68,0.5)]" />
          <span className="text-[8px] font-black uppercase tracking-widest text-white/20">Critical</span>
        </div>
      </div>
    </div>

  );
};

export default StressHeatmap;
