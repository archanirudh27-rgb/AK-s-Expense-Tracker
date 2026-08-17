(function(){
  const moneyLocal=n=>'₹'+Math.round(Number(n)||0).toLocaleString('en-IN');
  function forecastLatest(){
    const expenseRows=(rows||[]).filter(x=>x.category!=='Income'&&x.category!=='Investment');
    const months=[...new Set(expenseRows.map(x=>monthOf(x.date)))].sort();
    const history=months.slice(-3);
    if(!history.length){
      return '<div class="card hero"><div class="section">Next-month forecast</div><div class="big">₹0</div><p class="muted">Log expenses to build a forecast from your actual spending.</p></div>';
    }
    const weights=history.length===1?[1]:history.length===2?[0.4,0.6]:[0.2,0.3,0.5];
    const totalFor=m=>expenseRows.filter(x=>monthOf(x.date)===m).reduce((s,x)=>s+Number(x.amount),0);
    const projected=history.reduce((s,m,i)=>s+totalFor(m)*weights[i],0);
    const avg=history.reduce((s,m)=>s+totalFor(m),0)/history.length;
    const latest=totalFor(history[history.length-1]);
    const previous=history.length>1?totalFor(history[history.length-2]):0;
    const categories=[...new Set(expenseRows.map(x=>x.category))];
    const catProj=categories.map(c=>{
      const vals=history.map(m=>expenseRows.filter(x=>monthOf(x.date)===m&&x.category===c).reduce((s,x)=>s+Number(x.amount),0));
      return [c,vals.reduce((s,v,i)=>s+v*weights[i],0)];
    }).filter(x=>x[1]>0).sort((a,b)=>b[1]-a[1]);
    let fixed=0,variable=0,nonrec=0;
    categories.forEach(c=>{
      const sample=expenseRows.filter(x=>x.category===c).sort((a,b)=>new Date(b.date)-new Date(a.date))[0];
      if(!sample)return;
      const vals=history.map(m=>expenseRows.filter(x=>monthOf(x.date)===m&&x.category===c).reduce((s,x)=>s+Number(x.amount),0));
      const p=vals.reduce((s,v,i)=>s+v*weights[i],0);
      const t=typeFor(sample);
      if(t==='Fixed Recurring')fixed+=p; else if(t==='Variable Recurring')variable+=p; else nonrec+=p;
    });
    const change=avg?((projected-avg)/avg*100):0;
    const volatility=avg?Math.min(1,Math.abs(latest-previous||0)/avg):0;
    const dataScore=Math.min(100,history.length/3*100);
    const stabilityScore=Math.max(0,Math.round(100-volatility*100));
    const confidence=Math.round(dataScore*.6+stabilityScore*.4);
    const spendingScore=Math.max(0,Math.min(100,Math.round(100-Math.max(0,change)*1.5)));
    const trend=change>3?'higher':change<-3?'lower':'roughly in line';
    return '<div class="monthbar"><button class="btn secondary" onclick="month=moveMonth(month,-1);render()">←</button><b>Next month forecast</b><button class="btn secondary" onclick="month=moveMonth(month,1);render()">→</button></div>'+
      '<div class="grid kpis">'+
      '<div class="card hero"><div class="label">Projected next-month spending</div><div class="big">'+moneyLocal(projected)+'</div><div class="muted">Based on the last '+history.length+' month'+(history.length>1?'s':'')+' of actual expenses.</div></div>'+
      '<div class="card"><div class="label">Spending score</div><div class="big">'+spendingScore+'/100</div><div class="muted">Projected spending is '+Math.abs(change).toFixed(1)+'% '+trend+' vs your recent average.</div></div>'+
      '<div class="card"><div class="label">Forecast confidence</div><div class="big">'+confidence+'/100</div><div class="muted">Confidence improves automatically as more months are logged.</div></div>'+
      '<div class="card"><div class="label">Recent-month average</div><div class="value">'+moneyLocal(avg)+'</div><div class="muted">Latest month: '+moneyLocal(latest)+'</div></div></div>'+
      '<div class="grid kpis"><div class="card"><div class="label">Fixed recurring forecast</div><div class="value">'+moneyLocal(fixed)+'</div></div><div class="card"><div class="label">Variable recurring forecast</div><div class="value">'+moneyLocal(variable)+'</div></div><div class="card"><div class="label">Non-recurring allowance</div><div class="value">'+moneyLocal(nonrec)+'</div></div><div class="card"><div class="label">Planning buffer (5%)</div><div class="value">'+moneyLocal(projected*.05)+'</div></div></div>'+
      '<div class="card"><div class="section">Projected category spend</div>'+(catProj.length?catProj.slice(0,10).map(x=>'<div style="margin:10px 0"><div class="row"><span>'+esc(x[0])+'</span><b>'+moneyLocal(x[1])+'</b></div><div class="progress"><i style="width:'+Math.min(100,projected?x[1]/projected*100:0)+'%"></i></div></div>').join(''):'<div class="empty">Not enough data.</div>')+'</div>'+
      '<div class="card"><div class="section">How this forecast works</div><p class="muted">The projection uses a weighted average of your recent actual spending, giving the latest month the highest weight. Income and Investments are excluded from expenditure forecasting. Recurring, variable and non-recurring patterns are shown separately.</p></div>';
  }
  window.forecast=forecastLatest;
})();
