import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getAnalysisDetailsFromScore(score: number) {
  if (score <= 20) {
    return {
      mood: "Happy 😊",
      level: "Low",
      confidence: Math.floor(Math.random() * (100 - 90 + 1)) + 90,
      suggestions: ["🧘 Mindfulness Meditation", "🫁 Box Breathing (4-4-4-4)", "🌿 Forest Birds Sounds", "💧 Gentle Water Stream", "🚶 Relaxing Walk"],
      dietPlan: "Fresh fruits, nuts, whole grains, coconut water. Dark chocolate in moderation.",
      yogaTypes: "Surya Namaskar, Hasya Yoga, Vinyasa Flow, Bhastrika Pranayama"
    };
  } else if (score <= 40) {
    return {
      mood: "Calm 😌",
      level: "Low",
      confidence: Math.floor(Math.random() * (90 - 80 + 1)) + 80,
      suggestions: ["🧘 Mindfulness Meditation", "🫁 Box Breathing (4-4-4-4)", "🌿 Forest Birds Sounds", "💧 Gentle Water Stream", "🚶 Relaxing Walk"],
      dietPlan: "Warm soups, steamed veggies, oats, tulsi/chamomile tea. Walnuts, flaxseeds.",
      yogaTypes: "Tadasana, Vrikshasana, Balasana, Anulom Vilom Pranayama"
    };
  } else if (score <= 60) {
    return {
      mood: "Neutral 😐",
      level: "Medium",
      confidence: Math.floor(Math.random() * (70 - 50 + 1)) + 50,
      suggestions: ["🧘 Guided Meditation", "🫁 4-7-8 Breathing", "🌧️ Soft Rain Ambience", "🎹 Light Piano Instrumentals", "📖 Journaling"],
      dietPlan: "Brown rice, sweet potato, dal, banana, almonds. No caffeine after 2pm.",
      yogaTypes: "Cat-Cow, Paschimottanasana, Setu Bandhasana, Yoga Nidra"
    };
  } else if (score <= 80) {
    return {
      mood: "Sad 😔",
      level: "High",
      confidence: Math.floor(Math.random() * (50 - 30 + 1)) + 30,
      suggestions: ["🧘 Body Scan Meditation", "🫁 Alternate Nostril Breathing", "🌊 Ocean Waves (Slow Rhythm)", "📻 White Noise", "🚫 Take a Break (10 mins)", "💬 Talk to Someone"],
      dietPlan: "Turmeric milk, khichdi, warm soups, mushrooms. Avoid junk food. Small frequent meals.",
      yogaTypes: "Shavasana, Supta Baddha Konasana, Viparita Karani, Bhramari Pranayama"
    };
  } else {
    return {
      mood: "Stressed 😣",
      level: "High",
      confidence: Math.floor(Math.random() * (30 - 10 + 1)) + 10,
      suggestions: ["🧘 Body Scan Meditation", "🫁 Alternate Nostril Breathing", "🧘 Yoga Nidra (Deep Relaxation Audio)", "📻 White Noise", "🚫 Take a Break (10 mins)", "💬 Talk to Someone"],
      dietPlan: "Ashwagandha milk, green tea, blueberries, spinach, oats. No caffeine/alcohol. Hydrate well.",
      yogaTypes: "Legs-up-the-wall, Supported Child’s Pose, Savasana, Nadi Shodhana + Ujjayi Pranayama"
    };
  }
}

export function getTabFromSuggestion(suggestion: string): string {
  const s = suggestion.toLowerCase();
  if (s.includes("meditation")) return "meditation";
  if (s.includes("breathing")) return "breathing";
  if (s.includes("sounds") || s.includes("ambience") || s.includes("instrumentals") || s.includes("waves") || s.includes("noise") || s.includes("audio")) return "sounds";
  if (s.includes("journaling")) return "journal";
  if (s.includes("yoga")) return "yoga";
  if (s.includes("break") || s.includes("sleep")) return "sleep";
  return "breathing"; // Fallback
}

export const ACTIVITY_SEQUENCE_KEY = "calmmate_activity_sequence";

export function setActivitySequence(suggestions: string[], startIndex: number = 0, score: number = 50) {
  sessionStorage.setItem(ACTIVITY_SEQUENCE_KEY, JSON.stringify({
    suggestions,
    currentIndex: startIndex,
    score,
    timestamp: Date.now()
  }));
}

export function getActivitySequence() {
  const data = sessionStorage.getItem(ACTIVITY_SEQUENCE_KEY);
  if (!data) return null;
  try {
    return JSON.parse(data);
  } catch {
    return null;
  }
}

export function updateActivitySequenceIndex(index: number) {
  const current = getActivitySequence();
  if (current) {
    current.currentIndex = index;
    sessionStorage.setItem(ACTIVITY_SEQUENCE_KEY, JSON.stringify(current));
  }
}

export function clearActivitySequence() {
  sessionStorage.removeItem(ACTIVITY_SEQUENCE_KEY);
}

// Reward System Logic
export const USER_POINTS_KEY = "calmmate_user_points";
export const LAST_COMPLETION_DATE_KEY = "calmmate_last_completion_date";

export function getUserPoints(): number {
  const points = localStorage.getItem(USER_POINTS_KEY);
  return points ? parseInt(points) : 0;
}

export function addUserPoints(amount: number = 10) {
  const current = getUserPoints();
  localStorage.setItem(USER_POINTS_KEY, (current + amount).toString());
  localStorage.setItem(LAST_COMPLETION_DATE_KEY, new Date().toISOString());
}

export function checkDailyPointsDeduction() {
  const lastDateStr = localStorage.getItem(LAST_COMPLETION_DATE_KEY);
  if (!lastDateStr) return;

  const lastDate = new Date(lastDateStr);
  const now = new Date();
  
  // Calculate difference in days
  const diffTime = Math.abs(now.getTime() - lastDate.getTime());
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays >= 1) {
    const currentPoints = getUserPoints();
    // Deduct 10 points for every missed day
    const deduction = diffDays * 10;
    const newPoints = Math.max(0, currentPoints - deduction);
    localStorage.setItem(USER_POINTS_KEY, newPoints.toString());
    
    // Update last date to today so we don't deduct again until tomorrow
    // or set it to a logic that handles multiple days
    localStorage.setItem(LAST_COMPLETION_DATE_KEY, now.toISOString());
    return deduction;
  }
  return 0;
}
