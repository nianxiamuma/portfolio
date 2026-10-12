import { useEffect, useMemo, useState } from 'react'
import { Check, CornerDownRight, Mail, MessageSquare, Send } from 'lucide-react'

import { apiGet } from '../services/api'
import { GUESTBOOK_ACCENTS, GUESTBOOK_SEED } from '../data/guestbookSeed'

/** 本地留言存储键：自己发的留言与回复都落在这里 */
const STORAGE_KEY = 'guestbook-local'
const MAX_LEN = 200

const MINUTE = 60 * 1000
const HOUR = 60 * MINUTE
const DAY = 24 * HOUR

/** 时间戳 → 相对时间；超过 30 天退回具体日期 */
function formatRelativeTime(value) {
  const ts = Number(value)
  if (!Number.isFinite(ts)) return '刚刚'
  const diff = Date.now() - ts
  if (diff < MINUTE) return '刚刚'
  if (diff < HOUR) return `${Math.floor(diff / MINUTE)} 分钟前`
  if (diff < DAY) return `${Math.floor(diff / HOUR)} 小时前`
  if (diff < 2 * DAY) return '昨天'
  if (diff < 30 * DAY) return `${Math.floor(diff / DAY)} 天前`
  const d = new Date(ts)
  const mm = String(d.getMonth() + 1).padStart(2, '0')
  const dd = String(d.getDate()).padStart(2, '0')
  return `${d.getFullYear()}-${mm}-${dd}`
}

/** 由昵称稳定地取一个品牌色，保证同一个人每次进来颜色一致 */
function accentFor(seed) {
  const text = String(seed || '')
  let hash = 0
  for (let i = 0; i < text.length; i += 1) {
    hash = (hash * 31 + text.charCodeAt(i)) >>> 0
  }
  return GUESTBOOK_ACCENTS[hash % GUESTBOOK_ACCENTS.length]
}

/** 首字头像：渐变底由品牌色生成，不使用任何外部图片 */
function InitialAvatar({ name, accent }) {
  const color = accent || accentFor(name)
  return (
    <span
      aria-hidden="true"
      className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl border border-white/10 font-serif text-lg font-semibold text-white"
      style={{ background: `linear-gradient(140deg, ${color}, ${color}26)` }}
    >
      {String(name || '?').slice(0, 1)}
    </span>
  )
}

/** 读取本地留言；数据损坏或存储不可用时静默退回空结构 */
function loadLocal() {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    if (!raw) return { messages: [], replies: {} }
    const parsed = JSON.parse(raw)
    return {
      messages: Array.isArray(parsed?.messages) ? parsed.messages : [],
      replies:
        parsed?.replies && typeof parsed.replies === 'object' && !Array.isArray(parsed.replies)
          ? parsed.replies
          : {},
    }
  } catch {
    return { messages: [], replies: {} }
  }
}

function persistLocal(state) {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
  } catch {
    /* 隐私模式 / 配额用尽：只在当前会话内有效，不打断使用 */
  }
}

const newId = (prefix) =>
  `${prefix}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 7)}`

/** 后端返回的字段名不固定，这里做一次宽松归一，认不出来就丢弃 */
function normalizeMessage(raw) {
  if (!raw || typeof raw !== 'object') return null
  const content = String(raw.content ?? raw.body ?? '').trim()
  if (!content) return null
  const nickname = String(raw.nickname ?? raw.name ?? '访客').trim() || '访客'
  const createdAt = Number(raw.createdAt ?? raw.created_at)
  return {
    id: String(raw.id ?? newId('remote')),
    nickname,
    email: '',
    content: content.slice(0, MAX_LEN),
    createdAt: Number.isFinite(createdAt) ? createdAt : Date.now(),
    accent: typeof raw.accent === 'string' && raw.accent ? raw.accent : accentFor(nickname),
    replies: [],
  }
}

/**
 * 「留言板」页：页头 → 发布表单 → 留言列表（含局部回复框）。
 *
 * 后端可选：GET /api/guestbook/messages 拿得到就一起展示，
 * 失败（含未配置 VITE_API_BASE）则静默退回种子数据与本地数据，不报错、不阻塞渲染。
 * 发帖与回复只写 localStorage，不发任何请求。
 */
export default function GuestbookPage() {
  const [local, setLocal] = useState(loadLocal)
  const [remote, setRemote] = useState([])
  const [form, setForm] = useState({ nickname: '', email: '', content: '' })
  const [submitted, setSubmitted] = useState(false)
  const [replyTarget, setReplyTarget] = useState(null)
  const [replyDraft, setReplyDraft] = useState('')

  useEffect(() => {
    let cancelled = false
    apiGet('/api/guestbook/messages')
      .then((data) => {
        if (cancelled) return
        const list = Array.isArray(data)
          ? data
          : Array.isArray(data?.messages)
            ? data.messages
            : []
        setRemote(list.map(normalizeMessage).filter(Boolean))
      })
      .catch(() => {
        /* 后端不可用：静默降级，仅用本地数据 */
      })
    return () => {
      cancelled = true
    }
  }, [])

  const messages = useMemo(() => [...local.messages, ...remote, ...GUESTBOOK_SEED], [local, remote])

  const update = (key) => (e) => {
    setSubmitted(false)
    const value = key === 'content' ? e.target.value.slice(0, MAX_LEN) : e.target.value
    setForm((prev) => ({ ...prev, [key]: value }))
  }

  const onSubmit = (e) => {
    e.preventDefault()
    const nickname = form.nickname.trim() || '匿名访客'
    const content = form.content.trim().slice(0, MAX_LEN)
    if (!content) return

    const next = {
      ...local,
      messages: [
        {
          id: newId('local'),
          nickname,
          email: form.email.trim(),
          content,
          createdAt: Date.now(),
          accent: accentFor(nickname),
          replies: [],
        },
        ...local.messages,
      ],
    }
    setLocal(next)
    persistLocal(next)
    setForm((prev) => ({ ...prev, email: '', content: '' }))
    setSubmitted(true)
  }

  const toggleReply = (id) => {
    setReplyDraft('')
    setReplyTarget((prev) => (prev === id ? null : id))
  }

  const submitReply = (id) => {
    const content = replyDraft.trim().slice(0, MAX_LEN)
    if (!content) return
    const reply = {
      id: newId('reply'),
      nickname: form.nickname.trim() || '匿名访客',
      content,
      createdAt: Date.now(),
    }
    const next = {
      ...local,
      replies: { ...local.replies, [id]: [...(local.replies[id] || []), reply] },
    }
    setLocal(next)
    persistLocal(next)
    setReplyDraft('')
    setReplyTarget(null)
  }

  const contentLength = form.content.length
  const atLimit = contentLength >= MAX_LEN

  return (
    <div className="relative">
      {/* 页头 */}
      <section className="relative pb-16 pt-32 lg:pt-40">
        <div
          aria-hidden
          className="pointer-events-none absolute -top-1/4 right-[-12%] h-[42vw] w-[42vw] rounded-full bg-[radial-gradient(circle,rgba(237,255,102,0.16),transparent_62%)] blur-[110px]"
        />
        <div className="relative mx-auto max-w-shell px-6 md:px-10 lg:px-16">
          <header className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
            <div>
              <div className="flex items-center gap-4">
                <span className="font-mono text-[10px] tracking-[0.2em] text-neon-lime/70">06</span>
                <span className="h-px w-8 bg-white/15" />
                <span className="font-mono text-[10px] uppercase tracking-[0.42em] text-slate-500">
                  Guestbook
                </span>
              </div>
              <h1 className="mt-6 text-[clamp(1.9rem,4vw,3.4rem)] font-bold leading-[1.06] tracking-tightest text-white">
                留一句
                <span className="bg-gradient-to-r from-neon-lime to-neon-violet bg-clip-text text-transparent">
                  话吧
                </span>
              </h1>
            </div>
            <p className="max-w-sm text-sm leading-relaxed text-slate-500">
              路过就写点什么——夸一句、挑个错，或者只是打个招呼都行。留言先存在你自己的浏览器里，刷新不会丢。
            </p>
          </header>
        </div>
      </section>

      {/* 发布表单 */}
      <section className="relative pb-16">
        <div className="mx-auto max-w-shell px-6 md:px-10 lg:px-16">
          <form
            onSubmit={onSubmit}
            className="rounded-3xl border border-white/[0.07] bg-void-900/70 p-7 md:p-9"
          >
            <div className="flex items-center gap-3">
              <span className="grid h-9 w-9 place-items-center rounded-xl border border-neon-lime/30 bg-neon-lime/10">
                <Send className="h-4 w-4 text-neon-lime" />
              </span>
              <h2 className="text-lg font-semibold text-white">写一条留言</h2>
            </div>
            <p className="mt-3 text-xs leading-relaxed text-slate-500">
              昵称和内容填一下就行，邮箱可以不写——写了也只是留在这台设备上，不会对外展示。
            </p>

            <div className="mt-7 grid gap-5 md:grid-cols-2">
              <label className="flex flex-col gap-2">
                <span className="font-mono text-[10px] uppercase tracking-[0.28em] text-slate-500">
                  昵称
                </span>
                <input
                  type="text"
                  value={form.nickname}
                  onChange={update('nickname')}
                  placeholder="怎么称呼你"
                  className="w-full rounded-xl border border-white/[0.08] bg-void-950/80 px-4 py-3 text-sm text-white outline-none placeholder:text-slate-600 transition-colors duration-300 focus:border-neon-lime/50"
                />
              </label>

              <label className="flex flex-col gap-2">
                <span className="inline-flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.28em] text-slate-500">
                  <Mail className="h-3 w-3 text-slate-600" />
                  邮箱
                  <span className="normal-case tracking-normal text-slate-600">（选填）</span>
                </span>
                <input
                  type="email"
                  value={form.email}
                  onChange={update('email')}
                  placeholder="you@example.com"
                  className="w-full rounded-xl border border-white/[0.08] bg-void-950/80 px-4 py-3 text-sm text-white outline-none placeholder:text-slate-600 transition-colors duration-300 focus:border-neon-lime/50"
                />
              </label>
            </div>

            <label className="mt-5 flex flex-col gap-2">
              <span className="font-mono text-[10px] uppercase tracking-[0.28em] text-slate-500">
                内容
              </span>
              <textarea
                value={form.content}
                onChange={update('content')}
                rows={4}
                maxLength={MAX_LEN}
                placeholder="想说的话，写在下面"
                className="w-full resize-none rounded-xl border border-white/[0.08] bg-void-950/80 px-4 py-3 text-sm leading-relaxed text-white outline-none placeholder:text-slate-600 transition-colors duration-300 focus:border-neon-lime/50"
              />
            </label>

            <div className="mt-5 flex flex-wrap items-center justify-between gap-4">
              <span
                className={`font-mono text-[10px] tracking-[0.14em] ${
                  atLimit ? 'text-neon-pink' : 'text-slate-600'
                }`}
              >
                {contentLength}/{MAX_LEN}
              </span>

              <div className="flex flex-wrap items-center gap-4">
                {submitted && (
                  <span role="status" className="inline-flex items-center gap-2 text-xs text-neon-mint">
                    <Check className="h-3.5 w-3.5" />
                    已贴到顶部，感谢留言～
                  </span>
                )}
                <button
                  type="submit"
                  disabled={!form.content.trim()}
                  className="inline-flex items-center gap-2 rounded-full border border-neon-lime/40 bg-neon-lime/10 px-6 py-2.5 text-xs font-medium uppercase tracking-[0.2em] text-neon-lime transition-all duration-500 ease-expo-out hover:border-neon-lime/70 hover:bg-neon-lime/20 hover:shadow-glow-lime disabled:cursor-not-allowed disabled:border-white/10 disabled:bg-transparent disabled:text-slate-600 disabled:shadow-none"
                >
                  <Send className="h-3.5 w-3.5" />
                  发布留言
                </button>
              </div>
            </div>
          </form>
        </div>
      </section>

      {/* 留言列表 */}
      <section className="relative pb-24 lg:pb-36">
        <div className="mx-auto max-w-shell px-6 md:px-10 lg:px-16">
          <div className="flex items-end justify-between gap-4 border-b border-white/[0.07] pb-4">
            <h2 className="font-mono text-[10px] uppercase tracking-[0.3em] text-slate-500">
              Messages
            </h2>
            <span className="font-mono text-[10px] tracking-[0.14em] text-slate-600">
              {messages.length} 条
            </span>
          </div>

          {messages.length === 0 ? (
            <div className="mt-10 flex flex-col items-center gap-4 rounded-3xl border border-dashed border-white/[0.1] px-6 py-16 text-center">
              <span className="grid h-11 w-11 place-items-center rounded-2xl border border-white/10 bg-white/[0.03]">
                <MessageSquare className="h-4 w-4 text-slate-600" />
              </span>
              <p className="text-sm text-slate-500">还没有人留言，第一条留给你。</p>
            </div>
          ) : (
            <ul className="mt-8 flex flex-col gap-4">
              {messages.map((msg) => {
                const replies = [...(msg.replies || []), ...(local.replies[msg.id] || [])]
                const replyOpen = replyTarget === msg.id
                return (
                  <li
                    key={msg.id}
                    className="rounded-2xl border border-white/[0.07] bg-void-900/70 p-6 transition-colors duration-500 ease-expo-out hover:border-white/[0.16] md:p-7"
                  >
                    <div className="flex gap-4">
                      <InitialAvatar name={msg.nickname} accent={msg.accent} />

                      <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
                          <span className="text-sm font-semibold text-white">{msg.nickname}</span>
                          <span className="font-mono text-[10px] tracking-[0.14em] text-slate-600">
                            {formatRelativeTime(msg.createdAt)}
                          </span>
                        </div>

                        <p className="mt-3 whitespace-pre-wrap break-words text-sm leading-relaxed text-slate-300">
                          {msg.content}
                        </p>

                        <div className="mt-4 flex items-center gap-4">
                          <button
                            type="button"
                            onClick={() => toggleReply(msg.id)}
                            className="inline-flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-[0.2em] text-slate-500 transition-colors duration-300 hover:text-neon-violet"
                          >
                            <CornerDownRight className="h-3.5 w-3.5" />
                            {replyOpen ? '收起' : '回复'}
                          </button>
                          {replies.length > 0 && (
                            <span className="font-mono text-[10px] tracking-[0.14em] text-slate-600">
                              {replies.length} 条回复
                            </span>
                          )}
                        </div>

                        {replies.length > 0 && (
                          <ul className="mt-4 flex flex-col gap-3 border-l border-white/[0.08] pl-4">
                            {replies.map((reply) => (
                              <li key={reply.id}>
                                <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
                                  <span className="text-xs font-medium text-slate-200">
                                    {reply.nickname}
                                  </span>
                                  <span className="font-mono text-[10px] tracking-[0.14em] text-slate-600">
                                    {formatRelativeTime(reply.createdAt)}
                                  </span>
                                </div>
                                <p className="mt-1.5 whitespace-pre-wrap break-words text-xs leading-relaxed text-slate-400">
                                  {reply.content}
                                </p>
                              </li>
                            ))}
                          </ul>
                        )}

                        {replyOpen && (
                          <div className="mt-4">
                            <textarea
                              value={replyDraft}
                              onChange={(e) => setReplyDraft(e.target.value.slice(0, MAX_LEN))}
                              rows={2}
                              maxLength={MAX_LEN}
                              placeholder={`回复 ${msg.nickname}`}
                              className="w-full resize-none rounded-xl border border-white/[0.08] bg-void-950/80 px-4 py-3 text-xs leading-relaxed text-white outline-none placeholder:text-slate-600 transition-colors duration-300 focus:border-neon-lime/50"
                            />
                            <div className="mt-3 flex items-center justify-between gap-4">
                              <span
                                className={`font-mono text-[10px] tracking-[0.14em] ${
                                  replyDraft.length >= MAX_LEN ? 'text-neon-pink' : 'text-slate-600'
                                }`}
                              >
                                {replyDraft.length}/{MAX_LEN}
                              </span>
                              <div className="flex items-center gap-3">
                                <button
                                  type="button"
                                  onClick={() => toggleReply(msg.id)}
                                  className="font-mono text-[10px] uppercase tracking-[0.2em] text-slate-500 transition-colors duration-300 hover:text-slate-300"
                                >
                                  取消
                                </button>
                                <button
                                  type="button"
                                  onClick={() => submitReply(msg.id)}
                                  disabled={!replyDraft.trim()}
                                  className="inline-flex items-center gap-2 rounded-full border border-neon-violet/40 bg-neon-violet/10 px-5 py-2 font-mono text-[10px] uppercase tracking-[0.2em] text-neon-violet transition-all duration-500 ease-expo-out hover:border-neon-violet/70 hover:bg-neon-violet/20 disabled:cursor-not-allowed disabled:border-white/10 disabled:bg-transparent disabled:text-slate-600"
                                >
                                  <Send className="h-3 w-3" />
                                  发送
                                </button>
                              </div>
                            </div>
                            <p className="mt-2 font-mono text-[10px] tracking-[0.14em] text-slate-600">
                              回复只存在本地，不会同步到别处。
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  </li>
                )
              })}
            </ul>
          )}
        </div>
      </section>
    </div>
  )
}
