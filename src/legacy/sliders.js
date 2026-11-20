/* Remplit la piste des curseurs jusqu'au pouce. */
(function(){const u=r=>r.style.setProperty('--p',((r.value-r.min)/(r.max-r.min)*100)+'%');const all=()=>document.querySelectorAll('input[type=range]').forEach(u);document.addEventListener('input',e=>{if(e.target.type==='range')u(e.target)});['click','change','hashchange'].forEach(ev=>addEventListener(ev,()=>setTimeout(all,0)));all();})();
