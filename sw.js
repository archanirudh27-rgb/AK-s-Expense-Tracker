const CACHE_NAME='fintrack-pwa-v39';
const SHELL=['./','./index.html','./manifest.webmanifest?v=35','./runtime-config.js?v=34','./balance-fix-v39.js?v=39','./fintrack-icon-192.svg?v=35','./fintrack-icon-512.svg?v=35'];
self.addEventListener('install',event=>{event.waitUntil(caches.open(CACHE_NAME).then(cache=>cache.addAll(SHELL)).then(()=>self.skipWaiting()))});
self.addEventListener('activate',event=>{event.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(k=>k!==CACHE_NAME).map(k=>caches.delete(k)))).then(()=>self.clients.claim()))});
self.addEventListener('message',event=>{if(event.data&&event.data.type==='SKIP_WAITING')self.skipWaiting()});
self.addEventListener('fetch',event=>{
  if(event.request.method!=='GET')return;
  const url=new URL(event.request.url);
  if(url.origin!==self.location.origin)return;
  if(url.pathname.endsWith('/runtime-config.js')){
    event.respondWith(fetch('./runtime-config.js?v=34',{cache:'no-store'}).then(response=>{const copy=response.clone();caches.open(CACHE_NAME).then(cache=>cache.put(event.request,copy));return response}).catch(()=>caches.match(event.request)));
    return;
  }
  if(event.request.mode==='navigate'){
    event.respondWith(fetch(event.request,{cache:'no-store'}).then(async response=>{
      const text=await response.text();
      const withoutOld=text.replace(/<script src="\.\/balance-fix-v3[78]\.js\?v=3[78]"><\/script>/g,'');
      const injected=withoutOld.includes('balance-fix-v39.js')?withoutOld:withoutOld.replace('</body>','<script src="./balance-fix-v39.js?v=39"></script></body>');
      const rewritten=new Response(injected,{status:response.status,statusText:response.statusText,headers:{'Content-Type':'text/html; charset=utf-8'}});
      const copy=rewritten.clone();caches.open(CACHE_NAME).then(cache=>cache.put('./index.html',copy));return rewritten;
    }).catch(()=>caches.match('./index.html')));
    return;
  }
  event.respondWith(fetch(event.request,{cache:'no-store'}).then(response=>{const copy=response.clone();caches.open(CACHE_NAME).then(cache=>cache.put(event.request,copy));return response}).catch(()=>caches.match(event.request)));
});