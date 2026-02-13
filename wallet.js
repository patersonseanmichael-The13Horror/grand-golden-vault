// ================================
// GOLD VAULT — WALLET.JS
// ================================

// Load User
let user = JSON.parse(localStorage.getItem("gv_user"));

if (!user) {
    alert("Session expired. Redirecting...");
    window.location.href = "index.html";
}

// Save User
function saveUser() {
    localStorage.setItem("gv_user", JSON.stringify(user));
}


// -------------------------------
// HANDLE DEPOSIT + PROOF
// -------------------------------
const submitBtn = document.querySelector(".upload-section button");
const messageEl = document.getElementById("message");

submitBtn.addEventListener("click", () => {

    const amountInput = document.getElementById("depositAmount");
    const fileInput = document.getElementById("proofFile");

    const amount = parseFloat(amountInput.value);
    const file = fileInput.files[0];

    // Validation
    if (isNaN(amount) || amount < 5) {
        messageEl.textContent = "Minimum deposit is $5";
        return;
    }

    if (amount > 50000) {
        messageEl.textContent = "Maximum deposit is $50,000";
        return;
    }

    if (!file) {
        messageEl.textContent = "Please upload payment screenshot.";
        return;
    }

    // Add Balance
    user.balance += amount;

    // Add Ledger Entry (MATCHES members.js format)
    user.ledger.unshift({
        type: "Wallet Deposit",
        amount: amount,
        time: new Date().toLocaleString(),
        details: `
            Name: M Rainbow |
            PayID: 0435 - 750 - 187 |
            Ref: 10009444 |
            Description: Online / Items Purchased
        `
    });

    saveUser();

    messageEl.innerHTML = `
        ✅ Deposit Submitted Successfully<br>
        $${amount.toFixed(2)} GOLD Added
    `;

    amountInput.value = "";
    fileInput.value = "";
});
