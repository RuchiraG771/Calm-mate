import React from "react";
import "./Dashboard.css";

function Dashboard() {
  return (
    <div className="dashboard">

      <aside className="sidebar">
        <h2>CalmMate</h2>

        <ul>
          <li>🏠 Home</li>
          <li>😊 Mood Tracker</li>
          <li>🧘 Meditation</li>
          <li>📊 Progress</li>
          <li>⚙ Settings</li>
        </ul>
      </aside>

      <main className="main-content">
        <h1>Welcome Back 👋</h1>
        <p>Your mental wellness dashboard</p>

        <div className="cards">

          <div className="card-box">
            <h3>Today's Mood</h3>
            <p>😊 Happy</p>
          </div>

          <div className="card-box">
            <h3>Meditation Time</h3>
            <p>15 Minutes</p>
          </div>

          <div className="card-box">
            <h3>Streak</h3>
            <p>7 Days 🔥</p>
          </div>

        </div>
      </main>

    </div>
  );
}

export default Dashboard;