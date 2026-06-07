/* ============================================================
   EcoSort — page-game.js
   Drag & Drop + Speed Quiz game controllers
   ============================================================ */

'use strict';

/* ────────────────────────────────────────────────────────────
   GAME ITEMS POOL  (drawn from waste-data.js WASTE_ITEMS)
   Only include items with a clear emoji + simple category
   ──────────────────────────────────────────────────────────── */
const CAT_EMOJI = {
  recyclable: '♻️', compostable: '🌱', landfill: '🗑️',
  hazardous: '⚠️', ewaste: '💻', textiles: '👕', bulky: '🏗️', medical: '💊'
};

const CAT_LABEL = {
  recyclable: 'Recyclable', compostable: 'Compostable', landfill: 'Landfill',
  hazardous: 'Hazardous', ewaste: 'E-Waste', textiles: 'Textiles',
  bulky: 'Bulky Waste', medical: 'Medical'
};

const CAT_BIN = {
  recyclable: 'Blue Bin', compostable: 'Green Bin', landfill: 'Black Bin',
  hazardous: 'Special Drop-off', ewaste: 'E-Waste Centre', textiles: 'Textile Bank',
  bulky: 'Council Collection', medical: 'Pharmacy Return'
};

/* 5 bins used in drag & drop (most recognisable) */
const DRAG_CATS = ['recyclable', 'compostable', 'landfill', 'hazardous', 'ewaste'];

/* Pull game-friendly items from the global WASTE_ITEMS array */
function getGameItems() {
  return (typeof WASTE_ITEMS !== 'undefined' ? WASTE_ITEMS : []).filter(
    i => DRAG_CATS.includes(i.category)
  ).map(i => ({
    ...i,
    emoji: (typeof WASTE_CATEGORIES !== 'undefined' && WASTE_CATEGORIES[i.category])
      ? WASTE_CATEGORIES[i.category].icon
      : CAT_EMOJI[i.category] || '♻️'
  }));
}

/* Shuffle helper */
function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

/* Pick unique random items */
function pickItems(n) {
  return shuffle(getGameItems()).slice(0, n);
}

/* ────────────────────────────────────────────────────────────
   SHARED GAME STATE
   ──────────────────────────────────────────────────────────── */
const GameState = {
  mode: null,          // 'drag' | 'quiz'
  score: 0,
  combo: 1,
  lives: 3,
  timer: 60,
  timerInterval: null,
  correct: 0,
  wrong: 0,
  creditsEarned: 0,
  highscores: { drag: 0, quiz: 0 },
};

/* ────────────────────────────────────────────────────────────
   SCREEN HELPERS
   ──────────────────────────────────────────────────────────── */
function showScreen(id) {
  ['mode-select', 'arena-drag', 'arena-quiz', 'game-over'].forEach(s => {
    const el = document.getElementById(s);
    if (!el) return;
    if (s === id) {
      el.style.display = '';
      el.hidden = false;
    } else {
      el.style.display = 'none';
      el.hidden = true;
    }
  });
}

function setText(id, val) {
  const el = document.getElementById(id);
  if (el) el.textContent = val;
}

/* ────────────────────────────────────────────────────────────
   FLOATING SCORE POPUP
   ──────────────────────────────────────────────────────────── */
function showScorePopup(text, x, y, isCorrect) {
  const el = document.createElement('div');
  el.className = `score-popup ${isCorrect ? 'correct' : 'wrong'}`;
  el.textContent = text;
  el.style.left = `${x}px`;
  el.style.top  = `${y}px`;
  document.body.appendChild(el);
  setTimeout(() => el.remove(), 1000);
}

/* ────────────────────────────────────────────────────────────
   HIGH SCORES (localStorage)
   ──────────────────────────────────────────────────────────── */
function loadHighscores() {
  try {
    const raw = localStorage.getItem('ecosort_game_hs');
    if (raw) Object.assign(GameState.highscores, JSON.parse(raw));
  } catch (_) {}
}

function saveHighscore(mode, score) {
  if (score > GameState.highscores[mode]) {
    GameState.highscores[mode] = score;
    try { localStorage.setItem('ecosort_game_hs', JSON.stringify(GameState.highscores)); }
    catch (_) {}
    return true; // new record
  }
  return false;
}

function renderHighscores() {
  const dragEl = document.getElementById('hs-drag');
  const quizEl = document.getElementById('hs-quiz');
  if (dragEl) dragEl.textContent = GameState.highscores.drag || '—';
  if (quizEl) quizEl.textContent = GameState.highscores.quiz || '—';
}

/* ────────────────────────────────────────────────────────────
   TIMER
   ──────────────────────────────────────────────────────────── */
function startTimer(seconds, onTick, onExpire) {
  clearInterval(GameState.timerInterval);
  GameState.timer = seconds;
  onTick(GameState.timer);
  GameState.timerInterval = setInterval(() => {
    GameState.timer--;
    onTick(GameState.timer);
    if (GameState.timer <= 0) {
      clearInterval(GameState.timerInterval);
      onExpire();
    }
  }, 1000);
}

function stopTimer() { clearInterval(GameState.timerInterval); }

/* ────────────────────────────────────────────────────────────
   GAME OVER SCREEN
   ──────────────────────────────────────────────────────────── */
function showGameOver(mode) {
  stopTimer();
  const isNewRecord = saveHighscore(mode, GameState.score);
  renderHighscores();

  // Award credits to main app
  const creditsEarned = GameState.creditsEarned;
  if (creditsEarned > 0) {
    try {
      const raw = localStorage.getItem('ecosort_v1');
      const state = raw ? JSON.parse(raw) : {};
      state.ecoCredits = (state.ecoCredits || 0) + creditsEarned;
      localStorage.setItem('ecosort_v1', JSON.stringify(state));
    } catch (_) {}
  }

  const accuracy = GameState.correct + GameState.wrong > 0
    ? Math.round(GameState.correct / (GameState.correct + GameState.wrong) * 100)
    : 0;

  const emoji = accuracy >= 80 ? '🎉' : accuracy >= 50 ? '😊' : '💪';
  setText('game-over-emoji', emoji);
  setText('game-over-title', isNewRecord ? '🏆 New High Score!' : 'Round Over!');
  setText('game-over-score', GameState.score);
  setText('game-over-credits-earned', `+${creditsEarned} Eco Credits Earned!`);

  const statsEl = document.getElementById('game-over-stats');
  if (statsEl) {
    statsEl.innerHTML = `
      <div class="go-stat">✅ Correct: <strong>${GameState.correct}</strong></div>
      <div class="go-stat">❌ Wrong: <strong>${GameState.wrong}</strong></div>
      <div class="go-stat">🎯 Accuracy: <strong>${accuracy}%</strong></div>
      ${GameState.combo > 1 ? `<div class="go-stat">🔥 Best Combo: <strong>×${GameState.combo}</strong></div>` : ''}
    `;
  }

  // New record badge
  const titleEl = document.getElementById('game-over-title');
  if (isNewRecord && titleEl && !titleEl.previousElementSibling?.classList.contains('new-highscore-badge')) {
    const badge = document.createElement('div');
    badge.className = 'new-highscore-badge';
    badge.textContent = '⭐ NEW HIGH SCORE!';
    titleEl.parentNode.insertBefore(badge, titleEl);
  }

  EcoNav.refreshNavCredits();
  showScreen('game-over');
}

/* ════════════════════════════════════════════════════════════
   DRAG & DROP MODE
   ════════════════════════════════════════════════════════════ */
const Drag = {
  items: [],
  fallingIntervals: [],
  spawnInterval: null,
  draggingEl: null,
  dragOffsetX: 0,
  dragOffsetY: 0,
  combo: 1,
  lives: 3,
  score: 0,

  start() {
    this.items   = shuffle(getGameItems());
    this.combo   = 1;
    this.lives   = 3;
    this.score   = 0;
    this.fallingIntervals = [];

    GameState.correct = 0;
    GameState.wrong   = 0;
    GameState.creditsEarned = 0;

    document.getElementById('fall-zone').innerHTML = '';
    this.updateHUD();

    showScreen('arena-drag');

    startTimer(60, (t) => {
      const el = document.getElementById('drag-timer');
      if (el) {
        el.textContent = t;
        el.classList.toggle('urgent', t <= 10);
      }
    }, () => this.endGame());

    this.scheduleSpawns();
  },

  scheduleSpawns() {
    let delay = 800;
    const spawnOne = () => {
      if (GameState.timer <= 0) return;
      const item = this.items[Math.floor(Math.random() * this.items.length)];
      this.spawnItem(item);
      delay = Math.max(1000, delay - 40); // gradually speed up
      this.spawnInterval = setTimeout(spawnOne, delay);
    };
    spawnOne();
  },

  spawnItem(item) {
    const zone = document.getElementById('fall-zone');
    if (!zone) return;

    const zoneW = zone.clientWidth;
    const el = document.createElement('div');
    el.className = 'falling-item';
    el.dataset.cat = item.category;
    el.dataset.name = item.name;
    el.innerHTML = `
      <span class="item-emoji">${item.emoji || CAT_EMOJI[item.category]}</span>
      <span class="item-name">${item.name}</span>
    `;

    const leftPct = 5 + Math.random() * 70;
    el.style.left = `${leftPct}%`;
    el.style.top  = '-90px';
    zone.appendChild(el);

    // Attach drag listeners
    this.makeDraggable(el);

    // Falling animation via interval
    let top = -90;
    const speed = 0.5 + Math.random() * 0.4;
    const fallInterval = setInterval(() => {
      if (el.classList.contains('dragging')) return; // paused while dragging
      top += speed;
      el.style.top = `${top}px`;
      if (top > zone.clientHeight) {
        clearInterval(fallInterval);
        // Only penalise if the item wasn't already correctly sorted
        if (!el.dataset.sorted) {
          el.remove();
          this.loseLife();
        }
      }
    }, 16);

    this.fallingIntervals.push(fallInterval);
  },

  makeDraggable(el) {
    const onStart = (clientX, clientY) => {
      this.draggingEl = el;
      const rect = el.getBoundingClientRect();
      this.dragOffsetX = clientX - rect.left;
      this.dragOffsetY = clientY - rect.top;
      el.classList.add('dragging');
      document.body.style.userSelect = 'none';
    };

    const onMove = (clientX, clientY) => {
      if (this.draggingEl !== el) return;
      el.style.position = 'fixed';
      el.style.left = `${clientX - this.dragOffsetX}px`;
      el.style.top  = `${clientY - this.dragOffsetY}px`;
      el.style.zIndex = 999;
    };

    const onEnd = (clientX, clientY) => {
      if (this.draggingEl !== el) return;
      this.draggingEl = null;
      document.body.style.userSelect = '';
      el.classList.remove('dragging');

      // Find which bin is under drop point
      const bin = this.getBinAt(clientX, clientY);
      if (bin) {
        this.handleDrop(el, bin.dataset.cat);
      } else {
        // Dropped in void — return item to fall zone
        const zone = document.getElementById('fall-zone');
        if (zone) {
          el.style.position = 'absolute';
          el.style.zIndex   = '10';
        }
      }
    };

    // Mouse events
    el.addEventListener('mousedown', e => { e.preventDefault(); onStart(e.clientX, e.clientY); });
    window.addEventListener('mousemove', e => onMove(e.clientX, e.clientY));
    window.addEventListener('mouseup',   e => onEnd(e.clientX, e.clientY));

    // Touch events
    el.addEventListener('touchstart', e => {
      e.preventDefault();
      const t = e.touches[0];
      onStart(t.clientX, t.clientY);
    }, { passive: false });
    window.addEventListener('touchmove', e => {
      if (this.draggingEl !== el) return;
      const t = e.touches[0];
      onMove(t.clientX, t.clientY);
    }, { passive: true });
    window.addEventListener('touchend', e => {
      if (this.draggingEl !== el) return;
      const t = e.changedTouches[0];
      onEnd(t.clientX, t.clientY);
    });
  },

  getBinAt(x, y) {
    const bins = document.querySelectorAll('.bin-target');
    for (const bin of bins) {
      const r = bin.getBoundingClientRect();
      if (x >= r.left && x <= r.right && y >= r.top && y <= r.bottom) return bin;
    }
    return null;
  },

  handleDrop(el, droppedCat) {
    const itemCat = el.dataset.cat;
    const correct = itemCat === droppedCat;
    const bin = document.getElementById(`bin-${droppedCat}`);
    const rect = el.getBoundingClientRect();

    if (correct) {
      this.combo++;
      const pts = 10 * this.combo;
      this.score += pts;
      GameState.correct++;
      GameState.creditsEarned += 5;
      // Mark as sorted FIRST so the fall interval won't call loseLife
      el.dataset.sorted = 'true';
      el.classList.add('vanish');
      setTimeout(() => el.remove(), 320);
      if (bin) bin.classList.add('correct-flash');
      setTimeout(() => bin?.classList.remove('correct-flash'), 500);
      showScorePopup(`+${pts}`, rect.left + rect.width / 2, rect.top, true);
      showToast('success', `✅ ${el.dataset.name} → ${CAT_LABEL[droppedCat]}  ×${this.combo} combo!`);
    } else {
      this.combo = 1;
      GameState.wrong++;
      // Mark as sorted so the fall interval doesn't double-penalise
      el.dataset.sorted = 'true';
      el.classList.add('wrong-drop');
      setTimeout(() => el.remove(), 420);
      if (bin) bin.classList.add('wrong-flash');
      setTimeout(() => bin?.classList.remove('wrong-flash'), 500);
      showScorePopup('✗ Wrong!', rect.left + rect.width / 2, rect.top, false);
      this.loseLife();
    }

    this.updateHUD();
  },

  loseLife() {
    this.lives--;
    this.updateHUD();
    if (this.lives <= 0) this.endGame();
  },

  updateHUD() {
    setText('drag-score', this.score);
    setText('drag-combo', `×${this.combo}`);
    const hearts = '❤️'.repeat(Math.max(0, this.lives)) + '🖤'.repeat(Math.max(0, 3 - this.lives));
    setText('drag-lives', hearts);
  },

  endGame() {
    stopTimer();
    clearTimeout(this.spawnInterval);
    this.fallingIntervals.forEach(clearInterval);
    GameState.score = this.score;
    GameState.combo = this.combo;
    showGameOver('drag');
  }
};

/* ════════════════════════════════════════════════════════════
   SPEED QUIZ MODE
   ════════════════════════════════════════════════════════════ */
const Quiz = {
  items: [],
  currentIndex: 0,
  totalItems: 15,
  score: 0,
  speedTimer: null,
  speedMs: 5000,   // time to answer each question
  elapsed: 0,
  hintUsed: false,

  start() {
    this.items        = shuffle(getGameItems()).slice(0, this.totalItems);
    this.currentIndex = 0;
    this.score        = 0;

    GameState.correct = 0;
    GameState.wrong   = 0;
    GameState.combo   = 1;
    GameState.creditsEarned = 0;

    showScreen('arena-quiz');
    this.showQuestion();
  },

  showQuestion() {
    if (this.currentIndex >= this.totalItems) { this.endGame(); return; }

    clearInterval(this.speedTimer);
    this.elapsed  = 0;
    this.hintUsed = false;

    const item = this.items[this.currentIndex];

    setText('quiz-item-icon', item.emoji || CAT_EMOJI[item.category]);
    setText('quiz-item-name', item.name);
    setText('quiz-progress', `${this.currentIndex + 1} / ${this.totalItems}`);
    setText('quiz-score', this.score);
    setText('quiz-multiplier', `×${Math.max(1, GameState.combo)}`);

    const hintEl = document.getElementById('quiz-item-hint');
    if (hintEl) { hintEl.hidden = true; hintEl.textContent = ''; }

    const card = document.getElementById('quiz-item-card');
    if (card) { card.classList.remove('correct-anim', 'wrong-anim'); }

    // Re-trigger item appear animation
    const iconEl = document.getElementById('quiz-item-icon');
    if (iconEl) {
      iconEl.style.animation = 'none';
      iconEl.offsetHeight; // reflow
      iconEl.style.animation = '';
    }

    // Build answer choices: correct cat + 3 random wrong cats
    const wrongCats = DRAG_CATS.filter(c => c !== item.category);
    const choices = shuffle([item.category, ...shuffle(wrongCats).slice(0, 3)]);

    const answersEl = document.getElementById('quiz-answers');
    if (answersEl) {
      answersEl.innerHTML = '';
      choices.forEach(cat => {
        const btn = document.createElement('button');
        btn.className = 'quiz-answer-btn';
        btn.dataset.cat = cat;
        btn.innerHTML = `
          <span class="btn-cat-icon">${CAT_EMOJI[cat]}</span>
          <span class="btn-cat-name">${CAT_LABEL[cat]}</span>
          <span class="btn-cat-sub">${CAT_BIN[cat]}</span>
        `;
        btn.addEventListener('click', () => this.handleAnswer(cat, item));
        answersEl.appendChild(btn);
      });
    }

    const feedbackEl = document.getElementById('quiz-feedback');
    if (feedbackEl) feedbackEl.hidden = true;

    // Speed bar countdown
    const bar = document.getElementById('quiz-speed-bar');
    if (bar) bar.style.width = '100%';

    const tickMs = 50;
    this.speedTimer = setInterval(() => {
      this.elapsed += tickMs;
      const pct = Math.max(0, 100 - (this.elapsed / this.speedMs) * 100);
      if (bar) bar.style.width = pct + '%';
      if (this.elapsed >= this.speedMs) {
        // Time out = wrong
        clearInterval(this.speedTimer);
        this.handleAnswer(null, item);
      }
    }, tickMs);
  },

  handleAnswer(chosenCat, item) {
    clearInterval(this.speedTimer);

    const isCorrect = chosenCat === item.category;
    const timeRatio = 1 - (this.elapsed / this.speedMs);
    const multiplier = isCorrect ? Math.round(1 + timeRatio * 2) : 0; // 1–3×
    const pts = isCorrect ? 3 * multiplier : 0;

    if (isCorrect) {
      this.score += pts;
      GameState.combo = multiplier;
      GameState.correct++;
      GameState.creditsEarned += multiplier; // 1–3 credits
    } else {
      GameState.combo = 1;
      GameState.wrong++;
    }

    setText('quiz-score', this.score);
    setText('quiz-multiplier', `×${GameState.combo}`);

    // Highlight chosen + correct buttons
    document.querySelectorAll('.quiz-answer-btn').forEach(btn => {
      btn.disabled = true;
      if (btn.dataset.cat === item.category) btn.classList.add('correct-choice');
      if (chosenCat && btn.dataset.cat === chosenCat && !isCorrect) btn.classList.add('wrong-choice');
    });

    // Feedback
    const feedbackEl = document.getElementById('quiz-feedback');
    const card = document.getElementById('quiz-item-card');
    if (feedbackEl) {
      feedbackEl.hidden = false;
      if (isCorrect) {
        feedbackEl.className = 'quiz-feedback correct-fb';
        feedbackEl.textContent = multiplier >= 3 ? '⚡ BLAZING! +' + pts : multiplier === 2 ? '🔥 Fast! +' + pts : '✅ Correct! +' + pts;
      } else {
        feedbackEl.className = 'quiz-feedback wrong-fb';
        feedbackEl.textContent = chosenCat ? `❌ Wrong! It's ${CAT_LABEL[item.category]}` : `⏱️ Too slow! It's ${CAT_LABEL[item.category]}`;
      }
    }
    if (card) card.classList.add(isCorrect ? 'correct-anim' : 'wrong-anim');

    this.currentIndex++;
    setTimeout(() => this.showQuestion(), 1200);
  },

  endGame() {
    GameState.score = this.score;
    showGameOver('quiz');
  }
};

/* ────────────────────────────────────────────────────────────
   HINT BUTTON
   ──────────────────────────────────────────────────────────── */
function initHintBtn() {
  document.getElementById('quiz-hint-btn')?.addEventListener('click', () => {
    if (Quiz.hintUsed) { showToast('info', 'Only one hint per question!'); return; }
    Quiz.hintUsed = true;
    const item = Quiz.items[Quiz.currentIndex - 1] || Quiz.items[0];
    const hintEl = document.getElementById('quiz-item-hint');
    if (hintEl && item) {
      hintEl.textContent = `💡 Hint: ${item.tips || 'Think about which bin this belongs in!'}`;
      hintEl.hidden = false;
    }
    // Small score penalty
    Quiz.score = Math.max(0, Quiz.score - 3);
    setText('quiz-score', Quiz.score);
    showToast('info', 'Hint used! -3 points');
  });
}

/* ────────────────────────────────────────────────────────────
   INIT
   ──────────────────────────────────────────────────────────── */
document.addEventListener('DOMContentLoaded', () => {
  EcoUtils.initTheme();
  EcoNav.initNavbar();
  loadHighscores();
  renderHighscores();

  /* Mode select buttons */
  document.getElementById('start-drag-btn')?.addEventListener('click', () => {
    GameState.mode = 'drag';
    Drag.start();
  });

  document.getElementById('start-quiz-btn')?.addEventListener('click', () => {
    GameState.mode = 'quiz';
    Quiz.start();
  });

  /* Quit buttons */
  document.getElementById('drag-quit')?.addEventListener('click', () => {
    stopTimer();
    clearTimeout(Drag.spawnInterval);
    Drag.fallingIntervals.forEach(clearInterval);
    showScreen('mode-select');
  });

  document.getElementById('quiz-quit')?.addEventListener('click', () => {
    clearInterval(Quiz.speedTimer);
    showScreen('mode-select');
  });

  /* Game over buttons */
  document.getElementById('play-again-btn')?.addEventListener('click', () => {
    // Remove old new-highscore badge if present
    document.querySelector('.new-highscore-badge')?.remove();
    if (GameState.mode === 'drag') Drag.start();
    else Quiz.start();
  });

  document.getElementById('change-mode-btn')?.addEventListener('click', () => {
    document.querySelector('.new-highscore-badge')?.remove();
    showScreen('mode-select');
  });

  /* Drag bin highlight on drag over */
  document.querySelectorAll('.bin-target').forEach(bin => {
    bin.addEventListener('dragover',  e => { e.preventDefault(); bin.classList.add('drag-over'); });
    bin.addEventListener('dragleave', () => bin.classList.remove('drag-over'));
    bin.addEventListener('drop',      () => bin.classList.remove('drag-over'));
  });

  initHintBtn();

  console.log('🌿 EcoSort Game page ready');
});
