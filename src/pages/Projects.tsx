import { ArrowUpRight } from 'lucide-react'
import { projects } from '../data/projects'

const statusLabel = {
  active: 'ACTIVE',
  experiment: 'EXPERIMENT',
  archived: 'ARCHIVED',
} as const

export default function Projects() {
  return (
    <section className="container page-section">
      <header className="page-header">
        <span className="eyebrow mono">WORK / PROJECTS</span>
        <h1>项目</h1>
        <p>开源工具、实验性项目和持续维护的小东西。</p>
      </header>

      <div className="project-page-list">
        {projects.map((project) => (
          <article key={project.slug} className="project-entry">
            <div className="project-entry-head mono">
              <span>{project.year}</span>
              <span className={`status status-${project.status}`}>{statusLabel[project.status]}</span>
            </div>
            <div className="project-entry-body">
              <h2>{project.name}</h2>
              <p>{project.description}</p>
              <div className="project-stack">
                {project.stack.map((tech) => <span key={tech} className="mono">{tech}</span>)}
              </div>
            </div>
            <div className="project-links">
              {project.repo && (
                <a href={project.repo} target="_blank" rel="noreferrer">Repository <ArrowUpRight size={14} /></a>
              )}
              {project.url && (
                <a href={project.url} target="_blank" rel="noreferrer">Live site <ArrowUpRight size={14} /></a>
              )}
            </div>
          </article>
        ))}
      </div>
    </section>
  )
}
