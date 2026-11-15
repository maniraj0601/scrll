import { useMemo } from 'react'
import TemplateCard from './TemplateCard.jsx'
import { StickerTile } from './Explore.jsx'
import Icon from './Icon.jsx'
import { EXPLORE, TEMPLATES } from '../catalog/index.js'
import { STICKERS } from '../editor/stickers.js'
import { favoriteKey, useFavorites } from '../lib/favorites.js'

// Everything saved for reuse — templates, layouts and stickers — kept in one place instead
// of re-finding them by scrolling back through Home/Explore each time.
export default function Favorites({ onPreview, onUse, onUseSticker }) {
  const { has } = useFavorites()

  const templates = useMemo(() => TEMPLATES.filter((t) => has(favoriteKey(t.kind, t.id))), [has])
  const layouts = useMemo(() => EXPLORE.filter((t) => has(favoriteKey(t.kind, t.id))), [has])
  const stickers = useMemo(() => STICKERS.items.filter((s) => has(favoriteKey('sticker', s.id))), [has])
  const empty = !templates.length && !layouts.length && !stickers.length

  return (
    <>
      <header className="welcome">
        <div>
          <p className="eyebrow">Saved for later</p>
          <h1>Favourites</h1>
        </div>
      </header>

      {empty ? (
        <div className="empty-card">
          <Icon name="heart" size={28} />
          <div>
            <h3>Nothing saved yet</h3>
            <p>Tap the heart on any template, layout or sticker to find it here instantly next time.</p>
          </div>
        </div>
      ) : (
        <>
          {templates.length > 0 && (
            <section className="library" aria-labelledby="fav-templates-title">
              <div className="section__head">
                <h2 id="fav-templates-title">Templates</h2>
                <p className="library__count">{templates.length}</p>
              </div>
              <div className="library-grid">
                {templates.map((t) => <TemplateCard key={t.id} template={t} onPreview={onPreview} onUse={onUse} />)}
              </div>
            </section>
          )}

          {layouts.length > 0 && (
            <section className="library" aria-labelledby="fav-layouts-title">
              <div className="section__head">
                <h2 id="fav-layouts-title">Layouts</h2>
                <p className="library__count">{layouts.length}</p>
              </div>
              <div className="library-grid">
                {layouts.map((t) => <TemplateCard key={t.id} template={t} onPreview={onPreview} onUse={onUse} />)}
              </div>
            </section>
          )}

          {stickers.length > 0 && (
            <section className="library" aria-labelledby="fav-stickers-title">
              <div className="section__head">
                <h2 id="fav-stickers-title">Stickers</h2>
                <p className="library__count">{stickers.length}</p>
              </div>
              <div className="sticker-grid">
                {stickers.map((s) => <StickerTile key={s.id} sticker={s} onUse={onUseSticker} />)}
              </div>
            </section>
          )}
        </>
      )}
    </>
  )
}
