import { useEffect, useRef, useState, useCallback } from "react";
import { motion } from "framer-motion";
import * as faceapi from "face-api.js";
import { StopCircle, Camera, Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/Navbar";
import AnxietyGauge from "@/components/analysis/AnxietyGauge";
import StressHeatmap from "@/components/analysis/StressHeatmap";
import SessionTimeline from "@/components/analysis/SessionTimeline";
import EmotionAnalysis from "@/components/analysis/EmotionAnalysis";
import BehavioralIndicators from "@/components/analysis/BehavioralIndicators";
import RealTimeRecommendations from "@/components/analysis/RealTimeRecommendations";

const getStressFromExpressions = (expressions: faceapi.FaceExpressions) => {
  const { angry, disgusted, fearful, sad, surprised, happy, neutral } = expressions;
  const stressScore = (fearful * 1.0 + sad * 0.7 + angry * 0.5 + disgusted * 0.4 + surprised * 0.3) * 100;
  const calmScore = (happy * 0.8 + neutral * 0.6) * 100;
  return Math.min(100, Math.max(0, stressScore - calmScore * 0.3 + 15));
};

const getDominantEmotion = (expressions: faceapi.FaceExpressions) => {
  const entries = Object.entries(expressions) as [string, number][];
  return entries.reduce((a, b) => (b[1] > a[1] ? b : a))[0];
};

const getEAR = (eye: faceapi.Point[]) => {
  const dist = (a: faceapi.Point, b: faceapi.Point) =>
    Math.sqrt((a.x - b.x) ** 2 + (a.y - b.y) ** 2);
  const v1 = dist(eye[1], eye[5]);
  const v2 = dist(eye[2], eye[4]);
  const h = dist(eye[0], eye[3]);
  return (v1 + v2) / (2.0 * h);
};

const EAR_THRESHOLD = 0.21;

const Analysis = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isRunning, setIsRunning] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [modelError, setModelError] = useState<string | null>(null);
  const [stressScore, setStressScore] = useState(0);
  const [confidence, setConfidence] = useState(0);
  const [dominantEmotion, setDominantEmotion] = useState("neutral");
  const [emotions, setEmotions] = useState<Record<string, number>>({});
  const [faceDetected, setFaceDetected] = useState(false);
  const [blinkCount, setBlinkCount] = useState(0);
  const [headMovement, setHeadMovement] = useState(0);
  const [stressRegions, setStressRegions] = useState({ forehead: 0, eyes: 0, mouth: 0, jaw: 0 });
  const [timelineData, setTimelineData] = useState<{ time: string; stress: number; fear: number }[]>([]);
  const [peakStress, setPeakStress] = useState(0);
  const [avgStress, setAvgStress] = useState(0);
  const [sessionTime, setSessionTime] = useState(0);

  const blinkCooldownRef = useRef(false);
  const intervalRef = useRef<number>();
  const timerRef = useRef<number>();
  const lastFacePosRef = useRef<{ x: number; y: number } | null>(null);
  const stressHistoryRef = useRef<number[]>([]);

  useEffect(() => {
    const loadModels = async () => {
      try {
        const MODEL_URL = "https://justadudewhohacks.github.io/face-api.js/models";
        await Promise.all([
          faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL),
          faceapi.nets.faceExpressionNet.loadFromUri(MODEL_URL),
          faceapi.nets.faceLandmark68Net.loadFromUri(MODEL_URL),
        ]);
        setIsLoading(false);
      } catch (err) {
        console.error("Failed to load face-api models:", err);
        setModelError("Failed to load AI models. Please refresh the page.");
        setIsLoading(false);
      }
    };
    loadModels();
  }, []);

  const startAnalysis = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { width: 640, height: 480 } });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
        setIsRunning(true);
        setSessionTime(0);
        setBlinkCount(0);
        setHeadMovement(0);
        setTimelineData([]);
        setPeakStress(0);
        setAvgStress(0);
        stressHistoryRef.current = [];
        lastFacePosRef.current = null;

        timerRef.current = window.setInterval(() => setSessionTime((t) => t + 1), 1000);

        intervalRef.current = window.setInterval(async () => {
          if (!videoRef.current || !canvasRef.current) return;

          const detections = await faceapi
            .detectSingleFace(videoRef.current, new faceapi.TinyFaceDetectorOptions())
            .withFaceLandmarks()
            .withFaceExpressions();

          const canvas = canvasRef.current;
          const displaySize = { width: videoRef.current.videoWidth, height: videoRef.current.videoHeight };
          faceapi.matchDimensions(canvas, displaySize);

          const ctx = canvas.getContext("2d");
          if (ctx) ctx.clearRect(0, 0, canvas.width, canvas.height);

          if (detections) {
            setFaceDetected(true);
            const resized = faceapi.resizeResults(detections, displaySize);
            const box = resized.detection.box;
            const stress = getStressFromExpressions(detections.expressions);
            const conf = Math.round(detections.detection.score * 100);

            setConfidence(conf);

            if (ctx) {
              // Blue bounding box
              ctx.strokeStyle = "#3B82F6";
              ctx.lineWidth = 2;
              ctx.strokeRect(box.x, box.y, box.width, box.height);

              // Confidence label
              ctx.fillStyle = "#3B82F6";
              ctx.fillRect(box.x, box.y - 20, 50, 20);
              ctx.fillStyle = "#fff";
              ctx.font = "12px monospace";
              ctx.fillText((detections.detection.score).toFixed(2), box.x + 4, box.y - 6);

              // Face outline (cyan)
              const landmarks = resized.landmarks;
              const jaw = landmarks.getJawOutline();
              ctx.strokeStyle = "hsl(168, 76%, 42%)";
              ctx.lineWidth = 1.5;
              ctx.beginPath();
              jaw.forEach((p, i) => (i === 0 ? ctx.moveTo(p.x, p.y) : ctx.lineTo(p.x, p.y)));
              ctx.stroke();

              // Landmark dots (pink/magenta)
              const allPoints = landmarks.positions;
              allPoints.forEach((p) => {
                ctx.beginPath();
                ctx.arc(p.x, p.y, 2, 0, Math.PI * 2);
                ctx.fillStyle = "#EC4899";
                ctx.fill();
              });

              // Brow/nose/mouth outlines (cyan)
              const drawOutline = (points: faceapi.Point[]) => {
                ctx.strokeStyle = "hsl(168, 76%, 42%)";
                ctx.lineWidth = 1;
                ctx.beginPath();
                points.forEach((p, i) => (i === 0 ? ctx.moveTo(p.x, p.y) : ctx.lineTo(p.x, p.y)));
                ctx.closePath();
                ctx.stroke();
              };
              drawOutline(landmarks.getLeftEye());
              drawOutline(landmarks.getRightEye());
              drawOutline(landmarks.getNose());
              drawOutline(landmarks.getMouth());
              drawOutline(landmarks.getLeftEyeBrow());
              drawOutline(landmarks.getRightEyeBrow());

              // Blink detection
              const leftEyeOrig = detections.landmarks.getLeftEye();
              const rightEyeOrig = detections.landmarks.getRightEye();
              const earLeft = getEAR(leftEyeOrig);
              const earRight = getEAR(rightEyeOrig);
              const avgEAR = (earLeft + earRight) / 2;

              if (avgEAR < EAR_THRESHOLD && !blinkCooldownRef.current) {
                blinkCooldownRef.current = true;
                setBlinkCount((c) => c + 1);
                setTimeout(() => { blinkCooldownRef.current = false; }, 300);
              }

              // Head movement tracking
              const noseTip = detections.landmarks.getNose()[3];
              if (lastFacePosRef.current) {
                const dx = noseTip.x - lastFacePosRef.current.x;
                const dy = noseTip.y - lastFacePosRef.current.y;
                const movement = Math.sqrt(dx * dx + dy * dy);
                setHeadMovement((prev) => prev + movement);
              }
              lastFacePosRef.current = { x: noseTip.x, y: noseTip.y };

              // Stress regions from expressions
              const { fearful, sad, angry, disgusted, surprised } = detections.expressions;
              setStressRegions({
                forehead: Math.min(100, (fearful + surprised + angry) * 100),
                eyes: Math.min(100, (fearful + sad) * 50),
                mouth: Math.min(100, (angry + disgusted + sad) * 100),
                jaw: Math.min(100, (angry + disgusted) * 80),
              });
            }

            // Update scores
            setStressScore(stress);
            setDominantEmotion(getDominantEmotion(detections.expressions));
            setEmotions(
              Object.fromEntries(
                Object.entries(detections.expressions).map(([k, v]) => [k, Math.round((v as number) * 100)])
              )
            );

            // Timeline
            stressHistoryRef.current.push(stress);
            const peak = Math.max(...stressHistoryRef.current);
            const avg = stressHistoryRef.current.reduce((a, b) => a + b, 0) / stressHistoryRef.current.length;
            setPeakStress(peak);
            setAvgStress(avg);

            setTimelineData((prev) => {
              const sec = prev.length * 0.2;
              const newEntry = {
                time: `${Math.floor(sec)}s`,
                stress: Math.round(stress),
                fear: Math.round(detections.expressions.fearful * 100),
              };
              // Keep last 100 entries
              const updated = [...prev, newEntry];
              return updated.length > 100 ? updated.slice(-100) : updated;
            });
          } else {
            setFaceDetected(false);
          }
        }, 200);
      }
    } catch (err) {
      console.error("Camera access denied:", err);
    }
  }, []);

  const stopAnalysis = useCallback(() => {
    setIsRunning(false);
    if (intervalRef.current) clearInterval(intervalRef.current);
    if (timerRef.current) clearInterval(timerRef.current);
    if (videoRef.current?.srcObject) {
      (videoRef.current.srcObject as MediaStream).getTracks().forEach((t) => t.stop());
      videoRef.current.srcObject = null;
    }
  }, []);

  useEffect(() => {
    return () => { stopAnalysis(); };
  }, [stopAnalysis]);

  return (
    <div className="min-h-screen bg-[#0a0a1f] text-white relative overflow-hidden">
      <Navbar />
      
      {/* Background Particles */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        {[...Array(15)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full bg-cyan-400/10 blur-3xl"
            style={{
              width: Math.random() * 400 + 100,
              height: Math.random() * 400 + 100,
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
            }}
            animate={{
              opacity: [0.1, 0.3, 0.1],
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

      <div className="pt-24 pb-12 px-6 relative z-10">
        <div className="max-w-7xl mx-auto">
          {/* Top controls */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-6">
            <div>
              <motion.h1 
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="text-4xl md:text-5xl font-black futuristic-header mb-2"
              >
                🔬 Neural Scan
              </motion.h1>
              <p className="text-cyan-400/60 font-medium tracking-wide uppercase text-xs">Real-time biometric analysis & stress detection</p>
            </div>

            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex items-center gap-4 bg-white/5 backdrop-blur-xl border border-white/10 p-2 rounded-2xl shadow-2xl"
            >
              {isRunning ? (
                <Button variant="destructive" onClick={stopAnalysis} className="h-12 px-8 rounded-xl font-black uppercase tracking-widest shadow-[0_0_20px_rgba(239,68,68,0.2)] hover:scale-105 transition-all">
                  <StopCircle className="w-4 h-4 mr-2" /> Stop Mission
                </Button>
              ) : (
                <Button onClick={startAnalysis} disabled={isLoading || !!modelError} className="bg-gradient-to-r from-cyan-500 to-cyan-600 h-12 px-8 rounded-xl font-black uppercase tracking-widest shadow-[0_0_30px_rgba(6,182,212,0.4)] hover:scale-105 transition-all">
                  <Camera className="w-4 h-4 mr-2" />
                  {isLoading ? "Syncing..." : modelError ? "Error" : "Initiate Scan"}
                </Button>
              )}
              <div className="flex items-center gap-2 px-4 py-2 bg-white/5 rounded-xl border border-white/10">
                <Info className="w-4 h-4 text-cyan-400" />
                <span className="text-[10px] font-black uppercase tracking-widest text-white/40">Secure Node</span>
              </div>
            </motion.div>
          </div>


          {/* Main grid: Video + Right Panel */}
          <div className="grid lg:grid-cols-3 gap-4">
            {/* Video Feed */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="lg:col-span-2"
            >
              <div className="relative bg-black/40 rounded-3xl overflow-hidden aspect-video border border-white/10 shadow-2xl neural-card">
                {/* Corner brackets (Futuristic) */}
                <div className="absolute top-8 left-8 w-16 h-16 border-t-2 border-l-2 border-cyan-500/30 z-10" />
                <div className="absolute top-8 right-8 w-16 h-16 border-t-2 border-r-2 border-cyan-500/30 z-10" />
                <div className="absolute bottom-8 left-8 w-16 h-16 border-b-2 border-l-2 border-cyan-500/30 z-10" />
                <div className="absolute bottom-8 right-8 w-16 h-16 border-b-2 border-r-2 border-cyan-500/30 z-10" />

                <video ref={videoRef} className="w-full h-full object-cover opacity-80" muted playsInline />
                <canvas ref={canvasRef} className="absolute inset-0 w-full h-full z-20" />

                {/* ANALYZING badge */}
                {isRunning && (
                  <div className="absolute top-8 left-1/2 -translate-x-1/2 z-30 flex items-center gap-3 px-6 py-2 rounded-full bg-black/60 backdrop-blur-xl border border-cyan-500/30 shadow-[0_0_20px_rgba(34,211,238,0.2)]">
                    <div className="w-2 h-2 rounded-full bg-red-500 animate-ping" />
                    <span className="text-[10px] font-black text-white tracking-[0.4em] uppercase">Neural Stream Active</span>
                  </div>
                )}

                {/* No face warning */}
                {isRunning && !faceDetected && (
                  <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-30 px-6 py-3 rounded-2xl bg-red-500/20 backdrop-blur-xl border border-red-500/30 shadow-2xl">
                    <span className="text-[10px] font-black text-red-500 uppercase tracking-widest flex items-center gap-2">
                       <Activity className="w-4 h-4" /> Position Face in Frame
                    </span>
                  </div>
                )}

                {/* Start overlay */}
                {!isRunning && (
                  <div className="absolute inset-0 flex flex-col items-center justify-center bg-[#0a0a1f]/80 backdrop-blur-sm z-30">
                    <div className="w-24 h-24 rounded-3xl bg-white/5 border border-white/10 flex items-center justify-center mb-6 shadow-2xl">
                       <Camera className="w-10 h-10 text-cyan-400/40" />
                    </div>
                    <p className="text-[10px] font-black text-white/30 uppercase tracking-[0.4em]">
                      {isLoading ? "Synchronizing AI Modules..." : modelError || "Ready for Neural Extraction"}
                    </p>
                  </div>
                )}
              </div>
            </motion.div>

            {/* Right Panel */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="space-y-4"
            >
              <AnxietyGauge score={stressScore} confidence={confidence} />
              <StressHeatmap {...stressRegions} />
            </motion.div>
          </div>

          {/* Bottom grid: Timeline + Emotion + Behavioral */}
          <div className="grid lg:grid-cols-2 gap-4 mt-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <SessionTimeline
                data={timelineData}
                peak={peakStress}
                average={avgStress}
                current={stressScore}
              />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="space-y-4"
            >
              <EmotionAnalysis emotions={emotions} dominant={dominantEmotion} />
              <BehavioralIndicators blinkCount={blinkCount} headMovement={headMovement} />
              {(isRunning || timelineData.length > 0) && (
                <RealTimeRecommendations stressScore={stressScore} />
              )}
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Analysis;
