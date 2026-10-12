import { useEffect, useState } from 'react'
import { MapPin } from 'lucide-react'
import { apiGetTimed } from '../services/api'

const REFRESH_MS = 30000

/**
 * 访客网络徽章：显示地区标签与本地实测延迟。
 * 后端不可用时降级为「访客 · --ms」，不报错、不阻塞渲染。
 */
export default function VisitorNetworkBadge({ className = '' }) {
  const [state, setState] = useState({ label: '访客', latency: null })

  useEffect(() => {
    let cancelled = false

    const load = async () => {
      try {
        const { data, latencyMs } = await apiGetTimed('/api/client/network')
        if (cancelled) return
        setState({
          label: data?.regionLabel || data?.ipMasked || '访客',
          latency: latencyMs,
        })
      } catch {
        if (cancelled) return
        setState({ label: '访客', latency: null })
      }
    }

    load()
    const id = setInterval(load, REFRESH_MS)
    return () => {
      cancelled = true
      clearInterval(id)
    }
  }, [])

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 font-mono text-[10px] tracking-[0.14em] text-slate-400 backdrop-blur-sm ${className}`}
    >
      <MapPin className="h-3 w-3 text-neon-mint" />
      <span>{state.label}</span>
      <span className="text-slate-600">·</span>
      <span>{state.latency == null ? '--ms' : `${state.latency}ms`}</span>
    </span>
  )
}
