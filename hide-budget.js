(function(){
  function removeBudgetUI(){
    document.querySelectorAll('.card').forEach(function(card){
      var t=(card.textContent||'').trim().toLowerCase();
      if(t.includes('budget remaining') || t.includes('monthly budget')) card.remove();
    });
  }
  removeBudgetUI();
  new MutationObserver(removeBudgetUI).observe(document.documentElement,{childList:true,subtree:true});
})();
