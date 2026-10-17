import { describe, it, expect, vi, afterEach, beforeEach } from 'vitest'
import { render, screen, act, cleanup } from '@testing-library/react'
import HomeIntro from '../components/HomeIntro'

/**
 * 开场动画（铃芽之门）的回归锁。
 *
 * 这层在 2026-10-18 之前完全没有测试：它只在首屏出现 2~3 秒，
 * 单测容易漏，但它是用户每次进站都会看到的第一屏，且涉及
 * 「门框 / 门板 / 常世」三层素材的对齐与滑开时序。
 * 这里锁的是结构与状态机，不锁像素。
 */

const setUrl = (search = '') => {
  window.history.replaceState({}, '', `/${search}`)
}

beforeEach(() => {
  setUrl('')
})

afterEach(() => {
  cleanup()
  vi.useRealTimers()
  vi.restoreAllMocks()
  setUrl('')
})

describe('HomeIntro 开场 · 铃芽之门', () => {
  it('默认渲染门洞、两扇门板与门框，门板处于关闭位', () => {
    render(<HomeIntro />)

    expect(screen.getByTestId('intro-doorway')).toBeTruthy()
    const left = screen.getByTestId('intro-door-left')
    const right = screen.getByTestId('intro-door-right')
    expect(left.className).toContain('translate-x-0')
    expect(right.className).toContain('translate-x-0')
    expect(left.className).not.toContain('-translate-x-full')
    expect(right.className).not.toContain('translate-x-full')
  })

  it('三层素材都接进了页面（门板 / 常世 / 门框）', () => {
    render(<HomeIntro />)
    const imgs = Array.from(document.querySelectorAll('img')).map((i) => i.getAttribute('src'))
    expect(imgs.some((s) => s.includes('suzume-door-panel.png'))).toBe(true)
    expect(imgs.some((s) => s.includes('suzume-afterworld.jpg'))).toBe(true)
    expect(imgs.some((s) => s.includes('suzume-door-frame.png'))).toBe(true)
  })

  it('计时器推进后两扇门板滑向两侧（open 态）', () => {
    vi.useFakeTimers()
    vi.setSystemTime(new Date(2026, 9, 18, 3, 0, 0))
    render(<HomeIntro />)

    act(() => {
      vi.advanceTimersByTime(2000)
    })

    expect(screen.getByTestId('intro-door-left').className).toContain('-translate-x-full')
    expect(screen.getByTestId('intro-door-right').className).toContain('translate-x-full')
  })

  it('门滑完后会自行卸载开场层（不长期压住页面）', () => {
    vi.useFakeTimers()
    vi.setSystemTime(new Date(2026, 9, 18, 3, 0, 0))
    render(<HomeIntro />)

    act(() => {
      vi.advanceTimersByTime(2000)
    })
    // 分两段推进：phase 变 open 后 React 先跑 effect 注册卸载计时器，
    // 再推进 EXIT；一次推到底的话 effect 还没机会执行
    act(() => {
      vi.advanceTimersByTime(4000)
    })

    expect(screen.queryByTestId('intro-doorway')).toBeNull()
  })

  it('?nointro 直接跳过开场，不渲染任何开场层元素', () => {
    setUrl('?nointro')
    render(<HomeIntro />)
    expect(screen.queryByTestId('intro-doorway')).toBeNull()
  })

  it('?introopen 冻结在开门态且不自动卸载（截图/调试用）', () => {
    setUrl('?introopen')
    vi.useFakeTimers()
    render(<HomeIntro />)

    expect(screen.getByTestId('intro-door-left').className).toContain('-translate-x-full')
    act(() => {
      vi.advanceTimersByTime(10000)
    })
    expect(screen.queryByTestId('intro-doorway')).not.toBeNull()
  })

  it('prefers-reduced-motion 下不播动画，直接落到 done', () => {
    vi.spyOn(window, 'matchMedia').mockImplementation((query) => ({
      matches: query.includes('prefers-reduced-motion'),
      media: query,
      onchange: null,
      addListener() {},
      removeListener() {},
      addEventListener() {},
      removeEventListener() {},
      dispatchEvent() {
        return false
      },
    }))

    render(<HomeIntro />)
    expect(screen.queryByTestId('intro-doorway')).toBeNull()
  })
})
