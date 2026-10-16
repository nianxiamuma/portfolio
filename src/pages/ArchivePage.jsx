import { Link } from 'react-router-dom'
import { sortedPosts, readingMinutes, wordCount } from '../data/posts'

/** 按年份分组的文章数据：[{ year, posts: [...] }]，年份倒序 */
export function groupByYear(posts) {
  const map = new Map()
  for (const post of posts) {
    const year = post.date.slice(0, 4)
    if (!map.has(year)) map.set(year, [])
    map.get(year).push(post)
  }
  return [...map.entries()]
    .sort((a, b) => (a[0] < b[0] ? 1 : -1))
    .map(([year, list]) => ({ year, posts: list }))
}

/** 归档页：按年份时间线（对标 Yuimi Lab 的 timeline archive） */
export default function ArchivePage() {
  const groups = groupByYear(sortedPosts())

  return (
    <div className="pt-28 md:pt-32">
      <div className="mx-auto max-w-shell px-6 md:px-10 lg:px-16">
        <header>
          <div className="flex items-center gap-4">
            <span className="font-mono text-[10px] tracking-[0.2em] text-neon-lime/70">09</span>
            <span className="h-px w-8 bg-white/15" />
            <span className="font-mono text-[10px] uppercase tracking-[0.42em] text-slate-500">
              Archive
            </span>
          </div>
          <h1 className="mt-6 text-[clamp(2.2rem,5vw,4rem)] font-bold leading-[1.04] tracking-tightest text-white">
            归档
            <span className="bg-gradient-to-r from-neon-lime to-neon-mint bg-clip-text text-transparent">
              时间线
            </span>
          </h1>
          <p className="mt-5 max-w-xl text-sm leading-relaxed text-slate-500">
            全部文章按年份排布，越往上越新。
          </p>
        </header>

        <div className="mt-14 pb-24">
          {groups.map(({ year, posts }) => (
            <section key={year} className="relative border-l border-white/[0.08] pl-6 md:pl-8">
              <h2 className="sticky top-24 -ml-6 inline-block rounded-full border border-white/[0.08] bg-void-950/80 px-4 py-1.5 font-mono text-sm tracking-[0.2em] text-neon-lime backdrop-blur-sm md:-ml-8">
                {year}
                <span className="ml-2 text-[10px] text-slate-600">{posts.length} 篇</span>
              </h2>

              <ul className="mt-6 flex flex-col gap-1 pb-10">
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
                      <span className="ml-auto hidden font-mono text-[10px] tracking-[0.1em] text-slate-700 sm:inline">
                        {wordCount(post)} 字 · {readingMinutes(post)} 分钟
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            </section>
          ))}
        </div>
      </div>
    </div>
  )
}
