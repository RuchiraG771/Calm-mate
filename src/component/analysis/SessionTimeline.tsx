import { LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Tooltip } from "recharts";

interface TimelineEntry {
  time: string;
  anxiety: number;
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
    <div className="glass-card rounded-xl p-5">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-base font-semibold text-foreground">Session Timeline</h3>
        <div className="flex items-center gap-4 text-xs text-muted-foreground">
          <div className="flex items-center gap-1">
            <div className="w-2 h-2 rounded-full bg-primary" /> Anxiety
          </div>
          <div className="flex items-center gap-1">
            <div className="w-2 h-2 rounded-full bg-yellow-500" /> Fear
          </div>
        </div>
      </div>

      <div className="h-48">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--secondary))" />
            <XAxis
              dataKey="time"
              tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }}
              stroke="hsl(var(--secondary))"
            />
            <YAxis
              domain={[0, 100]}
              tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }}
              stroke="hsl(var(--secondary))"
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "hsl(var(--card))",
                border: "1px solid hsl(var(--border))",
                borderRadius: "8px",
                color: "hsl(var(--foreground))",
              }}
            />
            <Line type="monotone" dataKey="anxiety" stroke="hsl(168, 76%, 42%)" strokeWidth={2} dot={false} />
            <Line type="monotone" dataKey="fear" stroke="#EAB308" strokeWidth={2} dot={false} />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className="grid grid-cols-3 gap-4 mt-4 text-center">
        <div>
          <p className="text-xs text-muted-foreground">Peak</p>
          <p className="text-lg font-bold text-red-400">{Math.round(peak)}%</p>
        </div>
        <div>
          <p className="text-xs text-muted-foreground">Average</p>
          <p className="text-lg font-bold text-yellow-400">{Math.round(average)}%</p>
        </div>
        <div>
          <p className="text-xs text-muted-foreground">Current</p>
          <p className="text-lg font-bold text-primary">{Math.round(current)}%</p>
        </div>
      </div>
    </div>
  );
};

export default SessionTimeline;
