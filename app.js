// app.js - login & signup logic for index.html
const authMsg = document.getElementById("authMsg");
const signupBtn = document.getElementById("signupBtn");
const loginBtn = document.getElementById("loginBtn");

signupBtn.onclick = async () => {
  authMsg.textContent = "";
  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value.trim();
  const referral = document.getElementById("referral").value.trim();

  if (!email || !password) { authMsg.textContent = "Enter email & password"; return; }

  const { data, error } = await supabase.auth.signUp({ email, password });
  if (error) {
    authMsg.textContent = error.message;
    return;
  }

  if (referral) localStorage.setItem("referral_code", referral);
  authMsg.textContent = "Signup OK — verify email then login.";
};

loginBtn.onclick = async () => {
  authMsg.textContent = "";
  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value.trim();
  if (!email || !password) { authMsg.textContent = "Enter email & password"; return; }

  const { data, error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) {
    authMsg.textContent = error.message;
    return;
  }

  const userId = email.toLowerCase();
  localStorage.setItem("user_id", userId);
  window.location.href = "dashboard.html";
};
