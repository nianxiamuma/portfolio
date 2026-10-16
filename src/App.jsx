import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'

/**
 * 部署在子路径时（GitHub Pages 项目页是 /<repo>/），React Router 必须知道这个前缀。
 * 否则浏览器地址 /portfolio/blog 匹配不到路由表里的 /blog，
 * 会落进通配路由被弹回首页——表现为"点任何子页面都回到首页"。
 */
const BASE_PATH = (import.meta.env.BASE_URL || '/').replace(/\/$/, '') || '/'

import SiteLayout from './layouts/SiteLayout'
import HomePage from './pages/HomePage'
import AboutSitePage from './pages/AboutSitePage'
import GlimmerPage from './pages/GlimmerPage'
import GuestbookPage from './pages/GuestbookPage'
import BlogPage from './pages/BlogPage'
import PostPage from './pages/PostPage'
import SourcesPage from './pages/SourcesPage'
import ArchivePage from './pages/ArchivePage'
import TagsPage, { TagPage } from './pages/TagsPage'

export default function App() {
  return (
    <BrowserRouter basename={BASE_PATH}>
      <Routes>
        <Route element={<SiteLayout />}>
          <Route index element={<HomePage />} />
          <Route path="about" element={<AboutSitePage />} />
          <Route path="glimmer" element={<GlimmerPage />} />
          <Route path="guestbook" element={<GuestbookPage />} />
          <Route path="blog" element={<BlogPage />} />
          <Route path="blog/:slug" element={<PostPage />} />
          <Route path="archive" element={<ArchivePage />} />
          <Route path="tags" element={<TagsPage />} />
          <Route path="tags/:tag" element={<TagPage />} />
          <Route path="sources" element={<SourcesPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}
