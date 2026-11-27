import { ArrowUpRight } from 'lucide-react'
import type { Post } from '../types'
import { readingMinutes, shortDate } from '../data/posts'

export default function ArticleRow({ post, index }: { post: Post; index?: number }) {
  return (
    <a className="article-row" href={`#/post/${post.slug}`}>
      {index !== undefined && <span className="article-index mono">{String(index + 1).padStart(2, '0')}</span>}
      <div className="article-row-body">
        <div className="article-meta mono">
          <span className="meta-category">{post.category}</span>
          <span className="meta-dot" />
          <span>{shortDate(post.date)}</span>
          <span className="meta-dot" />
          <span>{readingMinutes(post.content)} min read</span>
        </div>
        <h3>{post.title}</h3>
        <p>{post.excerpt}</p>
        <div className="article-tags">
          {post.tags.slice(0, 3).map((tag) => <span key={tag}>{tag}</span>)}
        </div>
      </div>
      <ArrowUpRight className="article-arrow" size={18} />
    </a>
  )
}
