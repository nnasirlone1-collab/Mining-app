// dashboard.js - main dashboard logic
const FUNCTION_URL = "https://YOUR-PROJECT.supabase.co/functions/v1/mine"; // <-- replace

const userId = localStorage.getItem("user_id");
if (!userId) { location.href = "index.html"; }

const deviceId = localStorage.getItem("device_id") || (crypto.randomUUID ? crypto.randomUUID() : ('dev-' + Date.now()));
localStorage.setItem("device_id", deviceId);

// UI refs
const totalCoinsEl = document.getElementById("totalCoins");
const todayCoinsEl = document.getElementById("todayCoins");
const streakEl = document.getElementById("streak");
const mineBtn = document.getElementById("mineBtn");
const autoBtn = document.getElementById("autoBtn");
const dailyBtn = document.getElementById("dailyBtn");
const mineMsg = document.getElementById("mineMsg");
const leadersEl = document.getElementById("leaders");
const userEmail = document.getElementById("userEmail");
const logoutBtn = document.getElementById("logoutBtn");
const profileBtn = document.getElementById("profileBtn");

userEmail.innerText = userId;

// helpers
async function fetchUser() {
  const { data } = await supabase.from("mining_users").select("*").eq("user_id", userId).maybeSingle();
  return data;
}

async function refreshUI() {
  const u = await fetchUser();
  totalCoinsEl.innerText = u ? Number(u.coins).toFixed(2) : "0.00";
  todayCoinsEl.innerText = "—";
  streakEl.innerText = u ? (u.streak || 0) + " day(s)" : "0";
}
async function refreshLeaderboard() {
  const { data } = await supabase.from("mining_users").select("user_id, coins").order("coins", { ascending: false }).limit(10);
  leadersEl.innerHTML = "";
  (data || []).forEach(r => {
    const li = document.createElement("li");
    li.textContent = `${r.user_id} — ${Number(r.coins).toFixed(2)}`;
    leadersEl.appendChild(li);
  });
}

// mining interaction
let auto = false;
let animEl = document.getElementById("minAnim");

mineBtn.onclick = async () => {
  mineBtn.disabled = true;
  mineMsg.textContent = "Mining...";
  animEl.classList.add("bing");
  try {
    const body = { user_id: userId, device_id: deviceId, referral_code: localStorage.getItem("referral_code") || null };
    const res = await fetch(FUNCTION_URL, { method: "POST", headers: {"Content-Type":"application/json"}, body: JSON.stringify(body) });
    const data = await res.json();
    if (data.error) {
      mineMsg.textContent = data.message || data.error;
    } else {
      mineMsg.textContent = `+${Number(data.added).toFixed(2)} LCC • streak ${data.streak}`;
      await refreshUI();
      await refreshLeaderboard();
    }
  } catch (e) {
    mineMsg.textContent = "Network error";
  } finally {
    animEl.classList.remove("bing");
    mineBtn.disabled = false;
  }
};

// auto toggle
autoBtn.onclick = () => {
  auto = !auto;
  autoBtn.innerText = auto ? "Auto: ON" : "Auto: OFF";
  if (auto) autoLoop();
};

async function autoLoop() {
  while (auto) {
    await new Promise(r => setTimeout(r, 60 * 1000)); // 1 minute interval
    if (!auto) break;
    mineBtn.click();
  }
}

// daily
dailyBtn.onclick = async () => {
  dailyBtn.disabled = true;
  mineMsg.textContent = "Claiming daily...";
  try {
    const res = await fetch(FUNCTION_URL, { method: "POST", headers: {"Content-Type":"application/json"}, body: JSON.stringify({ user_id: userId, device_id: deviceId }) });
    const d = await res.json();
    if (d.error) alert(d.error); else {
      alert("Daily bonus credited: +" + Number(d.added).toFixed(2));
      await refreshUI();
    }
  } catch (e) {
    alert("Network error");
  } finally { dailyBtn.disabled = false; }
};

// boosts
document.querySelectorAll(".boost").forEach(btn => {
  btn.onclick = async (ev) => {
    const cost = Number(ev.target.dataset.cost || 0);
    if (!confirm(`Spend ${cost} coins for this boost?`)) return;
    const res = await fetch(FUNCTION_URL, { method: "POST", headers: {"Content-Type":"application/json"}, body: JSON.stringify({ user_id: userId, device_id: deviceId, action: "buy_boost" }) });
    const d = await res.json();
    if (d.error) alert(d.error); else { alert("Boost bought. Coins: " + d.coins); await refreshUI(); }
  };
});

// withdraw placeholder
document.getElementById("withdrawBtn").onclick = () => alert("Withdraw flow is a demo placeholder. Implement admin payout logic for real withdrawals.");

// logout + profile
logoutBtn.onclick = async () => { await supabase.auth.signOut(); localStorage.removeItem("user_id"); location.href = "index.html"; };
profileBtn.onclick = () => alert("Profile pane (demo) — email: " + userId);

// init
refreshUI();
refreshLeaderboard();