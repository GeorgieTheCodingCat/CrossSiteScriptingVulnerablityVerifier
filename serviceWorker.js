
//Global Variables
//Cache and Assets
//see developer docs:
//https://developers.google.com/web/fundamentals/primers/service-workers

var cache = "pwa";
const assets = [
  "/",
  "/icons",
  "/app.js",
  "/index.html",
  "/index.css",
  "/buttons.js",,
  "/images/Checklist.png",
  "/images/magGlass.png",
  "/images/stop.png"
];

//install event
self.addEventListener("install", installEvent =>
{
  installEvent.waitUntil(
    caches.open(cache).then(cache => 
      {
      cache.addAll(assets);
    })
  );
});

self.addEventListener("fetch", fetchEvent => 
{
  fetchEvent.respondWith(
    caches.match(fetchEvent.request).then(res => 
      {
      return res || fetch(fetchEvent.request);
    })
  );
});
