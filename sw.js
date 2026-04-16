const CACHE_NAME = 'voucher-manager-v2.8.4';
const ASSETS = [
  '/voucher-manager/',
  '/voucher-manager/index.html',
  '/voucher-manager/manifest.json',
  '/voucher-manager/firebase-config.js'
];

self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE_NAME).then(c =>
      Promise.allSettled(ASSETS.map(url => c.add(url)))
    ).then(() => self.skipWaiting())
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
  if (e.request.url.includes('firebaseio.com') ||
      e.request.url.includes('googleapis.com') ||
      e.request.url.includes('gstatic.com')) {
    return;
  }
  e.respondWith(
    fetch(e.request).then(resp => {
      if (resp.ok) {
        const clone = resp.clone();
        caches.open(CACHE_NAME).then(c => c.put(e.request, clone)).catch(() => {});
      }
      return resp;
    }).catch(() => caches.match(e.request))
  );
});
