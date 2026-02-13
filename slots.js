// slots.js
import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.152.2/build/three.module.js';
import { gsap } from 'https://cdn.jsdelivr.net/npm/gsap@3.15.0/dist/gsap.min.js';

export function initSlots() {
    const container = document.getElementById('game-container');
    if(!container) return;
    container.innerHTML = '';

    let balance = 1000;
    let freeSpins = 0;
    const holdPositions = [null, null, null, null, null, null];
    const symbolsArr = ['💎','🎲','🍾','🃏','💰','7️⃣'];
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

    // THREE.js Scene Setup
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, container.clientWidth / container.clientHeight, 0.1, 1000);
    camera.position.set(0, 10, 20);
    camera.lookAt(0, 6, 0);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setClearColor(0x080503);
    container.appendChild(renderer.domElement);

    // Lights
    scene.add(new THREE.AmbientLight(0xffffff, 0.6));
    const spotLight = new THREE.SpotLight(0xffd700, 1.5);
    spotLight.position.set(15, 30, 20);
    scene.add(spotLight);

    // Aurora Lights
    const auroraColors = [0xffd700, 0xff0080, 0x00ffff, 0xff8000];
    const auroraLights = auroraColors.map((c, i) => {
        const light = new THREE.PointLight(c, 2, 50, 2);
        light.position.set(-12 + i * 8, 8, 5);
        scene.add(light);
        gsap.to(light.position, { y: '+=3', duration: 2 + Math.random() * 2, repeat: -1, yoyo: true, ease: "sine.inOut" });
        return light;
    });

    // Reel Setup
    const reelPositions = [-8,-4,0,4,8];
    const reelObjects = [];

    function createReelTexture(symbols, rows = 6) {
        const canvas = document.createElement('canvas');
        canvas.width = 128;
        canvas.height = 128 * rows;
        const ctx = canvas.getContext('2d');
        ctx.fillStyle = "#080503";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.font = "100px Arial";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        for (let i = 0; i < rows; i++) {
            ctx.fillStyle = "#FFD700";
            ctx.fillText(symbols[Math.floor(Math.random() * symbols.length)], canvas.width / 2, 64 + i * 128);
        }
        const texture = new THREE.CanvasTexture(canvas);
        texture.wrapS = THREE.RepeatWrapping;
        texture.wrapT = THREE.RepeatWrapping;
        return texture;
    }

    function createReelMesh(posX, symbols) {
        const geometry = new THREE.PlaneGeometry(2, 12);
        const texture = createReelTexture(symbols);
        const material = new THREE.MeshStandardMaterial({ map: texture, metalness: 0.6, roughness: 0.3, emissive: 0xffd700, emissiveIntensity: 0.4, side: THREE.DoubleSide });
        const mesh = new THREE.Mesh(geometry, material);
        mesh.position.set(posX, 6, 0);
        return { mesh, texture };
    }

    reelPositions.forEach(x => {
        const reel = createReelMesh(x, symbolsArr);
        scene.add(reel.mesh);
        reelObjects.push(reel);
    });

    // Coin Effects
    function coinExplosion(pos, amount) {
        const count = Math.min(Math.floor(amount), 50);
        for(let i=0;i<count;i++){
            const coin = new THREE.Mesh(new THREE.SphereGeometry(0.2, 8, 8), new THREE.MeshPhongMaterial({ color: 0xffd700 }));
            coin.position.copy(pos);
            scene.add(coin);
            gsap.to(coin.position, { x: pos.x + (Math.random()-0.5)*5, y: pos.y + Math.random()*5 +2, z: pos.z + (Math.random()-0.5)*5, duration: 1.2, ease:"power2.out", onComplete:()=>scene.remove(coin) });
        }
    }

    function dropCoin(value, position) {
        if(value > 50){ coinExplosion(position, value); cameraShake(); return; }
        const coin = new THREE.Mesh(new THREE.SphereGeometry(0.3,12,12), new THREE.MeshPhongMaterial({ color:0xffd700 }));
        coin.position.set(position.x, 15, position.z);
        scene.add(coin);
        gsap.to(coin.position, { y: 0, duration: 1.2, ease:"bounce.out", onComplete:()=>scene.remove(coin) });
    }

    function cameraShake(duration = 0.5, intensity = 0.5) {
        const start = camera.position.clone();
        const tl = gsap.timeline();
        tl.to(camera.position, { x: `+=${intensity}`, y: `+=${intensity}`, z: `+=${intensity}`, duration:0.05, repeat: duration/0.05, yoyo:true, ease:"power1.inOut", onComplete:()=>camera.position.copy(start) });
    }

    function spinReelTexture(reelObj, spins = 10, duration = 2) {
        gsap.to(reelObj.texture.offset, { y: spins, duration: duration, ease:"power4.inOut", onComplete:()=> { reelObj.texture.offset.y %= 1; dropCoin(Math.random()*50+1, reelObj.mesh.position); } });
    }

    function calculateRandomCoin(multiplier) {
        const chance = Math.random();
        let base = 1;
        if(chance<0.01) base=100;
        else if(chance<0.02) base=25;
        else if(chance<0.05) base=10;
        else if(chance<0.1) base=5;
        else if(chance<0.43) base=2.25;
        return base * multiplier;
    }

    function spinReels() {
        let totalWin = 0;
        reelObjects.forEach(reelObj => {
            const spins = Math.floor(Math.random()*5+5);
            spinReelTexture(reelObj, spins, 2);
            const winningSymbol = symbols[Math.floor(Math.random()*symbols.length)];
            if(winningSymbol.name === scatterSymbol) freeSpins += 6;
            if(winningSymbol.name === featureSymbol) { const idx = holdPositions.findIndex(p=>p===null); if(idx>=0) holdPositions[idx]=featureSymbol; }
            const winAmount = calculateRandomCoin(winningSymbol.multiplier);
            dropCoin(winAmount, reelObj.mesh.position);
            totalWin += winAmount;
        });
        balance += totalWin;
        const balanceEl = document.getElementById('balance');
        if(balanceEl) balanceEl.textContent = balance.toFixed(2);
    }

    function handleFreeSpins() { if(freeSpins>0){ freeSpins--; spinReels(); setTimeout(handleFreeSpins,2000); } }

    // Continuous Visuals
    (function animateShimmer() {
        reelObjects.forEach(r=>r.mesh.material.emissiveIntensity = 0.4 + Math.sin(Date.now()*0.005)*0.4);
        requestAnimationFrame(animateShimmer);
    })();

    (function animateAurora() {
        auroraLights.forEach((l,i)=>{ l.position.x = Math.sin(Date.now()*0.001+i)*10; l.position.z = Math.cos(Date.now()*0.001+i)*5; });
        requestAnimationFrame(animateAurora);
    })();

    // Render
    (function render() { requestAnimationFrame(render); renderer.render(scene, camera); })();

    // Button Bindings
    const spinBtn = document.getElementById('spinBtn');
    if(spinBtn) spinBtn.onclick = () => { spinReels(); if(freeSpins>0) handleFreeSpins(); };

    const autoSpinBtn = document.getElementById('autoSpinBtn');
    if(autoSpinBtn) autoSpinBtn.onclick = () => {
        let spinsLeft = 10;
        const interval = setInterval(()=>{
            if(spinsLeft<=0){ clearInterval(interval); return; }
            spinReels(); spinsLeft--;
        },1800);
    };

    const doubleUpBtn = document.getElementById('doubleUpBtn');
    if(doubleUpBtn) doubleUpBtn.onclick = () => {
        balance = (Math.random()<0.5)? balance*2 : balance/2;
        const balanceEl = document.getElementById('balance');
        if(balanceEl) balanceEl.textContent = balance.toFixed(2);
    };

    console.log("🚀 Platinum Vegas Slots Initialized!");
}
