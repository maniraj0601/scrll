import { useCallback, useEffect, useState } from 'react'

// Drafts are written by the editor into IndexedDB ("carousel-studio": store `p` for
// projects, store `b` for photo blobs keyed `${projectId}|${imageKey}`). The home
// page only reads them and can delete them; the schema must match src/editor/engine.js.
const DB_NAME = 'carousel-studio'
const PREVIEW_NAMES = {
  default: 'Default',
  'mobile-wallpaper': 'Mobile wallpaper',
  'desktop-wallpaper': 'Desktop wallpaper',
  facebook: 'Facebook',
  instagram: 'Instagram',
}

let dbPromise
function openDb() {
  if (!dbPromise) {
    dbPromise = new Promise((resolve) => {
      try {
        const request = indexedDB.open(DB_NAME, 1)
        request.onupgradeneeded = () => {
          request.result.createObjectStore('p', { keyPath: 'id' })
          request.result.createObjectStore('b')
        }
        request.onsuccess = () => resolve(request.result)
        request.onerror = request.onblocked = () => resolve(null)
      } catch {
        resolve(null)
      }
    })
  }
  return dbPromise
}

function run(store, mode, fn) {
  return openDb().then(
    (db) =>
      db &&
      new Promise((resolve) => {
        try {
          const tx = db.transaction(store, mode)
          const request = fn(tx.objectStore(store))
          tx.oncomplete = () => resolve(request?.result)
          tx.onerror = tx.onabort = () => resolve(null)
        } catch {
          resolve(null)
        }
      }),
  )
}

const toSummary = (record) => ({
  id: record.id,
  name: record.name || 'Untitled carousel',
  updated: record.updated || record.created || 0,
  slides: record.n || 1,
  // the editor canvas is always 1080 wide; height decides the format
  ratio: `1080 / ${record.H || 1350}`,
  thumb: record.thumb || '',
  target: PREVIEW_NAMES[record.previewTarget] || PREVIEW_NAMES.default,
})

export async function listProjects() {
  const records = (await run('p', 'readonly', (store) => store.getAll())) || []
  return records.map(toSummary).sort((a, b) => b.updated - a.updated)
}

export async function deleteProject(id) {
  const record = await run('p', 'readonly', (store) => store.get(id))
  if (record?.imgs) {
    await run('b', 'readwrite', (store) => {
      for (const key of Object.keys(record.imgs)) store.delete(`${id}|${key}`)
    })
  }
  await run('p', 'readwrite', (store) => store.delete(id))
}

export function timeAgo(time) {
  const seconds = (Date.now() - time) / 1000
  if (seconds < 60) return 'Just now'
  if (seconds < 3600) return `${Math.floor(seconds / 60)} min ago`
  if (seconds < 86400) return `${Math.floor(seconds / 3600)} h ago`
  if (seconds < 172800) return 'Yesterday'
  return new Date(time).toLocaleDateString(undefined, { day: 'numeric', month: 'short' })
}

// Reloads when the tab becomes visible again (e.g. coming back from the editor,
// including bfcache restores) so "Continue editing" is always current.
export function useProjects() {
  const [state, setState] = useState({ loading: true, projects: [] })

  const refresh = useCallback(() => {
    listProjects().then((projects) => setState({ loading: false, projects }))
  }, [])

  useEffect(() => {
    refresh()
    const onVisible = () => document.visibilityState === 'visible' && refresh()
    window.addEventListener('pageshow', refresh)
    document.addEventListener('visibilitychange', onVisible)
    return () => {
      window.removeEventListener('pageshow', refresh)
      document.removeEventListener('visibilitychange', onVisible)
    }
  }, [refresh])

  const remove = useCallback(
    async (id) => {
      setState((current) => ({ ...current, projects: current.projects.filter((p) => p.id !== id) }))
      await deleteProject(id)
      refresh()
    },
    [refresh],
  )

  return { ...state, refresh, remove }
}
