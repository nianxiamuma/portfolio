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

/** XML 特殊字符转义 */
function xmlEscape(s) {
  return String(s)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
}

/** RSS 2.0 字幕条目：title 以 CDATA 包裹（中文标题无需转义），其余文本节点走 xmlEscape */
function rssItem(post, siteUrl) {
  const url = `${siteUrl}/blog/${post.slug}`
  const description = `${xmlEscape(post.summary)}（${post.wordCount} 字 · 约 ${post.readingMinutes} 分钟）`
  return [
    '    <item>',
    `      <title><![CDATA[${post.title}]]></title>`,
    `      <link>${url}</link>`,
    `      <guid>${url}</guid>`,
    `      <pubDate>${new Date(`${post.date}T00:00:00Z`).toUTCString()}</pubDate>`,
    `      <description>${description}</description>`,
    ...post.tags.map((tag) => `      <category><![CDATA[${tag}]]></category>`),
    '    </item>',
  ].join('\n')
}

/**
 * 构建期生成 RSS（feed.xml），对标三个 Astro 博客的订阅能力。
 * 数据在构建期从 src/data/posts.js 直读（Node 侧 import JS 数据模块），
 * 与运行时渲染同一真源，不另维护一份清单。
 */
function rssFeed() {
  return {
    name: 'rss-feed',
    closeBundle() {
      const dist = path.resolve(__dirname, 'dist')
      const index = path.join(dist, 'index.html')
      if (!fs.existsSync(index)) return

      // 动态 import：避免 vite.config 加载链被 CJS/ESM 互操作问题绊住
      import('./src/data/posts.js')
        .then(({ POSTS, wordCount, readingMinutes }) => {
          const siteUrl = 'https://nianxiamuma.github.io/portfolio'
          const posts = [...POSTS]
            .sort((a, b) => (a.date < b.date ? 1 : a.date > b.date ? -1 : 0))
            .map((post) => ({
              ...post,
              wordCount: wordCount(post),
              readingMinutes: readingMinutes(post),
            }))
          const lastBuild = posts[0]?.date || new Date().toISOString().slice(0, 10)

          const xml = [
            '<?xml version="1.0" encoding="UTF-8"?>',
            '<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">',
            '  <channel>',
            '    <title><![CDATA[年下牧马的收藏站]]></title>',
            `    <link>${siteUrl}</link>`,
            '    <description><![CDATA[建站记录、书单、零散想法]]></description>',
            `    <atom:link href="${siteUrl}/feed.xml" rel="self" type="application/rss+xml" />`,
            `    <lastBuildDate>${new Date(`${lastBuild}T00:00:00Z`).toUTCString()}</lastBuildDate>`,
            ...posts.flatMap((post) => rssItem(post, siteUrl)),
            '  </channel>',
            '</rss>',
          ].join('\n')

          fs.writeFileSync(path.join(dist, 'feed.xml'), xml, 'utf8')
          console.log(`  ✓ feed.xml (${posts.length} posts)`)
        })
        .catch((err) => {
          // feed 失败不阻塞构建，但要大声报出来，不能静默
          console.error('[rss-feed] 生成失败:', err)
        })
    },
  }
}

export default defineConfig({
  // GitHub Pages 项目页部署在子路径下；CI 会注入 VITE_BASE（形如 /repo-name/）
  base: process.env.VITE_BASE || '/',
  plugins: [react(), spaFallback(), rssFeed()],
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
