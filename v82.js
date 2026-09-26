/* v82: restore reliable native date picker interaction in the PWA. */
(function(){
  let installed=false;
  const IDS=new Set(['date','incomeDate','backDate','savingsDate']);
  function openPicker(el){
    if(!el||!IDS.has(el.id)||el.disabled)return;
    try{if(typeof el.showPicker==='function')el.showPicker()}catch(e){}
  }
  function install(){
    if(installed)return true;
    if(!document||!document.addEventListener)return false;
    document.addEventListener('click',function(ev){
      const el=ev.target?.closest?.('input[type="date"]');
      if(el)openPicker(el);
    },true);
    document.addEventListener('focusin',function(ev){
      const el=ev.target;
      if(el?.matches?.('input[type="date"]'))openPicker(el);
    },true);
    const css=document.createElement('style');
    css.id='fintrack-v82-date-css';
    css.textContent='input[type="date"]{cursor:pointer;touch-action:manipulation;pointer-events:auto;-webkit-appearance:auto;appearance:auto;}';
    document.head?.appendChild(css);
    installed=true;
    return true;
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',install,{once:true});else install();
})();
