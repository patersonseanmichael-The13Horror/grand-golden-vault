document.getElementById("loginForm").addEventListener("submit", function(e) {
  e.preventDefault();

  const phone = document.getElementById("phone").value.trim();
  const password = document.getElementById("password").value;
  const message = document.getElementById("loginMessage");

  message.textContent = ""; // clear previous message

  // get all users from localStorage
  const users = JSON.parse(localStorage.getItem("goldenvault_users")) || [];
  const user = users.find(u => u.phone === phone);

  // user not found
  if (!user) {
    message.textContent = "No access request found.";
    return;
  }

  // user pending approval
  if (user.status !== "approved") {
    message.textContent = "Access pending approval.";
    return;
  }

  // password check
  if (user.password !== password) {
    message.textContent = "Vault Key incorrect.";
    return;
  }

  // optional: save logged-in state
  localStorage.setItem("goldenvault_logged_in", JSON.stringify(user));

  // success
  message.textContent = "Login successful. Redirecting to the Vault...";

  setTimeout(() => {
    window.location.href = "members.html";
  }, 1000);
});
