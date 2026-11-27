import { useEffect, useState } from 'react'
import { ArrowUp } from 'lucide-react'
import Header from './components/Header'
import Footer from './components/Footer'
import SearchDialog from './components/SearchDialog'
import Home from './pages/Home'
import Posts from './pages/Posts'
import PostDetail from './pages/PostDetail'
import Categories from './pages/Categories'
import Projects from './pages/Projects'
import Notes from './pages/Notes'
import About from './pages/About'
import type { Route, Theme } from './types'

function parseRoute(): Route {
  const raw = window.location.hash.replace(/^#/, '')
  const path = raw.startsWith('/') ? raw.slice(1) : raw
  if (!path) return { name: 'home' }

  const [first, second] = path.split('/')
  if (first === 'posts') return { name: 'posts' }
  if (first === 'post' && second) return { name: 'post', slug: decodeURIComponent(second) }
  if (first === 'categories') return { name: 'categories' }
  if (first === 'category' && second) return { name: 'category', category: decodeURIComponent(second) }
  if (first === 'tag' && second) return { name: 'tag', tag: decodeURIComponent(second) }
  if (first === 'projects') return { name: 'projects' }
  if (first === 'notes') return { name: 'notes' }
  if (first === 'about') return { name: 'about' }
  return { name: 'home' }
}

export default function App() {
  const [route, setRoute] = useState<Route>(parseRoute)
  const [searchOpen, setSearchOpen] = useState(false)
  const [showTop, setShowTop] = useState(false)
  const [theme, setTheme] = useState<Theme>(() => {
    const saved = localStorage.getItem('stone-theme')
    return saved === 'light' || saved === 'dark' ? saved : 'light'
  })

  useEffect(() => {
    const onHashChange = () => {
      setRoute(parseRoute())
      window.scrollTo(0, 0)
    }
    window.addEventListener('hashchange', onHashChange)
    return () => window.removeEventListener('hashchange', onHashChange)
  }, [])

  useEffect(() => {
    document.documentElement.dataset.theme = theme
    localStorage.setItem('stone-theme', theme)
    document.querySelector('meta[name="theme-color"]')?.setAttribute('content', theme === 'dark' ? '#0b0f17' : '#f8fafc')
  }, [theme])

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      const target = event.target as HTMLElement | null
      const typing = target?.tagName === 'INPUT' || target?.tagName === 'TEXTAREA' || target?.isContentEditable
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') {
        event.preventDefault()
        setSearchOpen(true)
      } else if (event.key === '/' && !typing && !searchOpen) {
        event.preventDefault()
        setSearchOpen(true)
      }
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [searchOpen])

  useEffect(() => {
    const onScroll = () => setShowTop(window.scrollY > 600)
    window.addEventListener('scroll', onScroll, { passive: true })
    onScroll()
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const renderPage = () => {
    switch (route.name) {
      case 'posts':
        return <Posts />
      case 'post':
        return <PostDetail slug={route.slug} />
      case 'categories':
        return <Categories />
      case 'category':
        return <Posts key={`category-${route.category}`} initialCategory={route.category} />
      case 'tag':
        return <Posts key={`tag-${route.tag}`} initialTag={route.tag} />
      case 'projects':
        return <Projects />
      case 'notes':
        return <Notes />
      case 'about':
        return <About />
      default:
        return <Home />
    }
  }

  return (
    <div className="app-shell">
      <Header
        theme={theme}
        onToggleTheme={() => setTheme((current) => (current === 'dark' ? 'light' : 'dark'))}
        onOpenSearch={() => setSearchOpen(true)}
        route={route}
      />
      <main id="main-content" className="main-content">{renderPage()}</main>
      <Footer />
      <SearchDialog open={searchOpen} onClose={() => setSearchOpen(false)} />
      <button
        className={`back-to-top ${showTop ? 'visible' : ''}`}
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        aria-label="返回顶部"
      >
        <ArrowUp size={16} />
      </button>
    </div>
  )
}
