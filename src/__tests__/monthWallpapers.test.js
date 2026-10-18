import { existsSync } from 'node:fs'
import { resolve } from 'node:path'

import { afterEach, describe, expect, it } from 'vitest'

import { MONTH_COVERS, monthlyCoverIndex } from '../lib/wallpapers'
import {
  MONTH_SLOTS,
  MONTH_WALLPAPERS,
  activeMonth,
  monthNumber,
  monthWallpaper,
} from '../lib/monthWallpapers'

afterEach(() => {
  window.history.replaceState({}, '', '/')
})

/**
 * 月度壁纸表：每月三张，分别给主页首屏 / 信封区 / 关于我。
 * 这里钉两件事 —— 配置的图真的在 public 下，且缺月必须安静回退（不能白屏）。
 */
describe('月度壁纸表', () => {
  it('三个槽位齐全，1 月都配了图', () => {
    expect(MONTH_SLOTS).toEqual(['hero', 'story', 'about'])
    for (const slot of MONTH_SLOTS) {
      expect(MONTH_WALLPAPERS[1][slot], slot).toBeTruthy()
    }
  })

  it('配置的每个文件都真实存在于 public 下 —— 防止改名后静默 404', () => {
    for (const [month, slots] of Object.entries(MONTH_WALLPAPERS)) {
      for (const [slot, file] of Object.entries(slots)) {
        const abs = resolve(process.cwd(), 'public', file)
        expect(existsSync(abs), `${month} 月 ${slot} 缺文件：public/${file}`).toBe(true)
      }
    }
  })

  it('取图返回带基路径的 URL', () => {
    expect(monthWallpaper('hero', 1)).toContain('/wallpapers/month/01-hero.jpg')
    expect(monthWallpaper('story', 1)).toContain('/wallpapers/month/01-story.jpg')
    expect(monthWallpaper('about', 1)).toContain('/wallpapers/month/01-about.jpg')
  })

  it('没配图的月份返回 null，交给调用方回退', () => {
    expect(monthWallpaper('hero', 2)).toBeNull()
    expect(monthWallpaper('story', 12)).toBeNull()
  })

  it('非法槽位返回 null，不抛', () => {
    expect(monthWallpaper('wallpaper', 1)).toBeNull()
    expect(monthWallpaper(undefined, 1)).toBeNull()
    expect(monthWallpaper(null, 1)).toBeNull()
  })

  it('也接受 Date，按它的当月取图', () => {
    expect(monthWallpaper('story', new Date(2026, 0, 31))).toContain('01-story.jpg')
    expect(monthWallpaper('story', new Date(2026, 1, 1))).toBeNull()
  })

  it('monthNumber 收敛到 1–12，非法输入退到 1 月', () => {
    expect(monthNumber(new Date(2026, 0, 1))).toBe(1)
    expect(monthNumber(new Date(2026, 11, 31))).toBe(12)
    expect(monthNumber({})).toBe(1)
    expect(monthNumber(null)).toBe(1)
  })

  it('1 月封面用「壁纸 1」，其余月份回退月份背景池', () => {
    expect(MONTH_COVERS[0].month).toBe(1)
    expect(MONTH_COVERS[0].scene.image).toContain('/wallpapers/month/01-hero.jpg')
    expect(MONTH_COVERS[1].scene.image).toContain('/wallpapers/scene/')
  })

  it('12 个月的封面都还能取到图，缺月度壁纸也不会空', () => {
    for (const cover of MONTH_COVERS) {
      expect(cover.scene.image, `${cover.month} 月`).toMatch(/\/wallpapers\/.+/)
    }
  })
})

/**
 * 月份来源：默认按访客当地月份，地址栏 ?month=N 可提前预览某个月
 * （用户配好 12 个月之前，需要能当场看到某月的效果）。
 */
describe('生效月份', () => {
  it('没有 ?month 时按日期算', () => {
    expect(activeMonth(new Date(2026, 5, 15))).toBe(6)
    expect(activeMonth(new Date(2026, 11, 1))).toBe(12)
  })

  it('?month=N 覆盖日期，用来预览指定月份', () => {
    window.history.replaceState({}, '', '/?nointro&month=1')
    expect(activeMonth(new Date(2026, 5, 15))).toBe(1)
    expect(monthlyCoverIndex(new Date(2026, 5, 15))).toBe(1)
  })

  it('越界或非数字的 ?month 被忽略，回到日期月份', () => {
    window.history.replaceState({}, '', '/?month=13')
    expect(activeMonth(new Date(2026, 5, 15))).toBe(6)
    window.history.replaceState({}, '', '/?month=abc')
    expect(activeMonth(new Date(2026, 5, 15))).toBe(6)
    window.history.replaceState({}, '', '/?month=0')
    expect(activeMonth(new Date(2026, 5, 15))).toBe(6)
  })
})
