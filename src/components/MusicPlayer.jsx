import { useCallback, useEffect, useRef, useState } from 'react'
import { Disc3, Pause, Play, Repeat, Repeat1, SkipBack, SkipForward, X } from 'lucide-react'

import VinylRecord from './VinylRecord'
import { MUSIC_TRACKS, trackSrc } from '../data/music'

/**
 * 老式唱机风格的背景音乐播放器。
 *
 * 交互：
 *   - 点 Navbar 的音符按钮打开/收起
 *   - 唱片在转盘上转（播放时），唱臂落针/抬起
 *   - 唱片架里点一首切歌；在唱片上左右拖动也能换片（滑动换唱片）
 *   - 上一首 / 播放暂停 / 下一首 / 单曲循环
 *
 * 关于自动播放：浏览器策略要求先有用户手势才允许出声，所以这里不做「开站自动播」，
 * 必须用户点一次播放 —— 这不是 bug，是平台限制。
 */
const SWIPE_THRESHOLD = 48

export default function MusicPlayer({ open, onClose, onPlayingChange }) {
  const [index, setIndex] = useState(0)
  const [playing, setPlaying] = useState(false)
  const [loopOne, setLoopOne] = useState(false)
  const audioRef = useRef(null)
  const dragRef = useRef(null)

  const track = MUSIC_TRACKS[index] || null

  // 把播放状态透给 Navbar 的律动指示条
  useEffect(() => {
    onPlayingChange?.(playing)
  }, [playing, onPlayingChange])

  useEffect(() => {
    const audio = audioRef.current
    if (!audio || !track) return
    if (!playing) {
      audio.pause()
      return
    }
    // play() 在真实浏览器返回 Promise，但并非所有环境都如此（jsdom 返回 undefined）。
    // 两种都接得住 —— 直接 .catch() 会在那种环境整棵子树崩掉。
    try {
      const result = audio.play()
      if (result && typeof result.catch === 'function') {
        result.catch(() => setPlaying(false))
      }
    } catch {
      setPlaying(false)
    }
  }, [playing, track])

  const go = useCallback((delta) => {
    if (!MUSIC_TRACKS.length) return
    setIndex((prev) => (prev + delta + MUSIC_TRACKS.length) % MUSIC_TRACKS.length)
  }, [])

  useEffect(() => {
    if (!open) return undefined
    const onKey = (e) => {
      if (e.key === 'Escape') onClose?.()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open, onClose])

  /* 在唱片上左右拖动换片 */
  const onPointerDown = (e) => {
    dragRef.current = { id: e.pointerId, x: e.clientX }
    e.currentTarget.setPointerCapture?.(e.pointerId)
  }
  const onPointerUp = (e) => {
    const drag = dragRef.current
    dragRef.current = null
    if (!drag || drag.id !== e.pointerId) return
    const dx = e.clientX - drag.x
    if (Math.abs(dx) < SWIPE_THRESHOLD) return
    go(dx < 0 ? 1 : -1)
  }

  if (!track) return null

  return (
    <>
      {/* 收起时的常驻唱机入口由 Navbar 提供，这里只在打开时渲染面板 */}
      {open ? (
        <div className="fixed inset-0 z-[80] flex items-end justify-center p-4 md:items-center md:p-6">
          <button
            type="button"
            aria-label="关闭播放器"
            onClick={onClose}
            className="absolute inset-0 cursor-default bg-void-950/70 backdrop-blur-md"
          />

          <div
            data-testid="music-panel"
            className="relative w-full max-w-3xl overflow-hidden rounded-3xl border border-white/[0.09] bg-void-900/95 shadow-[0_40px_120px_-40px_rgba(0,0,0,0.95)]"
          >
            <div className="flex items-center justify-between border-b border-white/[0.06] px-5 py-3">
              <div className="flex items-center gap-2">
                <Disc3 className="h-4 w-4 text-neon-lime" />
                <span className="font-mono text-[10px] uppercase tracking-[0.32em] text-slate-400">
                  Turntable
                </span>
              </div>
              <button
                type="button"
                onClick={onClose}
                aria-label="关闭"
                className="p-1.5 text-slate-500 transition-colors hover:text-white"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="grid gap-6 p-5 md:grid-cols-[minmax(0,260px)_1fr] md:p-7">
              {/* 唱盘 */}
              <div className="flex flex-col items-center">
                <div
                  onPointerDown={onPointerDown}
                  onPointerUp={onPointerUp}
                  onPointerCancel={onPointerUp}
                  className="relative w-full max-w-[240px] cursor-grab touch-none select-none active:cursor-grabbing"
                  title="左右拖动换唱片"
                >
                  <VinylRecord
                    title={track.title}
                    artist={track.artist}
                    playing={playing}
                    className="w-full"
                  />
                  {/* 唱臂：播放时落到盘面，暂停时抬起 */}
                  <div
                    className="pointer-events-none absolute -right-2 -top-2 h-16 w-16 origin-top-right transition-transform duration-700 ease-expo-out"
                    style={{ transform: playing ? 'rotate(-24deg)' : 'rotate(-6deg)' }}
                    aria-hidden
                  >
                    <div className="ml-auto h-1.5 w-14 rounded-full bg-gradient-to-r from-slate-500 to-slate-300" />
                    <div className="ml-auto h-3 w-3 rounded-full bg-slate-200 shadow" />
                  </div>
                </div>

                <p className="mt-4 text-center text-sm font-semibold text-white">{track.title}</p>
                <p className="mt-1 text-center font-mono text-[10px] uppercase tracking-[0.28em] text-slate-500">
                  {track.artist}
                </p>
              </div>

              {/* 控制 + 唱片架 */}
              <div className="flex min-w-0 flex-col">
                <div className="flex items-center justify-center gap-3">
                  <button
                    type="button"
                    onClick={() => go(-1)}
                    aria-label="上一首"
                    className="grid h-10 w-10 place-items-center rounded-full border border-white/10 text-slate-300 transition-colors hover:border-white/30 hover:text-white"
                  >
                    <SkipBack className="h-4 w-4" />
                  </button>

                  <button
                    type="button"
                    onClick={() => setPlaying((v) => !v)}
                    aria-label={playing ? '暂停' : '播放'}
                    className="grid h-14 w-14 place-items-center rounded-full bg-neon-lime text-void-950 transition-shadow hover:shadow-glow-lime"
                  >
                    {playing ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5" />}
                  </button>

                  <button
                    type="button"
                    onClick={() => go(1)}
                    aria-label="下一首"
                    className="grid h-10 w-10 place-items-center rounded-full border border-white/10 text-slate-300 transition-colors hover:border-white/30 hover:text-white"
                  >
                    <SkipForward className="h-4 w-4" />
                  </button>

                  <button
                    type="button"
                    onClick={() => setLoopOne((v) => !v)}
                    aria-pressed={loopOne}
                    aria-label={loopOne ? '单曲循环' : '列表循环'}
                    className={`grid h-10 w-10 place-items-center rounded-full border transition-colors ${
                      loopOne
                        ? 'border-neon-lime/50 text-neon-lime'
                        : 'border-white/10 text-slate-400 hover:text-white'
                    }`}
                  >
                    {loopOne ? <Repeat1 className="h-4 w-4" /> : <Repeat className="h-4 w-4" />}
                  </button>
                </div>

                {/* 唱片架 */}
                <ul className="mt-6 min-h-0 flex-1 space-y-1 overflow-y-auto pr-1" aria-label="唱片架">
                  {MUSIC_TRACKS.map((item, i) => (
                    <li key={item.id}>
                      <button
                        type="button"
                        onClick={() => {
                          setIndex(i)
                          setPlaying(true)
                        }}
                        aria-current={i === index}
                        className={`flex w-full items-center gap-3 rounded-xl px-3 py-2 text-left transition-colors ${
                          i === index
                            ? 'bg-white/[0.08] text-white'
                            : 'text-slate-400 hover:bg-white/[0.04] hover:text-white'
                        }`}
                      >
                        <span
                          className={`h-1.5 w-1.5 shrink-0 rounded-full ${
                            i === index ? 'bg-neon-lime' : 'bg-slate-600'
                          }`}
                        />
                        <span className="min-w-0 flex-1 truncate text-sm">{item.title}</span>
                        <span className="shrink-0 font-mono text-[10px] tracking-[0.18em] text-slate-600">
                          {item.artist}
                        </span>
                      </button>
                    </li>
                  ))}
                </ul>

                <p className="mt-4 font-mono text-[10px] leading-relaxed tracking-[0.14em] text-slate-600">
                  在唱片上左右拖动可换片 · 音频需放在 public/music/
                </p>
              </div>
            </div>

            <audio
              ref={audioRef}
              src={trackSrc(track)}
              loop={loopOne}
              preload="metadata"
              onEnded={() => {
                if (!loopOne) go(1)
              }}
              className="hidden"
            />
          </div>
        </div>
      ) : null}
    </>
  )
}
