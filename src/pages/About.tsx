import { ArrowUpRight } from 'lucide-react'
import { siteConfig } from '../config'

const skills = ['React', 'TypeScript', 'JavaScript', 'Node.js', 'Python', 'Rust', 'Vite', 'LLM Applications']
const log = [
  { year: '2026', text: '开始以 Field Notes 的形式持续输出，把博客改造成长期技术档案。' },
  { year: '2025', text: '深入 AI 应用与本地模型部署，写下一系列实验记录。' },
  { year: '2024', text: '从零系统学习前端，写下第一批真正上线的技术文章。' },
]

export default function About() {
  return (
    <section className="container page-section about-page">
      <header className="page-header">
        <span className="eyebrow mono">ABOUT / STONE</span>
        <h1>关于</h1>
        <p>写作者、开发者，长期主义者。</p>
      </header>

      <div className="about-grid">
        <div className="about-lead">
          <p className="about-intro">{siteConfig.intro}</p>
          <p>
            这个站点不是简历，也不打算做成流量产品。它更像一间持续整理的工作室：文章用来把一个问题讲透，笔记留给零散但有用的结论，项目则记录那些真正动手做过的东西。
          </p>
          <p>
            我相信好的技术写作应该把复杂的问题讲清楚，也相信长期稳定的积累比短暂的高强度更重要。如果你在这里找到一点有用的东西，那这篇文章就已经完成了它的任务。
          </p>
          <div className="about-contact">
            <a href={siteConfig.github} target="_blank" rel="noreferrer">GitHub <ArrowUpRight size={14} /></a>
            <a href={`mailto:${siteConfig.email}`}>Email <ArrowUpRight size={14} /></a>
          </div>
        </div>

        <aside className="about-aside">
          <div className="about-block">
            <h2 className="mono">Profile</h2>
            <dl>
              <div><dt>Name</dt><dd>{siteConfig.author}</dd></div>
              <div><dt>Role</dt><dd>{siteConfig.role}</dd></div>
              <div><dt>Based in</dt><dd>{siteConfig.location}</dd></div>
            </dl>
          </div>

          <div className="about-block">
            <h2 className="mono">Stack &amp; Interests</h2>
            <div className="skill-list">
              {skills.map((skill) => <span key={skill} className="mono">{skill}</span>)}
            </div>
          </div>

          <div className="about-block">
            <h2 className="mono">Log</h2>
            <div className="timeline">
              {log.map((item) => (
                <div className="timeline-item" key={item.year}>
                  <span className="mono">{item.year}</span>
                  <p>{item.text}</p>
                </div>
              ))}
            </div>
          </div>
        </aside>
      </div>
    </section>
  )
}
