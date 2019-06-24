cacheName = 'borrowd-v1';

self.addEventListener('install', function(event) {
  event.waitUntil(
    caches.open(cacheName).then(function(cache) {
      return cache.addAll(['/noServer']);
    })
  );
});

self.addEventListener('fetch', function(event) {
  event.respondWith(
    // Try the cache
    caches
      .match(event.request)
      .then(function(response) {
        if (response) {
          return response;
        }
        return fetch(event.request).then(function(response) {
          if (!response.ok) {
            return caches.match('/noServer');
          }
          return response;
        });
      })
      .catch(function() {
        // If both fail, show a generic fallback:
        return caches.match('/noServer');
      })
  );
});
