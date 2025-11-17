async function handleSignup() {
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  let { error } = await supabase.auth.signUp({ email, password });
  if (error) return alert(error.message);

  alert("Account created! Please login.");
}

async function handleLogin() {
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  let { error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) return alert(error.message);

  window.location.href = "dashboard.html";
}
