import { initializeApp, getApps } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getMessaging } from 'firebase/messaging';
import { getAnalytics } from 'firebase/analytics';

// Default Firebase Configuration (using Vite env variables)
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID,
};

// Check if variables are configured
const isFirebaseConfigured = !!import.meta.env.VITE_FIREBASE_API_KEY;

let app;
let auth;
let db;
let messaging = null;
let analytics = null;

if (isFirebaseConfigured) {
  try {
    if (!getApps().length) {
      app = initializeApp(firebaseConfig);
    } else {
      app = getApps()[0];
    }
    auth = getAuth(app);
    db = getFirestore(app);
    
    if (typeof window !== 'undefined') {
      try {
        analytics = getAnalytics(app);
      } catch (err) {
        console.warn('Firebase Analytics initialization failed: ', err.message);
      }
    }
    
    // Messaging only works in browser environments supporting Service Workers
    if (typeof window !== 'undefined' && 'serviceWorker' in navigator) {
      try {
        messaging = getMessaging(app);
      } catch (err) {
        console.warn('Firebase Messaging not supported in this browser: ', err.message);
      }
    }
  } catch (error) {
    console.error('Firebase initialization failed: ', error);
  }
} else {
  console.warn(
    'Momentum: Firebase config not found. Falling back to local/localStorage storage mode.'
  );
}

export { app, auth, db, messaging, analytics, isFirebaseConfigured };
