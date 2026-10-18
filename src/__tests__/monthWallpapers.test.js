import { existsSync } from 'node:fs'
import { resolve } from 'node:path'

import { afterEach, describe, expect, it } from 'vitest'

import { MONTH_COVERS, monthlyCoverIndex } from '../lib/wallpapers'
import {
  MONTH_SLOTS,
  MONTH_WALLPAPERS,
  activeMonth,
  configuredMonths,
  hasMonthWallpaper,
  monthNumber,
  monthWallpaper,
  nearestConfiguredMonth,
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
 * 生效月份：?month=N 优先；当地月份没配图时退到最近的已配置月份。
 * 这一条直接决定「只配了 1 月时，10 月访问能不能看到自己配的图」。
 */
describe('生效月份', () => {
  it('?month=N 优先，用来预览指定月份', () => {
    window.history.replaceState({}, '', '/?nointro&month=1')
    expect(activeMonth(new Date(2026, 5, 15))).toBe(1)
    expect(monthlyCoverIndex(new Date(2026, 5, 15))).toBe(1)
  })

  it('当地月份没配壁纸时，退到最近的已配置月份（目前只有 1 月）', () => {
    expect(configuredMonths()).toEqual([1])
    expect(hasMonthWallpaper(1)).toBe(true)
    expect(hasMonthWallpaper(10)).toBe(false)
    expect(activeMonth(new Date(2026, 9, 18))).toBe(1) // 10 月 → 1 月
    expect(activeMonth(new Date(2026, 5, 15))).toBe(1) // 6 月 → 1 月
    expect(activeMonth(new Date(2026, 0, 1))).toBe(1) // 1 月本来就有
  })

  it('nearestConfiguredMonth 按 12 个月环距取最近（12 月离 1 月只有一步）', () => {
    expect(nearestConfiguredMonth(1)).toBe(1)
    expect(nearestConfiguredMonth(12)).toBe(1)
    expect(nearestConfiguredMonth(10)).toBe(1)
    expect(nearestConfiguredMonth(2)).toBe(1)
  })

  it('越界或非数字的 ?month 被忽略，回到日期那套规则', () => {
    for (const bad of ['13', 'abc', '0', '-1']) {
      window.history.replaceState({}, '', `/?month=${bad}`)
      expect(activeMonth(new Date(2026, 5, 15)), bad).toBe(1)
    }
  })

  it('?month=6 时封面按 6 月算，但 6 月没配图 → 回退月份背景池', () => {
    window.history.replaceState({}, '', '/?month=6')
    expect(monthlyCoverIndex(new Date(2026, 0, 1))).toBe(6)
    expect(MONTH_COVERS[5].scene.image).toContain('/wallpapers/scene/')
  })
})
