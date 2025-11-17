// app.js - login & signup logic for index.html (defensive: shows errors if supabase not configured)
const authMsg = document.getElementById("authMsg");

// handle signup called from button onclick
async function handleSignup() {
  authMsg.textContent = "";
  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value.trim();
  const referral = document.getElementById("referral").value.trim();

  if (!email || !password) { authMsg.textContent = "Enter email & password"; return; }

  try {
    const { data, error } = await window.supabase.auth.signUp({ email, password });
    if (error) {
      authMsg.textContent = error.message || "Sign up failed";
      return;
    }
    if (referral) localStorage.setItem("referral_code", referral);
    authMsg.textContent = "Signup OK — verify email then login.";
  } catch (e) {
    authMsg.textContent = "Signup failed: " + (e.message || e);
  }
}

// handle login called from button onclick
async function handleLogin() {
  authMsg.textContent = "";
  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value.trim();

  if (!email || !password) { authMsg.textContent = "Enter email & password"; return; }

  try {
    const { data, error } = await window.supabase.auth.signInWithPassword({ email, password });
    if (error) {
      authMsg.textContent = error.message || "Login failed";
      return;
    }

    // success — store simple user id (email) and go to dashboard
    const userId = email.toLowerCase();
    localStorage.setItem("user_id", userId);
    window.location.href = "dashboard.html";
  } catch (e) {
    authMsg.textContent = "Login failed: " + (e.message || e);
  }
}

// expose functions globally (already used by onclick in HTML)
window.handleSignup = handleSignup;
window.handleLogin = handleLogin;
