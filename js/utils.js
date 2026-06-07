/* ============================================================
   EcoSort — Shared Utilities (all pages)
   utils.js
   ============================================================ */

'use strict';

/* ── SLEEP ── */
function sleep(ms) {
  return new Promise(r => setTimeout(r, ms));
}

/* ── TOAST SYSTEM ── */
function showToast(type, message, duration = 4000) {
  const container = document.getElementById('toast-container');
  if (!container) return;
  const icons = { success: '✅', error: '❌', info: 'ℹ️', reward: '🎁' };
  const toast = document.createElement('div');
  toast.className = `toast ${type}`;
  toast.innerHTML = `<span>${icons[type] || '💬'}</span><span>${message}</span>`;
  container.appendChild(toast);
  setTimeout(() => {
    toast.style.animation = 'toastOut 0.3s ease forwards';
    setTimeout(() => toast.remove(), 300);
  }, duration);
}
window.showToast = showToast;

/* ── THEME ── */
function initTheme() {
  const saved = localStorage.getItem('ecosort_theme') || 'dark';
  applyTheme(saved);
}

function applyTheme(theme) {
  document.documentElement.setAttribute('data-theme', theme);
  localStorage.setItem('ecosort_theme', theme);
  const icon = document.getElementById('theme-icon');
  if (icon) icon.textContent = theme === 'dark' ? '🌙' : '☀️';
}

function toggleTheme() {
  const current = document.documentElement.getAttribute('data-theme');
  applyTheme(current === 'dark' ? 'light' : 'dark');
}

/* ── SERVICE WORKER REGISTRATION ── */
function registerServiceWorker() {
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('/sw.js')
        .then(reg => {
          console.log('[EcoSort] SW registered, scope:', reg.scope);
          // Check for updates
          reg.addEventListener('updatefound', () => {
            const worker = reg.installing;
            worker?.addEventListener('statechange', () => {
              if (worker.state === 'installed' && navigator.serviceWorker.controller) {
                showToast('info', '🔄 App updated! Refresh to get the latest version.');
              }
            });
          });
        })
        .catch(err => console.warn('[EcoSort] SW registration failed:', err));
    });
  }
}

/* ── PWA INSTALL PROMPT ── */
let _deferredInstallPrompt = null;
window.addEventListener('beforeinstallprompt', e => {
  e.preventDefault();
  _deferredInstallPrompt = e;
  // Show install button if present on page
  const btn = document.getElementById('pwa-install-btn');
  if (btn) btn.hidden = false;
});

function showInstallPrompt() {
  if (!_deferredInstallPrompt) return;
  _deferredInstallPrompt.prompt();
  _deferredInstallPrompt.userChoice.then(choice => {
    if (choice.outcome === 'accepted') showToast('success', '✅ EcoSort installed! Find it on your home screen.');
    _deferredInstallPrompt = null;
  });
}

window.EcoUtils = { sleep, showToast, initTheme, applyTheme, toggleTheme, registerServiceWorker, showInstallPrompt };
