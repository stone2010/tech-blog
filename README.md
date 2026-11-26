# 技术笔记 · Tech Notes

一个简洁、现代的个人技术博客，基于 React + TypeScript + Vite 构建。

## 功能特性

- 首页：个人介绍、数据统计、精选文章、最新文章
- 文章列表：关键词搜索、标签筛选
- 文章详情：Markdown 渲染、阅读进度条、上一篇/下一篇导航
- 关于页：个人介绍、技术栈、时间线、联系方式
- 深浅色主题切换，自动记忆偏好
- 完全响应式，适配手机、平板与桌面
- 零后端依赖，可直接部署到 GitHub Pages

## 本地开发

```bash
npm install
npm run dev
```

打开终端提示的地址即可预览。

## 构建与预览

```bash
npm run build
npm run preview
```

## 如何写文章

打开 `src/data/posts.ts`，在 `posts` 数组中新增一个对象即可：

```ts
{
  slug: 'my-new-post',          // 用于文章链接
  title: '文章标题',
  date: '2026-11-26',           // 格式：YYYY-MM-DD
  tags: ['React', '前端'],
  excerpt: '文章摘要，会显示在卡片上。',
  content: `## 正文

这里支持 Markdown 语法。`,
  featured: false,              // 设为 true 会置顶到首页精选
}
```

站点名称、作者、GitHub 与邮箱等信息在 `src/config.ts` 中修改。

## 部署到 GitHub Pages

仓库已包含 `.github/workflows/deploy.yml`。推送到 `main` 分支后，在 GitHub 仓库 **Settings → Pages → Build and deployment** 中将 Source 选择为 **GitHub Actions**，即可自动构建并发布到 `https://stone2010.github.io/tech-blog/`。构建时的基路径已配置为 `/tech-blog/`。
