import { useState } from 'react'
import { Search, Sun, Moon, Menu, X } from 'lucide-react'
import BrandMark from './BrandMark'
import { siteConfig } from '../config'
import type { Route, Theme } from '../types'

interface HeaderProps {
  theme: Theme
  onToggleTheme: () => void
  onOpenSearch: () => void
  route: Route
}

const navItems = [
  { label: 'Home', href: '#/', key: 'home' },
  { label: 'Articles', href: '#/posts', key: 'articles' },
  { label: 'Projects', href: '#/projects', key: 'projects' },
  { label: 'Notes', href: '#/notes', key: 'notes' },
  { label: 'Write', href: '#/write', key: 'write' },
  { label: 'About', href: '#/about', key: 'about' },
]

function activeKey(route: Route) {
  switch (route.name) {
    case 'home': return 'home'
    case 'projects': return 'projects'
    case 'notes': return 'notes'
    case 'write': return 'write'
    case 'about': return 'about'
    default: return 'articles'
  }
}

export default function Header({ theme, onToggleTheme, onOpenSearch, route }: HeaderProps) {
  const [menuOpen, setMenuOpen] = useState(false)
  const active = activeKey(route)

  return (
    <header className="site-header">
      <a className="skip-link" href="#main-content">跳到正文</a>
      <div className="container header-inner">
        <a className="brand" href="#/" onClick={() => setMenuOpen(false)} aria-label={`${siteConfig.name} 首页`}>
          <BrandMark />
          <span className="brand-text">
            <strong>{siteConfig.name}</strong>
            <small>{siteConfig.journal}</small>
          </span>
        </a>

        <nav className={`nav ${menuOpen ? 'is-open' : ''}`} aria-label="主导航">
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
          <button className="icon-btn search-trigger" onClick={onOpenSearch} aria-label="搜索">
            <Search size={17} />
            <span className="search-hint">⌘K</span>
          </button>
          <button className="icon-btn" onClick={onToggleTheme} aria-label="切换主题" title="切换主题">
            {theme === 'dark' ? <Sun size={17} /> : <Moon size={17} />}
          </button>
          <button className="icon-btn menu-btn" onClick={() => setMenuOpen(!menuOpen)} aria-label="展开菜单" aria-expanded={menuOpen}>
            {menuOpen ? <X size={19} /> : <Menu size={19} />}
          </button>
        </div>
      </div>
    </header>
  )
}
