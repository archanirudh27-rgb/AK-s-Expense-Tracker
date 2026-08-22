(function(){
  function cleanUI(){
    document.getElementById('fin-home-brand')?.remove();
    document.querySelectorAll('.nav button,.bottom button').forEach(function(b){if((b.textContent||'').trim().toLowerCase()==='analysis')b.remove()});
    document.querySelectorAll('.card').forEach(function(c){var t=(c.textContent||'').toLowerCase();if(t.includes('budget remaining')||t.includes('monthly budget'))c.remove()});
    document.querySelectorAll('.bottom .add').forEach(function(b){if(!b.dataset.finClean){b.dataset.finClean='1';b.style.cssText+='width:auto!important;height:40px!important;min-width:64px!important;margin-top:0!important;border-radius:12px!important;box-shadow:none!important'}});
  }
  function loadForecast(){if(document.getElementById('fintrack-forecast-script'))return;const s=document.createElement('script');s.id='fintrack-forecast-script';s.src='./forecast.js?v=25';document.head.appendChild(s)}
  function tick(){cleanUI();loadForecast()}
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',tick);else tick();
  new MutationObserver(()=>requestAnimationFrame(cleanUI)).observe(document.documentElement,{childList:true,subtree:true});
})();