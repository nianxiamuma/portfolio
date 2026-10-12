import Bookshelf from '../components/Bookshelf'
import GameShowcase from '../components/GameShowcase'

/**
 * 藏书与游戏 —— 把原来首页的两个板块收进独立页面。
 * 两个板块组件各自带 section 与锚点，这里只负责页头与间距。
 */
export default function CollectionPage() {
  return (
    <div className="pt-24 md:pt-28">
      <header className="mx-auto max-w-shell px-6 pt-10 md:px-10 lg:px-16">
        <div className="flex items-center gap-4">
          <span className="font-mono text-[10px] tracking-[0.2em] text-neon-lime/70">06</span>
          <span className="h-px w-8 bg-white/15" />
          <span className="font-mono text-[10px] uppercase tracking-[0.42em] text-slate-500">
            Collection
          </span>
        </div>
        <h1 className="mt-6 text-[clamp(2.2rem,5vw,4rem)] font-bold leading-[1.04] tracking-tightest text-white">
          藏书与
          <span className="bg-gradient-to-r from-neon-lime to-neon-mint bg-clip-text text-transparent">
            游戏
          </span>
        </h1>
        <p className="mt-5 max-w-xl text-sm leading-relaxed text-slate-500">
          书架上的五本，主机里的五款。点书脊可以把书抽出来，方向键可以切游戏。
        </p>
      </header>

      <Bookshelf />
      <GameShowcase />
    </div>
  )
}
