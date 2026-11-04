import { memo } from 'react'
import { RATIO_LABEL } from '../catalog/index.js'
import { Cover } from './SlidePreview.jsx'

// Cover-first card: the design itself is the hero, details stay quiet underneath.
function TemplateCard({ template, onPreview, onUse }) {
  return (
    <article className="template-card">
      <div className="template-card__frame">
        <button className="template-card__preview" type="button" onClick={() => onPreview(template)} aria-label={`Preview ${template.name}`}>
          <Cover template={template} />
        </button>
        {template.n > 1 && <span className="template-card__badge">{template.m ? 'Seamless · ' : ''}{template.n} slides</span>}
        <button className="button button--primary button--small template-card__use" type="button" onClick={() => onUse(template)}>
          Use
        </button>
      </div>
      <div className="template-card__copy">
        <h3>{template.name}</h3>
        <p className="template-card__meta">{template.cat} · {RATIO_LABEL[template.ar]}</p>
      </div>
    </article>
  )
}

export default memo(TemplateCard)
