import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Play, Pause, RotateCcw, Wind } from "lucide-react";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/Navbar";

type Phase = "inhale" | "hold" | "exhale" | "idle";

const PHASES: { phase: Phase; duration: number; label: string }[] = [
  { phase: "inhale", duration: 4, label: "Breathe In" },
  { phase: "hold", duration: 7, label: "Hold" },
  { phase: "exhale", duration: 8, label: "Breathe Out" },
];

const PHASE_COLORS: Record<Phase, string> = {
  inhale: "from-primary/30 to-cyan-500/20",
  hold: "from-primary/20 to-teal-400/10",
  exhale: "from-blue-500/20 to-primary/10",
  idle: "from-primary/10 to-transparent",
};

const Breathing = () => {
  const [isRunning, setIsRunning] = useState(false);
  const [phase, setPhase] = useState<Phase>("idle");
  const [phaseTime, setPhaseTime] = useState(0);
  const [currentPhaseIndex, setCurrentPhaseIndex] = useState(0);
  const [rounds, setRounds] = useState(0);
  const [totalTime, setTotalTime] = useState(0);
  const intervalRef = useRef<number>();

  const currentPhase = PHASES[currentPhaseIndex];
  const progress = isRunning && currentPhase ? (phaseTime / currentPhase.duration) * 100 : 0;

  const circleScale = phase === "inhale" ? 1.4 : phase === "exhale" ? 0.8 : phase === "hold" ? 1.4 : 1;

  const tick = useCallback(() => {
    setPhaseTime((prev) => {
      const currentIdx = currentPhaseIndex;
      const dur = PHASES[currentIdx].duration;
      if (prev + 1 >= dur) {
        // Move to next phase
        const nextIdx = (currentIdx + 1) % PHASES.length;
        setCurrentPhaseIndex(nextIdx);
        setPhase(PHASES[nextIdx].phase);
        if (nextIdx === 0) setRounds((r) => r + 1);
        return 0;
      }
      return prev + 1;
    });
    setTotalTime((t) => t + 1);
  }, [currentPhaseIndex]);

  useEffect(() => {
    if (isRunning) {
      intervalRef.current = window.setInterval(tick, 1000);
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isRunning, tick]);

  const start = () => {
    setIsRunning(true);
    setPhase("inhale");
    setCurrentPhaseIndex(0);
    setPhaseTime(0);
  };

  const pause = () => {
    setIsRunning(false);
  };

  const reset = () => {
    setIsRunning(false);
    setPhase("idle");
    setPhaseTime(0);
    setCurrentPhaseIndex(0);
    setRounds(0);
    setTotalTime(0);
  };

  const formatTime = (s: number) =>
    `${Math.floor(s / 60).toString().padStart(2, "0")}:${(s % 60).toString().padStart(2, "0")}`;

  return (
    <div className="min-h-screen bg-[#0a0a1f] text-white overflow-hidden relative">
      <Navbar />

      {/* Background Particles */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
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

      <div className="pt-24 pb-32 px-6 flex flex-col items-center justify-center min-h-screen relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <h1 className="text-4xl md:text-6xl font-black futuristic-header mb-4 uppercase tracking-tighter">
            Neural <span className="text-white">Respiration</span>
          </h1>
          <p className="text-cyan-400/60 font-black uppercase tracking-[0.4em] text-xs">Bio-Pattern Synchronization Protocol</p>
        </motion.div>

        {/* Breathing Circle */}
        <div className="relative flex items-center justify-center mb-16">
          {/* Outer glow rings */}
          <motion.div
            animate={{ scale: circleScale, opacity: isRunning ? 0.3 : 0.1 }}
            transition={{ duration: phase === "inhale" ? 4 : phase === "exhale" ? 8 : 0.5, ease: "easeInOut" }}
            className={`absolute w-80 h-80 rounded-full bg-gradient-to-br from-cyan-400/20 to-purple-500/20 blur-3xl`}
          />
          <motion.div
            animate={{ scale: circleScale, opacity: isRunning ? 0.5 : 0.2 }}
            transition={{ duration: phase === "inhale" ? 4 : phase === "exhale" ? 8 : 0.5, ease: "easeInOut" }}
            className="absolute w-64 h-64 rounded-full border-2 border-cyan-400/20"
          />

          {/* Main circle */}
          <motion.div
            animate={{ scale: circleScale }}
            transition={{
              duration: phase === "inhale" ? 4 : phase === "exhale" ? 8 : 0.5,
              ease: "easeInOut",
            }}
            className="relative w-56 h-56 rounded-full bg-white/5 backdrop-blur-2xl border border-white/10 flex items-center justify-center shadow-[0_0_50px_rgba(34,211,238,0.2)]"
          >
            <div className="text-center">
              <AnimatePresence mode="wait">
                <motion.div
                  key={phase}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 1.2 }}
                  transition={{ duration: 0.3 }}
                >
                  {phase === "idle" ? (
                    <Wind className="w-12 h-12 text-cyan-400 mx-auto animate-pulse" />
                  ) : (
                    <>
                      <p className="text-xs font-black text-cyan-400 uppercase tracking-[0.2em] mb-1">{currentPhase.label}</p>
                      <p className="text-6xl font-black text-white tracking-tighter tabular-nums">
                        {currentPhase.duration - phaseTime}
                      </p>
                    </>
                  )}
                </motion.div>
              </AnimatePresence>
            </div>
          </motion.div>
        </div>

        {/* Phase Progress */}
        {isRunning && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex items-center gap-3 mb-12 bg-white/5 backdrop-blur-md p-3 rounded-2xl border border-white/10"
          >
            {PHASES.map((p, i) => (
              <div
                key={p.phase}
                className={`h-2 w-20 rounded-full transition-all duration-500 ${
                  i === currentPhaseIndex ? "bg-cyan-400 shadow-[0_0_10px_rgba(34,211,238,0.6)]" : i < currentPhaseIndex ? "bg-cyan-400/20" : "bg-white/10"
                }`}
              />
            ))}
          </motion.div>
        )}

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="flex items-center gap-12 mb-16 bg-white/5 backdrop-blur-md px-10 py-6 rounded-[2rem] border border-white/10 shadow-2xl"
        >
          <div className="text-center">
            <p className="text-sm font-black text-white/30 uppercase tracking-widest mb-1">Rounds</p>
            <p className="text-3xl font-black text-white tracking-tighter">{rounds}</p>
          </div>
          <div className="w-px h-10 bg-white/10" />
          <div className="text-center">
            <p className="text-sm font-black text-white/30 uppercase tracking-widest mb-1">Elapsed</p>
            <p className="text-3xl font-black text-cyan-400 tracking-tighter">{formatTime(totalTime)}</p>
          </div>
        </motion.div>

        {/* Controls */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="flex items-center gap-6"
        >
          {!isRunning ? (
            <Button 
              onClick={start} 
              size="lg" 
              className="h-16 px-12 bg-gradient-to-r from-cyan-500 to-cyan-600 hover:shadow-[0_0_30px_rgba(6,182,212,0.4)] text-white font-black uppercase tracking-widest rounded-2xl transition-all hover:scale-105"
            >
              <Play className="w-5 h-5 mr-3" />
              {totalTime > 0 ? "Resume" : "Initiate Sync"}
            </Button>
          ) : (
            <Button 
              onClick={pause} 
              size="lg" 
              variant="outline" 
              className="h-16 px-12 border-white/10 hover:bg-white/5 text-white font-black uppercase tracking-widest rounded-2xl"
            >
              <Pause className="w-5 h-5 mr-3" /> Pause Protocol
            </Button>
          )}
          {totalTime > 0 && (
            <Button 
              onClick={reset} 
              size="lg" 
              variant="ghost" 
              className="h-16 text-white/40 hover:text-white font-black uppercase tracking-widest"
            >
              <RotateCcw className="w-5 h-5 mr-3" /> Reset
            </Button>
          ) || (
             <Button 
                onClick={() => window.history.back()} 
                size="lg" 
                variant="ghost" 
                className="h-16 text-white/40 hover:text-white font-black uppercase tracking-widest"
              >
                Abort Mission
              </Button>
          )}
        </motion.div>
      </div>
    </div>

  );
};

export default Breathing;
