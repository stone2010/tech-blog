import { ArrowRight } from 'lucide-react'
import { siteConfig } from '../config'

export default function Hero() {
  return (
    <section className="hero container">
      <div className="hero-copy">
        <span className="hero-badge eyebrow">欢迎来到我的技术博客</span>
        <h1>
          写代码，<br />
          <span className="hero-accent">也写生活。</span>
        </h1>
        <p className="hero-description">{siteConfig.description}</p>
        <div className="hero-actions">
          <a className="btn btn-primary" href="#/posts">开始阅读 <ArrowRight size={16} /></a>
          <a className="btn btn-ghost" href="#/about">了解更多</a>
        </div>
        <div className="hero-note">用简单的文字，记录不简单的思考</div>
      </div>

      <div className="note-card">
        <span className="note-label">Field Note · 01</span>
        <p className="note-quote">
          好的技术文章，<br />
          应该把复杂的问题<br />
          <em>讲简单。</em>
        </p>
        <div className="note-divider" />
        <div className="note-foot">
          <strong>{siteConfig.author}</strong>
          <span>写于日常</span>
        </div>
      </div>
    </section>
  )
}
