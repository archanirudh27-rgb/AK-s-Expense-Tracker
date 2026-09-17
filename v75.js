/* v75: simplify dashboard pies by showing Money Back explicitly in both charts. */
(function(){
  let installed=false;
  function install(){
    if(installed)return true;
    if(typeof home!=='function'||typeof monthly!=='function'||typeof moneyBackMonthly!=='function'||typeof byType!=='function'||typeof byCat!=='function'||typeof pieCard!=='function'||typeof savingsHomeCard!=='function')return false;
    home=function(){
      const a=monthly(month),gross=total(a),back=total(moneyBackMonthly(month)),net=gross-back,income=total(incomeMonthly(month)),invest=total(investmentMonthly(month)),surplus=income+back-gross-invest,t=byType(a);
      const grossCats={};a.filter(x=>ordinary(x)).forEach(x=>grossCats[x.category]=(grossCats[x.category]||0)+Number(x.amount||0));
      const catItems=Object.entries(grossCats).filter(x=>x[1]>0).sort((a,b)=>b[1]-a[1]);if(back>0)catItems.push(['Money Back',back]);
      const typeItems=['Fixed Recurring','Variable Recurring','Non-Recurring','Uncertain'].map(k=>[k,t[k]||0]).filter(x=>x[1]>0);if(back>0)typeItems.push(['Money Back',back]);
      const activity=gross+back;
      return`<div class="monthbar"><button class="btn secondary" onclick="month=moveMonth(month,-1);render()">←</button><b>${monthLabel(month)}</b><button class="btn secondary" onclick="month=moveMonth(month,1);render()">→</button></div><div class="card"><div class="label">Net expenses</div><div class="value">${money(net)}</div><div class="muted">Gross expenses ${money(gross)} − Money Back ${money(back)}</div></div><div class="grid kpis"><div class="card"><div class="label">Income</div><div class="value" style="color:var(--green)">${money(income)}</div></div><div class="card"><div class="label">Money Back</div><div class="value" style="color:var(--green)">${money(back)}</div></div><div class="card"><div class="label">Fixed recurring</div><div class="value">${money(t['Fixed Recurring']||0)}</div></div><div class="card"><div class="label">Variable recurring</div><div class="value">${money(t['Variable Recurring']||0)}</div></div><div class="card"><div class="label">Non-recurring</div><div class="value">${money(t['Non-Recurring']||0)}</div></div><div class="card"><div class="label">Investments</div><div class="value" style="color:var(--gold)">${money(invest)}</div></div></div><div class="card"><div class="label">Monthly surplus</div><div class="value" style="color:${surplus>=0?'var(--green)':'var(--red)'}">${money(surplus)}</div><div class="muted">Income + Money Back − Gross Expenses − Investments</div></div><div class="pie-pair">${pieCard('Where did my money go?',monthLabel(month)+' · Expenses + Money Back · activity '+money(activity),catItems)}${pieCard('How is my spending structured?',monthLabel(month)+' · Expense types + Money Back · activity '+money(activity),typeItems)}</div><div class="notice ok" style="margin-top:12px">Net Expenses = ${money(gross)} gross expenses − ${money(back)} money back = <b>${money(net)}</b>. Money Back is shown as its own slice in both charts so the chart totals stay easy to reconcile.</div><div style="height:12px"></div>${savingsHomeCard()}`;
    };
    installed=true;if(typeof render==='function')render();return true;
  }
  let tries=0;const timer=setInterval(()=>{tries++;if(install()||tries>500)clearInterval(timer)},25);
})();