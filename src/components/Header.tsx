import { useState } from 'react'
import { Code2, Sun, Moon, Github, Menu, X } from 'lucide-react'
import type { Route, Theme } from '../types'
import { siteConfig } from '../config'

interface HeaderProps {
  theme: Theme
  onToggleTheme: () => void
  route: Route
}

const navItems = [
  { label: '首页', href: '#/', key: 'home' },
  { label: '文章', href: '#/posts', key: 'posts' },
  { label: '关于', href: '#/about', key: 'about' },
]

export default function Header({ theme, onToggleTheme, route }: HeaderProps) {
  const [menuOpen, setMenuOpen] = useState(false)
  const active = route.name === 'post' ? 'posts' : route.name

  return (
    <header className="site-header">
      <div className="container header-inner">
        <a className="brand" href="#/" onClick={() => setMenuOpen(false)}>
          <span className="brand-mark"><Code2 size={20} strokeWidth={2.4} /></span>
          <span className="brand-text">
            {siteConfig.name}
            <small>{siteConfig.englishName}</small>
          </span>
        </a>

        <nav className={`nav ${menuOpen ? 'is-open' : ''}`}>
          {navItems.map((item) => (
            <a
              key={item.key}
              href={item.href}
              className={active === item.key ? 'active' : ''}
              onClick={() => setMenuOpen(false)}
            >
              {item.label}
            </a>
          ))}
        </nav>

        <div className="header-actions">
          <button className="icon-btn" onClick={onToggleTheme} aria-label="切换主题" title="切换主题">
            {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
          </button>
          <a className="icon-btn" href={siteConfig.github} target="_blank" rel="noreferrer" aria-label="GitHub">
            <Github size={18} />
          </a>
          <button className="icon-btn menu-btn" onClick={() => setMenuOpen(!menuOpen)} aria-label="展开菜单">
            {menuOpen ? <X size={19} /> : <Menu size={19} />}
          </button>
        </div>
      </div>
    </header>
  )
}
