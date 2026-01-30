// Basic Service Worker for PWA Installation Requirements
const CACHE_NAME = 'luna-maria-v4-optimization';

self.addEventListener('install', (event) => {
    // Force the waiting service worker to become the active service worker.
    self.skipWaiting();
    // Clear old caches on install
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames.map((cacheName) => {
                    if (cacheName !== CACHE_NAME) {
                        console.log('Deleting old cache:', cacheName);
                        return caches.delete(cacheName);
                    }
                })
            );
        })
    );
});

self.addEventListener('activate', (event) => {
    // Claim any currently open clients and clear old caches.
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all([
                ...cacheNames.map((cacheName) => {
                    if (cacheName !== CACHE_NAME) {
                        return caches.delete(cacheName);
                    }
                }),
                clients.claim()
            ]);
        })
    );
});

self.addEventListener('fetch', (event) => {
    // Standard fetch handler to satisfy PWA criteria.
    // We don't perform heavy caching here to ensure the most up-to-date content
    // and avoid installation issues due to missing assets in cache.
    event.respondWith(
        fetch(event.request).catch(() => {
            return caches.match(event.request);
        })
    );
});
