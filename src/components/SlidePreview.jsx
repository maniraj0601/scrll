import { memo } from 'react'
import { photoURL } from '../catalog/index.js'
import { STICKERS } from '../editor/stickers.js'

// React port of the editor's template renderer (src/editor/engine.js `layer()`), so previews on the
// home page match what opens in the editor. Sizes are % of the slide; text uses cqw.
export const FONT_FAMILY = {
  h: 'var(--font-hand)',
  n: 'var(--font-sans)',
  s: 'var(--font-serif)',
  inter: 'Inter, system-ui, sans-serif',
  bebas: "'Bebas Neue', Impact, sans-serif",
  bodo: "'Bodoni Moda', Georgia, serif",
  dance: "'Dancing Script', cursive",
  roboto: "'Roboto Mono', monospace",
}

const STICKER = new Map(STICKERS.items.map((s) => [s.id, s]))
const emojiUrl = (u) =>
  `https://cdn.jsdelivr.net/gh/microsoft/fluentui-emoji@main/assets/${encodeURIComponent(u)}/Color/${u.toLowerCase().replace(/ /g, '_')}_color.svg`
export function stickerSrc(s, col) {
  if (s.k === 'emoji') return emojiUrl(s.u)
  if (s.k !== 'svg') return ''
  const svg = s.svg.replace(/currentColor/g, (s.tint && col) || s.col || '#111111')
  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`
}

const gradient = (g, a = 160) => `linear-gradient(${a}deg, ${g[0]}, ${g[1]})`

function Photo({ id, width, style }) {
  return <img className="slide-photo" src={photoURL(id, width)} alt="" loading="lazy" decoding="async" style={style} />
}

function Layer({ layer, photoWidth }) {
  const { t, x, y, w, h, r, rd, circ, o } = layer
  const box = { left: `${x}%`, top: `${y}%`, width: `${w}%` }
  const style = {
    ...box,
    ...(circ ? { height: 'auto', aspectRatio: '1' } : h ? { height: `${h}%` } : {}),
    ...(r ? { transform: `rotate(${r}deg)` } : {}),
    ...(rd ? { borderRadius: rd } : {}),
    ...(o != null ? { opacity: o } : {}),
    ...(layer.cp ? { clipPath: `polygon(${layer.cp})` } : {}),
  }

  if (t === 's') {
    const s = STICKER.get(layer.id)
    if (!s) return null
    return (
      <img
        className="slide-layer slide-layer--sticker"
        src={stickerSrc(s, layer.col)}
        alt=""
        loading="lazy"
        style={{ ...box, ...(r ? { transform: `rotate(${r}deg)` } : {}), ...(o != null ? { opacity: o } : {}) }}
      />
    )
  }

  if (t === 'i') {
    const zoom = layer.z || layer.px || layer.py
    return (
      <div
        className="slide-layer slide-layer--image"
        style={{
          ...style,
          background: gradient(layer.g, layer.a),
          ...(layer.bw ? { border: `${layer.bw}cqw solid ${layer.bc || '#fff'}` } : {}),
        }}
      >
        {layer.photo && (
          <Photo
            id={layer.photo}
            width={photoWidth}
            style={{
              ...(zoom ? { transform: `translate(${(layer.px || 0) * 100}%, ${(layer.py || 0) * 100}%) scale(${layer.z || 1})` } : {}),
              ...(layer.gs || layer.bl ? { filter: `grayscale(${layer.gs || 0}) blur(${(layer.bl || 0) / 10.8}cqw)` } : {}),
            }}
          />
        )}
      </div>
    )
  }

  if (t === 'r') return <div className="slide-layer" style={{ ...style, background: layer.c }} />

  if (t === 'p') {
    return (
      <div className="slide-layer polaroid" style={{ ...box, transform: `rotate(${r || 0}deg)` }}>
        <div className="polaroid__image" style={{ background: gradient(layer.g) }}>
          {layer.photo && <Photo id={layer.photo} width={Math.min(photoWidth, 500)} />}
        </div>
        <span>{layer.cap}</span>
      </div>
    )
  }

  return (
    <div
      className={`slide-layer slide-layer--text${circ ? ' slide-layer--circle' : ''}`}
      style={{
        ...style,
        justifyContent: layer.v === 'c' ? 'center' : layer.v === 'e' ? 'flex-end' : 'flex-start',
        fontFamily: FONT_FAMILY[layer.f] || FONT_FAMILY.n,
        fontSize: `${layer.s}cqw`,
        fontWeight: layer.wt || 700,
        lineHeight: layer.lh || 1.1,
        color: layer.c || '#fff',
        textAlign: layer.a || 'left',
        ...(layer.ls ? { letterSpacing: `${layer.ls}em` } : {}),
        ...(layer.bg ? { background: layer.bg } : {}),
        ...(layer.ts ? { textShadow: `0 .2cqw ${(layer.tb || 8) / 10.8}cqw rgba(0,0,0,${layer.ts})` } : {}),
        ...(circ ? { alignItems: 'center' } : {}),
      }}
    >
      {layer.text}
    </div>
  )
}

export function Slide({ template, index, photoWidth = 600 }) {
  if (template.m) {
    return (
      <div className="slide-preview" style={{ background: template.bg }}>
        <div className="slide-preview__master" style={{ width: `${template.m * 100}%`, left: `${-index * 100}%`, background: template.bg }}>
          {template.L.map((layer, i) => <Layer key={i} layer={layer} photoWidth={photoWidth * template.m} />)}
        </div>
      </div>
    )
  }
  const slide = template.S[index]
  return (
    <div className="slide-preview" style={{ background: slide.bg }}>
      {slide.L.map((layer, i) => <Layer key={i} layer={layer} photoWidth={photoWidth} />)}
    </div>
  )
}

// Card cover: the first slide, or the whole panorama for seamless designs.
export const Cover = memo(function Cover({ template }) {
  if (template.m) {
    const [w, h] = template.ar.split('/')
    return (
      <div className="slide-cover" style={{ '--slide-ratio': `${w * template.m}/${h}` }}>
        {Array.from({ length: template.m }, (_, i) => <Slide key={i} template={template} index={i} photoWidth={500} />)}
      </div>
    )
  }
  return (
    <div className="slide-cover" style={{ '--slide-ratio': template.ar }}>
      <Slide template={template} index={0} photoWidth={600} />
    </div>
  )
})

// Full swipeable strip of every slide (used in the preview dialog).
function SlidePreview({ template }) {
  const count = template.n || template.m || template.S.length
  const basis = template.ar === '9/16' ? '42%' : count === 1 ? '70%' : '62%'
  return (
    <div
      className={`slide-strip${template.m ? ' slide-strip--seamless' : ''}`}
      style={{ '--slide-ratio': template.ar, '--slide-basis': basis }}
      aria-label={`${template.name}, ${count} slides`}
    >
      {Array.from({ length: count }, (_, i) => <Slide key={i} template={template} index={i} photoWidth={900} />)}
    </div>
  )
}

export default memo(SlidePreview)
