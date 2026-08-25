(function(){
  const COLORS=['#B56E3B','#688064','#9C4037','#4D7595','#765294','#B18A31','#7B6B58'];
  function fmt(n){try{return typeof money==='function'?money(n):'₹'+Math.round(Number(n)||0).toLocaleString('en-IN')}catch(e){return'₹'+Math.round(Number(n)||0).toLocaleString('en-IN')}}
  function isSnapshot(x){return x&&x.category==='Balance Snapshot'}
  function monthRows(){
    try{
      if(typeof rows==='undefined'||typeof month==='undefined')return[];
      return rows.filter(x=>String(x.date||'').slice(0,7)===month&&!isSnapshot(x)&&!(typeof isIncome==='function'&&isIncome(x))&&!(typeof isInvestment==='function'&&isInvestment(x)));
    }catch(e){return[]}
  }
  function grouped(){
    const map={};
    monthRows().forEach(x=>{const k=x.category||'Miscellaneous';map[k]=(map[k]||0)+Number(x.amount||0)});
    const all=Object.entries(map).sort((a,b)=>b[1]-a[1]);
    if(all.length<=6)return all;
    const top=all.slice(0,6),other=all.slice(6).reduce((s,x)=>s+x[1],0);
    if(other>0)top.push(['Other',other]);
    return top;
  }
  function cardHtml(){
    const data=grouped(),sum=data.reduce((s,x)=>s+x[1],0);
    if(!sum)return '<div class="section">Where did my money go?</div><div class="empty">No expenses logged for this month yet.</div>';
    let cursor=0;const stops=[];
    data.forEach((x,i)=>{const start=cursor,end=cursor+(x[1]/sum*100);stops.push(`${COLORS[i%COLORS.length]} ${start.toFixed(2)}% ${end.toFixed(2)}%`);cursor=end});
    const legend=data.map((x,i)=>`<div class="ft45legend"><span class="ft45dot" style="background:${COLORS[i%COLORS.length]}"></span><span class="ft45name">${typeof esc==='function'?esc(x[0]):x[0]}</span><b>${fmt(x[1])}</b></div>`).join('');
    return `<div class="row" style="align-items:flex-start;flex-wrap:wrap;gap:16px"><div><div class="section">Where did my money go?</div><div class="muted" style="margin-top:4px">${typeof monthLabel==='function'?monthLabel(month):month} · Category split</div></div><div class="muted"><b>${fmt(sum)}</b> total</div></div><div class="ft45wrap"><div class="ft45pie" style="background:conic-gradient(${stops.join(',')})"><div class="ft45hole"><span class="label">Spent</span><b>${fmt(sum)}</b></div></div><div class="ft45legendbox">${legend}</div></div>`;
  }
  function inject(){
    try{
      if(typeof page!=='undefined'&&page!=='home'){document.getElementById('homeExpenseChart45')?.remove();return}
      const main=document.querySelector('main.main');if(!main)return;
      let card=document.getElementById('homeExpenseChart45');
      if(!card){card=document.createElement('div');card.id='homeExpenseChart45';card.className='card';}
      card.innerHTML=cardHtml();
      const top=[...main.querySelectorAll('.card')].find(el=>/TOP CATEGORIES/i.test(el.textContent||''));
      if(top&&top!==card)main.insertBefore(card,top);else{
        const savings=[...main.querySelectorAll('.card.hero')].find(el=>/Available Savings/i.test(el.textContent||''));
        if(savings&&savings!==card)main.insertBefore(card,savings);else main.appendChild(card);
      }
    }catch(e){}
  }
  function styles(){if(document.getElementById('ft45style'))return;const s=document.createElement('style');s.id='ft45style';s.textContent=`
    .ft45wrap{display:grid;grid-template-columns:minmax(220px,340px) 1fr;align-items:center;gap:28px;margin-top:18px}
    .ft45pie{width:min(280px,72vw);aspect-ratio:1;border-radius:50%;display:grid;place-items:center;margin:auto;box-shadow:inset 0 0 0 1px color-mix(in srgb,var(--line) 60%,transparent)}
    .ft45hole{width:53%;aspect-ratio:1;border-radius:50%;background:var(--card);display:flex;flex-direction:column;align-items:center;justify-content:center;box-shadow:0 0 0 1px var(--line)}
    .ft45hole b{font-size:18px;margin-top:4px}
    .ft45legendbox{display:grid;gap:10px}
    .ft45legend{display:grid;grid-template-columns:12px minmax(120px,1fr) auto;align-items:center;gap:10px;padding:5px 0;border-bottom:1px solid color-mix(in srgb,var(--line) 60%,transparent)}
    .ft45dot{width:10px;height:10px;border-radius:3px}.ft45name{font-size:13px}.ft45legend b{font-size:13px}
    @media(max-width:700px){.ft45wrap{grid-template-columns:1fr;gap:18px}.ft45pie{width:min(230px,68vw)}.ft45legend{grid-template-columns:12px 1fr auto}.ft45name,.ft45legend b{font-size:12px}}
  `;document.head.appendChild(s)}
  function install(){
    styles();
    if(window.__ftHomeChart45)return true;
    if(typeof render!=='function')return false;
    const base=render;
    render=function(){const out=base.apply(this,arguments);setTimeout(inject,35);return out};
    window.__ftHomeChart45=true;setTimeout(inject,80);return true;
  }
  let n=0,t=setInterval(()=>{n++;if(install()||n>240)clearInterval(t)},25);
  window.addEventListener('focus',()=>setTimeout(inject,50));
})();