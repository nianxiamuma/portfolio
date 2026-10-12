import { useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowUpRight } from 'lucide-react'
import { allCategories, readingMinutes, sortedPosts, wordCount } from '../data/posts'

/** 文章列表：卡片流 + 分类筛选（卡片样式参考 rainzt.cn） */
export default function BlogPage() {
  const [active, setActive] = useState('全部')
  const categories = ['全部', ...allCategories()]
  const posts = sortedPosts().filter((p) => active === '全部' || p.category === active)

  return (
    <div className="pt-28 md:pt-32">
      <div className="mx-auto max-w-shell px-6 md:px-10 lg:px-16">
        <header>
          <div className="flex items-center gap-4">
            <span className="font-mono text-[10px] tracking-[0.2em] text-neon-lime/70">07</span>
            <span className="h-px w-8 bg-white/15" />
            <span className="font-mono text-[10px] uppercase tracking-[0.42em] text-slate-500">
              Writing
            </span>
          </div>
          <h1 className="mt-6 text-[clamp(2.2rem,5vw,4rem)] font-bold leading-[1.04] tracking-tightest text-white">
            写下来的
            <span className="bg-gradient-to-r from-neon-lime to-neon-mint bg-clip-text text-transparent">
              东西
            </span>
          </h1>
          <p className="mt-5 max-w-xl text-sm leading-relaxed text-slate-500">
            建站记录、书单、零散想法。没有固定更新频率。
          </p>
        </header>

        {/* 分类筛选 */}
        <div className="mt-10 flex flex-wrap gap-2">
          {categories.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setActive(cat)}
              className={`rounded-full border px-4 py-1.5 font-mono text-[11px] transition-all duration-500 ease-expo-out ${
                active === cat
                  ? 'border-neon-lime/50 bg-neon-lime/10 text-neon-lime'
                  : 'border-white/[0.08] text-slate-500 hover:border-white/20 hover:text-white'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* 卡片流 */}
        {posts.length ? (
          <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {posts.map((post) => (
              <Link
                key={post.slug}
                to={`/blog/${post.slug}`}
                className="group flex flex-col overflow-hidden rounded-2xl border border-white/[0.07] bg-white/[0.02] transition-all duration-500 ease-expo-out hover:border-white/[0.16] hover:bg-white/[0.04]"
              >
                {/* 封面（无图则用主题色渐变） */}
                <div className="relative h-40 overflow-hidden bg-void-900">
                  {post.cover ? (
                    <img
                      src={post.cover}
                      alt=""
                      className="h-full w-full object-cover transition-transform duration-700 ease-expo-out group-hover:scale-105"
                    />
                  ) : (
                    <div
                      className="h-full w-full"
                      style={{
                        background: `linear-gradient(140deg, ${post.accent}3d, transparent 72%)`,
                      }}
                    />
                  )}
                  <div className="absolute inset-0 bg-grid-faint [background-size:28px_28px] opacity-40" />

                  <span
                    className="absolute left-4 top-4 rounded-full border bg-void-950/50 px-2.5 py-1 font-mono text-[10px] backdrop-blur-sm"
                    style={{ borderColor: `${post.accent}66`, color: post.accent }}
                  >
                    {post.category}
                  </span>

                  <ArrowUpRight className="absolute right-4 top-4 h-4 w-4 text-white/50 transition-all duration-500 ease-expo-out group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-white" />
                </div>

                <div className="flex flex-1 flex-col p-5">
                  <h2 className="text-base font-semibold leading-snug text-white transition-colors duration-300 group-hover:text-neon-lime">
                    {post.title}
                  </h2>
                  <p className="mt-2.5 line-clamp-2 text-xs leading-relaxed text-slate-500">
                    {post.summary}
                  </p>

                  <div className="mt-auto flex flex-wrap items-center gap-2 pt-5 font-mono text-[10px] tracking-[0.1em] text-slate-600">
                    <span>{post.date}</span>
                    <span className="text-slate-700">·</span>
                    <span>{wordCount(post)} 字</span>
                    <span className="text-slate-700">·</span>
                    <span>{readingMinutes(post)} 分钟</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <p className="mt-16 text-center text-sm text-slate-600">这个分类下暂时没有内容。</p>
        )}
      </div>
    </div>
  )
}
