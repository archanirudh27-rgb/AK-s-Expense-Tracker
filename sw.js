const CACHE_NAME='fintrack-pwa-v45';
const SHELL=['./','./index.html','./manifest.webmanifest?v=43','./runtime-config.js?v=44','./savings-audit-v42.js?v=44','./home-chart-v45.js?v=45','./fintrack-icon-192.svg?v=35','./fintrack-icon-512.svg?v=35'];
self.addEventListener('install',event=>{event.waitUntil(caches.open(CACHE_NAME).then(cache=>cache.addAll(SHELL)).then(()=>self.skipWaiting()))});
self.addEventListener('activate',event=>{event.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(k=>k!==CACHE_NAME).map(k=>caches.delete(k)))).then(()=>self.clients.claim()))});
self.addEventListener('message',event=>{if(event.data&&event.data.type==='SKIP_WAITING')self.skipWaiting()});
self.addEventListener('fetch',event=>{
  if(event.request.method!=='GET')return;
  const url=new URL(event.request.url);
  if(url.origin!==self.location.origin)return;
  if(url.pathname.endsWith('/runtime-config.js')){
    event.respondWith(fetch(event.request,{cache:'no-store'}).then(async response=>{
      let text=await response.text();
      if(!text.includes('home-chart-v45.js'))text+="\n(function(){var s=document.createElement('script');s.src='./home-chart-v45.js?v=45';document.head.appendChild(s)})();";
      const rewritten=new Response(text,{status:response.status,statusText:response.statusText,headers:{'Content-Type':'application/javascript; charset=utf-8','Cache-Control':'no-store'}});
      const copy=rewritten.clone();caches.open(CACHE_NAME).then(cache=>cache.put(event.request,copy));return rewritten;
    }).catch(()=>caches.match(event.request)));
    return;
  }
  if(url.pathname.endsWith('/savings-audit-v42.js')||url.pathname.endsWith('/home-chart-v45.js')){
    event.respondWith(fetch(event.request,{cache:'no-store'}).then(response=>{const copy=response.clone();caches.open(CACHE_NAME).then(cache=>cache.put(event.request,copy));return response}).catch(()=>caches.match(event.request)));
    return;
  }
  if(event.request.mode==='navigate'){
    event.respondWith(fetch(event.request,{cache:'no-store'}).then(response=>{const copy=response.clone();caches.open(CACHE_NAME).then(cache=>cache.put('./index.html',copy));return response}).catch(()=>caches.match('./index.html')));
    return;
  }
  event.respondWith(fetch(event.request,{cache:'no-store'}).then(response=>{const copy=response.clone();caches.open(CACHE_NAME).then(cache=>cache.put(event.request,copy));return response}).catch(()=>caches.match(event.request)));
});