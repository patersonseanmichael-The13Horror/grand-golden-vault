const activities = [
  "04******92 deposited $8,500 · Baccarat",
  "04******17 withdrew $12,000 · Roulette",
  "04******45 deposited $3,200 · Blackjack",
  "04******61 deposited $15,750 · Private Table",
  "04******08 withdrew $6,400 · Baccarat",
  "04******39 deposited $21,000 · High Roller Room",
  "04******74 deposited $4,950 · Roulette",
  "04******56 withdrew $9,300 · Blackjack"
];

const feed = document.getElementById("liveFeed");
const text = feed.querySelector(".feed-text");

let index = 0;

function updateFeed() {
  text.style.opacity = 0;

  setTimeout(() => {
    text.textContent = activities[index];
    text.style.opacity = 1;
    index = (index + 1) % activities.length;
  }, 600);
}

setInterval(updateFeed, 7500);
updateFeed();
