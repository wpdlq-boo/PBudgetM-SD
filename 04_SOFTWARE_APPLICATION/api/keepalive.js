export default async function handler(req, res) {
  const url = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL;
  const key = process.env.VITE_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY;
  if (!url || !key) {
    res.status(500).json({ ok: false, error: 'Missing Supabase env vars' });
    return;
  }
  const headers = {
    apikey: key,
    Authorization: `Bearer ${key}`,
    'Content-Type': 'application/json',
    Prefer: 'return=minimal'
  };
  const ping = await fetch(`${url}/rest/v1/keepalive?id=eq.1`, {
    method: 'PATCH',
    headers,
    body: JSON.stringify({ pinged_at: new Date().toISOString() })
  });
  const health = await fetch(`${url}/auth/v1/health`, { headers: { apikey: key } });
  res.status(200).json({
    ok: ping.ok && health.ok,
    rest: ping.status,
    auth: health.status,
    at: new Date().toISOString()
  });
}
