import { useEffect, useMemo, useRef, useState } from 'react'
import { marked } from 'marked'
import {
  Check, Clipboard, Code2, Download, Heading2, Italic, Link2, List,
  Pencil, Quote, RotateCcw, Save, Trash2, Bold,
} from 'lucide-react'
import { categories } from '../data/categories'
import { posts as builtInPosts } from '../data/posts'
import { createSlug, getMergedPost, removeLocalPost, savePost, toTypeScriptSnippet, useLocalPosts } from '../data/store'
import type { Category, Post } from '../types'

const builtInSlugs = new Set(builtInPosts.map((post) => post.slug))

interface FormState {
  title: string
  slug: string
  date: string
  category: Category
  tags: string
  excerpt: string
  content: string
}

function today() {
  const date = new Date()
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`
}

function blankForm(): FormState {
  return {
    title: '',
    slug: '',
    date: today(),
    category: 'Programming',
    tags: '',
    excerpt: '',
    content: '',
  }
}

function buildPost(form: FormState): Post | null {
  const title = form.title.trim()
  const content = form.content.trim()
  if (!title || !content) return null
  const tags = form.tags.split(/[,，]/).map((tag) => tag.trim()).filter(Boolean)
  const plain = content.replace(/[#*`>\-\[\]()]/g, '').replace(/\s+/g, ' ').trim()
  return {
    slug: form.slug.trim() || createSlug(title),
    title,
    date: form.date || today(),
    category: form.category,
    tags,
    excerpt: form.excerpt.trim() || `${plain.slice(0, 84)}${plain.length > 84 ? '…' : ''}`,
    content,
    local: true,
  }
}

export default function Editor({ slug }: { slug?: string }) {
  const [form, setForm] = useState<FormState>(blankForm)
  const [message, setMessage] = useState('')
  const [pendingDelete, setPendingDelete] = useState<string | null>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const localPosts = useLocalPosts()

  useEffect(() => {
    if (slug) {
      const post = getMergedPost(slug)
      if (post) {
        setForm({
          title: post.title,
          slug: post.slug,
          date: post.date,
          category: post.category,
          tags: post.tags.join(', '),
          excerpt: post.excerpt,
          content: post.content,
        })
        return
      }
    }
    setForm(blankForm())
  }, [slug])

  const preview = useMemo(() => {
    const source = form.content.trim() || '_开始写作，预览会显示在这里。_'
    return marked.parse(source) as string
  }, [form.content])

  const notify = (text: string) => {
    setMessage(text)
    window.setTimeout(() => setMessage(''), 2600)
  }

  const setField = <K extends keyof FormState>(key: K, value: FormState[K]) => {
    setForm((current) => ({ ...current, [key]: value }))
  }

  const insert = (before: string, after = '', placeholder = '') => {
    const element = textareaRef.current
    if (!element) return
    const start = element.selectionStart
    const end = element.selectionEnd
    const selected = form.content.slice(start, end) || placeholder
    const next = form.content.slice(0, start) + before + selected + after + form.content.slice(end)
    setField('content', next)
    requestAnimationFrame(() => {
      element.focus()
      element.setSelectionRange(start + before.length, start + before.length + selected.length)
    })
  }

  const handleSave = () => {
    const post = buildPost(form)
    if (!post) {
      notify('请先填写标题和正文')
      return
    }
    savePost(post)
    setForm((current) => ({ ...current, slug: post.slug }))
    notify('已保存到当前浏览器')
  }

  const handleCopy = async () => {
    const post = buildPost(form)
    if (!post) {
      notify('请先填写标题和正文')
      return
    }
    try {
      await navigator.clipboard.writeText(toTypeScriptSnippet(post))
      notify('已复制可粘贴到 posts.ts 的源码')
    } catch {
      notify('复制失败，请手动选择源码')
    }
  }

  const handleDownload = () => {
    const post = buildPost(form)
    if (!post) {
      notify('请先填写标题和正文')
      return
    }
    const front = [
      '---',
      `title: ${post.title}`,
      `date: ${post.date}`,
      `category: ${post.category}`,
      `tags: [${post.tags.join(', ')}]`,
      '---',
      '',
    ].join('\n')
    const blob = new Blob([front + post.content], { type: 'text/markdown;charset=utf-8' })
    const url = URL.createObjectURL(blob)
    const anchor = document.createElement('a')
    anchor.href = url
    anchor.download = `${post.slug}.md`
    anchor.click()
    URL.revokeObjectURL(url)
    notify('Markdown 文件已下载')
  }

  return (
    <section className="container page-section editor-page">
      <header className="page-header editor-head">
        <div>
          <span className="eyebrow mono">EDITOR / WRITE</span>
          <h1>{slug ? '编辑文章' : '写一篇新文章'}</h1>
          <p>用 Markdown 写作，实时预览。内容保存在当前浏览器，导出后可发布到仓库。</p>
        </div>
        {slug && <a className="button button-text" href={`#/post/${encodeURIComponent(slug)}`}>返回文章</a>}
      </header>

      <div className="editor-form">
        <div className="form-grid">
          <label className="field field-wide">
            <span>标题</span>
            <input value={form.title} onChange={(event) => setField('title', event.target.value)} placeholder="文章标题" />
          </label>
          <label className="field">
            <span>日期</span>
            <input type="date" value={form.date} onChange={(event) => setField('date', event.target.value)} />
          </label>
          <label className="field">
            <span>分类</span>
            <select value={form.category} onChange={(event) => setField('category', event.target.value as Category)}>
              {categories.map((category) => <option key={category.key} value={category.key}>{category.key}</option>)}
            </select>
          </label>
          <label className="field">
            <span>链接标识 Slug</span>
            <input value={form.slug} onChange={(event) => setField('slug', event.target.value)} placeholder={form.title ? createSlug(form.title) : '留空自动生成'} />
          </label>
          <label className="field">
            <span>标签（逗号分隔）</span>
            <input value={form.tags} onChange={(event) => setField('tags', event.target.value)} placeholder="LLM, React, 实验" />
          </label>
          <label className="field field-wide">
            <span>摘要（留空自动截取）</span>
            <input value={form.excerpt} onChange={(event) => setField('excerpt', event.target.value)} placeholder="一句话说明这篇文章讲了什么" />
          </label>
        </div>

        <div className="editor-workspace">
          <div className="editor-pane">
            <div className="editor-toolbar" role="toolbar" aria-label="Markdown 格式工具栏">
              <button type="button" onClick={() => insert('## ', '', '小标题')} title="二级标题"><Heading2 size={15} /></button>
              <button type="button" onClick={() => insert('**', '**', '加粗')} title="加粗"><Bold size={15} /></button>
              <button type="button" onClick={() => insert('*', '*', '斜体')} title="斜体"><Italic size={15} /></button>
              <button type="button" onClick={() => insert('[', '](https://example.com)', '链接文字')} title="链接"><Link2 size={15} /></button>
              <button type="button" onClick={() => insert('`', '`', 'code')} title="行内代码"><Code2 size={15} /></button>
              <button type="button" onClick={() => insert('\n```ts\n', '\n```\n', '// 代码')} title="代码块"><Code2 size={15} /> +</button>
              <button type="button" onClick={() => insert('- ', '', '列表项')} title="列表"><List size={15} /></button>
              <button type="button" onClick={() => insert('> ', '', '引用内容')} title="引用"><Quote size={15} /></button>
            </div>
            <textarea
              ref={textareaRef}
              className="editor-textarea mono"
              value={form.content}
              onChange={(event) => setField('content', event.target.value)}
              placeholder={'# 从这里开始写\n\n支持 Markdown：标题、列表、引用、代码块、表格……'}
              spellCheck={false}
              aria-label="Markdown 正文"
            />
          </div>

          <div className="preview-pane">
            <div className="preview-label mono">LIVE PREVIEW</div>
            <div className="prose preview-body" dangerouslySetInnerHTML={{ __html: preview }} />
          </div>
        </div>

        <div className="editor-actions">
          <button className="button button-primary" onClick={handleSave}><Save size={14} /> 保存到本地</button>
          <button className="button button-text" onClick={handleCopy}><Clipboard size={14} /> 复制文章源码</button>
          <button className="button button-text" onClick={handleDownload}><Download size={14} /> 下载 .md</button>
          {message && <span className="editor-notice mono"><Check size={13} /> {message}</span>}
        </div>
      </div>

      <div className="drafts-section">
        <div className="section-head mono">
          <span>Local Drafts</span>
          <span>{localPosts.length} saved in this browser</span>
        </div>
        {localPosts.length > 0 ? (
          <div className="draft-list">
            {localPosts.map((post) => (
              <div className="draft-row" key={post.slug}>
                <span className="mono draft-date">{post.date}</span>
                <div className="draft-body">
                  <strong>{post.title}</strong>
                  <span className="mono">/{post.slug}</span>
                </div>
                <div className="draft-actions">
                  <a href={`#/write?slug=${encodeURIComponent(post.slug)}`}><Pencil size={14} /> 编辑</a>
                  {post.slug.startsWith('post-') && (
                    <button
                      className={pendingDelete === post.slug ? 'confirm' : ''}
                      onClick={() => {
                        if (pendingDelete === post.slug) {
                          removeLocalPost(post.slug)
                          setPendingDelete(null)
                          notify('草稿已删除')
                        } else {
                          setPendingDelete(post.slug)
                        }
                      }}
                    >
                      {pendingDelete === post.slug ? '确认删除' : <><Trash2 size={14} /> 删除</>}
                    </button>
                  )}
                  {builtInSlugs.has(post.slug) && (
                    <button onClick={() => { removeLocalPost(post.slug); setPendingDelete(null); notify('已恢复内置版本') }}>
                      <RotateCcw size={14} /> 恢复
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="drafts-empty mono">还没有本地草稿。保存第一篇文章后会显示在这里。</div>
        )}
      </div>
    </section>
  )
}
