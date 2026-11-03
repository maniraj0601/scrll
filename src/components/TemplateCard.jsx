import { templateMeta } from '../lib/templates.js'
import SlidePreview from './SlidePreview.jsx'

export default function TemplateCard({ template, onPreview, onUse }) {
  return (
    <article className="template-card">
      <button
        className="template-card__preview"
        type="button"
        onClick={() => onPreview(template)}
        aria-label={`Preview ${template.name}`}
      >
        <SlidePreview template={template} compact />
        <span className="template-card__preview-hint">Preview</span>
      </button>
      <div className="template-card__details">
        <div className="template-card__copy">
          <p className="eyebrow">{template.style}</p>
          <h3>{template.name}</h3>
          <p className="template-card__meta">{templateMeta(template)}</p>
        </div>
        <button className="button button--primary button--small" type="button" onClick={() => onUse(template)}>
          Use
        </button>
      </div>
    </article>
  )
}
