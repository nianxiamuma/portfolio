import { useEffect, useState } from 'react'
import { Activity } from 'lucide-react'
import { apiGetTimed } from '../services/api'

/** 心跳探测间隔：30s 一次，不频繁打扰后端 */
const REFRESH_MS = 30_000

/**
 * 导航栏服务器心跳徽章：周期探测 API 往返延迟。
 * - 在线：绿色圆点 + 延迟毫秒
 * - 离线/超时：红点 + offline，绝不伪造数值
 * 数据源与 VisitorNetworkBadge 同为 /api/client/network（apiGetTimed 自带计时）。
 */
export default function ServerPulseBadge({ className = '' }) {
  const [state, setState] = useState({ online: null, latency: null })

  useEffect(() => {
    let cancelled = false

    const probe = async () => {
      try {
        const { latencyMs } = await apiGetTimed('/api/client/network')
        if (cancelled) return
        setState({ online: true, latency: latencyMs })
      } catch {
        if (cancelled) return
        setState({ online: false, latency: null })
      }
    }

    probe()
    const id = setInterval(probe, REFRESH_MS)
    return () => {
      cancelled = true
      clearInterval(id)
    }
  }, [])

  const online = state.online === true

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 font-mono text-[10px] tracking-[0.14em] text-slate-400 backdrop-blur-sm ${className}`}
    >
      <Activity className="h-3 w-3 text-neon-mint" />
      <span
        className={`h-1.5 w-1.5 rounded-full ${
          state.online == null
            ? 'bg-slate-600'
            : online
              ? 'bg-emerald-400 shadow-[0_0_6px_rgba(52,211,153,0.8)]'
              : 'bg-rose-500'
        }`}
      />
      <span>
        {state.online == null ? '···' : online ? `${state.latency}ms` : 'offline'}
      </span>
    </span>
  )
}
