// Smashburger Boxx film: scroll-scrubbed camera moves drawn on canvas straight from the full-resolution real photos.
// Engine rules carried from the Red Dot / Cafe Mutton film builds:
//  - AVIF tiers (1600 / 1200 wide, WebP fallback), chosen by the canvas backing size; never drawn above 1.0x once sharp
//  - poster first (1080x1440, the hero eager with fetchpriority=high); NO sharp source is requested before the first scroll
//  - priority loading: nearest film first, the rest only within 2.5 screens; saveData / ?lite keeps posters only
//  - the "dip" is a hard-edged ink wipe keyed to film progress, so it never depends on loading
(function(){
  var R=document.documentElement;if(!R.classList.contains('exp'))return;
  var G=window.gsap,ST=window.ScrollTrigger;if(!G||!ST){R.classList.remove('exp');return;}
  G.registerPlugin(ST);ST.config({ignoreMobileResize:true});
  var lite=R.classList.contains('lite'),ext='webp',avifKnown=false;
  new Promise(function(res){var t=new Image();t.onload=function(){res(t.width>0);};t.onerror=function(){res(false);};
    t.src='data:image/avif;base64,AAAAIGZ0eXBhdmlmAAAAAGF2aWZtaWYxbWlhZk1BMUIAAADybWV0YQAAAAAAAAAoaGRscgAAAAAAAAAAcGljdAAAAAAAAAAAAAAAAGxpYmF2aWYAAAAADnBpdG0AAAAAAAEAAAAeaWxvYwAAAABEAAABAAEAAAABAAABGgAAAB0AAAAoaWluZgAAAAAAAQAAABppbmZlAgAAAAABAABhdjAxQ29sb3IAAAAAamlwcnAAAABLaXBjbwAAABRpc3BlAAAAAAAAAAIAAAACAAAAEHBpeGkAAAAAAwgICAAAAAxhdjFDgQ0MAAAAABNjb2xybmNseAACAAIAAYAAAAAXaXBtYQAAAAAAAAABAAEEAQKDBAAAACVtZGF0EgAKCBgANogQEAwgMg8f8D///8WfhwB8+ErK42A=';})
    .then(function(a){ext=a?'avif':'webp';avifKnown=true;pump();});
  var dpr=function(){return Math.max(1,window.devicePixelRatio||1);};
  var EW=1080/1600; // the end window is 1080 source px wide on the 1600 master: exactly 1.0x at a 1080-wide backing
  function ease(t){return t<.5?2*t*t:1-Math.pow(-2*t+2,2)/2;}
  function Film(sec){
    this.sec=sec;this.name=sec.dataset.film;this.base=sec.dataset.src;this.stage=sec.querySelector('.stage');
    this.cv=this.stage.querySelector('canvas');this.ctx=this.cv.getContext('2d');this.poster=this.stage.querySelector('.film__poster');
    this.wipe=this.stage.querySelector('.film__wipe');
    var pp=sec.dataset.path.split('|').map(function(s){return s.split(',').map(Number);});this.a=pp[0];this.b=pp[1];
    this.p=0;this.img=null;this.req=false;this.tier=null;
  }
  var F=Film.prototype;
  // stage = the largest 3:4 frame that fits the free space AND never asks for more than 1080x1440 device px
  F.size=function(){var d=dpr(),mob=innerWidth<900,top=mob?56:64,bar=mob?76:0;
    var availH=innerHeight-top-bar-(mob?(this.name==='hero'?60:150):80),availW=mob?innerWidth-32:Math.min(innerWidth*.46,760);
    var h=Math.min(availH,availW*4/3,1440/d),w=Math.floor(h*.75);h=Math.floor(w*4/3);
    this.stage.style.setProperty('--sw',w+'px');this.stage.style.setProperty('--sh',h+'px');this.sec.style.setProperty('--sh',h+'px');
    var W=Math.min(1080,Math.round(w*d)),H=Math.round(W*4/3);if(this.cv.width!==W){this.cv.width=W;this.cv.height=H;}
    // smallest tier whose end window still covers the backing at <=1.0x
    var t=(W<=1200*EW)?'1200':'1600';if(lite)t=null;
    if(t!==this.tier){this.tier=t;if(this.img&&this.img.dataset.t!==t){this.img=null;this.req=false;}}
    this.draw();};
  F.away=function(){var r=this.sec.getBoundingClientRect(),h=innerHeight;return r.top>h?(r.top-h)/h:r.bottom<0?-r.bottom/h:0;};
  F.rect=function(sw,sh){var e=ease(this.p),z=this.a[2]+(this.b[2]-this.a[2])*e,cx=this.a[0]+(this.b[0]-this.a[0])*e,cy=this.a[1]+(this.b[1]-this.a[1])*e;
    var w=sw*z,h=w*4/3;if(h>sh){h=sh;w=h*.75;}var x=Math.max(0,Math.min(sw-w,cx*sw-w/2)),y=Math.max(0,Math.min(sh-h,cy*sh-h/2));return [x,y,w,h];};
  F.draw=function(){var im=this.img;if(!im)return;var r=this.rect(im.naturalWidth,im.naturalHeight),c=this.cv;
    this.ctx.imageSmoothingQuality='high';this.ctx.drawImage(im,r[0],r[1],r[2],r[3],0,0,c.width,c.height);
    this.scale=c.width/r[2];if(!this.stage.classList.contains('has-canvas'))this.stage.classList.add('has-canvas');};
  F.go=function(p){this.p=p;this.draw();
    // hard ink wipe at the very end (and back on reverse): progress-keyed, independent of loading
    var k=Math.max(0,Math.min(1,(p-.9)/.1));this.wipe.style.clipPath='inset('+(100-k*100).toFixed(2)+'% 0 0 0)';};
  F.state=function(){var r=this.img?this.rect(this.img.naturalWidth,this.img.naturalHeight):null;
    return {name:this.name,tier:this.tier,loaded:!!this.img,src:this.img?this.img.naturalWidth+'x'+this.img.naturalHeight:null,cw:this.cv.width,ch:this.cv.height,
      cssW:this.cv.clientWidth,dpr:dpr(),p:this.p,scaleDevPerSrc:r?(this.cv.clientWidth*dpr())/r[2]:null};};
  var films=[].slice.call(document.querySelectorAll('[data-film]')).map(function(s){return new Film(s);});
  var started=false,live=0;
  function load(f){f.req=true;live++;var im=new Image(),t=f.tier;im.decoding='async';im.dataset.t=t;
    im.onload=function(){(im.decode?im.decode():Promise.resolve()).catch(function(){}).then(function(){live--;if(f.tier===t){f.img=im;f.draw();}pump();});};
    im.onerror=function(){live--;pump();};im.src=f.base+'-'+t+'.'+ext;}
  function pump(){if(!started||lite||!avifKnown)return;
    films.slice().sort(function(a,b){return a.away()-b.away();}).forEach(function(f){if(!f.req&&f.tier&&live<2&&f.away()<=2.5)load(f);});}
  function go(){if(started)return;started=true;['scroll','wheel','touchmove','keydown'].forEach(function(e){removeEventListener(e,go);});
    films.forEach(function(f){if(f.poster.loading==='lazy')f.poster.loading='eager';});pump();}
  ['scroll','wheel','touchmove','keydown'].forEach(function(e){addEventListener(e,go,{passive:true});});
  addEventListener('scroll',function(){pump();},{passive:true});
  var rz;addEventListener('resize',function(){clearTimeout(rz);rz=setTimeout(function(){films.forEach(function(f){f.size();});ST.refresh();},150);});
  films.forEach(function(f){f.size();});
  if(scrollY>0)go();
  // progress clocks
  var prog=document.getElementById('prog'),chap=[].slice.call(document.querySelectorAll('.hero .chap li'));
  films.forEach(function(f){var o={p:0};
    G.to(o,{p:1,ease:'none',scrollTrigger:{trigger:f.sec,start:'top top',end:'bottom bottom',scrub:.35},onUpdate:function(){f.go(o.p);
      if(f.name==='hero'){prog.style.transform='scaleX('+o.p.toFixed(4)+')';var on=0;chap.forEach(function(li,i){if(o.p>=+li.dataset.at)on=i;});chap.forEach(function(li,i){li.classList.toggle('on',i===on);});}}});});
  if(chap[0])chap[0].classList.add('on');
  window.__sbbFilm={films:function(){return films.map(function(f){return f.state();});},started:function(){return started;},lite:lite};
})();
