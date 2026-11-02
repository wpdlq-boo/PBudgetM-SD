import { createClient } from '@supabase/supabase-js';

// Clean up common copy/paste mistakes in the Vercel env vars (quotes, spaces,
// missing https://, trailing /rest/v1) so a typo doesn't blank the whole app.
function cleanUrl(v) {
  let u = String(v || '').trim().replace(/^['"]|['"]$/g, '').trim();
  if (!u) return '';
  if (!/^https?:\/\//i.test(u)) u = 'https://' + u;
  return u.replace(/\/(rest|auth)\/v1\/?.*$/i, '').replace(/\/+$/, '');
}
function cleanKey(v) { return String(v || '').trim().replace(/^['"]|['"]$/g, '').trim(); }

export const supabaseUrl = cleanUrl(import.meta.env.VITE_SUPABASE_URL);
export const supabaseAnonKey = cleanKey(import.meta.env.VITE_SUPABASE_ANON_KEY);

let client = null;
let configError = '';
if (supabaseUrl && supabaseAnonKey) {
  try {
    client = createClient(supabaseUrl, supabaseAnonKey, {
      auth: { persistSession: true, detectSessionInUrl: true, autoRefreshToken: true }
    });
  } catch (e) {
    configError = 'Supabase settings look wrong (' + e.message + '). Check VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in Vercel, then redeploy.';
  }
} else if (supabaseUrl || supabaseAnonKey) {
  configError = 'Only one Supabase setting was found. Add both VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in Vercel, then redeploy.';
}

export const supabase = client;
export const hasSupabase = Boolean(client);
export const supabaseConfigError = configError;
