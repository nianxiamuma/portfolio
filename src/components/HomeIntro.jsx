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
const SLIDE = 1000 // 两扇门板滑开的时间（ms），与下面 duration-[1000ms] 保持一致
const EXIT = 1900 // 门滑完（约 1.0s）后再停留约 0.9s 才卸载开场层；总时长从 5.3s 压到 ~4.1s

/** 部署基路径；字符串资源路径必须手动拼，Vite 不会改写字符串 */
const BASE = import.meta.env.BASE_URL

/**
 * 铃芽之门（2026-10-18 第二次重做）：
 * 门不再是盖住整屏的深色挡板，而是立在场景里的一扇真门——
 * 门框 + 两扇门板 + 门后的常世，开门时门板向两侧滑开、露出门内的星空。
 *
 * 素材来自 Steam 创意工坊壁纸 2953775561 的 scene.pkg（RePKG 解包后按层导出）：
 * - `suzume-door-frame.png`：门框（3840×2160 透明 PNG，只有中央一圈框线，opaque 0.7%）
 * - `suzume-door-panel.png`：单扇门板（270×579，原素材「门门」）
 * - `suzume-afterworld.jpg`：门后的常世（1205×2462 竖幅，缩到 960 宽）
 *
 * `DOOR` 是从门框 alpha 通道的 bbox 实测换算的百分比（3840×2160 下
 * x 1560–2279、y 1005–1652）：三个图层都放进同一个 16:9 对齐层里，
 * 任何视口下都按同一套 cover 裁切，门框、门洞、门板不会错位。
 */
const DOOR = { left: 40.62, top: 46.53, width: 18.72, height: 29.95 }
const ASSET = {
  frame: `${BASE}wallpapers/suzume-door-frame.png`,
  panel: `${BASE}wallpapers/suzume-door-panel.png`,
  afterworld: `${BASE}wallpapers/suzume-afterworld.jpg`,
}

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
  const slide = 'transition-transform duration-[1000ms] ease-expo-in-out'

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

      {/* ── 铃芽之门：门洞（常世）→ 两扇门板 → 门框，三层同处一个 16:9 对齐层 ── */}
      <div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
        style={{ width: 'max(100vw, 177.78vh)', aspectRatio: '16 / 9' }}
      >
        {/* 门洞：门板滑开后露出来的常世 */}
        <div
          data-testid="intro-doorway"
          className="absolute overflow-hidden"
          style={{
            left: `${DOOR.left}%`,
            top: `${DOOR.top}%`,
            width: `${DOOR.width}%`,
            height: `${DOOR.height}%`,
          }}
        >
          <img src={ASSET.afterworld} alt="" className="absolute inset-0 h-full w-full object-cover" />
          {/* 常世的光：开门那一刻才亮 */}
          <div
            className={`absolute inset-0 bg-[radial-gradient(circle_at_50%_42%,rgba(208,235,255,0.6),transparent_68%)] transition-opacity duration-[1000ms] ${
              open ? 'opacity-100' : 'opacity-0'
            }`}
          />
          {/* 两扇门板：从中间向两侧滑开，滑出即被门洞裁掉 */}
          <div
            data-testid="intro-door-left"
            className={`absolute inset-y-0 left-0 w-1/2 ${slide} ${
              open ? '-translate-x-full' : 'translate-x-0'
            }`}
          >
            <img src={ASSET.panel} alt="" className="h-full w-full object-fill" />
          </div>
          <div
            data-testid="intro-door-right"
            className={`absolute inset-y-0 right-0 w-1/2 ${slide} ${
              open ? 'translate-x-full' : 'translate-x-0'
            }`}
          >
            <img src={ASSET.panel} alt="" className="h-full w-full object-fill" />
          </div>
          {/* 门缝：关门时中间那一条暗线 */}
          <div
            className={`absolute inset-y-0 left-1/2 w-px -translate-x-1/2 bg-white/20 transition-opacity duration-300 ${
              open ? 'opacity-0' : 'opacity-100'
            }`}
          />
        </div>

        {/* 门框：盖在门板之上，滑出的门板从框后消失 */}
        <img
          src={ASSET.frame}
          alt=""
          className="pointer-events-none absolute inset-0 h-full w-full object-cover"
        />
      </div>

      {/* ── 门上的品牌层：进度走完就淡出，别挡开门 ── */}
      <div
        className={`pointer-events-none absolute inset-x-0 top-[13vh] flex justify-center transition-opacity duration-300 ${
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
