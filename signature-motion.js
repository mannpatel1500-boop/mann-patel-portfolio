/* MANN PATEL / SIGNATURE FILM MOTION
   Native scrolling. Single avatar. No intrusive popups. */
(()=>{'use strict';
 const $=s=>document.querySelector(s); const $$=s=>Array.from(document.querySelectorAll(s));
 const prefersReduced=matchMedia('(prefers-reduced-motion: reduce)');
 const hero=$('#hero'),identity=$('.identity-object'),avatar=$('#avatar-follower'),director=$('#website-director');
 const index=$('#cine-rail-index'),label=$('#cine-rail-label'),rail=$('.cinema-chapter-rail');
 const copy=$('.director-copy');
 const chapterList=[
  ['hero','INTRODUCTION',0,0,1,0],
  ['about','CURIOSITY',-122,-35,.94,-3],
  ['services','THREE DISCIPLINES',-28,-45,.91,3],
  ['cinema','THE IDEA',-155,-74,1.02,-5],
  ['work','SELECTED WORK',-74,-26,.95,2],
  ['mathgem','MATHGEM',-30,-24,.87,3],
  ['showcase','WEB EXPERIENCES',-88,-40,.89,-2],
  ['automation','AI AUTOMATION',-20,-18,.84,2],
  ['experiments','IN MOTION',-125,-55,.95,-4],
  ['method','THE PROCESS',-76,-24,.96,2],
  ['contact','CONNECT',-92,-60,.96,-2]
 ];
 const elems=chapterList.map(x=>document.getElementById(x[0]));
 let active=-1,lastScene='',scheduled=false,lastAvatarPathTimer=0;
 const clamp=(n,min,max)=>Math.max(min,Math.min(max,n));
 const small=()=>innerWidth<=700;
 function setChapter(i){
  if(active===i)return;active=i;
  const p=chapterList[i];if(!p)return;
  if(index)index.textContent=String(i).padStart(2,'0')+' / 10';
  if(label)label.textContent=p[1];
  if(avatar && !prefersReduced.matches){
   const factor=small()?.20:innerWidth<1000?.43:1;
   avatar.style.setProperty('--cine-avatar-x',(p[2]*factor).toFixed(1)+'px');
   avatar.style.setProperty('--cine-avatar-y',(p[3]*(small()?.29:.9)).toFixed(1)+'px');
   avatar.style.setProperty('--cine-avatar-scale',small()?'.96':String(p[4]));
   avatar.style.setProperty('--cine-avatar-rotation',small()?'0deg':p[5]+'deg');
   avatar.classList.add('cine-moving');
   clearTimeout(lastAvatarPathTimer);
   lastAvatarPathTimer=setTimeout(()=>avatar.classList.remove('cine-moving'),1150);
  }
 }
 const story=$$('main>section');
 if('IntersectionObserver' in window){
   const entryObserver=new IntersectionObserver(entries=>{
     for(const item of entries){if(item.isIntersecting){item.target.classList.add('cinema-shot-live');entryObserver.unobserve(item.target)}}
   },{threshold:.08,rootMargin:'0px 0px -10% 0px'});
   story.forEach(s=>entryObserver.observe(s));
 }else story.forEach(s=>s.classList.add('cinema-shot-live'));
 let target=.0,smooth=.0,velocity=.0,tracking=false;
 function update(){
   scheduled=false;
   const y=scrollY;const vh=Math.max(1,innerHeight);
   document.body.classList.toggle('scrolled-past-hero',y>vh*.7);
   const mid=y+vh*.46;
   let next=0;
   for(let i=0;i<elems.length;i++)if(elems[i] && mid>=elems[i].offsetTop)next=i;
   setChapter(next);
   if(rail)rail.style.setProperty('--rail-progress',(y/Math.max(1,document.documentElement.scrollHeight-vh)).toFixed(4));
   if(hero&&!prefersReduced.matches){
     target=clamp(y/vh,0,1.15);
     const p=clamp(target,0,1);
     hero.style.setProperty('--cine-wash-alpha',(p*.62).toFixed(3));
     hero.style.setProperty('--cine-sweep',`${(-50+p*450).toFixed(1)}px`);
     hero.style.setProperty('--cine-hero-y',`${(p*68).toFixed(1)}px`);
     hero.style.setProperty('--cine-hero-scale',(1-p*.044).toFixed(4));
     hero.style.setProperty('--cine-hero-opacity',(1-p*.24).toFixed(3));
     hero.style.setProperty('--cine-frame-scale',(1-p*.032).toFixed(4));
     hero.style.setProperty('--cine-frame-alpha',(.54-p*.23).toFixed(3));
     if(identity){
       identity.style.setProperty('--cine-identity-y',`${(p*55).toFixed(1)}px`);
       identity.style.setProperty('--cine-identity-x',`${(-p*41).toFixed(1)}px`);
       identity.style.setProperty('--cine-identity-rotate',`${(-p*5).toFixed(2)}deg`);
       identity.style.setProperty('--cine-identity-scale',(1-p*.12).toFixed(4));
     }
   }
   if(director){
     const r=director.getBoundingClientRect();
     if(r.bottom>0&&r.top<vh){
       const travel=Math.max(1,director.offsetHeight-vh);
       const d=clamp(-r.top/travel,0,1);
       director.style.setProperty('--cine-director-y',`${((d-.5)*-27).toFixed(1)}px`);
       const scene=director.dataset.scene||'0';
       if(scene!==lastScene){lastScene=scene;copy?.classList.remove('scene-cut');void copy?.offsetWidth;copy?.classList.add('scene-cut')}
     }
   }
 }
 function schedule(){if(scheduled)return;scheduled=true;requestAnimationFrame(update)}
 addEventListener('scroll',schedule,{passive:true});addEventListener('resize',schedule,{passive:true});schedule();
 // Tiny pointer-based camera offset on the monogram only: a material response, not artificial smooth-scrolling.
 if(identity && matchMedia('(hover:hover) and (pointer:fine)').matches && !prefersReduced.matches){
   let aimX=0,aimY=0,curX=0,curY=0,raf=0;
   hero?.addEventListener('pointermove',e=>{aimX=(e.clientX/innerWidth-.5)*10;aimY=(e.clientY/innerHeight-.5)*7;if(!raf)raf=requestAnimationFrame(frame)},{passive:true});
   hero?.addEventListener('pointerleave',()=>{aimX=0;aimY=0;if(!raf)raf=requestAnimationFrame(frame)});
   function frame(){raf=0;curX+=(aimX-curX)*.16;curY+=(aimY-curY)*.16;identity.style.setProperty('--cine-pointer-x',curX.toFixed(1)+'px');identity.style.setProperty('--cine-pointer-y',curY.toFixed(1)+'px');if(Math.abs(curX-aimX)+Math.abs(curY-aimY)>.1)raf=requestAnimationFrame(frame)}
 }
 // Keep motion current after pages restore scroll position, or navigate by anchors.
 addEventListener('pageshow',schedule);
})();