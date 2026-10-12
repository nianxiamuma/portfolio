/**
 * 单张壁纸的渲染层。
 *
 * 有真实图片时：只渲染 <img> + 两层次压暗遮罩，不做任何 blur / 动画，
 * 把 GPU 预算全留给前景（此前用两个 60vw 的 blur(90px) 光斑，是卡顿的主因）。
 * 无图时：回退到生成式氛围场景，保证不会白屏。
 */

const pos = (value) => {
  const [x = '50%', y = '50%'] = String(value).split(' ')
  return { left: x, top: y }
}

export default function WallpaperScene({ wallpaper, className = '' }) {
  const { scene } = wallpaper

  if (scene.image) {
    return (
      <div className={`absolute inset-0 overflow-hidden bg-void-950 ${className}`} aria-hidden>
        <img
          src={scene.image}
          alt=""
          draggable={false}
          className="absolute inset-0 h-full w-full object-cover"
        />
        {/* 上下压暗：保证前景文字可读 */}
        <div className="absolute inset-0 bg-gradient-to-b from-void-950/60 via-void-950/20 to-void-950/90" />
        {/* 四周暗角 */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_78%_68%_at_50%_45%,transparent_38%,rgba(4,5,10,0.72)_100%)]" />
      </div>
    )
  }

  return (
    <div className={`absolute inset-0 overflow-hidden bg-void-950 ${className}`} aria-hidden>
      <div className="absolute inset-0" style={{ background: scene.base }} />

      <div
        className="absolute h-[62vw] w-[62vw] animate-drift-slow rounded-full blur-[90px]"
        style={{ background: scene.blobA, ...pos(scene.blobAPos) }}
      />
      <div
        className="absolute h-[54vw] w-[54vw] animate-drift-medium rounded-full blur-[100px]"
        style={{ background: scene.blobB, ...pos(scene.blobBPos) }}
      />

      <div
        className="absolute inset-x-0 top-[58%] h-px opacity-70"
        style={{
          backgroundImage: `linear-gradient(90deg, transparent, ${scene.horizon}, transparent)`,
          boxShadow: `0 0 28px ${scene.horizon}`,
        }}
      />
      <div
        className="absolute inset-x-0 top-[58%] h-40 opacity-40 blur-2xl"
        style={{ backgroundImage: `linear-gradient(180deg, ${scene.horizon}, transparent)` }}
      />

      <div className="absolute inset-0 bg-grid-faint [background-size:72px_72px] opacity-40 [mask-image:radial-gradient(ellipse_80%_70%_at_50%_45%,black,transparent)]" />

      <div className="absolute inset-0 bg-noise opacity-[0.05] mix-blend-overlay" />
      <div className="absolute inset-x-0 bottom-0 h-2/5 bg-gradient-to-t from-void-950 via-void-950/50 to-transparent" />
    </div>
  )
}
