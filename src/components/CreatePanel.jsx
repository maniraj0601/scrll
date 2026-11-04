import { useState } from 'react'
import Icon from './Icon.jsx'
import { blankUrl, FORMATS, MAX_SLIDES } from '../lib/links.js'
import { linkClick } from '../lib/router.js'

const STRIP_MAX = 6

// "New carousel" composer: pick a format and slide count, see the strip, start editing.
export default function CreatePanel({ id }) {
  const [format, setFormat] = useState(FORMATS[0].id)
  const [slides, setSlides] = useState(3)
  const current = FORMATS.find((f) => f.id === format)
  const step = (d) => setSlides((n) => Math.min(MAX_SLIDES, Math.max(1, n + d)))

  return (
    <section className="create card" id={id} aria-labelledby="create-title">
      <div className="create__head">
        <div>
          <p className="eyebrow">Start fresh</p>
          <h2 id="create-title">New carousel</h2>
        </div>
        <p className="create__size">{current.size} px</p>
      </div>

      <div className="format-picker" role="radiogroup" aria-label="Format">
        {FORMATS.map((f) => (
          <button
            key={f.id}
            type="button"
            role="radio"
            aria-checked={format === f.id}
            className="format-tile"
            onClick={() => setFormat(f.id)}
          >
            <span className="format-tile__shape" style={{ aspectRatio: f.id }} aria-hidden="true" />
            <span className="format-tile__label">{f.label}</span>
            <span className="format-tile__meta">{f.ratio} · {f.hint}</span>
          </button>
        ))}
      </div>

      <div className="create__strip" aria-hidden="true">
        {Array.from({ length: Math.min(slides, STRIP_MAX) }, (_, i) => (
          <span key={i} style={{ aspectRatio: format, animationDelay: `${i * 30}ms` }}>
            {i + 1}
          </span>
        ))}
        {slides > STRIP_MAX && <em>+{slides - STRIP_MAX}</em>}
      </div>

      <div className="create__foot">
        <div className="stepper" role="group" aria-label="Number of slides">
          <button type="button" onClick={() => step(-1)} disabled={slides <= 1} aria-label="Fewer slides">
            <Icon name="minus" size={16} />
          </button>
          <output aria-live="polite">
            <b>{slides}</b> {slides === 1 ? 'slide' : 'slides'}
          </output>
          <button type="button" onClick={() => step(1)} disabled={slides >= MAX_SLIDES} aria-label="More slides">
            <Icon name="plus" size={16} />
          </button>
        </div>
        <a className="button button--primary" href={blankUrl(format, slides)} onClick={linkClick}>
          Create blank
          <Icon name="arrow" size={17} />
        </a>
      </div>
    </section>
  )
}
