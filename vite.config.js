import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'
import fs from 'node:fs'

/**
 * GitHub Pages 不支持 SPA rewrite：直接访问 /blog 或在子页面刷新会 404。
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
