import { useEffect, useMemo, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { ArrowLeft, ArrowRight } from 'lucide-react'
import { getPost, readingMinutes, sortedPosts, wordCount } from '../data/posts'
import { extractOutline, renderBodyBlocks } from '../lib/postOutline'

/** 按标签重合度算相关文章：重合数降序，最多 2 篇 */
export function relatedPosts(current, all) {
  return all
    .filter((p) => p.slug !== current.slug)
    .map((post) => ({
      post,
      overlap: post.tags.filter((tag) => current.tags.includes(tag)).length,
    }))
    .filter(({ overlap }) => overlap > 0)
    .sort((a, b) => b.overlap - a.overlap)
    .slice(0, 2)
    .map(({ post }) => post)
}

/** 阅读进度条：视口滚动百分比，固定在顶部 */
function ReadingProgress() {
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    const onScroll = () => {
      const doc = document.documentElement
      const total = doc.scrollHeight - window.innerHeight
      setProgress(total > 0 ? Math.min(1, Math.max(0, window.scrollY / total)) : 0)
    }
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <div aria-hidden className="fixed inset-x-0 top-0 z-[80] h-0.5 bg-white/[0.04]">
      <div
        className="h-full bg-gradient-to-r from-neon-lime to-neon-mint transition-[width] duration-150 ease-out"
        style={{ width: `${progress * 100}%` }}
      />
    </div>
  )
}

/** 正文渲染块 → JSX */
function BodyBlock({ block }) {
  if (block.type === 'h2') {
    return (
      <h2 id={block.id} className="scroll-mt-32 pt-6 text-xl font-bold tracking-tight text-white md:text-2xl">
        {block.text}
      </h2>
    )
  }
  if (block.type === 'code') {
    return (
      <pre className="overflow-x-auto rounded-2xl border border-white/[0.07] bg-void-950/80 p-5 font-mono text-xs leading-relaxed text-slate-300">
        <code>{block.text}</code>
      </pre>
    )
  }
  if (block.type === 'quote') {
    return (
      <blockquote className="border-l-2 border-neon-violet/60 pl-5 text-[14px] italic leading-[1.9] text-slate-400">
        {block.text}
      </blockquote>
    )
  }
  return <p className="text-[15px] leading-[1.95] text-slate-300">{block.text}</p>
}

/** 文章详情：正文（受控 Markdown）+ 顶部进度条 + 右侧 TOC + 相关文章 + 上下篇 */
export default function PostPage() {
  const { slug } = useParams()
  const post = getPost(slug)
  const [activeId, setActiveId] = useState(null)

  const outline = useMemo(() => (post ? extractOutline(post.body) : []), [post])
  const blocks = useMemo(() => (post ? renderBodyBlocks(post.body) : []), [post])

  /* TOC 滚动高亮：取视口上方最近的标题 */
  useEffect(() => {
    if (!outline.length) return undefined
    const onScroll = () => {
      let current = null
      for (const { id } of outline) {
        const el = document.getElementById(id)
        if (el && el.getBoundingClientRect().top <= 120) current = id
      }
      setActiveId(current)
    }
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [outline])

  if (!post) {
    return (
      <div className="flex min-h-[70vh] flex-col items-center justify-center px-6 pt-28 text-center">
        <p className="font-mono text-[11px] uppercase tracking-[0.4em] text-slate-600">404</p>
        <h1 className="mt-5 text-2xl font-bold text-white">没有这篇文章</h1>
        <p className="mt-3 text-sm text-slate-500">链接可能过期了，或者它还没被写出来。</p>
        <Link
          to="/blog"
          className="mt-8 inline-flex items-center gap-2 rounded-full bg-white px-6 py-3 text-xs font-semibold text-void-950 transition-all duration-500 ease-expo-out hover:shadow-glow-lime"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          回到列表
        </Link>
      </div>
    )
  }

  const ordered = sortedPosts()
  const index = ordered.findIndex((p) => p.slug === post.slug)
  const prev = ordered[index + 1]
  const next = ordered[index - 1]
  const related = relatedPosts(post, ordered)

  return (
    <article className="pt-28 md:pt-32">
      <ReadingProgress />

      <div className="mx-auto max-w-6xl px-6 md:px-10">
        <div className={outline.length ? 'lg:grid lg:grid-cols-[minmax(0,1fr)_220px] lg:gap-14' : ''}>
          <div className="mx-auto max-w-3xl lg:mx-0">
            {/* 返回 */}
            <Link
              to="/blog"
              className="group inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.24em] text-slate-500 transition-colors duration-300 hover:text-white"
            >
              <ArrowLeft className="h-3.5 w-3.5 transition-transform duration-500 ease-expo-out group-hover:-translate-x-1" />
              All posts
            </Link>

            {/* 头部 */}
            <header className="mt-10">
              <div className="flex flex-wrap items-center gap-2">
                <span
                  className="rounded-full border px-2.5 py-1 font-mono text-[10px]"
                  style={{ borderColor: `${post.accent}66`, color: post.accent }}
                >
                  {post.category}
                </span>
                {post.tags.map((tag) => (
                  <Link
                    key={tag}
                    to={`/tags/${encodeURIComponent(tag)}`}
                    className="rounded-md bg-white/[0.04] px-2 py-1 font-mono text-[10px] uppercase tracking-[0.14em] text-slate-500 transition-colors duration-300 hover:text-neon-lime"
                  >
                    {tag}
                  </Link>
                ))}
              </div>

              <h1 className="mt-6 text-[clamp(1.8rem,4vw,2.9rem)] font-bold leading-[1.15] tracking-tightest text-white">
                {post.title}
              </h1>

              <div className="mt-5 flex flex-wrap items-center gap-3 border-b border-white/[0.06] pb-6 font-mono text-[11px] tracking-[0.1em] text-slate-600">
                <span>{post.date}</span>
                <span className="text-slate-700">·</span>
                <span>{wordCount(post)} 字</span>
                <span className="text-slate-700">·</span>
                <span>约 {readingMinutes(post)} 分钟</span>
              </div>
            </header>

            {/* 正文 */}
            <div className="mt-10 flex flex-col gap-6">
              {blocks.map((block, i) => (
                <BodyBlock key={block.id || `b${i}`} block={block} />
              ))}
            </div>

            {/* 相关文章 */}
            {related.length ? (
              <section className="mt-16">
                <h2 className="font-mono text-[10px] uppercase tracking-[0.3em] text-slate-600">
                  相关文章
                </h2>
                <div className="mt-4 grid gap-3 sm:grid-cols-2">
                  {related.map((rel) => (
                    <Link
                      key={rel.slug}
                      to={`/blog/${rel.slug}`}
                      className="group rounded-2xl border border-white/[0.07] p-4 transition-all duration-500 ease-expo-out hover:border-white/[0.16] hover:bg-white/[0.03]"
                    >
                      <p className="text-sm font-medium text-slate-200 transition-colors group-hover:text-neon-lime">
                        {rel.title}
                      </p>
                      <p className="mt-1.5 font-mono text-[10px] tracking-[0.1em] text-slate-600">
                        {rel.tags.filter((tag) => post.tags.includes(tag)).join(' / ')}
                      </p>
                    </Link>
                  ))}
                </div>
              </section>
            ) : null}

            {/* 上下篇 */}
            <nav className="mt-16 grid gap-4 border-t border-white/[0.06] pt-8 sm:grid-cols-2">
              {prev ? (
                <Link
                  to={`/blog/${prev.slug}`}
                  className="group rounded-2xl border border-white/[0.07] p-5 transition-all duration-500 ease-expo-out hover:border-white/[0.16] hover:bg-white/[0.03]"
                >
                  <span className="font-mono text-[10px] uppercase tracking-[0.24em] text-slate-600">
                    上一篇
                  </span>
                  <p className="mt-2 text-sm font-medium text-slate-200 transition-colors group-hover:text-neon-lime">
                    {prev.title}
                  </p>
                </Link>
              ) : (
                <span />
              )}

              {next ? (
                <Link
                  to={`/blog/${next.slug}`}
                  className="group rounded-2xl border border-white/[0.07] p-5 text-right transition-all duration-500 ease-expo-out hover:border-white/[0.16] hover:bg-white/[0.03] sm:col-start-2"
                >
                  <span className="font-mono text-[10px] uppercase tracking-[0.24em] text-slate-600">
                    下一篇
                  </span>
                  <p className="mt-2 text-sm font-medium text-slate-200 transition-colors group-hover:text-neon-lime">
                    {next.title}
                  </p>
                </Link>
              ) : null}
            </nav>

            <div className="mt-10 flex justify-center pb-4">
              <Link
                to="/blog"
                className="inline-flex items-center gap-2 rounded-full border border-white/[0.1] px-6 py-3 text-xs text-slate-400 transition-all duration-500 ease-expo-out hover:border-neon-lime/40 hover:text-white"
              >
                回到全部文章
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>
          </div>

          {/* 右侧 TOC（xl 起显示；无标题的文章不渲染） */}
          {outline.length ? (
            <aside className="hidden xl:block">
              <nav aria-label="目录" className="sticky top-32">
                <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-slate-600">
                  目录
                </p>
                <ul className="mt-4 flex flex-col gap-2.5 border-l border-white/[0.06]">
                  {outline.map(({ id, text }) => (
                    <li key={id}>
                      <a
                        href={`#${id}`}
                        className={`-ml-px block border-l-2 py-0.5 pl-4 text-xs leading-relaxed transition-colors duration-300 ${
                          activeId === id
                            ? 'border-neon-lime text-neon-lime'
                            : 'border-transparent text-slate-500 hover:text-slate-300'
                        }`}
                      >
                        {text}
                      </a>
                    </li>
                  ))}
                </ul>
              </nav>
            </aside>
          ) : null}
        </div>
      </div>
    </article>
  )
}
