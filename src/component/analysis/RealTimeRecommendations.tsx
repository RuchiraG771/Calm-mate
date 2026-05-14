import { ArrowRight, Activity, Heart, Wind, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

interface RealTimeRecommendationsProps {
  stressScore: number;
}

const RealTimeRecommendations = ({ stressScore }: RealTimeRecommendationsProps) => {
  let suggestion = {
    title: "",
    description: "",
    icon: <Sparkles className="w-5 h-5" />,
    color: "",
  };

  if (stressScore > 75) {
    suggestion = {
      title: "Severe Stress Detected",
      description: "Take a moment. Deep breathing and grounding exercises can help you regain control right now.",
      icon: <Activity className="w-5 h-5 text-red-500" />,
      color: "bg-red-500/10 border-red-500/20 text-red-400",
    };
  } else if (stressScore > 50) {
    suggestion = {
      title: "High Stress Levels",
      description: "It looks like you're experiencing high stress. A short break or 4-7-8 breathing might be beneficial.",
      icon: <Heart className="w-5 h-5 text-orange-500" />,
      color: "bg-orange-500/10 border-orange-500/20 text-orange-400",
    };
  } else if (stressScore > 25) {
    suggestion = {
      title: "Moderate Stress",
      description: "You're doing okay, but some light stretching or mindfulness could help you feel even better.",
      icon: <Wind className="w-5 h-5 text-yellow-500" />,
      color: "bg-yellow-500/10 border-yellow-500/20 text-yellow-400",
    };
  } else {
    suggestion = {
      title: "Low Stress",
      description: "You're in a great state of mind! Keep up the positive energy and maintain your balance.",
      icon: <Sparkles className="w-5 h-5 text-green-500" />,
      color: "bg-green-500/10 border-green-500/20 text-green-400",
    };
  }

  return (
    <div className="glass-card rounded-xl p-5 mt-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-base font-semibold text-foreground">Actionable Insights</h3>
      </div>
      
      <div className={`rounded-xl p-4 border ${suggestion.color}`}>
        <div className="flex items-start gap-3">
          <div className="mt-0.5">
            {suggestion.icon}
          </div>
          <div>
            <h4 className="font-semibold text-sm mb-1">{suggestion.title}</h4>
            <p className="text-sm text-muted-foreground mb-4">{suggestion.description}</p>
            
            <Button asChild variant="outline" className="w-full sm:w-auto h-9 text-xs">
              <Link to="/wellness">
                Start Activity <ArrowRight className="w-3 h-3 ml-2" />
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RealTimeRecommendations;
