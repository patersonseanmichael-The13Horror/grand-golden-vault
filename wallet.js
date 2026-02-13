// ================================
// GOLD VAULT - WALLET.JS
// ================================


// -------------------------------
// LOAD USER
// -------------------------------
let user = JSON.parse(localStorage.getItem("gv_user"));

if (!user) {
    alert("User session not found.");
    window.location.href = "index.html";
}


// -------------------------------
// SAVE USER
// -------------------------------
function saveUser() {
    localStorage.setItem("gv_user", JSON.stringify(user));
}


// -------------------------------
// HANDLE DEPOSIT SUBMISSION
// -------------------------------
const submitBtn = document.getElementById("submitProofBtn");

if (submitBtn) {
    submitBtn.onclick = () => {

        const file = document.getElementById("proofUpload").files[0];
        const amountInput = document.getElementById("depositAmount");

        if (!amountInput.value) {
            return alert("Please enter deposit amount.");
        }

        const amount = parseFloat(amountInput.value);

        // Deposit Limits
        if (amount < 5 || amount > 50000) {
            return alert("Deposit must be between $5 and $50,000.");
        }

        if (!file) {
            return alert("Please upload payment screenshot.");
        }

        // Add to balance
        user.balance += amount;

        // Add to ledger
        user.ledger.unshift({
            type: "Wallet Deposit",
            amount: amount,
            time: new Date().toLocaleString(),
            details: `
                Name: M Rainbow |
                PayID: 0435 750 187 |
                Ref: 10009444 |
                Description: Online / Items Purchased
            `
        });

        saveUser();

        document.getElementById("proofMessage").innerHTML =
            `✅ Deposit submitted successfully!<br>
             Amount: $${amount.toFixed(2)} GOLD`;

        amountInput.value = "";
        document.getElementById("proofUpload").value = "";
    };
}
