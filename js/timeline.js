/* ============================================================
   EcoSort — Decomposition Timeline Renderer
   timeline.js
   ============================================================ */

'use strict';

/* Timeline milestones: { label, time, years, emoji } */
const TIMELINE_MILESTONES = [
  { label: '2 wks',  example: 'Banana peel',  years: 0.04,   emoji: '🍌', position: 0    },
  { label: '1 mo',   example: 'Cardboard',    years: 0.08,   emoji: '📦', position: 8    },
  { label: '1 yr',   example: 'Wool sock',    years: 1,      emoji: '🧦', position: 16   },
  { label: '10 yrs', example: 'Tin can',      years: 10,     emoji: '🥫', position: 30   },
  { label: '80 yrs', example: 'Aluminium can', years: 80,    emoji: '🥤', position: 44   },
  { label: '200 yrs', example: 'Plastic bag', years: 200,    emoji: '🛍️', position: 58   },
  { label: '450 yrs', example: 'PET bottle',  years: 450,    emoji: '🍾', position: 70   },
  { label: '1M yrs', example: 'Glass/ceramic', years: 1000000, emoji: '🪟', position: 100 },
];

/**
 * Map decomposition years to a 0–100 position on logarithmic scale.
 * Uses log10 scale: 0.04 yrs → 0, 1M yrs → 100
 */
function yearsToPosition(years) {
  const MIN_LOG = Math.log10(0.04);   // ~-1.4
  const MAX_LOG = Math.log10(1000000); // 6
  const range = MAX_LOG - MIN_LOG;
  const log = Math.log10(Math.max(years, 0.01));
  return Math.min(Math.max(((log - MIN_LOG) / range) * 100, 0), 100);
}

/**
 * Get the colour at a given position along the green→red timeline gradient.
 * @param {number} pct - 0 to 1
 * @returns {string} CSS colour
 */
function positionToColor(pct) {
  // Green (short) → Amber (medium) → Red (long)
  if (pct <= 0.25) return `hsl(${150 - pct * 4 * 60}, 70%, 50%)`;  // green→yellow-green
  if (pct <= 0.5)  return `hsl(${90 - (pct - 0.25) * 4 * 60}, 70%, 50%)`; // yellow-green→orange
  return `hsl(${30 - (pct - 0.5) * 2 * 30}, 80%, 50%)`;  // orange→red
}

/**
 * Render the decomposition timeline for a given waste item.
 * @param {object} item - WASTE_ITEMS entry
 * @param {HTMLElement} visualContainer - #timeline-visual
 * @param {HTMLElement} labelContainer - #timeline-item-label
 */
function renderDecompositionTimeline(item, visualContainer, labelContainer) {
  if (!visualContainer) return;

  const years = item.decompositionYears || 1;
  const position = yearsToPosition(years);
  const color = positionToColor(position / 100);
  const isVeryLong = years >= 10000;

  // ── Build track
  const trackHTML = `<div class="timeline-track"></div>`;

  // ── Build milestone dots
  const milestonesHTML = `
    <div class="timeline-milestones">
      ${TIMELINE_MILESTONES.map((m, i) => `
        <div class="timeline-milestone" style="left:${m.position}%;position:absolute;transform:translateX(-50%)">
          <div class="milestone-label-above">
            <span class="milestone-time">${m.label}</span>
            <span class="milestone-example">${m.emoji} ${m.example}</span>
          </div>
          <div class="milestone-dot"></div>
        </div>
      `).join('')}
    </div>
  `;

  // ── Build the item pointer
  const pointerHTML = `
    <div class="timeline-pointer" id="timeline-pointer" style="left:0%;--pointer-color:${color}">
      <div class="pointer-dot"></div>
      <div class="pointer-label">
        <span>${item.decompositionTime}</span>
      </div>
    </div>
  `;

  visualContainer.innerHTML = `
    <div style="position:relative; width:100%; padding: 60px 0 50px;">
      ${trackHTML}
      ${milestonesHTML}
      ${pointerHTML}
    </div>
  `;

  // Animate pointer sliding to position
  const pointer = visualContainer.querySelector('#timeline-pointer');
  if (pointer) {
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        pointer.style.left = position + '%';
      });
    });
  }

  // ── Horror note for very long-lived items
  const horrorNote = isVeryLong
    ? `<div class="timeline-horror-note">😱 That's longer than recorded human civilization has existed — ${item.decompositionTime} in a landfill!</div>`
    : '';

  // ── Update the label below
  if (labelContainer) {
    const cat = WASTE_CATEGORIES[item.category];
    labelContainer.innerHTML = `
      <span class="timeline-item-emoji">${cat?.icon || '📦'}</span>
      <div class="timeline-item-text">
        <strong class="timeline-item-time">${item.decompositionTime}</strong> —
        a <strong>${item.name}</strong> takes this long to decompose in a landfill.
        ${item.canRecycle ? '♻️ Recycling it prevents this!' : `Place in the <strong>${cat?.bin}</strong>.`}
      </div>
    `;
    if (isVeryLong) {
      labelContainer.insertAdjacentHTML('afterend', horrorNote);
    }
  }
}

window.EcoTimeline = { renderDecompositionTimeline, yearsToPosition, positionToColor };
