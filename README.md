# Stone · Field Notes

一个 Technical Editorial × Digital Garden × Developer Journal 风格的个人技术档案。基于 React + TypeScript + Vite，无后端依赖，可直接部署到 GitHub Pages。

## 设计定位

- 内容优先：编辑式文章列表、克制的排版与宽松的阅读节奏
- 技术档案：侧边索引、文章编号、短笔记与项目记录
- 阅读体验：合适的正文宽度、代码高亮与复制、目录跟随、阅读进度
- 视觉系统：冷蓝 / 冷灰配色，Inter 风格无衬线字体，JetBrains Mono 代码字体

## 功能

- **首页**：品牌介绍、当前关注、精选文章、编辑式文章流、笔记与项目预览
- **文章**：分类筛选、关键词搜索、标签筛选
- **文章详情**：Markdown、目录、代码高亮与复制、表格/引用、阅读进度、上下篇
- **分类**：按 AI / Programming / Hardware / Computer Science / Open Source / Thoughts 浏览
- **笔记**：数字花园式短记录
- **项目**：开源项目与实验记录
- **关于**：个人简介、技术栈与经历
- **站内搜索**：`⌘K` / `Ctrl+K` 或 `/` 打开命令面板
- **主题**：默认浅色，可切换深色并记忆偏好
- **响应式**：桌面 / 笔记本 / 平板 / 手机分别适配

## 本地开发

```bash
npm install
npm run dev
```

## 构建与预览

```bash
npm run build
npm run preview
```

## 内容放在哪里

| 文件 | 用途 |
| --- | --- |
| `src/config.ts` | 站点名称、作者、简介、GitHub、邮箱、当前关注 |
| `src/data/posts.ts` | 长文章，支持 Markdown，`category` 决定分类 |
| `src/data/notes.ts` | 短笔记 |
| `src/data/projects.ts` | 项目记录 |
| `src/data/categories.ts` | 分类名称与描述 |
| `src/styles.css` | 色彩令牌、字体、间距、组件样式与响应式规则 |

新增文章示例：

```ts
{
  slug: 'my-new-post',
  title: '文章标题',
  date: '2026-11-27',
  category: 'AI',
  tags: ['LLM', '实践'],
  excerpt: '一句话摘要。',
  content: `## 正文\n\n支持 Markdown。`,
  featured: false,
}
```

## 部署

仓库包含 `.github/workflows/deploy.yml`。推送到 `main` 后，在 GitHub 仓库 **Settings → Pages → Build and deployment** 中把 Source 设为 **GitHub Actions**，即可自动发布到 `https://stone2010.github.io/tech-blog/`。构建基路径已设为 `/tech-blog/`。
