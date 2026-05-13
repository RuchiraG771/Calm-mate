import { Eye, Activity } from "lucide-react";

interface BehavioralIndicatorsProps {
  blinkCount: number;
  headMovement: number;
}

const BehavioralIndicators = ({ blinkCount, headMovement }: BehavioralIndicatorsProps) => {
  return (
    <div className="glass-card rounded-xl p-5">
      <h3 className="text-base font-semibold text-foreground mb-4">Behavioral Indicators</h3>

      <div className="space-y-3">
        {/* Blink Count */}
        <div className="flex items-center gap-3 p-3 rounded-lg bg-primary/10 border border-primary/20">
          <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
            <Eye className="w-5 h-5 text-primary" />
          </div>
          <div className="flex-1">
            <p className="text-sm font-medium text-foreground">Blink Count</p>
            <p className="text-xs text-muted-foreground">Total blinks detected</p>
          </div>
          <div className="text-right">
            <span className="text-xl font-bold text-primary">{blinkCount}</span>
            <span className="text-xs text-muted-foreground ml-1">blinks</span>
          </div>
        </div>

        {/* Head Movement */}
        <div className="flex items-center gap-3 p-3 rounded-lg bg-red-500/10 border border-red-500/20">
          <div className="w-10 h-10 rounded-full bg-red-500/20 flex items-center justify-center">
            <Activity className="w-5 h-5 text-red-400" />
          </div>
          <div className="flex-1">
            <p className="text-sm font-medium text-foreground">Head Movement</p>
            <p className="text-xs text-muted-foreground">Total movement detected</p>
          </div>
          <div className="text-right">
            <span className="text-xl font-bold text-red-400">{Math.round(headMovement)}</span>
            <span className="text-xs text-muted-foreground ml-1">px</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BehavioralIndicators;
