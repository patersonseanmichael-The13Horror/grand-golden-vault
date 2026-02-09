import { auth } from './login.html'; // already exposed globally in index

import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/12.9.0/firebase-auth.js";

const signupForm = document.getElementById('signupForm');
const signupMessage = document.getElementById('signupMessage');

signupForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  const name = document.getElementById('signupName').value;
  const phone = document.getElementById('signupPhone').value;
  const dob = document.getElementById('signupDob').value;
  const password = document.getElementById('signupPassword').value;
  const confirmPassword = document.getElementById('signupConfirmPassword').value;

  if(password !== confirmPassword){
    signupMessage.textContent = "Vault keys do not match!";
    return;
  }

  try{
    const email = phone + "@goldenvault.com"; // fake email for Firebase auth
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    signupMessage.textContent = "Welcome to the Vault!";
    signupForm.reset();
    // automatic login
    await signInWithEmailAndPassword(auth, email, password);
    window.location.href = "members.html"; // redirect to members page
  }catch(error){
    signupMessage.textContent = error.message;
  }
});
