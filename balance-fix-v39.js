(function(){
  function isBalanceSnapshot(x){return !!x&&x.category==='Balance Snapshot'}
  function moneyFmt(n){try{return typeof money==='function'?money(n):'₹'+Math.round(Number(n)||0).toLocaleString('en-IN')}catch(e){return '₹'+Math.round(Number(n)||0).toLocaleString('en-IN')}}
  function latestSnapshot(){
    try{return (typeof rows!=='undefined'?rows:[]).filter(isBalanceSnapshot).slice().sort((a,b)=>{
      const ad=String(a.date||''),bd=String(b.date||'');
      if(ad!==bd)return bd.localeCompare(ad);
      return new Date(b.created_at||b.date+'T00:00:00').getTime()-new Date(a.created_at||a.date+'T00:00:00').getTime();
    })[0]||null}catch(e){return null}
  }
  function isCreditCardPurchase(x){
    const pm=String(x?.payment_mode||'').trim().toLowerCase();
    const sub=String(x?.subcategory||'').trim().toLowerCase();
    const cat=String(x?.category||'').trim().toLowerCase();
    /* A credit-card purchase is spending, but it does not reduce bank/cash savings yet.
       The later card-bill payment does reduce savings and must remain included. */
    if(sub.includes('credit card payment')||cat.includes('credit card payment'))return false;
    return pm==='credit card';
  }
  function correctedBalance(){
    const s=latestSnapshot();
    if(!s)return null;
    const cutoffDate=String(s.date||'');
    let income=0,expenses=0,investments=0,creditCardSpend=0;
    (typeof rows!=='undefined'?rows:[]).forEach(x=>{
      if(isBalanceSnapshot(x))return;
      const txDate=String(x.date||'');
      if(!txDate||txDate<=cutoffDate)return;
      if(typeof isIncome==='function'&&isIncome(x)){income+=Number(x.amount||0);return}
      if(typeof isInvestment==='function'&&isInvestment(x)){investments+=Number(x.amount||0);return}
      if(typeof ordinary==='function'&&ordinary(x)){
        if(isCreditCardPurchase(x)){creditCardSpend+=Number(x.amount||0);return}
        expenses+=Number(x.amount||0);
      }
    });
    return {snapshot:s,opening:Number(s.amount||0),income,expenses,investments,creditCardSpend,balance:Number(s.amount||0)+income-expenses-investments};
  }
  function currentMonthNet(){
    try{const cm=monthOf(new Date().toISOString().slice(0,10));return total(incomeMonthly(cm))-total(monthly(cm))-total(investmentMonthly(cm))}catch(e){return 0}
  }
  function fmt(s){try{return s?.date?new Date(s.date+'T00:00:00').toLocaleDateString('en-IN',{day:'2-digit',month:'short',year:'numeric'}):'—'}catch(e){return s?.date||'—'}}
  function refreshSavingsCard(){
    try{
      if(typeof page!=='undefined'&&page!=='home')return;
      const main=document.querySelector('main.main');if(!main)return;
      const card=[...main.querySelectorAll('.card.hero')].find(el=>/Available Savings/i.test(el.textContent||''));if(!card)return;
      const d=correctedBalance();
      if(d){
        const net=currentMonthNet(),flow=d.income-d.expenses-d.investments;
        card.innerHTML='<div class="row" style="align-items:flex-start;flex-wrap:wrap"><div><div class="label">Available Savings</div><div class="big">'+moneyFmt(d.balance)+'</div><div class="muted" style="margin-top:6px">Balance reconciled as of '+fmt(d.snapshot)+'</div></div><div style="text-align:right"><div class="label">This month change</div><div class="value" style="color:'+(net>=0?'var(--green)':'var(--red)')+'">'+(net>=0?'+':'')+moneyFmt(net)+'</div></div></div><div class="grid kpis" style="margin-top:14px"><div><div class="label">After reconciliation · Income</div><div class="value" style="font-size:17px;color:var(--green)">+'+moneyFmt(d.income)+'</div></div><div><div class="label">Cash/Bank Expenses</div><div class="value" style="font-size:17px;color:var(--red)">−'+moneyFmt(d.expenses)+'</div></div><div><div class="label">Investments</div><div class="value" style="font-size:17px;color:var(--gold)">−'+moneyFmt(d.investments)+'</div></div><div><div class="label">Credit-card spend pending payment</div><div class="value" style="font-size:17px">'+moneyFmt(d.creditCardSpend)+'</div></div></div><p class="muted" style="margin-bottom:0">Available Savings tracks liquid bank/cash balance. Credit-card purchases stay in spending reports but reduce savings only when the card payment is logged.</p>';
      }
      main.appendChild(card);card.style.marginTop='18px';
    }catch(e){}
  }
  function install(){
    try{
      if(window.__fintrackBalanceV39Installed)return true;
      if(typeof render!=='function')return false;
      const baseRender=render;
      render=function(){const out=baseRender.apply(this,arguments);setTimeout(refreshSavingsCard,0);return out};
      window.__fintrackBalanceV39Installed=true;setTimeout(refreshSavingsCard,0);return true;
    }catch(e){return false}
  }
  let tries=0;const timer=setInterval(function(){tries++;if(install()||tries>200)clearInterval(timer)},25);
  window.addEventListener('focus',()=>setTimeout(refreshSavingsCard,0));
  document.addEventListener('visibilitychange',()=>{if(!document.hidden)setTimeout(refreshSavingsCard,0)});
})();