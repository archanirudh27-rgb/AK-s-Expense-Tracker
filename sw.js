const CACHE_NAME='fintrack-pwa-v43';
const SHELL=['./','./index.html','./manifest.webmanifest?v=43','./runtime-config.js?v=43','./balance-fix-v40.js?v=40','./savings-audit-v42.js?v=42','./fintrack-icon-192.svg?v=35','./fintrack-icon-512.svg?v=35'];
self.addEventListener('install',event=>{event.waitUntil(caches.open(CACHE_NAME).then(cache=>cache.addAll(SHELL)).then(()=>self.skipWaiting()))});
self.addEventListener('activate',event=>{event.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(k=>k!==CACHE_NAME).map(k=>caches.delete(k)))).then(()=>self.clients.claim()))});
self.addEventListener('message',event=>{if(event.data&&event.data.type==='SKIP_WAITING')self.skipWaiting()});
self.addEventListener('fetch',event=>{
  if(event.request.method!=='GET')return;
  const url=new URL(event.request.url);
  if(url.origin!==self.location.origin)return;
  if(url.pathname.endsWith('/runtime-config.js')){
    event.respondWith(fetch('./runtime-config.js?v=43',{cache:'no-store'}).then(r=>{const c=r.clone();caches.open(CACHE_NAME).then(x=>x.put(event.request,c));return r}).catch(()=>caches.match(event.request)));
    return;
  }
  if(event.request.mode==='navigate'){
    event.respondWith(fetch(event.request,{cache:'no-store'}).then(async r=>{
      let t=await r.text();
      t=t.replace(/<style id="fintrack-boot-guard">[\s\S]*?<\/style>/g,'')
         .replace(/<script id="fintrack-reveal-guard">[\s\S]*?<\/script>/g,'')
         .replace(/<script src="\.\/balance-fix-v(?:37|38|39)\.js\?v=(?:37|38|39)"><\/script>/g,'')
         .replace(/<script src="\.\/savings-audit-v4[12]\.js\?v=4[12]"><\/script>/g,'');

      const guard='<style id="fintrack-boot-guard">#root{visibility:hidden!important}html,body{background:#0d100d}</style>';
      t=t.replace('</head>',guard+'</head>');

      if(!t.includes('balance-fix-v40.js'))t=t.replace('</body>','<script src="./balance-fix-v40.js?v=40"></script></body>');
      t=t.replace('</body>','<script src="./savings-audit-v42.js?v=42"></script></body>');

      const reveal=`<script id="fintrack-reveal-guard">(function(){let n=0;const show=function(){const g=document.getElementById('fintrack-boot-guard');if(g)g.remove();const r=document.getElementById('root');if(r)r.style.visibility='visible'};const t=setInterval(function(){n++;if((window.__fintrackTypeCompatInstalled&&window.__fintrackSavingsInstalled&&window.__fintrackLayoutV32&&window.__fintrackBalanceV40Installed&&window.__audit42)||n>160){clearInterval(t);show()}},25);window.addEventListener('load',function(){setTimeout(show,1200)},{once:true})})();</script>`;
      t=t.replace('</body>',reveal+'</body>');

      const rr=new Response(t,{status:r.status,statusText:r.statusText,headers:{'Content-Type':'text/html; charset=utf-8','Cache-Control':'no-store'}});
      const c=rr.clone();caches.open(CACHE_NAME).then(x=>x.put('./index.html',c));
      return rr;
    }).catch(()=>caches.match('./index.html')));
    return;
  }
  event.respondWith(fetch(event.request,{cache:'no-store'}).then(r=>{const c=r.clone();caches.open(CACHE_NAME).then(x=>x.put(event.request,c));return r}).catch(()=>caches.match(event.request)));
});