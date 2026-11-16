import { useId, useMemo } from 'react'
import qrcode from 'qrcode-generator'

// The three 7×7 finder squares (top-left, top-right, bottom-left) that scanners lock onto
// first — these stay solid, recognizably square shapes. Styling only touches the data
// modules outside them, which scanners read purely by per-module contrast, not shape.
const inFinderZone = (row, col, count) => {
  const corner = (r, c) => r < 7 && c < 7
  return corner(row, col) || corner(row, count - 1 - col) || corner(count - 1 - row, col)
}

// Renders entirely client-side (qrcode-generator has zero runtime dependencies) — no
// network call to a third-party QR service, consistent with this app having no backend.
// Dot-style modules + gradient read as a current, less "fax machine" look while keeping
// every module's own dark/light value and position identical to a plain QR — the only
// things scanners actually rely on — so decodability doesn't change. Verified with a
// jsQR round-trip against the rendered SVG, not just visually.
export default function QrCode({ value, size = 168 }) {
  const gradId = useId()
  const { finderPath, dotsPath } = useMemo(() => {
    const qr = qrcode(0, 'M')
    qr.addData(value)
    qr.make()
    const count = qr.getModuleCount()
    const cell = size / count
    let finderPath = ''
    let dotsPath = ''
    for (let row = 0; row < count; row++) {
      for (let col = 0; col < count; col++) {
        if (!qr.isDark(row, col)) continue
        if (inFinderZone(row, col, count)) {
          const x = col * cell, y = row * cell
          finderPath += `M${x},${y}h${cell}v${cell}h${-cell}z`
        } else {
          const cx = col * cell + cell / 2
          const cy = row * cell + cell / 2
          const r = cell * 0.44
          dotsPath += `M${cx - r},${cy}a${r},${r} 0 1,0 ${r * 2},0a${r},${r} 0 1,0 ${-r * 2},0`
        }
      }
    }
    return { finderPath, dotsPath }
  }, [value, size])

  return (
    <svg className="qr-code" viewBox={`0 0 ${size} ${size}`} width={size} height={size} role="img" aria-label="QR code for this link">
      <defs>
        <linearGradient id={gradId} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#0a84ff" />
          <stop offset="100%" stopColor="#5e5ce6" />
        </linearGradient>
      </defs>
      {/* The global `svg { fill: none }` reset beats SVG presentation attributes regardless of
          the URL they point to, so the gradient fill has to go through inline `style` (which
          outranks any external stylesheet rule) rather than a `fill` attribute. */}
      <rect width={size} height={size} style={{ fill: '#fff' }} rx={size * 0.06} />
      <path d={finderPath} style={{ fill: `url(#${gradId})` }} />
      <path d={dotsPath} style={{ fill: `url(#${gradId})` }} />
    </svg>
  )
}
