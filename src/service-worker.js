var CACHE_NAME = "mtts-cache-v3";
var urlsToCache = [
  "/mars-15/",
  "/mars-15/assets/css/screen.css",
  "/mars-15/assets/images/currentLoc-sprite.png",
  "/mars-15/assets/images/Lightspeed.png",
  "/mars-15/assets/images/noise.png",
  "/mars-15/assets/images/pod.png",
  "/mars-15/assets/images/tmp-icon.png",
  "/mars-15/assets/js/components/authentication.js",
  "/mars-15/assets/js/components/friends.js",
  "/mars-15/assets/js/components/leaflet-color-markers.js",
  "/mars-15/assets/js/components/map.js",
  "/mars-15/assets/js/components/navigation.js",
  "/mars-15/assets/js/components/notification.js",
  "/mars-15/assets/js/components/package.js",
  "/mars-15/assets/js/components/pod-order.js",
  "/mars-15/assets/js/components/points.js",
  "/mars-15/assets/js/components/quick-access.js",
  "/mars-15/assets/js/components/report.js",
  "/mars-15/assets/js/components/searchbar.js",
  "/mars-15/assets/js/components/settings.js",
  "/mars-15/assets/js/components/subscription.js",
  "/mars-15/assets/js/components/user.js",
  "/mars-15/assets/js/cache.js",
  "/mars-15/assets/js/main.js",
  "/mars-15/assets/js/templates.js",
  "/mars-15/assets/js/api.js",
];

// var urlsToCache = [
//   "/",
//   "/manifest.webmanifest",
//   "/assets/css/screen.css",
//   "/assets/images/currentLoc-sprite.png",
//   "/assets/images/Lightspeed.png",
//   "/assets/images/noise.png",
//   "/assets/images/pod.png",
//   "/assets/images/tmp-icon.png",
//   "/assets/js/components/authentication.js",
//   "/assets/js/components/friends.js",
//   "/assets/js/components/leaflet-color-markers.js",
//   "/assets/js/components/map.js",
//   "/assets/js/components/navigation.js",
//   "/assets/js/components/notification.js",
//   "/assets/js/components/package.js",
//   "/assets/js/components/pod-order.js",
//   "/assets/js/components/points.js",
//   "/assets/js/components/quick-access.js",
//   "/assets/js/components/report.js",
//   "/assets/js/components/searchbar.js",
//   "/assets/js/components/settings.js",
//   "/assets/js/components/subscription.js",
//   "/assets/js/components/user.js",
//   "/assets/js/cache.js",
//   "/assets/js/main.js",
//   "/assets/js/templates.js",
//   "/assets/js/api.js",
// ];

self.addEventListener("install", function (event) {
  // Perform install steps
  event.waitUntil(
    caches.open(CACHE_NAME).then(function (cache) {
      return cache.addAll(urlsToCache.map((url) => new Request(url)));
    })
  );
});

self.addEventListener("fetch", function (event) {
  event.respondWith(
    caches.match(event.request).then(function (response) {
      return response || fetch(event.request);
    })
  );
});
