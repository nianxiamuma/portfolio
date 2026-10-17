import { describe, it, expect, vi, afterEach, beforeEach } from 'vitest'
import { render, screen, act, cleanup } from '@testing-library/react'
import HomeIntro, { doorHolePx, doorLayerSize } from '../components/HomeIntro'

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
    // 分三段推进：phase 变 open 后 React 先跑 effect 注册停留计时器，再推进 EXIT；
    // EXIT 到点变 leaving 后同样要先让 effect 注册 FADE，才会真正卸载
    act(() => {
      vi.advanceTimersByTime(2000)
    })
    act(() => {
      vi.advanceTimersByTime(2000)
    })
    act(() => {
      vi.advanceTimersByTime(600)
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

  it('门滑完停留后先淡出再卸载（不再硬切成首屏）', () => {
    vi.useFakeTimers()
    vi.setSystemTime(new Date(2026, 9, 18, 3, 0, 0))
    render(<HomeIntro />)

    act(() => {
      vi.advanceTimersByTime(2000)
    })
    // EXIT(1900) 到点 → leaving：开场层挂上 opacity-0 开始淡出，但还没卸载
    act(() => {
      vi.advanceTimersByTime(2000)
    })
    expect(screen.getByTestId('intro-layer').className).toContain('opacity-0')
    expect(screen.queryByTestId('intro-doorway')).not.toBeNull()

    // FADE(520) 走完才真正卸载
    act(() => {
      vi.advanceTimersByTime(600)
    })
    expect(screen.queryByTestId('intro-doorway')).toBeNull()
  })

  it('门洞放大到盖住视口（cover 0.94），不再是一小块', () => {
    const viewports = [
      [1440, 900],
      [1920, 1080],
      [2560, 1080],
      [390, 844],
      [768, 1024],
    ]
    for (const [vw, vh] of viewports) {
      const { width, height } = doorHolePx(vw, vh)
      // 门洞横竖都要盖住 94% 视口——这是「门比例太小不能覆盖」的回归锁
      expect(width).toBeGreaterThanOrEqual(vw * 0.94 - 0.5)
      expect(height).toBeGreaterThanOrEqual(vh * 0.94 - 0.5)
      // 也不能反过来盖出天际：门的宽高比由素材决定，约 1.11:1
      expect(width / height).toBeCloseTo(1.111, 2)
    }
  })

  it('对齐层的 vw/vh 系数与门洞实测比例一致（CSS 与纯函数同一套几何）', () => {
    const matched = doorLayerSize().height.match(/^max\(([\d.]+)vw, ([\d.]+)vh\)$/)
    expect(matched).toBeTruthy()
    const [, vwCoef, vhCoef] = matched
    // 门洞宽 = 18.72% × 层宽 = (18.72 × 16/9)% × 层高 = 33.28% × 层高；高 = 29.95% × 层高
    expect(Number(vwCoef)).toBeCloseTo((94 / 33.28) * 100, 1)
    expect(Number(vhCoef)).toBeCloseTo((94 / 29.95) * 100, 1)

    // 同一视口下，CSS 系数的像素结果要和纯函数算出的门洞对得上
    const layerH = Math.max((Number(vwCoef) / 100) * 1440, (Number(vhCoef) / 100) * 900)
    const hole = doorHolePx(1440, 900)
    expect(hole.height).toBeCloseTo(layerH * 0.2995, 0)
    expect(hole.width).toBeCloseTo(layerH * 0.3328, 0)
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
