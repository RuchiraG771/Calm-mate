import { db } from "./firebase";
import { 
  collection, 
  addDoc, 
  query, 
  where, 
  getDocs, 
  orderBy, 
  Timestamp,
  limit
} from "firebase/firestore";

export interface AnalysisHistory {
  id?: string;
  userId: string;
  type: "quiz" | "facial";
  timestamp: Date;
  score: number;
  stressLevel: string;
  mood?: string;
  reason?: string;
  // For facial analysis
  avgStress?: number;
  peakStress?: number;
  dominantEmotion?: string;
  duration?: number; // in seconds
}

export const saveHistory = async (data: Omit<AnalysisHistory, "id" | "timestamp">) => {
  try {
    const historyRef = collection(db, "analysis_history");
    const docRef = await addDoc(historyRef, {
      ...data,
      timestamp: Timestamp.now(),
    });
    return docRef.id;
  } catch (error) {
    console.error("Error saving analysis history:", error);
    throw error;
  }
};

export const getUserHistory = async (userId: string) => {
  try {
    const historyRef = collection(db, "analysis_history");
    const q = query(
      historyRef, 
      where("userId", "==", userId), 
      orderBy("timestamp", "desc")
    );
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      timestamp: (doc.data().timestamp as Timestamp).toDate(),
    })) as AnalysisHistory[];
  } catch (error) {
    console.error("Error fetching analysis history:", error);
    throw error;
  }
};

export const getLatestSession = async (userId: string) => {
  try {
    const historyRef = collection(db, "analysis_history");
    const q = query(
      historyRef, 
      where("userId", "==", userId), 
      orderBy("timestamp", "desc"),
      limit(1)
    );
    const querySnapshot = await getDocs(q);
    if (querySnapshot.empty) return null;
    const doc = querySnapshot.docs[0];
    return {
      id: doc.id,
      ...doc.data(),
      timestamp: (doc.data().timestamp as Timestamp).toDate(),
    } as AnalysisHistory;
  } catch (error) {
    console.error("Error fetching latest session:", error);
    throw error;
  }
};
