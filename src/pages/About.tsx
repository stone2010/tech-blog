import { Github, Mail, MapPin, Coffee, Layers, PenLine } from 'lucide-react'
import { siteConfig } from '../config'

const skills = ['React', 'TypeScript', 'JavaScript', 'CSS / Tailwind', 'Node.js', 'Vite', 'Git', '性能优化']
const timeline = [
  { year: '2026', text: '开始认真记录技术笔记，把这个博客搭建起来。' },
  { year: '2025', text: '深入前端工程化，关注可维护性与开发体验。' },
  { year: '2024', text: '从零学习前端，写下第一行生产环境的代码。' },
]

export default function About() {
  return (
    <section className="container page-section about-page">
      <div className="page-heading">
        <span className="section-kicker">About Me</span>
        <h1>关于我</h1>
        <p>你好，很高兴在这里遇见你。</p>
      </div>

      <div className="about-grid">
        <div className="about-card">
          <div className="avatar">{siteConfig.author.slice(0, 1).toUpperCase()}</div>
          <h2>{siteConfig.author}</h2>
          <p className="about-role">前端开发者 / 技术写作者</p>
          <div className="about-info">
            <span><MapPin size={15} /> {siteConfig.location}</span>
            <span><Coffee size={15} /> 咖啡驱动开发</span>
          </div>
          <div className="about-links">
            <a href={siteConfig.github} target="_blank" rel="noreferrer"><Github size={16} /> GitHub</a>
            <a href={`mailto:${siteConfig.email}`}><Mail size={16} /> 发邮件</a>
          </div>
        </div>

        <div className="about-main">
          <div className="about-block">
            <h3><PenLine size={18} /> 自我介绍</h3>
            <p>{siteConfig.bio}</p>
            <p>我相信好的技术文章应该把复杂的问题讲清楚，所以这里的内容会尽量保持简单、直接、可复用。如果某篇文章帮到了你，那就是它最大的价值。</p>
          </div>

          <div className="about-block">
            <h3><Layers size={18} /> 技术栈与兴趣</h3>
            <div className="skill-list">
              {skills.map((skill) => <span key={skill}>{skill}</span>)}
            </div>
          </div>

          <div className="about-block">
            <h3><Coffee size={18} /> 一些小经历</h3>
            <div className="timeline">
              {timeline.map((item) => (
                <div className="timeline-item" key={item.year}>
                  <span className="timeline-year">{item.year}</span>
                  <p>{item.text}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
