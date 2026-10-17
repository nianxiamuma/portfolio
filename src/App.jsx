import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'

/**
 * 部署在子路径时（GitHub Pages 项目页是 /<repo>/），React Router 必须知道这个前缀。
 * 否则浏览器地址 /portfolio/about 匹配不到路由表里的 /about，
 * 会落进通配路由被弹回首页——表现为"点任何子页面都回到首页"。
 *
 * 注意：/blog 不在本表内。文章站已迁到同仓 blog/ 子站（Astro + Firefly），
 * 构建产物由 CI 拷进 dist/blog/，是真实的静态目录，优先于 SPA 兜底页命中。
 * 旧的主站博客路由（blog、blog/:slug、archive、tags、tags/:tag）已于本轮移除。
 */
const BASE_PATH = (import.meta.env.BASE_URL || '/').replace(/\/$/, '') || '/'

import SiteLayout from './layouts/SiteLayout'
import HomePage from './pages/HomePage'
import AboutSitePage from './pages/AboutSitePage'
import GlimmerPage from './pages/GlimmerPage'
import GuestbookPage from './pages/GuestbookPage'
import SourcesPage from './pages/SourcesPage'

export default function App() {
  return (
    <BrowserRouter basename={BASE_PATH}>
      <Routes>
        <Route element={<SiteLayout />}>
          <Route index element={<HomePage />} />
          <Route path="about" element={<AboutSitePage />} />
          <Route path="glimmer" element={<GlimmerPage />} />
          <Route path="guestbook" element={<GuestbookPage />} />
          <Route path="sources" element={<SourcesPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}
