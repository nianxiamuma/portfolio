/**
 * 统一 API 访问层。
 *
 * 目标站的后端是一套 Go 服务（留言板 / AI 助手 / AI 生图 / 服务器遥测 …）。
 * 本前端所有数据访问都收口到这里：配置 VITE_API_BASE 即接真实后端；
 * 未配置或请求失败时，调用方各自降级到本地假数据，页面不会白屏。
 */

const BASE = (import.meta.env?.VITE_API_BASE || '').replace(/\/$/, '')

export const apiBase = BASE

export class ApiError extends Error {
  constructor(message, status) {
    super(message)
    this.name = 'ApiError'
    this.status = status
  }
}

async function request(path, { method = 'GET', body, timeout = 6000 } = {}) {
  const controller = new AbortController()
  const timer = setTimeout(() => controller.abort(), timeout)
  try {
    const res = await fetch(`${BASE}${path}`, {
      method,
      headers: body ? { 'Content-Type': 'application/json' } : undefined,
      body: body ? JSON.stringify(body) : undefined,
      signal: controller.signal,
      cache: 'no-store',
      credentials: 'include',
    })
    if (!res.ok) throw new ApiError(`请求失败：${res.status}`, res.status)
    const type = res.headers.get('content-type') || ''
    return type.includes('application/json') ? res.json() : res.text()
  } finally {
    clearTimeout(timer)
  }
}

export const apiGet = (path, options) => request(path, options)
export const apiPost = (path, body, options) => request(path, { ...options, method: 'POST', body })

/** 带计时的 GET：用于延迟这类需要客户端实测的指标 */
export async function apiGetTimed(path, options) {
  const started = typeof performance !== 'undefined' ? performance.now() : Date.now()
  const data = await apiGet(path, options)
  const ended = typeof performance !== 'undefined' ? performance.now() : Date.now()
  return { data, latencyMs: Math.round(ended - started) }
}
