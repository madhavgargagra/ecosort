/* ============================================================
   EcoSort — TensorFlow.js MobileNet Classifier
   classifier.js
   ============================================================ */

'use strict';

let model = null;
let modelLoading = false;

/**
 * Load the MobileNet model (once).
 * @param {function} onProgress - Called with status messages
 */
async function loadModel(onProgress) {
  if (model) return model;
  if (modelLoading) {
    // Wait for existing load to finish
    while (modelLoading) await sleep(200);
    return model;
  }

  modelLoading = true;
  try {
    onProgress?.('Loading AI model…');
    model = await mobilenet.load({ version: 2, alpha: 1.0 });
    onProgress?.('Model ready ✓');
    modelLoading = false;
    return model;
  } catch (err) {
    modelLoading = false;
    console.error('EcoSort: Failed to load MobileNet model', err);
    throw err;
  }
}

/**
 * Classify an image element using MobileNet.
 * Returns the best matching WASTE_ITEMS entry.
 * @param {HTMLImageElement|HTMLVideoElement|HTMLCanvasElement} imgEl
 * @param {function} onProgress
 * @returns {{ wasteItem: object|null, topClass: string, confidence: number, allPredictions: object[] }}
 */
async function classifyImage(imgEl, onProgress) {
  try {
    const net = await loadModel(onProgress);
    onProgress?.('Analyzing image…');

    // Run inference — returns top 5 predictions
    const predictions = await net.classify(imgEl, 10);
    onProgress?.('Classification complete ✓');

    // Try to map each prediction to a waste item, highest confidence first
    for (const pred of predictions) {
      const wasteItem = mapMLClassToWasteItem(pred.className);
      if (wasteItem) {
        return {
          wasteItem,
          topClass: pred.className,
          confidence: pred.probability,
          allPredictions: predictions,
        };
      }
    }

    // No direct match found — return top class with low confidence flag
    return {
      wasteItem: null,
      topClass: predictions[0]?.className || 'Unknown',
      confidence: predictions[0]?.probability || 0,
      allPredictions: predictions,
      noMatch: true,
    };

  } catch (err) {
    console.error('EcoSort: Classification error', err);
    throw err;
  }
}

/**
 * Pre-process an image: resize to canvas, normalize.
 * @param {File} file
 * @returns {Promise<HTMLImageElement>}
 */
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

// Pre-warm the model in the background after page load
window.addEventListener('load', () => {
  setTimeout(() => {
    loadModel(() => {}).catch(() => {});
  }, 2000);
});

window.EcoClassifier = { loadModel, classifyImage, fileToImageElement };
