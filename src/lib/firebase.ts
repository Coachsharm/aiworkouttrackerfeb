import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyCOoKfltDdMDa2X53a3rjFroOdYE1Z8IMk",
  authDomain: "ai-workout-tracker-feb25.firebaseapp.com",
  projectId: "ai-workout-tracker-feb25",
  storageBucket: "ai-workout-tracker-feb25.firebasestorage.app",
  messagingSenderId: "857556355624",
  appId: "1:857556355624:web:440fe8650bffd7a55f031d",
  measurementId: "G-03F4X0ZTPK"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const analytics = getAnalytics(app);

// Initialize Firebase Performance Monitoring
const initializePerformance = async () => {
  if (process.env.NODE_ENV === 'production') {
    const { getPerformance } = await import('firebase/performance');
    return getPerformance(app);
  }
  return null;
};

initializePerformance();