import { useCallback, useEffect, useRef, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Menu, X, Music } from 'lucide-react'
import VisitorNetworkBadge from './VisitorNetworkBadge'
import ServerPulseBadge from './ServerPulseBadge'
import MusicPlayer from './MusicPlayer'
import { MUSIC_TRACKS, musicAvailable, trackSrc } from '../data/music'

const NAV_LINKS = [
  { label: 'Home', to: '/', end: true },
  // 博客已迁到同仓 blog/ 子站的 Astro Firefly，走外部链接
  { label: '文章', to: `${import.meta.env.BASE_URL}blog/`, external: true },
  { label: '关于我', to: '/about' },
  { label: '神谕', to: '/glimmer' },
  { label: '来源', to: '/sources' },
]

/**
 * 浮动胶囊导航。
 * - 向下滚动隐藏 / 向上滚动显出
 * - 仅在首页顶部显示「Switch Cover」入口与访客网络徽章
 * - 音乐入口打开唱机面板（MusicPlayer）。旧版写死的 <audio src="/loop.mp3"> 已移除 ——
 *   那个文件从不存在，且绝对路径在子路径部署下必 404。
 *
 * 音乐入口的显隐分两层判断，缺一不可：
 *   1. 编译期：清单是否为空（清单在仓库里，编译期就能判）
 *   2. 运行期：音频文件是否真的可取到（.gitignore 把 public/music/* 挡在仓库外，
 *      所以公开站点上清单非空但文件 404 —— 只判第 1 层就会留下一个点了没反应的死按钮）
 */
const HAS_MUSIC = musicAvailable()

export default function Navbar() {
  const { pathname } = useLocation()
  const [hidden, setHidden] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [playerOpen, setPlayerOpen] = useState(false)
  const [playing, setPlaying] = useState(false)
  // 初值为 false：宁可晚 100ms 出现，也不要先冒出来再消失
  const [musicReady, setMusicReady] = useState(false)
  const lastY = useRef(0)

  /* 运行期探测：第一首取不到就把整条音乐线收起来 */
  useEffect(() => {
    if (!HAS_MUSIC) return undefined
    const first = MUSIC_TRACKS[0]
    if (!first) return undefined
    let alive = true
    const probe = typeof fetch === 'function' ? fetch : null
    if (!probe) {
      // 没有 fetch 的环境（老浏览器/测试替身）不阻断功能，直接当作可用
      setMusicReady(true)
      return undefined
    }
    probe(trackSrc(first), { method: 'HEAD' })
      .then((res) => {
        if (!alive) return
        // 不能只看 res.ok：缺失的资源在 SPA 站点上会被回退成 index.html 并返回 200。
        // 判据是「返回的不是 HTML 页面」。真实 mp3 是 audio/mpeg，不会命中这条。
        const type = res?.headers?.get?.('content-type') || ''
        setMusicReady(Boolean(res && res.ok) && !/text\/html/i.test(type))
      })
      .catch(() => {
        if (alive) setMusicReady(false)
      })
    return () => {
      alive = false
    }
  }, [])

  useEffect(() => {
    lastY.current = window.scrollY
    const onScroll = () => {
      const y = window.scrollY
      setScrolled(y > 8)
      setHidden(y > lastY.current && y > 140)
      lastY.current = y
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    setDrawerOpen(false)
  }, [pathname])

  /* 键盘可达性：Esc 关闭移动抽屉 */
  useEffect(() => {
    if (!drawerOpen) return undefined
    const onKeyDown = (e) => {
      if (e.key === 'Escape') setDrawerOpen(false)
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [drawerOpen])

  useEffect(() => {
    if (drawerOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [drawerOpen])

  const openCoverSelector = useCallback(() => {
    window.dispatchEvent(new Event('showHeroPreview'))
  }, [])

  const isHome = pathname === '/'
  const isActive = (item) =>
    item.end ? pathname === item.to : pathname.startsWith(item.to)

  return (
    <>
      <header
        className={`fixed inset-x-0 top-3 z-50 transition-all duration-700 ease-expo-out md:inset-x-6 ${
          hidden ? '-translate-y-24 opacity-0' : 'translate-y-0 opacity-100'
        }`}
      >
        <nav className="floating-nav mx-auto flex h-14 max-w-shell items-center justify-between gap-3 px-3 md:h-16 md:px-5">
          {/* 左：标记 + 封面切换入口 + 访客徽章 */}
          <div className="flex min-w-0 items-center gap-3">
            <Link
              to="/"
              aria-label="回到首页"
              className="grid h-9 w-9 shrink-0 place-items-center rounded-lg border border-white/10 bg-gradient-to-br from-neon-violet/30 to-neon-lime/10 transition-shadow duration-500 hover:shadow-glow-violet"
            >
              <span className="font-mono text-xs font-bold text-neon-lime">牧</span>
            </Link>

            {isHome && !scrolled ? (
              <>
                <button type="button" onClick={openCoverSelector} className="nav-hover-btn hidden md:block">
                  Switch Cover
                </button>
                <ServerPulseBadge className="hidden xl:inline-flex" />
                <VisitorNetworkBadge className="hidden lg:inline-flex" />
              </>
            ) : null}
          </div>

          {/* 右：导航 + 音乐 + 汉堡 */}
          <div className="flex min-w-0 items-center gap-3 md:gap-6">
            <div className="hidden items-center gap-6 md:flex">
              {NAV_LINKS.map((item) =>
                item.external ? (
                  <a key={item.to} href={item.to} className="nav-hover-btn">
                    {item.label}
                  </a>
                ) : (
                  <Link
                    key={item.to}
                    to={item.to}
                    className={`nav-hover-btn ${isActive(item) ? 'text-white' : ''}`}
                  >
                    {item.label}
                  </Link>
                ),
              )}
            </div>

            {HAS_MUSIC && musicReady ? (
              <button
                type="button"
                onClick={() => setPlayerOpen(true)}
                aria-label="打开唱片机"
                className="flex shrink-0 items-center gap-1 px-1 py-2"
              >
                <Music className={`h-3.5 w-3.5 transition-colors duration-300 ${playing ? 'text-neon-lime' : 'text-slate-500'}`} />
                {[1, 2, 3, 4].map((bar) => (
                  <span
                    key={bar}
                    className={`indicator-line ${playing ? 'active' : ''}`}
                    style={{ animationDelay: `${bar * 0.1}s` }}
                  />
                ))}
              </button>
            ) : null}

            <button
              type="button"
              onClick={() => setDrawerOpen(true)}
              aria-label="打开导航菜单"
              className="p-2 text-slate-400 transition-colors duration-300 hover:text-white md:hidden"
            >
              <Menu className="h-5 w-5" />
            </button>
          </div>
        </nav>
      </header>

      {/* 移动抽屉 */}
      <div
        aria-hidden={!drawerOpen}
        className={`fixed inset-0 z-[60] md:hidden ${drawerOpen ? '' : 'pointer-events-none'}`}
      >
        <div
          className={`absolute inset-0 bg-void-950/80 backdrop-blur-sm transition-opacity duration-300 ${
            drawerOpen ? 'opacity-100' : 'opacity-0'
          }`}
          onClick={() => setDrawerOpen(false)}
        />
        <div
          role="dialog"
          aria-modal="true"
          aria-label="站点导航"
          className={`absolute right-0 top-0 h-full w-[78%] max-w-sm border-l border-white/10 bg-void-900/95 px-6 py-6 backdrop-blur-xl transition-transform duration-300 ease-expo-out ${
            drawerOpen ? 'translate-x-0' : 'translate-x-full'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="font-mono text-[11px] uppercase tracking-[0.3em] text-slate-500">菜单</span>
            <button
              type="button"
              onClick={() => setDrawerOpen(false)}
              aria-label="关闭菜单"
              className="p-2 text-slate-400 hover:text-white"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <nav className="mt-8 flex flex-col">
            {NAV_LINKS.map((item) =>
              item.external ? (
                <a
                  key={item.to}
                  href={item.to}
                  className="border-b border-white/[0.06] py-4 text-sm text-slate-300 transition-colors duration-300 hover:text-white"
                >
                  {item.label}
                </a>
              ) : (
                <Link
                  key={item.to}
                  to={item.to}
                  className={`border-b border-white/[0.06] py-4 text-sm transition-colors duration-300 ${
                    isActive(item) ? 'text-neon-lime' : 'text-slate-300 hover:text-white'
                  }`}
                >
                  {item.label}
                </Link>
              ),
            )}
            <Link
              to="/guestbook"
              className="border-b border-white/[0.06] py-4 text-sm text-slate-300 transition-colors duration-300 hover:text-white"
            >
              留言板
            </Link>
          </nav>
        </div>
      </div>

      {HAS_MUSIC && musicReady ? (
        <MusicPlayer
          open={playerOpen}
          onClose={() => setPlayerOpen(false)}
          onPlayingChange={setPlaying}
        />
      ) : null}
    </>
  )
}
