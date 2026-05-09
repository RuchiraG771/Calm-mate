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

const getAnxietyFromExpressions = (expressions: faceapi.FaceExpressions) => {
  const { angry, disgusted, fearful, sad, surprised, happy, neutral } = expressions;
  const anxietyScore = (fearful * 1.0 + sad * 0.7 + angry * 0.5 + disgusted * 0.4 + surprised * 0.3) * 100;
  const calmScore = (happy * 0.8 + neutral * 0.6) * 100;
  return Math.min(100, Math.max(0, anxietyScore - calmScore * 0.3 + 15));
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
  const [anxietyScore, setAnxietyScore] = useState(0);
  const [confidence, setConfidence] = useState(0);
  const [dominantEmotion, setDominantEmotion] = useState("neutral");
  const [emotions, setEmotions] = useState<Record<string, number>>({});
  const [faceDetected, setFaceDetected] = useState(false);
  const [blinkCount, setBlinkCount] = useState(0);
  const [headMovement, setHeadMovement] = useState(0);
  const [stressRegions, setStressRegions] = useState({ forehead: 0, eyes: 0, mouth: 0, jaw: 0 });
  const [timelineData, setTimelineData] = useState<{ time: string; anxiety: number; fear: number }[]>([]);
  const [peakAnxiety, setPeakAnxiety] = useState(0);
  const [avgAnxiety, setAvgAnxiety] = useState(0);
  const [sessionTime, setSessionTime] = useState(0);

  const blinkCooldownRef = useRef(false);
  const intervalRef = useRef<number>();
  const timerRef = useRef<number>();
  const lastFacePosRef = useRef<{ x: number; y: number } | null>(null);
  const anxietyHistoryRef = useRef<number[]>([]);

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
        setPeakAnxiety(0);
        setAvgAnxiety(0);
        anxietyHistoryRef.current = [];
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
            const anxiety = getAnxietyFromExpressions(detections.expressions);
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
            setAnxietyScore(anxiety);
            setDominantEmotion(getDominantEmotion(detections.expressions));
            setEmotions(
              Object.fromEntries(
                Object.entries(detections.expressions).map(([k, v]) => [k, Math.round((v as number) * 100)])
              )
            );

            // Timeline
            anxietyHistoryRef.current.push(anxiety);
            const peak = Math.max(...anxietyHistoryRef.current);
            const avg = anxietyHistoryRef.current.reduce((a, b) => a + b, 0) / anxietyHistoryRef.current.length;
            setPeakAnxiety(peak);
            setAvgAnxiety(avg);

            setTimelineData((prev) => {
              const sec = prev.length * 0.2;
              const newEntry = {
                time: `${Math.floor(sec)}s`,
                anxiety: Math.round(anxiety),
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
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="pt-20 pb-12 px-6">
        <div className="max-w-7xl mx-auto">
          {/* Top controls */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center justify-between mb-4"
          >
            {isRunning ? (
              <Button variant="destructive" onClick={stopAnalysis}>
                <StopCircle className="w-4 h-4 mr-2" /> Stop Analysis
              </Button>
            ) : (
              <Button onClick={startAnalysis} disabled={isLoading || !!modelError} className="glow-primary">
                <Camera className="w-4 h-4 mr-2" />
                {isLoading ? "Loading Models..." : modelError ? "Error" : "Start Analysis"}
              </Button>
            )}
            <div className="flex items-center gap-2 text-muted-foreground">
              <Info className="w-4 h-4" />
              <span className="text-sm">No video data is stored</span>
            </div>
          </motion.div>

          {/* Main grid: Video + Right Panel */}
          <div className="grid lg:grid-cols-3 gap-4">
            {/* Video Feed */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="lg:col-span-2"
            >
              <div className="relative bg-black rounded-xl overflow-hidden aspect-video border border-primary/20">
                {/* Corner brackets */}
                <div className="absolute top-2 left-2 w-8 h-8 border-t-2 border-l-2 border-primary z-10" />
                <div className="absolute top-2 right-2 w-8 h-8 border-t-2 border-r-2 border-primary z-10" />
                <div className="absolute bottom-2 left-2 w-8 h-8 border-b-2 border-l-2 border-primary z-10" />
                <div className="absolute bottom-2 right-2 w-8 h-8 border-b-2 border-r-2 border-primary z-10" />

                <video ref={videoRef} className="w-full h-full object-cover" muted playsInline />
                <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />

                {/* ANALYZING badge */}
                {isRunning && (
                  <div className="absolute top-4 left-1/2 -translate-x-1/2 z-10 flex items-center gap-2 px-4 py-1.5 rounded-full bg-black/70 border border-primary/30">
                    <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                    <span className="text-xs font-medium text-foreground tracking-wider">ANALYZING</span>
                  </div>
                )}

                {/* No face warning */}
                {isRunning && !faceDetected && (
                  <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-10 px-4 py-2 rounded-lg bg-destructive/20 border border-destructive/30">
                    <span className="text-xs text-destructive">No face detected — position your face in frame</span>
                  </div>
                )}

                {/* Start overlay */}
                {!isRunning && (
                  <div className="absolute inset-0 flex flex-col items-center justify-center bg-card/80">
                    <Camera className="w-16 h-16 text-muted-foreground mb-4" />
                    <p className="text-muted-foreground mb-4">
                      {isLoading ? "Loading AI models..." : modelError || "Click Start Analysis to begin"}
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
              <AnxietyGauge score={anxietyScore} confidence={confidence} />
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
                peak={peakAnxiety}
                average={avgAnxiety}
                current={anxietyScore}
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
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Analysis;
