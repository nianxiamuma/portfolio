import { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import { getMonthCover, monthlyCoverIndex } from '../lib/wallpapers'

/**
 * 开场：人物站在场景里不动，两扇门从两侧滑开露出她。
 *
 * 和上一版的区别（2026-10-18 重做）：
 * 1. 上一版是把一张照片切成左右两半各贴一扇门，开门时照片跟着裂开——人物会被从中间剖开。
 *    现在底层是完整的一幅画（场景图 + 当月立绘），门是两扇独立的深色挡板，滑开只是让开视线。
 * 2. 上一版「每天最多播一次」（写 localStorage），用户当天第二次刷新就再也看不到，
 *    表现就是「开场动画没有展示」。现在每次进入都播，`?nointro` 可跳过（调试/截图用）。
 * 3. 素材从本月方案取：场景图 + 立绘与首屏同一个人，开门之后接得上。
 */
const HOLD = 1100 // 进度条走满的时间（ms）
const OPEN_DELAY = 420 // 走满后停顿再开门
const EXIT = 1000 // 门滑完的时间，与下面 duration-[1000ms] 保持一致

export default function HomeIntro() {
  const [phase, setPhase] = useState(() => {
    try {
      const params = new URLSearchParams(window.location.search)
      if (params.has('nointro')) return 'done'
      // ?introopen 直接把门设成开启状态：headless 截图时 rAF/Date.now 不推进，
      // 否则永远只能拍到 0% 的关门画面，开门效果没法验证
      if (params.has('introopen')) return 'open'
    } catch {
      /* ignore */
    }
    return 'run'
  }) // run | open | done
  const [progress, setProgress] = useState(0)

  const cover = getMonthCover(monthlyCoverIndex())

  useEffect(() => {
    if (phase !== 'run') return undefined
    const reduce =
      typeof window.matchMedia === 'function' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduce) {
      setPhase('done')
      return undefined
    }

    const startedAt = Date.now()
    let raf = 0
    let openTimer = 0
    const tick = () => {
      const ratio = Math.min(1, (Date.now() - startedAt) / HOLD)
      setProgress(ratio)
      if (ratio >= 1) {
        openTimer = window.setTimeout(() => setPhase('open'), OPEN_DELAY)
        return
      }
      raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)

    return () => {
      cancelAnimationFrame(raf)
      window.clearTimeout(openTimer)
    }
  }, [phase])

  // ?introopen 时冻结在「门已开」的状态，不自动卸载——否则截图/调试只能拍到首屏
  const frozen = (() => {
    try {
      return new URLSearchParams(window.location.search).has('introopen')
    } catch {
      return false
    }
  })()

  useEffect(() => {
    if (phase !== 'open' || frozen) return undefined
    const timer = window.setTimeout(() => setPhase('done'), EXIT)
    return () => window.clearTimeout(timer)
  }, [phase, frozen])

  if (phase === 'done') return null

  const open = phase === 'open'
  const doorBase =
    'absolute inset-y-0 w-1/2 overflow-hidden bg-[#070a12] transition-transform duration-[1000ms] ease-expo-in-out'
  const grid = 'absolute inset-0 bg-grid-faint [background-size:64px_64px] opacity-[0.18]'

  return createPortal(
    <div className="fixed inset-0 z-[200]" aria-hidden={open}>
      {/* ── 底层：一幅完整的画，门打开后看到的就是它 ── */}
      <div className="absolute inset-0 overflow-hidden">
        <img
          src={cover.scene?.image}
          alt=""
          className="h-full w-full scale-[1.04] object-cover"
        />
        <div className="absolute inset-0" style={{ background: cover.theme.overlay }} />
        {/* 立场：与首屏 Hero 完全对齐（left-74% / -bottom-4% / h-97%），
            这样门滑开的那一刻和门后的首屏严丝合缝，人物不会"跳"一下 */}
        <div
          className="absolute -bottom-[4%] left-[74%] hidden h-[97%] -translate-x-1/2 md:block"
          style={{
            maskImage: 'linear-gradient(to bottom, #000 82%, transparent 98%)',
            WebkitMaskImage: 'linear-gradient(to bottom, #000 82%, transparent 98%)',
          }}
        >
          <img src={cover.portrait} alt="" className="h-full w-auto object-contain" />
        </div>
        {/* 光：从人物背后打过来的柔光，避免人物像抠图 */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              'radial-gradient(ellipse 45% 55% at 70% 55%, rgba(140,180,255,0.16), transparent 70%)',
          }}
        />
      </div>

      {/* ── 两扇门 ── */}
      <div className={`${doorBase} left-0 ${open ? '-translate-x-full' : 'translate-x-0'}`}>
        <div className={grid} />
        <div className="absolute inset-y-0 right-0 w-px bg-white/[0.09]" />
      </div>
      <div className={`${doorBase} right-0 ${open ? 'translate-x-full' : 'translate-x-0'}`}>
        <div className={grid} />
        <div className="absolute inset-y-0 left-0 w-px bg-white/[0.09]" />
      </div>

      {/* ── 门上的品牌层：进度走完就淡出，别挡开门 ── */}
      <div
        className={`pointer-events-none absolute inset-0 grid place-items-center transition-opacity duration-300 ${
          open ? 'opacity-0' : 'opacity-100'
        }`}
      >
        <div className="flex w-[min(72vw,300px)] flex-col items-center">
          <span className="neon-text font-mono text-3xl font-bold text-neon-lime">牧</span>
          <span className="mt-4 font-mono text-[10px] uppercase tracking-[0.32em] text-slate-500">
            年下牧马 · {cover.name} · {cover.character}
          </span>

          <div className="mt-8 h-px w-full bg-white/10">
            <div
              className="h-px bg-gradient-to-r from-neon-violet to-neon-lime transition-[width] duration-150 ease-linear"
              style={{ width: `${Math.round(progress * 100)}%` }}
            />
          </div>

          <span className="mt-3 font-mono text-[10px] tracking-[0.28em] text-slate-600">
            {String(Math.round(progress * 100)).padStart(3, '0')}%
          </span>
        </div>
      </div>
    </div>,
    document.body,
  )
}
