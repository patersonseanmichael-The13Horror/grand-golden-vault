import { auth } from './login.html';
import { signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/12.9.0/firebase-auth.js";

const loginForm = document.getElementById('loginForm');
const loginMessage = document.getElementById('loginMessage');

loginForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  const phone = document.getElementById('loginPhone').value;
  const password = document.getElementById('loginPassword').value;

  try{
    const email = phone + "@goldenvault.com"; // same fake email system
    await signInWithEmailAndPassword(auth, email, password);
    loginMessage.textContent = "Access granted!";
    window.location.href = "members.html";
  }catch(error){
    loginMessage.textContent = "Vault key or number invalid!";
  }
});
