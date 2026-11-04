import { useCallback, useEffect, useState } from 'react'
import Navigation, { VIEWS } from './components/Navigation.jsx'
import CreatePanel from './components/CreatePanel.jsx'
import RecentProjects from './components/RecentProjects.jsx'
import Library from './components/Library.jsx'
import Explore from './components/Explore.jsx'
import TemplateDialog from './components/TemplateDialog.jsx'
import Icon from './components/Icon.jsx'
import { TEMPLATES } from './catalog/index.js'
import { stickerUrl, templateUrl } from './lib/links.js'
import { navigate as go } from './lib/router.js'
import { useStyleSheet } from './lib/useStyleSheet.js'
import css from './styles.css?inline'
import { useProjects } from './lib/projects.js'

const THEME_KEY = 'carousel-studio-theme'

function readTheme() {
  try {
    return localStorage.getItem(THEME_KEY) || 'system'
  } catch {
    return 'system'
  }
}

// Hashes: #explore, #explore/stickers, #drafts. Legacy #templates/#designs still land sensibly.
const ALIAS = { templates: 'library', designs: 'drafts' }
const readHash = () => {
  const [raw, sub] = window.location.hash.slice(1).split('/')
  const id = ALIAS[raw] || raw
  return {
    view: VIEWS.some((v) => v.id === id) ? id : 'home',
    library: id === 'library',
    tab: id === 'explore' && sub === 'stickers' ? 'stickers' : 'layouts',
  }
}
// Where the home was scrolled when the editor opened, restored on return.
let savedScroll = 0

const scrollToLibrary = () =>
  requestAnimationFrame(() => document.getElementById('library')?.scrollIntoView({ behavior: 'smooth', block: 'start' }))

function greeting() {
  const h = new Date().getHours()
  return h < 5 ? 'Good evening' : h < 12 ? 'Good morning' : h < 18 ? 'Good afternoon' : 'Good evening'
}

export default function App() {
  const [view, setView] = useState(() => readHash().view)
  const [exploreTab, setExploreTab] = useState(() => readHash().tab)
  const [query, setQuery] = useState('')
  const [preview, setPreview] = useState(null)
  const [theme, setTheme] = useState(readTheme)
  const { projects, loading, remove } = useProjects()
  useStyleSheet('studio-css', css)

  useEffect(() => {
    if (savedScroll) window.scrollTo({ top: savedScroll, behavior: 'instant' })
    return () => {
      savedScroll = window.scrollY
    }
  }, [])

  useEffect(() => {
    if (theme === 'system') delete document.documentElement.dataset.theme
    else document.documentElement.dataset.theme = theme
    try {
      localStorage.setItem(THEME_KEY, theme)
    } catch {
      // Appearance still applies for this visit when storage is unavailable.
    }
  }, [theme])

  useEffect(() => {
    const onHash = () => {
      const h = readHash()
      setView(h.view)
      setExploreTab(h.tab)
      if (h.library) scrollToLibrary()
    }
    if (readHash().library) scrollToLibrary()
    window.addEventListener('hashchange', onHash)
    return () => window.removeEventListener('hashchange', onHash)
  }, [])

  const navigate = useCallback((next, { scroll = true, tab } = {}) => {
    const hash = next === 'home' ? '' : next === 'explore' && tab === 'stickers' ? '#explore/stickers' : `#${next}`
    if (window.location.hash !== hash) {
      history.pushState(null, '', hash || window.location.pathname)
    }
    setView(next)
    if (next === 'explore') setExploreTab(tab || 'layouts')
    if (scroll) window.scrollTo({ top: 0, behavior: 'instant' })
  }, [])

  const openCreate = useCallback(() => {
    const focus = () => {
      const el = document.getElementById('create')
      el?.scrollIntoView({ behavior: 'smooth', block: 'center' })
      el?.querySelector('[aria-checked="true"]')?.focus({ preventScroll: true })
    }
    if (view !== 'home') {
      navigate('home')
      requestAnimationFrame(focus)
    } else focus()
  }, [navigate, view])

  const isDark =
    theme === 'dark' || (theme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches)

  const useTemplate = (t) => go(templateUrl(t))
  const useSticker = (s) => go(stickerUrl(s))

  return (
    <div className="studio">
      <Navigation
        view={view}
        onNavigate={navigate}
        onCreate={openCreate}
        isDark={isDark}
        onToggleTheme={() => setTheme(isDark ? 'light' : 'dark')}
        draftCount={projects.length}
      />

      <main className="workspace" key={view}>
        {view === 'home' && (
          <>
            <header className="welcome">
              <div>
                <p className="eyebrow">{greeting()}</p>
                <h1>What will you make today?</h1>
              </div>
              <label className="search-field search-field--hero">
                <Icon name="search" />
                <input
                  type="search"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && scrollToLibrary()}
                  placeholder={`Search ${TEMPLATES.length} templates — travel, quotes, tips…`}
                  aria-label="Search templates"
                  enterKeyHint="search"
                />
                {query && (
                  <button type="button" onClick={() => setQuery('')} aria-label="Clear search">
                    <Icon name="close" />
                  </button>
                )}
              </label>
            </header>

            <CreatePanel id="create" />

            {(loading || projects.length > 0) && (
              <RecentProjects
                projects={projects}
                loading={loading}
                onDelete={remove}
                limit={8}
                onSeeAll={() => navigate('drafts')}
                onCreate={openCreate}
              />
            )}

            <Library
              title="Templates"
              items={TEMPLATES}
              query={query}
              onQueryChange={setQuery}
              onPreview={setPreview}
              onUse={useTemplate}
            />

            <button className="explore-promo" type="button" onClick={() => navigate('explore')}>
              <span className="explore-promo__icon" aria-hidden="true">
                <Icon name="flame" size={22} />
              </span>
              <span>
                <strong>Looking for what’s trending?</strong>
                <small>Photo dumps, torn paper, film strips and stickers live in Explore.</small>
              </span>
              <Icon name="chevron" size={18} />
            </button>
          </>
        )}

        {view === 'explore' && (
          <Explore
            tab={exploreTab}
            onTab={(tab) => navigate('explore', { tab, scroll: false })}
            onPreview={setPreview}
            onUse={useTemplate}
            onUseSticker={useSticker}
          />
        )}

        {view === 'drafts' && (
          <>
            <div className="page-head">
              <div>
                <p className="eyebrow">Saved on this device</p>
                <h1>Your drafts</h1>
              </div>
              <button className="button button--primary button--small" type="button" onClick={openCreate}>
                <Icon name="plus" size={16} />
                New
              </button>
            </div>
            <RecentProjects
              projects={projects}
              loading={loading}
              onDelete={remove}
              onCreate={openCreate}
              title={`${projects.length} ${projects.length === 1 ? 'draft' : 'drafts'}`}
            />
          </>
        )}
      </main>

      <TemplateDialog template={preview} onClose={() => setPreview(null)} onUse={useTemplate} />
    </div>
  )
}
