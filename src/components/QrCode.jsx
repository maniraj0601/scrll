import { useMemo } from 'react'
import qrcode from 'qrcode-generator'

// Renders entirely client-side (qrcode-generator has zero runtime dependencies) — no
// network call to a third-party QR service, consistent with this app having no backend.
export default function QrCode({ value, size = 168 }) {
  const path = useMemo(() => {
    const qr = qrcode(0, 'M')
    qr.addData(value)
    qr.make()
    const count = qr.getModuleCount()
    const cell = size / count
    let d = ''
    for (let row = 0; row < count; row++) {
      for (let col = 0; col < count; col++) {
        if (qr.isDark(row, col)) d += `M${col * cell},${row * cell}h${cell}v${cell}h${-cell}z`
      }
    }
    return d
  }, [value, size])

  return (
    <svg className="qr-code" viewBox={`0 0 ${size} ${size}`} width={size} height={size} role="img" aria-label="QR code for this link">
      <rect width={size} height={size} fill="#fff" rx={8} />
      <path d={path} fill="#111" />
    </svg>
  )
}
