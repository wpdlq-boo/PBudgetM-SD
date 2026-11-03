import './styles.css';
import { supabase, hasSupabase, supabaseConfigError } from './supabaseClient.js';

const PIN_KEY = 'wais_pin_v1';
const RESET_KEY = 'wais_pin_reset';
const GUEST_KEY = 'wais_guest_v1';
const MODE_KEY = 'wais_mode';
const EXTRA = ['#B4549B', '#C2410C', '#4D7C0F', '#9D174D'];
const EMOJIS = ['🏷️', '🎁', '🐶', '💊', '📚', '☕'];
const FIXED_SLUGS = { rent: 1, utility: 1, subs: 1, savings: 1 };
const DEF_LIMITS = { food: 300, transport: 200, grocery: 150, shopping: 100, ent: 100 };
const DEF_BUDGET = 1000;
const DEF_ALLOW = 50;
const BASE_CATS = [
  { id: 'food', slug: 'food', name: 'Food & Dining', emoji: '🍔', color: '#3B63E5' },
  { id: 'shopping', slug: 'shopping', name: 'Shopping', emoji: '🛍️', color: '#C2409B' },
  { id: 'grocery', slug: 'grocery', name: 'Grocery', emoji: '🛒', color: '#38A0F0' },
  { id: 'transport', slug: 'transport', name: 'Transit', emoji: '🚗', color: '#64748B' },
  { id: 'ent', slug: 'ent', name: 'Entertainment', emoji: '🎬', color: '#7C5CD6' },
  { id: 'utility', slug: 'utility', name: 'Utilities', emoji: '⚡', color: '#D98E04' },
  { id: 'subs', slug: 'subs', name: 'Subscriptions', emoji: '📺', color: '#0E8FA0' },
  { id: 'rent', slug: 'rent', name: 'Rent', emoji: '🏠', color: '#0F2A52' },
  { id: 'savings', slug: 'savings', name: 'Savings', emoji: '🐷', color: '#1F7A4D' }
];
const MON = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
const MS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const DOW = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const DOWF = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
const LVL_TEXT = { g3: 'far under allowance', g2: 'under allowance', g1: 'just under allowance', r1: 'just over allowance', r2: 'over allowance', r3: 'far over allowance', none: 'nothing logged' };
const ICONS = {
  back: '<path d="M15 5l-7 7 7 7"/>',
  fwd: '<path d="M9 5l7 7-7 7"/>',
  plus: '<path d="M12 5v14M5 12h14"/>',
  check: '<path d="M5 12.5l4.5 4.5L19 7.5"/>',
  home: '<path d="M4 11l8-7 8 7v9a1 1 0 0 1-1 1h-4v-6H9v6H5a1 1 0 0 1-1-1z"/>',
  pie: '<path d="M12 3v9h9a9 9 0 1 1-9-9z"/><path d="M15.5 3.6A9 9 0 0 1 20.4 8.5H15.5z"/>',
  list: '<path d="M8 6h12M8 12h12M8 18h12M4 6h.01M4 12h.01M4 18h.01"/>',
  key: '<circle cx="8" cy="15" r="4"/><path d="M11 12l9-9M16 7l3 3M14 9l2 2"/>',
  lock: '<rect x="5" y="11" width="14" height="9" rx="2"/><path d="M8 11V8a4 4 0 0 1 8 0v3"/>',
  arrow: '<path d="M5 12h14M13 6l6 6-6 6"/>',
  trash: '<path d="M4 7h16M9 7V4h6v3M6 7l1 13h10l1-13M10 11v6M14 11v6"/>',
  chev: '<path d="M6 9l6 6 6-6"/>',
  gear: '<circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 1 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.6 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 1 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.6a1.65 1.65 0 0 0 1-1.51V3a2 2 0 1 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 1 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/>',
  flame: '<path d="M12 2.5c.6 3.6 4.2 5.4 4.2 9.7a4.2 4.2 0 0 1-8.4 0c0-2 .9-3.2 2-4.2.1 1.5.7 2.2 1.5 2.2C11.3 8.4 11.2 5.2 12 2.5z"/>'
};

function pad(n) { return String(n).padStart(2, '0'); }
function key(y, m, d) { return y + '-' + pad(m + 1) + '-' + pad(d); }
function todayDate() {
  const n = new Date();
  return new Date(n.getFullYear(), n.getMonth(), n.getDate());
}
let TODAY = todayDate();
let TKEY = key(TODAY.getFullYear(), TODAY.getMonth(), TODAY.getDate());
let START_YEAR = TODAY.getFullYear() - 1;
let HLAST = 12 + TODAY.getMonth();
function refreshToday() {
  TODAY = todayDate();
  TKEY = key(TODAY.getFullYear(), TODAY.getMonth(), TODAY.getDate());
  START_YEAR = TODAY.getFullYear() - 1;
  HLAST = 12 + TODAY.getMonth();
}
function addDays(k, n) { const d = parse(k); d.setDate(d.getDate() + n); return key(d.getFullYear(), d.getMonth(), d.getDate()); }
// Streak rules: logging today extends the streak; one missed day is covered by the freeze shield; a longer gap resets it.
function applyStreak(streak, lastLog) {
  S.lastLog = lastLog || null;
  S.loggedToday = lastLog === TKEY;
  S.streak = (lastLog && lastLog >= addDays(TKEY, -2)) ? (streak || 0) : 0;
}
function parse(k) { const p = k.split('-').map(Number); return new Date(p[0], p[1] - 1, p[2]); }
function fmt(k) { const d = parse(k); return MS[d.getMonth()] + ' ' + d.getDate() + ', ' + d.getFullYear(); }
function fmtS(k) { const d = parse(k); return MS[d.getMonth()] + ' ' + d.getDate(); }
function fmtL(k) { const d = parse(k); return DOW[d.getDay()] + ', ' + MS[d.getMonth()] + ' ' + d.getDate(); }
function esc(s) { return String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c])); }
function peso(n) { return '₱' + Number(n).toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 2 }); }
function peso2(n) { return '₱' + Number(n).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }); }
function num(v) { return parseFloat(String(v).replace(/,/g, '')) || 0; }
function uid() { return crypto.randomUUID ? crypto.randomUUID() : 'id' + Date.now() + Math.random(); }
function greet() {
  const h = new Date().getHours();
  if (h < 12) return 'Good morning';
  if (h < 17) return 'Good afternoon';
  return 'Good evening';
}
function ic(n, s, cls) {
  s = s || 24;
  return '<svg class="ic ' + (cls || '') + '" width="' + s + '" height="' + s + '" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' + ICONS[n] + '</svg>';
}
function logo(size) {
  return '<svg class="wlogo" width="' + size + '" height="' + size + '" viewBox="0 0 100 100" role="img" aria-label="WAIS logo"><rect class="lg-bg lg-s" x="2" y="2" width="96" height="96" rx="26" stroke-width="3.2"/><g class="lg-s" fill="none" stroke-linecap="round" stroke-linejoin="round"><path d="M29.4 49.7V70M50.1 38V70M70.9 31.3V70" stroke-width="4.4"/><path d="M27.8 41.1L44.2 31L57.5 38.3L72.3 26.5" stroke-width="3.7"/></g><g class="lg-f"><circle cx="27.8" cy="41.1" r="5.8"/><circle cx="44.2" cy="31" r="5.8"/><circle cx="57.5" cy="38.3" r="5.8"/><circle cx="72.3" cy="26.5" r="5.8"/></g><g class="lg-b"><circle cx="27.8" cy="41.1" r="1.6"/><circle cx="44.2" cy="31" r="1.6"/><circle cx="57.5" cy="38.3" r="1.6"/><circle cx="72.3" cy="26.5" r="1.6"/></g></svg>';
}

// ---- device PIN (stored as a salted SHA-256 hash, never as plain digits) ----
function getPinRec() {
  try { const r = JSON.parse(localStorage.getItem(PIN_KEY) || 'null'); return r && r.hash && r.salt ? r : null; } catch (e) { return null; }
}
async function hashPin(pin, salt) {
  const text = salt + ':' + pin;
  if (window.crypto && crypto.subtle) {
    const buf = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(text));
    return Array.from(new Uint8Array(buf)).map(b => b.toString(16).padStart(2, '0')).join('');
  }
  let h = 2166136261; // fallback for non-HTTPS local testing
  for (let i = 0; i < text.length; i++) { h ^= text.charCodeAt(i); h = Math.imul(h, 16777619); }
  return 'f' + (h >>> 0).toString(16);
}
async function savePin(pin) {
  const salt = uid();
  localStorage.setItem(PIN_KEY, JSON.stringify({ salt, hash: await hashPin(pin, salt) }));
}
async function checkPin(pin) {
  const r = getPinRec();
  return Boolean(r) && (await hashPin(pin, r.salt)) === r.hash;
}

let MODE = localStorage.getItem(MODE_KEY) || '';
let BUDGET = DEF_BUDGET;
let ALLOW = DEF_ALLOW;
let LIMITS = {};
let CATS = [];
let TX = [];
let BY = {};
let S = {};
let sessionUser = null;
let busy = false;
let lastScreen = null;
let focusKey = null;
let lastActive = Date.now();
const IDLE_MS = 60000;
let rootEl;
let appEl;

function rebuildBY() {
  BY = {};
  TX.forEach(t => { (BY[t.date] = BY[t.date] || []).push(t); });
}
function fresh() {
  return {
    screen: 'lock', user: '', pin: '', sent: false, streak: 1, loggedToday: true, lastLog: null,
    amount: '', date: TKEY, note: '', cat: null, editId: null, addingCat: false,
    newCatName: '', newEmoji: EMOJIS[0], err: '', notice: '', lockMsg: '', pinMsg: '', period: 'month',
    heatIdx: HLAST, day: null, daySeg: 'tx', manage: false, delId: null, histN: 20,
    draftLimits: null, draftBudget: '', addName: '', addLimit: '', addEmoji: EMOJIS[0],
    addErr: '', modalId: null, moveTo: '', limErr: '', savedStreak: 1, streakMsg: '', lastSaved: null,
    pinFlow: 'create', pinStage: 'new', pinFirst: '', setupFrom: 'onboard', fails: 0, waitUntil: 0, confirmErase: false,
    menu: false
  };
}
function seedState() {
  CATS = BASE_CATS.map(c => Object.assign({}, c));
  LIMITS = Object.assign({}, DEF_LIMITS);
  BUDGET = DEF_BUDGET;
  ALLOW = DEF_ALLOW;
  const yday = new Date(TODAY);
  yday.setDate(yday.getDate() - 1);
  TX = [
    { id: uid(), date: key(yday.getFullYear(), yday.getMonth(), yday.getDate()), cat: 'food', amt: 80, note: 'Jollibee Dinner' },
    { id: uid(), date: TKEY, cat: 'transport', amt: 45, note: 'Jeep fare' }
  ];
  rebuildBY();
}
function cat(id) {
  for (let i = 0; i < CATS.length; i++) if (CATS[i].id === id) return CATS[i];
  return { id, slug: id, name: id, emoji: '🏷️', color: '#64748B' };
}
function isFixed(id) {
  const c = cat(id);
  return Boolean(FIXED_SLUGS[c.slug || c.id]);
}
// Daily allowance follows the budget: (total budget - fixed categories' limits) / days in the current month.
function recalcAllow() {
  const days = new Date(TODAY.getFullYear(), TODAY.getMonth() + 1, 0).getDate();
  let fixed = 0;
  CATS.forEach(c => { if (isFixed(c.id)) fixed += LIMITS[c.id] || 0; });
  ALLOW = Math.max(1, Math.round((BUDGET - fixed) / days));
}
function dayInfo(k) {
  const list = BY[k] || [];
  let disc = 0, total = 0;
  list.forEach(t => { total += t.amt; if (!isFixed(t.cat)) disc += t.amt; });
  let lvl = 'none';
  if (list.length) {
    const r = disc / ALLOW;
    lvl = r <= 0.4 ? 'g3' : r <= 0.7 ? 'g2' : r <= 1 ? 'g1' : r <= 1.25 ? 'r1' : r <= 1.6 ? 'r2' : 'r3';
  }
  return { list, disc, total, lvl };
}
function range(p) {
  if (p === 'week') {
    const d = new Date(TODAY);
    d.setDate(d.getDate() - 6);
    return [key(d.getFullYear(), d.getMonth(), d.getDate()), TKEY];
  }
  if (p === 'month') return [key(TODAY.getFullYear(), TODAY.getMonth(), 1), TKEY];
  return [key(TODAY.getFullYear(), 0, 1), TKEY];
}
function totals(p) {
  const r = range(p), a = r[0], b = r[1], m = {};
  let total = 0;
  TX.forEach(t => { if (t.date >= a && t.date <= b) { m[t.cat] = (m[t.cat] || 0) + t.amt; total += t.amt; } });
  const rows = Object.keys(m).map(id => ({ id, amt: m[id], pct: m[id] / total })).sort((x, y) => y.amt - x.amt);
  return { total, rows, a, b };
}
// Newest date first; within the same date, the most recently logged first (TX keeps logging order).
function newestFirst(list) {
  return list.map((t, i) => [t, i]).sort((x, y) => x[0].date < y[0].date ? 1 : x[0].date > y[0].date ? -1 : y[1] - x[1]).map(x => x[0]);
}
function monthTx() { const r = range('month'); return newestFirst(TX.filter(t => t.date >= r[0] && t.date <= r[1])); }
function guardInfo(m) {
  const over = [], near = [];
  m.rows.forEach(r => {
    const lim = LIMITS[r.id];
    if (!lim) return;
    if (r.amt > lim) over.push({ id: r.id, by: r.amt - lim });
    else if (r.amt / lim >= 0.8) near.push({ id: r.id, p: Math.round(r.amt / lim * 100) });
  });
  const nearTxt = near.map(x => cat(x.id).name + ' is at ' + x.p + '%').join(', ');
  if (over.length) {
    return {
      title: over.length + (over.length === 1 ? ' category is' : ' categories are') + ' over budget',
      text: over.map(x => cat(x.id).name + ' is over by ' + peso2(x.by)).join('. ') + '.' + (near.length ? ' Near limit: ' + nearTxt + '.' : '')
    };
  }
  if (near.length) return { title: near.length + (near.length === 1 ? ' category is' : ' categories are') + ' near its limit', text: 'Near limit: ' + nearTxt + '.' };
  return { title: 'All categories within limits', text: 'Every category is under 80% of its monthly limit.' };
}
function parseLimit(v) {
  v = String(v || '').replace(/,/g, '').trim();
  if (v === '') return { ok: true, val: 0 };
  const n = Number(v);
  return (isFinite(n) && n >= 0) ? { ok: true, val: n } : { ok: false, val: 0 };
}
function limitsAsStrings() { const o = {}; CATS.forEach(c => { o[c.id] = LIMITS[c.id] ? String(LIMITS[c.id]) : ''; }); return o; }
function allocSum(dl) { let s = 0; CATS.forEach(c => { s += num(dl[c.id]); }); return s; }
function allocText(dl, db) {
  const a = allocSum(dl), b = num(db);
  if (!b) return 'Allocated ' + peso2(a) + '. Enter a monthly budget above ₱0.';
  if (a > b) return 'Allocated ' + peso2(a) + ' of ' + peso2(b) + '. ' + peso2(a - b) + ' over budget.';
  return 'Allocated ' + peso2(a) + ' of ' + peso2(b) + '. ' + peso2(b - a) + ' is unallocated.';
}
function updAlloc() { const el = appEl.querySelector('[data-alloc]'); if (el) el.textContent = allocText(S.draftLimits, S.draftBudget); }

function saveGuest() {
  localStorage.setItem(GUEST_KEY, JSON.stringify({
    CATS, TX, LIMITS, BUDGET, ALLOW, streak: S.streak, lastLog: S.lastLog, user: S.user
  }));
}
function loadGuest() {
  try {
    const raw = localStorage.getItem(GUEST_KEY);
    if (!raw) { seedState(); applyStreak(1, TKEY); saveGuest(); return; }
    const d = JSON.parse(raw);
    CATS = d.CATS || []; TX = d.TX || []; LIMITS = d.LIMITS || {};
    BUDGET = d.BUDGET || DEF_BUDGET; ALLOW = d.ALLOW || DEF_ALLOW;
    if (!CATS.length) seedState();
    rebuildBY();
    applyStreak(d.streak || 0, d.lastLog || null);
    S.user = d.user || '';
  } catch (e) {
    seedState(); applyStreak(1, TKEY);
  }
}

async function currentSession() {
  if (!supabase) return null;
  const { data } = await supabase.auth.getSession();
  return data.session;
}

async function loadRemote() {
  const { data: { user } } = await supabase.auth.getUser();
  sessionUser = user;
  const uid = user.id;
  const name = user.user_metadata?.full_name || user.email?.split('@')[0] || 'Friend';
  let [{ data: cats }, { data: txs }, { data: set }] = await Promise.all([
    supabase.from('categories').select('*').eq('user_id', uid).order('sort_order'),
    supabase.from('transactions').select('*').eq('user_id', uid).order('created_at'),
    supabase.from('settings').select('*').eq('user_id', uid).maybeSingle()
  ]);
  if (!cats || !cats.length) {
    seedState();
    await pushAllRemote(uid);
    const again = await supabase.from('categories').select('*').eq('user_id', uid).order('sort_order');
    cats = again.data;
    const txs2 = await supabase.from('transactions').select('*').eq('user_id', uid);
    txs = txs2.data;
    const set2 = await supabase.from('settings').select('*').eq('user_id', uid).maybeSingle();
    set = set2.data;
  }
  CATS = (cats || []).map(c => ({ id: c.id, slug: c.slug, name: c.name, emoji: c.emoji, color: c.color }));
  LIMITS = {};
  (cats || []).forEach(c => { if (c.monthly_limit) LIMITS[c.id] = Number(c.monthly_limit); });
  TX = (txs || []).map(t => ({ id: t.id, date: t.occurred_on, cat: t.category_id, amt: Number(t.amount), note: t.note || '' }));
  rebuildBY();
  BUDGET = Number(set?.monthly_budget) || DEF_BUDGET;
  ALLOW = Number(set?.daily_allowance) || DEF_ALLOW;
  applyStreak(set?.streak || 0, set?.last_log_date || null);
  S.user = name;
}

async function pushAllRemote(uid) {
  await supabase.from('settings').upsert({
    user_id: uid, monthly_budget: BUDGET, daily_allowance: ALLOW, streak: S.streak, last_log_date: S.lastLog, updated_at: new Date().toISOString()
  });
  const rows = CATS.map((c, i) => ({
    id: c.id.match(/^[0-9a-f-]{36}$/i) ? c.id : undefined,
    user_id: uid, slug: c.slug || c.id, name: c.name, emoji: c.emoji, color: c.color,
    monthly_limit: LIMITS[c.id] || null, is_fixed: Boolean(FIXED_SLUGS[c.slug || c.id]), sort_order: i + 1
  }));
  const { data: inserted } = await supabase.from('categories').upsert(rows.filter(r => r.id), { onConflict: 'id' }).select();
  const needInsert = rows.filter(r => !r.id);
  if (needInsert.length) {
    const { data: extra } = await supabase.from('categories').insert(needInsert).select();
    (extra || []).forEach((row, i) => {
      const old = CATS.find(c => (c.slug || c.id) === row.slug);
      if (old) {
        TX.forEach(t => { if (t.cat === old.id) t.cat = row.id; });
        if (LIMITS[old.id]) { LIMITS[row.id] = LIMITS[old.id]; delete LIMITS[old.id]; }
        old.id = row.id;
      }
    });
  }
  if (inserted) inserted.forEach(row => {
    const old = CATS.find(c => c.id === row.id || c.slug === row.slug);
    if (old) old.id = row.id;
  });
  if (TX.length) {
    await supabase.from('transactions').upsert(TX.map(t => ({
      id: t.id, user_id: uid, category_id: t.cat, amount: t.amt, occurred_on: t.date, note: t.note || ''
    })));
  }
}

async function persistSettings() {
  if (MODE !== 'google' || !supabase || !sessionUser) { saveGuest(); return; }
  await supabase.from('settings').upsert({
    user_id: sessionUser.id, monthly_budget: BUDGET, daily_allowance: ALLOW,
    streak: S.streak, last_log_date: S.lastLog, updated_at: new Date().toISOString()
  });
}
async function persistCat(c) {
  if (MODE !== 'google' || !supabase || !sessionUser) { saveGuest(); return; }
  const row = {
    user_id: sessionUser.id, slug: c.slug || c.id, name: c.name, emoji: c.emoji, color: c.color,
    monthly_limit: LIMITS[c.id] || null, is_fixed: Boolean(FIXED_SLUGS[c.slug || c.id]), sort_order: CATS.indexOf(c) + 1
  };
  if (c.id && String(c.id).includes('-')) row.id = c.id;
  const { data, error } = await supabase.from('categories').upsert(row).select().single();
  if (!error && data) c.id = data.id;
  saveGuest();
}
async function persistTx(t) {
  if (MODE !== 'google' || !supabase || !sessionUser) { saveGuest(); return; }
  await supabase.from('transactions').upsert({
    id: t.id, user_id: sessionUser.id, category_id: t.cat, amount: t.amt, occurred_on: t.date, note: t.note || ''
  });
}
async function deleteRemoteTx(id) {
  if (MODE === 'google' && supabase) await supabase.from('transactions').delete().eq('id', id);
}
async function deleteRemoteCat(id) {
  if (MODE === 'google' && supabase) await supabase.from('categories').delete().eq('id', id);
}

function bar(title, back, label, iconOnly) {
  let bk = '';
  if (back) {
    bk = iconOnly
      ? '<button class="backi" data-act="go" data-to="' + back + '" data-key="back" aria-label="Back">' + ic('back', 22) + '</button>'
      : '<button class="backp" data-act="go" data-to="' + back + '" data-key="back">' + ic('back', 18) + '<span>' + (label || 'Back') + '</span></button>';
  }
  return '<header class="bar">' + (bk || '<span></span>') + '<h1 tabindex="-1" data-h>' + title + '</h1><span></span></header>';
}
function steps(n) { return '<p class="step"><span class="dots">' + [1, 2, 3].map(i => '<i class="' + (i <= n ? 'on' : '') + '"></i>').join('') + '</span>Step ' + n + ' of 3</p>'; }
function pbtn(label, act, to, dis, extra) {
  return '<button class="btn btn-primary' + (dis ? ' is-disabled' : '') + '" ' + (dis ? 'aria-disabled="true" ' : '') + 'data-act="' + act + '" ' + (to ? 'data-to="' + to + '" ' : '') + 'data-key="primary">' + label + (extra || '') + '</button>';
}
function sbtn(label, act, to, k) { return '<button class="btn btn-secondary" data-act="' + act + '" ' + (to ? 'data-to="' + to + '" ' : '') + (k ? 'data-key="' + k + '"' : '') + '>' + label + '</button>'; }
function errBox(st) { return '<p class="err" role="alert" ' + (st.err ? '' : 'hidden') + '>' + esc(st.err) + '</p>'; }
function tabs(active) {
  const t = [['home', 'Home', 'home'], ['summary', 'Summary', 'pie'], ['history', 'History', 'list']];
  return '<nav class="tabbar" aria-label="Main">' + t.map(x => '<button class="tab" data-act="go" data-to="' + x[0] + '" data-key="tab-' + x[0] + '" ' + (active === x[0] ? 'aria-current="page"' : '') + '>' + ic(x[2]) + '<span>' + x[1] + '</span></button>').join('') +
    '<button class="fab" data-act="newtx" data-key="fab" aria-label="Log New Transaction">' + ic('plus', 28) + '</button></nav>';
}
function latestRow(t) {
  const c = cat(t.cat);
  return '<li class="lrow"><span class="etile em" aria-hidden="true">' + c.emoji + '</span><div class="grow"><p class="rn">' + esc(t.note || c.name) + '</p><p class="sub">' + esc(c.name) + '</p></div><p class="amt">-' + peso2(t.amt) + '</p></li>';
}
function histRow(t, st) {
  const c = cat(t.cat);
  const main = '<div class="hrow"><span class="etile em" aria-hidden="true">' + c.emoji + '</span><div class="grow"><p class="rn">' + esc(t.note || c.name) + '</p><p class="sub">' + esc(c.name) + '</p></div><div class="rt"><p class="amt">-' + peso2(t.amt) + '</p><p class="sub">' + fmtS(t.date) + '</p></div></div>';
  if (!st.manage) return '<li class="hli">' + main + '</li>';
  if (String(st.delId) === String(t.id)) return '<li class="hli">' + main + '<div class="mrow"><p class="sub grow">Delete this expense?</p><button class="btn-sm danger" data-act="del-yes" data-id="' + t.id + '" data-key="dy-' + t.id + '">Yes, Delete</button><button class="btn-sm" data-act="del-cancel" data-key="dc-' + t.id + '">Cancel</button></div></li>';
  return '<li class="hli">' + main + '<div class="mrow"><button class="btn-sm" data-act="edit-tx" data-id="' + t.id + '" data-key="e-' + t.id + '">Edit</button><button class="btn-sm danger" data-act="del-tx-ask" data-id="' + t.id + '" data-key="d-' + t.id + '">Delete</button></div></li>';
}
function catCard(r, limitMode) {
  const c = cat(r.id), lim = LIMITS[r.id], has = limitMode && lim;
  const pct = has ? r.amt / lim : r.pct, over = has && r.amt > lim;
  return '<article class="ccard' + (over ? ' over' : '') + '"><span class="etile em" aria-hidden="true">' + c.emoji + '</span><div class="grow"><div class="ch"><p class="cn"><i class="dot" style="background:' + c.color + '"></i>' + esc(c.name) + '</p><p class="cp">' + Math.round((pct || 0) * 100) + '%</p></div>' +
    '<p class="cs">' + (has ? peso2(r.amt) + ' of ' + peso2(lim) : peso2(r.amt) + (limitMode ? ', no limit set' : '')) + '</p><div class="ctrack"><i style="width:' + Math.min(100, Math.max(2, (pct || 0) * 100)) + '%"></i></div>' + (over ? '<p class="over-t">Over limit by ' + peso2(r.amt - lim) + '</p>' : '') + '</div></article>';
}
function emoRow(act, cur, keyName) {
  const opts = EMOJIS.slice();
  if (cur && opts.indexOf(cur) < 0) opts.unshift(cur);
  return '<div class="emopick" role="group" aria-label="Icon">' + opts.map((e, i) => '<button data-act="' + act + '" data-e="' + e + '" data-key="' + keyName + i + '" aria-pressed="' + (cur === e) + '" aria-label="Icon ' + e + '">' + e + '</button>').join('') + '</div>';
}
function donut(rows, total) {
  const R = 54, C = 2 * Math.PI * R;
  let off = 0;
  const segs = rows.map(r => {
    const len = C * r.amt / total;
    const s = '<circle cx="80" cy="80" r="' + R + '" fill="none" stroke="' + cat(r.id).color + '" stroke-width="24" stroke-dasharray="' + Math.max(len - 1.5, 0.5) + ' ' + (C - len + 1.5) + '" stroke-dashoffset="' + (-off) + '" transform="rotate(-90 80 80)"/>';
    off += len;
    return s;
  }).join('');
  return '<div class="donut"><svg viewBox="0 0 160 160" width="168" height="168" role="img" aria-label="Donut chart of spending by category">' + segs + '<text class="t1" x="80" y="76" text-anchor="middle">Total</text><text class="t2" x="80" y="96" text-anchor="middle">' + peso(total) + '</text></svg></div>';
}

function pinPad(st, msgs) {
  const dots = [0, 1, 2, 3].map(i => '<i class="pdot' + (i < st.pin.length ? ' on' : '') + '"></i>').join('');
  let keys = '';
  for (let n = 1; n <= 9; n++) keys += '<button class="key" data-act="key" data-k="' + n + '" data-key="k' + n + '" aria-label="' + n + '">' + n + '</button>';
  keys += '<button class="key small" data-act="clear" data-key="kclear">Clear</button><button class="key" data-act="key" data-k="0" data-key="k0" aria-label="0">0</button><button class="key small" data-act="del" data-key="kdel" aria-label="Delete last digit">Delete</button>';
  return '<div class="pdots" role="img" aria-label="' + st.pin.length + ' of 4 digits entered">' + dots + '</div>' + (msgs || '') + '<div class="keypad">' + keys + '</div>';
}
function startPinCreate(from = 'onboard') {
  S.pinFlow = 'create'; S.pinStage = 'new'; S.setupFrom = from; S.pin = ''; S.pinFirst = ''; S.err = ''; S.pinMsg = ''; S.menu = false; S.screen = 'pin';
}
function startPinChange() {
  S.pinFlow = 'change'; S.pinStage = 'current'; S.setupFrom = 'menu'; S.pin = ''; S.pinFirst = ''; S.err = ''; S.pinMsg = ''; S.notice = ''; S.menu = false; S.screen = 'pin';
}

const SCREENS = {
  lock(st) {
    const hasPin = Boolean(getPinRec());
    const canUnlock = hasPin && (MODE === 'guest' || (MODE === 'google' && sessionUser));
    let setup = '';
    if (supabaseConfigError) setup = '<p class="setup" role="alert">' + esc(supabaseConfigError) + '</p>';
    else if (!hasSupabase) setup = '<p class="setup">Google sign-in isn’t set up on this site yet. You can still use the app without an account.</p>';
    const msgs = (st.lockMsg ? '<p class="ok" role="status">' + esc(st.lockMsg) + '</p>' : '') + errBox(st);
    let card;
    if (canUnlock) {
      const who = MODE === 'google'
        ? 'Google budget' + (sessionUser.email ? ' · ' + esc(sessionUser.email) : '')
        : 'On-device budget (no account)';
      const other = MODE === 'google'
        ? '<button class="btn btn-secondary" data-act="guest" data-key="guest">Use Without An Account Instead</button>'
        : (hasSupabase ? '<button class="btn btn-secondary" data-act="google" data-key="google"><span class="gmark" aria-hidden="true">G</span>Continue With Google Instead</button>' : '');
      card = '<section class="card unlock" aria-label="Unlock"><div class="u-h"><div><p class="eyebrow">Welcome back</p><h2>Unlock your budget</h2></div><span class="secure">Secure</span></div>' +
        '<p class="sub">' + who + '</p>' + pinPad(st, msgs) +
        pbtn('Unlock &amp; Continue', 'unlock', null, st.pin.length < 4, ic('arrow', 22)) +
        '<button class="link c" data-act="go" data-to="forgot" data-key="forgot">Forgot PIN?</button>' +
        (other ? '<div class="or"><span>OR</span></div>' + other : '') +
        (sessionUser ? '<button class="link signout" data-act="signout" data-key="signout">Sign Out Of Google</button>' : '') + '</section>';
    } else {
      card = '<section class="card unlock" aria-label="Get started"><div class="u-h"><div><p class="eyebrow">Get started</p><h2>Where should your budget live?</h2></div></div>' + msgs +
        (hasSupabase ? '<button class="btn btn-primary" data-act="google" data-key="google"><span class="gmark gw" aria-hidden="true">G</span>Continue With Google</button><p class="sub small">Saved to your account, so it’s there on any device.</p><div class="or"><span>OR</span></div>' : '') +
        '<button class="btn btn-secondary" data-act="guest" data-key="guest">Use Without An Account</button><p class="sub small">Saved only on this device. Nothing is uploaded.</p>' +
        '<p class="sub small">Next, you’ll create a 4-digit PIN that unlocks the app on this device, or skip it for now.</p></section>';
    }
    return '<div class="scr"><div class="body lockb">' + logo(64) +
      '<p class="eyebrow">Smart money starts here</p><h1 class="brand" tabindex="-1" data-h>WAIS</h1>' +
      '<p class="tag">A Wise Assistant for Insightful Spending</p><p class="sub">Plan your budget, spot your spending patterns, and spend with insight.</p>' + setup + card + '</div></div>';
  },
  pin(st) {
    const change = st.pinFlow === 'change';
    const onboard = st.setupFrom === 'onboard';
    const T = { current: 'Enter your current PIN', new: change ? 'Choose a new PIN' : 'Create your PIN', confirm: change ? 'Confirm your new PIN' : 'Confirm your PIN' };
    const D = { current: 'To change your PIN, first confirm the one you use now.', new: 'Pick 4 digits you’ll remember. It’s saved only on this device and unlocks the app.', confirm: change ? 'Type the same 4 digits again.' : 'Enter the same 4 digits again to make sure.' };
    const n = { current: 1, new: change ? 2 : 1, confirm: change ? 3 : 2 }[st.pinStage], of = change ? 3 : 2;
    return '<div class="scr"><header class="bar"><button class="backp" data-act="pin-back" data-key="back">' + ic('back', 18) + '<span>Back</span></button><h1 tabindex="-1" data-h>' + (change ? 'Change PIN' : 'Set up PIN') + '</h1><span></span></header><div class="body lockb">' +
      (st.pinMsg ? '<p class="warn" role="status">' + esc(st.pinMsg) + '</p>' : '') +
      '<section class="card unlock pincard" aria-label="' + T[st.pinStage] + '"><p class="eyebrow">Step ' + n + ' of ' + of + '</p><h2>' + T[st.pinStage] + '</h2><p class="sub">' + D[st.pinStage] + '</p>' +
      pinPad(st, errBox(st)) + pbtn(st.pinStage === 'confirm' ? 'Save PIN' : 'Next', 'pin-next', null, st.pin.length < 4, ic(st.pinStage === 'confirm' ? 'check' : 'arrow', 22)) +
      (onboard && st.pinStage === 'new' ? '<button class="link c" data-act="pin-later" data-key="pin-later">Set Up PIN Later</button><p class="note center">Without a PIN, anyone holding this phone can open WAIS. Add one anytime from the profile button on Home.</p>' : '') +
      '</section></div></div>';
  },
  forgot(st) {
    let guestPart;
    if (st.confirmErase) {
      guestPart = '<p class="err" role="alert">This permanently deletes the expenses saved on this device without an account. Google budgets are not affected.</p><div class="two"><button class="btn btn-secondary" data-act="erase-cancel" data-key="erase-cancel">Cancel</button><button class="btn btn-danger" data-act="reset-guest" data-key="erase-go">Erase &amp; Reset</button></div>';
    } else {
      guestPart = sbtn('Erase On-Device Budget &amp; Reset PIN', 'erase-ask', null, 'erase-ask');
    }
    return '<div class="scr">' + bar('Forgot PIN?', 'lock', 'Back') + '<div class="body">' +
      '<p class="sub">Your PIN is saved only on this device, so it can’t be emailed to you. Choose how to reset it.</p>' +
      (hasSupabase ? '<section class="card"><h2>Signed in with Google?</h2><p class="sub">Sign in with Google again to prove it’s you, then choose a new PIN. Your synced budget stays safe.</p><button class="btn btn-primary" data-act="reset-google" data-key="reset-google"><span class="gmark gw" aria-hidden="true">G</span>Reset PIN With Google</button></section>' : '') +
      '<section class="card"><h2>Using without an account?</h2><p class="sub">There’s no account to confirm it’s you, so the only way to reset is to erase the budget saved on this device.</p>' + guestPart + '</section>' +
      '<div class="spacer"></div>' + pbtn('Back To Unlock', 'go', 'lock') + '</div></div>';
  },
  settings(st) {
    const hasPin = Boolean(getPinRec());
    const g = MODE === 'google' && sessionUser;
    return '<div class="scr">' + bar('Settings', 'home', 'Home') + '<div class="body">' +
      (st.notice ? '<p class="ok" role="status">' + esc(st.notice) + '</p>' : '') +
      '<section class="card"><p class="eyebrow">Account</p><h2>' + esc(st.user || 'Guest') + '</h2><p class="sub">' +
        (g ? 'Signed in with Google' + (sessionUser.email ? ' as ' + esc(sessionUser.email) : '') + '. Your budget is saved to your account.' : 'Using without an account. Your budget is saved only on this device.') + '</p>' +
        (g ? sbtn('Sign Out Of Google', 'signout', null, 'signout') : (hasSupabase ? '<button class="btn btn-secondary" data-act="google" data-key="google"><span class="gmark" aria-hidden="true">G</span>Switch To Google</button>' : '')) + '</section>' +
      '<section class="card"><p class="eyebrow">Security</p><h2>App PIN</h2><p class="sub">' +
        (hasPin ? 'Your 4-digit PIN is saved only on this device. The app also locks itself after 1 minute without use.' : 'No PIN set. Anyone holding this device can open WAIS.') + '</p>' +
        (hasPin
          ? '<button class="btn btn-primary" data-act="pin-change" data-key="pin-change">Change PIN</button>' + sbtn('Lock App Now', 'lock', null, 'lock-now')
          : '<button class="btn btn-primary" data-act="m-pin" data-key="pin-setup">Set Up PIN</button>') + '</section>' +
      '</div></div>';
  },
  home(st) {
    const hasPin = Boolean(getPinRec());
    const m = totals('month'), spent = m.total, rem = BUDGET - spent;
    const lastDay = new Date(TODAY.getFullYear(), TODAY.getMonth() + 1, 0).getDate();
    const daysLeft = lastDay - TODAY.getDate() + 1, perDay = Math.max(0, rem / daysLeft);
    const g = guardInfo(m), latest = newestFirst(TX).slice(0, 3);
    const name = st.user ? ', ' + esc(st.user.split(' ')[0]) : '';
    let months = '';
    for (let i = 0; i <= HLAST; i++) {
      const y = START_YEAR + Math.floor(i / 12), mm = i % 12, f = new Date(y, mm, 1), dim = new Date(y, mm + 1, 0).getDate();
      let cal = '';
      for (let b = 0; b < f.getDay(); b++) cal += '<span></span>';
      for (let d = 1; d <= dim; d++) {
        const kk = key(y, mm, d);
        if (kk > TKEY) { cal += '<span class="cell fut" aria-hidden="true">' + d + '</span>'; continue; }
        const info = dayInfo(kk);
        cal += '<button class="cell ' + info.lvl + '" data-act="day" data-day="' + kk + '" data-key="d-' + kk + '" aria-label="' + fmt(kk) + ': ' + (info.list.length ? peso(info.disc) + ' day-to-day spending, ' + LVL_TEXT[info.lvl] : 'nothing logged') + '">' + d + '</button>';
      }
      months += '<div class="slide" role="group" aria-label="' + MON[mm] + ' ' + y + '"><div class="dow" aria-hidden="true"><span>S</span><span>M</span><span>T</span><span>W</span><span>T</span><span>F</span><span>S</span></div><div class="cal">' + cal + '</div></div>';
    }
    const hy = START_YEAR + Math.floor(st.heatIdx / 12);
    return '<div class="scr"><div class="body">' +
      '<header class="hhead"><div><p class="eyebrow">' + DOWF[TODAY.getDay()] + ', ' + MON[TODAY.getMonth()] + ' ' + TODAY.getDate() + '</p><h1 class="hello" tabindex="-1" data-h>' + greet() + name + '!</h1></div>' +
      '<button class="avatar" data-act="menu" data-key="avatar" aria-label="Profile menu" aria-haspopup="menu" aria-expanded="' + Boolean(st.menu) + '">' +
        (st.user ? esc(st.user.charAt(0).toUpperCase()) : 'G') +
        (hasPin ? '<span class="lk" aria-hidden="true">' + ic('lock', 12) + '</span>' : '') +
      '</button>' +
      (st.menu ? '<div class="pmenu" role="menu" aria-label="Profile"><div class="who"><b>' + (st.user ? esc(st.user) : 'Guest') + '</b><span class="sub small">' + (MODE === 'google' ? 'Signed in with Google' + (sessionUser && sessionUser.email ? ' · ' + esc(sessionUser.email) : '') : 'Saved only on this device') + '</span></div>' +
        (MODE !== 'google' ? '<button class="mi2" role="menuitem" data-act="m-google" data-key="m-google"><span class="gico" aria-hidden="true">G</span><span><span class="mt">Sign In With Google</span><span class="ms">Sync your budget across devices</span></span></button>' : (sessionUser ? '<button class="mi2" role="menuitem" data-act="signout" data-key="m-signout">' + ic('arrow', 22) + '<span><span class="mt">Sign Out Of Google</span><span class="ms">Sign out of your account</span></span></button>' : '')) +
        '<button class="mi2" role="menuitem" data-act="m-pin" data-key="m-pin">' + ic('key', 22) + '<span><span class="mt">' + (hasPin ? 'Change PIN' : 'Set Up PIN') + '</span><span class="ms">' + (hasPin ? 'Pick 4 new digits' : 'Protect the app with 4 digits') + '</span></span></button>' +
        '<button class="mi2' + (hasPin ? '' : ' dim') + '" role="menuitem" data-act="m-lock" data-key="m-lock">' + ic('lock', 22) + '<span><span class="mt">Lock App</span><span class="ms">' + (hasPin ? 'Lock now, unlock with your PIN' : 'Set a PIN first') + '</span></span></button></div>' : '') +
      '</header>' +
      (st.notice ? '<p class="ok" role="status">' + esc(st.notice) + '</p>' : '') +
      '<section class="streakbar" aria-label="Logging streak"><span class="flame">' + ic('flame', 28, 'fill') + '</span><div class="grow"><p class="s-t">' + st.streak + '-day streak</p><p class="s-s">' + (st.loggedToday ? 'Logged today. Freeze shield is active.' : st.streak ? 'Log today to keep it. Freeze shield is active.' : 'Log an expense today to start a streak.') + '</p></div><span class="badge">' + (st.loggedToday ? 'Logged' : 'Protected') + '</span></section>' +
      '<div class="home-top"><section class="hero" aria-label="Remaining savings"><div class="hero-top"><p class="eyebrow">Remaining savings</p><span class="pill' + (rem < 0 ? ' over' : '') + '">' + (rem >= 0 ? 'Safe to spend' : 'Over budget') + '</span></div><p class="hero-amt">' + peso2(rem) + '</p><p class="hero-of">of ' + peso2(BUDGET) + ' budget</p><div class="hero-track' + (rem < 0 ? ' over' : '') + '" role="img" aria-label="' + Math.round(spent / BUDGET * 100) + '% of budget used"><i style="width:' + Math.min(100, spent / BUDGET * 100) + '%"></i></div><div class="hero-foot"><span>Spent: ' + peso2(spent) + '</span><span>' + peso2(perDay) + ' / day</span></div></section>' +
      '<button class="guard" data-act="go" data-to="summary" data-key="guard"><span class="g-ic em" aria-hidden="true">💵</span><span class="grow"><b>Budget Guard • ' + esc(g.title) + '</b><span class="gt">' + esc(g.text) + '</span></span>' + ic('fwd', 22) + '</button></div>' +
      '<h2 class="sect">Quick actions</h2><div class="qa">' +
        '<button class="qb" data-act="go" data-to="summary" data-key="qa-b">' + ic('pie', 26) + '<span class="qt">Budgets</span><span class="qs">Manage limits</span></button>' +
        '<button class="qb" data-act="go" data-to="history" data-key="qa-h">' + ic('list', 26) + '<span class="qt">History</span><span class="qs">See purchases</span></button>' +
        '<button class="qb main" data-act="newtx" data-key="qa-l">' + ic('plus', 26) + '<span class="qt">Log Expense</span><span class="qs">Add purchase</span></button>' +
        (hasPin
          ? '<button class="qb" data-act="lock" data-key="qa-p">' + ic('lock', 26) + '<span class="qt">Lock App</span><span class="qs">Secure app</span></button>'
          : '<button class="qb" data-act="m-pin" data-key="qa-p">' + ic('key', 26) + '<span class="qt">Set Up PIN</span><span class="qs">Protect app</span></button>') +
      '</div>' +
      '<div class="desk-cols"><section class="card heat" aria-label="Daily heatmap"><div class="hh"><div><p class="eyebrow">Spending rhythm</p><h2>Daily heatmap</h2></div></div>' +
        '<div class="hnav"><button class="icon-btn" data-act="hmonth" data-d="-1" data-key="hprev" aria-label="Previous month"' + (st.heatIdx <= 0 ? ' aria-disabled="true"' : '') + '>' + ic('back') + '</button><p class="hlabel" data-hlabel aria-live="polite">' + MON[st.heatIdx % 12] + ' ' + hy + '</p><button class="icon-btn" data-act="hmonth" data-d="1" data-key="hnext" aria-label="Next month"' + (st.heatIdx >= HLAST ? ' aria-disabled="true"' : '') + '>' + ic('fwd') + '</button></div>' +
        '<div class="seg yrseg" role="group" aria-label="Year"><button data-act="hyear" data-y="' + START_YEAR + '" data-yr="' + START_YEAR + '" data-key="y0" aria-pressed="' + (hy === START_YEAR) + '">' + START_YEAR + '</button><button data-act="hyear" data-y="' + TODAY.getFullYear() + '" data-yr="' + TODAY.getFullYear() + '" data-key="y1" aria-pressed="' + (hy === TODAY.getFullYear()) + '">' + TODAY.getFullYear() + '</button></div>' +
        '<div class="hscroll" data-hscroll data-idx="' + st.heatIdx + '" role="group" aria-label="Months. Swipe sideways to change month.">' + months + '</div>' +
        '<div class="legend"><div class="lg"><span>Less spent</span><i class="g3"></i><i class="g2"></i><i class="g1"></i><i class="r1"></i><i class="r2"></i><i class="r3"></i><span>More spent</span></div><div class="lg"><i class="none"></i><span>Nothing logged. Dotted days are over your ' + peso(ALLOW) + ' daily allowance.</span></div></div>' +
        '<p class="sub">Swipe sideways for other months. Tap a day to see what you spent.</p></section>' +
      '<section class="card" aria-label="Latest activity"><div class="hh"><div><p class="eyebrow">Latest activity</p><h2>Recent purchases</h2></div><button class="link" data-act="go" data-to="history" data-key="viewall">View All ›</button></div><ul class="hlist">' + (latest.length ? latest.map(latestRow).join('') : '<li class="sub">No purchases yet. Tap + to log one.</li>') + '</ul></section></div>' +
      '</div>' + tabs('home') +
      (st.menu ? '<button class="menuscrim" data-act="menu-close" aria-label="Close menu" tabindex="-1"></button>' : '') +
      '</div>';
  },
  amount(st) {
    const ok = num(st.amount) > 0;
    return '<div class="scr">' + bar(st.editId ? 'Edit expense' : 'Log expense', st.editId ? 'history' : 'home', 'Back') + '<div class="body">' + steps(1) +
      '<label class="field"><span class="lbl">Amount</span><span class="amt-in"><b aria-hidden="true">₱</b><input data-in="amount" data-key="in-amount" type="text" inputmode="decimal" autocomplete="off" placeholder="0" value="' + esc(st.amount) + '"></span></label>' +
      '<label class="field"><span class="lbl">Date</span><input data-in="date" type="date" value="' + st.date + '" max="' + TKEY + '"></label>' +
      '<label class="field"><span class="lbl">Note (optional)</span><input data-in="note" type="text" maxlength="40" placeholder="Jollibee Dinner, Angkas ride" value="' + esc(st.note) + '"></label>' +
      errBox(st) +
      '<p class="sub">Next you’ll choose a category. It’s required, so every expense is sorted.</p>' +
      '<div class="spacer"></div>' + pbtn('Next: Choose Category', 'next-amount', null, !ok) + '</div></div>';
  },
  category(st) {
    const tiles = CATS.map(c => {
      const on = st.cat === c.id;
      return '<button class="tile' + (on ? ' sel' : '') + '" data-act="pick" data-id="' + c.id + '" data-key="cat-' + c.id + '" aria-pressed="' + on + '"><span class="em" aria-hidden="true">' + c.emoji + '</span><span>' + esc(c.name) + '</span>' + (on ? ic('check', 20, 'tk') : '') + '</button>';
    }).join('');
    const add = st.addingCat
      ? '<div class="card newcat"><label class="field"><span class="lbl">New category name</span><input data-in="newcat" data-key="newcat-input" type="text" maxlength="20" value="' + esc(st.newCatName) + '"></label><p class="lbl">Pick an icon</p><div class="emopick" role="group" aria-label="Icon">' + EMOJIS.map(e => '<button data-act="emo" data-e="' + e + '" data-key="emo-' + EMOJIS.indexOf(e) + '" aria-pressed="' + (st.newEmoji === e) + '" aria-label="Icon ' + e + '">' + e + '</button>').join('') + '</div><div class="two"><button class="btn btn-secondary" data-act="newcat-cancel">Cancel</button><button class="btn btn-secondary" data-act="newcat-add">Add Category</button></div></div>'
      : '<button class="tile add" data-act="newcat-open" data-key="newcat-open">' + ic('plus', 22) + '<span>New Category</span></button>';
    return '<div class="scr">' + bar('Choose a category', 'amount', 'Back') + '<div class="body">' + steps(2) +
      '<h2 class="q">What was this ' + peso(num(st.amount)) + ' for?</h2>' +
      '<div class="grid2">' + tiles + add + '</div>' + errBox(st) +
      '<div class="spacer"></div>' + pbtn('Next: Review', 'next-cat', null, !st.cat) + '</div></div>';
  },
  review(st) {
    const c = cat(st.cat || 'food');
    return '<div class="scr">' + bar('Review', 'category', 'Back') + '<div class="body">' + steps(3) +
      '<section class="card"><dl class="sum"><div><dt>Amount</dt><dd class="big">' + peso2(num(st.amount)) + '</dd></div>' +
      '<div><dt>Category</dt><dd><span class="em" aria-hidden="true">' + c.emoji + '</span>' + esc(c.name) + '<button class="link" data-act="go" data-to="category" data-key="change">Change</button></dd></div>' +
      '<div><dt>Date</dt><dd>' + fmt(st.date) + '</dd></div>' +
      '<div><dt>Note</dt><dd>' + (st.note && st.note.trim() ? esc(st.note.trim()) : 'None') + '</dd></div></dl></section>' +
      '<p class="sub">This is the last check. Nothing is saved until you confirm.</p>' +
      '<div class="spacer"></div>' + pbtn(st.editId ? 'Save Changes' : 'Confirm And Save', 'confirm') + sbtn('Edit Details', 'edit') + '</div></div>';
  },
  saved(st) {
    const ls = st.lastSaved || { amt: 80, cat: CATS[0] && CATS[0].id, date: TKEY }, c = cat(ls.cat);
    return '<div class="scr">' + bar('Saved') + '<div class="body center"><span class="okmark">' + ic('check', 40) + '</span>' +
      '<h2 class="title">Expense saved</h2><p class="sub">' + peso2(ls.amt) + ' in <span class="em" aria-hidden="true">' + c.emoji + '</span> ' + esc(c.name) + ' on ' + fmt(ls.date) + '</p>' +
      '<section class="streakbar" aria-label="Streak"><span class="flame">' + ic('flame', 28, 'fill') + '</span><div class="grow"><p class="s-t">' + st.savedStreak + '-day streak</p><p class="s-s">' + esc(st.streakMsg || 'Streak +1. Every expense today has a category.') + '</p></div></section>' +
      '<div class="spacer"></div>' + pbtn('Back To Home', 'go', 'home') + sbtn('See Where It Went', 'go', 'summary') + '</div></div>';
  },
  summary(st) {
    const t = totals(st.period), top = t.rows[0], pl = { week: 'Week', month: 'Month', year: 'Year' }, isM = st.period === 'month';
    const seg = '<div class="seg" role="group" aria-label="Period">' + ['week', 'month', 'year'].map(p => '<button data-act="period" data-p="' + p + '" data-key="p-' + p + '" aria-pressed="' + (st.period === p) + '">' + pl[p] + '</button>').join('') + '</div>';
    let head = '';
    if (isM) {
      const rem = BUDGET - t.total, used = BUDGET ? t.total / BUDGET : 0;
      const ov = rem < 0;
      head = '<section class="card tot' + (ov ? ' over' : '') + '"><p class="eyebrow">Total monthly budget</p><p class="big">' + peso2(t.total) + ' <span class="sub">of ' + peso2(BUDGET) + '</span></p><div class="ctrack"><i style="width:' + Math.min(100, used * 100) + '%"></i></div><div class="ch"><p class="sub">' + (ov ? 'Over budget by ' + peso2(-rem) : peso2(rem) + ' safe remaining') + '</p><p class="cp" style="color:' + (ov ? 'var(--err)' : 'var(--brand)') + '">' + (used * 100).toFixed(1) + '% used</p></div></section>';
    }
    const spent = t.total ? '<section class="card"><p class="eyebrow">' + (isM ? 'Total spent this month' : 'Total spent') + '</p><p class="big">' + peso2(t.total) + '</p><p class="sub">' + fmt(t.a) + ' to ' + fmt(t.b) + '</p>' + donut(t.rows, t.total) + '<p class="insight"><span class="em" aria-hidden="true">' + cat(top.id).emoji + '</span> ' + esc(cat(top.id).name) + ' is your largest category: ' + Math.round(top.pct * 100) + '% of this ' + st.period + '.</p></section>' : '';
    const heading = '<div class="hh"><div><p class="eyebrow">' + (isM ? 'This month' : 'This ' + st.period) + '</p><h2 class="sect">' + (isM ? 'Category limits' : 'Where it went') + '</h2></div><button class="manage" data-act="manage-limits" data-key="manage-limits">Manage Categories</button></div>';
    const notice = st.notice ? '<p class="ok" role="status">' + esc(st.notice) + '</p>' : '';
    const sm = {}; t.rows.forEach(r => { sm[r.id] = r.amt; });
    const rows = isM ? CATS.filter(c => sm[c.id] || LIMITS[c.id]).map(c => ({ id: c.id, amt: sm[c.id] || 0, pct: t.total ? (sm[c.id] || 0) / t.total : 0 })).sort((a, b) => b.amt - a.amt) : t.rows;
    const list = rows.length ? '<div class="cstack">' + rows.map(r => catCard(r, isM)).join('') + '</div>' : '<section class="card"><p class="sub">No expenses in this period yet.</p></section>';
    return '<div class="scr">' + bar('Summary', 'home', 'Home') + '<div class="body">' + seg + head + spent + heading + notice + list + '</div>' + tabs('summary') + '</div>';
  },
  limits(st) {
    const dl = st.draftLimits || limitsAsStrings(), db = (st.draftBudget !== '' && st.draftBudget != null) ? st.draftBudget : String(BUDGET);
    const cards = CATS.map(c => {
      const n = TX.filter(t => t.cat === c.id).length;
      return '<article class="lcard"><span class="etile em" aria-hidden="true">' + c.emoji + '</span><div class="grow"><label class="field"><span class="lbl">' + esc(c.name) + '</span><span class="amt-in sm"><b aria-hidden="true">₱</b><input data-in="lim" data-id="' + c.id + '" type="text" inputmode="decimal" autocomplete="off" placeholder="No limit" value="' + esc(dl[c.id] || '') + '"></span></label>' +
        '<div class="lfoot"><p class="sub">' + (n ? n + (n === 1 ? ' transaction' : ' transactions') : 'No transactions') + '</p>' + (CATS.length > 1 ? '<button class="dbtn" data-act="del-ask" data-id="' + c.id + '" data-key="dl-' + c.id + '">' + ic('trash', 18) + 'Delete</button>' : '') + '</div></div></article>';
    }).join('');
    let modal = '';
    if (st.modalId) {
      const mc = cat(st.modalId), mn = TX.filter(t => t.cat === mc.id).length, others = CATS.filter(c => c.id !== mc.id);
      const mv = cat(st.moveTo && st.moveTo !== mc.id ? st.moveTo : (others[0] ? others[0].id : mc.id));
      modal = '<div class="modalb"><div class="modal" role="dialog" aria-modal="true" aria-label="' + (mn ? 'Move transactions first' : 'Delete category') + '"><span class="mi">' + ic('trash', 26) + '</span><h2>' + (mn ? 'Move transactions first' : 'Delete ' + esc(mc.name) + '?') + '</h2>' +
        (mn ? '<p class="sub"><b>' + esc(mc.name) + '</b> has ' + mn + (mn === 1 ? ' transaction' : ' transactions') + ' and cannot be deleted until they have a new category.</p><p class="lbl">Move transactions to</p><div class="selbox"><span class="em" aria-hidden="true">' + mv.emoji + '</span><span>' + esc(mv.name) + '</span>' + ic('chev', 18, 'chev') + '<select data-in="moveto" data-key="move-sel" aria-label="Move transactions to">' + others.map(o => '<option value="' + o.id + '"' + (o.id === mv.id ? ' selected' : '') + '>' + o.emoji + ' ' + esc(o.name) + '</option>').join('') + '</select></div>' :
          '<p class="sub"><b>' + esc(mc.name) + '</b> has no transactions. Its limit is removed too.</p>') +
        '<div class="two"><button class="btn btn-secondary" data-act="del-keep" data-key="del-keep">Keep Category</button><button class="btn btn-danger" data-act="del-go" data-key="del-go">' + (mn ? 'Move &amp; Delete' : 'Delete') + '</button></div></div></div>';
    }
    return '<div class="scr">' + (st.modalId ? bar('Manage Categories', 'summary', 'Summary', true).replace('<header', '<header inert') : bar('Manage Categories', 'summary', 'Summary', true)) + '<div class="body"' + (st.modalId ? ' inert' : '') + '>' +
      '<section class="card"><label class="field"><span class="lbl">Total monthly budget</span><span class="amt-in"><b aria-hidden="true">₱</b><input data-in="budget" data-key="in-budget" type="text" inputmode="decimal" autocomplete="off" value="' + esc(db) + '"></span></label><p class="sub" data-alloc>' + esc(allocText(dl, db)) + '</p></section>' +
      '<div><p class="eyebrow">Custom categories</p><h2 class="sect">Add a Category</h2></div>' +
      '<section class="card addcard"><label class="field"><span class="lbl">Category Name</span><input data-in="addname" data-key="add-name" type="text" maxlength="20" placeholder="Category name" value="' + esc(st.addName) + '"></label>' +
      '<label class="field"><span class="lbl">Monthly Limit (Optional)</span><span class="amt-in sm"><b aria-hidden="true">₱</b><input data-in="addlimit" data-key="add-limit" type="text" inputmode="decimal" autocomplete="off" placeholder="Monthly limit" value="' + esc(st.addLimit) + '"></span></label>' +
      emoRow('add-emo', st.addEmoji, 'aemo-') + (st.addErr ? '<p class="err" role="alert">' + esc(st.addErr) + '</p>' : '') +
      '<button class="btn btn-primary" data-act="cat-add" data-key="add-btn">Add Category</button></section>' +
      (st.notice ? '<p class="ok" role="status">' + esc(st.notice) + '</p>' : '') +
      '<div><p class="eyebrow">Monthly limit per category</p><h2 class="sect">Set your limits</h2></div>' +
      '<div class="cstack">' + cards + '</div>' +
      (st.limErr ? '<p class="err limerr" role="alert">' + esc(st.limErr) + '</p>' : '') +
      '<button class="btn btn-primary" data-act="save-limits" data-key="save-limits">Save Limits</button>' + sbtn('Cancel', 'go', 'summary') + '</div>' + modal + '</div>';
  },
  history(st) {
    const list = monthTx(), total = list.reduce((a, t) => a + t.amt, 0), shown = list.slice(0, st.histN);
    return '<div class="scr">' + bar('Purchase history', 'home', 'Home') + '<div class="body">' +
      '<section class="card"><p class="eyebrow">Total purchases logged</p><p class="big">' + peso2(total) + ' <span class="sub">' + list.length + ' items</span></p><p class="sub">' + MON[TODAY.getMonth()] + ' ' + TODAY.getFullYear() + '</p></section>' +
      '<div class="hh stack"><div><p class="eyebrow">Recent activity</p><h2 class="sect">Things you bought</h2></div><button class="manage" data-act="manage" data-key="manage" aria-pressed="' + st.manage + '">' + (st.manage ? 'Done' : 'Manage Transactions') + '</button></div>' +
      (st.notice ? '<p class="ok" role="status">' + esc(st.notice) + '</p>' : '') +
      '<section class="card" aria-label="Transactions"><ul class="hlist">' + shown.map(t => histRow(t, st)).join('') + '</ul>' + (list.length > shown.length ? '<button class="btn-sm" data-act="more" data-key="more">Show More</button>' : '') + '</section>' +
      pbtn('Log New Transaction', 'newtx', null, false, ic('arrow', 22)) + '</div>' + tabs('history') + '</div>';
  },
  day(st) {
    const k = st.day || TKEY, info = dayInfo(k), list = info.list, diff = ALLOW - info.disc;
    const status = list.length ? (diff >= 0 ? peso(diff) + ' under allowance' : peso(-diff) + ' over allowance') : 'Nothing logged';
    const hasFixed = list.some(t => isFixed(t.cat));
    let content = '';
    if (!list.length) {
      content = '<section class="card"><p class="sub">Nothing was logged on this day.</p></section>' + (k <= TKEY ? sbtn('Log An Expense For This Date', 'logfor') : '');
    } else {
      const seg = '<div class="seg" style="--n:2" role="group" aria-label="View">' + [['tx', 'Transactions'], ['cat', 'By Category']].map(x => '<button data-act="dayseg" data-s="' + x[0] + '" data-key="s-' + x[0] + '" aria-pressed="' + (st.daySeg === x[0]) + '">' + x[1] + '</button>').join('') + '</div>';
      let inner;
      if (st.daySeg === 'tx') inner = '<ul class="hlist">' + list.map(latestRow).join('') + '</ul>';
      else {
        const mm = {}; list.forEach(t => { mm[t.cat] = (mm[t.cat] || 0) + t.amt; });
        const rows = Object.keys(mm).map(id => ({ id, amt: mm[id], pct: mm[id] / info.total })).sort((a, b) => b.amt - a.amt);
        inner = '<div class="cstack">' + rows.map(r => catCard(r, false)).join('') + '</div>';
      }
      content = seg + (st.daySeg === 'tx' ? '<section class="card" aria-label="Details">' + inner + '</section>' : inner) + (hasFixed ? '<p class="sub">Rent, utilities, subscriptions and savings are listed but not counted toward the allowance.</p>' : '');
    }
    return '<div class="scr">' + bar(fmtL(k), 'home', 'Home') + '<div class="body">' +
      '<section class="card"><p class="eyebrow">Day-to-day spending</p><p class="big">' + peso2(info.disc) + '</p><div class="prog" role="img" aria-label="' + peso(info.disc) + ' of ' + peso(ALLOW) + ' allowance"><i class="' + (diff < 0 ? 'over' : '') + '" style="width:' + Math.min(100, info.disc / ALLOW * 100) + '%"></i></div><p class="sub">Allowance ' + peso(ALLOW) + '</p><p class="status">' + status + '</p></section>' + content + '</div></div>';
  }
};

function sidebarHtml(active) {
  const t = [['home', 'Home', 'home'], ['summary', 'Summary', 'pie'], ['history', 'History', 'list']];
  return '<aside class="sidebar"><div class="brand-row">' + logo(40) + '<strong>WAIS</strong></div><nav class="nav" aria-label="Main">' +
    t.map(x => '<button class="tab" data-act="go" data-to="' + x[0] + '" data-key="stab-' + x[0] + '" ' + (active === x[0] ? 'aria-current="page"' : '') + '>' + ic(x[2]) + '<span>' + x[1] + '</span></button>').join('') +
    '</nav><button class="fab" data-act="newtx" data-key="sfab">' + ic('plus', 22) + '<span> Log Expense</span></button>' +
    '<button class="tab side-set" data-act="go" data-to="settings" data-key="stab-settings" ' + (active === 'settings' ? 'aria-current="page"' : '') + '>' + ic('gear') + '<span>Settings</span></button></aside>';
}

function fixHeat(root) {
  [].forEach.call(root.querySelectorAll('[data-hscroll]'), sc => {
    if (!sc.clientWidth) return;
    sc.style.scrollBehavior = 'auto';
    sc.scrollLeft = Number(sc.dataset.idx) * sc.clientWidth;
    sc.style.scrollBehavior = '';
  });
}
function isLocked() { return S.screen === 'lock' || S.screen === 'forgot' || (S.screen === 'pin' && S.pinFlow !== 'change'); }
function render() {
  try { renderInner(); } catch (e) {
    console.error(e);
    rootEl.innerHTML = '<div class="crash"><p class="setup" role="alert">Something went wrong: ' + esc(e.message) + '</p><button class="btn btn-primary" onclick="location.reload()">Reload</button></div>';
  }
}
function renderInner() {
  const locked = isLocked();
  const tabScreen = ['home', 'summary', 'history', 'settings'].includes(S.screen) ? S.screen : '';
  const act = document.activeElement, k = act && act.dataset ? act.dataset.key : null;
  const body = appEl && appEl.querySelector('.body'), st = body ? body.scrollTop : 0, same = (S.screen === lastScreen);
  rootEl.className = 'shell' + (locked ? ' lock-mode' : '');
  rootEl.innerHTML = (locked ? '' : sidebarHtml(tabScreen)) + '<div class="app' + (busy ? ' busy' : '') + '" id="app"></div>';
  appEl = document.getElementById('app');
  if (!isLocked()) recalcAllow();
  appEl.innerHTML = SCREENS[S.screen](S);
  const nb = appEl.querySelector('.body');
  fixHeat(appEl);
  if (!same) { const h = appEl.querySelector('[data-h]'); if (h) h.focus({ preventScroll: true }); if (nb) nb.scrollTop = 0; }
  else {
    if (nb) nb.scrollTop = st;
    const fk = focusKey || k;
    if (fk) { const el = appEl.querySelector('[data-key="' + fk + '"]'); if (el) el.focus({ preventScroll: true }); }
  }
  focusKey = null; lastScreen = S.screen;
}
function updHeatUI() {
  const y = START_YEAR + Math.floor(S.heatIdx / 12);
  const l = appEl.querySelector('[data-hlabel]'); if (l) l.textContent = MON[S.heatIdx % 12] + ' ' + y;
  [].forEach.call(appEl.querySelectorAll('[data-yr]'), b => { b.setAttribute('aria-pressed', String(Number(b.dataset.yr) === y)); });
  const p = appEl.querySelector('[data-act="hmonth"][data-d="-1"]'), n = appEl.querySelector('[data-act="hmonth"][data-d="1"]');
  if (p) { if (S.heatIdx <= 0) p.setAttribute('aria-disabled', 'true'); else p.removeAttribute('aria-disabled'); }
  if (n) { if (S.heatIdx >= HLAST) n.setAttribute('aria-disabled', 'true'); else n.removeAttribute('aria-disabled'); }
}
function heatTo(idx) {
  const sc = appEl.querySelector('[data-hscroll]'); if (!sc) return;
  idx = Math.max(0, Math.min(HLAST, idx));
  const reduced = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  S.heatIdx = idx; sc.dataset.idx = idx;
  sc.scrollTo({ left: idx * sc.clientWidth, behavior: reduced ? 'auto' : 'smooth' });
  updHeatUI();
}
function resetDraft() { S.amount = ''; S.note = ''; S.cat = null; S.date = TKEY; S.editId = null; S.err = ''; S.addingCat = false; }
function doLock(msg) {
  resetDraft(); S.manage = false; S.delId = null; S.modalId = null; S.notice = ''; S.pin = ''; S.err = ''; S.pinMsg = ''; S.confirmErase = false; S.menu = false; S.lockMsg = msg; S.screen = 'lock';
  lastActive = Date.now(); render();
}

async function enterGuest() {
  refreshToday();
  MODE = 'guest';
  localStorage.setItem(MODE_KEY, 'guest');
  S.user = '';
  loadGuest();
  S.pin = ''; S.err = ''; S.lockMsg = ''; S.screen = 'home'; S.heatIdx = HLAST;
  render();
}
async function enterGoogleSession(goHome) {
  refreshToday();
  MODE = 'google';
  localStorage.setItem(MODE_KEY, 'google');
  busy = true; render();
  try {
    if (!sessionUser) throw new Error('no session');
    await loadRemote();
    S.pin = ''; S.err = ''; S.lockMsg = '';
    if (goHome) S.screen = 'home';
    S.heatIdx = HLAST;
  } catch (err) {
    S.err = 'Could not load your budget. Try Google again.';
    S.screen = 'lock';
  }
  busy = false; render();
}

async function handleAct(a, b) {
  let noRender = false;
  if (S.menu && a !== 'menu') S.menu = false;
  switch (a) {
    case 'menu':
      S.menu = !S.menu;
      focusKey = S.menu ? (MODE !== 'google' ? 'm-google' : 'm-pin') : 'avatar';
      break;
    case 'menu-close':
      S.menu = false;
      focusKey = 'avatar';
      break;
    case 'm-google':
      S.menu = false;
      if (!hasSupabase) {
        S.err = supabaseConfigError || 'Google sign-in isn’t set up on this site yet.';
        break;
      }
      await supabase.auth.signInWithOAuth({ provider: 'google', options: { redirectTo: window.location.origin } });
      return;
    case 'm-pin':
      S.menu = false;
      if (getPinRec()) startPinChange();
      else startPinCreate('menu');
      break;
    case 'm-lock':
      S.menu = false;
      if (getPinRec()) {
        doLock('App locked.');
        return;
      }
      startPinCreate('menu');
      S.pinMsg = 'Set a PIN first. Locking needs a PIN so only you can open the app.';
      break;
    case 'pin-later':
      S.pin = ''; S.pinFirst = ''; S.pinStage = 'new'; S.err = ''; S.pinMsg = '';
      S.notice = 'No PIN yet. Tap your profile button anytime to set one up.';
      if (MODE === 'google' && sessionUser) {
        await enterGoogleSession(true);
      } else {
        await enterGuest();
      }
      return;
    case 'pin-back':
      if (S.pinStage === 'confirm') {
        S.pinStage = 'new'; S.pin = ''; S.pinFirst = ''; S.err = '';
      } else {
        S.err = ''; S.pinMsg = ''; S.pin = '';
        S.screen = (S.setupFrom === 'onboard' && !getPinRec()) ? 'lock' : 'home';
      }
      break;
    case 'go':
      S.err = ''; S.notice = ''; S.modalId = null; S.screen = b.dataset.to;
      if (S.screen === 'day' && !S.day) S.day = TKEY;
      if (S.screen === 'history') { S.manage = false; S.delId = null; }
      if (S.screen === 'lock') S.pin = '';
      break;
    case 'newtx': resetDraft(); S.notice = ''; S.screen = 'amount'; break;
    case 'key': if (S.pin.length < 4) S.pin += b.dataset.k; S.err = ''; break;
    case 'clear': S.pin = ''; S.err = ''; break;
    case 'del': S.pin = S.pin.slice(0, -1); S.err = ''; break;
    case 'unlock': {
      if (S.pin.length < 4) break;
      if (Date.now() < S.waitUntil) { S.err = 'Too many wrong tries. Wait ' + Math.ceil((S.waitUntil - Date.now()) / 1000) + ' seconds.'; S.pin = ''; break; }
      if (await checkPin(S.pin)) {
        S.pin = ''; S.err = ''; S.lockMsg = ''; S.fails = 0;
        if (MODE === 'google' && sessionUser) await enterGoogleSession(true);
        else if (MODE === 'google') { S.err = 'Your Google session expired. Sign in with Google again.'; MODE = ''; localStorage.removeItem(MODE_KEY); break; }
        else await enterGuest();
        return;
      }
      S.fails++; S.pin = '';
      if (S.fails >= 5) { S.fails = 0; S.waitUntil = Date.now() + 30000; S.err = 'Too many wrong tries. Wait 30 seconds.'; }
      else S.err = 'Incorrect PIN. Try again.';
      break;
    }
    case 'pin-next': {
      if (S.pin.length < 4) break;
      if (S.pinStage === 'current') {
        if (await checkPin(S.pin)) { S.pinStage = 'new'; S.err = ''; }
        else S.err = 'That isn’t your current PIN.';
        S.pin = ''; break;
      }
      if (S.pinStage === 'new') { S.pinFirst = S.pin; S.pin = ''; S.err = ''; S.pinStage = 'confirm'; break; }
      if (S.pin !== S.pinFirst) { S.pin = ''; S.pinFirst = ''; S.pinStage = 'new'; S.err = 'The PINs didn’t match. Start again.'; break; }
      const wasSet = Boolean(getPinRec());
      await savePin(S.pin);
      S.pin = ''; S.pinFirst = ''; S.err = ''; S.pinMsg = '';
      S.notice = wasSet ? 'PIN changed.' : 'PIN set. WAIS now locks after 1 minute without a tap.';
      lastActive = Date.now();
      if (MODE === 'google') await enterGoogleSession(true); else await enterGuest();
      return;
    }
    case 'pin-change': startPinChange(); break;
    case 'google':
      if (!hasSupabase) { S.err = supabaseConfigError || 'Google sign-in isn’t set up on this site yet.'; break; }
      await supabase.auth.signInWithOAuth({ provider: 'google', options: { redirectTo: window.location.origin } });
      return;
    case 'reset-google':
      if (!hasSupabase) break;
      localStorage.setItem(RESET_KEY, '1');
      await supabase.auth.signInWithOAuth({ provider: 'google', options: { redirectTo: window.location.origin } });
      return;
    case 'erase-ask': S.confirmErase = true; focusKey = 'erase-cancel'; break;
    case 'erase-cancel': S.confirmErase = false; focusKey = 'erase-ask'; break;
    case 'reset-guest':
      localStorage.removeItem(GUEST_KEY); localStorage.removeItem(PIN_KEY);
      if (MODE !== 'google') { MODE = ''; localStorage.removeItem(MODE_KEY); }
      S.confirmErase = false; S.pin = ''; S.err = ''; S.lockMsg = 'On-device budget erased and PIN reset.'; S.screen = 'lock';
      break;
    case 'guest':
      MODE = 'guest'; localStorage.setItem(MODE_KEY, 'guest'); S.err = '';
      if (!getPinRec()) { startPinCreate('onboard'); break; }
      S.pin = ''; S.lockMsg = 'Enter your PIN to open the budget saved on this device.'; S.screen = 'lock';
      break;
    case 'signout':
      if (supabase) await supabase.auth.signOut();
      sessionUser = null; MODE = ''; localStorage.removeItem(MODE_KEY);
      CATS = []; TX = []; rebuildBY();
      resetDraft(); S.lockMsg = 'Signed out of Google.'; S.pin = ''; S.err = ''; S.notice = ''; S.screen = 'lock';
      break;
    case 'lock':
      if (!getPinRec()) {
        startPinCreate('menu');
        S.pinMsg = 'Set a PIN first. Locking needs a PIN so only you can open the app.';
        break;
      }
      doLock('App locked.');
      return;
    case 'next-amount':
      if (num(S.amount) <= 0) S.err = 'Enter an amount above ₱0 to continue.';
      else { S.err = ''; S.screen = 'category'; }
      break;
    case 'pick': S.cat = b.dataset.id; S.err = ''; break;
    case 'next-cat':
      if (!S.cat) S.err = 'Choose a category to continue.';
      else { S.err = ''; S.screen = 'review'; }
      break;
    case 'newcat-open': S.addingCat = true; S.newCatName = ''; S.newEmoji = EMOJIS[0]; S.err = ''; focusKey = 'newcat-input'; break;
    case 'newcat-cancel': S.addingCat = false; S.err = ''; focusKey = 'newcat-open'; break;
    case 'emo': S.newEmoji = b.dataset.e; break;
    case 'newcat-add': {
      const name = S.newCatName.trim();
      if (!name) { S.err = 'Type a name for the new category.'; focusKey = 'newcat-input'; break; }
      if (CATS.some(c => c.name.toLowerCase() === name.toLowerCase())) { S.err = 'That category already exists.'; focusKey = 'newcat-input'; break; }
      const c = { id: uid(), slug: 'c' + Date.now(), name, emoji: S.newEmoji, color: EXTRA[(CATS.length - BASE_CATS.length + EXTRA.length) % EXTRA.length] };
      CATS.push(c); S.cat = c.id; S.addingCat = false; S.err = ''; focusKey = 'cat-' + c.id;
      await persistCat(c);
      break;
    }
    case 'edit': S.err = ''; S.screen = 'amount'; break;
    case 'confirm': {
      const amt = num(S.amount);
      if (S.editId) {
        const t = TX.find(x => String(x.id) === String(S.editId));
        if (t) { t.amt = amt; t.date = S.date; t.cat = S.cat; t.note = S.note.trim(); await persistTx(t); }
        rebuildBY(); resetDraft(); S.notice = 'Changes saved.'; S.manage = true; S.screen = 'history';
        break;
      }
      const tx = { id: uid(), date: S.date, cat: S.cat, amt, note: S.note.trim() };
      TX.push(tx); (BY[tx.date] = BY[tx.date] || []).push(tx);
      await persistTx(tx);
      if (tx.date === TKEY) {
        if (!S.loggedToday) { S.streak++; S.loggedToday = true; S.lastLog = TKEY; S.streakMsg = 'Streak +1. Every expense today has a category.'; }
        else S.streakMsg = 'Already counted today. Your streak stays at ' + S.streak + '.';
      } else S.streakMsg = 'Logged for a past date. Your streak counts today’s logs only.';
      await persistSettings();
      S.savedStreak = S.streak; S.lastSaved = { amt, cat: S.cat, date: tx.date };
      resetDraft(); S.screen = 'saved';
      break;
    }
    case 'manage-limits':
      S.draftLimits = limitsAsStrings(); S.draftBudget = String(BUDGET); S.addName = ''; S.addLimit = ''; S.addEmoji = EMOJIS[0]; S.addErr = ''; S.limErr = ''; S.modalId = null; S.notice = ''; S.screen = 'limits';
      break;
    case 'add-emo': S.addEmoji = b.dataset.e; break;
    case 'cat-add': {
      const nm = S.addName.trim(), pl2 = parseLimit(S.addLimit);
      if (!nm) { S.addErr = 'Enter a category name.'; focusKey = 'add-name'; break; }
      if (CATS.some(c => c.name.toLowerCase() === nm.toLowerCase())) { S.addErr = 'That category already exists.'; focusKey = 'add-name'; break; }
      if (!pl2.ok) { S.addErr = 'Enter a number for the monthly limit, or leave it empty.'; focusKey = 'add-limit'; break; }
      const c = { id: uid(), slug: 'c' + Date.now(), name: nm, emoji: S.addEmoji, color: EXTRA[CATS.length % EXTRA.length] };
      CATS.push(c);
      if (!S.draftLimits) S.draftLimits = limitsAsStrings();
      if (pl2.val > 0) { LIMITS[c.id] = pl2.val; S.draftLimits[c.id] = String(pl2.val); }
      await persistCat(c);
      S.addName = ''; S.addLimit = ''; S.addEmoji = EMOJIS[0]; S.addErr = ''; S.notice = nm + ' was added.'; focusKey = 'add-name';
      break;
    }
    case 'del-ask': {
      const did = b.dataset.id, oth = CATS.filter(c => c.id !== did);
      if (!oth.length) break;
      S.modalId = did; S.moveTo = oth[0].id;
      const food = oth.find(c => c.slug === 'food' || c.id === 'food');
      if (food) S.moveTo = food.id;
      S.notice = '';
      focusKey = TX.some(t => t.cat === did) ? 'move-sel' : 'del-keep';
      break;
    }
    case 'del-keep': { const kid = S.modalId; S.modalId = null; focusKey = 'dl-' + kid; break; }
    case 'del-go': {
      const gid = S.modalId, gc = cat(gid), oth2 = CATS.filter(c => c.id !== gid);
      let moved = 0;
      if (!oth2.length) break;
      if (!oth2.some(c => c.id === S.moveTo)) S.moveTo = oth2[0].id;
      const mvc = cat(S.moveTo);
      for (const t of TX) {
        if (t.cat === gid) { t.cat = S.moveTo; moved++; await persistTx(t); }
      }
      rebuildBY();
      CATS = CATS.filter(c => c.id !== gid); delete LIMITS[gid]; if (S.draftLimits) delete S.draftLimits[gid];
      if (S.cat === gid) S.cat = null;
      await deleteRemoteCat(gid);
      if (MODE === 'guest') saveGuest();
      S.modalId = null; S.notice = gc.name + ' deleted.' + (moved ? ' ' + moved + (moved === 1 ? ' transaction' : ' transactions') + ' moved to ' + mvc.name + '.' : ''); focusKey = 'add-name';
      break;
    }
    case 'save-limits': {
      let bad = false, nl = {};
      CATS.forEach(c => { const pp = parseLimit(S.draftLimits[c.id]); if (!pp.ok) { bad = true; return; } if (pp.val > 0) nl[c.id] = pp.val; });
      const nb = num(S.draftBudget);
      if (bad) S.limErr = 'Enter a number for each limit, or leave the box empty for no limit.';
      else if (!(nb > 0)) S.limErr = 'Enter a monthly budget above ₱0.';
      else {
        LIMITS = nl; BUDGET = nb; S.limErr = ''; S.notice = 'Limits saved. Budget Guard now uses them.'; S.draftLimits = null; S.screen = 'summary';
        await persistSettings();
        for (const c of CATS) await persistCat(c);
      }
      break;
    }
    case 'period': S.period = b.dataset.p; break;
    case 'hmonth': heatTo(S.heatIdx + Number(b.dataset.d)); noRender = true; break;
    case 'hyear': heatTo(Number(b.dataset.y) === START_YEAR ? 11 : HLAST); noRender = true; break;
    case 'day': S.day = b.dataset.day; S.daySeg = 'tx'; S.screen = 'day'; break;
    case 'dayseg': S.daySeg = b.dataset.s; break;
    case 'logfor': resetDraft(); S.date = S.day; S.screen = 'amount'; break;
    case 'manage': S.manage = !S.manage; S.delId = null; S.notice = ''; focusKey = 'manage'; break;
    case 'more': S.histN += 20; break;
    case 'edit-tx': {
      const t2 = TX.find(t => String(t.id) === String(b.dataset.id));
      if (t2) { S.editId = t2.id; S.amount = String(t2.amt); S.date = t2.date; S.note = t2.note; S.cat = t2.cat; S.err = ''; S.notice = ''; S.screen = 'amount'; }
      break;
    }
    case 'del-tx-ask': S.delId = b.dataset.id; focusKey = 'dc-' + S.delId; break;
    case 'del-cancel': focusKey = 'manage'; S.delId = null; break;
    case 'del-yes': {
      const did = b.dataset.id, gone = TX.find(t => String(t.id) === String(did));
      TX = TX.filter(t => String(t.id) !== String(did)); rebuildBY();
      await deleteRemoteTx(did);
      if (MODE === 'guest') saveGuest();
      S.delId = null; S.notice = 'Expense deleted.'; focusKey = 'manage';
      if (gone && gone.date === TKEY && !(BY[TKEY] && BY[TKEY].length) && S.loggedToday) {
        S.loggedToday = false; S.streak = Math.max(0, S.streak - 1); S.lastLog = S.streak ? addDays(TKEY, -1) : null; await persistSettings();
      }
      break;
    }
  }
  if (!noRender) render();
}

function bindRoot() {
  rootEl.addEventListener('scroll', e => {
    const sc = e.target;
    if (!sc || !sc.dataset || sc.dataset.hscroll === undefined) return;
    const idx = Math.round(sc.scrollLeft / (sc.clientWidth || 1));
    if (idx !== S.heatIdx && idx >= 0 && idx <= HLAST) { S.heatIdx = idx; sc.dataset.idx = idx; updHeatUI(); }
  }, true);
  rootEl.addEventListener('click', async e => {
    const btn = e.target.closest('[data-act]');
    if (!btn || !rootEl.contains(btn)) return;
    const a = btn.dataset.act;
    if ((a === 'hmonth' || a === 'hyear') && btn.getAttribute('aria-disabled') === 'true') return;
    if (btn.classList.contains('is-disabled')) return;
    await handleAct(a, btn);
  });
  rootEl.addEventListener('input', e => {
    const t = e.target, w = t.dataset ? t.dataset.in : null; if (!w) return;
    if (w === 'amount') {
      S.amount = t.value;
      const btn = appEl.querySelector('[data-act="next-amount"]'), ok = num(S.amount) > 0;
      if (btn) { btn.classList.toggle('is-disabled', !ok); if (ok) btn.removeAttribute('aria-disabled'); else btn.setAttribute('aria-disabled', 'true'); }
      if (ok && S.err) { S.err = ''; const eb = appEl.querySelector('.err'); if (eb) eb.hidden = true; }
    } else if (w === 'date') S.date = (t.value && t.value <= TKEY) ? t.value : TKEY;
    else if (w === 'note') S.note = t.value;
    else if (w === 'newcat') S.newCatName = t.value;
    else if (w === 'addname' || w === 'addlimit' || w === 'lim' || w === 'budget') {
      if (w === 'addname') S.addName = t.value;
      else if (w === 'addlimit') S.addLimit = t.value;
      else {
        if (!S.draftLimits) S.draftLimits = limitsAsStrings();
        if (w === 'lim') S.draftLimits[t.dataset.id] = t.value; else S.draftBudget = t.value;
        updAlloc();
      }
      S.addErr = ''; S.limErr = '';
    } else if (w === 'moveto') { S.moveTo = t.value; render(); }
  });
  rootEl.addEventListener('keydown', e => {
    if (e.key === 'Escape') {
      if (S.menu) { S.menu = false; focusKey = 'avatar'; render(); return; }
      if (S.modalId) { const xm = S.modalId; S.modalId = null; focusKey = 'dl-' + xm; render(); return; }
    }
    if ((S.screen === 'lock' || S.screen === 'pin') && appEl.querySelector('.keypad') && !e.target.dataset.in) {
      if (/^[0-9]$/.test(e.key)) { e.preventDefault(); if (S.pin.length < 4) { S.pin += e.key; S.err = ''; focusKey = 'k' + e.key; render(); } return; }
      if (e.key === 'Backspace') { e.preventDefault(); S.pin = S.pin.slice(0, -1); render(); return; }
      if (e.key === 'Enter' && S.pin.length === 4 && e.target.tagName !== 'BUTTON') { e.preventDefault(); handleAct(S.screen === 'pin' ? 'pin-next' : 'unlock', e.target); return; }
    }
    if (e.key !== 'Enter') return;
    const w = e.target.dataset ? e.target.dataset.in : null;
    if (w === 'amount') { e.preventDefault(); const b = appEl.querySelector('[data-act="next-amount"]'); if (b) b.click(); }
    if (w === 'newcat') { e.preventDefault(); const c = appEl.querySelector('[data-act="newcat-add"]'); if (c) c.click(); }
  });
  ['pointerdown', 'keydown', 'input', 'scroll'].forEach(ev => rootEl.addEventListener(ev, () => { lastActive = Date.now(); }, true));
}

async function boot() {
  refreshToday();
  S = fresh();
  rootEl = document.getElementById('root');
  bindRoot();
  if (hasSupabase) {
    const href = window.location.hash + window.location.search;
    const fromOAuth = /access_token|[?&]code=|error_description/.test(href);
    try {
      const { data, error } = await supabase.auth.getSession();
      sessionUser = data && data.session ? data.session.user : null;
      supabase.auth.onAuthStateChange((event, session) => {
        sessionUser = session ? session.user : null;
        if (event === 'SIGNED_OUT' && MODE === 'google' && !isLocked()) setTimeout(() => doLock('Your Google session ended. Sign in again.'), 0);
      });
      if (fromOAuth) {
        const params = new URLSearchParams(window.location.hash.slice(1) + '&' + window.location.search.slice(1));
        history.replaceState({}, '', window.location.pathname);
        if (sessionUser) {
          MODE = 'google'; localStorage.setItem(MODE_KEY, 'google');
          if (localStorage.getItem(RESET_KEY) || !getPinRec()) { localStorage.removeItem(RESET_KEY); startPinCreate('onboard'); }
          else S.lockMsg = 'Signed in' + (sessionUser.email ? ' as ' + sessionUser.email : '') + '. Enter your PIN to continue.';
        } else {
          localStorage.removeItem(RESET_KEY);
          S.err = 'Google sign-in didn’t finish: ' + (params.get('error_description') || (error && error.message) || 'please try again') + '.';
        }
      }
    } catch (e) {
      S.err = 'Couldn’t reach Supabase (' + e.message + '). You can still use the app without an account.';
    }
  }
  if (!sessionUser && MODE === 'guest' && !getPinRec() && !S.err) {
    await enterGuest();
    return;
  }
  render();
}

setInterval(() => {
  if (!S) return;
  if (isLocked() || !getPinRec()) { lastActive = Date.now(); return; }
  if (Date.now() - lastActive >= IDLE_MS) doLock('Locked after 1 minute of inactivity.');
}, 500);

boot();
