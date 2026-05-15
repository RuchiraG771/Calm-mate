import { Smile, Frown, Angry, Meh, AlertTriangle, Annoyed, Skull, Zap } from "lucide-react";

const EMOTION_ICONS: Record<string, any> = {
  happy: Smile,
  sad: Frown,
  angry: Angry,
  neutral: Meh,
  fearful: AlertTriangle,
  disgusted: Annoyed,
  surprised: Zap,
};

const EMOTION_COLORS: Record<string, string> = {
  happy: "bg-green-500",
  sad: "bg-blue-500",
  angry: "bg-red-500",
  neutral: "bg-gray-400",
  fearful: "bg-purple-500",
  disgusted: "bg-pink-500",
  surprised: "bg-yellow-500",
};

interface EmotionAnalysisProps {
  emotions: Record<string, number>;
  dominant: string;
}

const EmotionAnalysis = ({ emotions, dominant }: EmotionAnalysisProps) => {
  const DominantIcon = EMOTION_ICONS[dominant] || Meh;
  const sorted = Object.entries(emotions).sort(([, a], [, b]) => b - a);

  return (
    <div className="neural-card p-8 shadow-2xl">
      <div className="flex items-center justify-between mb-8">
        <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-cyan-400/60">Neural Emotion Mapping</h3>
        <div className="flex items-center gap-3 bg-white/5 px-4 py-2 rounded-2xl border border-white/10">
          <DominantIcon className="w-5 h-5 text-cyan-400" />
          <span className="text-[10px] font-black text-white uppercase tracking-widest">{dominant}</span>
        </div>
      </div>

      <div className="space-y-4">
        {sorted.map(([emotion, value]) => {
          const Icon = EMOTION_ICONS[emotion] || Meh;
          const barColor = EMOTION_COLORS[emotion] || "bg-white/10";
          return (
            <div key={emotion} className="group">
              <div className="flex items-center justify-between mb-2 px-1">
                <div className="flex items-center gap-3">
                  <Icon className="w-3.5 h-3.5 text-white/20 group-hover:text-cyan-400 transition-colors" />
                  <span className="text-[10px] font-black text-white/40 uppercase tracking-widest group-hover:text-white transition-colors">{emotion}</span>
                </div>
                <span className="text-[10px] font-black text-cyan-400/60 tracking-widest">{value}%</span>
              </div>
              <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden border border-white/5">
                <motion.div
                  className={`h-full rounded-full transition-all duration-500 ${barColor}`}
                  initial={{ width: 0 }}
                  animate={{ width: `${value}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>

  );
};

export default EmotionAnalysis;
