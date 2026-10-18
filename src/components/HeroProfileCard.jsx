import { Link } from 'react-router-dom'
import { Mail, MessageSquare, Github, ExternalLink } from 'lucide-react'
import { SITE } from '../data/site'

const ICONS = {
  mail: Mail,
  guestbook: MessageSquare,
  github: Github,
}

/**
 * Hero 里的个人名片卡（借鉴自参考站 rainzt.cn 的中央卡片）。
 * 头像 + 名字 + 一句话签名 + 快捷入口 + 社交。
 * 卡面全透明（不糊背景），只靠描边和投影与壁纸分层 —— 用户要求「模糊变成透明」。
 */
export default function HeroProfileCard({ className = '' }) {
  return (
    <div
      className={`w-[min(88vw,340px)] rounded-3xl border border-white/15 bg-transparent p-6 shadow-[0_28px_90px_-28px_rgba(0,0,0,0.9)] ${className}`}
    >
      {/* 头像 */}
      <div className="relative mx-auto h-20 w-20">
        <img
          src={SITE.avatar}
          alt={SITE.name}
          draggable={false}
          className="h-full w-full rounded-full object-cover ring-2 ring-white/25"
        />
        <span className="absolute -right-1.5 -top-1.5 rounded-full bg-neon-lime px-2 py-0.5 text-[9px] font-bold leading-tight text-void-950">
          在线
        </span>
      </div>

      {/* 名字 */}
      <h2 className="mt-4 text-center text-lg font-bold tracking-tight text-white">{SITE.name}</h2>
      <p className="mt-1 text-center font-mono text-[9px] uppercase tracking-[0.3em] text-white/40">
        {SITE.romaji}
      </p>

      {/* 签名 */}
      <p className="mt-4 text-center text-xs leading-relaxed text-white/75">{SITE.tagline}</p>

      <div className="my-5 h-px bg-gradient-to-r from-transparent via-white/15 to-transparent" />

      {/* 快捷入口 */}
      <div className="flex flex-wrap justify-center gap-2">
        {SITE.shortcuts.map((item) => {
          const cls =
            'rounded-full border border-white/15 bg-white/[0.06] px-3.5 py-1.5 text-[11px] text-white/80 transition-all duration-500 ease-expo-out hover:border-neon-lime/50 hover:bg-white/[0.12] hover:text-neon-lime'
          return item.external ? (
            <a key={item.to} href={item.to} className={cls}>
              {item.label}
            </a>
          ) : (
            <Link key={item.to} to={item.to} className={cls}>
              {item.label}
            </Link>
          )
        })}
      </div>

      {/* 社交 */}
      <div className="mt-5 flex justify-center gap-2.5">
        {SITE.socials.map((item) => {
          const Icon = ICONS[item.key] || ExternalLink
          const cls =
            'grid h-9 w-9 place-items-center rounded-xl border border-white/12 bg-white/[0.05] text-white/60 transition-all duration-500 ease-expo-out hover:border-white/30 hover:text-white'
          return item.to ? (
            <Link key={item.key} to={item.to} aria-label={item.label} className={cls}>
              <Icon className="h-4 w-4" />
            </Link>
          ) : (
            <a
              key={item.key}
              href={item.href}
              target={item.href?.startsWith('http') ? '_blank' : undefined}
              rel="noopener noreferrer"
              aria-label={item.label}
              className={cls}
            >
              <Icon className="h-4 w-4" />
            </a>
          )
        })}
      </div>
    </div>
  )
}
