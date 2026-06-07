/* ============================================================
   EcoSort — Eco Credits & Rewards System
   rewards.js
   ============================================================ */

'use strict';

/* ── REWARD DEFINITIONS ── */
const REWARDS_CATALOGUE = [
  // ── Community Services
  {
    id: 'free_garbage',
    icon: '🚛',
    title: 'Free Garbage Collection',
    org: 'Municipal Services Partner',
    tag: 'Community',
    desc: 'Redeem for one free special-item garbage pickup from your home. Valid for bulky or hazardous waste pickup.',
    cost: 200,
    singleUse: false,
    rewardBgFrom: '#1A2E28', rewardBgTo: '#0D1E18',
    rewardBgLightFrom: '#D4EDE4', rewardBgLightTo: '#B8E0CC',
    impactNote: '🌱 Prevents illegal dumping of bulky waste',
  },
  {
    id: 'compost_delivery',
    icon: '🌿',
    title: 'Free Compost Bag',
    org: 'Local Composting Facility',
    tag: 'Garden',
    desc: 'Receive a 5kg bag of nutrient-rich compost made from collected organic waste — perfect for your garden or balcony plants.',
    cost: 150,
    singleUse: false,
    rewardBgFrom: '#1A2E20', rewardBgTo: '#0D1A12',
    rewardBgLightFrom: '#D4EDE4', rewardBgLightTo: '#C0E8D0',
    impactNote: '🌻 Closes the composting loop',
  },
  {
    id: 'tree_plant',
    icon: '🌳',
    title: 'Plant a Tree in Your Name',
    org: 'EcoSort × Forest Initiative',
    tag: 'Impact',
    desc: 'We plant a real tree in a local urban forest in your name. You receive GPS coordinates and a growth update after 6 months.',
    cost: 300,
    singleUse: false,
    rewardBgFrom: '#1A2816', rewardBgTo: '#0D1A0A',
    rewardBgLightFrom: '#D8EDD4', rewardBgLightTo: '#C4E0BF',
    impactNote: '🌍 Sequesters ~21 kg CO₂/year',
  },
  {
    id: 'ewaste_pickup',
    icon: '📱',
    title: 'Free E-Waste Pickup',
    org: 'Certified E-Waste Recycler',
    tag: 'E-Waste',
    desc: 'Get your old electronics collected from your doorstep for free — phones, laptops, cables, and appliances all accepted.',
    cost: 180,
    singleUse: false,
    rewardBgFrom: '#1A1830', rewardBgTo: '#0E0D20',
    rewardBgLightFrom: '#E8E4F4', rewardBgLightTo: '#D4CFE8',
    impactNote: '💻 Recovers precious metals from e-waste',
  },
  // ── Discount Vouchers
  {
    id: 'grocery_discount',
    icon: '🛒',
    title: '10% Off at EcoMart',
    org: 'EcoMart Grocery Partner',
    tag: 'Discount',
    desc: '10% discount on any single grocery purchase — valid at participating sustainable grocery stores and organic markets.',
    cost: 100,
    singleUse: false,
    rewardBgFrom: '#2A1A1A', rewardBgTo: '#1A0D0D',
    rewardBgLightFrom: '#F4E4D4', rewardBgLightTo: '#E8D4C0',
    impactNote: '🥦 Supports local sustainable grocery',
  },
  {
    id: 'repair_cafe',
    icon: '🔧',
    title: 'Free Repair Café Session',
    org: 'Community Repair Network',
    tag: 'Repair',
    desc: 'Book a free 1-hour session at your local Repair Café where volunteers fix clothes, appliances, electronics and furniture.',
    cost: 120,
    singleUse: false,
    rewardBgFrom: '#2A1A0A', rewardBgTo: '#1A0E00',
    rewardBgLightFrom: '#F4EAD4', rewardBgLightTo: '#E8DAC0',
    impactNote: '🔁 Extends product life and reduces waste',
  },
  {
    id: 'seed_kit',
    icon: '🌱',
    title: 'Herb Seed Starter Kit',
    org: 'Urban Growing Co.',
    tag: 'Gardening',
    desc: 'A kit with 5 herb seed packets, biodegradable pots, and organic soil — start your own kitchen herb garden and reduce packaging waste.',
    cost: 80,
    singleUse: false,
    rewardBgFrom: '#1A2A14', rewardBgTo: '#0D1A08',
    rewardBgLightFrom: '#DAF0D4', rewardBgLightTo: '#C6E4BF',
    impactNote: '🌿 Grows food at home, zero food miles',
  },
  {
    id: 'bus_pass',
    icon: '🚌',
    title: 'Free 1-Day Bus Pass',
    org: 'City Transit Authority',
    tag: 'Transport',
    desc: 'A free one-day unlimited bus pass for the city network — reduce your carbon footprint while getting around town.',
    cost: 130,
    singleUse: false,
    rewardBgFrom: '#1A1E30', rewardBgTo: '#0D1220',
    rewardBgLightFrom: '#D4D8F0', rewardBgLightTo: '#C0C6E4',
    impactNote: '🚌 Saves ~3 kg CO₂ vs driving',
  },
  // ── NEW REWARDS ──
  {
    id: 'solar_charger',
    icon: '☀️',
    title: 'Solar Phone Charger (1 day)',
    org: 'SolarShare Community Hub',
    tag: 'Energy',
    desc: 'Borrow a portable solar-powered charger for a full day — charge your phone anywhere using clean energy. Collection from any SolarShare kiosk.',
    cost: 60,
    singleUse: false,
    rewardBgFrom: '#2A2010', rewardBgTo: '#1A140A',
    rewardBgLightFrom: '#FFF0C8', rewardBgLightTo: '#FFE0A0',
    impactNote: '☀️ Zero-carbon phone charging',
  },
  {
    id: 'bicycle_hire',
    icon: '🚲',
    title: 'Free 2-Hour Bicycle Hire',
    org: 'GreenWheel Bike Share',
    tag: 'Transport',
    desc: 'Two hours of free electric or regular bike hire from any GreenWheel docking station — the most sustainable way to get around the city.',
    cost: 90,
    singleUse: false,
    rewardBgFrom: '#10201A', rewardBgTo: '#0A1410',
    rewardBgLightFrom: '#C8F0D8', rewardBgLightTo: '#A8E0C0',
    impactNote: '🚲 Zero emissions transport',
  },
  {
    id: 'upcycle_workshop',
    icon: '🎨',
    title: 'Upcycling Workshop Ticket',
    org: 'CreativeReuse Studio',
    tag: 'Skill',
    desc: 'A free ticket to a 2-hour upcycling workshop where you turn old items into art, furniture, or fashion. Materials included. Maximum 1 guest.',
    cost: 160,
    singleUse: false,
    rewardBgFrom: '#20101E', rewardBgTo: '#140A14',
    rewardBgLightFrom: '#F0D8F0', rewardBgLightTo: '#E0C0E8',
    impactNote: '🎨 Gives waste materials a creative second life',
  },
  {
    id: 'zero_waste_grocery',
    icon: '🛍️',
    title: '15% Off Zero-Waste Grocery',
    org: 'BulkBuy Refill Store',
    tag: 'Discount',
    desc: '15% off your total purchase at any BulkBuy Refill Store — shop without packaging for pasta, grains, spices, oils, and household cleaners.',
    cost: 110,
    singleUse: false,
    rewardBgFrom: '#102018', rewardBgTo: '#0A1410',
    rewardBgLightFrom: '#C8F0E0', rewardBgLightTo: '#A8E8CC',
    impactNote: '🛍️ Eliminates single-use food packaging',
  },
  {
    id: 'water_filter',
    icon: '💧',
    title: 'Reusable Water Filter Jug',
    org: 'PureFlow × EcoSort',
    tag: 'Impact',
    desc: 'Claim a free reusable water filter jug — eliminates the need for plastic water bottles entirely. Each jug filters up to 150 litres before needing a replacement cartridge.',
    cost: 250,
    singleUse: true,
    rewardBgFrom: '#101820', rewardBgTo: '#0A1018',
    rewardBgLightFrom: '#C8E8F8', rewardBgLightTo: '#A8D8F0',
    impactNote: '💧 Replaces ~300 plastic bottles per year',
  },
  {
    id: 'terracycle_drop',
    icon: '♻️',
    title: 'TerraCycle Collection Box',
    org: 'TerraCycle Partner',
    tag: 'Recycling',
    desc: 'Receive a free postage-paid TerraCycle collection box for hard-to-recycle items: crisp packets, coffee pods, toothbrushes, makeup packaging, and more.',
    cost: 140,
    singleUse: false,
    rewardBgFrom: '#0D2018', rewardBgTo: '#081410',
    rewardBgLightFrom: '#C8F0D8', rewardBgLightTo: '#B0E8C8',
    impactNote: '♻️ Recycles items most councils cannot handle',
  },
  {
    id: 'fruit_tree_sapling',
    icon: '🍎',
    title: 'Fruit Tree Sapling',
    org: 'Community Orchard Project',
    tag: 'Impact',
    desc: 'Receive a young fruit tree sapling (apple, pear, or cherry — your choice) to plant in your garden, balcony, or a local community space. Includes planting guide.',
    cost: 200,
    singleUse: false,
    rewardBgFrom: '#1A2210', rewardBgTo: '#101608',
    rewardBgLightFrom: '#D8F0C0', rewardBgLightTo: '#C0E8A8',
    impactNote: '🍎 Produces fruit for years + absorbs CO₂',
  },
  {
    id: 'secondhand_voucher',
    icon: '👗',
    title: '£10 / ₹200 Secondhand Voucher',
    org: 'ThriftNow Partner Stores',
    tag: 'Fashion',
    desc: 'A voucher for secondhand and vintage clothing at any ThriftNow partner store. Give pre-loved clothes a new home and reduce fast fashion waste.',
    cost: 120,
    singleUse: false,
    rewardBgFrom: '#201018', rewardBgTo: '#140A10',
    rewardBgLightFrom: '#F8D8F0', rewardBgLightTo: '#F0C0E8',
    impactNote: '👗 The fashion industry creates 92M tonnes of waste/year',
  },
  {
    id: 'rainwater_kit',
    icon: '🌧️',
    title: 'Rainwater Harvesting Starter Kit',
    org: 'WaterWise Community',
    tag: 'Garden',
    desc: 'A starter kit with a small rain barrel connector, overflow diverter, and tap — fits standard downpipes. Collect rainwater free for garden irrigation.',
    cost: 180,
    singleUse: true,
    rewardBgFrom: '#101828', rewardBgTo: '#0A1018',
    rewardBgLightFrom: '#C8D8F8', rewardBgLightTo: '#B0C8F0',
    impactNote: '🌧️ Save up to 5,000 litres of tap water per year',
  },
  {
    id: 'eco_cooking_class',
    icon: '🍳',
    title: 'Zero-Waste Cooking Masterclass',
    org: 'EcoChef Academy',
    tag: 'Skill',
    desc: 'A free online or in-person session teaching zero-waste cooking techniques: using vegetable scraps, reducing food waste, and making meals from leftovers.',
    cost: 75,
    singleUse: false,
    rewardBgFrom: '#201810', rewardBgTo: '#14100A',
    rewardBgLightFrom: '#F8ECC8', rewardBgLightTo: '#F0D8A8',
    impactNote: '🍳 UK households waste £730 of food per year on average',
  },
];


/**
 * Render the rewards marketplace grid.
 * @param {number} currentCredits
 * @param {Array} redemptionHistory
 */
function renderRewardsGrid(currentCredits, redemptionHistory) {
  const grid = document.getElementById('rewards-grid');
  if (!grid) return;
  grid.innerHTML = '';

  for (const reward of REWARDS_CATALOGUE) {
    const canAfford = currentCredits >= reward.cost;
    const card = document.createElement('div');
    card.className = 'reward-card';
    card.innerHTML = `
      <div class="reward-card-header"
           style="--reward-bg-from:${reward.rewardBgFrom};--reward-bg-to:${reward.rewardBgTo};
                  --reward-bg-light-from:${reward.rewardBgLightFrom};--reward-bg-light-to:${reward.rewardBgLightTo}">
        <span class="reward-card-icon">${reward.icon}</span>
        <div class="reward-card-title-wrap">
          <div class="reward-card-title">${reward.title}</div>
          <div class="reward-card-org">${reward.org}</div>
        </div>
        <span class="reward-card-tag">${reward.tag}</span>
      </div>
      <div class="reward-card-body">
        <p class="reward-card-desc">${reward.desc}</p>
        <p style="font-size:0.78rem;color:var(--accent-green)">${reward.impactNote}</p>
        <div class="reward-card-footer">
          <div class="reward-cost">
            <span class="reward-cost-icon">🪙</span>
            <div>
              <div>${reward.cost}</div>
              <div class="reward-cost-label">credits</div>
            </div>
          </div>
          <button
            class="reward-redeem-btn ${canAfford ? '' : 'insufficient'}"
            id="redeem-${reward.id}"
            data-reward-id="${reward.id}"
            ${canAfford ? '' : 'disabled'}
            aria-label="Redeem ${reward.title} for ${reward.cost} Eco Credits"
          >
            ${canAfford ? 'Redeem' : `Need ${reward.cost - currentCredits} more`}
          </button>
        </div>
      </div>
    `;

    // Attach click handler
    const btn = card.querySelector('.reward-redeem-btn');
    if (btn && canAfford) {
      btn.addEventListener('click', () => handleRedeem(reward));
    }

    grid.appendChild(card);
  }
}

/**
 * Handle a redemption click.
 * @param {object} reward
 */
function handleRedeem(reward) {
  const result = EcoStorage.redeemReward(reward);
  if (!result.success) {
    showToast('error', '❌ ' + result.message);
    return;
  }

  // Show success
  showToast('reward', `🎉 Redeemed! Code: <strong>${result.code}</strong>`);

  // Refresh the entire rewards section with updated state
  const state = EcoStorage.getState();
  updateCreditsUI(state);
  renderRewardsGrid(state.ecoCredits, state.redemptionHistory);
  renderRedemptionHistory(state.redemptionHistory);

  // Copy code to clipboard
  navigator.clipboard?.writeText(result.code).catch(() => {});
}

/**
 * Update all credits-related UI elements.
 * @param {object} state
 */
function updateCreditsUI(state) {
  const credits = state.ecoCredits || 0;

  // Big number in rewards section
  const bigNum = document.getElementById('credits-big-num');
  if (bigNum) EcoImpact.animateCounter(bigNum, credits, 0);

  // Nav badge
  const navCount = document.getElementById('nav-credits-count');
  if (navCount) navCount.textContent = credits;

  // Progress bar — next reward is at the next cost threshold
  const costs = REWARDS_CATALOGUE.map(r => r.cost).sort((a, b) => a - b);
  const nextCost = costs.find(c => c > credits) || costs[costs.length - 1];
  const prevCost = costs.filter(c => c <= credits).pop() || 0;
  const progress = nextCost > prevCost
    ? ((credits - prevCost) / (nextCost - prevCost)) * 100
    : 100;

  const bar = document.getElementById('credits-progress-bar');
  if (bar) {
    setTimeout(() => { bar.style.width = Math.min(progress, 100) + '%'; }, 100);
  }

  const label = document.getElementById('credits-next-reward-label');
  if (label) {
    if (credits >= nextCost) {
      label.textContent = '🎉 You can redeem your next reward!';
    } else {
      label.textContent = `Next reward at ${nextCost} credits (${nextCost - credits} to go)`;
    }
  }
}

/**
 * Render redemption history list.
 * @param {Array} history
 */
function renderRedemptionHistory(history) {
  const container = document.getElementById('redemption-list');
  if (!container) return;

  if (!history || history.length === 0) {
    container.innerHTML = '<p class="redemption-empty">No redemptions yet. Earn credits and redeem for rewards!</p>';
    return;
  }

  container.innerHTML = '';
  for (const entry of history) {
    const timeAgo = formatTimeAgo(entry.timestamp);
    const item = document.createElement('div');
    item.className = 'redemption-item';
    item.innerHTML = `
      <span class="redemption-item-icon">${entry.rewardIcon}</span>
      <div class="redemption-item-info">
        <div class="redemption-item-name">${entry.rewardName}</div>
        <div class="redemption-item-time">${timeAgo}</div>
        <button class="redemption-code" onclick="navigator.clipboard?.writeText('${entry.code}');this.textContent='Copied!';setTimeout(()=>this.textContent='${entry.code}',1500)" title="Click to copy">
          ${entry.code}
        </button>
      </div>
      <span class="redemption-item-cost">-${entry.cost}🪙</span>
    `;
    container.appendChild(item);
  }
}

function formatTimeAgo(ts) {
  const s = Math.floor((Date.now() - ts) / 1000);
  if (s < 60)   return 'just now';
  if (s < 3600) return `${Math.floor(s / 60)}m ago`;
  if (s < 86400) return `${Math.floor(s / 3600)}h ago`;
  return `${Math.floor(s / 86400)}d ago`;
}

window.EcoRewards = {
  REWARDS_CATALOGUE,
  renderRewardsGrid,
  updateCreditsUI,
  renderRedemptionHistory,
};
