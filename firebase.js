import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyAAVpPr6d7kCd3ruqs44SCT5p5tig37_QU",
  authDomain: "golden-vault-47937.firebaseapp.com",
  projectId: "golden-vault-47937",
  storageBucket: "golden-vault-47937.firebasestorage.app",
  messagingSenderId: "425930410009",
  appId: "1:425930410009:web:31d25ad03b6d2471494288",
  measurementId: "G-JV0QK072HR"
};

export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
