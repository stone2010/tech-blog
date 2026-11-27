import { useEffect, useMemo, useState } from 'react'
import { Search, X } from 'lucide-react'
import ArticleRow from '../components/ArticleRow'
import { categories, isCategory } from '../data/categories'
import { usePosts } from '../data/store'
import type { Category } from '../types'

interface PostsProps {
  initialCategory?: string
  initialTag?: string
}

export default function Posts({ initialCategory, initialTag }: PostsProps) {
  const posts = usePosts()
  const [query, setQuery] = useState('')
  const [category, setCategory] = useState<Category | null>(
    initialCategory && isCategory(initialCategory) ? initialCategory : null,
  )
  const [tag, setTag] = useState<string | null>(initialTag ?? null)

  useEffect(() => {
    setCategory(initialCategory && isCategory(initialCategory) ? initialCategory : null)
    setTag(initialTag ?? null)
  }, [initialCategory, initialTag])

  const filtered = useMemo(() => {
    const keyword = query.trim().toLowerCase()
    return posts.filter((post) => {
      const matchCategory = !category || post.category === category
      const matchTag = !tag || post.tags.includes(tag)
      const matchQuery = !keyword || [post.title, post.excerpt, post.category, ...post.tags]
        .join(' ')
        .toLowerCase()
        .includes(keyword)
      return matchCategory && matchTag && matchQuery
    })
  }, [query, category, tag])

  const reset = () => {
    setQuery('')
    setCategory(null)
    setTag(null)
  }

  return (
    <section className="container page-section">
      <header className="page-header">
        <span className="eyebrow mono">ARTICLES / INDEX</span>
        <h1>文章</h1>
        <p>长文、实践与系统性的思考。当前收录 {posts.length} 篇。</p>
      </header>

      <div className="filter-panel">
        <div className="search-box">
          <Search size={17} />
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="按标题、摘要或技术关键词筛选…"
            aria-label="搜索文章"
          />
          {query && <button onClick={() => setQuery('')} aria-label="清空搜索"><X size={15} /></button>}
        </div>

        <div className="filter-row">
          <div className="filter-chips">
            <button className={!category ? 'active' : ''} onClick={() => setCategory(null)}>All</button>
            {categories.map((item) => (
              <button
                key={item.key}
                className={category === item.key ? 'active' : ''}
                onClick={() => setCategory(item.key)}
              >
                {item.key}
              </button>
            ))}
          </div>
          {tag && (
            <button className="active-filter mono" onClick={() => setTag(null)}>
              #{tag} <X size={13} />
            </button>
          )}
        </div>
      </div>

      <div className="feed-section">
        <div className="section-head mono">
          <span>{filtered.length} entries</span>
          <span>SORTED BY DATE</span>
        </div>
        {filtered.length > 0 ? (
          <div className="article-list">
            {filtered.map((post, index) => <ArticleRow key={post.slug} post={post} index={index} />)}
          </div>
        ) : (
          <div className="empty-state">
            <span className="mono">NO RESULTS</span>
            <p>没有找到匹配的文章，试试别的关键词或分类。</p>
            <button className="button button-primary" onClick={reset}>重置筛选</button>
          </div>
        )}
      </div>
    </section>
  )
}
