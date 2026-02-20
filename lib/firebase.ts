import { getApp, getApps, initializeApp, type FirebaseApp } from "firebase/app";
import { getAuth, type Auth } from "firebase/auth";
import { getFirestore, type Firestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

const missingFirebaseVars = Object.entries(firebaseConfig)
  .filter(([, value]) => !value)
  .map(([key]) => key);

export const isFirebaseConfigured = missingFirebaseVars.length === 0;
export const firebaseConfigError = isFirebaseConfigured
  ? null
  : `Missing required Firebase environment variables: ${missingFirebaseVars.join(", ")}.`;

let app: FirebaseApp | null = null;
let auth: Auth | null = null;
let db: Firestore | null = null;

const assertFirebaseConfig = () => {
  if (!isFirebaseConfigured) {
    throw new Error(
      `${firebaseConfigError} Please configure NEXT_PUBLIC_FIREBASE_* values.`
    );
  }
};

const ensureFirebase = () => {
  if (app && auth && db) return;

  assertFirebaseConfig();

  app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
  auth = getAuth(app);
  db = getFirestore(app);
};

export const getFirebaseApp = (): FirebaseApp => {
  ensureFirebase();
  return app as FirebaseApp;
};

export const getFirebaseAuth = (): Auth => {
  ensureFirebase();
  return auth as Auth;
};

export const getFirebaseDb = (): Firestore => {
  ensureFirebase();
  return db as Firestore;
};
