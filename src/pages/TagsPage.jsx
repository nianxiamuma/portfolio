import { useMemo } from 'react'
import { Link, useParams } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'
import { POSTS, sortedPosts } from '../data/posts'

/** 全部标签 → [{ tag, count }]，按文章数降序 */
export function allTags() {
  const map = new Map()
  for (const post of POSTS) {
    for (const tag of post.tags) {
      map.set(tag, (map.get(tag) || 0) + 1)
    }
  }
  return [...map.entries()]
    .map(([tag, count]) => ({ tag, count }))
    .sort((a, b) => b.count - a.count || a.tag.localeCompare(b.tag))
}

/** 标签总览：字号随文章数变化的标签云 */
export default function TagsPage() {
  const tags = useMemo(allTags, [])
  const max = tags[0]?.count || 1

  return (
    <div className="pt-28 md:pt-32">
      <div className="mx-auto max-w-shell px-6 md:px-10 lg:px-16">
        <header>
          <div className="flex items-center gap-4">
            <span className="font-mono text-[10px] tracking-[0.2em] text-neon-lime/70">10</span>
            <span className="h-px w-8 bg-white/15" />
            <span className="font-mono text-[10px] uppercase tracking-[0.42em] text-slate-500">
              Tags
            </span>
          </div>
          <h1 className="mt-6 text-[clamp(2.2rem,5vw,4rem)] font-bold leading-[1.04] tracking-tightest text-white">
            标签
            <span className="bg-gradient-to-r from-neon-lime to-neon-mint bg-clip-text text-transparent">
              云
            </span>
          </h1>
          <p className="mt-5 max-w-xl text-sm leading-relaxed text-slate-500">
            点一个标签，看它串起来的文章。
          </p>
        </header>

        <div className="mt-14 flex flex-wrap items-baseline gap-x-5 gap-y-4 pb-24">
          {tags.map(({ tag, count }) => (
            <Link
              key={tag}
              to={`/tags/${encodeURIComponent(tag)}`}
              className="group font-mono transition-colors duration-300 hover:text-neon-lime"
              style={{ fontSize: `${0.9 + (count / max) * 1.1}rem` }}
            >
              <span className="text-slate-300 group-hover:text-neon-lime">{tag}</span>
              <span className="ml-1.5 text-[10px] text-slate-600">{count}</span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}

/** 单标签文章列表：/tags/:tag */
export function TagPage() {
  const { tag } = useParams()
  const decoded = decodeURIComponent(tag || '')
  const posts = sortedPosts().filter((post) => post.tags.includes(decoded))

  return (
    <div className="pt-28 md:pt-32">
      <div className="mx-auto max-w-3xl px-6 md:px-10">
        <Link
          to="/tags"
          className="group inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.24em] text-slate-500 transition-colors duration-300 hover:text-white"
        >
          <ArrowLeft className="h-3.5 w-3.5 transition-transform duration-500 ease-expo-out group-hover:-translate-x-1" />
          All tags
        </Link>

        <h1 className="mt-8 text-[clamp(1.8rem,4vw,2.8rem)] font-bold tracking-tightest text-white">
          #{decoded}
        </h1>
        <p className="mt-3 font-mono text-[11px] tracking-[0.1em] text-slate-600">
          {posts.length} 篇文章
        </p>

        <ul className="mt-10 flex flex-col gap-1 pb-24">
          {posts.map((post) => (
            <li key={post.slug}>
              <Link
                to={`/blog/${post.slug}`}
                className="group flex flex-wrap items-baseline gap-x-4 gap-y-1 rounded-xl px-3 py-2.5 transition-colors duration-300 hover:bg-white/[0.03]"
              >
                <time className="font-mono text-[11px] tracking-[0.1em] text-slate-600">
                  {post.date}
                </time>
                <span className="text-sm text-slate-300 transition-colors duration-300 group-hover:text-neon-lime">
                  {post.title}
                </span>
              </Link>
            </li>
          ))}
          {posts.length === 0 ? (
            <li className="px-3 py-8 text-center text-xs text-slate-600">这个标签下还没有文章。</li>
          ) : null}
        </ul>
      </div>
    </div>
  )
}
