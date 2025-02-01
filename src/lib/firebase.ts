import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyCP3ELQy1etLaaRI_k6QqlkmDsCDdVB2kY",
  authDomain: "project2-3b98d.firebaseapp.com",
  projectId: "project2-3b98d",
  storageBucket: "project2-3b98d.firebasestorage.app",
  messagingSenderId: "1024808036058",
  appId: "1:1024808036058:web:c745efd1d9f0e9ae7027e3"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);