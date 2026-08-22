const CACHE_NAME='fintrack-pwa-v28';
const SHELL=['./','./index.html','./manifest.webmanifest?v=28','./config.js?v=28','./fix-v28.js?v=28','./fintrack-icon-192.svg?v=28','./fintrack-icon-512.svg?v=28','./latest-ui.js?v=28','./forecast.js?v=28','./investment-overlay.js?v=28','./income.js?v=28'];
self.addEventListener('install',event=>{event.waitUntil(caches.open(CACHE_NAME).then(cache=>cache.addAll(SHELL)).then(()=>self.skipWaiting()))});
self.addEventListener('activate',event=>{event.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(k=>k!==CACHE_NAME).map(k=>caches.delete(k)))).then(()=>self.clients.claim()))});
self.addEventListener('message',event=>{if(event.data&&event.data.type==='SKIP_WAITING')self.skipWaiting()});
self.addEventListener('fetch',event=>{
  if(event.request.method!=='GET')return;
  const url=new URL(event.request.url);
  if(url.origin!==self.location.origin)return;
  event.respondWith(fetch(event.request,{cache:'no-store'}).then(async response=>{
    let out=response;
    if(event.request.mode==='navigate'||url.pathname.endsWith('/')||url.pathname.endsWith('/index.html')){
      let text=await response.clone().text();
      text=text.replaceAll("AK's Expense Tracker",'FinTrack').replaceAll('AK FinTrack','FinTrack');
      text=text.replace('<script src="config.js"></script>','<script src="./fix-v28.js?v=28"></script><script src="config.js?v=28"></script>');
      text=text.replaceAll('./latest-ui.js?v=18','./latest-ui.js?v=28').replaceAll('./investment-overlay.js?v=18','./investment-overlay.js?v=28').replaceAll('./income.js?v=18','./income.js?v=28');
      const headers=new Headers(response.headers);headers.set('content-type','text/html; charset=utf-8');
      out=new Response(text,{status:response.status,statusText:response.statusText,headers});
    }
    const copy=out.clone();caches.open(CACHE_NAME).then(cache=>cache.put(event.request,copy));return out;
  }).catch(()=>caches.match(event.request).then(r=>r||caches.match('./index.html'))));
});