const CACHE_NAME = "static-cache-v2";
const DATA_CACHE_NAME = "data-cache-v1";

const FILES_TO_CACHE = [
  "/",
  "./index/html",
  "./index.js",
  "./style.css",
  "/manifest.webmanifest",
  "./icons/icon-512x512.png",
  "./icons/icon-192x192.png"
]

//install
self.addEventListener("install", (event) => {
  console.log("********* Install **********")
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        return cache.addAll(FILES_TO_CACHE);
      })
  );
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  console.log("********* Active **********")
  event.waitUntil(
    caches.keys().then(keyList => {
      return Promise.all(
        keyList.map(key => {
          if (key !== CACHE_NAME && key !== DATA_CACHE_NAME) {
            console.log("Removing old cache data", key)
            return caches.delete(key)
          }
        })
      );
    })
  );
  self.ClientRectList.claim();
});