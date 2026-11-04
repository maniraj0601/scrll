import { useSyncExternalStore } from 'react'

// Tiny History-API router: the app has two surfaces (Studio home at "/" and the
// editor at "/edit"), so a dependency-free store is all we need.
const EVENT = 'app:navigate'

const subscribe = (cb) => {
  window.addEventListener('popstate', cb)
  window.addEventListener(EVENT, cb)
  return () => {
    window.removeEventListener('popstate', cb)
    window.removeEventListener(EVENT, cb)
  }
}

export const usePathname = () => useSyncExternalStore(subscribe, () => window.location.pathname)

/** Client-side navigation. Entries pushed here are marked so the editor can step back instead of stacking history. */
export function navigate(to, { replace = false } = {}) {
  const state = { app: true }
  if (replace) history.replaceState(state, '', to)
  else history.pushState(state, '', to)
  window.dispatchEvent(new Event(EVENT))
}

/** Leave the current screen: pop our own history entry when there is one, otherwise go home. */
export function goBack(fallback = '/') {
  if (history.state?.app) history.back()
  else navigate(fallback, { replace: true })
}

/** onClick for <a href> that should navigate in-app (keeps modifier-click / new-tab behaviour). */
export function linkClick(event) {
  if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return
  const a = event.currentTarget
  if (a.target && a.target !== '_self') return
  event.preventDefault()
  navigate(a.getAttribute('href'))
}
