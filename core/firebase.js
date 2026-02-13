<script type="module">
import { initializeApp } from "https://www.gstatic.com/firebasejs/12.9.0/firebase-app.js";
import { getAuth, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/12.9.0/firebase-auth.js";

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

window.gvAuth = auth;
window.gvSignOut = signOut;

onAuthStateChanged(auth, (user) => {
  if(!user || !user.emailVerified){
    window.location.href = "login.html";
  }
});
</script>
