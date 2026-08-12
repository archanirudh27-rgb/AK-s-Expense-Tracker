window.EXPENSE_APP_CONFIG={SUPABASE_URL:'https://mqsvpkbgsjsstzaeupwz.supabase.co',SUPABASE_ANON_KEY:'sb_publishable_BuCMOgg-5hzw53NBSKHTPA_wL0zp9z_'};

/* Premium visual layer: Poppins, refined spacing/cards, and persistent light/dark mode. */
(function(){
  const font=document.createElement('link');
  font.rel='preconnect';font.href='https://fonts.googleapis.com';document.head.appendChild(font);
  const font2=document.createElement('link');
  font2.rel='preconnect';font2.href='https://fonts.gstatic.com';font2.crossOrigin='anonymous';document.head.appendChild(font2);
  const gf=document.createElement('link');
  gf.rel='stylesheet';gf.href='https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700;800&display=swap';document.head.appendChild(gf);

  const css=document.createElement('style');
  css.id='ak-premium-theme';
  css.textContent=`
    :root{
      --ink:#171a17;--muted:#747970;--bg:#f3f2ed;--line:#e2e0d8;
      --card:#fff;--surface:#f8f7f2;--gold:#ad7d3b;--green:#4d704f;--red:#9b4038;
      --soft-shadow:0 8px 30px rgba(25,28,24,.065);
    }
    *{font-family:'Poppins',system-ui,-apple-system,'Segoe UI',sans-serif!important}
    body{background:var(--bg)!important;color:var(--ink)!important;letter-spacing:-.01em}
    .app{background:var(--bg)!important;max-width:1180px!important}
    .top{
      background:linear-gradient(135deg,#151814 0%,#252a24 100%)!important;
      padding:22px 24px 19px!important;
      border-bottom:1px solid rgba(255,255,255,.06);
    }
    .brand{font-family:'Poppins',sans-serif!important;font-size:25px!important;font-weight:700!important;letter-spacing:-.045em!important}
    .sub{font-family:'Poppins',sans-serif!important;opacity:.72}
    .nav{
      background:rgba(243,242,237,.94)!important;
      border-bottom:1px solid var(--line)!important;
      padding:9px 14px!important;gap:6px!important;
      backdrop-filter:blur(14px);
    }
    .nav button{font-weight:600!important;border-radius:10px!important;transition:.18s ease}
    .nav button:hover{background:rgba(23,26,23,.06)}
    .nav .active{box-shadow:0 4px 13px rgba(23,26,23,.14)!important}
    .main{padding:18px!important}
    .card{
      background:var(--card)!important;border:1px solid var(--line)!important;
      border-radius:18px!important;box-shadow:var(--soft-shadow)!important;
      padding:18px!important;
    }
    .hero{
      background:linear-gradient(135deg,#faf3e8 0%,#fffdf9 100%)!important;
      border-color:#eadfcd!important;
    }
    .label,.section{font-weight:700!important;letter-spacing:.085em!important}
    .value,.big{font-family:'Poppins',sans-serif!important;font-weight:700!important;letter-spacing:-.045em!important}
    .value{font-size:22px!important}.big{font-size:30px!important}
    .muted{line-height:1.55}
    .input,.select,.typebox{
      border:1px solid #d5d3ca!important;border-radius:11px!important;
      padding:12px 13px!important;background:#fff!important;
      transition:border-color .18s ease,box-shadow .18s ease;
    }
    .input:focus,.select:focus{outline:none!important;border-color:#a9a69b!important;box-shadow:0 0 0 3px rgba(173,125,59,.12)!important}
    .btn{
      border-radius:11px!important;font-weight:600!important;padding:11px 15px!important;
      transition:transform .15s ease,box-shadow .15s ease,opacity .15s ease;
    }
    .btn:hover{transform:translateY(-1px);box-shadow:0 5px 14px rgba(23,26,23,.12)}
    .btn.gold{background:linear-gradient(135deg,#b68442,#9d6d31)!important}
    .monthbar{margin:4px 0 15px!important}
    .monthbar b{font-weight:700!important;min-width:145px;text-align:center}
    .progress{height:8px!important;background:#e9e7df!important;border-radius:99px!important}
    .progress i{border-radius:99px!important}
    .table th{font-weight:700!important;letter-spacing:.08em!important}
    .table td{font-weight:500}
    .badge{font-weight:600!important}
    .notice{border-radius:12px!important}
    .theme-toggle{
      margin-left:auto;border:1px solid rgba(255,255,255,.2);
      background:rgba(255,255,255,.09);color:#fff;border-radius:999px;
      padding:8px 12px;font:600 11px Poppins,sans-serif;cursor:pointer;
      white-space:nowrap;backdrop-filter:blur(10px);transition:.18s ease;
    }
    .theme-toggle:hover{background:rgba(255,255,255,.17);transform:translateY(-1px)}
    .ak-top-row{display:flex;align-items:center;gap:12px;width:100%}
    body.dark{
      --ink:#f3f3ee;--muted:#a9ada5;--bg:#101310;--line:#303530;
      --gold:#d0a158;--green:#8db08a;--red:#df8178;background:#101310;color:#f3f3ee;
    }
    body.dark .app{background:#101310!important;color:#f3f3ee}
    body.dark .top{background:linear-gradient(135deg,#0c0e0c,#171b16)!important}
    body.dark .nav{background:rgba(16,19,16,.94)!important;border-color:#303530!important}
    body.dark .nav button{color:#b8bcb5!important}
    body.dark .nav button:hover{background:rgba(255,255,255,.06)}
    body.dark .nav .active{background:#f1f1eb!important;color:#151815!important}
    body.dark .bottom{background:#171b17!important;border-color:#303530!important}
    body.dark .bottom button{color:#b8bcb5!important}
    body.dark .bottom .add{background:#f1f1eb!important;color:#151815!important}
    body.dark .card{background:#1a1e1a!important;border-color:#303530!important;color:#f3f3ee}
    body.dark .hero{background:linear-gradient(135deg,#25231c,#1b201b)!important;border-color:#4b402e!important}
    body.dark .input,body.dark .select,body.dark .typebox{background:#121512!important;color:#f3f3ee!important;border-color:#414740!important}
    body.dark .input::placeholder{color:#747a72}
    body.dark .btn.secondary{background:#1a1e1a!important;color:#f3f3ee!important;border-color:#414740!important}
    body.dark .table td{border-color:#2b302b!important}
    body.dark .table th{border-color:#303530!important}
    body.dark .progress{background:#303630!important}
    body.dark .notice{background:#40371f;border-color:#6d5b31}
    body.dark .notice.ok{background:#263827;border-color:#3d5d3d}
    body.dark .notice.err{background:#422724;border-color:#6b3b36}
    body.dark .fixed{background:#514323;color:#f0d18f}
    body.dark .variable{background:#29402b;color:#b7d4b2}
    body.dark .non{background:#492b28;color:#efaaa2}
    body.dark .uncertain{background:#343732;color:#c8ccc4}
    @media(max-width:650px){
      .top{padding:17px 14px 16px!important}
      .brand{font-size:21px!important}
      .theme-toggle{padding:7px 10px;font-size:10px}
      .ak-top-row{gap:7px}
      .main{padding:11px 10px 86px!important}
      .card{border-radius:16px!important;padding:15px!important}
    }
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
    if(brand){top.insertBefore(row,brand);row.appendChild(brand)}
    const btn=document.createElement('button');btn.id='ak-theme-toggle';btn.className='theme-toggle';btn.onclick=window.akToggleTheme;
    row.appendChild(btn);
    if(sub)top.appendChild(sub);
    applyTheme();
  }
  const observer=new MutationObserver(inject);
  observer.observe(document.documentElement,{childList:true,subtree:true});
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',inject);else inject();
})();