import { ArrowRight, BookOpen, Tags, CalendarCheck } from 'lucide-react'
import Hero from '../components/Hero'
import PostCard from '../components/PostCard'
import { allTags, formatDate, posts, readingMinutes } from '../data/posts'

export default function Home() {
  const featured = posts.find((post) => post.featured) ?? posts[0]
  const latest = posts.filter((post) => post.slug !== featured.slug).slice(0, 3)

  return (
    <>
      <Hero />

      <section className="container stats-section">
        <div className="stat-item"><BookOpen size={18} /><strong>{posts.length}</strong><span>篇文章</span></div>
        <div className="stat-divider" />
        <div className="stat-item"><Tags size={18} /><strong>{allTags.length}</strong><span>个标签</span></div>
        <div className="stat-divider" />
        <div className="stat-item"><CalendarCheck size={18} /><strong>{formatDate(posts[0].date)}</strong><span>最近更新</span></div>
      </section>

      <section className="container section">
        <div className="section-heading">
          <div>
            <span className="section-kicker">Editor's Pick</span>
            <h2>精选文章</h2>
          </div>
          <a className="section-link" href="#/posts">查看全部 <ArrowRight size={16} /></a>
        </div>

        <a className="featured-card" href={`#/post/${featured.slug}`}>
          <div className="featured-content">
            <span className="featured-label">置顶推荐</span>
            <h3>{featured.title}</h3>
            <p>{featured.excerpt}</p>
            <div className="featured-meta">
              <span>{formatDate(featured.date)}</span>
              <span className="dot-separator" />
              <span>{readingMinutes(featured.content)} 分钟阅读</span>
            </div>
            <span className="featured-cta">阅读全文 <ArrowRight size={16} /></span>
          </div>
        </a>
      </section>

      <section className="container section">
        <div className="section-heading">
          <div>
            <span className="section-kicker">Latest Posts</span>
            <h2>最新文章</h2>
          </div>
          <a className="section-link" href="#/posts">全部文章 <ArrowRight size={16} /></a>
        </div>
        <div className="post-grid">
          {latest.map((post) => <PostCard key={post.slug} post={post} />)}
        </div>
      </section>

      <section className="container">
        <div className="cta-banner">
          <div>
            <span className="section-kicker">Let's connect</span>
            <h2>一起交流，一起成长</h2>
            <p>如果你对这些内容感兴趣，欢迎通过 GitHub 或邮件联系我。</p>
          </div>
          <a className="btn btn-primary" href="#/about">关于我 <ArrowRight size={17} /></a>
        </div>
      </section>
    </>
  )
}
