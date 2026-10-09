/* v83: keep service worker out of app-script assembly; use normal independent script requests. */
self.addEventListener('install',event=>{self.skipWaiting()});
self.addEventListener('activate',event=>{
  event.waitUntil(
    caches.keys()
      .then(keys=>Promise.all(keys.filter(k=>k.startsWith('fintrack-pwa-')).map(k=>caches.delete(k))))
      .then(()=>self.clients.claim())
  );
});
