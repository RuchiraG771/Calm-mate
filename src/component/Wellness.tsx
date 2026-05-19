import { useState, useEffect, useRef } from "react";
import { useSearchParams, useNavigate, Link } from "react-router-dom";
import Navbar from "./Navbar";
import { getActivitySequence, updateActivitySequenceIndex, clearActivitySequence, getTabFromSuggestion, getAnalysisDetailsFromScore, addUserPoints } from "@/lib/utils";
import { CheckCircle, ArrowRight, Home, Sparkles, ArrowLeft, Play, Pause, Volume2, Heart, SkipForward, SkipBack } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import { auth } from "@/lib/firebase";
import { saveHistory } from "@/lib/historyService";

function Wellness({ defaultTab: propDefaultTab }: any) {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const queryTab = searchParams.get("tab");
  
  const [activeTab, setActiveTab] = useState(queryTab || propDefaultTab || "breathing");
  const [sequence, setSequence] = useState<any>(getActivitySequence());
  const [isCompleted, setIsCompleted] = useState(false);

  // Sync tab with URL
  useEffect(() => {
    if (queryTab && queryTab !== activeTab) {
      setActiveTab(queryTab);
    }
  }, [queryTab]);

  useEffect(() => {
    setSearchParams({ tab: activeTab });
  }, [activeTab]);

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
  const [currentMed, setCurrentMed] = useState<any>(null);
  const medRef = useRef<any>(null);

  // Journal
  const [journalText, setJournalText] = useState("");
  const [journalSaved, setJournalSaved] = useState(false);
  const [journals, setJournals] = useState<any[]>([]);

  // Yoga
  const [yogaActive, setYogaActive] = useState(false);
  const [yogaTimeLeft, setYogaTimeLeft] = useState(0);
  const [currentYoga, setCurrentYoga] = useState<any>(null);
  const yogaRef = useRef<any>(null);

  const BREATHING_CONFIGS = {
    box: { title: "Box Breathing (4-4-4-4)", phases: ["Inhale", "Hold", "Exhale", "Hold"], durations: [4, 4, 4, 4] },
    "478": { title: "4-7-8 Breathing", phases: ["Inhale", "Hold", "Exhale"], durations: [4, 7, 8] },
    nostril: { title: "Alternate Nostril", phases: ["Inhale (Left)", "Exhale (Right)", "Inhale (Right)", "Exhale (Left)"], durations: [4, 4, 4, 4] },
  };

  const startBreathing = () => {
    const cfg = BREATHING_CONFIGS[breathingType as keyof typeof BREATHING_CONFIGS];
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

  const handleDone = () => {
    if (!sequence) return;
    const nextIndex = sequence.currentIndex + 1;
    if (nextIndex < sequence.suggestions.length) {
      const nextSuggestion = sequence.suggestions[nextIndex];
      const nextTab = getTabFromSuggestion(nextSuggestion);
      updateActivitySequenceIndex(nextIndex);
      setSequence({ ...sequence, currentIndex: nextIndex });
      setActiveTab(nextTab);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      setIsCompleted(true);
      
      if (sequence) {
        sessionStorage.setItem("calmmate_last_activity", sequence.suggestions.join(", "));
      }
      clearActivitySequence();
      
      // Award points for completing the session
      addUserPoints(50);
      window.dispatchEvent(new Event("pointsUpdated"));
      
      // Initiate post-activity scan
      navigate("/analysis?mode=post");
    }
  };

  // Sounds logic
  const [playingSound, setPlayingSound] = useState<string | null>(null);
  const [playbackTime, setPlaybackTime] = useState(0);
  const [currentSoundData, setCurrentSoundData] = useState<any>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const playbackIntervalRef = useRef<any>(null);

  const toggleSound = (sound: any) => {
    if (playingSound === sound.title) {
      audioRef.current?.pause();
      setPlayingSound(null);
      setCurrentSoundData(null);
      clearInterval(playbackIntervalRef.current);
    } else {
      if (audioRef.current) {
        audioRef.current.pause();
        clearInterval(playbackIntervalRef.current);
      }
      audioRef.current = new Audio(sound.url);
      audioRef.current.loop = true;
      audioRef.current.play().catch(e => console.error("Error playing audio:", e));
      setPlayingSound(sound.title);
      setCurrentSoundData(sound);
      setPlaybackTime(0);
      
      playbackIntervalRef.current = setInterval(() => {
        if (audioRef.current) {
          setPlaybackTime(audioRef.current.currentTime);
        }
      }, 1000);
    }
  };

  useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
      clearInterval(playbackIntervalRef.current);
    };
  }, []);

  const breathColors = ["#00bbf9", "#9b5de5", "#f15bb5", "#9b5de5"];
  const MEDITATIONS = [
    { title: "Mindfulness Meditation", duration: 5, desc: "Focus purely on the rhythm of your breath", icon: "🌬️" },
    { title: "Guided Meditation", duration: 10, desc: "Cultivate compassion for yourself and others", icon: "🌄" },
    { title: "Body Scan Meditation", duration: 15, desc: "Progressively relax each part of your body", icon: "🧘" },
    { title: "Yoga Nidra", duration: 20, desc: "Deep psychic sleep for profound relaxation", icon: "😴" },
  ];
  const SOUNDS = [
    { title: "Forest Birds", icon: "🌿", color: "#00f5d4", gradient: "from-[#00f5d415] to-[#00f5d405]", shadow: "shadow-[#00f5d420]", url: "https://cdn.pixabay.com/audio/2022/01/18/audio_6108ad597b.mp3" },
    { title: "Gentle Water Stream", icon: "💧", color: "#00bbf9", gradient: "from-[#00bbf915] to-[#00bbf905]", shadow: "shadow-[#00bbf920]", url: "https://cdn.pixabay.com/audio/2022/02/07/audio_64b54e8590.mp3" },
    { title: "Soft Rain Ambience", icon: "🌧️", color: "#9b5de5", gradient: "from-[#9b5de515] to-[#9b5de505]", shadow: "shadow-[#9b5de520]", url: "https://cdn.pixabay.com/audio/2021/09/06/audio_9467657159.mp3" },
    { title: "Light Piano", icon: "🎹", color: "#a89bc2", gradient: "from-[#a89bc215] to-[#a89bc205]", shadow: "shadow-[#a89bc220]", url: "https://cdn.pixabay.com/audio/2022/03/10/audio_c35278d65a.mp3" },
    { title: "Ocean Waves", icon: "🌊", color: "#06b6d4", gradient: "from-[#06b6d415] to-[#06b6d405]", shadow: "shadow-[#06b6d420]", url: "https://cdn.pixabay.com/audio/2021/11/24/audio_1e59276d4a.mp3" },
    { title: "White Noise", icon: "📻", color: "#6366f1", gradient: "from-[#6366f115] to-[#6366f105]", shadow: "shadow-[#6366f120]", url: "https://cdn.pixabay.com/audio/2022/03/15/audio_2e28a6f332.mp3" },
    { title: "Yoga Nidra", icon: "🧘", color: "#f15bb5", gradient: "from-[#f15bb515] to-[#f15bb505]", shadow: "shadow-[#f15bb520]", url: "https://cdn.pixabay.com/audio/2022/01/21/audio_31b312b921.mp3" },
  ];

  const YOGA_POSES = [
    { title: "Surya Namaskar", duration: 10, desc: "Sun Salutation sequence for energy", icon: "☀️" },
    { title: "Hasya Yoga", duration: 5, desc: "Laughter yoga for mood elevation", icon: "😄" },
    { title: "Vinyasa Flow", duration: 15, desc: "Fluid movement synchronized with breath", icon: "🌊" },
    { title: "Bhastrika Pranayama", duration: 5, desc: "Bellows breath for vitality", icon: "💨" },
    { title: "Tadasana", duration: 3, desc: "Mountain pose for posture and balance", icon: "🏔️" },
    { title: "Vrikshasana", duration: 3, desc: "Tree pose for focus and stability", icon: "🌳" },
    { title: "Balasana", duration: 5, desc: "Child's pose for gentle relaxation", icon: "👶" },
    { title: "Anulom Vilom", duration: 5, desc: "Alternate nostril breathing for balance", icon: "☯️" },
    { title: "Cat-Cow", duration: 5, desc: "Spinal flexibility and stress release", icon: "🐈" },
    { title: "Paschimottanasana", duration: 5, desc: "Seated forward bend for calming the mind", icon: "🧘" },
    { title: "Setu Bandhasana", duration: 5, desc: "Bridge pose for heart opening", icon: "🌉" },
    { title: "Shavasana", duration: 10, desc: "Corpse pose for deep rest", icon: "🛌" },
    { title: "Legs-up-the-wall", duration: 10, desc: "Passive inversion for anxiety relief", icon: "🧱" },
  ];

  if (isCompleted) {
    return (
      <div className="min-h-screen bg-[#0a0a1f] text-white overflow-hidden relative flex flex-col items-center justify-center p-6 text-center">
        {/* Background Particles */}
        <div className="absolute inset-0 pointer-events-none">
          {[...Array(10)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute rounded-full bg-cyan-400/10 blur-3xl"
              style={{ width: 400, height: 400, top: `${Math.random() * 100}%`, left: `${Math.random() * 100}%` }}
              animate={{ opacity: [0.1, 0.3, 0.1], scale: [1, 1.2, 1] }}
              transition={{ duration: 5, repeat: Infinity }}
            />
          ))}
        </div>

        <Navbar />
        
        <motion.div 
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="relative z-10"
        >
          <div className="w-24 h-24 bg-cyan-500/20 border-2 border-cyan-400/30 rounded-[2rem] flex items-center justify-center mb-10 mx-auto shadow-[0_0_50px_rgba(34,211,238,0.2)]">
            <CheckCircle className="w-12 h-12 text-cyan-400" />
          </div>
          
          <h1 className="text-5xl font-black bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-text text-transparent mb-6 uppercase tracking-tighter">
            Mission Complete
          </h1>
          
          <p className="text-cyan-400/60 font-bold text-lg max-w-md mb-12 uppercase tracking-widest leading-relaxed">
            Neural pathways optimized. Your wellness session is archived.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <Button 
              size="lg" 
              className="bg-gradient-to-r from-cyan-500 to-cyan-600 hover:shadow-[0_0_30px_rgba(6,182,212,0.4)] px-10 h-16 text-lg font-black uppercase tracking-widest rounded-2xl transition-all" 
              onClick={() => navigate("/home")}
            >
              <Home className="w-5 h-5 mr-3" /> Dashboard
            </Button>
            <Button 
              size="lg" 
              variant="outline" 
              className="border-white/10 hover:bg-white/5 px-10 h-16 text-lg font-black uppercase tracking-widest rounded-2xl" 
              onClick={() => setIsCompleted(false)}
            >
              Resume Exploration
            </Button>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0a1f] text-white overflow-hidden relative">
      <Navbar />
      
      {/* Background Particles */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full bg-cyan-400/10 blur-xl"
            style={{
              width: Math.random() * 300 + 100,
              height: Math.random() * 300 + 100,
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
            }}
            animate={{
              x: [0, Math.random() * 100 - 50, 0],
              y: [0, Math.random() * 100 - 50, 0],
              scale: [1, 1.2, 1],
            }}
            transition={{
              duration: Math.random() * 10 + 10,
              repeat: Infinity,
              ease: "linear"
            }}
          />
        ))}
      </div>

      <div className="pt-24 pb-32 px-6 relative z-10">
        <div className="max-w-6xl mx-auto">
          {/* Top Header with Indicators */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4">
            <div>
              <motion.h1 
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="text-4xl md:text-5xl font-black bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-text text-transparent mb-2"
              >
                🧘 Wellness
              </motion.h1>
              <p className="text-cyan-400/60 font-medium tracking-wide">Guided exercises for mental and physical wellbeing</p>
            </div>
            
            <div className="flex items-center gap-6 bg-white/5 backdrop-blur-md border border-white/10 p-3 rounded-2xl shadow-2xl">
              <div className="flex gap-1.5 px-3 py-1.5 bg-red-500/10 rounded-full border border-red-500/20">
                <Heart className="w-4 h-4 text-red-500 fill-red-500" />
                <Heart className="w-4 h-4 text-red-500 fill-red-500" />
                <Heart className="w-4 h-4 text-red-500 fill-red-500" />
              </div>
              <div className="flex items-center gap-3">
                <div className="text-right hidden sm:block">
                  <div className="text-xs text-cyan-400/50 uppercase font-bold tracking-tighter leading-none">Student ID</div>
                  <div className="text-sm font-bold text-white tracking-widest leading-tight">CALM-X88</div>
                </div>
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-cyan-500 to-purple-600 border-2 border-white/20 shadow-lg" />
              </div>
            </div>
          </div>

          {sequence && (
            <motion.div 
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-10 p-5 bg-gradient-to-r from-cyan-500/10 to-purple-500/10 backdrop-blur-xl border border-cyan-500/20 rounded-3xl flex items-center justify-between"
            >
              <div className="flex items-center gap-4">
                <div className="p-3 bg-cyan-500/20 rounded-2xl border border-cyan-500/30">
                  <Sparkles className="w-6 h-6 text-cyan-400 animate-pulse" />
                </div>
                <div>
                  <div className="text-[10px] font-black text-cyan-400 uppercase tracking-[0.2em] mb-0.5">AI Guided Session</div>
                  <div className="text-lg font-bold text-white leading-tight">
                    Activity {sequence.currentIndex + 1} <span className="text-white/40 mx-2">/</span> <span className="text-cyan-300">{sequence.suggestions[sequence.currentIndex]}</span>
                  </div>
                </div>
              </div>
              <div className="hidden md:flex items-center gap-2">
                {sequence.suggestions.map((_: any, i: number) => (
                  <motion.div 
                    key={i} 
                    className={`h-2 rounded-full ${i <= sequence.currentIndex ? 'bg-cyan-400 shadow-[0_0_10px_rgba(34,211,238,0.6)]' : 'bg-white/10'}`} 
                    animate={{ width: i === sequence.currentIndex ? 40 : 12 }}
                  />
                ))}
              </div>
            </motion.div>
          )}

          {/* Futuristic Tabs */}
          <div className="flex flex-wrap gap-2 mb-12 p-2 bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl overflow-x-auto no-scrollbar">
            {[
              { id: "breathing", label: "Breathing", icon: "🌬️" },
              { id: "meditation", label: "Meditation", icon: "🧘" },
              { id: "yoga", label: "Yoga", icon: "🧘‍♀️" },
              { id: "diet", label: "Diet Plan", icon: "🍎" },
              { id: "sounds", label: "Sounds", icon: "🎵" },
              { id: "sleep", label: "Sleep", icon: "😴" },
              { id: "journal", label: "Journal", icon: "📓" }
            ].map(t => (
              <button
                key={t.id}
                className={`flex items-center gap-2 px-6 py-3 rounded-xl font-bold transition-all duration-500 whitespace-nowrap ${
                  activeTab === t.id 
                    ? "bg-gradient-to-r from-cyan-500 to-cyan-600 text-white shadow-[0_0_20px_rgba(6,182,212,0.4)] scale-105" 
                    : "text-white/40 hover:text-white/80 hover:bg-white/5"
                }`}
                onClick={() => setActiveTab(t.id)}
              >
                <span className="text-xl">{t.icon}</span>
                <span className="text-sm tracking-wide uppercase">{t.label}</span>
              </button>
            ))}
          </div>

          <div className="relative z-20">
            {/* BREATHING */}
            {activeTab === "breathing" && (
              <div className="max-w-2xl mx-auto py-10">
                {!timerActive ? (
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-12">
                    {Object.entries(BREATHING_CONFIGS).map(([id, cfg]) => (
                      <motion.div
                        key={id}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className={`p-6 rounded-3xl cursor-pointer transition-all border-2 text-center flex flex-col items-center gap-4 ${breathingType === id ? 'bg-cyan-500/20 border-cyan-400 shadow-[0_0_20px_rgba(34,211,238,0.2)]' : 'bg-white/5 border-white/10 hover:bg-white/10'}`}
                        onClick={() => setBreathingType(id)}
                      >
                        <div className="text-3xl">🌬️</div>
                        <div>
                          <div className="text-sm font-black uppercase tracking-widest text-white">{cfg.title.split(' ')[0]}</div>
                          <div className="text-[10px] text-cyan-400 font-bold uppercase tracking-[0.2em]">{cfg.durations.join('-')}</div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                ) : null}

                <div className="relative flex flex-col items-center justify-center p-12 bg-white/5 backdrop-blur-2xl border border-white/10 rounded-[3rem] shadow-2xl overflow-hidden">
                  {timerActive && (
                    <motion.div 
                      className="absolute inset-0 bg-gradient-to-br from-cyan-500/10 to-purple-500/10"
                      animate={{ opacity: [0.3, 0.6, 0.3] }}
                      transition={{ duration: 4, repeat: Infinity }}
                    />
                  )}
                  
                  <div className="relative z-10 flex flex-col items-center">
                    <motion.div
                      className="w-64 h-64 rounded-full border-4 border-cyan-400/20 flex items-center justify-center mb-10 relative"
                      animate={timerActive ? {
                        scale: phase === "Inhale" ? 1.4 : phase === "Exhale" ? 1 : 1.2,
                        borderColor: phase === "Inhale" ? "rgba(34,211,238,1)" : "rgba(34,211,238,0.2)"
                      } : {}}
                      transition={{ duration: timerActive ? (BREATHING_CONFIGS[breathingType as keyof typeof BREATHING_CONFIGS].durations[breathPhase]) : 1 }}
                    >
                      {timerActive && (
                        <motion.div 
                          className="absolute inset-0 rounded-full bg-cyan-400/20 blur-2xl"
                          animate={{ scale: [1, 1.2, 1] }}
                          transition={{ duration: 2, repeat: Infinity }}
                        />
                      )}
                      <div className="text-center">
                        <div className="text-sm font-black uppercase tracking-[0.3em] text-cyan-400 mb-2">{phase || "Ready?"}</div>
                        <div className="text-7xl font-black text-white tracking-tighter">{timeLeft || 0}</div>
                      </div>
                    </motion.div>

                    {!timerActive ? (
                      <Button size="lg" className="bg-gradient-to-r from-cyan-500 to-cyan-600 hover:shadow-[0_0_30px_rgba(6,182,212,0.6)] px-12 h-16 text-lg font-black uppercase tracking-widest rounded-2xl" onClick={startBreathing}>
                        Begin Session
                      </Button>
                    ) : (
                      <Button size="lg" variant="outline" className="border-red-500/50 text-red-400 hover:bg-red-500/10 px-12 h-16 text-lg font-black uppercase tracking-widest rounded-2xl" onClick={stopBreathing}>
                        Stop Session
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* MEDITATION */}
            {activeTab === "meditation" && (
              <div className="max-w-4xl mx-auto py-6">
                {!medActive ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    {MEDITATIONS.map((m, i) => (
                      <motion.div
                        key={i}
                        whileHover={{ scale: 1.02, y: -5 }}
                        className="bg-white/5 backdrop-blur-xl border border-white/10 p-8 rounded-[2rem] flex flex-col items-center text-center hover:bg-white/10 transition-all duration-300 group"
                      >
                        <div className="text-6xl mb-6 transform group-hover:scale-110 transition-transform">{m.icon}</div>
                        <h3 className="text-xl font-black text-white mb-3 uppercase tracking-wider">{m.title}</h3>
                        <p className="text-sm text-white/40 mb-8 leading-relaxed px-4">{m.desc}</p>
                        <Button 
                          className="w-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 hover:bg-cyan-500 hover:text-white rounded-xl h-12 font-black uppercase tracking-widest"
                          onClick={() => startMeditation(m)}
                        >
                          Begin {m.duration}m Session
                        </Button>
                      </motion.div>
                    ))}
                  </div>
                ) : (
                  <div className="flex flex-col items-center py-20 bg-white/5 backdrop-blur-3xl border border-white/10 rounded-[3rem]">
                    <div className="text-8xl mb-8 animate-bounce">{currentMed.icon}</div>
                    <h2 className="text-3xl font-black text-white uppercase tracking-widest mb-2">{currentMed.title}</h2>
                    <p className="text-cyan-400/60 font-bold mb-10 uppercase tracking-widest">Follow the guidance</p>
                    <div className="text-8xl font-black text-white tracking-tighter mb-12 tabular-nums">
                      {formatTime(medTimeLeft)}
                    </div>
                    <Button 
                      size="lg" 
                      variant="outline" 
                      className="border-red-500/30 text-red-400 hover:bg-red-500/10 px-12 h-16 text-lg font-black uppercase tracking-widest rounded-2xl" 
                      onClick={stopMeditation}
                    >
                      End Meditation
                    </Button>
                  </div>
                )}
              </div>
            )}

            {/* YOGA */}
            {activeTab === "yoga" && (
              <div className="max-w-5xl mx-auto py-6">
                {!yogaActive ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {YOGA_POSES.map((y, i) => (
                      <motion.div
                        key={i}
                        whileHover={{ scale: 1.02 }}
                        className="bg-white/5 backdrop-blur-xl border border-white/10 p-6 rounded-[2rem] flex flex-col items-center text-center hover:bg-white/10 transition-all duration-300"
                      >
                        <div className="text-5xl mb-4">{y.icon}</div>
                        <h3 className="text-md font-black text-white mb-2 uppercase tracking-wide">{y.title}</h3>
                        <p className="text-xs text-white/30 mb-6 flex-1">{y.desc}</p>
                        <Button 
                          className="w-full bg-purple-500/10 text-purple-400 border border-purple-500/20 hover:bg-purple-500 hover:text-white rounded-xl h-10 text-xs font-black uppercase tracking-widest"
                          onClick={() => startYoga(y)}
                        >
                          Start {y.duration}m
                        </Button>
                      </motion.div>
                    ))}
                  </div>
                ) : (
                  <div className="flex flex-col items-center py-20 bg-white/5 backdrop-blur-3xl border border-white/10 rounded-[3rem]">
                    <div className="text-8xl mb-8 animate-pulse">{currentYoga.icon}</div>
                    <h2 className="text-3xl font-black text-white uppercase tracking-widest mb-2">{currentYoga.title}</h2>
                    <p className="text-purple-400/60 font-bold mb-10 uppercase tracking-widest">Hold the posture</p>
                    <div className="text-8xl font-black text-white tracking-tighter mb-12 tabular-nums">
                      {formatTime(yogaTimeLeft)}
                    </div>
                    <Button 
                      size="lg" 
                      variant="outline" 
                      className="border-red-500/30 text-red-400 hover:bg-red-500/10 px-12 h-16 text-lg font-black uppercase tracking-widest rounded-2xl" 
                      onClick={stopYoga}
                    >
                      Cancel Session
                    </Button>
                  </div>
                )}
              </div>
            )}

            {/* SOUNDS */}
            {activeTab === "sounds" && (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {SOUNDS.map((s, i) => (
                  <motion.div
                    key={i}
                    whileHover={{ scale: 1.05, y: -5 }}
                    whileTap={{ scale: 0.95 }}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.1 }}
                    className={`relative group bg-white/5 backdrop-blur-2xl border border-white/10 p-8 rounded-[2.5rem] flex flex-col items-center text-center cursor-pointer overflow-hidden transition-all duration-500 ${playingSound === s.title ? `ring-2 ring-cyan-400 ${s.shadow}` : ''}`}
                    onClick={() => toggleSound(s)}
                  >
                    {/* Card Glow Effect */}
                    <div className={`absolute inset-0 bg-gradient-to-br ${s.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
                    
                    <div className="relative z-10">
                      <div className="text-6xl mb-6 transform group-hover:scale-110 transition-transform duration-500">{s.icon}</div>
                      <h3 className="text-lg font-bold text-white mb-6 tracking-tight">{s.title}</h3>
                      
                      <div className="flex flex-col items-center gap-4">
                        {playingSound === s.title ? (
                          <div className="flex items-center gap-1 h-8">
                            {[...Array(5)].map((_, i) => (
                              <motion.div
                                key={i}
                                className="w-1 bg-cyan-400 rounded-full"
                                animate={{ height: [8, 24, 12, 20, 8] }}
                                transition={{ duration: 0.8, repeat: Infinity, delay: i * 0.1 }}
                              />
                            ))}
                          </div>
                        ) : (
                          <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center group-hover:bg-cyan-500 group-hover:shadow-[0_0_20px_rgba(6,182,212,0.6)] transition-all duration-300">
                            <Play className="w-5 h-5 text-white" />
                          </div>
                        )}
                        
                        <div className={`text-[10px] font-black uppercase tracking-[0.2em] ${playingSound === s.title ? 'text-cyan-400' : 'text-white/20'}`}>
                          {playingSound === s.title ? 'Now Streaming' : 'Listen Now'}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}

            {/* SLEEP */}
            {activeTab === "sleep" && (
              <div className="max-w-3xl mx-auto py-6">
                <div className="text-center mb-12">
                  <div className="text-7xl mb-4 drop-shadow-[0_0_20px_rgba(255,255,255,0.3)]">🌙</div>
                  <h2 className="text-3xl font-black text-white uppercase tracking-widest mb-2">Optimal Night Routine</h2>
                  <p className="text-white/40 font-bold text-xs uppercase tracking-[0.3em]">Reprogram your circadian rhythm</p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {[
                    { icon: "📵", title: "Zero Digital Entry", desc: "No screens 45m before rest", glow: "shadow-blue-500/20" },
                    { icon: "🛏️", title: "Cold Sanctuary", desc: "Keep environment at 18-20°C", glow: "shadow-purple-500/20" },
                    { icon: "🫖", title: "Warm Magnesium", desc: "Herbal infusion or warm bath", glow: "shadow-cyan-500/20" },
                    { icon: "📖", title: "Paper Flow", desc: "Physical books only — no blue light", glow: "shadow-indigo-500/20" },
                    { icon: "🌬️", title: "Vagal Stimulation", desc: "Slow exhales to trigger parasympathetic", glow: "shadow-teal-500/20" },
                    { icon: "🌌", title: "Mind Dump", desc: "Release today's logic to the void", glow: "shadow-violet-500/20" },
                    { icon: "💤", title: "Circadian Lock", desc: "Sleep/wake at the same micro-time", glow: "shadow-pink-500/20" },
                  ].map((item, i) => (
                    <motion.div 
                      key={i} 
                      whileHover={{ x: 10 }}
                      className={`flex gap-6 p-6 rounded-[2rem] bg-white/5 border border-white/10 hover:bg-white/10 transition-all ${item.glow} shadow-xl`}
                    >
                      <div className="w-14 h-14 rounded-2xl bg-white/5 flex items-center justify-center text-3xl flex-shrink-0 border border-white/10">{item.icon}</div>
                      <div>
                        <div className="font-black text-white text-sm uppercase tracking-widest mb-1">{item.title}</div>
                        <div className="text-xs text-white/40 leading-relaxed">{item.desc}</div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            )}

            {/* DIET */}
            {activeTab === "diet" && (
              <div className="max-w-4xl mx-auto py-6">
                <div className="text-center mb-12">
                  <div className="text-7xl mb-4 drop-shadow-[0_0_20px_rgba(255,255,255,0.3)]">🥗</div>
                  <h2 className="text-3xl font-black text-white uppercase tracking-widest mb-2">Bio-Fuel Recommendations</h2>
                  <p className="text-white/40 font-bold text-xs uppercase tracking-[0.3em]">Fuel your cognitive performance</p>
                </div>
                
                {sequence && (
                  <motion.div 
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="bg-gradient-to-br from-cyan-500/20 to-purple-600/20 backdrop-blur-2xl border-2 border-cyan-400/30 rounded-[2.5rem] p-10 mb-12 text-center relative overflow-hidden"
                  >
                    <div className="absolute top-0 right-0 p-4 opacity-10"><Sparkles className="w-20 h-20" /></div>
                    <div className="text-[10px] font-black text-cyan-400 uppercase tracking-[0.4em] mb-4">Precision Bio-Insight</div>
                    <div className="text-2xl font-black text-white italic leading-tight">
                      "{getAnalysisDetailsFromScore(sequence.score).dietPlan}"
                    </div>
                  </motion.div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {[
                    { level: "Peak Performance", score: "0-20", plan: "Fresh fruits, brain-boosting nuts, whole grains. Hydration: Coconut water.", color: "text-cyan-400", glow: "shadow-cyan-500/10", bg: "bg-cyan-500/5" },
                    { level: "Steady Calm", score: "21-40", plan: "Steamed greens, warm oats, tulsi infusions. Omega-3: Walnuts & flax.", color: "text-green-400", glow: "shadow-green-500/10", bg: "bg-green-500/5" },
                    { level: "Neutral Balance", score: "41-60", plan: "Complex carbs (Sweet potato), proteins (Dal), almonds. Low caffeine.", color: "text-yellow-400", glow: "shadow-yellow-500/10", bg: "bg-yellow-500/5" },
                    { level: "Deep Recovery", score: "61-100", plan: "Turmeric elixirs, anti-inflammatory blueberries, magnesium-rich spinach.", color: "text-purple-400", glow: "shadow-purple-500/10", bg: "bg-purple-500/5" }
                  ].map((d, i) => (
                    <div key={i} className={`p-8 rounded-[2rem] border border-white/10 ${d.bg} ${d.glow} shadow-2xl backdrop-blur-md`}>
                      <div className="flex justify-between items-center mb-4">
                        <div className={`font-black text-xs uppercase tracking-widest ${d.color}`}>{d.level}</div>
                        <div className="text-[10px] text-white/20 font-bold tracking-widest">SCORE {d.score}</div>
                      </div>
                      <div className="text-white/80 leading-relaxed font-bold text-sm tracking-wide">{d.plan}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* JOURNAL */}
            {activeTab === "journal" && (
              <div className="max-w-4xl mx-auto py-6">
                <div className="bg-white/5 backdrop-blur-2xl border border-white/10 rounded-[3rem] p-10 mb-12 shadow-2xl">
                  <div className="font-black text-xl text-white uppercase tracking-[0.2em] mb-8 flex items-center gap-4">
                    <div className="w-10 h-10 bg-cyan-500/20 rounded-xl flex items-center justify-center text-xl">✍️</div>
                    Digital Consciousness Log
                  </div>
                  <textarea
                    className="w-full bg-white/5 border border-white/10 rounded-3xl p-8 text-white text-lg placeholder:text-white/10 focus:ring-2 focus:ring-cyan-500/50 outline-none transition-all resize-none mb-8 font-medium leading-relaxed"
                    style={{ minHeight: 250 }}
                    placeholder="Log your neural state or current thoughts..."
                    value={journalText}
                    onChange={e => setJournalText(e.target.value)}
                  />
                  <div className="flex justify-between items-center">
                    <div className="text-white/20 text-xs font-bold uppercase tracking-widest">End-to-end local encryption active</div>
                    <Button 
                      size="lg" 
                      className="bg-cyan-500 hover:bg-cyan-400 text-white font-black uppercase tracking-widest px-10 h-14 rounded-2xl shadow-[0_0_30px_rgba(6,182,212,0.3)]" 
                      onClick={saveJournal}
                    >
                      {journalSaved ? "✅ Log Saved" : "Archive Entry"}
                    </Button>
                  </div>
                </div>

                {journals.length > 0 && (
                  <div className="space-y-6">
                    <div className="font-black text-sm text-white/40 uppercase tracking-[0.4em] mb-8 text-center">Previous Consciousness Archives</div>
                    {journals.map((j: any) => (
                      <motion.div 
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="bg-white/5 backdrop-blur-md border border-white/10 rounded-[2rem] p-8 hover:bg-white/10 transition-colors" 
                        key={j.id}
                      >
                        <div className="flex justify-between items-start mb-6">
                          <div className="text-[10px] text-cyan-400 font-black uppercase tracking-widest py-1 px-3 bg-cyan-400/10 rounded-full border border-cyan-400/20">
                            {new Date(j.created_at).toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" })}
                          </div>
                          <div className="text-[10px] text-white/20 font-bold uppercase tracking-widest">NODE-ID: {j.id.toString().slice(-6)}</div>
                        </div>
                        <div className="text-white/80 leading-relaxed font-medium whitespace-pre-wrap">{j.content}</div>
                      </motion.div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Done Button for Sequence */}
            {sequence && (
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-16 pt-12 border-t border-white/5 flex flex-col items-center gap-6"
              >
                <Button 
                  size="lg" 
                  className="bg-gradient-to-r from-cyan-500 to-purple-600 hover:shadow-[0_0_40px_rgba(34,211,238,0.4)] px-12 h-16 text-lg font-black uppercase tracking-[0.2em] rounded-2xl transition-all duration-500 hover:scale-105" 
                  onClick={handleDone}
                >
                  {sequence.currentIndex === sequence.suggestions.length - 1 ? (
                    <>Complete Mission <Sparkles className="w-6 h-6 ml-3" /></>
                  ) : (
                    <>Next Neural State <ArrowRight className="w-6 h-6 ml-3" /></>
                  )}
                </Button>
                <div className="text-[10px] text-white/20 font-black uppercase tracking-[0.3em]">Neural optimization in progress</div>
              </motion.div>
            )}

            {!sequence && (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="mt-16 flex justify-center"
              >
                <Button 
                  variant="ghost" 
                  onClick={() => navigate("/home")} 
                  className="text-white/30 hover:text-cyan-400 hover:bg-cyan-400/5 px-8 h-12 rounded-xl transition-all"
                >
                  <ArrowLeft className="w-4 h-4 mr-2" /> Abort and Return to Dashboard
                </Button>
              </motion.div>
            )}
          </div>
        </div>
      </div>

      {/* Now Playing Floating Bar */}
      <AnimatePresence>
        {currentSoundData && (
          <motion.div
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50 w-[90%] max-w-4xl"
          >
            <div className="bg-white/10 backdrop-blur-2xl border border-white/20 rounded-[2rem] p-4 shadow-[0_20px_50px_rgba(0,0,0,0.5)] flex items-center gap-6 overflow-hidden">
              {/* Progress Line */}
              <div className="absolute top-0 left-0 h-1 w-full bg-white/5">
                <motion.div 
                  className="h-full bg-gradient-to-r from-cyan-400 to-purple-500" 
                  initial={{ width: 0 }}
                  animate={{ width: `${(playbackTime % 300) / 3}%` }} 
                  transition={{ duration: 1, ease: "linear" }}
                />
              </div>
              
              <div className="flex items-center gap-4 flex-1">
                <div className="w-12 h-12 bg-gradient-to-br from-cyan-400 to-purple-600 rounded-2xl flex items-center justify-center text-2xl shadow-lg">
                  {currentSoundData.icon}
                </div>
                <div className="min-w-0">
                  <h4 className="text-sm font-black text-white tracking-wide truncate uppercase">{currentSoundData.title}</h4>
                  <div className="flex items-center gap-2">
                    <div className="flex gap-0.5">
                      {[...Array(4)].map((_, i) => (
                        <div key={i} className="w-1 h-3 bg-cyan-400/30 rounded-full overflow-hidden">
                          <motion.div 
                            className="w-full bg-cyan-400"
                            animate={{ height: ['20%', '100%', '20%'] }}
                            transition={{ duration: 0.5, repeat: Infinity, delay: i * 0.1 }}
                          />
                        </div>
                      ))}
                    </div>
                    <span className="text-[10px] text-cyan-400/60 font-bold uppercase tracking-widest">Ambient Flow</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <button className="text-white/40 hover:text-white transition-colors"><SkipBack className="w-5 h-5" /></button>
                <button 
                  onClick={() => toggleSound(currentSoundData)}
                  className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-xl hover:scale-110 transition-transform"
                >
                  <Pause className="w-6 h-6 text-[#0a0a1f] fill-[#0a0a1f]" />
                </button>
                <button className="text-white/40 hover:text-white transition-colors"><SkipForward className="w-5 h-5" /></button>
              </div>

              <div className="hidden md:flex items-center gap-4 pl-6 border-l border-white/10">
                <div className="text-right">
                  <div className="text-[10px] text-white/30 font-black uppercase tracking-widest">Session Time</div>
                  <div className="text-sm font-mono font-bold text-white tracking-wider">{formatTime(Math.floor(playbackTime))}</div>
                </div>
                <Volume2 className="w-5 h-5 text-white/40" />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default Wellness;
