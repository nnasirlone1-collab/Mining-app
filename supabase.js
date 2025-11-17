// supabase.js — IMPORTANT: replace the two placeholders below with your real keys
const SUPABASE_URL = "https://YOUR-PROJECT.supabase.co";     // <<-- replace with your Supabase URL
const SUPABASE_ANON = "YOUR_ANON_KEY_HERE";                 // <<-- replace with your anon/public key

// create global client if supabase object exists
if (window.supabase && SUPABASE_URL && SUPABASE_ANON) {
  window.supabase = supabase.createClient(SUPABASE_URL, SUPABASE_ANON);
} else {
  // keep a safe stub so app.js won't crash if keys are missing
  window.supabase = {
    auth: {
      signUp: async () => ({ error: { message: "Supabase not configured" } }),
      signInWithPassword: async () => ({ error: { message: "Supabase not configured" } }),
      signOut: async () => ({ error: { message: "Supabase not configured" } })
    },
    from: () => ({ select: async () => ({ data: null })})
  };
}
