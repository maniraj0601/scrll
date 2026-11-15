// Layer primitives shared by the editor and the home page. Coordinates are % of the
// slide (or of the whole master canvas for seamless "m" templates).
export const G = {sea:['#4facfe','#00c6a7'],sun:['#f6d365','#fda085'],forest:['#6aa56a','#1f4d3a'],dusk:['#a18cd1','#fbc2eb'],rose:['#ff9a9e','#fad0c4'],peak:['#6a85b6','#bac8e0'],stone:['#8e9eab','#cfd8dc'],night:['#4a505c','#1b1e23']}

export const I = (x, y, w, h, g, o = {}) => ({ t: 'i', x, y, w, h, g, ...o })
export const T = (x, y, w, h, text, s, o = {}) => ({ t: 't', x, y, w, h, text, s, ...o })
export const R = (x, y, w, h, c, o = {}) => ({ t: 'r', x, y, w, h, c, ...o })
export const P = (x, y, w, g, r, cap, photo) => ({ t: 'p', x, y, w, g, r, cap, ...(photo ? { photo } : {}) })
export const K = (id, x, y, w, o = {}) => ({ t: 's', id, x, y, w, ...o })

// A genuine line element (same shape the editor's own "Lines & arrows" tool creates), not a
// flattened graphic — so grid lines a template starts with can be dragged, restyled, deleted
// or added to afterwards with zero extra editor work. `w` is the pre-rotation length; `r`
// rotates around the line's own centre (0 = horizontal, 90 = vertical).
export const L = (x, y, w, r = 0, o = {}) => ({ t: 'l', x, y, w, r, ...o })

// `hline`/`vline` take the coordinates people actually think in (a row/column position and
// its span, in the same x/y/w percentage basis as every other primitive — width-relative for
// x/w, height-relative for y). `vline`'s span is a height-basis quantity carried in `w`; the
// r:90 marker tells the width/height-aware conversion in engine.js's toDoc() to treat it as
// one, since x/w and y/h aren't on the same percentage scale once the slide isn't square.
export const hline = (y, x0, x1, o = {}) => L(x0, y, x1 - x0, 0, o)
export const vline = (x, y0, y1, o = {}) => L(x, y0, y1 - y0, 90, o)

export const photoURL = (id, w = 1200) => `https://images.unsplash.com/${id}?auto=format&fit=crop&w=${w}&q=85`

/* cutouts: % polygons used as clip paths (procedural torn edges, blobs, scallops).
   Shared by the home previews and the editor engine (src/editor/engine.js). */
export const tearCp=(sd,a=4,seed=1,sl=0,wv=0)=>{let s=(seed*7919)%233280||1;const rnd=()=>(s=(s*9301+49297)%233280)/233280,N=48,o=[],A=Math.abs(sl),
  j=t=>wv?a*(.5+.5*Math.sin(t*Math.PI*6+seed)):a*(.2+.8*rnd())*(rnd()<.12?.35:1),tl=t=>A?(sl>0?A*t:A*(1-t)):0,
  on=c=>sd.includes(c),prev={t:'l',r:'t',b:'r',l:'b'},
  E=(c,corner,fn)=>{if(!on(c)){if(!on(prev[c]))o.push(corner);return}for(let i=0;i<=N;i++){const t=i/N;o.push(fn(t,j(t)))}};
 E('t',[0,0],(t,d)=>[t*100,tl(t)+d]);E('r',[100,0],(t,d)=>[100-d,t*100]);E('b',[100,100],(t,d)=>[100-t*100,100-(A-tl(1-t))-d]);E('l',[0,100],(t,d)=>[d,100-t*100]);
 const f=v=>+Math.max(0,Math.min(100,v)).toFixed(2);return o.map(([x,y])=>f(x)+'% '+f(y)+'%').join(',')},
 blobCp=(seed=1)=>Array.from({length:72},(_,i)=>{const t=i/72*Math.PI*2,r=50*(.86+.07*Math.sin(2*t+seed*1.7)+.05*Math.sin(3*t+seed*3.4)+.02*Math.sin(5*t+seed*5.1));return `${+(50+r*Math.cos(t)).toFixed(2)}% ${+(50+r*Math.sin(t)).toFixed(2)}%`}).join(','),
 scalCp=()=>Array.from({length:112},(_,i)=>{const t=i/112*Math.PI*2,r=45.5+4.5*Math.abs(Math.sin(t*7));return `${+(50+r*Math.cos(t)).toFixed(2)}% ${+(50+r*Math.sin(t)).toFixed(2)}%`}).join(',')

export const TR = (sd, a = 4, seed = 1, sl = 0) => ({ cp: tearCp(sd, a, seed, sl), ck: { t: 'tt', b: 'tb', tb: 'ts', trbl: 'ta', lr: 'tl' }[sd], cq: { a, sd: seed, sl } })
