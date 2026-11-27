import { notes } from '../data/notes'
import { shortDate } from '../data/posts'

export default function Notes() {
  return (
    <section className="container page-section">
      <header className="page-header">
        <span className="eyebrow mono">GARDEN / NOTES</span>
        <h1>笔记</h1>
        <p>比文章短，比灵感长。记录当下确实有用的结论，持续更新。</p>
      </header>

      <div className="notes-page-list">
        {notes.map((note) => (
          <article key={note.id} className="note-entry">
            <div className="note-entry-meta mono">
              <span>{note.id}</span>
              <span className="meta-dot" />
              <span>{note.category}</span>
              <span className="meta-dot" />
              <span>{shortDate(note.date)}</span>
            </div>
            <h2>{note.title}</h2>
            <p>{note.content}</p>
            <div className="article-tags">
              {note.tags.map((tag) => <span key={tag}>{tag}</span>)}
            </div>
          </article>
        ))}
      </div>
    </section>
  )
}
