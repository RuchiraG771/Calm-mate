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
    <div className="min-h-screen bg-[#0a0a1f] text-white relative overflow-hidden flex flex-col">
      <Navbar />
      
      {/* Background Particles */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        {[...Array(15)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full bg-purple-500/10 blur-3xl"
            style={{
              width: Math.random() * 400 + 100,
              height: Math.random() * 400 + 100,
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
            }}
            animate={{
              opacity: [0.1, 0.2, 0.1],
              scale: [1, 1.1, 1],
            }}
            transition={{
              duration: Math.random() * 10 + 10,
              repeat: Infinity,
              ease: "linear"
            }}
          />
        ))}
      </div>

      <div className="flex-1 pt-24 pb-12 px-6 flex items-center justify-center relative z-10">
        <div className="w-full max-w-3xl mx-auto">
          {result ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="neural-card p-10 shadow-2xl space-y-10"
            >
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 border-b border-white/5 pb-8">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-2xl bg-cyan-500/20 flex items-center justify-center text-cyan-400 border border-cyan-500/30">
                    <Brain className="w-8 h-8" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-black text-white uppercase tracking-widest">Neural Report</h2>
                    <p className="text-[10px] font-black text-cyan-400/60 uppercase tracking-[0.4em]">Assessment Complete</p>
                  </div>
                </div>
                <div className="px-6 py-2 bg-white/5 rounded-full border border-white/10 text-[10px] font-black text-white/40 uppercase tracking-widest">
                  Ref ID: CALM-{Math.floor(Math.random() * 9000 + 1000)}
                </div>
              </div>

              <div className="grid md:grid-cols-3 gap-8">
                <div className="col-span-1 p-8 rounded-[2rem] bg-white/5 border border-white/10 flex flex-col items-center justify-center text-center shadow-xl relative overflow-hidden group">
                  <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                  <Activity className="w-12 h-12 text-cyan-400 mb-6 group-hover:scale-110 transition-transform" />
                  <div className="text-[10px] text-cyan-400/60 font-black uppercase tracking-[0.3em] mb-2">Stress Level</div>
                  <div className={`text-4xl font-black tracking-tighter ${result.stressLevel === 'HIGH' ? 'text-red-500' : 'text-white'}`}>
                    {result.stressLevel}
                  </div>
                  <div className="text-[10px] font-black text-white/20 mt-4 uppercase tracking-widest">Neural Score: {result.score}</div>
                </div>

                <div className="col-span-2 space-y-6">
                  <div className="p-8 rounded-[2rem] bg-white/5 border border-white/10 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 shadow-xl">
                    <div>
                      <div className="text-[10px] text-yellow-400/60 font-black uppercase tracking-[0.3em] mb-2 flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-yellow-400"></span> Detected Mood
                      </div>
                      <div className="text-2xl font-black text-white tracking-tight">
                        {result.mood}
                      </div>
                    </div>
                    <div className="h-10 w-[1px] bg-white/10 hidden sm:block" />
                    <div className="sm:text-right">
                      <div className="text-[10px] text-purple-400/60 font-black uppercase tracking-[0.3em] mb-2 flex items-center sm:justify-end gap-2">
                        <span className="w-2 h-2 rounded-full bg-purple-500"></span> Principal Bias
                      </div>
                      <div className="text-xl font-black text-white tracking-tight capitalize">
                        {result.reason}
                      </div>
                    </div>
                  </div>

                  <div className="neural-card p-6 border-white/5 bg-white/[0.02]">
                    <RealTimeRecommendations stressScore={result.score} />
                  </div>
                </div>
              </div>

              {result.isHighStress && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-8 rounded-[2rem] bg-red-500/10 border border-red-500/20 flex items-start gap-6"
                >
                  <div className="bg-red-500/20 p-4 rounded-2xl flex-shrink-0 border border-red-500/30">
                    <Zap className="w-6 h-6 text-red-500" />
                  </div>
                  <div>
                    <h4 className="font-black text-red-500 uppercase tracking-widest text-sm flex items-center gap-2">
                      ⚡ AI Critical Insight
                    </h4>
                    <p className="text-red-400/80 mt-2 font-bold leading-relaxed">
                      Your mind is showing signs of cognitive overload. It is highly recommended to initiate a recovery protocol immediately.
                    </p>
                  </div>
                </motion.div>
              )}

              <div className="pt-10 flex flex-wrap gap-4 justify-center border-t border-white/5">
                <Button 
                  onClick={resetQuiz} 
                  variant="outline" 
                  className="px-10 h-14 border-white/10 hover:bg-white/5 text-white/40 hover:text-white font-black uppercase tracking-widest rounded-2xl transition-all"
                >
                  <RefreshCw className="w-4 h-4 mr-2" /> Recalibrate
                </Button>
                <Button 
                  asChild
                  className="px-10 h-14 bg-gradient-to-r from-cyan-500 to-cyan-600 hover:shadow-[0_0_30px_rgba(6,182,212,0.4)] text-white font-black uppercase tracking-widest rounded-2xl transition-all"
                >
                  <Link to="/wellness">
                    Open Wellness Hub <ArrowRight className="w-4 h-4 ml-2" />
                  </Link>
                </Button>
              </div>
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="neural-card p-10 shadow-2xl flex flex-col min-h-[450px]"
            >
              <div className="flex justify-between items-center mb-10">
                <div className="text-[10px] font-black text-cyan-400 uppercase tracking-[0.4em]">Question {currentIdx + 1} / {questions.length}</div>
                <div className="w-32 h-1 bg-white/5 rounded-full overflow-hidden">
                  <motion.div 
                    className="h-full bg-cyan-500"
                    initial={{ width: 0 }}
                    animate={{ width: `${progress}%` }}
                  />
                </div>
              </div>

              <AnimatePresence mode="wait">
                <motion.div
                  key={currentQ.id}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="flex-1 flex flex-col"
                >
                  <h3 className="text-2xl font-black text-white mb-10 leading-tight uppercase tracking-tight">
                    {currentQ.text}
                  </h3>

                  <div className="grid gap-4">
                    {currentQ.options.map((opt) => (
                      <button
                        key={opt.text}
                        onClick={() => handleOptionClick(currentQ.id, opt.score)}
                        className={`p-6 rounded-2xl text-left transition-all border font-bold uppercase tracking-widest text-xs flex justify-between items-center group ${
                          answers[currentQ.id] === opt.score
                            ? "bg-cyan-500 border-cyan-400 text-white shadow-[0_0_20px_rgba(6,182,212,0.3)]"
                            : "bg-white/5 border-white/10 text-white/40 hover:bg-white/10 hover:border-white/20 hover:text-white"
                        }`}
                      >
                        {opt.text}
                        {answers[currentQ.id] === opt.score && <CheckCircle className="w-4 h-4" />}
                      </button>
                    ))}
                  </div>
                </motion.div>
              </AnimatePresence>

              <div className="flex justify-between mt-10 pt-8 border-t border-white/5">
                <Button
                  variant="ghost"
                  onClick={handlePrev}
                  disabled={currentIdx === 0}
                  className="text-white/40 hover:text-white font-black uppercase tracking-widest text-[10px]"
                >
                  <ArrowLeft className="w-4 h-4 mr-2" /> Back
                </Button>
                <Button
                  onClick={handleNext}
                  disabled={!answers[currentQ.id]}
                  className="bg-cyan-500 hover:bg-cyan-400 text-white font-black uppercase tracking-widest text-[10px] px-10 rounded-xl h-12 shadow-lg"
                >
                  {currentIdx === questions.length - 1 ? "Extract Report" : "Continue"} <ArrowRight className="w-4 h-4 ml-2" />
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
