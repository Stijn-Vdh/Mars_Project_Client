var CACHE_NAME = 'mtts-cache-v2';
var urlsToCache = [
  '/mars-15/',
  '/mars-15/assets/css/screen.css',
  '/mars-15/assets/js/main.js',
  '/mars-15/assets/js/friends.js',
  '/mars-15/assets/js/templates.js',
  '/mars-15/assets/js/api.js',
  '/mars-15/assets/js/user.js',
];

self.addEventListener('install', function(event) {
    // Perform install steps
    event.waitUntil(
      caches.open(CACHE_NAME)
        .then(function(cache) {
          console.log('Opened cache');
          return cache.addAll(urlsToCache.map(url => new Request(url, {credentials: 'same-origin'})));
        })
    );
  });

self.addEventListener('activate', function(event) {
    // Perform some task
});