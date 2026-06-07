/* ============================================================
   EcoSort — Environmental Impact Calculator
   impact.js
   ============================================================ */

'use strict';

/**
 * Animate a numeric counter from 0 to target value.
 * @param {HTMLElement} el - The element to update
 * @param {number} target - Target value
 * @param {number} decimals - Decimal places
 * @param {number} duration - Animation duration in ms
 */
function animateCounter(el, target, decimals = 1, duration = 1500) {
  if (!el) return;
  const start = parseFloat(el.textContent) || 0;
  const startTime = performance.now();

  function update(currentTime) {
    const elapsed = currentTime - startTime;
    const progress = Math.min(elapsed / duration, 1);
    // Ease out cubic
    const eased = 1 - Math.pow(1 - progress, 3);
    const current = start + (target - start) * eased;
    el.textContent = decimals === 0
      ? Math.round(current).toLocaleString()
      : current.toFixed(decimals);
    if (progress < 1) requestAnimationFrame(update);
  }

  requestAnimationFrame(update);
}

/**
 * Update the SVG ring fill amount.
 * @param {SVGCircleElement} ringEl
 * @param {number} pct - 0 to 1
 */
function animateRing(ringEl, pct, duration = 1500) {
  if (!ringEl) return;
  const circumference = 2 * Math.PI * 40; // r=40
  const dashOffset = circumference * (1 - Math.min(pct, 1));

  ringEl.style.transition = `stroke-dashoffset ${duration}ms cubic-bezier(0.25, 1, 0.5, 1)`;
  // Trigger reflow
  ringEl.getBoundingClientRect();
  ringEl.style.strokeDashoffset = dashOffset;
}

/**
 * Calculate human-readable equivalents for CO₂ saved.
 */
function getCO2Equivalent(kgCO2) {
  const km = (kgCO2 / 0.21).toFixed(1); // avg car emits ~210g CO₂/km
  if (kgCO2 < 1)     return `≈ ${(kgCO2 * 4.76).toFixed(1)} km not driven`;
  if (kgCO2 < 10)    return `≈ ${km} km not driven`;
  return `≈ ${(kgCO2 / 21).toFixed(1)} trees' annual absorption`;
}

/**
 * Calculate equivalent showers for water saved.
 */
function getWaterEquivalent(litres) {
  const showers = (litres / 65).toFixed(1); // avg shower ~65L
  if (litres < 65)  return `≈ ${litres.toFixed(0)}L (${(litres / 2).toFixed(0)} glasses)`;
  return `≈ ${showers} showers`;
}

/**
 * Calculate tree equivalent in oxygen days for trees saved.
 */
function getTreesEquivalent(trees) {
  const oxygenDays = (trees * 365).toFixed(0);
  if (trees < 0.1)  return `${oxygenDays} days of oxygen`;
  return `≈ ${oxygenDays} days of O₂`;
}

/**
 * Calculate light bulb hours for energy saved.
 */
function getEnergyEquivalent(wh) {
  const hours = (wh / 10).toFixed(0); // 10W LED
  if (wh < 100)  return `≈ ${hours} hrs LED bulb`;
  if (wh < 1000) return `≈ ${(wh / 60).toFixed(1)} hrs laptop`;
  return `≈ ${(wh / 1000).toFixed(2)} kWh`;
}

/**
 * Render impact from a single item in the results section.
 * @param {object} item - WASTE_ITEMS entry
 * @param {HTMLElement} container - The impact-preview-grid element
 */
function renderItemImpactPreview(item, container) {
  if (!container) return;
  container.innerHTML = '';

  const metrics = [];

  if (item.co2Saved > 0) {
    metrics.push({
      icon: '🌿', value: item.co2Saved.toFixed(3), unit: 'kg CO₂',
      label: 'Carbon Saved', sub: getCO2Equivalent(item.co2Saved),
    });
  }
  if (item.waterSaved > 0) {
    metrics.push({
      icon: '💧', value: item.waterSaved.toFixed(1), unit: 'litres',
      label: 'Water Saved', sub: getWaterEquivalent(item.waterSaved),
    });
  }
  if (item.energySaved > 0) {
    metrics.push({
      icon: '⚡', value: item.energySaved, unit: 'Wh',
      label: 'Energy Saved', sub: getEnergyEquivalent(item.energySaved),
    });
  }

  if (metrics.length === 0) {
    // Item isn't recyclable — show what NOT sorting costs
    const el = document.createElement('div');
    el.className = 'impact-preview-item';
    el.innerHTML = `
      <span class="impact-preview-icon">⚠️</span>
      <span class="impact-preview-value" style="color:var(--color-landfill)">Landfill</span>
      <span class="impact-preview-label">This item cannot be recycled. Dispose in the correct special bin to prevent landfill harm.</span>
    `;
    container.appendChild(el);
    return;
  }

  for (const m of metrics) {
    const el = document.createElement('div');
    el.className = 'impact-preview-item';
    el.innerHTML = `
      <span class="impact-preview-icon">${m.icon}</span>
      <span class="impact-preview-value">${m.value} <small style="font-size:0.6em;font-weight:400">${m.unit}</small></span>
      <span class="impact-preview-label">${m.label}</span>
      <span class="impact-preview-label" style="color:var(--accent-green)">${m.sub}</span>
    `;
    container.appendChild(el);
  }
}

/**
 * Update the full dashboard with current state data.
 * @param {object} state - From EcoStorage.getState()
 */
function updateDashboard(state) {
  const impact = state.impact || {};

  // Max reference values for ring fill (100% at these amounts)
  const MAX = { co2: 50, water: 5000, trees: 5, energy: 5000 };

  // CO₂
  const co2El = document.getElementById('dash-co2');
  const co2Ring = document.getElementById('co2-ring-fill');
  animateCounter(co2El, impact.co2Saved || 0, 2);
  animateRing(co2Ring, (impact.co2Saved || 0) / MAX.co2);
  const co2EquivEl = document.getElementById('co2-equiv');
  if (co2EquivEl) co2EquivEl.textContent = getCO2Equivalent(impact.co2Saved || 0);

  // Water
  const waterEl = document.getElementById('dash-water');
  const waterRing = document.getElementById('water-ring-fill');
  animateCounter(waterEl, impact.waterSaved || 0, 0);
  animateRing(waterRing, (impact.waterSaved || 0) / MAX.water);
  const waterEquivEl = document.getElementById('water-equiv');
  if (waterEquivEl) waterEquivEl.textContent = getWaterEquivalent(impact.waterSaved || 0);

  // Trees
  const treesEl = document.getElementById('dash-trees');
  const treesRing = document.getElementById('trees-ring-fill');
  const trees = impact.treesSaved || 0;
  animateCounter(treesEl, trees, 2);
  animateRing(treesRing, trees / MAX.trees);
  const treesEquivEl = document.getElementById('trees-equiv');
  if (treesEquivEl) treesEquivEl.textContent = getTreesEquivalent(trees);

  // Energy
  const energyEl = document.getElementById('dash-energy');
  const energyRing = document.getElementById('energy-ring-fill');
  animateCounter(energyEl, impact.energySaved || 0, 0);
  animateRing(energyRing, (impact.energySaved || 0) / MAX.energy);
  const energyEquivEl = document.getElementById('energy-equiv');
  if (energyEquivEl) energyEquivEl.textContent = getEnergyEquivalent(impact.energySaved || 0);

  // Stat cards
  const statTotal = document.getElementById('stat-total');
  const statStreak = document.getElementById('stat-streak');
  const statCredits = document.getElementById('stat-credits');
  const statLevel = document.getElementById('stat-level');
  if (statTotal)   animateCounter(statTotal, state.totalScans || 0, 0);
  if (statStreak)  animateCounter(statStreak, state.streak || 0, 0);
  if (statCredits) animateCounter(statCredits, state.ecoCredits || 0, 0);
  if (statLevel)   statLevel.textContent = getLevel(state.totalScans || 0);

  // Hero stats
  const heroTotal = document.getElementById('hero-total-scans');
  const heroCo2 = document.getElementById('hero-co2');
  const heroCredits = document.getElementById('hero-credits');
  if (heroTotal)   animateCounter(heroTotal, state.totalScans || 0, 0, 800);
  if (heroCo2)     animateCounter(heroCo2, impact.co2Saved || 0, 1, 800);
  if (heroCredits) animateCounter(heroCredits, state.ecoCredits || 0, 0, 800);

  // Nav credits
  const navCount = document.getElementById('nav-credits-count');
  if (navCount) navCount.textContent = state.ecoCredits || 0;

  // Category breakdown
  renderBreakdownBars(state.categoryBreakdown || {}, state.totalScans || 0);

  // History
  renderHistory(state.scanHistory || []);

  // Badges
  renderBadges(state.badges || {});
}

function getLevel(totalScans) {
  if (totalScans >= 200) return 'Planet Hero';
  if (totalScans >= 50)  return 'Green Champion';
  if (totalScans >= 15)  return 'Eco Warrior';
  return 'Beginner';
}

function renderBreakdownBars(breakdown, total) {
  const container = document.getElementById('breakdown-bars');
  if (!container) return;
  container.innerHTML = '';

  const categoryOrder = ['recyclable', 'compostable', 'landfill', 'hazardous', 'ewaste', 'textiles', 'bulky', 'medical'];

  for (const catId of categoryOrder) {
    const count = breakdown[catId] || 0;
    if (count === 0 && total > 0) continue; // Skip empty categories once scanning started
    const cat = WASTE_CATEGORIES[catId];
    const pct = total > 0 ? (count / total) * 100 : 0;

    const item = document.createElement('div');
    item.className = 'breakdown-bar-item';
    item.innerHTML = `
      <div class="breakdown-bar-label">
        <span>${cat.icon}</span>
        <span>${cat.label}</span>
      </div>
      <div class="breakdown-bar-track">
        <div class="breakdown-bar-fill" style="background:${cat.color}" data-pct="${pct}"></div>
      </div>
      <div class="breakdown-bar-count">${count}</div>
    `;
    container.appendChild(item);

    // Animate width
    const fill = item.querySelector('.breakdown-bar-fill');
    setTimeout(() => {
      fill.style.transition = 'width 1.2s cubic-bezier(0.25, 1, 0.5, 1)';
      fill.style.width = pct + '%';
    }, 50);
  }

  if (total === 0) {
    container.innerHTML = '<p style="color:var(--text-muted);font-size:0.9rem;text-align:center;padding:var(--sp-6)">Start scanning to see your category breakdown!</p>';
  }
}

function renderHistory(history) {
  const container = document.getElementById('history-list');
  if (!container) return;

  if (!history || history.length === 0) {
    container.innerHTML = '<p class="history-empty">No scans yet. Start sorting to build your history!</p>';
    return;
  }

  container.innerHTML = '';
  for (const entry of history.slice(0, 20)) {
    const timeAgo = formatTimeAgo(entry.timestamp);
    const item = document.createElement('div');
    item.className = 'history-item';
    item.innerHTML = `
      <span class="history-item-icon">${entry.icon}</span>
      <div class="history-item-info">
        <div class="history-item-name">${entry.itemName}</div>
        <div class="history-item-category">${WASTE_CATEGORIES[entry.category]?.label || entry.category}</div>
      </div>
      <span class="history-item-credits">+${entry.credits}🪙</span>
      <span class="history-item-time">${timeAgo}</span>
    `;
    container.appendChild(item);
  }
}

function formatTimeAgo(timestamp) {
  const seconds = Math.floor((Date.now() - timestamp) / 1000);
  if (seconds < 60)  return 'just now';
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
  return `${Math.floor(seconds / 86400)}d ago`;
}

function renderBadges(unlockedBadges) {
  const container = document.getElementById('badges-grid');
  if (!container) return;
  container.innerHTML = '';

  const badges = EcoStorage.getBadgeDefinitions();
  for (const badge of badges) {
    const unlocked = !!unlockedBadges[badge.id];
    const item = document.createElement('div');
    item.className = `badge-item ${unlocked ? 'unlocked' : 'locked'}`;
    item.title = badge.desc;
    item.innerHTML = `
      <span class="badge-emoji">${badge.emoji}</span>
      <span class="badge-name">${badge.name}</span>
      <span class="badge-desc">${badge.desc}</span>
      ${unlocked ? '<span class="badge-unlocked-tag">✓</span>' : ''}
    `;
    container.appendChild(item);
  }
}

// Export
window.EcoImpact = {
  animateCounter,
  animateRing,
  renderItemImpactPreview,
  updateDashboard,
  getLevel,
  renderBadges,
  renderHistory,
};
