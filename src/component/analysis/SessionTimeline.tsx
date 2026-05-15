import { LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Tooltip } from "recharts";

interface TimelineEntry {
  time: string;
  stress: number;
  fear: number;
}

interface SessionTimelineProps {
  data: TimelineEntry[];
  peak: number;
  average: number;
  current: number;
}

const SessionTimeline = ({ data, peak, average, current }: SessionTimelineProps) => {
  return (
    <div className="neural-card p-8 shadow-2xl">
      <div className="flex items-center justify-between mb-8">
        <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-cyan-400/60">Neural Pulse Timeline</h3>
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
            <span className="text-[8px] font-black uppercase tracking-widest text-white/40">Stress Level</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-purple-500" />
            <span className="text-[8px] font-black uppercase tracking-widest text-white/40">Neural Fear</span>
          </div>
        </div>
      </div>

      <div className="h-64 mb-8">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="10 10" stroke="rgba(255,255,255,0.05)" vertical={false} />
            <XAxis
              dataKey="time"
              tick={{ fontSize: 8, fill: "rgba(255,255,255,0.2)", fontWeight: "bold" }}
              stroke="transparent"
            />
            <YAxis
              domain={[0, 100]}
              tick={{ fontSize: 8, fill: "rgba(255,255,255,0.2)", fontWeight: "bold" }}
              stroke="transparent"
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "rgba(10,10,31,0.9)",
                border: "1px solid rgba(255,255,255,0.1)",
                borderRadius: "16px",
                fontSize: "10px",
                fontWeight: "bold",
                color: "#fff",
                textTransform: "uppercase",
                letterSpacing: "0.1em"
              }}
              itemStyle={{ color: "#22d3ee" }}
            />
            <Line 
              type="monotone" 
              dataKey="stress" 
              stroke="#22d3ee" 
              strokeWidth={3} 
              dot={false}
              animationDuration={1000}
            />
            <Line 
              type="monotone" 
              dataKey="fear" 
              stroke="#a855f7" 
              strokeWidth={3} 
              dot={false} 
              strokeDasharray="5 5"
              animationDuration={1000}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className="grid grid-cols-3 gap-8">
        <div className="bg-white/[0.02] p-6 rounded-3xl border border-white/5">
          <p className="text-[8px] font-black text-white/20 uppercase tracking-widest mb-1">Peak Amplitude</p>
          <p className="text-2xl font-black text-red-500 tracking-tighter">{Math.round(peak)}%</p>
        </div>
        <div className="bg-white/[0.02] p-6 rounded-3xl border border-white/5">
          <p className="text-[8px] font-black text-white/20 uppercase tracking-widest mb-1">Mean Frequency</p>
          <p className="text-2xl font-black text-purple-400 tracking-tighter">{Math.round(average)}%</p>
        </div>
        <div className="bg-white/[0.02] p-6 rounded-3xl border border-white/5">
          <p className="text-[8px] font-black text-white/20 uppercase tracking-widest mb-1">Live Sync</p>
          <p className="text-2xl font-black text-cyan-400 tracking-tighter">{Math.round(current)}%</p>
        </div>
      </div>
    </div>

  );
};

export default SessionTimeline;
