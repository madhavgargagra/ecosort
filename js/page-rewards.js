/* ============================================================
   EcoSort — Rewards Page Controller
   page-rewards.js
   ============================================================ */

'use strict';

document.addEventListener('DOMContentLoaded', () => {
  EcoUtils.initTheme();
  EcoNav.initNavbar();

  const state = EcoStorage.getState();

  // Render credits summary
  EcoRewards.updateCreditsUI(state);

  // Render marketplace (always show, just disable buttons if insufficient)
  EcoRewards.renderRewardsGrid(state.ecoCredits, state.redemptionHistory);

  // Render redemption history
  EcoRewards.renderRedemptionHistory(state.redemptionHistory);

  // Refresh nav credits when redemption changes state
  window.addEventListener('ecosort:credits-changed', () => {
    EcoNav.refreshNavCredits();
  });

  console.log('🌿 EcoSort Rewards page ready');
});
