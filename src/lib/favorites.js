import { useCallback, useEffect, useState } from 'react'

const KEY = 'carousel-studio-favorites'
const listeners = new Set()

function readAll() {
  try {
    const raw = JSON.parse(localStorage.getItem(KEY) || '[]')
    return Array.isArray(raw) ? raw : []
  } catch {
    return []
  }
}

function writeAll(list) {
  try {
    localStorage.setItem(KEY, JSON.stringify(list))
  } catch {
    // Favorites just won't persist when storage is unavailable; still works for this visit.
  }
  listeners.forEach((fn) => fn())
}

// Templates, layouts and stickers don't share one id namespace, so a favourite is keyed
// by kind ("carousel" | "layout" | "sticker") plus the catalog id. Stored in localStorage —
// there's no account or backend, same as the theme preference.
export const favoriteKey = (kind, id) => `${kind}:${id}`

export function useFavorites() {
  const [keys, setKeys] = useState(() => new Set(readAll()))

  useEffect(() => {
    const onChange = () => setKeys(new Set(readAll()))
    listeners.add(onChange)
    return () => listeners.delete(onChange)
  }, [])

  const has = useCallback((key) => keys.has(key), [keys])

  const toggle = useCallback((key) => {
    const all = readAll()
    const i = all.indexOf(key)
    if (i === -1) all.push(key)
    else all.splice(i, 1)
    writeAll(all)
  }, [])

  return { keys, has, toggle, count: keys.size }
}
