import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, ExternalLink, Star, Quote } from 'lucide-react'
import SectionHeader from './ui/SectionHeader'

const EASE = [0.16, 1, 0.3, 1]
const FLIP_EASE = [0.22, 0.61, 0.36, 1]

/**
 * 藏书数据。
 * coverUrl 留空 → 使用程序化生成的封面（本机网络无法稳定取到外链封面图，
 * 生成式封面永不 404；若日后拿到图片地址，填入 coverUrl 即自动优先使用）。
 */
const books = [
  {
    id: 'longzu',
    title: '龙族',
    author: '江南',
    press: '人民文学出版社',
    year: '2010',
    rating: 5,
    spineClass: 'from-blue-700 via-blue-900 to-void-900',
    coverClass: 'from-blue-900 via-void-800 to-void-950',
    accent: '#3b82f6',
    quote: '有一种孤独，叫路明非。',
    description:
      '「世界很大，比我们想象的要大得多。」「有些路你和某人一起走，就长得离谱；你和另一个人走，就短得让人舍不得迈开脚步。」',
    searchUrl: 'https://search.douban.com/book/subject_search?search_text=%E9%BE%99%E6%97%8F%20%E6%B1%9F%E5%8D%97',
  },
  {
    id: 'norwegian-wood',
    title: '挪威的森林',
    author: '村上春树',
    press: '上海译文出版社',
    year: '1987',
    rating: 5,
    spineClass: 'from-emerald-700 via-emerald-900 to-void-900',
    coverClass: 'from-emerald-900 via-void-800 to-void-950',
    accent: '#10b981',
    quote: '死并非生的对立面，而作为生的一部分永存。',
    description:
      '「死并非生的对立面，而作为生的一部分永存。」「哪里会有人喜欢孤独，不过是不喜欢失望罢了。」',
    searchUrl: 'https://search.douban.com/book/subject_search?search_text=%E6%8C%AA%E5%A8%81%E7%9A%84%E6%A3%AE%E6%9E%97',
  },
  {
    id: 'akui',
    title: '恶意',
    author: '东野圭吾',
    press: '南海出版公司',
    year: '1996',
    rating: 5,
    spineClass: 'from-slate-600 via-slate-800 to-void-900',
    coverClass: 'from-slate-700 via-void-800 to-void-950',
    accent: '#94a3b8',
    quote: '恨一个人，可以毫无理由。',
    description:
      '「恨一个人，可以毫无理由。」——真正的谜题从来不是凶手，而是动机。',
    searchUrl: 'https://search.douban.com/book/subject_search?search_text=%E6%81%B6%E6%84%8F%20%E4%B8%9C%E9%87%8E%E5%9C%AD%E5%90%BE',
  },
  {
    id: 'brothers',
    title: '兄弟',
    author: '余华',
    press: '作家出版社',
    year: '2005',
    rating: 4,
    spineClass: 'from-amber-700 via-amber-900 to-void-900',
    coverClass: 'from-amber-900 via-void-800 to-void-950',
    accent: '#f59e0b',
    quote: '就是天翻地覆慨而慷了，我们还是兄弟。',
    description:
      '「就是天翻地覆慨而慷了，我们还是兄弟。」「就是生离死别了，我们还是兄弟。」',
    searchUrl: 'https://search.douban.com/book/subject_search?search_text=%E5%85%84%E5%BC%9F%20%E4%BD%99%E5%8D%8E',
  },
  {
    id: 'rebirth',
    title: '都重生了，谁还谈恋爱啊',
    author: '网络小说',
    press: '连载中',
    year: '—',
    rating: 4,
    spineClass: 'from-fuchsia-700 via-purple-900 to-void-900',
    coverClass: 'from-fuchsia-900 via-purple-950 to-void-950',
    accent: '#d946ef',
    quote: '书名是玩笑，野心不是。',
    description:
      '重生文里少见的清爽节奏。名句想摘，但怕剧透——等我读完这一卷再补上。',
    searchUrl: 'https://search.douban.com/book/subject_search?search_text=%E9%83%BD%E9%87%8D%E7%94%9F%E4%BA%86%E8%B0%81%E8%BF%98%E8%B0%88%E6%81%8B%E7%88%B1%E5%95%8A',
  },
]

/* ── 程序化生成的书籍封面 ───────────────────────────── */
function BookCover({ book }) {
  return (
    <div
      className={`relative flex h-full w-full flex-col justify-between overflow-hidden rounded-r-xl bg-gradient-to-br ${book.coverClass} px-8 py-9`}
    >
      {/* 纹理与光影 */}
      <div className="pointer-events-none absolute inset-0 bg-noise opacity-[0.07] mix-blend-overlay" />
      <div
        className="pointer-events-none absolute -left-1/3 top-1/4 h-64 w-64 rounded-full blur-3xl"
        style={{ backgroundColor: `${book.accent}33` }}
      />
      {/* 书脊侧阴影（书脊在左，靠中线） */}
      <div className="pointer-events-none absolute inset-y-0 left-0 w-10 bg-gradient-to-r from-black/50 to-transparent" />
      {/* 书脊装饰线 */}
      <div className="pointer-events-none absolute inset-y-6 left-4 w-px bg-white/[0.12]" />

      <span className="relative font-mono text-[10px] uppercase tracking-[0.32em] text-white/40">
        {book.press}
      </span>

      <h3 className="relative text-[2.6rem] font-bold leading-[1.1] text-white [writing-mode:vertical-rl]">
        {book.title}
      </h3>

      <div className="relative flex items-end justify-between">
        <span className="text-sm text-white/55">{book.author}</span>
        <span className="font-mono text-[10px] tracking-[0.2em] text-white/30">{book.year}</span>
      </div>
    </div>
  )
}

/* ── 书架上的书脊 ──────────────────────────────────── */
function Spine({ book, index, isActive, onOpen }) {
  return (
    <motion.button
      type="button"
      onClick={() => onOpen(book)}
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      animate={isActive ? { y: -30, opacity: 0 } : { y: 0, opacity: 1 }}
      transition={{ duration: 0.55, delay: isActive ? 0 : index * 0.07, ease: EASE }}
      whileHover={{ y: -14 }}
      aria-label={`取出《${book.title}》`}
      className="group relative h-[248px] w-[30px] shrink-0 cursor-pointer sm:w-[34px]"
    >
      {/* 背光 */}
      <span
        className="pointer-events-none absolute -inset-2 rounded-lg opacity-0 blur-xl transition-opacity duration-500 group-hover:opacity-60"
        style={{ backgroundColor: `${book.accent}55` }}
      />

      {/* 书脊本体 */}
      <span
        className={`relative flex h-full w-full items-center justify-center overflow-hidden rounded-sm border border-white/[0.08] bg-gradient-to-b ${book.spineClass} shadow-lg shadow-black/50 transition-shadow duration-500 group-hover:shadow-2xl`}
      >
        {/* 脊线 */}
        <span className="absolute inset-x-1 top-3 h-px bg-white/15" />
        <span className="absolute inset-x-1 top-4 h-px bg-black/30" />
        <span className="absolute inset-x-1 bottom-3 h-px bg-white/10" />
        <span className="absolute inset-x-1 bottom-4 h-px bg-black/25" />

        <span className="select-none text-[11px] font-semibold leading-tight tracking-[0.22em] text-white/85 [writing-mode:vertical-rl]">
          {book.title}
        </span>
      </span>

      {/* 底部投影 */}
      <span className="absolute inset-x-0 -bottom-1.5 h-2 rounded-full bg-black/50 blur-[3px]" />
    </motion.button>
  )
}

/* ── 取出 · 翻开 ──────────────────────────────────── */
function BookReader({ book, onClose }) {
  const [opened, setOpened] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => setOpened(true), 420)
    return () => clearTimeout(timer)
  }, [])

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onClose])

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4 }}
      className="fixed inset-0 z-[100] flex items-center justify-center px-4 py-16"
      role="dialog"
      aria-label={`${book.title} 详情`}
    >
      {/* 遮罩 */}
      <div
        className="absolute inset-0 bg-void-950/85 backdrop-blur-2xl"
        onClick={onClose}
        aria-hidden
      />

      {/* 书 */}
      <motion.div
        initial={{ opacity: 0, scale: 0.55, y: 130, rotateX: 22 }}
        animate={{ opacity: 1, scale: 1, y: 0, rotateX: 0 }}
        exit={{ opacity: 0, scale: 0.72, y: 80, rotateX: 12 }}
        transition={{ duration: 0.9, ease: EASE }}
        className="relative h-[min(74vh,520px)] w-[min(92vw,860px)] [perspective:2200px]"
      >
        <motion.div
          animate={{ x: opened ? '0%' : '-25%' }}
          transition={{ duration: 0.9, delay: opened ? 0.1 : 0, ease: EASE }}
          className="relative h-full w-full"
        >
          {/* 右页：书籍详情 */}
          <div className="absolute inset-y-0 right-0 flex w-1/2 flex-col overflow-hidden rounded-r-xl border border-l-0 border-white/[0.08] bg-gradient-to-b from-void-800 to-void-850">
            <div className="flex flex-1 flex-col overflow-y-auto px-6 py-7 sm:px-8 sm:py-8">
              <p className="font-mono text-[10px] uppercase tracking-[0.32em] text-ice-400/70">
                Book Detail
              </p>
              <h3 className="mt-4 text-2xl font-bold leading-snug text-white sm:text-3xl">
                {book.title}
              </h3>
              <p className="mt-2 text-sm text-slate-500">
                {book.author} · {book.press}
                {book.year !== '—' ? ` · ${book.year}` : ''}
              </p>

              <div className="mt-4 flex gap-1">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    className={`h-3.5 w-3.5 ${
                      i < book.rating ? 'fill-amber-400 text-amber-400' : 'text-slate-700'
                    }`}
                  />
                ))}
              </div>

              <div className="my-6 flex items-start gap-3 border-y border-white/[0.06] py-5">
                <Quote className="mt-0.5 h-3.5 w-3.5 shrink-0 text-ice-400/60" />
                <p className="text-[13px] italic leading-relaxed text-slate-400">{book.quote}</p>
              </div>

              <p className="text-[14px] leading-[1.85] text-slate-400">{book.description}</p>
            </div>

            {/* 底部链接 */}
            <div className="flex items-center justify-between gap-3 border-t border-white/[0.06] px-6 py-5 sm:px-8">
              <a
                href={book.searchUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="group inline-flex items-center gap-2 rounded-full bg-white px-5 py-2.5 text-xs font-semibold text-void-950 transition-all duration-500 ease-expo-out hover:shadow-[0_0_36px_-8px_rgba(56,189,248,0.9)]"
              >
                查看封面与详情
                <ExternalLink className="h-3.5 w-3.5 transition-transform duration-500 ease-expo-out group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
              </a>
              <button
                type="button"
                onClick={onClose}
                className="rounded-full border border-white/10 px-4 py-2.5 text-xs text-slate-400 transition-colors duration-300 hover:border-white/20 hover:text-white"
              >
                合上
              </button>
            </div>
          </div>

          {/* 左页：封面（可翻转） */}
          <motion.div
            animate={{ rotateY: opened ? -168 : 0 }}
            transition={{ duration: 1.15, delay: 0.5, ease: FLIP_EASE }}
            className="absolute inset-y-0 right-0 w-1/2 origin-left [transform-style:preserve-3d]"
          >
            {/* 封面正面 */}
            <div className="absolute inset-0 [backface-visibility:hidden]">
              <BookCover book={book} />
            </div>

            {/* 封面背面 → 翻开后成为左内页 */}
            <div className="absolute inset-0 overflow-hidden rounded-l-xl border border-white/[0.06] bg-gradient-to-br from-void-800 to-void-850 [backface-visibility:hidden] [transform:rotateY(180deg)]">
              <div className="pointer-events-none absolute inset-0 bg-noise opacity-[0.04] mix-blend-overlay" />
              <div className="flex h-full flex-col justify-between p-8">
                <span className="font-mono text-[10px] uppercase tracking-[0.32em] text-slate-600">
                  Ex Libris
                </span>
                <p className="text-2xl font-semibold leading-snug text-slate-300">{book.quote}</p>
                <span className="font-mono text-[10px] tracking-[0.25em] text-slate-600">
                  {book.author}
                </span>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </motion.div>

      {/* 关闭 */}
      <button
        type="button"
        onClick={onClose}
        aria-label="关闭"
        className="absolute right-6 top-6 z-20 grid h-10 w-10 place-items-center rounded-full border border-white/10 bg-white/[0.03] text-slate-400 backdrop-blur-sm transition-all duration-300 hover:border-white/25 hover:text-white"
      >
        <X className="h-4 w-4" />
      </button>
    </motion.div>
  )
}

/* ── 区块 ─────────────────────────────────────────── */
export default function Bookshelf() {
  const [selected, setSelected] = useState(null)

  return (
    <section id="bookshelf" className="relative py-28 lg:py-40">
      <div className="mx-auto max-w-shell px-6 md:px-10 lg:px-16">
        <SectionHeader
          index="02"
          label="Bookshelf"
          title={
            <>
              精选
              <span className="bg-gradient-to-r from-ice-300 to-indigo-400 bg-clip-text text-transparent">
                藏书
              </span>
            </>
          }
          description="点一下书脊，把书取出来。"
        />

        {/* 书架 */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 1, delay: 0.1, ease: EASE }}
          className="relative mt-20"
        >
          {/* 背光 */}
          <div className="pointer-events-none absolute -inset-x-10 -top-10 bottom-0 rounded-[36px] bg-[radial-gradient(ellipse_60%_50%_at_50%_50%,rgba(99,102,241,0.07),transparent_70%)] blur-2xl" />

          <div className="relative overflow-hidden rounded-3xl border border-white/[0.05] bg-gradient-to-b from-void-850/70 to-void-900/40 backdrop-blur-sm">
            {/* 顶板 */}
            <div className="flex h-10 items-center justify-center border-b border-white/[0.04] bg-gradient-to-b from-void-700/50 to-transparent">
              <div className="flex gap-1.5">
                {Array.from({ length: 7 }).map((_, i) => (
                  <span key={i} className="h-1 w-1 rounded-full bg-white/10" />
                ))}
              </div>
            </div>

            {/* 书 */}
            <div className="flex items-end justify-center gap-4 px-6 pb-0 pt-12 sm:gap-7">
              {books.map((book, index) => (
                <Spine
                  key={book.id}
                  book={book}
                  index={index}
                  isActive={selected?.id === book.id}
                  onOpen={setSelected}
                />
              ))}
            </div>

            {/* 隔板 */}
            <div className="relative">
              <div className="h-px bg-gradient-to-r from-transparent via-white/15 to-transparent" />
              <div className="h-4 bg-gradient-to-b from-void-600/70 to-void-800 shadow-shelf" />
              <div className="h-8 bg-gradient-to-b from-black/40 to-transparent blur-sm" />
            </div>
          </div>
        </motion.div>
      </div>

      <AnimatePresence>
        {selected ? (
          <BookReader book={selected} onClose={() => setSelected(null)} />
        ) : null}
      </AnimatePresence>
    </section>
  )
}
