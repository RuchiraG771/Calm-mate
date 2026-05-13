import { useState } from "react";

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
        background: "#111827",
        color: "white",
      }}
    >
      <h2>Analysis Result</h2>

      <p>Mood: {result.mood}</p>

      <p>Stress Score: {result.stress_score}</p>

      <p>Stress Level: {result.stress_level}</p>

      <p>Confidence: {result.confidence}%</p>
    </div>
  );
}

function TextAnalysis() {
  const [text, setText]     = useState("");
  const [result, setResult] = useState(null);
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
      if (lower.includes("happy") || lower.includes("good") || lower.includes("relaxed"))       score -= 20;
      if (lower.includes("anxious") || lower.includes("worried"))                                score += 25;
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

  const EXAMPLES = [
    "I'm feeling really stressed and overwhelmed with work lately",
    "I had a great day! Feeling calm and happy",
    "I can't stop overthinking everything, I'm so anxious",
  ];

  return (
    <div>
      <div className="page-title" style={{ marginBottom: 4 }}>✍️ Text Mood Analysis</div>
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 18 }}>
        <div style={{ color: "var(--text2)", fontSize: 13 }}>AI sentiment & stress analysis</div>
      </div>
           
     {!result ? (
  <div className="card" style={{ maxWidth: 600, margin: "0 auto" }}>
    <div style={{ fontWeight: 800, fontSize: 15, marginBottom: 12 }}>
      💬 How are you feeling?
    </div>

    <textarea
      className="input"
      style={{ marginBottom: 14, minHeight: 130 }}
      placeholder="Type your thoughts freely..."
      value={text}
      onChange={(e) => setText(e.target.value)}
    />

    {statusMsg && (
      <div
        style={{
          fontSize: 12,
          color: "cyan",
          marginBottom: 10,
        }}
      >
        {statusMsg}
      </div>
    )}

    <button
      className="btn btn-primary"
      style={{ width: "100%" }}
      onClick={analyze}
      disabled={loading || !text.trim()}
    >
      {loading ? "Analyzing..." : "🔍 Analyze with AI"}
    </button>
  </div>
) : (
  <div style={{ maxWidth: 600, margin: "0 auto" }}>
    <StressResult result={result} />

    <button
      className="btn btn-secondary"
      style={{ marginTop: 14 }}
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
  );
}

export default TextAnalysis;