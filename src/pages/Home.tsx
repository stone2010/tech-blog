import { ArrowRight, ArrowUpRight } from 'lucide-react'
import ArticleRow from '../components/ArticleRow'
import { siteConfig } from '../config'
import { categories } from '../data/categories'
import { notes } from '../data/notes'
import { posts, readingMinutes, shortDate } from '../data/posts'
import { projects } from '../data/projects'

export default function Home() {
  const featured = posts.find((post) => post.featured) ?? posts[0]
  const latest = posts.filter((post) => post.slug !== featured.slug).slice(0, 5)

  return (
    <>
      <section className="home-intro container">
        <div className="intro-main">
          <span className="eyebrow">STONE / FIELD NOTES</span>
          <h1>技术记录，<br />与长期思考。</h1>
          <p className="intro-lede">{siteConfig.description}</p>
          <div className="intro-actions">
            <a className="button button-primary" href="#/posts">浏览文章 <ArrowRight size={15} /></a>
            <a className="button button-text" href="#/projects">查看项目 <ArrowUpRight size={15} /></a>
          </div>
        </div>
        <div className="intro-index mono">
          <div className="index-row"><span>EST.</span><strong>2026</strong></div>
          <div className="index-row"><span>ENTRIES</span><strong>{String(posts.length + notes.length).padStart(3, '0')}</strong></div>
          <div className="index-row"><span>FOCUS</span><strong>AI / SYSTEMS</strong></div>
          <div className="index-row"><span>STATUS</span><strong className="status-live"><i /> WRITING</strong></div>
        </div>
      </section>

      <div className="container content-grid">
        <aside className="left-rail" aria-label="站点索引">
          <div className="rail-section">
            <h2 className="mono">Index</h2>
            <a href="#/posts"><span>01</span> Articles</a>
            <a href="#/notes"><span>02</span> Notes</a>
            <a href="#/projects"><span>03</span> Projects</a>
            <a href="#/categories"><span>04</span> Categories</a>
          </div>
          <div className="rail-section">
            <h2 className="mono">Categories</h2>
            {categories.map((category) => (
              <a key={category.key} href={`#/category/${encodeURIComponent(category.key)}`}>
                <span>{category.key}</span>
              </a>
            ))}
          </div>
          <div className="rail-section rail-now">
            <h2 className="mono">Now</h2>
            {siteConfig.now.map((item) => (
              <div key={item.label}>
                <span className="mono">{item.label}</span>
                <p>{item.value}</p>
              </div>
            ))}
          </div>
        </aside>

        <div className="content-main">
          <section className="feed-section">
            <div className="section-head mono">
              <span>Featured / {featured.category}</span>
              <span>{shortDate(featured.date)}</span>
            </div>
            <a className="featured-article" href={`#/post/${featured.slug}`}>
              <div className="featured-meta mono">
                <span className="meta-category">NOTE-001</span>
                <span className="meta-dot" />
                <span>{readingMinutes(featured.content)} min read</span>
              </div>
              <h2>{featured.title}</h2>
              <p>{featured.excerpt}</p>
              <div className="featured-foot">
                <div className="article-tags">
                  {featured.tags.map((tag) => <span key={tag}>{tag}</span>)}
                </div>
                <span className="featured-link">Read article <ArrowRight size={14} /></span>
              </div>
            </a>
          </section>

          <section className="feed-section">
            <div className="section-head mono">
              <span>Latest Articles</span>
              <a href="#/posts">All articles <ArrowRight size={13} /></a>
            </div>
            <div className="article-list">
              {latest.map((post, index) => <ArticleRow key={post.slug} post={post} index={index} />)}
            </div>
          </section>

          <section className="feed-section">
            <div className="section-head mono">
              <span>Field Notes</span>
              <a href="#/notes">All notes <ArrowRight size={13} /></a>
            </div>
            <div className="note-list">
              {notes.slice(0, 3).map((note) => (
                <a key={note.id} className="note-row" href="#/notes">
                  <span className="mono note-id">{note.id}</span>
                  <span className="note-title">{note.title}</span>
                  <span className="mono note-date">{shortDate(note.date)}</span>
                  <ArrowUpRight size={14} />
                </a>
              ))}
            </div>
          </section>

          <section className="feed-section">
            <div className="section-head mono">
              <span>Selected Projects</span>
              <a href="#/projects">All projects <ArrowRight size={13} /></a>
            </div>
            <div className="project-list">
              {projects.slice(0, 2).map((project) => (
                <a key={project.slug} className="project-row" href={project.repo ?? '#/projects'} target="_blank" rel="noreferrer">
                  <span className="project-name">{project.name}</span>
                  <span className="project-desc">{project.description}</span>
                  <span className="mono project-year">{project.year}</span>
                </a>
              ))}
            </div>
          </section>
        </div>
      </div>
    </>
  )
}
