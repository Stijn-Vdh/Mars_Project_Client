var CACHE_NAME = 'mtts-cache-v1';
var urlsToCache = [
  '/',
  '/assets/css/screen.css',
  '/assets/js/main.js',
  '/assets/js/friends.js',
  '/assets/js/templates.js',
  '/assets/js/api.js',
  '/assets/js/user.js',
];

self.addEventListener('install', function(event) {
    // Perform install steps
    event.waitUntil(
      caches.open(CACHE_NAME)
        .then(function(cache) {
          console.log('Opened cache');
          return cache.addAll(urlsToCache);
        })
    );
  });

self.addEventListener('activate', function(event) {
    // Perform some task
});