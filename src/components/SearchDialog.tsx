import { useEffect, useMemo, useRef, useState } from 'react'
import { Search, CornerDownLeft, ArrowUpRight } from 'lucide-react'
import { posts } from '../data/posts'
import { notes } from '../data/notes'
import { projects } from '../data/projects'

interface SearchItem {
  kind: 'Article' | 'Note' | 'Project'
  title: string
  description: string
  href: string
  meta: string
}

const index: SearchItem[] = [
  ...posts.map((post) => ({
    kind: 'Article' as const,
    title: post.title,
    description: post.excerpt,
    href: `#/post/${post.slug}`,
    meta: `${post.category} · ${post.date}`,
  })),
  ...notes.map((note) => ({
    kind: 'Note' as const,
    title: note.title,
    description: note.content,
    href: '#/notes',
    meta: `${note.id} · ${note.category}`,
  })),
  ...projects.map((project) => ({
    kind: 'Project' as const,
    title: project.name,
    description: project.description,
    href: '#/projects',
    meta: `${project.year} · ${project.status}`,
  })),
]

export default function SearchDialog({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [query, setQuery] = useState('')
  const [active, setActive] = useState(0)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (!open) return
    setQuery('')
    setActive(0)
    const timer = window.setTimeout(() => inputRef.current?.focus(), 20)
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', onKey)
    return () => {
      window.clearTimeout(timer)
      document.removeEventListener('keydown', onKey)
    }
  }, [open, onClose])

  const results = useMemo(() => {
    const keyword = query.trim().toLowerCase()
    if (!keyword) return index.slice(0, 8)
    return index
      .filter((item) => `${item.title} ${item.description} ${item.meta}`.toLowerCase().includes(keyword))
      .slice(0, 10)
  }, [query])

  if (!open) return null

  const go = (item: SearchItem) => {
    window.location.hash = item.href
    onClose()
  }

  return (
    <div className="search-overlay" onMouseDown={onClose} role="presentation">
      <div className="search-dialog" onMouseDown={(event) => event.stopPropagation()} role="dialog" aria-modal="true" aria-label="搜索站内内容">
        <div className="search-field">
          <Search size={18} />
          <input
            ref={inputRef}
            value={query}
            onChange={(event) => { setQuery(event.target.value); setActive(0) }}
            onKeyDown={(event) => {
              if (event.key === 'ArrowDown') {
                event.preventDefault()
                setActive((current) => Math.min(current + 1, results.length - 1))
              } else if (event.key === 'ArrowUp') {
                event.preventDefault()
                setActive((current) => Math.max(current - 1, 0))
              } else if (event.key === 'Enter' && results[active]) {
                go(results[active])
              }
            }}
            placeholder="搜索文章、笔记、项目…"
            aria-label="搜索关键词"
          />
          <kbd>ESC</kbd>
        </div>

        <div className="search-results">
          {results.length > 0 ? results.map((item, itemIndex) => (
            <button
              key={`${item.kind}-${item.title}`}
              className={`search-result ${itemIndex === active ? 'active' : ''}`}
              onMouseEnter={() => setActive(itemIndex)}
              onClick={() => go(item)}
            >
              <span className="result-kind">{item.kind}</span>
              <span className="result-body">
                <strong>{item.title}</strong>
                <small>{item.description}</small>
              </span>
              <span className="result-meta">{item.meta}<ArrowUpRight size={14} /></span>
            </button>
          )) : (
            <div className="search-empty">没有找到匹配内容，换个关键词试试。</div>
          )}
        </div>

        <div className="search-footer">
          <span><kbd>↑</kbd><kbd>↓</kbd> 选择</span>
          <span><CornerDownLeft size={12} /> 打开</span>
          <span className="search-count">{results.length} 条结果</span>
        </div>
      </div>
    </div>
  )
}
