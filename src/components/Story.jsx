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
    <section id="story" ref={ref} data-bg-scene="home-story" className="relative py-24 lg:py-36">
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
              className={`relative overflow-hidden rounded-b-2xl border border-white/[0.08] bg-transparent px-7 py-10 md:px-12 md:py-14 ${
                open ? 'story-envelope-cta--open' : 'opacity-0'
              }`}
            >
              <div className="pointer-events-none absolute inset-0 bg-noise opacity-[0.04] mix-blend-overlay" />

              <div className="relative">
                <p className="font-mono text-[10px] uppercase tracking-[0.42em] text-neon-lime/70">
                  From the desk of
                </p>
                <p className="mt-4 text-sm text-slate-400">致点开这个站的人：</p>

                <span
                  aria-hidden
                  className="mt-7 block h-px w-16 bg-gradient-to-r from-neon-lime/80 to-transparent"
                />
                <h2
                  id="story-heading"
                  className="mt-5 font-serif italic leading-[1.06] tracking-[-0.015em]"
                >
                  <span className="block text-[clamp(0.95rem,1.7vw,1.2rem)] font-normal not-italic text-white/55">
                    In case I don&rsquo;t see ya,
                  </span>
                  <span className="mt-3 block bg-gradient-to-r from-neon-lime via-neon-mint to-white bg-clip-text text-[clamp(1.7rem,3.9vw,3rem)] font-semibold text-transparent">
                    good afternoon,
                  </span>
                  <span className="block bg-gradient-to-r from-neon-mint via-white to-neon-lime bg-clip-text text-[clamp(1.7rem,3.9vw,3rem)] font-semibold text-transparent">
                    good evening,
                  </span>
                  <span className="block bg-gradient-to-r from-white via-neon-violet to-neon-mint bg-clip-text text-[clamp(1.7rem,3.9vw,3rem)] font-semibold text-transparent">
                    and good night!
                  </span>
                </h2>

                <div className="mt-9 flex flex-wrap items-center gap-4">
                  <Link
                    to="/about"
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
