export interface Post {
  slug: string
  title: string
  date: string
  tags: string[]
  excerpt: string
  content: string
  featured?: boolean
}

export type Theme = 'dark' | 'light'

export type Route =
  | { name: 'home' }
  | { name: 'posts' }
  | { name: 'post'; slug: string }
  | { name: 'tag'; tag: string }
  | { name: 'about' }
