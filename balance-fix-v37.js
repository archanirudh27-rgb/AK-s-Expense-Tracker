(function(){
  function isBalanceSnapshot(x){return !!x&&x.category==='Balance Snapshot'}
  function moneyFmt(n){try{return typeof money==='function'?money(n):'₹'+Math.round(Number(n)||0).toLocaleString('en-IN')}catch(e){return '₹'+Math.round(Number(n)||0).toLocaleString('en-IN')}}

  function latestSnapshot(){
    try{
      return (typeof rows!=='undefined'?rows:[]).filter(isBalanceSnapshot).slice().sort((a,b)=>{
        const at=new Date(a.created_at||a.date+'T00:00:00').getTime();
        const bt=new Date(b.created_at||b.date+'T00:00:00').getTime();
        return bt-at;
      })[0]||null;
    }catch(e){return null}
  }

  function correctedBalance(){
    const s=latestSnapshot();
    if(!s)return null;
    const snapshotTime=new Date(s.created_at||s.date+'T23:59:59').getTime();
    let income=0,expenses=0,investments=0;
    (typeof rows!=='undefined'?rows:[]).forEach(x=>{
      if(isBalanceSnapshot(x))return;
      const created=x.created_at?new Date(x.created_at).getTime():NaN;
      /* A reconciliation is a real-world balance at the moment it is saved.
         Therefore only records entered AFTER that reconciliation should move it.
         Transaction date is intentionally not used here: this prevents old records
         already included in the reconciled bank balance from being deducted twice,
         and correctly includes back-dated transactions entered afterwards. */
      if(Number.isFinite(created)){if(created<=snapshotTime)return}
      else {
        const xd=String(x.date||''),sd=String(s.date||'');
        if(xd<=sd)return;
      }
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
    try{if(s&&s.created_at)return new Date(s.created_at).toLocaleString('en-IN',{day:'2-digit',month:'short',year:'numeric',hour:'2-digit',minute:'2-digit'})}catch(e){}
    return s?.date||'—';
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
        card.innerHTML='<div class="row" style="align-items:flex-start;flex-wrap:wrap"><div><div class="label">Available Savings</div><div class="big">'+moneyFmt(d.balance)+'</div><div class="muted" style="margin-top:6px">Last reconciled '+fmt(d.snapshot)+'</div></div><div style="text-align:right"><div class="label">This month change</div><div class="value" style="color:'+(net>=0?'var(--green)':'var(--red)')+'">'+(net>=0?'+':'')+moneyFmt(net)+'</div></div></div><div class="grid kpis" style="margin-top:14px"><div><div class="label">Since reconciliation · Income</div><div class="value" style="font-size:17px;color:var(--green)">+'+moneyFmt(d.income)+'</div></div><div><div class="label">Expenses</div><div class="value" style="font-size:17px;color:var(--red)">−'+moneyFmt(d.expenses)+'</div></div><div><div class="label">Investments</div><div class="value" style="font-size:17px;color:var(--gold)">−'+moneyFmt(d.investments)+'</div></div><div><div class="label">Net since reconciliation</div><div class="value" style="font-size:17px;color:'+(flow>=0?'var(--green)':'var(--red)')+'">'+(flow>=0?'+':'')+moneyFmt(flow)+'</div></div></div><p class="muted" style="margin-bottom:0">Updates from transactions entered after your latest reconciliation.</p>';
      }
      /* Savings is useful, but should not dominate the first screen. */
      main.appendChild(card);
      card.style.marginTop='18px';
    }catch(e){}
  }

  function install(){
    try{
      if(window.__fintrackBalanceV37Installed)return true;
      if(typeof render!=='function')return false;
      const baseRender=render;
      render=function(){const out=baseRender.apply(this,arguments);setTimeout(refreshSavingsCard,0);return out};
      window.__fintrackBalanceV37Installed=true;
      setTimeout(refreshSavingsCard,0);
      return true;
    }catch(e){return false}
  }
  let tries=0;
  const timer=setInterval(function(){tries++;if(install()||tries>200)clearInterval(timer)},25);
  window.addEventListener('focus',()=>setTimeout(refreshSavingsCard,0));
  document.addEventListener('visibilitychange',()=>{if(!document.hidden)setTimeout(refreshSavingsCard,0)});
})();
