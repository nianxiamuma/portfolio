import { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import { getMonthCover, monthlyCoverIndex } from '../lib/wallpapers'

/**
 * 开场：人物站在场景里不动，两扇门从两侧滑开露出她。
 *
 * 和上一版的区别（2026-10-18 重做）：
 * 1. 上一版是把一张照片切成左右两半各贴一扇门，开门时照片跟着裂开——人物会被从中间剖开。
 *    现在底层是完整的一幅画（场景图 + 当月立绘），门是两扇独立的门板，滑开只是让开视线。
 * 2. 上一版「每天最多播一次」（写 localStorage），用户当天第二次刷新就再也看不到，
 *    表现就是「开场动画没有展示」。现在每次进入都播，`?nointro` 可跳过（调试/截图用）。
 * 3. 素材从本月方案取：场景图 + 立绘与首屏同一个人，开门之后接得上。
 */
const HOLD = 1100 // 进度条走满的时间（ms）
const OPEN_DELAY = 420 // 走满后停顿再开门
const SLIDE = 1000 // 两扇门板滑开的时间（ms），与下面 duration-[1000ms] 保持一致
const EXIT = 1900 // 门滑完（约 1.0s）后再停留约 0.9s 才开始淡出
const FADE = 520 // 淡出时长（ms），与 duration-500 一致；淡完才卸载开场层

/** 部署基路径；字符串资源路径必须手动拼，Vite 不会改写字符串 */
const BASE = import.meta.env.BASE_URL

/**
 * 铃芽之门（2026-10-18 第二次重做，10-18 晚放大）：
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
/**
 * 门洞中心在层里的纵向位置：46.53 + 29.95/2 = 61.5%，不在层的正中间。
 * 层按 50% 居中的话，放大后门洞会整个偏到屏幕上半部分，所以居中时要多上移这一段。
 */
const DOOR_CENTER_Y = DOOR.top + DOOR.height / 2

/**
 * 门洞要「盖住」视口，对齐层就得放大到门洞宽高都 ≥ 视口（用户反馈：门太小，盖不住屏）。
 * 门洞宽是层宽的 18.72%，层是 16:9，所以门洞宽 = 18.72% × 层宽 = 33.28% × 层高；
 * 门洞高是层高的 29.95%。两条约束取大值 → 层高 = max(300.5vw, 333.9vh)。
 *
 * COVER < 1 是留边：0.94 时门洞正好 94vw 宽、135vh 高（16:9 视口），
 * 左右各剩 3% 给门框立柱——门基本铺满屏幕，但还看得出「站在门框里」。
 */
const DOOR_COVER = 0.94
const DOOR_HOLE_W_RATIO = (DOOR.width / 100) * (16 / 9) // 门洞宽 / 层高
const DOOR_HOLE_H_RATIO = DOOR.height / 100 // 门洞高 / 层高

/** 对齐层的尺寸（vw/vh 表达式）：让门洞 cover 视口，纯 CSS 算，不依赖 JS 量视口 */
export const doorLayerSize = () => ({
  height: `max(${((DOOR_COVER / DOOR_HOLE_W_RATIO) * 100).toFixed(2)}vw, ${(
    (DOOR_COVER / DOOR_HOLE_H_RATIO) *
    100
  ).toFixed(2)}vh)`,
})

/**
 * 同一套几何的纯函数版：给定视口像素，返回门洞在屏幕上的像素尺寸。
 * 组件里用 CSS 表达，测试用这个锁住「门洞 ≥ COVER × 视口」的不变量。
 */
export function doorHolePx(vw, vh) {
  const layerH = Math.max(
    (vw * DOOR_COVER) / DOOR_HOLE_W_RATIO,
    (vh * DOOR_COVER) / DOOR_HOLE_H_RATIO,
  )
  return { width: layerH * DOOR_HOLE_W_RATIO, height: layerH * DOOR_HOLE_H_RATIO }
}

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
  }) // run | open | leaving | done
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

  // 门滑完再停留一段，然后淡出——门后是常世星空，直接卸载会硬切成首屏
  useEffect(() => {
    if (phase !== 'open' || frozen) return undefined
    const timer = window.setTimeout(() => setPhase('leaving'), EXIT)
    return () => window.clearTimeout(timer)
  }, [phase, frozen])

  useEffect(() => {
    if (phase !== 'leaving') return undefined
    const timer = window.setTimeout(() => setPhase('done'), FADE)
    return () => window.clearTimeout(timer)
  }, [phase])

  if (phase === 'done') return null

  const open = phase !== 'run'
  const leaving = phase === 'leaving'
  const slide = 'transition-transform duration-[1000ms] ease-expo-in-out'

  return createPortal(
    <div
      data-testid="intro-layer"
      className={`fixed inset-0 z-[200] transition-opacity duration-500 ease-out ${
        leaving ? 'opacity-0' : 'opacity-100'
      }`}
      aria-hidden={open}
    >
      {/* ── 底层：一幅完整的画，门打开后看到的就是它 ── */}
      <div className="absolute inset-0 overflow-hidden">
        <img
          src={cover.scene?.image}
          alt=""
          className="h-full w-full scale-[1.04] object-cover"
        />
        <div className="absolute inset-0" style={{ background: cover.theme.overlay }} />
        {/* 立场：与首屏 Hero 完全对齐（left-74% / -bottom-4% / h-97%），
            这样门滑开、开场层淡出之后和首屏严丝合缝，人物不会"跳"一下 */}
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

      {/* ── 铃芽之门：门洞（常世）→ 两扇门板 → 门框，三层同处一个 16:9 对齐层 ──
          对齐层放大到门洞盖住视口（见 DOOR_COVER 注释），并把门洞中心拉回屏幕中心 */}
      <div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-1/2"
        style={{
          ...doorLayerSize(),
          aspectRatio: '16 / 9',
          transform: `translate(-50%, calc(-50% - ${(DOOR_CENTER_Y - 50).toFixed(2)}%))`,
        }}
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
          {/* 两扇门板：从中间向两侧滑开，滑出即被门洞裁掉。
              门板原素材是近白的门（rgb≈220），铺满整屏会是一片亮白，
              压到 0.45 亮度：门还是那道门，但夜景站点的霓虹字和进度条读得清 */}
          <div
            data-testid="intro-door-left"
            className={`absolute inset-y-0 left-0 w-1/2 ${slide} ${
              open ? '-translate-x-full' : 'translate-x-0'
            }`}
          >
            <img
              src={ASSET.panel}
              alt=""
              className="h-full w-full object-fill"
              style={{ filter: 'brightness(0.45)' }}
            />
          </div>
          <div
            data-testid="intro-door-right"
            className={`absolute inset-y-0 right-0 w-1/2 ${slide} ${
              open ? 'translate-x-full' : 'translate-x-0'
            }`}
          >
            <img
              src={ASSET.panel}
              alt=""
              className="h-full w-full object-fill"
              style={{ filter: 'brightness(0.45)' }}
            />
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
