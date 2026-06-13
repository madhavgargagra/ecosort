/* ============================================================
   EcoSort — Classifier (classifier.js)
   Primary:  Gemini Vision API  (accurate, online)
   Fallback: MobileNet v2       (offline, ~50% accuracy)
   ============================================================ */

'use strict';

/* ── MobileNet singleton ── */
let _mobileNetModel = null;
let _mobileNetLoading = false;

/* ════════════════════════════════════════════════════════════
   GEMINI VISION API  (primary classifier)
   Model:  gemini-2.0-flash  (latest, best vision accuracy)
   Method: Two-step classification for maximum accuracy
   ════════════════════════════════════════════════════════════ */

/**
 * Preprocess image before sending to Gemini:
 * - Auto-brighten dark images
 * - Boost contrast
 * - Sharpen edges (helps read text/recycling symbols)
 * - Resize to max 768px
 */
function imageElementToBase64(imgEl, maxSize = 768) {
  const canvas = document.createElement('canvas');
  let w = imgEl.naturalWidth  || imgEl.videoWidth  || imgEl.width  || 300;
  let h = imgEl.naturalHeight || imgEl.videoHeight || imgEl.height || 300;
  if (w > maxSize || h > maxSize) {
    const ratio = Math.min(maxSize / w, maxSize / h);
    w = Math.round(w * ratio);
    h = Math.round(h * ratio);
  }
  canvas.width  = w;
  canvas.height = h;
  const ctx = canvas.getContext('2d');

  // Draw original image
  ctx.drawImage(imgEl, 0, 0, w, h);

  // ── Auto-enhance: sample average brightness
  const sample = ctx.getImageData(0, 0, w, h);
  let totalBrightness = 0;
  for (let i = 0; i < sample.data.length; i += 16) { // sample every 4th pixel
    totalBrightness += (sample.data[i] + sample.data[i+1] + sample.data[i+2]) / 3;
  }
  const avgBrightness = totalBrightness / (sample.data.length / 16);

  // Apply CSS filters: boost contrast always, brighten if dark (<100 avg)
  const brightnessBoost = avgBrightness < 80 ? 1.4 : avgBrightness < 110 ? 1.15 : 1.0;
  ctx.filter = `contrast(1.25) brightness(${brightnessBoost}) saturate(1.1)`;
  ctx.drawImage(imgEl, 0, 0, w, h);
  ctx.filter = 'none';

  // ── Sharpen using convolution kernel
  const imageData = ctx.getImageData(0, 0, w, h);
  const sharpen = [
     0, -1,  0,
    -1,  5, -1,
     0, -1,  0,
  ];
  const output = ctx.createImageData(w, h);
  const src = imageData.data;
  const dst = output.data;
  for (let y = 1; y < h - 1; y++) {
    for (let x = 1; x < w - 1; x++) {
      const idx = (y * w + x) * 4;
      for (let c = 0; c < 3; c++) {
        let val = 0;
        for (let ky = -1; ky <= 1; ky++) {
          for (let kx = -1; kx <= 1; kx++) {
            const si = ((y + ky) * w + (x + kx)) * 4;
            val += src[si + c] * sharpen[(ky + 1) * 3 + (kx + 1)];
          }
        }
        dst[idx + c] = Math.max(0, Math.min(255, val));
      }
      dst[idx + 3] = src[idx + 3]; // preserve alpha
    }
  }
  // Copy border pixels as-is
  for (let x = 0; x < w; x++) {
    for (let c = 0; c < 4; c++) {
      dst[x * 4 + c]               = src[x * 4 + c];
      dst[((h-1)*w + x)*4 + c]     = src[((h-1)*w + x)*4 + c];
    }
  }
  for (let y = 0; y < h; y++) {
    for (let c = 0; c < 4; c++) {
      dst[y*w*4 + c]               = src[y*w*4 + c];
      dst[(y*w + w-1)*4 + c]       = src[(y*w + w-1)*4 + c];
    }
  }
  ctx.putImageData(output, 0, 0);

  return canvas.toDataURL('image/jpeg', 0.92).split(',')[1];
}

/* ── STEP 1 PROMPT: Item identification ── */
const GEMINI_STEP1_PROMPT = `You are an expert object identification AI.

Look very carefully at this image and describe the waste/household item shown.

Analyse ALL of the following:
1. WHAT is the object? (be as specific as possible)
2. MATERIAL: What is it made of? (plastic, glass, metal, paper, fabric, food, electronic components, etc.)
3. CONDITION: Is it empty/full, clean/dirty/greasy/contaminated?
4. LABELS/TEXT: Read any visible text, brand names, or recycling symbols on the item.
5. SIZE ESTIMATE: Small (fits in hand), medium (fits in bag), large (furniture-sized)

Reply in this EXACT JSON format (no markdown, no extra text):
{"object":"specific item name","material":"primary material","secondary_material":"if applicable or null","condition":"clean|dirty|greasy|contaminated|empty|full","label_text":"any text/symbols seen or null","size":"small|medium|large","notes":"any other relevant observation"}`;

/* ── STEP 2 PROMPT: Waste classification using Step 1 context ── */
function buildStep2Prompt(step1Result) {
  // Inject any past user corrections from localStorage to personalise the prompt
  const corrections = getFeedbackCorrections();
  const correctionNote = corrections.length > 0
    ? `\nUSER CORRECTION HISTORY (trust these over your defaults):\n${corrections.map(c =>
        `- Item identified as "${c.detected}" was actually "${c.correct}" (${c.category})`
      ).join('\n')}\n`
    : '';

  return `You are an expert waste classification AI for an app called EcoSort.

An object has been identified with the following details:
- Object: ${step1Result.object}
- Material: ${step1Result.material}${step1Result.secondary_material ? ' with ' + step1Result.secondary_material : ''}
- Condition: ${step1Result.condition}
- Visible labels/symbols: ${step1Result.label_text || 'none'}
- Size: ${step1Result.size}
- Additional notes: ${step1Result.notes || 'none'}
${correctionNote}
IMPORTANT CLASSIFICATION RULES:
- Paper/cardboard that is GREASY or CONTAMINATED with food → compostable (NOT recyclable)
- Plastic bags and film plastic → landfill (NOT recyclable kerbside)
- Batteries of ANY kind → hazardous (NEVER general waste)
- Anything with recycling symbol (♻) + number 1-7 → recyclable
- Food waste, fruit/veg scraps, eggshells, garden waste → compostable
- Electronics with circuit boards/screens/batteries → ewaste
- Clothing, fabric, shoes → textiles
- Medicines, sharps, syringes → medical
- Paint, motor oil, chemicals, fluorescent bulbs → hazardous
- Items too large for regular bins (sofas, fridges) → bulky
- Everything else that cannot be recycled → landfill

AVAILABLE CATEGORIES:
- recyclable   (blue/green bin)
- compostable  (green/brown bin)
- landfill     (black/grey bin)
- hazardous    (special collection)
- ewaste       (e-waste drop-off)
- textiles     (textile bank)
- bulky        (bulky collection)
- medical      (pharmacy/hospital)

Reply in this EXACT JSON format (no markdown, no extra text):
{"category":"CATEGORY_ID","item":"Specific Item Name","confidence":0.95,"reasoning":"one clear sentence explaining the classification decision"}

If the object is NOT a waste/household item (e.g. a person, scenery, food being eaten), reply:
{"category":"unknown","item":"Not a waste item","confidence":0,"reasoning":"explanation"}`;
}

/**
 * Make a single Gemini API call.
 * @param {string} apiKey
 * @param {Array} parts - array of {text} or {inline_data} objects
 * @param {number} maxTokens
 */
async function callGemini(apiKey, parts, maxTokens = 300) {
  const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`;
  const response = await fetch(endpoint, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      contents: [{ parts }],
      generationConfig: {
        temperature: 0.05,  // Very low = consistent, deterministic
        maxOutputTokens: maxTokens,
      }
    }),
  });

  if (!response.ok) {
    if (response.status === 400 || response.status === 401) throw new Error('GEMINI_BAD_KEY');
    if (response.status === 429 || response.status === 403) throw new Error('GEMINI_QUOTA');
    throw new Error(`GEMINI_HTTP_${response.status}`);
  }

  const data = await response.json();
  const rawText = data?.candidates?.[0]?.content?.parts?.[0]?.text?.trim();
  if (!rawText) throw new Error('GEMINI_EMPTY_RESPONSE');

  // Strip markdown code fences if present
  return rawText.replace(/```json\n?|\n?```/g, '').trim();
}

/**
 * Two-step Gemini classification.
 * Step 1: Identify what the item is (material, condition, labels)
 * Step 2: Classify into waste category using rich Step 1 context
 *
 * @param {HTMLImageElement|HTMLVideoElement|HTMLCanvasElement} imgEl
 * @param {string} apiKey
 * @param {function} onProgress
 */
async function classifyWithGemini(imgEl, apiKey, onProgress) {
  const base64Image = imageElementToBase64(imgEl); // preprocessed + sharpened
  const imageData   = { inline_data: { mime_type: 'image/jpeg', data: base64Image } };

  /* ── STEP 1: Identify the item ── */
  onProgress?.('Step 1/2 — Identifying item…');
  const step1Raw = await callGemini(
    apiKey,
    [{ text: GEMINI_STEP1_PROMPT }, imageData],
    250
  );

  let step1;
  try {
    step1 = JSON.parse(step1Raw);
  } catch {
    onProgress?.('Retrying with direct classification…');
    return classifyWithGeminiSingleStep(base64Image, apiKey, onProgress);
  }

  /* ── STEP 2: Classify into waste category ── */
  onProgress?.('Step 2/2 — Classifying waste category…');
  const step2Raw = await callGemini(
    apiKey,
    [{ text: buildStep2Prompt(step1) }],
    150
  );

  let parsed;
  try {
    parsed = JSON.parse(step2Raw);
  } catch {
    throw new Error('GEMINI_PARSE_ERROR');
  }

  if (!parsed.category || parsed.category === 'unknown') return null;

  /* ── STEP 3 (conditional): Low-confidence retry ── */
  if (parsed.confidence < 0.65) {
    onProgress?.('Low confidence — running focused retry…');
    const retryPrompt = `You are a waste classification expert. Focus ONLY on:
1. The MATERIAL of the item (plastic, glass, metal, paper, fabric, food, electronics, etc.)
2. Any RECYCLING SYMBOLS visible
3. Whether it is CONTAMINATED/GREASY

Item description: ${step1.object}, made of ${step1.material}, condition: ${step1.condition}

Classify into ONE of: recyclable | compostable | landfill | hazardous | ewaste | textiles | bulky | medical

Reply ONLY in JSON: {"category":"ID","item":"${step1.object}","confidence":0.85,"reasoning":"material-based reasoning"}`;

    try {
      const retryRaw = await callGemini(apiKey, [{ text: retryPrompt }], 100);
      const retryParsed = JSON.parse(retryRaw);
      if (retryParsed.category && retryParsed.category !== 'unknown' && retryParsed.confidence > parsed.confidence) {
        parsed = retryParsed; // use retry result if more confident
        onProgress?.('Retry improved confidence ✓');
      }
    } catch {
      // retry failed — keep original result
    }
  }

  // Match to WASTE_ITEMS database
  let wasteItem = findWasteItem(parsed.item) || findWasteItem(step1.object);
  if (!wasteItem && window.WASTE_ITEMS) {
    wasteItem = window.WASTE_ITEMS.find(i => i.category === parsed.category) || null;
  }

  onProgress?.('Classification complete ✓');

  return {
    wasteItem,
    category:       parsed.category,
    geminiItemName: parsed.item || step1.object,
    confidence:     Math.min(1, Math.max(0, parsed.confidence || 0.9)),
    reasoning:      parsed.reasoning || '',
    step1,
    source:         'gemini',
  };
}

/**
 * Single-step fallback (used if Step 1 parsing fails).
 */
async function classifyWithGeminiSingleStep(base64Image, apiKey, onProgress) {
  onProgress?.('Gemini AI is analyzing…');
  const FALLBACK_PROMPT = `You are an expert waste classification AI.
Analyse this image. Identify the waste item — look at its material, condition, any labels.

Categories: recyclable | compostable | landfill | hazardous | ewaste | textiles | bulky | medical

Reply ONLY in JSON: {"category":"ID","item":"Name","confidence":0.9,"reasoning":"one sentence"}
If not a waste item: {"category":"unknown","item":"Not a waste item","confidence":0,"reasoning":"reason"}`;

  const raw = await callGemini(
    apiKey,
    [{ text: FALLBACK_PROMPT }, { inline_data: { mime_type: 'image/jpeg', data: base64Image } }],
    150
  );

  let parsed;
  try { parsed = JSON.parse(raw); }
  catch { throw new Error('GEMINI_PARSE_ERROR'); }

  if (!parsed.category || parsed.category === 'unknown') return null;

  let wasteItem = findWasteItem(parsed.item);
  if (!wasteItem && window.WASTE_ITEMS) {
    wasteItem = window.WASTE_ITEMS.find(i => i.category === parsed.category) || null;
  }

  onProgress?.('Classification complete ✓');
  return {
    wasteItem,
    category: parsed.category,
    geminiItemName: parsed.item,
    confidence: Math.min(1, Math.max(0, parsed.confidence || 0.85)),
    reasoning: parsed.reasoning || '',
    source: 'gemini',
  };
}


/* ════════════════════════════════════════════════════════════
   MOBILENET FALLBACK  (offline / no API key)
   ════════════════════════════════════════════════════════════ */

async function loadMobileNet(onProgress) {
  if (_mobileNetModel) return _mobileNetModel;
  if (_mobileNetLoading) {
    while (_mobileNetLoading) await sleep(200);
    return _mobileNetModel;
  }
  _mobileNetLoading = true;
  try {
    onProgress?.('Loading offline AI model…');
    _mobileNetModel = await mobilenet.load({ version: 2, alpha: 1.0 });
    onProgress?.('Offline model ready ✓');
    _mobileNetLoading = false;
    return _mobileNetModel;
  } catch (err) {
    _mobileNetLoading = false;
    throw err;
  }
}

/**
 * Classify with MobileNet — offline fallback.
 * Uses improved, non-greedy keyword mapping + 40% confidence floor.
 */
async function classifyWithMobileNet(imgEl, onProgress) {
  const net = await loadMobileNet(onProgress);
  onProgress?.('Analyzing image (offline mode)…');
  const predictions = await net.classify(imgEl, 10);
  onProgress?.('Classification complete ✓');

  const CONFIDENCE_FLOOR = 0.40; // Skip predictions below 40%

  for (const pred of predictions) {
    if (pred.probability < CONFIDENCE_FLOOR) continue; // Skip low-confidence guesses
    const wasteItem = mapMLClassToWasteItem(pred.className);
    if (wasteItem) {
      return {
        wasteItem,
        topClass: pred.className,
        confidence: pred.probability,
        allPredictions: predictions,
        source: 'mobilenet',
        noMatch: false,
      };
    }
  }

  // Nothing matched above threshold
  return {
    wasteItem: null,
    topClass: predictions[0]?.className || 'Unknown',
    confidence: predictions[0]?.probability || 0,
    allPredictions: predictions,
    source: 'mobilenet',
    noMatch: true,
  };
}


/* ════════════════════════════════════════════════════════════
   MAIN HYBRID CLASSIFIER  (called by page-scan.js)
   ════════════════════════════════════════════════════════════ */

/**
 * Classify an image.
 * 1. If API key available → try Gemini first
 * 2. If Gemini fails or no key → fall back to MobileNet
 *
 * @param {HTMLImageElement|HTMLVideoElement|HTMLCanvasElement} imgEl
 * @param {function} onProgress
 * @returns result object
 */
async function classifyImage(imgEl, onProgress) {
  const apiKey = getGeminiApiKey();

  if (apiKey) {
    try {
      const result = await classifyWithGemini(imgEl, apiKey, onProgress);
      if (result) return result;
      // Gemini said "not a waste item"
      return { wasteItem: null, topClass: 'Not identified', confidence: 0, noMatch: true, source: 'gemini' };
    } catch (err) {
      const code = err.message;
      if (code === 'GEMINI_BAD_KEY') {
        onProgress?.('⚠️ Invalid API key — switching to offline mode…');
        clearGeminiApiKey(); // Remove bad key so user sees the setup prompt again
      } else if (code === 'GEMINI_QUOTA') {
        onProgress?.('⚠️ API quota reached — switching to offline mode…');
      } else {
        onProgress?.('⚠️ Gemini unavailable — switching to offline mode…');
      }
      // Fall through to MobileNet
      await sleep(800);
    }
  }

  // Offline MobileNet fallback
  return classifyWithMobileNet(imgEl, onProgress);
}


/* ════════════════════════════════════════════════════════════
   API KEY MANAGEMENT  (stored in localStorage)
   ════════════════════════════════════════════════════════════ */

const GEMINI_KEY_STORAGE = 'ecosort_gemini_key';

// Domain-restricted key — only works on madhavgargagra.github.io
// Safe to embed: restricted in Google Cloud Console to this domain only
const GEMINI_DEFAULT_KEY = 'AIzaSyDoUfqTXElJgWmPz6Ub2cuMT-eCZgc-km4';

function getGeminiApiKey() {
  // User's own key takes priority (set via the UI banner), else use default
  return localStorage.getItem(GEMINI_KEY_STORAGE) || GEMINI_DEFAULT_KEY;
}

function saveGeminiApiKey(key) {
  localStorage.setItem(GEMINI_KEY_STORAGE, key.trim());
}

function clearGeminiApiKey() {
  localStorage.removeItem(GEMINI_KEY_STORAGE);
}

function hasGeminiApiKey() {
  return !!getGeminiApiKey();
}


/* ════════════════════════════════════════════════════════════
   USER FEEDBACK LOOP  (corrections stored in localStorage)
   ════════════════════════════════════════════════════════════ */

const FEEDBACK_STORAGE = 'ecosort_feedback_corrections';
const MAX_CORRECTIONS  = 20;

/**
 * Get all stored user corrections.
 * @returns {Array<{detected:string, correct:string, category:string}>}
 */
function getFeedbackCorrections() {
  try {
    return JSON.parse(localStorage.getItem(FEEDBACK_STORAGE) || '[]');
  } catch { return []; }
}

/**
 * Save a user correction — item AI got wrong + what it actually was.
 * @param {string} detectedName  - what AI said
 * @param {string} correctName   - what user says it is
 * @param {string} correctCategory - correct waste category
 */
function saveFeedbackCorrection(detectedName, correctName, correctCategory) {
  const corrections = getFeedbackCorrections();
  // Avoid duplicates
  const exists = corrections.find(c => c.detected === detectedName && c.correct === correctName);
  if (!exists) {
    corrections.unshift({ detected: detectedName, correct: correctName, category: correctCategory });
    // Keep only the most recent MAX_CORRECTIONS
    if (corrections.length > MAX_CORRECTIONS) corrections.pop();
    localStorage.setItem(FEEDBACK_STORAGE, JSON.stringify(corrections));
  }
}

function clearFeedbackCorrections() {
  localStorage.removeItem(FEEDBACK_STORAGE);
}


/* ════════════════════════════════════════════════════════════
   IMAGENET → WASTE MAPPING  (fixed, non-greedy)
   ════════════════════════════════════════════════════════════ */

/**
 * Maps ImageNet class names to waste items.
 * Uses EXACT label matching — no greedy single-word keywords.
 */
function mapMLClassToWasteItem(className) {
  const label = className.toLowerCase();

  // Each entry: array of EXACT ImageNet label substrings → waste item name
  // These are specific enough to avoid false matches
  const mappings = [
    // ── Plastic bottles
    { keywords: ['water bottle', 'pop bottle', 'plastic bottle', 'soft drink bottle'], name: 'Plastic Bottle' },
    // ── Glass
    { keywords: ['wine bottle', 'beer bottle', 'glass bottle', 'whiskey jug'], name: 'Glass Bottle' },
    // ── Cans
    { keywords: ['pop can', 'beer can', 'soda can', 'tin can', 'steel drum'], name: 'Aluminium Can' },
    // ── Cartons / milk
    { keywords: ['milk can', 'milk jug', 'carton'], name: 'Milk Carton' },
    // ── Paper / Cardboard
    { keywords: ['newspaper', 'newsprint'], name: 'Newspaper' },
    { keywords: ['cardboard', 'shipping container', 'moving box', 'corrugated'], name: 'Cardboard Box' },
    // ── Electronics
    { keywords: ['cellular telephone', 'mobile phone', 'smartphone', 'cell phone', 'iphone'], name: 'Old Phone' },
    { keywords: ['laptop', 'notebook computer', 'notebook'], name: 'Laptop / Computer' },
    { keywords: ['television', 'television set', 'flat screen', 'crt screen', 'monitor'], name: 'Television' },
    { keywords: ['power strip', 'extension cord', 'usb cable', 'phone charger'], name: 'Charger / Cable' },
    { keywords: ['computer keyboard', 'typewriter keyboard'], name: 'Laptop / Computer' },
    { keywords: ['computer mouse', 'mouse (computer)'], name: 'Laptop / Computer' },
    // ── Food waste
    { keywords: ['banana', 'banana peel', 'banana skin'], name: 'Banana Peel' },
    { keywords: ['orange', 'lemon', 'apple', 'pear', 'grape', 'strawberry', 'fig', 'jackfruit', 'pomegranate', 'acorn squash', 'cucumber'], name: 'Food Scraps' },
    { keywords: ['espresso maker', 'coffee mug', 'coffee filter'], name: 'Coffee Grounds' },
    { keywords: ['eggnog', 'hen-of-the-woods', 'egg'], name: 'Egg Shells' },
    // ── Clothing / textiles
    { keywords: ['jersey', 'sweatshirt', 't-shirt', 'jean', 'trench coat', 'fur coat', 'cloak'], name: 'Old T-Shirt' },
    { keywords: ['running shoe', 'sneaker', 'clog', 'sandal', 'boot'], name: 'Shoes' },
    // ── Hazardous
    { keywords: ['electric battery', 'battery'], name: 'Battery' },
    { keywords: ['table lamp', 'desk lamp', 'spotlight', 'fluorescent', 'cfl'], name: 'Fluorescent Light Bulb' },
    // ── Landfill
    { keywords: ['plastic bag', 'grocery bag', 'shopping bag', 'paper bag'], name: 'Plastic Bag' },
    { keywords: ['styrofoam', 'polystyrene'], name: 'Styrofoam / Polystyrene' },
    { keywords: ['pizza'], name: 'Pizza Box (greasy)' },
    // ── Furniture / bulky
    { keywords: ['rocking chair', 'folding chair', 'armchair', 'park bench', 'sofa'], name: 'Old Furniture' },
  ];

  for (const m of mappings) {
    if (m.keywords.some(k => label.includes(k))) {
      return window.WASTE_ITEMS
        ? window.WASTE_ITEMS.find(i => i.name === m.name) || null
        : null;
    }
  }
  return null;
}


/* ════════════════════════════════════════════════════════════
   UTILITIES
   ════════════════════════════════════════════════════════════ */

function fileToImageElement(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => resolve(img);
      img.onerror = reject;
      img.src = e.target.result;
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

function sleep(ms) {
  return new Promise(r => setTimeout(r, ms));
}

// Pre-warm MobileNet if no Gemini key (only on scan page)
window.addEventListener('load', () => {
  setTimeout(() => {
    if (!hasGeminiApiKey()) {
      loadMobileNet(() => {}).catch(() => {});
    }
  }, 2000);
});

window.EcoClassifier = {
  classifyImage,
  classifyWithGemini,
  classifyWithMobileNet,
  fileToImageElement,
  getGeminiApiKey,
  saveGeminiApiKey,
  clearGeminiApiKey,
  hasGeminiApiKey,
  getFeedbackCorrections,
  saveFeedbackCorrection,
  clearFeedbackCorrections,
};
