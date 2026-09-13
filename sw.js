/**
 * DARSHAN PASS PORTAL - SERVICE WORKER
 * Ayodhya Police - Smart Cell Ayodhya
 */

const CACHE_NAME = 'darshan-pass-v2.9';
const STATIC_ASSETS = [
  './',
  './index.html',
  './style.css',
  './style.css?v=3.5',
  './script.js',
  './script.js?v=3.7',
  './manifest.json',
  './assets/up_police_logo.png',
  './assets/icon-192.png',
  './assets/icon-512.png',
  './assets/icon-maskable-192.png',
  './assets/icon-maskable-512.png',
  './assets/apple-touch-icon.png'
];

// 1. Install Event: Cache essential shell assets
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(STATIC_ASSETS);
    }).then(() => self.skipWaiting())
  );
});

// 2. Activate Event: Clean up outdated caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) {
            return caches.delete(key);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

// 3. Fetch Event: Network-first for HTML & dynamic requests, Cache-first for static assets
self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url);

  // Skip non-GET requests, all Google domains (including script.googleusercontent.com), and external CDNs
  if (
    event.request.method !== 'GET' || 
    url.hostname.includes('google') || 
    url.hostname.includes('gstatic') ||
    url.hostname.includes('cloudflare') ||
    url.hostname.includes('fontawesome')
  ) {
    return;
  }

  // Network-First for HTML navigation to ensure users instantly get the latest layout
  const isHtml = event.request.mode === 'navigate' || 
                 url.pathname.endsWith('.html') || 
                 url.pathname === '/' || 
                 url.pathname === '';

  if (isHtml) {
    event.respondWith(
      fetch(event.request).then((networkResponse) => {
        if (networkResponse && networkResponse.status === 200) {
          const responseToCache = networkResponse.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(event.request, responseToCache));
        }
        return networkResponse;
      }).catch(() => caches.match(event.request))
    );
    return;
  }

  // Cache-first / Stale-while-revalidate for versioned static assets
  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      const fetchPromise = fetch(event.request).then((networkResponse) => {
        if (networkResponse && networkResponse.status === 200) {
          const responseToCache = networkResponse.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, responseToCache);
          });
        }
        return networkResponse;
      }).catch(() => cachedResponse);

      return cachedResponse || fetchPromise;
    })
  );
});
