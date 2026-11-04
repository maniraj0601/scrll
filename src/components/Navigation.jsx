import Icon from './Icon.jsx'

// Home (create, recent drafts, regular templates), Explore (trending layouts and
// stickers) and Drafts (everything saved on this device).
export const VIEWS = [
  { id: 'home', label: 'Home', icon: 'home' },
  { id: 'explore', label: 'Explore', icon: 'explore' },
  { id: 'drafts', label: 'Drafts', icon: 'designs' },
]

function Brand() {
  return (
    <a className="brand" href="/" aria-label="Carousel Studio home">
      <span className="brand__mark" aria-hidden="true">
        <span />
        <span />
        <span />
      </span>
      <span className="brand__name">Carousel Studio</span>
    </a>
  )
}

// Desktop: a translucent sidebar. Phones/tablets: a compact top bar plus a bottom tab bar
// (same items), so navigation stays under the thumb.
export default function Navigation({ view, onNavigate, onCreate, isDark, onToggleTheme, draftCount }) {
  const item = (v) => (
    <button
      key={v.id}
      type="button"
      className="nav-item"
      aria-current={view === v.id ? 'page' : undefined}
      onClick={() => onNavigate(v.id)}
    >
      <Icon name={v.icon} />
      <span>{v.label}</span>
      {v.id === 'drafts' && draftCount > 0 && <small className="nav-item__count">{draftCount}</small>}
    </button>
  )

  const themeButton = (
    <button
      className="icon-button"
      type="button"
      onClick={onToggleTheme}
      aria-label={isDark ? 'Switch to light appearance' : 'Switch to dark appearance'}
    >
      <Icon name={isDark ? 'sun' : 'moon'} size={19} />
    </button>
  )

  return (
    <>
      <aside className="sidebar" aria-label="Main navigation">
        <Brand />
        <button className="button button--primary sidebar__create" type="button" onClick={onCreate}>
          <Icon name="plus" size={18} />
          Create
        </button>
        <nav className="sidebar__nav">
          {VIEWS.map(item)}
        </nav>
        <div className="sidebar__foot">
          {themeButton}
          <span>Drafts stay on this device</span>
        </div>
      </aside>

      <header className="mobile-top">
        <Brand />
        <div className="mobile-top__actions">
          {themeButton}
        </div>
      </header>

      <nav className="tabbar" aria-label="Main navigation">
        {item(VIEWS[0])}
        {item(VIEWS[1])}
        <button className="tabbar__create" type="button" onClick={onCreate} aria-label="Create a new carousel">
          <Icon name="plus" size={22} />
        </button>
        {item(VIEWS[2])}
      </nav>
    </>
  )
}
