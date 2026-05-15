import { ArrowRight, Activity, Wind, Sparkles, CheckCircle, Play } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { getAnalysisDetailsFromScore, getTabFromSuggestion, setActivitySequence, addUserPoints } from "@/lib/utils";
import { useState, useEffect } from "react";

interface RealTimeRecommendationsProps {
  stressScore: number;
}

const RealTimeRecommendations = ({ stressScore }: RealTimeRecommendationsProps) => {
  const details = getAnalysisDetailsFromScore(stressScore);
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);
  const navigate = useNavigate();

  // Reset steps if the suggestions change (e.g. stress tier changes)
  useEffect(() => {
    setCompletedSteps([]);
  }, [details.level]);
  
  // Decide icon and color based on stress level to keep the UI nice
  let icon = <Sparkles className="w-5 h-5 text-green-500" />;
  let color = "bg-green-500/10 border-green-500/20 text-green-400";
  let description = "You're in a great state of mind! Keep up the positive energy and maintain your balance.";

  if (details.level === "High") {
    icon = <Activity className="w-5 h-5 text-red-500" />;
    color = "bg-red-500/10 border-red-500/20 text-red-400";
    description = "Deep breathing and grounding exercises can help you regain control right now.";
  } else if (details.level === "Medium") {
    icon = <Wind className="w-5 h-5 text-yellow-500" />;
    color = "bg-yellow-500/10 border-yellow-500/20 text-yellow-400";
    description = "You're doing okay, but some light stretching or mindfulness could help you feel even better.";
  }

  const isAllDone = completedSteps.length >= details.suggestions.length;
  
  const handleStartActivity = (index: number) => {
    const suggestion = details.suggestions[index];
    const tab = getTabFromSuggestion(suggestion);
    setActivitySequence(details.suggestions, index, stressScore);
    navigate(`/wellness?tab=${tab}`);
  };

  const handleDietClick = () => {
    setActivitySequence(details.suggestions, 0, stressScore);
    navigate(`/wellness?tab=diet`);
  };

  const startNextActivity = () => {
    const nextIndex = completedSteps.length;
    if (nextIndex < details.suggestions.length) {
      handleStartActivity(nextIndex);
    }
  };
  
  return (
    <div className={`neural-card p-8 border transition-all duration-700 shadow-2xl ${color.split(' ')[0]} ${color.split(' ')[1]}`}>
      <div className="flex items-start gap-6">
        <div className="mt-1 p-3 bg-white/5 rounded-2xl border border-white/10 shadow-inner">
          {icon}
        </div>
        <div className="w-full">
          <div className="flex flex-col sm:flex-row sm:items-center gap-4 mb-4">
            <h4 className="font-black text-xl uppercase tracking-tighter text-white">{details.mood.split(' ')[0]} State</h4>
            <div className="flex items-center gap-3">
              <div className={`px-4 py-1 rounded-full bg-white/5 border border-white/10 text-[10px] font-black uppercase tracking-widest ${color.split(' ')[2]}`}>
                {details.level} Amplitude
              </div>
            </div>
          </div>
          <p className="text-sm font-bold text-white/40 mb-8 uppercase tracking-wide leading-relaxed">{description}</p>
          
          <div className="flex flex-col gap-4 mb-10">
            {details.suggestions.map((s: string, i: number) => {
              const isCompleted = completedSteps.includes(i);
              const isCurrent = i === completedSteps.length;
              
              return (
                <div 
                  key={i} 
                  className={`flex items-center justify-between px-6 py-4 rounded-[2rem] border transition-all duration-500 ${
                    isCompleted ? 'bg-green-500/5 border-green-500/20 text-green-500/60' : 
                    isCurrent ? 'bg-cyan-500/10 border-cyan-500/40 shadow-[0_0_20px_rgba(6,182,212,0.1)] text-white scale-[1.02]' : 
                    'bg-white/[0.02] border-white/5 text-white/20'
                  }`}
                >
                  <div className="flex items-center gap-4">
                    {isCompleted ? (
                      <CheckCircle className="w-5 h-5 text-green-500" />
                    ) : (
                      <div className={`w-5 h-5 rounded-full border-2 ${isCurrent ? 'border-cyan-400 animate-pulse' : 'border-white/10'} flex-shrink-0`} />
                    )}
                    <span className={`text-xs font-black uppercase tracking-widest ${isCompleted ? "line-through" : ""}`}>{s}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    {isCurrent && (
                      <>
                        <Button 
                          size="sm" 
                          className="h-10 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-white font-black uppercase tracking-widest text-[10px] px-6 transition-all" 
                          onClick={() => handleStartActivity(i)}
                        >
                          <Play className="w-3 h-3 mr-2" /> Execute
                        </Button>
                        <Button 
                          size="sm" 
                          variant="ghost" 
                          className="h-10 rounded-xl bg-white/5 hover:bg-white/10 text-white/40 hover:text-white font-black uppercase tracking-widest text-[10px] px-6 border border-white/5" 
                          onClick={() => {
                            setCompletedSteps([...completedSteps, i]);
                            addUserPoints(10);
                            window.dispatchEvent(new Event("pointsUpdated"));
                          }}
                        >
                          Sync
                        </Button>
                      </>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8">
            <div 
              className="p-6 rounded-[2.5rem] bg-white/[0.02] border border-white/5 cursor-pointer hover:bg-white/[0.05] hover:border-cyan-400/20 transition-all group shadow-inner"
              onClick={handleDietClick}
            >
              <div className="text-[10px] font-black uppercase tracking-[0.3em] text-white/20 mb-4 flex items-center justify-between group-hover:text-cyan-400/60 transition-colors">
                <span>🥗 Nutritional Protocol</span>
                <ArrowRight className="w-4 h-4" />
              </div>
              <p className="text-xs font-black text-white/60 uppercase tracking-widest leading-relaxed group-hover:text-white transition-colors">{(details as any).dietPlan}</p>
            </div>
            <div 
              className="p-6 rounded-[2.5rem] bg-white/[0.02] border border-white/5 cursor-pointer hover:bg-white/[0.05] hover:border-purple-400/20 transition-all group shadow-inner"
              onClick={() => {
                setActivitySequence(details.suggestions, 0, stressScore);
                navigate(`/wellness?tab=yoga`);
              }}
            >
              <div className="text-[10px] font-black uppercase tracking-[0.3em] text-white/20 mb-4 flex items-center justify-between group-hover:text-purple-400/60 transition-colors">
                <span>🧘 Somatic Alignment</span>
                <ArrowRight className="w-4 h-4" />
              </div>
              <p className="text-xs font-black text-white/60 uppercase tracking-widest leading-relaxed group-hover:text-white transition-colors">{(details as any).yogaTypes}</p>
            </div>
          </div>

          {isAllDone ? (
            <div className="text-center py-6 bg-green-500/10 text-green-500 rounded-[2rem] font-black text-[10px] uppercase tracking-[0.4em] border border-green-500/20 shadow-[0_0_30px_rgba(34,197,94,0.1)]">
              🎉 Protocol sequence complete
            </div>
          ) : (
            <Button onClick={startNextActivity} className="w-full sm:w-auto h-14 px-10 rounded-2xl bg-gradient-to-r from-cyan-500 to-cyan-600 text-white font-black uppercase tracking-widest text-[11px] shadow-[0_0_30px_rgba(6,182,212,0.3)] hover:scale-[1.02] transition-all">
              Initiate Next Step <ArrowRight className="w-4 h-4 ml-3" />
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};


export default RealTimeRecommendations;

