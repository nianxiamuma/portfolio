import { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'

import WallpaperScene from './WallpaperScene'
import { DEFAULT_SCENE, sceneImageCount, sceneWallpaper } from '../lib/backgrounds'
import { useBackgroundScene } from '../context/BackgroundContext'
import { getDiceWallpaper } from '../lib/diceWallpapers'
import { getMonthCover } from '../lib/wallpapers'

/**
 * 站点级背景层：钉在视口上（fixed），铺在所有页面内容下面。
 *
 * 两个职责：
 *   1. 场景切换 —— 换页或滚到下一个区块时交叉淡入到新场景
 *   2. 同场景轮换 —— 每个场景有多张图，每隔 rotateMs 换下一张
 *
 * 两者共用同一套「双槽位」：一个槽当前显示，另一个槽预载下一张，靠翻面交叉淡入。
 * 切换只动 opacity —— 不用 filter / 尺寸变化，那些属性会触发重绘。
 * （2026-10-13 实测：Hero 的 filter:brightness scrub 并不是卡顿源，但同类的重绘属性仍应避免。）
 */
export const ROTATE_MS = 45000

const slotFor = (key, variant) => ({ key, variant })

export default function BackgroundStage({ rotateMs = ROTATE_MS }) {
  const { scene, month, diceFace } = useBackgroundScene()
  const { pathname } = useLocation()
  /*
   * 「主页」（/home 站点索引）的背景由骰子决定：
   *   未投掷（-1）→ 当月形象（MONTH_COVERS 里当月那张）
   *   1–6 / 0    → 骰子池对应那张
   * 其余页面照旧走场景表。
   */
  const base = (import.meta.env.BASE_URL || '/').replace(/\/$/, '')
  const routePath = base && pathname.startsWith(base) ? pathname.slice(base.length) || '/' : pathname
  const homeIndex = routePath === '/home'
  const homeWallpaper = () => (diceFace >= 0 ? getDiceWallpaper(diceFace) : getMonthCover(month))

  const [slots, setSlots] = useState(() => ({
    a: slotFor(scene, 0),
    b: slotFor(scene, 0),
    frontIsA: true,
  }))
  const [reduceMotion, setReduceMotion] = useState(false)

  useEffect(() => {
    if (typeof window === 'undefined' || !window.matchMedia) return undefined
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    const update = () => setReduceMotion(mq.matches)
    update()
    mq.addEventListener?.('change', update)
    return () => mq.removeEventListener?.('change', update)
  }, [])

  /* 场景变了：把新场景的第 0 张放进看不见的那一槽，再翻面 */
  useEffect(() => {
    setSlots((prev) => {
      const front = prev.frontIsA ? prev.a : prev.b
      if (front.key === scene) return prev
      const next = slotFor(scene, 0)
      return prev.frontIsA
        ? { a: prev.a, b: next, frontIsA: false }
        : { a: next, b: prev.b, frontIsA: true }
    })
  }, [scene])

  /* 定时轮换：把同场景的下一张放进隐藏槽再翻面 */
  useEffect(() => {
    if (reduceMotion) return undefined
    const id = window.setInterval(() => {
      setSlots((prev) => {
        const front = prev.frontIsA ? prev.a : prev.b
        if (sceneImageCount(front.key, month) <= 1) return prev
        const next = slotFor(front.key, front.variant + 1)
        return prev.frontIsA
          ? { a: prev.a, b: next, frontIsA: false }
          : { a: next, b: prev.b, frontIsA: true }
      })
    }, rotateMs)
    return () => window.clearInterval(id)
  }, [reduceMotion, rotateMs, month])

  const fade = reduceMotion ? '' : 'transition-opacity duration-700 ease-expo-out'

  const layer = (slot, isFront) => (
    <div
      data-bg-layer={isFront ? 'front-slot' : 'back-slot'}
      data-front={isFront ? 'true' : 'false'}
      data-scene={slot.key}
      data-variant={slot.variant}
      className={`absolute inset-0 ${fade}`}
      style={{ opacity: isFront ? 1 : 0 }}
    >
      <WallpaperScene
        wallpaper={
          homeIndex
            ? homeWallpaper()
            : sceneWallpaper(slot.key, slot.variant, month) ||
              sceneWallpaper(DEFAULT_SCENE, 0, month)
        }
      />
    </div>
  )

  return (
    <div className="pointer-events-none fixed inset-0 -z-10" aria-hidden="true">
      {slots.frontIsA
        ? [layer(slots.a, true), layer(slots.b, false)]
        : [layer(slots.a, false), layer(slots.b, true)]}
    </div>
  )
}
