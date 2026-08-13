(function(){
const subs=['Gold','SIP','Shares','Mutual Funds','Bonds','Other Investments'];
function ensureCategory(){const c=document.getElementById('category');if(!c)return;if(!Array.from(c.options).some(o=>o.value==='Investment')){const o=document.createElement('option');o.value='Investment';o.textContent='Investment';c.appendChild(o)}}
function apply(){const c=document.getElementById('category');const s=document.getElementById('subcategory');if(!c||!s||c.value!=='Investment')return;const current=s.value;s.innerHTML='<option value="">Select sub-category</option>'+subs.map(x=>'<option value="'+x+'">'+x+'</option>').join('');if(subs.includes(current))s.value=current}
document.addEventListener('change',function(e){if(e.target&&e.target.id==='category')apply()},true);
const observer=new MutationObserver(function(){ensureCategory()});observer.observe(document.documentElement,{childList:true,subtree:true});
ensureCategory();
})();