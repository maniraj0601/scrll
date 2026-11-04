import { useLayoutEffect } from 'react'

// Route-scoped CSS: the sheet exists only while the route is mounted, so the
// home and editor styles (which both style body, buttons, .chip, …) never clash.
const counts = new Map()

export function useStyleSheet(id, css) {
  useLayoutEffect(() => {
    let el = document.getElementById(id)
    if (!el) {
      el = document.createElement('style')
      el.id = id
      el.textContent = css
      document.head.append(el)
    }
    counts.set(id, (counts.get(id) || 0) + 1)
    return () => {
      const n = counts.get(id) - 1
      counts.set(id, n)
      if (!n) el.remove()
    }
  }, [id, css])
}
