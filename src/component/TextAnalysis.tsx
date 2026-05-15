import { useState } from "react";
import Navbar from "./Navbar";
import RealTimeRecommendations from "./analysis/RealTimeRecommendations";
import { getAnalysisDetailsFromScore } from "@/lib/utils";
import { motion } from "framer-motion";
import { Brain, Sparkles, Send, RefreshCw, BarChart3, Activity } from "lucide-react";
import { Button } from "@/components/ui/button";

async function analyzeTextWithAI(text: string) {
  // Simulate AI delay
  await new Promise(r => setTimeout(r, 1500));
  const score = Math.floor(Math.random() * 101); // 0 to 100
  return {
    stress_score: score,
  };
}

function TextAnalysis() {
  const [text, setText] = useState("");
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [statusMsg, setStatusMsg] = useState("");

  const analyze = async () => {
    if (!text.trim()) return;
    setLoading(true);
    setStatusMsg("SYNCHRONIZING NEURAL PATTERNS...");
    try {
      const aiResult = await analyzeTextWithAI(text);
      setResult(aiResult);
    } catch {
      // Keyword-based fallback
      let score = 40;
      const lower = text.toLowerCase();
      if (lower.includes("stress") || lower.includes("tired") || lower.includes("overthinking")) score += 30;
      if (lower.includes("happy") || lower.includes("good") || lower.includes("relaxed")) score -= 20;
      if (lower.includes("anxious") || lower.includes("worried")) score += 25;
      score = Math.max(0, Math.min(100, score));
      setResult({ stress_score: score });
    }
    setStatusMsg(""); setLoading(false);
  };

  return (
    <div className="min-h-screen bg-[#0a0a1f] text-white relative overflow-hidden">
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
              scale: [1, 1.2, 1],
            }}
            transition={{
              duration: Math.random() * 10 + 10,
              repeat: Infinity,
              ease: "linear"
            }}
          />
        ))}
      </div>

      <div className="pt-24 pb-32 px-6 relative z-10">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 gap-6">
            <div>
              <motion.h1 
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="text-4xl md:text-5xl font-black futuristic-header mb-2"
              >
                ✍️ Neural Text-Log
              </motion.h1>
              <p className="text-cyan-400/60 font-medium tracking-wide uppercase text-xs">AI Pattern Recognition & Emotional Decoding</p>
            </div>
            
            <div className="flex items-center gap-3 bg-white/5 backdrop-blur-xl border border-white/10 p-3 rounded-2xl shadow-xl">
              <div className="w-10 h-10 bg-cyan-500/20 rounded-xl flex items-center justify-center text-xl">
                <Brain className="w-6 h-6 text-cyan-400" />
              </div>
              <div className="text-right">
                <div className="text-[8px] text-cyan-400/50 uppercase font-black tracking-tighter leading-none">Security</div>
                <div className="text-[10px] font-black text-white tracking-widest leading-tight uppercase">ENCRYPTED-NODE</div>
              </div>
            </div>
          </div>

          {!result ? (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="neural-card p-10 max-w-3xl mx-auto shadow-2xl relative"
            >
              <div className="absolute top-0 right-0 p-6 opacity-10"><Sparkles className="w-16 h-16" /></div>
              
              <div className="font-black text-xl text-white uppercase tracking-[0.2em] mb-8 flex items-center gap-4">
                <div className="w-10 h-10 bg-white/5 rounded-xl flex items-center justify-center text-xl border border-white/10">💬</div>
                Consciousness Input
              </div>

              <textarea
                className="w-full bg-white/5 border border-white/10 rounded-[2rem] p-8 text-white text-lg placeholder:text-white/10 focus:ring-2 focus:ring-cyan-500/50 outline-none transition-all resize-none mb-8 font-medium leading-relaxed"
                style={{ minHeight: 200 }}
                placeholder="Log your current neural state... How are you feeling?"
                value={text}
                onChange={(e) => setText(e.target.value)}
              />

              {statusMsg && (
                <div className="flex items-center gap-3 text-[10px] font-black text-cyan-400 uppercase tracking-[0.4em] mb-6 animate-pulse">
                  <div className="w-1.5 h-1.5 bg-cyan-400 rounded-full" />
                  {statusMsg}
                </div>
              )}

              <Button
                size="lg"
                className="w-full h-16 bg-gradient-to-r from-cyan-500 to-cyan-600 hover:shadow-[0_0_40px_rgba(6,182,212,0.4)] text-white font-black uppercase tracking-[0.2em] rounded-2xl transition-all duration-500 disabled:opacity-50"
                onClick={analyze}
                disabled={loading || !text.trim()}
              >
                {loading ? "Processing..." : <>Initiate Neural Decoding <Send className="w-5 h-5 ml-3" /></>}
              </Button>
            </motion.div>
          ) : (
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="max-w-3xl mx-auto space-y-8"
            >
              <div className="neural-card p-10 shadow-2xl border-cyan-500/20">
                <h2 className="text-xl font-black text-white mb-10 flex items-center gap-4 uppercase tracking-[0.2em]">
                  <div className="w-10 h-10 rounded-full bg-cyan-500/20 flex items-center justify-center text-cyan-400 border border-cyan-500/30">
                    <BarChart3 className="w-5 h-5" />
                  </div>
                  Pattern Analysis
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
                   <div className="p-8 rounded-[2rem] bg-white/5 border border-white/10 shadow-xl relative overflow-hidden group">
                     <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                     <div className="text-[10px] text-cyan-400/60 font-black uppercase tracking-[0.3em] mb-3">Neural Stress Factor</div>
                     <div className="text-5xl font-black text-white tracking-tighter">{result.stress_score}%</div>
                     <div className="mt-4 h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                        <motion.div 
                          className="h-full bg-cyan-400"
                          initial={{ width: 0 }}
                          animate={{ width: `${result.stress_score}%` }}
                        />
                     </div>
                   </div>

                   <div className="p-8 rounded-[2rem] bg-white/5 border border-white/10 shadow-xl relative overflow-hidden group">
                     <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                     <div className="text-[10px] text-purple-400/60 font-black uppercase tracking-[0.3em] mb-3">Classification</div>
                     <div className="text-3xl font-black text-white tracking-tighter uppercase">
                        {result.stress_score > 60 ? "Elevated" : result.stress_score > 30 ? "Moderate" : "Optimal"}
                     </div>
                     <div className="mt-4 flex items-center gap-2">
                        <Activity className={`w-4 h-4 ${result.stress_score > 60 ? 'text-red-500' : result.stress_score > 30 ? 'text-yellow-400' : 'text-green-400'} animate-pulse`} />
                        <span className="text-[8px] font-black text-white/20 uppercase tracking-widest">Neural Stability: {result.stress_score > 60 ? 'Low' : 'High'}</span>
                     </div>
                   </div>
                </div>
                
                <RealTimeRecommendations stressScore={result.stress_score} />
              </div>

              <div className="flex justify-center pt-8">
                <Button
                  variant="outline"
                  size="lg"
                  className="px-10 h-16 border-white/10 hover:bg-white/5 text-white/40 hover:text-white font-black uppercase tracking-[0.2em] rounded-2xl transition-all"
                  onClick={() => {
                    setResult(null);
                    setText("");
                  }}
                >
                  <RefreshCw className="w-5 h-5 mr-3" /> New Neural Session
                </Button>
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}

export default TextAnalysis;