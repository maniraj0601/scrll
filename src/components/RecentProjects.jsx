import Icon from './Icon.jsx'
import { projectUrl } from '../lib/links.js'
import { linkClick } from '../lib/router.js'
import { timeAgo } from '../lib/projects.js'

function ProjectCard({ project, onDelete }) {
  return (
    <article className="project-card">
      <a className="project-card__open" href={projectUrl(project.id)} onClick={linkClick} aria-label={`Open ${project.name}`}>
        <span className="project-card__thumb" style={{ aspectRatio: project.ratio }}>
          {project.thumb ? <img src={project.thumb} alt="" loading="lazy" decoding="async" /> : <Icon name="photo" size={26} />}
        </span>
        <span className="project-card__name">{project.name}</span>
        <span className="project-card__meta">
          {timeAgo(project.updated)} · {project.slides} {project.slides === 1 ? 'slide' : 'slides'}
        </span>
      </a>
      <button
        className="project-card__delete"
        type="button"
        aria-label={`Delete ${project.name}`}
        onClick={() => {
          if (window.confirm(`Delete “${project.name}”? This can’t be undone.`)) onDelete(project.id)
        }}
      >
        <Icon name="trash" size={15} />
      </button>
    </article>
  )
}

export default function RecentProjects({ projects, loading, onDelete, limit, onSeeAll, onCreate, title = 'Continue editing' }) {
  const shown = limit ? projects.slice(0, limit) : projects

  return (
    <section className={`section${projects.length ? ' section--drafts' : ''}`} aria-labelledby="recent-title">
      <div className="section__head">
        <h2 id="recent-title">{title}</h2>
        {onSeeAll && projects.length > limit && (
          <button className="link-button" type="button" onClick={onSeeAll}>
            See all {projects.length}
            <Icon name="chevron" size={15} />
          </button>
        )}
      </div>

      {loading ? (
        <div className="project-grid" aria-busy="true">
          {Array.from({ length: 3 }, (_, i) => <div key={i} className="project-card project-card--skeleton" />)}
        </div>
      ) : shown.length ? (
        <div className={limit ? 'project-rail' : 'project-grid'}>
          {shown.map((p) => <ProjectCard key={p.id} project={p} onDelete={onDelete} />)}
        </div>
      ) : (
        <div className="empty-card">
          <Icon name="designs" size={28} />
          <div>
            <h3>No drafts yet</h3>
            <p>Carousels you make are saved automatically on this device and will show up here.</p>
          </div>
          <button className="button button--secondary button--small" type="button" onClick={onCreate}>
            Start one
          </button>
        </div>
      )}
    </section>
  )
}
