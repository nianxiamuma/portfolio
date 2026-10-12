import { useState } from 'react'
import { ArrowUpRight, Check, Link2, Send } from 'lucide-react'
import { FRIENDS } from '../data/friends'

/** 站点名首字头像：按品牌色生成渐变底，不使用任何外部图片 */
function InitialAvatar({ name, accent }) {
  return (
    <span
      aria-hidden="true"
      className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl border border-white/10 font-serif text-lg font-semibold text-white"
      style={{ background: `linear-gradient(140deg, ${accent}, ${accent}26)` }}
    >
      {name.slice(0, 1)}
    </span>
  )
}

export default function FriendsPage() {
  const [form, setForm] = useState({ nickname: '', url: '', desc: '' })
  const [submitted, setSubmitted] = useState(false)

  const update = (key) => (e) => {
    setSubmitted(false)
    setForm((prev) => ({ ...prev, [key]: e.target.value }))
  }

  // 纯前端：仅做本地提示，不发起任何请求
  const onSubmit = (e) => {
    e.preventDefault()
    setSubmitted(true)
  }

  return (
    <section className="relative pb-24 pt-32 lg:pb-36 lg:pt-40">
      <div className="mx-auto max-w-shell px-6 md:px-10 lg:px-16">
        {/* 页头 */}
        <header className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
          <div>
            <div className="flex items-center gap-4">
              <span className="font-mono text-[10px] tracking-[0.2em] text-neon-lime/70">05</span>
              <span className="h-px w-8 bg-white/15" />
              <span className="font-mono text-[10px] uppercase tracking-[0.42em] text-slate-500">
                Friends
              </span>
            </div>
            <h2 className="mt-6 text-[clamp(1.9rem,4vw,3.4rem)] font-bold leading-[1.06] tracking-tightest text-white">
              同行的
              <span className="bg-gradient-to-r from-neon-lime to-neon-blue bg-clip-text text-transparent">
                友链
              </span>
            </h2>
          </div>
          <p className="max-w-sm text-sm leading-relaxed text-slate-500">
            一路同行的人，把各自的小站挂在这里，路过时不妨进去坐坐。
          </p>
        </header>

        {/* 友链卡片网格 */}
        <div className="mt-16 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {FRIENDS.map((friend) => (
            <a
              key={friend.id}
              href={friend.url}
              target="_blank"
              rel="noopener noreferrer"
              className="group relative overflow-hidden rounded-2xl border border-white/[0.07] bg-void-900 p-6 transition-all duration-500 ease-expo-out hover:border-white/[0.2] hover:bg-white/[0.04]"
            >
              {/* hover 微光晕 */}
              <span
                className="pointer-events-none absolute -right-10 -top-10 h-28 w-28 rounded-full blur-2xl opacity-30 transition-opacity duration-500 group-hover:opacity-80"
                style={{ background: `radial-gradient(circle, ${friend.accent}66, transparent 68%)` }}
              />

              <div className="relative flex flex-col gap-5">
                <div className="flex items-start justify-between gap-4">
                  <InitialAvatar name={friend.name} accent={friend.accent} />
                  <ArrowUpRight className="h-4 w-4 shrink-0 text-slate-600 transition-all duration-500 ease-expo-out group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-white" />
                </div>

                <div>
                  <h3 className="text-base font-semibold text-white">{friend.name}</h3>
                  <p className="mt-1.5 line-clamp-2 text-xs leading-relaxed text-slate-500">
                    {friend.desc}
                  </p>
                </div>

                <span className="inline-flex items-center gap-1.5 font-mono text-[11px] tracking-[0.08em] text-slate-600 transition-colors duration-500 group-hover:text-neon-blue">
                  <Link2 className="h-3 w-3" />
                  {friend.domain}
                </span>
              </div>
            </a>
          ))}
        </div>

        {/* 申请表单 + 申请说明 */}
        <div className="mt-20 grid gap-8 lg:grid-cols-[1.15fr_0.85fr]">
          <form
            onSubmit={onSubmit}
            className="rounded-3xl border border-white/[0.07] bg-void-900/70 p-7 md:p-9"
          >
            <div className="flex items-center gap-3">
              <span className="grid h-9 w-9 place-items-center rounded-xl border border-neon-lime/30 bg-neon-lime/10">
                <Send className="h-4 w-4 text-neon-lime" />
              </span>
              <h3 className="text-lg font-semibold text-white">申请友链</h3>
            </div>
            <p className="mt-3 text-xs leading-relaxed text-slate-500">
              留下你的站点信息，我看到后会把合适的挂上去。
            </p>

            <div className="mt-7 flex flex-col gap-5">
              <label className="flex flex-col gap-2">
                <span className="font-mono text-[10px] uppercase tracking-[0.28em] text-slate-500">
                  昵称
                </span>
                <input
                  type="text"
                  value={form.nickname}
                  onChange={update('nickname')}
                  placeholder="怎么称呼你"
                  className="w-full rounded-xl border border-white/[0.08] bg-void-950/80 px-4 py-3 text-sm text-white placeholder:text-slate-600 transition-colors duration-300 focus:border-neon-lime/50"
                />
              </label>

              <label className="flex flex-col gap-2">
                <span className="font-mono text-[10px] uppercase tracking-[0.28em] text-slate-500">
                  网址
                </span>
                <input
                  type="url"
                  value={form.url}
                  onChange={update('url')}
                  placeholder="https://your-site.com"
                  className="w-full rounded-xl border border-white/[0.08] bg-void-950/80 px-4 py-3 text-sm text-white placeholder:text-slate-600 transition-colors duration-300 focus:border-neon-lime/50"
                />
              </label>

              <label className="flex flex-col gap-2">
                <span className="font-mono text-[10px] uppercase tracking-[0.28em] text-slate-500">
                  描述
                </span>
                <textarea
                  value={form.desc}
                  onChange={update('desc')}
                  rows={3}
                  placeholder="一句话介绍你的站点"
                  className="w-full resize-none rounded-xl border border-white/[0.08] bg-void-950/80 px-4 py-3 text-sm text-white placeholder:text-slate-600 transition-colors duration-300 focus:border-neon-blue/50"
                />
              </label>
            </div>

            <div className="mt-7 flex flex-wrap items-center gap-4">
              <button
                type="submit"
                className="inline-flex items-center gap-2 rounded-full border border-neon-lime/40 bg-neon-lime/10 px-6 py-2.5 text-xs font-medium uppercase tracking-[0.2em] text-neon-lime transition-all duration-500 ease-expo-out hover:border-neon-lime/70 hover:bg-neon-lime/20 hover:shadow-glow-lime"
              >
                <Send className="h-3.5 w-3.5" />
                提交申请
              </button>

              {submitted && (
                <span
                  role="status"
                  className="inline-flex items-center gap-2 text-xs text-neon-mint"
                >
                  <Check className="h-3.5 w-3.5" />
                  已收到你的申请，感谢～
                </span>
              )}
            </div>
          </form>

          {/* 申请说明 */}
          <aside className="rounded-3xl border border-dashed border-white/[0.1] p-7 md:p-9">
            <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-slate-600">
              申请说明
            </span>
            <ul className="mt-6 flex flex-col gap-4 text-xs leading-relaxed text-slate-500">
              <li className="flex gap-3">
                <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-neon-lime" />
                只收录个人站点，且内容原创、可正常访问。
              </li>
              <li className="flex gap-3">
                <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-neon-blue" />
                站点已在自己站内加上本站链接的，优先通过。
              </li>
              <li className="flex gap-3">
                <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-neon-lime" />
                内容以分享与记录为主，谢绝纯广告或采集站。
              </li>
              <li className="flex gap-3">
                <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-neon-blue" />
                长期无法访问的站点会不定期清理，望见谅。
              </li>
            </ul>
          </aside>
        </div>
      </div>
    </section>
  )
}
