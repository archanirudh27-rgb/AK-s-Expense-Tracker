(function(){
  const INVESTMENT='Investment', INCOME='Income';
  const moneyFn=()=>window.money||((n)=>'₹'+Math.round(Number(n)||0).toLocaleString('en-IN'));
  function cleanUI(){
    document.querySelectorAll('.nav button,.bottom button').forEach(function(b){if((b.textContent||'').trim().toLowerCase()==='analysis')b.remove()});
    document.querySelectorAll('.card').forEach(function(c){var t=(c.textContent||'').toLowerCase();if(t.includes('budget remaining')||t.includes('monthly budget'))c.remove()});
    document.querySelectorAll('.bottom .add').forEach(function(b){b.style.cssText+='width:auto!important;height:40px!important;min-width:64px!important;margin-top:0!important;border-radius:12px!important;box-shadow:none!important'});
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
    const histE=[e0,e1,e2].filter(x=>x>0), histI=[i0,i1,i2].filter(x=>x>0), histV=[v0,v1,v2].filter(x=>x>0);
    const avg=a=>a.length?a.reduce((s,x)=>s+x,0)/a.length:0;
    const projectedExpense=avg(histE),projectedIncome=avg(histI),projectedInvestment=avg(histV),surplus=projectedIncome-projectedExpense-projectedInvestment;
    const months=[cm,m1,m2];
    const cat={}; months.forEach(m=>expensesFor(m).forEach(x=>{const k=x.category||'Miscellaneous';cat[k]=(cat[k]||0)+Number(x.amount||0)}));
    const cats=Object.entries(cat).map(([k,v])=>[k,v/(months.length||1)]).sort((a,b)=>b[1]-a[1]).slice(0,8);
    return '<div class="card hero"><div class="label">Next-month financial forecast</div><div class="big">'+money(projectedExpense)+'</div><p class="muted">Projected ordinary expenditure based on your recent spending history. Income and investments are kept separate.</p></div>'+
      '<div class="grid kpis"><div class="card"><div class="label">Projected income</div><div class="value">'+money(projectedIncome)+'</div></div><div class="card"><div class="label">Projected expenses</div><div class="value">'+money(projectedExpense)+'</div></div><div class="card"><div class="label">Projected investments</div><div class="value">'+money(projectedInvestment)+'</div></div><div class="card"><div class="label">Projected surplus</div><div class="value" style="color:'+(surplus>=0?'var(--green)':'var(--red)')+'">'+money(surplus)+'</div></div></div>'+
      '<div class="card"><div class="section">Recent monthly baseline</div><div class="tablewrap"><table class="table"><thead><tr><th>Month</th><th>Income</th><th>Expenses</th><th>Investments</th><th>Surplus</th></tr></thead><tbody>'+months.map(m=>{const ii=total(incomeFor(m)),ee=total(expensesFor(m)),vv=total(investFor(m));return '<tr><td>'+ (window.monthLabel?window.monthLabel(m):m) +'</td><td>'+money(ii)+'</td><td>'+money(ee)+'</td><td>'+money(vv)+'</td><td>'+money(ii-ee-vv)+'</td></tr>'}).join('')+'</tbody></table></div></div>'+
      '<div class="card"><div class="section">Top spending categories — 3 month average</div>'+(cats.length?cats.map(x=>'<div style="margin:10px 0"><div class="row"><span>'+x[0]+'</span><b>'+money(x[1])+'</b></div><div class="progress"><i style="width:'+Math.min(100,projectedExpense?x[1]/projectedExpense*100:0)+'%"></i></div></div>').join(''):'<div class="empty">Not enough expense history yet. Keep logging for a better forecast.</div>')+'</div>'+
      '<div class="card"><div class="section">Planning note</div><p class="muted">This is a simple planning forecast, not a prediction of future income. After you have 2–3 months of consistent data, we can make the forecast more detailed and add quarterly cash-flow planning.</p></div>';
  }
  window.forecast=forecast;
  function start(){cleanUI();new MutationObserver(function(){cleanUI()}).observe(document.documentElement,{childList:true,subtree:true});}
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',start);else start();
  var fs=document.createElement('script');fs.src='./forecast.js?v=21';document.head.appendChild(fs);
})();
