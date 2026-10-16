import { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import { WALLPAPERS } from '../lib/wallpapers'

const MIN_DURATION = 900
const OPEN_DELAY = 550
const IMG_TIMEOUT = 3500

/** 换开屏照片：改这里（壁纸清单见 src/lib/wallpapers.js，也可以填任意 URL） */
const HOME_PHOTO = WALLPAPERS[0].scene.image

/** 照片就绪 or 超时都算完成；失败/超时走纯色渐变降级，不阻塞开门 */
const preloadPhoto = (src, onDone) => {
  if (typeof window === 'undefined' || typeof Image === 'undefined') {
    onDone(false)
    return () => {}
  }
  const img = new Image()
  let settled = false
  const settle = (ok) => {
    if (settled) return
    settled = true
    onDone(ok)
  }
  const timer = window.setTimeout(() => settle(false), IMG_TIMEOUT)
  img.onload = () => {
    window.clearTimeout(timer)
    settle(true)
  }
  img.onerror = () => {
    window.clearTimeout(timer)
    settle(false)
  }
  img.src = src
  return () => {
    window.clearTimeout(timer)
  }
}

/**
 * 照片双开门开屏：一整张照片从中间分开，滑出露出首页。
 * - 进度 = min(时间节奏, 照片就绪度)：照片没到门不开，但 3.5s 封顶，弱网不卡死
 * - 每天最多播一次（跨会话生效）；URL 带 ?intro 强制播放；prefers-reduced-motion 直接跳过
 */
const introSeenToday = () => {
  try {
    return localStorage.getItem('introSeenDate') === new Date().toDateString()
  } catch {
    return false
  }
}
const markIntroSeen = () => {
  try {
    localStorage.setItem('introSeenDate', new Date().toDateString())
  } catch {
    /* 隐私模式下写入失败，忽略 */
  }
}

export default function HomeIntro() {
  const [phase, setPhase] = useState(() => {
    // ?intro 旁路：强制播放，方便预览调试
    try {
      if (new URLSearchParams(window.location.search).has('intro')) return 'run'
    } catch {
      /* ignore */
    }
    return introSeenToday() ? 'done' : 'run'
  }) // run | open | done
  const [progress, setProgress] = useState(0)
  const [photoReady, setPhotoReady] = useState(false)

  useEffect(() => {
    const reduce =
      typeof window.matchMedia === 'function' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches

    const forced = (() => {
      try {
        return new URLSearchParams(window.location.search).has('intro')
      } catch {
        return false
      }
    })()

    if (reduce || (introSeenToday() && !forced)) {
      setPhase('done')
      return undefined
    }

    markIntroSeen()

    let raf = 0
    let openTimer = 0
    let loadDone = false
    const cancelPreload = preloadPhoto(HOME_PHOTO, (ok) => {
      loadDone = true
      setPhotoReady(ok)
    })

    const startedAt = Date.now()
    const tick = () => {
      const timed = Math.min(1, (Date.now() - startedAt) / MIN_DURATION)
      const ratio = loadDone ? timed : timed * 0.82 // 照片未就绪时进度压着不开满
      setProgress(ratio)
      if (timed >= 1 && loadDone) {
        openTimer = window.setTimeout(() => setPhase('open'), OPEN_DELAY)
        return
      }
      raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)

    return () => {
      cancelAnimationFrame(raf)
      window.clearTimeout(openTimer)
      cancelPreload()
    }
  }, [])

  useEffect(() => {
    if (phase !== 'open') return undefined
    const timer = window.setTimeout(() => setPhase('done'), 1000)
    return () => window.clearTimeout(timer)
  }, [phase])

  if (phase === 'done') return null

  const open = phase === 'open'

  // 关键：backgroundSize 用整屏尺寸（非 cover），左右门各显示照片的左/右半，
  // 合起来才是一张完整的照片——「打开照片」的感觉全靠这个
  const photoLayer = photoReady
    ? {
        backgroundImage: `url(${HOME_PHOTO})`,
        backgroundSize: '100vw 100vh',
        backgroundRepeat: 'no-repeat',
      }
    : { background: 'linear-gradient(150deg, #101728 0%, #04060f 100%)' }

  const doorBase =
    'absolute inset-y-0 w-[51%] overflow-hidden transition-transform duration-[950ms] ease-expo-in-out'
  // 亮色照片上压一层暗纱，保证品牌字可读
  const scrim =
    'absolute inset-0 bg-gradient-to-r from-void-950/75 via-void-950/50 to-void-950/75'

  return createPortal(
    <div className="fixed inset-0 z-[200]" aria-hidden={open}>
      {/* 左半门：照片左半 */}
      <div
        className={`${doorBase} left-0 ${open ? '-translate-x-full' : 'translate-x-0'}`}
        style={{ ...photoLayer, backgroundPosition: 'left center' }}
      >
        <div className={scrim} />
      </div>
      {/* 右半门：照片右半 */}
      <div
        className={`${doorBase} right-0 ${open ? 'translate-x-full' : 'translate-x-0'}`}
        style={{ ...photoLayer, backgroundPosition: 'right center' }}
      >
        <div className={scrim} />
      </div>

      {/* 品牌层 */}
      <div
        className={`absolute inset-0 grid place-items-center transition-opacity duration-300 ${
          open ? 'opacity-0' : 'opacity-100'
        }`}
      >
        <div className="flex w-[min(78vw,320px)] flex-col items-center">
          <span className="neon-text font-mono text-3xl font-bold text-neon-lime">牧</span>
          <span className="mt-4 font-mono text-[10px] uppercase tracking-[0.32em] text-slate-500">
            年下牧马
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
