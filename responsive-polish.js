/* Responsive, accessible enhancements: no network or data submission. */
(()=>{'use strict';
 const $=s=>document.querySelector(s);
 const viewport=$('#precision-viewport');
 const nav=$('.workflow-pan-controls');
 if(viewport && nav){
  const back=nav.querySelector('[data-pan="prev"]'),next=nav.querySelector('[data-pan="next"]');
  const label=nav.querySelector('.workflow-pan-count');
  const update=()=>{const max=Math.max(0,viewport.scrollWidth-viewport.clientWidth);const t=max>1?viewport.scrollLeft/max:0;
   label.textContent=(Math.round(t*100))+'%';back.disabled=t<.01;next.disabled=t>.99;};
  back.addEventListener('click',()=>viewport.scrollBy({left:-Math.max(260,viewport.clientWidth*.76),behavior:'smooth'}));
  next.addEventListener('click',()=>viewport.scrollBy({left:Math.max(260,viewport.clientWidth*.76),behavior:'smooth'}));
  viewport.addEventListener('scroll',update,{passive:true});window.addEventListener('resize',update,{passive:true});update();
 }
 // Clear the larger guide while visitors interact with project media or the workflow editor.
 const observedVisuals=[...document.querySelectorAll('.product-device, .precision-console')];
 if(observedVisuals.length && 'IntersectionObserver' in window){
  const states=new Map();
  const observer=new IntersectionObserver(entries=>{
   for(const entry of entries)states.set(entry.target,entry.isIntersecting);
   document.body.classList.toggle('visual-focus', [...states.values()].some(Boolean));
  },{rootMargin:'-10% 0px -14% 0px',threshold:0});
  observedVisuals.forEach(el=>observer.observe(el));
 }
 const zoom=$('#gallery-zoom');const dialog=$('#gallery-lightbox');const screen=$('#mathgem-screen');
 const zoomImage=$('#gallery-lightbox-image');const zoomTitle=$('#gallery-lightbox-title');
 if(zoom&&dialog&&screen&&zoomImage){
  const refresh=()=>{zoomImage.src=screen.currentSrc||screen.src;zoomImage.alt=screen.alt;zoomTitle.textContent=$('#gallery-title')?.textContent||'MathGem';};
  zoom.addEventListener('click',()=>{refresh();if(typeof dialog.showModal==='function')dialog.showModal();else dialog.setAttribute('open','');});
  dialog.querySelector('.gallery-lightbox-close').addEventListener('click',()=>dialog.close());
  dialog.querySelector('[data-gallery-dir="prev"]').addEventListener('click',()=>{$('#gallery-prev')?.click();setTimeout(refresh,200)});
  dialog.querySelector('[data-gallery-dir="next"]').addEventListener('click',()=>{$('#gallery-next')?.click();setTimeout(refresh,200)});
  dialog.addEventListener('click',e=>{if(e.target===dialog)dialog.close();});
  dialog.addEventListener('keydown',e=>{if(e.key==='ArrowRight'){$('#gallery-next')?.click();setTimeout(refresh,200)}else if(e.key==='ArrowLeft'){$('#gallery-prev')?.click();setTimeout(refresh,200)}});
 }
})();
