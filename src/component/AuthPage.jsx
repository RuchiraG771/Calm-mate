import { useNavigate } from "react-router-dom";
import React, { useState } from "react";
import "./AuthPage.css";

import logo from "../assets/logo.png";
import character from "../assets/character.png";

export default function AuthPage() {

  const [flip, setFlip] = useState(false);

  return (
    <div className="container">
      <div className={`card ${flip ? "flip" : ""}`}>

        {/* ================= LOGIN ================= */}
        <div className="side login">

          {/* LEFT PANEL */}
          <div className="brand">
            <img src={logo} alt="logo" />
            <h2>CalmMate</h2>
            <p>Your Space for Peace</p>
          </div>

          {/* CENTER FORM */}
          <div className="form-content">

            <h3 className="welcome-text">Welcome to CalmMate!!</h3>
            <h2 className="form-title">Login</h2>

            <input type="email" placeholder="Username / Email" />
            <input type="password" placeholder="Password" />

            <button className="btn">Login</button>

            <p className="switch">
              Don't have an account?
              <span onClick={() => setFlip(true)}> Sign Up</span>
            </p>

          </div>

          {/* RIGHT CHARACTER */}
          <div className="character-area">
            <img src={character} alt="character" />
          </div>

        </div>

        {/* ================= SIGNUP ================= */}
        <div className="side signup">

          <div className="brand">
            <img src={logo} alt="logo" />
            <h2>Join CalmMate</h2>
            <p>Start your wellness journey</p>
          </div>

          <div className="form-content">

            <h3 className="welcome-text">Welcome to CalmMate!!</h3>
            <h2 className="form-title">Sign Up</h2>

            <input type="text" placeholder="Username" />
            <input type="number" placeholder="Age" />
            <input type="text" placeholder="Mobile No" />
            <input type="password" placeholder="Password" />

            <button className="btn">Create Account</button>

            <p className="switch">
              Already have an account?
              <span onClick={() => setFlip(false)}> Login</span>
            </p>

          </div>

          <div className="character-area">
            <img src={character} alt="character" />
          </div>

        </div>

      </div>
    </div>
  );
}