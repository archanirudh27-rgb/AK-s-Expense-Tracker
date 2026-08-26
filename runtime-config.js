window.EXPENSE_APP_CONFIG={SUPABASE_URL:'https://mqsvpkbgsjsstzaeupwz.supabase.co',SUPABASE_ANON_KEY:'sb_publishable_BuCMOgg-5hzw53NBSkHTPA_wL0zp9z_'};

/* Data-only compatibility layer: keeps expense-type overrides consistent across browser and PWA without modifying UI/rendering. */
(function(){
  let installed=false,cloudOverrides={},syncing=false;
  function uid(){try{return user&&user.id?user.id:null}catch(e){return null}}
  function read(k){try{return JSON.parse(localStorage.getItem(k)||'{}')}catch(e){return{}}}
  function localMap(id){return Object.assign({},read('ak_expense_types_'+id),read('fintrack_types_'+id))}
  function writeLocal(id,map){const s=JSON.stringify(map||{});localStorage.setItem('ak_expense_types_'+id,s);localStorage.setItem('fintrack_types_'+id,s)}
  async function persist(map){const id=uid();if(!id||!sb)return;try{await sb.from('settings').upsert({user_id:id,overrides:map||{}},{onConflict:'user_id'})}catch(e){}}
  async function syncCloud(){if(syncing)return;const id=uid();if(!id||!sb)return;syncing=true;try{const r=await sb.from('settings').select('overrides').eq('user_id',id).maybeSingle();const remote=r&&r.data&&r.data.overrides&&typeof r.data.overrides==='object'?r.data.overrides:{};const merged=Object.assign({},localMap(id),remote);cloudOverrides=merged;writeLocal(id,merged);if(Object.keys(merged).length)persist(merged)}catch(e){}finally{syncing=false}}
  function install(){
    if(installed)return true;
    if(typeof typeMap!=='function'||typeof saveTypeMap!=='function'||typeof saveExpense!=='function')return false;
    const baseSave=saveExpense;
    typeMap=function(){const id=uid();return id?Object.assign({},localMap(id),cloudOverrides):{}};
    saveTypeMap=function(map){const id=uid();if(!id)return;const merged=Object.assign({},map||{});cloudOverrides=merged;writeLocal(id,merged);persist(merged)};
    saveExpense=async function(ev){
      const chosen=document.getElementById('expenseType')?.value||'Auto Detect';
      const editing=(typeof editId!=='undefined'&&editId)?editId:null;
      const snapshot={date:document.getElementById('date')?.value||'',amount:Number(document.getElementById('amount')?.value||0),category:document.getElementById('category')?.value||'',subcategory:document.getElementById('subcategory')?.value||''};
      await baseSave(ev);
      if(snapshot.category==='Investment')return;
      const map=typeMap();
      if(chosen==='Auto Detect'){if(editing&&map[editing]){delete map[editing];saveTypeMap(map)}return}
      let id=editing;
      if(!id&&uid()&&sb){try{const q=await sb.from('expenses').select('id,created_at').eq('user_id',uid()).eq('date',snapshot.date).eq('amount',snapshot.amount).eq('category',snapshot.category).eq('subcategory',snapshot.subcategory).order('created_at',{ascending:false}).limit(1);id=q.data?.[0]?.id||null}catch(e){}}
      if(id){map[id]=chosen;saveTypeMap(map);if(typeof render==='function')render()}
    };
    installed=true;syncCloud();return true;
  }
  let tries=0;const timer=setInterval(()=>{tries++;if(install()||tries>300)clearInterval(timer)},20);
  setInterval(()=>{if(installed)syncCloud()},15000);
})();