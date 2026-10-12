import { useState, useEffect, useRef, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  X, BookOpen, Bookmark, BookmarkCheck, ChevronLeft, ChevronRight,
  List, Home, RotateCcw, Moon, Sun, Search, ArrowLeft,
} from 'lucide-react'

export default function NovelReader({ book, onClose }) {
  const [view, setView] = useState('toc') // 'toc' | 'reading'
  const [activeVolume, setActiveVolume] = useState(0)
  const [activeChapter, setActiveChapter] = useState(0)
  const [chapterContent, setChapterContent] = useState('')
  const [bookmarks, setBookmarks] = useState([])
  const [loading, setLoading] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [fontSize, setFontSize] = useState(16)
  const [theme, setTheme] = useState('dark') // 'dark' | 'light' | 'sepia'
  const contentRef = useRef(null)

  // Load manifest
  const [manifest, setManifest] = useState(null)
  useEffect(() => {
    fetch('/novel-manifest.json')
      .then(r => r.json())
      .then(setManifest)
      .catch(() => setManifest({ volumes: [], title: book.title }))
  }, [book.title])

  // Load bookmarks from localStorage
  useEffect(() => {
    const key = `bookmarks-${book.id}`
    const saved = localStorage.getItem(key)
    if (saved) setBookmarks(JSON.parse(saved))
  }, [book.id])

  // Load chapter content
  const loadChapter = useCallback(async (volIdx, chIdx) => {
    if (!manifest?.volumes) return
    const vol = manifest.volumes[volIdx]
    if (!vol?.chapters?.length) return
    setLoading(true)
    setChapterContent('')

    try {
      const res = await fetch('/novel.txt')
      if (!res.ok) throw new Error('File not found')
      const text = await res.text()

      const chTitle = vol.chapters[chIdx]
      const startIdx = text.indexOf(chTitle)
      if (startIdx === -1) {
        setChapterContent('章节内容未找到。请确保 novel.txt 文件位于 public/ 目录下。')
        setLoading(false)
        return
      }

      const nextChTitle = chIdx + 1 < vol.chapters.length
        ? vol.chapters[chIdx + 1]
        : (volIdx + 1 < manifest.volumes.length && manifest.volumes[volIdx + 1]?.chapters?.length > 0)
          ? manifest.volumes[volIdx + 1].chapters[0]
          : null

      let endIdx
      if (nextChTitle) {
        endIdx = text.indexOf(nextChTitle, startIdx + chTitle.length)
      }
      if (!endIdx || endIdx === -1) {
        endIdx = text.length
      }

      const rawContent = text.slice(startIdx, endIdx).trim()
      const contentLines = rawContent.split('\n')
      // Remove the chapter title line and any preceding blank lines
      const titleIdx = contentLines.findIndex(l => l.trim() === chTitle)
      const bodyLines = titleIdx >= 0 ? contentLines.slice(titleIdx + 1) : contentLines
      setChapterContent(bodyLines.join('\n').trim())
    } catch {
      setChapterContent('无法加载小说文件。请将 TXT 文件复制到 public/novel.txt。')
    }
    setLoading(false)
  }, [manifest])

  // Navigate to a chapter
  const navigateToChapter = (volIdx, chIdx) => {
    setActiveVolume(volIdx)
    setActiveChapter(chIdx)
    setView('reading')
    if (manifest?.volumes) {
      loadChapter(volIdx, chIdx)
    }
  }

  // Next chapter
  const nextChapter = () => {
    if (!manifest?.volumes) return
    const vol = manifest.volumes[activeVolume]
    if (activeChapter + 1 < vol.chapters.length) {
      navigateToChapter(activeVolume, activeChapter + 1)
    } else if (activeVolume + 1 < manifest.volumes.length) {
      // Only go to next volume if it has chapters
      for (let i = activeVolume + 1; i < manifest.volumes.length; i++) {
        if (manifest.volumes[i].chapters?.length > 0) {
          navigateToChapter(i, 0)
          return
        }
      }
    }
  }

  // Previous chapter
  const prevChapter = () => {
    if (!manifest?.volumes) return
    if (activeChapter > 0) {
      navigateToChapter(activeVolume, activeChapter - 1)
    } else if (activeVolume > 0) {
      for (let i = activeVolume - 1; i >= 0; i--) {
        const prevVol = manifest.volumes[i]
        if (prevVol.chapters?.length > 0) {
          navigateToChapter(i, prevVol.chapters.length - 1)
          return
        }
      }
    }
  }

  // Toggle bookmark
  const toggleBookmark = () => {
    const key = `${activeVolume}-${activeChapter}`
    const newBookmarks = bookmarks.includes(key)
      ? bookmarks.filter(b => b !== key)
      : [...bookmarks, key]

    setBookmarks(newBookmarks)
    localStorage.setItem(`bookmarks-${book.id}`, JSON.stringify(newBookmarks))
  }

  // Keyboard shortcuts
  useEffect(() => {
    const handleKey = (e) => {
      if (view !== 'reading') return
      if (e.key === 'ArrowLeft') prevChapter()
      if (e.key === 'ArrowRight') nextChapter()
      if (e.key === 'Escape') setView('toc')
    }
    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [view, activeVolume, activeChapter, manifest])

  // Search chapters
  const filteredChapters = manifest?.volumes?.map(vol => ({
    ...vol,
    chapters: vol.chapters?.filter(ch =>
      ch.toLowerCase().includes(searchTerm.toLowerCase())
    ) || [],
  })) || []

  const isBookmarked = bookmarks.includes(`${activeVolume}-${activeChapter}`)
  const currentChapterTitle = manifest?.volumes?.[activeVolume]?.chapters?.[activeChapter] || ''
  const currentVolumeTitle = manifest?.volumes?.[activeVolume]?.title || ''

  const themeColors = {
    dark: 'bg-[#0a0a14] text-slate-200',
    light: 'bg-white text-slate-800',
    sepia: 'bg-[#f5f0e8] text-[#5b4636]',
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[110] flex items-center justify-center"
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/85 backdrop-blur-lg" onClick={onClose} />

      {/* Reader Container */}
      <motion.div
        initial={{ opacity: 0, scale: 0.92, y: 30 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.92, y: 30 }}
        transition={{ duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
        className="relative z-10 w-full h-full max-w-5xl flex flex-col bg-[#0a0a14] border border-white/[0.06] overflow-hidden shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* === TOP BAR === */}
        <div className="h-12 flex items-center justify-between px-4 border-b border-white/[0.05] bg-white/[0.01] flex-shrink-0">
          {/* Left */}
          <div className="flex items-center gap-3">
            <button
              onClick={view === 'reading' ? () => setView('toc') : onClose}
              className="w-8 h-8 rounded-lg bg-white/[0.03] border border-white/[0.05] flex items-center justify-center text-slate-400 hover:text-white hover:bg-white/[0.06] transition-all"
            >
              {view === 'reading' ? <List className="w-4 h-4" /> : <ArrowLeft className="w-4 h-4" />}
            </button>
            <div className="text-xs text-slate-400 truncate max-w-[200px]">
              {view === 'reading' ? currentChapterTitle : book.title}
            </div>
          </div>

          {/* Center - reading progress */}
          {view === 'reading' && (
            <div className="hidden sm:flex items-center gap-2 text-[10px] text-slate-600">
              <span>{currentVolumeTitle}</span>
              <span>·</span>
              <span>章节 {activeChapter + 1}</span>
            </div>
          )}

          {/* Right */}
          <div className="flex items-center gap-1">
            {view === 'reading' && (
              <>
                {/* Font size */}
                <button onClick={() => setFontSize(Math.max(14, fontSize - 2))} className="w-7 h-7 rounded flex items-center justify-center text-xs text-slate-500 hover:text-white">A-</button>
                <button onClick={() => setFontSize(Math.min(24, fontSize + 2))} className="w-7 h-7 rounded flex items-center justify-center text-sm text-slate-500 hover:text-white">A+</button>
                <div className="w-px h-4 bg-white/[0.06] mx-1" />

                {/* Theme */}
                <button onClick={() => setTheme('dark')} className={`w-7 h-7 rounded flex items-center justify-center ${theme === 'dark' ? 'text-indigo-400' : 'text-slate-600 hover:text-white'}`}>
                  <Moon className="w-3.5 h-3.5" />
                </button>
                <button onClick={() => setTheme('light')} className={`w-7 h-7 rounded flex items-center justify-center ${theme === 'light' ? 'text-indigo-400' : 'text-slate-600 hover:text-white'}`}>
                  <Sun className="w-3.5 h-3.5" />
                </button>
                <div className="w-px h-4 bg-white/[0.06] mx-1" />

                {/* Bookmark */}
                <button onClick={toggleBookmark} className="w-7 h-7 rounded flex items-center justify-center hover:text-amber-400 transition-colors">
                  {isBookmarked ? <BookmarkCheck className="w-3.5 h-3.5 text-amber-400" /> : <Bookmark className="w-3.5 h-3.5 text-slate-600 hover:text-white" />}
                </button>
              </>
            )}

            {/* Close */}
            <button onClick={onClose} className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:text-white hover:bg-white/[0.04] transition-all ml-1">
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* === MAIN CONTENT === */}
        <div className={`flex-1 overflow-hidden ${themeColors[theme]}`}>
          <AnimatePresence mode="wait">
            {view === 'toc' ? (
              /* === TABLE OF CONTENTS === */
              <motion.div
                key="toc"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="h-full overflow-y-auto"
              >
                {/* Cover & Info */}
                <div className="relative p-8 pb-0">
                  <div className="flex gap-6">
                    {/* Cover thumbnail */}
                    <div className="w-24 h-36 rounded-xl overflow-hidden border border-white/[0.08] bg-gradient-to-br from-indigo-900 to-purple-900 flex-shrink-0 shadow-xl">
                      <img
                        src={book.coverUrl}
                        alt={book.title}
                        className="w-full h-full object-cover"
                        onError={(e) => { e.target.style.display = 'none' }}
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h2 className="text-xl font-bold text-white mb-1">{book.title}</h2>
                      <p className="text-xs text-slate-500 mb-3">作者：{book.author} · 已完结 · 共179万字</p>
                      <p className="text-sm text-slate-400 leading-relaxed line-clamp-4">
                        {book.description}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Search */}
                <div className="px-8 mt-6">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-600" />
                    <input
                      type="text"
                      placeholder="搜索章节名称..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full h-10 pl-9 pr-4 rounded-xl bg-white/[0.03] border border-white/[0.06] text-sm text-slate-300 placeholder-slate-600 outline-none focus:border-indigo-500/30 transition-colors"
                    />
                  </div>
                </div>

                {/* Bookmarks section */}
                {bookmarks.length > 0 && (
                  <div className="px-8 mt-6">
                    <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-widest mb-3 flex items-center gap-2">
                      <BookmarkCheck className="w-3 h-3 text-amber-400" /> 书签
                    </h4>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                      {bookmarks.map(bm => {
                        const [v, c] = bm.split('-').map(Number)
                        const vol = manifest?.volumes?.[v]
                        const ch = vol?.chapters?.[c]
                        if (!ch) return null
                        return (
                          <button
                            key={bm}
                            onClick={() => navigateToChapter(v, c)}
                            className="text-left px-3 py-2 rounded-lg bg-amber-500/5 border border-amber-500/15 text-xs text-slate-300 hover:bg-amber-500/10 transition-all truncate"
                          >
                            {ch}
                          </button>
                        )
                      })}
                    </div>
                  </div>
                )}

                {/* Volumes & Chapters */}
                <div className="px-8 py-6 space-y-6">
                  {(searchTerm ? filteredChapters : manifest?.volumes || []).map((vol, vIdx) => {
                    if (!vol.chapters?.length) return null
                    return (
                      <div key={vIdx}>
                        <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3 flex items-center gap-2">
                          <Home className="w-3 h-3" />
                          {vol.title}
                          <span className="text-slate-600 font-normal">({vol.chapters.length}章)</span>
                        </h4>
                        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-1.5">
                          {vol.chapters.map((ch, cIdx) => {
                            const key = `${vIdx}-${cIdx}`
                            const isBm = bookmarks.includes(key)
                            return (
                              <button
                                key={cIdx}
                                onClick={() => navigateToChapter(vIdx, cIdx)}
                                className="text-left px-3 py-2 rounded-lg text-xs text-slate-400 hover:text-white hover:bg-white/[0.04] transition-all truncate flex items-center gap-1.5 group"
                              >
                                {isBm && <BookmarkCheck className="w-2.5 h-2.5 text-amber-400 flex-shrink-0" />}
                                <span className="truncate">{ch}</span>
                              </button>
                            )
                          })}
                        </div>
                      </div>
                    )
                  })}
                  {(!manifest?.volumes || manifest.volumes.every(v => !v.chapters?.length)) && (
                    <div className="text-center py-20 text-slate-500 text-sm">
                      <BookOpen className="w-10 h-10 mx-auto mb-3 text-slate-700" />
                      <p>请将小说文件复制到</p>
                      <code className="text-xs text-indigo-400 mt-1">portfolio/public/novel.txt</code>
                    </div>
                  )}
                </div>
              </motion.div>
            ) : (
              /* === READING VIEW === */
              <motion.div
                key="reading"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="h-full flex flex-col"
              >
                {/* Chapter header */}
                <div className="px-8 pt-6 pb-2 text-center border-b border-slate-700/20 mx-8">
                  <p className="text-xs text-slate-500 mb-1">{currentVolumeTitle}</p>
                  <h3 className="text-lg font-bold">{currentChapterTitle}</h3>
                </div>

                {/* Content */}
                <div
                  ref={contentRef}
                  className="flex-1 overflow-y-auto px-8 py-6"
                  style={{ fontSize: `${fontSize}px` }}
                >
                  {loading ? (
                    <div className="flex items-center justify-center h-40">
                      <div className="w-6 h-6 border-2 border-indigo-500/30 border-t-indigo-500 rounded-full animate-spin" />
                    </div>
                  ) : (
                    <div className="max-w-2xl mx-auto leading-[2] tracking-wide">
                      {chapterContent.split('\n').map((line, i) => {
                        const trimmed = line.trim()
                        if (!trimmed) return <br key={i} />
                        if (trimmed.startsWith('　　')) {
                          return <p key={i} className="indent-8 mb-1">{trimmed}</p>
                        }
                        return <p key={i} className="mb-1">{trimmed}</p>
                      })}
                    </div>
                  )}
                </div>

                {/* Bottom navigation */}
                <div className="h-12 flex items-center justify-between px-4 border-t border-slate-700/20 bg-white/[0.01] flex-shrink-0">
                  <button
                    onClick={prevChapter}
                    className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs text-slate-500 hover:text-white hover:bg-white/[0.04] transition-all"
                  >
                    <ChevronLeft className="w-3.5 h-3.5" /> 上一章
                  </button>

                  <div className="flex items-center gap-3">
                    <button onClick={() => setView('toc')} className="w-7 h-7 rounded flex items-center justify-center text-slate-600 hover:text-white transition-colors">
                      <List className="w-3.5 h-3.5" />
                    </button>
                    <button onClick={toggleBookmark} className={`w-7 h-7 rounded flex items-center justify-center transition-colors ${isBookmarked ? 'text-amber-400' : 'text-slate-600 hover:text-white'}`}>
                      {isBookmarked ? <BookmarkCheck className="w-3.5 h-3.5" /> : <Bookmark className="w-3.5 h-3.5" />}
                    </button>
                    <span className="text-[10px] text-slate-600">
                      {activeChapter + 1} / {manifest?.volumes?.[activeVolume]?.chapters?.length || '?'}
                    </span>
                  </div>

                  <button
                    onClick={nextChapter}
                    className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs text-slate-500 hover:text-white hover:bg-white/[0.04] transition-all"
                  >
                    下一章 <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Keyboard hints */}
        <div className="h-6 flex items-center justify-center gap-3 text-[9px] text-slate-600 bg-white/[0.005] border-t border-white/[0.03] px-4">
          {view === 'reading' ? (
            <>
              <span>← 上一章</span>
              <span>→ 下一章</span>
              <span>Esc 返回目录</span>
              <span className="text-slate-700">|</span>
              <span>字体: A-/A+ 调整</span>
              <span>主题: ☾/☀ 切换</span>
            </>
          ) : (
            <span>点击任意章节开始阅读 · 方向键翻页</span>
          )}
        </div>
      </motion.div>
    </motion.div>
  )
}
