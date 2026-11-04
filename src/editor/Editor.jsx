import { useEffect, useRef } from 'react'
import { useStyleSheet } from '../lib/useStyleSheet.js'
import { goBack, navigate } from '../lib/router.js'
import css from './editor.css?inline'
import { mountEditor } from './engine.js'

const DEEP_LINK = /[?&](template|new|open|sticker)=/

export default function Editor() {
  const ref = useRef(null)
  useStyleSheet('editor-css', css)

  useEffect(() => {
    const { pathname, search, hash } = window.location
    // Old bookmarks: /editor.html?… → /edit?…
    if (pathname !== '/edit') history.replaceState(history.state, '', `/edit${search}${hash}`)
    if (!DEEP_LINK.test(search)) {
      navigate('/', { replace: true })
      return
    }
    // Deferred one task so React StrictMode's mount → unmount → mount probe
    // never starts two engines racing over the same draft.
    let dispose
    const t = setTimeout(() => {
      dispose = mountEditor(ref.current, {
        search,
        hash,
        onExit: () => goBack('/'),
        onMissing: () => navigate('/', { replace: true }),
      })
    })
    return () => {
      clearTimeout(t)
      dispose?.()
    }
  }, [])

  return <div ref={ref} className="editor-root" />
}
