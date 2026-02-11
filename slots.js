const container = document.getElementById('game-container');
let balance = 1000;
const balanceEl = document.getElementById('balance');

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(45, window.innerWidth/window.innerHeight, 0.1, 1000);
camera.position.set(0, 10, 20);
camera.lookAt(0, 0, 0);

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setClearColor(0x080503);
container.appendChild(renderer.domElement);

// Lighting
const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
scene.add(ambientLight);
const spotLight = new THREE.SpotLight(0xffd700, 1.5);
spotLight.position.set(15, 30, 20);
scene.add(spotLight);

// Reels setup
const reels = [];
const symbols = ['💎','🎲','🍾','🃏','💰','7️⃣'];
const reelPositions = [-8, -4, 0, 4, 8];

for (let i = 0; i < 5; i++) {
    const reel = new THREE.Group();
    for (let j = 0; j < 6; j++) { // max rows 6 for feature
        const symbolText = symbols[Math.floor(Math.random() * symbols.length)];
        const geometry = new THREE.TextGeometry(symbolText, { size: 1.2, height: 0.3 });
        const material = new THREE.MeshPhongMaterial({ color: 0xd4af37 });
        const mesh = new THREE.Mesh(geometry, material);
        mesh.position.y = j * 2;
        reel.add(mesh);
    }
    reel.position.x = reelPositions[i];
    reels.push(reel);
    scene.add(reel);
}

// Coin drop function
function dropCoin(value, position) {
    const geometry = new THREE.SphereGeometry(0.3, 12, 12);
    const material = new THREE.MeshPhongMaterial({ color: 0xffd700 });
    const coin = new THREE.Mesh(geometry, material);
    coin.position.set(position.x, 15, position.z);
    scene.add(coin);
    gsap.to(coin.position, {
        y: 0,
        duration: 1.2,
        ease: "bounce.out",
        onComplete: () => { scene.remove(coin); }
    });
}

// Spin logic
function spinReels() {
    reels.forEach(reel => {
        const randomOffset = Math.random() * 10 + 5;
        gsap.to(reel.rotation, {
            x: reel.rotation.x + randomOffset,
            duration: 1.5,
            ease: "power2.out",
            onComplete: () => {
                // Determine win per reel
                const winChance = Math.random();
                if (winChance < 1/43) dropCoin(1, reel.position);
                else if (winChance < 0.1) dropCoin(5, reel.position);
                else if (winChance < 0.03) dropCoin(25, reel.position);
                else if (winChance < 0.01) dropCoin(100, reel.position);
            }
        });
    });
}

document.getElementById('spinBtn').addEventListener('click', spinReels);

// Animation loop
function animate() {
    requestAnimationFrame(animate);
    renderer.render(scene, camera);
}
animate();

// Symbols & payouts
const symbols = [
    { name: "💎", multiplier: 1 },
    { name: "🎲", multiplier: 2 },
    { name: "🍾", multiplier: 5 },
    { name: "🃏", multiplier: 10 },
    { name: "💰", multiplier: 25 },
    { name: "7️⃣", multiplier: 50 }
];

const scatterSymbol = "🎰"; // Special symbol to trigger free spins
const featureSymbol = "⭐"; // Hold & Win feature

// Lines configuration (multiway example)
const linesConfig = [
    [0,0,0,0,0], // Top row
    [1,1,1,1,1], // Middle row
    [2,2,2,2,2], // Bottom row
];

// Free spin / Hold & Win config
let freeSpins = 0;
const holdPositions = [null, null, null, null, null, null]; // 6 positions for Hold & Win
