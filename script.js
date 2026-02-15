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

const liveFeed = document.getElementById('liveFeed');
const playersCount = 6;

// Function to generate random player ID
function generatePlayerID() {
  const first = String(Math.floor(Math.random() * 90 + 10));
  const last = String(Math.floor(Math.random() * 900 + 100));
  return `${first}*****${last}`;
}

// Function to update live feed with smooth ticker
function updateLiveFeed() {
  liveFeed.innerHTML = ''; // clear previous feed
  for (let i = 0; i < playersCount; i++) {
    const p = document.createElement('p');
    p.textContent = `${generatePlayerID()} just won ${Math.floor(Math.random() * 5000 + 100)} GOLD!`;
    p.style.top = `${180 + i * 30}px`; // stagger start positions
    liveFeed.appendChild(p);
  }
}

// Initial load
updateLiveFeed();

// Cycle new players every 30 minutes
setInterval(updateLiveFeed, 30 * 60 * 1000);

const liveFeed = document.getElementById('liveFeed');
const playersCount = 6;

function generatePlayerID() {
  const first = String(Math.floor(Math.random() * 90 + 10));
  const last = String(Math.floor(Math.random() * 900 + 100));
  return `${first}*****${last}`;
}

function updateLiveFeed() {
  liveFeed.innerHTML = ''; // clear previous
  const spacing = 40;      // vertical spacing per entry
  for (let i = 0; i < playersCount; i++) {
    const p = document.createElement('p');
    p.textContent = `${generatePlayerID()} just won ${Math.floor(Math.random() * 5000 + 100)} GOLD!`;
    p.style.top = `${220 + i * spacing}px`; // stagger start position
    liveFeed.appendChild(p);
  }
}

// Initial load
updateLiveFeed();

// Cycle new players every 30 minutes
setInterval(updateLiveFeed, 30*60*1000);

</script>
