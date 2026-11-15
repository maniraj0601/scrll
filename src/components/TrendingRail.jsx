import Icon from './Icon.jsx'
import TemplateCard from './TemplateCard.jsx'

// Shared "Trending now" rail: a hand-picked, ranked shelf of popular looks. Used standalone
// on Explore (the full list) and trimmed on Home, so the trend-of-the-week is scannable
// without scrolling through the entire template library first.
export default function TrendingRail({ items, onPreview, onUse, limit, onSeeAll }) {
  const shown = limit ? items.slice(0, limit) : items

  return (
    <section className="trending" aria-labelledby="trending-title">
      <div className="section__head">
        <h2 id="trending-title">
          <Icon name="flame" size={20} className="trending__flame" />
          Trending now
        </h2>
        {onSeeAll ? (
          <button className="link-button" type="button" onClick={onSeeAll}>
            See all in Explore
            <Icon name="chevron" size={15} />
          </button>
        ) : (
          <p className="library__count">Most-used looks this week</p>
        )}
      </div>
      <div className="trending__rail">
        {shown.map((t, i) => (
          <div className="trending__item" key={t.id}>
            <span className="trending__rank" aria-hidden="true">{i + 1}</span>
            <TemplateCard template={t} onPreview={onPreview} onUse={onUse} />
          </div>
        ))}
      </div>
    </section>
  )
}
