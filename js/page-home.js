/* ============================================================
   EcoSort — Home Page Controller
   page-home.js
   ============================================================ */

'use strict';

document.addEventListener('DOMContentLoaded', () => {
  EcoUtils.initTheme();
  EcoNav.initNavbar();
  EcoUtils.registerServiceWorker();

  // Animate hero stats from localStorage
  try {
    const raw = localStorage.getItem('ecosort_v1');
    const state = raw ? JSON.parse(raw) : {};
    const totalScans = state.totalScans || 0;
    const co2 = (state.impact?.co2Saved || 0);
    const credits = state.ecoCredits || 0;

    animateNum('hero-total-scans', totalScans, 0);
    animateNum('hero-co2', co2, 1);
    animateNum('hero-credits', credits, 0);
  } catch (_) {}

  // Community counter
  animateCommunityCounter();
});

/* ── Community Impact Counter ── */
function animateCommunityCounter() {
  // Seed: app launched Jan 1, 2026 — grows daily
  const LAUNCH = new Date('2026-01-01').getTime();
  const days   = Math.max(0, Math.floor((Date.now() - LAUNCH) / 86400000));

  let appState = {};
  try { const r = localStorage.getItem('ecosort_v1'); if (r) appState = JSON.parse(r); } catch (_) {}

  const BASE_ITEMS    = 10000,  ITEMS_PER_DAY  = 730;
  const BASE_USERS    = 1200,   USERS_PER_DAY  = 45;
  const BASE_CREDITS  = 120000, CREDITS_PER_DAY = 8760;

  const globalItems   = BASE_ITEMS   + days * ITEMS_PER_DAY;
  const userItems     = appState.totalScans || 0;
  const totalItems    = globalItems + userItems;
  const totalCO2      = +(totalItems * 0.10).toFixed(0);
  const totalUsers    = BASE_USERS   + days * USERS_PER_DAY;
  const totalCredits  = BASE_CREDITS + days * CREDITS_PER_DAY + (appState.ecoCredits || 0);

  animateNum('comm-items',   totalItems,   0);
  animateNum('comm-co2',     totalCO2,     0);
  animateNum('comm-users',   totalUsers,   0);
  animateNum('comm-credits', totalCredits, 0);
}


function animateNum(id, target, decimals) {
  const el = document.getElementById(id);
  if (!el || target === 0) return;
  const duration = 1200;
  const start = performance.now();
  function tick(now) {
    const pct = Math.min((now - start) / duration, 1);
    const ease = 1 - Math.pow(1 - pct, 3);
    el.textContent = decimals === 0
      ? Math.round(target * ease).toLocaleString()
      : (target * ease).toFixed(decimals);
    if (pct < 1) requestAnimationFrame(tick);
  }
  requestAnimationFrame(tick);
}
