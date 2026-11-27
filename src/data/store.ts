import { useSyncExternalStore } from 'react'
import type { Post } from '../types'
import { posts as builtInPosts } from './posts'

const KEY = 'stone-field-notes-posts-v1'

function loadLocal(): Post[] {
  if (typeof window === 'undefined') return []
  try {
    const raw = window.localStorage.getItem(KEY)
    if (!raw) return []
    const parsed: unknown = JSON.parse(raw)
    if (!Array.isArray(parsed)) return []
    return parsed.filter((item): item is Post => {
      if (!item || typeof item !== 'object') return false
      const post = item as Partial<Post>
      return typeof post.slug === 'string' && typeof post.title === 'string' && typeof post.content === 'string'
    })
  } catch {
    return []
  }
}

function mergePosts(local: Post[]): Post[] {
  const map = new Map<string, Post>()
  builtInPosts.forEach((post) => map.set(post.slug, post))
  local.forEach((post) => map.set(post.slug, { ...post, local: true }))
  return Array.from(map.values()).sort((a, b) => b.date.localeCompare(a.date))
}

let localPosts = loadLocal()
let localSnapshot = localPosts
let mergedPosts = mergePosts(localPosts)
const listeners = new Set<() => void>()

function commit(next: Post[]) {
  localPosts = next
  localSnapshot = next
  mergedPosts = mergePosts(next)
  try {
    window.localStorage.setItem(KEY, JSON.stringify(next))
  } catch {
    /* 存储空间不足时仍保留当前会话的改动 */
  }
  listeners.forEach((listener) => listener())
}

function subscribe(listener: () => void) {
  listeners.add(listener)
  return () => listeners.delete(listener)
}

function getPostsSnapshot() { return mergedPosts }
function getLocalSnapshot() { return localSnapshot }

/** 全站文章：内置文章 + 浏览器本地文章/覆盖 */
export function usePosts() {
  return useSyncExternalStore(subscribe, getPostsSnapshot, getPostsSnapshot)
}

/** 仅浏览器本地保存的文章 */
export function useLocalPosts() {
  return useSyncExternalStore(subscribe, getLocalSnapshot, getLocalSnapshot)
}

export function savePost(post: Post) {
  const next = localPosts.filter((item) => item.slug !== post.slug).concat({ ...post, local: true })
  commit(next)
}

export function removeLocalPost(slug: string) {
  commit(localPosts.filter((item) => item.slug !== slug))
}

export function isLocalPost(slug: string) {
  return localPosts.some((item) => item.slug === slug)
}

export function getMergedPost(slug: string) {
  return mergedPosts.find((post) => post.slug === slug)
}

export function createSlug(title: string) {
  const ascii = title
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')
    .slice(0, 42)
  return ascii || `post-${Date.now().toString(36)}`
}

/** 生成可直接粘贴到 src/data/posts.ts 的对象源码 */
export function toTypeScriptSnippet(post: Post) {
  const quote = (value: string) => `'${value.replace(/\\/g, '\\\\').replace(/'/g, "\\'")}'`
  const body = post.content
    .replace(/\\/g, '\\\\')
    .replace(/`/g, '\\`')
    .replace(/\$\{/g, '\\${')
  return [
    '{',
    `  slug: ${quote(post.slug)},`,
    `  title: ${quote(post.title)},`,
    `  date: ${quote(post.date)},`,
    `  category: ${quote(post.category)},`,
    `  tags: [${post.tags.map(quote).join(', ')}],`,
    `  excerpt: ${quote(post.excerpt)},`,
    '  content: `',
    body,
    '`,',
    '},',
  ].join('\n')
}
