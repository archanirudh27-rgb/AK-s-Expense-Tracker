window.EXPENSE_APP_CONFIG={SUPABASE_URL:'https://mqsvpkbgsjsstzaeupwz.supabase.co',SUPABASE_ANON_KEY:'sb_publishable_BuCMOgg-5hzw53NBSkHTPA_wL0zp9z_'};

/* Visual upgrade: Poppins + persistent light/dark mode. Loaded before the app so it survives page re-renders. */
(function(){
  const font=document.createElement('link');
  font.rel='preconnect';font.href='https://fonts.googleapis.com';document.head.appendChild(font);
  const font2=document.createElement('link');
  font2.rel='preconnect';font2.href='https://fonts.gstatic.com';font2.crossOrigin='anonymous';document.head.appendChild(font2);
  const gf=document.createElement('link');
  gf.rel='stylesheet';gf.href='https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700;800&display=swap';document.head.appendChild(gf);

  const css=document.createElement('style');
  css.id='ak-theme-upgrade';
  css.textContent=`
    html,body{font-family:'Poppins',system-ui,-apple-system,'Segoe UI',sans-serif!important}
    .brand{font-family:'Poppins',system-ui,sans-serif!important;letter-spacing:-.4px}
    .value,.big{font-family:'Poppins',system-ui,sans-serif!important}
    .theme-toggle{margin-left:auto;border:1px solid rgba(255,255,255,.22);background:rgba(255,255,255,.10);color:#fff;border-radius:999px;padding:8px 12px;font:600 11px Poppins,sans-serif;cursor:pointer;white-space:nowrap}
    .ak-top-row{display:flex;align-items:center;gap:12px}
    body.dark{--ink:#f3f3ee;--muted:#a9ada5;--bg:#111411;--line:#353a35;--gold:#d2a65b;--green:#8db08a;--red:#df8178;background:#111411;color:#f3f3ee}
    body.dark .app{background:#171a17;color:#f3f3ee}
    body.dark .top{background:#0d0f0d;color:#fff}
    body.dark .nav{background:#20241f;border-color:#353a35}
    body.dark .nav button,.dark .bottom button{color:#b8bcb5}
    body.dark .nav .active{background:#f3f3ee;color:#151815}
    body.dark .bottom{background:#171a17;border-color:#353a35}
    body.dark .card{background:#20241f;border-color:#353a35;color:#f3f3ee}
    body.dark .hero{background:linear-gradient(135deg,#27251e,#20241f)}
    body.dark .input,body.dark .select,body.dark .typebox{background:#151815;color:#f3f3ee;border-color:#464b45}
    body.dark .input::placeholder{color:#777d75}
    body.dark .btn.secondary{background:#20241f;color:#f3f3ee;border-color:#464b45}
    body.dark .table td{border-color:#30352f}
    body.dark .table th{border-color:#353a35}
    body.dark .progress{background:#343a33}
    body.dark .empty{color:#a9ada5}
    body.dark .notice{background:#40371f;border-color:#6d5b31}
    body.dark .notice.ok{background:#263827;border-color:#3d5d3d}
    body.dark .notice.err{background:#422724;border-color:#6b3b36}
    body.dark .fixed{background:#514323;color:#f0d18f}
    body.dark .variable{background:#29402b;color:#b7d4b2}
    body.dark .non{background:#492b28;color:#efaaa2}
    body.dark .uncertain{background:#343732;color:#c8ccc4}
    @media(max-width:650px){.theme-toggle{padding:7px 10px;font-size:10px}.ak-top-row{gap:7px}.theme-toggle{margin-left:auto}}
  `;
  document.head.appendChild(css);

  function applyTheme(){
    const mode=localStorage.getItem('ak_theme')||'light';
    document.body.classList.toggle('dark',mode==='dark');
    const b=document.getElementById('ak-theme-toggle');
    if(b)b.textContent=mode==='dark'?'☀ Light':'☾ Dark';
  }
  window.akToggleTheme=function(){
    const next=(localStorage.getItem('ak_theme')||'light')==='dark'?'light':'dark';
    localStorage.setItem('ak_theme',next);applyTheme();
  };
  function inject(){
    applyTheme();
    const top=document.querySelector('.top');
    if(!top||document.getElementById('ak-theme-toggle'))return;
    const brand=top.querySelector('.brand');
    const sub=top.querySelector('.sub');
    const row=document.createElement('div');row.className='ak-top-row';
    if(brand)row.appendChild(brand);
    const btn=document.createElement('button');btn.id='ak-theme-toggle';btn.className='theme-toggle';btn.onclick=window.akToggleTheme;row.appendChild(btn);
    if(brand){top.insertBefore(row,brand);row.appendChild(brand);if(sub)top.appendChild(sub)}else{top.appendChild(row)}
    applyTheme();
  }
  const observer=new MutationObserver(inject);
  observer.observe(document.documentElement,{childList:true,subtree:true});
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',inject);else inject();
})();
