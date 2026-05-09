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
    <div className="glass-card rounded-xl p-5">
      <h3 className="text-base font-semibold text-foreground mb-4">Stress Heatmap</h3>

      <div className="flex gap-4">
        {/* Face diagram */}
        <div className="flex-shrink-0 w-24 h-32 relative flex flex-col items-center justify-center">
          {/* Forehead */}
          <div className={`w-16 h-6 rounded-full ${getColor(forehead).dot} opacity-70`} />
          {/* Eyes */}
          <div className="flex gap-2 my-1">
            <div className={`w-6 h-4 rounded-full ${getColor(eyes).dot} opacity-70`} />
            <div className={`w-6 h-4 rounded-full ${getColor(eyes).dot} opacity-70`} />
          </div>
          {/* Mouth */}
          <div className={`w-10 h-5 rounded-full ${getColor(mouth).dot} opacity-70 mt-1`} />
        </div>

        {/* Bars */}
        <div className="flex-1 space-y-3">
          {regions.map((r) => (
            <div key={r.label}>
              <div className="flex justify-between text-xs mb-1">
                <span className="text-muted-foreground">{r.label}</span>
                <span className={getTextColor(r.value)}>{Math.round(r.value)}%</span>
              </div>
              <div className="h-1.5 bg-secondary rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-300 ${getColor(r.value).bar}`}
                  style={{ width: `${r.value}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Legend */}
      <div className="flex items-center justify-center gap-4 mt-4 text-xs text-muted-foreground">
        <div className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-green-500" /> Low</div>
        <div className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-yellow-500" /> Medium</div>
        <div className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-red-500" /> High</div>
      </div>
    </div>
  );
};

export default StressHeatmap;
