import { useRef } from 'react'
import gsap from 'gsap'
import { useGSAP } from '@gsap/react'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { Mail, MapPin, CircleDot } from 'lucide-react'

gsap.registerPlugin(ScrollTrigger)

const FACTS = [
  { icon: MapPin, k: '坐标', v: '地球 · 某个角落' },
  { icon: CircleDot, k: '状态', v: '在线，但不太回消息' },
  { icon: Mail, k: '邮箱', v: '807273679@qq.com' },
]

/**
 * 明信片式滚动展开：一张圆角小窗卡片，随着滚动被补间到全屏
 * （pin + scrub），装饰层同步淡出、主视觉轻微缩放。
 */
export default function About() {
  const sectionRef = useRef(null)
  const cardRef = useRef(null)
  const decorRef = useRef(null)
  const artRef = useRef(null)

  useGSAP(() => {
    const mm = gsap.matchMedia()

    mm.add('(min-width: 1024px)', () => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top top',
          end: '+=120%',
          pin: true,
          scrub: 0.6,
        },
      })

      tl.fromTo(
        cardRef.current,
        { scale: 0.68, borderRadius: 30 },
        { scale: 1, borderRadius: 0, ease: 'none' },
        0,
      )
        .fromTo(decorRef.current, { opacity: 1 }, { opacity: 0, ease: 'none' }, 0)
        .fromTo(artRef.current, { scale: 1.08 }, { scale: 1, ease: 'none' }, 0)
    })

    return () => mm.revert()
  })

  return (
    <section
      id="about"
      ref={sectionRef}
      data-bg-scene="home-about"
      className="relative w-full overflow-hidden bg-void-950"
    >
      <div className="flex h-screen w-full items-center justify-center">
        <div
          ref={cardRef}
          className="relative h-screen w-full origin-center overflow-hidden border border-white/[0.07] bg-void-900 will-change-transform"
        >
          {/* 视觉主体 */}
          <div ref={artRef} className="absolute inset-0">
            <div className="absolute inset-0 bg-[linear-gradient(150deg,#101a33_0%,#0a0f1f_48%,#04060d_100%)]" />
            <div className="absolute -left-1/4 top-0 h-[60vw] w-[60vw] animate-drift-slow rounded-full bg-[radial-gradient(circle,rgba(124,92,255,0.3),transparent_62%)] blur-[100px]" />
            <div className="absolute -right-1/5 bottom-0 h-[52vw] w-[52vw] animate-drift-medium rounded-full bg-[radial-gradient(circle,rgba(237,255,102,0.14),transparent_62%)] blur-[110px]" />

            {/* 极简线稿人像 */}
            <div className="absolute inset-0 grid place-items-center">
              <svg viewBox="0 0 200 240" className="h-[62%] w-auto" fill="none" aria-hidden>
                <defs>
                  <linearGradient id="about-line" x1="0" y1="0" x2="1" y2="1">
                    <stop offset="0%" stopColor="#edff66" stopOpacity="0.9" />
                    <stop offset="100%" stopColor="#7c5cff" stopOpacity="0.35" />
                  </linearGradient>
                </defs>
                <circle
                  cx="100"
                  cy="88"
                  r="64"
                  stroke="url(#about-line)"
                  strokeWidth="0.8"
                  strokeDasharray="2 7"
                  opacity="0.45"
                />
                <circle cx="100" cy="88" r="44" fill="url(#about-line)" fillOpacity="0.05" />
                <path d="M24 240c0-42 34-76 76-76s76 34 76 76" fill="url(#about-line)" fillOpacity="0.05" />
                <circle cx="100" cy="88" r="44" stroke="url(#about-line)" strokeWidth="1.2" />
                <path
                  d="M24 240c0-42 34-76 76-76s76 34 76 76"
                  stroke="url(#about-line)"
                  strokeWidth="1.2"
                />
                <path
                  d="M100 24v14M100 138v14M36 88h14M150 88h14"
                  stroke="url(#about-line)"
                  strokeWidth="0.8"
                  opacity="0.6"
                />
              </svg>
            </div>

            <div className="absolute inset-0 bg-noise opacity-[0.05] mix-blend-overlay" />
            <div className="absolute inset-0 bg-grid-faint [background-size:64px_64px] opacity-30" />
            <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-void-950 via-void-950/70 to-transparent" />
          </div>

          {/* 装饰框（滚动后淡出） */}
          <div ref={decorRef} className="pointer-events-none absolute inset-0">
            <div className="absolute inset-5 rounded-2xl border border-white/[0.06]" />
            <div className="absolute left-8 top-8 flex items-center gap-3">
              <span className="h-px w-10 bg-neon-lime/60" />
              <span className="font-mono text-[10px] uppercase tracking-[0.42em] text-neon-lime/80">
                About
              </span>
            </div>
            <div className="absolute right-8 top-8 rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 font-mono text-[10px] uppercase tracking-[0.24em] text-slate-400">
              Est. 2026
            </div>
          </div>

          {/* 文案 */}
          <div className="relative flex h-full flex-col justify-end p-8 md:p-14">
            <h2 className="max-w-3xl text-[clamp(1.6rem,3.6vw,3rem)] font-bold leading-[1.14] tracking-tightest text-white">
              收藏，是把喜欢的东西
              <span className="bg-gradient-to-r from-neon-lime to-neon-mint bg-clip-text text-transparent">
                留在手边
              </span>
            </h2>

            <div className="mt-6 grid gap-6 md:grid-cols-[1.2fr_1fr] md:items-end">
              <p className="max-w-xl text-sm leading-relaxed text-slate-400">
                不太擅长介绍自己。白天和代码打交道，晚上和小说打交道，中间的空隙留给游戏。
                这里没有简历，也没有作品集——只是把喜欢的东西摆出来。
              </p>

              <dl className="divide-y divide-white/[0.07] border-y border-white/[0.07]">
                {FACTS.map((f) => (
                  <div key={f.k} className="flex items-center gap-4 py-3">
                    <f.icon className="h-3.5 w-3.5 shrink-0 text-neon-lime/70" />
                    <dt className="w-14 shrink-0 font-mono text-[10px] uppercase tracking-[0.24em] text-slate-600">
                      {f.k}
                    </dt>
                    <dd className="truncate text-xs text-slate-300">{f.v}</dd>
                  </div>
                ))}
              </dl>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
