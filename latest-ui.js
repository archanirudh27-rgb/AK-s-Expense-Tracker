(function(){
  const INVESTMENT='Investment',INCOME='Income',LAST_PAGE_KEY='fintrack_last_page';
  const moneyFn=()=>window.money||((n)=>'₹'+Math.round(Number(n)||0).toLocaleString('en-IN'));

  const css=document.createElement('style');
  css.textContent=`.fin-brand-lockup{display:inline-flex;align-items:center;gap:10px;line-height:1}.fin-brand-icon{width:34px;height:34px;border-radius:9px;display:block;box-shadow:0 5px 16px rgba(0,0,0,.18)}.fin-wordmark{font-family:'Poppins',system-ui,sans-serif;font-weight:700;letter-spacing:-.045em;font-size:24px}.fin-word-gold{color:#d6a33f}@media(max-width:650px){.fin-brand-icon{width:30px;height:30px}.fin-wordmark{font-size:21px}}`;
  document.head.appendChild(css);

  function setBrand(){
    document.title='FinTrack';
    document.querySelectorAll('.brand').forEach(function(el){
      if(!el.querySelector('.fin-brand-lockup'))el.innerHTML='<span class="fin-brand-lockup"><img class="fin-brand-icon" src="./fintrack-icon-192.svg?v=24" alt="FinTrack"><span class="fin-wordmark">Fin<span class="fin-word-gold">Track</span></span></span>';
    });
  }

  function cleanUI(){
    setBrand();
    document.querySelectorAll('.nav button,.bottom button').forEach(function(b){if((b.textContent||'').trim().toLowerCase()==='analysis')b.remove()});
    document.querySelectorAll('.card').forEach(function(c){const t=(c.textContent||'').toLowerCase();if(t.includes('budget remaining')||t.includes('monthly budget'))c.remove()});
    document.querySelectorAll('.bottom .add').forEach(function(b){if(!b.dataset.finClean){b.dataset.finClean='1';b.style.cssText+='width:auto!important;height:40px!important;min-width:64px!important;margin-top:0!important;border-radius:12px!important;box-shadow:none!important';}});
  }

  const allowedPages=['home','tx','add','forecast','settings'];
  function patchNavigation(){
    if(typeof window.go!=='function'||window.__fintrackGoPatched)return;
    const originalGo=window.go;
    window.go=function(p){if(allowedPages.includes(p))localStorage.setItem(LAST_PAGE_KEY,p);return originalGo.apply(this,arguments)};
    window.__fintrackGoPatched=true;
  }

  function currentMonth(){return window.month||new Date().toISOString().slice(0,7)}
  function monthOfSafe(v){return window.monthOf?window.monthOf(v):new Date(v).toISOString().slice(0,7)}
  function moveSafe(m,n){return window.moveMonth?window.moveMonth(m,n):m}
  function expensesFor(m){return (window.rows||[]).filter(x=>monthOfSafe(x.date)===m&&x.category!==INCOME&&x.category!==INVESTMENT)}
  function incomeFor(m){return (window.rows||[]).filter(x=>monthOfSafe(x.date)===m&&x.category===INCOME)}
  function investFor(m){return (window.rows||[]).filter(x=>monthOfSafe(x.date)===m&&x.category===INVESTMENT)}
  function total(a){return a.reduce((s,x)=>s+Number(x.amount||0),0)}
  function forecast(){
    const money=moneyFn(),cm=currentMonth(),m1=moveSafe(cm,-1),m2=moveSafe(cm,-2),months=[cm,m1,m2];
    const weighted=(vals)=>{const w=[.5,.3,.2],pairs=vals.map((v,i)=>[v,w[i]]).filter(x=>x[0]>0);if(!pairs.length)return 0;const sw=pairs.reduce((s,x)=>s+x[1],0);return pairs.reduce((s,x)=>s+x[0]*x[1],0)/sw};
    const ex=months.map(m=>total(expensesFor(m))),inc=months.map(m=>total(incomeFor(m))),inv=months.map(m=>total(investFor(m)));
    const projectedExpense=weighted(ex),projectedIncome=weighted(inc),projectedInvestment=weighted(inv),surplus=projectedIncome-projectedExpense-projectedInvestment;
    const cat={};months.forEach((m,mi)=>expensesFor(m).forEach(x=>{const k=x.category||'Miscellaneous';cat[k]=(cat[k]||0)+Number(x.amount||0)*[.5,.3,.2][mi]}));
    const cats=Object.entries(cat).sort((a,b)=>b[1]-a[1]).slice(0,8);
    const score=projectedIncome>0?Math.max(0,Math.min(100,Math.round((1-(projectedExpense+projectedInvestment)/projectedIncome)*100+50))):50;
    const confidence=Math.min(100,months.filter((m,i)=>ex[i]>0||inc[i]>0||inv[i]>0).length*33);
    return '<div class="card hero"><div class="label">Next-month projected spend</div><div class="big">'+money(projectedExpense)+'</div><p class="muted">Weighted from your latest 3 months, with the most recent month given the highest importance.</p></div>'+
      '<div class="grid kpis"><div class="card"><div class="label">Projected income</div><div class="value">'+money(projectedIncome)+'</div></div><div class="card"><div class="label">Projected expenses</div><div class="value">'+money(projectedExpense)+'</div></div><div class="card"><div class="label">Projected investments</div><div class="value">'+money(projectedInvestment)+'</div></div><div class="card"><div class="label">Projected surplus</div><div class="value" style="color:'+(surplus>=0?'var(--green)':'var(--red)')+'">'+money(surplus)+'</div></div><div class="card"><div class="label">Spending score</div><div class="value">'+score+'/100</div></div><div class="card"><div class="label">Forecast confidence</div><div class="value">'+confidence+'/100</div></div></div>'+
      '<div class="card"><div class="section">Projected spending by category</div>'+(cats.length?cats.map(x=>'<div style="margin:10px 0"><div class="row"><span>'+x[0]+'</span><b>'+money(x[1])+'</b></div><div class="progress"><i style="width:'+Math.min(100,projectedExpense?x[1]/projectedExpense*100:0)+'%"></i></div></div>').join(''):'<div class="empty">Keep logging expenses to build a reliable category forecast.</div>')+'</div>'+
      '<div class="card"><div class="section">Recent monthly baseline</div><div class="tablewrap"><table class="table"><thead><tr><th>Month</th><th>Income</th><th>Expenses</th><th>Investments</th><th>Surplus</th></tr></thead><tbody>'+months.map((m,i)=>'<tr><td>'+(window.monthLabel?window.monthLabel(m):m)+'</td><td>'+money(inc[i])+'</td><td>'+money(ex[i])+'</td><td>'+money(inv[i])+'</td><td>'+money(inc[i]-ex[i]-inv[i])+'</td></tr>').join('')+'</tbody></table></div></div>';
  }
  window.forecast=forecast;

  function apply(){patchNavigation();cleanUI();}
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',apply);else apply();
  new MutationObserver(apply).observe(document.documentElement,{childList:true,subtree:true});
})();
