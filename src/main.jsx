import React, { lazy, Suspense, useEffect } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import { usePathname } from './lib/router.js'

const loadEditor = () => import('./editor/Editor.jsx')
const Editor = lazy(loadEditor)

function Root() {
  const path = usePathname()
  const editing = path === '/edit' || path === '/editor.html'

  // Warm the editor chunk while the user browses, so opening a design feels instant.
  useEffect(() => {
    if (editing) return
    const idle = window.requestIdleCallback || ((fn) => setTimeout(fn, 1200))
    idle(() => loadEditor())
  }, [editing])

  return editing ? (
    <Suspense fallback={<div className="editor-loading" aria-busy="true" />}>
      <Editor />
    </Suspense>
  ) : (
    <App />
  )
}

createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Root />
  </React.StrictMode>,
)
