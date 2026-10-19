/* Exact, non-interactive views of the corresponding demo documents. */
(()=>{
  const stages=document.querySelectorAll('.gallery-preview');
  const scale=el=>el.style.setProperty('--preview-scale',String(el.clientWidth/1200));
  const fitFeatured=el=>{try{const doc=el.querySelector('iframe').contentDocument,hero=doc.querySelector('.hero-bg');if(!hero)return;const height=Math.ceil(hero.getBoundingClientRect().bottom);if(height>300&&height<1200)el.style.setProperty('--preview-height',String(height));scale(el)}catch(_){/* Keep the complete default preview if a frame is unavailable. */}};
  stages.forEach(el=>{scale(el);if(!el.closest('.gallery-featured'))return;const frame=el.querySelector('iframe');const ready=()=>{fitFeatured(el);frame.contentDocument?.fonts?.ready.then(()=>fitFeatured(el));};frame.addEventListener('load',ready);if(frame.contentDocument?.readyState==='complete')ready()});
  const observer=new ResizeObserver(entries=>entries.forEach(entry=>scale(entry.target)));stages.forEach(el=>observer.observe(el));
  if(location.hash){const id=decodeURIComponent(location.hash.slice(1)),aliases={cms:'clinic-admin'};document.getElementById(aliases[id]||id)?.scrollIntoView({block:'start'})}
})();
