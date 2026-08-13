(function(){
const INCOME='Income';
const TYPES=['Salary','Freelance / Professional','Business','Bonus','Interest','Rental Income','Other Income'];
function incomeRows(){return rows.filter(x=>x.category===INCOME)}
function incomePage(){
 const a=incomeRows().sort((x,y)=>String(y.date).localeCompare(String(x.date))),m=month||monthOf(new Date());
 const cur=a.filter(x=>monthOf(x.date)===m),total=cur.reduce((s,x)=>s+Number(x.amount),0);
 return '<div class="card"><div class="row"><div><div class="section">Income</div><div class="muted">Log money received separately from expenses.</div></div><button class="btn gold" onclick="incomeAdd()">+ Add income</button></div><div class="grid kpis" style="margin-top:12px"><div class="card"><div class="label">This month</div><div class="value">'+money(total)+'</div></div><div class="card"><div class="label">Transactions</div><div class="value">'+cur.length+'</div></div></div></div>'+
 '<div class="card"><div class="section">'+monthLabel(m)+'</div>'+(cur.length?'<div class="tablewrap"><table class="table"><thead><tr><th>Date</th><th>Type</th><th>Description</th><th>Amount</th><th></th></tr></thead><tbody>'+cur.map(x=>'<tr><td>'+esc(x.date)+'</td><td>'+esc(x.subcategory)+'</td><td>'+esc(x.description||'—')+'</td><td>'+money(x.amount)+'</td><td><button class="btn danger" style="padding:4px 7px" onclick="incomeDelete(\''+x.id+'\')">×</button></td></tr>').join('')+'</tbody></table></div>':'<div class="empty">No income logged for this month.</div>')+'</div>';
}
function incomeAdd(){
 let d=document.createElement('div');d.id='income-modal';d.style='position:fixed;inset:0;background:rgba(0,0,0,.45);z-index:100;display:flex;align-items:flex-end;justify-content:center';
 d.innerHTML='<div class="card" style="width:min(680px,100%);margin:0;border-radius:20px 20px 0 0"><div class="row"><b>Log Income</b><button class="btn secondary" onclick="document.getElementById(\'income-modal\').remove()">×</button></div><div class="form" style="margin-top:12px"><div class="field"><label>Date</label><input id="income-date" class="input" type="date" value="'+new Date().toISOString().slice(0,10)+'" required></div><div class="field"><label>Amount (₹)</label><input id="income-amount" class="input" type="number" min="0.01" step="0.01" required></div><div class="field"><label>Income type</label><select id="income-type" class="select">'+TYPES.map(x=>'<option>'+x+'</option>').join('')+'</select></div><div class="field"><label>Description</label><input id="income-desc" class="input" placeholder="e.g. August salary"></div></div><button class="btn gold" style="margin-top:13px;width:100%" onclick="incomeSave()">Save income</button></div>';
 document.body.appendChild(d);
}
async function incomeSave(){const amount=Number(document.getElementById('income-amount').value);if(!amount||amount<=0){alert('Enter a valid income amount.');return}const row={user_id:user.id,date:document.getElementById('income-date').value,amount,category:INCOME,subcategory:document.getElementById('income-type').value,description:document.getElementById('income-desc').value,payment_mode:null};const r=await sb.from('expenses').insert(row);if(r.error){alert(r.error.message);return}document.getElementById('income-modal')?.remove();await load();go('income')}
async function incomeDelete(id){if(!confirm('Delete this income entry?'))return;const r=await sb.from('expenses').delete().eq('id',id);if(r.error)alert(r.error.message);else load()}
let patched=false;
function patchIncome(){if(patched||typeof window.render!=='function'||typeof window.nav!=='function')return;
 const oldMonthly=window.monthly;window.monthly=function(m){return oldMonthly(m).filter(x=>x.category!==INCOME)};
 const oldNav=window.nav;window.nav=function(){let s=oldNav();s=s.replace("['analysis','◒','Analysis'],['forecast','↗','Forecast']","['analysis','◒','Analysis'],['income','₹','Income'],['forecast','↗','Forecast']");return s.replace("['forecast','Forecast'],['settings','Settings']","['forecast','Forecast'],['income','Income'],['settings','Settings']")};
 const oldRender=window.render;window.render=function(){if(page==='income'){document.body.innerHTML='<div class="app"><div class="top"><div class="brand">AK FinTrack</div><div class="sub">Personal Finance · Cash Flow · Planning</div></div>'+window.nav()+'<main class="main">'+incomePage()+'</main></div>';if(typeof themeButton==='function')themeButton();if(typeof mobileSettingsButton==='function')mobileSettingsButton();return}oldRender()};
 patched=true;
}
setInterval(patchIncome,250);setTimeout(patchIncome,100);
})();