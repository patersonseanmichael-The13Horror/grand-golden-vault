import { initializeApp } from "https://www.gstatic.com/firebasejs/12.9.0/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword } 
from "https://www.gstatic.com/firebasejs/12.9.0/firebase-auth.js";

const firebaseConfig = {
  apiKey: "AIzaSyA4bJmDnapnEFlGggYVIoq2lS3QwHHz4hE",
  authDomain: "grand-golden-vault.firebaseapp.com",
  projectId: "grand-golden-vault",
  storageBucket: "grand-golden-vault.firebasestorage.app",
  messagingSenderId: "969306014666",
  appId: "1:969306014666:web:228839a8b7f36e9b808533"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

window.signup = function () {
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  createUserWithEmailAndPassword(auth, email, password)
    .then(() => {
      window.location.href = "members.html";
    })
    .catch((error) => {
      alert(error.message);
    });
};
