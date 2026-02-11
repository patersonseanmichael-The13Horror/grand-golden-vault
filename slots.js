const container = document.getElementById('game-container');
let balance = 1000;
const balanceEl = document.getElementById('balance');

// ----- THREE.JS SETUP -----
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(45, window.innerWidth/window.innerHeight, 0.1, 1000);
camera.position.set(0, 10, 20);
camera.lookAt(0, 0, 0);

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setClearColor(0x080503);
container.appendChild(renderer.domElement);

// Lights
const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
scene.add(ambientLight);
const spotLight = new THREE.SpotLight(0xffd700, 1.5);
spotLight.position.set(15, 30, 20);
scene.add(spotLight);

// ----- SYMBOLS -----
const symbolStrings = ['💎','🎲','🍾','🃏','💰','7️⃣'];
const symbolData = [
    { name: "💎", multiplier: 1 },
    { name: "🎲", multiplier: 2 },
    { name: "🍾", multiplier: 5 },
    { name: "🃏", multiplier: 10 },
    { name: "💰", multiplier: 25 },
    { name: "7️⃣", multiplier: 50 }
];

const scatterSymbol = "🎰";
const featureSymbol = "⭐";
let freeSpins = 0;
const holdPositions = [null,null,null,null,null,null];

// ----- REELS SETUP -----
const reels = [];
const reelPositions = [-8,-4,0,4,8];
for (let i=0;i<5;i++){
    const reel = new THREE.Group();
    for (let j=0;j<6;j++){ // max rows for feature
        const symbolText = symbolStrings[Math.floor(Math.random()*symbolStrings.length)];
        const geometry = new THREE.TextGeometry(symbolText,{size:1.2,height:0.3});
        const material = new THREE.MeshPhongMaterial({ color: 0xd4af37 });
        const mesh = new THREE.Mesh(geometry, material);
        mesh.position.y = j*2;
        reel.add(mesh);
    }
    reel.position.x = reelPositions[i];
    reels.push(reel);
    scene.add(reel);
}

// ----- VIP VISUALS -----
const auroraColors = [0xffd700,0x8a2be2,0x00ffcc];
const auroraLights = [];
for(let i=0;i<3;i++){
    const light = new THREE.PointLight(auroraColors[i],2,50,2);
    light.position.set(-10+i*10,10,-5);
    scene.add(light);
    auroraLights.push(light);
}

function animateAurora(){
    auroraLights.forEach((light,idx)=>{
        light.position.x = Math.sin(Date.now()*0.001+idx)*10;
        light.position.z = Math.cos(Date.now()*0.001+idx)*5;
    });
    requestAnimationFrame(animateAurora);
}
animateAurora();

// Shimmer on symbols
reels.forEach(reel=>{
    reel.children.forEach(sym=>{
        sym.material.emissive = new THREE.Color(0xffd700);
        sym.material.emissiveIntensity = 0.5;
    });
});
function animateShimmer(){
    reels.forEach(reel=>{
        reel.children.forEach(sym=>{
            sym.material.emissiveIntensity = 0.5+Math.sin(Date.now()*0.005+sym.position.y)*0.5;
        });
    });
    requestAnimationFrame(animateShimmer);
}
animateShimmer();

// ----- COIN EFFECTS -----
function coinExplosion(position, amount){
    const particleCount = Math.min(Math.floor(amount),50);
    for(let i=0;i<particleCount;i++){
        const coin = new THREE.Mesh(
            new THREE.SphereGeometry(0.2,8,8),
            new THREE.MeshPhongMaterial({color:0xffd700})
        );
        coin.position.set(position.x,position.y,position.z);
        scene.add(coin);
        gsap.to(coin.position,{
            x: position.x + (Math.random()-0.5)*5,
            y: position.y + Math.random()*5+2,
            z: position.z + (Math.random()-0.5)*5,
            duration: 1.2,
            ease: "power2.out",
            onComplete:()=>scene.remove(coin)
        });
    }
}

function featureSparkle(position){
    for(let i=0;i<20;i++){
        const p = new THREE.Mesh(
            new THREE.SphereGeometry(0.1,6,6),
            new THREE.MeshBasicMaterial({color:0x00ffcc})
        );
        p.position.set(position.x,position.y,position.z);
        scene.add(p);
        gsap.to(p.position,{
            x:position.x+(Math.random()-0.5)*2,
            y:position.y+Math.random()*3,
            z:position.z+(Math.random()-0.5)*2,
            duration:1,
            onComplete:()=>scene.remove(p)
        });
    }
}

function bigWinCamera(){
    gsap.to(camera.position,{x:0,y:15,z:25,duration:1,ease:"power2.inOut",onComplete:()=>{
        gsap.to(camera.position,{x:0,y:10,z:20,duration:1.5,ease:"power2.inOut"});
    }});
}

// ----- SPIN LOGIC -----
function calculateRandomCoin(multiplier){
    const chance=Math.random();
    let base=0;
    if(chance<1/43) base=1;
    else if(chance<0.1) base=2.25;
    else if(chance<0.05) base=5;
    else if(chance<0.02) base=10;
    else if(chance<0.01) base=25;
    else base=100;
    return base*multiplier;
}

function dropCoin(value,position){
    if(value>50){
        coinExplosion(position,value);
        bigWinCamera();
        return;
    }
    const coin=new THREE.Mesh(new THREE.SphereGeometry(0.3,12,12), new THREE.MeshPhongMaterial({color:0xffd700}));
    coin.position.set(position.x,15,position.z);
    scene.add(coin);
    gsap.to(coin.position,{y:0,duration:1.2,ease:"bounce.out",onComplete:()=>scene.remove(coin)});
}

function spinReels(){
    let totalWin=0;
    reels.forEach((reel,i)=>{
        const randomOffset=Math.random()*10+5;
        gsap.to(reel.rotation,{x:reel.rotation.x+randomOffset,duration:1.5,ease:"power2.out",onComplete:()=>{
            const winningSymbol = symbolData[Math.floor(Math.random()*symbolData.length)];
            if(winningSymbol.name===scatterSymbol){freeSpins+=6; console.log("Free Spins Triggered! Total:",freeSpins);}
            if(winningSymbol.name===featureSymbol){
                const idx = holdPositions.findIndex(p=>p===null);
                if(idx>=0){holdPositions[idx]=featureSymbol; featureSparkle(reel.position);}
            }
            const winAmount = calculateRandomCoin(winningSymbol.multiplier);
            dropCoin(winAmount,reel.position);
            totalWin += winAmount;
        }});
    });
    balance+=totalWin;
    balanceEl.textContent=balance.toFixed(2);
}

// ----- FREE SPINS -----
function handleFreeSpins(){
    if(freeSpins>0){
        freeSpins--;
        spinReels();
        setTimeout(handleFreeSpins,2000);
    }
}

// ----- UI BUTTONS -----
document.getElementById('spinBtn').addEventListener('click',()=>{spinReels(); if(freeSpins>0) handleFreeSpins();});
document.getElementById('autoSpinBtn').addEventListener('click',()=>{
    let spinsLeft=10;
    const interval=setInterval(()=>{
        if(spinsLeft<=0){clearInterval(interval); return;}
        spinReels();
        spinsLeft--;
    },1800);
});
document.getElementById('doubleUpBtn').addEventListener('click',()=>{
    if(Math.random()<0.5){balance*=2; console.log("Double Up WIN!");} 
    else {balance/=2; console.log("Double Up LOSS!");}
    balanceEl.textContent=balance.toFixed(2);
});

// ----- ANIMATION LOOP -----
function animate(){
    requestAnimationFrame(animate);
    animateShimmer();
    animateAurora();
    renderer.render(scene,camera);
}
animate();
