import { G, I, K, P, R, T } from './primitives.js'
import { XP } from './photos.js'

// Multi-slide carousel templates: each one tells a short story across slides.
// "m" templates are seamless: one master canvas (m slides wide) sliced into slides.
const X = (p, o = {}) => ({ photo: XP[p], ...o })
const shade = (y = 48, a = 0.72) => R(0, y, 100, 100 - y, `linear-gradient(transparent,rgba(0,0,0,${a}))`)
const tape = (x, y, r, c = 'rgba(255,240,170,.85)') => R(x, y, 16, 3.6, c, { r })

const film = (frames) => [
  R(0, 15, 100, 70, '#161616'),
  ...Array.from({ length: 30 }, (_, i) => R(1 + i * 3.3, 18.5, 1.4, 3.2, '#e9e4d8', { rd: '30%' })),
  ...Array.from({ length: 30 }, (_, i) => R(1 + i * 3.3, 78.3, 1.4, 3.2, '#e9e4d8', { rd: '30%' })),
  ...frames.map((p, i) => I(2.5 + i * 16, 27, 14, 46, G.stone, X(p, { rd: '1%' }))),
]

export const CAROUSELS = [
  {
    id: 'dump', name: 'Photo diary', cat: 'Carousels', ar: '4/5',
    tags: 'photo dump travel summer grid collage casual diary', desc: 'Cover, grid, hero plus two, sign-off',
    S: [
      { bg: '#111', L: [I(0, 0, 100, 100, G.sun, X('santorini', { a: 200 })), shade(), T(7, 64, 86, 25, 'SUMMER\nPHOTO DIARY', 14, { f: 's', wt: 900, v: 'e' }), T(7, 92, 86, 5, 'five little moments · swipe →', 3.6, { ls: 0.08 })] },
      { bg: '#f3f0ea', L: [I(4, 3, 45.5, 46, G.sea, X('beach', { rd: '2%' })), I(50.5, 3, 45.5, 46, G.sun, X('latte', { rd: '2%' })), I(4, 51, 45.5, 46, G.rose, X('friends', { rd: '2%' })), I(50.5, 51, 45.5, 46, G.sea, X('boat', { rd: '2%' }))] },
      { bg: '#f3f0ea', L: [I(4, 3, 92, 58, G.peak, X('valley', { rd: '2%' })), I(4, 63, 45.5, 34, G.sun, X('cafe', { rd: '2%' })), I(50.5, 63, 45.5, 34, G.sun, X('brunch', { rd: '2%' })), T(8, 6, 60, 8, 'golden hour, finally', 7, { f: 'h', wt: 600, ts: 0.35 })] },
      { bg: '#1b1e23', L: [T(8, 30, 84, 40, 'still thinking about\nthat last sunset.', 9, { f: 's', wt: 700, a: 'center', v: 'c' }), T(8, 88, 84, 5, '@yourhandle  ·  save for your next trip', 3.8, { a: 'center', c: '#9aa6ff', wt: 600 })] },
    ],
  },
  {
    id: 'pano', name: 'Panoramic swipe', cat: 'Seamless', ar: '4/5', m: 3, bg: '#1d2430',
    tags: 'panorama mountains continuous one image seamless landscape', desc: 'One photo sliced across 3 slides',
    L: [
      I(0, 0, 100, 100, G.peak, X('mtn')), shade(55, 0.6),
      T(3, 8, 28, 22, 'KEEP\nSWIPING →', 9, { f: 's', wt: 900, ts: 0.3 }),
      T(36, 72, 28, 18, 'one view,\nthree slides', 7.5, { f: 's', wt: 700 }),
      T(70, 76, 27, 12, 'the view gets better', 7, { f: 's', wt: 900, a: 'right' }),
      T(70, 91, 27, 5, '@yourhandle', 3.6, { wt: 600, a: 'right', c: '#d7def0' }),
    ],
  },
  {
    id: 'film', name: 'Film strip', cat: 'Seamless', ar: '4/5', m: 3, bg: '#0d0d0d',
    tags: '35mm roll negative retro analog continuous film', desc: 'Six frames across one continuous strip',
    L: [
      ...film(['island', 'latte', 'alps', 'friends2', 'venice', 'poppy']),
      T(3, 4, 50, 7, 'ROLL 24  ·  400 ISO', 3.4, { c: '#e9a23b', ls: 0.15 }),
      T(60, 89, 37, 6, 'swipe →', 3.6, { a: 'right', c: '#e9e4d8' }),
    ],
  },
  {
    id: 'pol', name: 'Polaroid journal', cat: 'Scrapbook', ar: '4/5',
    tags: 'travel journal polaroid handwritten tape memories scrapbook', desc: 'Tilted prints with handwritten captions',
    S: [
      { bg: '#e8d9bd', L: [T(8, 5, 84, 12, 'trip journal · italy', 12, { f: 'h', c: '#4a3b28', a: 'center' }), P(8, 20, 54, G.sea, -5, 'first light', XP.cinque), P(40, 50, 52, G.sun, 6, 'golden hour', XP.venice), tape(28, 18.5, -5), K('e-sparkles', 80, 14, 10)] },
      { bg: '#e8d9bd', L: [P(8, 7, 48, G.forest, 4, 'the coast road', XP.santorini), P(44, 30, 48, G.dusk, -6, 'slow mornings', XP.latte), P(12, 57, 40, G.rose, 3, 'one more pastel', XP.bouquet), tape(24, 5.5, 6), tape(62, 28.5, -4)] },
      { bg: '#e8d9bd', L: [P(20, 12, 60, G.peak, -3, 'the long way home', XP.alps), T(8, 72, 84, 18, 'already planning\nthe next one', 13, { f: 'h', c: '#4a3b28', a: 'center', v: 'c' }), tape(42, 10.5, 3), K('d-heart', 80, 70, 10, { col: '#c2412d' })] },
    ],
  },
  {
    id: 'edit', name: 'Editorial magazine', cat: 'Editorial', ar: '4/5',
    tags: 'magazine cover story quote travel feature editorial', desc: 'Cover, pull-quote spread, closer',
    S: [
      { bg: '#f1ede4', L: [T(5, 3, 90, 14, 'VOYAGE', 20, { f: 'bodo', wt: 900, c: '#1c1b1a', a: 'center', ls: 0.05 }), R(5, 19, 90, 0.4, '#1c1b1a'), I(5, 22, 90, 56, G.peak, X('moraine')), T(5, 80, 62, 16, 'The Quiet Side\nof the Rockies', 7.5, { f: 'bodo', c: '#1c1b1a' }), T(70, 81, 25, 10, 'Issue 04\nAutumn', 3.4, { c: '#c2412d', wt: 800, a: 'right' })] },
      { bg: '#f1ede4', L: [T(6, 6, 88, 6, 'The story', 3.8, { c: '#c2412d', wt: 800 }), T(6, 14, 88, 26, '“Silence is the\nfirst thing you\nnotice.”', 9.5, { f: 'bodo', c: '#1c1b1a' }), R(6, 43, 12, 0.5, '#1c1b1a'),
        T(6, 47, 41, 45, 'Past the last gas station the road narrows and the sky opens up. We drove for hours without a single car.', 3.6, { c: '#3a3733', wt: 400, lh: 1.5 }),
        I(53, 47, 41, 45, G.forest, X('mist'))] },
      { bg: '#1c1b1a', L: [I(0, 0, 100, 78, G.forest, X('canopy')), T(6, 82, 88, 14, 'Where to stay, what to eat,\nand when to go', 6.5, { f: 'bodo', c: '#f1ede4' })] },
    ],
  },
  {
    id: 'tips', name: 'Checklist tips', cat: 'Tips & text', ar: '4/5',
    tags: 'tips list save infographic educational how to checklist', desc: 'Hook, five-point checklist, save prompt',
    S: [
      { bg: '#ff4f5e', L: [I(0, 0, 100, 100, G.rose, X('map')), R(0, 0, 100, 100, 'rgba(255,79,94,.86)'), T(8, 8, 60, 6, 'TRAVEL TIPS', 4, { wt: 800, ls: 0.12 }), T(8, 22, 84, 50, '5 things\nto do before\nyou pack', 14, { f: 's', wt: 900, v: 'c' }), T(8, 88, 70, 6, 'swipe for the list →', 3.8)] },
      { bg: '#fff6ee', L: [...['Check your passport dates', 'Download offline maps', 'Tell your bank you’re away', 'Pack a spare charger', 'Photograph your documents'].flatMap((s, i) => [
        T(8, 12 + i * 16.5, 9, 0, '✓', 5, { bg: '#ff4f5e', rd: '50%', circ: 1, a: 'center', v: 'c', wt: 800 }), T(21, 12 + i * 16.5, 72, 9, s, 5.4, { c: '#1c1b1a', v: 'c', wt: 600 })])] },
      { bg: '#1b1e23', L: [T(8, 30, 84, 40, 'Save this\nfor later', 14, { f: 's', wt: 900, v: 'c', a: 'center' }), T(8, 76, 84, 6, 'follow for more trips', 4.4, { a: 'center', c: '#ff8a94' })] },
    ],
  },
  {
    id: 'quote', name: 'Quote series', cat: 'Tips & text', ar: '4/5',
    tags: 'quote words motivation big type serif photo background', desc: 'Two quotes on photo and paper',
    S: [
      { bg: '#0b0d14', L: [I(0, 0, 100, 100, G.night, X('stars')), R(0, 0, 100, 100, 'rgba(8,10,20,.45)'), T(8, 14, 84, 62, '“Make it simple,\nbut significant.”', 10.5, { f: 's', wt: 800, v: 'c', ts: 0.3 }), R(8, 82, 12, 0.5, '#ffd479'), T(8, 86, 60, 5, 'YOUR NAME', 3.6, { c: '#ffd479', wt: 700, ls: 0.14 })] },
      { bg: '#f4efe6', L: [T(8, 16, 84, 60, 'Say the second\nthing here —\nthen let it breathe.', 9, { f: 's', c: '#1f1d1a', v: 'c' }), T(8, 86, 84, 5, '@yourhandle', 3.8, { c: '#8a7f70', wt: 600 })] },
    ],
  },
  {
    id: 'before', name: 'Before / after', cat: 'Carousels', ar: '4/5',
    tags: 'before after comparison transformation edit glow up', desc: 'Side by side, then the reveal',
    S: [
      { bg: '#f5f3ef', L: [I(4, 10, 45.5, 76, G.stone, X('hazy', { rd: '3%', gs: 0.6 })), I(50.5, 10, 45.5, 76, G.sun, X('sunsetman', { rd: '3%' })), T(4, 3, 45.5, 5, 'before', 4.4, { c: '#6b6b70', wt: 700, a: 'center' }), T(50.5, 3, 45.5, 5, 'after', 4.4, { c: '#ff6a3d', wt: 800, a: 'center' }), T(8, 90, 84, 6, 'swipe for the details →', 3.8, { c: '#1d1d1f', a: 'center' })] },
      { bg: '#111', L: [I(0, 0, 100, 100, G.sun, X('sunsetman')), shade(55), T(7, 70, 86, 18, 'Same place.\nBetter light.', 9, { f: 's', wt: 800, v: 'e' }), T(7, 92, 86, 4, 'shot at 7:42 pm · no filter', 3.2, { c: '#ffd9c7' })] },
    ],
  },
  {
    id: 'storystack', name: 'City stack', cat: 'Story', ar: '9/16',
    tags: 'story vertical stack three cities travel reel', desc: 'Three-up stack and a full-bleed hero',
    S: [
      { bg: '#f4f1ea', L: [I(6, 4, 88, 29, G.sea, X('santorini', { rd: '5%' })), I(6, 35, 88, 29, G.sun, X('cinque', { rd: '5%' })), I(6, 66, 88, 29, G.peak, X('paris', { rd: '5%' })), T(10, 26, 50, 5, 'greece', 6, { f: 'h', wt: 600, ts: 0.4 }), T(10, 57, 50, 5, 'italy', 6, { f: 'h', wt: 600, ts: 0.4 }), T(10, 88, 50, 5, 'france', 6, { f: 'h', wt: 600, ts: 0.4 })] },
      { bg: '#111', L: [I(0, 0, 100, 100, G.sea, X('venice')), shade(55, 0.75), T(8, 70, 84, 20, 'next\nstop', 20, { f: 'bebas', wt: 400, v: 'e', lh: 0.9 }), T(8, 93, 84, 3, 'tap to see more', 3.4, { c: '#d6e4ff' })] },
    ],
  },
  {
    id: 'look', name: 'Lookbook', cat: 'Editorial', ar: '4/5',
    tags: 'fashion lookbook outfit edit style ootd', desc: 'Hero plus three details, then a close-up',
    S: [
      { bg: '#f2efe9', L: [I(4, 3, 92, 56, G.stone, X('denimgirl', { rd: '2%' })), I(4, 61, 29.3, 30, G.sun, X('yellow', { rd: '2%' })), I(35.3, 61, 29.3, 30, G.sun, X('shades', { rd: '2%' })), I(66.6, 61, 29.3, 30, G.sun, X('stripe', { rd: '2%' })), T(4, 93, 60, 4, 'AUTUMN EDIT', 3.6, { c: '#1d1d1f', wt: 800, ls: 0.15 }), T(60, 93, 36, 4, '01 / 02', 3.2, { c: '#8e8e93', a: 'right' })] },
      { bg: '#1d1d1f', L: [I(0, 0, 100, 100, G.rose, X('redhead')), shade(60, 0.6), T(6, 76, 88, 12, 'Soft layers,\nwarm tones.', 7, { f: 'bodo', v: 'e' }), T(6, 92, 88, 4, 'SHOP THE LOOK →', 3, { wt: 700, ls: 0.15 })] },
    ],
  },
  {
    id: 'postcard', name: 'Framed postcard', cat: 'Scrapbook', ar: '1/1',
    tags: 'postcard frame travel handwritten souvenir', desc: 'A postcard with a handwritten note',
    S: [
      { bg: '#9fc3d9', L: [R(10, 9, 80, 82, '#fff', { rd: '1%' }), I(13, 12, 74, 60, G.sea, X('santorini')), T(14, 75, 72, 12, 'wish you were here', 8, { f: 'h', c: '#4a3b28', a: 'center', v: 'c' }), K('e-sparkles', 78, 4, 12)] },
      { bg: '#9fc3d9', L: [R(10, 9, 80, 82, '#fffaf0', { rd: '1%' }), R(50, 16, 0.3, 68, '#d8cdb8'), T(15, 18, 32, 60, 'Dear you,\nthe sea is\nimpossibly blue\nand I ate too\nmuch gelato.\n\nx', 5, { f: 'h', c: '#3c3226', lh: 1.25 }), R(70, 16, 14, 16, '#e9a23b', { rd: '4%' }), T(55, 60, 30, 20, 'Your Name\n12 Somewhere St\nYour Town', 4, { f: 'h', c: '#3c3226', lh: 1.3 })] },
    ],
  },
  {
    id: 'intro', name: 'About me', cat: 'Carousels', ar: '4/5',
    tags: 'introduction about me personal brand hello creator', desc: 'Hello, three facts, follow',
    S: [
      { bg: '#f6efe7', L: [I(15, 8, 70, 0, G.rose, X('smile', { circ: 1, rd: '50%' })), T(8, 66, 84, 16, 'Hello,\nI’m Alex.', 11, { f: 's', c: '#2d1f1a', a: 'center', wt: 800, v: 'c' }), T(8, 88, 84, 5, 'photographer · coffee person', 4, { c: '#a8452f', a: 'center', wt: 700 })] },
      { bg: '#2d1f1a', L: [T(8, 8, 84, 8, '3 things about me', 5, { f: 'h', c: '#f6c9a8', wt: 600 }), ...['I shoot on a 20-year-old camera', 'I’ve lived in four countries', 'I will always order dessert'].flatMap((s, i) => [
        T(8, 24 + i * 22, 12, 0, String(i + 1), 6.5, { f: 's', wt: 900, bg: '#f6c9a8', c: '#2d1f1a', rd: '50%', circ: 1, a: 'center', v: 'c' }), T(25, 24 + i * 22, 67, 12, s, 5.6, { c: '#f6efe7', wt: 600, v: 'c' })])] },
      { bg: '#f6efe7', L: [I(6, 5, 42, 52, G.sun, X('latte', { rd: '3%' })), I(52, 5, 42, 52, G.sea, X('pier', { rd: '3%' })), T(8, 64, 84, 18, 'Stick around\nfor more.', 9, { f: 's', c: '#2d1f1a', a: 'center', v: 'c', wt: 800 }), T(8, 88, 84, 5, 'follow @yourhandle', 4, { c: '#a8452f', a: 'center', wt: 700 })] },
    ],
  },
  {
    id: 'recap', name: 'Year in review', cat: 'Carousels', ar: '1/1',
    tags: 'recap year review highlights 2026 grid summary', desc: 'Big number, grid, three moods, thanks',
    S: [
      { bg: '#111', L: [T(6, 10, 88, 60, '2026', 40, { f: 'bebas', wt: 400, a: 'center', v: 'c', c: '#c6ff00', lh: 0.9 }), T(6, 70, 88, 10, 'a year in review', 7, { f: 'h', wt: 600, a: 'center' }), T(6, 90, 88, 5, 'swipe →', 3.4, { a: 'center', c: '#8e8e93' })] },
      { bg: '#f4f3ef', L: [I(3, 3, 46, 46, G.sea, X('island', { rd: '3%' })), I(51, 3, 46, 46, G.sun, X('balloons', { rd: '3%' })), I(3, 51, 46, 46, G.forest, X('hiker2', { rd: '3%' })), I(51, 51, 46, 46, G.rose, X('friends2', { rd: '3%' })), T(32, 43, 36, 14, 'best bits', 6, { f: 'h', wt: 600, a: 'center', v: 'c', bg: '#c6ff00', rd: '30%', c: '#111' })] },
      { bg: '#f4f3ef', L: [0, 1, 2].map((i) => I(3 + i * 32.3, 3, 29.4, 80, G.stone, X(['field', 'skyline', 'surf'][i], { rd: '3%' }))).concat([T(4, 86, 92, 10, 'three moods, one year', 6, { f: 's', c: '#111', wt: 800, a: 'center', v: 'c' })]) },
      { bg: '#111', L: [T(10, 26, 80, 40, 'thanks for\nbeing here.', 10, { f: 's', a: 'center', v: 'c', wt: 800 }), T(10, 76, 80, 6, 'see you in 2027', 4.4, { a: 'center', c: '#c6ff00', wt: 700 })] },
    ],
  },
]
