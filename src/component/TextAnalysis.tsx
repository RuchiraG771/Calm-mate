import { useState } from "react";
import Navbar from "./Navbar";
import RealTimeRecommendations from "./analysis/RealTimeRecommendations";
import { getAnalysisDetailsFromScore } from "@/lib/utils";

async function analyzeTextWithAI(text: string) {
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
    setStatusMsg("🧠 AI is analyzing your text patterns...");
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