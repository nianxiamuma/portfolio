import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import {
  ArrowRight,
  LayoutGrid,
  Mail,
  MessageSquare,
  PenLine,
  Send,
  ShieldCheck,
  Sparkles,
  User,
  Wrench,
} from 'lucide-react'

import SectionHeader from '../components/ui/SectionHeader'
import { INDEX_GROUPS, cardsOf } from '../data/indexCards'

/** 数据层只存 icon 字符串键，这里映射到具体图标组件（见 data/indexCards.js 的注释） */
const ICONS = {
  user: User,
  sparkles: Sparkles,
  message: MessageSquare,
  shield: ShieldCheck,
  wrench: Wrench,
  grid: LayoutGrid,
  mail: Mail,
  send: Send,
  pen: PenLine,
}

const CARD_CLASS =
  'group relative flex flex-col overflow-hidden rounded-2xl border border-white/[0.08] bg-void-900/60 p-6 backdrop-blur-sm transition-all duration-500 ease-expo-out hover:-translate-y-1 hover:border-white/20 hover:bg-void-900/80'

function CardBody({ card, order }) {
  const Icon = ICONS[card.icon] || LayoutGrid
  return (
    <>
      <span className="absolute right-5 top-5 font-mono text-[10px] tracking-[0.2em] text-slate-600">
        {String(order).padStart(2, '0')}
      </span>
      <Icon className="h-5 w-5 text-neon-lime/80" aria-hidden />
      <h3 className="mt-7 text-lg font-semibold text-white">{card.title}</h3>
      <p className="mt-1.5 font-mono text-[10px] uppercase tracking-[0.32em] text-slate-600">
        {card.subtitle}
      </p>
      <p className="mt-4 text-sm leading-relaxed text-slate-500">{card.desc}</p>
      <span className="mt-7 inline-flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.28em] text-slate-600 transition-colors duration-500 group-hover:text-white/80">
        {card.external ? 'Open' : 'Go'}
        <ArrowRight
          className="h-3.5 w-3.5 transition-transform duration-500 ease-expo-out group-hover:translate-x-1"
          aria-hidden
        />
      </span>
    </>
  )
}

/**
 * 站点索引（/home）：卡片墙。
 *
 * 与首页的关系：首页是叙事（六段纵向滚动），这里是一张地图——
 * 页面、首页区块、博客子站各成一组，卡片只做导航，不复述内容。
 *
 * 两个容易踩的点：
 * 1. 首页区块卡用 `/?nointro#xxx`：开场动画每次进入都播，不跳过的话
 *    从索引点进去先被挡 4 秒，锚点跳转等于没做（见 HANDOFF 的 HomeIntro 段）。
 * 2. 博客是独立的 Astro 构建产物（真实静态目录），必须走 `<a href>`；
 *    用 `<Link>` 会被 SPA 路由接管后找不到组件。
 */
export default function HomeCardsPage() {
  // 从首页滚到下半部分再点导航进这里时，浏览器会保留滚动位置——先回到顶部
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  return (
    <section id="index" data-bg-scene="home-fragments" className="relative min-h-screen py-28 lg:py-36">
      <div className="mx-auto max-w-shell px-6">
        <SectionHeader
          index="00"
          label="Index"
          title="站点索引"
          description="这里是整站的地图：四张页面卡、四个首页片段、一个独立博客。想直接从哪儿开始都行。"
        />

        <div className="mt-16 space-y-14">
          {INDEX_GROUPS.map((group) => {
            const cards = cardsOf(group.id)
            if (!cards.length) return null
            return (
              <div key={group.id} data-testid={`group-${group.id}`}>
                <div className="flex items-center gap-4">
                  <span className="font-mono text-[10px] uppercase tracking-[0.42em] text-slate-500">
                    {group.hint}
                  </span>
                  <span className="h-px flex-1 bg-white/10" />
                  <span className="font-mono text-[10px] tracking-[0.2em] text-slate-600">
                    {group.label}
                  </span>
                </div>

                <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {cards.map((card, index) =>
                    card.external ? (
                      <a
                        key={card.id}
                        data-testid={`card-${card.id}`}
                        href={card.href}
                        className={CARD_CLASS}
                      >
                        <CardBody card={card} order={index + 1} />
                      </a>
                    ) : (
                      <Link
                        key={card.id}
                        data-testid={`card-${card.id}`}
                        to={card.to}
                        className={CARD_CLASS}
                      >
                        <CardBody card={card} order={index + 1} />
                      </Link>
                    ),
                  )}
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
