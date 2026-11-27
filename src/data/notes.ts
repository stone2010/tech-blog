import type { Note } from '../types'

/** 短笔记：不追求完整，只记录当下确实有用的结论 */
export const notes: Note[] = [
  {
    id: 'NOTE-026',
    title: '检索质量比模型大小更值得先优化',
    date: '2026-11-24',
    category: 'AI',
    tags: ['RAG', '评估'],
    content: '在 30 条真实问题上，把 Top-K 从 8 降到 4 并加入重排序后，正确率提升比换更大模型更明显。先建立评估集，再谈调优。',
  },
  {
    id: 'NOTE-025',
    title: 'Vite 的 base 配置与 GitHub Pages',
    date: '2026-11-20',
    category: 'Programming',
    tags: ['Vite', '部署'],
    content: '项目站点构建时 base 要设为 `/repo-name/`，开发环境保持 `/`。用 command 区分两种情况可以避免本地预览路径错乱。',
  },
  {
    id: 'NOTE-024',
    title: '8GB 显存跑 7B 的现实边界',
    date: '2026-11-12',
    category: 'Hardware',
    tags: ['LLM', 'GPU'],
    content: 'INT4 权重约 3.5GB，但 KV Cache 会随上下文线性增长。8GB 卡建议从 4K 上下文起步，稳定后再逐步加长。',
  },
  {
    id: 'NOTE-023',
    title: '别让 rebase 碰公共分支',
    date: '2026-11-02',
    category: 'Open Source',
    tags: ['Git'],
    content: '本地提交可以随意整理，一旦推送到共享分支，rebase 就会改写别人的历史。这个边界比记住命令更重要。',
  },
  {
    id: 'NOTE-022',
    title: '递归下降的直觉',
    date: '2026-10-18',
    category: 'Computer Science',
    tags: ['编译原理', '实验'],
    content: '高优先级运算先被解析，因此自然形成更深的树节点。写完一次词法分析器，对「语法树」的理解会完全不同。',
  },
  {
    id: 'NOTE-021',
    title: '稳定节奏胜过突击强度',
    date: '2026-09-28',
    category: 'Thoughts',
    tags: ['学习方法'],
    content: '每天一小时的输出，比周末十小时的摄入更容易形成可积累的产物。记录本身也是思考的一部分。',
  },
]
