import { useEffect, useState } from 'react'

/**
 * 单张壁纸的渲染层。优先级：视频（仅桌面端）→ 图片 → 生成式渐变。
 *
 * 视频只在桌面端加载，且尊重"减少动效"偏好：
 * 移动网络下几 MB 的视频代价太大，且移动端自动播放常被系统限制。
 * 图片同时作为 video 的 poster，视频加载中/失败时都有画面，不会黑屏。
 */

const pos = (value) => {
  const [x = '50%', y = '50%'] = String(value).split(' ')
  return { left: x, top: y }
}

export default function WallpaperScene({ wallpaper, className = '' }) {
  const { scene } = wallpaper
  const [videoAllowed, setVideoAllowed] = useState(false)

  useEffect(() => {
    if (!scene.video) return undefined
    if (typeof window === 'undefined' || !window.matchMedia) return undefined

    const wide = window.matchMedia('(min-width: 768px)')
    const still = window.matchMedia('(prefers-reduced-motion: reduce)')
    const update = () => setVideoAllowed(wide.matches && !still.matches)

    update()
    wide.addEventListener?.('change', update)
    still.addEventListener?.('change', update)
    return () => {
      wide.removeEventListener?.('change', update)
      still.removeEventListener?.('change', update)
    }
  }, [scene.video])

  const useVideo = Boolean(scene.video) && videoAllowed
  const useImage = !useVideo && Boolean(scene.image)
  const useGenerated = !useVideo && !scene.image

  return (
    <div className={`absolute inset-0 overflow-hidden bg-void-950 ${className}`} aria-hidden>
      {useVideo ? (
        <video
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
          poster={scene.image || undefined}
          className="absolute inset-0 h-full w-full object-cover"
        >
          <source src={scene.video} />
        </video>
      ) : null}

      {useImage ? (
        <img
          src={scene.image}
          alt=""
          draggable={false}
          className="absolute inset-0 h-full w-full object-cover"
        />
      ) : null}

      {useGenerated ? (
        <>
          <div className="absolute inset-0" style={{ background: scene.base }} />
          <div
            className="absolute h-[62vw] w-[62vw] animate-drift-slow rounded-full blur-[90px]"
            style={{ background: scene.blobA, ...pos(scene.blobAPos) }}
          />
          <div
            className="absolute h-[54vw] w-[54vw] animate-drift-medium rounded-full blur-[100px]"
            style={{ background: scene.blobB, ...pos(scene.blobBPos) }}
          />
        </>
      ) : null}

      {/* 压暗遮罩：保证前景文字可读 */}
      <div className="absolute inset-0 bg-gradient-to-b from-void-950/60 via-void-950/20 to-void-950/90" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_78%_68%_at_50%_45%,transparent_38%,rgba(4,5,10,0.72)_100%)]" />
      {/* 视频比静态图更亮，再压一层，避免前景文字被冲淡 */}
      {useVideo ? <div className="absolute inset-0 bg-void-950/15" /> : null}
    </div>
  )
}
