import { Link, useParams } from 'react-router-dom'
import { ArrowLeft, ArrowRight } from 'lucide-react'
import { getPost, readingMinutes, sortedPosts, wordCount } from '../data/posts'

/** 文章详情：正文段落 + 上一篇/下一篇 */
export default function PostPage() {
  const { slug } = useParams()
  const post = getPost(slug)

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

  const paragraphs = post.body.split('\n\n').filter((p) => p.trim())
  const ordered = sortedPosts()
  const index = ordered.findIndex((p) => p.slug === post.slug)
  const prev = ordered[index + 1]
  const next = ordered[index - 1]

  return (
    <article className="pt-28 md:pt-32">
      <div className="mx-auto max-w-3xl px-6 md:px-10">
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
              <span
                key={tag}
                className="rounded-md bg-white/[0.04] px-2 py-1 font-mono text-[10px] uppercase tracking-[0.14em] text-slate-500"
              >
                {tag}
              </span>
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
        <div className="mt-10 space-y-6">
          {paragraphs.map((text, i) => (
            <p key={i} className="text-[15px] leading-[1.95] text-slate-300">
              {text}
            </p>
          ))}
        </div>

        {/* 上下篇 */}
        <nav className="mt-20 grid gap-4 border-t border-white/[0.06] pt-8 sm:grid-cols-2">
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
    </article>
  )
}
