(function(){
  const INVESTMENT='Investment', INCOME='Income';
  const TAGLINE='Personal Finance · Cash Flow · Planning';
  const LAST_PAGE_KEY='fintrack_last_page';
  const moneyFn=()=>window.money||((n)=>'₹'+Math.round(Number(n)||0).toLocaleString('en-IN'));

  const brandCss=document.createElement('style');
  brandCss.textContent=`
    .fin-brand-lockup{display:inline-flex;align-items:center;gap:10px;line-height:1}
    .fin-brand-icon{width:34px;height:34px;border-radius:9px;display:block;box-shadow:0 5px 16px rgba(0,0,0,.18)}
    .fin-wordmark{font-family:'Poppins',system-ui,sans-serif;font-weight:700;letter-spacing:-.045em;font-size:24px}
    .fin-word-gold{color:#d6a33f}
    .fin-home-brand{display:flex;align-items:center;gap:13px;padding:14px 16px;margin:0 0 12px;border:1px solid var(--line);border-radius:16px;background:linear-gradient(135deg,#171a17,#242820);color:#fff;box-shadow:0 8px 26px rgba(20,23,20,.08)}
    .fin-home-brand img{width:46px;height:46px;border-radius:12px;flex:0 0 auto}
    .fin-home-title{font:700 22px 'Poppins',system-ui,sans-serif;letter-spacing:-.04em;line-height:1.05}
    .fin-home-sub{font:500 10px 'Poppins',system-ui,sans-serif;color:#c8c9c1;margin-top:5px;letter-spacing:.03em}
    body.dark .fin-home-brand{border-color:#303530;background:linear-gradient(135deg,#111411,#1e231d)}
    @media(max-width:650px){.fin-brand-icon{width:30px;height:30px}.fin-wordmark{font-size:21px}.fin-home-brand{padding:12px 13px}.fin-home-brand img{width:40px;height:40px}.fin-home-title{font-size:19px}}
  `;
  document.head.appendChild(brandCss);

  function setBrand(){
    document.title='FinTrack';
    const appleTitle=document.querySelector('meta[name="apple-mobile-web-app-title"]');
    if(appleTitle)appleTitle.content='FinTrack';
    document.querySelectorAll('.brand').forEach(function(el){
      if(!el.querySelector('.fin-brand-lockup')){
        el.innerHTML='<span class="fin-brand-lockup"><img class="fin-brand-icon" src="./icon-192.svg?v=23" alt="FinTrack logo"><span class="fin-wordmark">Fin<span class="fin-word-gold">Track</span></span></span>';
      }
    });
  }

  function currentPageFromDom(){
    const active=document.querySelector('.nav .active,.bottom .active');
    if(!active)return null;
    const t=(active.textContent||'').trim().toLowerCase();
    if(t.includes('home'))return'home';
    if(t.includes('transaction')||t.includes('txn'))return'tx';
    if(t.includes('add'))return'add';
    if(t.includes('forecast'))return'forecast';
    if(t.includes('setting'))return'settings';
    return null;
  }

  function addHomeLogo(){
    const main=document.querySelector('main.main');
    if(!main)return;
    const p=currentPageFromDom();
    const old=document.getElementById('fin-home-brand');
    if(p!=='home'){if(old)old.remove();return;}
    if(old)return;
    const box=document.createElement('div');
    box.id='fin-home-brand';box.className='fin-home-brand';
    box.innerHTML='<img src="./icon-192.svg?v=23" alt="FinTrack"><div><div class="fin-home-title">Fin<span class="fin-word-gold">Track</span></div><div class="fin-home-sub">'+TAGLINE+'</div></div>';
    main.insertBefore(box,main.firstChild);
  }

  function cleanUI(){
    setBrand();
    document.querySelectorAll('.nav button,.bottom button').forEach(function(b){if((b.textContent||'').trim().toLowerCase()==='analysis')b.remove()});
    document.querySelectorAll('.card').forEach(function(c){var t=(c.textContent||'').toLowerCase();if(t.includes('budget remaining')||t.includes('monthly budget'))c.remove()});
    document.querySelectorAll('.bottom .add').forEach(function(b){if(!b.dataset.finClean){b.dataset.finClean='1';b.style.cssText+='width:auto!important;height:40px!important;min-width:64px!important;margin-top:0!important;border-radius:12px!important;box-shadow:none!important';}});
    addHomeLogo();
  }

  const allowedPages=['home','tx','add','forecast','settings'];
  let restored=false;
  function patchNavigation(){
    if(typeof window.go!=='function'||window.__fintrackGoPatched)return;
    const originalGo=window.go;
    window.go=function(p){if(allowedPages.includes(p))localStorage.setItem(LAST_PAGE_KEY,p);return originalGo.apply(this,arguments)};
    window.__fintrackGoPatched=true;
    if(!restored){
      restored=true;
      const requested=new URLSearchParams(location.search).get('action');
      const saved=requested==='add'?'add':localStorage.getItem(LAST_PAGE_KEY);
      if(saved&&allowedPages.includes(saved)){
        try{window.page=saved;}catch(e){}
        setTimeout(()=>{if(typeof window.go==='function')window.go(saved)},250);
      }
    }
  }

  function currentMonth(){return window.month||new Date().toISOString().slice(0,7)}
  function monthOfSafe(v){return window.monthOf?window.monthOf(v):new Date(v).toISOString().slice(0,7)}
  function moveSafe(m,n){return window.moveMonth?window.moveMonth(m,n):m}
  function expensesFor(m){return (window.rows||[]).filter(x=>monthOfSafe(x.date)===m&&x.category!==INCOME&&x.category!==INVESTMENT)}
  function incomeFor(m){return (window.rows||[]).filter(x=>monthOfSafe(x.date)===m&&x.category===INCOME)}
  function investFor(m){return (window.rows||[]).filter(x=>monthOfSafe(x.date)===m&&x.category===INVESTMENT)}
  function total(a){return a.reduce((s,x)=>s+Number(x.amount||0),0)}
  function forecast(){
    const money=moneyFn(),cm=currentMonth(),m1=moveSafe(cm,-1),m2=moveSafe(cm,-2),e0=total(expensesFor(cm)),e1=total(expensesFor(m1)),e2=total(expensesFor(m2));
    const i0=total(incomeFor(cm)),i1=total(incomeFor(m1)),i2=total(incomeFor(m2));
    const v0=total(investFor(cm)),v1=total(investFor(m1)),v2=total(investFor(m2));
    const histE=[e0,e1,e2].filter(x=>x>0),histI=[i0,i1,i2].filter(x=>x>0),histV=[v0,v1,v2].filter(x=>x>0);
    const avg=a=>a.length?a.reduce((s,x)=>s+x,0)/a.length:0;
    const projectedExpense=avg(histE),projectedIncome=avg(histI),projectedInvestment=avg(histV),surplus=projectedIncome-projectedExpense-projectedInvestment;
    const months=[cm,m1,m2],cat={};
    months.forEach(m=>expensesFor(m).forEach(x=>{const k=x.category||'Miscellaneous';cat[k]=(cat[k]||0)+Number(x.amount||0)}));
    const cats=Object.entries(cat).map(([k,v])=>[k,v/(months.length||1)]).sort((a,b)=>b[1]-a[1]).slice(0,8);
    return '<div class="card hero"><div class="label">Next-month financial forecast</div><div class="big">'+money(projectedExpense)+'</div><p class="muted">Projected ordinary expenditure based on your recent spending history. Income and investments are kept separate.</p></div>'+
    '<div class="grid kpis"><div class="card"><div class="label">Projected income</div><div class="value">'+money(projectedIncome)+'</div></div><div class="card"><div class="label">Projected expenses</div><div class="value">'+money(projectedExpense)+'</div></div><div class="card"><div class="label">Projected investments</div><div class="value">'+money(projectedInvestment)+'</div></div><div class="card"><div class="label">Projected surplus</div><div class="value" style="color:'+(surplus>=0?'var(--green)':'var(--red)')+'">'+money(surplus)+'</div></div></div>'+
    '<div class="card"><div class="section">Recent monthly baseline</div><div class="tablewrap"><table class="table"><thead><tr><th>Month</th><th>Income</th><th>Expenses</th><th>Investments</th><th>Surplus</th></tr></thead><tbody>'+months.map(m=>{const ii=total(incomeFor(m)),ee=total(expensesFor(m)),vv=total(investFor(m));return '<tr><td>'+(window.monthLabel?window.monthLabel(m):m)+'</td><td>'+money(ii)+'</td><td>'+money(ee)+'</td><td>'+money(vv)+'</td><td>'+money(ii-ee-vv)+'</td></tr>'}).join('')+'</tbody></table></div></div>'+
    '<div class="card"><div class="section">Top spending categories — 3 month average</div>'+(cats.length?cats.map(x=>'<div style="margin:10px 0"><div class="row"><span>'+x[0]+'</span><b>'+money(x[1])+'</b></div><div class="progress"><i style="width:'+Math.min(100,projectedExpense?x[1]/projectedExpense*100:0)+'%"></i></div></div>').join(''):'<div class="empty">Not enough expense history yet. Keep logging for a better forecast.</div>')+'</div>'+
    '<div class="card"><div class="section">Planning note</div><p class="muted">This is a simple planning forecast, not a prediction of future income. After you have 2–3 months of consistent data, we can make the forecast more detailed and add quarterly cash-flow planning.</p></div>';
  }
  window.forecast=forecast;

  function tick(){patchNavigation();cleanUI();}
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',tick);else tick();
  setInterval(tick,1200);
  var fs=document.createElement('script');fs.src='./forecast.js?v=23';document.head.appendChild(fs);
})();
