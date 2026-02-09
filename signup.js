document.getElementById("signupForm").addEventListener("submit", function (e) {
  e.preventDefault();

  const name = document.getElementById("name").value.trim();
  const phone = document.getElementById("phone").value.trim();
  const dob = document.getElementById("dob").value;
  const password = document.getElementById("password").value;
  const confirmPassword = document.getElementById("confirmPassword").value;
  const message = document.getElementById("message");

  message.textContent = "";

  // 🔞 AGE CHECK (18+)
  const birthDate = new Date(dob);
  const today = new Date();
  const age = today.getFullYear() - birthDate.getFullYear();
  const m = today.getMonth() - birthDate.getMonth();

  if (age < 18 || (age === 18 && m < 0)) {
    message.textContent = "Access denied. Vault entry is 18+ only.";
    return;
  }

  // 🔐 PASSWORD MATCH
  if (password !== confirmPassword) {
    message.textContent = "Vault Keys do not match.";
    return;
  }

  let users = JSON.parse(localStorage.getItem("goldenvault_users")) || [];

  // 🚫 DOUBLE DIPPING CHECK (mobile number)
  if (users.find(u => u.phone === phone)) {
    message.textContent = "The Vault Does Not Approve Greed.";
    return;
  }

  // ✅ STORE REQUEST
  users.push({
    name,
    phone,
    dob,
    password,
    status: "pending",
    created: new Date().toISOString()
  });

  localStorage.setItem("goldenvault_users", JSON.stringify(users));

  message.textContent = "Request received. Approval pending.";

  setTimeout(() => {
    window.location.href = "login.html";
  }, 3000);
});
