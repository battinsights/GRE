const CACHE_NAME = 'gre-nanda-v7';
const ASSETS = [
  './',
  './index.html',
  './manifest.json',
  './js/quotes-data.js',
  './js/vocab-data-1.js',
  './js/vocab-data-2.js',
  './js/vocab-data-3.js',
  './js/vocab-data-4.js',
  './js/vocab-data-5.js',
  './js/vocab-data-6.js',
  './js/vocab-data-7.js',
  './js/vocab-data-8.js',
  './js/vocab-data-9.js',
  './js/vocab-data-10.js',
  './js/vocab-data-11.js',
  './js/vocab-data-12.js',
  './js/vocab-data-13.js',
  './js/vocab-data-14.js',
  './js/vocab-data-15.js',
  './js/vocab-data-16.js',
  './js/vocab-concat.js',
  './js/tc-data.js',
  './js/tc-data-2.js',
  './js/se-data.js',
  './js/se-data-2.js',
  './js/rc-data.js',
  './js/rc-data-2.js'
];

self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(ASSETS)).then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k)))
    ).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', e => {
  // Network-first for HTML (to get updates), cache-first for everything else
  if (e.request.mode === 'navigate') {
    e.respondWith(
      fetch(e.request).then(response => {
        const clone = response.clone();
        caches.open(CACHE_NAME).then(cache => cache.put(e.request, clone));
        return response;
      }).catch(() => caches.match(e.request))
    );
  } else {
    e.respondWith(
      caches.match(e.request).then(cached => cached || fetch(e.request))
    );
  }
});
