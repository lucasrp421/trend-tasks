// Service Worker — Grupo TREND Tasks PWA
const CACHE = 'trend-tasks-v1';
const ASSETS = ['/trend-tasks/', '/trend-tasks/index.html', '/trend-tasks/manifest.json', '/trend-tasks/icon-192.png', '/trend-tasks/icon-512.png'];
self.addEventListener('install', function(e) {
  e.waitUntil(
    caches.open(CACHE).then(function(c) { return c.addAll(ASSETS); })
  );
  self.skipWaiting();
});

self.addEventListener('activate', function(e) {
  e.waitUntil(
    caches.keys().then(function(keys) {
      return Promise.all(keys.filter(function(k) { return k !== CACHE; }).map(function(k) { return caches.delete(k); }));
    })
  );
  self.clients.claim();
});

self.addEventListener('fetch', function(e) {
  // Não interceptar chamadas para o GAS backend
  if (e.request.url.includes('script.google.com') || e.request.url.includes('script.googleusercontent.com')) {
    return;
  }
  e.respondWith(
    caches.match(e.request).then(function(cached) {
      return cached || fetch(e.request);
    })
  );
});
