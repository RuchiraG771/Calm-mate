import { motion } from "framer-motion";
import { useEffect, useState } from "react";

const POSES: Record<string, any> = {
  standing: {
    head: [50, 15], neck: [50, 25], pelvis: [50, 55],
    le: [40, 40], lh: [35, 55], re: [60, 40], rh: [65, 55],
    lk: [45, 75], lf: [45, 95], rk: [55, 75], rf: [55, 95]
  },
  arms_up: {
    head: [50, 15], neck: [50, 25], pelvis: [50, 55],
    le: [35, 10], lh: [45, 5], re: [65, 10], rh: [55, 5],
    lk: [45, 75], lf: [45, 95], rk: [55, 75], rf: [55, 95]
  },
  tree: {
    head: [50, 15], neck: [50, 25], pelvis: [50, 55],
    le: [35, 35], lh: [50, 30], re: [65, 35], rh: [50, 30],
    lk: [35, 70], lf: [47, 65], rk: [55, 75], rf: [55, 95]
  },
  cat: {
    head: [30, 65], neck: [40, 55], pelvis: [70, 55],
    le: [40, 75], lh: [40, 95], re: [40, 75], rh: [40, 95],
    lk: [70, 75], lf: [85, 95], rk: [70, 75], rf: [85, 95]
  },
  cow: {
    head: [30, 45], neck: [40, 60], pelvis: [70, 60],
    le: [40, 75], lh: [40, 95], re: [40, 75], rh: [40, 95],
    lk: [70, 75], lf: [85, 95], rk: [70, 75], rf: [85, 95]
  },
  child: {
    head: [75, 85], neck: [65, 80], pelvis: [30, 80],
    le: [50, 90], lh: [85, 90], re: [50, 90], rh: [85, 90],
    lk: [45, 90], lf: [30, 90], rk: [45, 90], rf: [30, 90]
  },
  sitting_cross: {
    head: [50, 45], neck: [50, 55], pelvis: [50, 80],
    le: [35, 70], lh: [40, 85], re: [65, 70], rh: [60, 85],
    lk: [30, 85], lf: [50, 90], rk: [70, 85], rf: [50, 90]
  },
  arms_up_sitting: {
    head: [50, 45], neck: [50, 55], pelvis: [50, 80],
    le: [35, 30], lh: [45, 20], re: [65, 30], rh: [55, 20],
    lk: [30, 85], lf: [50, 90], rk: [70, 85], rf: [50, 90]
  },
  pumping_arms: {
    head: [50, 45], neck: [50, 55], pelvis: [50, 80],
    le: [35, 60], lh: [45, 45], re: [65, 60], rh: [55, 45],
    lk: [30, 85], lf: [50, 90], rk: [70, 85], rf: [50, 90]
  },
  hand_to_nose: {
    head: [50, 45], neck: [50, 55], pelvis: [50, 80],
    le: [35, 70], lh: [40, 85], re: [60, 60], rh: [53, 47],
    lk: [30, 85], lf: [50, 90], rk: [70, 85], rf: [50, 90]
  },
  downward_dog: {
    head: [45, 75], neck: [40, 65], pelvis: [50, 30],
    le: [35, 80], lh: [30, 95], re: [35, 80], rh: [30, 95],
    lk: [60, 60], lf: [70, 95], rk: [60, 60], rf: [70, 95]
  },
  plank: {
    head: [25, 45], neck: [30, 50], pelvis: [60, 60],
    le: [30, 70], lh: [30, 90], re: [30, 70], rh: [30, 90],
    lk: [75, 70], lf: [90, 80], rk: [75, 70], rf: [90, 80]
  },
  shavasana: {
    head: [20, 90], neck: [30, 90], pelvis: [60, 90],
    le: [40, 90], lh: [50, 90], re: [40, 90], rh: [50, 90],
    lk: [75, 90], lf: [90, 90], rk: [75, 90], rf: [90, 90]
  },
  bridge: {
    head: [20, 90], neck: [30, 90], pelvis: [60, 65],
    le: [40, 90], lh: [50, 90], re: [40, 90], rh: [50, 90],
    lk: [80, 65], lf: [80, 95], rk: [80, 65], rf: [80, 95]
  },
  legs_up_wall: {
    head: [30, 90], neck: [40, 90], pelvis: [70, 90],
    le: [50, 90], lh: [60, 90], re: [50, 90], rh: [60, 90],
    lk: [70, 65], lf: [70, 40], rk: [70, 65], rf: [70, 40]
  },
  sitting_straight_legs: {
    head: [50, 45], neck: [50, 55], pelvis: [30, 90],
    le: [40, 70], lh: [45, 85], re: [60, 70], rh: [55, 85],
    lk: [55, 90], lf: [80, 90], rk: [55, 90], rf: [80, 90]
  },
  forward_bend: {
    head: [60, 70], neck: [55, 75], pelvis: [30, 90],
    le: [50, 85], lh: [70, 90], re: [50, 85], rh: [70, 90],
    lk: [55, 90], lf: [80, 90], rk: [55, 90], rf: [80, 90]
  }
};

const SEQUENCES: Record<string, string[]> = {
  "Surya Namaskar": ["standing", "arms_up", "plank", "downward_dog", "standing"],
  "Hasya Yoga": ["sitting_cross", "arms_up_sitting", "sitting_cross"],
  "Vinyasa Flow": ["plank", "downward_dog", "plank"],
  "Bhastrika Pranayama": ["sitting_cross", "pumping_arms", "sitting_cross"],
  "Tadasana": ["standing", "arms_up", "standing"],
  "Vrikshasana": ["standing", "tree", "standing"],
  "Balasana": ["cat", "child", "cat"],
  "Anulom Vilom": ["sitting_cross", "hand_to_nose", "sitting_cross"],
  "Cat-Cow": ["cat", "cow", "cat"],
  "Paschimottanasana": ["sitting_straight_legs", "forward_bend", "sitting_straight_legs"],
  "Setu Bandhasana": ["shavasana", "bridge", "shavasana"],
  "Shavasana": ["shavasana", "shavasana"], // Duplicate to force minor re-render breathing if needed
  "Legs-up-the-wall": ["shavasana", "legs_up_wall", "shavasana"]
};

export default function YogaFigure({ poseName }: { poseName: string }) {
  const [step, setStep] = useState(0);

  const seq = SEQUENCES[poseName] || ["standing", "arms_up", "standing"];

  useEffect(() => {
    const interval = setInterval(() => {
      setStep((s) => (s + 1) % seq.length);
    }, 2500); // 2.5 seconds per step for slow, relaxing movement
    return () => clearInterval(interval);
  }, [poseName, seq.length]);

  const currentPose = POSES[seq[step]] || POSES["standing"];

  const Line = ({ p1, p2, color = "#22d3ee" }: { p1: number[], p2: number[], color?: string }) => (
    <motion.line
      x1={p1[0]} y1={p1[1]} x2={p2[0]} y2={p2[1]}
      stroke={color} strokeWidth="4" strokeLinecap="round"
      animate={{ x1: p1[0], y1: p1[1], x2: p2[0], y2: p2[1] }}
      transition={{ duration: 1.5, type: "spring", bounce: 0.15 }}
    />
  );

  return (
    <div className="w-full h-full relative flex items-center justify-center p-8">
      <svg viewBox="0 0 100 100" className="w-full h-full overflow-visible drop-shadow-[0_0_15px_rgba(34,211,238,0.6)]">
        {/* Torso */}
        <Line p1={currentPose.neck} p2={currentPose.pelvis} color="#c084fc" />
        
        {/* Left Arm */}
        <Line p1={currentPose.neck} p2={currentPose.le} />
        <Line p1={currentPose.le} p2={currentPose.lh} />
        
        {/* Right Arm */}
        <Line p1={currentPose.neck} p2={currentPose.re} />
        <Line p1={currentPose.re} p2={currentPose.rh} />

        {/* Left Leg */}
        <Line p1={currentPose.pelvis} p2={currentPose.lk} />
        <Line p1={currentPose.lk} p2={currentPose.lf} />

        {/* Right Leg */}
        <Line p1={currentPose.pelvis} p2={currentPose.rk} />
        <Line p1={currentPose.rk} p2={currentPose.rf} />

        {/* Head */}
        <motion.circle
          r="6" fill="#c084fc"
          animate={{ cx: currentPose.head[0], cy: currentPose.head[1] }}
          transition={{ duration: 1.5, type: "spring", bounce: 0.15 }}
        />
        
        {/* Ground line for perspective */}
        <line x1="10" y1="95" x2="90" y2="95" stroke="rgba(255,255,255,0.1)" strokeWidth="1" strokeLinecap="round" />
      </svg>
    </div>
  );
}
