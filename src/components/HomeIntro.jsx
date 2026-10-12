import { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'

const MIN_DURATION = 900
const OPEN_DELAY = 550

/**
 * 进入首页前的开场遮罩：进度条走满 → 分屏左右滑出 → 卸载。
 * prefers-reduced-motion 下直接跳过。
 */
export default function HomeIntro() {
  const [phase, setPhase] = useState('run') // run | open | done
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    const reduce =
      typeof window.matchMedia === 'function' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches

    // 同一次会话只看一次开场，刷新不再重复遮挡
    let seen = false
    try {
      seen = sessionStorage.getItem('introSeen') === '1'
    } catch {
      seen = false
    }

    if (reduce || seen) {
      setPhase('done')
      return undefined
    }

    try {
      sessionStorage.setItem('introSeen', '1')
    } catch {
      /* 隐私模式下写入失败，忽略 */
    }

    let raf = 0
    let openTimer = 0
    const startedAt = Date.now()

    const tick = () => {
      const ratio = Math.min(1, (Date.now() - startedAt) / MIN_DURATION)
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
  }, [])

  useEffect(() => {
    if (phase !== 'open') return undefined
    const timer = window.setTimeout(() => setPhase('done'), 1000)
    return () => window.clearTimeout(timer)
  }, [phase])

  if (phase === 'done') return null

  const open = phase === 'open'

  return createPortal(
    <div className="fixed inset-0 z-[200]" aria-hidden={open}>
      <div
        className={`absolute inset-y-0 left-0 w-[51%] bg-void-950 transition-transform duration-[950ms] ease-expo-in-out ${
          open ? '-translate-x-full' : 'translate-x-0'
        }`}
      />
      <div
        className={`absolute inset-y-0 right-0 w-[51%] bg-void-950 transition-transform duration-[950ms] ease-expo-in-out ${
          open ? 'translate-x-full' : 'translate-x-0'
        }`}
      />

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
