import { useDeferredValue, useMemo, useState } from 'react'
import TemplateCard from './TemplateCard.jsx'
import Icon from './Icon.jsx'
import { categoriesOf, FORMAT_INFO, matchesSlides, searchText, SLIDE_FILTERS } from '../catalog/index.js'

const SIZES = [['All', 'All sizes', ''], ...Object.entries(FORMAT_INFO).map(([k, v]) => [k, v.label, v.ratio])]

function RatioGlyph({ ratio }) {
  const [w, h] = ratio.split(':').map(Number)
  const s = 14 / Math.max(w, h)
  return <span className="ratio-glyph" style={{ width: w * s, height: h * s }} aria-hidden="true" />
}

// A filterable shelf of designs (size, category, length). Used for Templates on Home and
// for the layout grid on Explore. Search is owned by the page header so there is one box.
export default function Library({ id = 'library', title = 'Library', items: source, query, onQueryChange, onPreview, onUse, lengthFilter = true }) {
  const categories = useMemo(() => categoriesOf(source), [source])
  const [ratio, setRatio] = useState('All')
  const [category, setCategory] = useState('All')
  const [slides, setSlides] = useState('Any')
  const search = useDeferredValue(query.trim().toLocaleLowerCase())

  const items = useMemo(
    () =>
      source.filter(
        (t) =>
          (ratio === 'All' || t.ar === ratio) &&
          (category === 'All' || t.cat === category) &&
          matchesSlides(t, slides) &&
          (!search || searchText(t).includes(search)),
      ),
    [category, ratio, search, slides, source],
  )

  const clear = () => {
    onQueryChange('')
    setRatio('All')
    setCategory('All')
    setSlides('Any')
  }
  const filtered = ratio !== 'All' || category !== 'All' || slides !== 'Any' || search

  return (
    <section className="library" id={id} aria-labelledby={`${id}-title`}>
      <div className="section__head">
        <h2 id={`${id}-title`}>{title}</h2>
        <p className="library__count" aria-live="polite">
          {items.length} {items.length === 1 ? 'design' : 'designs'}
          {filtered && (
            <button className="link-button" type="button" onClick={clear}>Reset</button>
          )}
        </p>
      </div>

      <div className="filters">
        <div className="filter-row">
          <div className="segmented-control" role="group" aria-label="Filter by size">
            {SIZES.map(([value, label, r]) => (
              <button key={value} type="button" aria-pressed={ratio === value} onClick={() => setRatio(value)}>
                {r && <RatioGlyph ratio={r} />}
                <span>{label}</span>
                {r && <small>{r}</small>}
              </button>
            ))}
          </div>
          {lengthFilter && <div className="chip-row" role="group" aria-label="Filter by length">
            {Object.entries(SLIDE_FILTERS).map(([value, label]) => (
              <button className="chip" key={value} type="button" aria-pressed={slides === value} onClick={() => setSlides(value)}>
                {label}
              </button>
            ))}
          </div>}
        </div>
        {categories.length > 2 && <div className="category-row" role="group" aria-label="Filter by category">
          {categories.map((value) => (
            <button className="category-chip" key={value} type="button" aria-pressed={category === value} onClick={() => setCategory(value)}>
              {value === 'All' ? 'Everything' : value}
            </button>
          ))}
        </div>}
      </div>

      {items.length ? (
        <div className="library-grid">
          {items.map((t) => (
            <TemplateCard key={t.id} template={t} onPreview={onPreview} onUse={onUse} />
          ))}
        </div>
      ) : (
        <div className="empty-state">
          <span className="empty-state__mark" aria-hidden="true">⌕</span>
          <h3>Nothing matches yet</h3>
          <p>Try a different search or clear a filter to see more ideas.</p>
          <button className="button button--secondary" type="button" onClick={clear}>Clear filters</button>
        </div>
      )}
    </section>
  )
}
