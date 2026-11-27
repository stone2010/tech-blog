import { useEffect, useMemo, useState } from 'react'
import { marked } from 'marked'
import hljs from 'highlight.js/lib/core'
import typescript from 'highlight.js/lib/languages/typescript'
import javascript from 'highlight.js/lib/languages/javascript'
import css from 'highlight.js/lib/languages/css'
import bash from 'highlight.js/lib/languages/bash'
import json from 'highlight.js/lib/languages/json'
import python from 'highlight.js/lib/languages/python'
import go from 'highlight.js/lib/languages/go'
import xml from 'highlight.js/lib/languages/xml'
import markdown from 'highlight.js/lib/languages/markdown'
import { ArrowLeft, ArrowRight, Pencil } from 'lucide-react'
import { formatDate, parseHeadings, readingMinutes } from '../data/posts'
import { getMergedPost, usePosts } from '../data/store'

hljs.registerLanguage('typescript', typescript)
hljs.registerLanguage('javascript', javascript)
hljs.registerLanguage('css', css)
hljs.registerLanguage('bash', bash)
hljs.registerLanguage('json', json)
hljs.registerLanguage('python', python)
hljs.registerLanguage('go', go)
hljs.registerLanguage('xml', xml)
hljs.registerLanguage('markdown', markdown)
hljs.registerAliases(['tsx'], { languageName: 'typescript' })
hljs.registerAliases(['jsx'], { languageName: 'javascript' })
hljs.registerAliases(['html'], { languageName: 'xml' })
hljs.registerAliases(['sh', 'shell'], { languageName: 'bash' })

export default function PostDetail({ slug }: { slug: string }) {
  const posts = usePosts()
  const post = getMergedPost(slug)
  const [progress, setProgress] = useState(0)
  const [activeHeading, setActiveHeading] = useState(0)

  const toc = useMemo(() => (post ? parseHeadings(post.content) : []), [post])
  const html = useMemo(() => (post ? (marked.parse(post.content) as string) : ''), [post])

  // 渲染后处理：标题 id、代码高亮、复制按钮
  useEffect(() => {
    const root = document.querySelector<HTMLElement>('.prose')
    if (!root) return

    root.querySelectorAll<HTMLElement>('h2, h3').forEach((heading, index) => {
      heading.id = `section-${index}`
    })

    root.querySelectorAll<HTMLPreElement>('pre').forEach((pre) => {
      const code = pre.querySelector('code')
      if (!code) return
      if (!code.hasAttribute('data-highlighted')) {
        code.classList.add('hljs')
        try { hljs.highlightElement(code) } catch { /* 未知语言保持原样 */ }
      }

      if (pre.querySelector('.code-copy')) return
      const button = document.createElement('button')
      button.type = 'button'
      button.className = 'code-copy'
      button.setAttribute('aria-label', '复制代码')
      button.textContent = 'Copy'
      button.addEventListener('click', async () => {
        try {
          await navigator.clipboard.writeText(code.textContent ?? '')
        } catch {
          /* 剪贴板不可用时静默失败 */
        }
        button.textContent = 'Copied'
        window.setTimeout(() => { button.textContent = 'Copy' }, 1400)
      })
      pre.appendChild(button)
    })

    return () => {
      root.querySelectorAll('.code-copy').forEach((button) => button.remove())
    }
  }, [slug, html])

  // 阅读进度与目录高亮
  useEffect(() => {
    const onScroll = () => {
      const total = document.documentElement.scrollHeight - window.innerHeight
      setProgress(total <= 0 ? 0 : Math.min(100, (window.scrollY / total) * 100))

      const headings = Array.from(document.querySelectorAll<HTMLElement>('.prose h2, .prose h3'))
      let current = 0
      headings.forEach((heading, index) => {
        if (heading.getBoundingClientRect().top <= 140) current = index
      })
      setActiveHeading(current)
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    onScroll()
    return () => window.removeEventListener('scroll', onScroll)
  }, [slug, toc.length])

  if (!post) {
    return (
      <section className="container page-section empty-state">
        <span className="mono">404 / NOT FOUND</span>
        <h1>文章不存在</h1>
        <p>这篇记录可能已经被移动或删除。</p>
        <a className="button button-primary" href="#/posts">返回文章列表</a>
      </section>
    )
  }

  const index = posts.findIndex((item) => item.slug === post.slug)
  const newer = posts[index - 1]
  const older = posts[index + 1]

  const renderToc = () => (
    <nav className="toc-nav" aria-label="文章目录">
      {toc.map((item, itemIndex) => (
        <button
          key={item.id}
          className={`toc-item level-${item.level} ${activeHeading === itemIndex ? 'active' : ''}`}
          onClick={() => document.getElementById(item.id)?.scrollIntoView({ behavior: 'smooth', block: 'start' })}
        >
          {item.text}
        </button>
      ))}
    </nav>
  )

  return (
    <>
      <div className="reading-progress"><span style={{ width: `${progress}%` }} /></div>

      <div className="container article-layout">
        <article className="article-main">
          <a className="back-link mono" href="#/posts"><ArrowLeft size={14} /> All articles</a>

          <header className="article-header">
            <div className="article-kicker mono">
              <span className="meta-category">{post.category}</span>
              <span className="meta-dot" />
              <span>NOTE-{String(index + 1).padStart(3, '0')}</span>
              {post.local && <span className="local-badge">LOCAL DRAFT</span>}
            </div>
            <h1>{post.title}</h1>
            <p className="article-lede">{post.excerpt}</p>
            <div className="article-byline mono">
              <span>{formatDate(post.date)}</span>
              <span className="meta-dot" />
              <span>{readingMinutes(post.content)} min read</span>
            </div>
            <div className="article-tags">
              {post.tags.map((tag) => <a key={tag} href={`#/tag/${encodeURIComponent(tag)}`}>{tag}</a>)}
            </div>
            <a className="article-edit mono" href={`#/write?slug=${encodeURIComponent(post.slug)}`}>
              <Pencil size={13} /> Edit this article
            </a>
          </header>

          <details className="toc-mobile">
            <summary className="mono">Contents · {toc.length} sections</summary>
            {renderToc()}
          </details>

          <div className="article-rule" />
          <div className="prose" dangerouslySetInnerHTML={{ __html: html }} />

          <nav className="post-nav" aria-label="文章导航">
            {newer ? (
              <a href={`#/post/${newer.slug}`}>
                <span className="mono"><ArrowLeft size={13} /> Newer</span>
                <strong>{newer.title}</strong>
              </a>
            ) : <div />}
            {older && (
              <a href={`#/post/${older.slug}`}>
                <span className="mono">Older <ArrowRight size={13} /></span>
                <strong>{older.title}</strong>
              </a>
            )}
          </nav>
        </article>

        <aside className="toc-panel" aria-label="目录">
          <div className="toc-sticky">
            <span className="mono toc-title">ON THIS PAGE</span>
            {renderToc()}
            <div className="toc-footer mono">
              <span>READING PROGRESS</span>
              <strong>{Math.round(progress)}%</strong>
            </div>
          </div>
        </aside>
      </div>
    </>
  )
}
