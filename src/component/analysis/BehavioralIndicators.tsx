import { Eye, Activity } from "lucide-react";

interface BehavioralIndicatorsProps {
  blinkCount: number;
  headMovement: number;
}

const BehavioralIndicators = ({ blinkCount, headMovement }: BehavioralIndicatorsProps) => {
  return (
    <div className="neural-card p-8 shadow-2xl">
      <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-purple-400/60 mb-8">Bio-Signal Trackers</h3>

      <div className="space-y-4">
        {/* Blink Count */}
        <div className="flex items-center gap-6 p-6 rounded-[2rem] bg-white/[0.02] border border-white/5 group hover:border-cyan-400/20 transition-all">
          <div className="w-14 h-14 rounded-2xl bg-cyan-500/10 flex items-center justify-center border border-cyan-500/20 group-hover:scale-110 transition-transform">
            <Eye className="w-6 h-6 text-cyan-400" />
          </div>
          <div className="flex-1">
            <p className="text-[10px] font-black text-white/30 uppercase tracking-widest mb-1">Ocular Activity</p>
            <p className="text-sm font-black text-white uppercase tracking-tight">Total Blink Count</p>
          </div>
          <div className="text-right">
            <span className="text-3xl font-black text-cyan-400 tracking-tighter">{blinkCount}</span>
            <span className="text-[8px] font-black text-white/10 ml-2 uppercase tracking-widest">Detected</span>
          </div>
        </div>

        {/* Head Movement */}
        <div className="flex items-center gap-6 p-6 rounded-[2rem] bg-white/[0.02] border border-white/5 group hover:border-red-400/20 transition-all">
          <div className="w-14 h-14 rounded-2xl bg-red-500/10 flex items-center justify-center border border-red-500/20 group-hover:scale-110 transition-transform">
            <Activity className="w-6 h-6 text-red-500" />
          </div>
          <div className="flex-1">
            <p className="text-[10px] font-black text-white/30 uppercase tracking-widest mb-1">Kinetic Sync</p>
            <p className="text-sm font-black text-white uppercase tracking-tight">Head Movement</p>
          </div>
          <div className="text-right">
            <span className="text-3xl font-black text-red-500 tracking-tighter">{Math.round(headMovement)}</span>
            <span className="text-[8px] font-black text-white/10 ml-2 uppercase tracking-widest">PX Delta</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BehavioralIndicators;
