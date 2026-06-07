/* ============================================================
   EcoSort — share.js
   Canvas-based Impact Card generator
   ============================================================ */

'use strict';

window.EcoShare = (() => {

  const W = 1200, H = 630;

  /* ── Helper: draw a rounded rectangle ── */
  function roundRect(ctx, x, y, w, h, r) {
    ctx.beginPath();
    ctx.moveTo(x + r, y);
    ctx.lineTo(x + w - r, y);
    ctx.quadraticCurveTo(x + w, y, x + w, y + r);
    ctx.lineTo(x + w, y + h - r);
    ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
    ctx.lineTo(x + r, y + h);
    ctx.quadraticCurveTo(x, y + h, x, y + h - r);
    ctx.lineTo(x, y + r);
    ctx.quadraticCurveTo(x, y, x + r, y);
    ctx.closePath();
  }

  /* ── Helper: large number formatter ── */
  function fmt(n) {
    if (n >= 1000) return (n / 1000).toFixed(1) + 'k';
    return String(Math.round(n));
  }

  /* ── Draw the card ── */
  function drawCard(ctx, stats) {
    /* Background gradient */
    const bg = ctx.createLinearGradient(0, 0, W, H);
    bg.addColorStop(0, '#081510');
    bg.addColorStop(0.5, '#0D2218');
    bg.addColorStop(1, '#091A12');
    ctx.fillStyle = bg;
    ctx.fillRect(0, 0, W, H);

    /* Decorative blobs */
    const blob1 = ctx.createRadialGradient(120, 120, 0, 120, 120, 200);
    blob1.addColorStop(0, 'rgba(82,183,136,0.18)');
    blob1.addColorStop(1, 'rgba(82,183,136,0)');
    ctx.fillStyle = blob1;
    ctx.beginPath(); ctx.arc(120, 120, 200, 0, Math.PI * 2); ctx.fill();

    const blob2 = ctx.createRadialGradient(1100, 550, 0, 1100, 550, 250);
    blob2.addColorStop(0, 'rgba(0,180,216,0.15)');
    blob2.addColorStop(1, 'rgba(0,180,216,0)');
    ctx.fillStyle = blob2;
    ctx.beginPath(); ctx.arc(1100, 550, 250, 0, Math.PI * 2); ctx.fill();

    /* Top accent line */
    const lineGrad = ctx.createLinearGradient(60, 0, W - 60, 0);
    lineGrad.addColorStop(0, 'rgba(82,183,136,0)');
    lineGrad.addColorStop(0.3, '#52B788');
    lineGrad.addColorStop(0.7, '#00B4D8');
    lineGrad.addColorStop(1, 'rgba(0,180,216,0)');
    ctx.strokeStyle = lineGrad;
    ctx.lineWidth = 2;
    ctx.beginPath(); ctx.moveTo(60, 30); ctx.lineTo(W - 60, 30); ctx.stroke();

    /* Brand */
    ctx.font = 'bold 32px system-ui, -apple-system, sans-serif';
    ctx.fillStyle = '#52B788';
    ctx.fillText('🌿 EcoSort', 60, 90);

    /* Tagline */
    ctx.font = '18px system-ui, -apple-system, sans-serif';
    ctx.fillStyle = 'rgba(232,245,240,0.55)';
    ctx.fillText('AI Waste Classification · HackJKLU', 60, 120);

    /* Main title */
    ctx.font = 'bold 58px system-ui, -apple-system, sans-serif';
    ctx.fillStyle = '#E8F5F0';
    ctx.fillText('My Environmental Impact', 60, 210);

    /* Subtitle */
    const level = stats.level || 'Eco Beginner';
    ctx.font = '24px system-ui, -apple-system, sans-serif';
    ctx.fillStyle = '#52B788';
    ctx.fillText(`🏅 ${level}  ·  ${stats.scans || 0} items sorted`, 60, 255);

    /* ── Stat Cards ── */
    const cards = [
      { emoji: '🌍', value: (stats.co2 || 0).toFixed(1) + ' kg', label: 'CO₂ Saved' },
      { emoji: '💧', value: fmt(stats.water || 0) + ' L', label: 'Water Saved' },
      { emoji: '⚡', value: fmt(stats.energy || 0) + ' Wh', label: 'Energy Saved' },
      { emoji: '🪙', value: fmt(stats.credits || 0), label: 'Eco Credits' },
    ];

    const cardW = 240, cardH = 160, cardGap = 24;
    const totalW = cards.length * cardW + (cards.length - 1) * cardGap;
    const startX = (W - totalW) / 2;
    const startY = 310;

    cards.forEach((card, i) => {
      const x = startX + i * (cardW + cardGap);
      const y = startY;

      /* Card background */
      ctx.save();
      roundRect(ctx, x, y, cardW, cardH, 16);
      ctx.fillStyle = 'rgba(255,255,255,0.05)';
      ctx.fill();
      ctx.strokeStyle = 'rgba(82,183,136,0.25)';
      ctx.lineWidth = 1;
      ctx.stroke();
      ctx.restore();

      /* Emoji */
      ctx.font = '36px system-ui';
      ctx.fillText(card.emoji, x + 20, y + 50);

      /* Value */
      ctx.font = 'bold 36px system-ui, -apple-system, sans-serif';
      ctx.fillStyle = '#FFFFFF';
      ctx.fillText(card.value, x + 20, y + 100);

      /* Label */
      ctx.font = '16px system-ui, -apple-system, sans-serif';
      ctx.fillStyle = 'rgba(232,245,240,0.55)';
      ctx.fillText(card.label, x + 20, y + 130);
    });

    /* Bottom accent line */
    ctx.strokeStyle = lineGrad;
    ctx.lineWidth = 1;
    ctx.beginPath(); ctx.moveTo(60, H - 30); ctx.lineTo(W - 60, H - 30); ctx.stroke();

    /* Footer */
    ctx.font = '16px system-ui, -apple-system, sans-serif';
    ctx.fillStyle = 'rgba(232,245,240,0.4)';
    ctx.fillText('Sort smarter. Live greener. Earn rewards.', 60, H - 10);
    ctx.textAlign = 'right';
    ctx.fillText('ecosort.app  ·  Built for HackJKLU', W - 60, H - 10);
    ctx.textAlign = 'left';
  }

  /* ── Public API ── */
  function generateAndDownload() {
    const canvas = document.createElement('canvas');
    canvas.width = W;
    canvas.height = H;
    const ctx = canvas.getContext('2d');

    /* Load stats from localStorage */
    let appState = {};
    try {
      const raw = localStorage.getItem('ecosort_v1');
      if (raw) appState = JSON.parse(raw);
    } catch (_) {}

    const stats = {
      scans:   appState.scanHistory?.length || 0,
      co2:     appState.totalCo2Saved || 0,
      water:   appState.totalWaterSaved || 0,
      energy:  appState.totalEnergySaved || 0,
      credits: appState.ecoCredits || 0,
      level:   appState.level || 'Eco Beginner',
    };

    drawCard(ctx, stats);

    canvas.toBlob(blob => {
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'my-ecosort-impact.png';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      setTimeout(() => URL.revokeObjectURL(url), 2000);
    }, 'image/png', 0.95);
  }

  /* Copy to clipboard as PNG blob */
  async function copyToClipboard() {
    const canvas = document.createElement('canvas');
    canvas.width = W; canvas.height = H;
    const ctx = canvas.getContext('2d');
    let appState = {};
    try { const raw = localStorage.getItem('ecosort_v1'); if (raw) appState = JSON.parse(raw); } catch (_) {}
    drawCard(ctx, {
      scans:   appState.scanHistory?.length || 0,
      co2:     appState.totalCo2Saved || 0,
      water:   appState.totalWaterSaved || 0,
      energy:  appState.totalEnergySaved || 0,
      credits: appState.ecoCredits || 0,
      level:   appState.level || 'Eco Beginner',
    });
    return new Promise(resolve => {
      canvas.toBlob(async blob => {
        try {
          await navigator.clipboard.write([
            new ClipboardItem({ 'image/png': blob })
          ]);
          resolve(true);
        } catch (_) { resolve(false); }
      }, 'image/png');
    });
  }

  return { generateAndDownload, copyToClipboard };
})();
