import { describe, it, expect, vi, afterEach } from 'vitest'
import { render, screen, act } from '@testing-library/react'
import SiteWidgets from '../components/SiteWidgets'

afterEach(() => {
  vi.useRealTimers()
})

describe('SiteWidgets 站点小部件条', () => {
  it('渲染时钟文本（来自真实当前时间，格式 hh:mm:ss）', () => {
    render(<SiteWidgets />)
    const clock = screen.getByTestId('widget-clock')
    expect(clock.textContent).toMatch(/^\d{2}:\d{2}:\d{2}$/)
  })

  it('渲染问候语（任一合法时段文案）', () => {
    render(<SiteWidgets />)
    const greetings = ['早上好', '中午好', '下午好', '晚上好', '夜深了']
    const found = greetings.some((g) => screen.getByTestId('site-widgets').textContent.includes(g))
    expect(found).toBe(true)
  })

  it('渲染今日一句（含出处）', () => {
    render(<SiteWidgets />)
    const root = screen.getByTestId('site-widgets')
    expect(root.textContent).toContain('——')
  })

  it('时光进度百分比在 0-100', () => {
    render(<SiteWidgets />)
    const m = screen.getByTestId('site-widgets').textContent.match(/(\d{1,3})%/)
    expect(m).toBeTruthy()
    expect(Number(m[1])).toBeGreaterThanOrEqual(0)
    expect(Number(m[1])).toBeLessThanOrEqual(100)
  })

  it('interval 走秒：fake timers 推进 1s 后时钟文本变化', () => {
    vi.useFakeTimers()
    vi.setSystemTime(new Date(2026, 9, 16, 10, 0, 0))
    render(<SiteWidgets />)
    const before = screen.getByTestId('widget-clock').textContent
    act(() => {
      vi.advanceTimersByTime(1100)
    })
    const after = screen.getByTestId('widget-clock').textContent
    expect(after).not.toBe(before)
  })

  it('document.hidden 时暂停 interval（切回后恢复）', () => {
    vi.useFakeTimers()
    vi.setSystemTime(new Date(2026, 9, 16, 10, 0, 0))
    render(<SiteWidgets />)
    const before = screen.getByTestId('widget-clock').textContent

    act(() => {
      vi.spyOn(document, 'hidden', 'get').mockReturnValue(true)
      document.dispatchEvent(new Event('visibilitychange'))
      vi.advanceTimersByTime(3000)
    })
    expect(screen.getByTestId('widget-clock').textContent).toBe(before)

    act(() => {
      vi.spyOn(document, 'hidden', 'get').mockReturnValue(false)
      document.dispatchEvent(new Event('visibilitychange'))
      vi.advanceTimersByTime(1100)
    })
    expect(screen.getByTestId('widget-clock').textContent).not.toBe(before)
  })
})
