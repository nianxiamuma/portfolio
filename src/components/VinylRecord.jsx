/**
 * 黑胶唱片。播放时旋转，暂停时停在原处 —— 只动 transform，走合成层。
 * 中心标签显示曲名/歌手，外圈是纹路与一道高光。
 */
export default function VinylRecord({ title, artist, playing, className = '' }) {
  return (
    <div className={`relative aspect-square ${className}`} aria-hidden="true">
      <div
        className="absolute inset-0 rounded-full border border-white/10 shadow-[0_24px_60px_-24px_rgba(0,0,0,0.95)]"
        style={{
          background:
            'repeating-radial-gradient(circle at 50% 50%, #101017 0 2px, #0a0a10 2px 4px)',
          animation: playing ? 'vinyl-spin 6s linear infinite' : 'none',
        }}
      >
        {/* 一圈高光，让旋转看得出来 */}
        <span
          className="absolute inset-[6%] rounded-full"
          style={{
            background:
              'conic-gradient(from 0deg, transparent 0deg, rgba(255,255,255,0.16) 28deg, transparent 62deg)',
          }}
        />

        {/* 中心标签 */}
        <span
          className="absolute inset-[34%] grid place-items-center rounded-full border border-white/15 px-2 text-center"
          style={{ background: 'linear-gradient(140deg, #7c5cff, #2a2350)' }}
        >
          <span className="block max-w-full truncate text-[10px] font-semibold leading-tight text-white">
            {title}
          </span>
          <span className="mt-0.5 block max-w-full truncate font-mono text-[8px] uppercase tracking-[0.16em] text-white/70">
            {artist}
          </span>
        </span>

        {/* 轴心 */}
        <span className="absolute left-1/2 top-1/2 h-2 w-2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-void-950 ring-1 ring-white/30" />
      </div>
    </div>
  )
}
