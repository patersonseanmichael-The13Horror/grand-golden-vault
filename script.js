<script>
  const doors = document.getElementById('doors');
  const vault = document.getElementById('vault');

  // Open vault on load
  setTimeout(() => {
    doors.classList.add('open');
  }, 600);

  setTimeout(() => {
    vault.classList.add('visible');
  }, 2000);

  // Exit vault (close doors)
  function exitVault() {
    vault.classList.remove('visible');

    setTimeout(() => {
      doors.classList.remove('open');
    }, 400);

    // Redirect or reload after doors close
    setTimeout(() => {
      window.location.href = "index.html"; 
      // later this becomes logout + redirect
    }, 2600);
  }
</script>
