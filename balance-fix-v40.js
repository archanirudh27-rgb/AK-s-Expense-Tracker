(function(){
  function isBalanceSnapshot(x){return !!x&&x.category==='Balance Snapshot'}
  function moneyFmt(n){try{return typeof money==='function'?money(n):'₹'+Math.round(Number(n)||0).toLocaleString('en-IN')}catch(e){return '₹'+Math.round(Number(n)||0).toLocaleString('en-IN')}}

  function latestSnapshot(){
    try{
      return (typeof rows!=='undefined'?rows:[]).filter(isBalanceSnapshot).slice().sort((a,b)=>{
        const ad=String(a.date||''),bd=String(b.date||'');
        if(ad!==bd)return bd.localeCompare(ad);
        const at=new Date(a.created_at||a.date+'T00:00:00').getTime();
        const bt=new Date(b.created_at||b.date+'T00:00:00').getTime();
        return bt-at;
      })[0]||null;
    }catch(e){return null}
  }

  function correctedBalance(){
    const s=latestSnapshot();
    if(!s)return null;
    const cutoffDate=String(s.date||'');
    let income=0,expenses=0,investments=0;
    (typeof rows!=='undefined'?rows:[]).forEach(x=>{
      if(isBalanceSnapshot(x))return;
      const txDate=String(x.date||'');
      /* The saved reconciliation is the closing liquid balance for its selected date.
         All transactions dated on/before that date are already included.
         Every ordinary expense dated after it reduces savings, regardless of payment mode.
         In this FinTrack workflow, a Credit Card entry means the card charge has already
         been settled from savings; no separate card-payment transaction will be logged. */
      if(!txDate||txDate<=cutoffDate)return;
      if(typeof isIncome==='function'&&isIncome(x))income+=Number(x.amount||0);
      else if(typeof isInvestment==='function'&&isInvestment(x))investments+=Number(x.amount||0);
      else if(typeof ordinary==='function'&&ordinary(x))expenses+=Number(x.amount||0);
    });
    return {snapshot:s,opening:Number(s.amount||0),income,expenses,investments,balance:Number(s.amount||0)+income-expenses-investments};
  }

  function currentMonthNet(){
    try{
      const cm=monthOf(new Date().toISOString().slice(0,10));
      return total(incomeMonthly(cm))-total(monthly(cm))-total(investmentMonthly(cm));
    }catch(e){return 0}
  }
  function fmt(s){
    try{return s?.date?new Date(s.date+'T00:00:00').toLocaleDateString('en-IN',{day:'2-digit',month:'short',year:'numeric'}):'—'}catch(e){return s?.date||'—'}
  }

  function refreshSavingsCard(){
    try{
      if(typeof page!=='undefined'&&page!=='home')return;
      const main=document.querySelector('main.main');
      if(!main)return;
      const card=[...main.querySelectorAll('.card.hero')].find(el=>/Available Savings/i.test(el.textContent||''));
      if(!card)return;
      const d=correctedBalance();
      if(d){
        const net=currentMonthNet(),flow=d.income-d.expenses-d.investments;
        card.innerHTML='<div class="row" style="align-items:flex-start;flex-wrap:wrap"><div><div class="label">Available Savings</div><div class="big">'+moneyFmt(d.balance)+'</div><div class="muted" style="margin-top:6px">Balance reconciled as of '+fmt(d.snapshot)+'</div></div><div style="text-align:right"><div class="label">This month change</div><div class="value" style="color:'+(net>=0?'var(--green)':'var(--red)')+'">'+(net>=0?'+':'')+moneyFmt(net)+'</div></div></div><div class="grid kpis" style="margin-top:14px"><div><div class="label">After reconciliation · Income</div><div class="value" style="font-size:17px;color:var(--green)">+'+moneyFmt(d.income)+'</div></div><div><div class="label">Expenses</div><div class="value" style="font-size:17px;color:var(--red)">−'+moneyFmt(d.expenses)+'</div></div><div><div class="label">Investments</div><div class="value" style="font-size:17px;color:var(--gold)">−'+moneyFmt(d.investments)+'</div></div><div><div class="label">Net after reconciliation</div><div class="value" style="font-size:17px;color:'+(flow>=0?'var(--green)':'var(--red)')+'">'+(flow>=0?'+':'')+moneyFmt(flow)+'</div></div></div><p class="muted" style="margin-bottom:0">All logged expenses after reconciliation reduce available savings, including credit-card charges. Transactions dated on or before the reconciliation date are already included in the starting balance.</p>';
      }
      main.appendChild(card);
      card.style.marginTop='18px';
    }catch(e){}
  }

  function install(){
    try{
      if(window.__fintrackBalanceV40Installed)return true;
      if(typeof render!=='function')return false;
      const baseRender=render;
      render=function(){const out=baseRender.apply(this,arguments);setTimeout(refreshSavingsCard,0);return out};
      window.__fintrackBalanceV40Installed=true;
      setTimeout(refreshSavingsCard,0);
      return true;
    }catch(e){return false}
  }
  let tries=0;
  const timer=setInterval(function(){tries++;if(install()||tries>200)clearInterval(timer)},25);
  window.addEventListener('focus',()=>setTimeout(refreshSavingsCard,0));
  document.addEventListener('visibilitychange',()=>{if(!document.hidden)setTimeout(refreshSavingsCard,0)});
})();