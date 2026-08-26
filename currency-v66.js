(function(){
const CURRENCIES=[['INR','₹','Indian Rupee'],['EUR','€','Euro'],['USD','$','US Dollar'],['GBP','£','British Pound'],['AED','د.إ','UAE Dirham'],['AUD','A$','Australian Dollar'],['CAD','C$','Canadian Dollar'],['SGD','S$','Singapore Dollar'],['JPY','¥','Japanese Yen'],['CHF','CHF','Swiss Franc'],['NZD','NZ$','New Zealand Dollar'],['SAR','﷼','Saudi Riyal']];
let installed=false;
function uid(){try{return user&&user.id?user.id:'guest'}catch(e){return'guest'}}
function ckey(){return'fintrack_currency_'+uid()}
function code(){return localStorage.getItem(ckey())||'INR'}
function meta(){return CURRENCIES.find(x=>x[0]===code())||CURRENCIES[0]}
function format(n){const [c,s]=meta(),v=Math.round(Number(n)||0);try{return new Intl.NumberFormat(c==='INR'?'en-IN':undefined,{style:'currency',currency:c,maximumFractionDigits:0}).format(v)}catch(e){return s+v.toLocaleString(c==='INR'?'en-IN':undefined)}}
function saveCurrency(v){if(!CURRENCIES.some(x=>x[0]===v))return;localStorage.setItem(ckey(),v);if(typeof render==='function')render()}
window.setFinTrackCurrency=saveCurrency;
function panel(){const selected=code();return `<div class="card" id="currencySetting"><div class="section">Currency</div><div class="muted" style="margin:5px 0 12px">Choose the currency FinTrack uses to display your amounts. This changes display only; your recorded values are not converted.</div><div class="field"><label>Display currency</label><select class="select" onchange="setFinTrackCurrency(this.value)">${CURRENCIES.map(([c,s,n])=>`<option value="${c}" ${selected===c?'selected':''}>${s} · ${n} (${c})</option>`).join('')}</select></div></div>`}
function inject(){try{if(typeof page==='undefined'||page!=='settings')return;const main=document.querySelector('.main');if(!main||document.getElementById('currencySetting'))return;const holder=document.createElement('div');holder.innerHTML=panel();const first=main.querySelector('.card');if(first)main.insertBefore(holder.firstElementChild,first);else main.appendChild(holder.firstElementChild)}catch(e){}}
function install(){if(installed)return true;if(typeof money!=='function'||typeof render!=='function')return false;money=format;const baseRender=render;render=function(){const out=baseRender.apply(this,arguments);inject();return out};installed=true;render();return true}
let tries=0,t=setInterval(()=>{tries++;if(install()||tries>400)clearInterval(t)},20);
})();