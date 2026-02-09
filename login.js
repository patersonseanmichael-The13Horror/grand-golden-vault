// -------------------- FIREBASE SETUP --------------------
import { initializeApp } from "https://www.gstatic.com/firebasejs/12.9.0/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/12.9.0/firebase-auth.js";
import { getFirestore, doc, setDoc, getDoc } from "https://www.gstatic.com/firebasejs/12.9.0/firebase-firestore.js";

// Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyAyWGltBo7tZgZydGkaZwmKW2WzkOpwWn4",
  authDomain: "goldenvault-65fe2.firebaseapp.com",
  projectId: "goldenvault-65fe2",
  storageBucket: "goldenvault-65fe2.firebasestorage.app",
  messagingSenderId: "825820839145",
  appId: "1:825820839145:web:7a04520086290010510478",
  measurementId: "G-Z2VCVP4CKH"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// -------------------- LOGIN --------------------
const loginForm = document.getElementById('loginForm');
loginForm.addEventListener('submit', async (e) => {
  e.preventDefault();

  const phone = document.getElementById('loginPhone').value.trim();
  const password = document.getElementById('loginPassword').value;
  const email = phone + "@vault.com";

  try {
    // Attempt login
    await signInWithEmailAndPassword(auth, email, password);
    document.getElementById('loginMessage').textContent = "Login successful!";
    document.getElementById('loginMessage').style.color = "#d4af37";

    // Redirect to members vault or show members area
    setTimeout(() => { window.location.href = "members.html"; }, 800);

  } catch (error) {
    // If user not found, try auto-register
    if (error.code === "auth/user-not-found") {
      document.getElementById('loginMessage').textContent = "User not found. Please request access.";
      document.getElementById('loginMessage').style.color = "#f55";
    } else if (error.code === "auth/wrong-password") {
      document.getElementById('loginMessage').textContent = "Vault key incorrect!";
      document.getElementById('loginMessage').style.color = "#f55";
    } else {
      document.getElementById('loginMessage').textContent = error.message;
      document.getElementById('loginMessage').style.color = "#f55";
    }
  }
});

// -------------------- SIGNUP --------------------
const signupForm = document.getElementById('signupForm');
signupForm.addEventListener('submit', async (e) => {
  e.preventDefault();

  const name = document.getElementById('signupName').value.trim();
  const phone = document.getElementById('signupPhone').value.trim();
  const dob = document.getElementById('signupDob').value;
  const password = document.getElementById('signupPassword').value;
  const confirmPassword = document.getElementById('signupConfirmPassword').value;

  const messageEl = document.getElementById('message');

  if (password !== confirmPassword) {
    messageEl.textContent = "Vault keys do not match!";
    messageEl.style.color = "#f55";
    return;
  }

  const email = phone + "@vault.com";

  try {
    // Check if user already exists in Firestore
    const docRef = doc(db, "members", phone);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      messageEl.textContent = "Phone number already registered. Please login.";
      messageEl.style.color = "#f55";
      return;
    }

    // Create user in Firebase Auth
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);

    // Add user info to Firestore
    await setDoc(doc(db, "members", phone), {
      name,
      phone,
      dob,
      createdAt: new Date().toISOString()
    });

    messageEl.textContent = "Access granted! Redirecting to vault...";
    messageEl.style.color = "#d4af37";

    setTimeout(() => { window.location.href = "members.html"; }, 1000);

  } catch (error) {
    console.error(error);
    messageEl.textContent = error.message;
    messageEl.style.color = "#f55";
  }
});
