import { describe, it, expect, afterEach, vi } from 'vitest'
import { render, cleanup, act, fireEvent } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'

import BackgroundStage, { ROTATE_MS } from '../components/BackgroundStage'
import { BackgroundProvider, SCENE_ATTR, useBackgroundScene } from '../context/BackgroundContext'
import { SCENES } from '../lib/backgrounds'
import { WALLPAPERS } from '../lib/wallpapers'

afterEach(cleanup)

const renderStage = (path, extra = null) =>
  render(
    <MemoryRouter initialEntries={[path]}>
      <BackgroundProvider>
        {extra}
        <BackgroundStage />
      </BackgroundProvider>
    </MemoryRouter>,
  )

/**
 * 读取「前层」（opacity 为 1 的那一槽）当前显示的图。
 * 后层会刻意留着上一张壁纸，方便下次交叉淡入 —— 所以只能看前层。
 */
const frontImage = (container) => {
  const front = container.querySelector('[data-bg-layer][data-front="true"]')
  return front?.querySelector('img')?.getAttribute('src') ?? null
}

const expectFrontLayer = (container, sceneKey, variant = 0) => {
  expect(frontImage(container)).toContain(`/wallpapers/scene/${SCENES[sceneKey].images[variant]}`)
}

const sceneImageOf = (sceneKey, variant = 0) => SCENES[sceneKey].images[variant]

describe('背景层 BackgroundStage', () => {
  it('钉在视口下方铺底：fixed / 负 z / 不拦指针 / 对读屏隐藏', () => {
    const { container } = renderStage('/')
    const root = container.firstElementChild
    expect(root.className).toContain('fixed')
    expect(root.className).toContain('-z-10')
    expect(root.className).toContain('pointer-events-none')
    expect(root.getAttribute('aria-hidden')).toBe('true')
  })

  it('有两个图层槽位（交叉淡入需要一前一后）', () => {
    const { container } = renderStage('/')
    expect(container.querySelectorAll('[data-bg-layer]')).toHaveLength(2)
    expect(container.querySelectorAll('[data-front="true"]')).toHaveLength(1)
  })

  it('首页用 home-hero 那一张', () => {
    const { container } = renderStage('/')
    expectFrontLayer(container, 'home-hero')
  })

  it('换页换成该页场景的图', () => {
    const { container } = renderStage('/glimmer')
    expectFrontLayer(container, 'glimmer')
    // 前提校验：这一条只有在两页确实不同时才有意义
    expect(sceneImageOf('glimmer')).not.toBe(sceneImageOf('home-hero'))
  })

  it('关于我页由月度壁纸（壁纸 3）接管，不再走场景图', () => {
    window.history.replaceState({}, '', '/?month=1')
    try {
      const { container } = renderStage('/about')
      expect(frontImage(container)).toContain('/wallpapers/month/01-about.jpg')
    } finally {
      window.history.replaceState({}, '', '/')
    }
  })

  it('文章详情页沿用文章列表的图', () => {
    const { container } = renderStage('/blog/some-slug')
    expectFrontLayer(container, 'blog')
  })

  it('区块标了 data-bg-scene 时，区块场景接管路由默认', () => {
    const { container } = renderStage('/', <div {...{ [SCENE_ATTR]: 'home-about' }} />)
    expectFrontLayer(container, 'home-about')
    expect(sceneImageOf('home-about')).not.toBe(sceneImageOf('home-hero'))
  })
})

/** 一个最小的「改月份」按钮，模拟首屏罗盘切换 */
function MonthSwitcher({ month }) {
  const { setMonth } = useBackgroundScene()
  return (
    <button type="button" onClick={() => setMonth(month)}>
      switch-month
    </button>
  )
}

describe('月份联动（首屏罗盘 / 信封区 / 关于我 必须同一个月）', () => {
  it('切到 3 月后，信封区背景跟着换成 03-story.jpg', () => {
    const { container, getByText } = render(
      <MemoryRouter>
        <BackgroundProvider>
          <MonthSwitcher month={3} />
          <div {...{ [SCENE_ATTR]: 'home-story' }} />
          <BackgroundStage />
        </BackgroundProvider>
      </MemoryRouter>,
    )

    fireEvent.click(getByText('switch-month'))
    expect(frontImage(container)).toContain('/wallpapers/month/03-story.jpg')
  })

  it('切到 7 月后，关于我场景换成 07-about.jpg', () => {
    // about 是路由场景，用 /about 进入
    const { container, getByText } = render(
      <MemoryRouter initialEntries={['/about']}>
        <BackgroundProvider>
          <MonthSwitcher month={7} />
          <BackgroundStage />
        </BackgroundProvider>
      </MemoryRouter>,
    )

    fireEvent.click(getByText('switch-month'))
    expect(frontImage(container)).toContain('/wallpapers/month/07-about.jpg')
  })
})

describe('骰子默认状态', () => {
  it('未投掷时是「剑」那张（diceFace = 0），不是当月', () => {
    function Probe() {
      const { diceFace } = useBackgroundScene()
      return <span data-testid="face">{diceFace}</span>
    }
    const { getByTestId } = render(
      <MemoryRouter>
        <BackgroundProvider>
          <Probe />
        </BackgroundProvider>
      </MemoryRouter>,
    )
    expect(getByTestId('face').textContent).toBe('0')
  })
})

describe('同场景轮换（每页多张图）', () => {
  it('同一页停留够久会换到下一张', () => {
    vi.useFakeTimers()
    try {
      // glimmer 没有月度槽位，任何月份都是两张场景图轮换
      const { container } = renderStage('/glimmer')
      expect(frontImage(container)).toContain(sceneImageOf('glimmer', 0))

      act(() => {
        vi.advanceTimersByTime(ROTATE_MS + 200)
      })
      expect(frontImage(container)).toContain(sceneImageOf('glimmer', 1))

      // 再走一轮应绕回第一张（glimmer 只有 2 张）
      act(() => {
        vi.advanceTimersByTime(ROTATE_MS + 200)
      })
      expect(frontImage(container)).toContain(sceneImageOf('glimmer', 0))
    } finally {
      vi.useRealTimers()
    }
  })

  it('轮换不会跨到别的场景的图', () => {
    vi.useFakeTimers()
    try {
      const { container } = renderStage('/blog')
      const otherImages = Object.entries(SCENES)
        .filter(([key]) => key !== 'blog')
        .flatMap(([, scene]) => scene.images)
      act(() => {
        vi.advanceTimersByTime(ROTATE_MS * 3 + 200)
      })
      const current = frontImage(container)
      expect(current).toContain('/wallpapers/scene/')
      for (const img of otherImages) {
        expect(current).not.toContain(img)
      }
    } finally {
      vi.useRealTimers()
    }
  })
})

describe('视频已下线', () => {
  it('壁纸与场景表里都不再挂视频（用户 2026-10-13 决定：视频不用了）', () => {
    for (const wallpaper of WALLPAPERS) {
      expect(wallpaper.scene.video).toBeUndefined()
    }
    for (const key of Object.keys(SCENES)) {
      expect(SCENES[key].video).toBeUndefined()
    }
  })
})
