import { useEffect, useMemo, useState } from 'react'
import { marked } from 'marked'
import { ArrowLeft, ArrowRight, CalendarDays, Clock3 } from 'lucide-react'
import { formatDate, getPost, posts, readingMinutes } from '../data/posts'

export default function PostDetail({ slug }: { slug: string }) {
  const post = getPost(slug)
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    const update = () => {
      const total = document.documentElement.scrollHeight - window.innerHeight
      setProgress(total <= 0 ? 0 : Math.min(100, (window.scrollY / total) * 100))
    }
    window.addEventListener('scroll', update, { passive: true })
    update()
    return () => window.removeEventListener('scroll', update)
  }, [slug])

  const html = useMemo(() => (post ? (marked.parse(post.content) as string) : ''), [post])

  if (!post) {
    return (
      <section className="container page-section empty-state">
        <h1>文章不存在</h1>
        <p>这篇文章可能已经被移动或删除。</p>
        <a className="btn btn-primary" href="#/posts">返回文章列表</a>
      </section>
    )
  }

  const index = posts.findIndex((item) => item.slug === post.slug)
  const newer = posts[index - 1]
  const older = posts[index + 1]

  return (
    <>
      <div className="reading-progress"><span style={{ width: `${progress}%` }} /></div>
      <article className="post-detail container">
        <a className="back-link" href="#/posts"><ArrowLeft size={16} /> 返回文章列表</a>

        <header className="post-detail-head">
          <div className="post-detail-tags">
            {post.tags.map((tag) => <a key={tag} className="tag-chip" href={`#/tags/${encodeURIComponent(tag)}`}>{tag}</a>)}
          </div>
          <h1>{post.title}</h1>
          <p className="post-detail-excerpt">{post.excerpt}</p>
          <div className="post-detail-meta">
            <span><CalendarDays size={15} /> {formatDate(post.date)}</span>
            <span><Clock3 size={15} /> 约 {readingMinutes(post.content)} 分钟阅读</span>
          </div>
        </header>

        <div className="post-divider" />
        <div className="prose" dangerouslySetInnerHTML={{ __html: html }} />

        <nav className="post-navigation">
          {newer ? (
            <a href={`#/post/${newer.slug}`}>
              <span><ArrowLeft size={14} /> 更新一篇</span>
              <strong>{newer.title}</strong>
            </a>
          ) : <div />}
          {older && (
            <a className="next" href={`#/post/${older.slug}`}>
              <span>更早一篇 <ArrowRight size={14} /></span>
              <strong>{older.title}</strong>
            </a>
          )}
        </nav>
      </article>
    </>
  )
}
