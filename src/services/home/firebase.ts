// src/firebase.ts
import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";
import { getMessaging } from "firebase/messaging";

const firebaseConfig = {
  apiKey: "AIzaSyCZ3x5w7egYzw-glf9Rte1mJduC9nfk2uE",
  authDomain: "e-commerce-wail.firebaseapp.com",
  projectId: "e-commerce-wail",
  storageBucket: "e-commerce-wail.firebasestorage.app",
  messagingSenderId: "269077068091",
  appId: "1:269077068091:web:ac2c8ef7d2888ccdbcdf1e",
  measurementId: "G-KP96XNYDCS",
};
const app = initializeApp(firebaseConfig);
navigator.serviceWorker.register("/firebase-messaging-sw.js"); // ✅ Add this line

export const messaging = getMessaging(app);
export const database = getDatabase(app);
