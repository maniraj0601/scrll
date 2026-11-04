// Carousel Studio editor engine.
// The imperative editor (canvas, inspector, filmstrip, export, preview) mounted into a
// React-owned host element. Everything it touches globally — document/window listeners,
// ResizeObservers, body overflow, floating menus — is tracked and torn down by the
// returned dispose function, so the route can mount and unmount cleanly.
import { editorIconMarkup } from './icons.js'
import { STICKERS } from './stickers.js'
import { EDITOR_MARKUP } from './markup.js'
import { CAROUSELS } from '../catalog/carousels.js'
import { LAYOUTS } from '../catalog/layouts.js'
import { blobCp, G as GRADIENTS, scalCp, tearCp } from '../catalog/primitives.js'

const ICON_MARKUP = editorIconMarkup()
const iconSvg = (name, extra = '') => {
  const cls = extra.match(/\sclass="([^"]*)"/)
  const rest = extra.replace(/\sclass="[^"]*"/, '')
  return `<svg class="i${cls ? ` ${cls[1]}` : ''}" viewBox="0 0 24 24" aria-hidden="true"${rest}>${ICON_MARKUP[name] || ''}</svg>`
}
const CHROME = EDITOR_MARKUP.replace(/<i data-icon="([\w-]+)"([^>]*)><\/i>/g, (_, name, extra) => iconSvg(name, extra))

/**
 * Mount the editor into `container`.
 * @param {HTMLElement} container
 * @param {{ search?: string, hash?: string, onExit?: () => void }} options
 *   search: deep link (?template=id | ?new=1&ar=4/5&n=3 | ?sticker=id | ?open=projectId)
 *   onExit: called after the draft is saved when the user taps Back
 *   onMissing: called when the link names an unknown template or a draft that isn't stored
 * @returns {() => void} dispose
 */
export function mountEditor(container, { search = '', hash = '', onExit = () => {}, onMissing = onExit } = {}) {
  const tracked = []
  const listen = (target, type, fn, opts) => {
    target.addEventListener(type, fn, opts)
    tracked.push([target, type, fn, opts])
  }
  const observers = []
  const ResizeObserver = class extends window.ResizeObserver {
    constructor(cb) {
      super(cb)
      observers.push(this)
    }
  }
  const bodyBefore = new Set(document.body.children)
  container.innerHTML = CHROME

  /* ---- legacy engine (converted from editor.html) ---- */

const photoURL=(id,w=1200)=>`https://images.unsplash.com/${id}?auto=format&fit=crop&w=${w}&q=85`;
const PREVIEW_TARGETS=[
 ['default','Default'],['mobile-wallpaper','Mobile wallpaper'],['desktop-wallpaper','Desktop wallpaper'],['facebook','Facebook'],['instagram','Instagram']
],pvKey=()=>PREVIEW_TARGETS.some(([k])=>k===doc?.previewTarget)?doc.previewTarget:'default',
/* keep the inspector's "Preview as" and the preview header picker showing the same target */
pvSync=()=>{const k=pvKey(),i=document.querySelector('#pn [data-k=previewTarget]');if(i)i.value=k;if($('pvtarget').options.length)$('pvtarget').value=k},previewTargetName=k=>PREVIEW_TARGETS.find(([id])=>id===k)?.[1]||'Default';
/* stickers: library injected by vite (src/editor/stickers.js) */
const STK=STICKERS,SMAP=new Map(STK.items.map(s=>[s.id,s])),
 EMO=u=>`https://cdn.jsdelivr.net/gh/microsoft/fluentui-emoji@main/assets/${encodeURIComponent(u)}/Color/${u.toLowerCase().replace(/ /g,'_')}_color.svg`,
 stkSvg=(s,col)=>s.svg.replace(/currentColor/g,col||s.col||'#111111'),
 stkSrc=(s,col)=>s.k==='emoji'?EMO(s.u):s.k==='svg'?'data:image/svg+xml;charset=utf-8,'+encodeURIComponent(stkSvg(s,s.tint?col:'')):'',
 stkDark=(s,col)=>s.tint&&/^#f{3,6}$/i.test(col||s.col||'');
const HID={lay:new Set(),stk:new Set()};
try{HID.lay=new Set(JSON.parse(localStorage.getItem('cs.hiddenLay')||'[]'));HID.stk=new Set(JSON.parse(localStorage.getItem('cs.hiddenStk')||'[]'))}catch(_){}
const hidSave=()=>{try{localStorage.setItem('cs.hiddenLay',JSON.stringify([...HID.lay]));localStorage.setItem('cs.hiddenStk',JSON.stringify([...HID.stk]))}catch(_){}};

const CAT={templates:CAROUSELS,layouts:LAYOUTS,gradients:GRADIENTS},TPL=CAT.templates,G=CAT.gradients;

const FONT={s:'var(--serif)',n:'var(--sans)',h:'var(--hand)',inter:'Inter,system-ui,sans-serif',bebas:"'Bebas Neue',Impact,sans-serif",bodo:"'Bodoni Moda',Georgia,serif",dance:"'Dancing Script',cursive",roboto:"'Roboto Mono',monospace"};
function layer(l){
 let st=`left:${l.x}%;top:${l.y}%;width:${l.w}%;`;
 if(l.circ)st+='height:auto;aspect-ratio:1;';else if(l.h)st+=`height:${l.h}%;`;
 if(l.r)st+=`transform:rotate(${l.r}deg);`;
 if(l.rd)st+=`border-radius:${l.rd};`;
 if(l.o!=null)st+=`opacity:${l.o};`;
 if(l.t==='s'){const s=SMAP.get(l.id);return s?`<img class="L stk" src="${stkSrc(s,l.col)}" alt="" loading="lazy" style="left:${l.x}%;top:${l.y}%;width:${l.w}%;${l.r?`transform:rotate(${l.r}deg);`:''}${l.o!=null?`opacity:${l.o};`:''}">`:''}
 if(l.t==='i'){const tf=l.z||l.px||l.py?`transform:translate(${(l.px||0)*100}%,${(l.py||0)*100}%) scale(${l.z||1});`:'',fl=l.gs||l.bl?`filter:grayscale(${l.gs||0}) blur(${(l.bl||0)/10.8}cqw);`:'';
  return `<div class="L img" style="${st}${l.cp?`clip-path:polygon(${l.cp});`:''}${l.bw?`border:${l.bw}cqw solid ${l.bc||'#fff'};`:''}background:linear-gradient(${l.a||160}deg,${l.g[0]},${l.g[1]})">${l.photo?`<img class="template-photo" src="${photoURL(l.photo,700)}" alt="" loading="lazy" style="${tf}${fl}">`:''}</div>`}
 if(l.t==='r')return `<div class="L" style="${st}background:${l.c};${l.cp?`clip-path:polygon(${l.cp});`:''}"></div>`;
 if(l.t==='p')return `<div class="L pol" style="left:${l.x}%;top:${l.y}%;width:${l.w}%;transform:rotate(${l.r}deg)"><div class="img" style="background:linear-gradient(160deg,${l.g[0]},${l.g[1]})">${l.photo?`<img class="template-photo" src="${photoURL(l.photo,500)}" alt="" loading="lazy">`:''}</div><span>${l.cap}</span></div>`;
 const al=l.v==='c'?'center':l.v==='e'?'flex-end':'flex-start';
 return `<div class="L tx" style="${st}justify-content:${al};font:${l.wt||700} ${l.s}cqw/${l.lh||1.1} ${FONT[l.f||'n']};color:${l.c||'#fff'};text-align:${l.a||'left'};${l.ls?`letter-spacing:${l.ls}em;`:''}${l.bg?`background:${l.bg};`:''}${l.ts?`text-shadow:0 .2cqw ${(l.tb||8)/10.8}cqw rgba(0,0,0,${l.ts});`:''}${l.circ?'align-items:center;':''}">${l.text}</div>`;
}
function slides(t,c){
 if(t.m)return Array.from({length:t.m},(_,i)=>`<div class="slide"><div class="mw" style="width:${t.m*100}%;left:${-i*100}%;background:${t.bg}">${t.L.map(layer).join('')}</div></div>`).join('');
 return (c?t.S.slice(0,1):t.S).map(s=>`<div class="slide" style="background:${s.bg}">${s.L.map(layer).join('')}</div>`).join('');
}
const cnt=t=>(t.m?t.L:t.S.flatMap(s=>s.L)).filter(l=>l.t==='i'||l.t==='p').length;
TPL.forEach(t=>{t.style='Classic';t.tags=t.tags||'';t.p=cnt(t)});
const st={q:'',ar:'All',n:'Any',cat:'All'},$=id=>document.getElementById(id),ARL={All:'All','4/5':'Portrait 4:5','1/1':'Square 1:1','9/16':'Story 9:16'},NL=['Any','Text','1','2','3','4','5+'],cats=['All',...new Set(TPL.map(t=>t.cat))];
/* cutouts: % polygons used as clip paths (procedural torn edges, blobs, scallops) */
const 
 CUTT={tt:'t',tb:'b',ts:'tb',ta:'trbl',tl:'lr',wv:'tb'},
 cutCp=(k,q={})=>CUTT[k]?tearCp(CUTT[k],q.a??4,q.sd??1,q.sl??0,k==='wv'):k==='blob'?blobCp(q.sd??1):k==='scal'?scalCp():(typeof SHM!=='undefined'&&SHM.get(k)?.[2])||'',
 cpPts=(cp,w,h,ox=0,oy=0)=>cp.split(',').map(p=>{const[a,b]=p.trim().split(/\s+/);return (ox+parseFloat(a)/100*w).toFixed(1)+','+(oy+parseFloat(b)/100*h).toFixed(1)}).join(' ');
/* catalog (templates + Explore layouts) is injected by vite from src/catalog */
const EXP=CAT.layouts;
EXP.forEach(t=>{t.ex=1;t.style='Explore';t.p=cnt(t);TPL.push(t)});
const XCATS=['All',...new Set(EXP.map(t=>t.cat))];
let built=0;
function fbar(){if(!built){built=1;
 $('arseg').innerHTML=Object.entries(ARL).map(([k,v])=>`<button data-ar="${k}">${v}</button>`).join('');
 $('nchips').innerHTML=NL.map(k=>`<button class="chip" data-n="${k}">${k==='Any'?'Any photos':k==='Text'?'No photos':k==='1'?'1 photo':k+' photos'}</button>`).join('');
 $('chips').innerHTML=cats.map(c=>`<button class="chip" data-c="${c}">${c==='All'?'All layouts':c}</button>`).join('')}
 document.querySelectorAll('.fl [data-ar],.fl [data-n],.fl [data-c]').forEach(b=>{const d=b.dataset;b.setAttribute('aria-pressed',d.ar!=null?st.ar===d.ar:d.n!=null?st.n===d.n:st.cat===d.c)})}
const okN=t=>st.n==='Any'||(st.n==='Text'?t.p===0:st.n==='5+'?t.p>=5:t.p===+st.n);
const ARN={'4/5':'Portrait 4:5','1/1':'Square 1:1','9/16':'Story 9:16'},GORD=['Carousels','Seamless','Story','Editorial','Scrapbook','Tips & text'];
function cardHTML(t){const n=t.m||t.S.length;return `<article class="card" data-id="${t.id}"><div class="strip${t.m?' seam':''}" style="--ar:${t.ar};--b:${t.ar==='9/16'?'34%':'46%'}" tabindex="0" aria-label="${t.name} slides. Tap to preview.">${slides(t)}</div><div class="meta"><div><h3>${t.name}</h3><p>${ARN[t.ar]} · ${t.p?t.p+(t.p>1?' photos':' photo'):'Text only'} · ${n} slide${n>1?'s':''}</p></div><div class="mb"><button class="ic" data-pre="${t.id}" aria-label="Preview ${t.name}" data-tip="Preview all slides">${ic('eye')}</button><button class="use" data-id="${t.id}">Use</button></div></div></article>`}
function grid(){const q=st.q.trim().toLowerCase(),L=TPL.filter(t=>!t.ex&&(st.ar==='All'||t.ar===st.ar)&&okN(t)&&(st.cat==='All'||t.cat===st.cat)&&(!q||(t.name+' '+t.cat+' '+t.tags).toLowerCase().includes(q)));
 $('cnt').textContent=`${L.length} template${L.length===1?'':'s'}`;const G=$('grid');
 if(!L.length){G.className='grid';G.innerHTML='<p class="empty">No templates match. Try fewer filters.</p>';return}
 const B={};L.forEach(t=>(B[t.cat]=B[t.cat]||[]).push(t));G.className='groups';
 G.innerHTML=Object.keys(B).sort((a,b)=>(GORD.indexOf(a)+99)%99-(GORD.indexOf(b)+99)%99).map(c=>`<section class="gs"><div class="sec"><h2>${c}</h2><span>${B[c].length}</span></div><div class="grid">${B[c].map(cardHTML).join('')}</div></section>`).join('')}
let tt;function toast(m){const e=$('toast');e.textContent=m;e.classList.add('on');clearTimeout(tt);tt=setTimeout(()=>e.classList.remove('on'),2600)}
$('q').addEventListener('input',e=>{st.q=e.target.value;grid()});
document.querySelector('.fl').addEventListener('click',e=>{const b=e.target.closest('button');if(!b)return;const d=b.dataset;if(d.ar!=null)st.ar=d.ar;if(d.n!=null)st.n=d.n;if(d.c!=null)st.cat=d.c;fbar();grid()});
$('grid').addEventListener('click',e=>{const u=e.target.closest('.use');if(u)return openEd(TPL.find(x=>x.id===u.dataset.id));const p=e.target.closest('[data-pre]'),s=e.target.closest('.strip'),id=p?p.dataset.pre:s&&s.closest('.card').dataset.id;if(id)openTs(id)});

/* ===== Editor ===== */
const FAM={s:'"Playfair Display",Georgia,serif',n:'"DM Sans",system-ui,sans-serif',h:'Caveat,"Segoe Script",cursive',g:'Georgia,serif',m:'"Courier New",monospace',
 inter:'Inter,system-ui,sans-serif',man:'Manrope,system-ui,sans-serif',mont:'Montserrat,system-ui,sans-serif',pop:'Poppins,system-ui,sans-serif',round:'Quicksand,system-ui,sans-serif',
 lora:'Lora,Georgia,serif',bodo:'"Bodoni Moda",Georgia,serif',dance:'"Dancing Script","Segoe Script",cursive',paci:'Pacifico,cursive',marker:'"Permanent Marker",cursive',
 bebas:'"Bebas Neue",Impact,sans-serif',archivo:'"Archivo Black",Impact,sans-serif',roboto:'"Roboto Mono","Courier New",monospace'},
 FN={s:'Playfair Display',n:'DM Sans',h:'Caveat',g:'Georgia',m:'Mono',inter:'Instagram Modern',man:'Manrope',mont:'Montserrat',pop:'Poppins',round:'Rounded',lora:'Lora',bodo:'Bodoni Editorial',dance:'Signature Script',paci:'Pacifico',marker:'Marker',bebas:'Poster',archivo:'Bold Display',roboto:'Typewriter'},
 IMG=new Map(),NODES=new Map(),PH='linear-gradient(160deg,#cfd8dc,#8e9eab)',CAP=16e6;
let doc,hist=[],hi=0,sel=null,multi=new Set(),multiSelectMode=false,cur=0,z=.3,mode='slide',cropId=null,uid=0,kid=0,drag=null,fillT=null,leave=0,xa=1,kt,mvT=0,pds=null,lastFit=0,lpAt=0,lastTouch=0,lt={id:null,t:0},layTab='Split',layWhole=false,layGap=14,layMar=null,layRd=null,spaceDown=false,pan=null,pid=null,saveT=0,saved={},DBok=false,pvDark=false;
const ge=id=>doc.els.find(e=>e.id===id),SL=e=>Math.max(0,Math.min(doc.n-1,Math.floor((e.x+e.w/2)/doc.W))),rad=e=>Math.min(e.rd||0,Math.min(e.w,e.h)/2),
hex=v=>/^#[0-9a-f]{6}$/i.test(v)?v:/^#[0-9a-f]{3}$/i.test(v)?'#'+[...v.slice(1)].map(c=>c+c).join(''):'#888888',
esc=s=>String(s).replace(/[&<>"]/g,c=>'&#'+c.charCodeAt(0)+';'),nid=()=>'e'+(++uid);
const gr=(c,r)=>{const o=[];for(let j=0;j<r;j++)for(let i=0;i<c;i++)o.push([i/c,j/r,1/c,1/r]);return o};
const LAYS={'Full bleed':[[0,0,1,1]],'Two rows':[[0,0,1,.5],[0,.5,1,.5]],'Two columns':[[0,0,.5,1],[.5,0,.5,1]],'Three rows':gr(1,3),'Three columns':gr(3,1),'Strips':gr(1,4),
'Grid 2×2':gr(2,2),'Grid 2×3':gr(2,3),'Grid 3×2':gr(3,2),'Grid 3×3':gr(3,3),'Grid 4×2':gr(4,2),
'One plus two':[[0,0,1,.6],[0,.6,.5,.4],[.5,.6,.5,.4]],'Two plus one':[[0,0,.5,.4],[.5,0,.5,.4],[0,.4,1,.6]],'Tall plus two':[[0,0,.55,1],[.55,0,.45,.5],[.55,.5,.45,.5]],'Big plus three':[[0,0,1,.55],[0,.55,1/3,.45],[1/3,.55,1/3,.45],[2/3,.55,1/3,.45]],
'Mosaic':[[0,0,.6,.5],[.6,0,.4,.5],[0,.5,.4,.5],[.4,.5,.6,.25],[.4,.75,.6,.25]],'Masonry':[[0,0,.5,.35],[.5,0,.5,.55],[0,.35,.5,.65],[.5,.55,.5,.45]],'Feature left':[[0,0,.6,1],[.6,0,.4,1/3],[.6,1/3,.4,1/3],[.6,2/3,.4,1/3]],'Inset frame':[[0,0,1,1],[.55,.55,.4,.4]]};
const lgOf=e=>e&&e.lg&&doc.lg&&doc.lg[e.lg],autoMar=()=>{const e=sel&&ge(sel);return e&&e.type==='img'&&!layWhole?0:36};
const layRects=g=>{const x0=g.bx+g.mar,y0=g.by+g.mar,w0=Math.max(40,g.bw-2*g.mar),h0=Math.max(40,g.bh-2*g.mar);return LAYS[g.p].map(r=>({x:x0+r[0]*(w0+g.gap),y:y0+r[1]*(h0+g.gap),w:Math.max(8,r[2]*(w0+g.gap)-g.gap),h:Math.max(8,r[3]*(h0+g.gap)-g.gap)}))};
function reflow(gid){const g=doc.lg&&doc.lg[gid];if(!g)return;const R=layRects(g);doc.els.forEach(e=>{if(e.lg===gid&&R[e.li]){Object.assign(e,R[e.li]);e.rd=g.rd}})}
const LGR={Split:['Full bleed','Two rows','Two columns','Three rows','Three columns','Strips'],Grid:['Grid 2×2','Grid 2×3','Grid 3×2','Grid 3×3','Grid 4×2'],Collage:['One plus two','Two plus one','Tall plus two','Big plus three','Mosaic','Masonry','Feature left','Inset frame']};
const FD={br:1,ct:1,sa:1,gs:0,sp:0,hu:0,bl:0,ta:0,fd:0,vg:0},OD={flt:1,blend:1},
FP={Clarendon:{ct:1.2,sa:1.35,br:1.05,tn:'#7db9ff',ta:.09},Gingham:{br:1.05,ct:.9,sa:.85,sp:.1,fd:.1},Juno:{ct:1.15,sa:1.4,br:1.03,tn:'#ffd2a1',ta:.08,vg:.18},Lark:{br:1.12,ct:.95,sa:1.15,tn:'#9cc8ff',ta:.1},
Ludwig:{br:1.06,ct:1.06,sa:.88,sp:.06},Reyes:{sp:.22,br:1.1,ct:.85,sa:.75,fd:.12},Valencia:{ct:1.08,br:1.08,sp:.08,tn:'#ffc58f',ta:.14,fd:.05},'X-Pro II':{ct:1.3,sa:1.3,tn:'#ffdca8',ta:.08,vg:.42},
Nashville:{sp:.2,ct:1.18,br:1.05,tn:'#ff9fc7',ta:.13,fd:.05},Earlybird:{sp:.25,ct:1.1,br:1.03,tn:'#f4c999',ta:.1,vg:.32},Toaster:{ct:1.3,br:.95,tn:'#ff9a5a',ta:.12,vg:.5},'1977':{ct:.95,sa:1.3,br:1.08,tn:'#ff74b6',ta:.18,fd:.08},
Amaro:{br:1.12,sa:1.3,ct:.95,hu:-8,vg:.22},Mayfair:{ct:1.1,sa:1.12,tn:'#ffb3b3',ta:.1,vg:.26},Willow:{gs:.75,sp:.12,br:1.1,ct:.9,fd:.1},Walden:{br:1.1,sa:1.25,ct:.95,hu:4,tn:'#ffe7a3',ta:.15},
Film:{sp:.15,ct:1.05,sa:1.1,fd:.06,vg:.14,tn:'#ffd2a8',ta:.07},Moon:{gs:1,ct:1.1,br:1.1},Inkwell:{gs:1,ct:1.25,br:1.02},Noir:{gs:1,ct:1.4,br:.9,vg:.3}};
const FPK=['Clarendon','Gingham','Juno','Lark','Ludwig','Reyes','Valencia','X-Pro II','Nashville','Earlybird','Toaster','1977','Amaro','Mayfair','Willow','Walden','Film','Moon','Inkwell','Noir'];
const fxParams=(P,fi)=>{const o={};for(const k in FD)o[k]=FD[k]+((P[k]??FD[k])-FD[k])*fi;o.tn=P.tn||'';return o};
const hasA=e=>['br','ct','sa','gs','sp','hu','bl'].some(k=>e[k]!=null&&e[k]!==FD[k])||(e.sh||0)>0,hasF=e=>Object.keys(FD).some(k=>e[k]!=null&&e[k]!==FD[k])||(e.sh||0)>0,
filt=e=>hasA(e)?`brightness(${e.br??1}) contrast(${(e.ct??1)*(1+(e.sh||0)/500)}) saturate(${e.sa??1}) grayscale(${e.gs||0}) sepia(${e.sp||0}) hue-rotate(${e.hu||0}deg) blur(${e.bl||0}px)`:'none',
rgb=h=>{h=hex(h);return[1,3,5].map(i=>parseInt(h.slice(i,i+2),16))},
fxBg=e=>{const L=[];if(e.vg>0)L.push(`radial-gradient(circle farthest-corner at 50% 50%,rgba(0,0,0,0) 45%,rgba(0,0,0,${e.vg}) 100%)`);if(e.fd>0)L.push(`linear-gradient(rgba(222,218,214,${e.fd}),rgba(222,218,214,${e.fd}))`);
 if(e.ta>0&&e.tn){const[r,g,b]=rgb(e.tn);L.push(`linear-gradient(rgba(${r},${g},${b},${e.ta}),rgba(${r},${g},${b},${e.ta}))`)}return L.join(',')||'none'},
thumbOf=m=>{if(!m.th){const c=document.createElement('canvas'),s=120/Math.min(m.nw,m.nh);c.width=Math.max(1,Math.round(m.nw*s));c.height=Math.max(1,Math.round(m.nh*s));c.getContext('2d').drawImage(m.type==='video'?m.video:m.im,0,0,c.width,c.height);m.th=c.toDataURL('image/jpeg',.8)}return m.th};

const mctx=document.createElement('canvas').getContext('2d');
function fitT(e){if(e.type!=='text')return;const x=mctx;x.font=`${e.wt} ${e.fs}px ${FAM[e.f]}`;if('letterSpacing' in x)x.letterSpacing=e.ls*e.fs+'px';
 const need=Math.ceil(wrap(x,e.text,e.w).length*e.fs*e.lh);if(need>e.h+.5){const d=need-e.h;e.y-=e.v==='e'?d:e.v==='c'?d/2:0;e.h=need}}
function toDoc(t,ar){
 const W=1080,H=({'1/1':1080,'9/16':1920})[t&&t.ar||ar]||1350,n=t?(t.m||t.S.length):1,els=[];let bg=[];
 const add=o=>els.push({r:0,o:1,rd:0,...o,id:nid()}),pr=(v,w,h)=>!v?0:/%$/.test(v)?parseFloat(v)/100*Math.min(w,h):v,gr=(g,a)=>`linear-gradient(${a||160}deg,${g[0]},${g[1]})`;
 const lay=(l,ox,PW)=>{const x=ox+l.x/100*PW,y=l.y/100*H,w=l.w/100*PW,h=l.circ?w:(l.h||0)/100*H,fx=pr(l.rd,w,h);
  if(l.t==='i')add({type:'img',x,y,w,h,g:gr(l.g,l.a),s:l.z||1,ox:l.px||0,oy:l.py||0,rd:fx,r:l.r||0,o:l.o??1,...(l.gs?{gs:l.gs}:{}),...(l.bl?{bl:l.bl}:{}),...(l.bw?{bw:l.bw/100*W,bc:l.bc||'#ffffff'}:{}),...(l.cp?{cp:l.cp,ck:l.ck||'',...(l.cq?{cq:{...l.cq}}:{})}:{}),...(l.photo?{src:photoURL(l.photo)}:{})});
  else if(l.t==='s'){const s=SMAP.get(l.id);if(s)add({type:'img',stk:s.id,...(s.tint?{col:l.col||s.col}:{}),x,y,w,h:w*(s.a||1),g:'rgba(0,0,0,0)',s:1,ox:0,oy:0,r:l.r||0,o:l.o??1})}
  else if(l.t==='r')add({type:'shape',x,y,w,h,fill:l.c,cp:l.cp||'',rd:fx,r:l.r||0});
  else if(l.t==='t')add({type:'text',x,y,w,h,text:l.text,fs:l.s/100*W,f:l.f||'n',wt:l.wt||700,c:l.c||'#fff',a:l.a||'left',v:l.v||'t',ls:l.ls||0,lh:l.lh||1.1,bg:l.bg||'',rd:fx,r:l.r||0,o:l.o??1,...(l.ts?{ts:l.ts,tblur:l.tb||8,tc:'#000000'}:{})});
  else{const w2=l.w/100*PW,h2=w2/.85,cx=ox+l.x/100*PW+w2/2,cy=l.y/100*H+h2/2,r=l.r||0,q=r*Math.PI/180,c=Math.cos(q),s=Math.sin(q),pd=.05*w2,cp=.22*h2,ih=h2-pd-cp;
   const put=(dx,dy,pw,ph,o)=>add({...o,w:pw,h:ph,x:cx+dx*c-dy*s-pw/2,y:cy+dx*s+dy*c-ph/2,r});
   put(0,0,w2,h2,{type:'shape',fill:'#fff',sh:1,cp:''});put(0,pd+ih/2-h2/2,w2-2*pd,ih,{type:'img',g:gr(l.g),s:1,ox:0,oy:0,...(l.photo?{src:photoURL(l.photo)}:{})});
   put(0,h2/2-cp/2,w2,cp,{type:'text',text:l.cap,fs:.06*W,f:'h',wt:600,c:'#4a3b28',a:'center',v:'c',ls:0,lh:1.1,bg:''})}};
 if(!t)bg=['#ffffff'];else if(t.m){bg=Array(n).fill('');t.L.forEach(l=>lay(l,0,n*W))}else t.S.forEach((s,i)=>{bg.push(s.bg);s.L.forEach(l=>lay(l,i*W,W))});
 els.forEach(fitT);return{W,H,n,bg,mbg:t&&t.m?t.bg:'',els}}

function geo(e,m){const b=Math.max(e.w/m.nw,e.h/m.nh)*e.s,dw=m.nw*b,dh=m.nh*b,cl=(v,l)=>Math.max(-l,Math.min(l,v));
 return{dw,dh,ix:(e.w-dw)/2+cl(e.ox*e.w,Math.abs(dw-e.w)/2),iy:(e.h-dh)/2+cl(e.oy*e.h,Math.abs(dh-e.h)/2)}}
const clipStart=(e,m)=>Math.max(0,Math.min(m.duration||0,Number.isFinite(e.vs)?e.vs:0)),
 clipEnd=(e,m)=>{const d=m.duration||0;if(!d)return 0;const start=clipStart(e,m),end=Number.isFinite(e.ve)?e.ve:d;return Math.max(start,Math.min(d,end))},
 timeLabel=t=>`${Math.floor(t/60)}:${String(Math.floor(t%60)).padStart(2,'0')}.${Math.floor(t%1*10)}`;
let eraseMode=null,eraseSize=70,eraseDrag=null,cutDraw=null,slideOpen=false;
let brushOp='erase';const ERM=document.createElement('canvas');
function applyErase(c,e,w,h,k){if(!e.erase?.length)return;const cv=c.canvas;
 if(!e.erase.some(st=>st.u)){c.save();c.globalCompositeOperation='destination-out';strokes(c,e.erase,w,h,k);c.restore();return}
 // restore strokes: build an alpha mask (erase cuts, restore paints back), then keep only masked pixels
 ERM.width=cv.width;ERM.height=cv.height;const m=ERM.getContext('2d');m.fillStyle='#000';m.fillRect(0,0,cv.width,cv.height);m.setTransform(c.getTransform());
 let run=[],op=null;const flush=()=>{if(!run.length)return;m.globalCompositeOperation=op?'source-over':'destination-out';strokes(m,run,w,h,k);run=[]};
 e.erase.forEach(st=>{if(!!st.u!==op){flush();op=!!st.u}run.push(st)});flush();
 c.save();c.setTransform(1,0,0,1,0,0);c.globalCompositeOperation='destination-in';c.drawImage(ERM,0,0);c.restore();ERM.width=ERM.height=1}
function strokes(c,L,w,h,k){c.lineCap='round';c.lineJoin='round';c.strokeStyle=c.fillStyle='#000';
 L.forEach(st=>{const pts=st.pts||[];if(!pts.length)return;c.lineWidth=Math.max(1,st.r*2*Math.min(w,h)*k);c.beginPath();if(pts.length===1){c.arc(pts[0].x*w*k,pts[0].y*h*k,c.lineWidth/2,0,Math.PI*2);c.fill()}else{c.moveTo(pts[0].x*w*k,pts[0].y*h*k);pts.slice(1).forEach(p=>c.lineTo(p.x*w*k,p.y*h*k));c.stroke()}})}
function localImagePoint(e,cx,cy){const r=$('stage').getBoundingClientRect(),dx=(cx-r.left)/z-(e.x+e.w/2),dy=(cy-r.top)/z-(e.y+e.h/2),a=e.r*Math.PI/180,c=Math.cos(a),s=Math.sin(a);
 return{x:(dx*c+dy*s+e.w/2)/e.w,y:(-dx*s+dy*c+e.h/2)/e.h}}
/* freehand cutout: drag to lasso, or tap points (pen) and close on the first point */
function cutOv(d,e){if(!cutDraw)return;d=d||NODES.get(cutDraw.id);e=e||ge(cutDraw.id);if(!d||!e)return;let o=d.querySelector('.cutov');if(!o){o=document.createElementNS('http://www.w3.org/2000/svg','svg');o.setAttribute('class','cutov');o.setAttribute('preserveAspectRatio','none');d.append(o)}
 const w=e.w,h=e.h,P=cutDraw.pts,k=1/z,q=p=>`${(p.x*w).toFixed(1)},${(p.y*h).toFixed(1)}`,pts=P.map(q).join(' '),hv=cutDraw.hover,f=P[0],near=hv&&P.length>2&&!cutDraw.drag&&Math.hypot((hv.x-f.x)*w,(hv.y-f.y)*h)*z<16,line=pts+(hv&&!cutDraw.drag&&P.length?' '+q(near?f:hv):'');
 o.setAttribute('viewBox',`0 0 ${w} ${h}`);
 o.innerHTML=(P.length>2?`<path fill="rgba(0,0,0,.5)" fill-rule="evenodd" d="M0 0H${w}V${h}H0Z M${P.map(q).join(' L')}Z"/>`:`<rect width="${w}" height="${h}" fill="rgba(0,0,0,.22)"/>`)
  +(P.length?`<polyline points="${line}" fill="none" stroke="rgba(0,0,0,.55)" stroke-width="${4*k}" stroke-linejoin="round" stroke-linecap="round"/><polyline points="${line}" fill="none" stroke="#fff" stroke-width="${2*k}" stroke-linejoin="round" stroke-linecap="round"/>`:'')
  +(!cutDraw.drag&&P.length<160?P.map((p,i)=>`<circle cx="${(p.x*w).toFixed(1)}" cy="${(p.y*h).toFixed(1)}" r="${(i?4.5:near?9:6.5)*k}" fill="${i?'#fff':'#0a84ff'}" stroke="${i?'#0a84ff':'#fff'}" stroke-width="${2*k}"/>`).join(''):'')}
function cutStart(e){if(!e||e.type!=='img'||e.stk)return;eraseMode=null;cropId=null;$('brushCursor').style.display='none';cutDraw={id:e.id,pts:[],drag:null,hover:null};$('cw').classList.add('cutting');render();panel();toast('Drag to trace a shape, or tap point by point')}
function cutEnd(){cutDraw=null;$('cw').classList.remove('cutting')}
function cutCancel(){if(!cutDraw)return;cutEnd();render();panel()}
function rdp(P,eps){if(P.length<3)return P;const a=P[0],b=P[P.length-1],dx=b.x-a.x,dy=b.y-a.y,L=Math.hypot(dx,dy);let dm=0,ix=0;
 for(let i=1;i<P.length-1;i++){const d=L<1e-6?Math.hypot(P[i].x-a.x,P[i].y-a.y):Math.abs(dy*P[i].x-dx*P[i].y+b.x*a.y-b.y*a.x)/L;if(d>dm){dm=d;ix=i}}
 return dm>eps?[...rdp(P.slice(0,ix+1),eps).slice(0,-1),...rdp(P.slice(ix),eps)]:[a,b]}
function cutApply(){const D=cutDraw,e=D&&ge(D.id);if(!e){cutCancel();return}if(D.pts.length<3){toast('Add at least 3 points to cut a shape');return}
 const px=D.pts.map(p=>({x:p.x*e.w,y:p.y*e.h}));let eps=Math.max(.75,1/z),P=rdp(px,eps);while(P.length>300){eps*=1.5;P=rdp(px,eps)}
 if(P.length<3){toast('That shape is too small');return}
 e.cp=P.map(p=>`${+(p.x/e.w*100).toFixed(2)}% ${+(p.y/e.h*100).toFixed(2)}%`).join(',');e.ck='pen';delete e.cq;cutEnd();commit();render();panel();toast('Cutout applied · choose None to undo it')}
/* freehand drawing: brushes, per-stroke glow, eraser. Points are stored in the drawing's base box (bw × bh) and stretch with it. */
const BRUSH=[['pen','Pen','Smooth ink'],['pc','Pencil','Grainy pencil'],['mk','Marker','Bold marker'],['hl','Highlighter','See-through highlighter'],['neon','Neon','Glowing neon tube'],['cal','Calligraphy','Angled nib · thick and thin'],['er','Eraser','Erase ink (E)']],
 BR={pen:{sz:8,a:1},pc:{sz:5,a:.92},mk:{sz:22,a:.9},hl:{sz:40,a:.38},neon:{sz:10,a:1},cal:{sz:20,a:1},er:{sz:44}},
 INKC=['#16161a','#ffffff','#ff3b30','#ff9500','#ffcc00','#34c759','#30b0c7','#0a84ff','#5e5ce6','#af52de','#ff2d55','#a2845e'],
 GLC=['#ffffff','#ff2d55','#ff9f0a','#ffd60a','#30d158','#64d2ff','#0a84ff','#bf5af2'];
let drawMode=false,inkId=null,inkDrag=null,PEN={t:'pen',c:'#16161a',sz:{},o:1,g:0,gc:'',sm:45};
try{Object.assign(PEN,JSON.parse(localStorage.getItem('cs.pen')||'{}'));if(!BR[PEN.t])PEN.t='pen'}catch(_){}
const penSave=()=>{try{localStorage.setItem('cs.pen',JSON.stringify(PEN))}catch(_){}},
 penSz=t=>PEN.sz[t||PEN.t]??BR[t||PEN.t].sz,
 inkS=e=>[e.w/(e.bw||e.w),e.h/(e.bh||e.h)],
 glowR=s=>s.g>0?s.w*.7+s.g*.6:0,
 inkM=e=>Math.max(0,...e.st.map(s=>s.t==='er'?0:glowR(s)*1.7))*(inkS(e)[0]+inkS(e)[1])/2,
 mixW=(c,t)=>{const[r,g,b]=rgb(hex(c));return `rgb(${Math.round(r+(255-r)*t)},${Math.round(g+(255-g)*t)},${Math.round(b+(255-b)*t)})`},
 GRAIN=new Map();
function grain(x,c){let n=GRAIN.get(c);if(!n){n=document.createElement('canvas');n.width=n.height=64;const g=n.getContext('2d'),d=g.createImageData(64,64),[r,gg,b]=rgb(hex(c));
  for(let i=0;i<d.data.length;i+=4){d.data[i]=r;d.data[i+1]=gg;d.data[i+2]=b;d.data[i+3]=Math.random()<.7?150+Math.random()*105:Math.random()*70}g.putImageData(d,0,0);GRAIN.set(c,n)}return x.createPattern(n,'repeat')}
function inkPath(x,p){const n=p.length/2;x.beginPath();x.moveTo(p[0],p[1]);if(n===1){x.lineTo(p[0]+.01,p[1]);return}if(n===2){x.lineTo(p[2],p[3]);return}
 for(let i=1;i<n-1;i++){const ax=p[i*2],ay=p[i*2+1];x.quadraticCurveTo(ax,ay,(ax+p[i*2+2])/2,(ay+p[i*2+3])/2)}x.lineTo(p[n*2-2],p[n*2-1])}
function calPath(x,p,w){const a=-Math.PI/4,nx=Math.cos(a)*w/2,ny=Math.sin(a)*w/2,n=p.length/2;x.beginPath();if(n===1){x.ellipse(p[0],p[1],w/2,w/7,a,0,Math.PI*2);return}
 for(let i=0;i<n-1;i++){const x0=p[i*2],y0=p[i*2+1],x1=p[i*2+2],y1=p[i*2+3],q=[[x0+nx,y0+ny],[x1+nx,y1+ny],[x1-nx,y1-ny],[x0-nx,y0-ny]];if((x1-x0)*ny-(y1-y0)*nx<0)q.reverse();x.moveTo(q[0][0],q[0][1]);for(let j=1;j<4;j++)x.lineTo(q[j][0],q[j][1]);x.closePath()}}
function inkStroke(x,s,px){x.save();x.lineCap=s.t==='hl'?'butt':'round';x.lineJoin='round';
 if(s.t==='er'){x.globalCompositeOperation='destination-out';x.lineWidth=s.w;x.strokeStyle='#000';inkPath(x,s.p);x.stroke();x.restore();return}
 const a=(BR[s.t]?.a??1)*(s.o??1);x.globalAlpha=a;
 const body=(c,w)=>{if(s.t==='cal'){x.fillStyle=x.strokeStyle=c;calPath(x,s.p,w);x.fill();x.lineWidth=w*.12;x.stroke()}else{x.lineWidth=w;x.strokeStyle=s.t==='pc'?grain(x,c):c;inkPath(x,s.p);x.stroke()}};
 if(s.g>0){const[r,g,b]=rgb(hex(s.gc||s.c));x.shadowColor=`rgba(${r},${g},${b},${Math.min(1,.4+s.g/110)})`;x.shadowBlur=glowR(s)*px;const n=a<1?1:s.g>70?3:s.g>35?2:1;for(let i=0;i<n;i++)body(s.c,s.w);x.shadowColor='transparent';x.shadowBlur=0}
 else if(s.t!=='neon')body(s.c,s.w);
 if(s.t==='neon'){if(!(s.g>0))body(s.c,s.w);body(mixW(s.c,.75),s.w*.42)}
 x.restore()}
function inkDraw(x,e,k,M,from=0,to=e.st.length){const[sx,sy]=inkS(e);x.setTransform(k*sx,0,0,k*sy,M*k,M*k);for(let i=from;i<to;i++)inkStroke(x,e.st[i],k*(sx+sy)/2);x.setTransform(1,0,0,1,0,0)}
function inkCanvas(e,k){const M=inkM(e),c=document.createElement('canvas');c.width=Math.max(1,Math.ceil((e.w+2*M)*k));c.height=Math.max(1,Math.ceil((e.h+2*M)*k));inkDraw(c.getContext('2d'),e,k,M);return{c,M}}
function inkPaint(d,e){let c=d.firstElementChild;if(!c||c.tagName!=='CANVAS'){d.textContent='';c=document.createElement('canvas');c.className='ink';d.append(c)}
 const M=inkM(e),dpr=Math.min(2,devicePixelRatio||1),big=Math.max(e.w,e.h)+2*M;let k=Math.max(.25,Math.min(2,z*dpr));if(big*k>4096)k=4096/big;
 const W=Math.max(1,Math.ceil((e.w+2*M)*k)),H=Math.max(1,Math.ceil((e.h+2*M)*k)),live=inkDrag?.id===e.id,base=[W,H,M,e.w,e.h,e.bw,e.bh].join();
 Object.assign(c.style,{left:-M+'px',top:-M+'px',width:W/k+'px',height:H/k+'px'});
 if(!live){const sig=base+'|'+e.st.map(q=>q.t+q.c+q.w+(q.g||0)+(q.gc||'')+(q.o??1)+q.p.length).join();if(d._sig===sig)return;d._sig=sig;d._base=null;d._bk=null}else d._sig=null;
 if(c.width!==W||c.height!==H){c.width=W;c.height=H}const x=c.getContext('2d');x.setTransform(1,0,0,1,0,0);x.clearRect(0,0,W,H);
 if(live){const n=e.st.length-1,bk=base+'|'+n+'|'+k;if(d._bk!==bk){const b=d._base||(d._base=document.createElement('canvas'));b.width=W;b.height=H;inkDraw(b.getContext('2d'),e,k,M,0,n);d._bk=bk}x.drawImage(d._base,0,0);inkDraw(x,e,k,M,n)}
 else inkDraw(x,e,k,M)}
const inkExp=e=>{const W=doc.W;return e.x===SL(e)*W&&e.y===0&&e.w===W&&e.h===doc.H&&e.bw===W&&e.bh===doc.H&&!e.r};
function inkExpand(e){if(inkExp(e)){if(e._own!==1){e.st=e.st.map(q=>({...q,p:[...q.p]}));Object.defineProperty(e,'_own',{value:1,enumerable:false,configurable:true})}return}
 const s=SL(e),W=doc.W,[sx,sy]=inkS(e),av=(sx+sy)/2,a=(e.r||0)*Math.PI/180,c=Math.cos(a),si=Math.sin(a),cx=e.x+e.w/2,cy=e.y+e.h/2;
 e.st=e.st.map(q=>{const p=[];for(let i=0;i<q.p.length;i+=2){const lx=q.p[i]*sx-e.w/2,ly=q.p[i+1]*sy-e.h/2;p.push(+(cx+lx*c-ly*si-s*W).toFixed(1),+(cy+lx*si+ly*c).toFixed(1))}return{...q,w:+(q.w*av).toFixed(2),p}});
 Object.assign(e,{x:s*W,y:0,w:W,h:doc.H,bw:W,bh:doc.H,r:0})}
function inkVisible(e){if(!e.st.some(q=>q.t==='er'))return true;const{c}=inkCanvas(e,Math.min(1,256/Math.max(e.w,e.h))),d=c.getContext('2d').getImageData(0,0,c.width,c.height).data;for(let i=3;i<d.length;i+=4)if(d[i]>10)return true;return false}
function inkFit(e){if(!e.st.some(q=>q.t!=='er')||!inkVisible(e)){doc.els=doc.els.filter(q=>q!==e);return false}if(!inkExp(e))return true;
 let x0=1/0,y0=1/0,x1=-1/0,y1=-1/0;e.st.forEach(q=>{if(q.t==='er')return;const r=q.w/2;for(let i=0;i<q.p.length;i+=2){x0=Math.min(x0,q.p[i]-r);x1=Math.max(x1,q.p[i]+r);y0=Math.min(y0,q.p[i+1]-r);y1=Math.max(y1,q.p[i+1]+r)}});
 const w=Math.max(4,x1-x0),h=Math.max(4,y1-y0);e.st=e.st.map(q=>{const p=q.p.slice();for(let i=0;i<p.length;i+=2){p[i]=+(p[i]-x0).toFixed(1);p[i+1]=+(p[i+1]-y0).toFixed(1)}return{...q,p}});
 Object.assign(e,{x:e.x+x0,y:e.y+y0,w,h,bw:w,bh:h});return true}
function inkClose(){const e=inkId&&ge(inkId);inkId=null;if(!e)return null;const had=e.st.length,ok=inkFit(e);if(!ok&&had){commit()}else{hist[hi]=JSON.stringify(doc);saveSoon();fsSoon()}return ok?e.id:null}
function inkStart(){const e=sel&&ge(sel);cutEnd();sel=null;multi.clear();eraseMode=null;cropId=null;slideOpen=false;inkId=e?.type==='draw'?e.id:null;if(inkId)inkExpand(e);
 drawMode=true;mode='draw';$('cw').classList.add('drawing');$('ed').classList.add('inking');$('ed').classList.remove('ink-opt');$('bar').querySelector('[data-b=draw]').setAttribute('aria-pressed','true');render();panel();dockSync()}
function inkStop(keep){if(!drawMode)return;if(inkDrag){clearTimeout(inkDrag.hold);inkDrag=null}const id=inkClose();drawMode=false;mode='slide';$('cw').classList.remove('drawing');$('ed').classList.remove('inking','ink-opt');
 $('bar').querySelector('[data-b=draw]').setAttribute('aria-pressed','false');const bc=$('brushCursor');bc.className='';bc.style.display='none';bc.style.borderColor='';syncBrush();dockSync();
 if(keep&&id){sel=id;multi=new Set([id]);cur=SL(ge(id))}render();panel()}
function dockSync(){const d=$('dp');d.classList.toggle('on',drawMode);if(!drawMode){d.innerHTML='';return}
 d.innerHTML=BRUSH.map(([k,l])=>`<button type="button" data-a="inkt" data-v="${k}" aria-label="${l}" data-tip="${l}" aria-pressed="${PEN.t===k}">${ic('b_'+k)}</button>`).join('')
  +`<i class="sep" aria-hidden="true"></i><label class="dpc" data-tip="Colour" style="--c:${PEN.c}"><input type="color" value="${hex(PEN.c)}" aria-label="Ink colour"></label><button type="button" class="mo dpo" data-a="inkopt" aria-label="Brush options" aria-pressed="${$('ed').classList.contains('ink-opt')}">${ic('adjust')}</button><button type="button" class="dpd" data-a="inkdone">Done</button>`}
function inkCur(ev){const c=$('brushCursor');if(!drawMode||ev.pointerType!=='mouse'){if(drawMode)c.style.display='none';return}const r=$('stage').getBoundingClientRect(),w=Math.max(penSz(),5/z),er=PEN.t==='er';
 c.className=er?'ink er':'ink';Object.assign(c.style,{display:'block',left:(ev.clientX-r.left)/z+'px',top:(ev.clientY-r.top)/z+'px',width:w+'px',height:w+'px',borderColor:er?'':PEN.c})}
function inkHold(){const D=inkDrag;if(!D)return;clearTimeout(D.hold);D.hold=setTimeout(()=>{if(inkDrag!==D||D.line||D.st.p.length<10)return;const p=D.st.p;D.line=true;D.st.p=[p[0],p[1],+D.rx.toFixed(1),+D.ry.toFixed(1)];const e=ge(D.id);if(e)paint(NODES.get(e.id),e);navigator.vibrate?.(8)},600)}
const glowSw=(cur,a)=>`<button type="button" class="auto" data-a="${a}" data-v="" aria-label="Glow matches ink colour" data-tip="Match ink" aria-pressed="${!cur}">A</button>`+GLC.map(c=>`<button type="button" data-a="${a}" data-v="${c}" style="background:${c}" aria-label="Glow ${c}" aria-pressed="${cur===c}"></button>`).join('');
function syncBrush(){$('brushCursor').classList.toggle('restore',brushOp==='restore')}
function brushCursorAt(ev,e){const curEl=$('brushCursor');if(!eraseMode||!e||!ev.target.closest?.('.e')||ev.target.closest('.e')?.dataset.id!==eraseMode){curEl.style.display='none';return}const r=$('stage').getBoundingClientRect();Object.assign(curEl.style,{display:'block',left:(ev.clientX-r.left)/z+'px',top:(ev.clientY-r.top)/z+'px',width:eraseSize+'px',height:eraseSize+'px'})}
function paint(d,e){const s=d.style,r=rad(e)+'px',chosen=multi.has(e.id)||e.id===sel;d.className='e'+(e.type==='text'?' tx':'')+(chosen?' s':'')+(chosen&&multi.size>1?' multi':'');
 s.left=e.x+'px';s.top=e.y+'px';s.width=e.w+'px';s.height=e.h+'px';s.transform=`rotate(${e.r}deg)`;s.opacity=e.o;s.mixBlendMode=e.type==='img'&&e.blend&&e.blend!=='source-over'?e.blend:'normal';
 if(e.type==='text'){s.font=`${e.wt} ${e.fs}px/${e.lh} ${FAM[e.f]}`;s.color=e.c;s.textAlign=e.a;s.letterSpacing=e.ls+'em';s.justifyContent={t:'flex-start',c:'center',e:'flex-end'}[e.v];s.background=e.bg||'none';s.borderRadius=r;s.textShadow=e.ts>0?`0 ${Math.max(1,e.ts*3)}px ${e.tblur||6}px rgba(${rgb(e.tc||'#000000').join(',')},${e.ts})`:'none';if(d.textContent!==e.text)d.textContent=e.text}
 else if(e.type==='shape'&&e.ln){s.background='none';s.clipPath='none';s.borderRadius='0';s.boxShadow='none';s.filter=e.sh?'drop-shadow(0 3px 6px rgba(0,0,0,.3))':'none';const k=[e.w,e.h,e.lt,e.ln,e.a0,e.a1,e.fill].join('|');if(d._ln!==k){d._ln=k;d.innerHTML=lnSvg(e,'lns')}}
 else if(e.type==='shape'){s.background=e.fill;s.clipPath=e.cp?`polygon(${e.cp})`:'none';s.borderRadius=r;s.boxShadow=e.sh?'0 6px 22px rgba(0,0,0,.28)':'none';s.filter='none'}
 else if(e.type==='draw'){s.background='none';s.clipPath='none';s.borderRadius='0';s.boxShadow='none';s.filter='none';inkPaint(d,e)}
 else{const m=e.k&&IMG.get(e.k),crop=cropId===e.id,sg=(e.k||'')+crop+(m&&m.type||'');
  if(d._s!==sg){d._s=sg;d.textContent='';const mi=c=>{const i=m.type==='video'?document.createElement('video'):new Image();i.src=m.url;i.draggable=false;i.className=m.type==='video'?'vid':c;if(m.type==='video'){i.muted=true;i.playsInline=true;i.preload='auto';i.addEventListener('timeupdate',()=>{const from=clipStart(e,m),to=clipEnd(e,m);if(to>from&&i.currentTime>=to)i.currentTime=from;else if(i.currentTime<from)i.currentTime=from});i.addEventListener('ended',()=>{i.currentTime=clipStart(e,m);syncVideoPlayback()})}return i};if(m&&crop&&m.type!=='video')d.append(mi('gh'));const cl=document.createElement('div');cl.className='clip';if(m){cl.append(mi(''));const fx=document.createElement('i');fx.className='fx';cl.append(fx)}else{const ph=document.createElement('i');ph.className='img ph';const add=document.createElement('button');add.type='button';add.className='ph-add';add.setAttribute('aria-label','Add photo or video to this frame');add.innerHTML='<span>Add photo or video</span>';cl.append(ph,add)}d.append(cl)}
  const c=d.querySelector('.clip');c.style.borderRadius=r;c.style.background=m?'none':e.g;c.style.outline=e.bw?`${e.bw}px solid ${e.bc||'#fff'}`:'none';c.style.outlineOffset=e.bw?-e.bw+'px':'0';
  const cutting=cutDraw?.id===e.id;c.style.clipPath=e.cp&&!cutting?`polygon(${e.cp})`:'none';let cb=c.querySelector('.cpb');
  if(e.cp&&e.bw&&!cutting){c.style.outline='none';if(!cb){cb=document.createElementNS('http://www.w3.org/2000/svg','svg');cb.setAttribute('class','cpb');cb.setAttribute('preserveAspectRatio','none')}c.append(cb);cb.setAttribute('viewBox',`0 0 ${e.w} ${e.h}`);cb.innerHTML=`<polygon points="${cpPts(e.cp,e.w,e.h)}" fill="none" stroke="${e.bc||'#fff'}" stroke-width="${e.bw*2}" stroke-linejoin="round"/>`}else cb?.remove();
  if(cutting)cutOv(d,e);else d.querySelector('.cutov')?.remove();
  if(m){const g=geo(e,m),fx=d.querySelector('.fx');if(fx)fx.style.background=fxBg(e);d.querySelectorAll('img,video').forEach(i=>{i.style.width=g.dw+'px';i.style.height=g.dh+'px';i.style.left=g.ix+'px';i.style.top=g.iy+'px';i.style.filter=filt(e);i.style.transform=`scale(${e.fx?-1:1},${e.fy?-1:1})`});
   const cl=d.querySelector('.clip'),raw=cl.querySelector('img:not(.gh)'),existing=cl.querySelector('.erase-preview');
   if(m.type==='image'&&e.erase?.length){const c=existing||document.createElement('canvas'),scale=Math.min(.65,700/Math.max(e.w,e.h));if(!existing){c.className='erase-preview';cl.append(c)}c.width=Math.max(1,Math.round(e.w*scale));c.height=Math.max(1,Math.round(e.h*scale));const ctx=c.getContext('2d');ctx.setTransform(scale,0,0,scale,0,0);ctx.save();ctx.beginPath();ctx.roundRect(0,0,e.w,e.h,rad(e));ctx.clip();drawF(ctx,m,g,e,e.w,e.h,scale,m.im);ctx.restore();if(raw)raw.style.display='none'}
   else{existing?.remove();if(raw)raw.style.display=''}}}} 
function visibleSlide(){const v=$('cv'),zm=$('zm').getBoundingClientRect();return Math.max(0,Math.min(doc.n-1,Math.floor((v.getBoundingClientRect().left+v.clientWidth/2-zm.left)/(doc.W*z))))}
function syncVideoPlayback(){if(!doc)return;const active=!document.hidden&&$('ed').classList.contains('on')&&!$('pv').classList.contains('on'),slide=visibleSlide();doc.els.forEach(e=>{if(e.type!=='img'||!e.k)return;const m=IMG.get(e.k);if(m?.type!=='video')return;const video=NODES.get(e.id)?.querySelector('video');if(!video)return;if(active&&SL(e)===slide){const from=clipStart(e,m),to=clipEnd(e,m);if(to>from&&(video.currentTime<from||video.currentTime>=to))video.currentTime=from;if(video.paused)video.play().catch(()=>{if(!video.dataset.playError){video.dataset.playError='1';toast('This video format cannot play in the current browser.')}})}else video.pause()})}
function drawRulers(){if(!doc)return;const dpr=Math.max(1,window.devicePixelRatio||1),width=doc.n*doc.W*z,height=doc.H*z,target=48/Math.max(z,.01),power=10**Math.floor(Math.log10(target)),step=[1,2,5,10].map(v=>v*power).find(v=>v>=target)||10*power,minor=step/5;
 const paint=(id,length,vertical)=>{const canvas=$(`${id}`).querySelector('canvas'),ctx=canvas.getContext('2d'),cssW=vertical?22:length,cssH=vertical?length:22;canvas.style.width=cssW+'px';canvas.style.height=cssH+'px';canvas.width=Math.ceil(cssW*dpr);canvas.height=Math.ceil(cssH*dpr);ctx.setTransform(dpr,0,0,dpr,0,0);ctx.clearRect(0,0,cssW,cssH);ctx.fillStyle=getComputedStyle(document.documentElement).getPropertyValue('--mute').trim()||'#8e8e93';ctx.strokeStyle=getComputedStyle(document.documentElement).getPropertyValue('--line').trim()||'rgba(60,60,67,.16)';ctx.font='10px -apple-system,BlinkMacSystemFont,sans-serif';ctx.textBaseline='middle';
  for(let point=0;point<=(vertical?doc.H:doc.n*doc.W);point+=minor){const pos=point*z,major=Math.abs(point/step-Math.round(point/step))<1e-6;ctx.beginPath();if(vertical){ctx.moveTo(cssW, pos);ctx.lineTo(cssW-(major?9:4),pos)}else{ctx.moveTo(pos,cssH);ctx.lineTo(pos,cssH-(major?9:4))}ctx.stroke();if(major){const label=String(point);if(vertical){ctx.save();ctx.translate(7,Math.min(cssH-3,pos+2));ctx.rotate(-Math.PI/2);ctx.textAlign='left';ctx.fillText(label,0,0);ctx.restore()}else{ctx.textAlign='left';ctx.fillText(label,pos+3,cssH/2)}}}};
 $('rulerH').style.width=width+'px';$('rulerV').style.height=height+'px';paint('rulerH',width,false);paint('rulerV',height,true)}
function render(){const{W,H,n}=doc,st=$('stage');
 $('zm').style.width=n*W*z+'px';$('zm').style.height=H*z+'px';$('zf').textContent=Math.round(z*100)+'%';$('cw').classList.toggle('zoomed',Math.abs(z-fitZ())>.004);st.style.cssText=`width:${n*W}px;height:${H}px;transform:scale(${z});--k:${1/z}`;
 $('bgs').innerHTML=doc.mbg?`<div class="bg" style="left:0;top:0;width:${n*W}px;height:${H}px;background:${doc.mbg}"></div>`:doc.bg.map((b,i)=>`<div class="bg" style="left:${i*W}px;top:0;width:${W}px;height:${H}px;background:${b||'#fff'}"></div>`).join('');
 $('ov').innerHTML=Array.from({length:n-1},(_,i)=>`<div class="gl" style="left:${(i+1)*W}px"></div>`).join('')+Array.from({length:n},(_,i)=>`<div class="sn${i===cur?' on':''}" style="left:${i*W}px">${i+1}</div>`).join('');
 const box=$('els'),ids=new Set(doc.els.map(e=>e.id));
 NODES.forEach((d,id)=>{if(!ids.has(id)){d.remove();NODES.delete(id)}});
 doc.els.forEach((e,i)=>{let d=NODES.get(e.id);if(!d){d=document.createElement('div');d.dataset.id=e.id;NODES.set(e.id,d)}if(box.children[i]!==d)box.insertBefore(d,box.children[i]||null);paint(d,e)});
 drawRulers();place();btns();requestAnimationFrame(syncVideoPlayback)}
function boxOf(q){const a=q.r*Math.PI/180,w=Math.abs(Math.cos(a))*q.w+Math.abs(Math.sin(a))*q.h,h=Math.abs(Math.sin(a))*q.w+Math.abs(Math.cos(a))*q.h,cx=q.x+q.w/2,cy=q.y+q.h/2;return{l:cx-w/2,t:cy-h/2,r:cx+w/2,b:cy+h/2}}
function quickActions(e){const qa=$('qa');if(!e||drag||eraseDrag){qa.classList.remove('on');return}
 const m=e.type==='img'&&e.k&&IMG.get(e.k),crop=cropId===e.id,erasing=eraseMode===e.id,key=[e.id,e.type,m?m.type:'',crop,erasing,brushOp,!!e.fx].join('|');
 if(qa._k!==key){qa._k=key;const B=(a,icon,label,o={})=>`<button type="button" data-qa="${a}"${o.v!=null?` data-v="${o.v}"`:''} aria-label="${label}" data-tip="${label}"${o.on!=null?` aria-pressed="${o.on}"`:''}${o.danger?' class="danger"':''}>${ic(icon)}</button>`,sep='<i class="sep" aria-hidden="true"></i>',common=B('front','fwd','Bring to front')+B('dup','dup','Duplicate')+B('del','del','Delete',{danger:1});
  let h;
  if(e.type==='img'&&!m)h=B('pick','photo','Add photo or video')+sep+B('split','sph','Split side by side',{v:'h'})+B('split','spv','Split top and bottom',{v:'v'})+B('layfr','lay','Collage layouts')+sep+common;
  else if(crop)h=B('crop','done','Done cropping',{on:true})+B('fit','fit','Fit whole media')+B('fill','fill','Fill frame');
  else if(m&&e.stk)h=B('flipx','flx','Flip horizontally',{on:!!e.fx})+sep+common;
  else if(m)h=B('pick','photo',`Replace ${m.type} with a photo or video`)+B('crop','crop',m.type==='video'?'Move video in frame':'Crop',{on:false})+B('fit','fit','Fit whole media')+B('fill','fill','Fill frame')+B('flipx','flx','Flip horizontally',{on:!!e.fx})+(m.type==='image'?B('erase','brush',erasing?'Finish erasing':'Erase',{on:erasing})+(erasing?B('bop','unerase',brushOp==='restore'?'Back to erase':'Restore (un-erase)',{on:brushOp==='restore',v:brushOp==='restore'?'erase':'restore'}):''):'')+B('cutdraw','cut','Cutout · draw a shape')+sep+common;
  else if(e.type==='draw')h=B('inkedit','draw','Edit drawing')+sep+common;
  else h=common;
  qa.innerHTML=h}
 const b=boxOf(e),gap=64/z,est=52/z;qa.classList.add('on');let below=false,top=b.t-gap;
 if(top-est<0){if(b.b+16/z+est<=doc.H){below=true;top=b.b+16/z}else{below=true;top=Math.max(b.t,0)+24/z}}
 qa.classList.toggle('below',below);const w=qa.offsetWidth/z,maxX=doc.n*doc.W,cx=Math.min(Math.max((b.l+b.r)/2,w/2+4/z),maxX-w/2-4/z);
 Object.assign(qa.style,{left:cx+'px',top:top+'px'})}
function place(){const e=sel&&ge(sel),s=$('sel'),rp=$('rp'),items=[...multi].map(ge).filter(Boolean);if(items.length>1){const boxes=items.map(boxOf),x=Math.min(...boxes.map(q=>q.l)),y=Math.min(...boxes.map(q=>q.t)),r=Math.max(...boxes.map(q=>q.r)),b=Math.max(...boxes.map(q=>q.b));Object.assign(s.style,{display:'block',left:x+'px',top:y+'px',width:r-x+'px',height:b-y+'px',transform:'none'});s.classList.add('multi');rp.style.display='none';quickActions(null);return}s.classList.remove('multi');s.classList.toggle('ln',!!e?.ln);if(!e){s.style.display='none';rp.style.display='none';quickActions(null);return}
 Object.assign(s.style,{display:'block',left:e.x+'px',top:e.y+'px',width:e.w+'px',height:e.h+'px',transform:`rotate(${e.r}deg)`});
 const emp=e.type==='img'&&!e.k;rp.style.display=emp&&!drag?'grid':'none';
 if(emp)Object.assign(rp.style,{left:e.x+e.w/2+'px',top:e.y+e.h/2+'px',transform:'translate(-50%,-50%)'});
 quickActions(e)}
function btns(){$('un').disabled=$('un2').disabled=hi<1;$('rd').disabled=$('rd2').disabled=hi>=hist.length-1;$('pg').querySelector('span').textContent=`${cur+1} / ${doc.n}`;$('tt1').textContent=`Slide ${cur+1} of ${doc.n}`;document.querySelectorAll('.fsb[data-go]').forEach((b,i)=>{b.classList.toggle('on',i===cur);b.parentElement.classList.toggle('on',i===cur)});fsTb();document.querySelectorAll('.sn').forEach((b,i)=>b.classList.toggle('on',i===cur))}
function commit(){hist=hist.slice(0,hi+1);hist.push(JSON.stringify(doc));if(hist.length>80)hist.shift();hi=hist.length-1;btns();saveSoon();fsSoon()}
function undo(d){const j=hi+d;if(j<0||j>=hist.length)return;hi=j;doc=JSON.parse(hist[hi]);multi=new Set([...multi].filter(id=>ge(id)));if(sel&&!ge(sel))sel=multi.values().next().value||null;cur=Math.min(cur,doc.n-1);cropId=null;render();panel();pvSync();fsRender()}
const padS=()=>{const c=getComputedStyle($('zw'));return[parseFloat(c.paddingLeft)||0,parseFloat(c.paddingTop)||0]};
const fitZ=all=>{const v=$('cv'),[px,py]=padS();return Math.max(.03,Math.min((v.clientWidth-2*px)/(doc.W*(all?doc.n:1)),(v.clientHeight-2*py)/doc.H))};
function goSlide(i,inst){const v=$('cv'),r=$('zm').getBoundingClientRect(),vr=v.getBoundingClientRect();v.scrollBy({left:r.left+(i+.5)*doc.W*z-(vr.left+vr.width/2),top:r.top+doc.H*z/2-(vr.top+vr.height/2),behavior:inst?'auto':'smooth'})}
function startEd(d,id,nm){cutEnd();drawMode=false;inkId=null;inkDrag=null;$('cw').classList.remove('drawing');$('ed').classList.remove('inking','ink-opt');$('bar').querySelector('[data-b=draw]').setAttribute('aria-pressed','false');dockSync();doc=d;doc.previewTarget=PREVIEW_TARGETS.some(([k])=>k===doc.previewTarget)?doc.previewTarget:'default';if(nm&&!doc.name)doc.name=nm;pid=id||('p'+Date.now().toString(36));saved={};hist=[JSON.stringify(doc)];hi=0;sel=null;multi.clear();multiSelectMode=false;eraseMode=null;eraseDrag=null;$('brushCursor').style.display='none';$('bar').querySelector('[data-b=multi]').setAttribute('aria-pressed','false');cur=0;mode='slide';cropId=null;uid=Math.max(uid,...doc.els.map(e=>parseInt(String(e.id).slice(1))||0));NODES.clear();$('els').innerHTML='';
 $('ed').classList.add('on');document.body.style.overflow='hidden';$('cv').scrollLeft=0;$('sv').textContent='';doc.lg=doc.lg||{};layGap=14;layMar=null;layRd=null;z=lastFit=fitZ();render();panel();goSlide(0,1);fsSoon();toast('Tap anything to edit it');document.fonts.ready.then(()=>{if(doc){doc.els.forEach(fitT);render()}})}
let openSeq=0;
async function openEd(t){const d=toDoc(t,st.ar==='All'?'4/5':st.ar),seq=++openSeq,photos=d.els.filter(e=>e.src);
 if(photos.length){toast('Loading sample photos…');let failed=0;await Promise.all(photos.map(async(e,i)=>{try{const r=await fetch(e.src,{mode:'cors'});if(!r.ok)throw new Error(`Photo request failed (${r.status})`);const blob=await r.blob(),k=await load(new File([blob],`template-photo-${i+1}.jpg`,{type:blob.type||'image/jpeg'}));if(!k)throw new Error('Photo could not be decoded');e.k=k;delete e.src}catch{failed++;delete e.src}}));
  if(seq!==openSeq)return;if(failed)toast(`${failed} sample photo${failed===1?'':'s'} couldn’t load; you can add your own instead.`)}
 const sk=d.els.filter(e=>e.stk&&!e.k);if(sk.length){await Promise.all(sk.map(async e=>{try{e.k=await stkKey(SMAP.get(e.stk),e.col)}catch(_){}}));d.els=d.els.filter(e=>!e.stk||e.k);if(seq!==openSeq)return}
 if(seq===openSeq)startEd(d,null,t?t.name:'Untitled carousel')}

/* panels */
const IC=ICON_MARKUP;
const ic=n=>`<svg class="i" viewBox="0 0 24 24" aria-hidden="true">${IC[n]||''}</svg>`,
IB=(a,n,l,v,on,c='')=>`<button type="button" class="ib ico${c}" data-a="${a}"${v!=null?` data-v="${v}"`:''} data-tip="${l}" aria-label="${l}"${on!=null?` aria-pressed="${!!on}"`:''}>${ic(n)}</button>`,
TB=(a,n,l,v,on)=>`<button class="ib sm" data-a="${a}"${v!=null?` data-v="${v}"`:''}${on?' aria-pressed="true"':''}>${ic(n)}<span>${l}</span></button>`,
CH=(a,l,v)=>`<button class="chip" data-a="${a}" data-v="${v}">${l}</button>`,
GR=(l,h)=>`<div class="grp"><small>${l}</small><div class="seg">${h}</div></div>`,
S=(k,l,mn,mx,st)=>`<label class="pr"><span>${l}</span><input type="range" data-k="${k}" min="${mn}" max="${mx}" step="${st}"><input type="number" class="nm" data-k="${k}" min="${mn}" max="${mx}" step="${st}" inputmode="decimal" aria-label="${l} value"></label>`,
C=(k,l)=>`<label class="pr"><span>${l}</span><input type="color" data-k="${k}"></label>`,
/* inspector building blocks: tool tiles, icon segments, grouped sections, header and tabs */
TT=(a,n,l,o={})=>`<button type="button" class="tt${o.dz?' dz':''}" data-a="${a}"${o.v!=null?` data-v="${o.v}"`:''} data-tip="${o.tip||l}" aria-label="${o.tip||l}"${o.on!=null?` aria-pressed="${!!o.on}"`:''}>${ic(n)}<small>${l}</small></button>`,
TG=h=>`<div class="tg">${h}</div>`,
SG=h=>`<div class="sgc">${h}</div>`,
SEC=(t,b,x='')=>`<section class="is"><h4><span>${t}</span>${x}</h4><div class="isb">${b}</div></section>`,
AA=(a,l)=>`<button type="button" class="aa" data-a="${a}" data-tip="${l}" aria-label="${l}">${ic('all')}<span>All</span></button>`,
PL=(a,n,l,o={})=>`<button type="button" class="pl" data-a="${a}"${o.v!=null?` data-v="${o.v}"`:''}${o.tip?` data-tip="${o.tip}"`:''}>${ic(n)}<span>${l}</span></button>`,
HD=(k,t,sub,acts,tabs='')=>`<header class="ih"><div class="ih-r"><span class="ih-k">${ic(k)}</span><div class="ih-t"><b>${t}</b>${sub?`<small>${sub}</small>`:''}</div><div class="ih-a">${acts}</div></div>${tabs}</header>`,
TABS=(cur,list,a='ptab')=>`<div class="tabs" role="tablist">${list.map(([k,l])=>`<button type="button" role="tab" data-a="${a}" data-v="${k}" aria-selected="${cur===k}" aria-pressed="${cur===k}">${l}</button>`).join('')}</div>`,
ALN=a=>[['l','al_l','Align left'],['c','al_c','Centre horizontally'],['r','al_r','Align right'],['t','al_t','Align top'],['m','al_m','Centre vertically'],['b','al_b','Align bottom']].map(([v,n,l])=>IB(a,n,l,v)).join(''),
PT={};
/* ---- stickers: rasterised once to a crisp 1600px PNG so editing, filters and export treat them like photos ---- */
const STKC=new Map(),STCOL=['#ffffff','#111111','#ff6a2b','#ff3b30','#ffcc00','#34c759','#0a84ff','#af52de','#ff8fab','#c8a27a'];let stkTab='All',stkQ='';
async function stkKey(s,col){const id=s.id+'|'+(s.tint?col||s.col:'');if(STKC.has(id)&&IMG.has(STKC.get(id)))return STKC.get(id);
 let txt=s.k==='emoji'?await fetch(EMO(s.u)).then(r=>{if(!r.ok)throw new Error(r.status);return r.text()}):stkSvg(s,s.tint?col:'');
 const a=s.a||1,L=1600,w=a>1?Math.round(L/a):L,h=a>1?L:Math.round(L*a);
 txt=txt.replace(/<svg\b[^>]*>/,m=>m.replace(/\s(width|height)="[^"]*"/g,'').replace('<svg',`<svg width="${w}" height="${h}"`));
 const url=URL.createObjectURL(new Blob([txt],{type:'image/svg+xml'}));
 try{const im=new Image();im.src=url;await im.decode();const c=document.createElement('canvas');c.width=w;c.height=h;c.getContext('2d').drawImage(im,0,0,w,h);
  const b=await new Promise(r=>c.toBlob(r,'image/png'));const k=await load(new File([b],s.id+'.png',{type:'image/png'}));if(k)STKC.set(id,k);return k}finally{URL.revokeObjectURL(url)}}
const stkThumb=s=>{if(s.k!=='els')return `<img src="${stkSrc(s)}" alt="" loading="lazy" decoding="async">`;const hh=Math.max(...s.els.map(o=>o.y+o.h)),J={left:'flex-start',center:'center',right:'flex-end'};
 return `<div class="sth" style="aspect-ratio:${s.w}/${hh}">${s.els.map(o=>`<div style="left:${o.x/s.w*100}%;top:${o.y/hh*100}%;width:${o.w/s.w*100}%;height:${o.h/hh*100}%;border-radius:${(o.rd||0)/s.w*100}cqw;${o.type==='shape'?`background:${o.fill}`:`display:flex;align-items:center;justify-content:${J[o.a]||'flex-start'};text-align:${o.a};white-space:pre;font:${o.wt} ${o.fs/s.w*100}cqw/${o.lh||1.15} ${(FAM[o.f]||FAM.n).replace(/"/g,"'")};letter-spacing:${o.ls||0}em;color:${o.c};${o.bg?`background:${o.bg};`:''}${o.ts?'text-shadow:0 1px 4px rgba(0,0,0,.45)':''}`}">${o.type==='text'?esc(o.text):''}</div>`).join('')}</div>`},
 stkTile=(s,a,o={})=>`<button type="button" class="st${stkDark(s)?' dk':''}${s.bg?' bg':''}${o.on?' on':''}" data-a="${a}" data-v="${s.id}" data-s="${s.id}" data-tip="${esc(s.n)}" aria-label="${esc(s.n)}">${stkThumb(s)}${o.edit?`<span class="xck" aria-hidden="true">${o.on?ic('done'):''}</span>`:''}</button>`,
 stkList=(cat,q)=>{q=(q||'').trim().toLowerCase();return STK.items.filter(s=>!HID.stk.has(s.id)&&(cat==='All'||s.c===cat)&&(!q||(s.n+' '+s.c).toLowerCase().includes(q)))};
async function addSticker(id){const s=SMAP.get(id);if(!s||!doc)return;const W=doc.W,H=doc.H,ox=cur*W,j=()=>(Math.random()-.5)*W*.05;
 if(s.k==='els'){const sc=Math.min(1,W*.86/s.w),ew=s.w*sc,eh=Math.max(...s.els.map(o=>o.y+o.h))*sc,gid=s.els.length>1?'g'+Date.now().toString(36):null,x0=ox+(W-ew)/2+j(),y0=(H-eh)/2+j();
  const add=s.els.map(o=>({r:0,o:1,...o,x:x0+o.x*sc,y:y0+o.y*sc,w:o.w*sc,h:o.h*sc,rd:(o.rd||0)*sc,...(o.fs?{fs:o.fs*sc}:{}),...(gid?{group:gid}:{}),id:nid()}));
  doc.els.push(...add);add.forEach(e=>e.type==='text'&&fitT(e));setSelection(add.map(e=>e.id),add[0].id);commit();return}
 const col=s.tint?s.col:undefined,tg=sel&&ge(sel);let k;if(s.k==='emoji'&&!STKC.has(s.id+'|'))toast('Adding sticker…');
 try{k=await stkKey(s,col)}catch(_){}if(!k)return toast('Couldn’t load that sticker. Check your connection and try again.');
 const mk=(x,y,w,h,o={})=>({type:'img',stk:s.id,...(s.tint?{col}:{}),k,x,y,w,h,g:'rgba(0,0,0,0)',s:1,ox:0,oy:0,r:0,o:1,rd:0,...o,id:nid()});
 if(s.bg){const e=mk(ox,0,W,H);doc.els.unshift(e);setSelection([e.id]);commit();return}
 if(s.win){
  if(s.win.length===1&&tg&&tg.type==='img'&&!tg.stk&&tg.k){const[wx,wy,ww,wh]=s.win[0],fw=tg.w/ww,fh=fw*s.a,pcx=tg.x+tg.w/2,pcy=tg.y+tg.h/2,r=tg.r||0,q=r*Math.PI/180;
   tg.h=wh*fh;tg.y=pcy-tg.h/2;const dx=(.5-wx-ww/2)*fw,dy=(.5-wy-wh/2)*fh,cx=pcx+dx*Math.cos(q)-dy*Math.sin(q),cy=pcy+dx*Math.sin(q)+dy*Math.cos(q),fr=mk(cx-fw/2,cy-fh/2,fw,fh,{r});
   delete tg.lg;delete tg.li;const i=doc.els.indexOf(tg);doc.els.splice(s.over?i+1:i,0,fr);setSelection([fr.id]);commit();return}
  const fw=Math.min(s.w||W*.6,W*.86,H*.8/s.a),fh=fw*s.a,fx=ox+(W-fw)/2,fy=(H-fh)/2,fr=mk(fx,fy,fw,fh),wins=s.win.map(([x,y,w,h])=>({type:'img',x:fx+x*fw,y:fy+y*fh,w:w*fw,h:h*fh,g:PH,s:1,ox:0,oy:0,r:0,o:1,rd:0,id:nid()}));
  doc.els.push(...(s.over?[...wins,fr]:[fr,...wins]));setSelection([wins[0]?.id||fr.id]);commit();if(wins.length)toast('Tap a window to drop in your photo');return}
 const w=Math.min(s.w||300,W*.8),h=w*(s.a||1),e=mk(ox+(W-w)/2+j(),(H-h)/2+j(),w,h);doc.els.push(e);setSelection([e.id]);commit()}
/* shape library: clip-path polygons (%), rendered identically by CSS and the export canvas */
const SHP=(()=>{const P=a=>a.map(([x,y])=>`${+x.toFixed(2)}% ${+y.toFixed(2)}%`).join(','),rad=d=>d*Math.PI/180,
 reg=(n,o=-90)=>P(Array.from({length:n},(_,i)=>[50+50*Math.cos(rad(o+i*360/n)),50+50*Math.sin(rad(o+i*360/n))])),
 star=(n,r,o=-90)=>P(Array.from({length:n*2},(_,i)=>{const q=i%2?r:50,t=rad(o+i*180/n);return[50+q*Math.cos(t),50+q*Math.sin(t)]})),
 arc=(cx,cy,rx,ry,a,b,k=40)=>Array.from({length:k+1},(_,i)=>{const t=rad(a+(b-a)*i/k);return[cx+rx*Math.cos(t),cy+ry*Math.sin(t)]});
 return[
 ['rect','Square','',[480,480]],['round','Rounded','',[480,480],64],['pill','Pill','',[600,200],9999],['circle','Circle',P(arc(50,50,50,50,0,360,72).slice(0,-1)),[480,480]],
 ['tri','Triangle','50% 0%,100% 100%,0% 100%',[480,420]],['rtri','Corner','0% 0%,100% 100%,0% 100%',[440,440]],['diamond','Diamond','50% 0%,100% 50%,50% 100%,0% 50%',[440,520]],['pent','Pentagon',reg(5),[480,480]],
 ['hex','Hexagon',reg(6,0),[500,440]],['oct','Octagon',reg(8,22.5),[480,480]],['star','Star',star(5,21),[500,500]],['spark','Sparkle',star(4,12),[460,460]],
 ['burst','Badge',star(14,42),[480,480]],['heart','Heart',P(Array.from({length:72},(_,i)=>{const t=i/72*2*Math.PI,x=16*Math.sin(t)**3,y=13*Math.cos(t)-5*Math.cos(2*t)-2*Math.cos(3*t)-Math.cos(4*t);return[50+x*3.1,41-y*3.15]})),[500,460]],
 ['arch','Arch',P([...arc(50,40,50,40,180,360),[100,100],[0,100]]),[400,500]],['half','Half circle',P(arc(50,100,50,100,180,360)),[520,260]],
 ['arrow','Arrow','0% 32%,62% 32%,62% 4%,100% 50%,62% 96%,62% 68%,0% 68%',[540,300]],['chev','Chevron','0% 0%,70% 0%,100% 50%,70% 100%,0% 100%,30% 50%',[400,320]],
 ['para','Slant','22% 0%,100% 0%,78% 100%,0% 100%',[560,300]],['trap','Trapezoid','18% 0%,82% 0%,100% 100%,0% 100%',[500,320]],
 ['plus','Plus','36% 0%,64% 0%,64% 36%,100% 36%,100% 64%,64% 64%,64% 100%,36% 100%,36% 64%,0% 64%,0% 36%,36% 36%',[440,440]],
 ['bubble','Speech','0% 0%,100% 0%,100% 76%,42% 76%,18% 100%,22% 76%,0% 76%',[540,400]],['ribbon','Ribbon','0% 0%,100% 0%,90% 50%,100% 100%,0% 100%,10% 50%',[620,170]],['tag','Tag','0% 0%,80% 0%,100% 50%,80% 100%,0% 100%',[520,220]]]})(),
 SHM=new Map(SHP.map(q=>[q[0],q])),
 SHPV=q=>{const[w,h]=q[3],m=Math.max(w,h),vw=88*w/m,vh=88*h/m,ox=(100-vw)/2,oy=(100-vh)/2;return `<svg viewBox="0 0 100 100" aria-hidden="true">${q[2]?`<polygon points="${q[2].split(',').map(p=>{const[a,b]=p.trim().split(/\s+/);return `${(ox+parseFloat(a)/100*vw).toFixed(1)},${(oy+parseFloat(b)/100*vh).toFixed(1)}`}).join(' ')}"/>`:`<rect x="${ox}" y="${oy}" width="${vw}" height="${vh}" rx="${q[4]?Math.min(q[4]/m*88,vh/2):2}"/>`}</svg>`},
 LNV=[['solid','Line',{}],['dash','Dashed',{ln:'dash'}],['dot','Dotted',{ln:'dot'}],['arrow','Arrow',{a1:1}],['double','Double arrow',{a0:1,a1:1}]],
 lnGeo=e=>{const t=e.lt||6,ah=t*2.6+8,hw=ah*.55,round=e.ln!=='dash',x0=e.a0?ah*.8:round?t/2:0,x1=e.w-(e.a1?ah*.8:round?t/2:0);return{t,ah,hw,x0,x1,cy:e.h/2,dash:e.ln==='dash'?[t*3,t*2]:e.ln==='dot'?[.001,t*2]:[]}},
 lnSvg=(e,cls='')=>{const g=lnGeo(e),c=e.fill||'currentColor',w=e.w,cy=g.cy,pt=(x,y)=>x.toFixed(1)+','+y.toFixed(1);
  return `<svg${cls?` class="${cls}"`:''} viewBox="0 0 ${w.toFixed(1)} ${e.h.toFixed(1)}" aria-hidden="true"><line x1="${g.x0.toFixed(1)}" y1="${cy}" x2="${g.x1.toFixed(1)}" y2="${cy}" stroke="${c}" stroke-width="${g.t}" stroke-linecap="${e.ln==='dash'?'butt':'round'}"${g.dash.length?` stroke-dasharray="${g.dash.join(' ')}"`:''}/>${e.a1?`<polygon fill="${c}" points="${pt(w,cy)} ${pt(w-g.ah,cy-g.hw)} ${pt(w-g.ah,cy+g.hw)}"/>`:''}${e.a0?`<polygon fill="${c}" points="${pt(0,cy)} ${pt(g.ah,cy-g.hw)} ${pt(g.ah,cy+g.hw)}"/>`:''}</svg>`},
 lnFit=e=>{const t=e.lt||6,g=lnGeo(e),need=Math.max(t,(e.a0||e.a1)?g.hw*2:t)+24,cy=e.y+e.h/2;e.h=need;e.y=cy-need/2},
 lnDraw=(x,e)=>{const g=lnGeo(e);x.strokeStyle=x.fillStyle=e.fill||'#16161a';x.lineWidth=g.t;x.lineCap=e.ln==='dash'?'butt':'round';x.setLineDash(g.dash);x.beginPath();x.moveTo(g.x0,g.cy);x.lineTo(g.x1,g.cy);x.stroke();x.setLineDash([]);
  const head=(tip,dir)=>{x.beginPath();x.moveTo(tip,g.cy);x.lineTo(tip-dir*g.ah,g.cy-g.hw);x.lineTo(tip-dir*g.ah,g.cy+g.hw);x.closePath();x.fill()};if(e.a1)head(e.w,1);if(e.a0)head(0,-1)},
 LNGRID=(a,cur)=>`<div class="shp lnp">${LNV.map(([k,l,o])=>`<button type="button" data-a="${a}" data-v="${k}" data-tip="${l}" aria-label="${l}"${cur!=null?` aria-pressed="${cur===k}"`:''}>${lnSvg({w:64,h:24,lt:3.2,ln:'solid',...o,fill:'currentColor'})}<small>${l}</small></button>`).join('')}</div>`,
 lnKey=e=>LNV.find(([,,o])=>(o.ln||'solid')===(e.ln||'solid')&&!!o.a0===!!e.a0&&!!o.a1===!!e.a1)?.[0],
 SHGRID=(a,curK)=>`<div class="shp">${SHP.map(q=>`<button type="button" data-a="${a}" data-v="${q[0]}" data-tip="${q[1]}" aria-label="${q[1]}"${curK!=null?` aria-pressed="${curK===q[0]}"`:''}>${SHPV(q)}<small>${q[1]}</small></button>`).join('')}</div>`,
 FILLS=['#16161a','#ffffff','#f2e8dc','#ff3b30','#ff9500','#ffcc00','#34c759','#30b0c7','#3b4bff','#af52de','#ff2d55','#8e8e93',
  'linear-gradient(135deg,#f58529,#dd2a7b 55%,#8134af)','linear-gradient(135deg,#4facfe,#00f2fe)','linear-gradient(135deg,#f6d365,#fda085)','linear-gradient(135deg,#a18cd1,#fbc2eb)','linear-gradient(135deg,#43e97b,#38f9d7)','linear-gradient(135deg,#0f2027,#2c5364)'],
 shapeKey=e=>e.sk||(e.cp?'':e.rd>=Math.min(e.w,e.h)/2?'pill':e.rd>0?'round':'rect');
const CUTS=[['none','None'],['tt','Torn top'],['tb','Torn bottom'],['ts','Torn strip'],['ta','Torn edges'],['wv','Wavy'],['blob','Blob'],['scal','Scallop'],['circle','Circle'],['heart','Heart'],['star','Star'],['arch','Arch'],['hex','Hexagon'],['spark','Sparkle'],['burst','Badge'],['pen','Freehand']],
 CUTV=k=>k==='none'?'<svg viewBox="0 0 100 100" aria-hidden="true"><rect x="12" y="12" width="76" height="76" rx="6"/></svg>':k==='pen'?ic('lasso'):`<svg viewBox="0 0 100 100" aria-hidden="true"><polygon points="${cpPts(cutCp(k,{a:9,sd:5}),76,76,12,12)}"/></svg>`,
 CUTSEC=e=>{const k=e.ck||'none',torn=!!CUTT[k];return SEC('Cutout',`<div class="shp cut">${CUTS.map(([v,l])=>`<button type="button" data-a="cut" data-v="${v}" data-tip="${v==='pen'?'Draw your own shape':l}" aria-label="${l}" aria-pressed="${k===v}">${CUTV(v)}<small>${l}</small></button>`).join('')}</div>`
  +(torn?S('_ca',k==='wv'?'Wave':'Roughness',1,12,.5)+S('_csl','Angle',-20,20,1):'')
  +(torn||k==='blob'?TG(TT('retear','shuffle',torn?'Re-tear':'Reshape',{tip:torn?'Tear the edge differently':'Try another blob'})):'')
  +(k==='pen'?TG(TT('cutdraw','pen','Redraw',{tip:'Draw a new freehand shape'})):'')
  +'<p class="hint">Cuts the photo into a shape. Layer a torn-paper sticker under a torn edge for a white paper rim.</p>')};
function panel(){const e=sel&&ge(sel);let h='',key=mode;$('ed').classList.toggle('idle',!cutDraw&&!sel&&multi.size<2&&mode==='slide'&&!slideOpen);$('bar').querySelector('[data-b=slide]')?.setAttribute('aria-pressed',String(slideOpen&&mode==='slide'&&!sel));
 const DEL=a=>IB(a,'del','Delete (⌫)',null,null,' dz');
 if(cutDraw&&cutDraw.id!==sel)cutEnd();
 if(cutDraw){const n=cutDraw.pts.length;key='cut';
  h=HD('cut','Freehand cutout',n?`${n} point${n>1?'s':''}${n>2?' · tap the blue dot to close':''}`:'Draw on the selected photo',IB('cutx','x','Cancel (Esc)'))
   +`<ol class="cuthow"><li><b>Drag</b> around the part you want to keep — it cuts when you let go.</li><li>Or <b>tap</b> point by point for clean straight edges, then tap the first point (or press Return).</li></ol>`
   +TG(TT('cutundo','undo','Undo point',{tip:'Remove the last point (⌫)'})+TT('cutclr','reset','Clear',{tip:'Start again'})+TT('cutx','x','Cancel',{tip:'Leave without cutting (Esc)'}))
   +`<button type="button" class="add-hero" data-a="cutok"${n<3?' disabled':''}>${ic('cut')}<span><b>Apply cutout</b><small>${n<3?'Needs at least 3 points':'Return ↵'}</small></span></button>`}
 else if(multi.size>1){const gs=new Set([...multi].map(id=>ge(id)?.group).filter(Boolean)),canUngroup=gs.size===1&&[...multi].every(id=>ge(id)?.group),few=multi.size<3;key='multi';
  h=HD('multi',`${multi.size} selected`,canUngroup?'Group':'Shift-click to add or remove',IB('multiDup','dup','Duplicate selection')+DEL('multiDel')+IB('done','done','Done (Esc)'))
   +SEC('Arrange',TG(TT('front','front','Front',{tip:'Bring to front'})+TT('fwd','fwd','Forward',{tip:'Bring forward'})+TT('bwd','bwd','Backward',{tip:'Send backward'})+TT('bottom','bottom','Back',{tip:'Send to back'})),PL(canUngroup?'ungroup':'group',canUngroup?'ungroup':'group',canUngroup?'Ungroup':'Group',{tip:canUngroup?'Ungroup objects':'Group objects so they move together'}))
   +SEC('Align',SG(ALN('align')))
   +SEC('Distribute',SG((IB('dist','dist_h','Distribute horizontally','h')+IB('dist','dist_v','Distribute vertically','v')).replace(/<button/g,few?'<button disabled':'<button')),few?'<small class="isx">3+ objects</small>':'');
 }else if(e&&!(mode==='lay'&&e.type==='img')){const t=e.type,m=t==='img'&&e.k&&IMG.get(e.k),vid=m?.type==='video',isImg=m?.type==='image';
  const isStk=!!(e.stk&&m),tabs=t==='draw'?[['ink','Drawing'],['arrange','Arrange']]:isStk?[['stk','Sticker'],['adjust','Adjust'],['arrange','Arrange']]:t==='img'?(m?[['media',vid?'Video':'Photo'],['adjust','Adjust'],['arrange','Arrange']]:[['frame','Frame'],['arrange','Arrange']]):t==='text'?[['text','Text'],['style','Style'],['arrange','Arrange']]:e.ln?[['line','Line'],['arrange','Arrange']]:[['shape','Shape'],['style','Style'],['arrange','Arrange']],tk=t==='draw'?'draw':isStk?'stk':t==='img'?(m?'media':'frame'):e.ln?'line':t;
  let tab=PT[tk];if(!tabs.some(([k])=>k===tab))tab=tabs[0][0];panel.tk=tk;key=e.id+':'+tab;
  const kind=t==='draw'?'draw':isStk?'sticker':t==='text'?'text':e.ln?'line':t==='shape'?'shape':!m?'frame':vid?'video':'image',title=t==='draw'?'Drawing':isStk?'Sticker':t==='text'?'Text':e.ln?(e.a0||e.a1?'Arrow':'Line'):t==='shape'?'Shape':!m?'Empty frame':vid?'Video':'Photo',
   sub=t==='draw'?(n=>`${n} stroke${n===1?'':'s'}`)(e.st.filter(q=>q.t!=='er').length):isStk?esc(SMAP.get(e.stk)?.n||''):m?`${m.nw}×${m.nh} · ${(m.size/1048576).toFixed(1)} MB${vid&&m.duration?' · '+timeLabel(m.duration):''}`:t==='text'?(FN[e.f]||''):`${Math.round(e.w)} × ${Math.round(e.h)}`;
  h=HD(kind,title,sub,IB('dup','dup','Duplicate (⌘D)')+DEL('del')+IB('done','done','Done (Esc)'),TABS(tab,tabs));
  const OP=S('o','Opacity',0,1,.01),
   FRT=TG(TT('split','sph','Columns',{v:'h',tip:'Split side by side'})+TT('split','spv','Rows',{v:'v',tip:'Split top and bottom'})+TT('rdc','circ','Circle',{tip:'Make a circle frame'})+TT('layfr','lay','Layouts',{tip:'Collage layouts inside this frame'})),
   FRS=S('rd','Corners',0,400,1)+S('bw','Border',0,60,1)+C('bc','Colour'),
   SPC=lgOf(e)?SEC('Layout spacing',S('_gap','Gap',0,100,1)+S('_mar','Margin',0,300,1)+S('_cor','Corners',0,200,1),PL('edge','edge','Edge to edge',{v:'',tip:'Remove all gaps, margins and corners'})):'';
  if(tab==='arrange')h+=SEC('Layer',SG(IB('front','front','Bring to front')+IB('fwd','fwd','Bring forward ( ] )')+IB('bwd','bwd','Send backward ( [ )')+IB('bottom','bottom','Send to back')))
   +SEC('Align to slide',SG(ALN('al')))
   +SEC('Position & size',`<div class="xy">${['x','y','w','h'].map(k=>`<label class="xf"><span>${k.toUpperCase()}</span><input type="number" data-k="${k}" aria-label="${{x:'X position',y:'Y position',w:'Width',h:'Height'}[k]}"></label>`).join('')}</div>${S('r','Rotate',-180,180,1)}`);
  else if(tab==='stk'){const sd=SMAP.get(e.stk);h+=SEC('Sticker',TG(TT('flipx','flx','Flip H',{on:!!e.fx,tip:'Flip horizontally'})+TT('flipy','fly','Flip V',{on:!!e.fy,tip:'Flip vertically'})+TT('front','front','Front',{tip:'Bring to front'})+TT('bottom','bottom','Back',{tip:'Send to back'}))+OP)+(sd?.tint?SEC('Colour',`<div class="stcol">${STCOL.map(c=>`<button type="button" data-a="stkre" data-v="${c}" style="background:${c}" aria-label="Colour ${c}" aria-pressed="${(e.col||sd.col)===c}"></button>`).join('')}</div>`):'')+SEC('Blend',`<label class="pr"><span>Mode</span><select data-k="blend">${[['source-over','Normal'],['multiply','Multiply'],['screen','Screen'],['overlay','Overlay'],['soft-light','Soft light'],['difference','Difference']].map(([k,l])=>`<option value="${k}">${l}</option>`).join('')}</select></label>`)}
  else if(tab==='frame')h+=`<button type="button" class="add-hero" data-a="pick">${ic('photo')}<span><b>Add photo or video</b><small>Or drop a file onto the frame</small></span></button>`+SEC('Frame',FRT+FRS+OP)+CUTSEC(e)+SPC;
  else if(tab==='media')h+=(vid&&m.duration>0?SEC('Clip',`<section class="video-trim" aria-label="Video clip range"><div class="video-trim__head"><b>Range</b><span>${timeLabel(m.duration)} total</span></div><div class="video-trim__range"><label for="video-start">Start</label><input id="video-start" type="range" data-k="vs" min="0" max="${Math.max(0,m.duration-.1)}" step="0.1" aria-label="Video clip start"><output data-trim="start">${timeLabel(clipStart(e,m))}</output></div><div class="video-trim__range"><label for="video-end">End</label><input id="video-end" type="range" data-k="ve" min="${Math.min(m.duration,clipStart(e,m)+.1)}" max="${m.duration}" step="0.1" aria-label="Video clip end"><output data-trim="end">${timeLabel(clipEnd(e,m))}</output></div><p class="video-trim__help">Loops while this slide is active. PNG exports stay still.</p></section>`):'')
   +SEC(vid?'Video':'Photo',TG(TT('pick','replace','Replace',{tip:'Replace with another photo or video'})+TT('crop','crop',vid?'Position':'Crop',{on:cropId===e.id,tip:vid?'Move video within frame':'Crop and move photo'})+TT('fit','fit','Fit',{tip:'Fit the whole media'})+TT('fill','fill','Fill',{tip:'Fill the frame'})+TT('flipx','flx','Flip H',{on:!!e.fx,tip:'Flip horizontally'})+TT('flipy','fly','Flip V',{on:!!e.fy,tip:'Flip vertically'})+(isImg?TT('erase','brush','Erase',{on:eraseMode===e.id,tip:eraseMode===e.id?'Finish erasing':'Erase part of the photo'}):'')+TT('unset','unset','Remove',{dz:1,tip:'Remove media and keep the frame'}))+S('s','Zoom',.2,6,.01)+(eraseMode===e.id?SG(`<button type="button" class="ib ico lbl" data-a="bop" data-v="erase" aria-pressed="${brushOp==='erase'}">${ic('brush')}Erase</button><button type="button" class="ib ico lbl" data-a="bop" data-v="restore" aria-pressed="${brushOp==='restore'}">${ic('unerase')}Restore</button>`)+S('_eraseSize','Brush',12,240,2)+TG(TT('eraseclr','reset','Restore all',{tip:'Bring back the whole photo'}))+`<p class="hint">${brushOp==='restore'?'Paint over erased areas to bring the photo back.':'Paint to reveal layers below. Switch to Restore to fix mistakes.'}</p>`:''))
   +CUTSEC(e)+SEC('Frame',FRT+FRS)+SPC;
  else if(tab==='adjust')h+=SEC('Filters',`<div class="fts">${['Original',...FPK].map(k=>{const P=k==='Original'?{}:FP[k],q=fxParams(P,1);return `<button class="ft" data-a="flt" data-v="${k}" data-tip="${k}" aria-pressed="${(e.fp||'Original')===k}"><span class="ftv"><img src="${thumbOf(m)}" alt="" style="filter:${filt(q)}"><i class="fx" style="background:${fxBg(q)}"></i></span><small>${k}</small></button>`}).join('')}</div>${e.fp?S('fi','Intensity',0,1,.01):''}`,AA('fltall','Apply this look to all photos'))
   +SEC('Light',S('br','Brightness',.4,1.8,.01)+S('ct','Contrast',.4,1.8,.01)+S('sa','Saturation',0,2.5,.01)+S('hu','Hue',-180,180,1))
   +SEC('Detail',S('sh','Sharpness',0,100,1)+S('bl','Blur',0,30,.5),AA('sharpall','Apply sharpness to all photos'))
   +SEC('Effects',S('fd','Fade',0,.6,.01)+S('vg','Vignette',0,.8,.01)+S('ta','Tint',0,.5,.01)+C('tn','Tint colour'))
   +SEC('Blend',(isImg?`<label class="pr"><span>Mode</span><select data-k="blend">${[['source-over','Normal'],['multiply','Multiply'],['screen','Screen'],['overlay','Overlay'],['darken','Darken'],['lighten','Lighten'],['color-dodge','Color dodge'],['color-burn','Color burn'],['hard-light','Hard light'],['soft-light','Soft light'],['difference','Difference'],['exclusion','Exclusion'],['hue','Hue'],['saturation','Saturation'],['color','Color'],['luminosity','Luminosity']].map(([k,l])=>`<option value="${k}">${l}</option>`).join('')}</select></label>`:'')+OP,isImg?AA('blendall','Apply blend & opacity to all photos'):'');
  else if(tab==='text')h+=SEC('Content','<textarea class="txa" data-k="text" rows="3" placeholder="Type something" aria-label="Text"></textarea>')
   +SEC('Font',`<label class="pr"><span>Typeface</span><select data-k="f">${Object.entries(FN).map(([k,v])=>`<option value="${k}">${v}</option>`).join('')}</select></label><label class="pr"><span>Weight</span><select data-k="wt">${[[400,'Regular'],[600,'Semibold'],[700,'Bold'],[900,'Black']].map(([w,l])=>`<option value="${w}">${l}</option>`).join('')}</select></label>${S('fs','Size',8,400,1)}${C('c','Colour')}`)
   +SEC('Alignment',`<div class="sg2">${SG(IB('ta','ta_l','Align left','left',e.a==='left')+IB('ta','ta_c','Centre','center',e.a==='center')+IB('ta','ta_r','Align right','right',e.a==='right'))}${SG(IB('tv','tv_t','Top','t',e.v==='t')+IB('tv','tv_c','Middle','c',e.v==='c')+IB('tv','tv_e','Bottom','e',e.v==='e'))}</div>`)
   +SEC('Spacing',S('ls','Letters',-.1,.6,.01)+S('lh','Lines',.8,2.2,.01));
  else if(t==='text')h+=SEC('Shadow',`<div class="pls">${PL('tsp','x','None',{v:'none'})+PL('tsp','drop','Soft',{v:'soft'})+PL('tsp','sparkles','Strong',{v:'strong'})}</div>`+S('ts','Opacity',0,1,.01)+S('tblur','Softness',0,24,1)+C('tc','Colour'))+SEC('Appearance',OP);
  else if(tab==='line'){const seg=(a,list)=>SG(list.map(([v,l,o,on])=>`<button type="button" class="ib ico lnseg" data-a="${a}" data-v="${v}" data-tip="${l}" aria-label="${l}" aria-pressed="${on}">${lnSvg({w:40,h:14,lt:2.6,ln:'solid',...o,fill:'currentColor'})}</button>`).join(''));
   h+=SEC('Line',seg('lnst',[['solid','Solid',{},(e.ln||'solid')==='solid'],['dash','Dashed',{ln:'dash'},e.ln==='dash'],['dot','Dotted',{ln:'dot'},e.ln==='dot']])
    +seg('lnend',[['none','No arrows',{},!e.a0&&!e.a1],['end','Arrow at end',{a1:1},!e.a0&&!!e.a1],['start','Arrow at start',{a0:1},!!e.a0&&!e.a1],['both','Arrows at both ends',{a0:1,a1:1},!!e.a0&&!!e.a1]])
    +S('lt','Thickness',1,40,1)+S('w','Length',20,4000,1))
   +SEC('Colour',`<div class="fills">${FILLS.filter(f=>f.startsWith('#')).map(f=>`<button type="button" data-a="shpfill" data-v="${f}" style="background:${f}" aria-label="Colour ${f}" aria-pressed="${e.fill===f}"></button>`).join('')}</div>`+C('fill','Custom'))
   +SEC('Appearance',`<label class="tgl"><span>Shadow</span><button type="button" class="sw" data-a="shsh" role="switch" aria-checked="${!!e.sh}" aria-label="Shadow"><i></i></button></label>`+OP)}
  else if(tab==='ink'){const gc=e.st.find(q=>q.t!=='er'&&q.gc)?.gc||'';h+=`<button type="button" class="add-hero" data-a="inkedit">${ic('draw')}<span><b>Edit drawing</b><small>Add strokes or erase parts of it</small></span></button>`
   +SEC('Glow',S('_gl','Intensity',0,100,1)+`<div class="fills">${glowSw(gc,'inkrgc')}</div>`)
   +SEC('Recolour',`<div class="fills">${INKC.map(c=>`<button type="button" data-a="inkrc" data-v="${c}" style="background:${c}" aria-label="Recolour ink ${c}"></button>`).join('')}</div>`)+SEC('Appearance',OP)}
  else if(tab==='shape')h+=SEC('Shape',SHGRID('shpset',shapeKey(e)));
  else h+=SEC('Fill',`<div class="fills">${FILLS.map(f=>`<button type="button" data-a="shpfill" data-v="${f}" style="background:${f}" aria-label="Fill ${f.startsWith('#')?f:'gradient'}" aria-pressed="${e.fill===f}"></button>`).join('')}</div>`+C('fill','Custom')+(e.cp?'':S('rd','Corners',0,400,1)))+SEC('Appearance',`<label class="tgl"><span>Shadow</span><button type="button" class="sw" data-a="shsh" role="switch" aria-checked="${!!e.sh}" aria-label="Shadow"><i></i></button></label>`+OP)}
 else if(mode==='draw'){key='draw';const t=PEN.t,er=t==='er',bl=BRUSH.find(b=>b[0]===t);
  h=HD('draw','Draw',er?'Drag over ink to erase it':`${bl[1]} · drag on a slide`,IB('inkundo','undo','Undo stroke (⌘Z)')+IB('inkdone','done','Done (Esc)'))
   +SEC('Brush',`<div class="brs">${BRUSH.map(([k,l,tip])=>`<button type="button" data-a="inkt" data-v="${k}" data-tip="${tip}" aria-label="${l}" aria-pressed="${t===k}">${ic('b_'+k)}<small>${l}</small></button>`).join('')}</div>`)
   +(er?'':SEC('Colour',`<div class="fills">${INKC.map(c=>`<button type="button" data-a="inkc" data-v="${c}" style="background:${c}" aria-label="Ink ${c}" aria-pressed="${PEN.c===c}"></button>`).join('')}</div>`+C('_pc','Custom')))
   +SEC(er?'Eraser':'Stroke',S('_psz','Size',1,er?240:120,1)+(er?'':S('_pop','Opacity',.1,1,.01)+S('_psm','Smoothing',0,100,1)))
   +(er?'':SEC('Glow',S('_pgl','Intensity',0,100,1)+`<div class="fills">${glowSw(PEN.gc,'inkgc')}</div>`,t==='neon'&&!PEN.g?'<small class="isx">Neon glows by default</small>':''))
   +TG(TT('inkundo','undo','Undo',{tip:'Undo last stroke (⌘Z)'})+TT('inkredo','redo','Redo',{tip:'Redo (⇧⌘Z)'})+TT('inkclr','reset','Clear',{dz:1,tip:'Clear the drawing on this slide'})+TT('inkdone','done','Done',{tip:'Finish drawing (Esc)'}))
   +'<p class="hint">Hold still at the end of a stroke to snap it straight (or hold Shift). Keys 1–7 switch brushes, [ ] change size.</p>'}
 else if(mode==='lay'){const fr=e&&e.type==='img'&&!layWhole,rs=n=>LAYS[n].map(([x,y,w,h])=>`<rect x="${x*100+1.5}" y="${y*125+1.5}" width="${w*100-3}" height="${h*125-3}" rx="4"/>`).join(''),g=lgOf(e);key='lay:'+layTab;
  h=HD('lay','Layouts',fr?'Inside the selected frame':'Whole slide '+(cur+1),IB('back','done','Done'),TABS(layTab,Object.keys(LGR).map(k=>[k,k]),'laytab'))
   +(e?.type==='img'?`<div class="tabs tgt">${[[true,'frame','In frame'],[false,'slide','Whole slide']].map(([f,n,l])=>`<button type="button"${fr===f?' aria-pressed="true"':' data-a="laywhole"'}>${ic(n)}${l}</button>`).join('')}</div>`:'')
   +`<div class="lay">${LGR[layTab].map(n=>`<button data-a="lay" data-v="${n}" aria-label="${n}" data-tip="${n}"><svg viewBox="0 0 100 125">${rs(n)}</svg><small>${n}</small></button>`).join('')}</div>`
   +SEC(g?'Spacing · live':'Spacing',S('_gap','Gap',0,100,1)+S('_mar','Margin',0,300,1)+S('_cor','Corners',0,200,1),PL('edge','edge','Edge to edge',{v:'',tip:'Remove all gaps, margins and corners'}))}
 else if(mode==='stk'){key='stk:'+stkTab;const L=stkList(stkTab,stkQ);h=HD('sticker','Stickers','Tap or drag onto a slide',IB('back','done','Done'))+`<div class="search stk-s">${ic('search')}<input type="search" id="stq" placeholder="Search stickers" aria-label="Search stickers" value="${esc(stkQ)}"></div><div class="chips">${['All',...STK.cats].map(c=>`<button type="button" class="chip" data-a="stktab" data-v="${c}" aria-pressed="${stkTab===c}">${c}</button>`).join('')}</div><div class="sgrid" id="stg">${L.map(x=>stkTile(x,'stk')).join('')||'<p class="hint">No stickers match.</p>'}</div>`}
 else if(mode==='shp'){key='shp';h=HD('shape','Shapes','Tap or drag onto a slide',IB('back','done','Done'))+'<p class="shl">Shapes</p>'+SHGRID('shp')+'<p class="shl">Lines &amp; arrows</p>'+LNGRID('lnadd')+'<p class="hint">Recolour, round corners and add shadows from the Style tab. Lines get thickness, dashes and arrowheads.</p>'}
 else if(mode==='lyr'){const L=doc.els.filter(e=>SL(e)===cur).reverse();key='lyr';
  h=HD('lyr','Layers',`Slide ${cur+1} · ${L.length} item${L.length===1?'':'s'} · top first`,IB('back','done','Done'))+`<div class="lrs">${L.map(x=>{const mm=x.type==='img'&&x.k&&IMG.get(x.k),k=x.type==='draw'?'draw':x.type==='text'?'text':x.type==='img'?(mm?(mm.type==='video'?'video':'image'):'frame'):'shape',n=x.type==='draw'?'Drawing':x.type==='text'?(esc(x.text.slice(0,40))||'Text'):x.type==='img'?(mm?(mm.type==='video'?'Video':'Photo'):'Empty frame'):'Shape';return `<button type="button" class="lr${x.id===sel?' on':''}" data-a="pick1" data-v="${x.id}">${ic(k)}<span>${n}</span></button>`}).join('')||'<p class="hint">Nothing on this slide yet.</p>'}</div>`}
 else if(mode==='imp'){key='imp';const L=impL;
  h=HD('impsl','Import slides',`Adds another draft’s slides after slide ${doc.n}`,IB('back','done','Done'))
  +(!L?'<p class="hint">Loading your drafts…</p>':L.length?`<div class="imps">${L.map(p=>{const fit=p.H!==doc.H;return `<button type="button" class="imp" data-a="impd" data-v="${p.id}"${impBusy?' disabled':''}><span class="imt" style="aspect-ratio:1080/${p.H||1350}">${p.thumb?`<img src="${p.thumb}" alt="">`:''}</span><span class="imx"><b>${esc(p.name)}</b><small>${p.n} slide${p.n>1?'s':''} · ${ARL[AR_OF[p.H]]||'Custom'} · ${ago(p.updated)}</small>${fit?`<small class="imf">Fitted to ${ARL[AR_OF[doc.H]]||'this size'}</small>`:''}</span>${ic('plus')}</button>`}).join('')}</div><p class="hint">Slides are added to the end, with their photos, text and drawings. You can always undo.</p>`:'<p class="hint">No other drafts yet. Anything you make is saved automatically, so it will show up here.</p>')}
 else{key='slide';h=HD('slides',`Slide ${cur+1}`,`of ${doc.n} · ${esc(doc.name||'Untitled carousel')}`,'')
  +SEC('Slide',C('_bg','Background'))
  +SEC('Project',`<label class="pr"><span>Name</span><input type="text" data-k="_nm" maxlength="60" placeholder="Untitled carousel"></label><label class="pr"><span>Preview as</span><select data-k="previewTarget">${PREVIEW_TARGETS.map(([k,label])=>`<option value="${k}"${k===pvKey()?' selected':''}>${label}</option>`).join('')}</select></label>`)
  +SEC('Add slides',PL('sadd','addsl','Blank slide')+PL('imp','impsl','From another draft',{tip:'Import every slide of another draft into this one'}))
  +'<p class="hint">Tap anything on the canvas to edit it. Shift-click to select several.</p>'}
 const sc=$('pn').scrollTop,same=panel.k===key;panel.k=key;$('pn').innerHTML=h;$('pn').scrollTop=same?sc:0;
 if(!e&&mode==='slide'&&multi.size<2){$('pn').querySelector('[data-k=_bg]').value=hex(doc.mbg||doc.bg[cur]);$('pn').querySelector('[data-k=_nm]').value=doc.name||''}sync()}
const rfill=i=>{const a=+i.min||0,b=+i.max||1;i.style.setProperty('--p',((+i.value-a)/(b-a||1)*100).toFixed(1)+'%')};
function sync(){const e=sel&&ge(sel);if(mode==='draw'&&!e){$('pn').querySelectorAll('[data-k]').forEach(i=>{if(i===document.activeElement)return;const k=i.dataset.k,v=k==='_psz'?penSz():k==='_pop'?PEN.o:k==='_psm'?PEN.sm:k==='_pgl'?PEN.g:k==='_pc'?PEN.c:null;if(v==null)return;i.value=i.type==='color'?hex(v):Math.round(v*100)/100;if(i.type==='range')rfill(i)});return}if(!e&&mode==='slide'){const target=$('pn').querySelector('[data-k=previewTarget]');if(target)target.value=PREVIEW_TARGETS.some(([k])=>k===doc.previewTarget)?doc.previewTarget:'default';return}if(!e&&mode!=='lay')return;const g=lgOf(e),m=e?.type==='img'&&e.k&&IMG.get(e.k);$('pn').querySelectorAll('[data-k]').forEach(i=>{if(i===document.activeElement)return;const k=i.dataset.k;let v;
 if(k==='_gap')v=g?g.gap:layGap;else if(k==='_mar')v=g?g.mar:(layMar!=null?layMar:autoMar());else if(k==='_cor')v=g?g.rd:(layRd!=null?layRd:24);else if(k==='_eraseSize')v=eraseSize;else if(k==='_gl')v=Math.max(0,...(e?.st||[]).map(q=>q.t==='er'?0:q.g||0));else if(k==='_ca')v=e?.cq?.a??4;else if(k==='_csl')v=e?.cq?.sl??0;else{if(!e)return;v=e[k]??(k==='sh'||k==='ts'||k==='bw'?0:k==='tblur'?6:k==='tc'?'#000000':k==='blend'?'source-over':FD[k])}
 if(m?.type==='video'&&m.duration>0){const from=clipStart(e,m),to=clipEnd(e,m);if(k==='vs'){i.min='0';i.max=String(Math.max(0,to-.1))}else if(k==='ve'){i.min=String(Math.min(m.duration,from+.1));i.max=String(m.duration)}}
 i.value=i.type==='color'?hex(v):typeof v==='number'?Math.round(v*100)/100:v??'';if(i.type==='range')rfill(i)});
 if(m?.type==='video'){$('pn').querySelector('[data-trim=start]')?.replaceChildren(timeLabel(clipStart(e,m)));$('pn').querySelector('[data-trim=end]')?.replaceChildren(timeLabel(clipEnd(e,m)))}}

/* slides */
const inS=i=>doc.els.filter(e=>SL(e)===i),shift=(f,d)=>doc.els.forEach(e=>{if(e.x+e.w/2>=f*doc.W)e.x+=d*doc.W});
function setSelection(ids,primary=ids[0]){multi=new Set(ids.filter(id=>ge(id)));sel=multi.has(primary)?primary:(multi.values().next().value||null);cropId=null;eraseMode=null;$('brushCursor').style.display='none';mode='slide';if(sel)cur=SL(ge(sel));render();panel()}
function alignSelection(anchor){const items=[...multi].map(ge).filter(Boolean);if(items.length<2)return;const boxes=items.map(boxOf),x=Math.min(...boxes.map(q=>q.l)),y=Math.min(...boxes.map(q=>q.t)),r=Math.max(...boxes.map(q=>q.r)),b=Math.max(...boxes.map(q=>q.b));
 items.forEach((e,i)=>{const q=boxes[i];if(anchor==='l')e.x+=x-q.l;else if(anchor==='c')e.x+=(x+r-q.l-q.r)/2;else if(anchor==='r')e.x+=r-q.r;else if(anchor==='t')e.y+=y-q.t;else if(anchor==='m')e.y+=(y+b-q.t-q.b)/2;else if(anchor==='b')e.y+=b-q.b})}
function arrangeSelection(action){const selected=new Set(multi.size?multi:[sel].filter(Boolean)),all=doc.els;if(!selected.size)return;
 if(action==='front'||action==='bottom'){const moving=all.filter(e=>selected.has(e.id)),rest=all.filter(e=>!selected.has(e.id));doc.els=action==='front'?[...rest,...moving]:[...moving,...rest];return}
 const next=[...all];if(action==='forward'){for(let i=next.length-2;i>=0;i--)if(selected.has(next[i].id)&&!selected.has(next[i+1].id))[next[i],next[i+1]]=[next[i+1],next[i]]}
 else if(action==='backward'){for(let i=1;i<next.length;i++)if(selected.has(next[i].id)&&!selected.has(next[i-1].id))[next[i],next[i-1]]=[next[i-1],next[i]]}doc.els=next}
function act(a,v){const e=sel&&ge(sel),L=doc.els,fin=()=>{commit();render();panel()};
 switch(a){
 case'inkedit':inkStart();return;
 case'inkdone':inkStop(true);return;
 case'inkt':PEN.t=v;penSave();dockSync();return panel();
 case'inkc':PEN.c=v;if(PEN.t==='er')PEN.t='pen';penSave();dockSync();return panel();
 case'inkgc':PEN.gc=v;if(!PEN.g&&PEN.t!=='neon')PEN.g=50;penSave();return panel();
 case'inkundo':undo(-1);return;
 case'inkredo':undo(1);return;
 case'inkopt':{const on=$('ed').classList.toggle('ink-opt');dockSync();if(on)panel();return}
 case'inkclr':{const s0=cur,gone=doc.els.filter(q=>q.type==='draw'&&SL(q)===s0);if(!gone.length){toast('Nothing drawn on this slide');return}doc.els=doc.els.filter(q=>!gone.includes(q));inkId=null;commit();render();toast('Drawing cleared · ⌘Z to undo');return}
 case'inkrc':if(e?.type!=='draw')return;e.st=e.st.map(q=>q.t==='er'?q:{...q,c:v});break;
 case'inkrgc':if(e?.type!=='draw')return;e.st=e.st.map(q=>q.t==='er'?q:{...q,gc:v||undefined,g:q.g||50});break;
 case'done':inkStop(false);cutEnd();slideOpen=false;sel=null;multi.clear();eraseMode=null;multiSelectMode=false;document.querySelector('#bar [data-b=multi]')?.setAttribute('aria-pressed','false');cropId=null;render();return panel();
 case'group':{if(multi.size<2)return;const gid='g'+(++uid);multi.forEach(id=>{const q=ge(id);if(q)q.group=gid});break}
 case'ungroup':{const gs=new Set([...multi].map(id=>ge(id)?.group).filter(Boolean));L.forEach(q=>{if(gs.has(q.group))delete q.group});break}
 case'multiDel':{const gone=new Set(multi);doc.els=L.filter(q=>!gone.has(q.id));sel=null;multi.clear();cropId=null;break}
 case'multiDup':{const copies=[...multi].map(id=>ge(id)).filter(Boolean).map(q=>({...q,id:nid(),x:q.x+24,y:q.y+24}));const gid=copies.length>1&&[...multi].every(id=>ge(id)?.group)?'g'+(++uid):null;if(gid)copies.forEach(q=>q.group=gid);L.push(...copies);setSelection(copies.map(q=>q.id),copies[0]?.id);commit();return}
 case'align':alignSelection(v);break;
 case'reset':{if(!confirm('Remove every text and photo from all slides? Backgrounds, shapes, slide count and project settings will stay.'))return;doc.els=L.filter(q=>q.type!=='text'&&q.type!=='img');doc.lg={};sel=null;multi.clear();multiSelectMode=false;$('bar').querySelector('[data-b=multi]').setAttribute('aria-pressed','false');eraseMode=null;$('brushCursor').style.display='none';cropId=null;toast('All slide text and photos cleared');break}
 case'cut':{if(e?.type!=='img'||e.stk)return;if(v==='pen'){cutStart(e);return}if(v==='none'){delete e.cp;delete e.ck;delete e.cq;break}
  e.ck=v;if(CUTT[v]||v==='blob')e.cq={a:4,sl:0,...e.cq,sd:e.cq?.sd||1+Math.floor(Math.random()*999)};else delete e.cq;e.cp=cutCp(v,e.cq);break}
 case'retear':if(!e?.cq)return;e.cq={...e.cq,sd:1+Math.floor(Math.random()*9999)};e.cp=cutCp(e.ck,e.cq);break;
 case'cutdraw':cutStart(e);return;
 case'cutok':cutApply();return;
 case'cutx':cutCancel();return;
 case'cutundo':if(cutDraw){cutDraw.pts.pop();cutOv();panel()}return;
 case'cutclr':if(cutDraw){cutDraw.pts=[];cutOv();panel()}return;
 case'back':mode='slide';slideOpen=false;render();return panel();
 case'imp':sel=null;multi.clear();eraseMode=null;cropId=null;mode='imp';slideOpen=false;impL=null;render();panel();impLoad();return;
 case'impd':importDraft(v);return;
 case'stk':addSticker(v);return;
 case'stktab':stkTab=v;return panel();
 case'stkre':{if(!e?.stk)return;const sd=SMAP.get(e.stk),id=e.id;stkKey(sd,v).then(k=>{const x=ge(id);if(!k||!x)return;x.k=k;x.col=v;commit();render();panel()});return}
 case'shp':{const q=SHM.get(v);if(!q)return;const[w,h]=q[3],n={type:'shape',x:cur*doc.W+(doc.W-w)/2,y:(doc.H-h)/2,w,h,fill:'#3b4bff',cp:q[2],sk:q[0],r:0,o:1,rd:q[4]||0,id:nid()};L.push(n);setSelection([n.id]);commit();return}
 case'lnadd':{const q=LNV.find(([k])=>k===v);if(!q)return;const w=Math.min(600,doc.W*.6),n={type:'shape',sk:'line',ln:'solid',lt:6,a0:0,a1:0,...q[2],x:cur*doc.W+(doc.W-w)/2,y:doc.H/2,w,h:30,fill:'#16161a',cp:'',rd:0,r:0,o:1,id:nid()};lnFit(n);L.push(n);setSelection([n.id]);commit();return}
 case'lnst':if(!e?.ln)return;e.ln=v==='dash'||v==='dot'?v:'solid';lnFit(e);break;
 case'lnend':if(!e?.ln)return;e.a0=v==='start'||v==='both'?1:0;e.a1=v==='end'||v==='both'?1:0;lnFit(e);break;
 case'shpset':{const q=SHM.get(v);if(!q||e?.type!=='shape')return;e.cp=q[2];e.sk=q[0];e.rd=q[4]||0;if(q[0]==='circle'){const d=Math.min(e.w,e.h);e.x+=(e.w-d)/2;e.y+=(e.h-d)/2;e.w=e.h=d}break}
 case'shpfill':if(e?.type==='shape')e.fill=v;break;
 case'shsh':if(e?.type==='shape')e.sh=e.sh?0:1;break;
 case'laytab':layTab=v;return panel();
 case'laywhole':layWhole=!layWhole;return panel();
 case'ptab':PT[panel.tk]=v;return panel();
 case'dist':{const items=[...multi].map(ge).filter(Boolean);if(items.length<3)return;const bx=items.map(boxOf),H=v==='h',o=items.map((_,i)=>i).sort((x,y)=>H?bx[x].l-bx[y].l:bx[x].t-bx[y].t),f=bx[o[0]],l=bx[o[o.length-1]],tot=o.reduce((n,i)=>n+(H?bx[i].r-bx[i].l:bx[i].b-bx[i].t),0),gap=((H?l.r-f.l:l.b-f.t)-tot)/(o.length-1);let p=H?f.l:f.t;o.forEach(i=>{const q=bx[i],it=items[i];if(H){it.x+=p-q.l;p+=q.r-q.l+gap}else{it.y+=p-q.t;p+=q.b-q.t+gap}});break}
 case'tsp':Object.assign(e,{none:{ts:0},soft:{ts:.35,tblur:8,tc:'#000000'},strong:{ts:.7,tblur:14,tc:'#000000'}}[v]||{});break;
 case'layfr':mode='lay';render();return panel();
 case'pick1':select(v);reveal();return;
 case'dup':{const c={...e,id:nid(),x:e.x+30,y:e.y+30};if(c.st)c.st=c.st.map(q=>({...q,p:[...q.p]}));L.push(c);sel=c.id;multi=new Set([c.id]);break}
 case'del':doc.els=L.filter(x=>x!==e);sel=null;multi.clear();eraseMode=null;break;
 case'fwd':case'bwd':{if(multi.size>1){arrangeSelection(a==='fwd'?'forward':'backward');break}const i=L.indexOf(e),j=i+(a==='fwd'?1:-1);if(j<0||j>=L.length)return;[L[i],L[j]]=[L[j],L[i]];break}
 case'bop':brushOp=v==='restore'?'restore':'erase';syncBrush();panel();quickActions(e);return;
 case'eraseclr':if(!e?.erase?.length){toast('Nothing to restore');return}e.erase=[];brushOp='erase';syncBrush();break;
 case'erase':{brushOp='erase';syncBrush();if(!e||e.type!=='img'||!e.k||IMG.get(e.k)?.type!=='image'){toast('The erase brush works on still photos.');return}eraseMode=eraseMode===e.id?null:e.id;$('brushCursor').style.display='none';render();panel();toast(eraseMode?'Brush ready · paint on the selected photo':'Erase brush closed');return}
 case'al':{const s=SL(e)*doc.W;({l:()=>e.x=s,c:()=>e.x=s+(doc.W-e.w)/2,r:()=>e.x=s+doc.W-e.w,t:()=>e.y=0,m:()=>e.y=(doc.H-e.h)/2,b:()=>e.y=doc.H-e.h})[v]();break}
 case'ta':e.a=v;break;case'tv':e.v=v;break;case'rdc':e.rd=9999;if(e.type==='shape'){e.cp='';e.sk='pill'}break;case'fill':e.s=1;e.ox=e.oy=0;break;case'unset':e.k=null;cropId=null;break;
 case'crop':cropId=cropId===sel?null:sel;render();return panel();
 case'fit':{const m=IMG.get(e.k);e.s=Math.min(e.w/m.nw,e.h/m.nh)/Math.max(e.w/m.nw,e.h/m.nh);e.ox=e.oy=0;break}
 case'pick':fillT=sel;return $('fl').click();
 case'split':{const g=16,hz=v==='h',w=hz?(e.w-g)/2:e.w,h=hz?e.h:(e.h-g)/2,q=e.r*Math.PI/180,c=Math.cos(q),s=Math.sin(q),cx=e.x+e.w/2,cy=e.y+e.h/2,
   mk=sg=>{const dx=hz?sg*(e.w+g)/4:0,dy=hz?0:sg*(e.h+g)/4;return{...e,w,h,x:cx+dx*c-dy*s-w/2,y:cy+dx*s+dy*c-h/2}};
    const A=mk(-1),Bn={...mk(1),id:nid(),k:null,g:PH,s:1,ox:0,oy:0};Object.assign(e,A);L.splice(L.indexOf(e)+1,0,Bn);sel=Bn.id;multi=new Set([Bn.id]);cropId=null;break}
 case'sadd':doc.n++;doc.bg.push('#ffffff');cur=doc.n-1;break;
 case'sdup':{const i=cur,cp=inS(i).map(x=>({...x,id:nid(),x:x.x+doc.W}));shift(i+1,1);doc.els.push(...cp);doc.n++;doc.bg.splice(i+1,0,doc.bg[i]);cur=i+1;break}
 case'sdel':{if(doc.n<2)return toast('A carousel needs at least one slide');const i=cur;doc.els=L.filter(x=>SL(x)!==i);shift(i+1,-1);doc.n--;doc.bg.splice(i,1);cur=Math.min(i,doc.n-1);sel=null;multi.clear();break}
 case'sml':case'smr':{const j=cur+(a==='sml'?-1:1);if(j<0||j>=doc.n)return;return reorderSlides(cur,j)}
 case'flt':Object.assign(e,fxParams(v==='Original'?{}:FP[v],1),{fp:v==='Original'?'':v,fi:1});break;
 case'fltall':{const ks=[...Object.keys(FD),'tn','fp','fi','sh','blend','o'];L.forEach(x=>{if(x.type==='img'&&x.k&&x!==e)ks.forEach(k=>x[k]=e[k])});toast('Adjustments applied to every photo');break}
 case'sharpall':L.forEach(x=>{if(x.type==='img')x.sh=e.sh||0});toast('Sharpness applied to every photo frame');break;
 case'blendall':L.forEach(x=>{if(x.type==='img'){x.blend=e.blend||'source-over';x.o=e.o??1}});toast('Blend mode and opacity applied to all photo frames');break;
 case'front':arrangeSelection('front');break;case'bottom':arrangeSelection('bottom');break;
 case'edge':{const g=lgOf(e);layGap=layMar=layRd=0;if(g){g.gap=g.mar=g.rd=0;reflow(e.lg)}break}case'flipx':e.fx=!e.fx;break;case'flipy':e.fy=!e.fy;break;
 case'lay':{const f=e&&e.type==='img'&&!e.r&&!layWhole?e:null,gid='g'+(++uid),mar=layMar!=null?layMar:(f||v==='Full bleed'?0:36),
  bx=f?{bx:f.x,by:f.y,bw:f.w,bh:f.h}:{bx:cur*doc.W,by:0,bw:doc.W,bh:doc.H};doc.lg=doc.lg||{};
  const g=doc.lg[gid]={p:v,...bx,gap:layGap,mar,rd:layRd!=null?layRd:(f?Math.min(f.rd||0,60):(mar||(layGap&&LAYS[v].length>1)?24:0))};
  const rs=layRects(g).map((r,i)=>({type:'img',id:nid(),r:0,o:1,rd:g.rd,...r,g:PH,s:1,ox:0,oy:0,lg:gid,li:i}));
  if(f){if(f.k)rs[0].k=f.k;L.splice(L.indexOf(f),1,...rs);sel=rs[0].id;multi=new Set([sel])}else L.push(...rs);break}}
 fin()}

/* photos: object URLs of the untouched original files, no re-encoding or resizing */
const rdURL=f=>new Promise((res,rej)=>{const r=new FileReader();r.onload=()=>res(r.result);r.onerror=()=>rej(r.error);r.readAsDataURL(f)}),
dec=u=>new Promise((res,rej)=>{const im=new Image();im.onload=()=>im.naturalWidth?res(im):rej();im.onerror=rej;im.src=u}),
decVideo=u=>new Promise((res,rej)=>{const video=document.createElement('video');video.preload='auto';video.muted=true;video.playsInline=true;const clean=()=>{video.onloadeddata=null;video.onerror=null};video.onloadeddata=()=>{clean();res(video)};video.onerror=()=>{clean();rej(new Error('unsupported video'))};video.src=u;video.load()});
async function load(f,key){const type=f.type.startsWith('video/')?'video':f.type.startsWith('image/')?'image':null;if(!type){toast('Choose an image or video file.');return null}let url=URL.createObjectURL(f),im,video;
 try{if(type==='video')video=await decVideo(url);else im=await dec(url)}catch(_){URL.revokeObjectURL(url);if(type==='image'){try{url=await rdURL(f);im=await dec(url)}catch(__){toast(`Couldn’t open ${f.name||'that file'}. Try a JPG, PNG or WebP photo.`);return null}}else{toast(`Couldn’t play ${f.name||'that video'}. Try an MP4 or MOV video.`);return null}}
 const k=key||'k'+Date.now().toString(36)+(++kid),nw=type==='video'?video.videoWidth:im.naturalWidth,nh=type==='video'?video.videoHeight:im.naturalHeight,duration=type==='video'&&Number.isFinite(video.duration)?video.duration:0;IMG.set(k,{type,url,im,video,nw,nh,duration,size:f.size,name:f.name,file:f});return k}
const emptyFrame=()=>doc.els.filter(x=>x.type==='img'&&!x.k).sort((a,b)=>((SL(a)-cur+doc.n)%doc.n)-((SL(b)-cur+doc.n)%doc.n)||Math.round(a.y/60)-Math.round(b.y/60)||a.x-b.x)[0];
function reveal(){const e=sel&&ge(sel);if(!e)return;const v=$('cv'),zm=$('zm').getBoundingClientRect(),vr=v.getBoundingClientRect(),l=zm.left+e.x*z,r=l+e.w*z,tp=zm.top+e.y*z,b=tp+e.h*z;let dx=0,dy=0;
 if(l<vr.left)dx=l-vr.left-16;else if(r>vr.right)dx=r-vr.right+16;if(tp<vr.top)dy=tp-vr.top-16;else if(b>vr.bottom)dy=b-vr.bottom+16;if(dx||dy)v.scrollBy({left:dx,top:dy,behavior:'smooth'})}
$('fl').addEventListener('change',async ev=>{const inp=ev.target,fs=[...inp.files],tg=fillT&&ge(fillT);fillT=null;let ok=0,first=true;
 if(fs.length)toast(fs.length>1?`Adding ${fs.length} media files…`:'Adding media…');
 for(const f of fs){const k=await load(f);if(!k)continue;const m=IMG.get(k);let e=first&&tg?tg:emptyFrame();first=false;
  if(e){e.k=k;e.s=1;e.ox=e.oy=0;e.erase=[];delete e.vs;delete e.ve}else{const sc=Math.min(.8*doc.W/m.nw,.8*doc.H/m.nh),w=m.nw*sc,h=m.nh*sc;e={type:'img',id:nid(),r:0,o:1,rd:0,x:cur*doc.W+(doc.W-w)/2,y:(doc.H-h)/2,w,h,g:PH,k,s:1,ox:0,oy:0};doc.els.push(e)}
  sel=e.id;multi=new Set([e.id]);cur=SL(e);eraseMode=null;cropId=null;ok++}
 inp.value='';if(ok){commit();render();panel();reveal();toast(ok>1?`${ok} media files added`:'Media added')}});

/* interaction */
function select(id){const e=ge(id);if(!e)return;const ids=e.group?doc.els.filter(q=>q.group===e.group).map(q=>q.id):[id];if(sel===id&&ids.length===multi.size&&ids.every(q=>multi.has(q)))return;setSelection(ids,id)}
$('sel').innerHTML=[[-1,-1],[0,-1],[1,-1],[-1,0],[1,0],[-1,1],[0,1],[1,1]].map(([a,b])=>`<i data-h="${a},${b}" style="left:${(a+1)*50}%;top:${(b+1)*50}%"></i>`).join('')+`<i data-h="rot" style="left:50%;top:calc(-46px*var(--k))" data-tip="Drag to rotate · snaps to 15°" aria-label="Rotate">${ic('rotate')}</i>`;
function dbl2(id){const e=ge(id);if(!e)return;select(id);if(e.type==='text'){const x=$('pn').querySelector('textarea');if(x){x.focus();x.select()}}else if(e.type==='img'){if(e.k){cropId=cropId===id?null:id;render();panel()}}}
$('stage').addEventListener('click',ev=>{if(cutDraw||drawMode||Date.now()-mvT<350)return;const n=ev.target.closest('.e');
 if(n){const id=n.dataset.id,now=Date.now();if(ev.shiftKey||multiSelectMode){const target=ge(id),primary=sel&&ge(sel);if(primary&&SL(primary)!==SL(target)){toast('Select objects on the same slide.');return}const siblings=target.group?doc.els.filter(q=>q.group===target.group).map(q=>q.id):[id],ids=new Set(multi);if(siblings.some(q=>ids.has(q)))siblings.forEach(q=>ids.delete(q));else siblings.forEach(q=>ids.add(q));lt={id,t:now};pds=id;setSelection([...ids],ids.has(id)?id:[...ids][0]);return}
  const db=lt.id===id&&now-lt.t<320;lt={id,t:now};if(db){pds=null;return dbl2(id)}if(pds===id){pds=null;return}
  if(multi.has(id))return;
  if(sel===id&&cropId!==id){const s=document.elementsFromPoint(ev.clientX,ev.clientY).filter(x=>x.classList.contains('e')).map(x=>x.dataset.id);if(s.length>1){sel=null;return select(s[1])}return}
  return select(id)}
 if(ev.target.closest('#sel,#rp,#bd,#qa'))return;
 const r=$('stage').getBoundingClientRect();cur=Math.max(0,Math.min(doc.n-1,Math.floor((ev.clientX-r.left)/z/doc.W)));sel=null;multi.clear();cropId=null;eraseMode=null;mode='slide';slideOpen=false;render();panel()});
/* tap the empty area around the slides to clear the selection and close tool panels */
$('cv').addEventListener('click',ev=>{if(!doc||cutDraw||drawMode||Date.now()-mvT<350||ev.target.closest('#stage,.zb,#pg'))return;if(!sel&&!multi.size&&mode==='slide'&&!slideOpen)return;sel=null;multi.clear();cropId=null;eraseMode=null;$('brushCursor').style.display='none';mode='slide';slideOpen=false;render();panel()});
/* drawing input: coalesced events, streamline smoothing, hold-to-straighten, two-finger pinch cancels the stroke */
$('stage').addEventListener('pointerdown',ev=>{if(!drawMode)return;ev.stopImmediatePropagation();
 if(inkDrag){if(ev.pointerId!==inkDrag.pid){const e=ge(inkDrag.id);clearTimeout(inkDrag.hold);if(e&&e.st[e.st.length-1]===inkDrag.st){e.st.pop();paint(NODES.get(e.id),e)}inkDrag=null}return}
 if(ev.button!==0)return;ev.preventDefault();const r=$('stage').getBoundingClientRect(),px=(ev.clientX-r.left)/z,py=(ev.clientY-r.top)/z;if(px<0||py<0||py>doc.H||px>doc.n*doc.W)return;
 const s=Math.min(doc.n-1,Math.floor(px/doc.W));let e=inkId&&ge(inkId);if(e&&SL(e)!==s){inkClose();e=null}
 if(!e&&PEN.t==='er'){e=[...doc.els].reverse().find(q=>{if(q.type!=='draw'||SL(q)!==s)return false;const b=boxOf(q),m=penSz('er')/2;return px>=b.l-m&&px<=b.r+m&&py>=b.t-m&&py<=b.b+m});if(!e){toast('Nothing drawn here to erase');return}inkId=e.id}
 let fresh=false;if(!e){e={type:'draw',id:nid(),x:s*doc.W,y:0,w:doc.W,h:doc.H,bw:doc.W,bh:doc.H,r:0,o:1,rd:0,st:[]};doc.els.push(e);inkId=e.id;fresh=true}
 const wasExp=inkExp(e);inkExpand(e);cur=s;const t=PEN.t,lx=+(px-e.x).toFixed(1),ly=+(py-e.y).toFixed(1),st={t,c:PEN.c,w:penSz(t),p:[lx,ly]};
 if(t!=='er'){const g=t==='neon'?(PEN.g||55):PEN.g;if(g>0){st.g=g;if(PEN.gc)st.gc=PEN.gc}if(PEN.o<1)st.o=PEN.o}
 e.st.push(st);inkDrag={id:e.id,pid:ev.pointerId,st,lx,ly,rx:lx,ry:ly,hx:lx,hy:ly,line:false,raf:0};
 try{$('stage').setPointerCapture(ev.pointerId)}catch(_){}if(fresh||!wasExp)render();else paint(NODES.get(e.id),e);inkHold();inkCur(ev)});
$('stage').addEventListener('pointermove',ev=>{if(!drawMode)return;inkCur(ev);const D=inkDrag;if(!D||D.pid!==ev.pointerId)return;const e=ge(D.id);if(!e)return;
 const r=$('stage').getBoundingClientRect(),P=D.st.p,f=1-Math.min(.88,PEN.sm/100*.88),min=1/z,list=ev.getCoalescedEvents?.()||[];
 for(const q of list.length?list:[ev]){const x=(q.clientX-r.left)/z-e.x,y=(q.clientY-r.top)/z-e.y;D.rx=x;D.ry=y;
  if(D.line||ev.shiftKey){D.line=D.line||ev.shiftKey;P.length=2;P.push(+x.toFixed(1),+y.toFixed(1));continue}
  const nx=D.lx+(x-D.lx)*f,ny=D.ly+(y-D.ly)*f;if(Math.hypot(nx-D.lx,ny-D.ly)<min)continue;D.lx=nx;D.ly=ny;P.push(+nx.toFixed(1),+ny.toFixed(1));
  if(Math.hypot(x-D.hx,y-D.hy)*z>6){D.hx=x;D.hy=y;inkHold()}}
 if(!D.raf)D.raf=requestAnimationFrame(()=>{D.raf=0;if(inkDrag===D)paint(NODES.get(e.id),e)})});
['pointerup','pointercancel'].forEach(type=>$('stage').addEventListener(type,ev=>{const D=inkDrag;if(!D||D.pid!==ev.pointerId)return;clearTimeout(D.hold);cancelAnimationFrame(D.raf);inkDrag=null;mvT=Date.now();const e=ge(D.id);if(!e)return;
 if(type==='pointercancel'){if(e.st[e.st.length-1]===D.st)e.st.pop();paint(NODES.get(e.id),e);return}
 const P=D.st.p;if(!D.line&&Math.hypot(D.rx-P[P.length-2],D.ry-P[P.length-1])>.5)P.push(+D.rx.toFixed(1),+D.ry.toFixed(1));paint(NODES.get(e.id),e);commit()}));
$('stage').addEventListener('pointerleave',ev=>{if(drawMode&&ev.pointerType==='mouse')$('brushCursor').style.display='none'});
$('dp').addEventListener('pointerdown',ev=>ev.stopPropagation());
$('dp').addEventListener('click',ev=>{const b=ev.target.closest('[data-a]');if(!b)return;ev.stopPropagation();act(b.dataset.a,b.dataset.v)});
$('dp').addEventListener('input',ev=>{const i=ev.target;if(i.type!=='color')return;PEN.c=i.value;i.parentElement.style.setProperty('--c',PEN.c);if(PEN.t==='er'){PEN.t='pen';$('dp').querySelectorAll('[data-a=inkt]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.v==='pen')))}penSave();panel()});
const cutPt=(e,ev)=>{const p=localImagePoint(e,ev.clientX,ev.clientY);return{x:Math.max(0,Math.min(1,p.x)),y:Math.max(0,Math.min(1,p.y))}};
$('stage').addEventListener('pointerdown',ev=>{if(!cutDraw)return;ev.stopImmediatePropagation();ev.preventDefault();if(ev.button!==0)return;const e=ge(cutDraw.id);if(!e)return;
 cutDraw.drag={pid:ev.pointerId,x:ev.clientX,y:ev.clientY,p:cutPt(e,ev),free:false};try{$('stage').setPointerCapture(ev.pointerId)}catch(_){}});
$('stage').addEventListener('pointermove',ev=>{if(!cutDraw)return;const e=ge(cutDraw.id),D=cutDraw.drag;if(!e)return;const p=cutPt(e,ev);
 if(D&&D.pid===ev.pointerId){if(!D.free&&Math.hypot(ev.clientX-D.x,ev.clientY-D.y)>8){D.free=true;cutDraw.pts=[D.p]}if(D.free){const P=cutDraw.pts,l=P[P.length-1];if(Math.hypot((p.x-l.x)*e.w,(p.y-l.y)*e.h)*z>2.5){P.push(p);cutOv()}}}
 else if(ev.pointerType==='mouse'){cutDraw.hover=p;cutOv()}});
['pointerup','pointercancel'].forEach(type=>$('stage').addEventListener(type,ev=>{const D=cutDraw?.drag;if(!D||D.pid!==ev.pointerId)return;cutDraw.drag=null;mvT=Date.now();const e=ge(cutDraw.id);if(!e)return;
 if(D.free){if(type==='pointerup'&&cutDraw.pts.length>=3)cutApply();else{cutDraw.pts=[];cutOv();panel()}return}
 if(type!=='pointerup')return;const P=cutDraw.pts,f=P[0];if(P.length>2&&Math.hypot((D.p.x-f.x)*e.w,(D.p.y-f.y)*e.h)*z<16){cutApply();return}P.push(D.p);cutOv();panel()}));
$('stage').addEventListener('pointerdown',ev=>{if(!eraseMode||ev.button!==0)return;const e=ge(eraseMode),m=e?.k&&IMG.get(e.k),target=ev.target.closest('.e');
 ev.stopImmediatePropagation();if(!e||!m||m.type!=='image'||target?.dataset.id!==e.id)return;const p=localImagePoint(e,ev.clientX,ev.clientY);if(p.x<0||p.x>1||p.y<0||p.y>1)return;
 if(brushOp==='restore'&&!e.erase?.length){toast('Nothing erased yet');return}const stroke={r:eraseSize/(2*Math.min(e.w,e.h)),pts:[p]};if(brushOp==='restore')stroke.u=1;e.erase=e.erase||[];e.erase.push(stroke);paint(NODES.get(e.id),e);eraseDrag={id:e.id,pointerId:ev.pointerId,stroke};try{$('stage').setPointerCapture(ev.pointerId)}catch(_){}ev.preventDefault();const c=$('brushCursor'),r=$('stage').getBoundingClientRect();Object.assign(c.style,{display:'block',left:(ev.clientX-r.left)/z+'px',top:(ev.clientY-r.top)/z+'px',width:eraseSize+'px',height:eraseSize+'px'})});
$('stage').addEventListener('pointermove',ev=>{const e=eraseMode&&ge(eraseMode);if(eraseDrag&&eraseDrag.pointerId===ev.pointerId){const target=ge(eraseDrag.id),p=target&&localImagePoint(target,ev.clientX,ev.clientY);if(target&&p&&p.x>=0&&p.x<=1&&p.y>=0&&p.y<=1){const pts=eraseDrag.stroke.pts,last=pts[pts.length-1];if(Math.hypot((p.x-last.x)*target.w,(p.y-last.y)*target.h)>eraseSize*.12)pts.push(p);paint(NODES.get(target.id),target)}
  const c=$('brushCursor'),r=$('stage').getBoundingClientRect();Object.assign(c.style,{display:'block',left:(ev.clientX-r.left)/z+'px',top:(ev.clientY-r.top)/z+'px',width:eraseSize+'px',height:eraseSize+'px'});return}brushCursorAt(ev,e)});
['pointerup','pointercancel','lostpointercapture'].forEach(type=>$('stage').addEventListener(type,ev=>{if(!eraseDrag||ev.pointerId!==eraseDrag.pointerId)return;eraseDrag=null;commit();mvT=Date.now()}));
$('stage').addEventListener('pointerdown',ev=>{if(spaceDown||ev.button===1||ev.button===2)return;const h=ev.target.closest('[data-h]'),n=ev.target.closest('.e')||(sel&&ev.target.closest('#rp')?{dataset:{id:sel}}:null);let e=sel&&ge(sel);
 if(ev.shiftKey||multiSelectMode)return;
 if(h&&e&&multi.size<2)drag={m:h.dataset.h==='rot'?'rt':'rs',h:h.dataset.h.split(',').map(Number)};
 else if(n&&(ev.pointerType==='mouse'||n.dataset.id===sel)){if(!multi.has(n.dataset.id)){select(n.dataset.id);pds=n.dataset.id}e=ge(sel);drag=multi.size>1?{m:'multi',items:[...multi].map(id=>{const q=ge(id);return{id,x:q.x,y:q.y}})}:{m:cropId===sel?'cp':'mv'}}
 else return;
 Object.assign(drag,{x:ev.clientX,y:ev.clientY,e0:{...e},mv:0});try{ev.target.setPointerCapture(ev.pointerId)}catch(_){}ev.preventDefault()});
listen(window,'pointermove',ev=>{if(!drag)return;const e=ge(sel);if(!e)return;const dx=(ev.clientX-drag.x)/z,dy=(ev.clientY-drag.y)/z,o=drag.e0;drag.mv=1;if(e.lg&&(drag.m==='mv'||drag.m==='rs')){delete e.lg;delete e.li}
 if(drag.m==='multi'){drag.items.forEach(q=>{const item=ge(q.id);if(item){item.x=q.x+dx;item.y=q.y+dy}})}
 else if(drag.m==='mv'){e.x=o.x+dx;e.y=o.y+dy;if(ev.altKey||ev.metaKey)guides(e,null,null,[],[]);else snap(e)}
 else if(drag.m==='cp'){e.ox=o.ox+dx/o.w;e.oy=o.oy+dy/o.h}
 else if(drag.m==='rt'){const q=$('stage').getBoundingClientRect();let a=Math.atan2((ev.clientY-q.top)/z-(o.y+o.h/2),(ev.clientX-q.left)/z-(o.x+o.w/2))*180/Math.PI+90;if(a>180)a-=360;const m=Math.round(a/15)*15;e.r=Math.round(Math.abs(a-m)<4?m:a)}
 else{const q=o.r*Math.PI/180,c=Math.cos(q),s=Math.sin(q),lx=dx*c+dy*s,ly=-dx*s+dy*c,[hx,hy]=drag.h;let w=o.w,h=o.h;
  if(hx&&hy){// corners keep the aspect ratio; side handles change one dimension
   const k=Math.max(12/Math.min(o.w,o.h),1+(hx*lx*o.w+hy*ly*o.h)/(o.w*o.w+o.h*o.h));w=o.w*k;h=o.h*k;if(o.type==='text')e.fs=o.fs*k}
  else{if(hx)w=Math.max(12,o.w+hx*lx);if(hy)h=Math.max(12,o.h+hy*ly)}
  const sx=hx*(w-o.w)/2,sy=hy*(h-o.h)/2,cx=o.x+o.w/2+sx*c-sy*s,cy=o.y+o.h/2+sx*s+sy*c;Object.assign(e,{w,h,x:cx-w/2,y:cy-h/2})}
 if(e.type==='text')fitT(e);if(drag.m==='rs'&&!e.r&&!ev.altKey&&!ev.metaKey&&!(drag.h[0]&&drag.h[1]))snapR(e,drag.h[0],drag.h[1]);doc.els.filter(q=>multi.has(q.id)).forEach(q=>paint(NODES.get(q.id),q));paint(NODES.get(e.id),e);place();sync();bdg(e)});
const endDrag=()=>{if(drag&&drag.mv){commit();mvT=Date.now()}drag=null;$('gx').classList.remove('on');$('gy').classList.remove('on');$('gx')._o=$('gy')._o=0;$('sel').classList.remove('snap');$('bd').style.display='none';place()};listen(window,'pointerup',endDrag);listen(window,'pointercancel',endDrag);
$('pn').addEventListener('input',ev=>{const i=ev.target,k=i.dataset.k;if(i.id==='stq'){stkQ=i.value;$('stg').innerHTML=stkList(stkTab,stkQ).map(x=>stkTile(x,'stk')).join('')||'<p class="hint">No stickers match.</p>';return}if(!k)return;if(i.type==='range')rfill(i);const num=i.type==='number'||i.type==='range',nv=num?parseFloat(i.value)||0:i.value;
 if(k==='_bg'){if(doc.mbg)doc.mbg=i.value;else doc.bg[cur]=i.value;render();return}
 if(k==='_nm'){doc.name=i.value;saveSoon();return}
 if(k==='previewTarget'){doc.previewTarget=nv;return}
 if(k==='_eraseSize'){eraseSize=nv;return}
 if(/^_p(sz|op|sm|gl|c)$/.test(k)){if(k==='_psz')PEN.sz[PEN.t]=Math.max(1,nv);else if(k==='_pop')PEN.o=Math.max(.1,Math.min(1,nv));else if(k==='_psm')PEN.sm=nv;else if(k==='_pgl')PEN.g=nv;else{PEN.c=i.value;if(PEN.t==='er')PEN.t='pen';dockSync()}penSave();sync();return}
 if(k==='_gl'){const e=ge(sel);if(e?.type!=='draw')return;e.st=e.st.map(q=>q.t==='er'?q:{...q,g:nv});paint(NODES.get(e.id),e);sync();return}
 if(k==='_ca'||k==='_csl'){const e=ge(sel);if(!e?.cq)return;e.cq={...e.cq,[k==='_ca'?'a':'sl']:nv};e.cp=cutCp(e.ck,e.cq);paint(NODES.get(e.id),e);sync();return}
 if(k==='_gap'||k==='_mar'||k==='_cor'){const e0=sel&&ge(sel),g=lgOf(e0);if(k==='_gap')layGap=nv;else if(k==='_mar')layMar=nv;else layRd=nv;if(g){g[k==='_gap'?'gap':k==='_mar'?'mar':'rd']=nv;reflow(e0.lg);render()}sync();return}
 const e=ge(sel);if(!e)return;
 if(k==='fi')Object.assign(e,fxParams(FP[e.fp]||{},nv),{fi:nv});
 else if(k==='vs'||k==='ve'){const m=e.type==='img'&&e.k&&IMG.get(e.k);if(m?.type==='video'&&m.duration>0){if(k==='vs')e.vs=Math.min(Math.max(0,nv),Math.max(0,clipEnd(e,m)-.1));else e.ve=Math.max(Math.min(m.duration,nv),Math.min(m.duration,clipStart(e,m)+.1));sync();const video=NODES.get(e.id)?.querySelector('video');if(video){video.currentTime=clipStart(e,m);if(video.paused)syncVideoPlayback()}}}
 else{e[k]=nv;if(k==='lt'&&e.ln)lnFit(e);if(k in FD||k==='tn')e.fp='';if(e.lg&&(k==='x'||k==='y'||k==='w'||k==='h')){delete e.lg;delete e.li}}
 fitT(e);paint(NODES.get(e.id),e);place();sync()});
$('pn').addEventListener('change',ev=>{const k=ev.target.dataset.k;if(k&&!/^_p(sz|op|sm|gl|c)$/.test(k)&&!(/^_(gap|mar|cor)$/.test(k)&&!lgOf(sel&&ge(sel))))commit()});
$('pn').addEventListener('click',ev=>{const b=ev.target.closest('[data-a]');if(b)act(b.dataset.a,b.dataset.v)});
/* drag to place: press a shape, line, sticker or layout (or Text in the bar) and drop it on any slide.
   Mouse starts after a few px of travel; touch needs a short hold so the sheet can still scroll. */
const DND={shp:1,lnadd:1,stk:1,lay:1};let dnd=null,dndEnd=0;
function dndSrc(t){const b=t.closest('#pn [data-a]');if(b&&DND[b.dataset.a])return{b,a:b.dataset.a,v:b.dataset.v};const tb=t.closest('#bar [data-b=text]');return tb?{b:tb,a:'text'}:null}
function dndAt(x,y){if(!doc)return null;const cv=$('cv').getBoundingClientRect();if(x<cv.left||x>cv.right||y<cv.top||y>cv.bottom)return null;
 const st=$('stage').getBoundingClientRect(),sx=(x-st.left)/z,sy=(y-st.top)/z,pad=60/z,i=Math.min(doc.n-1,Math.max(0,Math.floor(sx/doc.W)));
 if(sx<-pad||sx>doc.n*doc.W+pad||sy<-pad||sy>doc.H+pad)return null;const t={i,sx:Math.min(Math.max(sx,i*doc.W),(i+1)*doc.W),sy:Math.min(Math.max(sy,0),doc.H),f:null};
 if(dnd.a==='lay'&&!layWhole){const n=document.elementsFromPoint(x,y).find(q=>q.classList?.contains('e')),f=n&&ge(n.dataset.id);if(f&&f.type==='img'&&!f.r&&SL(f)===i)t.f=f}
 return t}
function dndOn(){const d=dnd;d.on=true;clearTimeout(lpT);hideTip();if(d.touch&&navigator.vibrate)navigator.vibrate(8);
 const g=document.createElement('div');g.className='dndg';
 if(d.a==='text')g.innerHTML='<span class="dndt">Aa</span>';else{const m=d.b.querySelector('svg,img,canvas');if(m){const c=m.cloneNode(true);if(m.tagName==='CANVAS')c.getContext('2d').drawImage(m,0,0);g.append(c)}else g.innerHTML=`<span class="dndt">${esc((d.b.textContent||'').trim().slice(0,2))}</span>`}
 const lb=document.createElement('b');g.append(lb);d.badge=lb;document.body.append(g);d.g=g;
 let zn=$('dnz');if(!zn){zn=document.createElement('div');zn.id='dnz';zn.innerHTML='<i></i>';$('stage').append(zn)}d.zn=zn;
 $('ed').classList.add('dnd');dndMove(d.x,d.y);requestAnimationFrame(()=>g.classList.add('on'));
 /* hold near the canvas edge to scroll towards other slides */
 const tick=()=>{if(dnd!==d)return;const cv=$('cv'),r=cv.getBoundingClientRect(),e=Math.min(56,r.width*.12),v=d.x<r.left+e&&d.x>r.left-40?-1:d.x>r.right-e&&d.x<r.right+40?1:0;
  if(v&&d.y>r.top&&d.y<r.bottom){const before=cv.scrollLeft;cv.scrollLeft+=v*Math.max(6,r.width*.025);if(cv.scrollLeft!==before)dndMove(d.x,d.y)}d.raf=requestAnimationFrame(tick)};d.raf=requestAnimationFrame(tick)}
function dndMove(x,y){const d=dnd;d.x=x;d.y=y;if(!d.on)return;d.g.style.left=Math.min(Math.max(x,64),innerWidth-64)+'px';d.g.style.top=Math.max(y,56)+'px';
 const t=dndAt(x,y);d.t=t;d.g.classList.toggle('ok',!!t);d.zn.classList.toggle('on',!!t);if(!t)return;
 const W=doc.W,b=t.f?{l:t.f.x,t:t.f.y,w:t.f.w,h:t.f.h}:{l:t.i*W,t:0,w:W,h:doc.H};
 Object.assign(d.zn.style,{left:b.l+'px',top:b.t+'px',width:b.w+'px',height:b.h+'px'});
 const dot=d.zn.firstChild;dot.style.display=d.a==='lay'?'none':'';dot.style.left=(t.sx-b.l)+'px';dot.style.top=(t.sy-b.t)+'px';
 d.badge.textContent=d.a==='lay'?(t.f?'Fill this frame':`Layout · slide ${t.i+1}`):`Drop on slide ${t.i+1}`}
function dndStop(drop){const d=dnd;dnd=null;clearTimeout(d.tm);cancelAnimationFrame(d.raf);if(!d.on)return;dndEnd=Date.now();$('ed').classList.remove('dnd');d.zn.classList.remove('on');
 const g=d.g;g.classList.remove('ok');g.classList.add('land');setTimeout(()=>g.remove(),240);if(drop&&d.t)dndDrop(d,d.t)}
function dndDrop(d,t){if(drawMode)inkStop(false);if(cutDraw)cutEnd();eraseMode=null;cropId=null;cur=t.i;
 if(d.a==='lay'){if(t.f){sel=t.f.id;multi=new Set([sel])}else{sel=null;multi.clear()}act('lay',d.v);toast(t.f?'Layout placed in frame':`Layout applied to slide ${t.i+1}`);return}
 if(d.a==='text')$('bar').querySelector('[data-b=text]').click();else act(d.a,d.v);
 const els=[...multi].map(ge).filter(Boolean);if(!els.length)return;const B=els.map(boxOf),l=Math.min(...B.map(q=>q.l)),tp=Math.min(...B.map(q=>q.t)),r=Math.max(...B.map(q=>q.r)),bt=Math.max(...B.map(q=>q.b)),W=doc.W,x0=t.i*W;
 const fit=(lo,hi,a,b,c)=>b-a>=hi-lo?lo+(hi-lo)/2-(a+b)/2:Math.min(Math.max(c-(a+b)/2,lo-a),hi-b);
 const dx=fit(x0,x0+W,l,r,t.sx),dy=fit(0,doc.H,tp,bt,t.sy);els.forEach(e=>{e.x+=dx;e.y+=dy});
 hist[hi]=JSON.stringify(doc);saveSoon();fsSoon();cur=t.i;render();panel();
 els.forEach(e=>{const n=$('els').querySelector(`.e[data-id="${e.id}"]`);if(n){n.classList.add('dropin');n.addEventListener('animationend',()=>n.classList.remove('dropin'),{once:true})}})}
listen(document,'pointerdown',ev=>{if(dnd||ev.button!==0||!doc||!$('ed').getClientRects().length)return;const s=dndSrc(ev.target);if(!s)return;
 dnd={...s,id:ev.pointerId,x0:ev.clientX,y0:ev.clientY,x:ev.clientX,y:ev.clientY,touch:ev.pointerType!=='mouse',on:false};
 if(dnd.touch)dnd.tm=setTimeout(()=>{if(dnd&&!dnd.on)dndOn()},260)},true);
listen(window,'pointermove',ev=>{if(!dnd||ev.pointerId!==dnd.id)return;const dist=Math.hypot(ev.clientX-dnd.x0,ev.clientY-dnd.y0);
 if(!dnd.on){if(dnd.touch){if(dist>10)dndStop(false)}else if(dist>5){dnd.x=ev.clientX;dnd.y=ev.clientY;dndOn()}return}
 ev.preventDefault();dndMove(ev.clientX,ev.clientY)});
listen(window,'pointerup',ev=>{if(dnd&&ev.pointerId===dnd.id)dndStop(true)});
listen(window,'pointercancel',ev=>{if(dnd&&ev.pointerId===dnd.id&&!(dnd.on&&dnd.touch))dndStop(false)});
/* once a touch drag is live, keep the page from scrolling and follow the finger even if pointer events were cancelled */
listen(window,'touchmove',ev=>{if(!dnd?.on)return;ev.preventDefault();const t=ev.touches[0];if(t)dndMove(t.clientX,t.clientY)},{passive:false});
listen(window,'touchend',()=>{if(dnd?.on&&dnd.touch)dndStop(true)});
listen(window,'keydown',ev=>{if(dnd&&ev.key==='Escape'){ev.stopImmediatePropagation();dndStop(false)}},true);
listen(window,'click',ev=>{if(ev.isTrusted&&Date.now()-dndEnd<400&&ev.target.closest('#sh,#bar')){ev.stopImmediatePropagation();ev.preventDefault()}},true);
listen(window,'contextmenu',ev=>{if(dnd)ev.preventDefault()},true);
$('sh').addEventListener('dragstart',ev=>{if(dndSrc(ev.target))ev.preventDefault()});
$('bar').addEventListener('click',ev=>{const b=ev.target.closest('[data-b]');if(!b)return;const k=b.dataset.b,x=cur*doc.W,H=doc.H,
 ad=o=>{const e={r:0,o:1,rd:0,...o,id:nid()};doc.els.push(e);sel=e.id;multi=new Set([e.id]);eraseMode=null;cropId=null;commit();render();panel()};
if(k==='draw'){if(drawMode)inkStop(true);else inkStart();return}
if(drawMode)inkStop(false);
if(k==='multi'){multiSelectMode=!multiSelectMode;b.setAttribute('aria-pressed',String(multiSelectMode));toast(multiSelectMode?'Multi-select on · tap objects to add them':'Multi-select off · drag the selection to move it');return}
 if(k==='text')ad({type:'text',x:x+140,y:H/2-60,w:800,h:120,text:'Your text',fs:84,f:'s',wt:700,c:'#16161a',a:'center',v:'c',ls:0,lh:1.15,bg:''});
 else if(k==='photo'){fillT=sel&&ge(sel)&&ge(sel).type==='img'?sel:null;$('fl').click()}
 else if(k==='slide'){const on=!(slideOpen&&mode==='slide'&&!sel);sel=null;multi.clear();eraseMode=null;cropId=null;mode='slide';slideOpen=on;if(!isDesk())setFs(on);render();panel()}
 else{if(!(k==='lay'&&sel&&ge(sel)&&ge(sel).type==='img')){sel=null;multi.clear();eraseMode=null;cropId=null}mode=k;slideOpen=false;render();panel()}});
function cands(e){const W=doc.W,H=doc.H,s0=SL(e)*W,X=[0,.5,1].map(f=>({v:s0+W*f,a:0,b:H})),Y=[0,.5,1].map(f=>({v:H*f,a:s0,b:s0+W}));
 doc.els.forEach(q=>{if(q.id===e.id||q.r)return;[0,.5,1].forEach(f=>{X.push({v:q.x+q.w*f,a:q.y,b:q.y+q.h});Y.push({v:q.y+q.h*f,a:q.x,b:q.x+q.w})});
  if(q.type==='img'){X.push({v:q.x+q.w+layGap,a:q.y,b:q.y+q.h,f:0},{v:q.x-layGap,a:q.y,b:q.y+q.h,f:1});Y.push({v:q.y+q.h+layGap,a:q.x,b:q.x+q.w,f:0},{v:q.y-layGap,a:q.x,b:q.x+q.w,f:1})}});
 return{X,Y}}
const near=(C,pos,len,T,fs)=>{let b=null;fs.forEach(f=>C.forEach(c=>{if(c.f!=null&&c.f!==f)return;const d=c.v-(pos+len*f);if(Math.abs(d)<T&&(!b||Math.abs(d)<Math.abs(b.d)))b={c,f,d}}));return b};
function snap(e){const T=8/z,R=18/z,{X,Y}=cands(e),s=drag.st||(drag.st={});
 const pick=(C,pos,len,k)=>{const o=s[k],n=near(C,pos,len,T,[0,.5,1]);if(o){const d=o.c.v-(pos+len*o.f);if(Math.abs(d)<R)return n&&Math.abs(n.d)<Math.abs(d)-.5?n:{c:o.c,f:o.f,d}}return n};
 const bx=s.x=pick(X,e.x,e.w,'x'),by=s.y=pick(Y,e.y,e.h,'y');if(bx)e.x+=bx.d;if(by)e.y+=by.d;guides(e,bx,by,X,Y)}
function snapR(e,hx,hy){const T=8/z,{X,Y}=cands(e);let bx=null,by=null;
 if(hx){bx=near(X,hx<0?e.x:e.x+e.w,0,T,[hx<0?0:1]);if(bx){if(hx<0){e.x+=bx.d;e.w-=bx.d}else e.w+=bx.d}}
 if(hy){by=near(Y,hy<0?e.y:e.y+e.h,0,T,[hy<0?0:1]);if(by){if(hy<0){e.y+=by.d;e.h-=by.d}else e.h+=by.d}}
 guides(e,bx,by,X,Y)}
function guides(e,bx,by,X,Y){const g=(id,on,css)=>{const n=$(id);if(on){if(!n._o){n.classList.remove('on');void n.offsetWidth}n.classList.add('on');Object.assign(n.style,css)}else n.classList.remove('on');n._o=on};
 let cx={},cy={};
 if(bx){const v=bx.c.v,m=X.filter(c=>Math.abs(c.v-v)<.6),a=Math.min(e.y,...m.map(c=>c.a)),b=Math.max(e.y+e.h,...m.map(c=>c.b));cx={left:v+'px',top:a+'px',height:b-a+'px'}}
 if(by){const v=by.c.v,m=Y.filter(c=>Math.abs(c.v-v)<.6),a=Math.min(e.x,...m.map(c=>c.a)),b=Math.max(e.x+e.w,...m.map(c=>c.b));cy={top:v+'px',left:a+'px',width:b-a+'px'}}
 g('gx',!!bx,cx);g('gy',!!by,cy);$('sel').classList.toggle('snap',!!(bx||by));
 const k=(bx?bx.c.v:'')+'|'+(by?by.c.v:'');if((bx||by)&&drag.k!==k&&navigator.vibrate)navigator.vibrate(6);drag.k=k}
function bdg(e){const b=$('bd'),m=drag.m,s=m==='mv'?`${Math.round(e.x)}, ${Math.round(e.y)}`:m==='rt'?`${e.r}°`:m==='rs'?`${Math.round(e.w)} × ${Math.round(e.h)}`:'';
 if(!s){b.style.display='none';return}Object.assign(b.style,{display:'block',left:e.x+e.w/2+'px',top:e.y+e.h+18/z+'px'});b.textContent=s}
$('rp').onclick=ev=>{ev.stopPropagation();if(Date.now()-mvT<350)return;fillT=sel;$('fl').click()};
$('qa').addEventListener('pointerdown',ev=>ev.stopPropagation());
$('qa').addEventListener('click',ev=>{ev.stopPropagation();const b=ev.target.closest('[data-qa]');if(!b||!sel)return;act(b.dataset.qa,b.dataset.v)});
$('els').addEventListener('pointerdown',ev=>{if(ev.target.closest('.ph-add'))ev.stopPropagation()});
$('els').addEventListener('click',ev=>{const b=ev.target.closest('.ph-add');if(!b)return;ev.stopPropagation();const n=b.closest('.e');if(!n)return;select(n.dataset.id);fillT=n.dataset.id;$('fl').click()});
const DK='cs.drawer',isDesk=()=>matchMedia('(min-width:900px)').matches;let dw={};try{dw=JSON.parse(localStorage.getItem(DK)||'{}')||{}}catch(_){}
const dwSave=()=>{try{localStorage.setItem(DK,JSON.stringify(dw))}catch(_){}},refit=()=>dispatchEvent(new Event('resize'));
function dwApply(){const ed=$('ed'),sh=$('sh'),f=isDesk()&&!!dw.f;ed.classList.toggle('sh-float',f);
 if(f){const w=Math.min(dw.w||340,innerWidth-24),h=Math.min(dw.h||Math.round(innerHeight*.7),innerHeight-24);dw.x=Math.max(12,Math.min(dw.x??innerWidth-w-24,innerWidth-w-12));dw.y=Math.max(12,Math.min(dw.y??76,innerHeight-60));sh.style.cssText=`--fx:${dw.x}px;--fy:${dw.y}px;--fw:${w}px;--fh:${h}px`}
 else sh.style.cssText=!isDesk()&&dw.m?`height:${Math.min(dw.m,innerHeight*.88)}px;max-height:none`:'';
 const b=$('dock'),l=f?'Dock panel':'Float panel';b.innerHTML=ic(f?'dock':'float');b.dataset.tip=l;b.setAttribute('aria-label',l)}
const detents=()=>[96,Math.round(innerHeight*.45),Math.round(innerHeight*.8)];
function sheetTo(h){dw.m=h;dwApply();dwSave()}
let gd=null;
$('gr').addEventListener('pointerdown',ev=>{if(ev.button!==0||ev.target.closest('#dock'))return;const r=$('sh').getBoundingClientRect();gd={id:ev.pointerId,x:ev.clientX,y:ev.clientY,ox:ev.clientX-r.left,oy:ev.clientY-r.top,h:r.height,w:r.width,px:dw.x,py:dw.y,moved:false,wasF:!!dw.f};try{$('gr').setPointerCapture(ev.pointerId)}catch(_){}$('sh').classList.add('drag')});
$('gr').addEventListener('pointermove',ev=>{if(!gd||ev.pointerId!==gd.id)return;const dx=ev.clientX-gd.x,dy=ev.clientY-gd.y;if(!gd.moved&&Math.hypot(dx,dy)<5)return;gd.moved=true;
 if(isDesk()){if(!dw.f){dw.f=1;dw.w=Math.round(gd.w);dw.h=Math.round(Math.min(gd.h,innerHeight*.72));gd.ox=Math.min(gd.ox,dw.w-40);refit()}dw.x=ev.clientX-gd.ox;dw.y=ev.clientY-gd.oy;dwApply()}
 else{const h=Math.max(60,Math.min(innerHeight*.88,gd.h-dy));$('sh').style.cssText=`height:${h}px;max-height:none`}});
function grEnd(ev){if(!gd||ev.pointerId!==gd.id)return;const g=gd;gd=null;$('sh').classList.remove('drag');
 if(isDesk()){if(!g.moved)return;if(dw.f&&dw.x+Math.min(dw.w||340,innerWidth-24)>innerWidth-28){dw.f=0;dwApply();refit()}dwSave();return}
 const d=detents(),h=$('sh').getBoundingClientRect().height;if(g.moved){const v=h-g.h;let t=d.reduce((a,b)=>Math.abs(b-h)<Math.abs(a-h)?b:a);if(Math.abs(v)>40&&t===d.reduce((a,b)=>Math.abs(b-g.h)<Math.abs(a-g.h)?b:a))t=d[Math.max(0,Math.min(2,d.indexOf(t)+(v>0?1:-1)))];sheetTo(t)}
 else{const ref=dw.m||h,i=d.reduce((a,b,j)=>Math.abs(b-ref)<Math.abs(d[a]-ref)?j:a,0);sheetTo(d[(i+1)%3])}}
['pointerup','pointercancel'].forEach(t=>$('gr').addEventListener(t,grEnd));
$('gr').addEventListener('keydown',ev=>{if(ev.target!==$('gr')||!/^(Enter| |ArrowUp|ArrowDown)$/.test(ev.key))return;ev.preventDefault();if(isDesk()){dw.f=dw.f?0:1;dwApply();dwSave();refit();return}const d=detents(),h=dw.m||$('sh').getBoundingClientRect().height,i=d.reduce((a,b,j)=>Math.abs(b-h)<Math.abs(d[a]-h)?j:a,0);sheetTo(d[ev.key==='ArrowDown'?Math.max(0,i-1):ev.key==='ArrowUp'?Math.min(2,i+1):(i+1)%3])});
$('dock').addEventListener('click',ev=>{ev.stopPropagation();dw.f=dw.f?0:1;if(dw.f){dw.x=undefined;dw.y=undefined}dwApply();dwSave();refit()});
let dwRT=0;new ResizeObserver(()=>{if(!isDesk()||!dw.f||gd)return;clearTimeout(dwRT);dwRT=setTimeout(()=>{const sh=$('sh');if(!$('ed').classList.contains('sh-float'))return;dw.w=sh.offsetWidth;dw.h=sh.offsetHeight;dwSave()},200)}).observe($('sh'));
listen(window,'resize',()=>dwApply());dwApply();
let cvRT=0;new ResizeObserver(()=>{if(!doc||!$('ed').classList.contains('on'))return;cancelAnimationFrame(cvRT);cvRT=requestAnimationFrame(()=>{if(!lastFit||Math.abs(z-lastFit)>=.004)return;const f=fitZ();if(Math.abs(f-z)<.002)return;z=lastFit=f;render();goSlide(cur,1);if(sel)reveal()})}).observe($('cv'));
$('pn').addEventListener('toggle',ev=>{if(ev.target.dataset.n)OD[ev.target.dataset.n]=ev.target.open},true);
$('cv').addEventListener('dragover',ev=>ev.preventDefault());
$('cv').addEventListener('drop',ev=>{ev.preventDefault();const f=[...ev.dataTransfer.files].filter(x=>x.type.startsWith('image/')||x.type.startsWith('video/'));if(!f.length)return;const n=document.elementFromPoint(ev.clientX,ev.clientY)?.closest('.e'),q=n&&ge(n.dataset.id);fillT=q&&q.type==='img'?q.id:null;const dt=new DataTransfer();f.forEach(x=>dt.items.add(x));$('fl').files=dt.files;$('fl').dispatchEvent(new Event('change'))});
function zoomAt(cx,cy,f){const v=$('cv'),a=$('zm').getBoundingClientRect(),px=(cx-a.left)/z,py=(cy-a.top)/z;z=Math.max(.02,Math.min(4,z*f));render();const b=$('zm').getBoundingClientRect();v.scrollLeft+=b.left+px*z-cx;v.scrollTop+=b.top+py*z-cy}
$('cv').addEventListener('wheel',ev=>{if(!ev.ctrlKey&&!ev.metaKey)return;ev.preventDefault();const e=cropId&&ge(cropId),f=Math.exp(-ev.deltaY*.01);
 if(e){e.s=Math.max(.2,Math.min(6,e.s*f));paint(NODES.get(e.id),e);sync();clearTimeout(kt);kt=setTimeout(commit,400)}else zoomAt(ev.clientX,ev.clientY,f)},{passive:false});
const tps=new Map();let pd=0;
$('cv').addEventListener('pointerdown',ev=>{if(ev.pointerType==='touch')tps.set(ev.pointerId,[ev.clientX,ev.clientY])});
$('cv').addEventListener('pointermove',ev=>{if(!tps.has(ev.pointerId))return;tps.set(ev.pointerId,[ev.clientX,ev.clientY]);if(tps.size===2&&!drag){const[a,b]=[...tps.values()],d=Math.hypot(a[0]-b[0],a[1]-b[1]);if(pd)zoomAt((a[0]+b[0])/2,(a[1]+b[1])/2,d/pd);pd=d}});
['pointerup','pointercancel'].forEach(k=>$('cv').addEventListener(k,ev=>{tps.delete(ev.pointerId);if(tps.size<2)pd=0}));
$('un').onclick=$('un2').onclick=()=>undo(-1);$('rd').onclick=$('rd2').onclick=()=>undo(1);
function setFs(on){$('ed').classList.toggle('fs-on',on);$('pg').setAttribute('aria-expanded',String(on));$('pg').setAttribute('aria-label',on?'Hide slides':'Show slides');if(on)fsSoon()}
$('pg').onclick=ev=>{ev.stopPropagation();setFs(!$('ed').classList.contains('fs-on'))};
const zoomC=f=>{const r=$('cv').getBoundingClientRect();zoomAt(r.left+r.width/2,r.top+r.height/2,f)};$('zi').onclick=()=>zoomC(1.25);$('zo').onclick=()=>zoomC(.8);
$('zf').onclick=()=>{if(!isDesk()){z=lastFit=fitZ();render();goSlide(cur,1);return}const a=fitZ(),b=fitZ(1),nr=Math.abs(z-a)<.004;z=nr&&doc.n>1?b:(nr||Math.abs(z-b)<.004)?1:a;render();goSlide(cur,1);lastFit=Math.abs(z-a)<.004?z:0};
 $('cv').addEventListener('scroll',()=>{if(!doc)return;syncVideoPlayback();const v=$('cv'),c=visibleSlide();if(c!==cur&&!sel){cur=c;btns();if(mode==='slide'||mode==='lay')panel()}});
$('bk').onclick=async()=>{if(drawMode)inkStop(false);if(!DBok&&hi>0&&!leave){leave=1;toast('Autosave isn’t available here. Tap again to discard edits.');setTimeout(()=>leave=0,3000);return}
 if(hi>0)await saveProj();if(fromHome){onExit();return}$('ed').classList.remove('on');document.body.style.overflow='';leave=0;syncVideoPlayback();recents()};
$('blank').onclick=()=>openNb();
listen(window,'keydown',ev=>{if(!$('ed').classList.contains('on')||/INPUT|TEXTAREA|SELECT/.test(ev.target.tagName))return;const e=sel&&ge(sel),m=ev.metaKey||ev.ctrlKey,many=multi.size>1;
 if(drawMode){const k=ev.key;if(k==='Escape')inkStop(true);else if(m&&k.toLowerCase()==='z')undo(ev.shiftKey?1:-1);else if(!m&&(k==='['||k===']')){PEN.sz[PEN.t]=Math.max(1,Math.min(240,Math.round(penSz()*(k===']'?1.18:.85))));penSave();sync()}else if(!m&&/^[1-7]$/.test(k))act('inkt',BRUSH[+k-1][0]);else if(!m&&k.toLowerCase()==='e')act('inkt','er');else if(!m&&k.toLowerCase()==='p')act('inkt','pen');else return;ev.preventDefault();return}
 if(!m&&!e&&!many&&ev.key.toLowerCase()==='p'&&!ev.altKey){ev.preventDefault();inkStart();return}
 if(cutDraw){if(ev.key==='Escape')cutCancel();else if(ev.key==='Enter')cutApply();else if(/^(Backspace|Delete)$/.test(ev.key)||(m&&ev.key.toLowerCase()==='z'))act('cutundo');else return;ev.preventDefault();return}
 if(ev.key==='Escape'){slideOpen=false;sel=null;multi.clear();multiSelectMode=false;eraseMode=null;$('bar').querySelector('[data-b=multi]').setAttribute('aria-pressed','false');$('brushCursor').style.display='none';cropId=null;render();panel()}
 else if(m&&ev.key.toLowerCase()==='d'){ev.preventDefault();act(many?'multiDup':'dup')}
 else if(m&&ev.key.toLowerCase()==='g'){ev.preventDefault();act(ev.shiftKey?'ungroup':'group')}
 else if(m&&(ev.key.toLowerCase()==='z')){ev.preventDefault();undo(ev.shiftKey?1:-1)}
 else if(many&&/^(Delete|Backspace)$/.test(ev.key))act('multiDel');
 else if(e&&/^(Delete|Backspace)$/.test(ev.key))act('del');
 else if((many||e)&&ev.key.startsWith('Arrow')){ev.preventDefault();const d=ev.shiftKey?10:1,move=items=>items.forEach(q=>({ArrowLeft:()=>q.x-=d,ArrowRight:()=>q.x+=d,ArrowUp:()=>q.y-=d,ArrowDown:()=>q.y+=d})[ev.key]());if(many){const items=[...multi].map(ge).filter(Boolean);move(items);items.forEach(q=>paint(NODES.get(q.id),q));place()}else{move([e]);paint(NODES.get(e.id),e);place()}sync();clearTimeout(kt);kt=setTimeout(commit,400)}});

/* export: native canvas, lossless PNG, photos drawn from the original files */
function grd(x,s,a,b,w,h){if(!/^linear-gradient/.test(s))return s;const p=s.slice(s.indexOf('(')+1,-1).split(/,(?![^(]*\))/).map(v=>v.trim());let d=180;if(/deg$/.test(p[0]))d=parseFloat(p.shift());
 const q=d*Math.PI/180,L=Math.abs(w*Math.sin(q))+Math.abs(h*Math.cos(q)),dx=Math.sin(q)*L/2,dy=-Math.cos(q)*L/2,cx=a+w/2,cy=b+h/2,g=x.createLinearGradient(cx-dx,cy-dy,cx+dx,cy+dy);
 p.forEach((c,i)=>{const m=c.match(/^(.*\S)\s+([\d.]+)%$/);g.addColorStop(m?m[2]/100:i/(p.length-1||1),m?m[1]:c)});return g}
const poly=(x,cp,w,h)=>{const f=(v,m)=>/%$/.test(v)?parseFloat(v)/100*m:parseFloat(v);cp.split(',').forEach((p,i)=>{const[a,b]=p.trim().split(/\s+/);x[i?'lineTo':'moveTo'](f(a,w),f(b,h))})};
function wrap(x,t,w){const o=[];t.split('\n').forEach(p=>{let l='';p.split(' ').forEach(wd=>{const s=l?l+' '+wd:wd;if(l&&x.measureText(s).width>w){o.push(l);l=wd}else l=s});o.push(l)});return o}
const flp=(c,e,g)=>{c.translate(g.ix+g.dw/2,g.iy+g.dh/2);c.scale(e.fx?-1:1,e.fy?-1:1);c.translate(-g.ix-g.dw/2,-g.iy-g.dh/2)};
function drawF(x,m,g,e,w,h,k,source){const oc=document.createElement('canvas');oc.width=Math.round(w*k);oc.height=Math.round(h*k);const c=oc.getContext('2d'),ow=oc.width,oh=oc.height;c.imageSmoothingQuality='high';
 c.save();c.scale(ow/w,oh/h);flp(c,e,g);if(e.bl&&'filter' in c)c.filter=`blur(${e.bl*k}px)`;c.drawImage(source,g.ix,g.iy,g.dw,g.dh);c.restore();c.filter='none';
 const br=e.br??1,ct=e.ct??1,sa=e.sa??1,gs=e.gs||0,sp=e.sp||0,hu=(e.hu||0)*Math.PI/180;
 if(br!==1||ct!==1||sa!==1||gs||sp||hu){const id=c.getImageData(0,0,ow,oh),d=id.data,q=v=>v<0?0:v>255?255:v,co=Math.cos(hu),si=Math.sin(hu);
  for(let i=0;i<d.length;i+=4){let r=q(d[i]*br),g2=q(d[i+1]*br),b=q(d[i+2]*br),R,G,B;
   r=q((r-127.5)*ct+127.5);g2=q((g2-127.5)*ct+127.5);b=q((b-127.5)*ct+127.5);
   if(sa!==1){R=(.213+.787*sa)*r+(.715-.715*sa)*g2+(.072-.072*sa)*b;G=(.213-.213*sa)*r+(.715+.285*sa)*g2+(.072-.072*sa)*b;B=(.213-.213*sa)*r+(.715-.715*sa)*g2+(.072+.928*sa)*b;r=q(R);g2=q(G);b=q(B)}
   if(gs){const a=1-gs;R=(.2126+.7874*a)*r+(.7152-.7152*a)*g2+(.0722-.0722*a)*b;G=(.2126-.2126*a)*r+(.7152+.2848*a)*g2+(.0722-.0722*a)*b;B=(.2126-.2126*a)*r+(.7152-.7152*a)*g2+(.0722+.9278*a)*b;r=q(R);g2=q(G);b=q(B)}
   if(sp){const a=1-sp;R=(.393+.607*a)*r+(.769-.769*a)*g2+(.189-.189*a)*b;G=(.349-.349*a)*r+(.686+.314*a)*g2+(.168-.168*a)*b;B=(.272-.272*a)*r+(.534-.534*a)*g2+(.131+.869*a)*b;r=q(R);g2=q(G);b=q(B)}
   if(hu){R=(.213+co*.787-si*.213)*r+(.715-co*.715-si*.715)*g2+(.072-co*.072+si*.928)*b;G=(.213-co*.213+si*.143)*r+(.715+co*.285+si*.14)*g2+(.072-co*.072-si*.283)*b;B=(.213-co*.213-si*.787)*r+(.715-co*.715+si*.715)*g2+(.072+co*.928+si*.072)*b;r=q(R);g2=q(G);b=q(B)}
   d[i]=r;d[i+1]=g2;d[i+2]=b}c.putImageData(id,0,0)}
 if(e.sh>0&&ow>2&&oh>2){const id=c.getImageData(0,0,ow,oh),src=id.data,d=new Uint8ClampedArray(src),amount=Math.min(1,e.sh/100)*.8,stride=ow*4;
  for(let y=1;y<oh-1;y++)for(let x0=1;x0<ow-1;x0++){const i=(y*ow+x0)*4;for(let ch=0;ch<3;ch++){const avg=(src[i-4+ch]+src[i+4+ch]+src[i-stride+ch]+src[i+stride+ch])*.25;d[i+ch]=src[i+ch]+(src[i+ch]-avg)*amount}}
  id.data.set(d);c.putImageData(id,0,0)}
 if(e.ta>0&&e.tn){const[r,g2,b]=rgb(e.tn);c.fillStyle=`rgba(${r},${g2},${b},${e.ta})`;c.fillRect(0,0,ow,oh)}
 if(e.fd>0){c.fillStyle=`rgba(222,218,214,${e.fd})`;c.fillRect(0,0,ow,oh)}
 if(e.vg>0){const gr2=c.createRadialGradient(ow/2,oh/2,0,ow/2,oh/2,Math.hypot(ow,oh)/2);gr2.addColorStop(.45,'rgba(0,0,0,0)');gr2.addColorStop(1,`rgba(0,0,0,${e.vg})`);c.fillStyle=gr2;c.fillRect(0,0,ow,oh)}
 applyErase(c,e,w,h,k);
 x.drawImage(oc,0,0,w,h)}
function drawEl(x,e,k){x.save();x.translate(e.x+e.w/2,e.y+e.h/2);x.rotate(e.r*Math.PI/180);x.translate(-e.w/2,-e.h/2);x.globalAlpha=e.o;
 const w=e.w,h=e.h,P=()=>{x.beginPath();if(e.cp){poly(x,e.cp,w,h);x.closePath()}else x.roundRect(0,0,w,h,rad(e))};
 if(e.type==='shape'&&e.ln){if(e.sh){x.shadowColor='rgba(0,0,0,.3)';x.shadowBlur=6*k;x.shadowOffsetY=3*k}lnDraw(x,e)}
 else if(e.type==='shape'){P();if(e.sh){x.shadowColor='rgba(0,0,0,.28)';x.shadowBlur=22*k;x.shadowOffsetY=6*k}x.fillStyle=grd(x,e.fill,0,0,w,h);x.fill()}
 else if(e.type==='draw'){const{c,M}=inkCanvas(e,k);x.drawImage(c,-M,-M,c.width/k,c.height/k)}
 else if(e.type==='img'){P();const m=e.k&&IMG.get(e.k);if(m){x.clip();const g=geo(e,m),node=m.type==='video'?(NODES.get(e.id)?.querySelector('video')||m.video):m.im,source=m.type==='video'&&node.readyState<2?m.video:node;if(source.readyState===undefined||source.readyState>=2){x.globalCompositeOperation=e.blend||'source-over';if(hasF(e)||e.erase?.length)drawF(x,m,g,e,w,h,k,source);else{x.save();flp(x,e,g);x.drawImage(source,g.ix,g.iy,g.dw,g.dh);x.restore()}x.globalCompositeOperation='source-over'}if(e.bw){x.lineWidth=e.bw*2;x.lineJoin='round';x.strokeStyle=e.bc||'#fff';x.stroke()}}else{x.fillStyle=grd(x,e.g,0,0,w,h);x.fill()}}
 else{if(e.bg){P();x.fillStyle=e.bg;x.fill()}
  if(e.ts>0){const[r,g,b]=rgb(e.tc||'#000000');x.shadowColor=`rgba(${r},${g},${b},${Math.min(1,e.ts)})`;x.shadowBlur=(e.tblur??6)*k;x.shadowOffsetY=2*k}
  x.font=`${e.wt} ${e.fs}px ${FAM[e.f]}`;x.fillStyle=e.c;x.textBaseline='middle';x.textAlign=e.a;if('letterSpacing' in x)x.letterSpacing=e.ls*e.fs+'px';
  const L=wrap(x,e.text,w),lh=e.fs*e.lh,bh=L.length*lh,y0=e.v==='c'?(h-bh)/2:e.v==='e'?h-bh:0,px=e.a==='center'?w/2:e.a==='right'?w:0;L.forEach((t,i)=>x.fillText(t,px,y0+lh*(i+.5)));x.shadowColor='transparent';x.shadowBlur=0;x.shadowOffsetY=0}
 x.restore()}
function draw(i,s,c){const{W,H,n}=doc;if(!c){c=document.createElement('canvas');c.width=Math.round(W*s);c.height=Math.round(H*s)}const x=c.getContext('2d');x.setTransform(1,0,0,1,0,0);x.clearRect(0,0,c.width,c.height);x.imageSmoothingQuality='high';x.scale(c.width/W,c.height/H);x.translate(-i*W,0);
 if(doc.mbg){x.fillStyle=grd(x,doc.mbg,0,0,n*W,H);x.fillRect(0,0,n*W,H)}else{x.fillStyle=grd(x,doc.bg[i]||'#fff',i*W,0,W,H);x.fillRect(i*W,0,W,H)}
 doc.els.forEach(e=>{const cx=e.x+e.w/2,r=Math.hypot(e.w,e.h)/2;if(cx+r<i*W||cx-r>(i+1)*W)return;drawEl(x,e,c.width/W)});return c}
const slug=s=>(s||'carousel').toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'')||'carousel';
let xsel=new Set(),xbusy=false;
const canvasBlob=(c,type='image/png',q)=>new Promise((resolve,reject)=>c.toBlob(blob=>blob?resolve(blob):reject(new Error('The browser could not render this slide. Try a smaller export size.')),type,q));
/* export formats: PNG lossless, JPG/WebP smaller, PDF one multi-page file (LinkedIn document carousels) */
const XFMT=[['png','PNG','image/png','png'],['jpg','JPG','image/jpeg','jpg'],['webp','WebP','image/webp','webp'],['pdf','PDF','application/pdf','pdf']];
let xsz=(()=>{try{return localStorage.getItem('cs.xsz')||'best'}catch(_){return 'best'}})(),xopts=[];
let xfmt=(()=>{try{const v=localStorage.getItem('cs.xfmt');return XFMT.some(f=>f[0]===v)?v:'png'}catch(_){return 'png'}})(),xqual=(()=>{try{return Math.min(100,Math.max(60,+localStorage.getItem('cs.xqual')||95))}catch(_){return 95}})();
const xPrefs=()=>{try{localStorage.setItem('cs.xfmt',xfmt);localStorage.setItem('cs.xqual',String(xqual));localStorage.setItem('cs.xsz',xsz)}catch(_){}};
// JPG, WebP and PDF have no transparency: flatten onto white so empty areas don't turn black
function flatten(c){const o=document.createElement('canvas');o.width=c.width;o.height=c.height;const x=o.getContext('2d');x.fillStyle='#fff';x.fillRect(0,0,o.width,o.height);x.drawImage(c,0,0);return o}
async function slideBlob(i,scale,fmt=xfmt){const f=XFMT.find(v=>v[0]===fmt),c=draw(i,scale);try{if(fmt==='png')return await canvasBlob(c);const o=flatten(c);try{return await canvasBlob(o,fmt==='webp'?'image/webp':'image/jpeg',xqual/100)}finally{o.width=o.height=0}}finally{c.width=c.height=0}}
async function makePdf(pages,W,H){const enc=new TextEncoder(),parts=[],off=[];let len=0;const put=x=>{const b=typeof x==='string'?enc.encode(x):x;parts.push(b);len+=b.length},
  obj=(id,f)=>{off[id]=len;put(id+' 0 obj\n');f();put('\nendobj\n')},n=pages.length,kids=pages.map((_,i)=>3+i*3);
 put('%PDF-1.4\n%\u00e2\u00e3\u00cf\u00d3\n');obj(1,()=>put('<</Type/Catalog/Pages 2 0 R>>'));obj(2,()=>put(`<</Type/Pages/Count ${n}/Kids[${kids.map(k=>k+' 0 R').join(' ')}]>>`));
 pages.forEach((pg,i)=>{const id=kids[i],cs=`q ${W} 0 0 ${H} 0 0 cm /Im0 Do Q`;
  obj(id,()=>put(`<</Type/Page/Parent 2 0 R/MediaBox[0 0 ${W} ${H}]/Resources<</XObject<</Im0 ${id+2} 0 R>>>>/Contents ${id+1} 0 R>>`));
  obj(id+1,()=>put(`<</Length ${cs.length}>>\nstream\n${cs}\nendstream`));
  obj(id+2,()=>{put(`<</Type/XObject/Subtype/Image/Width ${pg.w}/Height ${pg.h}/ColorSpace/DeviceRGB/BitsPerComponent 8/Filter/DCTDecode/Length ${pg.bytes.length}>>\nstream\n`);put(pg.bytes);put('\nendstream')})});
 const size=3+n*3,xs=len;put(`xref\n0 ${size}\n0000000000 65535 f \n`);for(let id=1;id<size;id++)put(String(off[id]).padStart(10,'0')+' 00000 n \n');
 put(`trailer\n<</Size ${size}/Root 1 0 R>>\nstartxref\n${xs}\n%%EOF`);return new Blob(parts,{type:'application/pdf'})}
async function buildExport(indices,scale,onRow){const nm=slug(doc.name),files=[];
 if(xfmt==='pdf'){const pages=[];for(let n=0;n<indices.length;n++){onRow(indices[n],'Rendering');const c=draw(indices[n],scale),o=flatten(c);try{pages.push({w:o.width,h:o.height,bytes:new Uint8Array(await (await canvasBlob(o,'image/jpeg',xqual/100)).arrayBuffer())})}finally{c.width=c.height=o.width=o.height=0}onRow(indices[n],'Added')}
  files.push(new File([await makePdf(pages,doc.W,doc.H)],`${nm}.pdf`,{type:'application/pdf'}));return files}
 const f=XFMT.find(v=>v[0]===xfmt);for(let n=0;n<indices.length;n++){const i=indices[n];onRow(i,'Rendering');const b=await slideBlob(i,scale);files.push(new File([b],`${nm}-${String(i+1).padStart(2,'0')}.${f[3]}`,{type:f[2]}));onRow(i,'Ready')}return files}
const canShareFiles=()=>{try{return !!navigator.canShare&&navigator.canShare({files:[new File([new Blob(['x'],{type:'image/png'})],'t.png',{type:'image/png'})]})}catch(_){return false}};
function needsSlideSplit(){if(doc.mbg||Object.keys(doc.lg||{}).length)return true;return doc.els.some(e=>{const a=e.r*Math.PI/180,hw=(Math.abs(Math.cos(a))*e.w+Math.abs(Math.sin(a))*e.h)/2,left=e.x+e.w/2-hw,right=e.x+e.w/2+hw;return Array.from({length:doc.n-1},(_,i)=>(i+1)*doc.W).some(x=>left<x&&right>x)})}
let reorderBusy=false;
async function reorderSlides(from,to){if(reorderBusy||from===to||from<0||to<0||from>=doc.n||to>=doc.n)return;const split=needsSlideSplit();if(split&&!confirm('This design uses content shared across slides. To preserve its appearance, reordering will turn each slide into a separate image that you can adjust afterward. Continue?'))return;reorderBusy=true;
 try{if(split){$('ed').classList.add('reordering');const layers=[];for(let i=0;i<doc.n;i++){const canvas=draw(i,1);let blob;try{blob=await canvasBlob(canvas)}finally{canvas.width=canvas.height=0}const k=await load(new File([blob],`slide-${i+1}.png`,{type:'image/png'}));if(!k)throw new Error('A slide could not be converted to an image.');layers.push({type:'img',id:nid(),r:0,o:1,rd:0,x:i*doc.W,y:0,w:doc.W,h:doc.H,g:PH,k,s:1,ox:0,oy:0})}
  doc.els=layers;doc.bg=Array(doc.n).fill('#ffffff');doc.mbg='';doc.lg={};sel=null;cropId=null}
  const order=Array.from({length:doc.n},(_,i)=>i),[moved]=order.splice(from,1);order.splice(to,0,moved);const next=Array(doc.n);order.forEach((oldIndex,newIndex)=>{next[oldIndex]=newIndex});doc.els.forEach(e=>{const old=SL(e);e.x+=(next[old]-old)*doc.W});doc.bg=order.map(i=>(doc.bg||[])[i]||'#ffffff');cur=next[cur];commit();render();panel();goSlide(cur,1);toast(split?'Slides reordered as separate images.':'Slides reordered.')}
 catch(error){toast(`Couldn’t reorder slides: ${error instanceof Error?error.message:'unexpected error'}`)}
 finally{reorderBusy=false;$('ed').classList.remove('reordering')}}
function downloadBlob(blob,name){const url=URL.createObjectURL(blob),a=document.createElement('a');a.href=url;a.download=name;a.style.display='none';document.body.append(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),60_000)}
const XDESC={png:['Best quality','Lossless, keeps transparency'],jpg:['Small files','Photos · great at 90%+'],webp:['Smallest','Modern web format'],pdf:['One document','LinkedIn carousel']};
const xScale=()=>(xopts.find(o=>o.k===xsz)||xopts[0]).s;
const xMB=b=>b>=1e6?(b/1e6).toFixed(1)+' MB':Math.max(1,Math.round(b/1e3))+' KB';
// rough per-file estimate so the choice is informed before exporting
function xEst(){const px=doc.W*doc.H*xScale()**2,q=xqual/100,bpp={png:1.3,jpg:.04+.26*q**6,webp:.025+.15*q**6,pdf:.04+.26*q**6}[xfmt];return px*bpp}
function syncExportSelection(){const count=xsel.size,all=count===doc.n,f=XFMT.find(v=>v[0]===xfmt),s=xScale(),W=Math.round(doc.W*s),H=Math.round(doc.H*s);
 document.querySelectorAll('#xpick [data-slide]').forEach(b=>{const i=+b.dataset.slide,on=xsel.has(i);b.disabled=xbusy;b.setAttribute('aria-pressed',String(on));b.setAttribute('aria-label',`Slide ${i+1}, ${on?'selected':'not selected'}`)});
 $('xcount').textContent=`${count} of ${doc.n} selected`;const t=$('xtoggle');t.textContent=all?'Deselect all':'Select all';t.disabled=xbusy;
 const pdf=xfmt==='pdf',files=pdf?(count?1:0):count,est=xEst()*(pdf?count:1);
 $('xsumb').textContent=count?(pdf?`1 PDF · ${count} page${count===1?'':'s'}`:`${count} ${f[1]} file${count===1?'':'s'}`):'No slides selected';
 $('xsums').textContent=count?`${W} × ${H} px · ≈ ${xMB(est)}${pdf?'':' each'}`:'Pick at least one slide';
 const d=$('xdownload');d.disabled=!count||xbusy;if(!xbusy)d.innerHTML=`${ic('download')}<span>${!count?'Download':pdf?'Download PDF':count===1?`Download ${f[1]}`:`Download ${count} ${f[1]}s`}</span>`;
 const sh=$('xshare');if(sh)sh.disabled=!count||xbusy;
 document.querySelectorAll('#xfmts [data-f],#xsizes [data-z]').forEach(b=>b.disabled=xbusy)}
async function exportSelection(share=false){if(xbusy||!xsel.size)return;xbusy=true;syncExportSelection();const indices=[...xsel].sort((a,b)=>a-b),scale=xScale(),status=$('xstatus'),f=XFMT.find(v=>v[0]===xfmt),pdf=xfmt==='pdf',d=$('xdownload'),lab=t=>{d.innerHTML=`<span>${t}</span>`};
 const setStatus=(m,bad)=>{status.textContent=m;status.classList.toggle('bad',!!bad)},tile=i=>document.querySelector(`#xpick [data-slide="${i}"]`);let doneN=0;
 const row=(i,t)=>{const b=tile(i);if(!b)return;if(t==='Rendering'){b.dataset.st='busy';b.scrollIntoView({block:'nearest',inline:'nearest',behavior:'smooth'})}else{b.dataset.st='done';doneN++;d.style.setProperty('--xp',`${doneN/indices.length*100}%`);lab(`Preparing ${doneN}/${indices.length}`)}};
 indices.forEach(i=>{const b=tile(i);if(b)b.dataset.st='wait'});lab('Preparing…');
 try{await document.fonts.ready;setStatus('');
  const files=await buildExport(indices,scale,row);
  if(share){try{await navigator.share({files,title:doc.name||'Carousel'});setStatus('Shared.');toast('Shared')}catch(err){if(err?.name==='AbortError')setStatus('Share cancelled.');else throw err}}
  else{for(let n=0;n<files.length;n++){downloadBlob(files[n],files[n].name);if(n<files.length-1)await new Promise(r=>setTimeout(r,300))}
   const size=files.reduce((a,b)=>a+b.size,0),msg=pdf?`PDF with ${indices.length} page${indices.length>1?'s':''} saved · ${xMB(size)}`:`${files.length} ${f[1]}${files.length>1?'s':''} saved · ${xMB(size)}`;setStatus(msg+(files.length>1?'. If asked, allow multiple downloads.':''));toast(msg)}
 }catch(error){const message=error instanceof Error?error.message:'An unexpected export error occurred.';setStatus(`Export failed: ${message}`,true);toast(`Export failed: ${message}`)}
 finally{xbusy=false;d.style.removeProperty('--xp');setTimeout(()=>document.querySelectorAll('#xpick [data-st]').forEach(b=>delete b.dataset.st),1400);syncExportSelection()}
}
function xHint(){const many=xsel.size!==1,h=$('xhint');h.textContent={png:`Pixel-perfect and lossless${many?' — each slide is its own file':''}. Best for Instagram and further editing.`,jpg:`Much smaller ${many?'files':'file'} with no visible difference at 90%+. Transparent areas turn white.`,webp:'Smallest size at the same visual quality. Not every app accepts WebP uploads.',pdf:'All selected slides in one PDF, one page each. Upload to LinkedIn as a document carousel.'}[xfmt]+(h.dataset.x||'');
 document.querySelectorAll('#xfmts [data-f]').forEach(b=>b.setAttribute('aria-checked',String(b.dataset.f===xfmt)));document.querySelectorAll('#xsizes [data-z]').forEach(b=>b.setAttribute('aria-checked',String(b.dataset.z===xsz)));
 $('xqbox').hidden=xfmt==='png';$('xqv').textContent=xqual+'%';syncExportSelection()}

$('ex').onclick=()=>{const images=doc.els.filter(e=>e.type==='img'&&e.k),need=Math.max(1,...images.map(e=>{const m=IMG.get(e.k);return 1/(Math.max(e.w/m.nw,e.h/m.nh)*e.s)})),cap=Math.sqrt(CAP/(doc.W*doc.H)),auto=Math.min(need,cap),empty=doc.els.filter(e=>e.type==='img'&&!e.k).length,D=s=>`${Math.round(doc.W*s)} × ${Math.round(doc.H*s)} px`,limit=need>cap;
 xa=auto;xsel=new Set(Array.from({length:doc.n},(_,i)=>i));
 xopts=[{k:'1',s:1,l:'Standard',d:'Designed size, fastest upload'}];if(cap>=2)xopts.push({k:'2',s:2,l:'High · 2×',d:'Crisp on retina screens'});
 if(auto>1.01&&Math.abs(auto-2)>.05)xopts.push({k:'best',s:auto,l:'Maximum',d:'Keeps the full detail of your photos',r:1});else{const top=xopts[xopts.length-1];top.r=1;if(xsz==='best')xsz=top.k}
 if(!xopts.some(o=>o.k===xsz))xsz=xopts.find(o=>o.r).k;
 const hdr=`${doc.n} slide${doc.n>1?'s':''} · ${doc.W} × ${doc.H} px`;
 $('xb').className='xp';
 $('xb').innerHTML=`<div class="xhead"><span class="xi">${ic('download')}</span><div><h2 id="xtitle">Export</h2><p>${String(doc.name||'Untitled').replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'})[c])} · ${hdr}</p></div><button class="ic" data-x="close" aria-label="Close export">${ic('x')}</button></div>
 <div class="xbody"><section class="xleft" aria-labelledby="xslh"><div class="xlbl"><h3 id="xslh">Slides <small id="xcount"></small></h3><button type="button" class="xtg" id="xtoggle"></button></div>
  <div class="xgrid" id="xpick" role="group" aria-label="Select slides to export"></div></section>
 <section class="xright" aria-label="Export settings">
  <div><div class="xlbl"><h3>File type</h3></div><div class="xfmts" id="xfmts" role="radiogroup" aria-label="File type">${XFMT.map(([k,l])=>`<button type="button" role="radio" data-f="${k}" aria-checked="${k===xfmt}"><b>${l}</b><span>${XDESC[k][0]}</span>${k==='png'?'<em>Best</em>':''}</button>`).join('')}</div></div>
  <div><div class="xlbl"><h3>Size</h3></div><div class="xsizes" id="xsizes" role="radiogroup" aria-label="Export size">${xopts.map(o=>`<button type="button" role="radio" data-z="${o.k}" title="${o.d}" aria-checked="${o.k===xsz}"><i></i><span><b>${o.l}</b><small>${D(o.s)}</small></span>${o.r?'<em>Recommended</em>':''}</button>`).join('')}</div></div>
  <div class="xqual" id="xqbox"><div><h3 style="margin:0;font:600 13px var(--sf)">Quality</h3><input type="range" id="xqq" min="60" max="100" step="1" value="${xqual}" aria-label="Compression quality"><output id="xqv"></output></div><small><span>Smaller file</span><span>Sharper</span></small></div>
  <p class="xnote">${ic('info')}<span id="xhint" data-x="${limit?` Size is capped at ${D(cap)} to keep your browser stable.`:''}${empty?` ${empty} empty photo frame${empty>1?'s':''} will export as placeholder${empty>1?'s':''}.`:''}"></span></p>
  <p class="xstatus" id="xstatus" role="status" aria-live="polite"></p>
 </section></div>
 <div class="xfoot"><div class="xsum"><b id="xsumb"></b><small id="xsums"></small></div><div class="bt">${canShareFiles()?`<button class="ib" id="xshare" type="button">${ic('share')}<span>Share</span></button>`:''}<button class="ib pri" id="xdownload" type="button"></button></div></div>`;
 const grid=$('xpick'),thumbScale=Math.min(240/doc.W,240/doc.H);
 for(let i=0;i<doc.n;i++){const b=document.createElement('button');b.type='button';b.className='xsel';b.dataset.slide=String(i);const shot=document.createElement('span');shot.className='xshot';shot.style.setProperty('--xar',`${doc.W} / ${doc.H}`);const canvas=draw(i,thumbScale),number=document.createElement('span');number.className='xnum';number.textContent=String(i+1);const check=document.createElement('span');check.className='xcheck';check.setAttribute('aria-hidden','true');check.innerHTML=ic('check');shot.append(canvas,number,check);b.append(shot);grid.append(b)}
 $('xs').classList.add('on');xHint();setTimeout(()=>$('xdownload').focus({preventScroll:true}),60)};
$('xb').addEventListener('click',ev=>{if(!$('xb').classList.contains('xp'))return;const slide=ev.target.closest('#xpick [data-slide]');if(slide&&!xbusy){const i=+slide.dataset.slide;xsel.has(i)?xsel.delete(i):xsel.add(i);xHint();return}const b=ev.target.closest('[data-x]');if(b){if(b.dataset.x==='close'&&!xbusy)$('xs').classList.remove('on');return}
 const t=ev.target.closest('button');if(!t||xbusy&&t.id!=='xdownload')return;
 if(t.id==='xtoggle'){xsel=xsel.size===doc.n?new Set():new Set(Array.from({length:doc.n},(_,i)=>i));xHint()}
 else if(t.id==='xdownload')exportSelection();else if(t.id==='xshare')exportSelection(true);
 else if(t.dataset.f){xfmt=t.dataset.f;xPrefs();xHint()}else if(t.dataset.z){xsz=t.dataset.z;xPrefs();xHint()}});
$('xb').addEventListener('input',ev=>{if(ev.target.id==='xqq'){xqual=+ev.target.value;$('xqv').textContent=xqual+'%';xPrefs();syncExportSelection()}});
$('xb').addEventListener('keydown',ev=>{const f=ev.target.closest?.('#xfmt [data-f]');if(!f||!/^Arrow(Left|Right)$/.test(ev.key))return;ev.preventDefault();const i=XFMT.findIndex(v=>v[0]===xfmt),j=(i+(ev.key==='ArrowRight'?1:XFMT.length-1))%XFMT.length;xfmt=XFMT[j][0];xPrefs();xHint();$('xfmt').querySelector(`[data-f="${xfmt}"]`).focus()});
$('xs').addEventListener('click',ev=>{if(ev.target.id==='xs'&&!xbusy)$('xs').classList.remove('on')});
/* ===== history: autosave to IndexedDB (originals stored untouched) ===== */
const DBp=new Promise(res=>{try{const r=indexedDB.open('carousel-studio',1);r.onupgradeneeded=()=>{r.result.createObjectStore('p',{keyPath:'id'});r.result.createObjectStore('b')};r.onsuccess=()=>{DBok=true;res(r.result)};r.onerror=r.onblocked=()=>res(null)}catch(e){res(null)}});
const idb=(s,m,f)=>DBp.then(d=>d?new Promise(res=>{try{const t=d.transaction(s,m),r=f(t.objectStore(s));t.oncomplete=()=>res(r&&r.result);t.onerror=t.onabort=()=>res(null)}catch(e){res(null)}}):null);
function saveSoon(){if(!doc||!pid||!DBok)return;clearTimeout(saveT);$('sv').textContent='Saving…';saveT=setTimeout(saveProj,700)}
async function saveProj(){clearTimeout(saveT);if(!doc||!pid||!DBok)return;const imgs={};
 doc.els.forEach(e=>{const m=e.k&&IMG.get(e.k);if(m)imgs[e.k]={name:m.name,type:m.file&&m.file.type,size:m.size}});
 for(const k in imgs){const key=pid+'|'+k;if(!saved[key]){await idb('b','readwrite',s=>s.put(IMG.get(k).file,key));saved[key]=1}}
 let thumb='';try{const c=draw(0,240/doc.W);thumb=c.toDataURL('image/jpeg',.72);c.width=c.height=0}catch(_){}
 const tm=Date.now();doc.created=doc.created||tm;await idb('p','readwrite',s=>s.put({id:pid,name:doc.name||'Untitled carousel',updated:tm,created:doc.created,n:doc.n,H:doc.H,previewTarget:doc.previewTarget,doc:JSON.stringify(doc),imgs,thumb}));$('sv')&&($('sv').textContent='Saved')}
async function openProj(id){const r=await idb('p','readonly',s=>s.get(id));if(!r)return toast('Couldn’t open that project');toast('Opening…');const d=JSON.parse(r.doc);
 for(const k in r.imgs){if(IMG.has(k))continue;const f=await idb('b','readonly',s=>s.get(id+'|'+k));if(f)await load(f,k)}
 d.els.forEach(e=>{if(e.k&&!IMG.has(e.k))e.k=null});startEd(d,id);Object.keys(r.imgs).forEach(k=>saved[id+'|'+k]=1);$('sv')&&($('sv').textContent='Saved')}
/* import another draft's slides: scale to fit this canvas (centred), copy photo blobs, append at the end */
let impL=null,impBusy=false;const AR_OF={1350:'4/5',1080:'1/1',1920:'9/16'};
async function impLoad(){const L=(await idb('p','readonly',s=>s.getAll()))||[];impL=L.filter(p=>p.id!==pid).sort((a,b)=>b.updated-a.updated);if(mode==='imp')panel()}
async function importDraft(id){if(impBusy)return;const r=await idb('p','readonly',s=>s.get(id));if(!r)return toast('Couldn’t open that draft');
 impBusy=true;panel();toast('Importing…');
 try{const d=JSON.parse(r.doc),W=doc.W,s=Math.min(1,doc.H/d.H),ox=(W-W*s)/2,oy=(doc.H-d.H*s)/2,at=doc.n,sc=v=>typeof v==='number'?v*s:v;
  for(const k in r.imgs){if(IMG.has(k))continue;const f=await idb('b','readonly',q=>q.get(id+'|'+k));if(f)await load(f,k)}
  const els=d.els.map(e=>{const i=Math.max(0,Math.min(d.n-1,Math.floor(e.x/W))),n={...e,id:nid(),x:(at+i)*W+(e.x-i*W)*s+ox,y:e.y*s+oy,w:e.w*s,h:e.h*s};
   ['fs','rd','tblur','lt'].forEach(k=>{if(k in n)n[k]=sc(n[k])});if(n.type!=='draw'&&'bw' in n)n.bw=sc(n.bw);if(n.k&&!IMG.has(n.k))n.k=null;return n});
  const bg=Array.from({length:d.n},(_,i)=>d.mbg||d.bg[i]||'#ffffff');
  doc.els.push(...els);doc.bg.push(...bg);doc.n+=d.n;cur=at;sel=null;multi.clear();mode='slide';
  commit();render();panel();fsRender();goSlide(at);toast(`Added ${d.n} slide${d.n>1?'s':''} from “${r.name||'Untitled'}”${s<1||d.H<doc.H?' · fitted to this size':''}`)}
 catch(_){toast('Couldn’t import that draft')}finally{impBusy=false}}
const ago=tm=>{const s=(Date.now()-tm)/1e3;return s<60?'Just now':s<3600?Math.floor(s/60)+' min ago':s<86400?Math.floor(s/3600)+' h ago':s<172800?'Yesterday':new Date(tm).toLocaleDateString(undefined,{month:'short',day:'numeric'})};
async function recents(){const L=await idb('p','readonly',s=>s.getAll());$('rcs').hidden=false;if(!L||!L.length){$('rcn').textContent='';$('rec').innerHTML=`<p class="rempty">${DBok?'Your drafts appear here automatically as you edit.':'Drafts can’t be saved in this browser view, so use Back up after editing.'}</p>`;return}L.sort((a,b)=>b.updated-a.updated);$('rcn').textContent=`${L.length} saved`;
 $('rec').innerHTML=L.slice(0,14).map(p=>`<div class="rc"><button class="rcm" data-open="${p.id}">${p.thumb?`<img src="${p.thumb}" alt="">`:'<div class="ph0"></div>'}<b>${esc(p.name)}</b><small>${ago(p.updated)} · ${p.n} slide${p.n>1?'s':''} · ${esc(previewTargetName(p.previewTarget||'default'))}</small></button><button class="rcx" data-del="${p.id}" aria-label="Delete ${esc(p.name)}">×</button></div>`).join('')}
$('rcs').addEventListener('click',async e=>{const o=e.target.closest('[data-open]'),x=e.target.closest('[data-del]');if(o)openProj(o.dataset.open);
 if(x){const id=x.dataset.del,r=await idb('p','readonly',s=>s.get(id));if(r)for(const k in r.imgs)await idb('b','readwrite',s=>s.delete(id+'|'+k));await idb('p','readwrite',s=>s.delete(id));recents();toast('Removed from recents')}});
listen(window,'pagehide',()=>{if(doc&&hi>0)saveProj()});listen(document,'visibilitychange',syncVideoPlayback);

/* ===== platform previews ===== */
let pvIndex=0;
function openPv(){if(!doc)return;const target=PREVIEW_TARGETS.some(([k])=>k===doc.previewTarget)?doc.previewTarget:'default',sto=target==='instagram'&&doc.H===1920,U=doc.user||'yourhandle',n=doc.n,CP=doc.cap||'A little moment worth remembering. #photodump #weekend',
 sl=Array.from({length:n},(_,i)=>`<div class="psl" data-i="${i}"></div>`).join(''),dots=Array.from({length:n},(_,i)=>`<button class="pdot${i?'':' on'}" type="button" data-pv-slide="${i}" aria-label="Go to slide ${i+1}"${i?'':' aria-current="true"'}></button>`).join(''),
 av=`<div class="av"><i>${esc(U.charAt(0).toUpperCase())}</i></div>`,carousel=`<div class="car" id="car">${sl}</div>`;
 $('pvtitle').textContent=previewTargetName(target);$('pvtarget').innerHTML=PREVIEW_TARGETS.map(([k,label])=>`<option value="${k}">${label}</option>`).join('');$('pvtarget').value=target;
 $('pvt').hidden=!(target==='facebook'||target==='instagram'&&!sto);
 if(target==='instagram'&&sto)$('pvs').innerHTML=`<div class="ig story dk"><div class="stg">${carousel}<div class="prog">${Array.from({length:n},(_,i)=>`<button class="progdot" type="button" data-pv-slide="${i}" aria-label="Go to slide ${i+1}"><i><b></b></i></button>`).join('')}</div><header class="shd">${av}<b>${esc(U)}</b> <small>2h</small></header><div class="rpl">Send message</div><button class="tl" data-go="-1" aria-label="Previous"></button><button class="tr" data-go="1" aria-label="Next"></button></div></div>`;
 else if(target==='instagram')$('pvs').innerHTML=`<div class="ig${pvDark?' dk':''}"><div class="sk"></div><article class="post"><header>${av}<div class="un"><b contenteditable="true" spellcheck="false" data-pv="user">${esc(U)}</b><small>Your location</small></div>${ic('more')}</header><div class="media">${carousel}<span class="cnt" id="pcnt">1/${n}</span><div class="heart" id="hrt">${ic('heart')}</div></div><div class="acts"><div><button class="lk" id="plk" aria-label="Like" style="border:0;background:none;color:inherit;padding:0">${ic('heart')}</button>${ic('comment')}${ic('send')}</div><div class="dots" id="pdots">${dots}</div><div>${ic('save')}</div></div><div class="lkc"><b id="plc">1,284 likes</b></div><div class="cp"><b>${esc(U)}</b> <span contenteditable="true" spellcheck="false" data-pv="cap">${esc(CP)}</span></div><div class="cm">View all 42 comments</div><div class="tm">2 hours ago</div></article><div class="sk"></div></div>`;
 else if(target==='facebook')$('pvs').innerHTML=`<div class="target-preview facebook-preview${pvDark?' dk':''}"><article class="target-preview__card"><header class="mock-head"><span class="mock-avatar">${esc(U.charAt(0).toUpperCase())}</span><div><b contenteditable="true" spellcheck="false" data-pv="user">${esc(U)}</b><small>Suggested post · 2h</small></div>${ic('more')}</header><div class="target-preview__carousel">${carousel}</div><div class="target-preview__dots" id="pdots">${dots}</div><div class="mock-actions">👍 1.2K · 48 comments · 12 shares</div><div class="mock-caption"><b>${esc(U)}</b> <span contenteditable="true" spellcheck="false" data-pv="cap">${esc(CP)}</span></div></article></div>`;
 else if(target==='mobile-wallpaper')$('pvs').innerHTML=`<div class="target-preview"><div class="wallpaper-stage"><canvas class="wp-bg" id="wpbg" aria-hidden="true"></canvas><div class="phone-shell"><div class="phone-screen">${carousel}<div class="phone-island"></div><div class="wallpaper-time">9:41</div></div></div></div><div class="target-preview__dots" id="pdots">${dots}</div><p class="target-preview__label">Lock screen · swipe or tap a dot to preview slides</p></div>`;
 else if(target==='desktop-wallpaper')$('pvs').innerHTML=`<div class="target-preview"><div class="desktop-shell"><div class="desktop-screen">${carousel}</div></div><div class="desktop-stand"></div><div class="target-preview__dots" id="pdots">${dots}</div><p class="target-preview__label">Desktop wallpaper · swipe or tap a dot to preview slides</p></div>`;
 else $('pvs').innerHTML=`<div class="target-preview default-preview"><div class="target-preview__card"><div class="target-preview__carousel">${carousel}</div><div class="target-preview__dots" id="pdots">${dots}</div></div><p class="target-preview__label">Default canvas preview · swipe or tap a dot to browse</p></div>`;
 const s=Math.min(1,900/doc.W);document.querySelectorAll('.psl').forEach(d=>d.append(draw(+d.dataset.i,s)));
 const car=$('car'),upd=()=>{if(!car.clientWidth)return;const i=Math.max(0,Math.min(n-1,Math.round(car.scrollLeft/car.clientWidth)));pvIndex=i;const c=$('pcnt');if(c)c.textContent=(i+1)+'/'+n;document.querySelectorAll('#pdots .pdot').forEach((d,j)=>{d.classList.toggle('on',j===i);if(j===i)d.setAttribute('aria-current','true');else d.removeAttribute('aria-current')});document.querySelectorAll('.prog b').forEach((b,j)=>b.style.width=j<=i?'100%':'0');if(upd.i!==i){upd.i=i;pvAmbient();pvVideos()}};
 $('pv').classList.add('on');syncVideoPlayback();car.addEventListener('scroll',upd,{passive:true});const initial=target.includes('wallpaper')?Math.min(cur,n-1):Math.min(pvIndex,n-1);upd.i=-1;requestAnimationFrame(()=>{car.scrollLeft=initial*car.clientWidth;upd()});$('pvs').scrollTop=sto?0:target==='instagram'?60:0}
function likePost(pop){const k=$('plk'),h=$('hrt');if(!k)return;const on=pop?true:!k.classList.contains('on');k.classList.toggle('on',on);$('plc').textContent=on?'1,285 likes':'1,284 likes';
 if(pop&&h){h.classList.remove('pop');void h.offsetWidth;h.classList.add('pop')}}
$('pvs').addEventListener('click',e=>{const dot=e.target.closest('[data-pv-slide]');if(dot){const c=$('car');c.scrollTo({left:+dot.dataset.pvSlide*c.clientWidth,behavior:'smooth'});return}const g=e.target.closest('[data-go]');if(g){const c=$('car');c.scrollBy({left:g.dataset.go*c.clientWidth,behavior:'smooth'});return}
 if(e.target.closest('#plk'))return likePost(0);if(e.target.closest('.car')&&!e.target.closest('.stg')){const t=Date.now();if(t-(openPv.t||0)<320)likePost(1);openPv.t=t}});
$('pvs').addEventListener('input',e=>{const k=e.target.dataset.pv;if(!k)return;const v=e.target.textContent;if(k==='user'){doc.user=v;document.querySelectorAll('.cp b').forEach(b=>b.textContent=v)}else doc.cap=v;saveSoon()});
$('pvb').onclick=openPv;$('pvex').onclick=()=>$('ex').click();
$('pvx').onclick=()=>{pvSync();$('pv').classList.remove('on');cancelAnimationFrame(pvRaf);syncVideoPlayback()};
/* preview canvases are stills; while a slide with video is showing, play the clip and repaint that slide every frame */
let pvRaf=0;
const pvVids=i=>doc.els.filter(e=>e.type==='img'&&e.k&&IMG.get(e.k)?.type==='video'&&SL(e)===i);
function pvVideos(){cancelAnimationFrame(pvRaf);if(!doc)return;const on=$('pv').classList.contains('on')&&!document.hidden,i=pvIndex,vs=on?pvVids(i):[];
 doc.els.forEach(e=>{if(e.type!=='img'||!e.k||IMG.get(e.k)?.type!=='video')return;const v=NODES.get(e.id)?.querySelector('video');if(v&&!vs.includes(e))v.pause()});
 if(!vs.length)return;
 vs.forEach(e=>{const v=NODES.get(e.id)?.querySelector('video'),m=IMG.get(e.k);if(!v)return;v.muted=true;v.playsInline=true;const a=clipStart(e,m),b=clipEnd(e,m);if(b>a&&(v.currentTime<a||v.currentTime>=b))v.currentTime=a;if(v.paused)v.play().catch(()=>{})});
 const tick=()=>{if(!$('pv').classList.contains('on')||pvIndex!==i)return;
  vs.forEach(e=>{const v=NODES.get(e.id)?.querySelector('video'),m=IMG.get(e.k);if(!v)return;const a=clipStart(e,m),b=clipEnd(e,m);if(b>a&&v.currentTime>=b-.03)v.currentTime=a});
  const c=document.querySelector(`#pvs .psl[data-i="${i}"] canvas`);if(c)draw(i,0,c);pvRaf=requestAnimationFrame(tick)};
 pvRaf=requestAnimationFrame(tick)}
function pvAmbient(){const c=$('wpbg');if(!c||!doc)return;const s=Math.min(.12,160/doc.W);if(c.width!==Math.round(doc.W*s)){c.width=Math.round(doc.W*s);c.height=Math.round(doc.H*s)}draw(pvIndex,s,c)}
listen(document,'visibilitychange',()=>{if($('pv').classList.contains('on'))pvVideos()});
$('pvtarget').onchange=()=>{doc.previewTarget=$('pvtarget').value;commit();pvSync();openPv()};
$('pvt').onclick=()=>{pvDark=!pvDark;document.querySelector('.ig:not(.story)')?.classList.toggle('dk',pvDark);document.querySelector('.facebook-preview')?.classList.toggle('dk',pvDark)};
listen(window,'keydown',e=>{if(e.key==='Escape'&&$('pv').classList.contains('on'))$('pv').classList.remove('on')});

/* ===== tooltips: hover, keyboard focus and touch long-press ===== */
/* ---- select popover: native lists on macOS open centred over the field (even above the window), so desktop gets an anchored menu ---- */
(()=>{const fine=matchMedia('(pointer:fine)');let menu=null,src=null,hi=-1;
 const close=(focus=true)=>{if(!menu)return;menu.remove();menu=null;src.classList.remove('open');src.setAttribute('aria-expanded','false');if(focus)src.focus({preventScroll:true});src=null;removeEventListener('scroll',onScroll,true);removeEventListener('resize',onScroll)},
  onScroll=ev=>{if(menu&&!(ev.target instanceof Node&&menu.contains(ev.target)))close(false)},
  items=()=>[...menu.children],
  light=i=>{const L=items();if(!L.length)return;i=Math.max(0,Math.min(L.length-1,i));while(L[i]?.getAttribute('aria-disabled')==='true'&&i<L.length-1)i++;L.forEach((li,j)=>li.classList.toggle('hi',j===i));hi=i;L[i].scrollIntoView({block:'nearest'})},
  pick=i=>{const o=src.options[i],el=src;close();if(!o||o.disabled||el.selectedIndex===i)return;el.selectedIndex=i;el.dispatchEvent(new Event('input',{bubbles:true}));el.dispatchEvent(new Event('change',{bubbles:true}))},
  open=sel=>{if(menu)close(false);src=sel;hi=sel.selectedIndex;menu=document.createElement('ul');menu.className='selm';menu.setAttribute('role','listbox');
   [...sel.options].forEach((o,i)=>{const li=document.createElement('li');li.setAttribute('role','option');li.textContent=o.textContent;li.setAttribute('aria-selected',i===sel.selectedIndex);if(o.disabled)li.setAttribute('aria-disabled','true');menu.append(li)});
   document.body.append(menu);sel.classList.add('open');sel.setAttribute('aria-expanded','true');
   const r=sel.getBoundingClientRect(),vh=innerHeight,vw=innerWidth,gap=6,below=vh-r.bottom-gap-8,above=r.top-gap-8,up=below<Math.min(menu.scrollHeight,240)&&above>below;
   menu.classList.toggle('up',up);menu.style.minWidth=Math.max(160,r.width)+'px';menu.style.maxHeight=Math.max(120,Math.min(360,up?above:below))+'px';
   const w=menu.offsetWidth;menu.style.left=Math.max(8,Math.min(r.left,vw-w-8))+'px';
   if(up)menu.style.top=Math.max(8,r.top-gap-menu.offsetHeight)+'px';else menu.style.top=r.bottom+gap+'px';
   light(hi<0?0:hi);listen(window,'scroll',onScroll,true);listen(window,'resize',onScroll)};
 listen(document,'mousedown',ev=>{const sel=ev.target.closest?.('select');
  if(menu&&!menu.contains(ev.target)){const was=src;close(false);if(sel===was){ev.preventDefault();return}}
  if(!sel||!fine.matches||sel.multiple||sel.size>1||sel.disabled||ev.button!==0)return;ev.preventDefault();sel.focus({preventScroll:true});open(sel)},true);
 listen(document,'mousemove',ev=>{const li=menu&&ev.target.closest?.('.selm li');if(li){const i=items().indexOf(li);if(i!==hi&&li.getAttribute('aria-disabled')!=='true')light(i)}});
 listen(document,'click',ev=>{const li=menu&&ev.target.closest?.('.selm li');if(li)pick(items().indexOf(li))});
 listen(document,'keydown',ev=>{
  if(menu){const k=ev.key;if(k==='Escape'||k==='Tab'){ev.preventDefault();ev.stopPropagation();close(k==='Escape')}
   else if(k==='ArrowDown'||k==='ArrowUp'){ev.preventDefault();ev.stopPropagation();let i=hi+(k==='ArrowDown'?1:-1);const L=items();while(L[i]?.getAttribute('aria-disabled')==='true')i+=k==='ArrowDown'?1:-1;if(L[i])light(i)}
   else if(k==='Home'||k==='End'){ev.preventDefault();light(k==='Home'?0:items().length-1)}
   else if(k==='Enter'||k===' '){ev.preventDefault();ev.stopPropagation();pick(hi)}
   else if(k.length===1){const L=items(),c=k.toLowerCase(),n=L.length;for(let j=1;j<=n;j++){const t=(hi+j)%n;if(L[t].textContent.trim().toLowerCase().startsWith(c)){light(t);break}}}
   return}
  const sel=ev.target.closest?.('select');if(sel&&fine.matches&&(ev.key==='Enter'||ev.key===' '||(ev.altKey&&ev.key==='ArrowDown'))){ev.preventDefault();ev.stopPropagation();open(sel)}},true);
 listen(window,'blur',()=>close(false))})();
const tipEl=$('tip'),TS='[data-tip],.ib.ico,.ic,.tb,.ft,.zb .ib';let tipT=0,lpT=0;
const tipTxt=n=>n.dataset.tip||n.getAttribute('aria-label')||'';
function showTip(n){const s=tipTxt(n);if(!s)return;tipEl.textContent=s;tipEl.classList.add('on');const r=n.getBoundingClientRect(),w=tipEl.offsetWidth,h=tipEl.offsetHeight,side=n.closest('#bar')&&innerWidth>=900;
 let x=side?r.right+10:r.left+r.width/2-w/2,y=side?r.top+r.height/2-h/2:r.top-h-10;if(y<6)y=r.bottom+10;x=Math.max(8,Math.min(innerWidth-w-8,x));tipEl.style.left=x+'px';tipEl.style.top=y+'px'}
const hideTip=()=>{clearTimeout(tipT);tipEl.classList.remove('on')};
listen(document,'pointerover',e=>{if(e.pointerType!=='mouse'||Date.now()-lastTouch<1200)return;const n=e.target.closest(TS);clearTimeout(tipT);if(n&&tipTxt(n)){if(tipEl.classList.contains('on'))showTip(n);else tipT=setTimeout(()=>showTip(n),60)}else hideTip()});
listen(document,'pointerdown',e=>{if(e.pointerType==='touch')lastTouch=Date.now();if(Date.now()-lpAt<500)return;hideTip();if(e.pointerType!=='touch')return;const n=e.target.closest(TS);clearTimeout(lpT);if(n&&tipTxt(n))lpT=setTimeout(()=>{showTip(n);lpAt=Date.now();setTimeout(hideTip,2000)},350)},true);
['pointerup','pointercancel'].forEach(k=>listen(document,k,()=>clearTimeout(lpT),true));
listen(document,'scroll',hideTip,true);listen(document,'focusin',e=>{const n=e.target.closest&&e.target.closest(TS);if(n&&e.target.matches(':focus-visible'))showTip(n)});listen(document,'focusout',hideTip);

/* ===== template preview + new-canvas chooser ===== */
function openTs(id){const t=TPL.find(x=>x.id===id);if(!t)return;const n=t.m||t.S.length;
 $('tsb').innerHTML=`<div class="tsh"><div><h2>${t.name}</h2><p>${ARN[t.ar]} · ${t.p?t.p+(t.p>1?' photos':' photo'):'Text only'} · ${n} slide${n>1?'s':''}</p></div><button class="ic" id="tsx" aria-label="Close preview" data-tip="Close">${ic('x')}</button></div><div class="strip big${t.m?' seam':''}" style="--ar:${t.ar};--b:${t.m?'33.33%':t.ar==='9/16'?'38%':'58%'}">${slides(t)}</div><p class="hint">Swipe to see every slide. The grey frames are photo placeholders you replace in the editor.</p><div class="bt"><button class="use" data-id="${t.id}" id="tsu">Use this template</button></div>`;$('ts').classList.add('on')}
$('ts').addEventListener('click',e=>{if(e.target.id==='ts'||e.target.closest('#tsx'))return $('ts').classList.remove('on');const u=e.target.closest('#tsu');if(u){$('ts').classList.remove('on');openEd(TPL.find(x=>x.id===u.dataset.id))}});
let nbAr='4/5';
const MG=[G.sea,G.sun,G.forest,G.dusk,G.rose,G.peak];
function miniLay(n,ar){const[aw,ah]=ar.split('/').map(Number),W=100,H=100*ah/aw,fb=n==='Full bleed',m=fb?0:6,g=fb?0:2.4,bw=W-2*m,bh=H-2*m;
 return `<div class="mini" style="aspect-ratio:${ar}">${LAYS[n].map((r,i)=>{const x=m+r[0]*(bw+g),y=m+r[1]*(bh+g),w=r[2]*(bw+g)-g,h=r[3]*(bh+g)-g,c=MG[i%MG.length];return `<i style="left:${x/W*100}%;top:${y/H*100}%;width:${w/W*100}%;height:${h/H*100}%;background:linear-gradient(160deg,${c[0]},${c[1]})"></i>`}).join('')}</div>`}
function nbGrid(){$('nbg').innerHTML=`<button class="nlc" data-nl="" aria-label="Blank canvas"><div class="mini blank" style="aspect-ratio:${nbAr}"></div><small>Blank</small></button>`+Object.keys(LAYS).map(n=>`<button class="nlc" data-nl="${n}" aria-label="${n}">${miniLay(n,nbAr)}<small>${n}</small></button>`).join('')}
function openNb(){$('nbb').innerHTML=`<h3 style="margin:0 0 10px">New carousel</h3><div class="segc" id="nbr">${Object.entries(ARN).map(([k,v])=>`<button data-nr="${k}" aria-pressed="${nbAr===k}">${v}</button>`).join('')}</div><p class="hint">Pick a starting layout. You can change the gaps and nest collages inside any frame later.</p><div class="nbl" id="nbg"></div><div class="bt"><button class="ib" data-nx="1">Cancel</button></div>`;nbGrid();$('nbs').classList.add('on')}
$('nbs').addEventListener('click',e=>{if(e.target.id==='nbs'||e.target.closest('[data-nx]'))return $('nbs').classList.remove('on');
 const r=e.target.closest('[data-nr]');if(r){nbAr=r.dataset.nr;document.querySelectorAll('#nbr [data-nr]').forEach(b=>b.setAttribute('aria-pressed',b===r));nbGrid();return}
 const l=e.target.closest('[data-nl]');if(l){$('nbs').classList.remove('on');startEd(toDoc(null,nbAr),null,'Untitled carousel');if(l.dataset.nl){sel=null;act('lay',l.dataset.nl)}}});

/* ===== desktop comfort: filmstrip, hover outline, space/middle-drag pan, shortcuts ===== */
let fsT=0,fsDrag=null,fsIgnoreClickUntil=0;function fsSoon(){clearTimeout(fsT);fsT=setTimeout(fsRender,350)}
function fsRender(){const f=$('fs');if(!doc||!$('ed').classList.contains('on'))return;f.textContent='';
 for(let i=0;i<doc.n;i++){const b=document.createElement('button'),c=draw(i,96/doc.W),s=document.createElement('small');b.className='fsb'+(i===cur?' on':'');b.dataset.go=i;b.dataset.tip='Drag to reorder · Go to slide '+(i+1);s.textContent=i+1;b.append(c,s);const w=document.createElement('div');w.className='fsw'+(i===cur?' on':'');w.append(b);if(doc.n>1){const x=document.createElement('button');x.type='button';x.className='fsx';x.dataset.del=i;x.dataset.tip='Delete slide '+(i+1);x.setAttribute('aria-label','Delete slide '+(i+1));x.innerHTML=ic('x');w.append(x)}f.append(w)}
 const a=document.createElement('button');a.className='fsb add';a.dataset.add='1';a.dataset.tip='Add a slide';a.innerHTML=ic('addsl');f.append(a);const t=document.createElement('div');t.className='fst';t.setAttribute('role','toolbar');t.setAttribute('aria-label','Slide actions');const B=(k,i,l,c='')=>`<button type="button" class="fsa${c}" data-a="${k}" data-tip="${l}" aria-label="${l}">${ic(i)}</button>`;t.innerHTML=`<span class="fsn"></span>${B('sml','mvl','Move slide left')}${B('smr','mvr','Move slide right')}${B('sdup','dupsl','Duplicate slide')}${B('imp','impsl','Import slides from another draft')}${B('sdel','delsl','Delete slide',' dz')}<i class="fsd"></i>${B('reset','reset','Reset all · clears every text and photo',' dz')}`;f.append(t);fsTb()}
function fsTb(){const t=$('fs').querySelector('.fst');if(!t||!doc)return;t.querySelector('.fsn').textContent=`${cur+1} / ${doc.n}`;const d=(k,v)=>{const b=t.querySelector(`[data-a="${k}"]`);if(b)b.disabled=v};d('sml',cur<1);d('smr',cur>=doc.n-1);d('sdel',doc.n<2)}
/* slide strip reorder: the thumbnail lifts into a floating card, neighbours slide apart to open the drop slot, and the card glides into place on release */
const FS_EASE='cubic-bezier(.2,.8,.2,1)';
function fsLift(d){const strip=$('fs'),wraps=[...strip.querySelectorAll('.fsw')],src=d.button.querySelector('canvas'),r=d.button.getBoundingClientRect();
 d.wraps=wraps;d.sl0=strip.scrollLeft;d.centers=wraps.map(w=>{const q=w.getBoundingClientRect();return q.left+q.width/2+strip.scrollLeft});
 d.slot=wraps.length>1?Math.abs(d.centers[1]-d.centers[0]):r.width+8;
 const g=document.createElement('div');g.className='fsghost';const c=document.createElement('canvas');c.width=src.width;c.height=src.height;c.getContext('2d').drawImage(src,0,0);const badge=document.createElement('b');g.append(c,badge);document.body.append(g);
 Object.assign(g.style,{left:d.x+'px',top:d.y+'px',width:r.width+'px'});d.ghost=g;d.badge=badge;
 strip.classList.add('fsdrag');wraps[d.from].classList.add('ph');navigator.vibrate?.(8);fsLayout(d);requestAnimationFrame(()=>g.classList.add('up'))}
function fsLayout(d){d.wraps.forEach((w,j)=>{let t=0;if(j===d.from)t=(d.to-d.from)*d.slot;else if(d.from<d.to&&j>d.from&&j<=d.to)t=-d.slot;else if(d.from>d.to&&j>=d.to&&j<d.from)t=d.slot;w.style.transform=t?`translateX(${t}px)`:''});d.badge.textContent=d.to===d.from?`Slide ${d.from+1}`:`Move to ${d.to+1}`;d.ghost.classList.toggle('moving',d.to!==d.from)}
function fsClear(){const strip=$('fs');strip.classList.remove('fsdrag');strip.querySelectorAll('.fsw').forEach(w=>{w.style.transform='';w.classList.remove('ph')})}
function fsDragEnd(ev,cancelled=false){if(!fsDrag||ev.pointerId!==fsDrag.pointerId)return;const d=fsDrag;fsDrag=null;cancelAnimationFrame(d.raf);try{d.button.releasePointerCapture(ev.pointerId)}catch(_){}
 if(!d.moved)return;fsIgnoreClickUntil=Date.now()+450;const to=cancelled?d.from:d.to,g=d.ghost;
 if(cancelled){d.to=d.from;fsLayout(d)}
 const slot=d.wraps[d.from].querySelector('.fsb').getBoundingClientRect(),reduce=matchMedia('(prefers-reduced-motion:reduce)').matches,
  done=()=>{g.remove();fsClear();if(to!==d.from)reorderSlides(d.from,to)};
 if(reduce)return done();
 g.classList.remove('up','moving');g.classList.add('land');Object.assign(g.style,{left:slot.left+slot.width/2+'px',top:slot.top+slot.height/2+'px'});setTimeout(done,230)}
$('fs').addEventListener('pointerdown',ev=>{const b=ev.target.closest('.fsb[data-go]');if(!b||ev.button!==0||fsDrag)return;fsDrag={button:b,pointerId:ev.pointerId,from:+b.dataset.go,to:+b.dataset.go,x:ev.clientX,y:ev.clientY,moved:false};try{b.setPointerCapture(ev.pointerId)}catch(_){}});
$('fs').addEventListener('pointermove',ev=>{if(!fsDrag||ev.pointerId!==fsDrag.pointerId)return;const d=fsDrag;if(!d.moved&&Math.hypot(ev.clientX-d.x,ev.clientY-d.y)<8)return;if(!d.moved){d.moved=true;fsLift(d)}
 d.px=ev.clientX;d.py=ev.clientY;Object.assign(d.ghost.style,{left:ev.clientX+'px',top:ev.clientY+'px'});
 const strip=$('fs'),r=strip.getBoundingClientRect(),edge=ev.clientX<r.left+36?-1:ev.clientX>r.right-36?1:0;
 const pick=()=>{const x=d.px+strip.scrollLeft;let to=0;d.centers.forEach((c,j)=>{if(j!==d.from&&c<x)to++});if(to!==d.to){d.to=to;fsLayout(d)}};
 cancelAnimationFrame(d.raf);if(edge){const step=()=>{if(fsDrag!==d)return;strip.scrollLeft+=edge*10;pick();d.raf=requestAnimationFrame(step)};d.raf=requestAnimationFrame(step)}
 pick()});
['pointerup','pointercancel','lostpointercapture'].forEach(type=>$('fs').addEventListener(type,ev=>fsDragEnd(ev,type!=='pointerup')));
$('fs').addEventListener('click',e=>{if(Date.now()<fsIgnoreClickUntil){e.preventDefault();e.stopPropagation();return}const ta=e.target.closest('.fst [data-a]');if(ta){if(ta.disabled)return;const k=ta.dataset.a,i=cur;act(k);fsRender();if(k==='sdel')toast(`Slide ${i+1} deleted · Undo with ⌘Z`);return}const x=e.target.closest('.fsx');if(x){const i=+x.dataset.del;cur=i;act('sdel');fsRender();toast(`Slide ${i+1} deleted · Undo with ⌘Z`);return}const b=e.target.closest('.fsb');if(!b)return;if(b.dataset.add)return act('sadd');cur=+b.dataset.go;goSlide(cur);btns();if(!sel)panel()});
$('stage').addEventListener('pointerover',e=>{if(e.pointerType!=='mouse'||drag)return;const n=e.target.closest('.e'),h=$('hv'),q=n&&n.dataset.id!==sel?ge(n.dataset.id):null;
 if(!q){h.style.display='none';return}Object.assign(h.style,{display:'block',left:q.x+'px',top:q.y+'px',width:q.w+'px',height:q.h+'px',transform:`rotate(${q.r}deg)`})});
$('stage').addEventListener('pointerleave',()=>{$('hv').style.display='none';if(!eraseDrag)$('brushCursor').style.display='none'});
$('cv').addEventListener('pointerdown',e=>{if(!(spaceDown||e.button===1))return;pan={x:e.clientX,y:e.clientY,l:$('cv').scrollLeft,t:$('cv').scrollTop};try{$('cv').setPointerCapture(e.pointerId)}catch(_){}e.preventDefault()});
$('cv').addEventListener('pointermove',e=>{if(!pan)return;$('cv').scrollLeft=pan.l-(e.clientX-pan.x);$('cv').scrollTop=pan.t-(e.clientY-pan.y)});
['pointerup','pointercancel'].forEach(k=>$('cv').addEventListener(k,()=>{pan=null}));
listen(window,'resize',()=>{if(doc&&$('ed').classList.contains('on')){if(lastFit&&Math.abs(z-lastFit)<.004){z=lastFit=fitZ();render()}fsSoon()}});
listen(window,'keyup',e=>{if(e.code==='Space'){spaceDown=false;$('cv').classList.remove('hand')}});
listen(window,'keydown',e=>{if(e.key==='Escape'){['ts','nbs','xs'].forEach(i=>$(i).classList.remove('on'));return}
 if(!$('ed').classList.contains('on')||$('pv').classList.contains('on')||e.target.isContentEditable||/INPUT|TEXTAREA|SELECT/.test(e.target.tagName))return;
 const m=e.metaKey||e.ctrlKey,el=sel&&ge(sel),free=document.activeElement===document.body||$('cv').contains(document.activeElement);
 if(e.code==='Space'&&free){spaceDown=true;$('cv').classList.add('hand');e.preventDefault();return}
 if(m&&(e.key==='='||e.key==='+')){e.preventDefault();zoomC(1.25)}else if(m&&(e.key==='-'||e.key==='_')){e.preventDefault();zoomC(.8)}else if(m&&e.key==='0'){e.preventDefault();z=lastFit=fitZ();render();goSlide(cur,1)}
 else if(m&&e.key.toLowerCase()==='y'){e.preventDefault();undo(1)}else if(el&&e.key===']')act('fwd');else if(el&&e.key==='[')act('bwd')});

/* ===== backup + restore: a file you own, with the original photo bytes ===== */
const dataBlob=(u,type,name)=>{const b=atob(u.split(',')[1]),a=new Uint8Array(b.length);for(let i=0;i<b.length;i++)a[i]=b.charCodeAt(i);return new File([a],name||'photo',{type:type||'image/png'})};
async function backup(){const L=await idb('p','readonly',s=>s.getAll());if(!L||!L.length)return toast('No drafts to back up yet');
 const dl=window.claude&&await window.claude.use('downloads');if(!dl)return toast('Saving isn’t available in this view');toast('Preparing backup…');
 const out={app:'carousel-studio',v:1,at:Date.now(),projects:[]};
 for(const p of L){const imgs={};for(const k in p.imgs){const f=await idb('b','readonly',s=>s.get(p.id+'|'+k));imgs[k]={...p.imgs[k],...(f?{type:f.type||p.imgs[k].type,data:await rdURL(f)}:{})}}out.projects.push({...p,imgs})}
 try{await dl.save({filename:`carousel-studio-backup-${new Date().toISOString().slice(0,10)}.json`,data:new Blob([JSON.stringify(out)],{type:'application/json'})});toast(`Backed up ${L.length} draft${L.length>1?'s':''}`)}catch(e){if(!e||e.code!=='declined')toast(`Couldn’t save the backup${e&&e.code?' ('+e.code+')':''}`)}}
$('bkp').onclick=backup;$('rst').onclick=()=>$('rf').click();
$('rf').addEventListener('change',async e=>{const f=e.target.files[0];e.target.value='';if(!f)return;
 try{const o=JSON.parse(await f.text());if(o.app!=='carousel-studio'||!Array.isArray(o.projects))throw 0;let n=0;
  for(const p of o.projects){const cur0=await idb('p','readonly',s=>s.get(p.id));if(cur0&&cur0.updated>=p.updated)continue;const imgs={};
   for(const k in p.imgs){const m=p.imgs[k];if(m.data)await idb('b','readwrite',s=>s.put(dataBlob(m.data,m.type,m.name),p.id+'|'+k));imgs[k]={name:m.name,type:m.type,size:m.size}}
   await idb('p','readwrite',s=>s.put({...p,imgs}));n++}
  recents();toast(n?`Restored ${n} draft${n>1?'s':''}`:'Everything in that backup is already here')}catch(_){toast('That file isn’t a Carousel Studio backup')}});
fbar();grid();recents();
/* ===== Explore: trending layouts + sticker library (items can be removed and restored) ===== */
const xs={tab:'lay',cat:'All',q:'',edit:false,sel:new Set(),built:0};
const xHid=()=>xs.tab==='lay'?HID.lay:HID.stk;
function xItems(){const q=xs.q.trim().toLowerCase();return xs.tab==='lay'?EXP.filter(t=>!HID.lay.has(t.id)&&(xs.cat==='All'||t.cat===xs.cat)&&(!q||(t.name+' '+t.cat+' '+t.tags).toLowerCase().includes(q))):stkList(xs.cat,q)}
function xCard(t){const n=t.m||t.S.length,on=xs.sel.has(t.id),cv=t.m?`<div class="slide" style="background:${t.bg}"><div class="mw" style="width:${t.m*100}%;left:0;background:${t.bg}">${t.L.map(layer).join('')}</div></div>`:slides(t,1);
 return `<article class="xc${on?' on':''}" data-x="${t.id}" tabindex="0" aria-label="${esc(t.name)}"><div class="xcv" style="--ar:${t.ar}">${cv}${n>1?`<span class="xn">${ic('slides')}${n}</span>`:''}</div>${xs.edit?`<span class="xck" aria-hidden="true">${on?ic('done'):''}</span>`:''}<div class="meta"><div><h3>${esc(t.name)}</h3><p>${t.cat} · ${t.p?t.p+' photo'+(t.p>1?'s':''):'Text'}</p></div><button type="button" class="use" data-use="${t.id}">Use</button></div></article>`}
function xgrid(){const L=xItems(),G=$('xgrid'),hid=xHid().size,lay=xs.tab==='lay',cats=lay?XCATS:['All',...STK.cats];
 document.querySelectorAll('#xseg button').forEach(b=>b.setAttribute('aria-pressed',b.dataset.x===xs.tab));
 $('xchips').innerHTML=cats.map(c=>`<button type="button" class="chip" data-xc="${c}" aria-pressed="${xs.cat===c}">${c==='All'?(lay?'All layouts':'All stickers'):c}</button>`).join('');
 $('xq').placeholder=lay?'Search layouts':'Search stickers';
 $('xcnt').textContent=`${L.length} ${lay?'layout':'sticker'}${L.length===1?'':'s'}${hid?` · ${hid} removed`:''}`;
 $('hX').classList.toggle('editing',xs.edit);$('xed').setAttribute('aria-pressed',xs.edit);$('xed').querySelector('span').textContent=xs.edit?'Done':'Edit';
 $('xbar').hidden=!xs.edit;$('xsel').textContent=`${xs.sel.size} selected`;$('xdel').disabled=!xs.sel.size;$('xres').hidden=!hid;$('xres').querySelector('span').textContent=`Restore ${hid}`;
 if(!L.length){G.innerHTML=`<p class="empty">${hid&&!xs.q?'Everything here was removed. Tap Edit, then Restore.':'Nothing matches. Try another word.'}</p>`;return}
 if(lay){G.innerHTML=`<div class="xm">${L.map(xCard).join('')}</div>`;return}
 const B={};L.forEach(s=>(B[s.c]=B[s.c]||[]).push(s));
 G.innerHTML=Object.keys(B).map(c=>`<section class="gs"><div class="sec"><h2>${c}</h2><span>${B[c].length}</span></div><div class="sgrid">${B[c].map(s=>stkTile(s,'xs',{edit:xs.edit,on:xs.sel.has(s.id)})).join('')}</div></section>`).join('')}
function home(h,push=true){const x=h==='x';$('hT').hidden=x;$('hX').hidden=!x;document.querySelectorAll('#hseg button').forEach(b=>b.setAttribute('aria-pressed',(b.dataset.h==='x')===x));
 if(!x){xs.edit=false;xs.sel.clear();$('xbar').hidden=true}else xgrid();
 if(push)history.replaceState(history.state,'',x?'#explore'+(xs.tab==='stk'?'/stickers':''):location.pathname+location.search);scrollTo({top:0})}
$('hseg').addEventListener('click',e=>{const b=e.target.closest('[data-h]');if(b)home(b.dataset.h)});
$('xseg').addEventListener('click',e=>{const b=e.target.closest('[data-x]');if(!b||b.dataset.x===xs.tab)return;xs.tab=b.dataset.x;xs.cat='All';xs.sel.clear();xgrid();history.replaceState(history.state,'','#explore'+(xs.tab==='stk'?'/stickers':''))});
$('xchips').addEventListener('click',e=>{const b=e.target.closest('[data-xc]');if(b){xs.cat=b.dataset.xc;xgrid()}});
$('xq').addEventListener('input',e=>{xs.q=e.target.value;xgrid()});
$('xed').addEventListener('click',()=>{xs.edit=!xs.edit;xs.sel.clear();xgrid()});
$('xgrid').addEventListener('click',e=>{const c=e.target.closest('[data-x],[data-s]');if(!c)return;const id=c.dataset.x||c.dataset.s;
 if(xs.edit){xs.sel.has(id)?xs.sel.delete(id):xs.sel.add(id);return xgrid()}
 if(c.dataset.x){const t=EXP.find(x=>x.id===id);return e.target.closest('[data-use]')?openEd(t):openTs(id)}
 startEd(toDoc(null,'4/5'),null,'Untitled carousel');addSticker(id)});
$('xgrid').addEventListener('keydown',e=>{if(e.key==='Enter'&&e.target.matches('.xc')){e.preventDefault();e.target.click()}});
$('xall').onclick=()=>{const L=xItems().map(x=>x.id),all=L.every(id=>xs.sel.has(id));L.forEach(id=>all?xs.sel.delete(id):xs.sel.add(id));xgrid()};
$('xdel').onclick=()=>{const n=xs.sel.size;if(!n)return;xs.sel.forEach(id=>xHid().add(id));xs.sel.clear();hidSave();xgrid();toast(`Removed ${n} item${n>1?'s':''} · Restore any time`)};
$('xres').onclick=()=>{const n=xHid().size;xHid().clear();hidSave();xgrid();toast(`Restored ${n} item${n>1?'s':''}`)};
$('xdone').onclick=()=>{xs.edit=false;xs.sel.clear();xgrid()};
if(/^#explore/.test(hash)){xs.tab=/stickers/.test(hash)?'stk':'lay';home('x',false)}
/* deep links from the Studio home: ?template=id (carousel or Explore layout), ?new=1&ar=4/5&n=3, ?sticker=id, ?open=projectId.
   Sessions started this way return to the home page on Back, and the URL is rewritten to ?open= so a refresh resumes the draft. */
const params=new URLSearchParams(search),requestedTemplate=params.get('template'),requestedOpen=params.get('open');
let fromHome=false;const homeUrl=()=>{fromHome=true;history.replaceState(history.state,'',location.pathname+'?open='+encodeURIComponent(pid))};
if(requestedTemplate){const template=TPL.find(t=>t.id===requestedTemplate)||EXP.find(t=>t.id===requestedTemplate);if(template){fromHome=true;openEd(template).then(homeUrl)}else onMissing()}
else if(params.get('new')==='1'){const ar=['4/5','1/1','9/16'].includes(params.get('ar'))?params.get('ar'):'4/5',n=Math.min(20,Math.max(1,Math.round(+params.get('n'))||1)),d=toDoc(null,ar);d.n=n;d.bg=Array(n).fill('#ffffff');startEd(d,null,'Untitled carousel');homeUrl()}
else if(params.get('sticker')){const s=SMAP.get(params.get('sticker'));if(s){startEd(toDoc(null,'4/5'),null,'Untitled carousel');addSticker(s.id);homeUrl()}else onMissing()}
else if(requestedOpen)DBp.then(()=>idb('p','readonly',q=>q.get(requestedOpen))).then(r=>{if(r){openProj(requestedOpen).then(()=>{fromHome=true});}else onMissing()});
  /* ---- end legacy engine ---- */

  return function dispose() {
    clearTimeout(saveT)
    if (doc && hi > 0) saveProj()
    if (drawMode) inkStop(false)
    tracked.forEach(([target, type, fn, opts]) => target.removeEventListener(type, fn, opts))
    observers.forEach((o) => o.disconnect())
    document.querySelectorAll('#ed video, #pv video').forEach((v) => v.pause())
    for (const el of [...document.body.children]) if (!bodyBefore.has(el) && el !== container) el.remove()
    document.body.style.overflow = ''
    container.replaceChildren()
  }
}
