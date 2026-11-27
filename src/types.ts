export type Category =
  | 'AI'
  | 'Programming'
  | 'Hardware'
  | 'Computer Science'
  | 'Open Source'
  | 'Thoughts'

export type Theme = 'dark' | 'light'

export interface Post {
  slug: string
  title: string
  date: string
  category: Category
  tags: string[]
  excerpt: string
  content: string
  featured?: boolean
  /** 由网页编辑器创建或覆盖的文章，保存在浏览器本地 */
  local?: boolean
}

export interface Project {
  name: string
  slug: string
  description: string
  year: string
  status: 'active' | 'experiment' | 'archived'
  stack: string[]
  repo?: string
  url?: string
}

export interface Note {
  id: string
  title: string
  date: string
  category: Category
  content: string
  tags: string[]
}

export type Route =
  | { name: 'home' }
  | { name: 'posts' }
  | { name: 'post'; slug: string }
  | { name: 'categories' }
  | { name: 'category'; category: string }
  | { name: 'tag'; tag: string }
  | { name: 'projects' }
  | { name: 'notes' }
  | { name: 'write'; slug?: string }
  | { name: 'about' }
