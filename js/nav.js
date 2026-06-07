/* ============================================================
   EcoSort — Shared Navbar Initializer (all pages)
   nav.js
   ============================================================ */

'use strict';

/**
 * Initialize the navbar: theme toggle, credits display, active link, scroll effect.
 */
function initNavbar() {
  /* Theme toggle */
  document.getElementById('theme-toggle')?.addEventListener('click', () => {
    EcoUtils.toggleTheme();
  });

  /* Live credits counter from localStorage */
  refreshNavCredits();

  /* Scroll shadow */
  window.addEventListener('scroll', () => {
    document.getElementById('navbar')?.classList.toggle('scrolled', window.scrollY > 20);
  }, { passive: true });

  /* Active link: compare href filename to current page */
  const currentPage = location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-link').forEach(link => {
    const linkPage = link.getAttribute('href').split('/').pop();
    if (linkPage === currentPage) {
      link.classList.add('active');
      link.setAttribute('aria-current', 'page');
    }
  });
}

function refreshNavCredits() {
  try {
    const raw = localStorage.getItem('ecosort_v1');
    const state = raw ? JSON.parse(raw) : {};
    const credits = state.ecoCredits || 0;
    const el = document.getElementById('nav-credits-count');
    if (el) el.textContent = credits;
  } catch (_) {}
}

window.EcoNav = { initNavbar, refreshNavCredits };
