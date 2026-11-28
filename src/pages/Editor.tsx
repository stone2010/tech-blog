import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { marked } from 'marked'
import {
  Check, Clipboard, Code2, Download, Heading2, Heading3, Italic, Link2, List,
  Maximize2, Minimize2, Pencil, Quote, RotateCcw, Save, Strikethrough, Table,
  Trash2, Bold, Minus, Eye, Edit3, Type,
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

type PaneMode = 'split' | 'write' | 'preview'

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

function countWords(text: string): number {
  if (!text.trim()) return 0
  // Count CJK chars + western words
  const cjk = (text.match(/[\u4e00-\u9fff\u3400-\u4dbf\uff00-\uffef]/g) || []).length
  const words = (text.replace(/[\u4e00-\u9fff\u3400-\u4dbf\uff00-\uffef]/g, ' ').match(/\S+/g) || []).length
  return cjk + words
}

export default function Editor({ slug }: { slug?: string }) {
  const [form, setForm] = useState<FormState>(blankForm)
  const [message, setMessage] = useState('')
  const [pendingDelete, setPendingDelete] = useState<string | null>(null)
  const [fullscreen, setFullscreen] = useState(false)
  const [paneMode, setPaneMode] = useState<PaneMode>('split')
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const previewRef = useRef<HTMLDivElement>(null)
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

  // ESC exits fullscreen
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && fullscreen) setFullscreen(false)
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [fullscreen])

  // Prevent scroll when fullscreen
  useEffect(() => {
    document.body.style.overflow = fullscreen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [fullscreen])

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

  const insert = useCallback((before: string, after = '', placeholder = '') => {
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
  }, [form.content])

  // Handle Tab key for indent and Ctrl shortcuts
  const handleKeyDown = useCallback((e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    const textarea = textareaRef.current
    if (!textarea) return

    // Tab → indent
    if (e.key === 'Tab') {
      e.preventDefault()
      const start = textarea.selectionStart
      const end = textarea.selectionEnd
      const next = form.content.slice(0, start) + '  ' + form.content.slice(end)
      setField('content', next)
      requestAnimationFrame(() => {
        textarea.selectionStart = textarea.selectionEnd = start + 2
      })
      return
    }

    const mod = e.metaKey || e.ctrlKey
    if (!mod) return

    if (e.key === 's') { e.preventDefault(); handleSave(); return }
    if (e.key === 'b') { e.preventDefault(); insert('**', '**', '加粗'); return }
    if (e.key === 'i') { e.preventDefault(); insert('*', '*', '斜体'); return }
    if (e.key === 'k') { e.preventDefault(); insert('[', '](https://)', '链接'); return }
    if (e.key === 'e') { e.preventDefault(); insert('`', '`', 'code'); return }
  }, [form.content, insert])

  const wordCount = useMemo(() => countWords(form.content), [form.content])
  const charCount = form.content.length
  const lineCount = form.content.split('\n').length

  const handleSave = () => {
    const post = buildPost(form)
    if (!post) { notify('请先填写标题和正文'); return }
    savePost(post)
    setForm((current) => ({ ...current, slug: post.slug }))
    notify('已保存到当前浏览器')
  }

  const handleCopy = async () => {
    const post = buildPost(form)
    if (!post) { notify('请先填写标题和正文'); return }
    try {
      await navigator.clipboard.writeText(toTypeScriptSnippet(post))
      notify('已复制可粘贴到 posts.ts 的源码')
    } catch {
      notify('复制失败，请手动选择源码')
    }
  }

  const handleDownload = () => {
    const post = buildPost(form)
    if (!post) { notify('请先填写标题和正文'); return }
    const front = [
      '---',
      `title: ${post.title}`,
      `date: ${post.date}`,
      `category: ${post.category}`,
      `tags: [${post.tags.join(', ')}]`,
      `excerpt: ${post.excerpt}`,
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

  const showEditor = paneMode === 'split' || paneMode === 'write'
  const showPreview = paneMode === 'split' || paneMode === 'preview'

  const workspaceStyle = paneMode === 'split'
    ? {}
    : { gridTemplateColumns: '1fr' }

  return (
    <section className="container page-section editor-page">
      <header className="page-header editor-head">
        <div>
          <span className="eyebrow mono">EDITOR / WRITE</span>
          <h1>{slug ? '编辑文章' : '写一篇新文章'}</h1>
          <p>用 Markdown 写作，实时预览。内容保存在当前浏览器，导出后可发布到仓库。</p>
        </div>
        <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
          {slug && <a className="button button-outline" href={`#/post/${encodeURIComponent(slug)}`}>返回文章</a>}
          <a className="button button-primary" href="#/write"><Edit3 size={14} /> 新文章</a>
        </div>
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

        {/* Mode tabs + fullscreen toggle */}
        <div style={{ display: 'flex', alignItems: 'center', marginBottom: 12, gap: 12 }}>
          <div className="editor-mode-tabs" style={{ flex: 1 }}>
            <button className={paneMode === 'write' ? 'active' : ''} onClick={() => setPaneMode('write')}>
              <Edit3 size={12} style={{ marginRight: 5 }} />编辑
            </button>
            <button className={paneMode === 'split' ? 'active' : ''} onClick={() => setPaneMode('split')}>
              <Type size={12} style={{ marginRight: 5 }} />分栏
            </button>
            <button className={paneMode === 'preview' ? 'active' : ''} onClick={() => setPaneMode('preview')}>
              <Eye size={12} style={{ marginRight: 5 }} />预览
            </button>
          </div>
          <button
            className="icon-btn"
            onClick={() => setFullscreen((f) => !f)}
            title={fullscreen ? '退出全屏 (Esc)' : '全屏写作'}
            style={{ flexShrink: 0 }}
          >
            {fullscreen ? <Minimize2 size={15} /> : <Maximize2 size={15} />}
          </button>
        </div>

        <div
          className={`editor-workspace${fullscreen ? ' fullscreen' : ''}`}
          style={workspaceStyle}
        >
          {showEditor && (
            <div className="editor-pane">
              <div className="editor-toolbar" role="toolbar" aria-label="Markdown 格式工具栏">
                <button type="button" onClick={() => insert('## ', '', '小标题')} title="二级标题 (H2)"><Heading2 size={15} /></button>
                <button type="button" onClick={() => insert('### ', '', '三级标题')} title="三级标题 (H3)"><Heading3 size={15} /></button>
                <span className="toolbar-sep" />
                <button type="button" onClick={() => insert('**', '**', '加粗')} title="加粗 (Ctrl+B)"><Bold size={15} /></button>
                <button type="button" onClick={() => insert('*', '*', '斜体')} title="斜体 (Ctrl+I)"><Italic size={15} /></button>
                <button type="button" onClick={() => insert('~~', '~~', '删除线')} title="删除线"><Strikethrough size={15} /></button>
                <span className="toolbar-sep" />
                <button type="button" onClick={() => insert('[', '](https://)', '链接文字')} title="链接 (Ctrl+K)"><Link2 size={15} /></button>
                <button type="button" onClick={() => insert('`', '`', 'code')} title="行内代码 (Ctrl+E)"><Code2 size={15} /></button>
                <button type="button" onClick={() => insert('\n```ts\n', '\n```\n', '// 代码')} title="代码块"><Code2 size={15} />+</button>
                <span className="toolbar-sep" />
                <button type="button" onClick={() => insert('- ', '', '列表项')} title="无序列表"><List size={15} /></button>
                <button type="button" onClick={() => insert('1. ', '', '列表项')} title="有序列表">1.</button>
                <button type="button" onClick={() => insert('> ', '', '引用内容')} title="引用"><Quote size={15} /></button>
                <button type="button" onClick={() => insert('\n---\n', '', '')} title="分割线"><Minus size={15} /></button>
                <button type="button" onClick={() => insert('\n| 列1 | 列2 | 列3 |\n| --- | --- | --- |\n| ', ' | 内容 |\n', '内容')} title="表格"><Table size={15} /></button>
              </div>
              <textarea
                ref={textareaRef}
                className="editor-textarea mono"
                value={form.content}
                onChange={(event) => setField('content', event.target.value)}
                onKeyDown={handleKeyDown}
                placeholder={'# 从这里开始写\n\n支持 Markdown：标题、列表、引用、代码块、表格……\n\n快捷键：Ctrl+S 保存 · Ctrl+B 加粗 · Ctrl+I 斜体 · Tab 缩进'}
                spellCheck={false}
                aria-label="Markdown 正文"
              />
              <div className="editor-status mono">
                <span>{wordCount} 词</span>
                <span>·</span>
                <span>{charCount} 字符</span>
                <span>·</span>
                <span>{lineCount} 行</span>
                {fullscreen && <span style={{ marginLeft: 'auto', opacity: 0.6 }}>Esc 退出全屏</span>}
              </div>
            </div>
          )}

          {showPreview && (
            <div className="preview-pane" ref={previewRef}>
              <div className="preview-label mono">
                <span>LIVE PREVIEW</span>
                {form.title && <span style={{ color: 'var(--text-2)' }}>{form.title}</span>}
              </div>
              <div className="prose preview-body" dangerouslySetInnerHTML={{ __html: preview }} />
            </div>
          )}
        </div>

        <div className="editor-actions">
          <button className="button button-primary" onClick={handleSave}><Save size={14} /> 保存到本地</button>
          <button className="button button-text" onClick={handleCopy}><Clipboard size={14} /> 复制源码</button>
          <button className="button button-text" onClick={handleDownload}><Download size={14} /> 下载 .md</button>
          {message && <span className="editor-notice mono"><Check size={13} /> {message}</span>}
          <span style={{ marginLeft: 'auto', fontSize: 11, color: 'var(--text-3)', fontFamily: 'var(--font-mono)' }}>
            Ctrl+S 保存 · Ctrl+B/I/K/E 格式
          </span>
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
