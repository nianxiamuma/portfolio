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
import CollectionPage from './pages/CollectionPage'
import FriendsPage from './pages/FriendsPage'
import GuestbookPage from './pages/GuestbookPage'
import BlogPage from './pages/BlogPage'
import PostPage from './pages/PostPage'

export default function App() {
  return (
    <BrowserRouter basename={BASE_PATH}>
      <Routes>
        <Route element={<SiteLayout />}>
          <Route index element={<HomePage />} />
          <Route path="about" element={<AboutSitePage />} />
          <Route path="glimmer" element={<GlimmerPage />} />
          <Route path="collection" element={<CollectionPage />} />
          <Route path="friends" element={<FriendsPage />} />
          <Route path="guestbook" element={<GuestbookPage />} />
          <Route path="blog" element={<BlogPage />} />
          <Route path="blog/:slug" element={<PostPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}
