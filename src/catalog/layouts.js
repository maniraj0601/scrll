import { blobCp, G, I, K, R, scalCp, T, tearCp, TR } from './primitives.js'
import { XP } from './photos.js'

// Explore layouts: trending Pinterest-style single-slide compositions with sample photos.
const X = (p, o = {}) => ({ photo: XP[p], ...o })
const GX = G.stone
const cap = (y, t, c = '#fff', o = {}) => T(0, y, 100, 3, t, 2.2, { a: 'center', c, ls: 0.32, wt: 500, ...o })

export const LAYOUTS = [
{id:'x-window',name:'Sunset window',cat:'Photo in photo',ar:'4/5',tags:'window inset sea golden hour swap',S:[
 {bg:'#111',L:[I(0,0,100,100,G.sun,X('sunpier')),I(30,36,40,32,G.sea,X('wave')),cap(90,'golden hour')]},
 {bg:'#111',L:[I(0,0,100,100,G.sea,X('wave')),I(30,36,40,32,G.sun,X('sunpier')),cap(90,'blue hour')]}]},
{id:'x-echo',name:'Echo crop',cat:'Photo in photo',ar:'4/5',tags:'zoom crop same photo minimal desert',S:[
 {bg:'#f1eee8',L:[I(0,48,100,52,G.sun,X('desert')),I(38,12,24,19.2,G.sun,X('desert',{z:2.6,px:.15,py:.1})),T(0,36,100,4,'A R I Z O N A',2.6,{a:'center',c:'#3a2a20',wt:600})]}]},
{id:'x-mirror',name:'Mirror halves',cat:'Photo in photo',ar:'4/5',tags:'swap split inset sky sunset',S:[
 {bg:'#111',L:[I(0,0,100,50,G.peak,X('hazy')),I(0,50,100,50,G.sun,X('sunsetman')),I(34,34,32,16,G.sun,X('sunsetman')),I(34,50,32,16,G.peak,X('hazy'))]}]},
{id:'x-nowhere',name:'No where, now here',cat:'Photo in photo',ar:'4/5',tags:'sky jungle swap words inset',S:[
 {bg:'#111',L:[I(0,0,100,46,G.peak,X('mist')),I(0,46,100,54,G.forest,X('forest')),I(34,30,32,16,G.forest,X('forest')),I(34,46,32,16,G.peak,X('mist')),T(20,25,60,4,'no where',3.4,{a:'center',wt:800,f:'inter'}),T(20,63,60,4,'now here',3.4,{a:'center',wt:800,f:'inter'})]}]},
{id:'x-stack',name:'Three windows',cat:'Photo in photo',ar:'4/5',tags:'stack insets backdrop calm',S:[
 {bg:'#111',L:[I(0,0,100,100,G.sun,X('dock')),I(24,18,52,18,G.sea,X('falls')),I(24,39,52,18,G.forest,X('tree')),I(24,60,52,18,G.peak,X('hiker1')),cap(86,'three quiet mornings')]}]},
{id:'x-callouts',name:'Outfit details',cat:'Photo in photo',ar:'4/5',tags:'fashion details zoom callouts ootd',S:[
 {bg:'#111',L:[I(0,0,100,100,G.sun,X('yellow')),I(5,6,28,22.4,G.sun,X('yellow',{z:3,py:.7,bw:.6,bc:'#c6ff00'})),I(67,34,28,22.4,G.sun,X('yellow',{z:2.6,px:-.3,py:-.1,bw:.6,bc:'#c6ff00'})),I(5,70,28,22.4,G.sun,X('yellow',{z:3,py:-.8,bw:.6,bc:'#c6ff00'})),T(62,88,34,4,'fit check ✓',3,{a:'right',wt:700,f:'inter'})]}]},
{id:'x-slivers',name:'Slivers',cat:'Strips & bands',ar:'4/5',tags:'thin strips water collage',S:[
 {bg:'#123',L:[I(0,0,100,100,G.sea,X('aerialsea')),...['forest','sunpier','hazy','desert'].map((p,i)=>I(16,26+i*13,68,6.5,G.sun,X(p)))]}]},
{id:'x-triple',name:'Triple take',cat:'Strips & bands',ar:'4/5',tags:'portrait three crops bands selfie',S:[
 {bg:'#111',L:[I(0,0,100,33.4,G.rose,X('red',{z:1.25,py:.12})),I(0,33.3,100,33.4,G.rose,X('red',{z:1.6,px:.1})),I(0,66.6,100,33.4,G.rose,X('red',{z:2.2,px:-.15,py:-.25}))]}]},
{id:'x-bands',name:'Summer bands',cat:'Strips & bands',ar:'4/5',tags:'three bands travel sea',S:[
 {bg:'#111',L:[I(0,0,100,33.4,G.sea,X('surf')),I(0,33.3,100,33.4,G.forest,X('falls')),I(0,66.6,100,33.4,G.sea,X('dive')),T(0,48.2,100,4,'S U M M E R   2 6',2.6,{a:'center',wt:700,ts:.45,tb:10})]},
 {bg:'#111',L:[I(0,0,100,50,G.sea,X('island')),I(0,50,100,50,G.sea,X('beach'))]}]},
{id:'x-earth',name:'EARTH',cat:'Strips & bands',ar:'4/5',tags:'five strips letters word',S:[
 {bg:'#111',L:[...['aerialsea','desert','pinksea','beach','wave'].flatMap((p,i)=>[I(i*20,0,20.2,100,G.sea,X(p)),T(i*20,45,20,10,'EARTH'[i],11,{a:'center',v:'c',f:'bodo',wt:400})])]}]},
{id:'x-sliver',name:'Sky sliver',cat:'Strips & bands',ar:'4/5',tags:'vertical strip field sky',S:[
 {bg:'#111',L:[I(0,0,100,100,G.sun,X('green')),I(42,0,16,100,G.sea,X('pinksea'))]}]},
{id:'x-trip',name:'Triptych',cat:'Strips & bands',ar:'4/5',tags:'three columns coloured words',S:[
 {bg:'#111',L:[I(0,0,33.4,100,G.peak,X('mtn')),I(33.3,0,33.4,100,G.sun,X('sunsetman')),I(66.6,0,33.4,100,G.night,X('stars')),T(0,20,33.4,3,'view',2.6,{a:'center',c:'#ffd27a',wt:700,f:'inter'}),T(33.3,20,33.4,3,'sunset',2.6,{a:'center',c:'#ffb0a0',wt:700,f:'inter'}),T(66.6,20,33.4,3,'stars',2.6,{a:'center',c:'#b9c8ff',wt:700,f:'inter'})]}]},
{id:'x-pano',name:'The long way home',cat:'Strips & bands',ar:'4/5',tags:'seamless panorama swipe words',m:3,bg:'#222',L:[I(0,0,100,100,G.peak,X('alps')),T(3,16,28,8,'take the',6,{f:'s',wt:500,ts:.3}),T(37,48,28,8,'long way',6,{f:'s',wt:500,ts:.3}),T(70,78,28,8,'home.',6,{f:'s',wt:500,ts:.3})]},
{id:'x-view',name:'The view',cat:'Editorial',ar:'4/5',tags:'split white minimal caption',S:[
 {bg:'#ffffff',L:[I(50,0,50,100,G.forest,X('tree')),I(7,34,36,28.8,G.sea,X('dock')),T(7,29,18,3,'the',2.2,{c:'#111',wt:500}),T(25,29,18,3,'view',2.2,{c:'#111',a:'right',wt:500}),T(7,64,18,3,'slow',2.2,{c:'#111',wt:500}),T(25,64,18,3,'days',2.2,{c:'#111',a:'right',wt:500})]}]},
{id:'x-tones',name:'Two tones',cat:'Editorial',ar:'4/5',tags:'black and white colour split portrait',S:[
 {bg:'#ffffff',L:[I(6,30,40,32,GX,X('beard',{gs:1})),I(50,0,50,100,GX,X('beard',{z:1.3})),T(6,64,40,3,'mono / colour',2,{c:'#111',ls:.2,wt:500})]}]},
{id:'x-scenery',name:'Scenery',cat:'Editorial',ar:'4/5',tags:'white prints sky landscape minimal',S:[
 {bg:'#fbfaf7',L:[cap(5,'S C E N E R Y','#555'),I(10,12,80,34,G.peak,X('mist')),I(10,50,80,34,G.peak,X('hazy')),cap(88,'serenity','#666'),T(0,92,100,3,'a quiet collection of skies',1.8,{a:'center',c:'#999',wt:400})]}]},
{id:'x-roots',name:'Roots by the sea',cat:'Editorial',ar:'4/5',tags:'dark rounded serif moody',S:[
 {bg:'#000000',L:[I(10,7,80,40,G.forest,X('forest',{rd:'7%'})),I(10,50,80,40,G.sea,X('wave')),T(52,38,42,18,'roots\nby the\nsea.',7.4,{f:'s',wt:500,lh:.92}),T(10,94,50,3,'archive by you',1.7,{c:'#999',wt:400})]}]},
{id:'x-halves',name:'Halves',cat:'Editorial',ar:'4/5',tags:'portrait mono colour stacked',S:[
 {bg:'#efeeea',L:[I(30,26,40,24,GX,X('bun',{gs:1,py:.15,z:1.2})),I(30,50,40,24,GX,X('bun',{py:-.15,z:1.2})),T(10,78,40,3,'before',1.8,{c:'#555',ls:.2}),T(50,78,40,3,'after',1.8,{c:'#555',a:'right',ls:.2})]}]},
{id:'x-prints',name:'Silver prints',cat:'Editorial',ar:'4/5',tags:'black and white prints paper',S:[
 {bg:'#f5f4f1',L:[I(7,12,86,36,GX,X('shades',{gs:1,bw:1.8,bc:'#ffffff',r:-1})),I(7,52,86,36,GX,X('pier',{gs:1,bw:1.8,bc:'#ffffff',r:1}))]}]},
{id:'x-mountains',name:'MOUNTAINS',cat:'Type',ar:'4/5',tags:'vertical headline bebas poster',S:[
 {bg:'#111',L:[I(0,0,100,100,G.forest,X('moraine')),T(-44.5,39,125,22,'MOUNTAINS',21,{r:90,f:'bebas',wt:400,a:'center',v:'c',o:.95})]}]},
{id:'x-sunset',name:'Sunset',cat:'Type',ar:'4/5',tags:'serif headline sea minimal',S:[
 {bg:'#111',L:[I(0,0,100,100,G.dusk,X('pinksea')),T(0,44,100,12,'SUNSET',12,{a:'center',v:'c',f:'bodo',wt:400,ls:.08})]}]},
{id:'x-run',name:'Morning run',cat:'Type',ar:'4/5',tags:'run sport script bands',S:[
 {bg:'#111',L:[I(0,0,100,33.4,G.peak,X('alps')),I(0,33.3,100,33.4,G.stone,{photo:'photo-1470770841072-f978cf4d019e'}),I(0,66.6,100,33.4,G.forest,X('forest')),T(0,10,100,14,'Morning',11,{a:'center',v:'c',f:'dance',wt:700,ts:.3}),T(0,40,100,20,'RUN',20,{a:'center',v:'c',f:'bebas',wt:400}),T(0,92,100,3,'h u m a n   a c t i v i t y',2,{a:'center',wt:500})]}]},
{id:'x-aftersun',name:'aftersun',cat:'Type',ar:'4/5',tags:'film poster title sea',S:[
 {bg:'#7f9aa6',L:[I(0,0,100,100,G.sea,X('aerialsea')),...['beach','resort','shades','island'].map((p,i)=>I(4+i*23.4,7,21.4,9,G.sun,X(p))),T(0,40,100,14,'aftersun',15,{a:'center',v:'c',f:'inter',wt:800,ls:-.04}),T(5,55,90,3,'DIRECTED BY YOU  ·  STARRING THE SEA  ·  2026',1.7,{a:'center',ls:.15,wt:600})]}]},
{id:'x-explore',name:'Never stop exploring',cat:'Type',ar:'4/5',tags:'poster hike adventure bebas',S:[
 {bg:'#111',L:[I(0,0,100,100,G.peak,X('hiker2')),T(6,7,88,24,'NEVER STOP\nEXPLORING',13,{f:'bebas',wt:400,a:'center',lh:.95,ts:.3}),T(6,92,88,3,'chapter 04 — the alps',2.2,{a:'center',ls:.2,wt:500})]}]},
{id:'x-player',name:'Now playing',cat:'Overlay',ar:'4/5',tags:'music player song spotify widget',S:[
 {bg:'#111',L:[I(0,0,100,100,G.forest,X('falls')),R(7,72,86,21,'rgba(18,18,20,.55)',{rd:'16%'}),I(11,75.5,15,12,G.sun,X('sunpier',{rd:'12%'})),T(30,76,56,4,'Anywhere Anything',3.4,{wt:700,f:'inter'}),T(30,81,56,3,'Gabe Bondoc',2.6,{c:'#d0d0d4',wt:500,f:'inter'}),R(11,89.2,78,.5,'rgba(255,255,255,.3)'),R(11,89.2,32,.5,'#ffffff'),T(11,90,20,2.5,'1:17',1.8,{c:'#ccc',wt:500}),T(69,90,20,2.5,'-2:01',1.8,{c:'#ccc',a:'right',wt:500})]}]},
{id:'x-digicam',name:'Digicam',cat:'Overlay',ar:'4/5',tags:'camera y2k digicam screen selfie',S:[
 {bg:'#111',L:[I(0,0,100,100,G.sun,X('resort')),K('f-digicam',14,30,72),I(22.1,37.2,40.5,23.7,G.rose,X('smile')),T(44,57,18,3,"'26 10 25",2.2,{f:'roboto',c:'#ff9a3c',wt:500,a:'right'})]}]},
{id:'x-rec',name:'REC',cat:'Overlay',ar:'4/5',tags:'viewfinder camcorder friends',S:[
 {bg:'#111',L:[I(0,0,100,100,G.sun,X('friends')),K('f-viewfinder',4,23,92),T(8,84,60,4,"JUL 14 2026  11:11 PM",2.4,{f:'roboto',c:'#fff',wt:500})]}]},
{id:'x-postcard',name:'Postcard',cat:'Scrapbook',ar:'4/5',tags:'postcard travel handwritten blur',S:[
 {bg:'#222',L:[I(0,0,100,100,G.sea,X('santorini',{bl:8})),K('f-postcard',6,32,88),I(11.5,36.4,38.5,37,G.sea,X('santorini')),T(58.5,49,31,22,'wish you were\nhere. the sea\nis so blue x',2.8,{f:'h',c:'#3b3326',wt:600,lh:1.5})]}]},
{id:'x-film',name:'Film roll',cat:'Scrapbook',ar:'4/5',tags:'film strip analog handwritten',S:[
 {bg:'#101010',L:[K('f-film',8,13,32),I(14.4,15.9,19.2,20.5,G.sun,X('venice')),I(14.4,39.3,19.2,20.5,G.sea,X('cinque')),I(14.4,62.7,19.2,20.5,G.dusk,X('paris')),T(48,30,46,30,'roll 01\nsummer\nin italy',6,{f:'h',c:'#e9e4d8',wt:600,lh:1.1}),T(48,80,46,4,'PORTRA 400',2.4,{f:'roboto',c:'#e9a23b',ls:.15})]}]},
{id:'x-gingham',name:'Gingham diary',cat:'Scrapbook',ar:'4/5',tags:'gingham tape bow cute coquette',S:[
 {bg:'#ffffff',L:[K('p-gingham',0,0,100),I(8,9,40,33,G.peak,X('hiker1',{bw:1.4,r:-3})),I(52,13,40,33,G.sea,X('beach',{bw:1.4,r:3})),I(8,50,40,33,G.forest,X('canopy',{bw:1.4,r:2})),I(52,48,40,33,G.rose,X('balloons',{bw:1.4,r:-2})),K('t-masking',18,6,20,{r:-8}),K('t-ginghamblue',62,10,20,{r:6}),K('t-pink',18,47.5,20,{r:4}),K('d-bowf',73,82,14,{col:'#6f95cf'}),K('e-butterfly',8,86,10),T(22,88,50,5,'happy days ♡',4,{f:'h',c:'#4a6fa5',wt:700})]}]},
{id:'x-journal',name:'Travel journal',cat:'Scrapbook',ar:'4/5',tags:'notebook checklist handwritten tape',S:[
 {bg:'#fffdf6',L:[K('p-lined',0,0,100),I(10,9,52,36,G.sea,X('cinque',{bw:1.2,r:-2})),K('t-kraft',25,6,22,{r:-6}),K('e-hot-beverage',68,12,20),K('d-sparks',72,34,16,{col:'#2b3a55'}),T(12,52,78,36,'the ideal day here:\n✓ morning coffee\n✓ a slow walk to the sea\n✓ long lunch, no plans\n✓ sunset swim',3.8,{f:'h',c:'#2b3a55',wt:600,lh:1.32})]}]},
{id:'x-arch',name:'Arch window',cat:'Scrapbook',ar:'4/5',tags:'arch frame greece cream',S:[
 {bg:'#e9dccb',L:[K('f-arch',20,10,60),I(28.4,19.6,43.2,48,G.sea,X('santorini')),T(10,78,80,7,'Santorini',7,{f:'dance',a:'center',c:'#7a5c3e',wt:700}),T(10,87,80,3,'G R E E C E  ·  2 0 2 6',1.9,{a:'center',c:'#7a5c3e',wt:600})]}]},
{id:'x-stamps',name:'Stamp collection',cat:'Scrapbook',ar:'4/5',tags:'postage stamps travel collection',S:[
 {bg:'#efe6d6',L:[K('f-stamp',8,8,38),I(12.52,11.62,28.95,26.03,G.sea,X('venice')),K('f-stamp',54,30,38),I(58.52,33.62,28.95,26.03,G.sun,X('paris')),K('f-stamp',8,54,38),I(12.52,57.62,28.95,26.03,G.dusk,X('nyc')),T(52,70,42,14,'places\nI left my\nheart',4.2,{f:'h',c:'#5a4632',wt:600,lh:1.1})]}]},
{id:'x-dump9',name:'Dump 3×3',cat:'Photo dump',ar:'1/1',tags:'grid nine photo dump month recap',S:[
 {bg:'#ffffff',L:['latte','beach','venice','brunch','friends','hiker3','cafe','island','balloons'].map((p,i)=>I(i%3*33.6,(i/3|0)*33.6,32.8,32.8,G.sun,X(p)))}]},
{id:'x-dumpcover',name:'Month recap',cat:'Photo dump',ar:'4/5',tags:'recap month dump cover pill label',S:[
 {bg:'#111',L:[I(0,0,100,100,G.sun,X('cafe')),T(30,44,40,6,'october dump',3,{a:'center',v:'c',bg:'#111111',rd:'50%',wt:600,f:'inter'})]},
 {bg:'#ffffff',L:[I(2,2,47,47,G.sun,X('latte')),I(51,2,47,47,G.sun,X('brunch')),I(2,51,47,47,G.sun,X('denimgirl')),I(51,51,47,47,G.sun,X('bridge'))]}]},
{id:'x-torn',name:'Torn sky',cat:'Torn & cutout',ar:'9/16',tags:'torn paper ripped strips sky sunset script words story',S:[
 {bg:'#111',L:[I(-6,0,112,27,G.sun,X('sunpier')),
  K('tp-thin',-8,23.6,116,{r:-2}),I(-6,24.6,112,28,G.dusk,X('pinksea',{r:-2,...TR('t',5,11)})),
  K('tp-thin',-8,48.6,116,{r:2}),I(-6,49.6,112,28,G.peak,X('hazy',{r:2,...TR('t',5,23)})),
  K('tp-thin',-8,73.6,116,{r:-1.5}),I(-6,74.6,112,28,G.sun,X('sunsetman',{r:-1.5,...TR('t',5,37)})),
  T(40,13,54,8,'Forever',11,{f:'dance',a:'right',c:'#fff',ts:.35,r:-4}),T(6,36,60,7,'a girl',10,{f:'dance',c:'#fff',ts:.35,r:-3}),
  T(30,61,62,7,'who loves',10,{f:'dance',a:'right',c:'#fff',ts:.35,r:-3}),T(8,86,70,7,'the sky',11,{f:'dance',c:'#fff',ts:.35,r:-4})]}]},
{id:'x-torn2',name:'Torn duo',cat:'Torn & cutout',ar:'4/5',tags:'torn paper ripped two photos sea label',S:[
 {bg:'#f4efe6',L:[I(0,0,100,56,G.sea,X('aerialsea')),K('tp-thin',-6,45.6,112,{r:-2}),I(-4,47,108,56,G.sun,X('surf',{r:-2,...TR('t',4.5,8)})),
  K('tp-label',29,41,42,{r:-3}),T(29,42.3,42,5.6,'weekend notes',3.4,{f:'h',a:'center',v:'c',c:'#2b2b2b',wt:600,r:-3})]}]},
{id:'x-tornnote',name:'Torn note',cat:'Torn & cutout',ar:'4/5',tags:'notebook paper scrap handwriting tape forest',S:[
 {bg:'#1d2a22',L:[I(0,0,100,100,G.forest,X('canopy')),K('tp-note',20,36,58,{r:-3}),K('t-masking',37,32.5,26,{r:5}),
  T(27,45,46,40,'note to self:\nslow down,\nlook up,\nbreathe.',5,{f:'h',c:'#24324f',wt:600,lh:1.28,r:-3})]}]},
{id:'x-ripreveal',name:'Ripped reveal',cat:'Torn & cutout',ar:'4/5',tags:'torn edges ripped photo over photo reveal',S:[
 {bg:'#111',L:[I(0,0,100,100,G.peak,X('mist',{gs:1})),K('tp-scrap',8,22,84,{r:-4,o:.96}),I(13,30,74,44,G.sun,X('alps',{r:-4,...TR('trbl',3,19)})),
  T(0,84,100,6,'somewhere in between',4.4,{f:'dance',a:'center',c:'#fff',ts:.3})]}]},
{id:'x-wavecut',name:'Wave cut',cat:'Torn & cutout',ar:'4/5',tags:'wavy edge cutout band beach minimal',S:[
 {bg:'#f3ede2',L:[T(8,8,84,8,'summer, slowly',7,{f:'bodo',c:'#1f2a44',a:'center'}),I(0,24,100,52,G.sea,X('beach',{cp:tearCp('tb',4,3,0,1),ck:'wv',cq:{a:4,sd:3,sl:0}})),cap(86,'S A L T  ·  S U N  ·  S L O W','#1f2a44')]}]},
{id:'x-blobs',name:'Soft blobs',cat:'Torn & cutout',ar:'4/5',tags:'blob organic shapes cutout playful pastel',S:[
 {bg:'#efe4f3',L:[I(6,6,58,46,G.rose,X('balloons',{cp:blobCp(2),ck:'blob',cq:{sd:2}})),I(42,40,52,42,G.sun,X('brunch',{cp:blobCp(7),ck:'blob',cq:{sd:7}})),
  T(6,60,36,20,'little\nthings',8,{f:'dance',c:'#6b3d7a',lh:1}),K('e-sparkles',80,10,12)]}]},
{id:'x-village',name:'Village script',cat:'Type',ar:'4/5',tags:'vertical script title rotated travel coast',S:[
 {bg:'#111',L:[I(0,0,100,100,G.sea,X('cinque')),T(-34,38,100,18,'village',24,{f:'dance',a:'center',v:'c',c:'#fff',r:-90,ts:.3}),cap(93,'S U M M E R  I N  I T A L Y')]}]},
{id:'x-cinema',name:'Cinema bands',cat:'Strips & bands',ar:'4/5',tags:'letterbox black bands film cinematic three',S:[
 {bg:'#0b0b0c',L:[I(0,6,100,26,G.peak,X('mist')),I(0,37,100,26,G.peak,X('alps')),I(0,68,100,26,G.sea,X('moraine')),
  T(5,1.6,90,3,'SCENE 01',1.8,{c:'#8e8e93',ls:.3,wt:600}),T(5,95.4,90,3,'A FILM BY YOU',1.8,{a:'right',c:'#8e8e93',ls:.3,wt:600})]}]},
{id:'x-vast',name:'Vast',cat:'Strips & bands',ar:'4/5',tags:'three bands centre inset landscape minimal title',S:[
 {bg:'#111',L:[I(0,0,100,33.4,G.sun,X('desert')),I(0,33.3,100,33.4,G.forest,X('valley')),I(0,66.6,100,33.4,G.forest,X('field')),I(36,17,28,66,G.peak,X('hiker2',{bw:.8})),cap(48.5,'V A S T')]}]},
{id:'x-colourpop',name:'Colour pop',cat:'Photo in photo',ar:'4/5',tags:'black and white colour inset pop',S:[
 {bg:'#111',L:[I(0,0,100,100,GX,X('venice',{gs:1})),I(25,24,50,52,G.sea,X('venice',{bw:1})),cap(90,'in colour')]}]},
{id:'x-gallery',name:'Gallery rows',cat:'Editorial',ar:'4/5',tags:'white gutters rows clean grid travel',S:[
 {bg:'#ffffff',L:[I(4,3.2,92,30,G.sea,X('santorini')),I(4,35.2,45,30,G.sun,X('cinque')),I(51,35.2,45,30,G.sea,X('venice')),I(4,67.2,92,24,G.sun,X('paris')),T(4,93.4,92,3,'europe, in pieces',2.4,{c:'#3a3a3c',wt:500,ls:.06})]}]},
{id:'x-meandsea',name:'Me and the sea',cat:'Strips & bands',ar:'4/5',tags:'rounded cards black ocean script',S:[
 {bg:'#0d0d0f',L:[I(6,4,88,29,G.sea,X('pinksea',{rd:'9%'})),I(6,35.5,88,29,G.sea,X('dive',{rd:'9%'})),I(6,67,88,29,G.sea,X('surf',{rd:'9%'})),T(6,44,88,10,'me & the sea',10,{f:'dance',a:'center',v:'c',c:'#fff',ts:.35})]}]},
{id:'x-peek',name:'Peek',cat:'Photo in photo',ar:'4/5',tags:'centre black and white side photos peeking',S:[
 {bg:'#f4f1ec',L:[I(-28,18,40,64,G.sun,X('beach')),I(88,18,40,64,G.sun,X('friends')),I(17,10,66,80,GX,X('smile',{gs:1})),T(17,92,66,3,'the in-between moments',2.2,{a:'center',c:'#5a5a5e',ls:.08})]}]},
{id:'x-profile',name:'Profile grid',cat:'Photo dump',ar:'9/16',tags:'instagram profile grid posts stories reels feed',S:[
 {bg:'#f7f3ee',L:[T(6,5,88,7,'my little world',8,{f:'dance',c:'#2a2a2c'}),T(6,13.4,88,2,'POSTS        STORIES        REELS',1.8,{a:'center',c:'#8e8e93',ls:.18,wt:600}),R(6,16.4,88,.12,'#d1d1d6'),
  ...['latte','beach','venice','brunch','friends','hiker3','cafe','island','balloons'].map((p,i)=>I(6+i%3*29.67,18+(i/3|0)*20.8,29,20.2,G.sun,X(p))),
  T(6,82.6,88,3,'@yourname',2.6,{a:'center',c:'#2a2a2c',wt:600}),T(6,86.6,88,6,'coffee, sea air & slow mornings',2.4,{a:'center',c:'#6e6e73',wt:500})]}]},
{id:'x-core',name:'Me and my core',cat:'Scrapbook',ar:'4/5',tags:'friends portraits scattered yellow cute heart',S:[
 {bg:'#f6e7a1',L:[T(6,5,88,9,'me and my core <3',7.4,{f:'dance',a:'center',c:'#3b2f1e'}),
  I(6,18,40,34,G.rose,X('ginger',{r:-5,bw:1.1})),I(54,16,40,34,G.rose,X('denim',{r:4,bw:1.1})),I(30,40,40,34,G.rose,X('brunette',{r:-2,bw:1.1})),I(4,62,38,32,G.rose,X('redhead',{r:5,bw:1.1})),I(58,62,38,32,G.rose,X('smile',{r:-4,bw:1.1})),
  K('d-heart',82,4,10,{col:'#e0245e'}),K('d-sparks',2,86,12,{col:'#3b2f1e'})]}]},
{id:'x-drift',name:'Drift',cat:'Strips & bands',ar:'4/5',tags:'slanted strips misty birds mountains',S:[
 {bg:'#222',L:[I(0,0,100,100,G.peak,X('mist',{bl:6})),...['alps','moraine','falls','forest'].map((p,i)=>I(9+i*21,20,15,60,G.peak,X(p,{r:8,bw:.6}))),K('d-birds',62,7,22),cap(90,'drifting')]}]},
{id:'x-bows',name:'Bows & roses',cat:'Scrapbook',ar:'4/5',tags:'coquette bows cream brown frames roses',S:[
 {bg:'#f3ead9',L:[I(10,10,46,42,G.rose,X('bouquet',{r:-4,bw:1.4,bc:'#6b4a3a'})),I(44,42,46,42,G.rose,X('brunette',{r:3,bw:1.4,bc:'#6b4a3a'})),K('e-ribbon',40,3,14),K('e-ribbon',4,50,11),K('e-rose',76,30,12),K('e-rose',14,78,10),
  T(8,88,84,6,'soft days',6,{f:'dance',a:'center',c:'#6b4a3a'})]}]},
{id:'x-lotus',name:'Lotus boxes',cat:'Editorial',ar:'4/5',tags:'dark green mint rounded boxes calm',S:[
 {bg:'#1f3a2e',L:[I(8,5,84,26,G.forest,X('green',{rd:'10%',bw:1.4,bc:'#cfe8d8'})),I(8,34,84,26,G.forest,X('tree',{rd:'10%',bw:1.4,bc:'#cfe8d8'})),I(8,63,84,26,G.forest,X('forest',{rd:'10%',bw:1.4,bc:'#cfe8d8'})),
  K('e-lotus',8,90.5,8),T(18,91,74,6,'breathe in the green',3.6,{f:'bodo',c:'#cfe8d8',v:'c'})]}]},
{id:'x-offgrid',name:'Off grid',cat:'Photo dump',ar:'1/1',tags:'offset tiles staggered white six',S:[
 {bg:'#ffffff',L:[['island',4,4],['beach',4,50],['resort',35.4,12],['dock',35.4,58],['surf',66.8,4],['dive',66.8,50]].map(([p,x,y])=>I(x,y,29.2,40,G.sea,X(p)))}]},
{id:'x-shore',name:'Shoreline',cat:'Photo in photo',ar:'4/5',tags:'beach insets column three',S:[
 {bg:'#111',L:[I(0,0,100,100,G.sea,X('aerialsea')),I(6,8,30,25,G.sun,X('beach',{bw:.8})),I(6,37,30,25,G.sun,X('resort',{bw:.8})),I(6,66,30,25,G.sun,X('dock',{bw:.8})),T(42,86,52,8,'shoreline',8,{f:'dance',a:'right',c:'#fff',ts:.3})]}]},
{id:'x-cards',name:'Stacked cards',cat:'Editorial',ar:'9/16',tags:'rounded wide cards stacked tiny titles story',S:[
 {bg:'#0e0e10',L:[...[['santorini','01  greece'],['cinque','02  italy'],['paris','03  france'],['venice','04  venice'],['alps','05  alps']].flatMap(([p,t],i)=>[I(6,4+i*19,88,15.6,G.sea,X(p,{rd:'9%'})),T(10,4.8+i*19+12.6,80,2.2,t,2.2,{c:'#fff',ts:.5,wt:600,ls:.1})])]}]},
{id:'x-redfilm',name:'Red room',cat:'Editorial',ar:'4/5',tags:'red black and white prints portrait film',S:[
 {bg:'#b3261e',L:[I(8,8,50,46,GX,X('beard',{gs:1,bw:1.4,r:-4})),I(42,42,50,46,GX,X('man',{gs:1,bw:1.4,r:3})),T(8,58,30,12,'still\nframes',6.2,{f:'bodo',c:'#fff',lh:1}),T(62,8,30,3,'VOL. 02',1.9,{a:'right',c:'#ffd9d4',ls:.3,wt:600})]}]},
{id:'x-tokyo',name:'Stacked city',cat:'Type',ar:'4/5',tags:'big stacked letters white column city bebas',S:[
 {bg:'#ffffff',L:[I(38,0,62,100,G.night,X('times')),T(3,6,32,88,'N\nY\nC',30,{f:'bebas',a:'center',v:'c',c:'#111',lh:.95}),T(3,95,32,3,'40.7128° N',1.8,{a:'center',c:'#8e8e93',ls:.2})]}]},
{id:'x-mosaic',name:'Mosaic',cat:'Photo dump',ar:'1/1',tags:'irregular mosaic grid six tiles',S:[
 {bg:'#ffffff',L:[I(1,1,57.5,61,G.sun,X('food')),I(59.5,1,39.5,30,G.sun,X('latte')),I(59.5,32,39.5,30,G.sun,X('brunch')),I(1,63,29,36,G.sun,X('friends2')),I(31,63,38,36,G.sun,X('cafe')),I(70,63,29,36,G.sun,X('poppy'))]}]}
]
