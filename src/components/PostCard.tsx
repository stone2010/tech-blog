import { ArrowUpRight, Clock3, CalendarDays } from 'lucide-react'
import type { Post } from '../types'
import { formatDate, readingMinutes } from '../data/posts'

export default function PostCard({ post }: { post: Post }) {
  return (
    <a className="post-card" href={`#/post/${post.slug}`}>
      <div className="post-card-top">
        <span className="tag-chip">{post.tags[0]}</span>
        <span className="post-meta-item"><CalendarDays size={13} /> {formatDate(post.date)}</span>
      </div>
      <h3>{post.title}</h3>
      <p className="post-excerpt">{post.excerpt}</p>
      <div className="post-card-bottom">
        <span className="post-meta-item"><Clock3 size={13} /> {readingMinutes(post.content)} 分钟阅读</span>
        <span className="read-more">阅读全文 <ArrowUpRight size={15} /></span>
      </div>
    </a>
  )
}
