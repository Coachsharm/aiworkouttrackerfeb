import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getStorage } from 'firebase/storage';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyCnqeNCOcqidCOMkT83eCviCrlLmtYYYIs",
  authDomain: "project1-30145.firebaseapp.com",
  projectId: "project1-30145",
  storageBucket: "project1-30145.firebasestorage.app",
  messagingSenderId: "966059948421",
  appId: "1:966059948421:web:ecd2a58fe8d24e21876cec"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const storage = getStorage(app);
export const db = getFirestore(app);