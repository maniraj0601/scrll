const FONT_FAMILY = {
  h: 'var(--font-hand)',
  n: 'var(--font-sans)',
  s: 'var(--font-serif)',
}

function Layer({ layer }) {
  const { t, x, y, w, h, r, rd, circ } = layer
  const style = {
    left: `${x}%`,
    top: `${y}%`,
    width: `${w}%`,
    ...(circ ? { height: 'auto', aspectRatio: '1' } : h ? { height: `${h}%` } : {}),
    ...(r ? { transform: `rotate(${r}deg)` } : {}),
    ...(rd ? { borderRadius: rd } : {}),
  }

  if (t === 'i') {
    return (
      <div
        className="slide-layer slide-layer--image"
        style={{
          ...style,
          background: `linear-gradient(${layer.a || 160}deg, ${layer.g[0]}, ${layer.g[1]})`,
        }}
        aria-hidden="true"
      >
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path d="m3 19 6-8 4 5 3-4 5 7H3Z" />
          <circle cx="17" cy="7" r="2" />
        </svg>
      </div>
    )
  }

  if (t === 'r') {
    return (
      <div
        className="slide-layer"
        style={{
          ...style,
          background: layer.c,
          ...(layer.cp ? { clipPath: `polygon(${layer.cp})` } : {}),
        }}
        aria-hidden="true"
      />
    )
  }

  if (t === 'p') {
    return (
      <div className="slide-layer polaroid" style={style} aria-hidden="true">
        <div
          className="polaroid__image"
          style={{ background: `linear-gradient(160deg, ${layer.g[0]}, ${layer.g[1]})` }}
        />
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
        ...(circ ? { alignItems: 'center' } : {}),
      }}
    >
      {layer.text}
    </div>
  )
}

function Slide({ template, index }) {
  if (template.m) {
    return (
      <div className="slide-preview" style={{ background: template.bg }}>
        <div
          className="slide-preview__master"
          style={{ width: `${template.m * 100}%`, left: `${-index * 100}%` }}
          aria-hidden="true"
        >
          {template.L.map((layer, layerIndex) => (
            <Layer key={layerIndex} layer={layer} />
          ))}
        </div>
      </div>
    )
  }

  const slide = template.S[index]
  return (
    <div className="slide-preview" style={{ background: slide.bg }}>
      {slide.L.map((layer, layerIndex) => (
        <Layer key={layerIndex} layer={layer} />
      ))}
    </div>
  )
}

export default function SlidePreview({ template, compact = false }) {
  const slideCount = template.m || template.S.length
  const basis = template.m ? '33.333%' : template.ar === '9/16' ? '38%' : '46%'

  return (
    <div
      className={`slide-strip${template.m ? ' slide-strip--seamless' : ''}${compact ? ' slide-strip--compact' : ''}`}
      style={{ '--slide-ratio': template.ar, '--slide-basis': basis }}
      aria-label={`${template.name}, ${slideCount} slides`}
    >
      {Array.from({ length: slideCount }, (_, index) => (
        <Slide key={index} template={template} index={index} />
      ))}
    </div>
  )
}
