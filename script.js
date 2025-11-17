let coins = localStorage.getItem("coins") ? Number(localStorage.getItem("coins")) : 0;

document.getElementById("coins").innerText = "Coins: " + coins;

function mine() {
  coins += 1;
  document.getElementById("coins").innerText = "Coins: " + coins;
  localStorage.setItem("coins", coins);
}
