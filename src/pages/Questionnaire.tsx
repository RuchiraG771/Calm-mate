import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Brain, CheckCircle, ArrowRight, ArrowLeft, Activity, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import Navbar from "../component/Navbar";
import { Link } from "react-router-dom";
import { getAnalysisDetailsFromScore } from "@/lib/utils";
import RealTimeRecommendations from "@/components/analysis/RealTimeRecommendations";

const questions = [
  {
    id: 1,
    text: "When you wake up, what is your first feeling?",
    options: [
      { text: "Excited", score: 1 },
      { text: "Neutral", score: 2 },
      { text: "Tired", score: 3 },
      { text: "Heavy / unwilling", score: 4 }
    ]
  },
  {
    id: 2,
    text: "How do you react when plans suddenly change?",
    options: [
      { text: "I adapt easily", score: 1 },
      { text: "Slightly uncomfortable", score: 2 },
      { text: "Irritated", score: 3 },
      { text: "Overwhelmed", score: 4 }
    ]
  },
  {
    id: 3,
    text: "How often do you check your phone without reason?",
    options: [
      { text: "Rarely", score: 1 },
      { text: "Sometimes", score: 2 },
      { text: "Frequently", score: 3 },
      { text: "Constantly", score: 4 }
    ]
  },
  {
    id: 4,
    text: "How does your body feel right now?",
    options: [
      { text: "Relaxed", score: 1 },
      { text: "Slightly tense", score: 2 },
      { text: "Tight / stiff", score: 3 },
      { text: "Heavy / restless", score: 4 }
    ]
  },
  {
    id: 5,
    text: "What best describes your breathing right now?",
    options: [
      { text: "Slow and deep", score: 1 },
      { text: "Normal", score: 2 },
      { text: "Slightly fast", score: 3 },
      { text: "Fast / shallow", score: 4 }
    ]
  },
  {
    id: 6,
    text: "How do you feel about your current responsibilities?",
    options: [
      { text: "Manageable", score: 1 },
      { text: "Slightly heavy", score: 2 },
      { text: "Overwhelming", score: 3 },
      { text: "Avoiding them", score: 4 }
    ]
  },
  {
    id: 7,
    text: "What is your energy level right now?",
    options: [
      { text: "High", score: 1 },
      { text: "Moderate", score: 2 },
      { text: "Low", score: 3 },
      { text: "Drained", score: 4 }
    ]
  },
  {
    id: 8,
    text: "How often are you overthinking today?",
    options: [
      { text: "Not at all", score: 1 },
      { text: "Sometimes", score: 2 },
      { text: "Often", score: 3 },
      { text: "Constantly", score: 4 }
    ]
  },
  {
    id: 9,
    text: "What happens when you try to focus?",
    options: [
      { text: "Fully focused", score: 1 },
      { text: "Slight distraction", score: 2 },
      { text: "Frequent distraction", score: 3 },
      { text: "Cannot focus", score: 4 }
    ]
  },
  {
    id: 10,
    text: "How do you feel in silence?",
    options: [
      { text: "Peaceful", score: 1 },
      { text: "Neutral", score: 2 },
      { text: "Slightly uneasy", score: 3 },
      { text: "Uncomfortable", score: 4 }
    ]
  }
];

const Questionnaire = () => {
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [currentIdx, setCurrentIdx] = useState(0);
  const [result, setResult] = useState<any>(null);

  const handleOptionClick = (questionId: number, score: number) => {
    setAnswers((prev) => ({ ...prev, [questionId]: score }));
  };

  const handleNext = () => {
    if (currentIdx < questions.length - 1) {
      setCurrentIdx(currentIdx + 1);
    } else {
      calculateResult();
    }
  };

  const handlePrev = () => {
    if (currentIdx > 0) {
      setCurrentIdx(currentIdx - 1);
    }
  };

  const calculateResult = () => {
    const totalScore = Object.values(answers).reduce((a, b) => a + b, 0);
    const avgScore = totalScore / questions.length;

    const reasons = [];
    if (answers[8] > 2) reasons.push("overthinking");
    if (answers[9] > 2) reasons.push("poor focus");
    if (answers[4] > 2) reasons.push("physical tension");
    if (answers[3] > 2) reasons.push("distractedness");
    if (answers[6] > 2) reasons.push("feeling overwhelmed");

    const scorePercentage = Math.round(((avgScore - 1) / 3) * 100);
    const details = getAnalysisDetailsFromScore(scorePercentage);

    setResult({
      score: scorePercentage,
      stressLevel: details.level.toUpperCase(),
      mood: details.mood,
      reason: reasons.length > 0 ? reasons.join(" + ") : "general stress factors",
      suggestions: details.suggestions,
      isHighStress: details.level === "High"
    });
  };

  const resetQuiz = () => {
    setAnswers({});
    setCurrentIdx(0);
    setResult(null);
  };

  const currentQ = questions[currentIdx];
  const progress = ((currentIdx + 1) / questions.length) * 100;

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />
      <div className="flex-1 pt-24 pb-12 px-6 flex items-center justify-center">
        <div className="w-full max-w-2xl mx-auto">
          <div className="text-center mb-10">
            <h1 className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-500 mb-3 flex items-center justify-center gap-3">
              <Brain className="w-10 h-10 text-cyan-400" />
              Questionnaire
            </h1>
            <p className="text-muted-foreground">Complete this quick assessment for personalized wellness recommendations.</p>
          </div>

          {!result ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="glass-card p-8 rounded-2xl border border-border flex flex-col min-h-[400px]"
            >
              {/* Progress Bar */}
              <div className="mb-8">
                <div className="flex justify-between text-sm font-medium text-muted-foreground mb-2">
                  <span>Question {currentIdx + 1} of {questions.length}</span>
                  <span>{Math.round(progress)}%</span>
                </div>
                <div className="w-full bg-secondary/50 rounded-full h-2">
                  <div
                    className="bg-primary h-2 rounded-full transition-all duration-300"
                    style={{ width: `${progress}%` }}
                  />
                </div>
              </div>

              {/* Question */}
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentIdx}
                  initial={{ x: 20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  exit={{ x: -20, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="flex-1"
                >
                  <h2 className="text-2xl font-semibold text-foreground mb-6">
                    {currentQ.text}
                  </h2>
                  <div className="grid grid-cols-1 gap-3">
                    {currentQ.options.map((opt) => (
                      <button
                        key={opt.text}
                        onClick={() => handleOptionClick(currentQ.id, opt.score)}
                        className={`p-4 rounded-xl border text-left transition-all flex items-center justify-between group ${answers[currentQ.id] === opt.score
                            ? "bg-primary/20 border-primary text-primary"
                            : "bg-card border-border hover:border-primary/50 text-muted-foreground hover:text-foreground"
                          }`}
                      >
                        <span className="font-medium">{opt.text}</span>
                        {answers[currentQ.id] === opt.score && (
                          <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }}>
                            <CheckCircle className="w-5 h-5 text-primary" />
                          </motion.div>
                        )}
                      </button>
                    ))}
                  </div>
                </motion.div>
              </AnimatePresence>

              {/* Navigation */}
              <div className="flex items-center justify-between mt-8 pt-6 border-t border-border">
                <Button
                  variant="ghost"
                  onClick={handlePrev}
                  disabled={currentIdx === 0}
                  className="text-muted-foreground hover:text-foreground"
                >
                  <ArrowLeft className="w-4 h-4 mr-2" /> Back
                </Button>

                <Button
                  onClick={handleNext}
                  disabled={!answers[currentQ.id]}
                  className="glow-primary min-w-[140px]"
                >
                  {currentIdx === questions.length - 1 ? "See Results" : "Next Question"}
                  {currentIdx === questions.length - 1 ? <Activity className="w-4 h-4 ml-2" /> : <ArrowRight className="w-4 h-4 ml-2" />}
                </Button>
              </div>
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="glass-card p-8 rounded-2xl border border-primary/20 space-y-6"
            >
              <div className="flex items-center gap-3 mb-6">
                <Brain className="w-8 h-8 text-primary" />
                <h2 className="text-2xl font-bold">Analysis Complete</h2>
              </div>

              <div className="grid md:grid-cols-3 gap-6">
                <div className="col-span-1 bg-card rounded-xl p-6 border border-border flex flex-col items-center justify-center text-center">
                  <Activity className="w-10 h-10 text-cyan-400 mb-3" />
                  <div className="text-sm text-muted-foreground mb-1">Stress Level</div>
                  <div className={`text-3xl font-bold ${result.stressLevel === 'HIGH' ? 'text-destructive' : 'text-cyan-400'}`}>
                    {result.stressLevel}
                  </div>
                  <div className="text-xs text-muted-foreground mt-2">Score: {result.score} / 100</div>
                </div>

                <div className="col-span-2 space-y-4">
                  <div className="bg-card rounded-xl p-5 border border-border flex justify-between items-center">
                    <div>
                      <div className="text-sm text-muted-foreground mb-1 flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-yellow-400"></span> Current Mood
                      </div>
                      <div className="font-medium text-foreground text-lg">
                        {result.mood}
                      </div>
                    </div>
                    <div>
                      <div className="text-sm text-muted-foreground mb-1 flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-primary"></span> Reason
                      </div>
                      <div className="font-medium text-foreground capitalize">
                        {result.reason}
                      </div>
                    </div>
                  </div>

                  <RealTimeRecommendations stressScore={result.score} />
                </div>
              </div>

              {result.isHighStress && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-6 p-5 rounded-xl bg-destructive/10 border border-destructive/20 flex items-start gap-4"
                >
                  <div className="bg-destructive/20 p-2 rounded-full mt-1 flex-shrink-0">
                    <Zap className="w-5 h-5 text-destructive" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-destructive flex items-center gap-2">
                      ⚡ Instant AI Insight
                    </h4>
                    <p className="text-destructive/90 mt-1">
                      Your mind is showing signs of cognitive overload. It is highly recommended to take a break immediately.
                    </p>
                  </div>
                </motion.div>
              )}

              <div className="pt-6 flex flex-wrap gap-4 justify-center border-t border-border mt-8">
                <Button onClick={resetQuiz} variant="outline">
                  Take Again
                </Button>
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Questionnaire;
