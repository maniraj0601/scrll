import { useEffect, useMemo, useState } from 'react'
import TemplateCard from './components/TemplateCard.jsx'
import TemplateDialog from './components/TemplateDialog.jsx'
import {
  CATEGORIES,
  CATEGORY_ORDER,
  matchesPhotos,
  PHOTO_FILTERS,
  photoFilterLabel,
  RATIO_FILTERS,
  TEMPLATES,
} from './lib/templates.js'

function readTheme() {
  try {
    return localStorage.getItem('carousel-studio-theme') || 'system'
  } catch {
    return 'system'
  }
}

function ThemeButton({ theme, onToggle }) {
  return (
    <button className="icon-button theme-button" type="button" onClick={onToggle} aria-label="Toggle appearance">
      {theme === 'dark' ? (
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <circle cx="12" cy="12" r="4" />
          <path d="M12 2v2m0 16v2M4.93 4.93l1.42 1.42m11.3 11.3 1.42 1.42M2 12h2m16 0h2M4.93 19.07l1.42-1.42m11.3-11.3 1.42-1.42" />
        </svg>
      ) : (
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path d="M20.5 14.5A8.5 8.5 0 0 1 9.5 3.8 8.5 8.5 0 1 0 20.5 14.5Z" />
        </svg>
      )}
    </button>
  )
}

function editorUrl(template) {
  return template ? `/editor.html?template=${encodeURIComponent(template.id)}` : '/editor.html?new=1'
}

export default function App() {
  const [query, setQuery] = useState('')
  const [ratio, setRatio] = useState('All')
  const [photoCount, setPhotoCount] = useState('Any')
  const [category, setCategory] = useState('All')
  const [selectedTemplate, setSelectedTemplate] = useState(null)
  const [theme, setTheme] = useState(readTheme)

  useEffect(() => {
    if (theme === 'system') {
      delete document.documentElement.dataset.theme
    } else {
      document.documentElement.dataset.theme = theme
    }

    try {
      localStorage.setItem('carousel-studio-theme', theme)
    } catch {
      // Theme selection still works for the current page when storage is unavailable.
    }
  }, [theme])

  const filteredTemplates = useMemo(() => {
    const search = query.trim().toLocaleLowerCase()

    return TEMPLATES.filter((template) => {
      const matchesRatio = ratio === 'All' || template.ar === ratio
      const matchesCategory = category === 'All' || template.cat === category
      const matchesSearch =
        !search || `${template.name} ${template.cat} ${template.tags}`.toLocaleLowerCase().includes(search)

      return matchesRatio && matchesCategory && matchesPhotos(template, photoCount) && matchesSearch
    })
  }, [category, photoCount, query, ratio])

  const groupedTemplates = useMemo(() => {
    const groups = new Map()
    for (const template of filteredTemplates) {
      if (!groups.has(template.cat)) groups.set(template.cat, [])
      groups.get(template.cat).push(template)
    }
    return [...groups.entries()].sort(
      ([a], [b]) => CATEGORY_ORDER.indexOf(a) - CATEGORY_ORDER.indexOf(b),
    )
  }, [filteredTemplates])

  function useTemplate(template) {
    window.location.assign(editorUrl(template))
  }

  function toggleTheme() {
    const isDark =
      theme === 'dark' ||
      (theme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches)
    setTheme(isDark ? 'light' : 'dark')
  }

  return (
    <main className="app-shell">
      <header className="topbar">
        <a className="brand" href="/" aria-label="Carousel Studio home">
          <span className="brand__mark" aria-hidden="true">
            <span />
            <span />
            <span />
          </span>
          <span>Carousel Studio</span>
        </a>
        <nav className="topbar__actions" aria-label="Main navigation">
          <ThemeButton theme={theme} onToggle={toggleTheme} />
          <a className="button button--primary button--small" href={editorUrl(null)}>
            <span className="plus" aria-hidden="true">+</span>
            New carousel
          </a>
        </nav>
      </header>

      <section className="hero" aria-labelledby="page-title">
        <div className="hero__copy">
          <p className="eyebrow">A little inspiration goes a long way</p>
          <h1 id="page-title">Make something <span>worth swiping.</span></h1>
          <p>Thoughtful templates for your next big idea, small moment, or everything in between.</p>
        </div>
        <div className="hero__decoration" aria-hidden="true">
          <div className="hero__tile hero__tile--back" />
          <div className="hero__tile hero__tile--front">
            <span>STORY<br />IN MOTION</span>
            <i />
          </div>
        </div>
      </section>

      <section className="catalog" aria-label="Template library">
        <div className="catalog__heading">
          <div>
            <p className="eyebrow">Made for your next chapter</p>
            <h2>Explore templates</h2>
          </div>
          <p className="catalog__count" aria-live="polite">
            {filteredTemplates.length} {filteredTemplates.length === 1 ? 'template' : 'templates'}
          </p>
        </div>

        <div className="filters">
          <label className="search-field">
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <circle cx="11" cy="11" r="6.5" />
              <path d="m16 16 4.5 4.5" />
            </svg>
            <input
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search templates"
              aria-label="Search templates"
            />
            {query && (
              <button type="button" onClick={() => setQuery('')} aria-label="Clear search">
                <svg viewBox="0 0 24 24" aria-hidden="true">
                  <path d="m7 7 10 10M17 7 7 17" />
                </svg>
              </button>
            )}
          </label>

          <div className="filter-row">
            <div className="segmented-control" aria-label="Filter by size">
              {Object.entries(RATIO_FILTERS).map(([value, label]) => (
                <button
                  key={value}
                  type="button"
                  aria-pressed={ratio === value}
                  onClick={() => setRatio(value)}
                >
                  {label}
                </button>
              ))}
            </div>
            <div className="chip-row" aria-label="Filter by photo count">
              {PHOTO_FILTERS.map((value) => (
                <button
                  className="chip"
                  key={value}
                  type="button"
                  aria-pressed={photoCount === value}
                  onClick={() => setPhotoCount(value)}
                >
                  {photoFilterLabel(value)}
                </button>
              ))}
            </div>
          </div>
          <div className="category-row" aria-label="Filter by category">
            {CATEGORIES.map((value) => (
              <button
                className="category-chip"
                key={value}
                type="button"
                aria-pressed={category === value}
                onClick={() => setCategory(value)}
              >
                {value === 'All' ? 'All layouts' : value}
              </button>
            ))}
          </div>
        </div>

        {groupedTemplates.length ? (
          <div className="template-groups">
            {groupedTemplates.map(([group, templates]) => (
              <section className="template-group" key={group} aria-labelledby={`group-${group}`}>
                <div className="template-group__heading">
                  <h3 id={`group-${group}`}>{group}</h3>
                  <span>{templates.length}</span>
                </div>
                <div className="template-grid">
                  {templates.map((template) => (
                    <TemplateCard
                      key={template.id}
                      template={template}
                      onPreview={setSelectedTemplate}
                      onUse={useTemplate}
                    />
                  ))}
                </div>
              </section>
            ))}
          </div>
        ) : (
          <div className="empty-state">
            <span className="empty-state__mark" aria-hidden="true">⌕</span>
            <h3>No templates found</h3>
            <p>Try a different search or clear a filter to see more ideas.</p>
            <button
              className="button button--secondary"
              type="button"
              onClick={() => {
                setQuery('')
                setRatio('All')
                setPhotoCount('Any')
                setCategory('All')
              }}
            >
              Clear filters
            </button>
          </div>
        )}
      </section>

      <footer className="footer">
        <p>Made for the moments you want to share.</p>
        <a href={editorUrl(null)}>Open the full editor <span aria-hidden="true">↗</span></a>
      </footer>

      <TemplateDialog
        template={selectedTemplate}
        onClose={() => setSelectedTemplate(null)}
        onUse={useTemplate}
      />
    </main>
  )
}
