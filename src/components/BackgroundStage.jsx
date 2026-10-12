import { useEffect, useState } from 'react'

import WallpaperScene from './WallpaperScene'
import { sceneWallpaper } from '../lib/backgrounds'
import { useBackgroundScene } from '../context/BackgroundContext'

/**
 * 站点级背景层：钉在视口上（fixed），铺在所有页面内容下面。
 *
 * 切换只动 opacity —— 两个槽位轮流当"前层"，换背景时把新壁纸放进隐藏的那一槽再翻面。
 * 刻意不用 filter / 尺寸变化：那些属性会触发重绘，滚动时逐帧变就是掉帧源。
 * （2026-10-13 实测：Hero 的 filter:brightness scrub 并不是卡顿源，但同类的重绘属性
 *  仍应避免 —— 见 .rivet/scratch/fps-probe.mjs 的 A/C/F 三组测量。）
 */
export default function BackgroundStage() {
  const { scene } = useBackgroundScene()

  // slots.frontIsA 表示当前"前层"是 A 槽；另一个槽预载下一张，翻面即交叉淡入
  const [slots, setSlots] = useState({ a: scene, b: scene, frontIsA: true })
  const [reduceMotion, setReduceMotion] = useState(false)

  useEffect(() => {
    if (typeof window === 'undefined' || !window.matchMedia) return undefined
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    const update = () => setReduceMotion(mq.matches)
    update()
    mq.addEventListener?.('change', update)
    return () => mq.removeEventListener?.('change', update)
  }, [])

  useEffect(() => {
    setSlots((prev) => {
      const current = prev.frontIsA ? prev.a : prev.b
      if (current === scene) return prev
      // 把新场景放进"看不见"的那一槽，再翻面
      return prev.frontIsA
        ? { a: prev.a, b: scene, frontIsA: false }
        : { a: scene, b: prev.b, frontIsA: true }
    })
  }, [scene])

  const fade = reduceMotion ? '' : 'transition-opacity duration-700 ease-expo-out'

  return (
    <div className="pointer-events-none fixed inset-0 -z-10" aria-hidden="true">
      <div
        data-bg-layer="a"
        data-front={slots.frontIsA ? 'true' : 'false'}
        className={`absolute inset-0 ${fade}`}
        style={{ opacity: slots.frontIsA ? 1 : 0 }}
      >
        <WallpaperScene wallpaper={sceneWallpaper(slots.a)} />
      </div>
      <div
        data-bg-layer="b"
        data-front={slots.frontIsA ? 'false' : 'true'}
        className={`absolute inset-0 ${fade}`}
        style={{ opacity: slots.frontIsA ? 0 : 1 }}
      >
        <WallpaperScene wallpaper={sceneWallpaper(slots.b)} />
      </div>
    </div>
  )
}
