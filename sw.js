const CACHE_NAME='fintrack-pwa-v50';
const SHELL=['./','./index.html','./manifest.webmanifest?v=43','./runtime-config.js?v=44','./savings-audit-v42.js?v=50','./fintrack-icon-192.svg?v=35','./fintrack-icon-512.svg?v=35'];
self.addEventListener('install',event=>{event.waitUntil(caches.open(CACHE_NAME).then(cache=>cache.addAll(SHELL)).then(()=>self.skipWaiting()))});
self.addEventListener('activate',event=>{event.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(k=>k!==CACHE_NAME).map(k=>caches.delete(k)))).then(()=>self.clients.claim()))});
self.addEventListener('message',event=>{if(event.data&&event.data.type==='SKIP_WAITING')self.skipWaiting()});
self.addEventListener('fetch',event=>{
 if(event.request.method!=='GET')return;const url=new URL(event.request.url);if(url.origin!==self.location.origin)return;
 if(url.pathname.endsWith('/runtime-config.js')||url.pathname.endsWith('/savings-audit-v42.js')){event.respondWith(fetch(event.request,{cache:'no-store'}).catch(()=>caches.match(event.request)));return}
 if(event.request.mode==='navigate'){event.respondWith(fetch(event.request,{cache:'no-store'}).then(r=>{const c=r.clone();caches.open(CACHE_NAME).then(x=>x.put('./index.html',c));return r}).catch(()=>caches.match('./index.html')));return}
 event.respondWith(fetch(event.request,{cache:'no-store'}).then(r=>{const c=r.clone();caches.open(CACHE_NAME).then(x=>x.put(event.request,c));return r}).catch(()=>caches.match(event.request)));
});