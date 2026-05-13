import { motion } from "framer-motion";

interface AnxietyGaugeProps {
  score: number;
  confidence: number;
}

const getLevel = (score: number) => {
  if (score < 25) return { label: "LOW ANXIETY", color: "bg-green-500", text: "text-green-400" };
  if (score < 50) return { label: "MODERATE ANXIETY", color: "bg-yellow-500", text: "text-yellow-400" };
  if (score < 75) return { label: "HIGH ANXIETY", color: "bg-orange-500", text: "text-orange-400" };
  return { label: "SEVERE ANXIETY", color: "bg-red-500", text: "text-red-400" };
};

const AnxietyGauge = ({ score, confidence }: AnxietyGaugeProps) => {
  const level = getLevel(score);
  const circumference = 2 * Math.PI * 70;
  const strokeDashoffset = circumference - (score / 100) * circumference;

  return (
    <div className="glass-card rounded-xl p-5">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-base font-semibold text-foreground">Anxiety Level</h3>
        <span className="text-sm text-primary">Confidence {Math.round(confidence)}%</span>
      </div>

      <div className="flex flex-col items-center">
        {/* Indicator dot */}
        <div className={`w-3 h-3 rounded-full ${level.color} mb-2`} />

        {/* Circular gauge */}
        <div className="relative w-40 h-40">
          <svg className="w-full h-full -rotate-90" viewBox="0 0 160 160">
            <circle
              cx="80" cy="80" r="70"
              stroke="hsl(var(--secondary))"
              strokeWidth="8"
              fill="none"
            />
            <motion.circle
              cx="80" cy="80" r="70"
              stroke="hsl(var(--primary))"
              strokeWidth="8"
              fill="none"
              strokeLinecap="round"
              strokeDasharray={circumference}
              initial={{ strokeDashoffset: circumference }}
              animate={{ strokeDashoffset }}
              transition={{ duration: 0.5 }}
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className={`text-4xl font-bold ${level.text}`}>{Math.round(score)}</span>
            <span className="text-xs text-muted-foreground">/ 100</span>
          </div>
        </div>

        {/* Level badge */}
        <div className={`mt-3 px-4 py-1.5 rounded-full ${level.color} text-black text-sm font-bold`}>
          {level.label}
        </div>
      </div>
    </div>
  );
};

export default AnxietyGauge;
