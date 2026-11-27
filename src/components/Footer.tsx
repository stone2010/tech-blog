import { ArrowUpRight } from 'lucide-react'
import BrandMark from './BrandMark'
import { siteConfig } from '../config'

export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="container footer-grid">
        <div className="footer-about">
          <div className="brand footer-brand">
            <BrandMark size={24} />
            <span className="brand-text">
              <strong>{siteConfig.name}</strong>
              <small>{siteConfig.journal}</small>
            </span>
          </div>
          <p>{siteConfig.description}</p>
          <span className="footer-location">BASED IN {siteConfig.location.toUpperCase()}</span>
        </div>

        <div className="footer-column">
          <h3>Explore</h3>
          <a href="#/posts">Articles</a>
          <a href="#/notes">Notes</a>
          <a href="#/projects">Projects</a>
          <a href="#/categories">Categories</a>
        </div>

        <div className="footer-column">
          <h3>Elsewhere</h3>
          <a href={siteConfig.github} target="_blank" rel="noreferrer">GitHub <ArrowUpRight size={13} /></a>
          <a href={`mailto:${siteConfig.email}`}>Email <ArrowUpRight size={13} /></a>
          <a href="#/about">About</a>
        </div>
      </div>

      <div className="container footer-bottom">
        <span>© {new Date().getFullYear()} {siteConfig.author}. All rights reserved.</span>
        <span>Built with React, TypeScript & curiosity.</span>
      </div>
    </footer>
  )
}
