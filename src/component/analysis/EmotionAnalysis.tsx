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
    <div className="glass-card rounded-xl p-5">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-base font-semibold text-foreground">Emotion Analysis</h3>
        <div className="flex items-center gap-2">
          <DominantIcon className="w-5 h-5 text-yellow-400" />
          <span className="text-sm font-medium text-foreground capitalize">{dominant}</span>
        </div>
      </div>

      <div className="space-y-3">
        {sorted.map(([emotion, value]) => {
          const Icon = EMOTION_ICONS[emotion] || Meh;
          const barColor = EMOTION_COLORS[emotion] || "bg-gray-500";
          return (
            <div key={emotion} className="flex items-center gap-3">
              <Icon className="w-4 h-4 text-muted-foreground flex-shrink-0" />
              <span className="text-xs text-muted-foreground w-16 capitalize">{emotion}</span>
              <div className="flex-1 h-1.5 bg-secondary rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-300 ${barColor}`}
                  style={{ width: `${value}%` }}
                />
              </div>
              <span className="text-xs text-muted-foreground w-8 text-right">{value}%</span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default EmotionAnalysis;
