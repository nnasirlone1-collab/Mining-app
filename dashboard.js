let mining = true;
let earnings = 0;
let today = 0;

const earningRate = 0.000001; // per minute

document.getElementById("total").innerText = earnings.toFixed(8) + " LCC";
document.getElementById("today").innerText = today.toFixed(8) + " LCC";

function updateDisplay() {
  document.getElementById("total").innerText = earnings.toFixed(8) + " LCC";
  document.getElementById("today").innerText = today.toFixed(8) + " LCC";
}

function startMining() {
  mining = true;
  document.getElementById("status").innerText = "⛏️ Mining...";
}

function stopMining() {
  mining = false;
  document.getElementById("status").innerText = "⛏️ Mining stopped!";
}

setInterval(() => {
  if (mining) {
    earnings += earningRate;
    today += earningRate;
    updateDisplay();
  }
}, 60000); // 1 minute

function logout() {
  supabase.auth.signOut();
  window.location.href = "index.html";
}