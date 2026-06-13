/* ============================================================
   EcoSort — Camera & File Input Handler
   camera.js
   ============================================================ */

'use strict';

let stream = null;

/**
 * Start the device camera and show the viewfinder.
 */
async function startCamera() {
  const video       = document.getElementById('camera-video');
  const errorEl     = document.getElementById('camera-error');
  const captureBtn  = document.getElementById('capture-btn');
  const stopBtn     = document.getElementById('stop-camera-btn');
  const startBtn    = document.getElementById('start-camera-btn');
  const placeholder = document.getElementById('camera-placeholder');
  const overlay     = document.querySelector('.camera-overlay');

  if (!video) return;

  try {
    stream = await navigator.mediaDevices.getUserMedia({
      video: { facingMode: 'environment', width: { ideal: 1280 }, height: { ideal: 720 } },
      audio: false,
    });
    video.srcObject = stream;
    await video.play();

    // Show video, hide placeholder
    video.hidden      = false;
    if (placeholder)  placeholder.hidden = true;
    if (overlay)      overlay.style.opacity = '1';
    if (startBtn)     startBtn.hidden = true;
    if (captureBtn)   captureBtn.hidden = false;
    if (stopBtn)      stopBtn.hidden = false;
    if (errorEl)      errorEl.hidden = true;

  } catch (err) {
    console.warn('EcoSort: Camera access failed:', err);
    if (errorEl)      errorEl.hidden = false;
    if (startBtn)     startBtn.hidden = false;
  }
}

/**
 * Stop the camera stream.
 */
function stopCamera() {
  if (stream) {
    stream.getTracks().forEach(t => t.stop());
    stream = null;
  }
  const video       = document.getElementById('camera-video');
  const placeholder = document.getElementById('camera-placeholder');
  const overlay     = document.querySelector('.camera-overlay');

  if (video) { video.srcObject = null; video.hidden = true; }
  if (placeholder)  placeholder.hidden = false;
  if (overlay)      overlay.style.opacity = '0';

  const captureBtn = document.getElementById('capture-btn');
  const stopBtn    = document.getElementById('stop-camera-btn');
  const startBtn   = document.getElementById('start-camera-btn');
  if (startBtn)    startBtn.hidden = false;
  if (captureBtn)  captureBtn.hidden = true;
  if (stopBtn)     stopBtn.hidden = true;
}

/**
 * Capture the current video frame as an ImageElement.
 * @returns {HTMLImageElement}
 */
function captureFrameAsImage() {
  const video = document.getElementById('camera-video');
  const canvas = document.getElementById('camera-canvas');
  if (!video || !canvas) return null;

  canvas.width  = video.videoWidth;
  canvas.height = video.videoHeight;
  const ctx = canvas.getContext('2d');
  ctx.drawImage(video, 0, 0);

  // Return as img element for TF.js
  const img = new Image();
  img.src = canvas.toDataURL('image/jpeg', 0.9);
  return img;
}

window.EcoCamera = { startCamera, stopCamera, captureFrameAsImage };
