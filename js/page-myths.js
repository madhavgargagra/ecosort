/* ============================================================
   EcoSort — page-myths.js
   Recycling Myth Buster quiz controller
   ============================================================ */

'use strict';

/* ─────────────────────────────────────────────────────────────
   MYTHS DATABASE  (30 myths — 15 chosen randomly each game)
   ───────────────────────────────────────────────────────────── */
const ALL_MYTHS = [
  {
    id: 1,
    statement: 'Pizza boxes are fully recyclable.',
    answer: false,
    explanation: 'Grease and food residue contaminate paper fibres, ruining entire recycling batches. Tear off and recycle the clean top half; compost the greasy bottom.',
    category: '📄 Paper',
    funFact: 'One greasy pizza box can contaminate an entire tonne of recyclable paper pulp!'
  },
  {
    id: 2,
    statement: 'Rinsing containers before recycling makes no real difference.',
    answer: false,
    explanation: 'Rinsing matters enormously! Food residue is the #1 cause of recycling contamination. Even a quick rinse removes most of it and significantly improves recycling quality.',
    category: '✅ Best Practice',
    funFact: 'In some regions, up to 25% of collected recyclables are rejected due to contamination from food waste.'
  },
  {
    id: 3,
    statement: 'All types of plastic can be recycled kerbside.',
    answer: false,
    explanation: 'Only plastics labelled #1 (PET) and #2 (HDPE) are widely accepted. Plastic bags, cling film, black plastic, and multi-layer packaging usually cannot be recycled kerbside.',
    category: '🧴 Plastics',
    funFact: 'There are 7 categories of plastic. Most recycling programmes only accept 2 of them!'
  },
  {
    id: 4,
    statement: 'Glass can be recycled infinitely without any loss of quality.',
    answer: true,
    explanation: 'Unlike paper or plastic whose materials degrade with each recycling cycle, glass can be recycled endlessly with no quality loss. A glass bottle can be back on store shelves in just 30 days!',
    category: '🍾 Glass',
    funFact: 'The UK alone recycles about 1.4 million tonnes of glass every year — but still only captures about half of all glass used.'
  },
  {
    id: 5,
    statement: 'Putting recyclables inside plastic bags helps the sorting process.',
    answer: false,
    explanation: 'Never bag recyclables! Plastic bags jam sorting machinery and cause entire loads to be rejected. Always place loose items directly in your recycling bin.',
    category: '🧴 Plastics',
    funFact: 'Plastic bags cost waste facilities millions in equipment repairs and sorting failures every year.'
  },
  {
    id: 6,
    statement: 'Batteries can be safely put in your regular household bin.',
    answer: false,
    explanation: 'Batteries contain toxic heavy metals (lead, cadmium, mercury) and lithium batteries can cause fires in refuse trucks. Always take them to dedicated battery collection points at supermarkets or councils.',
    category: '⚠️ Hazardous',
    funFact: 'Lithium-ion batteries are the #1 cause of fires in waste collection vehicles globally — one damaged battery can destroy an entire truck.'
  },
  {
    id: 7,
    statement: 'Recycling aluminium uses 95% less energy than making it from raw ore.',
    answer: true,
    explanation: 'Aluminium recycling really is this efficient! It also uses 97% less water. An aluminium can can be recycled and back on a shelf within 60 days of being thrown away.',
    category: '🥫 Metal',
    funFact: 'Throwing away one aluminium can wastes as much energy as filling the same can half-full of petrol and pouring it away.'
  },
  {
    id: 8,
    statement: 'Organic waste decomposes quickly and harmlessly inside landfills.',
    answer: false,
    explanation: 'Without oxygen in landfills, organic matter undergoes anaerobic decomposition, producing methane — a greenhouse gas 25× more potent than CO₂. Composting is far better for the environment.',
    category: '🌱 Organics',
    funFact: 'Landfill gas (mostly methane) is actually collected and burned for electricity at modern facilities — but it\'s still far better to compost organics instead.'
  },
  {
    id: 9,
    statement: 'Shredded paper can go straight into your recycling bin.',
    answer: false,
    explanation: 'Shredded paper fibres are too short for most recycling machines and fall through sorting screens, contaminating other materials. Bag it separately for composting, or check if your council offers a specialist collection.',
    category: '📄 Paper',
    funFact: 'Some offices send shredded paper to specialist recyclers who compress it into logs used as biomass fuel — a surprisingly useful second life!'
  },
  {
    id: 10,
    statement: 'Black plastic containers cannot be detected by recycling sorting machines.',
    answer: true,
    explanation: 'Modern optical sorting machines use infrared light to identify plastics, but black pigment absorbs (rather than reflects) infrared, making black plastic effectively invisible to the machinery. It almost always ends up in landfill.',
    category: '🧴 Plastics',
    funFact: 'Some supermarkets have started switching their ready-meal trays from black to clear or coloured plastic purely so they can be sorted and recycled.'
  },
  {
    id: 11,
    statement: 'E-waste is the fastest-growing category of waste in the world.',
    answer: true,
    explanation: 'E-waste grows at 3–4% per year — faster than any other waste stream. Only about 17% is formally recycled, yet e-waste contains gold, silver, copper, and rare earth elements worth billions.',
    category: '💻 E-Waste',
    funFact: 'One tonne of circuit boards contains 40–800 times more gold than one tonne of gold ore mined from the ground!'
  },
  {
    id: 12,
    statement: 'Paper can be recycled as many times as you want.',
    answer: false,
    explanation: 'Paper fibres get shorter with every recycling cycle and can only be processed 5–7 times before they\'re too short to bond. Virgin wood fibre must be added to maintain paper quality.',
    category: '📄 Paper',
    funFact: 'The world consumes about 400 million tonnes of paper per year. If everyone recycled their newspapers for one year, it would save 250 million trees!'
  },
  {
    id: 13,
    statement: 'Styrofoam (expanded polystyrene) is accepted in most household recycling programmes.',
    answer: false,
    explanation: 'Expanded polystyrene is 98% air and is rarely accepted in kerbside recycling because its extremely low density makes collection economically unviable. It ends up in landfill and takes up to 500 years to decompose.',
    category: '🧴 Plastics',
    funFact: 'Scientists are developing special bacteria that can eat polystyrene — potentially offering a future biological recycling solution.'
  },
  {
    id: 14,
    statement: 'Home composting produces harmful methane gas.',
    answer: false,
    explanation: 'Properly managed home composting is an aerobic process (with oxygen) that produces CO₂ and water — not methane. Methane is only produced in oxygen-free environments like landfills.',
    category: '🌱 Organics',
    funFact: 'A well-maintained compost bin reaches temperatures of 50–70°C inside, which kills pathogens and weed seeds — creating safe, nutrient-rich fertiliser.'
  },
  {
    id: 15,
    statement: 'Recycling one glass bottle saves enough energy to power a 100W lightbulb for 4 hours.',
    answer: true,
    explanation: 'Recycling glass saves around 30% of the energy needed to make new glass from raw materials. One recycled bottle does save enough energy to run a lightbulb for several hours — a small but meaningful contribution!',
    category: '🍾 Glass',
    funFact: 'In contrast, recycling aluminium saves so much more energy per item that some experts argue aluminium is the single most important material to recycle.'
  },
  /* ── 15 NEW MYTHS ── */
  {
    id: 16,
    statement: 'Plastic water bottles marked #1 (PET) can be refilled safely many times.',
    answer: false,
    explanation: 'PET plastic is designed for single use. Repeated washing and refilling can cause the plastic to degrade and potentially leach chemicals. Use dedicated reusable bottles (stainless steel or #5 PP plastic) instead.',
    category: '🧴 Plastics',
    funFact: 'A single stainless steel water bottle can replace up to 1,460 disposable plastic bottles over 4 years of daily use!'
  },
  {
    id: 17,
    statement: 'Used cooking oil can be poured down the kitchen drain.',
    answer: false,
    explanation: 'Cooking oil solidifies in pipes and creates massive "fatbergs" in sewers. It also contaminates waterways. Collect it in a sealed container and take it to a cooking oil recycling point — it can be turned into biodiesel!',
    category: '⚠️ Hazardous',
    funFact: 'The famous London "Fatberg" of 2017 weighed 130 tonnes — as heavy as 11 double-decker buses — and was made mostly of cooking oil and wet wipes.'
  },
  {
    id: 18,
    statement: 'Receipts printed on thermal paper can be recycled with normal paper.',
    answer: false,
    explanation: 'Thermal paper receipts are coated with Bisphenol A (BPA) or BPS, which contaminates the paper recycling process. They must go in general waste. Better yet — choose digital receipts where possible.',
    category: '📄 Paper',
    funFact: 'A cashier who handles thermal receipts all day can absorb as much BPA through their skin as if they had eaten 17 cans of BPA-lined food!'
  },
  {
    id: 19,
    statement: 'Textiles and clothing can never be recycled.',
    answer: false,
    explanation: 'Textiles CAN be recycled — but not via kerbside bins. Many brands, supermarkets, and charities accept old clothing for reuse or fibre recycling. Some fabrics become industrial rags, insulation, or even new yarn.',
    category: '👕 Textiles',
    funFact: 'Only 1% of clothing is currently recycled into new clothing globally — despite the technology existing — mainly due to collection and sorting challenges.'
  },
  {
    id: 20,
    statement: 'Recycling creates more pollution than it saves.',
    answer: false,
    explanation: 'This is a persistent myth. Studies consistently show that recycling saves significant energy and emissions compared to producing materials from scratch. Aluminium recycling alone prevents 95% of the energy and emissions of primary production.',
    category: '✅ Best Practice',
    funFact: 'Recycling one tonne of steel saves 1.1 tonnes of CO₂, 1.4 tonnes of iron ore, 0.7 tonnes of coal, and 120 kg of limestone.'
  },
  {
    id: 21,
    statement: 'All aerosol cans must go in the general waste bin.',
    answer: false,
    explanation: 'Empty aerosol cans (with no remaining pressure) are recyclable in most areas as they are made of steel or aluminium. Never puncture them. Full or partly full aerosols with hazardous contents should go to hazardous waste collection.',
    category: '🥫 Metal',
    funFact: 'Steel aerosol cans are among the most recycled packaging in the world — with recycling rates over 60% in many countries.'
  },
  {
    id: 22,
    statement: 'Wet cardboard is still recyclable.',
    answer: false,
    explanation: 'Wet cardboard has weakened fibres and often carries mould, both of which ruin paper recycling batches. Always keep cardboard dry. If it gets wet, it\'s better composted or put in general waste.',
    category: '📄 Paper',
    funFact: 'Cardboard breaks down in compost in as little as 3 months — much faster than most food packaging.'
  },
  {
    id: 23,
    statement: 'Medicine packaging (pill blister packs) can go in household recycling.',
    answer: false,
    explanation: 'Blister packs combine aluminium foil and plastic laminated together, making them very difficult to separate and recycle. Many pharmacies have specialist take-back schemes specifically for medication packaging.',
    category: '⚠️ Hazardous',
    funFact: 'Some UK pharmacies now partner with TerraCycle to recycle blister packs — recovering both the aluminium and plastic separately.'
  },
  {
    id: 24,
    statement: 'Food-grade plastic (like yoghurt pots) is more recyclable than non-food plastic.',
    answer: false,
    explanation: 'The type of plastic (its resin number) determines recyclability, not whether it held food. Many food-grade plastics like #6 (polystyrene) or #7 (other) are less recyclable than non-food items made of #1 or #2.',
    category: '🧴 Plastics',
    funFact: 'Most yoghurt pots are made from Polystyrene (#6), which is rarely recyclable kerbside despite being used as food packaging.'
  },
  {
    id: 25,
    statement: 'Broken glass from windows or drinking glasses can go in your glass recycling bin.',
    answer: false,
    explanation: 'Bottle glass and window glass have different melting points. Drinking glass, Pyrex, mirrors, and window glass all contaminate bottle-glass recycling. They must go in general waste (wrapped safely) or specialist collection.',
    category: '🍾 Glass',
    funFact: 'Just one Pyrex dish in a glass recycling batch can cause defects in up to 500 bottles!'
  },
  {
    id: 26,
    statement: 'Composting banana peels and citrus fruit attracts pests and should be avoided.',
    answer: false,
    explanation: 'All fruit peels, including citrus and bananas, compost perfectly well. A covered compost bin or tumbler prevents pest access. The only items to avoid composting are meat, fish, and dairy, which do attract pests.',
    category: '🌱 Organics',
    funFact: 'Banana peels are rich in potassium, phosphorus, and calcium — making them excellent compost material for flowering plants!'
  },
  {
    id: 27,
    statement: 'A single plastic straw is too small to matter — there is no need to refuse it.',
    answer: false,
    explanation: 'At scale, small items make an enormous difference. The US alone uses 500 million straws daily. They are too light to be sorted by recycling machines and often end up in oceans, where they are deadly to marine life.',
    category: '🧴 Plastics',
    funFact: 'It\'s estimated that by 2050 there will be more plastic in the ocean by weight than fish.'
  },
  {
    id: 28,
    statement: 'Recycled materials are always lower quality than virgin materials.',
    answer: false,
    explanation: 'Not true for many materials. Recycled aluminium and glass are virtually indistinguishable from virgin material. Recycled paper and plastic do have some quality trade-offs, but technology is improving rapidly.',
    category: '✅ Best Practice',
    funFact: 'Recycled aluminium is used in aircraft manufacturing — one of the most demanding quality requirements imaginable!'
  },
  {
    id: 29,
    statement: 'Paint tins can be placed in your recycling bin once the paint is dried.',
    answer: true,
    explanation: 'Dried or hardened paint tins (with the lid off to show they are empty/dry) are accepted in metal recycling by many councils. Liquid paint tins must go to hazardous waste facilities as liquid paint is a contaminant.',
    category: '🥫 Metal',
    funFact: 'Leave the tin lid off so collectors can see the paint is dry — this speeds up sorting and ensures the tin gets recycled rather than rejected.'
  },
  {
    id: 30,
    statement: 'Electric car batteries can be recycled at your local household waste centre.',
    answer: false,
    explanation: 'EV lithium-ion batteries require specialist handling and cannot go to standard household waste centres. They contain toxic and flammable materials. Contact your car manufacturer or an authorised EV recycler for disposal.',
    category: '💻 E-Waste',
    funFact: 'A typical EV battery pack weighs 300–500 kg and contains lithium, cobalt, manganese, and nickel — all valuable if properly recovered!'
  },
];

/* Shuffle helper */
function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

/* Pick 15 random myths from the full 30 */
const MYTHS = ALL_MYTHS; // kept for reference
const GAME_SIZE = 15;

/* ─────────────────────────────────────────────────────────────
   QUIZ STATE
   ───────────────────────────────────────────────────────────── */
const QuizState = {
  currentIndex: 0,
  score: 0,
  correct: 0,
  wrong: 0,
  answered: false,
  shuffled: [],
  creditsEarned: 0,
};

function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

/* ─────────────────────────────────────────────────────────────
   RENDER
   ───────────────────────────────────────────────────────────── */
function renderQuestion() {
  const myth = QuizState.shuffled[QuizState.currentIndex];
  const total = QuizState.shuffled.length;
  const progress = ((QuizState.currentIndex) / total) * 100;

  /* Progress */
  document.getElementById('myth-progress-bar').style.width = progress + '%';
  document.getElementById('myth-q-num').textContent = `${QuizState.currentIndex + 1} / ${total}`;
  document.getElementById('myth-score').textContent = QuizState.score;

  /* Category badge */
  document.getElementById('myth-category').textContent = myth.category;

  /* Statement */
  document.getElementById('myth-statement').textContent = `"${myth.statement}"`;

  /* Reset button states */
  const trueBtn  = document.getElementById('myth-true-btn');
  const falseBtn = document.getElementById('myth-false-btn');
  trueBtn.className  = 'myth-answer-btn myth-true';
  falseBtn.className = 'myth-answer-btn myth-false';
  trueBtn.disabled   = false;
  falseBtn.disabled  = false;

  /* Hide explanation + next */
  document.getElementById('myth-explanation').hidden = true;
  document.getElementById('myth-next-btn').hidden = true;
  document.getElementById('myth-fun-fact').hidden = true;

  /* Animate card in */
  const card = document.getElementById('myth-card');
  card.style.animation = 'none';
  card.offsetHeight; // reflow
  card.style.animation = '';
  card.classList.remove('reveal');

  QuizState.answered = false;
}

function handleAnswer(userAnswer) {
  if (QuizState.answered) return;
  QuizState.answered = true;

  const myth = QuizState.shuffled[QuizState.currentIndex];
  const isCorrect = userAnswer === myth.answer;

  const trueBtn  = document.getElementById('myth-true-btn');
  const falseBtn = document.getElementById('myth-false-btn');
  trueBtn.disabled = falseBtn.disabled = true;

  if (isCorrect) {
    QuizState.score += 10;
    QuizState.correct++;
    QuizState.creditsEarned += 3;
    const btn = userAnswer ? trueBtn : falseBtn;
    btn.classList.add('correct');
    showToast('success', '✅ Correct! +10 pts · +3 Eco Credits');
  } else {
    QuizState.wrong++;
    const wrongBtn   = userAnswer ? trueBtn  : falseBtn;
    const correctBtn = userAnswer ? falseBtn : trueBtn;
    wrongBtn.classList.add('wrong');
    correctBtn.classList.add('correct');
    showToast('info', `❌ Not quite! The answer is ${myth.answer ? 'TRUE' : 'FALSE'}`);
  }

  /* Show explanation */
  const expEl = document.getElementById('myth-explanation');
  const ffEl  = document.getElementById('myth-fun-fact');
  expEl.hidden = false;
  ffEl.hidden  = false;
  document.getElementById('myth-exp-text').textContent = myth.explanation;
  document.getElementById('myth-fun-fact-text').textContent = '💡 ' + myth.funFact;

  /* Reveal card details */
  document.getElementById('myth-card').classList.add('reveal');

  /* Show next button */
  const nextBtn = document.getElementById('myth-next-btn');
  nextBtn.hidden = false;
  const isLast = QuizState.currentIndex >= QuizState.shuffled.length - 1;
  nextBtn.textContent = isLast ? '🎉 See Results' : 'Next Myth →';
}

function nextQuestion() {
  QuizState.currentIndex++;
  if (QuizState.currentIndex >= QuizState.shuffled.length) {
    showResults();
  } else {
    renderQuestion();
  }
}

function showResults() {
  /* Award credits */
  try {
    const raw = localStorage.getItem('ecosort_v1');
    const state = raw ? JSON.parse(raw) : {};
    state.ecoCredits = (state.ecoCredits || 0) + QuizState.creditsEarned;
    localStorage.setItem('ecosort_v1', JSON.stringify(state));
  } catch (_) {}

  EcoNav.refreshNavCredits();

  const accuracy = Math.round(QuizState.correct / QuizState.shuffled.length * 100);
  const emoji = accuracy >= 90 ? '🏆' : accuracy >= 70 ? '🎉' : accuracy >= 50 ? '😊' : '📚';

  document.getElementById('result-emoji').textContent = emoji;
  document.getElementById('result-score').textContent = QuizState.score;
  document.getElementById('result-correct').textContent = QuizState.correct;
  document.getElementById('result-wrong').textContent = QuizState.wrong;
  document.getElementById('result-accuracy').textContent = accuracy + '%';
  document.getElementById('result-credits').textContent = '+' + QuizState.creditsEarned + ' Eco Credits Earned!';

  let grade = '';
  if (accuracy >= 90) grade = '🌟 Recycling Expert!';
  else if (accuracy >= 70) grade = '♻️ Eco Champion!';
  else if (accuracy >= 50) grade = '🌱 Getting Greener!';
  else grade = '📚 Keep Learning!';
  document.getElementById('result-grade').textContent = grade;

  document.getElementById('myth-quiz-section').hidden = true;
  document.getElementById('myth-result-section').hidden = false;
}

function restartQuiz() {
  QuizState.currentIndex = 0;
  QuizState.score = 0;
  QuizState.correct = 0;
  QuizState.wrong = 0;
  QuizState.answered = false;
  QuizState.creditsEarned = 0;
  QuizState.shuffled = shuffle(ALL_MYTHS).slice(0, GAME_SIZE);

  document.getElementById('myth-result-section').hidden = true;
  document.getElementById('myth-quiz-section').hidden = false;
  renderQuestion();
}

/* ─────────────────────────────────────────────────────────────
   INIT
   ───────────────────────────────────────────────────────────── */
document.addEventListener('DOMContentLoaded', () => {
  EcoUtils.initTheme();
  EcoNav.initNavbar();

  QuizState.shuffled = shuffle(ALL_MYTHS).slice(0, GAME_SIZE);
  renderQuestion();

  document.getElementById('myth-true-btn').addEventListener('click', () => handleAnswer(true));
  document.getElementById('myth-false-btn').addEventListener('click', () => handleAnswer(false));
  document.getElementById('myth-next-btn').addEventListener('click', nextQuestion);
  document.getElementById('myth-restart-btn').addEventListener('click', restartQuiz);

  /* Keyboard shortcuts: T = True, F = False */
  document.addEventListener('keydown', e => {
    if (document.getElementById('myth-quiz-section').hidden) return;
    if (e.key === 't' || e.key === 'T') handleAnswer(true);
    if (e.key === 'f' || e.key === 'F') handleAnswer(false);
    if ((e.key === 'Enter' || e.key === 'ArrowRight') && !document.getElementById('myth-next-btn').hidden) nextQuestion();
  });

  console.log('🌿 EcoSort Myths page ready');
});
