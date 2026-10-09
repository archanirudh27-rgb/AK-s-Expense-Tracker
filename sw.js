/* v86: update controller; app assets load independently, never assembled in fetch. */
self.addEventListener('install',function(event){self.skipWaiting()});
self.addEventListener('activate',function(event){
  event.waitUntil(
    caches.keys()
      .then(function(keys){return Promise.all(keys.filter(function(k){return k.startsWith('fintrack-pwa-')}).map(function(k){return caches.delete(k)}))})
      .then(function(){return self.clients.claim()})
  );
});
