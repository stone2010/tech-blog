import type { Post } from '../types'

/**
 * 文章数据：新增一个对象即发布一篇新文章。
 * content 支持 Markdown，代码围栏使用三个反引号。
 */
export const posts: Post[] = [
  {
    slug: 'llm-from-rag-to-agent',
    title: '从 RAG 到 Agent：构建真正可用的 LLM 应用',
    date: '2026-11-22',
    category: 'AI',
    tags: ['LLM', 'RAG', 'Agent', 'Python'],
    excerpt: '把文档塞进向量库只是开始。一个可用的 AI 应用还需要检索策略、工具调用、评估与失败兜底。',
    featured: true,
    content: `
## 不要从 Demo 开始

很多 LLM 项目停留在「能跑通」的阶段，是因为最初的架构只考虑了一次问答。真实场景里，用户会追问、会给出模糊指令，也会故意测试边界。

一个更实际的起点是先定义**任务的成功标准**：

- 回答是否必须可溯源？
- 允许调用哪些外部工具？
- 出错时是重试、降级，还是转人工？

这些约束会直接决定你要不要做 RAG、要不要引入 Agent。

## 检索不是「嵌进去就完了」

最基础的流程是把文档切片、向量化、检索 Top-K，然后拼进提示词：

\`\`\`python
def retrieve(query: str, k: int = 4) -> list[dict]:
    vector = embed(query)
    hits = index.search(vector, top_k=k * 2)
    return rerank(query, hits)[:k]
\`\`\`

真正影响效果的往往是这三件事：

1. **切片策略**：按语义段落切，而不是按固定字符数
2. **混合检索**：向量召回加关键词召回，别只依赖一种
3. **重排序**：让小模型对候选做一次精排，收益通常很大

> 如果检索质量不稳定，换更大的模型通常不如先把检索做对。

## Agent 的关键是约束

Agent 不是让模型自由发挥，而是给它一组明确的工具和边界。

\`\`\`python
tools = {
    "search_docs": search_docs,
    "query_db": query_db,
    "create_ticket": create_ticket,
}

result = agent.run(
    instruction=user_input,
    tools=tools,
    max_steps=6,
    on_unknown="ask_clarification",
)
\`\`\`

限制步数、限制工具集合、给未知意图一个明确的出口，这比「更聪明的提示词」重要得多。

## 评估比调优更重要

没有评估集，你没法判断一次改动是变好还是变坏。哪怕只有 30 条真实问题，也足以暴露大部分回归：

- 记录每次回答的引用来源
- 标注「答对 / 答错 / 不该回答」
- 对失败案例做分类，而不是逐条修

## 小结

从 RAG 到 Agent，工程量主要不在模型，而在系统边界的设计。把不确定性关进可控的流程里，应用才真正可用。
`,
  },
  {
    slug: 'react-maintainable-project',
    title: '用 React 构建可维护的前端项目：我的实践清单',
    date: '2026-11-18',
    category: 'Programming',
    tags: ['React', '前端工程', '最佳实践'],
    excerpt: '项目越做越大，真正拖慢我们的往往不是框架，而是混乱的结构。这篇文章整理我在 React 项目里坚持的几个简单习惯。',
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
    slug: 'local-7b-model-hardware-notes',
    title: '在本地跑一个 7B 模型：硬件与量化笔记',
    date: '2026-11-10',
    category: 'Hardware',
    tags: ['LLM', 'GPU', '本地部署', '量化'],
    excerpt: '从显存预算到量化格式，记录我在消费级硬件上部署本地模型时踩过的坑和最终可用的配置。',
    content: `
## 先算显存，再谈速度

一个 7B 参数的模型，权重本身的体积取决于精度：

| 精度 | 每参数字节 | 7B 权重约 |
| --- | --- | --- |
| FP16 | 2 | 14 GB |
| INT8 | 1 | 7 GB |
| INT4 | 0.5 | 3.5 GB |

再加上 KV Cache、上下文长度和运行时开销，8 GB 显存跑 INT4 是现实的，但上下文别开太大。

## 我最终用的配置

\`\`\`bash
ollama pull qwen2.5:7b-instruct-q4_k_m
OLLAMA_CONTEXT_LENGTH=8192 ollama serve
\`\`\`

关键参数不是越大越好。更长的上下文意味着更多显存占用，如果大部分任务只需要几千 token，没必要拉满。

## 哪些坑值得记住

1. **量化格式差异很大**：同样是 4bit，Q4_K_M 和 IQ4_XS 的质量与速度并不一样
2. **CPU 也能跑，但体验不同**：纯 CPU 适合离线批处理，不适合交互式对话
3. **散热决定持续性能**：短时跑分好看不代表能连续生成十分钟

> 本地模型的价值不在于比云端更强，而在于可控、离线和数据不出本机。

## 小结

先用小上下文跑通，再逐步调参数。把「能稳定跑」放在「跑得最快」前面，体验会好很多。
`,
  },
  {
    slug: 'typescript-from-any-to-safe',
    title: 'TypeScript 类型体操入门：从 any 到类型安全',
    date: '2026-11-05',
    category: 'Programming',
    tags: ['TypeScript', '前端'],
    excerpt: '类型系统不是枷锁，而是把运行时错误提前到编辑器的工具。从几个日常场景出发，看看怎么用好 TypeScript。',
    content: `
## 先别急着「体操」

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
    slug: 'writing-cli-in-rust',
    title: '用 Rust 写一个命令行工具：从想法到 crate',
    date: '2026-10-30',
    category: 'Open Source',
    tags: ['Rust', 'CLI', '开源'],
    excerpt: '一个周末做完的小工具，让我重新理解了 Rust 的工具链、错误处理和发布流程。',
    content: `
## 先解决一个真实的小问题

我做这个工具的起因很朴素：想批量重命名一批实验截图，但不想每次都写一段 Python 脚本。

工具的功能被我压缩到三个：

- 按规则预览文件名变化
- 支持 dry-run
- 确认后执行

限制范围反而让实现变得轻松。

## 错误处理不要靠 panic

Rust 的 \`?\` 运算符让错误传递变得很自然：

\`\`\`rust
use anyhow::{Context, Result};

fn rename_all(paths: &[PathBuf], dry_run: bool) -> Result<()> {
    for path in paths {
        let next = build_name(path).context("生成文件名失败")?;
        if dry_run {
            println!("{} -> {}", path.display(), next.display());
        } else {
            fs::rename(path, &next)?;
        }
    }
    Ok(())
}
\`\`\`

把错误当成流程的一部分，而不是异常情况，工具才可靠。

## 发布之前

- 用 \`cargo clippy\` 清掉明显问题
- 加一个最小 README，写清用法和限制
- 用 GitHub Actions 跑测试与构建

> 开源不是把代码推上去就结束了。能被别人看懂和使用，才算完成。

## 小结

小工具是学习一门语言最好的方式之一：目标明确，反馈直接，也没有架构上的包袱。
`,
  },
  {
    slug: 'css-grid-vs-flexbox',
    title: 'CSS Grid 与 Flexbox：什么时候该用谁',
    date: '2026-10-22',
    category: 'Programming',
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
    slug: 'minimal-interpreter-experiment',
    title: '编译原理小实验：写一个极简解释器',
    date: '2026-10-16',
    category: 'Computer Science',
    tags: ['编译原理', 'JavaScript', '实验'],
    excerpt: '从词法分析到 AST，再到求值器。用一个下午把「语言是怎么跑起来的」这件事走通一遍。',
    content: `
## 为什么做这个实验

概念读起来都懂，但只有亲手写完一遍词法分析器，才会真正理解「 token 」和「语法树」的区别。

目标很小：支持整数、加减乘除、括号和变量赋值。

## 第一步：把字符切成 token

\`\`\`js
function tokenize(input) {
  const tokens = []
  let i = 0
  while (i < input.length) {
    const ch = input[i]
    if (/\\s/.test(ch)) { i++; continue }
    if (/[0-9]/.test(ch)) {
      let num = ''
      while (/[0-9]/.test(input[i] ?? '')) num += input[i++]
      tokens.push({ type: 'number', value: Number(num) })
      continue
    }
    if ('+-*/()='.includes(ch)) tokens.push({ type: 'op', value: ch })
    i++
  }
  return tokens
}
\`\`\`

## 第二步：递归下降解析

表达式的优先级天然适合递归下降：乘法绑定得更紧，所以先解析乘法再解析加法。

\`\`\`js
function parseExpression(tokens) {
  let node = parseTerm(tokens)
  while (tokens[0]?.value === '+' || tokens[0]?.value === '-') {
    const op = tokens.shift().value
    node = { type: 'binary', op, left: node, right: parseTerm(tokens) }
  }
  return node
}
\`\`\`

## 第三步：求值

有了 AST，求值就只是一个递归遍历。真正有意思的是——到这里你已经实现了一门「语言」的最小骨架。

> 编译原理并不神秘，它只是把复杂问题拆成了几个清晰的阶段。

## 小结

如果你对语言、解析器或 DSL 感兴趣，强烈建议亲手做一次。哪怕只有两百行代码，理解也会完全不同。
`,
  },
  {
    slug: 'clean-git-workflow',
    title: 'Git 工作流：让提交历史保持干净',
    date: '2026-10-09',
    category: 'Programming',
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
    category: 'Programming',
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
    slug: 'long-term-learning',
    title: '关于长期主义的技术学习',
    date: '2026-09-18',
    category: 'Thoughts',
    tags: ['思考', '学习方法'],
    excerpt: '技术更新很快，但真正拉开差距的往往不是追新速度，而是能否长期、稳定地积累。',
    content: `
## 别把「学完了」当成目标

技术学习没有终点。把目标设成「学完 X」很容易在完成的那一刻失去方向；更好的目标是「能用 X 解决什么问题」。

我习惯用三个问题检验一次学习：

1. 我能用自己的话把它讲清楚吗？
2. 我知道它适合什么场景、不适合什么场景吗？
3. 我有没有真的用它做过一个东西？

## 输出是最好的输入

写文章、做笔记、给同事讲解，这些动作会暴露你以为自己懂了但其实没懂的地方。

> 如果你没法把它写下来，大概率你只是记住了术语。

## 保持节奏，而不是保持强度

每天一小时，比周末突击十小时更有效。节奏的意义在于让大脑有时间在后台整理，而不是不断塞入新信息。

## 小结

长期主义不是慢，而是稳定。少一点焦虑，多一点可积累的产物，时间会给出答案。
`,
  },
  {
    slug: 'my-dev-toolbox-2026',
    title: '我的开发工具箱：2026 年版',
    date: '2026-09-12',
    category: 'Open Source',
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
  const text = content.replace(/[#`*>\-\[\]()]/g, '')
  return Math.max(1, Math.ceil(text.length / 400))
}

export function formatDate(date: string) {
  const [year, month, day] = date.split('-')
  return `${year} 年 ${Number(month)} 月 ${Number(day)} 日`
}

export function shortDate(date: string) {
  const [year, month, day] = date.split('-')
  return `${year}.${month}.${day}`
}

/** 从 Markdown 中提取目录，id 与渲染后的标题顺序一致 */
export function parseHeadings(content: string) {
  const items: { id: string; level: number; text: string }[] = []
  const regex = /^(#{2,3})\s+(.+)$/gm
  let match: RegExpExecArray | null
  let index = 0
  while ((match = regex.exec(content)) !== null) {
    items.push({
      id: `section-${index++}`,
      level: match[1].length,
      text: match[2].replace(/[*`_]/g, '').trim(),
    })
  }
  return items
}
