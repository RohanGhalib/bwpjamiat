import { initializeApp, getApps, getApp } from "firebase/app";
import { getFirestore, initializeFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID
};

// Initialize Firebase (Ensures it isn't initialized twice on Next.js HMR)
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

// Initialize Firestore (Ensures it isn't initialized twice to prevent memory leaks in worker threads)
const db = getApps().length 
  ? getFirestore(app) 
  : initializeFirestore(app, {
      experimentalForceLongPolling: true,
    });

// Debug log to verify config (redacting sensitive parts)
if (typeof window === 'undefined') {
  console.log(`[Firebase] Initialized for project: ${firebaseConfig.projectId}`);
}

// Initialize Firebase Storage
const storage = getStorage(app);

export { app, db, storage };
