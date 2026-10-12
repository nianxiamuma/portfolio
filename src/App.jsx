import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'

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
    <BrowserRouter>
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
