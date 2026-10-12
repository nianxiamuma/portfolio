import { describe, it, expect, afterEach } from 'vitest'
import { render, cleanup } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'

import BackgroundStage from '../components/BackgroundStage'
import { BackgroundProvider, SCENE_ATTR } from '../context/BackgroundContext'
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
 * 抠出「前层」（opacity 为 1 的那一槽）正在显示哪张 wpN。
 * 后层会刻意留着上一张壁纸，方便下次交叉淡入 —— 所以只能看前层。
 */
const frontWallpaperIndex = (container) => {
  const front = container.querySelector('[data-bg-layer][data-front="true"]')
  if (!front) return null
  const img = front.querySelector('img')
  return (img?.getAttribute('src') || '').match(/wp(\d)\.jpg/)?.[1] ?? null
}

const expectFrontLayer = (container, wallpaperIndex) => {
  expect(frontWallpaperIndex(container)).toBe(String(wallpaperIndex))
}

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
    expectFrontLayer(container, SCENES['home-hero'].wallpaper)
  })

  it('换页换成该页场景的壁纸', () => {
    const { container } = renderStage('/about')
    expectFrontLayer(container, SCENES.about.wallpaper)
    // 前提校验：这一条只有在两页确实不同时才有意义
    expect(SCENES.about.wallpaper).not.toBe(SCENES['home-hero'].wallpaper)
  })

  it('文章详情页沿用文章列表的壁纸', () => {
    const { container } = renderStage('/blog/some-slug')
    expectFrontLayer(container, SCENES.blog.wallpaper)
  })

  it('区块标了 data-bg-scene 时，区块场景接管路由默认', () => {
    const { container } = renderStage('/', <div {...{ [SCENE_ATTR]: 'home-about' }} />)
    expectFrontLayer(container, SCENES['home-about'].wallpaper)
    expect(SCENES['home-about'].wallpaper).not.toBe(SCENES['home-hero'].wallpaper)
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
