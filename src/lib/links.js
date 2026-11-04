// Deep links into the editor route (/edit). Keep these in sync with the URL
// handling at the bottom of src/editor/engine.js.

export const FORMATS = [
  { id: '4/5', label: 'Portrait', ratio: '4:5', size: '1080 × 1350', hint: 'Best for feed posts' },
  { id: '1/1', label: 'Square', ratio: '1:1', size: '1080 × 1080', hint: 'Classic grid' },
  { id: '9/16', label: 'Story', ratio: '9:16', size: '1080 × 1920', hint: 'Stories & reels' },
]

export const MAX_SLIDES = 20

export const templateUrl = (template) => `/edit?template=${encodeURIComponent(template.id)}`

export const blankUrl = (format = '4/5', slides = 1) =>
  `/edit?new=1&ar=${encodeURIComponent(format)}&n=${slides}`

export const projectUrl = (id) => `/edit?open=${encodeURIComponent(id)}`
