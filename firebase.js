// firebase.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-auth.js";

const firebaseConfig = {
  apiKey: "",
  authDomain: "",
  projectId: "",
  appId: ""
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
