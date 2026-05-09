import React, { useRef, useState } from "react";
import "./LiveMoodScan.css";

export default function LiveMoodScan() {

  const videoRef = useRef(null);
  const canvasRef = useRef(null);

  const [image, setImage] = useState(null);
  const [result, setResult] = useState(null);

  // 🎥 Start Camera
  const startCamera = async () => {
    const stream = await navigator.mediaDevices.getUserMedia({ video: true });
    videoRef.current.srcObject = stream;
  };

  // 📸 Capture Image
  const captureImage = () => {
  const canvas = canvasRef.current;
  const video = videoRef.current;

  canvas.width = video.videoWidth;
  canvas.height = video.videoHeight;

  const ctx = canvas.getContext("2d");
  ctx.drawImage(video, 0, 0);

  const imgData = canvas.toDataURL("image/png");
  setImage(imgData);

  // ✅ STOP CAMERA AFTER CAPTURE
  const stream = video.srcObject;
  if (stream) {
    const tracks = stream.getTracks();
    tracks.forEach(track => track.stop());
  }

  video.srcObject = null; // optional clean

  analyzeMood();
};

  // 🧠 Fake AI (for now)
const analyzeMood = () => {

  const moods = ["Happy", "Neutral", "Sad"];
  const mood = moods[Math.floor(Math.random() * moods.length)];

  let stressScore = 20;

  if(mood === "Happy") stressScore = 15;
  if(mood === "Neutral") stressScore = 45;
  if(mood === "Sad") stressScore = 70;

  let stressLevel = "Low";
  if(stressScore > 60) stressLevel = "High";
  else if(stressScore > 30) stressLevel = "Medium";

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
      "🫁 4-7-8 Breathing",
      "🎧 Calm Music",
      "📖 Journaling"
    ];
  }

  if(stressLevel === "High"){
    suggestions = [
      "🧘 Body Scan Meditation",
      "🫁 Alternate Nostril Breathing",
      "🚫 Disconnect from work",
      "💬 Talk to someone"
    ];
  }

  setResult({
    mood,
    stressLevel,
    stressScore,
    stressDetected: stressScore > 40 ? "Yes" : "No",
    suggestions
  });
};

  return (
    <div className="camera-page">

      <h2>📷 Live Mood Scan</h2>

      {!image && (
        <>
          <video ref={videoRef} autoPlay className="video-box"></video>

          <button className="primary-btn" onClick={startCamera}>
            Start Camera
          </button>

          <button className="primary-btn" onClick={captureImage}>
            Capture
          </button>
        </>
      )}

      {/* SHOW RESULT */}
{image && result && (
  <div className="result-section">

    <img src={image} alt="captured" className="captured-img"/>

    <div className="result-card">

      <h3>📊 Facial Emotion Analysis</h3>

      <p><b>Stress Detected:</b> {result.stressDetected}</p>

      <p>
        <b>Stress Level:</b>
        <span className={`stress-badge ${result.stressLevel.toLowerCase()}`}>
          {result.stressLevel}
        </span>
      </p>

      {/* STRESS BAR */}
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

      {/* MOOD */}
      <p className="mood-text">
        <b>Mood Detected:</b>{" "}
        {result.mood === "Happy" && "😊 Happy"}
        {result.mood === "Neutral" && "😐 Neutral"}
        {result.mood === "Sad" && "😢 Sad"}
      </p>

      {/* SUGGESTIONS */}
      <h4>💡 Personalized Calm Suggestions</h4>

      <ul>
        {result.suggestions.map((item,index)=>(
          <li key={index}>{item}</li>
        ))}
      </ul>

    </div>

  </div>
)}

      <canvas ref={canvasRef} style={{ display: "none" }}></canvas>

    </div>
  );
}