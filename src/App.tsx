import { useEffect, useState } from 'react'
import Header from './components/Header'
import Footer from './components/Footer'
import Home from './pages/Home'
import Posts from './pages/Posts'
import PostDetail from './pages/PostDetail'
import About from './pages/About'
import type { Route, Theme } from './types'

function parseRoute(): Route {
  const raw = window.location.hash.replace(/^#/, '')
  const path = raw.startsWith('/') ? raw.slice(1) : raw
  if (!path) return { name: 'home' }

  const [first, second] = path.split('/')
  if (first === 'posts') return { name: 'posts' }
  if (first === 'post' && second) return { name: 'post', slug: decodeURIComponent(second) }
  if (first === 'tags' && second) return { name: 'tag', tag: decodeURIComponent(second) }
  if (first === 'about') return { name: 'about' }
  return { name: 'home' }
}

export default function App() {
  const [route, setRoute] = useState<Route>(parseRoute)
  const [theme, setTheme] = useState<Theme>(() => {
    const saved = localStorage.getItem('tech-blog-theme')
    return saved === 'light' || saved === 'dark' ? saved : 'dark'
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
    localStorage.setItem('tech-blog-theme', theme)
    document.querySelector('meta[name="theme-color"]')?.setAttribute('content', theme === 'dark' ? '#0b0d14' : '#f7f8fc')
  }, [theme])

  const toggleTheme = () => setTheme((current) => (current === 'dark' ? 'light' : 'dark'))

  const renderPage = () => {
    switch (route.name) {
      case 'posts':
        return <Posts />
      case 'post':
        return <PostDetail slug={route.slug} />
      case 'tag':
        return <Posts key={route.tag} initialTag={route.tag} />
      case 'about':
        return <About />
      default:
        return <Home />
    }
  }

  return (
    <div className="app-shell">
      <Header theme={theme} onToggleTheme={toggleTheme} route={route} />
      <main className="main-content">{renderPage()}</main>
      <Footer />
    </div>
  )
}
