const COUNT = 16

/** 位置/时长按索引推算，固定不随机 —— 避免每次渲染跳动 */
const PETALS = Array.from({ length: COUNT }, (_, i) => ({
  left: `${(i * 6.7 + (i % 3) * 7) % 100}%`,
  delay: `${((i * 1.3) % 12).toFixed(1)}s`,
  duration: `${12 + (i % 5) * 2.5}s`,
  size: 8 + (i % 4) * 4,
  drift: `${(i % 2 === 0 ? 1 : -1) * (30 + (i % 3) * 24)}px`,
}))

/**
 * 飘落的花瓣（借鉴自参考站的氛围层）。
 * 纯 CSS transform 动画，16 个元素，走合成层，不占主线程。
 */
export default function Petals({ className = '' }) {
  return (
    <div className={`pointer-events-none absolute inset-0 overflow-hidden ${className}`} aria-hidden>
      {PETALS.map((p, i) => (
        <span
          key={i}
          className="petal"
          style={{
            left: p.left,
            width: `${p.size}px`,
            height: `${p.size}px`,
            animationDelay: p.delay,
            animationDuration: p.duration,
            '--drift': p.drift,
          }}
        />
      ))}
    </div>
  )
}
