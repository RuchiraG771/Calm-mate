import { useState, useEffect, useRef } from "react";

function Wellness({ defaultTab = "breathing" }: any) {
  const [activeTab, setActiveTab] = useState(defaultTab || "breathing");

  // Breathing
  const [breathingType, setBreathingType] = useState("box");
  const [timerActive, setTimerActive]     = useState(false);
  const [timeLeft, setTimeLeft]           = useState(0);
  const [phase, setPhase]                 = useState("");
  const [breathPhase, setBreathPhase]     = useState(0);
  const timerRef = useRef<any>(null);

  // Meditation
  const [medActive, setMedActive]     = useState(false);
  const [medTimeLeft, setMedTimeLeft] = useState(0);
  const [currentMed, setCurrentMed]   = useState(null);
  const medRef = useRef<any>(null);

  // Journal
  const [journalText, setJournalText] = useState("");
  const [journalSaved, setJournalSaved] = useState(false);
  const [journals, setJournals]         = useState([]);

  useEffect(() => { if (defaultTab) setActiveTab(defaultTab); }, [defaultTab]);

  const BREATHING_CONFIGS = {
    box:    { title: "Box Breathing (4-4-4-4)", phases: ["Inhale","Hold","Exhale","Hold"],                              durations: [4,4,4,4] },
    "478":  { title: "4-7-8 Breathing",         phases: ["Inhale","Hold","Exhale"],                                    durations: [4,7,8]   },
    nostril:{ title: "Alternate Nostril",        phases: ["Inhale (Left)","Exhale (Right)","Inhale (Right)","Exhale (Left)"], durations: [4,4,4,4] },
  };

  const startBreathing = () => {
    const cfg = BREATHING_CONFIGS[breathingType];
    setTimerActive(true); setBreathPhase(0); setPhase(cfg.phases[0]);
    let cp = 0, count = cfg.durations[0];
    setTimeLeft(count);
    timerRef.current = setInterval(() => {
      count--; setTimeLeft(count);
      if (count <= 0) { cp = (cp + 1) % cfg.phases.length; count = cfg.durations[cp]; setBreathPhase(cp); setPhase(cfg.phases[cp]); setTimeLeft(count); }
    }, 1000);
  };
  const stopBreathing = () => { clearInterval(timerRef.current); setTimerActive(false); setTimeLeft(0); setPhase(""); };
  useEffect(() => () => clearInterval(timerRef.current), []);

  const startMeditation = med => {
    setCurrentMed(med); setMedTimeLeft(med.duration * 60); setMedActive(true);
    medRef.current = setInterval(() => setMedTimeLeft(p => { if (p <= 1) { clearInterval(medRef.current); setMedActive(false); return 0; } return p - 1; }), 1000);
  };
  const stopMeditation = () => { clearInterval(medRef.current); setMedActive(false); };
  const formatTime = sec => `${Math.floor(sec / 60)}:${(sec % 60) < 10 ? "0" : ""}${sec % 60}`;

  const saveJournal = () => {
    if (!journalText.trim()) return;
    setJournals(p => [{ id: Date.now(), content: journalText, created_at: new Date().toISOString() }, ...p]);
    setJournalText(""); setJournalSaved(true); setTimeout(() => setJournalSaved(false), 2000);
  };

  const breathColors = ["#00bbf9", "#9b5de5", "#f15bb5", "#9b5de5"];
  const MEDITATIONS  = [
    { title: "Body Scan Meditation",    duration: 15, desc: "Progressively relax each part of your body", icon: "🧘" },
    { title: "Guided Meditation",       duration: 10, desc: "Cultivate compassion for yourself and others", icon: "🌄" },
    { title: "Mindfulness Meditation",  duration: 5,  desc: "Focus purely on the rhythm of your breath",   icon: "🌬️" },
  ];
  const SOUNDS = [
    { title: "Forest Birds",       icon: "🌿", color: "#00f5d4" },
    { title: "Gentle Water Stream",icon: "💧", color: "#00bbf9" },
    { title: "Soft Rain Ambience", icon: "🌧️", color: "#9b5de5" },
    { title: "Light Piano",        icon: "🎹", color: "#a89bc2" },
    { title: "Ocean Waves",        icon: "🌊", color: "#06b6d4" },
    { title: "White Noise",        icon: "📻", color: "#6366f1" },
    { title: "Yoga Nidra",         icon: "🧘", color: "#f15bb5" },
  ];

  return (
    <div>
      <div className="page-title" style={{ marginBottom: 4 }}>🧘 Wellness Modules</div>
      <div style={{ color: "var(--text2)", fontSize: 13, marginBottom: 18 }}>Guided exercises for mental and physical wellbeing</div>
      <div className="tabs" style={{ marginBottom: 20 }}>
        {[{ id:"breathing",label:"💨 Breathing" },{ id:"meditation",label:"🧘 Meditation" },{ id:"sounds",label:"🎵 Sounds" },{ id:"sleep",label:"😴 Sleep" },{ id:"journal",label:"📓 Journal" }].map(t => (
          <button key={t.id} className={`tab ${activeTab === t.id ? "active" : ""}`} onClick={() => setActiveTab(t.id)}>{t.label}</button>
        ))}
      </div>

      {/* BREATHING */}
      {activeTab === "breathing" && (
        <div style={{ maxWidth: 520, margin: "0 auto" }}>
          <div className="card-glow" style={{ textAlign: "center" }}>
            <div style={{ display: "flex", gap: 8, justifyContent: "center", marginBottom: 14 }}>
              {["box","478","nostril"].map(type => (
                <button key={type} className={`btn btn-sm ${breathingType === type ? "btn-primary" : "btn-secondary"}`}
                  onClick={() => { setBreathingType(type); stopBreathing(); }}>
                  {type === "box" ? "4-4-4-4" : type === "478" ? "4-7-8" : "Nostril"}
                </button>
              ))}
            </div>
            <div style={{ fontWeight: 800, fontSize: 16, marginBottom: 4 }}>{BREATHING_CONFIGS[breathingType].title}</div>
            <div style={{ color: "var(--text2)", fontSize: 12, marginBottom: 24 }}>Calm your nervous system with controlled breathing</div>
            <div style={{ position: "relative", display: "inline-block", marginBottom: 28 }}>
              {timerActive && <div style={{ position: "absolute", inset: -14, borderRadius: "50%", border: `3px solid ${breathColors[breathPhase % breathColors.length]}`, animation: "pulse-ring 1s ease-out infinite", opacity: 0.5 }} />}
              <div className="timer-circle" style={{ borderColor: timerActive ? breathColors[breathPhase % breathColors.length] : "rgba(155,93,229,0.3)", boxShadow: timerActive ? `0 0 40px ${breathColors[breathPhase % breathColors.length]}44` : "none" }}>
                <div style={{ fontSize: timerActive ? 48 : 34 }}>{timerActive ? timeLeft : BREATHING_CONFIGS[breathingType].durations[0]}</div>
                <div style={{ fontSize: 11, color: timerActive ? breathColors[breathPhase % breathColors.length] : "var(--text2)", fontWeight: 700 }}>{timerActive ? phase : "seconds"}</div>
              </div>
            </div>
            {timerActive && (
              <div style={{ marginBottom: 20 }}>
                <div style={{ fontSize: 16, fontWeight: 800, color: breathColors[breathPhase % breathColors.length] }}>{phase}</div>
                <div style={{ display: "flex", justifyContent: "center", gap: 7, marginTop: 10 }}>
                  {BREATHING_CONFIGS[breathingType].phases.map((_, i) => (
                    <div key={i} style={{ width: 9, height: 9, borderRadius: "50%", background: i === breathPhase ? breathColors[i % breathColors.length] : "rgba(255,255,255,0.15)" }} />
                  ))}
                </div>
              </div>
            )}
            <div style={{ display: "flex", gap: 8, justifyContent: "center" }}>
              {!timerActive
                ? <button className="btn btn-primary" onClick={startBreathing}>🌬️ Start Breathing</button>
                : <button className="btn btn-secondary" onClick={stopBreathing}>⏹ Stop</button>}
            </div>
            <div className="divider" />
            <div style={{ display: "grid", gridTemplateColumns: `repeat(${BREATHING_CONFIGS[breathingType].phases.length},1fr)`, gap: 10 }}>
              {BREATHING_CONFIGS[breathingType].phases.map((p, i) => (
                <div key={i} style={{ textAlign: "center" }}>
                  <div style={{ fontSize: 20, fontWeight: 900, color: breathColors[i % breathColors.length] }}>{BREATHING_CONFIGS[breathingType].durations[i]}s</div>
                  <div style={{ fontSize: 10, color: "var(--text2)", fontWeight: 600 }}>{p}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* MEDITATION */}
      {activeTab === "meditation" && (
        <div style={{ maxWidth: 580, margin: "0 auto" }}>
          {!medActive ? (
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
              {MEDITATIONS.map((m, i) => (
                <div className="card" key={i} style={{ textAlign: "center" }}>
                  <div style={{ fontSize: 38, marginBottom: 10 }}>{m.icon}</div>
                  <div style={{ fontWeight: 800, fontSize: 14, marginBottom: 4 }}>{m.title}</div>
                  <div style={{ fontSize: 12, color: "var(--text2)", marginBottom: 12 }}>{m.desc}</div>
                  <button className="btn btn-primary btn-sm" onClick={() => startMeditation(m)}>▶ Begin ({m.duration} min)</button>
                </div>
              ))}
            </div>
          ) : (
            <div className="card-glow" style={{ textAlign: "center", padding: 30 }}>
              <div style={{ fontSize: 56 }}>{currentMed.icon}</div>
              <div style={{ fontWeight: 800, fontSize: 20, marginTop: 10 }}>{currentMed.title}</div>
              <div style={{ color: "var(--text2)", marginBottom: 16, fontSize: 13 }}>Stay relaxed and follow your breath</div>
              <div className="timer-circle" style={{ marginBottom: 20 }}>{formatTime(medTimeLeft)}</div>
              <button className="btn btn-secondary" onClick={stopMeditation}>⏹ Stop Meditation</button>
            </div>
          )}
        </div>
      )}

      {/* SOUNDS */}
      {activeTab === "sounds" && (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 14 }}>
          {SOUNDS.map((s, i) => (
            <div key={i} className="card" style={{ textAlign: "center", cursor: "pointer", padding: "24px 14px", transition: "all 0.2s" }}
              onMouseEnter={e => e.currentTarget.style.borderColor = `${s.color}55`}
              onMouseLeave={e => e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)"}>
              <div style={{ fontSize: 44, marginBottom: 10 }}>{s.icon}</div>
              <div style={{ fontWeight: 800, fontSize: 13, marginBottom: 10 }}>{s.title}</div>
              <button className="btn btn-sm" style={{ background: `${s.color}22`, color: s.color, border: `1px solid ${s.color}44` }}>▶ Play</button>
            </div>
          ))}
        </div>
      )}

      {/* SLEEP */}
      {activeTab === "sleep" && (
        <div style={{ maxWidth: 560, margin: "0 auto" }}>
          <div className="card-glow" style={{ textAlign: "center", padding: 20 }}>
            <div style={{ fontSize: 56 }}>🌙</div>
            <h2 style={{ fontWeight: 800, fontSize: 22, marginTop: 8 }}>Night Routine</h2>
            <p style={{ color: "var(--text2)", fontSize: 13, marginBottom: 18 }}>Simple habits to help you sleep better</p>
            {[
              { icon:"📵", title:"Avoid Screens",         desc:"Stay away from phone and TV at least 30 mins before sleep" },
              { icon:"🛏️", title:"Prepare Your Bed",       desc:"Keep your bed clean and your room slightly cool" },
              { icon:"🫖", title:"Drink Something Warm",   desc:"Have warm milk or herbal tea to relax your body" },
              { icon:"📖", title:"Light Reading",          desc:"Read a calming book to slow down your thoughts" },
              { icon:"🌬️", title:"Slow Breathing",         desc:"Take deep, slow breaths to relax your mind and body" },
              { icon:"🌌", title:"Clear Your Mind",        desc:"Let go of overthinking — you can handle tomorrow" },
              { icon:"💤", title:"Sleep Consistently",     desc:"Try to sleep and wake up at the same time every day" },
            ].map((item, i, arr) => (
              <div key={i} style={{ display: "flex", gap: 12, padding: "12px 0", borderBottom: i < arr.length - 1 ? "1px solid var(--card-border)" : "none", textAlign: "left" }}>
                <div style={{ width: 40, height: 40, borderRadius: 12, background: "rgba(155,93,229,0.15)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, flexShrink: 0 }}>{item.icon}</div>
                <div>
                  <div style={{ fontWeight: 700, fontSize: 13 }}>{item.title}</div>
                  <div style={{ fontSize: 12, color: "#aaa" }}>{item.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* JOURNAL */}
      {activeTab === "journal" && (
        <div style={{ maxWidth: 600, margin: "0 auto" }}>
          <div className="card" style={{ marginBottom: 14 }}>
            <div style={{ fontWeight: 800, fontSize: 15, marginBottom: 10 }}>✍️ New Entry</div>
            <textarea className="input" style={{ marginBottom: 10, minHeight: 110 }} placeholder="What's on your mind today? Write freely..." value={journalText} onChange={e => setJournalText(e.target.value)} />
            <button className="btn btn-primary btn-sm" onClick={saveJournal}>{journalSaved ? "✅ Saved!" : "💾 Save Entry"}</button>
          </div>
          {journals.length > 0 && (
            <>
              <div style={{ fontWeight: 800, fontSize: 14, marginBottom: 10 }}>📚 Past Entries</div>
              {journals.map(j => (
                <div className="journal-entry" key={j.id}>
                  <div style={{ fontSize: 11, color: "var(--text2)", marginBottom: 7 }}>
                    {new Date(j.created_at).toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" })}
                  </div>
                  <div style={{ fontSize: 13, lineHeight: 1.7 }}>{j.content}</div>
                </div>
              ))}
            </>
          )}
        </div>
      )}
    </div>
  );
}

export default Wellness;
