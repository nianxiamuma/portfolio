import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'
import fs from 'node:fs'

/**
 * GitHub Pages 不支持 SPA rewrite：直接访问子页面或在子页面刷新会 404。
 * 构建后把 index.html 复制一份成 404.html，交给 Pages 的 404 兜底回 SPA。
 */
function spaFallback() {
  return {
    name: 'spa-404-fallback',
    closeBundle() {
      const dist = path.resolve(__dirname, 'dist')
      const index = path.join(dist, 'index.html')
      if (fs.existsSync(index)) {
        fs.copyFileSync(index, path.join(dist, '404.html'))
      }
    },
  }
}

// 说明：主站原本还有一个 rssFeed 插件，从 src/data/posts.js 读文章生成 feed.xml。
// 文章站已迁到同仓 blog/ 子站（Astro + Firefly），posts.js 随旧博客系统一起移除，
// 主站不再有文章可订阅 —— RSS/Atom 由博客子站自己产出（/{repo}/blog/rss.xml）。

export default defineConfig({
  // GitHub Pages 项目页部署在子路径下；CI 会注入 VITE_BASE（形如 /repo-name/）
  base: process.env.VITE_BASE || '/',
  plugins: [react(), spaFallback()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    port: 5173,
    open: false,
  },
})
