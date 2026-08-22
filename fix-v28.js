(function(){
  const THEME_KEY='fintrack_theme';
  const PAGE_KEY='fintrack_last_page';
  const valid={home:'home',transactions:'tx',txns:'tx','add expense':'add',add:'add',forecast:'forecast',settings:'settings',income:'income'};

  function isDark(){return localStorage.getItem(THEME_KEY)==='dark'}
  function applyTheme(dark){
    document.body.classList.toggle('dark',dark);
    localStorage.setItem(THEME_KEY,dark?'dark':'light');
    const b=document.getElementById('fin-theme-toggle');
    if(b)b.textContent=dark?'☀ Light':'☾ Dark';
  }
  window.fintrackToggleTheme=function(){applyTheme(!document.body.classList.contains('dark'))};

  const css=document.createElement('style');
  css.textContent=`
    .top{position:relative!important;padding-right:110px!important}
    #fin-theme-toggle{position:absolute;right:18px;top:18px;border:1px solid rgba(255,255,255,.28);background:rgba(255,255,255,.10);color:#fff;border-radius:999px;padding:8px 13px;font:600 11px Poppins,system-ui,sans-serif;cursor:pointer;z-index:30}
    .fin-brand-lockup{display:inline-flex;align-items:center;gap:9px}.fin-brand-icon{width:32px;height:32px;border-radius:8px}.fin-wordmark{font:700 24px Poppins,system-ui,sans-serif;letter-spacing:-.045em}.fin-word-gold{color:#d6a33f}
    body.dark{background:#0f120f!important;color:#f3f3ee!important}body.dark .app{background:#0f120f!important;color:#f3f3ee!important}body.dark .top{background:linear-gradient(135deg,#0b0d0b,#181d17)!important}body.dark .nav{background:#151915!important}body.dark .nav button{color:#b9bdb5!important}body.dark .nav .active{background:#f2f2ec!important;color:#151815!important}body.dark .card{background:#1a1e1a!important;border-color:#303530!important;color:#f3f3ee!important}body.dark .hero{background:linear-gradient(135deg,#25231c,#1b201b)!important}body.dark .input,body.dark .select,body.dark .typebox{background:#121512!important;color:#f3f3ee!important;border-color:#414740!important}body.dark .btn.secondary{background:#1a1e1a!important;color:#f3f3ee!important;border-color:#414740!important}body.dark .progress{background:#303630!important}body.dark .bottom{background:#171b17!important;border-color:#303530!important}
    @media(max-width:650px){.top{padding-right:92px!important}#fin-theme-toggle{right:12px;top:14px;padding:7px 10px;font-size:10px}.fin-brand-icon{width:29px;height:29px}.fin-wordmark{font-size:20px}}
  `;
  document.head.appendChild(css);

  let restored=false;
  function ensureUI(){
    document.title='FinTrack';
    applyTheme(isDark());
    document.querySelectorAll('.brand').forEach(el=>{
      if(!el.querySelector('.fin-brand-lockup')) el.innerHTML='<span class="fin-brand-lockup"><img class="fin-brand-icon" src="./fintrack-icon-192.svg?v=28" alt="FinTrack"><span class="fin-wordmark">Fin<span class="fin-word-gold">Track</span></span></span>';
    });
    document.querySelectorAll('.sub').forEach(el=>{el.innerHTML=el.innerHTML.replace(/AK FinTrack/g,'FinTrack').replace(/Personal finance/g,'Personal Finance')});
    const top=document.querySelector('.top');
    if(top){
      let b=document.getElementById('fin-theme-toggle');
      if(!b){b=document.createElement('button');b.id='fin-theme-toggle';top.appendChild(b)}
      b.onclick=window.fintrackToggleTheme;
      b.textContent=document.body.classList.contains('dark')?'☀ Light':'☾ Dark';
    }
    if(!restored&&document.querySelector('.app')){
      const saved=localStorage.getItem(PAGE_KEY);
      if(saved&&saved!=='home'&&typeof window.go==='function'){
        restored=true;
        setTimeout(()=>window.go(saved),0);
      } else if(saved==='home'||!saved) restored=true;
    }
  }

  document.addEventListener('click',function(e){
    const b=e.target.closest('.nav button,.bottom button');
    if(!b)return;
    const t=(b.textContent||'').trim().toLowerCase().replace(/\s+/g,' ');
    for(const [label,p] of Object.entries(valid)){
      if(t===label||t.endsWith(label)){localStorage.setItem(PAGE_KEY,p);break}
    }
  },true);

  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',ensureUI);else ensureUI();
  new MutationObserver(()=>requestAnimationFrame(ensureUI)).observe(document.documentElement,{childList:true,subtree:true});
})();