import { useRef } from 'react'
import { ArrowUpRight } from 'lucide-react'
import { BENTO_TOOLS, FEATURED_TOOL } from '../data/tools'

/**
 * 鼠标跟随的轻微倾斜。
 * 直接改 DOM style，不走 setState —— 否则每次 mousemove 都会重渲染整棵子树
 * （这是首页滚动/移动时的主要掉帧来源之一）。
 */
function TiltCard({ children, className = '', intensity = 7 }) {
  const ref = useRef(null)
  const rafRef = useRef(0)

  const onMove = (e) => {
    const el = ref.current
    if (!el) return
    const { clientX, clientY } = e
    if (rafRef.current) return
    rafRef.current = requestAnimationFrame(() => {
      rafRef.current = 0
      const rect = el.getBoundingClientRect()
      const px = (clientX - rect.left) / rect.width - 0.5
      const py = (clientY - rect.top) / rect.height - 0.5
      el.style.transform = `perspective(1200px) rotateX(${py * -intensity}deg) rotateY(${px * intensity}deg)`
    })
  }

  const onLeave = () => {
    const el = ref.current
    if (!el) return
    el.style.transform = 'perspective(1200px) rotateX(0deg) rotateY(0deg)'
  }

  return (
    <div
      ref={ref}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      className={className}
      style={{ transition: 'transform 0.45s cubic-bezier(0.16, 1, 0.3, 1)' }}
    >
      {children}
    </div>
  )
}

export default function Features() {
  return (
    <section id="features" data-bg-scene="home-features" className="relative py-24 lg:py-36">
      <div className="mx-auto max-w-shell px-6 md:px-10 lg:px-16">
        {/* 标题 */}
        <header className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
          <div>
            <div className="flex items-center gap-4">
              <span className="font-mono text-[10px] tracking-[0.2em] text-neon-lime/70">04</span>
              <span className="h-px w-8 bg-white/15" />
              <span className="font-mono text-[10px] uppercase tracking-[0.42em] text-slate-500">
                Toolbox
              </span>
            </div>
            <h2 className="mt-6 text-[clamp(1.9rem,4vw,3.4rem)] font-bold leading-[1.06] tracking-tightest text-white">
              我常用的
              <span className="bg-gradient-to-r from-neon-lime to-neon-mint bg-clip-text text-transparent">
                AI 工具
              </span>
            </h2>
          </div>
          <p className="max-w-sm text-sm leading-relaxed text-slate-500">
            出图、找提示词、做分享页——这些是我翻得最多的几个站点。
          </p>
        </header>

        {/* 主展位 */}
        <a
          href={FEATURED_TOOL.url}
          target="_blank"
          rel="noopener noreferrer"
          className="group mt-16 block"
        >
          <TiltCard className="relative overflow-hidden rounded-3xl border border-white/[0.07] bg-void-900">
            <div
              className="pointer-events-none absolute -right-1/4 -top-1/3 h-[46vw] w-[46vw] rounded-full blur-[90px] opacity-60 transition-opacity duration-700 group-hover:opacity-90"
              style={{ background: `radial-gradient(circle, ${FEATURED_TOOL.accent}55, transparent 62%)` }}
            />
            <div className="absolute inset-0 bg-grid-faint [background-size:56px_56px] opacity-40" />

            {/* 扫光 */}
            <span className="pointer-events-none absolute inset-y-0 -left-1/3 w-1/3 -skew-x-12 bg-gradient-to-r from-transparent via-white/[0.07] to-transparent transition-transform duration-1000 ease-expo-out group-hover:translate-x-[420%]" />

            <div className="relative flex min-h-[19rem] flex-col justify-between gap-10 p-8 md:min-h-[23rem] md:p-12">
              <div className="flex items-start justify-between gap-6">
                <span
                  className="rounded-full border px-3 py-1 font-mono text-[10px] uppercase tracking-[0.24em]"
                  style={{ borderColor: `${FEATURED_TOOL.accent}66`, color: FEATURED_TOOL.accent }}
                >
                  {FEATURED_TOOL.tag}
                </span>
                <ArrowUpRight className="h-5 w-5 text-slate-500 transition-all duration-500 ease-expo-out group-hover:-translate-y-1 group-hover:translate-x-1 group-hover:text-white" />
              </div>

              <div>
                <h3 className="text-[clamp(1.6rem,3.4vw,3rem)] font-bold leading-tight tracking-tightest text-white">
                  {FEATURED_TOOL.name}
                </h3>
                <p className="mt-3 max-w-lg text-sm leading-relaxed text-slate-400">
                  {FEATURED_TOOL.desc}
                </p>
                <span className="mt-4 inline-block font-mono text-[11px] tracking-[0.14em] text-slate-600">
                  {FEATURED_TOOL.domain}
                </span>
              </div>
            </div>
          </TiltCard>
        </a>

        {/* Bento 网格 */}
        <div className="mt-5 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {BENTO_TOOLS.map((tool) => (
            <a
              key={tool.id}
              href={tool.url}
              target="_blank"
              rel="noopener noreferrer"
              className="group relative overflow-hidden rounded-2xl border border-white/[0.07] bg-white/[0.02] p-6 transition-all duration-500 ease-expo-out hover:border-white/[0.16] hover:bg-white/[0.04]"
            >
              <span
                className="pointer-events-none absolute -right-8 -top-8 h-24 w-24 rounded-full blur-2xl opacity-40 transition-opacity duration-500 group-hover:opacity-90"
                style={{ background: `radial-gradient(circle, ${tool.accent}66, transparent 68%)` }}
              />

              <div className="relative flex h-28 flex-col justify-between">
                <div className="flex items-start justify-between">
                  <span
                    className="h-2 w-2 rounded-full"
                    style={{ backgroundColor: tool.accent, boxShadow: `0 0 12px ${tool.accent}` }}
                  />
                  <ArrowUpRight className="h-4 w-4 text-slate-600 transition-all duration-500 ease-expo-out group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-white" />
                </div>

                <div>
                  <h3 className="text-base font-semibold text-white">{tool.name}</h3>
                  <p className="mt-1 line-clamp-2 text-xs leading-relaxed text-slate-500">
                    {tool.desc}
                  </p>
                </div>
              </div>
            </a>
          ))}

          {/* 补一格说明 */}
          <div className="relative flex flex-col justify-between overflow-hidden rounded-2xl border border-dashed border-white/[0.1] p-6">
            <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-slate-600">
              还有更多
            </span>
            <p className="text-xs leading-relaxed text-slate-500">
              收藏夹里还有一长串没摆出来，慢慢补。
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
