// Sticker library for the editor engine (src/editor/engine.js).
// Inlined at build time as `window.STICKERS` by the Vite plugin in vite.config.js.
//
// Kinds:
//  - svg:   original vector art. `currentColor` is replaced by the chosen tint when `tint` is set.
//           Frames may declare photo windows (`win`, fractions of the sticker box). Frames sit
//           under their photo windows unless `over` is set (corners, viewfinders).
//  - emoji: Microsoft Fluent Emoji (MIT), loaded from jsDelivr with CORS so exports stay clean.
//  - els:   editable text and shape widgets inserted as a group (labels, music player, stats).

const svg = (w, h, body, extra = '') =>
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${h}"${extra}>${body}</svg>`
const line = (d, sw = 4) =>
  `<path d="${d}" fill="none" stroke="currentColor" stroke-width="${sw}" stroke-linecap="round" stroke-linejoin="round"/>`
const fill = (d) => `<path d="${d}" fill="currentColor"/>`
const sparkle = (cx, cy, r) =>
  `M${cx} ${cy - r}C${cx + r * 0.08} ${cy - r * 0.3} ${cx + r * 0.3} ${cy - r * 0.08} ${cx + r} ${cy}C${cx + r * 0.3} ${cy + r * 0.08} ${cx + r * 0.08} ${cy + r * 0.3} ${cx} ${cy + r}C${cx - r * 0.08} ${cy + r * 0.3} ${cx - r * 0.3} ${cy + r * 0.08} ${cx - r} ${cy}C${cx - r * 0.3} ${cy - r * 0.08} ${cx - r * 0.08} ${cy - r * 0.3} ${cx} ${cy - r}Z`
const HEART = 'M50 84C22 64 8 47 12 31 16 17 36 12 50 29 64 12 84 17 88 31 92 47 78 64 50 84Z'
const star = (cx, cy, R, r, n = 5) => {
  const p = []
  for (let i = 0; i < n * 2; i++) {
    const a = (Math.PI / n) * i - Math.PI / 2, d = i % 2 ? r : R
    p.push(`${(cx + Math.cos(a) * d).toFixed(1)} ${(cy + Math.sin(a) * d).toFixed(1)}`)
  }
  return `M${p.join('L')}Z`
}

const doodle = (id, n, w, h, body, o = {}) => ({ id, n, c: 'Doodles', k: 'svg', tint: 1, col: '#ffffff', a: h / w, w: o.w || 300, svg: svg(w, h, body) })

const DOODLES = [
  doodle('d-heart', 'heart outline', 100, 100, line(HEART, 4.5)),
  doodle('d-heart2', 'scribble heart', 100, 100, line(HEART, 3.5) + line('M50 76C27 59 17 46 20 33 23 22 38 19 50 33 62 19 77 22 80 33 83 46 73 59 50 76', 2.5)),
  doodle('d-heartf', 'filled heart', 100, 100, fill(HEART)),
  doodle('d-spark', 'sparkle', 100, 100, fill(sparkle(50, 50, 46)), { w: 200 }),
  doodle('d-sparks', 'sparkles trio', 120, 100, fill(sparkle(46, 56, 38)) + fill(sparkle(96, 22, 18)) + fill(sparkle(100, 78, 11)), { w: 260 }),
  doodle('d-star', 'star outline', 100, 100, line(star(50, 52, 44, 19), 4)),
  doodle('d-starf', 'star', 100, 100, fill(star(50, 52, 46, 20))),
  doodle('d-rays', 'emphasis rays', 100, 60, line('M50 50L50 12M30 52L14 26M70 52L86 26M20 58L4 50M80 58L96 50', 5)),
  doodle('d-arrow', 'curvy arrow', 120, 70, line('M8 60C30 12 78 6 108 34') + line('M92 36L109 35 104 18')),
  doodle('d-loop', 'loop arrow', 160, 80, line('M6 58C34 60 50 18 72 22 94 26 74 66 62 54 50 42 92 26 150 38') + line('M134 26L151 38 136 52'), { w: 380 }),
  doodle('d-down', 'down arrow', 60, 120, line('M30 6C10 40 52 62 30 112') + line('M16 96L30 112 44 96'), { w: 140 }),
  doodle('d-squiggle', 'squiggle underline', 220, 40, line('M6 22Q19 6 32 22T58 22 84 22 110 22 136 22 162 22 188 22 214 22', 4.5), { w: 480 }),
  doodle('d-under', 'hand underline', 240, 40, line('M6 26C60 14 160 12 234 18M30 34C90 26 150 26 200 30', 4), { w: 520 }),
  doodle('d-circle', 'scribble circle', 160, 110, line('M118 16C88 2 30 8 12 42 -2 72 40 102 92 98 140 94 160 62 148 36 138 16 104 6 70 10', 4), { w: 420 }),
  doodle('d-smile', 'smiley', 100, 100, line('M50 6A44 44 0 1 1 49.9 6Z', 4) + fill('M35 38a5 6 0 1 0 .1 0ZM65 38a5 6 0 1 0 .1 0Z') + line('M30 60C38 74 62 74 70 60', 4.5)),
  doodle('d-sun', 'sun', 100, 100, line('M50 32A18 18 0 1 1 49.9 32Z', 4) + line('M50 6V18M50 82V94M6 50H18M82 50H94M19 19L27 27M73 73L81 81M81 19L73 27M27 73L19 81', 4.5)),
  doodle('d-flower', 'daisy', 100, 100, [0, 72, 144, 216, 288].map((r) => `<ellipse cx="50" cy="26" rx="12" ry="22" transform="rotate(${r} 50 50)" fill="none" stroke="currentColor" stroke-width="3.5"/>`).join('') + '<circle cx="50" cy="50" r="9" fill="currentColor"/>'),
  doodle('d-tulip', 'tulip line', 70, 120, line('M35 116V52M35 86C22 82 14 70 14 60M35 78C48 74 56 64 56 56M14 18C14 40 22 52 35 52 48 52 56 40 56 18L45 30 35 12 25 30Z', 3.5), { w: 180 }),
  doodle('d-branch', 'leaf branch', 120, 120, line('M14 110C40 80 70 50 108 12', 3.5) + [[34, 84, -30], [52, 64, -20], [70, 44, -12], [88, 26, -6], [42, 92, 60], [62, 72, 66], [80, 52, 70]].map(([x, y, r]) => `<ellipse cx="${x}" cy="${y}" rx="6" ry="13" transform="rotate(${r} ${x} ${y})" fill="none" stroke="currentColor" stroke-width="3"/>`).join(''), { w: 260 }),
  doodle('d-crown', 'crown', 120, 80, line('M12 66L8 18 36 42 60 10 84 42 112 18 108 66Z', 4) + line('M14 74H106', 4)),
  doodle('d-bolt', 'lightning', 70, 120, line('M44 6L12 66H36L26 114 60 48H36Z', 4), { w: 160 }),
  doodle('d-cloud', 'cloud', 130, 80, line('M30 70C14 70 6 60 8 48 10 36 22 30 32 34 34 18 50 8 66 12 80 15 88 26 88 36 96 28 116 30 120 46 124 62 112 70 100 70Z', 4)),
  doodle('d-moon', 'moon and stars', 120, 100, line('M58 12A40 40 0 1 0 98 64 32 32 0 0 1 58 12Z', 4) + fill(sparkle(100, 20, 10)) + fill(sparkle(20, 22, 7))),
  doodle('d-plane', 'paper plane trail', 200, 100, line('M8 88C40 90 50 60 80 62 104 64 108 82 92 82 76 82 90 48 132 42', 3) .replace('stroke-width="3"', 'stroke-width="3" stroke-dasharray="6 9"') + line('M140 40L194 14 168 66 156 50ZM156 50L194 14', 3.5), { w: 420 }),
  doodle('d-birds', 'birds', 140, 70, line('M6 30Q20 14 32 28Q44 14 58 30M70 52Q80 40 90 50Q100 40 110 52M96 16Q104 6 112 14Q120 6 128 16', 3.5), { w: 280 }),
  doodle('d-waves', 'waves', 160, 70, line('M6 20Q24 6 42 20T78 20 114 20 150 20M6 42Q24 28 42 42T78 42 114 42 150 42M6 64Q24 50 42 64T78 64 114 64 150 64', 3.5), { w: 340 }),
  doodle('d-aster', 'asterisk', 100, 100, line('M50 8V92M14 29L86 71M86 29L14 71', 7), { w: 180 }),
  doodle('d-check', 'check', 100, 80, line('M8 44L36 70 92 10', 7), { w: 200 }),
  doodle('d-notes', 'music notes', 110, 100, line('M34 82V20L96 8V70', 4) + fill('M34 82a13 10 -15 1 1 -.1 0ZM96 70a13 10 -15 1 1 -.1 0Z') + line('M34 34L96 22', 4)),
  doodle('d-butterfly', 'butterfly', 120, 100, line('M60 30V84M60 30C58 20 52 12 46 8M60 30C62 20 68 12 74 8M58 44C40 14 6 10 8 34 10 54 36 56 58 50M62 44C80 14 114 10 112 34 110 54 84 56 62 50M58 54C42 58 22 72 30 86 38 98 54 80 58 64M62 54C78 58 98 72 90 86 82 98 66 80 62 64', 3.2)),
  doodle('d-bow', 'coquette bow', 120, 100, line('M60 40C44 20 14 8 10 28 6 48 38 52 60 40ZM60 40C76 20 106 8 110 28 114 48 82 52 60 40Z', 3.6) + line('M54 44C46 62 36 78 26 92M66 44C74 62 84 78 94 92', 3.6) + '<ellipse cx="60" cy="41" rx="7" ry="9" fill="currentColor"/>'),
  doodle('d-bowf', 'bow filled', 120, 100, fill('M60 40C44 20 14 8 10 28 6 48 38 52 60 40ZM60 40C76 20 106 8 110 28 114 48 82 52 60 40ZM55 44L24 90 36 92 60 52 84 92 96 90 65 44Z') + '<ellipse cx="60" cy="41" rx="8" ry="10" fill="currentColor"/>'),
  doodle('d-cherry', 'cherries', 100, 110, line('M30 76C34 46 48 22 72 8M70 80C68 50 66 30 72 8M72 8C82 10 92 18 92 28 80 30 72 22 72 8', 3.5) + '<circle cx="28" cy="88" r="14" fill="currentColor"/><circle cx="70" cy="92" r="14" fill="currentColor"/>', { w: 220 }),
  doodle('d-quote', 'quote marks', 110, 80, fill('M10 74V44C10 22 22 8 44 6V20C32 24 28 32 28 42H44V74ZM62 74V44C62 22 74 8 96 6V20C84 24 80 32 80 42H96V74Z'), { w: 200 }),
  doodle('d-bubble', 'speech bubble', 120, 100, line('M60 8C30 8 8 26 8 46 8 58 15 68 26 75L20 94 44 82C49 83 55 84 60 84 90 84 112 66 112 46 112 26 90 8 60 8Z', 4)),
  doodle('d-pin', 'location pin', 80, 110, line('M40 104C40 104 8 66 8 40A32 32 0 0 1 72 40C72 66 40 104 40 104Z', 4.5) + line('M40 28A12 12 0 1 1 39.9 28Z', 4), { w: 160 }),
  doodle('d-camera', 'camera', 120, 90, line('M10 30C10 24 14 20 20 20H36L44 8H76L84 20H100C106 20 110 24 110 30V74C110 80 106 84 100 84H20C14 84 10 80 10 74Z', 4) + line('M60 34A17 17 0 1 1 59.9 34Z', 4) + fill('M94 30a4 4 0 1 0 .1 0Z')),
  doodle('d-spiral', 'spiral', 100, 100, line('M50 50C50 46 56 46 56 52 56 60 44 60 42 50 40 38 58 34 64 46 72 62 54 74 40 68 22 60 24 34 42 26 64 16 86 32 84 56 82 80 56 94 32 86', 3.5)),
  doodle('d-scribble', 'scribble', 160, 60, line('M8 44C20 10 30 10 26 36 22 60 44 8 50 30 56 52 66 8 74 30 82 52 92 10 100 32 108 54 118 10 126 32 132 50 144 20 152 26', 3.5), { w: 360 }),
  doodle('d-dots', 'dotted path', 200, 90, '<path d="M8 80C40 82 50 40 90 44 126 48 120 82 150 70 172 62 176 30 192 14" fill="none" stroke="currentColor" stroke-width="5" stroke-linecap="round" stroke-dasharray="0.1 14"/>', { w: 400 }),
  doodle('d-route', 'run route', 160, 160, line('M24 140C10 112 34 104 30 80 26 54 6 44 22 26 38 8 66 22 70 40 74 58 96 54 104 40 114 22 142 26 148 48 154 70 128 78 126 98 124 118 150 120 140 140 130 154 100 150 86 136 72 122 46 152 24 140Z', 6) + '<circle cx="24" cy="140" r="8" fill="currentColor"/>', { w: 360 }),
]
DOODLES.find((d) => d.id === 'd-route').col = '#ff6a2b'

// Washi and masking tape with torn ends, generated once at build time.
const torn = (w, h, seed) => {
  let s = seed
  const r = () => ((s = (s * 9301 + 49297) % 233280) / 233280)
  const L = [], R = []
  for (let y = 0; y <= h; y += h / 7) {
    L.push(`${(4 + r() * 6).toFixed(1)} ${y.toFixed(1)}`)
    R.push(`${(w - 4 - r() * 6).toFixed(1)} ${(h - y).toFixed(1)}`)
  }
  return `M${L.join('L')}L${R.join('L')}Z`
}
const tape = (id, n, base, overlay = '', o = 0.86) => {
  const d = torn(220, 60, id.length * 97 + n.length * 13)
  return {
    id, n, c: 'Tape', k: 'svg', a: 60 / 220, w: 360,
    svg: svg(220, 60, `<defs><clipPath id="c"><path d="${d}"/></clipPath></defs><g clip-path="url(#c)" opacity="${o}"><rect width="220" height="60" fill="${base}"/>${overlay}</g>`),
  }
}
const stripes = (c, sw = 10, gap = 20) => Array.from({ length: 24 }, (_, i) => `<path d="M${i * gap - 60} 70L${i * gap} -10" stroke="${c}" stroke-width="${sw}"/>`).join('')
const dots = (c, r = 3.2) => Array.from({ length: 60 }, (_, i) => `<circle cx="${(i % 15) * 16 + ((i / 15 | 0) % 2) * 8}" cy="${(i / 15 | 0) * 16 + 6}" r="${r}" fill="${c}"/>`).join('')
const grid = (c) => Array.from({ length: 23 }, (_, i) => `<path d="M${i * 10} 0V60" stroke="${c}" stroke-width="1"/>`).join('') + Array.from({ length: 7 }, (_, i) => `<path d="M0 ${i * 10}H220" stroke="${c}" stroke-width="1"/>`).join('')
const gingham = (c) => Array.from({ length: 12 }, (_, i) => `<rect x="${i * 20}" width="10" height="60" fill="${c}" opacity=".45"/>`).join('') + Array.from({ length: 3 }, (_, i) => `<rect y="${i * 20}" width="220" height="10" fill="${c}" opacity=".45"/>`).join('')
const TAPES = [
  tape('t-masking', 'masking tape cream', '#efe6cf', '', 0.92),
  tape('t-clear', 'clear tape', '#ffffff', '', 0.5),
  tape('t-kraft', 'kraft tape', '#c9a477', '', 0.95),
  tape('t-pink', 'washi pink', '#f5c4cf'),
  tape('t-sage', 'washi sage', '#bccbaa'),
  tape('t-butter', 'washi butter', '#f3e3a3'),
  tape('t-sky', 'washi sky', '#bcd5ec'),
  tape('t-lilac', 'washi lilac', '#d3c6ea'),
  tape('t-stripe', 'striped tape', '#fbf7ef', stripes('#e8a7b4', 7, 18)),
  tape('t-stripeblue', 'blue stripe tape', '#f6f8fb', stripes('#7aa2d6', 7, 18)),
  tape('t-grid', 'grid tape', '#f4efe3', grid('#9eb6cf')),
  tape('t-dots', 'polka dot tape', '#f8d9df', dots('#ffffff')),
  tape('t-dotsblack', 'black dot tape', '#f4efe6', dots('#222', 2.6)),
  tape('t-gingham', 'gingham tape red', '#ffffff', gingham('#d9473f')),
  tape('t-ginghamblue', 'gingham tape blue', '#ffffff', gingham('#5f8fd1')),
  tape('t-black', 'black tape', '#1c1c1e', '', 0.92),
]

// Paper backgrounds: drop in, then send to back.
const paper = (id, n, body) => ({ id, n, c: 'Paper', k: 'svg', a: 1.25, w: 1080, bg: 1, svg: svg(400, 500, body) })
const PAPERS = [
  paper('p-gingham', 'gingham blue', `<rect width="400" height="500" fill="#ffffff"/>${Array.from({ length: 20 }, (_, i) => `<rect x="${i * 20}" width="10" height="500" fill="#a9c4ea" opacity=".45"/>`).join('')}${Array.from({ length: 25 }, (_, i) => `<rect y="${i * 20}" width="400" height="10" fill="#a9c4ea" opacity=".45"/>`).join('')}`),
  paper('p-ginghampink', 'gingham pink', `<rect width="400" height="500" fill="#ffffff"/>${Array.from({ length: 20 }, (_, i) => `<rect x="${i * 20}" width="10" height="500" fill="#f2b6c4" opacity=".45"/>`).join('')}${Array.from({ length: 25 }, (_, i) => `<rect y="${i * 20}" width="400" height="10" fill="#f2b6c4" opacity=".45"/>`).join('')}`),
  paper('p-grid', 'grid paper', `<rect width="400" height="500" fill="#fbfaf6"/>${Array.from({ length: 21 }, (_, i) => `<path d="M${i * 20} 0V500" stroke="#c9d6e6" stroke-width="1"/>`).join('')}${Array.from({ length: 26 }, (_, i) => `<path d="M0 ${i * 20}H400" stroke="#c9d6e6" stroke-width="1"/>`).join('')}`),
  paper('p-lined', 'notebook lined', `<rect width="400" height="500" fill="#fffdf6"/>${Array.from({ length: 22 }, (_, i) => `<path d="M0 ${60 + i * 20}H400" stroke="#bfd3ea" stroke-width="1.2"/>`).join('')}<path d="M52 0V500" stroke="#f1a3a3" stroke-width="1.4"/>`),
  paper('p-dot', 'dot grid', `<rect width="400" height="500" fill="#faf8f3"/>${Array.from({ length: 500 }, (_, i) => `<circle cx="${10 + (i % 20) * 20}" cy="${10 + (i / 20 | 0) * 20}" r="1.3" fill="#b9b4a8"/>`).join('')}`),
  paper('p-kraft', 'kraft paper', `<rect width="400" height="500" fill="#c8a57a"/>${Array.from({ length: 140 }, (_, i) => `<circle cx="${(i * 73) % 400}" cy="${(i * 131) % 500}" r="${1 + (i % 3)}" fill="#a9845a" opacity=".35"/>`).join('')}`),
  paper('p-cream', 'cream linen', `<rect width="400" height="500" fill="#f3ecdf"/>${Array.from({ length: 50 }, (_, i) => `<path d="M0 ${i * 10}H400" stroke="#e6dccb" stroke-width=".8"/>`).join('')}`),
  paper('p-butter', 'butter yellow', `<rect width="400" height="500" fill="#f5f0c4"/>`),
]

// Torn paper: ripped strips, edges and scraps. Each piece has a bright fibrous rim (the paper's core
// exposed by the tear) around a slightly inset surface, which is what makes a rip read as real.
const seeded = (seed) => { let s = seed % 233280; return () => ((s = (s * 9301 + 49297) % 233280) / 233280) }
const ragged = (w, h, sides, amp, seed, step = 5) => {
  const r = seeded(seed), out = []
  const edges = [['t', 0, 0, w, 0, 0, 1], ['r', w, 0, w, h, -1, 0], ['b', w, h, 0, h, 0, -1], ['l', 0, h, 0, 0, 1, 0]]
  for (const [k, x0, y0, x1, y1, nx, ny] of edges) {
    if (!sides.includes(k)) { out.push([x0, y0]); continue }
    const len = Math.hypot(x1 - x0, y1 - y0), n = Math.max(4, Math.ceil(len / step)), f1 = 0.05 + r() * 0.05, f2 = 0.21 + r() * 0.1, p1 = r() * 6, p2 = r() * 6
    for (let i = 0; i < n; i++) {
      let d = 0.5 + 0.3 * Math.sin(i * f1 * step + p1) + 0.16 * Math.sin(i * f2 * step + p2) + (r() - 0.5) * 0.42
      if (r() > 0.93) d += 0.35 * r()
      d = Math.max(0.04, Math.min(1, d)) * amp
      const t = i / n
      out.push([x0 + (x1 - x0) * t + nx * d, y0 + (y1 - y0) * t + ny * d])
    }
  }
  return 'M' + out.map(([x, y]) => `${x.toFixed(1)} ${y.toFixed(1)}`).join('L') + 'Z'
}
const ripShadow = '<filter id="rs" x="-5%" y="-30%" width="110%" height="160%"><feDropShadow dx="0" dy="1.6" stdDeviation="1.8" flood-opacity=".28"/></filter>'
const rip = (id, n, w, h, sides, o = {}) => {
  const amp = o.amp || 7, seed = [...id].reduce((a, c) => a * 31 + c.charCodeAt(0), 7) % 99991
  const px = o.full ? 0 : 6, py = 6, rim = ragged(w, h, sides, amp, seed), face = ragged(w, h, sides, amp * 1.9, seed + 17)
  const body = `<defs>${ripShadow}<clipPath id="f"><path d="${face}"/></clipPath></defs><g transform="translate(${px} ${py})"><path d="${rim}" fill="${o.rim || '#ffffff'}" filter="url(#rs)"/><g clip-path="url(#f)"><rect width="${w}" height="${h}" fill="${o.fill || '#f3f0e8'}"/>${o.body || ''}</g></g>`
  return { id, n, c: 'Torn paper', k: 'svg', a: (h + py * 2) / (w + px * 2), w: o.w || 600, ...(o.win ? { win: o.win } : {}), svg: svg(w + px * 2, h + py * 2, body) }
}
const ruled = (w, h, gap, c, m) => Array.from({ length: Math.floor(h / gap) }, (_, i) => `<path d="M0 ${(i + 1) * gap}H${w}" stroke="${c}" stroke-width="1.2"/>`).join('') + (m ? `<path d="M${m} 0V${h}" stroke="#ef9a9a" stroke-width="1.4"/>` : '')
const print = (w, h, c) => Array.from({ length: Math.floor((h - 16) / 9) }, (_, i) => `<path d="M14 ${14 + i * 9}H${(w - 14 - ((i * 37) % 5) * 9).toFixed(0)}" stroke="${c}" stroke-width="3.6" stroke-dasharray="${18 + (i % 3) * 6} 4 ${10 + (i % 4) * 5} 4"/>`).join('')
const ripHole = (x, y, w, h, seed) => `${ragged(w, h, 'trbl', 10, seed).replace(/(-?\d+\.?\d*) (-?\d+\.?\d*)/g, (_, a, b) => `${(+a + x).toFixed(1)} ${(+b + y).toFixed(1)}`)}`
const TORN = [
  rip('tp-strip', 'white torn strip', 1000, 90, 'tb', { full: 1, w: 1080 }),
  rip('tp-edge-dn', 'ripped edge top', 1000, 70, 'b', { full: 1, w: 1080, amp: 9 }),
  rip('tp-edge-up', 'ripped edge bottom', 1000, 70, 't', { full: 1, w: 1080, amp: 9 }),
  rip('tp-thin', 'thin rip line', 1000, 34, 'tb', { full: 1, w: 1080, amp: 6 }),
  rip('tp-cream', 'cream torn strip', 1000, 90, 'tb', { full: 1, w: 1080, fill: '#efe6d2', rim: '#fbf8f1' }),
  rip('tp-black', 'black torn strip', 1000, 90, 'tb', { full: 1, w: 1080, fill: '#1c1c1e', rim: '#e8e4dc' }),
  rip('tp-kraft', 'kraft torn strip', 1000, 90, 'tb', { full: 1, w: 1080, fill: '#c6a173', rim: '#efe2cb' }),
  rip('tp-pink', 'pink torn strip', 1000, 90, 'tb', { full: 1, w: 1080, fill: '#f6c9d2', rim: '#fff7f8' }),
  rip('tp-scrap', 'white paper scrap', 300, 200, 'trbl', { w: 420 }),
  rip('tp-note', 'torn notebook page', 300, 360, 'tb', { w: 460, fill: '#fffdf6', body: ruled(300, 360, 22, '#bfd3ea', 34) }),
  rip('tp-grid', 'torn grid paper', 300, 240, 'trbl', { w: 440, fill: '#fbfaf6', body: ruled(300, 240, 14, '#cfdbe9') + Array.from({ length: 22 }, (_, i) => `<path d="M${i * 14} 0V240" stroke="#cfdbe9" stroke-width="1.2"/>`).join('') }),
  rip('tp-news', 'torn newsprint', 320, 220, 'trbl', { w: 440, fill: '#ebe7de', rim: '#f8f6f1', body: print(320, 220, '#4a4741') }),
  rip('tp-kscrap', 'kraft scrap', 300, 200, 'trbl', { w: 420, fill: '#c6a173', rim: '#efe2cb' }),
  rip('tp-label', 'torn label', 400, 90, 'lr', { w: 520, fill: '#ffffff', amp: 8 }),
  { id: 'tp-hole', n: 'torn hole frame', c: 'Torn paper', k: 'svg', a: 512 / 412, w: 1080, win: [[62 / 412, 82 / 512, 288 / 412, 308 / 512]],
    svg: svg(412, 512, `<defs>${ripShadow}</defs><g transform="translate(6 6)"><path d="M0 0H400V500H0Z${ripHole(60, 80, 280, 300, 991)}" fill="#ffffff" fill-rule="evenodd" filter="url(#rs)"/><path d="M0 0H400V500H0Z${ripHole(50, 70, 300, 320, 377)}" fill="#f3f0e8" fill-rule="evenodd"/></g>`) },
]

// Frames. `win` is the photo window, as fractions of the frame box.
const shadow = '<filter id="s" x="-10%" y="-10%" width="120%" height="120%"><feDropShadow dx="0" dy="2" stdDeviation="2.5" flood-opacity=".22"/></filter>'
const frame = (id, n, w, h, body, win, o = {}) => ({ id, n, c: 'Frames', k: 'svg', a: h / w, w: o.w || 560, win, over: o.over || 0, tint: o.tint || 0, col: o.col, svg: svg(w, h, `<defs>${shadow}</defs>${body}`) })
const hole = (W, H, x, y, w, h, r = 0) => `M0 0H${W}V${H}H0Z M${x + r} ${y}H${x + w - r}Q${x + w} ${y} ${x + w} ${y + r}V${y + h - r}Q${x + w} ${y + h} ${x + w - r} ${y + h}H${x + r}Q${x} ${y + h} ${x} ${y + h - r}V${y + r}Q${x} ${y} ${x + r} ${y}Z`
const FRAMES = [
  frame('f-polaroid', 'polaroid', 92, 110, `<path d="${hole(88, 106, 6, 6, 76, 76)}" transform="translate(2 1)" fill="#fdfcf8" fill-rule="evenodd" filter="url(#s)"/>`, [[8 / 92, 7 / 110, 76 / 92, 76 / 110]]),
  frame('f-instax', 'instax mini', 60, 92, `<path d="${hole(56, 88, 4, 6, 48, 64, 1.5)}" transform="translate(2 1)" fill="#ffffff" fill-rule="evenodd" filter="url(#s)"/>`, [[6 / 60, 7 / 92, 48 / 60, 64 / 92]], { w: 420 }),
  frame('f-instaxsq', 'instax square', 78, 92, `<path d="${hole(74, 88, 5, 6, 64, 64, 1)}" transform="translate(2 1)" fill="#ffffff" fill-rule="evenodd" filter="url(#s)"/>`, [[7 / 78, 7 / 92, 64 / 78, 64 / 92]]),
  frame('f-print', 'white border print', 108, 80, `<path d="${hole(104, 76, 5, 5, 94, 66)}" transform="translate(2 1)" fill="#ffffff" fill-rule="evenodd" filter="url(#s)"/>`, [[7 / 108, 6 / 80, 94 / 108, 66 / 80]], { w: 760 }),
  frame('f-stamp', 'postage stamp', 84, 104, `<mask id="p"><rect width="84" height="104" fill="#fff"/>${Array.from({ length: 10 }, (_, i) => `<circle cx="${4 + i * 8.44}" cy="3" r="2.6"/><circle cx="${4 + i * 8.44}" cy="101" r="2.6"/>`).join('')}${Array.from({ length: 13 }, (_, i) => `<circle cx="3" cy="${4 + i * 8}" r="2.6"/><circle cx="81" cy="${4 + i * 8}" r="2.6"/>`).join('')}</mask><g filter="url(#s)"><rect x="1" y="1" width="82" height="102" fill="#fffdf7" mask="url(#p)"/></g><rect x="10" y="10" width="64" height="72" fill="#e9e2d2"/><path d="M10 90H48" stroke="#b8ad97" stroke-width="2"/><text x="74" y="94" font-family="Georgia,serif" font-size="9" text-anchor="end" fill="#8a7d64">26¢</text>`, [[10 / 84, 10 / 104, 64 / 84, 72 / 104]], { w: 360 }),
  frame('f-film', 'film strip', 70, 200, `<rect width="70" height="200" rx="2" fill="#141414"/>${Array.from({ length: 16 }, (_, i) => `<rect x="4" y="${6 + i * 12.2}" width="6" height="7" rx="1.2" fill="#e9e4d8"/><rect x="60" y="${6 + i * 12.2}" width="6" height="7" rx="1.2" fill="#e9e4d8"/>`).join('')}${[0, 1, 2].map((i) => `<rect x="14" y="${8 + i * 64}" width="42" height="56" fill="#2a2a2a"/>`).join('')}`, [0, 1, 2].map((i) => [14 / 70, (8 + i * 64) / 200, 42 / 70, 56 / 200]), { w: 300 }),
  frame('f-filmh', 'film strip wide', 220, 70, `<rect width="220" height="70" rx="2" fill="#141414"/>${Array.from({ length: 18 }, (_, i) => `<rect x="${5 + i * 12.2}" y="4" width="7" height="6" rx="1.2" fill="#e9e4d8"/><rect x="${5 + i * 12.2}" y="60" width="7" height="6" rx="1.2" fill="#e9e4d8"/>`).join('')}${[0, 1, 2].map((i) => `<rect x="${8 + i * 70}" y="14" width="64" height="42" fill="#2a2a2a"/>`).join('')}`, [0, 1, 2].map((i) => [(8 + i * 70) / 220, 14 / 70, 64 / 220, 42 / 70]), { w: 900 }),
  frame('f-slide', '35mm slide', 100, 100, `<g filter="url(#s)"><path d="${hole(96, 96, 18, 22, 60, 46, 3)}" transform="translate(2 1)" fill="#f4f1ea" fill-rule="evenodd"/></g><path d="M22 84H58" stroke="#c9c2b2" stroke-width="2.5"/><text x="80" y="86" font-family="Menlo,monospace" font-size="7" fill="#a49b88" text-anchor="end">36</text>`, [[20 / 100, 23 / 100, 60 / 100, 46 / 100]], { w: 420 }),
  frame('f-digicam', 'digicam', 160, 104, `<g filter="url(#s)"><rect x="3" y="6" width="154" height="94" rx="14" fill="#d9dbde"/><rect x="3" y="6" width="154" height="94" rx="14" fill="url(#m)"/></g><defs><linearGradient id="m" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#f4f5f7"/><stop offset=".55" stop-color="#c9ccd1"/><stop offset="1" stop-color="#a9adb3"/></linearGradient></defs><rect x="14" y="16" width="98" height="74" rx="4" fill="#1b1d20"/><rect x="18" y="20" width="90" height="66" fill="#2a2d31"/><rect x="40" y="0" width="22" height="7" rx="2" fill="#b4b8be"/><rect x="104" y="1" width="12" height="6" rx="2" fill="#9ea3aa"/><circle cx="135" cy="30" r="9" fill="#bfc3c9" stroke="#8d929a" stroke-width="1.5"/><circle cx="135" cy="30" r="3.5" fill="#8d929a"/><circle cx="135" cy="58" r="12" fill="#c6cace" stroke="#8d929a" stroke-width="1.5"/><circle cx="135" cy="58" r="4.5" fill="#a5aab1"/><rect x="124" y="78" width="9" height="5" rx="1.5" fill="#8d929a"/><rect x="137" y="78" width="9" height="5" rx="1.5" fill="#8d929a"/><text x="22" y="98" font-family="Helvetica,Arial,sans-serif" font-size="5.5" font-weight="700" fill="#7c8189" letter-spacing=".8">CYBERSHOT</text>`, [[18 / 160, 20 / 104, 90 / 160, 66 / 104]], { w: 640 }),
  frame('f-postcard', 'postcard', 160, 104, `<g filter="url(#s)"><rect x="2" y="2" width="156" height="100" rx="1.5" fill="#fbf8f0"/></g><rect x="10" y="10" width="70" height="84" fill="#e8e1d1"/><path d="M88 10V94" stroke="#d8cfbb" stroke-width="1"/>${[44, 58, 72, 86].map((y) => `<path d="M96 ${y}H150" stroke="#cdc3ad" stroke-width="1"/>`).join('')}<rect x="128" y="12" width="22" height="26" fill="none" stroke="#c4b89e" stroke-width="1" stroke-dasharray="2 2"/><text x="96" y="24" font-family="Georgia,serif" font-style="italic" font-size="8" fill="#9a8c70">Post Card</text>`, [[10 / 160, 10 / 104, 70 / 160, 84 / 104]], { w: 760 }),
  frame('f-ticket', 'ticket', 180, 80, `<g filter="url(#s)"><path d="M4 4H176V30A10 10 0 0 0 176 50V76H4V50A10 10 0 0 0 4 30Z" fill="#f7f2e6"/></g><rect x="12" y="12" width="96" height="56" fill="#e6dfcf"/><path d="M118 10V70" stroke="#c9bfa8" stroke-width="1.2" stroke-dasharray="3 3"/><text x="148" y="34" font-family="Helvetica,Arial,sans-serif" font-weight="700" font-size="9" fill="#5c5442" text-anchor="middle" letter-spacing="1.5">ADMIT</text><text x="148" y="50" font-family="Helvetica,Arial,sans-serif" font-weight="700" font-size="14" fill="#5c5442" text-anchor="middle">ONE</text>`, [[12 / 180, 12 / 80, 96 / 180, 56 / 80]], { w: 760 }),
  frame('f-arch', 'arch window', 100, 130, `<g filter="url(#s)"><path d="M2 2H98V128H2Z M14 120V56A36 36 0 0 1 86 56V120Z" fill="#f3ece0" fill-rule="evenodd"/></g>`, [[14 / 100, 20 / 130, 72 / 100, 100 / 130]], { w: 520 }),
  frame('f-corners', 'photo corners', 100, 100, ['M0 0H24L0 24Z', 'M100 0V24L76 0Z', 'M0 100V76L24 100Z', 'M100 100H76L100 76Z'].map((d) => `<path d="${d}" fill="currentColor"/>`).join(''), [[0, 0, 1, 1]], { over: 1, tint: 1, col: '#1c1c1e', w: 560 }),
  frame('f-viewfinder', 'viewfinder REC', 160, 120, line('M6 30V6H30M130 6H154V30M154 90V114H130M30 114H6V90', 3) + '<circle cx="22" cy="22" r="5" fill="#ff3b30"/><text x="32" y="26" font-family="Helvetica,Arial,sans-serif" font-weight="700" font-size="10" fill="currentColor">REC</text><rect x="122" y="16" width="22" height="11" rx="2" fill="none" stroke="currentColor" stroke-width="1.6"/><rect x="124" y="18" width="14" height="7" fill="currentColor"/>' + line('M74 60H86M80 54V66', 1.6), [[0, 0, 1, 1]], { over: 1, tint: 1, col: '#ffffff', w: 900 }),
  frame('f-ring', 'circle frame', 100, 100, `<g filter="url(#s)"><path d="M50 2A48 48 0 1 1 49.9 2ZM50 10A40 40 0 1 0 50.1 10Z" fill="#fdfcf8" fill-rule="evenodd"/></g>`, [[10 / 100, 10 / 100, 80 / 100, 80 / 100]], { w: 440 }),
  frame('f-torn', 'torn paper note', 120, 100, `<g filter="url(#s)"><path d="${torn(120, 100, 7).replace(/L/g, ' L')}" fill="#fffdf5"/></g>`, null, { w: 520 }),
]

// Microsoft Fluent Emoji (MIT). Names are the asset folder names; all verified on jsDelivr.
const EMOJI = {
  Flowers: ['Tulip', 'Cherry blossom', 'Rose', 'Sunflower', 'Hibiscus', 'Blossom', 'Bouquet', 'Lotus', 'Four leaf clover', 'Fallen leaf', 'Maple leaf', 'Herb', 'Seedling', 'Palm tree', 'Cactus', 'Mushroom', 'Butterfly', 'Dove', 'Spiral shell'],
  Sky: ['Sun', 'Sun with face', 'Crescent moon', 'Glowing star', 'Star', 'Sparkles', 'Dizzy', 'Rainbow', 'Cloud', 'Snowflake', 'Fire', 'Droplet', 'Water wave', 'Ice'],
  Hearts: ['Red heart', 'Pink heart', 'Light blue heart', 'Green heart', 'Purple heart', 'White heart', 'Black heart', 'Brown heart', 'Sparkling heart', 'Two hearts', 'Revolving hearts', 'Heart with ribbon', 'Kiss mark'],
  Faces: ['Smiling face with heart-eyes', 'Smiling face with hearts', 'Star-struck', 'Face holding back tears', 'Melting face', 'Smiling face with sunglasses', 'Face with tears of joy', 'Pleading face', 'Partying face', 'Face blowing a kiss', 'Ghost', 'Eyes'],
  Travel: ['Airplane', 'Camera', 'Camera with flash', 'Film frames', 'Globe showing europe-africa', 'World map', 'Compass', 'Beach with umbrella', 'Desert island', 'Snow-capped mountain', 'Sunrise', 'Sunset', 'Tent', 'Luggage', 'Admission tickets', 'Round pushpin', 'Sailboat', 'Bicycle', 'Hot springs', 'Rocket'],
  Food: ['Hot beverage', 'Teacup without handle', 'Mate', 'Croissant', 'Strawberry', 'Cherries', 'Peach', 'Lemon', 'Watermelon', 'Avocado', 'Pizza', 'Sushi', 'Doughnut', 'Cookie', 'Shortcake', 'Birthday cake', 'Soft ice cream', 'Cocktail glass', 'Tropical drink', 'Clinking glasses', 'Wine glass'],
  Things: ['Pushpin', 'Paperclip', 'Ribbon', 'Wrapped gift', 'Party popper', 'Confetti ball', 'Mirror ball', 'Crown', 'Gem stone', 'Ring', 'Sunglasses', 'Lipstick', 'Shopping bags', 'Musical notes', 'Headphone', 'Teddy bear', 'Dog face', 'Cat face', 'Books', 'Memo', 'Envelope', 'Calendar', 'Light bulb', 'Candle', 'Skateboard', 'Speech balloon', 'Check mark button', 'Hollow red circle', 'Bow and arrow'],
}
const EMOJIS = Object.entries(EMOJI).flatMap(([c, L]) => L.map((u) => ({ id: 'e-' + u.toLowerCase().replace(/[^a-z0-9]+/g, '-'), n: u.toLowerCase(), c, k: 'emoji', u, a: 1, w: 200 })))

// Editable widgets. Coordinates are px at the given width; text uses editor font keys.
const T = (x, y, w, h, text, fs, o = {}) => ({ type: 'text', x, y, w, h, text, fs, f: 'n', wt: 600, c: '#ffffff', a: 'left', v: 'c', ls: 0, lh: 1.15, bg: '', rd: 0, ...o })
const B = (x, y, w, h, fill, o = {}) => ({ type: 'shape', x, y, w, h, fill, cp: '', rd: 0, ...o })
const label = (id, n, els, w) => ({ id, n, c: 'Labels', k: 'els', els, w })
const LABELS = [
  label('l-dump', 'photo dump pill', [T(0, 0, 360, 84, 'photo dump', 40, { bg: '#111111', rd: 42, a: 'center', wt: 600, f: 'inter' })], 360),
  label('l-pov', 'POV caption', [T(0, 0, 640, 140, 'POV: you finally\nbooked the trip', 48, { f: 'inter', wt: 700, ts: 0.35, tblur: 10, tc: '#000000' })], 640),
  label('l-date', 'digicam date stamp', [T(0, 0, 420, 70, "'26 10 25", 52, { f: 'roboto', wt: 500, c: '#ff9a3c', ts: 0.85, tblur: 8, tc: '#ff5a00', ls: 0.04 })], 420),
  label('l-time', 'digicam time', [T(0, 0, 300, 60, '11:11 PM', 44, { f: 'roboto', wt: 500, c: '#ff9a3c', ts: 0.85, tblur: 8, tc: '#ff5a00' })], 300),
  label('l-loc', 'location chip', [T(0, 0, 420, 76, '📍 Amalfi, Italy', 34, { bg: '#ffffff', c: '#111111', rd: 38, a: 'center', wt: 600, f: 'inter' })], 420),
  label('l-swipe', 'swipe pill', [T(0, 0, 260, 72, 'swipe  →', 32, { bg: 'rgba(255,255,255,.28)', rd: 36, a: 'center', wt: 600, f: 'inter' })], 260),
  label('l-chapter', 'chapter caption', [T(0, 0, 640, 50, 'C H A P T E R   O N E', 26, { f: 'bodo', wt: 400, a: 'center', ls: 0.12 }), B(270, 70, 100, 2, '#ffffff')], 640),
  label('l-script', 'script word', [T(0, 0, 620, 200, 'summer', 150, { f: 'dance', wt: 700, a: 'center', ts: 0.25, tblur: 12, tc: '#000000' })], 620),
  label('l-poster', 'poster headline', [T(0, 0, 900, 220, 'NEVER STOP\nEXPLORING', 100, { f: 'bebas', wt: 400, a: 'center', lh: 1 })], 900),
  label('l-stats', 'run stats', [
    T(0, 0, 240, 36, 'Distance', 26, { f: 'inter', wt: 500, o: 0.85 }), T(0, 36, 240, 80, '10.24 km', 60, { f: 'inter', wt: 800 }),
    T(270, 0, 220, 36, 'Pace', 26, { f: 'inter', wt: 500, o: 0.85 }), T(270, 36, 220, 80, "5'12\"", 60, { f: 'inter', wt: 800 }),
    T(520, 0, 220, 36, 'Time', 26, { f: 'inter', wt: 500, o: 0.85 }), T(520, 36, 220, 80, '53m 10s', 60, { f: 'inter', wt: 800 }),
  ], 740),
  label('l-music', 'now playing', [
    B(0, 0, 720, 230, 'rgba(18,18,20,.62)', { rd: 40 }), B(28, 28, 110, 110, 'linear-gradient(135deg,#ffb36b,#ff5e7e)', { rd: 16 }),
    T(160, 34, 520, 50, 'Anywhere Anything', 36, { wt: 700, f: 'inter' }), T(160, 84, 520, 44, 'Gabe Bondoc', 28, { wt: 500, f: 'inter', c: '#d0d0d4' }),
    B(28, 166, 664, 6, 'rgba(255,255,255,.28)', { rd: 3 }), B(28, 166, 260, 6, '#ffffff', { rd: 3 }),
    T(28, 180, 120, 34, '1:17', 22, { f: 'inter', c: '#d0d0d4' }), T(572, 180, 120, 34, '-2:01', 22, { f: 'inter', c: '#d0d0d4', a: 'right' }),
  ], 720),
  label('l-weather', 'weather', [T(0, 0, 360, 170, '24°', 150, { f: 'inter', wt: 300 }), T(0, 170, 360, 50, 'Sunny · Lisbon', 32, { f: 'inter', wt: 500 })], 360),
  label('l-notif', 'iOS notification', [
    B(0, 0, 820, 150, 'rgba(245,245,247,.9)', { rd: 34 }), B(26, 30, 90, 90, 'linear-gradient(135deg,#feda75,#d62976 60%,#4f5bd5)', { rd: 22 }),
    T(140, 26, 520, 44, 'Instagram', 30, { c: '#111111', wt: 700, f: 'inter' }), T(640, 26, 150, 44, 'now', 26, { c: '#8e8e93', f: 'inter', a: 'right', wt: 500 }),
    T(140, 72, 650, 52, 'your best friend liked your post ❤️', 30, { c: '#1c1c1e', f: 'inter', wt: 500 }),
  ], 820),
  label('l-ask', 'question box', [
    B(0, 0, 620, 250, '#ffffff', { rd: 36 }), T(0, 0, 620, 110, 'ask me anything', 40, { bg: 'linear-gradient(135deg,#f58529,#dd2a7b 55%,#8134af)', rd: 36, a: 'center', wt: 700, f: 'inter' }),
    T(40, 130, 540, 90, 'type something…', 34, { c: '#8e8e93', a: 'center', wt: 500, f: 'inter', bg: '#f2f2f7', rd: 22 }),
  ], 620),
  label('l-poll', 'poll', [
    B(0, 0, 640, 300, 'rgba(255,255,255,.95)', { rd: 36 }), T(30, 22, 580, 70, 'which one?', 40, { c: '#111111', a: 'center', wt: 700, f: 'inter' }),
    T(30, 110, 580, 74, 'this one', 32, { c: '#111111', bg: '#f2f2f7', rd: 37, a: 'center', wt: 600, f: 'inter' }),
    T(30, 200, 580, 74, 'the next one →', 32, { c: '#111111', bg: '#f2f2f7', rd: 37, a: 'center', wt: 600, f: 'inter' }),
  ], 640),
  label('l-handle', 'handle tag', [T(0, 0, 340, 64, '@yourhandle', 30, { bg: 'rgba(0,0,0,.5)', rd: 12, a: 'center', wt: 600, f: 'inter' })], 340),
]

export const STICKER_CATS = ['Doodles', 'Labels', 'Frames', 'Torn paper', 'Tape', 'Paper', 'Flowers', 'Sky', 'Hearts', 'Faces', 'Travel', 'Food', 'Things']
export const STICKERS = { cats: STICKER_CATS, items: [...DOODLES, ...LABELS, ...FRAMES, ...TORN, ...TAPES, ...PAPERS, ...EMOJIS] }
