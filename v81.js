/* v81: desktop/web dashboard spacing and tile alignment. Mobile order/layout remains v80. */
(function(){
  const css=`
@media(min-width:701px){
  .main{padding:18px}
  .main>.monthbar{margin-bottom:16px}
  .main>.card,.main>.grid,.main>.pie-pair{margin-bottom:16px}
  .kpis{grid-template-columns:repeat(3,minmax(0,1fr));gap:16px}
  .kpis>.card{margin-bottom:0;min-height:112px;display:flex;flex-direction:column;justify-content:center;padding:18px}
  .pie-pair{gap:16px}
  .pie-pair>.card{margin-bottom:0}
}
@media(min-width:1050px){
  .kpis{grid-template-columns:repeat(6,minmax(0,1fr))}
  .kpis>.card{min-height:116px}
}
`;
  function install(){
    if(document.getElementById('fintrack-v81-css'))return;
    const s=document.createElement('style');s.id='fintrack-v81-css';s.textContent=css;document.head.appendChild(s);
  }
  if(document.head)install();else document.addEventListener('DOMContentLoaded',install,{once:true});
})();