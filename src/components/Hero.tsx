import { ArrowRight, Sparkles, Github, Code2 } from 'lucide-react'
import { siteConfig } from '../config'

export default function Hero() {
  return (
    <section className="hero container">
      <div className="hero-copy">
        <span className="hero-badge"><Sparkles size={14} /> 欢迎来到我的技术博客</span>
        <h1>
          写代码，<br />
          <span className="gradient-text">也写生活。</span>
        </h1>
        <p className="hero-description">{siteConfig.description}</p>
        <div className="hero-actions">
          <a className="btn btn-primary" href="#/posts">开始阅读 <ArrowRight size={17} /></a>
          <a className="btn btn-ghost" href="#/about">了解更多</a>
        </div>
        <div className="hero-note"><Code2 size={14} /> 用简单的文字，记录不简单的思考</div>
      </div>

      <div className="hero-visual" aria-hidden="true">
        <div className="hero-glow" />
        <div className="floating-badge badge-one"><Sparkles size={14} /> Keep learning</div>
        <div className="terminal-card">
          <div className="terminal-bar">
            <span className="dots"><i /><i /><i /></span>
            <span className="terminal-title">~/blog/welcome.ts</span>
          </div>
          <div className="terminal-body">
            <div><span className="line-no">01</span><span className="c-purple">const</span> <span className="c-blue">me</span> = {'{'}</div>
            <div><span className="line-no">02</span>&nbsp;&nbsp;role: <span className="c-green">'developer'</span>,</div>
            <div><span className="line-no">03</span>&nbsp;&nbsp;loves: [<span className="c-green">'code'</span>, <span className="c-green">'writing'</span>],</div>
            <div><span className="line-no">04</span>&nbsp;&nbsp;coffee: <span className="c-orange">Infinity</span></div>
            <div><span className="line-no">05</span>{'}'}</div>
            <div className="terminal-comment"><span className="line-no">06</span>// 保持好奇，持续输出 ✨</div>
          </div>
        </div>
        <div className="floating-badge badge-two"><Github size={14} /> Open source</div>
      </div>
    </section>
  )
}
