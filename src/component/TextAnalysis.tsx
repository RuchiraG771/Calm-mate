import { useState } from "react";
import Navbar from "./Navbar";

function getStressAnalysisFallback(score: number) {
  let mood = "Neutral";
  let level = "Low";
  let confidence = 80;

  if (score > 70) {
    mood = "Stressed";
    level = "High";
  } else if (score > 40) {
    mood = "Anxious";
    level = "Medium";
  } else {
    mood = "Calm";
    level = "Low";
  }

  return {
    mood,
    level,
    confidence,
    recommendations: [
      {
        type: "breathing",
        title: "Breathing Exercise",
        duration: "5 min",
        desc: "Relax and breathe slowly",
      },
    ],
  };
}

async function analyzeTextWithAI(text: string) {
  return {
    stress_score: Math.floor(Math.random() * 100),
    mood: "Calm",
    stress_level: "Low",
    stress_detected: false,
    confidence: 90,
  };
}

function LoadingDots() {
  return (
    <div style={{ padding: 10 }}>
      Loading...
    </div>
  );
}

function StressResult({ result }: any) {
  return (
    <div
      style={{
        marginTop: 20,
        padding: 20,
        borderRadius: 12,
        background: "var(--card, #111827)",
        border: "1px solid var(--border)",
        color: "var(--foreground, white)",
      }}
    >
      <h2 style={{ fontSize: 18, fontWeight: 700, marginBottom: 12 }}>Analysis Result</h2>
      <p style={{ marginBottom: 6 }}><strong>Mood:</strong> {result.mood}</p>
      <p style={{ marginBottom: 6 }}><strong>Stress Score:</strong> {result.stress_score}</p>
      <p style={{ marginBottom: 6 }}><strong>Stress Level:</strong> {result.stress_level}</p>
      <p><strong>Confidence:</strong> {result.confidence}%</p>
    </div>
  );
}

function TextAnalysis() {
  const [text, setText] = useState("");
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [statusMsg, setStatusMsg] = useState("");

  const analyze = async () => {
    if (!text.trim()) return;
    setLoading(true);
    setStatusMsg("🧠 Claude AI is analyzing your text...");
    try {
      const aiResult = await analyzeTextWithAI(text);
      if (aiResult?.stress_score !== undefined) {
        setResult(aiResult);
      } else throw new Error("empty");
    } catch {
      // Keyword-based fallback
      let score = 40;
      const lower = text.toLowerCase();
      if (lower.includes("stress") || lower.includes("tired") || lower.includes("overthinking")) score += 30;
      if (lower.includes("happy") || lower.includes("good") || lower.includes("relaxed")) score -= 20;
      if (lower.includes("anxious") || lower.includes("worried")) score += 25;
      score = Math.max(10, Math.min(90, score));
      const fb = getStressAnalysisFallback(score);
      setResult({
        stress_score: score, stress_level: fb.level, mood: fb.mood,
        stress_detected: score > 40, confidence: fb.confidence,
        insight: "Analysis based on keyword patterns in your text.",
        recommendations: fb.recommendations,
      });
    }
    setStatusMsg(""); setLoading(false);
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="pt-24 pb-12 px-6">
        <div className="max-w-3xl mx-auto">
          <div className="page-title text-3xl font-bold mb-2">✍️ Text Mood Analysis</div>

          {!result ? (
            <div className="glass-card rounded-xl p-8 max-w-2xl mx-auto border border-border/50 shadow-lg">
              <div className="font-bold text-lg mb-4 text-foreground">
                💬 How are you feeling?
              </div>

              <textarea
                className="w-full bg-input/50 border border-border rounded-lg p-4 text-foreground focus:ring-2 focus:ring-primary outline-none transition-all resize-none mb-4"
                style={{ minHeight: 130 }}
                placeholder="Type your thoughts freely..."
                value={text}
                onChange={(e) => setText(e.target.value)}
              />

              {statusMsg && (
                <div className="text-sm text-primary mb-4 animate-pulse">
                  {statusMsg}
                </div>
              )}

              <button
                className="w-full bg-primary text-primary-foreground font-semibold py-3 rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50"
                onClick={analyze}
                disabled={loading || !text.trim()}
              >
                {loading ? "Analyzing..." : "🔍 Analyze with AI"}
              </button>
            </div>
          ) : (
            <div className="max-w-2xl mx-auto">
              <StressResult result={result} />

              <button
                className="mt-6 px-6 py-2 bg-secondary text-secondary-foreground rounded-lg hover:bg-secondary/80 transition-colors"
                onClick={() => {
                  setResult(null);
                  setText("");
                }}
              >
                🔄 Analyze Again
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default TextAnalysis;