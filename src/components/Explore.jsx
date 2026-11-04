import { memo, useDeferredValue, useMemo, useState } from 'react'
import Library from './Library.jsx'
import TemplateCard from './TemplateCard.jsx'
import Icon from './Icon.jsx'
import { FONT_FAMILY, stickerSrc } from './SlidePreview.jsx'
import { EXPLORE, TRENDING } from '../catalog/index.js'
import { STICKERS } from '../editor/stickers.js'

const TABS = [
  { id: 'layouts', label: 'Layouts', icon: 'layouts', count: EXPLORE.length },
  { id: 'stickers', label: 'Stickers', icon: 'stickers', count: STICKERS.items.length },
]
const STICKER_CATS = ['All', ...STICKERS.cats.filter((c) => STICKERS.items.some((s) => s.c === c))]
const isDarkTint = (s) => s.tint && /^#f{3,6}$/i.test(s.col || '')

// Text widgets ("els" stickers: labels, pills, captions) are previewed as scaled HTML.
function WidgetThumb({ sticker: s }) {
  const h = Math.max(...s.els.map((o) => o.y + o.h))
  const pct = (v, of) => `${(v / of) * 100}%`
  return (
    <div className="sticker-widget" style={{ aspectRatio: `${s.w} / ${h}` }}>
      {s.els.map((o, i) => (
        <div
          key={i}
          style={{
            left: pct(o.x, s.w),
            top: pct(o.y, h),
            width: pct(o.w, s.w),
            height: pct(o.h, h),
            borderRadius: `${((o.rd || 0) / s.w) * 100}cqw`,
            ...(o.type === 'shape'
              ? { background: o.fill }
              : {
                  justifyContent: { center: 'center', right: 'flex-end' }[o.a] || 'flex-start',
                  textAlign: o.a,
                  font: `${o.wt} ${(o.fs / s.w) * 100}cqw/${o.lh || 1.15} ${FONT_FAMILY[o.f] || FONT_FAMILY.n}`,
                  letterSpacing: `${o.ls || 0}em`,
                  color: o.c,
                  background: o.bg || undefined,
                  textShadow: o.ts ? '0 1px 4px rgba(0,0,0,.45)' : undefined,
                }),
          }}
        >
          {o.type === 'text' ? o.text : null}
        </div>
      ))}
    </div>
  )
}

const StickerTile = memo(function StickerTile({ sticker: s, onUse }) {
  return (
    <button
      type="button"
      className={`sticker-tile${isDarkTint(s) ? ' sticker-tile--dark' : ''}${s.bg ? ' sticker-tile--fill' : ''}`}
      onClick={() => onUse(s)}
      aria-label={`Start a design with ${s.n}`}
      title={s.n}
    >
      {s.k === 'els' ? <WidgetThumb sticker={s} /> : <img src={stickerSrc(s)} alt="" loading="lazy" decoding="async" />}
    </button>
  )
})

function Stickers({ query, onUse }) {
  const [cat, setCat] = useState('All')
  const q = useDeferredValue(query.trim().toLocaleLowerCase())
  const items = useMemo(
    () => STICKERS.items.filter((s) => (cat === 'All' || s.c === cat) && (!q || `${s.n} ${s.c}`.toLocaleLowerCase().includes(q))),
    [cat, q],
  )
  const groups = useMemo(() => {
    const map = new Map()
    items.forEach((s) => map.set(s.c, [...(map.get(s.c) || []), s]))
    return [...map]
  }, [items])

  return (
    <section className="library" aria-label="Stickers">
      <div className="filters">
        <div className="category-row" role="group" aria-label="Filter stickers">
          {STICKER_CATS.map((c) => (
            <button className="category-chip" key={c} type="button" aria-pressed={cat === c} onClick={() => setCat(c)}>
              {c === 'All' ? 'Everything' : c}
            </button>
          ))}
        </div>
      </div>
      {groups.length ? (
        groups.map(([c, list]) => (
          <div className="sticker-group" key={c}>
            <div className="section__head">
              <h2>{c}</h2>
              <p className="library__count">{list.length}</p>
            </div>
            <div className="sticker-grid">
              {list.map((s) => (
                <StickerTile key={s.id} sticker={s} onUse={onUse} />
              ))}
            </div>
          </div>
        ))
      ) : (
        <div className="empty-state">
          <span className="empty-state__mark" aria-hidden="true">⌕</span>
          <h3>No stickers match</h3>
          <p>Try another word, like heart, tape or sun.</p>
        </div>
      )}
    </section>
  )
}

// Explore: what's popular right now. Trending layouts up top, then every layout
// (filterable), plus the sticker shelf — kept apart from the regular templates on Home.
export default function Explore({ tab, onTab, onPreview, onUse, onUseSticker }) {
  const [query, setQuery] = useState('')
  const showTrending = tab === 'layouts' && !query

  return (
    <>
      <header className="welcome">
        <div>
          <p className="eyebrow">Popular &amp; trending</p>
          <h1>Explore</h1>
        </div>
        <label className="search-field search-field--hero">
          <Icon name="search" />
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={tab === 'stickers' ? 'Search stickers — heart, tape, sun…' : 'Search layouts — torn, film, dump…'}
            aria-label={`Search ${tab}`}
            enterKeyHint="search"
          />
          {query && (
            <button type="button" onClick={() => setQuery('')} aria-label="Clear search">
              <Icon name="close" />
            </button>
          )}
        </label>
      </header>

      <div className="explore-tabs segmented-control" role="tablist" aria-label="Explore">
        {TABS.map((t) => (
          <button key={t.id} type="button" role="tab" aria-selected={tab === t.id} aria-pressed={tab === t.id} onClick={() => onTab(t.id)}>
            <Icon name={t.icon} size={16} />
            <span>{t.label}</span>
            <small>{t.count}</small>
          </button>
        ))}
      </div>

      {showTrending && (
        <section className="trending" aria-labelledby="trending-title">
          <div className="section__head">
            <h2 id="trending-title">
              <Icon name="flame" size={20} className="trending__flame" />
              Trending now
            </h2>
            <p className="library__count">Most-used looks this week</p>
          </div>
          <div className="trending__rail">
            {TRENDING.map((t, i) => (
              <div className="trending__item" key={t.id}>
                <span className="trending__rank" aria-hidden="true">{i + 1}</span>
                <TemplateCard template={t} onPreview={onPreview} onUse={onUse} />
              </div>
            ))}
          </div>
        </section>
      )}

      {tab === 'layouts' ? (
        <Library
          id="explore-layouts"
          title="Popular layouts"
          items={EXPLORE}
          query={query}
          onQueryChange={setQuery}
          onPreview={onPreview}
          onUse={onUse}
          lengthFilter={false}
        />
      ) : (
        <Stickers query={query} onUse={onUseSticker} />
      )}
    </>
  )
}
