/* Personal cinematic details: responsive fitting and accurate connection geometry. */
(() => {
 'use strict';
 const stage=document.querySelector('.precision-stage');
 const frame=document.querySelector('#precision-stage-frame');
 const viewport=document.querySelector('#precision-viewport');
 const cables=stage?.querySelector('svg.precision-cables');
 if(stage&&frame&&viewport&&cables){
   const nodes={};
   stage.querySelectorAll('[data-studio-flow]').forEach(node=>nodes[node.dataset.studioFlow]=node);
   const connections=[
     ['schedule','selector'],['selector','creative'],['creative','image'],['creative','caption'],
     ['image','convert'],['convert','publish','vertical'],['caption','publish'],
     ['publish','facebook'],['publish','instagram'],['publish','linkedin']
   ];
   const ns='http://www.w3.org/2000/svg';
   function connector(a,b,orientation){
     let x1=a.offsetLeft+a.offsetWidth,y1=a.offsetTop+a.offsetHeight/2;
     let x2=b.offsetLeft,y2=b.offsetTop+b.offsetHeight/2;
     if(orientation==='vertical'){
       x1=a.offsetLeft+a.offsetWidth/2;y1=a.offsetTop+a.offsetHeight;
       x2=b.offsetLeft+b.offsetWidth/2;y2=b.offsetTop;
       return `M ${x1} ${y1} C ${x1} ${y1+46}, ${x2} ${y2-46}, ${x2} ${y2}`;
     }
     const curve=Math.max(20,Math.min(65,(x2-x1)*.6));
     return `M ${x1} ${y1} C ${x1+curve} ${y1}, ${x2-curve} ${y2}, ${x2} ${y2}`;
   }
   function renderCables(){
     cables.querySelectorAll('path').forEach(path=>path.remove());
     for(const [from,to,type] of connections){
       if(!nodes[from]||!nodes[to])continue;
       const d=connector(nodes[from],nodes[to],type);
       for(const cls of ['cable-base','cable-current']){
         const path=document.createElementNS(ns,'path');
         path.setAttribute('class',cls);path.setAttribute('d',d);cables.appendChild(path);
       }
     }
   }
   const fitStage=()=>{
     // Desktop shows the full diagram; touch devices retain readable horizontal scrolling.
     const w=viewport.clientWidth;
     const scale=w>=800?Math.min(1,w/1270):1;
     stage.style.transform=`scale(${scale})`;
     frame.style.width=`${1270*scale}px`;
     frame.style.height=`${585*scale}px`;
     frame.dataset.scale=String(scale);
     renderCables();
   };
   if('ResizeObserver' in window){new ResizeObserver(fitStage).observe(viewport)}
   window.addEventListener('resize',fitStage,{passive:true});
   requestAnimationFrame(fitStage);
 }
 const hero=document.querySelector('#hero');
 const identity=document.querySelector('.identity-object');
 const reduced=window.matchMedia('(prefers-reduced-motion: reduce)').matches;
 if(identity&&hero&&!reduced){
   let pending=false;
   function tick(){
     const p=Math.max(0,Math.min(1,window.scrollY/Math.max(innerHeight,1)));
     identity.style.setProperty('--identity-y',`${p*92}px`);
     identity.style.opacity=String(Math.max(.2,.94-p*.58));
     pending=false;
   }
   window.addEventListener('scroll',()=>{if(!pending){pending=true;requestAnimationFrame(tick)}},{passive:true});
   tick();
 }
 // No automatic popup: personal guide is visible, its dialogue requires hover or click.
 const avatar=document.getElementById('avatar-follower');
 const avatarButton=document.getElementById('avatar-button');
 if(avatar&&avatarButton){
   avatar.classList.remove('show-tip');
   avatarButton.setAttribute('aria-expanded','false');
 }

 // On phones, allow the portfolio headline and calls to action to breathe before the guide enters.
 if(avatar){
   let nearTopScheduled=false;
   const updateMobileEntrance=()=>{
     avatar.classList.toggle('mobile-hero-hidden',window.matchMedia('(max-width:700px)').matches && window.scrollY < innerHeight*.66);
     nearTopScheduled=false;
   };
   updateMobileEntrance();
   window.addEventListener('scroll',()=>{if(!nearTopScheduled){nearTopScheduled=true;requestAnimationFrame(updateMobileEntrance)}},{passive:true});
   window.addEventListener('resize',updateMobileEntrance,{passive:true});
 }
 // The bundled single-file version can open its complete concept websites without missing relative paths.
 if(window.__portfolioStandalone){
   const tab=document.getElementById('theater-tab');
   tab?.addEventListener('click',event=>{
     const current=document.getElementById('theater-title')?.textContent||'';
     const key=current.includes('SIGNAL')?'arch':current.includes('FLOWSTATE')?'hotel':'objects';
     const html=window.__demoSites?.[key];
     if(!html)return;
     event.preventDefault();
     const link=URL.createObjectURL(new Blob([html],{type:'text/html'}));
     window.open(link,'_blank','noopener,noreferrer');
   });
 }
})();
