const CACHE = 'trackplus-v1';
const OFFLINE_URLS = ['/'];

self.addEventListener('install', ev => {
  ev.waitUntil(
    caches.open(CACHE).then(c => c.addAll(OFFLINE_URLS)).then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', ev => {
  ev.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))
    ).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', ev => {
  const { request } = ev;
  const url = new URL(request.url);

  // Never intercept API calls, auth, or cross-origin
  if (url.pathname.startsWith('/api/') || url.origin !== self.location.origin) return;

  // Navigation requests: network-first, fall back to cached shell
  if (request.mode === 'navigate') {
    ev.respondWith(
      fetch(request)
        .then(r => { const c = r.clone(); caches.open(CACHE).then(cache => cache.put(request, c)); return r; })
        .catch(() => caches.match('/'))
    );
    return;
  }

  // Static assets: cache-first
  ev.respondWith(
    caches.match(request).then(cached => {
      if (cached) return cached;
      return fetch(request).then(r => {
        if (r.ok) {
          const c = r.clone();
          caches.open(CACHE).then(cache => cache.put(request, c));
        }
        return r;
      });
    })
  );
});
