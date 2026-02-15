(function () {
  "use strict";

  const slots = [
    { id: "goldenCompass", name: "Golden Compass", bet: 100 },
    { id: "imperialLotus", name: "Imperial Lotus", bet: 100 },
    { id: "sovereignGoldRush", name: "Sovereign Gold Rush", bet: 150 },
    { id: "obsidianCrown", name: "Obsidian Crown", bet: 200 },
    { id: "auricSerpent", name: "Auric Serpent", bet: 175 },
    { id: "gildedProspector", name: "Gilded Prospector", bet: 125 }
  ];

  const grid = document.getElementById("slotGrid");
  const balanceEl = document.getElementById("balance");

  function renderLobby() {
    balanceEl.textContent = VaultEngine.getBalance();

    grid.innerHTML = slots.map(slot => `
      <div class="slot-card" onclick="enterSlot('${slot.id}')">
        <h2>${slot.name}</h2>
        <span>BET: ${slot.bet} GOLD</span>
      </div>
    `).join("");
  }

  window.enterSlot = function (id) {
    sessionStorage.setItem("activeSlot", id);
    window.location.href = `/games/slots/${id}.html`;
  };

  window.returnToVault = function () {
    window.location.href = "/games/vault.html";
  };

  renderLobby();
})();
