let user = null;
let miningSpeed = 0.0001;
let miningEndTime;

// Login
async function login() {
    let email = document.getElementById("email").value;
    let pass = document.getElementById("password").value;

    let { data, error } = await supabase.auth.signInWithPassword({
        email: email, password: pass
    });

    if (error) return alert(error.message);

    user = data.user;
    loadUser();
}

// Register
async function register() {
    let email = document.getElementById("email").value;
    let pass = document.getElementById("password").value;

    let { data, error } = await supabase.auth.signUp({
        email: email, password: pass
    });

    if (error) return alert(error.message);

    alert("Account created. Login now.");
}

// Load user mining info
async function loadUser() {
    document.getElementById("authPage").style.display = "none";
    document.getElementById("mainPage").style.display = "block";

    let { data } = await supabase
        .from("mining_users")
        .select("*")
        .eq("user_id", user.id)
        .single();

    if (!data) {
        await supabase.from("mining_users").insert({
            user_id: user.id,
            balance: 0,
            speed: miningSpeed,
            mining_end: 0,
            device_id: getDeviceID(),
        });
        miningEndTime = 0;
    } else {
        miningEndTime = data.mining_end;
        miningSpeed = data.speed;
        document.getElementById("speed").innerText = miningSpeed;
        document.getElementById("balance").innerText = data.balance;
    }

    showReferralCode();
    updateTimer();
    setInterval(updateMining, 1000);
}

// Unique device ID
function getDeviceID() {
    if (!localStorage.deviceID) {
        localStorage.deviceID = "dev-" + Math.random().toString(36).slice(2);
    }
    return localStorage.deviceID;
}

// Start mining
async function startMining() {
    miningEndTime = Date.now() + 24 * 60 * 60 * 1000;

    await supabase.from("mining_users")
        .update({ mining_end: miningEndTime })
        .eq("user_id", user.id);

    updateTimer();
}

// Earn coins every second
async function updateMining() {
    if (Date.now() < miningEndTime) {
        let secondsPassed = 1;
        let earned = miningSpeed * secondsPassed;

        let { data } = await supabase.rpc("add_balance", {
            uid: user.id,
            amount: earned
        });

        document.getElementById("balance").innerText = data;
    }
}

// Timer display
function updateTimer() {
    let t = miningEndTime - Date.now();
    if (t <= 0) {
        document.getElementById("timer").innerText = "Start Mining";
        return;
    }
    let h = Math.floor(t / 3600000);
    let m = Math.floor((t % 3600000) / 60000);
    let s = Math.floor((t % 60000) / 1000);

    document.getElementById("timer").innerText =
        `${h}h ${m}m ${s}s`;
}

// Referral
function showReferralCode() {
    document.getElementById("refCode").innerText =
        window.location.origin + "/?ref=" + user.id;
}

function copyReferral() {
    navigator.clipboard.writeText(
        window.location.origin + "/?ref=" + user.id
    );
    alert("Referral link copied");
}
