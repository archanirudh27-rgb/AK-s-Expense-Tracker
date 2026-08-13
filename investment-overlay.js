(function(){
const subs=['Gold','SIP','Shares','Mutual Funds','Bonds','Other Investments'];
function ensure(){
 const c=document.getElementById('category');
 const s=document.getElementById('subcategory');
 if(!c)return;
 if(!Array.from(c.options).some(o=>o.value==='Investment')){const o=document.createElement('option');o.value='Investment';o.textContent='Investment';c.appendChild(o)}
 if(c.value==='Investment'&&s&&!Array.from(s.options).some(o=>o.value==='Gold')){
   const current=s.value;
   s.innerHTML='<option value="">Select sub-category</option>'+subs.map(x=>'<option value="'+x+'">'+x+'</option>').join('');
   if(subs.includes(current))s.value=current;
 }
}
document.addEventListener('change',e=>{if(e.target&&e.target.id==='category')setTimeout(ensure,20)},true);
const observer=new MutationObserver(()=>ensure());
function start(){ensure();observer.observe(document.documentElement,{childList:true,subtree:true})}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',start);else start();
})();

/* Cleaner mobile bottom navigation: Add is a normal primary button, not a floating circle. */
(function(){
 const css=document.createElement('style');
 css.textContent='@media(max-width:650px){.bottom{gap:3px!important;align-items:center!important;padding:6px 6px calc(6px + env(safe-area-inset-bottom))!important}.bottom button{flex:1!important;max-width:78px!important;min-width:48px!important;border-radius:10px!important;padding:6px 4px!important}.bottom .add{width:auto!important;height:40px!important;min-width:64px!important;max-width:78px!important;margin-top:0!important;border-radius:12px!important;padding:0 10px!important;font-size:0!important;box-shadow:none!important}.bottom .add::after{content:"Add";font-size:11px;font-weight:800}}';
 document.head.appendChild(css);
})();
