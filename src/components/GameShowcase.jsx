import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Boxes,
  Crosshair,
  Swords,
  Layers,
  Diamond,
  Star,
  ChevronLeft,
  ChevronRight,
  ExternalLink,
  Power,
  Circle,
} from 'lucide-react'
import SectionHeader from './ui/SectionHeader'

const EASE = [0.16, 1, 0.3, 1]

const games = [
  {
    id: 'mc',
    title: '我的世界',
    subtitle: 'Minecraft',
    category: '沙盒建造',
    accent: '#22c55e',
    icon: Boxes,
    platform: 'PC · Java 版',
    rating: 5,
    description:
      '一个方块组成的世界，也是一台想象力机器。从第一间土房子到红石计算机，玩的其实是自由。',
    tags: ['沙盒', '建造', '生存', '联机'],
    url: 'https://www.minecraft.net/zh-hans',
  },
  {
    id: 'cs',
    title: '反恐精英',
    subtitle: 'Counter-Strike 2',
    category: '战术射击',
    accent: '#f59e0b',
    icon: Crosshair,
    platform: 'Steam',
    rating: 5,
    description:
      '二十年了还在打。经济局、道具、残局 1v3——肾上腺素和枪法是两回事，这里两样都要。',
    tags: ['FPS', '竞技', '战术', '团队'],
    url: 'https://store.steampowered.com/search/?term=Counter-Strike+2',
  },
  {
    id: 'taiwu',
    title: '太吾绘卷',
    subtitle: 'The Scroll of Taiwu',
    category: '武侠模拟',
    accent: '#ef4444',
    icon: Swords,
    platform: 'Steam',
    rating: 5,
    description:
      '一个人撑起来的武侠世界。学艺、行走江湖、传承下一代——系统和文本厚得离谱，越玩越上头。',
    tags: ['武侠', '模拟', '养成', '国风'],
    url: 'https://store.steampowered.com/search/?term=The+Scroll+of+Taiwu',
  },
  {
    id: 'sts2',
    title: '杀戮尖塔 2',
    subtitle: 'Slay the Spire 2',
    category: '卡牌构筑',
    accent: '#a855f7',
    icon: Layers,
    platform: 'Steam',
    rating: 5,
    description:
      '爬塔、组卡、看脸，然后被心脏教做人。DBG 的天花板又往上抬了一层，一局接一局停不下来。',
    tags: ['Roguelike', '卡牌', '策略', '构筑'],
    url: 'https://store.steampowered.com/search/?term=Slay+the+Spire+2',
  },
  {
    id: 'balatro',
    title: '小丑牌',
    subtitle: 'Balatro',
    category: '卡牌 Roguelike',
    accent: '#e11d48',
    icon: Diamond,
    platform: 'Steam',
    rating: 5,
    description:
      '一副扑克牌玩出无限可能。倍率相乘的瞬间，多巴胺直接拉满——最危险的"再来一把"。',
    tags: ['Roguelike', '扑克', '构筑', '上瘾'],
    url: 'https://store.steampowered.com/search/?term=Balatro',
  },
]

/* ── 屏幕中的游戏视觉 ─────────────────────────────── */
function ScreenVisual({ game }) {
  const Icon = game.icon
  return (
    <div className="relative h-1/2 overflow-hidden">
      <div
        className="absolute inset-0"
        style={{ background: `linear-gradient(140deg, ${game.accent}2e, transparent 70%)` }}
      />
      <div className="absolute inset-0 bg-grid-faint [background-size:28px_28px] opacity-60" />
      <div className="absolute inset-0 flex items-center justify-center">
        <Icon
          className="h-20 w-20 transition-transform duration-700 ease-expo-out sm:h-24 sm:w-24"
          style={{ color: game.accent, opacity: 0.85 }}
          strokeWidth={1.1}
        />
      </div>
      <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-void-900 via-void-900/60 to-transparent" />

      <div className="absolute bottom-4 left-5 right-5">
        <h3 className="text-xl font-bold leading-tight text-white sm:text-2xl">{game.title}</h3>
        <p className="mt-1 font-mono text-[10px] uppercase tracking-[0.28em] text-white/45">
          {game.subtitle}
        </p>
      </div>

      <span className="absolute right-4 top-4 rounded-md border border-white/10 bg-black/40 px-2 py-1 font-mono text-[10px] uppercase tracking-[0.2em] text-white/55 backdrop-blur-sm">
        {game.platform}
      </span>
    </div>
  )
}

/* ── Joy-Con 按键 ─────────────────────────────────── */
function PadButton({ onClick, label, className = '', children }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      className={`grid place-items-center text-white/55 transition-all duration-300 hover:bg-white/[0.18] hover:text-white active:scale-95 ${className}`}
    >
      {children}
    </button>
  )
}

export default function GameShowcase() {
  const [index, setIndex] = useState(0)
  const game = games[index]

  const next = () => setIndex((i) => (i + 1) % games.length)
  const prev = () => setIndex((i) => (i - 1 + games.length) % games.length)

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'ArrowRight') setIndex((i) => (i + 1) % games.length)
      if (e.key === 'ArrowLeft') setIndex((i) => (i - 1 + games.length) % games.length)
      if (e.key === 'Enter') window.open(games[index].url, '_blank', 'noopener')
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [index])

  return (
    <section id="games" className="relative py-28 lg:py-40">
      <div className="mx-auto max-w-shell px-6 md:px-10 lg:px-16">
        <SectionHeader
          index="03"
          label="Gaming"
          title={
            <>
              精选
              <span className="bg-gradient-to-r from-ice-300 to-indigo-400 bg-clip-text text-transparent">
                游戏
              </span>
            </>
          }
          description="方向键或两侧按键切换，A 键启动。"
        />

        <motion.div
          initial={{ opacity: 0, y: 44 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 1, delay: 0.1, ease: EASE }}
          className="mt-20 flex justify-center"
        >
          <div className="flex w-full max-w-[980px] items-stretch">
            {/* ── 左 Joy-Con ── */}
            <div className="relative flex w-[68px] shrink-0 flex-col items-center gap-5 rounded-l-[34px] border border-r-0 border-white/[0.08] bg-gradient-to-b from-sky-600/35 via-sky-700/30 to-void-850 py-7 shadow-xl shadow-sky-950/40 sm:w-[92px] sm:gap-6">
              <span className="h-1.5 w-7 rounded-full bg-white/15" />

              {/* 方向键 */}
              <div className="relative h-16 w-16 sm:h-20 sm:w-20">
                <PadButton
                  onClick={prev}
                  label="上一个游戏"
                  className="absolute left-1/2 top-0 h-6 w-6 -translate-x-1/2 rounded-md bg-white/[0.09] sm:h-7 sm:w-7"
                >
                  <ChevronLeft className="h-3.5 w-3.5 rotate-90" />
                </PadButton>
                <PadButton
                  onClick={next}
                  label="下一个游戏"
                  className="absolute bottom-0 left-1/2 h-6 w-6 -translate-x-1/2 rounded-md bg-white/[0.09] sm:h-7 sm:w-7"
                >
                  <ChevronRight className="h-3.5 w-3.5 rotate-90" />
                </PadButton>
                <PadButton
                  onClick={prev}
                  label="上一个游戏"
                  className="absolute left-0 top-1/2 h-6 w-6 -translate-y-1/2 rounded-md bg-white/[0.09] sm:h-7 sm:w-7"
                >
                  <ChevronLeft className="h-3.5 w-3.5" />
                </PadButton>
                <PadButton
                  onClick={next}
                  label="下一个游戏"
                  className="absolute right-0 top-1/2 h-6 w-6 -translate-y-1/2 rounded-md bg-white/[0.09] sm:h-7 sm:w-7"
                >
                  <ChevronRight className="h-3.5 w-3.5" />
                </PadButton>
                <span className="absolute left-1/2 top-1/2 h-5 w-5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white/[0.07]" />
              </div>

              {/* 摇杆 */}
              <div className="grid h-10 w-10 place-items-center rounded-full border border-white/10 bg-white/[0.06] shadow-inner sm:h-12 sm:w-12">
                <span className="h-5 w-5 rounded-full bg-white/[0.05] sm:h-6 sm:w-6" />
              </div>

              <span className="mt-auto h-3.5 w-3.5 rounded-full bg-white/10" />
            </div>

            {/* ── 屏幕 ── */}
            <div className="flex min-w-0 flex-1 flex-col border-y border-white/[0.05] bg-gradient-to-b from-void-800 to-void-850 shadow-2xl shadow-black/60">
              <div className="relative m-2.5 flex-1 overflow-hidden rounded-lg border border-white/[0.05] bg-void-900 sm:m-3.5">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={game.id}
                    initial={{ opacity: 0, x: 36 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -36 }}
                    transition={{ duration: 0.38, ease: EASE }}
                    className="flex h-full flex-col"
                  >
                    <ScreenVisual game={game} />

                    {/* 信息 */}
                    <div className="flex flex-1 flex-col justify-between p-4 sm:p-5">
                      <div>
                        <div className="flex items-center justify-between gap-3">
                          <span
                            className="rounded-full border px-2.5 py-1 text-[11px] text-white/60"
                            style={{ borderColor: `${game.accent}55` }}
                          >
                            {game.category}
                          </span>
                          <span className="flex gap-0.5">
                            {Array.from({ length: 5 }).map((_, i) => (
                              <Star
                                key={i}
                                className={`h-3 w-3 ${
                                  i < game.rating
                                    ? 'fill-amber-400 text-amber-400'
                                    : 'text-slate-700'
                                }`}
                              />
                            ))}
                          </span>
                        </div>
                        <p className="mt-3 line-clamp-2 text-[13px] leading-relaxed text-slate-400">
                          {game.description}
                        </p>
                      </div>

                      <div className="mt-3 flex flex-wrap gap-1.5">
                        {game.tags.map((tag) => (
                          <span
                            key={tag}
                            className="rounded-md bg-white/[0.04] px-2 py-1 font-mono text-[10px] uppercase tracking-[0.15em] text-slate-500"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                </AnimatePresence>
              </div>

              {/* 屏幕底栏 */}
              <div className="flex h-8 items-center justify-between border-t border-white/[0.04] px-4 font-mono text-[10px] uppercase tracking-[0.24em] text-slate-600">
                <span className="truncate">{game.subtitle}</span>
                <span>
                  {String(index + 1).padStart(2, '0')} / {String(games.length).padStart(2, '0')}
                </span>
              </div>
            </div>

            {/* ── 右 Joy-Con ── */}
            <div className="relative flex w-[68px] shrink-0 flex-col items-center gap-5 rounded-r-[34px] border border-l-0 border-white/[0.08] bg-gradient-to-b from-rose-600/35 via-rose-700/30 to-void-850 py-7 shadow-xl shadow-rose-950/40 sm:w-[92px] sm:gap-6">
              <span className="h-1.5 w-7 rounded-full bg-white/15" />

              {/* 摇杆 */}
              <div className="grid h-10 w-10 place-items-center rounded-full border border-white/10 bg-white/[0.06] shadow-inner sm:h-12 sm:w-12">
                <span className="h-5 w-5 rounded-full bg-white/[0.05] sm:h-6 sm:w-6" />
              </div>

              {/* ABXY */}
              <div className="relative h-16 w-16 sm:h-20 sm:w-20">
                <PadButton
                  onClick={() => window.open(game.url, '_blank', 'noopener')}
                  label="启动游戏"
                  className="absolute bottom-0 left-1/2 h-7 w-7 -translate-x-1/2 rounded-full bg-white/[0.14] text-[10px] font-bold sm:h-8 sm:w-8"
                >
                  A
                </PadButton>
                <span className="absolute right-0.5 top-1/2 grid h-7 w-7 -translate-y-1/2 place-items-center rounded-full bg-white/[0.06] text-[10px] font-bold text-white/35 sm:h-8 sm:w-8">
                  B
                </span>
                <span className="absolute left-1/2 top-0 grid h-7 w-7 -translate-x-1/2 place-items-center rounded-full bg-white/[0.06] text-[10px] font-bold text-white/35 sm:h-8 sm:w-8">
                  X
                </span>
                <span className="absolute left-0.5 top-1/2 grid h-7 w-7 -translate-y-1/2 place-items-center rounded-full bg-white/[0.06] text-[10px] font-bold text-white/35 sm:h-8 sm:w-8">
                  Y
                </span>
              </div>

              <PadButton
                onClick={() => window.open(game.url, '_blank', 'noopener')}
                label="主页"
                className="h-4 w-4 rounded-full bg-white/15"
              >
                <Power className="h-2 w-2 text-white/50" />
              </PadButton>

              <span className="mt-auto h-3.5 w-3.5 rounded-full bg-white/10" />
            </div>
          </div>
        </motion.div>

        {/* ── 卡带 ── */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.9, delay: 0.2, ease: EASE }}
          className="mx-auto mt-12 flex max-w-[980px] items-center gap-3"
        >
          <button
            type="button"
            onClick={prev}
            aria-label="上一个"
            className="grid h-8 w-8 shrink-0 place-items-center rounded-full border border-white/[0.07] text-slate-500 transition-colors duration-300 hover:border-white/20 hover:text-white"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>

          <div className="flex flex-1 items-stretch justify-center gap-2.5 sm:gap-3">
            {games.map((g, i) => {
              const Icon = g.icon
              const active = i === index
              return (
                <button
                  key={g.id}
                  type="button"
                  onClick={() => setIndex(i)}
                  aria-label={g.title}
                  className={`group relative flex h-[108px] flex-1 flex-col justify-between overflow-hidden rounded-xl border p-3 text-left transition-all duration-500 ease-expo-out sm:h-[124px] ${
                    active
                      ? 'border-white/25 bg-white/[0.06]'
                      : 'border-white/[0.05] bg-white/[0.015] hover:border-white/[0.12] hover:bg-white/[0.035]'
                  }`}
                >
                  <span
                    className="absolute -right-4 -top-4 h-16 w-16 rounded-full blur-2xl transition-opacity duration-500"
                    style={{ backgroundColor: g.accent, opacity: active ? 0.35 : 0.12 }}
                  />
                  <Icon
                    className="relative h-5 w-5"
                    style={{ color: g.accent, opacity: active ? 1 : 0.6 }}
                    strokeWidth={1.4}
                  />
                  <span className="relative">
                    <span className="block truncate text-[12px] font-semibold text-white/90">
                      {g.title}
                    </span>
                    <span className="mt-0.5 block truncate font-mono text-[9px] uppercase tracking-[0.14em] text-slate-500">
                      {g.subtitle}
                    </span>
                  </span>
                </button>
              )
            })}
          </div>

          <button
            type="button"
            onClick={next}
            aria-label="下一个"
            className="grid h-8 w-8 shrink-0 place-items-center rounded-full border border-white/[0.07] text-slate-500 transition-colors duration-300 hover:border-white/20 hover:text-white"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </motion.div>

        {/* 外链提示 */}
        <div className="mt-8 flex justify-center">
          <a
            href={game.url}
            target="_blank"
            rel="noopener noreferrer"
            className="group inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.02] px-5 py-2.5 text-xs text-slate-400 transition-all duration-500 ease-expo-out hover:border-ice-500/40 hover:text-white"
          >
            在 {game.platform} 查看《{game.title}》
            <ExternalLink className="h-3.5 w-3.5 transition-transform duration-500 ease-expo-out group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
          </a>
        </div>
      </div>
    </section>
  )
}
