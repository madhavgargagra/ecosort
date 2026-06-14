/* ============================================================
   EcoSort — Scan Page Controller
   page-scan.js
   ============================================================ */

'use strict';

/* ── App state ── */
const ScanState = {
  currentTab: 'upload',
  pendingImageEl: null,
  pendingItemName: null,
  classifying: false,
};

/* ────────────────────────────────────────────────────────────
   TABS
   ──────────────────────────────────────────────────────────── */
function initTabs() {
  document.querySelectorAll('.scanner-tab').forEach(tab => {
    tab.addEventListener('click', () => switchTab(tab.id.replace('tab-', '')));
  });
}

function switchTab(tabId) {
  ScanState.currentTab = tabId;
  ScanState.pendingImageEl = null;
  ScanState.pendingItemName = null;

  document.querySelectorAll('.scanner-tab').forEach(t => {
    t.classList.toggle('active', t.id === `tab-${tabId}`);
    t.setAttribute('aria-selected', t.id === `tab-${tabId}`);
  });
  document.querySelectorAll('.scanner-panel').forEach(p => {
    p.classList.toggle('active', p.id === `panel-${tabId}`);
  });

  if (tabId !== 'camera') EcoCamera.stopCamera();
  hideClassifyBtn();
}

/* ────────────────────────────────────────────────────────────
   UPLOAD TAB
   ──────────────────────────────────────────────────────────── */
function initUploadTab() {
  const zone      = document.getElementById('upload-zone');
  const fileInput = document.getElementById('file-input');
  const uploadBtn = document.getElementById('upload-btn');
  const changeBtn = document.getElementById('change-img-btn');

  uploadBtn?.addEventListener('click', e => { e.stopPropagation(); fileInput?.click(); });
  zone?.addEventListener('click', () => fileInput?.click());
  zone?.addEventListener('keydown', e => {
    if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); fileInput?.click(); }
  });

  fileInput?.addEventListener('change', e => {
    const file = e.target.files?.[0];
    if (file) handleFileSelected(file);
  });

  changeBtn?.addEventListener('click', () => {
    ScanState.pendingImageEl = null;
    document.getElementById('uploaded-preview').hidden = true;
    document.getElementById('upload-zone').hidden = false;
    hideClassifyBtn();
    fileInput.value = '';
  });

  // Drag & drop
  zone?.addEventListener('dragover',  e => { e.preventDefault(); zone.classList.add('drag-over'); });
  zone?.addEventListener('dragleave', () => zone.classList.remove('drag-over'));
  zone?.addEventListener('drop', e => {
    e.preventDefault();
    zone.classList.remove('drag-over');
    const file = e.dataTransfer.files?.[0];
    if (file && file.type.startsWith('image/')) handleFileSelected(file);
  });

  // Ctrl+V paste from clipboard
  document.addEventListener('paste', e => {
    // Only trigger on upload tab
    if (ScanState.currentTab !== 'upload') return;
    const items = e.clipboardData?.items;
    if (!items) return;
    for (const item of items) {
      if (item.type.startsWith('image/')) {
        const file = item.getAsFile();
        if (file) {
          handleFileSelected(file);
          showToast('success', '📋 Image pasted! Click Analyze to classify.');
        }
        break;
      }
    }
  });
}

async function handleFileSelected(file) {
  if (!file.type.startsWith('image/')) {
    showToast('error', 'Please select an image file (PNG, JPG, WEBP).');
    return;
  }
  const img = await EcoClassifier.fileToImageElement(file);
  ScanState.pendingImageEl = img;

  const previewImg = document.getElementById('preview-img');
  if (previewImg) previewImg.src = img.src;
  document.getElementById('uploaded-preview').hidden = false;
  document.getElementById('upload-zone').hidden = true;
  showClassifyBtn();
}

/* ────────────────────────────────────────────────────────────
   CAMERA TAB
   ──────────────────────────────────────────────────────────── */
function initCameraTab() {
  document.getElementById('start-camera-btn')?.addEventListener('click', () => EcoCamera.startCamera());
  document.getElementById('stop-camera-btn')?.addEventListener('click',  () => { EcoCamera.stopCamera(); hideClassifyBtn(); });
  document.getElementById('capture-btn')?.addEventListener('click', () => {
    const img = EcoCamera.captureFrameAsImage();
    if (img) {
      ScanState.pendingImageEl = img;
      showClassifyBtn();
    }
  });
}

/* ────────────────────────────────────────────────────────────
   SEARCH TAB
   ──────────────────────────────────────────────────────────── */
function initSearchTab() {
  const input       = document.getElementById('search-input');
  const searchBtn   = document.getElementById('search-btn');
  const suggestions = document.getElementById('search-suggestions');

  input?.addEventListener('input', () => {
    const q = input.value.trim();
    if (!q) { suggestions.hidden = true; return; }
    renderSuggestions(getSearchSuggestions(q, 6), suggestions, input);
  });
  input?.addEventListener('keydown', e => {
    if (e.key === 'Enter')  performSearch(input.value.trim());
    if (e.key === 'Escape') suggestions.hidden = true;
  });
  searchBtn?.addEventListener('click', () => performSearch(input?.value?.trim() || ''));

  document.querySelectorAll('.popular-chip').forEach(chip => {
    chip.addEventListener('click', () => {
      const item = chip.dataset.item;
      if (input) input.value = item;
      performSearch(item);
    });
  });

  document.addEventListener('click', e => {
    if (!e.target.closest('.search-container')) suggestions.hidden = true;
  });
}

function renderSuggestions(items, container, input) {
  if (!container) return;
  if (!items.length) { container.hidden = true; return; }
  container.innerHTML = '';
  container.hidden = false;
  for (const item of items) {
    const cat = WASTE_CATEGORIES[item.category];
    const li = document.createElement('li');
    li.setAttribute('role', 'option');
    li.innerHTML = `
      <span class="suggestion-category-dot" style="background:${cat.color}"></span>
      <span>${item.name}</span>
      <span style="margin-left:auto;font-size:0.75rem;color:var(--text-muted)">${cat.label}</span>
    `;
    li.addEventListener('click', () => {
      input.value = item.name;
      container.hidden = true;
      selectSearchItem(item);
    });
    container.appendChild(li);
  }
}

function performSearch(query) {
  document.getElementById('search-suggestions').hidden = true;
  if (!query) { showToast('info', 'Please type an item to search.'); return; }
  const item = findWasteItem(query);
  if (item) selectSearchItem(item);
  else showToast('error', `No results for "${query}". Try different terms.`);
}

function selectSearchItem(item) {
  ScanState.pendingItemName = item.name;
  ScanState.pendingImageEl  = null;
  showToast('info', `Found: ${item.name} — click Analyze to see results.`);
  showClassifyBtn();
}

/* ────────────────────────────────────────────────────────────
   CLASSIFY
   ──────────────────────────────────────────────────────────── */
function showClassifyBtn() { document.getElementById('classify-action').hidden = false; }
function hideClassifyBtn() { document.getElementById('classify-action').hidden = true; }

function initClassifyButton() {
  document.getElementById('classify-btn')?.addEventListener('click', handleClassify);
}

async function handleClassify() {
  if (ScanState.classifying) return;
  ScanState.classifying = true;

  document.getElementById('classify-action').hidden = true;
  document.getElementById('analyzing-state').hidden = false;
  const subEl = document.getElementById('analyzing-sub');

  try {
    let wasteItem = null;
    let confidence = 1.0;
    let method = 'search';
    let geminiItemName = null;

    if (ScanState.pendingItemName) {
      // ── Text search path (unchanged)
      wasteItem = findWasteItem(ScanState.pendingItemName);
      if (subEl) subEl.textContent = 'Looking up item…';
      await EcoUtils.sleep(500);

    } else if (ScanState.pendingImageEl) {
      // ── Image path: hybrid classifier (Gemini → MobileNet)
      method = 'ml';
      const result = await EcoClassifier.classifyImage(
        ScanState.pendingImageEl,
        msg => { if (subEl) subEl.textContent = msg; }
      );

      if (result.wasteItem) {
        wasteItem    = result.wasteItem;
        confidence   = result.confidence;
        geminiItemName = result.geminiItemName || null;
      } else if (result.source === 'gemini') {
        // Gemini said it's not a recognisable waste item
        if (subEl) subEl.textContent = '🤔 Gemini: not a waste item';
        await EcoUtils.sleep(800);
        wasteItem  = await promptManualCategory('Not identified by AI');
        confidence = 0.6;
      } else {
        // MobileNet low confidence
        if (subEl) subEl.textContent = `Low confidence: "${result.topClass}"`;
        await EcoUtils.sleep(800);
        wasteItem  = await promptManualCategory(result.topClass);
        confidence = 0.55;
      }
    }

    if (!wasteItem) {
      showToast('error', 'Could not identify item. Try the search tab instead.');
      document.getElementById('analyzing-state').hidden = true;
      showClassifyBtn();
      ScanState.classifying = false;
      return;
    }

    await EcoUtils.sleep(300);
    document.getElementById('analyzing-state').hidden = true;
    showResults(wasteItem, confidence, method, geminiItemName, result);

  } catch (err) {
    console.error('EcoSort: Classification failed', err);
    showToast('error', 'AI error. Try the search tab for manual lookup.');
    document.getElementById('analyzing-state').hidden = true;
    showClassifyBtn();
  }

  ScanState.classifying = false;
}

/* ────────────────────────────────────────────────────────────
   MANUAL CATEGORY PICKER (low-confidence fallback)
   ──────────────────────────────────────────────────────────── */
function promptManualCategory(detectedClass) {
  return new Promise(resolve => {
    showToast('info', `Detected: "${detectedClass}". Please confirm category below.`);

    const overlay = document.createElement('div');
    overlay.style.cssText = `position:fixed;inset:0;z-index:250;background:rgba(0,0,0,0.7);
      display:flex;align-items:center;justify-content:center;padding:20px;backdrop-filter:blur(8px);`;

    const card = document.createElement('div');
    card.style.cssText = `background:var(--bg-card);border:1px solid var(--border-color);
      border-radius:24px;padding:32px;max-width:480px;width:100%;box-shadow:var(--shadow-lg);`;
    card.innerHTML = `
      <h3 style="font-family:var(--font-display);font-size:1.2rem;font-weight:700;margin-bottom:8px">
        AI detected: <em style="color:var(--accent)">"${detectedClass}"</em>
      </h3>
      <p style="color:var(--text-secondary);font-size:0.9rem;margin-bottom:20px">
        Select the correct category or type the item name:
      </p>
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-bottom:16px" id="cat-picker-grid"></div>
      <div style="display:flex;gap:8px">
        <input id="manual-item-input" placeholder="Or type item name…"
          style="flex:1;background:var(--bg-input);border:1.5px solid var(--border-color);
          border-radius:999px;padding:10px 16px;color:var(--text-primary);
          font-family:var(--font-body);font-size:0.9rem;outline:none;" />
        <button id="manual-search-btn"
          style="background:linear-gradient(135deg,var(--accent),var(--accent-green));
          color:white;border:none;border-radius:999px;padding:10px 20px;
          font-family:var(--font-display);font-weight:700;cursor:pointer;">Find</button>
      </div>`;

    const grid = card.querySelector('#cat-picker-grid');
    for (const [catId, cat] of Object.entries(WASTE_CATEGORIES)) {
      const btn = document.createElement('button');
      btn.style.cssText = `display:flex;align-items:center;gap:8px;padding:10px 12px;
        background:var(--bg-base);border:1px solid var(--border-color);border-radius:12px;
        cursor:pointer;color:var(--text-secondary);font-family:var(--font-display);
        font-size:0.85rem;font-weight:600;transition:all 0.15s;`;
      btn.innerHTML = `<span>${cat.icon}</span><span>${cat.label}</span>`;
      btn.addEventListener('mouseover', () => btn.style.borderColor = cat.color);
      btn.addEventListener('mouseout',  () => btn.style.borderColor = 'var(--border-color)');
      btn.addEventListener('click', () => {
        const item = WASTE_ITEMS.find(i => i.category === catId);
        document.body.removeChild(overlay);
        resolve(item || null);
      });
      grid.appendChild(btn);
    }

    card.querySelector('#manual-search-btn')?.addEventListener('click', () => {
      const q = card.querySelector('#manual-item-input')?.value.trim();
      if (q) {
        const item = findWasteItem(q);
        if (item) { document.body.removeChild(overlay); resolve(item); }
        else showToast('error', `"${q}" not found.`);
      }
    });

    overlay.appendChild(card);
    document.body.appendChild(overlay);
  });
}

/* ────────────────────────────────────────────────────────────
   SHOW RESULTS
   ──────────────────────────────────────────────────────────── */
function showResults(item, confidence, method, geminiItemName = null, result = null) {
  const cat = WASTE_CATEGORIES[item.category];
  const creditsBase  = 10;
  const creditsBonus = confidence >= 0.7 ? 5 : 0;
  const creditsTotal = creditsBase + creditsBonus;

  const state      = EcoStorage.recordScan(item, creditsTotal);
  const newBadges  = EcoStorage.checkBadges(state);

  // Populate card
  const card = document.getElementById('result-card');
  if (card) card.setAttribute('data-category', item.category);

  setText('result-icon',         cat.icon);
  setText('result-badge',        cat.label);
  // If Gemini identified a more specific name, show it alongside the DB name
  const displayName = geminiItemName && geminiItemName !== item.name
    ? `${geminiItemName} (${item.name})`
    : item.name;
  setText('result-item-name', displayName);
  setText('bin-name',            cat.bin);

  const binDot = document.getElementById('bin-dot');
  if (binDot) binDot.style.background = cat.color;

  // Confidence bar
  const pct = Math.round(confidence * 100);
  const confWrap = document.getElementById('result-confidence-wrap');
  if (method === 'search') {
    if (confWrap) confWrap.style.display = 'none';
  } else {
    if (confWrap) confWrap.style.display = 'flex';
    setText('confidence-pct', pct + '%');
    setTimeout(() => {
      const bar = document.getElementById('confidence-bar');
      if (bar) bar.style.width = pct + '%';
    }, 100);
  }

  setText('result-tips-text',     item.tips);
  setText('result-mistakes-text', item.commonMistakes);
  setText('result-fact-text',     item.funFact);
  setText('credits-earned-amount', `+${creditsTotal}`);
  setText('credits-total-display', state.ecoCredits);

  // Show Gemini reasoning if available
  showReasoning(result?.reasoning || null);

  // Reset feedback UI
  initFeedback(displayName, item);

  // Timeline
  EcoTimeline.renderDecompositionTimeline(
    item,
    document.getElementById('timeline-visual'),
    document.getElementById('timeline-item-label')
  );

  // Item impact
  EcoImpact.renderItemImpactPreview(item, document.getElementById('impact-preview-grid'));

  // Update nav credits
  EcoNav.refreshNavCredits();

  // Show results section
  const resultsSection = document.getElementById('results-section');
  if (resultsSection) {
    resultsSection.hidden = false;
    resultsSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  showToast('success', `${cat.icon} ${item.name} → ${cat.bin} (+${creditsTotal} credits!)`);

  // Badge overlays
  if (newBadges.length > 0) {
    let delay = 800;
    for (const badge of newBadges) {
      setTimeout(() => showBadgeOverlay(badge), delay);
      delay += 500;
    }
  }
}

function setText(id, val) {
  const el = document.getElementById(id);
  if (el) el.textContent = val;
}

/* ────────────────────────────────────────────────────────────
   AI REASONING DISPLAY
   ──────────────────────────────────────────────────────────── */
function showReasoning(reasoning) {
  const wrap = document.getElementById('result-reasoning');
  const text = document.getElementById('reasoning-text');
  if (!wrap || !text) return;
  if (reasoning) {
    text.textContent = reasoning;
    wrap.hidden = false;
  } else {
    wrap.hidden = true;
  }
}

/* ────────────────────────────────────────────────────────────
   USER FEEDBACK LOOP
   ──────────────────────────────────────────────────────────── */
function initFeedback(detectedName, item) {
  const feedbackEl    = document.getElementById('result-feedback');
  const correctionEl  = document.getElementById('feedback-correction');
  const yesBtn        = document.getElementById('feedback-yes');
  const noBtn         = document.getElementById('feedback-no');
  const corrInput     = document.getElementById('correction-input');
  const corrSubmit    = document.getElementById('correction-submit');
  const corrSuggest   = document.getElementById('correction-suggestions');

  // Reset state
  if (feedbackEl)   { feedbackEl.hidden = false; feedbackEl.dataset.done = ''; }
  if (correctionEl)  correctionEl.hidden = true;
  if (corrInput)     corrInput.value = '';
  if (corrSuggest)   corrSuggest.hidden = true;

  yesBtn?.addEventListener('click', () => {
    if (feedbackEl.dataset.done) return;
    feedbackEl.dataset.done = '1';
    feedbackEl.innerHTML = '<p class="feedback-thanks">🎉 Thanks! This helps improve future scans.</p>';
  }, { once: true });

  noBtn?.addEventListener('click', () => {
    if (feedbackEl.dataset.done) return;
    if (correctionEl) correctionEl.hidden = false;
    feedbackEl.querySelector('.feedback-buttons').hidden = true;
  }, { once: true });

  // Autocomplete suggestions in correction input
  corrInput?.addEventListener('input', () => {
    const q = corrInput.value.trim();
    if (!q || q.length < 2) { corrSuggest.hidden = true; return; }
    const suggestions = getSearchSuggestions(q, 5);
    if (!suggestions.length) { corrSuggest.hidden = true; return; }
    corrSuggest.innerHTML = '';
    corrSuggest.hidden = false;
    for (const s of suggestions) {
      const li = document.createElement('li');
      li.textContent = `${WASTE_CATEGORIES[s.category].icon} ${s.name}`;
      li.style.cssText = 'padding:8px 14px;cursor:pointer;list-style:none;font-size:0.9rem;';
      li.addEventListener('mousedown', () => {
        corrInput.value = s.name;
        corrSuggest.hidden = true;
        saveCorrection(detectedName, s.name, s.category, feedbackEl, correctionEl);
      });
      corrSuggest.appendChild(li);
    }
  });

  corrSubmit?.addEventListener('click', () => {
    const q = corrInput?.value?.trim();
    if (!q) return;
    const found = findWasteItem(q);
    if (found) {
      saveCorrection(detectedName, found.name, found.category, feedbackEl, correctionEl);
    } else {
      showToast('error', `"${q}" not found in database. Try a different name.`);
    }
  });
}

function saveCorrection(detectedName, correctName, correctCategory, feedbackEl, correctionEl) {
  EcoClassifier.saveFeedbackCorrection(detectedName, correctName, correctCategory);
  if (correctionEl) correctionEl.hidden = true;
  if (feedbackEl) {
    feedbackEl.dataset.done = '1';
    feedbackEl.innerHTML = `<p class="feedback-thanks">💾 Correction saved! AI will remember "${correctName}" next time.</p>`;
  }
  showToast('success', `💾 Correction saved — AI will remember this.`);
}

/* ────────────────────────────────────────────────────────────
   VOICE SEARCH  (Web Speech API)
   ──────────────────────────────────────────────────────────── */
function initVoiceSearch() {
  const micBtn = document.getElementById('voice-search-btn');
  if (!micBtn) return;

  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

  if (!SpeechRecognition) {
    micBtn.style.display = 'none'; // Browser doesn't support it — hide cleanly
    return;
  }

  let isListening = false;
  const recognition = new SpeechRecognition();
  recognition.lang = 'en-US';
  recognition.continuous = false;
  recognition.interimResults = false;
  recognition.maxAlternatives = 3;

  function setListening(state) {
    isListening = state;
    micBtn.classList.toggle('listening', state);
    micBtn.textContent = state ? '🔴' : '🎤';
    micBtn.title = state ? 'Listening… click to cancel' : 'Voice search — click and speak';
  }

  micBtn.addEventListener('click', () => {
    if (isListening) {
      recognition.stop();
      setListening(false);
      return;
    }
    setListening(true);
    showToast('info', '🎤 Listening… say an item name (e.g. "plastic bottle")');
    try {
      recognition.start();
    } catch (e) {
      // Recognition might be already started in some browsers
      setListening(false);
      showToast('error', '🎤 Could not start mic. Reload and try again.');
    }
  });

  recognition.onresult = event => {
    setListening(false);
    // Try each alternative until we find a match
    let matched = null;
    for (let i = 0; i < event.results[0].length; i++) {
      const t = event.results[0][i].transcript.trim();
      if (t) { matched = t; break; }
    }
    if (!matched) return;

    showToast('success', `🎤 Heard: "${matched}"`);
    const input = document.getElementById('search-input');
    if (input) {
      input.value = matched;
      input.dispatchEvent(new Event('input')); // trigger autocomplete dropdown
    }
    performSearch(matched);
  };

  recognition.onerror = event => {
    setListening(false);
    const messages = {
      'not-allowed':       '🎤 Microphone permission denied. Allow mic access in browser settings.',
      'no-speech':         '🎤 No speech detected. Please try again.',
      'audio-capture':     '🎤 No microphone found. Please connect one and retry.',
      'network':           '🎤 Network error. Check your connection.',
      'aborted':           null, // user cancelled — no toast needed
    };
    const msg = messages[event.error] ?? `🎤 Voice error: ${event.error}`;
    if (msg) showToast('error', msg);
  };

  recognition.onend = () => setListening(false);
}

/* ────────────────────────────────────────────────────────────
   BADGE OVERLAY
   ──────────────────────────────────────────────────────────── */
function showBadgeOverlay(badge) {
  const overlay = document.getElementById('badge-overlay');
  if (!overlay) return;
  setText('badge-overlay-icon', badge.emoji);
  setText('badge-overlay-name', badge.name);
  setText('badge-overlay-desc', badge.desc);
  overlay.hidden = false;
}

function initBadgeOverlay() {
  document.getElementById('badge-overlay-close')?.addEventListener('click', () => {
    document.getElementById('badge-overlay').hidden = true;
  });
}

/* ────────────────────────────────────────────────────────────
   SCAN ANOTHER BUTTON
   ──────────────────────────────────────────────────────────── */
function initResultActions() {
  document.getElementById('scan-another-btn')?.addEventListener('click', () => {
    document.getElementById('results-section').hidden = true;
    document.getElementById('uploaded-preview').hidden = true;
    document.getElementById('upload-zone').hidden = false;
    const fileInput = document.getElementById('file-input');
    if (fileInput) fileInput.value = '';
    ScanState.pendingImageEl  = null;
    ScanState.pendingItemName = null;
    hideClassifyBtn();
    switchTab('upload');
    document.getElementById('scanner-section')?.scrollIntoView({ behavior: 'smooth' });
  });
}

/* ────────────────────────────────────────────────────────────
   INIT
   ──────────────────────────────────────────────────────────── */
document.addEventListener('DOMContentLoaded', () => {
  EcoUtils.initTheme();
  EcoNav.initNavbar();
  EcoUtils.registerServiceWorker();
  initTabs();
  initUploadTab();
  initCameraTab();
  initSearchTab();
  initVoiceSearch();
  initClassifyButton();
  initResultActions();
  initBadgeOverlay();
  console.log('🌿 EcoSort Scan page ready');
});
