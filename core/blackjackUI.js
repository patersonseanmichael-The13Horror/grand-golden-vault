import { startGame, hit, stand } from "../games/blackjackEngine.js";
import { getBalance } from "../core/stateManager.js";

export function initBlackjackUI() {

    const balanceEl = document.getElementById("balance");
    const dealerEl = document.getElementById("dealer-cards");
    const playerEl = document.getElementById("player-cards");
    const messageEl = document.getElementById("message");

    function renderCards(container, hand) {
        container.innerHTML = "";
        hand.forEach(card=>{
            const div = document.createElement("div");
            div.classList.add("card");
            div.textContent = card;
            container.appendChild(div);
        });
    }

    function updateBalance() {
        balanceEl.textContent = "$" + getBalance();
    }

    window.setBet = (amount) => {
        try {
            const state = startGame(amount);
            renderCards(playerEl, state.player);
            renderCards(dealerEl, [state.dealer[0], "🂠"]);
            updateBalance();
        } catch (e) {
            messageEl.textContent = e.message;
        }
    };

    window.hit = () => {
        const state = hit();
        if (!state) return;
        renderCards(playerEl, state.player);
        if (state.result) finish(state);
    };

    window.stand = () => {
        const state = stand();
        finish(state);
    };

    function finish(state) {
        renderCards(playerEl, state.player);
        renderCards(dealerEl, state.dealer);
        updateBalance();
        messageEl.textContent = state.result;
    }

    updateBalance();
}
