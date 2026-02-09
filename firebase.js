// firebase.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-auth.js";

const firebaseConfig = {
  apiKey:apiKey: "REVOKED",
  authDomain: "golden-vault-47937.firebaseapp.com",
  projectId: "golden-vault-47937",
  appId: "1:425930410009:web:31d25ad03b6d2471494288"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
