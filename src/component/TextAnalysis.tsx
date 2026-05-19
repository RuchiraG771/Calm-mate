import { useState } from "react";
import Navbar from "./Navbar";
import RealTimeRecommendations from "./analysis/RealTimeRecommendations";
import { getAnalysisDetailsFromScore } from "@/lib/utils";
import { auth } from "@/lib/firebase";
import { saveHistory } from "@/lib/historyService";

async function analyzeTextWithAI(text: string) {
  const lower = text.toLowerCase();
  let score = 40; // baseline

  // Negative patterns
  if (lower.match(/\b(stress|tired|overwhelmed|overthinking|exhausted|burnout|can't handle|crying)\b/g)) score += 30;
  if (lower.match(/\b(anxious|worried|nervous|scared|panic|fear|terrified)\b/g)) score += 25;
  if (lower.match(/\b(sad|depressed|down|unhappy|lonely|empty|hopeless)\b/g)) score += 20;
  
  // Positive patterns
  if (lower.match(/\b(happy|good|relaxed|great|amazing|calm|peaceful|joy|excited|wonderful)\b/g)) score -= 25;
  if (lower.match(/\b(better|improving|okay|fine|alright)\b/g)) score -= 10;
  
  // Intensity multipliers (very, extremely, so)
  if (lower.match(/\b(very|extremely|so|too much)\b/g)) {
    if (score > 50) score += 10;
    else if (score < 50) score -= 10;
  }
  
  score = Math.max(0, Math.min(100, score));

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
    setStatusMsg("🧠 AI is analyzing your text patterns...");
    try {
      const aiResult = await analyzeTextWithAI(text);
      setResult(aiResult);
      
      // Save history
      if (auth.currentUser) {
        const details = getAnalysisDetailsFromScore(aiResult.stress_score);
        await saveHistory({
          userId: auth.currentUser.uid,
          type: "quiz",
          score: aiResult.stress_score,
          stressLevel: details.level,
          mood: "Text Analysis",
        });
      }
    } catch (err) {
      console.error("Text analysis failed", err);
    } finally {
      setStatusMsg("");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="pt-24 pb-12 px-6">
        <div className="max-w-3xl mx-auto">
          <div className="page-title text-3xl font-bold mb-2 text-center">✍️ Text Mood Analysis</div>
          <p className="text-muted-foreground text-center mb-10">Express your thoughts and let AI understand your emotional state</p>

          {!result ? (
            <div className="glass-card rounded-xl p-8 max-w-2xl mx-auto border border-border/50 shadow-lg">
              <div className="font-bold text-lg mb-4 text-foreground">
                💬 How are you feeling right now?
              </div>

              <textarea
                className="w-full bg-input/50 border border-border rounded-lg p-4 text-foreground focus:ring-2 focus:ring-primary outline-none transition-all resize-none mb-4"
                style={{ minHeight: 130 }}
                placeholder="Type your thoughts freely... (e.g., 'I've been feeling a bit overwhelmed lately with work...')"
                value={text}
                onChange={(e) => setText(e.target.value)}
              />

              {statusMsg && (
                <div className="text-sm text-primary mb-4 animate-pulse">
                  {statusMsg}
                </div>
              )}

              <button
                className="w-full bg-primary text-primary-foreground font-semibold py-3 rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50 glow-primary"
                onClick={analyze}
                disabled={loading || !text.trim()}
              >
                {loading ? "Analyzing..." : "🔍 Analyze with AI"}
              </button>
            </div>
          ) : (
            <div className="max-w-2xl mx-auto space-y-6">
              <div className="bg-card/30 p-6 rounded-2xl border border-border">
                <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                  <span className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary text-sm">📊</span>
                  Analysis Insights
                </h2>
                <div className="grid grid-cols-2 gap-4 mb-6">
                   <div className="p-4 rounded-xl bg-background/50 border border-border">
                     <div className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Stress Score</div>
                     <div className="text-2xl font-bold text-primary">{result.stress_score}%</div>
                   </div>
                   <div className="p-4 rounded-xl bg-background/50 border border-border">
                     <div className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Status</div>
                     <div className="text-2xl font-bold text-foreground">{result.stress_score > 60 ? "Elevated" : result.stress_score > 30 ? "Moderate" : "Optimal"}</div>
                   </div>
                </div>
                
                <RealTimeRecommendations stressScore={result.stress_score} />
              </div>

              <div className="flex justify-center">
                <button
                  className="px-6 py-2 bg-secondary text-secondary-foreground rounded-lg hover:bg-secondary/80 transition-colors flex items-center gap-2"
                  onClick={() => {
                    setResult(null);
                    setText("");
                  }}
                >
                  🔄 New Analysis
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default TextAnalysis;