// ================================
// Golden Vault — State Manager
// Only file allowed to touch localStorage
// ================================

const WALLET_KEY = "goldenVaultBalance";
const BJ_STATE_KEY = "goldenVaultBJState";

/* =========================
   WALLET MANAGEMENT
========================= */

export function getBalance() {
    const stored = localStorage.getItem(WALLET_KEY);
    return stored ? parseInt(stored) : 1000;
}

export function setBalance(amount) {
    localStorage.setItem(WALLET_KEY, amount);
}

/* =========================
   BLACKJACK STATE
========================= */

export function saveBlackjackState(state) {
    localStorage.setItem(BJ_STATE_KEY, JSON.stringify(state));
}

export function loadBlackjackState() {
    const saved = localStorage.getItem(BJ_STATE_KEY);
    return saved ? JSON.parse(saved) : null;
}

export function clearBlackjackState() {
    localStorage.removeItem(BJ_STATE_KEY);
}
