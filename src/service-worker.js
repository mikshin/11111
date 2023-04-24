/* eslint-disable no-undef, no-restricted-globals */

// self.addEventListener("message", (event) => {
//   console.log(event);
//   if (event.data && event.data.type === "SKIP_WAITING") {
//     self.skipWaiting();
//   }
// });

self.addEventListener('fetch', function (event) {
  event.respondWith(
      fetch(event.request).catch(function() {
          return caches.match(event.request)
      })
  )
})
workbox.clientsClaim();

// The precaching code provided by Workbox.
self.__precacheManifest = [].concat(self.__precacheManifest || []);
workbox.precaching.suppressWarnings();
workbox.precaching.precacheAndRoute(self.__precacheManifest, {});
