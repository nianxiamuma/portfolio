import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Github, Mail, MessageSquare, Copy, Check, ArrowUp } from 'lucide-react'

import { SITE } from '../data/site'

const EMAIL = '807273679@qq.com'

/** GitHub 地址取 SITE.socials 的单一真源 —— 页脚/名片卡各写一份就会漂移成假链接 */
const GITHUB_HREF =
  SITE.socials.find((item) => item.key === 'github')?.href || 'https://github.com/nianxiamuma'

const SOCIAL = [
  { icon: Github, label: 'GitHub', href: GITHUB_HREF },
  { icon: MessageSquare, label: '留言板', to: '/guestbook' },
  { icon: Mail, label: '邮件', href: `mailto:${EMAIL}` },
]

const SITEMAP = [
  { label: '文章', to: '/blog' },
  { label: '归档', to: '/archive' },
  { label: '标签', to: '/tags' },
  { label: '关于我', to: '/about' },
  { label: '浮光集', to: '/glimmer' },
  { label: '藏书与游戏', to: '/collection' },
  { label: '友链', to: '/friends' },
  { label: '留言板', to: '/guestbook' },
  { label: '来源与致谢', to: '/sources' },
]

export default function Footer() {
  const [copied, setCopied] = useState(false)

  const copyEmail = async () => {
    try {
      await navigator.clipboard?.writeText(EMAIL)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      /* 剪贴板不可用时静默降级，邮箱仍可点选复制 */
    }
  }

  return (
    <footer className="relative overflow-hidden border-t border-white/[0.06] bg-void-950/70 backdrop-blur-sm">
      <div aria-hidden className="pointer-events-none absolute inset-0">
        <div className="absolute -top-1/3 left-1/2 h-[46vw] w-[70vw] -translate-x-1/2 rounded-full bg-[radial-gradient(ellipse_at_center,rgba(124,92,255,0.16),transparent_65%)] blur-3xl" />
        <div className="absolute inset-0 bg-grid-faint [background-size:72px_72px] opacity-40 [mask-image:radial-gradient(ellipse_70%_60%_at_50%_40%,black,transparent)]" />
      </div>

      <div className="relative mx-auto max-w-shell px-6 py-16 md:px-10 lg:px-16">
        {/* 上：留个话头 */}
        <div className="flex flex-col gap-6 border-b border-white/[0.06] pb-12 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="font-mono text-[10px] uppercase tracking-[0.42em] text-neon-lime/70">
              Get in touch
            </p>
            <h2 className="mt-5 text-[clamp(1.7rem,3.4vw,2.8rem)] font-bold leading-tight tracking-tightest text-white">
              如果你也有想推荐的书或游戏
            </h2>
          </div>

          <button
            type="button"
            onClick={copyEmail}
            className="group inline-flex shrink-0 items-center gap-3 self-start rounded-2xl border border-white/[0.08] bg-white/[0.03] px-5 py-3.5 backdrop-blur-sm transition-all duration-500 ease-expo-out hover:border-neon-violet/50 hover:bg-white/[0.06] md:self-auto"
          >
            <Mail className="h-4 w-4 text-neon-violet" />
            <span className="font-mono text-sm text-slate-200">{EMAIL}</span>
            {copied ? (
              <Check className="h-3.5 w-3.5 text-neon-mint" />
            ) : (
              <Copy className="h-3.5 w-3.5 text-slate-500 transition-colors duration-300 group-hover:text-slate-300" />
            )}
          </button>
        </div>

        {/* 中：三栏 */}
        <div className="grid gap-10 py-12 md:grid-cols-3">
          <div>
            <span className="font-mono text-sm text-slate-300">@年下牧马</span>
            <p className="mt-3 max-w-xs text-sm leading-relaxed text-slate-500">
              年下牧马的收藏站。没有简历，也没有作品集。
            </p>
          </div>

          <div>
            <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-slate-600">站点</p>
            <ul className="mt-4 space-y-2.5">
              {SITEMAP.map((item) => (
                <li key={item.to}>
                  <Link
                    to={item.to}
                    className="text-sm text-slate-400 transition-colors duration-300 hover:text-white"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-slate-600">联系</p>
            <div className="mt-4 flex gap-3">
              {SOCIAL.map((item) => {
                const Icon = item.icon
                const className =
                  'grid h-10 w-10 place-items-center rounded-xl border border-white/[0.07] bg-white/[0.02] text-slate-400 transition-all duration-300 hover:border-neon-lime/40 hover:text-neon-lime'
                return item.to ? (
                  <Link key={item.label} to={item.to} aria-label={item.label} className={className}>
                    <Icon className="h-4 w-4" />
                  </Link>
                ) : (
                  <a
                    key={item.label}
                    href={item.href}
                    target={item.href.startsWith('http') ? '_blank' : undefined}
                    rel="noopener noreferrer"
                    aria-label={item.label}
                    className={className}
                  >
                    <Icon className="h-4 w-4" />
                  </a>
                )
              })}
            </div>
          </div>
        </div>

        {/* 下：版权 */}
        <div className="flex flex-col items-start justify-between gap-4 border-t border-white/[0.06] pt-8 sm:flex-row sm:items-center">
          <p className="font-mono text-[11px] tracking-[0.14em] text-slate-600">
            © 2026 · 年下牧马 · 本站仅作个人学习与展示使用
          </p>
          <button
            type="button"
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="group inline-flex items-center gap-2 font-mono text-[11px] tracking-[0.14em] text-slate-500 transition-colors duration-300 hover:text-white"
          >
            Back to top
            <ArrowUp className="h-3.5 w-3.5 transition-transform duration-500 ease-expo-out group-hover:-translate-y-0.5" />
          </button>
        </div>
      </div>
    </footer>
  )
}
