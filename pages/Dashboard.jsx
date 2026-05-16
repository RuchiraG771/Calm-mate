<<<<<<< HEAD
import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./Dashboard.css";
import logo from "../assets/logo.png";

export default function Dashboard() {

  const navigate = useNavigate();   // ⭐ navigation

  const [activeTab, setActiveTab] = useState("Breathing");
  const [activeMenu, setActiveMenu] = useState("Dashboard");

  const [showProfile, setShowProfile] = useState(false);
  const profileRef = useRef(null);

  const [selectedMood, setSelectedMood] = useState(null);

  /* ===== CLOSE PROFILE WHEN CLICK OUTSIDE ===== */
  useEffect(() => {
    function handleClickOutside(event) {
      if (
        profileRef.current &&
        !profileRef.current.contains(event.target)
      ) {
        setShowProfile(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () =>
      document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  /* ================= FEATURES ================= */
  const features = [
    { name: "Breathing", icon: "🫁" },
    { name: "Meditation", icon: "🧘" },
    { name: "Natural Sounds", icon: "🎧" },
    { name: "Sleep", icon: "🌙" },
    { name: "Journal", icon: "📓" }
  ];

  return (
    <div className="dashboard">

      {/* ========= TOP NAVBAR ========= */}
      <div className="topbar">

        <div className="logo-section">
          <img src={logo} alt="logo" />
          <div>
            <h2>CalmMate</h2>
            <p>Your Space For Peace</p>
          </div>
        </div>

        {/* PROFILE AREA */}
        <div className="profile-area" ref={profileRef}>

          <button
            className="profile-btn"
            onClick={() => setShowProfile(!showProfile)}
          >
            👤
          </button>

          {showProfile && (
            <div className="profile-dropdown">

              <div className="profile-icon">👤</div>

              <hr />

              <div className="profile-username">
                Username
              </div>

              <hr />

              <div className="dropdown-item">Profile</div>
              <div className="dropdown-item">Calm Points</div>
              <div className="dropdown-item logout">Logout</div>

            </div>
          )}

        </div>

      </div>


      {/* ========= SECOND NAVBAR ========= */}
      <div className="feature-nav">
        {features.map(feature => (
          <span
            key={feature.name}
            className={activeTab === feature.name ? "active-tab" : ""}
            onClick={() => setActiveTab(feature.name)}
          >
            <span className="feature-icon">{feature.icon}</span>
            {feature.name}
          </span>
        ))}
      </div>


      {/* ========= MAIN AREA ========= */}
      <div className="main-area">

        {/* ===== LEFT SIDEBAR ===== */}
<div className="sidebar">

  <h3>📊 Dashboard</h3>

  <div
  className="menu-item"
  onClick={() => navigate("/live-scan")}
>
  📷 <span>Live Mood Scan</span>
</div>

  <div
    className={`menu-item ${activeMenu==="Text"?"active-menu":""}`}
    onClick={() => navigate("/text-analysis")}
  >
    📝 <span>Text Analysis</span>
  </div>

  {/* ✅ FIXED STRESSLENS */}
  <div
    className="menu-item"
    onClick={() => navigate("/stress-lens")}
  >
    🔍 <span>StressLens Analyzer</span>
  </div>

  {/* ✅ FIXED ACTIVITY HISTORY */}
  <div
    className={`menu-item ${activeMenu==="Activities"?"active-menu":""}`}
    onClick={()=>setActiveMenu("Activities")}
  >
    ✅ <span>Activity History</span>
  </div>

  <div
    className={`menu-item ${activeMenu==="History"?"active-menu":""}`}
    onClick={()=>setActiveMenu("History")}
  >
    📈 <span>Stress Trends</span>
  </div>

  <div
    className={`menu-item ${activeMenu==="Compare"?"active-menu":""}`}
    onClick={()=>setActiveMenu("Compare")}
  >
    ⚖️ <span>Progress Comparison</span>
  </div>

  <div className="menu-item logout">
    🚪 <span>Logout</span>
  </div>

</div>


        {/* ===== DAILY AFFIRMATION ===== */}
        <div className="card">
          <div className="card-header">
            <div className="icon-box">✨</div>
            <h3>Daily Affirmation</h3>
          </div>

          <div className="affirm-box">
            <p>
              Click the button below to generate your daily affirmation
            </p>
          </div>

          <button className="primary-btn">
            Generate Affirmation
          </button>
        </div>


        {/* ===== MOOD TRACKER ===== */}
        <div className="card">
          <div className="card-header">
            <div className="icon-box">📈</div>
            <h3>How are you feeling today?</h3>
          </div>

          <div className="mood-options">

            {[
              { label: "Very Sad", emoji: "😢" },
              { label: "Sad", emoji: "🙁" },
              { label: "Neutral", emoji: "😐" },
              { label: "Happy", emoji: "🙂" },
              { label: "Very Happy", emoji: "😁" }
            ].map(mood => (

              <div
                key={mood.label}
                className={`mood ${
                  selectedMood === mood.label ? "active-mood" : ""
                }`}
                onClick={() => setSelectedMood(mood.label)}
              >
                {mood.emoji}
                <span>{mood.label}</span>
              </div>

            ))}

          </div>

          <label>Add a note (optional)</label>

          <textarea
            placeholder="What's influencing your mood today?"
          />

          <button className="primary-btn">
            Save Mood
          </button>
        </div>

      </div>

    </div>
  );
=======
import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./Dashboard.css";
import logo from "../assets/logo.png";

export default function Dashboard() {

  const navigate = useNavigate();   // ⭐ navigation

  const [activeTab, setActiveTab] = useState("Breathing");
  const [activeMenu, setActiveMenu] = useState("Dashboard");

  const [showProfile, setShowProfile] = useState(false);
  const profileRef = useRef(null);

  const [selectedMood, setSelectedMood] = useState(null);

  /* ===== CLOSE PROFILE WHEN CLICK OUTSIDE ===== */
  useEffect(() => {
    function handleClickOutside(event) {
      if (
        profileRef.current &&
        !profileRef.current.contains(event.target)
      ) {
        setShowProfile(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () =>
      document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  /* ================= FEATURES ================= */
  const features = [
    { name: "Breathing", icon: "🫁" },
    { name: "Meditation", icon: "🧘" },
    { name: "Natural Sounds", icon: "🎧" },
    { name: "Sleep", icon: "🌙" },
    { name: "Journal", icon: "📓" }
  ];

  return (
    <div className="dashboard">

      {/* ========= TOP NAVBAR ========= */}
      <div className="topbar">

        <div className="logo-section">
          <img src={logo} alt="logo" />
          <div>
            <h2>CalmMate</h2>
            <p>Your Space For Peace</p>
          </div>
        </div>

        {/* PROFILE AREA */}
        <div className="profile-area" ref={profileRef}>

          <button
            className="profile-btn"
            onClick={() => setShowProfile(!showProfile)}
          >
            👤
          </button>

          {showProfile && (
            <div className="profile-dropdown">

              <div className="profile-icon">👤</div>

              <hr />

              <div className="profile-username">
                Username
              </div>

              <hr />

              <div className="dropdown-item">Profile</div>
              <div className="dropdown-item">Calm Points</div>
              <div className="dropdown-item logout">Logout</div>

            </div>
          )}

        </div>

      </div>


      {/* ========= SECOND NAVBAR ========= */}
      <div className="feature-nav">
        {features.map(feature => (
          <span
            key={feature.name}
            className={activeTab === feature.name ? "active-tab" : ""}
            onClick={() => setActiveTab(feature.name)}
          >
            <span className="feature-icon">{feature.icon}</span>
            {feature.name}
          </span>
        ))}
      </div>


      {/* ========= MAIN AREA ========= */}
      <div className="main-area">

        {/* ===== LEFT SIDEBAR ===== */}
<div className="sidebar">

  <h3>📊 Dashboard</h3>

  <div
  className="menu-item"
  onClick={() => navigate("/live-scan")}
>
  📷 <span>Live Mood Scan</span>
</div>

  <div
    className={`menu-item ${activeMenu==="Text"?"active-menu":""}`}
    onClick={() => navigate("/text-analysis")}
  >
    📝 <span>Text Analysis</span>
  </div>

  {/* ✅ FIXED STRESSLENS */}
  <div
    className="menu-item"
    onClick={() => navigate("/stress-lens")}
  >
    🔍 <span>StressLens Analyzer</span>
  </div>

  {/* ✅ FIXED ACTIVITY HISTORY */}
  <div
    className={`menu-item ${activeMenu==="Activities"?"active-menu":""}`}
    onClick={()=>setActiveMenu("Activities")}
  >
    ✅ <span>Activity History</span>
  </div>

  <div
    className={`menu-item ${activeMenu==="History"?"active-menu":""}`}
    onClick={()=>setActiveMenu("History")}
  >
    📈 <span>Stress Trends</span>
  </div>

  <div
    className={`menu-item ${activeMenu==="Compare"?"active-menu":""}`}
    onClick={()=>setActiveMenu("Compare")}
  >
    ⚖️ <span>Progress Comparison</span>
  </div>

  <div className="menu-item logout">
    🚪 <span>Logout</span>
  </div>

</div>


        {/* ===== DAILY AFFIRMATION ===== */}
        <div className="card">
          <div className="card-header">
            <div className="icon-box">✨</div>
            <h3>Daily Affirmation</h3>
          </div>

          <div className="affirm-box">
            <p>
              Click the button below to generate your daily affirmation
            </p>
          </div>

          <button className="primary-btn">
            Generate Affirmation
          </button>
        </div>


        {/* ===== MOOD TRACKER ===== */}
        <div className="card">
          <div className="card-header">
            <div className="icon-box">📈</div>
            <h3>How are you feeling today?</h3>
          </div>

          <div className="mood-options">

            {[
              { label: "Very Sad", emoji: "😢" },
              { label: "Sad", emoji: "🙁" },
              { label: "Neutral", emoji: "😐" },
              { label: "Happy", emoji: "🙂" },
              { label: "Very Happy", emoji: "😁" }
            ].map(mood => (

              <div
                key={mood.label}
                className={`mood ${
                  selectedMood === mood.label ? "active-mood" : ""
                }`}
                onClick={() => setSelectedMood(mood.label)}
              >
                {mood.emoji}
                <span>{mood.label}</span>
              </div>

            ))}

          </div>

          <label>Add a note (optional)</label>

          <textarea
            placeholder="What's influencing your mood today?"
          />

          <button className="primary-btn">
            Save Mood
          </button>
        </div>

      </div>

    </div>
  );
>>>>>>> origin/main
}