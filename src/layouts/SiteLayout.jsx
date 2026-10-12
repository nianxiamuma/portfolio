import { useEffect } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import BackgroundStage from '../components/BackgroundStage'
import { BackgroundProvider } from '../context/BackgroundContext'

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
