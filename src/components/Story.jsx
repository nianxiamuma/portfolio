import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'

/**
 * 信封区：滚动进入视口（阈值 0.35）后信封开启，内容淡入。
 * 只开不合——离开视口不回退，避免反复触发。
 */
export default function Story() {
  const ref = useRef(null)
  const [open, setOpen] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return undefined
    if (typeof IntersectionObserver === 'undefined') {
      setOpen(true)
      return undefined
    }

    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setOpen(true)
          io.disconnect()
        }
      },
      { threshold: 0.35, rootMargin: '0px 0px -10% 0px' },
    )
    io.observe(el)
    return () => io.disconnect()
  }, [])

  return (
    <section id="story" ref={ref} className="relative py-24 lg:py-36">
      <div className="mx-auto max-w-shell px-6 md:px-10 lg:px-16">
        <div className="relative flex justify-center">
          {/* 背光 */}
          <div
            className={`pointer-events-none absolute -inset-x-16 -top-10 bottom-0 rounded-[40px] bg-[radial-gradient(ellipse_60%_50%_at_50%_50%,rgba(124,92,255,0.14),transparent_70%)] blur-2xl transition-opacity duration-1000 ${
              open ? 'opacity-100' : 'opacity-0'
            }`}
          />

          <div className="relative w-full max-w-2xl">
            {/* 信封封盖 */}
            <div
              className={`relative mx-auto h-16 w-full origin-top transition-transform duration-[1200ms] ease-envelope`}
              style={{ perspective: '900px' }}
            >
              <div
                className={`h-full w-full border-x border-t border-white/[0.08] bg-gradient-to-b from-white/[0.06] to-transparent transition-transform duration-1000 ease-envelope ${
                  open ? '[transform:rotateX(-150deg)]' : '[transform:rotateX(0deg)]'
                }`}
                style={{ clipPath: 'polygon(0 0, 100% 0, 50% 100%)' }}
              />
            </div>

            <div
              className={`relative overflow-hidden rounded-b-2xl border border-white/[0.08] bg-void-900/80 px-7 py-10 backdrop-blur-sm md:px-12 md:py-14 ${
                open ? 'story-envelope-cta--open' : 'opacity-0'
              }`}
            >
              <div className="pointer-events-none absolute inset-0 bg-noise opacity-[0.04] mix-blend-overlay" />

              <div className="relative">
                <p className="font-mono text-[10px] uppercase tracking-[0.42em] text-neon-lime/70">
                  From the desk of
                </p>
                <p className="mt-4 text-sm text-slate-400">致点开这个站的人：</p>

                <h2
                  id="story-heading"
                  className="mt-6 text-[clamp(1.5rem,3vw,2.4rem)] font-bold leading-snug tracking-tightest text-white"
                >
                  这个站没什么宏大叙事，
                  <br />
                  只是不想让喜欢的东西散掉。
                </h2>

                <p className="mt-6 max-w-xl text-sm leading-[1.9] text-slate-400">
                  书架上的书、主机里的游戏、浏览器书签里那一长串工具站——
                  它们曾经在各自的时刻接住过我。把它们摆在一起，
                  算是给这些年一个可见的落点。
                </p>

                <div className="mt-8 flex flex-wrap items-center gap-4">
                  <Link
                    to="/collection"
                    className="group inline-flex items-center gap-2 rounded-full bg-white px-6 py-3 text-xs font-semibold text-void-950 transition-all duration-500 ease-expo-out hover:shadow-glow-lime"
                  >
                    去看看藏书与游戏
                    <ArrowRight className="h-3.5 w-3.5 transition-transform duration-500 ease-expo-out group-hover:translate-x-1" />
                  </Link>
                  <span className="font-mono text-[10px] uppercase tracking-[0.28em] text-slate-600">
                    年下牧马
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
