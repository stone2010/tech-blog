import type { Project } from '../types'

export const projects: Project[] = [
  {
    name: 'fieldnotes',
    slug: 'fieldnotes',
    description: '这个博客本身。一个以阅读体验为先的技术出版空间，记录文章、笔记与项目。',
    year: '2026',
    status: 'active',
    stack: ['React', 'TypeScript', 'Vite'],
    repo: 'https://github.com/stone2010/tech-blog',
    url: 'https://stone2010.github.io/tech-blog/',
  },
  {
    name: 'rag-workbench',
    slug: 'rag-workbench',
    description: '用于对比不同切片策略与重排序模型的 RAG 实验台，内置可复现的评估集。',
    year: '2026',
    status: 'experiment',
    stack: ['Python', 'FastAPI', 'Chroma'],
    repo: 'https://github.com/stone2010/rag-workbench',
  },
  {
    name: 'tinyclip',
    slug: 'tinyclip',
    description: '一个只做一件事的命令行工具：按规则批量重命名文件，支持 dry-run 与回滚清单。',
    year: '2025',
    status: 'active',
    stack: ['Rust', 'clap'],
    repo: 'https://github.com/stone2010/tinyclip',
  },
  {
    name: 'mono-interpreter',
    slug: 'mono-interpreter',
    description: '两百行左右的极简解释器实验，用来理解词法分析、递归下降与 AST 求值。',
    year: '2025',
    status: 'archived',
    stack: ['JavaScript'],
    repo: 'https://github.com/stone2010/mono-interpreter',
  },
]
