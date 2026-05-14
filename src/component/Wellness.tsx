import { useState, useEffect, useRef } from "react";
import Navbar from "./Navbar";

function Wellness({ defaultTab = "breathing" }: any) {
  const [activeTab, setActiveTab] = useState(defaultTab || "breathing");

  // Breathing
  const [breathingType, setBreathingType] = useState("box");
  const [timerActive, setTimerActive] = useState(false);
  const [timeLeft, setTimeLeft] = useState(0);
  const [phase, setPhase] = useState("");
  const [breathPhase, setBreathPhase] = useState(0);
  const timerRef = useRef<any>(null);

  // Meditation
  const [medActive, setMedActive] = useState(false);
  const [medTimeLeft, setMedTimeLeft] = useState(0);
  const [currentMed, setCurrentMed] = useState(null);
  const medRef = useRef<any>(null);

  // Journal
  const [journalText, setJournalText] = useState("");
  const [journalSaved, setJournalSaved] = useState(false);
  const [journals, setJournals] = useState([]);

  // Yoga
  const [yogaActive, setYogaActive] = useState(false);
  const [yogaTimeLeft, setYogaTimeLeft] = useState(0);
  const [currentYoga, setCurrentYoga] = useState<any>(null);
  const yogaRef = useRef<any>(null);

  useEffect(() => { if (defaultTab) setActiveTab(defaultTab); }, [defaultTab]);

  const BREATHING_CONFIGS = {
    box: { title: "Box Breathing (4-4-4-4)", phases: ["Inhale", "Hold", "Exhale", "Hold"], durations: [4, 4, 4, 4] },
    "478": { title: "4-7-8 Breathing", phases: ["Inhale", "Hold", "Exhale"], durations: [4, 7, 8] },
    nostril: { title: "Alternate Nostril", phases: ["Inhale (Left)", "Exhale (Right)", "Inhale (Right)", "Exhale (Left)"], durations: [4, 4, 4, 4] },
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

  const startMeditation = (med: any) => {
    setCurrentMed(med); setMedTimeLeft(med.duration * 60); setMedActive(true);
    medRef.current = setInterval(() => setMedTimeLeft((p: number) => { if (p <= 1) { clearInterval(medRef.current); setMedActive(false); return 0; } return p - 1; }), 1000);
  };
  const stopMeditation = () => { clearInterval(medRef.current); setMedActive(false); };

  const startYoga = (yoga: any) => {
    setCurrentYoga(yoga); setYogaTimeLeft(yoga.duration * 60); setYogaActive(true);
    yogaRef.current = setInterval(() => setYogaTimeLeft((p: number) => { if (p <= 1) { clearInterval(yogaRef.current); setYogaActive(false); return 0; } return p - 1; }), 1000);
  };
  const stopYoga = () => { clearInterval(yogaRef.current); setYogaActive(false); };

  const formatTime = (sec: number) => `${Math.floor(sec / 60)}:${(sec % 60) < 10 ? "0" : ""}${sec % 60}`;

  const saveJournal = () => {
    if (!journalText.trim()) return;
    setJournals(p => [{ id: Date.now(), content: journalText, created_at: new Date().toISOString() }, ...p]);
    setJournalText(""); setJournalSaved(true); setTimeout(() => setJournalSaved(false), 2000);
  };

  const breathColors = ["#00bbf9", "#9b5de5", "#f15bb5", "#9b5de5"];
  const MEDITATIONS = [
    { title: "Body Scan Meditation", duration: 15, desc: "Progressively relax each part of your body", icon: "🧘" },
    { title: "Guided Meditation", duration: 10, desc: "Cultivate compassion for yourself and others", icon: "🌄" },
    { title: "Mindfulness Meditation", duration: 5, desc: "Focus purely on the rhythm of your breath", icon: "🌬️" },
  ];
  const SOUNDS = [
    { title: "Forest Birds", icon: "🌿", color: "#00f5d4" },
    { title: "Gentle Water Stream", icon: "💧", color: "#00bbf9" },
    { title: "Soft Rain Ambience", icon: "🌧️", color: "#9b5de5" },
    { title: "Light Piano", icon: "🎹", color: "#a89bc2" },
    { title: "Ocean Waves", icon: "🌊", color: "#06b6d4" },
    { title: "White Noise", icon: "📻", color: "#6366f1" },
    { title: "Yoga Nidra", icon: "🧘", color: "#f15bb5" },
  ];

  const YOGA_POSES = [
    { title: "Sun Salutation", duration: 5, desc: "A flowing sequence to warm up the body", icon: "☀️" },
    { title: "Downward Dog", duration: 2, desc: "Stretch hamstrings and calves, strengthen arms", icon: "🐕" },
    { title: "Child's Pose", duration: 3, desc: "A resting pose to gently stretch the lower back", icon: "👶" },
    { title: "Tree Pose", duration: 2, desc: "Improve balance and focus", icon: "🌳" },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="pt-24 pb-12 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="page-title text-3xl font-bold mb-2">🧘 Wellness </div>
          <div className="text-muted-foreground mb-8">Guided exercises for mental and physical wellbeing</div>

          <div className="flex flex-wrap gap-2 mb-8 bg-card/30 p-1.5 rounded-xl border border-border inline-flex">
            {[{ id: "breathing", label: "💨 Breathing" }, { id: "meditation", label: "🧘 Meditation" }, { id: "yoga", label: "🧘‍♀️ Yoga" }, { id: "sounds", label: "🎵 Sounds" }, { id: "sleep", label: "😴 Sleep" }, { id: "journal", label: "📓 Journal" }].map(t => (
              <button
                key={t.id}
                className={`px-4 py-2 rounded-lg font-medium transition-all ${activeTab === t.id ? "bg-primary text-primary-foreground shadow-lg" : "text-muted-foreground hover:bg-muted/50"}`}
                onClick={() => setActiveTab(t.id)}
              >
                {t.label}
              </button>
            ))}
          </div>

          <div className="glass-card rounded-2xl p-8 border-border/50">
            {/* BREATHING */}
            {activeTab === "breathing" && (
              <div style={{ maxWidth: 520, margin: "0 auto" }}>
                <div className="text-center">
                  <div style={{ display: "flex", gap: 8, justifyContent: "center", marginBottom: 14 }}>
                    {["box", "478", "nostril"].map(type => (
                      <button key={type} className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${breathingType === type ? "bg-primary text-primary-foreground" : "bg-secondary text-secondary-foreground hover:bg-secondary/80"}`}
                        onClick={() => { setBreathingType(type); stopBreathing(); }}>
                        {type === "box" ? "4-4-4-4" : type === "478" ? "4-7-8" : "Nostril"}
                      </button>
                    ))}
                  </div>
                  <div style={{ fontWeight: 800, fontSize: 18, marginBottom: 4 }}>{BREATHING_CONFIGS[breathingType as keyof typeof BREATHING_CONFIGS].title}</div>
                  <div style={{ color: "var(--muted-foreground)", fontSize: 14, marginBottom: 24 }}>Calm your nervous system with controlled breathing</div>
                  <div style={{ position: "relative", display: "inline-flex", marginBottom: 28, alignItems: "center", justifyContent: "center", width: 160, height: 160 }}>
                    {timerActive && <div style={{ position: "absolute", inset: -14, borderRadius: "50%", border: `3px solid ${breathColors[breathPhase % breathColors.length]}`, animation: "pulse-ring 1s ease-out infinite", opacity: 0.5 }} />}
                    <div className="w-full h-full rounded-full flex flex-col items-center justify-center border-4" style={{ borderColor: timerActive ? breathColors[breathPhase % breathColors.length] : "rgba(155,93,229,0.3)", boxShadow: timerActive ? `0 0 40px ${breathColors[breathPhase % breathColors.length]}44` : "none" }}>
                      <div style={{ fontSize: timerActive ? 48 : 34, fontWeight: 'bold' }}>{timerActive ? timeLeft : BREATHING_CONFIGS[breathingType as keyof typeof BREATHING_CONFIGS].durations[0]}</div>
                      <div style={{ fontSize: 12, color: timerActive ? breathColors[breathPhase % breathColors.length] : "var(--muted-foreground)", fontWeight: 700, textTransform: "uppercase" }}>{timerActive ? phase : "seconds"}</div>
                    </div>
                  </div>
                  {timerActive && (
                    <div style={{ marginBottom: 24 }}>
                      <div style={{ fontSize: 18, fontWeight: 800, color: breathColors[breathPhase % breathColors.length] }}>{phase}</div>
                      <div style={{ display: "flex", justifyContent: "center", gap: 7, marginTop: 10 }}>
                        {BREATHING_CONFIGS[breathingType as keyof typeof BREATHING_CONFIGS].phases.map((_, i) => (
                          <div key={i} style={{ width: 10, height: 10, borderRadius: "50%", background: i === breathPhase ? breathColors[i % breathColors.length] : "rgba(150,150,150,0.2)" }} />
                        ))}
                      </div>
                    </div>
                  )}
                  <div style={{ display: "flex", gap: 8, justifyContent: "center" }}>
                    {!timerActive
                      ? <button className="px-6 py-2.5 bg-primary text-primary-foreground font-semibold rounded-lg hover:opacity-90 transition-opacity" onClick={startBreathing}>🌬️ Start Breathing</button>
                      : <button className="px-6 py-2.5 bg-destructive text-destructive-foreground font-semibold rounded-lg hover:opacity-90 transition-opacity" onClick={stopBreathing}>⏹ Stop</button>}
                  </div>

                  <div className="h-px bg-border my-8" />

                  <div style={{ display: "grid", gridTemplateColumns: `repeat(${BREATHING_CONFIGS[breathingType as keyof typeof BREATHING_CONFIGS].phases.length},1fr)`, gap: 10 }}>
                    {BREATHING_CONFIGS[breathingType as keyof typeof BREATHING_CONFIGS].phases.map((p, i) => (
                      <div key={i} style={{ textAlign: "center" }}>
                        <div style={{ fontSize: 22, fontWeight: 900, color: breathColors[i % breathColors.length] }}>{BREATHING_CONFIGS[breathingType as keyof typeof BREATHING_CONFIGS].durations[i]}s</div>
                        <div style={{ fontSize: 11, color: "var(--muted-foreground)", fontWeight: 600 }}>{p}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* MEDITATION */}
            {activeTab === "meditation" && (
              <div style={{ maxWidth: 680, margin: "0 auto" }}>
                {!medActive ? (
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                    {MEDITATIONS.map((m, i) => (
                      <div className="bg-card border border-border p-6 rounded-2xl flex flex-col items-center text-center hover:border-primary/50 transition-colors" key={i}>
                        <div style={{ fontSize: 42, marginBottom: 12 }}>{m.icon}</div>
                        <div style={{ fontWeight: 800, fontSize: 16, marginBottom: 6 }}>{m.title}</div>
                        <div style={{ fontSize: 13, color: "var(--muted-foreground)", marginBottom: 16, flex: 1 }}>{m.desc}</div>
                        <button className="px-5 py-2 bg-primary/10 text-primary font-semibold rounded-lg hover:bg-primary/20 w-full" onClick={() => startMeditation(m)}>▶ Begin ({m.duration} min)</button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-10">
                    <div style={{ fontSize: 64 }}>{currentMed.icon}</div>
                    <div style={{ fontWeight: 800, fontSize: 24, marginTop: 12 }}>{currentMed.title}</div>
                    <div style={{ color: "var(--muted-foreground)", marginBottom: 24, fontSize: 15 }}>Stay relaxed and follow your breath</div>
                    <div className="text-5xl font-bold text-primary mb-8">{formatTime(medTimeLeft)}</div>
                    <button className="px-6 py-2.5 bg-destructive text-destructive-foreground font-semibold rounded-lg hover:opacity-90" onClick={stopMeditation}>⏹ Stop Meditation</button>
                  </div>
                )}
              </div>
            )}

            {/* YOGA */}
            {activeTab === "yoga" && (
              <div style={{ maxWidth: 680, margin: "0 auto" }}>
                {!yogaActive ? (
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                    {YOGA_POSES.map((y, i) => (
                      <div className="bg-card border border-border p-6 rounded-2xl flex flex-col items-center text-center hover:border-primary/50 transition-colors" key={i}>
                        <div style={{ fontSize: 42, marginBottom: 12 }}>{y.icon}</div>
                        <div style={{ fontWeight: 800, fontSize: 16, marginBottom: 6 }}>{y.title}</div>
                        <div style={{ fontSize: 13, color: "var(--muted-foreground)", marginBottom: 16, flex: 1 }}>{y.desc}</div>
                        <button className="px-5 py-2 bg-primary/10 text-primary font-semibold rounded-lg hover:bg-primary/20 w-full" onClick={() => startYoga(y)}>▶ Start ({y.duration} min)</button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-10">
                    <div style={{ fontSize: 64 }}>{currentYoga.icon}</div>
                    <div style={{ fontWeight: 800, fontSize: 24, marginTop: 12 }}>{currentYoga.title}</div>
                    <div style={{ color: "var(--muted-foreground)", marginBottom: 24, fontSize: 15 }}>Follow the posture and breathe deeply</div>
                    <div className="text-5xl font-bold text-primary mb-8">{formatTime(yogaTimeLeft)}</div>
                    <button className="px-6 py-2.5 bg-destructive text-destructive-foreground font-semibold rounded-lg hover:opacity-90" onClick={stopYoga}>⏹ Stop Yoga</button>
                  </div>
                )}
              </div>
            )}

            {/* SOUNDS */}
            {activeTab === "sounds" && (
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: 16 }}>
                {SOUNDS.map((s, i) => (
                  <div key={i} className="bg-card border border-border p-6 rounded-2xl flex flex-col items-center text-center hover:shadow-lg transition-all cursor-pointer"
                    onMouseEnter={e => e.currentTarget.style.borderColor = `${s.color}55`}
                    onMouseLeave={e => e.currentTarget.style.borderColor = "var(--border)"}>
                    <div style={{ fontSize: 42, marginBottom: 12 }}>{s.icon}</div>
                    <div style={{ fontWeight: 700, fontSize: 14, marginBottom: 14 }}>{s.title}</div>
                    <button className="px-4 py-1.5 rounded-full font-medium text-sm w-full" style={{ background: `${s.color}22`, color: s.color, border: `1px solid ${s.color}44` }}>▶ Play</button>
                  </div>
                ))}
              </div>
            )}

            {/* SLEEP */}
            {activeTab === "sleep" && (
              <div style={{ maxWidth: 600, margin: "0 auto" }}>
                <div className="text-center mb-8">
                  <div style={{ fontSize: 56 }}>🌙</div>
                  <h2 style={{ fontWeight: 800, fontSize: 24, marginTop: 8 }}>Night Routine</h2>
                  <p style={{ color: "var(--muted-foreground)", fontSize: 14 }}>Simple habits to help you sleep better</p>
                </div>
                <div className="space-y-4">
                  {[
                    { icon: "📵", title: "Avoid Screens", desc: "Stay away from phone and TV at least 30 mins before sleep" },
                    { icon: "🛏️", title: "Prepare Your Bed", desc: "Keep your bed clean and your room slightly cool" },
                    { icon: "🫖", title: "Drink Something Warm", desc: "Have warm milk or herbal tea to relax your body" },
                    { icon: "📖", title: "Light Reading", desc: "Read a calming book to slow down your thoughts" },
                    { icon: "🌬️", title: "Slow Breathing", desc: "Take deep, slow breaths to relax your mind and body" },
                    { icon: "🌌", title: "Clear Your Mind", desc: "Let go of overthinking — you can handle tomorrow" },
                    { icon: "💤", title: "Sleep Consistently", desc: "Try to sleep and wake up at the same time every day" },
                  ].map((item, i) => (
                    <div key={i} className="flex gap-4 p-4 rounded-xl bg-card border border-border hover:border-primary/30 transition-colors">
                      <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-2xl flex-shrink-0">{item.icon}</div>
                      <div>
                        <div className="font-bold text-foreground mb-1">{item.title}</div>
                        <div className="text-sm text-muted-foreground">{item.desc}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* JOURNAL */}
            {activeTab === "journal" && (
              <div style={{ maxWidth: 640, margin: "0 auto" }}>
                <div className="bg-card border border-border rounded-2xl p-6 mb-8">
                  <div className="font-bold text-lg mb-4 flex items-center gap-2">✍️ New Entry</div>
                  <textarea
                    className="w-full bg-background border border-border rounded-xl p-4 text-foreground focus:ring-2 focus:ring-primary outline-none transition-all resize-none mb-4"
                    style={{ minHeight: 140 }}
                    placeholder="What's on your mind today? Write freely..."
                    value={journalText}
                    onChange={e => setJournalText(e.target.value)}
                  />
                  <div className="flex justify-end">
                    <button className="px-6 py-2.5 bg-primary text-primary-foreground font-semibold rounded-lg hover:opacity-90" onClick={saveJournal}>
                      {journalSaved ? "✅ Saved!" : "💾 Save Entry"}
                    </button>
                  </div>
                </div>

                {journals.length > 0 && (
                  <div className="space-y-4">
                    <div className="font-bold text-lg mb-4">📚 Past Entries</div>
                    {journals.map((j: any) => (
                      <div className="bg-card border border-border rounded-xl p-5" key={j.id}>
                        <div className="text-xs text-muted-foreground mb-3 font-medium">
                          {new Date(j.created_at).toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" })}
                        </div>
                        <div className="text-sm leading-relaxed whitespace-pre-wrap">{j.content}</div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Wellness;
