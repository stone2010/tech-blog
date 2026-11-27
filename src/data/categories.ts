import type { Category, Post } from '../types'
import { notes } from './notes'
import { posts } from './posts'

export const categories: { key: Category; description: string }[] = [
  { key: 'AI', description: '模型、检索、Agent 与 AI 工程实践。' },
  { key: 'Programming', description: '前端、语言、工程化与日常开发。' },
  { key: 'Hardware', description: '本地推理、硬件选型与底层实验。' },
  { key: 'Computer Science', description: '编译原理、系统基础与算法笔记。' },
  { key: 'Open Source', description: '工具链、开源项目与发布经验。' },
  { key: 'Thoughts', description: '关于学习、写作和长期主义的想法。' },
]

export function categoryCount(key: Category, source: Post[] = posts) {
  const articleCount = source.filter((post) => post.category === key).length
  const noteCount = notes.filter((note) => note.category === key).length
  return articleCount + noteCount
}

export function isCategory(value: string): value is Category {
  return categories.some((category) => category.key === value)
}
