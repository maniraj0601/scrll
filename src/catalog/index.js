import { CAROUSELS } from './carousels.js'
import { LAYOUTS } from './layouts.js'

export { photoURL } from './primitives.js'

// Two shelves sharing one schema:
//  - TEMPLATES: the regular multi-slide carousels (Home).
//  - EXPLORE:   trending photo layouts and collages (Explore page).
// The editor imports the same modules (src/editor/engine.js), so both stay in sync.
const photoCount = (t) => (t.m ? t.L : t.S.flatMap((s) => s.L)).filter((l) => l.t === 'i' || l.t === 'p').length
const withMeta = (kind) => (t) => ({ ...t, kind, tags: t.tags || '', p: photoCount(t), n: t.m || t.S.length })

export const TEMPLATES = CAROUSELS.map(withMeta('carousel'))
export const EXPLORE = LAYOUTS.map(withMeta('layout'))

// Hand-picked "Trending now" rail: the looks people are making most this season.
const TRENDING_IDS = [
  'x-dump9', 'x-torn', 'x-film', 'x-digicam', 'x-ripreveal', 'x-postcard',
  'x-player', 'x-journal', 'x-pano', 'x-profile', 'x-bows', 'x-tokyo',
]
const byId = new Map(EXPLORE.map((t) => [t.id, t]))
export const TRENDING = TRENDING_IDS.map((id) => byId.get(id)).filter(Boolean)

export const CATEGORY_ORDER = [
  'Carousels', 'Seamless', 'Story', 'Editorial', 'Scrapbook', 'Tips & text',
  'Photo dump', 'Photo in photo', 'Strips & bands', 'Torn & cutout', 'Type', 'Overlay',
]
const known = new Set(CATEGORY_ORDER)
export const categoriesOf = (list) => [
  'All',
  ...CATEGORY_ORDER.filter((c) => list.some((t) => t.cat === c)),
  ...[...new Set(list.map((t) => t.cat))].filter((c) => !known.has(c)),
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
