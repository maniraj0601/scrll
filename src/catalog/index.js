import { CAROUSELS } from './carousels.js'
import { LAYOUTS } from './layouts.js'

export { photoURL } from './primitives.js'

// One library for the home page: multi-slide carousels first, then Explore layouts.
// The editor receives the same data via vite.config.js (window.CATALOG).
const photoCount = (t) => (t.m ? t.L : t.S.flatMap((s) => s.L)).filter((l) => l.t === 'i' || l.t === 'p').length

export const LIBRARY = [
  ...CAROUSELS.map((t) => ({ ...t, kind: 'carousel' })),
  ...LAYOUTS.map((t) => ({ ...t, kind: 'layout' })),
].map((t) => ({ ...t, tags: t.tags || '', p: photoCount(t), n: t.m || t.S.length }))

export const CATEGORY_ORDER = [
  'Carousels', 'Seamless', 'Story', 'Editorial', 'Scrapbook', 'Tips & text',
  'Photo dump', 'Photo in photo', 'Strips & bands', 'Torn & cutout', 'Type', 'Overlay',
]
const known = new Set(CATEGORY_ORDER)
export const CATEGORIES = [
  'All',
  ...CATEGORY_ORDER.filter((c) => LIBRARY.some((t) => t.cat === c)),
  ...[...new Set(LIBRARY.map((t) => t.cat))].filter((c) => !known.has(c)),
]

export const FORMAT_INFO = {
  '4/5': { label: 'Portrait', ratio: '4:5' },
  '1/1': { label: 'Square', ratio: '1:1' },
  '9/16': { label: 'Story', ratio: '9:16' },
}
export const RATIO_LABEL = Object.fromEntries(Object.entries(FORMAT_INFO).map(([k, v]) => [k, `${v.label} ${v.ratio}`]))

export const SLIDE_FILTERS = { Any: 'Any length', single: 'Single slide', multi: 'Multi-slide' }
export const matchesSlides = (t, f) => f === 'Any' || (f === 'multi' ? t.n > 1 : t.n === 1)

export const templateMeta = (t) =>
  `${RATIO_LABEL[t.ar]} · ${t.p ? `${t.p} photo${t.p > 1 ? 's' : ''}` : 'Text only'} · ${t.n} slide${t.n > 1 ? 's' : ''}`

export const searchText = (t) => `${t.name} ${t.cat} ${t.tags}`.toLocaleLowerCase()
