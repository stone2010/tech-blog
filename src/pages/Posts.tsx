import { useEffect, useMemo, useState } from 'react'
import { Search, X } from 'lucide-react'
import PostCard from '../components/PostCard'
import { allTags, posts } from '../data/posts'

export default function Posts({ initialTag }: { initialTag?: string }) {
  const [query, setQuery] = useState('')
  const [activeTag, setActiveTag] = useState<string | null>(initialTag ?? null)

  useEffect(() => {
    setActiveTag(initialTag ?? null)
  }, [initialTag])

  const filtered = useMemo(() => {
    const keyword = query.trim().toLowerCase()
    return posts.filter((post) => {
      const matchTag = !activeTag || post.tags.includes(activeTag)
      const matchQuery = !keyword || [post.title, post.excerpt, ...post.tags].join(' ').toLowerCase().includes(keyword)
      return matchTag && matchQuery
    })
  }, [query, activeTag])

  return (
    <section className="container page-section">
      <div className="page-heading">
        <span className="section-kicker">ALL ARTICLES</span>
        <h1>文章列表</h1>
        <p>共收录 {posts.length} 篇文章，记录学习路上的点点滴滴。</p>
      </div>

      <div className="filter-bar">
        <div className="search-box">
          <Search size={18} />
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="搜索标题、摘要或标签..."
            aria-label="搜索文章"
          />
          {query && <button onClick={() => setQuery('')} aria-label="清空搜索"><X size={16} /></button>}
        </div>
        <div className="tag-filters">
          <button className={!activeTag ? 'active' : ''} onClick={() => setActiveTag(null)}>全部</button>
          {allTags.map((tag) => (
            <button key={tag} className={activeTag === tag ? 'active' : ''} onClick={() => setActiveTag(tag)}>
              {tag}
            </button>
          ))}
        </div>
      </div>

      {filtered.length > 0 ? (
        <div className="post-grid">
          {filtered.map((post) => <PostCard key={post.slug} post={post} />)}
        </div>
      ) : (
        <div className="empty-state">
          <p>没有找到匹配的文章，换个关键词试试吧。</p>
          <button className="btn btn-ghost" onClick={() => { setQuery(''); setActiveTag(null) }}>重置筛选</button>
        </div>
      )}
    </section>
  )
}
