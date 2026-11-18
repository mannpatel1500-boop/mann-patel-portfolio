(() => {
 'use strict';
 const buttons=Array.from(document.querySelectorAll('[data-studio-flow]'));
 const panel=document.getElementById('precision-console');
 if(!panel||!buttons.length)return;
 const entries={"schedule":["01 / SCHEDULE TRIGGER","Start on schedule.","A timed n8n trigger begins the campaign cycle. It initiates the workflow without a manual launch each time."],"selector":["02 / CAMPAIGN SELECTOR","The next campaign, intelligently chosen.","A selection step rotates campaign topics and avoids repeating a product until the round is complete."],"creative":["03 / AI BRIEF AGENT","Creative direction, defined by context.","AI receives campaign requirements, past campaign context and visual rules, then assembles the content brief for the next steps."],"image":["04 / IMAGE GENERATION","Turn the brief into a visual.","An image generation step creates a new campaign visual from the selected topic and creative instructions."],"convert":["05 / IMAGE PIPELINE","Prepare the media for every platform.","The visual is converted to a publish-ready JPEG and hosted behind an accessible URL for connected publishing actions."],"caption":["06 / CAPTION AGENT","Write for the channel, not the template.","AI prepares a suitable caption from the campaign topic and the output format, separating copy generation from image generation."],"publish":["07 / PUBLISH ROUTER","One workflow. Connected destinations.","Prepared media and copy are routed to platform-specific publishing steps, with each API integration handled separately."],"facebook":["08 / FACEBOOK PAGE","Publish to the business feed.","The Facebook publishing branch sends the campaign visual and caption through the Page publishing integration."],"instagram":["09 / INSTAGRAM BUSINESS","Prepare and publish Instagram media.","The Instagram branch uses an externally accessible image URL and the platform’s media-create and publish steps."],"linkedin":["10 / LINKEDIN","Reach a professional audience.","The LinkedIn branch adapts the campaign for professional publishing through its dedicated integration."]};
 const reduce=window.matchMedia('(prefers-reduced-motion: reduce)').matches;
 const play=document.getElementById('flow-play');
 let playTimer=null,playing=false,index=0;
 function selectNode(key,opts={}){
   const info=entries[key],button=buttons.find(x=>x.dataset.studioFlow===key);
   if(!info||!button)return;
   buttons.forEach(b=>{const active=b===button;b.classList.toggle('is-selected',active);b.setAttribute('aria-pressed',String(active))});
   document.getElementById('flow-detail-type').textContent=info[0];
   document.getElementById('flow-detail-title').textContent=info[1];
   document.getElementById('flow-detail-copy').textContent=info[2];
   document.getElementById('precision-inspector-tag').textContent=String(buttons.indexOf(button)+1).padStart(2,'0')+' / 10';
   if(opts.center){
     const viewport=document.getElementById('precision-viewport');
     if(viewport && viewport.clientWidth < viewport.scrollWidth){
       const center=button.offsetLeft+button.offsetWidth/2;
       viewport.scrollTo({left:Math.max(0,center-viewport.clientWidth/2),behavior:reduce?'instant':'smooth'});
     }
   }
 }
 function stopPlay(){
   if(playTimer!==null)clearInterval(playTimer);
   playTimer=null;playing=false;
   if(play){play.setAttribute('aria-pressed','false');play.innerHTML='<span aria-hidden="true">▶</span> PLAY WALKTHROUGH'}
 }
 buttons.forEach((button,i)=>button.addEventListener('click',()=>{
   if(playing)stopPlay(); index=i;selectNode(button.dataset.studioFlow,{center:false});
 }));
 play?.addEventListener('click',()=>{
   if(playing){stopPlay();return}
   playing=true; index=0;
   play.setAttribute('aria-pressed','true');play.innerHTML='<span aria-hidden="true">Ⅱ</span> STOP WALKTHROUGH';
   selectNode(buttons[0].dataset.studioFlow,{center:true});
   playTimer=setInterval(()=>{
     index++;
     if(index>=buttons.length){stopPlay();return}
     selectNode(buttons[index].dataset.studioFlow,{center:true});
   },reduce?1800:1350);
 });
 document.addEventListener('visibilitychange',()=>{if(document.hidden)stopPlay()});
 // The walkthrough is purely visual: no live API, credential, or publishing calls.
})();
