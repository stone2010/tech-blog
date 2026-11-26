import { Github, Mail, Heart } from 'lucide-react'
import { siteConfig } from '../config'

export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="container footer-inner">
        <div>
          <div className="footer-brand">{siteConfig.name}</div>
          <p>{siteConfig.description}</p>
        </div>
        <div className="footer-links">
          <a href={siteConfig.github} target="_blank" rel="noreferrer" aria-label="GitHub"><Github size={18} /></a>
          <a href={`mailto:${siteConfig.email}`} aria-label="邮箱"><Mail size={18} /></a>
        </div>
      </div>
      <div className="container footer-bottom">
        <span>© {new Date().getFullYear()} {siteConfig.author} · 保留所有权利</span>
        <span>Made with <Heart size={13} fill="currentColor" /> and code</span>
      </div>
    </footer>
  )
}
