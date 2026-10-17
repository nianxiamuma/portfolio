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

/** 部署基路径；字符串资源路径必须手动拼，Vite 不会改写字符串 */
const BASE = import.meta.env.BASE_URL

/**
 * 第二段：浅色大字 + 大圆角插画卡（对标桃之夭夭那一段的版式）。
 *
 * 与上一版的差别：整段从暗色换成米白，标题从 3rem 放大到 9vw 的黑体，
 * 主视觉从线稿 SVG 换成一整张铃芽之旅的门（4K 素材，来自 Steam 创意工坊
 * 壁纸 2953775561 的 scene.pkg，用 RePKG 解包得到门前图层）。
 *
 * 暗色主站里插一整段米白，是有意的断层——用它把「首屏」和「收藏内容」分开。
 * 滚动时卡片从 0.64 放大到全屏（pin + scrub），和上一版同一套动画，只是换了皮。
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
        { scale: 0.64, borderRadius: 34 },
        { scale: 1, borderRadius: 0, ease: 'none' },
        0,
      )
        .fromTo(decorRef.current, { opacity: 1 }, { opacity: 0, ease: 'none' }, 0)
        .fromTo(artRef.current, { scale: 1.1 }, { scale: 1, ease: 'none' }, 0)
    })

    return () => mm.revert()
  })

  return (
    <section
      id="about"
      ref={sectionRef}
      data-bg-scene="home-about"
      className="relative w-full overflow-hidden bg-[#f2efe6] text-[#16181d]"
    >
      <div className="flex h-screen w-full items-center justify-center">
        <div
          ref={cardRef}
          className="relative h-screen w-full origin-center overflow-hidden bg-[#efece2] will-change-transform"
        >
          {/* 主视觉：铃芽之旅的门 */}
          <div ref={artRef} className="absolute inset-0">
            <img
              src={`${BASE}wallpapers/suzume-gate.jpg`}
              alt=""
              className="h-full w-full object-cover"
            />
            {/* 上下压一点，保证卡内白字可读 */}
            <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(10,14,22,0.42)_0%,rgba(10,14,22,0.06)_28%,rgba(10,14,22,0.1)_62%,rgba(10,14,22,0.72)_100%)]" />
          </div>

          {/* 卡内装饰框 + 段首大字：滚动放大时整层淡出，让卡片独自占满屏幕 */}
          <div ref={decorRef} className="pointer-events-none absolute inset-0 z-20">
            <div className="absolute inset-4 rounded-[26px] border border-white/25" />
            <div className="absolute left-7 top-6 flex items-center gap-3">
              <span className="font-mono text-[10px] uppercase tracking-[0.4em] text-white/85">
                Welcome to
              </span>
              <span className="font-mono text-[10px] tracking-[0.2em] text-white/60">年下牧马</span>
            </div>
            <div className="absolute right-7 top-6 font-mono text-[10px] uppercase tracking-[0.3em] text-white/70">
              No. 2026
            </div>
            <div className="absolute bottom-6 left-7 font-mono text-[10px] uppercase tracking-[0.4em] text-white/70">
              Scroll to immerse
            </div>

            {/* 段首大字：卡片缩小时露在卡片上方，卡片放大时跟着淡出 */}
            <div className="absolute inset-x-0 top-0 px-6 pt-8 md:pt-12">
              <div className="mx-auto max-w-shell text-center">
                <p className="font-mono text-[10px] uppercase tracking-[0.44em] text-[#16181d]/45">
                  Welcome to · 年下牧马
                </p>
                <h2 className="mt-4 text-[clamp(1.8rem,5.6vw,4.8rem)] font-black leading-[0.94] tracking-[-0.03em] text-[#16181d]">
                  FEEL FREE TO
                  <br />
                  KEEP SCROLLING DOWN
                </h2>
              </div>
            </div>
          </div>

          {/* 卡内文案 */}
          <div className="relative z-10 flex h-full flex-col justify-end p-8 md:p-14">
            <p className="max-w-2xl text-[clamp(1.1rem,1.8vw,1.5rem)] font-medium leading-[1.5] text-white">
              这里是我的收藏。书、游戏、写下来的东西，
              <br className="hidden md:block" />
              还有这些年在各处捡到的画面。
            </p>

            <dl className="mt-8 grid gap-x-8 gap-y-2 border-t border-white/25 pt-6 sm:grid-cols-3">
              {FACTS.map((f) => (
                <div key={f.k} className="flex items-center gap-3">
                  <f.icon className="h-3.5 w-3.5 shrink-0 text-white/70" />
                  <dt className="font-mono text-[10px] uppercase tracking-[0.24em] text-white/55">
                    {f.k}
                  </dt>
                  <dd className="truncate text-xs text-white/85">{f.v}</dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </div>

    </section>
  )
}
