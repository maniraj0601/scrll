import { useEffect, useRef } from 'react'
import { templateMeta } from '../lib/templates.js'
import SlidePreview from './SlidePreview.jsx'

export default function TemplateDialog({ template, onClose, onUse }) {
  const dialogRef = useRef(null)

  useEffect(() => {
    const dialog = dialogRef.current
    if (!dialog) return

    if (template && !dialog.open) dialog.showModal()
    if (!template && dialog.open) dialog.close()
  }, [template])

  function handleBackdropClick(event) {
    if (event.target === dialogRef.current) onClose()
  }

  return (
    <dialog
      ref={dialogRef}
      className="template-dialog"
      aria-labelledby="template-dialog-title"
      onClose={onClose}
      onClick={handleBackdropClick}
    >
      {template && (
        <div className="template-dialog__content">
          <div className="template-dialog__header">
            <div>
              <p className="eyebrow">{template.style}</p>
              <h2 id="template-dialog-title">{template.name}</h2>
              <p className="template-card__meta">{templateMeta(template)}</p>
            </div>
            <button className="icon-button" type="button" onClick={onClose} aria-label="Close preview">
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <path d="m6 6 12 12M18 6 6 18" />
              </svg>
            </button>
          </div>
          <SlidePreview template={template} />
          <p className="template-dialog__note">
            Swipe to explore every slide. Replace the gradient photo placeholders with your own images in the editor.
          </p>
          <div className="template-dialog__actions">
            <button className="button button--secondary" type="button" onClick={onClose}>
              Keep browsing
            </button>
            <button className="button button--primary" type="button" onClick={() => onUse(template)}>
              Use this template
            </button>
          </div>
        </div>
      )}
    </dialog>
  )
}
