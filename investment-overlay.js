(function(){
const subs=['Gold','SIP','Shares','Mutual Funds','Bonds','Other Investments'];
function patch(){
  const c=document.getElementById('category');
  if(!c)return;
  if(![...c.options].some(o=>o.value==='Investment')){const o=document.createElement('option');o.value='Investment';o.textContent='Investment';c.appendChild(o)}
  if(c.value==='Investment'){const s=document.getElementById('subcategory');if(s)s.innerHTML='<option value="">Select sub-category</option>'+subs.map(x=>'<option value="'+x+'">'+x+'</option>').join('')}
}
let last=null;
setInterval(()=>{const c=document.getElementById('category');const v=c?.value||'';if(v!==last){last=v;patch()}else if(c)patch()},500);
document.addEventListener('change',e=>{if(e.target?.id==='category')setTimeout(patch,0)});
setTimeout(patch,100);
})();