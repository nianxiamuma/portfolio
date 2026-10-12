import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowRight, RotateCcw, X } from 'lucide-react'
import { MAX_NUMBER, digitsOf, prizeForNumber } from '../lib/slotMachine'

const ROLL_INTERVAL = 90
const ROLL_DURATION = 1100
const REELS = ['HUN', 'TEN', 'ONE']

/**
 * SOURCE SLOT：一台决定「接下来看什么」的街机。
 * 拉动拉杆 → 三位数字滚动 → 落地后按号码档位给出一个去处。
 */
export default function Contact() {
  const [digits, setDigits] = useState(['0', '0', '0'])
  const [rolling, setRolling] = useState(false)
  const [result, setResult] = useState(null)
  const [history, setHistory] = useState([])
  const drawingRef = useRef(false)
  const timerRef = useRef(null)
  const navigate = useNavigate()

  useEffect(() => () => clearInterval(timerRef.current), [])

  const draw = () => {
    if (drawingRef.current) return
    drawingRef.current = true
    setRolling(true)
    setResult(null)

    const number = Math.floor(Math.random() * (MAX_NUMBER + 1))
    const target = digitsOf(number)
    const startedAt = Date.now()

    timerRef.current = setInterval(() => {
      if (Date.now() - startedAt >= ROLL_DURATION) {
        clearInterval(timerRef.current)
        setDigits(target)
        setRolling(false)
        drawingRef.current = false
        const prize = prizeForNumber(number)
        setResult({ number, prize })
        setHistory((prev) => [{ number, prize }, ...prev].slice(0, 8))
        return
      }
      setDigits(Array.from({ length: 3 }, () => String(Math.floor(Math.random() * 10))))
    }, ROLL_INTERVAL)
  }

  return (
    <section id="slot" data-bg-scene="home-slot" className="relative py-24 lg:py-36">
      <div className="mx-auto max-w-shell px-6 md:px-10 lg:px-16">
        <header className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
          <div>
            <div className="flex items-center gap-4">
              <span className="font-mono text-[10px] tracking-[0.2em] text-neon-lime/70">05</span>
              <span className="h-px w-8 bg-white/15" />
              <span className="font-mono text-[10px] uppercase tracking-[0.42em] text-slate-500">
                Fortune
              </span>
            </div>
            <h2 className="mt-6 text-[clamp(1.9rem,4vw,3.4rem)] font-bold leading-[1.06] tracking-tightest text-white">
              让机器
              <span className="bg-gradient-to-r from-neon-lime to-neon-mint bg-clip-text text-transparent">
                替你决定
              </span>
            </h2>
          </div>
          <p className="max-w-sm text-sm leading-relaxed text-slate-500">
            不知道先看哪页？拉一下，0–998 随便抽一个。
          </p>
        </header>

        {/* 街机 */}
        <div className="mx-auto mt-16 max-w-3xl">
          <div className="relative overflow-hidden rounded-3xl border border-white/[0.09] bg-void-900 p-6 md:p-10">
            <div className="pointer-events-none absolute -top-1/3 left-1/2 h-[38vw] w-[38vw] -translate-x-1/2 rounded-full bg-[radial-gradient(circle,rgba(124,92,255,0.28),transparent_62%)] blur-[90px]" />
            <div className="absolute inset-0 bg-grid-faint [background-size:48px_48px] opacity-30" />

            <div className="relative">
              {/* marquee */}
              <div className="flex items-center justify-center gap-3">
                <span className="h-px flex-1 bg-gradient-to-r from-transparent to-neon-lime/40" />
                <span className="font-mono text-[10px] uppercase tracking-[0.5em] text-neon-lime/80">
                  Source Slot
                </span>
                <span className="h-px flex-1 bg-gradient-to-l from-transparent to-neon-lime/40" />
              </div>

              {/* 卷轴 */}
              <div className="mt-8 grid grid-cols-3 gap-3 md:gap-5">
                {digits.map((d, i) => (
                  <div
                    key={REELS[i]}
                    className="relative overflow-hidden rounded-2xl border border-white/[0.08] bg-void-950/80 py-6 text-center md:py-9"
                  >
                    <span
                      className={`block font-mono text-[clamp(2.6rem,7vw,4.6rem)] font-bold leading-none transition-colors duration-300 ${
                        rolling ? 'text-slate-500' : 'text-white'
                      }`}
                    >
                      {d}
                    </span>
                    <span className="mt-3 block font-mono text-[9px] uppercase tracking-[0.34em] text-slate-600">
                      {REELS[i]}
                    </span>
                    {rolling ? (
                      <span className="pointer-events-none absolute inset-x-0 top-0 h-full bg-gradient-to-b from-transparent via-white/[0.06] to-transparent animate-scanline" />
                    ) : null}
                  </div>
                ))}
              </div>

              {/* 拉杆 */}
              <div className="mt-8 flex flex-col items-center gap-4">
                <button
                  type="button"
                  onClick={draw}
                  disabled={rolling}
                  className="group inline-flex items-center gap-3 rounded-full bg-neon-lime px-9 py-4 text-xs font-bold uppercase tracking-[0.24em] text-void-950 transition-all duration-500 ease-expo-out hover:shadow-glow-lime disabled:cursor-wait disabled:opacity-70"
                >
                  {rolling ? 'Rolling…' : 'Start'}
                  {rolling ? (
                    <RotateCcw className="h-4 w-4 animate-spin" />
                  ) : (
                    <ArrowRight className="h-4 w-4 transition-transform duration-500 group-hover:translate-x-1" />
                  )}
                </button>

                {history.length ? (
                  <div className="flex flex-wrap items-center justify-center gap-2">
                    <span className="font-mono text-[10px] uppercase tracking-[0.24em] text-slate-600">
                      history
                    </span>
                    {history.map((h, i) => (
                      <span
                        key={`${h.number}-${i}`}
                        className="rounded-full border border-white/[0.08] px-2.5 py-0.5 font-mono text-[10px] text-slate-500"
                      >
                        {String(h.number).padStart(3, '0')}
                      </span>
                    ))}
                  </div>
                ) : null}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 结果 */}
      {result ? (
        <div className="fixed inset-0 z-[90] flex items-center justify-center p-6">
          <div
            className="absolute inset-0 bg-void-950/85 backdrop-blur-xl"
            onClick={() => setResult(null)}
          />
          <div className="relative w-full max-w-md rounded-3xl border border-white/[0.09] bg-void-900 p-8 text-center animate-fade-rise">
            <button
              type="button"
              onClick={() => setResult(null)}
              aria-label="关闭"
              className="absolute right-5 top-5 text-slate-500 transition-colors hover:text-white"
            >
              <X className="h-4 w-4" />
            </button>

            <p className="font-mono text-[10px] uppercase tracking-[0.42em] text-slate-500">
              {String(result.number).padStart(3, '0')}
            </p>
            <h3
              className="mt-5 text-4xl font-bold tracking-tightest"
              style={{ color: result.prize.accent }}
            >
              {result.prize.label}
            </h3>
            <p className="mt-4 text-sm text-slate-400">{result.prize.desc}</p>

            <button
              type="button"
              onClick={() => {
                const to = result.prize.to
                setResult(null)
                navigate(to)
              }}
              className="mt-8 inline-flex items-center gap-2 rounded-full bg-white px-7 py-3.5 text-xs font-semibold text-void-950 transition-all duration-500 ease-expo-out hover:shadow-glow-lime"
            >
              去这里
              <ArrowRight className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      ) : null}
    </section>
  )
}
