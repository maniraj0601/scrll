import { useEffect, useRef, useState } from 'react'
import Icon from './Icon.jsx'
import QrCode from './QrCode.jsx'
import { codeFor } from '../lib/shareCode.js'
import { templateUrl } from '../lib/links.js'

// Scan the code, type the quick code into search, or copy the link — any of the three
// opens this exact design directly, instead of scrolling the grid to find it again.
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
      // Clipboard permission denied or unavailable — the link is still right there to select.
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
          <div className="template-dialog__header">
            <div>
              <p className="eyebrow">Share</p>
              <h2 id="share-dialog-title">{item.name}</h2>
            </div>
            <button className="icon-button" type="button" onClick={onClose} aria-label="Close share">
              <Icon name="close" size={18} />
            </button>
          </div>

          <div className="share-dialog__qr">
            <QrCode value={url} />
            <div className="share-dialog__code">
              <p className="share-dialog__code-label">Quick code</p>
              <p className="share-dialog__code-value">{code}</p>
            </div>
          </div>

          <p className="template-dialog__note">
            Scan the code, search “{code}” on Home, or share the link — all three open this design
            directly.
          </p>

          <div className="share-dialog__link">
            <input readOnly value={url} onFocus={(event) => event.target.select()} aria-label="Shareable link" />
            <button className="button button--secondary button--small" type="button" onClick={copy}>
              <Icon name={copied ? 'check' : 'copy'} size={16} />
              {copied ? 'Copied' : 'Copy'}
            </button>
          </div>

          {typeof navigator !== 'undefined' && navigator.share && (
            <button
              className="button button--primary"
              type="button"
              onClick={() => navigator.share({ title: item.name, url }).catch(() => {})}
            >
              <Icon name="share" size={16} />
              Share link
            </button>
          )}
        </div>
      )}
    </dialog>
  )
}
