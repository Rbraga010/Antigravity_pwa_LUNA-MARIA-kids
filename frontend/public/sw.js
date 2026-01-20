// Basic Service Worker for PWA Installation Requirements
const CACHE_NAME = 'luna-maria-v2';

self.addEventListener('install', (event) => {
    // Force the waiting service worker to become the active service worker.
    self.skipWaiting();
});

self.addEventListener('activate', (event) => {
    // Claim any currently open clients.
    event.waitUntil(clients.claim());
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
