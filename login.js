// login.js
import { auth } from "./firebase.js";
import {
  signInWithEmailAndPassword
} from "https://www.gstatic.com/firebasejs/9.23.0/firebase-auth.js";

const form = document.getElementById("loginForm");
const msg = document.getElementById("loginMessage");

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const phone = document.getElementById("loginPhone").value;
  const password = document.getElementById("loginPassword").value;
  const email = `${phone}@goldenvault.com`;

  try {
    await signInWithEmailAndPassword(auth, email, password);
    window.location.href = "members.html";
  } catch {
    msg.textContent = "Invalid vault credentials";
  }
});
