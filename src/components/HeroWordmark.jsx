/**
 * Hero 右上角的霓虹签名。
 * 目标站是 SVG 逐字描边绘制；这里用斜体衬线 + 多层 text-shadow 的灯管效果，
 * 换壁纸时重置 key 以重放入场，颜色跟随该壁纸主题色。
 */
export default function HeroWordmark({ wallpaper, className = '' }) {
  return (
    <div className={`pointer-events-none absolute z-[45] select-none ${className}`}>
      <span
        key={wallpaper.index}
        className="neon-text block animate-neon-flicker font-serif text-[clamp(2.2rem,5.4vw,5rem)] italic leading-none tracking-tight"
        style={{ color: wallpaper.theme.accent }}
      >
        年下牧马
      </span>
      <span className="mt-2 block font-mono text-[10px] uppercase tracking-[0.42em] text-white/40">
        personal archive
      </span>
    </div>
  )
}
