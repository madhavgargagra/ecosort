/* ============================================================
   EcoSort — Dashboard Page Controller
   page-dashboard.js
   ============================================================ */

'use strict';

document.addEventListener('DOMContentLoaded', () => {
  EcoUtils.initTheme();
  EcoNav.initNavbar();
  EcoUtils.registerServiceWorker();

  const state = EcoStorage.getState();

  if (state.totalScans === 0) {
    document.getElementById('dashboard-empty').hidden = false;
    EcoImpact.renderBadges(state.badges || {});
  } else {
    EcoImpact.updateDashboard(state);
  }

  /* ── Share Impact Card ── */
  document.getElementById('share-impact-btn')?.addEventListener('click', () => {
    EcoShare.generateAndDownload();
    showToast('success', '📤 Impact card downloading…');
  });

  document.getElementById('copy-impact-btn')?.addEventListener('click', async () => {
    const ok = await EcoShare.copyToClipboard();
    if (ok) {
      showToast('success', '📋 Copied to clipboard!');
    } else {
      showToast('info', '📤 Clipboard unavailable — downloading instead');
      EcoShare.generateAndDownload();
    }
  });

  console.log('🌿 EcoSort Dashboard page ready');
});

