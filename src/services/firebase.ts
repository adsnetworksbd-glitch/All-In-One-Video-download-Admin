import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getDatabase } from 'firebase/database';

const env = (import.meta as any).env || {};

const firebaseConfig = {
  apiKey: env.VITE_FIREBASE_API_KEY || "AIzaSyDummyKey",
  authDomain: env.VITE_FIREBASE_AUTH_DOMAIN || "localhost",
  databaseURL: env.VITE_FIREBASE_DATABASE_URL || "https://dummy-default-rtdb.firebaseio.com",
  projectId: env.VITE_FIREBASE_PROJECT_ID || "dummy",
  storageBucket: env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: env.VITE_FIREBASE_APP_ID,
};

const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const rtdb = getDatabase(app);
export default app;
