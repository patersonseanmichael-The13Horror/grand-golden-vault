<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1.0"/>
<title>Golden Vault — Gilded Prospector</title>

<!-- 🔒 Anti deep-link protection -->
<script>
const active = sessionStorage.getItem("activeSlot");
const entryTime = Number(sessionStorage.getItem("entryTime") || 0);
const expired = !entryTime || (Date.now() - entryTime) > 10 * 60 * 1000;

if (!active || expired) {
  window.location.replace("/games/slotsLobby.html");
}
</script>

<link rel="stylesheet" href="/vault/vaultTheme.css">

<style>
body{margin:0;font-family:Inter,system-ui,sans-serif}

.slot-shell{max-width:1000px;margin:30px auto;padding:0 15px}

.slot-header{
  display:flex;
  justify-content:space-between;
  align-items:center;
  margin-bottom:15px;
}

.slot-title{
  color:var(--gold);
  letter-spacing:.08em;
  font-weight:600;
}

.metric{
  border:1px solid var(--border-gold);
  padding:10px 14px;
  border-radius:10px;
  background:#120c08;
  margin-left:10px;
}

.metric span{color:var(--gold)}

.reels{
  display:grid;
  grid-template-columns:repeat(5,1fr);
  gap:12px;
  border:1px solid var(--border-gold);
  padding:18px;
  border-radius:14px;
  background:linear-gradient(#140e09,#080503);
}

.reel-symbol{
  border:1px solid rgba(212,175,55,.2);
  border-radius:10px;
  padding:18px;
  text-align:center;
  font-weight:600;
  background:#0c0805;
}

.controls{
  margin-top:15px;
  display:flex;
  gap:10px;
}

button{
  border:1px solid var(--gold);
  background:var(--gold);
  color:#000;
  padding:12px 18px;
  border-radius:10px;
  cursor:pointer;
  font-weight:700;
}

button.secondary{
  background:transparent;
  color:var(--text-light);
}

.status{
  margin-top:12px;
  padding:12px;
  border:1px solid rgba(212,175,55,.2);
  border-radius:10px;
  background:#120c08;
}
</style>
</head>

<body>

<div class="slot-shell">

<div class="slot-header">
  <h1 class="slot-title">Gilded Prospector</h1>

  <div style="display:flex">
    <div class="metric">BALANCE: <span id="balance">0</span> GOLD</div>
    <div class="metric">BET: <span id="bet">125</span> GOLD</div>
  </div>
</div>

<div class="reels" id="slotDisplay">
  <div class="reel-symbol">—</div>
  <div class="reel-symbol">—</div>
  <div class="reel-symbol">—</div>
  <div class="reel-symbol">—</div>
  <div class="reel-symbol">—</div>
</div>

<div class="controls">
  <button onclick="spinGildedProspector()">SPIN</button>
  <button class="secondary" onclick="backToSlots()">Slots Lobby</button>
  <button class="secondary" onclick="backToVault()">Vault</button>
</div>

<div class="status" id="resultText">Awaiting instruction…</div>

</div>

<!-- CORE FILES -->
<script src="/vault/vaultRouter.js"></script>
<script src="/vault/vaultAuth.js"></script>
<script src="/vault/vaultEngine.js"></script>
<script src="/games/slots/slotCore.js"></script>

<!-- MACHINE -->
<script src="/games/slots/gildedProspector.js"></script>

<script>
VaultAuth.enforce();

function renderMetrics(){
  document.getElementById("balance").textContent =
    VaultEngine.getBalance();
}

function backToSlots(){
  window.location.replace("/games/slotsLobby.html");
}

function backToVault(){
  sessionStorage.removeItem("activeSlot");
  sessionStorage.removeItem("entryTime");
  VaultRouter.toLobby();
}

renderMetrics();
</script>

</body>
</html>
