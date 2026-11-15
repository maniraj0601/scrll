import { useEffect, useRef, useState } from 'react'
import Icon from './Icon.jsx'
import QrCode from './QrCode.jsx'
import { codeFor } from '../lib/shareCode.js'
import { templateUrl } from '../lib/links.js'

// Scan the code or search it on Home to open this exact design directly, instead of
// scrolling the grid to find it again. One hero QR + code, two clear actions — no raw URL
// on screen, no separate rows competing for attention.
export default function ShareDialog({ item, onClose }) {
  const dialogRef = useRef(null)
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    const dialog = dialogRef.current
    if (!dialog) return
    if (item && !dialog.open) dialog.showModal()
    if (!item && dialog.open) dialog.close()
    setCopied(false)
  }, [item])

  function handleBackdropClick(event) {
    if (event.target === dialogRef.current) onClose()
  }

  const url = item && typeof window !== 'undefined' ? `${window.location.origin}${templateUrl(item)}` : ''
  const code = item ? codeFor(item.id) : ''

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(url)
      setCopied(true)
      setTimeout(() => setCopied(false), 1600)
    } catch {
      // Clipboard permission denied or unavailable — share sheet is still the fallback.
    }
  }

  return (
    <dialog
      ref={dialogRef}
      className="share-dialog"
      aria-labelledby="share-dialog-title"
      onClose={onClose}
      onClick={handleBackdropClick}
    >
      {item && (
        <div className="share-dialog__content">
          <button className="icon-button share-dialog__close" type="button" onClick={onClose} aria-label="Close share">
            <Icon name="close" size={18} />
          </button>

          <p className="eyebrow">Share</p>
          <h2 id="share-dialog-title">{item.name}</h2>

          <div className="share-dialog__hero">
            <QrCode value={url} size={176} />
            <p className="share-dialog__code-value">{code}</p>
            <p className="share-dialog__hint">Scan it, or search this code on Home</p>
          </div>

          <div className="share-dialog__actions">
            <button className="button button--secondary" type="button" onClick={copy}>
              <Icon name={copied ? 'check' : 'copy'} size={16} />
              {copied ? 'Copied!' : 'Copy link'}
            </button>
            {typeof navigator !== 'undefined' && navigator.share && (
              <button
                className="button button--primary"
                type="button"
                onClick={() => navigator.share({ title: item.name, url }).catch(() => {})}
              >
                <Icon name="share" size={16} />
                Share
              </button>
            )}
          </div>
        </div>
      )}
    </dialog>
  )
}
