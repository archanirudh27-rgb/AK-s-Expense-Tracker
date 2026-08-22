window.EXPENSE_APP_CONFIG={SUPABASE_URL:'https://mqsvpkbgsjsstzaeupwz.supabase.co',SUPABASE_ANON_KEY:'sb_publishable_BuCMOgg-5hzw53NBSkHTPA_wL0zp9z_'};
(function(){
  const BALANCE_CATEGORY='Balance Snapshot';
  function uid(){try{return (typeof user!=='undefined'&&user&&user.id)?user.id:'x'}catch(e){return'x'}}
  function readMap(key){try{return JSON.parse(localStorage.getItem(key)||'{}')}catch(e){return{}}}
  function isBalanceSnapshot(x){return !!x&&x.category===BALANCE_CATEGORY}

  function installTypeCompatibility(){
    try{
      if(window.__fintrackTypeCompatInstalled)return true;
      if(typeof typeMap!=='function'||typeof saveTypeMap!=='function'||typeof saveExpense!=='function')return false;

      typeMap=function(){
        const id=uid();
        const legacy=readMap('ak_expense_types_'+id);
        const current=readMap('fintrack_types_'+id);
        return Object.assign({},legacy,current);
      };
      saveTypeMap=function(map){
        const id=uid();
        if(id==='x')return;
        const data=JSON.stringify(map||{});
        localStorage.setItem('ak_expense_types_'+id,data);
        localStorage.setItem('fintrack_types_'+id,data);
      };

      const baseSaveExpense=saveExpense;
      saveExpense=async function(ev){
        const chosen=document.getElementById('expenseType')?.value||'Auto Detect';
        const editing=(typeof editId!=='undefined'&&editId)?editId:null;
        const snapshot={
          date:document.getElementById('date')?.value||'',
          amount:Number(document.getElementById('amount')?.value||0),
          category:document.getElementById('category')?.value||'',
          subcategory:document.getElementById('subcategory')?.value||''
        };
        await baseSaveExpense(ev);
        if(snapshot.category==='Investment')return;
        const map=typeMap();
        if(chosen==='Auto Detect'){
          if(editing&&map[editing]){delete map[editing];saveTypeMap(map);if(typeof render==='function')render()}
          return;
        }
        let id=editing;
        if(!id&&typeof sb!=='undefined'&&sb&&typeof user!=='undefined'&&user){
          try{
            const q=await sb.from('expenses').select('id,created_at').eq('user_id',user.id).eq('date',snapshot.date).eq('amount',snapshot.amount).eq('category',snapshot.category).eq('subcategory',snapshot.subcategory).order('created_at',{ascending:false}).limit(1);
            id=q.data?.[0]?.id||null;
          }catch(e){}
        }
        if(id){map[id]=chosen;saveTypeMap(map);if(typeof render==='function')render()}
      };

      window.__fintrackTypeCompatInstalled=true;
      return true;
    }catch(e){return false}
  }

  function installSavings(){
    try{
      if(window.__fintrackSavingsInstalled)return true;
      if(typeof home!=='function'||typeof settings!=='function'||typeof ordinary!=='function'||typeof typeFor!=='function'||typeof tx!=='function'||typeof filterTx!=='function'||typeof render!=='function'||typeof load!=='function')return false;

      const baseOrdinary=ordinary;
      const baseTypeFor=typeFor;
      const baseHome=home;
      const baseSettings=settings;
      const baseTx=tx;
      const baseFilterTx=filterTx;

      ordinary=function(x){return !isBalanceSnapshot(x)&&baseOrdinary(x)};
      typeFor=function(x){if(isBalanceSnapshot(x))return'Balance Snapshot';return baseTypeFor(x)};

      function snapshots(){
        try{return rows.filter(isBalanceSnapshot).slice().sort((a,b)=>{
          const at=new Date(a.created_at||a.date+'T00:00:00').getTime();
          const bt=new Date(b.created_at||b.date+'T00:00:00').getTime();
          return bt-at;
        })}catch(e){return[]}
      }
      function latestSnapshot(){return snapshots()[0]||null}
      function afterSnapshot(x,s){
        if(!s||isBalanceSnapshot(x))return false;
        const xd=String(x.date||''),sd=String(s.date||'');
        if(xd>sd)return true;
        if(xd<sd)return false;
        if(x.created_at&&s.created_at)return new Date(x.created_at).getTime()>new Date(s.created_at).getTime();
        return false;
      }
      function liveBalanceData(){
        const s=latestSnapshot();
        if(!s)return null;
        let inc=0,exp=0,inv=0;
        rows.forEach(x=>{
          if(!afterSnapshot(x,s))return;
          if(typeof isIncome==='function'&&isIncome(x))inc+=Number(x.amount||0);
          else if(typeof isInvestment==='function'&&isInvestment(x))inv+=Number(x.amount||0);
          else if(ordinary(x))exp+=Number(x.amount||0);
        });
        return {snapshot:s,opening:Number(s.amount||0),income:inc,expenses:exp,investments:inv,balance:Number(s.amount||0)+inc-exp-inv};
      }
      function fmtReconciled(s){
        if(!s)return'Not set';
        try{
          if(s.created_at)return new Date(s.created_at).toLocaleString('en-IN',{day:'2-digit',month:'short',year:'numeric',hour:'2-digit',minute:'2-digit'});
        }catch(e){}
        return s.date||'—';
      }
      function currentMonthNet(){
        try{
          const cm=monthOf(new Date().toISOString().slice(0,10));
          return total(incomeMonthly(cm))-total(monthly(cm))-total(investmentMonthly(cm));
        }catch(e){return 0}
      }
      function savingsHomeCard(){
        const d=liveBalanceData();
        if(!d){
          return '<div class="card hero"><div class="label">Available Savings</div><div class="big">Set your current balance</div><p class="muted">Enter your current combined liquid savings once. FinTrack will then update it automatically whenever you log income, expenses or investments.</p><button class="btn gold" onclick="go(\'settings\')">Set current savings</button></div>';
        }
        const net=currentMonthNet();
        const netColor=net>=0?'var(--green)':'var(--red)';
        const flow=d.income-d.expenses-d.investments;
        const flowColor=flow>=0?'var(--green)':'var(--red)';
        return '<div class="card hero"><div class="row" style="align-items:flex-start;flex-wrap:wrap"><div><div class="label">Available Savings</div><div class="big">'+money(d.balance)+'</div><div class="muted" style="margin-top:6px">Last reconciled '+fmtReconciled(d.snapshot)+'</div></div><div style="text-align:right"><div class="label">This month change</div><div class="value" style="color:'+netColor+'">'+(net>=0?'+':'')+money(net)+'</div></div></div><div class="grid kpis" style="margin-top:14px"><div><div class="label">Since reconciliation · Income</div><div class="value" style="font-size:17px;color:var(--green)">+'+money(d.income)+'</div></div><div><div class="label">Expenses</div><div class="value" style="font-size:17px;color:var(--red)">−'+money(d.expenses)+'</div></div><div><div class="label">Investments</div><div class="value" style="font-size:17px;color:var(--gold)">−'+money(d.investments)+'</div></div><div><div class="label">Net since reconciliation</div><div class="value" style="font-size:17px;color:'+flowColor+'">'+(flow>=0?'+':'')+money(flow)+'</div></div></div><p class="muted" style="margin-bottom:0">Updates automatically from every transaction you log. Reconcile occasionally against your actual combined liquid balance.</p></div>';
      }
      function savingsSettingsCard(){
        const d=liveBalanceData(),list=snapshots().slice(0,5),today=new Date().toISOString().slice(0,10);
        const title=d?'Reconcile current savings':'Set opening savings balance';
        return '<div class="card"><div class="section">Savings & Balance</div><p class="muted">Use your combined liquid balance across bank accounts and cash. Investments stay separate and reduce available savings when logged.</p>'+(d?'<div class="grid kpis" style="margin:12px 0"><div><div class="label">Available savings</div><div class="value">'+money(d.balance)+'</div></div><div><div class="label">Last reconciled</div><div class="value" style="font-size:15px">'+fmtReconciled(d.snapshot)+'</div></div></div>':'<div class="notice" style="margin:12px 0">No savings balance is set yet. Enter the amount you have available right now; older transactions will not be subtracted from it.</div>')+'<div class="form"><div class="field"><label>'+title+' (₹)</label><input id="savingsBalance" class="input" type="number" min="0" step="0.01" placeholder="e.g. 320000"></div><div class="field"><label>Balance date</label><input id="savingsDate" class="input" type="date" value="'+today+'"></div></div><button class="btn gold" style="margin-top:12px" onclick="saveSavingsBalance()">'+(d?'Reconcile balance':'Start live savings tracking')+'</button><p class="muted" style="margin-top:9px">For the cleanest result, use today\'s actual total balance. If FinTrack ever differs from reality, reconcile again; the latest reconciliation becomes the new starting point.</p>'+(list.length?'<div style="margin-top:16px"><div class="label">Recent reconciliations</div>'+list.map(s=>'<div class="row" style="padding:8px 0;border-bottom:1px solid var(--line)"><span class="muted">'+fmtReconciled(s)+'</span><b>'+money(s.amount)+'</b></div>').join('')+'</div>':'')+'</div>';
      }

      window.saveSavingsBalance=async function(){
        try{
          const amount=Number(document.getElementById('savingsBalance')?.value);
          const date=document.getElementById('savingsDate')?.value||new Date().toISOString().slice(0,10);
          if(!Number.isFinite(amount)||amount<0){alert('Enter a valid savings balance.');return}
          if(typeof sb==='undefined'||!sb||typeof user==='undefined'||!user){alert('Please sign in first.');return}
          const row={user_id:user.id,date,amount,category:BALANCE_CATEGORY,subcategory:'Reconciliation',description:'FinTrack current liquid savings balance',payment_mode:'Other'};
          const r=await sb.from('expenses').insert(row);
          if(r.error){alert(r.error.message);return}
          await load();
          if(typeof go==='function')go('home');
        }catch(e){alert('Could not save the savings balance. Please try again.')}
      };

      home=function(){return savingsHomeCard()+baseHome()};
      settings=function(){return savingsSettingsCard()+baseSettings()};
      tx=function(){
        const all=rows;
        rows=all.filter(x=>!isBalanceSnapshot(x));
        try{return baseTx()}finally{rows=all}
      };
      filterTx=function(){
        const all=rows;
        rows=all.filter(x=>!isBalanceSnapshot(x));
        try{return baseFilterTx()}finally{rows=all}
      };

      window.__fintrackSavingsInstalled=true;
      if(typeof user!=='undefined'&&user&&typeof render==='function')render();
      return true;
    }catch(e){return false}
  }

  let tries=0;
  const timer=setInterval(function(){
    tries++;
    const a=installTypeCompatibility();
    const b=installSavings();
    if((a&&b)||tries>240)clearInterval(timer);
  },25);
})();

(function(){
  const style=document.createElement('style');
  style.textContent=`
    body.dark .notice{background:#2b2416!important;border-color:#6f552a!important;color:#f6e7c8!important}
    body.dark .notice.ok{background:#17301f!important;border-color:#315c3b!important;color:#d9f0dd!important}
    body.dark .notice.err{background:#351c1b!important;border-color:#6b3632!important;color:#f4d6d2!important}
  `;
  document.head.appendChild(style);

  function installLayoutV32(){
    try{
      if(window.__fintrackLayoutV32)return true;
      if(typeof nav!=='function'||typeof settings!=='function'||typeof home!=='function'||typeof render!=='function')return false;

      const previousSettings=settings;
      const previousHome=home;

      nav=function(){
        const items=[['home','Home'],['add','Add Expense'],['tx','Transactions'],['forecast','Forecast'],['settings','More']];
        const mobile=[['home','⌂','Home'],['tx','≡','Txns'],['add','＋','Add'],['forecast','↗','Forecast'],['settings','⚙','More']];
        return '<div class="nav">'+items.map(x=>'<button class="'+(page===x[0]?'active':'')+'" onclick="go(\''+x[0]+'\')">'+x[1]+'</button>').join('')+'</div><div class="bottom">'+mobile.map(x=>'<button class="'+(page===x[0]?'active':'')+(x[0]==='add'?' add':'')+'" onclick="go(\''+x[0]+'\')"><span>'+x[1]+'</span><span>'+x[2]+'</span></button>').join('')+'</div>';
      };

      home=function(){
        return previousHome().replace(/<button class="btn secondary" onclick="go\('income'\)">\+ Add income<\/button>/,'');
      };

      settings=function(){
        const incomeShortcut='<div class="card"><div class="section">More</div><p class="muted">Occasional actions and account tools.</p><div class="actions" style="margin-top:12px"><button class="btn gold" onclick="go(\'income\')">₹ Log income</button></div></div>';
        return incomeShortcut+previousSettings();
      };

      window.__fintrackLayoutV32=true;
      if(typeof user!=='undefined'&&user)render();
      return true;
    }catch(e){return false}
  }

  let tries=0;
  const timer=setInterval(function(){
    tries++;
    if(installLayoutV32()||tries>240)clearInterval(timer);
  },25);
})();

(function(){
  let cloudOverrides={};
  let patched=false;
  let busy=false;
  let syncCount=0;

  function readMap(key){try{return JSON.parse(localStorage.getItem(key)||'{}')}catch(e){return{}}}
  function localMap(id){return Object.assign({},readMap('ak_expense_types_'+id),readMap('fintrack_types_'+id))}
  function writeLocal(id,map){
    const data=JSON.stringify(map||{});
    localStorage.setItem('ak_expense_types_'+id,data);
    localStorage.setItem('fintrack_types_'+id,data);
  }
  function currentUser(){try{return (typeof user!=='undefined'&&user)?user:null}catch(e){return null}}

  async function persistCloud(map){
    const u=currentUser();
    if(!u||typeof sb==='undefined'||!sb)return false;
    try{
      const r=await sb.from('settings').upsert({user_id:u.id,overrides:map||{}},{onConflict:'user_id'});
      return !r.error;
    }catch(e){return false}
  }

  function installCloudTypeMap(){
    try{
      if(patched)return true;
      if(!window.__fintrackTypeCompatInstalled||typeof typeMap!=='function'||typeof saveTypeMap!=='function')return false;
      const previousTypeMap=typeMap;
      const previousSaveTypeMap=saveTypeMap;
      typeMap=function(){return Object.assign({},cloudOverrides,previousTypeMap())};
      saveTypeMap=function(map){
        previousSaveTypeMap(map);
        cloudOverrides=Object.assign({},cloudOverrides,map||{});
        persistCloud(cloudOverrides);
      };
      patched=true;
      return true;
    }catch(e){return false}
  }

  async function syncCloudOverrides(){
    if(busy)return false;
    const u=currentUser();
    if(!u||typeof sb==='undefined'||!sb)return false;
    if(!installCloudTypeMap())return false;
    busy=true;
    try{
      const local=localMap(u.id);
      const before=JSON.stringify(typeMap());
      const r=await sb.from('settings').select('overrides').eq('user_id',u.id).maybeSingle();
      if(r.error){busy=false;return false}
      const cloud=(r.data&&r.data.overrides&&typeof r.data.overrides==='object')?r.data.overrides:{};
      const merged=Object.assign({},cloud,local);
      cloudOverrides=merged;
      writeLocal(u.id,merged);
      if(JSON.stringify(cloud)!==JSON.stringify(merged))await persistCloud(merged);
      const after=JSON.stringify(typeMap());
      busy=false;
      if(before!==after&&typeof render==='function')render();
      return true;
    }catch(e){busy=false;return false}
  }

  const timer=setInterval(async function(){
    syncCount++;
    const ok=await syncCloudOverrides();
    if((ok&&syncCount>=6)||syncCount>30)clearInterval(timer);
  },500);
  window.addEventListener('focus',syncCloudOverrides);
  document.addEventListener('visibilitychange',function(){if(!document.hidden)syncCloudOverrides()});
})();