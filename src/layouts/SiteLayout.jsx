import { useEffect } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import BackgroundStage from '../components/BackgroundStage'
import { BackgroundProvider } from '../context/BackgroundContext'

/**
 * 博客子站地址（同仓 blog/ 子站的 Astro + Firefly 构建产物）。
 * 主站不再维护文章索引：旧的内存搜索面板连同 posts.js 一并移除，
 * 全文搜索由 Firefly 自带的 pagefind 在博客内提供。
 */
const BLOG_URL = `${import.meta.env.BASE_URL}blog/`

/**
 * 全站外壳。
 *
 * 容器底色刻意去掉了 bg-void-950 —— 页面背景改由 BackgroundStage（fixed，-z-10）负责。
 * 容器若还留着不透明底色，会把背景层整个盖住。
 * body 上仍有 bg-void-950 作为兜底，背景层没渲染出来时不会白屏。
 */
export default function SiteLayout() {
  const { pathname } = useLocation()

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [pathname])

  // Cmd/Ctrl+K 原本唤出主站文章搜索面板；文章迁走后改为直接打开博客搜索。
  useEffect(() => {
    const onKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault()
        window.location.href = BLOG_URL
      }
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [])

  return (
    <BackgroundProvider>
      <BackgroundStage />
      <div className="relative min-h-screen w-full overflow-x-clip">
        <Navbar />
        <main className="relative">
          <Outlet />
        </main>
        <Footer />
      </div>
    </BackgroundProvider>
  )
}
