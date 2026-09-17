/* v77 calculation audit: use one consistent gross-spend basis for category/type analysis. Money Back remains a separate cash-return adjustment. */
(function(){
  let installed=false;
  function install(){
    if(installed)return true;
    if(typeof ordinary!=='function'||typeof typeFor!=='function'||typeof byCat!=='function'||typeof byType!=='function')return false;
    byCat=function(a){const m={};(a||[]).filter(x=>ordinary(x)).forEach(x=>{const c=x.category||'Miscellaneous';m[c]=(m[c]||0)+Number(x.amount||0)});return Object.entries(m).filter(x=>x[1]>0).sort((a,b)=>b[1]-a[1])};
    byType=function(a){const m={'Fixed Recurring':0,'Variable Recurring':0,'Non-Recurring':0,'Uncertain':0};(a||[]).filter(x=>ordinary(x)).forEach(x=>{const t=typeFor(x);if(t in m)m[t]+=Number(x.amount||0)});return m};
    installed=true;if(typeof render==='function')render();return true;
  }
  let tries=0;const timer=setInterval(()=>{tries++;if(install()||tries>400)clearInterval(timer)},25);
})();