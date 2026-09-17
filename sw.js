const CACHE_NAME='fintrack-pwa-v79';
self.addEventListener('install',event=>{self.skipWaiting()});
self.addEventListener('activate',event=>{event.waitUntil(caches.keys().then(keys=>Promise.all(keys.map(k=>caches.delete(k)))).then(()=>self.clients.claim()))});
self.addEventListener('fetch',event=>{
  if(event.request.method!=='GET')return;
  const url=new URL(event.request.url);if(url.origin!==self.location.origin)return;
  if(url.pathname.endsWith('/runtime-config.js')){
    event.respondWith(Promise.all([
      fetch(event.request,{cache:'no-store'}).then(r=>r.text()),
      fetch('./v73.js?v=79',{cache:'no-store'}).then(r=>r.text()),
      fetch('./v76.js?v=79',{cache:'no-store'}).then(r=>r.text()),
      fetch('./v77.js?v=79',{cache:'no-store'}).then(r=>r.text()),
      fetch('./v78.js?v=79',{cache:'no-store'}).then(r=>r.text()),
      fetch('./v79.js?v=79',{cache:'no-store'}).then(r=>r.text())
    ]).then(([base,v73,v76,v77,v78,v79])=>new Response(base+'\n'+v73+'\n'+v76+'\n'+v77+'\n'+v78+'\n'+v79,{headers:{'Content-Type':'application/javascript; charset=utf-8','Cache-Control':'no-store'}})));
    return;
  }
  event.respondWith(fetch(event.request,{cache:'no-store'}));
});