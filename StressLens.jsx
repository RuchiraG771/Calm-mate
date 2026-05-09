import React, { useState } from "react";
import "./StressLens.css";

export default function StressLens() {

  const [answers, setAnswers] = useState({});
  const [result, setResult] = useState(null);

  const questions = [
    {
      q: "When you wake up, what is your first feeling?",
      options: [
        { text: "Excited", score: 1 },
        { text: "Neutral", score: 2 },
        { text: "Tired", score: 3 },
        { text: "Heavy / unwilling", score: 4 }
      ]
    },
    {
      q: "How do you react when plans suddenly change?",
      options: [
        { text: "Adapt easily", score: 1 },
        { text: "Slightly uncomfortable", score: 2 },
        { text: "Irritated", score: 3 },
        { text: "Overwhelmed", score: 4 }
      ]
    },
    {
      q: "How often do you check your phone without reason?",
      options: [
        { text: "Rarely", score: 1 },
        { text: "Sometimes", score: 2 },
        { text: "Frequently", score: 3 },
        { text: "Constantly", score: 4 }
      ]
    },
    {
      q: "How does your body feel right now?",
      options: [
        { text: "Relaxed", score: 1 },
        { text: "Slightly tense", score: 2 },
        { text: "Tight / stiff", score: 3 },
        { text: "Heavy / restless", score: 4 }
      ]
    },
    {
      q: "How easy is it to sit still?",
      options: [
        { text: "Very easy", score: 1 },
        { text: "A bit difficult", score: 2 },
        { text: "Hard", score: 3 },
        { text: "Impossible", score: 4 }
      ]
    },
    {
      q: "What best describes your breathing?",
      options: [
        { text: "Slow and deep", score: 1 },
        { text: "Normal", score: 2 },
        { text: "Slightly fast", score: 3 },
        { text: "Fast / shallow", score: 4 }
      ]
    },
    {
      q: "How do you feel about responsibilities?",
      options: [
        { text: "Manageable", score: 1 },
        { text: "Slightly heavy", score: 2 },
        { text: "Overwhelming", score: 3 },
        { text: "Avoiding them", score: 4 }
      ]
    },
    {
      q: "Response to small problems?",
      options: [
        { text: "Calm", score: 1 },
        { text: "Slight frustration", score: 2 },
        { text: "Irritated", score: 3 },
        { text: "Overreact", score: 4 }
      ]
    },
    {
      q: "Energy level right now?",
      options: [
        { text: "High", score: 1 },
        { text: "Moderate", score: 2 },
        { text: "Low", score: 3 },
        { text: "Drained", score: 4 }
      ]
    },
    {
      q: "Connection with people?",
      options: [
        { text: "Very connected", score: 1 },
        { text: "Neutral", score: 2 },
        { text: "Distant", score: 3 },
        { text: "Avoiding", score: 4 }
      ]
    },
    {
      q: "Overthinking today?",
      options: [
        { text: "Not at all", score: 1 },
        { text: "Sometimes", score: 2 },
        { text: "Often", score: 3 },
        { text: "Constantly", score: 4 }
      ]
    },
    {
      q: "Feeling about future?",
      options: [
        { text: "Optimistic", score: 1 },
        { text: "Neutral", score: 2 },
        { text: "Worried", score: 3 },
        { text: "Anxious", score: 4 }
      ]
    },
    {
      q: "How do you spend your time?",
      options: [
        { text: "Productive", score: 1 },
        { text: "Relaxing", score: 2 },
        { text: "Switching tasks", score: 3 },
        { text: "Avoiding tasks", score: 4 }
      ]
    },
    {
      q: "Focus ability?",
      options: [
        { text: "Fully focused", score: 1 },
        { text: "Slight distraction", score: 2 },
        { text: "Frequent distraction", score: 3 },
        { text: "Cannot focus", score: 4 }
      ]
    },
    {
      q: "How do you feel in silence?",
      options: [
        { text: "Peaceful", score: 1 },
        { text: "Neutral", score: 2 },
        { text: "Uneasy", score: 3 },
        { text: "Uncomfortable", score: 4 }
      ]
    }
  ];

  const handleSelect = (qIndex, score) => {
    setAnswers({ ...answers, [qIndex]: score });
  };

  const calculateResult = () => {

    const total = Object.values(answers).reduce((a,b)=>a+b,0);

let level = "Low";

if(total > 45) level = "High";
else if(total > 30) level = "Medium";
    setResult({
      total,
      level
    });

  };

  return (
    <div className="stress-page">

      <h2>🔍 StressLens Analyzer</h2>

      {questions.map((item, index)=>(
        <div key={index} className="question-card">

          <p>{index+1}. {item.q}</p>

          <div className="options">
            {item.options.map((opt,i)=>(
              <button
                key={i}
                onClick={()=>handleSelect(index,opt.score)}
                className={answers[index]===opt.score ? "active" : ""}
              >
                {opt.text}
              </button>
            ))}
          </div>

        </div>
      ))}

      <button className="submit-btn" onClick={calculateResult}>
        Analyze Stress
      </button>

      {result && (
  <div className="result-card">

    <h3>📊 Emotional Analysis Result</h3>

    <p><b>Stress Detected:</b> {result.level === "Low" ? "No" : "Yes"}</p>

    <p>
      <b>Stress Level:</b>
      <span className={`stress-badge ${result.level.toLowerCase()}`}>
        {result.level}
      </span>
    </p>

    {/* ✅ STRESS BAR */}
    <div className="stress-bar">
      <div
        className="stress-fill"
        style={{
          width: `${(result.total / 60) * 100}%`,
          background:
            result.level === "High"
              ? "#ef4444"
              : result.level === "Medium"
              ? "#eab308"
              : "#22c55e"
        }}
      ></div>
    </div>

    <p><b>Stress Score:</b> {result.total}</p>

    {/* ✅ MOOD */}
    <p className="mood-text">
      <b>Mood Detected:</b>{" "}
      {result.level === "High" && "😢 Sad"}
      {result.level === "Medium" && "😐 Neutral"}
      {result.level === "Low" && "😊 Happy"}
    </p>

    {/* ✅ SUGGESTIONS */}
    <h4>💡 Personalized Calm Suggestions</h4>

    <ul>
      {result.level === "Low" && (
        <>
          <li>🧘 Mindfulness Meditation</li>
          <li>🫁 Box Breathing (4-4-4-4)</li>
          <li>🎧 Listen to Nature Sounds</li>
          <li>🚶 Take a short relaxing walk</li>
        </>
      )}

      {result.level === "Medium" && (
        <>
          <li>🧘 Guided Meditation</li>
          <li>🫁 4-7-8 Breathing</li>
          <li>🎧 Calm Music</li>
          <li>📖 Journaling</li>
        </>
      )}

      {result.level === "High" && (
        <>
          <li>🧘 Body Scan Meditation</li>
          <li>🫁 Alternate Nostril Breathing</li>
          <li>🚫 Disconnect from work</li>
          <li>💬 Talk to a trusted person</li>
        </>
      )}
    </ul>

  </div>
)}
    </div>
  );
}