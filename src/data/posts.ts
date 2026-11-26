import type { Post } from '../types'

/**
 * 文章数据：直接在这里新增一个对象，就能发布一篇新文章。
 * content 支持 Markdown 语法。
 */
export const posts: Post[] = [
  {
    slug: 'react-maintainable-project',
    title: '用 React 构建可维护的前端项目：我的实践清单',
    date: '2026-11-18',
    tags: ['React', '前端工程', '最佳实践'],
    excerpt: '项目越做越大，真正拖慢我们的往往不是框架，而是混乱的结构。这篇文章整理我在 React 项目里坚持的几个简单习惯。',
    featured: true,
    content: `
## 从目录结构开始

一个好理解的目录结构，比任何炫技的抽象都有价值。我习惯按「功能」而不是按「文件类型」组织代码：

\`\`\`
src/
├── components/     # 通用 UI 组件
├── features/       # 按业务功能划分
│   ├── auth/
│   └── dashboard/
├── hooks/          # 可复用 Hook
├── lib/            # 工具函数
└── types.ts
\`\`\`

当新同事第一次进入项目时，他能在三十秒内知道「登录相关的代码在哪里」，这就够了。

## 组件要保持「无聊」

业务组件最怕过度设计。我的判断标准是：**如果一个组件需要读三遍才能明白它在做什么，那它应该被拆开**。

- 优先写清楚的 JSX，而不是立刻封装
- 组件超过 200 行时考虑拆分
- 把状态和副作用放在一起，别按生命周期分散

\`\`\`tsx
function UserCard({ user }: { user: User }) {
  return (
    <article className="user-card">
      <img src={user.avatar} alt="" />
      <div>
        <h3>{user.name}</h3>
        <p>{user.bio}</p>
      </div>
    </article>
  )
}
\`\`\`

## 类型是最好的文档

在 TypeScript 项目里，与其写一大段注释解释参数含义，不如把类型定义清楚。好的类型可以让 IDE 帮你完成一半的沟通工作。

> 代码被阅读的次数远远多于被编写的次数。为阅读者写代码，而不是为编译器写代码。

## 写在最后

可维护性不是一次重构换来的，而是由每天的小决定累积而成。少一点魔法，多一点直白，时间会给出回报。
`,
  },
  {
    slug: 'typescript-from-any-to-safe',
    title: 'TypeScript 类型体操入门：从 any 到类型安全',
    date: '2026-11-05',
    tags: ['TypeScript', '前端'],
    excerpt: '类型系统不是枷锁，而是把运行时错误提前到编辑器的工具。从几个日常场景出发，看看怎么用好 TypeScript。',
    content: `
## 先别急着“体操”

很多人一接触 TypeScript 就想写复杂的条件类型，结果项目里还是到处 \`any\`。其实先把基础打牢，收益更大：

1. 打开 \`strict\` 模式
2. 给函数返回值标注类型
3. 用联合类型代替布尔开关

\`\`\`ts
type Status = 'loading' | 'success' | 'error'

function formatStatus(status: Status): string {
  switch (status) {
    case 'loading': return '加载中'
    case 'success': return '完成'
    case 'error': return '出错了'
  }
}
\`\`\`

联合类型让「漏掉一种状态」变成编译错误，而不是线上 bug。

## 善用工具类型

内置的 \`Partial\`、\`Pick\`、\`Omit\` 能覆盖大部分场景：

\`\`\`ts
interface User {
  id: string
  name: string
  email: string
}

type UserPreview = Pick<User, 'id' | 'name'>
type UserUpdate = Partial<Omit<User, 'id'>>
\`\`\`

不需要自己造轮子，类型就已经很清晰了。

## 什么时候用泛型

当「输入类型决定输出类型」时，泛型就派上用场了：

\`\`\`ts
function first<T>(list: T[]): T | undefined {
  return list[0]
}
\`\`\`

泛型不是复杂度的代名词，它只是把重复的类型参数化了。

## 小结

类型安全的目标不是让编译器闭嘴，而是让代码意图更明确。从今天开始，少写一个 \`any\`，就是进步。
`,
  },
  {
    slug: 'css-grid-vs-flexbox',
    title: 'CSS Grid 与 Flexbox：什么时候该用谁',
    date: '2026-10-22',
    tags: ['CSS', '前端'],
    excerpt: '两个布局系统不是竞争关系，而是各有所长。用一句话记住它们的核心区别，再也不用每次都靠试。',
    content: `
## 一句话区分

**Flexbox 适合一维布局，Grid 适合二维布局。**

- 一维：一行或一列 —— 导航栏、按钮组、卡片内部排列
- 二维：同时控制行和列 —— 页面骨架、卡片墙、仪表盘

## Flexbox 的典型场景

\`\`\`css
.navbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
}
\`\`\`

简单直接，内容宽度变化时也能自然适应。

## Grid 的典型场景

\`\`\`css
.gallery {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
  gap: 24px;
}
\`\`\`

\`auto-fill\` 加上 \`minmax\` 几乎能解决所有响应式卡片列表，不需要写媒体查询。

## 可以组合使用

实际项目里，外层用 Grid 划分区域，内层用 Flexbox 对齐内容，是非常常见的组合：

\`\`\`css
.page {
  display: grid;
  grid-template-columns: 240px 1fr;
}
.card {
  display: flex;
  flex-direction: column;
  gap: 8px;
}
\`\`\`

## 结语

别纠结「哪个更好」，问自己一个问题：**我需要同时控制行和列吗？** 答案是「是」就用 Grid，否则用 Flexbox。
`,
  },
  {
    slug: 'clean-git-workflow',
    title: 'Git 工作流：让提交历史保持干净',
    date: '2026-10-09',
    tags: ['Git', '工具', '效率'],
    excerpt: '提交历史也是项目文档。学会几个简单的 Git 习惯，让回滚、排查和协作都变得轻松。',
    content: `
## 提交信息要能读懂

半年后回头看 \`fix bug\` 这样的提交信息，没人知道它做了什么。推荐一个轻量规范：

\`\`\`
feat: 新增标签筛选功能
fix: 修复移动端导航溢出
docs: 更新 README 安装说明
\`\`\`

类型 + 简短描述，足够清楚。

## 小而专注的提交

一次提交只做一件事。改动越小，定位问题越快，回滚代价越低。

\`\`\`bash
git add -p          # 交互式选择要暂存的改动
git commit -m "fix: 修复日期格式"
\`\`\`

\`git add -p\` 是保持提交干净的神器，强烈推荐。

## 善用 rebase 整理本地提交

在合并前整理自己的本地提交，可以让主线历史保持线性：

\`\`\`bash
git rebase -i HEAD~3
\`\`\`

注意：不要对已经推送到公共分支的提交执行 rebase。

## 常用别名

\`\`\`bash
git config --global alias.st status
git config --global alias.lg "log --oneline --graph --decorate"
\`\`\`

把高频命令缩短一点，每天都能省下不少敲击。

## 小结

Git 不需要记得所有命令，把「小提交、好描述、勤同步」三件事做好，协作效率就会明显提升。
`,
  },
  {
    slug: 'frontend-performance-checklist',
    title: '前端性能优化：从首屏加载到交互响应',
    date: '2026-09-27',
    tags: ['性能', '前端', '最佳实践'],
    excerpt: '性能不是上线前才做的事。这份清单从资源、渲染、交互三个角度，梳理最值得优先处理的优化点。',
    content: `
## 先测量，再优化

不要凭感觉优化。打开浏览器开发者工具，看三个指标：

- **LCP**：最大内容绘制，反映首屏加载速度
- **INP**：交互响应，反映页面是否「跟手」
- **CLS**：布局偏移，反映页面是否「跳动」

## 资源层面

图片通常是最大的资源。优先使用现代格式，并明确尺寸：

\`\`\`html
<img src="cover.webp" width="800" height="450" loading="lazy" alt="封面" />
\`\`\`

- 首屏图片不要懒加载
- 字体文件设置 \`font-display: swap\`
- 给静态资源配置长期缓存

## 渲染层面

减少主线程工作是提升响应速度的关键：

- 长列表使用虚拟滚动
- 昂贵计算放进 Web Worker
- 避免频繁触发布局抖动

\`\`\`ts
// 集中读取，再集中写入，避免反复触发重排
const width = element.offsetWidth
element.style.width = width + 20 + 'px'
\`\`\`

## 交互层面

给用户即时反馈，即使数据还在路上。按钮点击后立即进入 loading 状态，比等待接口返回再响应要自然得多。

## 小结

性能优化的收益往往来自少数几个关键改动。先找到瓶颈，再动手，别把时间花在无关紧要的细节上。
`,
  },
  {
    slug: 'my-dev-toolbox-2026',
    title: '我的开发工具箱：2026 年版',
    date: '2026-09-12',
    tags: ['工具', '效率'],
    excerpt: '工具不在多，顺手就好。分享我每天都在用的编辑器插件、命令行工具和一些提高效率的小习惯。',
    content: `
## 编辑器

我用的是 VS Code，装得不多，但每一个都高频使用：

- **Prettier**：保存时自动格式化，再也不用争论缩进
- **Error Lens**：错误直接显示在代码旁边
- **GitLens**：快速查看某一行代码的来历

把格式化交给工具，把注意力留给逻辑。

## 命令行

\`\`\`bash
# 快速定位项目里的文件
fd "README" .

# 搜索内容，比 grep 快很多
rg "TODO" src/

# 查看目录结构
tree -L 2
\`\`\`

把常用命令做成别名，积少成多。

## 一些习惯

- 每天开始工作前，先写下今天最重要的三件事
- 遇到重复三次的操作，就考虑写个脚本
- 周五花半小时整理笔记，把零散的想法沉淀下来

> 工具的真正价值，是让你更专注地思考，而不是让你看起来更忙。

## 写在最后

工具会过时，习惯会留下。希望你也能找到让自己舒服的工作方式。
`,
  },
]

export const allTags = Array.from(new Set(posts.flatMap((post) => post.tags))).sort()

export function getPost(slug: string) {
  return posts.find((post) => post.slug === slug)
}

export function readingMinutes(content: string) {
  const text = content.replace(/[#`*>\\-\\[\\]()]/g, '')
  return Math.max(1, Math.ceil(text.length / 400))
}

export function formatDate(date: string) {
  const [year, month, day] = date.split('-')
  return `${year} 年 ${Number(month)} 月 ${Number(day)} 日`
}
