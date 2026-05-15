import { motion } from "framer-motion";

interface AnxietyGaugeProps {
  score: number;
  confidence: number;
}

const getLevel = (score: number) => {
  if (score < 25) return { label: "LOW STRESS", color: "bg-green-500", text: "text-green-400" };
  if (score < 50) return { label: "MODERATE STRESS", color: "bg-yellow-500", text: "text-yellow-400" };
  if (score < 75) return { label: "HIGH STRESS", color: "bg-orange-500", text: "text-orange-400" };
  return { label: "SEVERE STRESS", color: "bg-red-500", text: "text-red-400" };
};

const AnxietyGauge = ({ score, confidence }: AnxietyGaugeProps) => {
  const level = getLevel(score);
  const circumference = 2 * Math.PI * 70;
  const strokeDashoffset = circumference - (score / 100) * circumference;

  return (
    <div className="neural-card p-8 shadow-2xl">
      <div className="flex items-center justify-between mb-8">
        <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-cyan-400/60">Neural Stress Factor</h3>
        <div className="flex items-center gap-2 bg-white/5 px-3 py-1 rounded-full border border-white/10">
           <div className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
           <span className="text-[8px] font-black uppercase tracking-widest text-white/40">Confidence {Math.round(confidence)}%</span>
        </div>
      </div>

      <div className="flex flex-col items-center">
        {/* Circular gauge */}
        <div className="relative w-48 h-48 mb-8">
          <svg className="w-full h-full -rotate-90" viewBox="0 0 160 160">
            <circle
              cx="80" cy="80" r="70"
              stroke="rgba(255,255,255,0.05)"
              strokeWidth="4"
              fill="none"
            />
            <motion.circle
              cx="80" cy="80" r="70"
              stroke="url(#gauge-gradient)"
              strokeWidth="8"
              fill="none"
              strokeLinecap="round"
              strokeDasharray={circumference}
              initial={{ strokeDashoffset: circumference }}
              animate={{ strokeDashoffset }}
              transition={{ duration: 1, ease: "easeOut" }}
            />
            <defs>
              <linearGradient id="gauge-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#22d3ee" />
                <stop offset="100%" stopColor="#9b5de5" />
              </linearGradient>
            </defs>
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-5xl font-black text-white tracking-tighter leading-none">{Math.round(score)}</span>
            <span className="text-[10px] font-black text-cyan-400/40 uppercase tracking-widest mt-2">% STRESS</span>
          </div>
        </div>

        {/* Level badge */}
        <div className={`px-6 py-2 rounded-2xl border ${level.color.replace('bg-', 'bg-').replace('500', '500/10')} ${level.text.replace('text-', 'border-').replace('400', '400/30')} flex items-center gap-3 shadow-xl transition-all duration-500`}>
          <div className={`w-2 h-2 rounded-full ${level.color} shadow-[0_0_10px_rgba(255,255,255,0.5)]`} />
          <span className={`text-[10px] font-black uppercase tracking-[0.2em] ${level.text}`}>
            {level.label}
          </span>
        </div>
      </div>
    </div>
  );
};

export default AnxietyGauge;
