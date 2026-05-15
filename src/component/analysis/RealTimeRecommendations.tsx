import { ArrowRight, Activity, Heart, Wind, Sparkles, CheckCircle, Play } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { getAnalysisDetailsFromScore, getTabFromSuggestion, setActivitySequence } from "@/lib/utils";
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
    <div className={`glass-card rounded-xl p-5 border transition-all ${color}`}>
      <div className="flex items-start gap-3">
        <div className="mt-0.5">
          {icon}
        </div>
        <div className="w-full">
          <div className="flex items-center gap-2 mb-1">
            <h4 className="font-semibold text-base">{details.mood.split(' ')[0]} Mood</h4>
            <span className="text-xs px-2 py-0.5 rounded-full bg-background/50 border border-border">
              {details.level} Stress
            </span>
          </div>
          <p className="text-sm text-muted-foreground mb-4">{description}</p>
          
          <div className="flex flex-col gap-2 mb-4">
            {details.suggestions.map((s: string, i: number) => {
              const isCompleted = completedSteps.includes(i);
              const isCurrent = i === completedSteps.length;
              
              return (
                <div 
                  key={i} 
                  className={`flex items-center justify-between text-xs font-medium px-3 py-2 rounded-md border transition-all duration-300 ${
                    isCompleted ? 'bg-green-500/10 border-green-500/30 text-green-500 opacity-60' : 
                    isCurrent ? 'bg-primary/20 border-primary shadow-sm text-foreground scale-[1.02]' : 
                    'bg-background/30 border-border/50 text-muted-foreground'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    {isCompleted ? (
                      <CheckCircle className="w-4 h-4" />
                    ) : (
                      <div className="w-4 h-4 rounded-full border border-current opacity-50 flex-shrink-0" />
                    )}
                    <span className={isCompleted ? "line-through opacity-80" : ""}>{s}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    {isCurrent && (
                      <>
                        <Button 
                          size="sm" 
                          variant="ghost" 
                          className="h-6 text-[10px] px-2 bg-primary/20 hover:bg-primary/30 text-primary border border-primary/30" 
                          onClick={() => handleStartActivity(i)}
                        >
                          <Play className="w-3 h-3 mr-1" /> Start
                        </Button>
                        <Button 
                          size="sm" 
                          variant="ghost" 
                          className="h-6 text-[10px] px-2 bg-background/50 hover:bg-background" 
                          onClick={() => {
                            setCompletedSteps([...completedSteps, i]);
                            import("@/lib/utils").then(u => {
                              u.addUserPoints(10);
                              window.dispatchEvent(new Event("pointsUpdated"));
                            });
                          }}
                        >
                          Done
                        </Button>
                      </>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
            <div 
              className="p-3 rounded-lg bg-background/40 border border-border/50 cursor-pointer hover:bg-background/60 transition-colors"
              onClick={handleDietClick}
            >
              <div className="text-[10px] uppercase tracking-wider text-muted-foreground mb-1 font-bold flex items-center justify-between">
                <span>🥗 Recommended Diet</span>
                <ArrowRight className="w-3 h-3" />
              </div>
              <p className="text-xs text-foreground leading-relaxed">{(details as any).dietPlan}</p>
            </div>
            <div 
              className="p-3 rounded-lg bg-background/40 border border-border/50 cursor-pointer hover:bg-background/60 transition-colors"
              onClick={() => {
                setActivitySequence(details.suggestions, 0, stressScore);
                navigate(`/wellness?tab=yoga`);
              }}
            >
              <div className="text-[10px] uppercase tracking-wider text-muted-foreground mb-1 font-bold flex items-center justify-between">
                <span>🧘 Yoga Poses</span>
                <ArrowRight className="w-3 h-3" />
              </div>
              <p className="text-xs text-foreground leading-relaxed">{(details as any).yogaTypes}</p>
            </div>
          </div>

          {isAllDone ? (
            <div className="text-center py-2.5 bg-green-500/20 text-green-500 rounded-md font-semibold text-sm border border-green-500/30">
              🎉 All suggested activities completed!
            </div>
          ) : (
            <Button onClick={startNextActivity} variant="outline" className="w-full sm:w-auto h-9 text-xs glow-primary border-primary/50">
              Start Next Recommended Activity <ArrowRight className="w-3 h-3 ml-2" />
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default RealTimeRecommendations;

