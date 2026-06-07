/* ============================================================
   EcoSort — LocalStorage Persistence Layer
   storage.js
   ============================================================ */

'use strict';

const STORAGE_KEY = 'ecosort_v1';

const DEFAULT_STATE = {
  totalScans: 0,
  ecoCredits: 0,
  streak: 0,
  lastScanDate: null,
  categoryBreakdown: {
    recyclable: 0, compostable: 0, landfill: 0,
    hazardous: 0, ewaste: 0, textiles: 0, bulky: 0, medical: 0,
  },
  impact: {
    co2Saved: 0,
    waterSaved: 0,
    energySaved: 0,
    treesSaved: 0,
  },
  badges: {},
  scanHistory: [],       // max 50 entries
  redemptionHistory: [],
};

function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return { ...DEFAULT_STATE };
    const parsed = JSON.parse(raw);
    // Merge with defaults to handle new fields in future versions
    return {
      ...DEFAULT_STATE,
      ...parsed,
      impact: { ...DEFAULT_STATE.impact, ...(parsed.impact || {}) },
      categoryBreakdown: { ...DEFAULT_STATE.categoryBreakdown, ...(parsed.categoryBreakdown || {}) },
      badges: parsed.badges || {},
    };
  } catch {
    return { ...DEFAULT_STATE };
  }
}

function saveState(state) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch (e) {
    console.warn('EcoSort: Could not save to localStorage:', e);
  }
}

/**
 * Record a scan result and update all stats.
 * @param {object} item - The WASTE_ITEMS entry
 * @param {number} creditsEarned
 * @returns {object} Updated state
 */
function recordScan(item, creditsEarned) {
  const state = loadState();

  // Update streak
  const today = new Date().toDateString();
  const yesterday = new Date(Date.now() - 86400000).toDateString();
  if (state.lastScanDate === today) {
    // Already scanned today — keep streak
  } else if (state.lastScanDate === yesterday) {
    state.streak += 1;
  } else {
    state.streak = 1;
  }
  state.lastScanDate = today;

  // Update counters
  state.totalScans += 1;
  state.ecoCredits += creditsEarned;
  state.categoryBreakdown[item.category] = (state.categoryBreakdown[item.category] || 0) + 1;

  // Update impact
  state.impact.co2Saved    += (item.co2Saved    || 0);
  state.impact.waterSaved  += (item.waterSaved  || 0);
  state.impact.energySaved += (item.energySaved || 0);
  // Trees: roughly 1 tree absorbs ~21 kg CO₂/year; we express as fraction
  state.impact.treesSaved  += (item.co2Saved || 0) / 21;

  // Add to history (cap at 50)
  state.scanHistory.unshift({
    itemName: item.name,
    category: item.category,
    icon: WASTE_CATEGORIES[item.category]?.icon || '📦',
    credits: creditsEarned,
    timestamp: Date.now(),
  });
  if (state.scanHistory.length > 50) state.scanHistory.pop();

  saveState(state);
  return state;
}

/**
 * Check and unlock badges based on current state.
 * @returns {object[]} Array of newly unlocked badge ids
 */
function checkBadges(state) {
  const BADGE_DEFS = getBadgeDefinitions();
  const newlyUnlocked = [];

  for (const badge of BADGE_DEFS) {
    if (!state.badges[badge.id] && badge.condition(state)) {
      state.badges[badge.id] = { unlockedAt: Date.now() };
      state.ecoCredits += 50; // badge bonus
      newlyUnlocked.push(badge);
    }
  }

  if (newlyUnlocked.length > 0) saveState(state);
  return newlyUnlocked;
}

/**
 * Redeem a reward.
 * @param {object} reward
 * @returns {{ success: boolean, message: string }}
 */
function redeemReward(reward) {
  const state = loadState();

  if (state.ecoCredits < reward.cost) {
    return { success: false, message: `Need ${reward.cost - state.ecoCredits} more credits.` };
  }

  // Check not already redeemed (for single-use rewards)
  if (reward.singleUse) {
    const alreadyRedeemed = state.redemptionHistory.some(r => r.rewardId === reward.id);
    if (alreadyRedeemed) {
      return { success: false, message: 'You have already redeemed this reward.' };
    }
  }

  state.ecoCredits -= reward.cost;
  const code = generateRedemptionCode(reward.id);
  state.redemptionHistory.unshift({
    rewardId: reward.id,
    rewardName: reward.title,
    rewardIcon: reward.icon,
    cost: reward.cost,
    code,
    timestamp: Date.now(),
  });

  saveState(state);
  return { success: true, code };
}

function getState() { return loadState(); }

function clearState() {
  localStorage.removeItem(STORAGE_KEY);
}

function generateRedemptionCode(prefix) {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let code = prefix.toUpperCase().replace(/\s+/g, '').slice(0, 3) + '-';
  for (let i = 0; i < 6; i++) code += chars[Math.floor(Math.random() * chars.length)];
  return code;
}

/* ── BADGE DEFINITIONS ── */
function getBadgeDefinitions() {
  return [
    {
      id: 'first_sort',
      emoji: '🌱',
      name: 'First Sort',
      desc: 'Sorted your very first item.',
      condition: s => s.totalScans >= 1,
    },
    {
      id: 'ten_sorts',
      emoji: '🎯',
      name: 'Getting Started',
      desc: 'Sorted 10 items correctly.',
      condition: s => s.totalScans >= 10,
    },
    {
      id: 'fifty_sorts',
      emoji: '♻️',
      name: 'Recycling Pro',
      desc: 'Sorted 50 items — you\'re a pro!',
      condition: s => s.totalScans >= 50,
    },
    {
      id: 'century',
      emoji: '💯',
      name: 'Century',
      desc: 'Sorted 100 items. Incredible!',
      condition: s => s.totalScans >= 100,
    },
    {
      id: 'streak_7',
      emoji: '🔥',
      name: 'On Fire',
      desc: '7-day sorting streak!',
      condition: s => s.streak >= 7,
    },
    {
      id: 'streak_30',
      emoji: '🏅',
      name: 'Habit Formed',
      desc: '30-day sorting streak!',
      condition: s => s.streak >= 30,
    },
    {
      id: 'planet_saver',
      emoji: '🌍',
      name: 'Planet Saver',
      desc: 'Saved 10 kg of CO₂.',
      condition: s => (s.impact?.co2Saved || 0) >= 10,
    },
    {
      id: 'water_warrior',
      emoji: '💧',
      name: 'Water Warrior',
      desc: 'Saved 1,000 litres of water.',
      condition: s => (s.impact?.waterSaved || 0) >= 1000,
    },
    {
      id: 'hazardous_handler',
      emoji: '⚠️',
      name: 'Hazard Expert',
      desc: 'Correctly sorted 5 hazardous items.',
      condition: s => (s.categoryBreakdown?.hazardous || 0) >= 5,
    },
    {
      id: 'ewaste_expert',
      emoji: '💻',
      name: 'Tech Recycler',
      desc: 'Sorted 5 e-waste items.',
      condition: s => (s.categoryBreakdown?.ewaste || 0) >= 5,
    },
    {
      id: 'green_thumb',
      emoji: '🌿',
      name: 'Green Thumb',
      desc: 'Composted 10 organic items.',
      condition: s => (s.categoryBreakdown?.compostable || 0) >= 10,
    },
    {
      id: 'fashion_forward',
      emoji: '👗',
      name: 'Fashion Forward',
      desc: 'Correctly handled 3 textile items.',
      condition: s => (s.categoryBreakdown?.textiles || 0) >= 3,
    },
  ];
}

// Export
window.EcoStorage = {
  loadState,
  saveState,
  recordScan,
  checkBadges,
  redeemReward,
  getState,
  clearState,
  getBadgeDefinitions,
};
