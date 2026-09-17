/* v74 Money Back source mapping + net expense type reconciliation. */
(function(){
  let installed=false;
  const TYPES=['Fixed Recurring','Variable Recurring','Non-Recurring','Uncertain'];
  const isBack=x=>x&&x.category==='Money Back';
  const parse=x=>{const s=String(x?.payment_mode||''),m=s.match(/^Related:([^|]+)(?:\|Type:(.+))?$/);return{cat:m?m[1]:'',type:m&&m[2]?m[2]:''}};
  const backsFor=a=>{const ms=new Set((a||[]).map(x=>monthOf(x.date)));return rows.filter(x=>isBack(x)&&ms.has(monthOf(x.date)))};
  function inferredType(b){
    const p=parse(b);if(TYPES.includes(p.type))return p.type;if(!p.cat)return'';
    const same=rows.filter(x=>ordinary(x)&&monthOf(x.date)===monthOf(b.date)&&x.category===p.cat);
    const exact=same.filter(x=>Number(x.amount||0)===Number(b.amount||0));
    const exactTypes=[...new Set(exact.map(typeFor).filter(t=>TYPES.includes(t)))];if(exactTypes.length===1)return exactTypes[0];
    const allTypes=[...new Set(same.map(typeFor).filter(t=>TYPES.includes(t)))];return allTypes.length===1?allTypes[0]:'';
  }
  function install(){
    if(installed)return true;
    if(typeof byCat!=='function'||typeof byType!=='function'||typeof settings!=='function'||typeof home!=='function'||typeof saveMoneyBack!=='function'||typeof getCats!=='function')return false;
    byCat=function(a){const m={};(a||[]).filter(x=>ordinary(x)).forEach(x=>m[x.category]=(m[x.category]||0)+Number(x.amount||0));backsFor(a).forEach(x=>{const c=parse(x).cat;if(c)m[c]=Math.max(0,(m[c]||0)-Number(x.amount||0))});return Object.entries(m).filter(x=>x[1]>0).sort((a,b)=>b[1]-a[1])};
    byType=function(a){const m={'Fixed Recurring':0,'Variable Recurring':0,'Non-Recurring':0,'Uncertain':0};(a||[]).filter(x=>ordinary(x)).forEach(x=>{const t=typeFor(x);if(t in m)m[t]+=Number(x.amount||0)});backsFor(a).forEach(x=>{const t=inferredType(x);if(t in m)m[t]=Math.max(0,m[t]-Number(x.amount||0))});return m};
    const oldSettings=settings;
    settings=function(){let h=oldSettings.apply(this,arguments);h=h.replace('<label>Related expense category</label>','<label>Original source category</label>').replace('<option value="">Not applicable / unsure</option>','<option value="">Select original category</option>');const needle='</select></div><div class="field span2"><label>Description</label><input id="backDesc"';const repl='</select></div><div class="field"><label>Original expense type</label><select id="backExpenseType" class="select" required><option value="">Select original expense type</option>'+TYPES.map(x=>'<option>'+x+'</option>').join('')+'</select></div><div class="field span2"><label>Description</label><input id="backDesc"';h=h.replace(needle,repl).replace('id="backCategory" class="select"','id="backCategory" class="select" required');return h};
    window.saveMoneyBack=async function(ev){ev.preventDefault();const cat=$('backCategory')?.value||'',typ=$('backExpenseType')?.value||'';if(!cat||!typ){alert('Please select the original source category and original expense type.');return}const row={user_id:user.id,date:$('backDate').value,amount:Number($('backAmount').value),category:'Money Back',subcategory:$('backType').value,description:$('backDesc').value,payment_mode:'Related:'+cat+'|Type:'+typ};const r=await sb.from('expenses').insert(row);if(r.error){alert(r.error.message);return}await load();go('home')};
    const oldHome=home;home=function(){return oldHome.apply(this,arguments).replace('Gross expenses by type','Net expenses by type')};
    installed=true;if(typeof render==='function')render();return true;
  }
  let tries=0;const timer=setInterval(()=>{tries++;if(install()||tries>400)clearInterval(timer)},25);
})();