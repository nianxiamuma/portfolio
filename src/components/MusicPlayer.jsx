import { useCallback, useEffect, useRef, useState } from 'react'
import { Disc3, Pause, Play, Repeat, Repeat1, SkipBack, SkipForward, Volume2, VolumeX, X } from 'lucide-react'

import VinylRecord from './VinylRecord'
import { MUSIC_TRACKS, trackSrc } from '../data/music'

/**
 * 老式唱机风格的背景音乐播放器。
 *
 * 关键设计：**<audio> 挂在面板外面**，面板只是它的一个视图。
 * 早先的写法把 audio 放在面板里，一关面板整个组件卸载、歌就断了 ——
 * 用户明确要求「开启后退出来也要能继续播」。
 *
 * 交互：
 *   - 点 Navbar 音符按钮开合面板；关掉面板继续放
 *   - 唱片在转盘上转（播放时），唱臂落针/抬起
 *   - 进度条可拖动跳转
 *   - 唱片架点选切歌；在唱片上左右拖动也能换片
 *   - 上一首 / 播放暂停 / 下一首 / 单曲循环 / 音量
 *
 * 关于自动播放：浏览器策略要求先有用户手势才允许出声，所以不做「开站自动播」。
 */
const SWIPE_THRESHOLD = 48

const formatTime = (seconds) => {
  if (!Number.isFinite(seconds) || seconds < 0) return '0:00'
  const m = Math.floor(seconds / 60)
  const s = Math.floor(seconds % 60)
  return `${m}:${String(s).padStart(2, '0')}`
}

export default function MusicPlayer({ open, onClose, onPlayingChange }) {
  const [index, setIndex] = useState(0)
  const [playing, setPlaying] = useState(false)
  const [loopOne, setLoopOne] = useState(false)
  const [muted, setMuted] = useState(false)
  const [progress, setProgress] = useState({ current: 0, duration: 0 })
  const audioRef = useRef(null)
  const dragRef = useRef(null)

  const track = MUSIC_TRACKS[index] || null

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

  useEffect(() => {
    if (audioRef.current) audioRef.current.muted = muted
  }, [muted])

  const go = useCallback((delta) => {
    if (!MUSIC_TRACKS.length) return
    setProgress({ current: 0, duration: 0 })
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

  const onSeek = (e) => {
    const audio = audioRef.current
    const next = Number(e.target.value)
    if (audio && Number.isFinite(next)) audio.currentTime = next
    setProgress((p) => ({ ...p, current: next }))
  }

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

  const ratio = progress.duration > 0 ? progress.current / progress.duration : 0

  return (
    <>
      {/*
        音频元素永远挂着，且与面板显隐无关 —— 这样关掉面板、切路由都不会中断播放。
        Navbar 常驻在 SiteLayout 里，所以整个会话期间它一直在。
      */}
      <audio
        ref={audioRef}
        src={trackSrc(track)}
        loop={loopOne}
        preload="metadata"
        onTimeUpdate={(e) =>
          setProgress({ current: e.currentTarget.currentTime, duration: e.currentTarget.duration || 0 })
        }
        onLoadedMetadata={(e) =>
          setProgress((p) => ({ ...p, duration: e.currentTarget.duration || 0 }))
        }
        onEnded={() => {
          if (!loopOne) go(1)
        }}
        className="hidden"
      />

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
                {playing ? (
                  <span className="ml-2 font-mono text-[10px] tracking-[0.18em] text-neon-lime/80">
                    播放中 · 关掉面板不会停
                  </span>
                ) : null}
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
                  <VinylRecord title={track.title} artist={track.artist} playing={playing} className="w-full" />
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

              {/* 控制 + 进度 + 唱片架 */}
              <div className="flex min-w-0 flex-col">
                {/* 进度条 */}
                <div className="mb-5">
                  <input
                    type="range"
                    min={0}
                    max={progress.duration || 0}
                    step="0.1"
                    value={Math.min(progress.current, progress.duration || 0)}
                    onChange={onSeek}
                    aria-label="播放进度"
                    className="h-1 w-full cursor-pointer appearance-none rounded-full bg-white/10 accent-neon-lime [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-neon-lime"
                    style={{
                      background: `linear-gradient(90deg, #edff66 ${ratio * 100}%, rgba(255,255,255,0.1) ${ratio * 100}%)`,
                    }}
                  />
                  <div className="mt-1.5 flex justify-between font-mono text-[10px] tracking-[0.14em] text-slate-500">
                    <span>{formatTime(progress.current)}</span>
                    <span>{formatTime(progress.duration)}</span>
                  </div>
                </div>

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

                  <button
                    type="button"
                    onClick={() => setMuted((v) => !v)}
                    aria-pressed={muted}
                    aria-label={muted ? '取消静音' : '静音'}
                    className={`grid h-10 w-10 place-items-center rounded-full border transition-colors ${
                      muted
                        ? 'border-neon-pink/50 text-neon-pink'
                        : 'border-white/10 text-slate-400 hover:text-white'
                    }`}
                  >
                    {muted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
                  </button>
                </div>

                {/* 唱片架 */}
                <ul className="mt-6 min-h-0 flex-1 space-y-1 overflow-y-auto pr-1" aria-label="唱片架">
                  {MUSIC_TRACKS.map((item, i) => (
                    <li key={item.id}>
                      <button
                        type="button"
                        onClick={() => {
                          setProgress({ current: 0, duration: 0 })
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
                  在唱片上左右拖动可换片 · 关掉面板继续播放 · 音频需放在 public/music/
                </p>
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </>
  )
}
