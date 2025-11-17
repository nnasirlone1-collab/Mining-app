// supabase.js — add your own keys here
const SUPABASE_URL = "https://YOUR-PROJECT.supabase.co";     // <-- replace
const SUPABASE_ANON = "YOUR_ANON_KEY_HERE";                 // <-- replace

// create global client
window.supabase = supabase.createClient(SUPABASE_URL, SUPABASE_ANON);
