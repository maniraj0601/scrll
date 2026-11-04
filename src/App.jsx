import { useCallback, useEffect, useState } from 'react'
import Navigation, { VIEWS } from './components/Navigation.jsx'
import CreatePanel from './components/CreatePanel.jsx'
import RecentProjects from './components/RecentProjects.jsx'
import Library from './components/Library.jsx'
import TemplateDialog from './components/TemplateDialog.jsx'
import Icon from './components/Icon.jsx'
import { LIBRARY } from './catalog/index.js'
import { templateUrl } from './lib/links.js'
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

// Legacy hashes (#templates, #designs) still land somewhere sensible.
const ALIAS = { templates: 'library', designs: 'drafts' }
const readHash = () => {
  const id = ALIAS[window.location.hash.slice(1)] || window.location.hash.slice(1)
  return { view: VIEWS.some((v) => v.id === id) ? id : 'home', library: id === 'library' }
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
      if (h.library) scrollToLibrary()
    }
    if (readHash().library) scrollToLibrary()
    window.addEventListener('hashchange', onHash)
    return () => window.removeEventListener('hashchange', onHash)
  }, [])

  const navigate = useCallback((next, { scroll = true } = {}) => {
    const hash = next === 'home' ? '' : `#${next}`
    if (window.location.hash !== hash) {
      history.pushState(null, '', hash || window.location.pathname)
    }
    setView(next)
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
                  placeholder={`Search ${LIBRARY.length} designs — travel, quotes, torn…`}
                  aria-label="Search the library"
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

            <Library query={query} onQueryChange={setQuery} onPreview={setPreview} onUse={useTemplate} />
          </>
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
