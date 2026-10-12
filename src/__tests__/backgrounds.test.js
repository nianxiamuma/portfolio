import { describe, expect, it } from 'vitest'

import {
  DEFAULT_SCENE,
  ROUTE_SCENES,
  SCENES,
  pickActiveScene,
  resolveScene,
  sceneWallpaper,
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
    expect(resolveScene('/collection')).toBe('collection')
    expect(resolveScene('/friends')).toBe('friends')
    expect(resolveScene('/guestbook')).toBe('guestbook')
    expect(resolveScene('/blog')).toBe('blog')
  })

  it('文章详情页沿用文章列表场景', () => {
    expect(resolveScene('/blog/some-slug')).toBe('blog')
    expect(resolveScene('/blog/some-slug/')).toBe('blog')
  })

  it('忽略查询串与 hash', () => {
    expect(resolveScene('/about?from=nav')).toBe('about')
    expect(resolveScene('/collection#shelf')).toBe('collection')
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
      expect(typeof wallpaper.index).toBe('number')
      expect(wallpaper.scene).toBeTruthy()
    }
    // 未知场景回落，不抛
    expect(sceneWallpaper('不存在')).toBeTruthy()
  })
})
