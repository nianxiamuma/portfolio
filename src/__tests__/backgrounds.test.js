import { describe, expect, it } from 'vitest'

import {
  DEFAULT_SCENE,
  ROUTE_SCENES,
  SCENES,
  pickActiveScene,
  resolveScene,
  sceneImageCount,
  sceneWallpaper,
  wrapVariant,
} from '../lib/backgrounds'

/**
 * 场景解析层：把「当前在哪」翻译成「用哪张背景」。
 * 这是背景层的唯一真源，所以先把它钉住。
 */
describe('resolveScene', () => {
  it('首页解析为 home-hero', () => {
    expect(resolveScene('/')).toBe('home-hero')
  })

  it('每个顶部路由都能解析到自己的场景', () => {
    expect(resolveScene('/about')).toBe('about')
    expect(resolveScene('/glimmer')).toBe('glimmer')
    expect(resolveScene('/collection')).toBe(DEFAULT_SCENE) // 页面已删，回落默认
    expect(resolveScene('/friends')).toBe(DEFAULT_SCENE) // 页面已删，回落默认
    expect(resolveScene('/guestbook')).toBe('guestbook')
    expect(resolveScene('/blog')).toBe('blog')
  })

  it('文章详情页沿用文章列表场景', () => {
    expect(resolveScene('/blog/some-slug')).toBe('blog')
    expect(resolveScene('/blog/some-slug/')).toBe('blog')
  })

  it('忽略查询串与 hash', () => {
    expect(resolveScene('/about?from=nav')).toBe('about')
    expect(resolveScene('/collection#shelf')).toBe(DEFAULT_SCENE) // 页面已删，回落默认
  })

  it('未知路由回落到默认场景', () => {
    expect(resolveScene('/nope')).toBe(DEFAULT_SCENE)
    expect(resolveScene('/blog2')).toBe(DEFAULT_SCENE)
    expect(resolveScene('')).toBe(DEFAULT_SCENE)
    expect(resolveScene(undefined)).toBe(DEFAULT_SCENE)
  })

  it('尾斜杠不影响解析', () => {
    expect(resolveScene('/about/')).toBe('about')
    expect(resolveScene('/')).toBe('home-hero')
  })
})

describe('pickActiveScene', () => {
  it('还没滚到任何区块时返回 null（交给路由默认）', () => {
    expect(pickActiveScene([])).toBeNull()
    expect(pickActiveScene([{ key: 'a', top: 100, bottom: 900 }])).toBeNull()
  })

  it('取「最后一个已经盖过视口顶端」的区块', () => {
    expect(pickActiveScene([{ key: 'a', top: -500, bottom: 400 }])).toBe('a')
    expect(
      pickActiveScene([
        { key: 'a', top: -2000, bottom: -1000 },
        { key: 'b', top: -1000, bottom: 0 },
        { key: 'c', top: 0, bottom: 1000 },
      ]),
    ).toBe('c')
  })

  it('多个区块同时盖过顶端时取最靠下的那个', () => {
    expect(
      pickActiveScene([
        { key: 'a', top: -300, bottom: 600 },
        { key: 'b', top: -100, bottom: 800 },
      ]),
    ).toBe('b')
  })

  it('传了阈值时，区块露头就接管 —— 不必等它顶到视口顶端', () => {
    const rects = [
      { key: 'a', top: -2000, bottom: -1000 },
      { key: 'b', top: 700, bottom: 1700 },
    ]
    // 默认阈值 0：b 还没盖过顶端，仍是 a
    expect(pickActiveScene(rects)).toBe('a')
    // 阈值 800：b 的顶部已进入判定线内，提前切到 b
    expect(pickActiveScene(rects, 800)).toBe('b')
    // 阈值不影响「更靠下的区块优先」这条规则
    expect(pickActiveScene([{ key: 'c', top: 100 }, { key: 'd', top: 500 }], 800)).toBe('d')
  })

  it('滚过全部区块后仍停留在最后一个', () => {
    expect(
      pickActiveScene([
        { key: 'a', top: -3000, bottom: -2000 },
        { key: 'b', top: -2000, bottom: -1000 },
      ]),
    ).toBe('b')
  })

  it('非法输入不抛', () => {
    expect(pickActiveScene(null)).toBeNull()
    expect(pickActiveScene(undefined)).toBeNull()
  })
})

describe('场景表完整性', () => {
  it('路由表指向的场景都真实存在', () => {
    for (const scene of Object.values(ROUTE_SCENES)) {
      expect(Object.keys(SCENES)).toContain(scene)
    }
  })

  it('默认场景存在', () => {
    expect(Object.keys(SCENES)).toContain(DEFAULT_SCENE)
  })

  it('每个场景都能取到一张合法壁纸', () => {
    for (const key of Object.keys(SCENES)) {
      const wallpaper = sceneWallpaper(key)
      expect(wallpaper).toBeTruthy()
      expect(wallpaper.scene).toBeTruthy()
      // 场景壁纸不属于罗盘壁纸表，index 刻意留 null
      expect(wallpaper.index).toBeNull()
      // 12 个月都配了月度图，所以 信封区/关于我 指向 month/，其余指向 scene/
      expect(wallpaper.scene.image).toMatch(/\/wallpapers\/(scene|month)\/.+\.jpg$/)
    }
    // 未知场景回落，不抛
    expect(sceneWallpaper('不存在')).toBeTruthy()
  })

  it('variant 越界时绕回，不越界也不抛', () => {
    // glimmer 没有月度槽位，任何月份都走场景图轮换
    const first = sceneWallpaper('glimmer', 0, 6)
    const second = sceneWallpaper('glimmer', 1, 6)
    expect(first.scene.image).not.toBe(second.scene.image)
    // 绕回第一张
    expect(sceneWallpaper('glimmer', 2, 6).scene.image).toBe(first.scene.image)
    // 负数与非法值都收敛
    expect(sceneWallpaper('glimmer', -1, 6).scene.image).toBe(second.scene.image)
    expect(sceneWallpaper('glimmer', NaN, 6).scene.image).toBe(first.scene.image)
  })

  it('所有场景图合起来不重复 —— 用户要求「每页壁纸不同」', () => {
    const files = Object.values(SCENES).flatMap((scene) => scene.images)
    expect(files.length).toBeGreaterThan(0)
    expect(new Set(files).size).toBe(files.length)
  })

  it('每个场景都有图，且张数可查（轮换逻辑不能除以零）', () => {
    for (const [key, scene] of Object.entries(SCENES)) {
      expect(scene.images.length, key).toBeGreaterThan(0)
      // 有月度槽位的场景每月只有一张（不轮换），其余按场景图张数
      expect(sceneImageCount(key), key).toBe(scene.monthSlot ? 1 : scene.images.length)
    }
  })

  it('月度壁纸接管：信封区与关于我换成当月那张，不再轮换', () => {
    expect(sceneWallpaper('home-story', 0, 1).scene.image).toContain(
      '/wallpapers/month/01-story.jpg',
    )
    expect(sceneWallpaper('about', 0, 1).scene.image).toContain('/wallpapers/month/01-about.jpg')
    expect(sceneImageCount('home-story', 1)).toBe(1)
    expect(sceneImageCount('about', 1)).toBe(1)
    // 压暗强度沿用原场景，月度图不会把正文冲淡
    expect(sceneWallpaper('about', 0, 1).dim).toBe(SCENES.about.dim)
    expect(sceneWallpaper('home-story', 0, 1).dim).toBe(SCENES['home-story'].dim)
  })

  it('12 个月各用各的壁纸，每月一张不轮换', () => {
    for (let m = 1; m <= 12; m += 1) {
      const nn = String(m).padStart(2, '0')
      expect(sceneWallpaper('home-story', 0, m).scene.image).toContain(
        `/wallpapers/month/${nn}-story.jpg`,
      )
      expect(sceneWallpaper('about', 0, m).scene.image).toContain(
        `/wallpapers/month/${nn}-about.jpg`,
      )
      expect(sceneImageCount('home-story', m)).toBe(1)
      expect(sceneImageCount('about', m)).toBe(1)
    }
  })

  it('不传月份时按「生效月份」走（访客当月有配置就用当月）', () => {
    // 固定到 10 月验证：10 月已配图，就走 10 月这套
    expect(sceneWallpaper('about', 0, new Date(2026, 9, 18)).scene.image).toContain(
      '/wallpapers/month/10-about.jpg',
    )
    expect(sceneWallpaper('home-story', 0, new Date(2026, 9, 18)).scene.image).toContain(
      '/wallpapers/month/10-story.jpg',
    )
  })

  it('地址栏 ?month=N 时，场景按该月的壁纸走（预览用）', () => {
    window.history.replaceState({}, '', '/?month=3')
    try {
      expect(sceneWallpaper('home-story').scene.image).toContain(
        '/wallpapers/month/03-story.jpg',
      )
      expect(sceneImageCount('about')).toBe(1)
    } finally {
      window.history.replaceState({}, '', '/')
    }
  })

  it('wrapVariant 把任意整数收敛到合法区间', () => {
    expect(wrapVariant(0, 2)).toBe(0)
    expect(wrapVariant(1, 2)).toBe(1)
    expect(wrapVariant(2, 2)).toBe(0)
    expect(wrapVariant(-1, 2)).toBe(1)
    expect(wrapVariant(99, 2)).toBe(1)
    expect(wrapVariant(NaN, 2)).toBe(0)
    expect(wrapVariant(3, 0)).toBe(0)
  })

  it('压暗强度都在 0~1 之间', () => {
    for (const scene of Object.values(SCENES)) {
      expect(scene.dim).toBeGreaterThanOrEqual(0)
      expect(scene.dim).toBeLessThanOrEqual(1)
    }
  })
})
