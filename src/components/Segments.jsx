import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowUpRight } from 'lucide-react'

/**
 * 首页「片段」叙事段（结构对标 taozhiyy.top 的片段 01–06 bento 分区）。
 *
 * 与参照站的两个关键差异（反面教材的对立面）：
 * 1. 数据**单源**：SEGMENTS 数组一处定义编号↔文案↔路由↔配图，JSX 只 map
 *    —— 参照站 ARCHIVE_ITEMS 与网格内联数据两轨漂移（编号 05/06 映射互相矛盾）。
 * 2. 媒体用**壁纸静帧**：本站无视频资产（Pages 100MB 限制），参照站是 COS 视频。
 *
 * 入场动效复用 Story.jsx 的 IntersectionObserver 揭示模式：
 * 阈值 0.2，只揭示不回退，CSS transition（零新增常驻动画——fps 实测纪律）。
 */

const BASE = import.meta.env.BASE_URL
const sceneSrc = (file) => `${BASE}wallpapers/scene/${file}`

const SEGMENTS = [
  {
    index: '01',
    kind: 'wide',
    title: '这个站的门面',
    desc: '罗盘、壁纸、开场——第一眼看到的部分。',
    to: '/',
    image: 'scene-hero.jpg',
  },
  {
    index: '02',
    kind: 'text',
    title: '藏书与游戏',
    desc: '书架上的五本，主机里的世界。想到哪本放哪本。',
    to: '/collection',
  },
  {
    index: '03',
    kind: 'text',
    title: '浮光集',
    desc: '收进来的句子，按心情排布。',
    to: '/glimmer',
  },
  {
    index: '04',
    kind: 'visual',
    image: 'scene-glimmer.jpg',
  },
  {
    index: '05',
    kind: 'soon',
    title: 'More coming soon.',
    desc: '更多片段还在路上。',
  },
  {
    index: '06',
    kind: 'visual',
    image: 'scene-blog.jpg',
  },
]

/** IO 揭示 hook（与 Story 同模式：进入视口只触发一次） */
function useReveal() {
  const ref = useRef(null)
  const [shown, setShown] = useState(false)
  useEffect(() => {
    const el = ref.current
    if (!el) return undefined
    if (typeof IntersectionObserver === 'undefined') {
      setShown(true)
      return undefined
    }
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setShown(true)
          io.disconnect()
        }
      },
      { threshold: 0.2 },
    )
    io.observe(el)
    return () => io.disconnect()
  }, [])
  return [ref, shown]
}

function SegmentCard({ seg }) {
  const [ref, shown] = useReveal()
  const inner = (() => {
    if (seg.kind === 'text' || seg.kind === 'wide') {
      return (
        <>
          <div className="absolute inset-0 bg-grid-faint [background-size:48px_48px] opacity-30" />
          <div className="relative flex h-full flex-col justify-end p-7 md:p-9">
            <span className="font-mono text-[10px] uppercase tracking-[0.42em] text-neon-lime/70">
              片段 {seg.index}
            </span>
            <h3 className="mt-3 text-xl font-semibold tracking-tightest text-white md:text-2xl">
              {seg.title}
            </h3>
            <p className="mt-2 max-w-sm text-xs leading-relaxed text-slate-400">{seg.desc}</p>
            <span className="mt-5 inline-flex items-center gap-2 font-mono text-[11px] tracking-[0.14em] text-slate-500 transition-colors duration-300 group-hover:text-neon-lime">
              进入
              <ArrowUpRight className="h-3.5 w-3.5 transition-transform duration-500 ease-expo-out group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
            </span>
          </div>
        </>
      )
    }
    if (seg.kind === 'visual') {
      return (
        <>
          <img
            src={sceneSrc(seg.image)}
            alt=""
            loading="lazy"
            draggable={false}
            className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 ease-expo-out group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-void-950/80 via-transparent to-void-950/20" />
          <span className="absolute bottom-4 left-6 font-mono text-[10px] uppercase tracking-[0.42em] text-white/60">
            片段 {seg.index}
          </span>
        </>
      )
    }
    // soon：纯文字卡
    return (
      <div className="relative flex h-full flex-col items-start justify-center p-7 md:p-9">
        <span className="font-mono text-[10px] uppercase tracking-[0.42em] text-slate-600">
          片段 {seg.index}
        </span>
        <h3 className="mt-3 font-serif text-2xl font-semibold text-slate-300 md:text-3xl">
          {seg.title}
        </h3>
        <p className="mt-2 text-xs leading-relaxed text-slate-600">{seg.desc}</p>
      </div>
    )
  })()

  const shell =
    seg.kind === 'wide'
      ? 'group relative block min-h-[16rem] overflow-hidden rounded-3xl border border-white/[0.07] bg-void-900 md:min-h-[22rem]'
      : seg.kind === 'soon'
        ? 'group relative min-h-40 overflow-hidden rounded-2xl border border-dashed border-white/[0.12] bg-white/[0.01]'
        : seg.kind === 'visual'
          ? 'group relative min-h-40 overflow-hidden rounded-2xl border border-white/[0.07] bg-void-900'
          : 'group relative min-h-40 overflow-hidden rounded-2xl border border-white/[0.07] bg-void-900/70'

  const cls = `${shell} transition-all duration-700 ease-expo-out ${
    shown ? 'translate-y-0 opacity-100' : 'translate-y-6 opacity-0'
  }`

  return seg.to ? (
    <Link ref={ref} to={seg.to} data-testid={`segment-${seg.index}`} className={cls}>
      {inner}
    </Link>
  ) : (
    <div ref={ref} data-testid={`segment-${seg.index}`} className={cls}>
      {inner}
    </div>
  )
}

export default function Segments() {
  return (
    <section id="fragments" data-bg-scene="home-features" className="relative py-24 lg:py-36">
      <div className="mx-auto max-w-shell px-6 md:px-10 lg:px-16">
        {/* 段头 */}
        <header className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
          <div>
            <div className="flex items-center gap-4">
              <span className="font-mono text-[10px] tracking-[0.2em] text-neon-lime/70">05</span>
              <span className="h-px w-8 bg-white/15" />
              <span className="font-mono text-[10px] uppercase tracking-[0.42em] text-slate-500">
                Fragments
              </span>
            </div>
            <h2 className="mt-6 text-[clamp(1.9rem,4vw,3.4rem)] font-bold leading-[1.06] tracking-tightest text-white">
              散落的
              <span className="bg-gradient-to-r from-neon-lime to-neon-mint bg-clip-text text-transparent">
                片段
              </span>
            </h2>
          </div>
          <p className="max-w-sm text-sm leading-relaxed text-slate-500">
            把站里的各个角落拆开摆好，路过哪片就进去坐坐。
          </p>
        </header>

        {/* 片段 01：整宽卡 */}
        <div className="mt-14">
          <SegmentCard seg={SEGMENTS[0]} />
        </div>

        {/* 片段 02–06：bento 网格（lg 三行两列，移动单列） */}
        <div className="mt-5 grid gap-5 lg:grid-cols-2 lg:grid-rows-3">
          {SEGMENTS.slice(1).map((seg) => (
            <SegmentCard key={seg.index} seg={seg} />
          ))}
        </div>
      </div>
    </section>
  )
}
