// script.js

// GOLD DUST PARTICLES (optional if not already in HTML)
const particleContainer = document.getElementById('loginParticles');
if(particleContainer){
  for(let i=0; i<40; i++){
    const p = document.createElement('div');
    p.classList.add('particle');
    p.style.left = Math.random()*100 + 'vw';
    p.style.top = Math.random()*100 + 'vh';
    p.style.width = p.style.height = (Math.random()*3 + 2) + 'px';
    particleContainer.appendChild(p);
  }
}

// Scroll helper
function scrollToSignup() {
  const signup = document.getElementById('signupBox');
  if(signup) signup.scrollIntoView({behavior: "smooth"});
}

// Vault doors animation trigger (if you have doors opening)
function openVaultDoors() {
  const left = document.querySelector('.vault-door-left');
  const right = document.querySelector('.vault-door-right');
  if(left && right){
    left.classList.add('open');
    right.classList.add('open');
  }
}
