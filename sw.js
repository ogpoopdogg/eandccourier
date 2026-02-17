// Updated cache name to force the browser to recognize a change
const cacheName = 'eandc-pickup-cache-v2';

// Files to cache
const assetsToCache = [
  './',
  './customer.html',   // Ensures your form is cached
  './manifest.json',
  './icon-512.png',
  './icon2.png'        // Caches the logo if you have it
];

// Install event - caches files and forces activation
self.addEventListener('install', event => {
  self.skipWaiting(); // Forces this new worker to take over immediately
  event.waitUntil(
    caches.open(cacheName).then(cache => {
      return cache.addAll(assetsToCache);
    })
  );
});

// Activate event - CLEANS UP OLD CACHES (Fixes your "Client Portal" text issue)
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys => Promise.all(
      keys.map(key => {
        if (key !== cacheName) {
          console.log('Clearing old cache', key);
          return caches.delete(key);
        }
      })
    ))
  );
  return self.clients.claim(); // Takes control of all open clients instantly
});

// Fetch event - serve cached files if offline, otherwise fetch from network
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request).then(response => {
      return response || fetch(event.request);
    })
  );
});
