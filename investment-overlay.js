(function(){
const subs=['Gold','SIP','Shares','Mutual Funds','Bonds','Other Investments'];
function apply(){const c=document.getElementById('category');const s=document.getElementById('subcategory');if(!c||!s)return;if(c.value==='Investment'){s.innerHTML='<option value="">Select sub-category</option>'+subs.map(x=>'<option value="'+x+'">'+x+'</option>').join('');}}
document.addEventListener('change',function(e){if(e.target&&e.target.id==='category')setTimeout(apply,0)});
setTimeout(apply,100);
})();