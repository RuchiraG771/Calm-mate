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
    <div className="min-h-screen bg-background overflow-hidden">
      <Navbar />

      <div className="pt-24 pb-12 px-6 flex flex-col items-center justify-center min-h-screen">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-3xl font-bold text-foreground mb-2">
            Guided <span className="text-gradient">Breathing</span>
          </h1>
          <p className="text-muted-foreground">4-7-8 Technique • Inhale · Hold · Exhale</p>
        </motion.div>

        {/* Breathing Circle */}
        <div className="relative flex items-center justify-center mb-12">
          {/* Outer glow rings */}
          <motion.div
            animate={{ scale: circleScale, opacity: isRunning ? 0.3 : 0.1 }}
            transition={{ duration: phase === "inhale" ? 4 : phase === "exhale" ? 8 : 0.5, ease: "easeInOut" }}
            className={`absolute w-72 h-72 rounded-full bg-gradient-radial ${PHASE_COLORS[phase]} blur-xl`}
          />
          <motion.div
            animate={{ scale: circleScale, opacity: isRunning ? 0.5 : 0.2 }}
            transition={{ duration: phase === "inhale" ? 4 : phase === "exhale" ? 8 : 0.5, ease: "easeInOut" }}
            className="absolute w-56 h-56 rounded-full border-2 border-primary/20"
          />

          {/* Main circle */}
          <motion.div
            animate={{ scale: circleScale }}
            transition={{
              duration: phase === "inhale" ? 4 : phase === "exhale" ? 8 : 0.5,
              ease: "easeInOut",
            }}
            className="relative w-48 h-48 rounded-full bg-gradient-to-br from-primary/20 to-primary/5 border border-primary/30 flex items-center justify-center glow-primary"
          >
            <div className="text-center">
              <AnimatePresence mode="wait">
                <motion.div
                  key={phase}
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -5 }}
                  transition={{ duration: 0.3 }}
                >
                  {phase === "idle" ? (
                    <Wind className="w-10 h-10 text-primary mx-auto" />
                  ) : (
                    <>
                      <p className="text-lg font-semibold text-primary">{currentPhase.label}</p>
                      <p className="text-3xl font-bold text-foreground mt-1">
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
            className="flex items-center gap-2 mb-8"
          >
            {PHASES.map((p, i) => (
              <div
                key={p.phase}
                className={`h-1.5 w-16 rounded-full transition-colors duration-300 ${
                  i === currentPhaseIndex ? "bg-primary" : i < currentPhaseIndex ? "bg-primary/40" : "bg-secondary"
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
          className="flex items-center gap-8 mb-10"
        >
          <div className="text-center">
            <p className="text-2xl font-bold text-foreground">{rounds}</p>
            <p className="text-xs text-muted-foreground">Rounds</p>
          </div>
          <div className="w-px h-8 bg-border" />
          <div className="text-center">
            <p className="text-2xl font-bold text-foreground">{formatTime(totalTime)}</p>
            <p className="text-xs text-muted-foreground">Duration</p>
          </div>
        </motion.div>

        {/* Controls */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="flex items-center gap-3"
        >
          {!isRunning ? (
            <Button onClick={start} size="lg" className="px-8 glow-primary">
              <Play className="w-4 h-4 mr-2" />
              {totalTime > 0 ? "Resume" : "Start"}
            </Button>
          ) : (
            <Button onClick={pause} size="lg" variant="outline" className="px-8">
              <Pause className="w-4 h-4 mr-2" /> Pause
            </Button>
          )}
          {totalTime > 0 && (
            <Button onClick={reset} size="lg" variant="ghost">
              <RotateCcw className="w-4 h-4 mr-2" /> Reset
            </Button>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default Breathing;
