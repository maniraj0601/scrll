import { EXPLORE, TEMPLATES } from '../catalog/index.js'

// A short, typeable stand-in for a template/layout id — handy when a link isn't practical
// (read aloud, printed, etc). Deterministic (same id always yields the same code), so it
// needs no storage of its own; everything derives from the existing catalog ids.
const ALPHABET = '23456789ABCDEFGHJKLMNPQRSTUVWXYZ' // no 0/O/1/I — easy to read back
const CODE_LENGTH = 5

function hash(str) {
  let h = 5381
  for (let i = 0; i < str.length; i++) h = (h * 33 + str.charCodeAt(i)) >>> 0
  return h
}

export function codeFor(id) {
  let h = hash(id)
  let code = ''
  for (let i = 0; i < CODE_LENGTH; i++) {
    code = ALPHABET[h % ALPHABET.length] + code
    h = Math.floor(h / ALPHABET.length)
  }
  return code
}

const SHAREABLE = [...TEMPLATES, ...EXPLORE]
const BY_CODE = new Map(SHAREABLE.map((item) => [codeFor(item.id), item]))

export function itemForCode(code) {
  return BY_CODE.get(code.trim().toUpperCase().replace(/[^A-Z0-9]/g, ''))
}
