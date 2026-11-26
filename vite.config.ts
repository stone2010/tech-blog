import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// 开发环境访问根路径，构建产物适配 GitHub Pages 项目站点
export default defineConfig(({ command }) => ({
  plugins: [react()],
  base: command === 'build' ? '/tech-blog/' : '/',
}))
