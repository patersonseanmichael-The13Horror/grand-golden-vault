// slots.js
import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.152.2/build/three.module.js';
import { gsap } from 'https://cdn.jsdelivr.net/npm/gsap@3.15.0/dist/gsap.min.js';

export function initSlots() {
  const container = document.getElementById('game-container');
  container.innerHTML = ''; // clear previous if any
  let balance = 1000;

  // Scene
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(45, container.clientWidth/container.clientHeight, 0.1, 1000);
  camera.position.set(0, 10, 20);
  camera.lookAt(0, 0, 0);

  const renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setSize(container.clientWidth, container.clientHeight);
  renderer.setClearColor(0x080503);
  container.appendChild(renderer.domElement);

  // Lights
  const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
  scene.add(ambientLight);
  const spotLight = new THREE.SpotLight(0xffd700, 1.5);
  spotLight.position.set(15, 30, 20);
  scene.add(spotLight);

  // Aurora / Neon lights
  const auroraColors = [0xffd700, 0xff0080, 0x00ffff, 0xff8000];
  const auroraLights = [];
  auroraColors.forEach((c, i) => {
    const light = new THREE.PointLight(c, 2, 50, 2);
    light.position.set(-12 + i*8, 8, 5);
    scene.add(light);
    auroraLights.push(light);
    gsap.to(light.position, {
      y: "+=3", duration: 2 + Math.random()*2, repeat: -1, yoyo: true, ease: "sine.inOut"
    });
  });

  // Reels
  const reels = [];
  const symbolsArr = ['💎','🎲','🍾','🃏','💰','7️⃣'];
  const reelPositions = [-8, -4, 0, 4, 8];
  const textureLoader = new THREE.TextureLoader();
  const goldTexture = textureLoader.load('textures/gold.jpg');
  const diamondTexture = textureLoader.load('textures/diamond.jpg');

  for (let i = 0; i < 5; i++) {
    const reel = new THREE.Group();

    // Reel frame
    const frame = new THREE.Mesh(
      new THREE.BoxGeometry(2.5, 12, 2.5),
      new THREE.MeshStandardMaterial({ color: 0x222222, metalness: 0.8, roughness: 0.2 })
    );
    frame.position.set(reelPositions[i], 5, 0);
    scene.add(frame);

    for (let j = 0; j < 6; j++) {
      const symbolText = symbolsArr[Math.floor(Math.random() * symbolsArr.length)];
      const geometry = new THREE.TextGeometry(symbolText, { size: 1.2, height: 0.3 });
      const material = new THREE.MeshStandardMaterial({
        map: symbolText==="💎"? diamondTexture : goldTexture,
        metalness: 1,
        roughness: 0.2,
        emissive: 0xffd700,
        emissiveIntensity: 0.5
      });
      const mesh = new THREE.Mesh(geometry, material);
      mesh.position.y = j*2;
      reel.add(mesh);
    }
    reel.position.x = reelPositions[i];
    reels.push(reel);
    scene.add(reel);
  }

  // Coin drop / big win
  function coinExplosion(position, amount){
    const particleCount = Math.min(Math.floor(amount), 50);
    for(let i=0;i<particleCount;i++){
      const coin = new THREE.Mesh(
        new THREE.SphereGeometry(0.2, 8, 8),
        new THREE.MeshPhongMaterial({ color: 0xffd700 })
      );
      coin.position.set(position.x, position.y, position.z);
      scene.add(coin);
      gsap.to(coin.position,{
        x: position.x + (Math.random()-0.5)*5,
        y: position.y + Math.random()*5+2,
        z: position.z + (Math.random()-0.5)*5,
        duration: 1.2,
        ease: "power2.out",
        onComplete: ()=> scene.remove(coin)
      });
    }
  }

  function dropCoin(value, position){
    if(value>50){
      coinExplosion(position,value);
      cameraShake();
      return;
    }
    const coin = new THREE.Mesh(
      new THREE.SphereGeometry(0.3,12,12),
      new THREE.MeshPhongMaterial({ color:0xffd700 })
    );
    coin.position.set(position.x,15,position.z);
    scene.add(coin);
    gsap.to(coin.position,{ y:0, duration:1.2, ease:"bounce.out", onComplete:()=>scene.remove(coin) });
  }

  function featureSparkle(position){
    for(let i=0;i<20;i++){
      const particle = new THREE.Mesh(
        new THREE.SphereGeometry(0.1,6,6),
        new THREE.MeshBasicMaterial({color:0x00ffcc})
      );
      particle.position.set(position.x,position.y,position.z);
      scene.add(particle);
      gsap.to(particle.position,{
        x: position.x + (Math.random()-0.5)*2,
        y: position.y + Math.random()*3,
        z: position.z + (Math.random()-0.5)*2,
        duration:1,
        onComplete: ()=>scene.remove(particle)
      });
    }
  }

  // Symbols & features
  const symbols = [
    { name:"💎", multiplier:1 },
    { name:"🎲", multiplier:2 },
    { name:"🍾", multiplier:5 },
    { name:"🃏", multiplier:10 },
    { name:"💰", multiplier:25 },
    { name:"7️⃣", multiplier:50 }
  ];
  const scatterSymbol = "🎰";
  const featureSymbol = "⭐";
  let freeSpins = 0;
  const holdPositions = [null,null,null,null,null,null];

  function calculateRandomCoin(multiplier){
    const chance = Math.random();
    let base=0;
    if(chance<1/43) base=1;
    else if(chance<0.1) base=2.25;
    else if(chance<0.05) base=5;
    else if(chance<0.02) base=10;
    else if(chance<0.01) base=25;
    else base=100;
    return base*multiplier;
  }

  function cameraShake(duration=0.5,intensity=0.5){
    const startX=camera.position.x,startY=camera.position.y,startZ=camera.position.z;
    const tl = gsap.timeline();
    tl.to(camera.position,{
      x:`+=${intensity}`, y:`+=${intensity}`, z:`+=${intensity}`,
      duration:0.05, repeat:duration/0.05, yoyo:true, ease:"power1.inOut",
      onComplete:()=> camera.position.set(startX,startY,startZ)
    });
  }

  // Spin reels
  function spinReels(){
    let totalWin=0;
    reels.forEach((reel,i)=>{
      const rotations = Math.floor(Math.random()*5+5);
      gsap.to(reel.rotation,{ x: reel.rotation.x + rotations*Math.PI*2, duration:2, ease:"power4.inOut", onUpdate: ()=>{
        reel.children.forEach(sym=>{
          sym.material.emissiveIntensity = 0.5 + Math.random()*0.5;
        });
      }, onComplete: ()=>{
        const winningSymbol = symbols[Math.floor(Math.random()*symbols.length)];
        if(winningSymbol.name===scatterSymbol){ freeSpins+=6; }
        if(winningSymbol.name===featureSymbol){
          const idx = holdPositions.findIndex(p=>p===null);
          if(idx>=0) holdPositions[idx]=featureSymbol;
        }
        const winAmount = calculateRandomCoin(winningSymbol.multiplier);
        dropCoin(winAmount,reel.position);
        totalWin += winAmount;
        balance += totalWin;
        if(document.getElementById('balance')) document.getElementById('balance').textContent = balance.toFixed(2);
      }});
    });
  }

  function handleFreeSpins(){
    if(freeSpins>0){ freeSpins--; spinReels(); setTimeout(handleFreeSpins,2000); }
  }

  // Animate shimmer
  function animateShimmer(){
    reels.forEach(reel=>{
      reel.children.forEach(sym=>{
        sym.material.emissiveIntensity = 0.5 + Math.sin(Date.now()*0.005 + sym.position.y)*0.5;
      });
    });
    requestAnimationFrame(animateShimmer);
  }
  animateShimmer();

  // Animate aurora
  function animateAurora(){
    auroraLights.forEach((light,idx)=>{
      light.position.x = Math.sin(Date.now()*0.001+idx)*10;
      light.position.z = Math.cos(Date.now()*0.001+idx)*5;
    });
    requestAnimationFrame(animateAurora);
  }
  animateAurora();

  // Render loop
  function animate(){ requestAnimationFrame(animate); renderer.render(scene,camera); }
  animate();

  // Buttons (assumes HTML buttons exist with these IDs)
  const spinBtn = document.getElementById('spinBtn');
  if(spinBtn) spinBtn.onclick = ()=>{ spinReels(); if(freeSpins>0) handleFreeSpins(); }

  const autoSpinBtn = document.getElementById('autoSpinBtn');
  if(autoSpinBtn) autoSpinBtn.onclick = ()=>{
    let spinsLeft=10;
    const interval=setInterval(()=>{
      if(spinsLeft<=0){ clearInterval(interval); return; }
      spinReels(); spinsLeft--;
    },1800);
  }

  const doubleUpBtn = document.getElementById('doubleUpBtn');
  if(doubleUpBtn) doubleUpBtn.onclick = ()=>{
    if(Math.random()<0.5){ balance*=2; } else{ balance/=2; }
    if(document.getElementById('balance')) document.getElementById('balance').textContent = balance.toFixed(2);
  }

  console.log("Platinum Vegas Slots Initialized!");
}
