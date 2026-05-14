import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyC2_jt76btnzG8t4Cm09OrJXTWIlXR45rE",
  authDomain: "calm-mate-web.firebaseapp.com",
  projectId: "calm-mate-web",
  storageBucket: "calm-mate-web.firebasestorage.app",
  messagingSenderId: "279464233672",
  appId: "1:279464233672:web:177b86e0716351f0b033fd",
  measurementId: "G-EELDWZ2T5W"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
