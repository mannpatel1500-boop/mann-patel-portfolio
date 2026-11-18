(() => {
  'use strict';
  const $ = (s) => document.querySelector(s);
  const $$ = (s) => Array.from(document.querySelectorAll(s));
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const doc = document.documentElement;
  const year = $('#year'); if (year) year.textContent = new Date().getFullYear();
  // Short cinematic entrance; reduced-motion visitors skip the effect.
  const enter = () => document.body.classList.add('intro-finished');
  if (reduceMotion) enter(); else window.setTimeout(enter, 1425);


  // Layout navigation
  const menuToggle = $('#menu-toggle');
  const mobileNav = $('#mobile-nav');
  const menu = (open) => {
    mobileNav.hidden = !open;
    menuToggle.setAttribute('aria-expanded', String(open));
    menuToggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
    document.body.classList.toggle('menu-open', open);
  };
  menuToggle?.addEventListener('click', () => menu(mobileNav.hidden));
  $$('#mobile-nav a').forEach(a => a.addEventListener('click', () => menu(false)));
  window.addEventListener('keydown', e => { if (e.key === 'Escape') menu(false); });

  // Reveal with polite fallback for older browsers and accessibility settings
  if ('IntersectionObserver' in window && !reduceMotion) {
    const revealObserver = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('in-view');
          revealObserver.unobserve(entry.target);
        }
      });
    }, {threshold: .09, rootMargin: '0px 0px -24px 0px'});
    $$('.reveal').forEach(el => revealObserver.observe(el));
  } else $$('.reveal').forEach(el => el.classList.add('in-view'));

  // Real product screenshots (no recreated screenshots)
  const screens = [
    {file:'01_Projectile_Motion.webp', title:'Projectile motion', alt:'Actual MathGem interactive projectile-motion simulation screen'},
    {file:'02_Gyroscope.webp', title:'Gyroscope', alt:'Actual MathGem gyroscope simulation screen'},
    {file:'03_Chlor_Alkali_Cell.webp', title:'Chlor-alkali cell', alt:'Actual MathGem chlor-alkali electrochemistry simulation screen'},
    {file:'04_Cavalieri_Principle.webp', title:'Cavalieri’s principle', alt:'Actual MathGem Cavalieri principle visual mathematical model screen'},
    {file:'05_3D_Vectors.webp', title:'3D vectors', alt:'Actual MathGem three dimensional vectors model screen'}
  ];
  const gallerySrc = file => (window.__portfolioAssets?.[file] || 'assets/' + file);
  let galleryIdx = 0, galleryPending = false;
  const galleryImage = $('#mathgem-screen');
  screens.forEach(s => { const pre = new Image(); pre.src = gallerySrc(s.file); });
  function galleryStep(direction){
    if (galleryPending) return;
    galleryPending = true;
    galleryIdx = (galleryIdx + direction + screens.length) % screens.length;
    const s = screens[galleryIdx];
    galleryImage.classList.add('changing');
    const change = () => {
      galleryImage.src = gallerySrc(s.file);
      galleryImage.alt = s.alt;
      $('#gallery-number').textContent = String(galleryIdx + 1).padStart(2,'0') + ' / 05';
      $('#gallery-title').textContent = s.title;
      galleryImage.classList.remove('changing');
      galleryPending = false;
    };
    if (reduceMotion) change(); else window.setTimeout(change, 145);
  }
  $('#gallery-prev')?.addEventListener('click', () => galleryStep(-1));
  $('#gallery-next')?.addEventListener('click', () => galleryStep(+1));

  // Clickable reconstruction of actual described n8n stages — not an n8n account screenshot
  const flowData = {
    schedule: ['01 / TRIGGER','Start on schedule.','The campaign begins on a schedule, without manually starting each run.'],
    selector: ['02 / LOGIC','Every product gets a turn.','Campaign topics rotate without repeats until every topic has had its turn.'],
    creative: ['03 / AI','Give the creative a reason.','A short campaign brief sets the subject, creative direction and context.'],
    image: ['04 / MEDIA','Generate. Convert. Deliver.','The image is generated, prepared and hosted for publishing.'],
    caption: ['05 / CONTENT','Adapt the story.','Captions are created for the campaign and adapted to each platform.'],
    publish: ['06 / DISTRIBUTE','One system, multiple channels.','The campaign is delivered to Facebook, Instagram and LinkedIn.']
  };
  $$('.flow-node').forEach(node => {
    node.addEventListener('click', () => {
      const name = node.dataset.flow;
      const info = flowData[name];
      if (!info) return;
      $$('.flow-node').forEach(el => el.classList.toggle('selected',el===node));
      $('#flow-detail-type').textContent = info[0];
      $('#flow-detail-title').textContent = info[1];
      $('#flow-detail-copy').textContent = info[2];
      const idx = Object.keys(flowData).indexOf(name);
      $('.flow-counter').innerHTML = String(idx+1).padStart(2,'0')+'<span>/ 06</span>';
      node.scrollIntoView({behavior:reduceMotion?'auto':'smooth',block:'nearest',inline:'nearest'});
    });
  });

  // Three fully built demonstration websites, viewed in an immersive gallery.
  // Site markup is bundled so a standalone HTML export also opens the actual sites.
  const websiteCases = [
    {key:'arch', name:'SIGNAL / AI', title:'THINK IN\nSYSTEMS.', description:'An AI workspace designed around focused, useful interactions.', label:'01 / 03 — AI WORKSPACE', kind:'AI / WEBSITE STUDY', address:'signal-ai.studio / concept study', url:'concepts/atelier-form.html'},
    {key:'hotel', name:'FLOWSTATE AUTOMATION', title:'WORK,\nIN MOTION.', description:'A connected platform for workflows, agents and integrations.', label:'02 / 03 — AUTOMATION', kind:'AUTOMATION / WEBSITE STUDY', address:'flowstate-automation.studio / concept study', url:'concepts/maison-aurelia.html'},
    {key:'objects', name:'MATHGEM STUDIO', title:'LEARNING,\nREIMAGINED.', description:'An interactive approach to learning through scientific visuals.', label:'03 / 03 — EDTECH', kind:'EDTECH / WEBSITE STUDY', address:'mathgem-studio.studio / concept study', url:'concepts/forma-objects.html'}
  ];
  const webDirector = $('#website-director');
  const directorShots = $$('.director-shot');
  let currentScene = 0;
  const displayScene = idx => {
    if (idx===currentScene && webDirector?.dataset.scene !== undefined) return;
    currentScene = idx;
    const item=websiteCases[idx];
    webDirector.dataset.scene=String(idx);
    directorShots.forEach((el,i)=>el.classList.toggle('current',i===idx));
    $('#director-index').textContent=item.label;
    $('#director-heading').innerHTML=item.title.replace('\n','<br>').replace(/(SYSTEMS\.|MOTION\.|REIMAGINED\.)/,'<i>$1</i>');
    $('#director-description').textContent=item.description;
    $('#director-enter').dataset.site=item.key;
  };
  displayScene(0);
  let directorScheduled=false;
  const directorScroll = () => {
    directorScheduled=false;
    if(!webDirector)return;
    const r=webDirector.getBoundingClientRect();
    const distance=Math.max(1,webDirector.offsetHeight-innerHeight);
    const t=Math.max(0,Math.min(0.999,(-r.top)/distance));
    const visible=r.bottom>0 && r.top<innerHeight;
    if(!visible)return;
    const scene=Math.min(2,Math.floor(t*3));
    displayScene(scene);
    $('#director-track-progress').style.transform=`scaleX(${Math.max(.025,t)})`;
    webDirector.style.setProperty('--director-travel',String(t*95)+'px');
  };
  const scheduleDirector=()=>{if(directorScheduled)return;directorScheduled=true;requestAnimationFrame(directorScroll)};
  window.addEventListener('scroll', scheduleDirector,{passive:true});
  window.addEventListener('resize', scheduleDirector,{passive:true});
  scheduleDirector();
  const theater = $('#website-theater');
  const frame = $('#theater-iframe');
  let theaterIndex = 0, beforeFocus=null, theaterRun=0;
  const openWebsite = key => {
    const idx=websiteCases.findIndex(x=>x.key===key);
    if(idx<0)return;
    const wasOpen=theater.classList.contains('open');
    theaterIndex=idx;
    const item=websiteCases[idx];
    $('#theater-title').textContent=item.name;
    $('#theater-curtain-name').textContent=item.name;
    $('#theater-tagline').textContent=item.kind;
    $('#theater-address').textContent=item.address;
    $('#theater-number').textContent=String(idx+1).padStart(2,'0')+' / 03';
    $('#theater-tab').href=item.url;
    $('#theater-tab').setAttribute('aria-label','Open '+item.name+' demo in a new tab');
    const curtain=$('.theater-curtain');
    const token=++theaterRun;
    curtain.classList.remove('finished');
    theater.classList.add('open');
    theater.setAttribute('aria-hidden','false');
    document.body.classList.add('website-theater-open');
    $('#avatar-follower')?.classList.add('theater-hidden');
    if(!wasOpen) beforeFocus=document.activeElement;
    $('#theater-exit').focus();
    const swap=()=>{
      if(token!==theaterRun)return;
      // srcdoc is the actual complete functional site, not a screenshot or mockup.
      if(window.__demoSites?.[item.key]) frame.srcdoc=window.__demoSites[item.key];
      else frame.src=item.url;
      window.setTimeout(()=>{if(token===theaterRun)curtain.classList.add('finished')},reduceMotion?0:270);
    };
    window.setTimeout(swap,reduceMotion?0:wasOpen?190:330);
  };
  const closeWebsite=()=>{
    ++theaterRun;
    theater.classList.remove('open');theater.setAttribute('aria-hidden','true');
    document.body.classList.remove('website-theater-open');
    $('#avatar-follower')?.classList.remove('theater-hidden');
    frame.removeAttribute('srcdoc');frame.removeAttribute('src');
    if(beforeFocus?.focus)beforeFocus.focus();
  };
  $('#director-enter')?.addEventListener('click',e=>openWebsite(e.currentTarget.dataset.site));
  $$('.concept').forEach((el,i)=>{
    el.setAttribute('role','button');
    el.setAttribute('aria-label','Explore the '+websiteCases[i].name+' interactive website demo');
    el.addEventListener('click',()=>openWebsite(el.dataset.site));
    el.addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();openWebsite(el.dataset.site)}});
  });
  $('#theater-exit')?.addEventListener('click',closeWebsite);
  $('#theater-next')?.addEventListener('click',()=>openWebsite(websiteCases[(theaterIndex+1)%3].key));
  $('#theater-prev')?.addEventListener('click',()=>openWebsite(websiteCases[(theaterIndex+2)%3].key));
  theater?.addEventListener('keydown', e=>{
    if(e.key==='Escape'){e.preventDefault();closeWebsite();}
    if(e.key==='ArrowRight' && e.target!==frame)openWebsite(websiteCases[(theaterIndex+1)%3].key);
    if(e.key==='ArrowLeft' && e.target!==frame)openWebsite(websiteCases[(theaterIndex+2)%3].key);
    if(e.key==='Tab'){
      const items=Array.from(theater.querySelectorAll('button:not(:disabled),a[href]'));
      const first=items[0],last=items[items.length-1];
      if(e.shiftKey && document.activeElement===first){e.preventDefault();last.focus()}
      else if(!e.shiftKey && document.activeElement===last){e.preventDefault();first.focus()}
    }
  });
  document.addEventListener('keydown',e=>{if(e.key==='Escape' && theater.classList.contains('open'))closeWebsite()});

  // The illustrated teen guide is a contextual tour (not an AI chatbot).
  const avatar = $('#avatar-follower');
  const avatarButton = $('#avatar-button');
  const avatarCard = $('#avatar-tooltip');
  const guideChapter = $('#avatar-chapter');
  const guideHeading = $('#avatar-heading');
  const guideMessage = $('#avatar-message');
  const guideNext = $('#avatar-next');
  const guideCount = $('#avatar-count');
  const guideClose = $('#avatar-close');
  const chapterMap = [
    {id:'hero', chapter:'00 / INTRODUCTION', heading:'Hello, I’m Mann.', message:'I like turning ideas into things that actually work.', next:'#about', label:'MEET MANN'},
    {id:'about', chapter:'01 / ABOUT', heading:'Where it starts.', message:'I learn the most when I’m building, testing and trying again.', next:'#services', label:'WHAT HE DOES'},
    {id:'services', chapter:'02 / WHAT I DO', heading:'What I work on.', message:'AI, connected automations and websites are where I spend most of my time.', next:'#work', label:'EXPLORE THE WORK'},
    {id:'cinema', chapter:'03 / THE PHILOSOPHY', heading:'The process matters.', message:'An idea is just the start. Building it is where it gets interesting.', next:'#work', label:'SEE THE PROJECTS'},
    {id:'work', chapter:'04 / SELECTED WORK', heading:'Selected projects.', message:'Here’s some of the work I’ve been creating and experimenting with.', next:'#mathgem', label:'DISCOVER MATHGEM'},
    {id:'mathgem', chapter:'05 / MATHGEM', heading:'MathGem.', message:'I started MathGem to explore better ways to see and understand science.', next:'https://mathgem.in', label:'VISIT MATHGEM'},
    {id:'showcase', chapter:'06 / WEB DESIGN', heading:'Web development.', message:'Three interface ideas I turned into working website studies.', next:'#automation', label:'EXPLORE AUTOMATION'},
    {id:'automation', chapter:'07 / AI AUTOMATION', heading:'Automation in action.', message:'This system handles campaigns from scheduling to publishing.', next:'#experiments', label:'SEE THE EXPERIMENT'},
    {id:'experiments', chapter:'08 / DIGITAL EXPERIMENT', heading:'Geometry in motion.', message:'A little mathematics experiment I wanted to bring to life.', next:'#method', label:'MY APPROACH'},
    {id:'method', chapter:'09 / MY APPROACH', heading:'How I approach work.', message:'I keep experimenting, testing and refining what I’ve built.', next:'#contact', label:'GET IN TOUCH'},
    {id:'contact', chapter:'10 / CONTACT', heading:'Let’s talk.', message:'Have something in mind? Reach out anytime.', next:'mailto:mathgem010@gmail.com', label:'SEND AN EMAIL'}
  ];
  const chapters = chapterMap.map(c => ({...c, el:document.getElementById(c.id)}));
  let activeSection='', lastY=window.scrollY, scrollTick=false;
  let touchOpened=false, chapterShiftTimer=0;
  const finePointer = window.matchMedia('(hover:hover) and (pointer:fine)').matches;
  const setCard = open => {
    avatar?.classList.toggle('show-tip',Boolean(open));
    avatarButton?.setAttribute('aria-expanded',String(Boolean(open)));
  };
  const showChapter = chapter => {
    if (!chapter) return;
    guideChapter.textContent=chapter.chapter;
    guideHeading.textContent=chapter.heading;
    guideMessage.textContent=chapter.message;
    guideNext.href=chapter.next;
    guideNext.firstChild.textContent=chapter.label+' ';
    guideCount.textContent=String(chapterMap.indexOf(chapter)+1).padStart(2,'0')+' / '+chapterMap.length;
    const external=!chapter.next.startsWith('#') && !chapter.next.startsWith('mailto:');
    if(external){guideNext.target='_blank';guideNext.rel='noopener noreferrer';}
    else {guideNext.removeAttribute('target');guideNext.removeAttribute('rel');}
    // Update the text silently. Scrolling must never open the explanation.
  };
  setCard(false);
  avatarButton?.addEventListener('pointerenter', e => {
    if(finePointer && e.pointerType!=='touch')setCard(true);
  });
  avatar?.addEventListener('pointerleave', () => {
    if(finePointer){setCard(false);touchOpened=false;}
  });
  avatarButton?.addEventListener('click', () => {
    if(!finePointer){touchOpened=!touchOpened;setCard(touchOpened)}
    else setCard(true);
  });
  avatarButton?.addEventListener('focus', () => setCard(true));
  avatar?.addEventListener('focusout', e => {
    if(!avatar.contains(e.relatedTarget) && !touchOpened)setCard(false);
  });
  guideClose?.addEventListener('click', () => {
    touchOpened=false;setCard(false);
    if(!finePointer)avatarButton?.blur();
  });
  document.addEventListener('pointerdown', e => {
    if(!finePointer && !avatar?.contains(e.target)){
      touchOpened=false;setCard(false);
    }
  });
  function updateScroll(){
    const max=Math.max(1,doc.scrollHeight-innerHeight);
    const y=Math.max(0,window.scrollY);
    const progress=Math.min(1,y/max);
    $('#scroll-progress').style.transform=`scaleX(${progress})`;
    const velocity = y - lastY;
    if (avatar){
      avatar.classList.add('visible');
      if (!reduceMotion){
        const drift=Math.sin(y/720)*10;
        const wander=Math.sin(y/1080)*18;
        const lift = Math.sin(y/560)*6 - Math.min(16, y*0.012);
        const tilt = Math.max(-6, Math.min(6, velocity * -0.08));
        const haloX = Math.sin(y/810)*8;
        const haloY = Math.cos(y/900)*-6;
        avatar.style.setProperty('--guide-drift',`${drift}px`);
        avatar.style.setProperty('--guide-wander',`${wander}px`);
        avatar.style.setProperty('--guide-x',`${wander}px`);
        avatar.style.setProperty('--guide-y',`${drift}px`);
        avatar.style.setProperty('--guide-lift',`${lift}px`);
        avatar.style.setProperty('--guide-tilt',`${tilt}deg`);
        avatar.style.setProperty('--guide-scale',`${1 + Math.min(.05, Math.abs(velocity)*0.00045)}`);
        avatar.style.setProperty('--guide-scale-mobile',`${1 + Math.min(.035, Math.abs(velocity)*0.0003)}`);
        avatar.style.setProperty('--halo-x',`${haloX}px`);
        avatar.style.setProperty('--halo-y',`${haloY}px`);
        avatar.style.setProperty('--halo-scale',`${1.02 + Math.abs(Math.sin(y/1200))*0.06}`);
        if(Math.abs(velocity)>8) avatar.classList.toggle('flipped',y<lastY);
      }
    }
    const center=y+innerHeight*.43;
    let chap=chapters[0];
    for(const item of chapters){if(item.el && center>=item.el.offsetTop)chap=item;}
    if(chap.id!==activeSection){
      activeSection=chap.id;
      showChapter(chapterMap.find(c=>c.id===chap.id));
      if(avatar && !reduceMotion){
        avatar.classList.remove('chapter-shift');
        window.clearTimeout(chapterShiftTimer);
        requestAnimationFrame(()=>avatar.classList.add('chapter-shift'));
        chapterShiftTimer=window.setTimeout(()=>avatar.classList.remove('chapter-shift'),880);
      }
    }
    if(avatar){
      const denseSections=['mathgem','showcase','automation','experiments'];
      avatar.classList.toggle('is-dense', (innerWidth<=700 && y>innerHeight*.68) || (innerWidth>700 && denseSections.includes(chap.id)));
    }
    // Low-cost section parallax; browser composites transforms on the GPU.
    const hero=$('#hero');
    if(!reduceMotion && hero){
      const p=Math.max(0,Math.min(1,y/innerHeight));
      hero.style.setProperty('--hero-scroll',`${p*145}px`);
      hero.style.setProperty('--hero-opacity',`${1-p*.78}`);
      hero.style.setProperty('--hero-topline-shift',`${p*-20}px`);
      hero.style.setProperty('--hero-topline-opacity',`${1-p*.22}`);
      hero.style.setProperty('--hero-main-shift',`${p*24}px`);
      hero.style.setProperty('--hero-main-opacity',`${1-p*.18}`);
      hero.style.setProperty('--hero-side-shift',`${p*58}px`);
      hero.style.setProperty('--hero-side-opacity',`${1-p*.55}`);
      hero.style.setProperty('--hero-foot-shift',`${p*74}px`);
      hero.style.setProperty('--hero-foot-opacity',`${1-p*.62}`);
      hero.style.setProperty('--hero-name-y',`${p*18}px`);
      hero.style.setProperty('--hero-name-x',`${Math.sin(y/500)*4}px`);
      hero.style.setProperty('--hero-line-grow',`${p*.7}`);
      hero.classList.toggle('hero-has-depth', p>.08);
      const inter=$('#cinema');
      if(inter){const r=inter.getBoundingClientRect();if(r.bottom>0&&r.top<innerHeight){
        const v=(innerHeight-r.top)/(innerHeight+r.height);
        inter.style.setProperty('--film-scroll',`${(v-.5)*110}px`);
      }}
    }
    lastY=y;
  }
  window.addEventListener('scroll',()=>{
    if(!scrollTick){scrollTick=true;requestAnimationFrame(()=>{updateScroll();scrollTick=false;});}
  },{passive:true});
  window.addEventListener('resize',updateScroll,{passive:true});
  updateScroll();
  const glow = $('#cursor-glow');
  if(glow && matchMedia('(hover:hover)').matches){
    window.addEventListener('pointermove',e=>{glow.style.left=e.clientX+'px';glow.style.top=e.clientY+'px';glow.style.opacity='1';},{passive:true});
  }

  // Genuine 3D parametric mathematics drawn with Canvas 2D projections, no libraries or bitmap trickery.
  const canvas = $('#kinetic-canvas');
  const viewport = $('.kinetic-canvas-wrap');
  if (canvas && viewport) {
    const ctx = canvas.getContext('2d',{alpha:false});
    let w=0,h=0,dpr=1,targetX=.23,targetY=.1,rotX=.23,rotY=.1,frame=0,visible=true,lastDraw=-1000;
    const strips = innerWidth < 700 ? 20 : 32, points = innerWidth < 700 ? 95 : 170;
    const finger={down:false};
    const fit = ()=>{dpr=Math.min(devicePixelRatio||1,2);w=Math.max(1,viewport.clientWidth);h=Math.max(1,viewport.clientHeight);canvas.width=Math.round(w*dpr);canvas.height=Math.round(h*dpr);ctx.setTransform(dpr,0,0,dpr,0,0);};
    fit();window.addEventListener('resize',fit,{passive:true});
    const norm = e => { const r=viewport.getBoundingClientRect(); return {x:(e.clientX-r.left)/r.width-.5,y:(e.clientY-r.top)/r.height-.5};};
    viewport.addEventListener('pointermove',e=>{const v=norm(e);targetX=v.x*.85;targetY=v.y*.65});
    viewport.addEventListener('pointerleave',()=>{targetX=.23;targetY=.1});
    function knot(t){const p=2,q=3,R=2.2,r=.85;return [(R+r*Math.cos(q*t))*Math.cos(p*t),(R+r*Math.cos(q*t))*Math.sin(p*t),r*Math.sin(q*t)];}
    const sub=(a,b)=>a.map((v,i)=>v-b[i]);const cross=(a,b)=>[a[1]*b[2]-a[2]*b[1],a[2]*b[0]-a[0]*b[2],a[0]*b[1]-a[1]*b[0]];
    const unit=a=>{let n=Math.hypot(...a)||1;return a.map(x=>x/n)};
    function project(v,ax,ay){
      let [x,y,z]=v;let cy=Math.cos(ay),sy=Math.sin(ay),cx=Math.cos(ax),sx=Math.sin(ax);
      let xx=x*cy-z*sy,zz=x*sy+z*cy,yy=y*cx-zz*sx;zz=y*sx+zz*cx;
      const persp=5.8/(5.8+zz*.48);const scale=Math.min(w/9,h/7)*persp;
      return [w*.5+xx*scale,h*.51+yy*scale,zz,persp];
    }
    function draw(time){
      if(!visible){requestAnimationFrame(draw);return}
      if(innerWidth<700 && time-lastDraw<32){requestAnimationFrame(draw);return;}
      lastDraw=time;
      if(!reduceMotion){rotX+=(targetY-rotX)*.027;rotY+=(targetX-rotY)*.026;}
      const a=rotX+.18,b=rotY+(reduceMotion?.2:time*.000065);
      ctx.fillStyle='#10120f';ctx.fillRect(0,0,w,h);
      const wash=ctx.createRadialGradient(w*.5,h*.52,30,w*.5,h*.52,w*.65);
      wash.addColorStop(0,'#333026');wash.addColorStop(.42,'#1a1b18');wash.addColorStop(1,'#0b0d0c');ctx.fillStyle=wash;ctx.fillRect(0,0,w,h);
      ctx.save();ctx.globalAlpha=.07;ctx.strokeStyle='#ebc98b';ctx.lineWidth=1;for(let i=-10;i<11;i++){ctx.beginPath();ctx.moveTo(w/2+i*52,0);ctx.lineTo(w/2+i*52,h);ctx.stroke();}ctx.restore();
      const lines=[];
      for(let k=0;k<strips;k++){
        let ar=[],meanZ=0;
        for(let j=0;j<=points;j++){
          const t=j/points*Math.PI*2;const C=knot(t);const tang=unit(sub(knot(t+.002),knot(t-.002)));
          let N=unit(cross(tang,[.2,.1,1]));let B=unit(cross(tang,N));const phi=k/strips*Math.PI*2;
          const rad=.23+Math.sin(3*t+phi)*.026;
          const pos=C.map((v,d)=>v+rad*(N[d]*Math.cos(phi)+B[d]*Math.sin(phi)));
          const pr=project(pos,a,b);ar.push(pr);meanZ+=pr[2];
        }
        lines.push({a:ar,z:meanZ/points,k});
      }
      lines.sort((u,v)=>v.z-u.z);
      lines.forEach(({a,z,k})=>{
        const lum=.49+Math.max(-.2,Math.min(.2,z*.12));const alpha=Math.max(.16,Math.min(.86,lum+.23*Math.cos(k/strips*Math.PI*2)));
        ctx.lineWidth=k%6===0?1.75:.85;ctx.strokeStyle=`rgba(${k%7===0?'244,223,178':'190,153,103'},${alpha})`;
        ctx.beginPath();a.forEach((v,i)=>i?ctx.lineTo(v[0],v[1]):ctx.moveTo(v[0],v[1]));ctx.stroke();
      });
      // Axis ring and a careful center dot, making the object respond like an instrument.
      ctx.strokeStyle='rgba(206,171,119,.13)';ctx.lineWidth=.8;ctx.beginPath();ctx.ellipse(w/2,h/2,Math.min(w/2.6,h*.66),Math.min(w/4,h*.28),-.14,0,Math.PI*2);ctx.stroke();
      ctx.fillStyle='#e1c496';ctx.beginPath();ctx.arc(w*.5,h*.5,2,0,Math.PI*2);ctx.fill();
      frame++;
      requestAnimationFrame(draw);
    }
    const io=new IntersectionObserver(entries=>{visible=entries[0]?.isIntersecting??true});io.observe(viewport);
    if(ctx)requestAnimationFrame(draw);
  }
})();
