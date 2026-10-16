import { useEffect, useMemo, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Search, X, FileText } from 'lucide-react'
import { searchPosts } from '../lib/searchIndex'

/**
 * 全站搜索面板（Cmd/Ctrl+K 唤出，对标三个参照博客的全文搜索）。
 * - 输入即时调 searchPosts（内存索引，无网络请求）
 * - Enter 打开第一条，↑↓ 选择，Esc 关闭
 * - 空查询不弹列表，只显示提示
 */
export default function SearchPanel() {
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState('')
  const [active, setActive] = useState(0)
  const inputRef = useRef(null)
  const navigate = useNavigate()

  const results = useMemo(() => searchPosts(query), [query])

  useEffect(() => {
    const onKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault()
        setOpen((prev) => !prev)
      }
      if (e.key === 'Escape') setOpen(false)
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [])

  useEffect(() => {
    if (open) {
      setQuery('')
      setActive(0)
      // 等 transition 首帧后再聚焦
      requestAnimationFrame(() => inputRef.current?.focus())
    }
  }, [open])

  useEffect(() => {
    setActive(0)
  }, [query])

  const go = (slug) => {
    setOpen(false)
    navigate(`/blog/${slug}`)
  }

  const onInputKeyDown = (e) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setActive((i) => Math.min(i + 1, results.length - 1))
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setActive((i) => Math.max(i - 1, 0))
    } else if (e.key === 'Enter') {
      e.preventDefault()
      if (results[active]) go(results[active].slug)
    }
  }

  if (!open) return null

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="搜索文章"
      className="fixed inset-0 z-[70] flex items-start justify-center px-4 pt-[18vh]"
    >
      {/* 点遮罩关闭 */}
      <div className="absolute inset-0 bg-void-950/80 backdrop-blur-sm" onClick={() => setOpen(false)} />

      <div className="relative w-full max-w-lg overflow-hidden rounded-2xl border border-white/[0.1] bg-void-900/95 shadow-2xl backdrop-blur-xl">
        <div className="flex items-center gap-3 border-b border-white/[0.08] px-5 py-4">
          <Search className="h-4 w-4 shrink-0 text-slate-500" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={onInputKeyDown}
            placeholder="搜文章：标题、标签或正文…"
            aria-label="搜索关键词"
            className="w-full bg-transparent text-sm text-white placeholder:text-slate-600 focus:outline-none"
          />
          <button
            type="button"
            onClick={() => setOpen(false)}
            aria-label="关闭搜索"
            className="shrink-0 rounded-md border border-white/[0.08] px-1.5 py-0.5 font-mono text-[10px] text-slate-500 hover:text-white"
          >
            <X className="h-3 w-3" />
          </button>
        </div>

        <div className="max-h-[46vh] overflow-y-auto p-2">
          {query.trim() === '' ? (
            <p className="px-4 py-8 text-center text-xs text-slate-600">
              输入关键词搜索站内文章 · ↑↓ 选择 · Enter 打开
            </p>
          ) : results.length === 0 ? (
            <p className="px-4 py-8 text-center text-xs text-slate-600">没有匹配的文章。</p>
          ) : (
            results.map((post, i) => (
              <button
                key={post.slug}
                type="button"
                onClick={() => go(post.slug)}
                onMouseEnter={() => setActive(i)}
                className={`flex w-full items-center gap-3 rounded-xl px-4 py-3 text-left transition-colors duration-200 ${
                  i === active ? 'bg-white/[0.06]' : ''
                }`}
              >
                <FileText className="h-4 w-4 shrink-0 text-slate-600" />
                <span className="min-w-0 flex-1">
                  <span className={`block truncate text-sm ${i === active ? 'text-white' : 'text-slate-300'}`}>
                    {post.title}
                  </span>
                  <span className="mt-0.5 block font-mono text-[10px] tracking-[0.1em] text-slate-600">
                    {post.date} · 命中{post.reason}
                  </span>
                </span>
              </button>
            ))
          )}
        </div>
      </div>
    </div>
  )
}
