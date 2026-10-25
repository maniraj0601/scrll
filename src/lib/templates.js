// Template catalog. Layer coordinates are percentages of the slide (or of the
// whole master canvas for seamless templates with `m` slides).
// Layer kinds: i = photo frame, t = text, r = rectangle/shape, p = polaroid.

export const G = {
  sea: ['#4facfe', '#00c6a7'], sun: ['#f6d365', '#fda085'], forest: ['#6aa56a', '#1f4d3a'], dusk: ['#a18cd1', '#fbc2eb'],
  rose: ['#ff9a9e', '#fad0c4'], peak: ['#6a85b6', '#bac8e0'], stone: ['#8e9eab', '#cfd8dc'], night: ['#4a505c', '#1b1e23'],
}
const I = (x, y, w, h, g, o = {}) => ({ t: 'i', x, y, w, h, g, ...o })
const T = (x, y, w, h, text, s, o = {}) => ({ t: 't', x, y, w, h, text, s, ...o })
const R = (x, y, w, h, c, o = {}) => ({ t: 'r', x, y, w, h, c, ...o })
const P = (x, y, w, g, r, cap) => ({ t: 'p', x, y, w, g, r, cap })

const FILM = [G.sea, G.sun, G.forest, G.dusk, G.rose, G.peak]
const filmL = [R(0, 15, 100, 70, '#1a1a1a'),
  ...Array.from({ length: 30 }, (_, i) => R(1 + i * 3.3, 18.5, 1.4, 3.2, '#e9e4d8', { rd: '30%' })),
  ...Array.from({ length: 30 }, (_, i) => R(1 + i * 3.3, 78.3, 1.4, 3.2, '#e9e4d8', { rd: '30%' })),
  ...FILM.map((g, i) => I(2.5 + i * 16, 27, 14, 46, g, { rd: '1%' })),
  T(3, 4, 50, 7, 'ROLL 24  ·  400 ISO', 3.4, { c: '#e9a23b', ls: .15 }), T(60, 89, 37, 6, 'swipe →', 3.6, { a: 'right', c: '#e9e4d8' })]

const CLASSIC = [
  { id: 'dump', name: 'Photo dump', cat: 'Photo dump', tags: 'summer grid collage casual', S: [
    { bg: '#111', L: [I(0, 0, 100, 100, G.sun, { a: 200 }), R(0, 50, 100, 50, 'linear-gradient(transparent,rgba(0,0,0,.7))'), T(7, 66, 86, 24, 'SUMMER\nPHOTO DUMP', 15, { f: 's', wt: 900, v: 'e' }), T(7, 92, 86, 5, 'swipe →', 3.6, { ls: .2 })] },
    { bg: '#f3f0ea', L: [I(4, 3, 45.5, 46, G.sea), I(50.5, 3, 45.5, 46, G.forest), I(4, 51, 45.5, 46, G.dusk), I(50.5, 51, 45.5, 46, G.rose)] },
    { bg: '#f3f0ea', L: [I(4, 3, 92, 58, G.peak), I(4, 63, 45.5, 34, G.sun), I(50.5, 63, 45.5, 34, G.stone), T(8, 6, 50, 8, 'golden hour', 7, { f: 'h', wt: 600 })] },
    { bg: '#1b1e23', L: [T(8, 30, 84, 40, 'that’s a wrap.\nsave this for your next trip', 9, { f: 's', wt: 700, a: 'center', v: 'c' }), T(8, 88, 84, 5, '@yourhandle', 3.8, { a: 'center', c: '#9aa6ff', wt: 600 })] }] },
  { id: 'pano', name: 'Panoramic swipe', cat: 'Seamless', tags: 'panorama sunset mountains continuous one image', m: 3,
    bg: 'linear-gradient(180deg,#fcd5a5 0%,#f6a98a 45%,#c9738f 100%)', L: [
      R(36, 10, 10, 0, '#fff3c4', { circ: 1 }),
      R(0, 42, 100, 58, '#7d5a8a', { cp: '0 40%,12% 10%,25% 45%,38% 5%,52% 50%,66% 15%,80% 48%,92% 8%,100% 35%,100% 100%,0 100%' }),
      R(0, 60, 100, 40, '#3d2c5a', { cp: '0 30%,15% 0,30% 35%,45% 5%,60% 40%,75% 0,90% 30%,100% 10%,100% 100%,0 100%' }),
      T(4, 12, 28, 22, 'KEEP\nSWIPING →', 9, { f: 's', wt: 900, c: '#3d2c5a' }),
      T(37, 72, 28, 18, 'one view,\nthree slides', 8, { f: 's', wt: 700 }),
      T(70, 14, 26, 22, 'the view gets better', 8, { f: 's', wt: 900, c: '#3d2c5a' }), T(70, 88, 26, 6, '@yourhandle', 3.8, { wt: 600, a: 'right' })] },
  { id: 'pol', name: 'Polaroid scrapbook', cat: 'Scrapbook', tags: 'travel journal polaroid handwritten tape memories', S: [
    { bg: '#e8d9bd', L: [T(8, 5, 84, 12, 'trip journal', 13, { f: 'h', c: '#4a3b28', a: 'center' }), P(10, 20, 56, G.sea, -5, 'day one'), P(40, 52, 50, G.sun, 6, 'golden hour'), R(30, 18.5, 16, 3.5, 'rgba(255,240,170,.85)', { r: -5 })] },
    { bg: '#e8d9bd', L: [P(8, 8, 48, G.forest, 4, 'the hike'), P(44, 32, 48, G.dusk, -6, 'camp'), P(12, 58, 38, G.rose, 3, 'snacks'), R(24, 6.5, 14, 3.5, 'rgba(255,240,170,.85)', { r: 6 })] },
    { bg: '#e8d9bd', L: [P(20, 14, 60, G.peak, -3, 'the summit'), T(8, 72, 84, 18, 'best week ever', 14, { f: 'h', c: '#4a3b28', a: 'center', v: 'c' }), R(42, 12.5, 16, 3.5, 'rgba(255,240,170,.85)', { r: 3 })] }] },
  { id: 'film', name: 'Film strip', cat: 'Seamless', tags: '35mm roll negative retro analog continuous', m: 3, bg: '#0d0d0d', L: filmL },
  { id: 'edit', name: 'Editorial magazine', cat: 'Editorial', tags: 'magazine cover story quote travel feature', S: [
    { bg: '#f1ede4', L: [T(5, 3, 90, 14, 'VOYAGE', 20, { f: 's', wt: 900, c: '#1c1b1a', a: 'center', ls: .05 }), R(5, 19, 90, .4, '#1c1b1a'), I(5, 22, 90, 56, G.peak), T(5, 80, 62, 16, 'The Quiet Side\nof Iceland', 8, { f: 's', c: '#1c1b1a' }), T(70, 81, 25, 10, 'Issue 04\nAutumn', 3.4, { c: '#c2412d', wt: 800, a: 'right' })] },
    { bg: '#f1ede4', L: [T(6, 6, 88, 6, 'The story', 3.8, { c: '#c2412d', wt: 800 }), T(6, 14, 88, 26, '“Silence is the\nfirst thing you\nnotice.”', 9.5, { f: 's', c: '#1c1b1a' }), R(6, 43, 12, .5, '#1c1b1a'),
      T(6, 47, 41, 45, 'Past the last gas station the road narrows and the sky opens up. We drove for hours without a single car.', 3.6, { c: '#3a3733', wt: 400, lh: 1.5 }),
      T(53, 47, 41, 45, 'By dusk the fjord turned the colour of slate, and the only sound was the engine ticking as it cooled.', 3.6, { c: '#3a3733', wt: 400, lh: 1.5 })] },
    { bg: '#1c1b1a', L: [I(0, 0, 100, 78, G.forest), T(6, 82, 88, 14, 'Where to stay, what to eat,\nand when to go', 6.5, { f: 's', c: '#f1ede4' })] }] },
  { id: 'tips', name: 'Checklist tips', cat: 'Text', tags: 'tips list save infographic educational how to', S: [
    { bg: '#ff4f5e', L: [T(8, 8, 60, 6, 'Travel tips', 4, { wt: 800, ls: .05 }), T(8, 22, 84, 50, '5 things\nto do before\nyou pack', 14, { f: 's', wt: 900, v: 'c' }), T(8, 88, 70, 6, 'swipe for the list →', 3.8)] },
    { bg: '#fff6ee', L: [...['Check your passport dates', 'Download offline maps', 'Tell your bank you’re away', 'Pack a spare charger', 'Photograph your documents'].flatMap((s, i) => [
      T(8, 12 + i * 16.5, 9, 0, '✓', 5, { bg: '#ff4f5e', rd: '50%', circ: 1, a: 'center', v: 'c', wt: 800 }), T(21, 12 + i * 16.5, 72, 9, s, 5.4, { c: '#1c1b1a', v: 'c', wt: 600 })])] },
    { bg: '#1b1e23', L: [T(8, 30, 84, 40, 'Save this\nfor later', 14, { f: 's', wt: 900, v: 'c', a: 'center' }), T(8, 76, 84, 6, 'follow for more trips', 4.4, { a: 'center', c: '#9aa6ff' })] }] },
]

// Layout recipes crossed with 2026 trend palettes
const PAL = [
  { n: 'Cool Blue', t: 'frosted icy blue clean', bg: '#eaf3ff', dk: '#12345a', ink: '#12345a', acc: '#5aa9ff', f: 'n', g: [G.sea, G.peak, G.stone, G.peak] },
  { n: 'Cloud Dancer', t: 'soft white quiet luxury minimal', bg: '#f4f3ef', dk: '#2b2b2b', ink: '#2b2b2b', acc: '#d8d2c4', f: 's', g: [G.stone, G.peak, G.stone, G.sun] },
  { n: 'Khaki Coded', t: 'earthy explorer wilderkind nature', bg: '#ece7d6', dk: '#3d4a2f', ink: '#3d4a2f', acc: '#c2a35a', f: 's', g: [G.forest, G.stone, G.sun, G.forest] },
  { n: 'Poetcore', t: 'literary vintage dark academia', bg: '#f1e9dc', dk: '#2d1f1a', ink: '#2d1f1a', acc: '#a8452f', f: 's', g: [G.stone, G.dusk, G.night, G.sun] },
  { n: 'Vamp Romantic', t: 'dark glossy moody gothic opera', bg: '#150a10', dk: '#150a10', ink: '#f4e8ee', acc: '#e0457b', f: 's', g: [G.night, G.dusk, G.night, G.rose] },
  { n: 'Maximal Pop', t: 'maximalist playful colourful', bg: '#fff3c4', dk: '#1b1464', ink: '#1b1464', acc: '#ff3d81', f: 'n', g: [G.rose, G.sun, G.sea, G.dusk] },
  { n: 'Digicam Flash', t: 'y2k digicam nostalgic photo dump', bg: '#f2efe8', dk: '#16161a', ink: '#16161a', acc: '#ff453a', f: 'n', g: [G.sun, G.sea, G.rose, G.forest] },
  { n: 'Neon Noir', t: 'typography black neon bold', bg: '#0a0a0a', dk: '#0a0a0a', ink: '#fff', acc: '#c6ff00', f: 'n', g: [G.night, G.stone, G.night, G.peak] }]

const RC = [
  { n: 'Hero cover', c: 'Photo dump', ar: '4/5', f: Q => [{ bg: Q.dk, L: [I(0, 0, 100, 100, Q.g[0], { a: 200 }), R(0, 48, 100, 52, 'linear-gradient(transparent,rgba(0,0,0,.72))'), T(7, 62, 86, 28, 'Your title\ngoes here', 14, { f: Q.f, wt: 900, v: 'e' }), T(7, 93, 60, 4, 'swipe →', 3.6)] }, { bg: Q.bg, L: [T(8, 14, 84, 72, 'Tell the story in\ntwo or three lines.', 9.5, { f: Q.f, c: Q.ink, v: 'c' })] }] },
  { n: 'Stacked pair', c: 'Collage', ar: '4/5', f: Q => [{ bg: Q.bg, L: [I(5, 4, 90, 45, Q.g[0], { rd: '4%' }), I(5, 51, 90, 45, Q.g[1], { rd: '4%' }), T(9, 41, 50, 6, 'first look', 6, { f: 'h', wt: 600 }), T(9, 88, 50, 6, 'then this', 6, { f: 'h', wt: 600 })] }] },
  { n: 'Three columns', c: 'Collage', ar: '1/1', f: Q => [{ bg: Q.bg, L: [0, 1, 2].map(i => I(3 + i * 32.3, 3, 29.4, 94, Q.g[i], { rd: '3%' })) }, { bg: Q.dk, L: [T(10, 30, 80, 40, 'three moods,\none post', 12, { f: Q.f, a: 'center', v: 'c', wt: 800 })] }] },
  { n: 'Grid 2×2', c: 'Grid', ar: '1/1', f: Q => [{ bg: Q.bg, L: [I(3, 3, 46, 46, Q.g[0], { rd: '3%' }), I(51, 3, 46, 46, Q.g[1], { rd: '3%' }), I(3, 51, 46, 46, Q.g[2], { rd: '3%' }), I(51, 51, 46, 46, Q.g[3], { rd: '3%' }), T(30, 43, 40, 14, '2026', 9, { f: Q.f, wt: 900, a: 'center', v: 'c', bg: Q.acc, rd: '30%', c: Q.dk })] }] },
  { n: 'Mosaic of five', c: 'Collage', ar: '4/5', f: Q => [{ bg: Q.bg, L: [I(4, 3, 58, 44, Q.g[0], { rd: '3%' }), I(64, 3, 32, 44, Q.g[1], { rd: '3%' }), I(4, 49, 32, 28, Q.g[2], { rd: '3%' }), I(38, 49, 58, 28, Q.g[3], { rd: '3%' }), I(4, 79, 92, 18, Q.g[0], { rd: '3%' })] }] },
  { n: 'Photo dump', c: 'Photo dump', ar: '4/5', f: Q => [{ bg: Q.dk, L: [I(0, 0, 100, 100, Q.g[1], { a: 200 }), T(7, 78, 86, 16, 'weekend\ndump', 13, { f: Q.f, wt: 900, v: 'e' })] }, { bg: Q.bg, L: [I(4, 3, 45.5, 46, Q.g[0], { rd: '3%' }), I(50.5, 3, 45.5, 46, Q.g[2], { rd: '3%' }), I(4, 51, 45.5, 46, Q.g[3], { rd: '3%' }), I(50.5, 51, 45.5, 46, Q.g[1], { rd: '3%' })] }, { bg: Q.bg, L: [I(4, 3, 92, 58, Q.g[2], { rd: '3%' }), I(4, 63, 45.5, 34, Q.g[0], { rd: '3%' }), I(50.5, 63, 45.5, 34, Q.g[3], { rd: '3%' })] }, { bg: Q.dk, L: [T(8, 30, 84, 40, 'that’s a wrap.', 11, { f: Q.f, wt: 800, a: 'center', v: 'c' })] }] },
  { n: 'Story hero', c: 'Story', ar: '9/16', f: Q => [{ bg: Q.dk, L: [I(0, 0, 100, 100, Q.g[0], { a: 200 }), R(0, 55, 100, 45, 'linear-gradient(transparent,rgba(0,0,0,.7))'), T(8, 70, 84, 22, 'new\ndrop', 22, { f: Q.f, wt: 900, v: 'e' }), T(8, 93, 84, 3, 'tap to see more', 3.4)] }] },
  { n: 'Story stack', c: 'Story', ar: '9/16', f: Q => [{ bg: Q.bg, L: [I(6, 4, 88, 29, Q.g[0], { rd: '5%' }), I(6, 35, 88, 29, Q.g[1], { rd: '5%' }), I(6, 66, 88, 29, Q.g[2], { rd: '5%' }), T(10, 7, 50, 5, 'one', 5, { f: 'h', wt: 600 }), T(10, 38, 50, 5, 'two', 5, { f: 'h', wt: 600 }), T(10, 69, 50, 5, 'three', 5, { f: 'h', wt: 600 })] }] },
  { n: 'Big quote', c: 'Text', ar: '4/5', f: Q => [{ bg: Q.dk, L: [T(8, 12, 84, 64, '“Make it simple,\nbut significant.”', 11, { f: Q.f, wt: 800, v: 'c' }), R(8, 82, 12, .5, Q.acc), T(8, 86, 60, 5, 'your name', 4, { c: Q.acc, wt: 700, ls: .1 })] }, { bg: Q.bg, L: [T(8, 16, 84, 60, 'Say the second\nthing here.', 10, { f: Q.f, c: Q.ink, v: 'c' })] }] },
  { n: 'Tip list', c: 'Text', ar: '4/5', f: Q => [{ bg: Q.acc, L: [T(8, 10, 70, 6, 'quick tips', 4, { c: Q.dk, wt: 800, ls: .08 }), T(8, 22, 84, 56, '3 ways to\nlevel up', 14, { f: Q.f, wt: 900, c: Q.dk, v: 'c' })] }, { bg: Q.bg, L: [0, 1, 2].flatMap(i => [T(8, 12 + i * 28, 12, 0, String(i + 1), 7, { f: Q.f, wt: 900, bg: Q.acc, c: Q.dk, rd: '50%', circ: 1, a: 'center', v: 'c' }), T(24, 12 + i * 28, 68, 16, 'Write one clear idea per line.', 6, { c: Q.ink, wt: 600, v: 'c' })]) }] },
  { n: 'Polaroid trio', c: 'Scrapbook', ar: '4/5', f: Q => [{ bg: Q.bg, L: [T(8, 4, 84, 10, 'little moments', 12, { f: 'h', c: Q.ink, a: 'center' }), P(6, 16, 48, Q.g[0], -5, 'one'), P(46, 28, 48, Q.g[1], 5, 'two'), P(14, 58, 48, Q.g[2], -3, 'three')] }] },
  { n: 'Film row', c: 'Scrapbook', ar: '1/1', f: Q => [{ bg: '#101010', L: [R(0, 22, 100, 56, '#1a1a1a'), ...Array.from({ length: 22 }, (_, i) => R(2 + i * 4.5, 25, 2.2, 4, '#e9e4d8', { rd: '30%' })), ...Array.from({ length: 22 }, (_, i) => R(2 + i * 4.5, 71, 2.2, 4, '#e9e4d8', { rd: '30%' })), ...[0, 1, 2, 3].map(i => I(3 + i * 24, 33, 22, 34, Q.g[i], { rd: '1.5%' })), T(4, 8, 60, 6, 'ROLL 36', 4, { c: '#e9a23b', ls: .15 }), T(4, 86, 60, 6, 'frame by frame', 4, { f: 'h', c: '#e9e4d8' })] }] },
  { n: 'Editorial spread', c: 'Editorial', ar: '4/5', f: Q => [{ bg: Q.bg, L: [T(5, 3, 90, 14, 'ISSUE', 18, { f: Q.f, wt: 900, c: Q.ink, a: 'center', ls: .06 }), R(5, 19, 90, .4, Q.ink), I(5, 22, 90, 56, Q.g[0]), T(5, 80, 64, 16, 'The Cover\nStory', 8, { f: Q.f, c: Q.ink }), T(70, 81, 25, 10, 'No. 07', 3.4, { c: Q.acc, wt: 800, a: 'right' })] }, { bg: Q.bg, L: [I(0, 0, 100, 62, Q.g[2]), T(8, 66, 84, 26, '“A line worth\npulling out.”', 9, { f: Q.f, c: Q.ink, v: 'c' })] }] },
  { n: 'Circle portrait', c: 'Photo dump', ar: '4/5', f: Q => [{ bg: Q.bg, L: [I(15, 8, 70, 0, Q.g[0], { circ: 1, rd: '50%' }), T(8, 66, 84, 16, 'Hello,\nI’m here.', 11, { f: Q.f, c: Q.ink, a: 'center', wt: 800, v: 'c' }), T(8, 88, 84, 5, '@yourhandle', 4, { c: Q.acc, a: 'center', wt: 700 })] }] },
  { n: 'Circle trio', c: 'Collage', ar: '1/1', f: Q => [{ bg: Q.bg, L: [0, 1, 2].map(i => I(4 + i * 32, 30, 28, 0, Q.g[i], { circ: 1, rd: '50%' })).concat([T(8, 8, 84, 14, 'three of a kind', 9, { f: Q.f, c: Q.ink, a: 'center', v: 'c', wt: 800 })]) }] },
  { n: 'Before / after', c: 'Collage', ar: '4/5', f: Q => [{ bg: Q.bg, L: [I(4, 10, 45.5, 76, Q.g[3], { rd: '3%' }), I(50.5, 10, 45.5, 76, Q.g[0], { rd: '3%' }), T(4, 3, 45.5, 5, 'before', 4.4, { c: Q.ink, wt: 700, a: 'center' }), T(50.5, 3, 45.5, 5, 'after', 4.4, { c: Q.acc, wt: 800, a: 'center' }), T(8, 90, 84, 6, 'swipe for the details →', 4, { c: Q.ink, a: 'center' })] }] },
  { n: 'Lookbook', c: 'Editorial', ar: '4/5', f: Q => [{ bg: Q.bg, L: [I(4, 3, 92, 56, Q.g[0], { rd: '2%' }), I(4, 61, 29.3, 30, Q.g[1], { rd: '2%' }), I(35.3, 61, 29.3, 30, Q.g[2], { rd: '2%' }), I(66.6, 61, 29.3, 30, Q.g[3], { rd: '2%' }), T(4, 93, 60, 4, 'AUTUMN EDIT', 3.6, { c: Q.ink, wt: 800, ls: .15 })] }] },
  { n: 'Framed postcard', c: 'Scrapbook', ar: '1/1', f: Q => [{ bg: Q.acc, L: [R(10, 9, 80, 82, '#fff', { rd: '1%' }), I(13, 12, 74, 60, Q.g[0]), T(14, 75, 72, 12, 'wish you were here', 8, { f: 'h', c: '#4a3b28', a: 'center', v: 'c' })] }] }]

const DROP = ['Photo dump', 'Polaroid trio', 'Film row', 'Editorial spread', 'Tip list']
const photoCount = t => (t.m ? t.L : t.S.flatMap(s => s.L)).filter(l => l.t === 'i' || l.t === 'p').length

export const TEMPLATES = [
  ...CLASSIC.map(t => ({ ...t, style: 'Classic', ar: '4/5' })),
  ...RC.flatMap((r, i) => {
    if (DROP.includes(r.n)) return []
    const Q = PAL[i % PAL.length]
    return [{ id: `g${i}`, name: r.n, cat: r.c, style: Q.n, ar: r.ar, tags: `${Q.n} ${Q.t} ${r.c}`, S: r.f(Q) }]
  }),
].map(t => ({ ...t, p: photoCount(t), n: t.m || t.S.length }))

export const CATEGORY_ORDER = ['Photo dump', 'Collage', 'Grid', 'Story', 'Scrapbook', 'Editorial', 'Seamless', 'Text']
export const CATEGORIES = ['All', ...CATEGORY_ORDER.filter(c => TEMPLATES.some(t => t.cat === c))]
export const RATIO_LABEL = { '4/5': 'Portrait 4:5', '1/1': 'Square 1:1', '9/16': 'Story 9:16' }
export const RATIO_FILTERS = { All: 'All sizes', '4/5': 'Portrait', '1/1': 'Square', '9/16': 'Story' }
export const PHOTO_FILTERS = ['Any', 'Text', '1', '2', '3', '4', '5+']
export const photoFilterLabel = k => k === 'Any' ? 'Any photos' : k === 'Text' ? 'No photos' : k === '1' ? '1 photo' : k + ' photos'

export const matchesPhotos = (t, n) => n === 'Any' || (n === 'Text' ? t.p === 0 : n === '5+' ? t.p >= 5 : t.p === +n)

export const templateMeta = t => `${RATIO_LABEL[t.ar]} · ${t.p ? t.p + (t.p > 1 ? ' photos' : ' photo') : 'Text only'} · ${t.n} slide${t.n > 1 ? 's' : ''}`
