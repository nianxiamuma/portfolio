import { useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import { ChevronDown, Images, RotateCcw } from 'lucide-react'

import SectionHeader from '../components/ui/SectionHeader'
import { cn } from '../lib/utils'
import {
  GLIMMER_ALBUMS,
  GLIMMER_CATEGORIES,
  GLIMMER_CATEGORY_TONES,
  GLIMMER_NOTES,
  GLIMMER_STATS,
  GLIMMER_YEARS,
} from '../data/glimmer'

const ALL = 'all'
const EASE = [0.16, 1, 0.3, 1]

/** hsl 拼装：生成式画布上的颜色全部由色相算出，不引用任何图片 */
const hsl = (hue, saturation, lightness, alpha) =>
  alpha === undefined
    ? `hsl(${hue} ${saturation}% ${lightness}%)`
    : `hsl(${hue} ${saturation}% ${lightness}% / ${alpha})`

/** 底色：两团光晕 + 一条深色渐变，保证上面的几何图形压得住 */
function artBackdrop(hue) {
  const drift = (hue + 46) % 360
  return {
    backgroundImage: [
      `radial-gradient(120% 92% at 20% 16%, ${hsl(hue, 88, 62, 0.42)}, transparent 60%)`,
      `radial-gradient(96% 96% at 84% 90%, ${hsl(drift, 80, 58, 0.3)}, transparent 58%)`,
      `linear-gradient(155deg, ${hsl(hue, 42, 13)} 0%, ${hsl(drift, 34, 8)} 56%, #04050a 100%)`,
    ].join(', '),
  }
}

/** 几何母题 → 图形层。hue 决定色相，shape 决定构图。 */
const SHAPE_LAYERS = {
  rings: (hue) => (
    <>
      <span
        className="absolute left-1/2 top-1/2 aspect-square w-[58%] -translate-x-1/2 -translate-y-1/2 rounded-full border"
        style={{ borderColor: hsl(hue, 92, 72, 0.5) }}
      />
      <span
        className="absolute left-1/2 top-1/2 aspect-square w-[36%] -translate-x-1/2 -translate-y-1/2 rounded-full border"
        style={{ borderColor: hsl(hue, 92, 78, 0.34) }}
      />
      <span
        className="absolute left-1/2 top-1/2 aspect-square w-[13%] -translate-x-1/2 -translate-y-1/2 rounded-full"
        style={{ backgroundColor: hsl(hue, 94, 66, 0.6) }}
      />
    </>
  ),
  streaks: (hue) => (
    <div className="absolute inset-0 -skew-x-12">
      {[16, 38, 60, 82].map((left, i) => (
        <span
          key={left}
          className="absolute top-0 h-full w-[7%]"
          style={{
            left: `${left}%`,
            backgroundImage: `linear-gradient(180deg, transparent, ${hsl(
              hue + i * 14,
              90,
              68,
              0.5,
            )}, transparent)`,
          }}
        />
      ))}
    </div>
  ),
  grid: (hue) => (
    <span
      className="absolute inset-0"
      style={{
        backgroundImage: `linear-gradient(${hsl(hue, 80, 70, 0.16)} 1px, transparent 1px), linear-gradient(90deg, ${hsl(
          hue,
          80,
          70,
          0.16,
        )} 1px, transparent 1px)`,
        backgroundSize: '18px 18px',
      }}
    />
  ),
  arc: (hue) => (
    <>
      <span
        className="absolute -bottom-[44%] -right-[16%] aspect-square w-[104%] rounded-full border-2"
        style={{ borderColor: hsl(hue, 88, 70, 0.36) }}
      />
      <span
        className="absolute -left-[22%] -top-[30%] aspect-square w-[68%] rounded-full"
        style={{ backgroundColor: hsl(hue + 30, 86, 60, 0.22), filter: 'blur(18px)' }}
      />
    </>
  ),
  dots: (hue) => (
    <span
      className="absolute inset-0"
      style={{
        backgroundImage: `radial-gradient(circle, ${hsl(hue, 90, 72, 0.45)} 1.4px, transparent 1.6px)`,
        backgroundSize: '16px 16px',
      }}
    />
  ),
  prism: (hue) => (
    <>
      <span
        className="absolute left-1/2 top-1/2 h-[62%] w-[62%] -translate-x-1/2 -translate-y-1/2"
        style={{
          backgroundImage: `conic-gradient(from 210deg at 50% 50%, ${hsl(
            hue,
            90,
            66,
            0.45,
          )}, transparent 42%, ${hsl(hue + 40, 84, 60, 0.32)} 78%, transparent)`,
          clipPath: 'polygon(50% 0%, 100% 100%, 0% 100%)',
        }}
      />
      <span
        className="absolute left-[16%] top-[18%] h-2 w-2 rounded-full"
        style={{ backgroundColor: hsl(hue + 20, 94, 74, 0.8) }}
      />
    </>
  ),
}

/** 生成式画布：CSS 渐变 + 几何图形，替代所有相册图片 */
function GeneratedArt({ hue, shape = 'rings', className = '' }) {
  const layers = SHAPE_LAYERS[shape] || SHAPE_LAYERS.rings
  return (
    <div
      className={cn('relative isolate overflow-hidden bg-void-950', className)}
      aria-hidden="true"
    >
      <div className="absolute inset-0" style={artBackdrop(hue)} />
      <div className="absolute inset-0 bg-noise opacity-[0.12] mix-blend-overlay" />
      {layers(hue)}
      <span className="pointer-events-none absolute inset-0 rounded-[inherit] ring-1 ring-inset ring-white/10" />
    </div>
  )
}

function FilterChip({ active, accent = '#edff66', onClick, children }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={cn(
        'rounded-full border px-3.5 py-1.5 font-mono text-[10px] tracking-[0.22em] transition-all duration-300 ease-expo-out',
        active
          ? 'border-transparent text-void-950'
          : 'border-white/[0.07] text-slate-500 hover:border-white/[0.16] hover:text-slate-300',
      )}
      style={active ? { backgroundColor: accent, boxShadow: `0 0 28px -8px ${accent}` } : undefined}
    >
      {children}
    </button>
  )
}

function AlbumCard({ album, open, onToggle }) {
  return (
    <button
      type="button"
      onClick={() => onToggle(album.id)}
      aria-expanded={open}
      className={cn(
        'group relative rounded-2xl border bg-void-900 p-3 text-left transition-all duration-500 ease-expo-out',
        open
          ? 'border-white/[0.16]'
          : 'border-white/[0.07] hover:-translate-y-1 hover:border-white/[0.16]',
      )}
      style={open ? { boxShadow: `0 30px 70px -34px ${album.accent}` } : undefined}
    >
      <div className="relative">
        <GeneratedArt
          hue={album.hue}
          shape={album.shape}
          className="aspect-[4/3] w-full rounded-xl"
        />
        <span className="absolute right-3 top-3 grid h-7 w-7 place-items-center rounded-full border border-white/15 bg-void-950/60 backdrop-blur">
          <ChevronDown
            className={cn(
              'h-3.5 w-3.5 text-slate-300 transition-transform duration-500 ease-expo-out',
              open && 'rotate-180',
            )}
          />
        </span>
      </div>

      <div className="flex items-start justify-between gap-3 px-1 pt-4">
        <div>
          <h3 className="text-base font-semibold text-white">{album.title}</h3>
          <p className="mt-1 font-mono text-[10px] uppercase tracking-[0.3em] text-slate-500">
            {album.label}
          </p>
        </div>
        <span className="mt-1 inline-flex items-center gap-1.5 font-mono text-[11px] text-slate-400">
          <Images className="h-3.5 w-3.5" style={{ color: album.accent }} />
          {album.photos.length}
        </span>
      </div>

      <p className="px-1 pb-1.5 pt-3 text-xs leading-relaxed text-slate-500">{album.desc}</p>
    </button>
  )
}

export default function GlimmerPage() {
  const [openAlbumId, setOpenAlbumId] = useState(GLIMMER_ALBUMS[0].id)
  const [year, setYear] = useState(ALL)
  const [category, setCategory] = useState(ALL)

  const openAlbum = GLIMMER_ALBUMS.find((album) => album.id === openAlbumId) || null

  const notes = useMemo(
    () =>
      GLIMMER_NOTES.filter(
        (note) =>
          (year === ALL || note.year === year) && (category === ALL || note.category === category),
      ),
    [year, category],
  )

  const filtering = year !== ALL || category !== ALL

  return (
    <div className="relative overflow-hidden bg-void-950">
      {/* 环境光 */}
      <div className="pointer-events-none absolute inset-0" aria-hidden="true">
        <div className="absolute -left-[18%] top-[-12%] h-[52vw] w-[52vw] animate-drift-slow rounded-full bg-[radial-gradient(circle,rgba(124,92,255,0.22),transparent_62%)] blur-[110px]" />
        <div className="absolute -right-[16%] top-[26%] h-[46vw] w-[46vw] animate-drift-medium rounded-full bg-[radial-gradient(circle,rgba(237,255,102,0.12),transparent_62%)] blur-[120px]" />
        <div className="absolute inset-0 bg-grid-faint [background-size:64px_64px] opacity-30" />
      </div>

      {/* 顶部留出浮动导航（fixed top-3 + h-14/h-16）的高度 */}
      <div className="relative mx-auto max-w-shell px-6 pb-24 pt-28 md:px-10 md:pt-32 lg:px-16 lg:pb-36">
        <header className="max-w-3xl">
          <div className="flex items-center gap-4">
            <span className="font-mono text-[10px] tracking-[0.2em] text-neon-lime/70">
              Glimmer
            </span>
            <span className="h-px w-8 bg-white/15" />
            <span className="font-mono text-[10px] uppercase tracking-[0.42em] text-slate-500">
              Album &amp; Notes
            </span>
          </div>

          <h1 className="mt-7 text-[clamp(2.4rem,7vw,5rem)] font-bold leading-[1.02] tracking-tightest text-white">
            浮光
            <span className="bg-gradient-to-r from-neon-lime to-neon-violet bg-clip-text text-transparent">
              集
            </span>
          </h1>

          <p className="mt-6 max-w-xl text-sm leading-relaxed text-slate-500">
            一面收相册里的颜色，一面摊开没说出口的短句。封面、照片、时间线都由这个页面现画现写，不带任何外部图片。
          </p>

          <p className="mt-6 font-mono text-[11px] tracking-[0.22em] text-slate-600">
            {GLIMMER_STATS.albumCount} 册 · {GLIMMER_STATS.photoCount} 张 ·{' '}
            {GLIMMER_STATS.noteCount} 条碎语
          </p>
        </header>

        {/* 相册集 */}
        <section className="mt-20 lg:mt-28" aria-label="相册集">
          <SectionHeader
            index="01"
            label="Album Shelf"
            title="相册集"
            description="封面和照片都是现画的——一层渐变，加几个几何图形。点开一本，格子会铺在下面。"
          />

          <div className="mt-10 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {GLIMMER_ALBUMS.map((album) => (
              <AlbumCard
                key={album.id}
                album={album}
                open={album.id === openAlbumId}
                onToggle={(id) => setOpenAlbumId((current) => (current === id ? null : id))}
              />
            ))}
          </div>

          {/* 展开面板：靠 key 重挂载做进场；切换即时可见，不等离场动画 */}
          <>
            {openAlbum ? (
              <motion.div
                key={openAlbum.id}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.45, ease: EASE }}
                className="mt-6 rounded-2xl border border-white/[0.07] bg-void-900/70 p-5 md:p-6"
              >
                <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
                  <span
                    className="h-2 w-2 rounded-full"
                    style={{
                      backgroundColor: openAlbum.accent,
                      boxShadow: `0 0 12px ${openAlbum.accent}`,
                    }}
                  />
                  <h3 className="text-sm font-semibold text-white">{openAlbum.title}</h3>
                  <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-slate-500">
                    {openAlbum.label}
                  </span>
                  <span className="font-mono text-[11px] text-slate-500">
                    {openAlbum.photos.length} 张
                  </span>
                  <button
                    type="button"
                    onClick={() => setOpenAlbumId(null)}
                    className="nav-hover-btn ml-auto"
                  >
                    收起
                  </button>
                </div>

                <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
                  {openAlbum.photos.map((photo) => (
                    <figure
                      key={photo.id}
                      className="group/photo relative overflow-hidden rounded-xl border border-white/[0.07]"
                    >
                      <GeneratedArt
                        hue={photo.hue}
                        shape={photo.shape}
                        className="aspect-square w-full transition-transform duration-700 ease-expo-out group-hover/photo:scale-[1.04]"
                      />
                      <figcaption className="pointer-events-none absolute inset-x-0 bottom-0 bg-gradient-to-t from-void-950/90 to-transparent px-3 pb-2.5 pt-8 font-mono text-[10px] tracking-[0.16em] text-slate-300">
                        {photo.title}
                      </figcaption>
                    </figure>
                  ))}
                </div>
              </motion.div>
            ) : (
              <motion.p
                key="collapsed"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.45, ease: EASE }}
                className="mt-6 rounded-2xl border border-dashed border-white/[0.1] px-5 py-6 text-xs leading-relaxed text-slate-500"
              >
                四本相册都收起来了。点一张封面，把里面的颜色铺开。
              </motion.p>
            )}
          </>
        </section>

        {/* 碎语 */}
        <section className="mt-20 lg:mt-28" aria-label="碎语">
          <SectionHeader
            index="02"
            label="All Notes"
            title="碎语"
            description="短句按时间往下排。年份和分类可以筛，筛完还剩几条就是几条。"
          />

          <div className="mt-10 flex flex-wrap items-center gap-2">
            <FilterChip active={year === ALL} onClick={() => setYear(ALL)}>
              全部年份
            </FilterChip>
            {GLIMMER_YEARS.map((item) => (
              <FilterChip
                key={item}
                active={year === item}
                onClick={() => setYear(year === item ? ALL : item)}
              >
                {item}
              </FilterChip>
            ))}

            <span className="mx-1 hidden h-4 w-px bg-white/10 sm:block" />

            <FilterChip
              active={category === ALL}
              accent="#7c5cff"
              onClick={() => setCategory(ALL)}
            >
              全部分类
            </FilterChip>
            {GLIMMER_CATEGORIES.map((item) => (
              <FilterChip
                key={item}
                active={category === item}
                accent={GLIMMER_CATEGORY_TONES[item] || '#edff66'}
                onClick={() => setCategory(category === item ? ALL : item)}
              >
                {item}
              </FilterChip>
            ))}

            {filtering ? (
              <button
                type="button"
                onClick={() => {
                  setYear(ALL)
                  setCategory(ALL)
                }}
                className="ml-1 inline-flex items-center gap-1.5 rounded-full border border-white/[0.07] px-3 py-1.5 font-mono text-[10px] tracking-[0.2em] text-slate-500 transition-colors duration-300 hover:border-white/[0.16] hover:text-slate-300"
              >
                <RotateCcw className="h-3 w-3" />
                重置
              </button>
            ) : null}

            <span className="ml-auto font-mono text-[11px] tracking-[0.2em] text-slate-600">
              {notes.length} / {GLIMMER_STATS.noteCount} 条
            </span>
          </div>

          <div className="relative mt-12">
            <span
              className="absolute bottom-2 left-[5px] top-2 w-px bg-gradient-to-b from-neon-violet/50 via-white/10 to-transparent"
              aria-hidden="true"
            />

            <ol className="space-y-9">
              {notes.map((note) => {
                const tone = GLIMMER_CATEGORY_TONES[note.category] || '#edff66'
                return (
                  <li key={note.id} className="relative pl-8">
                    <span
                      className="absolute left-0 top-2 h-2.5 w-2.5 rounded-full"
                      style={{ backgroundColor: tone, boxShadow: `0 0 14px ${tone}` }}
                      aria-hidden="true"
                    />

                    <div className="flex flex-wrap items-center gap-3">
                      <time
                        dateTime={`${note.year}-${note.date.replace('.', '-')}`}
                        className="font-mono text-[11px] tracking-[0.2em] text-slate-400"
                      >
                        {note.year} · {note.date}
                      </time>
                      <span
                        className="rounded-full border px-2.5 py-0.5 font-mono text-[10px] tracking-[0.18em]"
                        style={{ borderColor: `${tone}55`, color: tone }}
                      >
                        {note.category}
                      </span>
                    </div>

                    <p className="mt-3 font-serif text-[15px] leading-relaxed text-slate-200 md:text-base">
                      {note.line}
                    </p>
                  </li>
                )
              })}
            </ol>

            {notes.length === 0 ? (
              <p className="pl-8 text-sm leading-relaxed text-slate-500">
                这一组合下没有留下句子，换个筛选看看。
              </p>
            ) : null}
          </div>
        </section>
      </div>
    </div>
  )
}
