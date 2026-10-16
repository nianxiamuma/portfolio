import { useEffect, useState } from 'react'
import { Clock, CalendarDays, Quote } from 'lucide-react'
import { greetingFor, yearProgress, clockText, dateText } from '../lib/timeParts'
import { slipOfDay, todayStr } from '../lib/dailySlip'

/**
 * 站点小部件条（对标 imsyy/home 的时钟与时光进度条）：挂在 Hero 主文案层底部。
 *
 * 性能纪律（一期 fps 实测：常驻定时器/动画是掉帧真源）：
 * - 时钟 interval 每秒一次、仅更新文本节点；document.hidden 时暂停
 * - 时光进度条是静态细线，不跑动画（prefers-reduced-motion 同样静态）
 * - 今日一句按日期哈希取值，渲染期一次计算，无 interval
 */
export default function SiteWidgets() {
  const [now, setNow] = useState(() => new Date())

  useEffect(() => {
    let timer = 0
    const start = () => {
      clearInterval(timer)
      timer = window.setInterval(() => setNow(new Date()), 1000)
    }
    const onVisibility = () => {
      if (document.hidden) clearInterval(timer)
      else start()
    }
    start()
    document.addEventListener('visibilitychange', onVisibility)
    return () => {
      clearInterval(timer)
      document.removeEventListener('visibilitychange', onVisibility)
    }
  }, [])

  const progress = yearProgress(now)
  const slip = slipOfDay(todayStr(now))

  return (
    <div
      data-testid="site-widgets"
      className="pointer-events-auto flex flex-col gap-3 font-mono text-[10px] uppercase tracking-[0.24em] text-white/45 sm:flex-row sm:flex-wrap sm:items-center sm:gap-x-6"
    >
      {/* 时钟 + 问候 */}
      <span className="inline-flex items-center gap-2">
        <Clock className="h-3 w-3" aria-hidden />
        <span data-testid="widget-clock" suppressHydrationWarning>
          {clockText(now)}
        </span>
        <span className="text-white/30">{greetingFor(now.getHours())}</span>
      </span>

      {/* 日期 + 时光进度 */}
      <span className="inline-flex items-center gap-2">
        <CalendarDays className="h-3 w-3" aria-hidden />
        <span>{dateText(now)}</span>
        <span
          className="hidden h-px w-16 overflow-hidden bg-white/15 sm:inline-block"
          role="img"
          aria-label={`今年已过 ${Math.round(progress * 100)}%`}
        >
          <span
            className="block h-px bg-neon-lime/80"
            style={{ width: `${progress * 100}%` }}
          />
        </span>
        <span className="text-neon-lime/70">{Math.round(progress * 100)}%</span>
      </span>

      {/* 今日一句 */}
      {slip ? (
        <span className="inline-flex items-center gap-2 normal-case tracking-[0.1em]">
          <Quote className="h-3 w-3 shrink-0" aria-hidden />
          <span className="truncate text-white/55">{slip.text}</span>
          <span className="shrink-0 text-white/25">—— {slip.source}</span>
        </span>
      ) : null}
    </div>
  )
}
