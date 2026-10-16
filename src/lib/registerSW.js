/**
 * Service Worker 注册器（对标 taozhiyy 的 registerServiceWorker.js，按本站环境简化）。
 *
 * 注册条件（缺一不可，防止在错误环境留下僵尸 SW）：
 * - 生产构建（import.meta.env.PROD）
 * - secure context：https 或 localhost/127.0.0.1
 * - 浏览器支持 serviceWorker
 *
 * SW 文件在 public/sw.js，构建后位于部署根（BASE_URL 前缀下）。
 */
export function registerSW() {
  if (!import.meta.env.PROD) return
  if (!('serviceWorker' in navigator)) return
  const secure =
    location.protocol === 'https:' ||
    location.hostname === 'localhost' ||
    location.hostname === '127.0.0.1'
  if (!secure) return

  window.addEventListener('load', () => {
    navigator.serviceWorker
      .register(`${import.meta.env.BASE_URL}sw.js`)
      .catch(() => {
        /* 注册失败静默降级：站点行为与无 SW 完全一致 */
      })
  })
}
