window.EXPENSE_APP_CONFIG={SUPABASE_URL:'https://mqsvpkbgsjsstzaeupwz.supabase.co',SUPABASE_ANON_KEY:'sb_publishable_BuCMOgg-5hzw53NBSkHTPA_wL0zp9z_'};
(function(){
  function uid(){try{return (typeof user!=='undefined'&&user&&user.id)?user.id:'x'}catch(e){return'x'}}
  function readMap(key){try{return JSON.parse(localStorage.getItem(key)||'{}')}catch(e){return{}}}
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
            let q=await sb.from('expenses').select('id,created_at').eq('user_id',user.id).eq('date',snapshot.date).eq('amount',snapshot.amount).eq('category',snapshot.category).eq('subcategory',snapshot.subcategory).order('created_at',{ascending:false}).limit(1);
            id=q.data?.[0]?.id||null;
          }catch(e){}
        }
        if(id){map[id]=chosen;saveTypeMap(map);if(typeof render==='function')render()}
      };

      window.__fintrackTypeCompatInstalled=true;
      if(typeof render==='function'&&typeof user!=='undefined'&&user)render();
      return true;
    }catch(e){return false}
  }
  let tries=0;
  const timer=setInterval(function(){tries++;if(installTypeCompatibility()||tries>200)clearInterval(timer)},25);
})();