/**
 * 跨站入口地址解析（主站 React ↔ 博客 Astro 子站）。
 *
 * 线上：两者同域不同路径（`/portfolio/` 与 `/portfolio/blog/`），相对路径即可。
 * 本地：主站 vite(:5173) 与博客 astro dev(:4321) 是两个独立服务器，
 *       相对路径会打到对方不存在的路由上——实测 `5173/blog/` 与 `4321/portfolio/`
 *       都是 404。所以 dev 下必须写成对端完整地址。
 *       博客 dev 的挂载路径固定为 `/portfolio/blog`（astro.config.mjs 里
 *       `BLOG_BASE` 的默认值，CI 可用同名环境变量覆盖，本地开发不用管）。
 */
const BLOG_DEV_PORT = '4321'
const BLOG_DEV_PATH = '/portfolio/blog/'

/** 已在对端端口上（或非浏览器环境）时返回 null，让调用方退回相对路径 */
function crossOriginTo(port, path) {
  if (!import.meta.env.DEV || typeof window === 'undefined') return null
  const { protocol, hostname, port: current } = window.location
  if (!current || current === port) return null
  return `${protocol}//${hostname}:${port}${path}`
}

/** 主站 → 博客子站。线上相对路径，本地指向 astro dev 端口。 */
export function blogEntryHref() {
  return crossOriginTo(BLOG_DEV_PORT, BLOG_DEV_PATH) || `${import.meta.env.BASE_URL}blog/`
}
