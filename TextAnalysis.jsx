import React, { useState } from "react";
import "./TextAnalysis.css";

export default function TextAnalysis() {

  const [text, setText] = useState("");
  const [result, setResult] = useState(null);

const analyzeMood = () => {

  if(text.trim() === ""){
    alert("Please write your thoughts before analyzing your mood.");
    return;
  }

  const input = text.toLowerCase();

    const happyWords = ["happy","great","good","excited","wonderful","joy"];
    const sadWords = ["sad","lonely","tired","upset","cry","bad"];
    const stressWords = ["stress","pressure","overwhelmed","anxious","deadline"];

    let mood = "Neutral";
    let stressScore = 10;

    if(happyWords.some(word => input.includes(word))){
      mood = "Happy";
      stressScore = 15;
    }

    if(sadWords.some(word => input.includes(word))){
      mood = "Sad";
      stressScore = 40;
    }

    if(stressWords.some(word => input.includes(word))){
      mood = "Sad";
      stressScore = 70;
    }

    let stressLevel = "Low";

    if(stressScore > 60){
      stressLevel = "High";
    }
    else if(stressScore > 30){
      stressLevel = "Medium";
    }

    let suggestions = [];

    if(stressLevel === "Low"){
      suggestions = [
        "🧘 Mindfulness Meditation",
        "🫁 Box Breathing (4-4-4-4)",
        "🎧 Listen to Nature Sounds",
        "🚶 Take a short relaxing walk"
      ];
    }

    if(stressLevel === "Medium"){
      suggestions = [
        "🧘 Guided Meditation",
        "🫁 4-7-8 Breathing Exercise",
        "🌧 Listen to Rain Sounds",
        "🧘‍♀️ Light Stretching"
      ];
    }

    if(stressLevel === "High"){
      suggestions = [
        "🧘 Body Scan Meditation",
        "🫁 Alternate Nostril Breathing",
        "📵 Disconnect from work for a while",
        "💬 Talk to a trusted friend"
      ];
    }

    setResult({
      stressDetected: stressScore > 40 ? "Yes" : "No",
      stressLevel,
      stressScore,
      mood,
      suggestions
    });

  };

  /* ENTER KEY SUPPORT */
  const handleKeyPress = (e) => {

  if(e.key === "Enter" && !e.shiftKey){

    e.preventDefault();

    if(text.trim() === ""){
      alert("Please write your thoughts before analyzing.");
      return;
    }

    analyzeMood();
  }

};

  return (
    <div className="analysis-page">

      <div className="analysis-card">

        <h2>📝 Text Analysis</h2>
        <p className="subtitle">
          Write your thoughts and CalmMate will analyze your emotional state.
        </p>

        <textarea
          placeholder="Write your thoughts here..."
          value={text}
          onChange={(e)=>setText(e.target.value)}
          onKeyDown={handleKeyPress}
        />

        <button className="analyze-btn" onClick={analyzeMood}>
          Analyze Mood
        </button>

        {result && (

<div className="result-card">

  <h3>📊 Emotional Analysis Result</h3>

  <p>
    <b>Stress Detected:</b> {result.stressDetected}
  </p>

  <p>
  <b>Stress Level:</b>
  <span className={`stress-badge ${result.stressLevel.toLowerCase()}`}>
    {result.stressLevel}
  </span>
</p>

{/* ✅ ADD STRESS BAR HERE */}
<div className="stress-bar">
  <div
    className="stress-fill"
    style={{
      width: `${result.stressScore}%`,
      background:
        result.stressScore > 60
          ? "#ef4444"
          : result.stressScore > 30
          ? "#eab308"
          : "#22c55e"
    }}
  ></div>
</div>

<p><b>Stress Score:</b> {result.stressScore}</p>

  <p className="mood-text">
  Mood Detected:{" "}
  {result.mood === "Happy" && "😊 Happy"}
  {result.mood === "Sad" && "😢 Sad"}
  {result.mood === "Neutral" && "😐 Neutral"}
</p>

  <h4>💡 Personalized Calm Suggestions</h4>

  <ul>
    {result.suggestions.map((item,index)=>(
      <li key={index}>{item}</li>
    ))}
  </ul>

</div>

        )}

      </div>

    </div>
  );
}