(function(){
  var R=document.documentElement,exp=R.classList.contains('exp');
  // today's hours (New York time); ?now=2026-10-24T15:00 previews another time
  var m=location.search.match(/now=([\d\-T:]+)/),now=m?new Date(m[1]):new Date();
  var ny=new Date(now.toLocaleString('en-US',{timeZone:'America/New_York'})),d=ny.getDay(),h=ny.getHours()+ny.getMinutes()/60,open=d===0||d>=4;
  var st=document.querySelector('[data-status]'),td=document.querySelector('[data-today]');
  if(st){st.textContent=open&&h>=14&&h<20?'Open now · until 8 pm (listed hours)':open&&h<14?'Opens today at 2 pm (listed hours)':'Smash burgers · Hudson, NY';}
  if(td)td.textContent=open?'Today 2–8 pm':'Open Thu–Sun 2–8 pm';
  [].forEach.call(document.querySelectorAll('.hours tr'),function(tr){var x=+tr.dataset.d;if(x===d||(x===1&&d>=1&&d<=3))tr.classList.add('today');});
  // loops: play only on screen; saveData / reduced motion keep the poster
  var vids=[].slice.call(document.querySelectorAll('video.loop')),lite=R.classList.contains('lite');
  // video posters load on approach (or at once when the page is static), never in the first paint
  function poster(v){if(v.dataset.poster&&!v.poster)v.poster=v.dataset.poster;}
  if(!exp||!('IntersectionObserver' in window))vids.forEach(poster);else{var pio=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){poster(e.target);pio.unobserve(e.target);}});},{rootMargin:'150% 0px'});vids.forEach(function(v){pio.observe(v);});}
  if(exp&&!lite&&'IntersectionObserver' in window){var io=new IntersectionObserver(function(es){es.forEach(function(e){var v=e.target;
      if(e.isIntersecting){if(v.preload!=='auto'){v.preload='auto';}var p=v.play();if(p&&p.catch)p.catch(function(){});}else v.pause();});},{rootMargin:'200px 0px'});
    vids.forEach(function(v){io.observe(v);});}
  if(!exp||!window.gsap||!window.ScrollTrigger)return;
  var G=gsap;G.registerPlugin(ScrollTrigger);
  // staggered type: split headings into masked lines (hard mask) and rise them in
  [].forEach.call(document.querySelectorAll('[data-split]'),function(el){var words=el.innerHTML.split(/\s+(?![^<]*>)/);
    el.innerHTML=words.map(function(w){return '<span class="line" style="display:inline-block"><span>'+w+'</span></span>';}).join(' ');
    var parts=el.querySelectorAll('.line>span');
    if(el.id==='hero-h'){G.from(parts,{yPercent:110,duration:.8,stagger:.05,ease:'expo.out',delay:.05});}
    else G.from(parts,{yPercent:110,duration:.8,stagger:.05,ease:'expo.out',scrollTrigger:{trigger:el,start:'top 85%',toggleActions:'play none none none'}});});
  // quiet rises for menu rows and facts
  G.utils.toArray('.items li,.facts__row li,.step').forEach(function(el,i){G.from(el,{y:20,duration:.6,ease:'power2.out',scrollTrigger:{trigger:el,start:'top 92%',toggleActions:'play none none none'}});});
  // masked wipes into framed media
  G.utils.toArray('.frame.clip,.frame--menuboard').forEach(function(el){G.fromTo(el,{clipPath:'inset(0 0 100% 0)'},{clipPath:'inset(0 0 0% 0)',duration:.9,ease:'expo.out',scrollTrigger:{trigger:el,start:'top 85%'}});});
  // cut-out: SMASH grows until the paper is gone
  var g=document.querySelector('.cut__g'),t=document.querySelector('.cut__t'),cut=document.querySelector('.cut');
  if(g&&t){function fit(){var w=innerWidth,h=innerHeight;var bb=t.getBBox();var s=Math.min(w*.86/bb.width,h*.5/bb.height);g.dataset.s=s;place(+g.dataset.p||0);}
    function place(p){var s=+g.dataset.s,k=s*Math.pow(40,Math.pow(p,1.6)),w=innerWidth,h=innerHeight;g.setAttribute('transform','translate('+w/2+' '+h/2+') scale('+k+') translate('+(-w/2)+' '+(-h/2)+')');g.dataset.p=p;}
    var o={p:0};fit();addEventListener('resize',fit);
    G.to(o,{p:1,ease:'none',scrollTrigger:{trigger:cut,start:'top top',end:'bottom bottom',scrub:.3},onUpdate:function(){place(o.p);}});
    G.from('.cut__cap > *',{y:30,duration:.7,stagger:.1,ease:'power3.out',scrollTrigger:{trigger:cut,start:'45% top',toggleActions:'play none none reverse'}});}
  // pinned build: four steps, each swaps the photo with a hard top-down wipe
  var build=document.querySelector('.build'),steps=[].slice.call(document.querySelectorAll('.step')),shots=[].slice.call(document.querySelectorAll('.build__media .shot'));
  if(build&&steps.length){var cur=0;function set(i){if(i===cur)return;cur=i;steps.forEach(function(s,j){s.classList.toggle('is-on',j===i);});
      shots.forEach(function(s,j){if(j===i){G.fromTo(s,{clipPath:'inset(0 0 100% 0)',zIndex:2},{clipPath:'inset(0 0 0% 0)',duration:.55,ease:'expo.out',onComplete:function(){shots.forEach(function(o,k){if(k!==i)o.classList.remove('is-on');});s.classList.add('is-on');G.set(s,{zIndex:1});}});}});}
    ScrollTrigger.create({trigger:build,start:'top top',end:'+=220%',pin:'.build__pin',pinSpacing:true,onUpdate:function(st){set(Math.min(steps.length-1,Math.floor(st.progress*steps.length)));}});}
  // film triggers were created before the pinned scenes: re-sort by page order so the pin spacing is counted
  ScrollTrigger.sort();ScrollTrigger.refresh();
  if(document.fonts&&document.fonts.ready)document.fonts.ready.then(function(){ScrollTrigger.sort();ScrollTrigger.refresh();});
  addEventListener('load',function(){ScrollTrigger.sort();ScrollTrigger.refresh();});
})();
