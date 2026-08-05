/**
 * Service worker — app shell caching only.
 * No backend/API calls exist yet, so this worker deliberately does the
 * minimum: cache the static shell (HTML/CSS/JS) for offline access and
 * fast repeat loads, using a cache-first strategy for shell assets and
 * network-first for everything else. Bump CACHE_NAME whenever shell
 * assets change to invalidate old caches.
 */

const CACHE_NAME = 'divine-increase-shell-v2';

// Paths are resolved relative to this file's own scope (the repo root,
// or a GitHub Pages subpath like /divine-increase-network/) so this
// works whether the site is served from a domain root or a sub-folder.
const BASE = self.registration.scope;

const SHELL_ASSETS = [
  '',
  'index.html',
  'manifest.json',
  'assets/icons/favicon-16.png',
  'assets/icons/favicon-32.png',
  'assets/icons/apple-touch-icon.png',
  'assets/icons/icon-192.png',
  'assets/icons/icon-512.png',
  'assets/icons/icon-maskable-512.png',
  'css/main.css',
  'css/base/variables.css',
  'css/base/reset.css',
  'css/base/typography.css',
  'css/layout/layout.css',
  'css/components/glass.css',
  'css/components/nav.css',
  'css/components/buttons.css',
  'css/components/cards.css',
  'css/components/footer.css',
  'js/main.js',
  'js/components/nav.js',
  'js/components/cards.js',
].map((path) => new URL(path, BASE).pathname);

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(SHELL_ASSETS))
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys
          .filter((key) => key !== CACHE_NAME)
          .map((key) => caches.delete(key))
      )
    )
  );
  self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  const { request } = event;

  // Only handle same-origin GET requests; let everything else
  // (future API calls, third-party requests) pass straight through.
  if (request.method !== 'GET' || new URL(request.url).origin !== self.location.origin) {
    return;
  }

  const isShellAsset = SHELL_ASSETS.includes(new URL(request.url).pathname);

  if (isShellAsset) {
    // Cache-first for the app shell
    event.respondWith(
      caches.match(request).then((cached) => cached || fetch(request))
    );
  } else {
    // Network-first for everything else, falling back to cache if offline
    event.respondWith(
      fetch(request)
        .then((response) => {
          const responseClone = response.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(request, responseClone));
          return response;
        })
        .catch(() => caches.match(request))
    );
  }
});
