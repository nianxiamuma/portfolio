/**
 * 手写 Service Worker（对标 bistutzyy/taozhiyy 的 public/sw.js，无 workbox 插件）。
 *
 * 策略（按本站资产结构定制）：
 * - install：预缓存应用壳（HTML 壳 / manifest / 图标），skipWaiting
 * - activate：清掉旧版本缓存 + clients.claim()
 * - fetch：只拦 GET + 同源
 *     · 导航请求 → network-first，失败回退壳页（GitHub Pages 404.html 兜底仍在 SW 之前起效于服务器层，二者不冲突）
 *     · 静态资产（/assets/ 图标 manifest）→ stale-while-revalidate
 *     · /wallpapers/ 大图池（88MB）→ **不缓存**（network-only，Cache Storage 撑不起也不该撑）
 *
 * 版本纪律：改 SHELL 内容时必须 bump CACHE_VERSION，否则旧壳永远不更新。
 */
const CACHE_VERSION = 'v1'
const CACHE_NAME = `portfolio-shell-${CACHE_VERSION}`
const SHELL = [
  './',
  './index.html',
  './manifest.webmanifest',
  './icons/icon.svg',
  './icons/icon-192.png',
  './icons/icon-512.png',
]

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches
      .open(CACHE_NAME)
      .then((cache) => cache.addAll(SHELL))
      .then(() => self.skipWaiting()),
  )
})

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) =>
        Promise.all(keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k))),
      )
      .then(() => self.clients.claim()),
  )
})

self.addEventListener('fetch', (event) => {
  const { request } = event
  if (request.method !== 'GET') return
  const url = new URL(request.url)
  if (url.origin !== self.location.origin) return
  // 壁纸池不缓存（88MB，网络直出）
  if (url.pathname.includes('/wallpapers/')) return

  if (request.mode === 'navigate') {
    event.respondWith(
      fetch(request).catch(() => caches.match('./index.html')),
    )
    return
  }

  // 其余同源静态资产：stale-while-revalidate
  event.respondWith(
    caches.match(request).then((cached) => {
      const network = fetch(request)
        .then((response) => {
          if (response.ok && response.type === 'basic') {
            const clone = response.clone()
            caches.open(CACHE_NAME).then((cache) => cache.put(request, clone))
          }
          return response
        })
        .catch(() => cached)
      return cached || network
    }),
  )
})
