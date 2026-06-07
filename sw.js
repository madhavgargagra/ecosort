/* ============================================================
   EcoSort — Service Worker (sw.js)
   Cache-first strategy for offline support.
   Uses RELATIVE paths so it works on GitHub Pages sub-paths
   e.g. https://username.github.io/repo-name/
   ============================================================ */

const CACHE_NAME = 'ecosort-v4';

const PRECACHE_ASSETS = [
  './',
  './index.html',
  './scan.html',
  './dashboard.html',
  './rewards.html',
  './game.html',
  './myths.html',
  './manifest.json',
  './favicon.svg',
  './css/index.css',
  './css/scanner.css',
  './css/results.css',
  './css/dashboard.css',
  './css/timeline.css',
  './css/rewards.css',
  './css/game.css',
  './css/myths.css',
  './js/utils.js',
  './js/nav.js',
  './js/waste-data.js',
  './js/storage.js',
  './js/impact.js',
  './js/timeline.js',
  './js/rewards.js',
  './js/classifier.js',
  './js/camera.js',
  './js/share.js',
  './js/page-home.js',
  './js/page-scan.js',
  './js/page-dashboard.js',
  './js/page-rewards.js',
  './js/page-game.js',
  './js/page-myths.js',
];

/* ── INSTALL: pre-cache all static assets ── */
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(PRECACHE_ASSETS))
      .then(() => self.skipWaiting())
      .catch(err => console.warn('[SW] Pre-cache failed:', err))
  );
});

/* ── ACTIVATE: clean old caches ── */
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys()
      .then(keys => Promise.all(
        keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k))
      ))
      .then(() => self.clients.claim())
  );
});

/* ── FETCH: stale-while-revalidate for pages, cache-first for assets ── */
self.addEventListener('fetch', event => {
  if (event.request.method !== 'GET') return;

  const url = new URL(event.request.url);

  /* Google Fonts — network first, cache fallback */
  if (url.hostname.includes('fonts.googleapis.com') ||
      url.hostname.includes('fonts.gstatic.com')) {
    event.respondWith(
      fetch(event.request)
        .then(res => {
          const clone = res.clone();
          caches.open(CACHE_NAME).then(c => c.put(event.request, clone));
          return res;
        })
        .catch(() => caches.match(event.request))
    );
    return;
  }

  /* TF.js CDN — cache once, then serve from cache */
  if (url.hostname.includes('cdn.jsdelivr.net') ||
      url.hostname.includes('unpkg.com')) {
    event.respondWith(
      caches.match(event.request).then(cached => {
        if (cached) return cached;
        return fetch(event.request).then(res => {
          const clone = res.clone();
          caches.open(CACHE_NAME).then(c => c.put(event.request, clone));
          return res;
        });
      })
    );
    return;
  }

  /* All other requests — cache first, network fallback */
  event.respondWith(
    caches.match(event.request).then(cached => {
      const networkFetch = fetch(event.request).then(res => {
        if (res.ok) {
          const clone = res.clone();
          caches.open(CACHE_NAME).then(c => c.put(event.request, clone));
        }
        return res;
      }).catch(() => cached);

      return cached || networkFetch;
    })
  );
});
