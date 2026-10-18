import { existsSync } from 'node:fs'
import { resolve } from 'node:path'

import { describe, expect, it } from 'vitest'

import {
  DICE_FACES,
  DICE_WALLPAPERS,
  getDiceWallpaper,
  rollDie,
} from '../lib/diceWallpapers'

/**
 * 骰子壁纸池：点数 1–6 各一张，0 = 默认（剑）。
 * 先钉住「六面齐全 + 文件真实存在 + 随机数边界」，
 * 再让 Hero 去消费它。
 */
describe('骰子壁纸池', () => {
  it('六个点数 + 一张默认，共 7 项', () => {
    expect(DICE_FACES).toEqual([1, 2, 3, 4, 5, 6])
    for (const face of DICE_FACES) {
      expect(DICE_WALLPAPERS[face], `点数 ${face}`).toBeTruthy()
    }
    expect(DICE_WALLPAPERS.default).toBeTruthy()
  })

  it('每一项的文件都真实存在于 public 下 —— 防止改名后静默 404', () => {
    for (const [face, item] of Object.entries(DICE_WALLPAPERS)) {
      const abs = resolve(process.cwd(), 'public', item.image)
      expect(existsSync(abs), `${face} 缺文件：public/${item.image}`).toBe(true)
    }
  })

  it('rollDie 落在 1–6，边界不越界', () => {
    expect(rollDie(() => 0)).toBe(1)
    expect(rollDie(() => 0.999999)).toBe(6)
    expect(rollDie(() => 0.5)).toBe(4)
    for (let i = 0; i < 200; i += 1) {
      const v = rollDie()
      expect(v).toBeGreaterThanOrEqual(1)
      expect(v).toBeLessThanOrEqual(6)
      expect(Number.isInteger(v)).toBe(true)
    }
  })

  it('getDiceWallpaper 返回带基路径的图片 URL，未知点数落回默认', () => {
    expect(getDiceWallpaper(3).scene.image).toContain('/wallpapers/dice/3-sunset.jpg')
    expect(getDiceWallpaper(0).scene.image).toContain('/wallpapers/dice/default-sword.jpg')
    // 越界与非法值都落回默认，不抛
    expect(getDiceWallpaper(99).scene.image).toContain('default-sword.jpg')
    expect(getDiceWallpaper(undefined).scene.image).toContain('default-sword.jpg')
  })

  it('每张都带配色主题 —— HeroWordmark / 名片卡会读 wallpaper.theme.accent', () => {
    for (const face of [...DICE_FACES, 0]) {
      const w = getDiceWallpaper(face)
      for (const key of ['accent', 'line', 'soft', 'glow', 'overlay']) {
        expect(w.theme[key], `点数 ${face}.${key}`).toBeTruthy()
      }
    }
  })

  it('每个点数对应的人不同 —— 不重复', () => {
    const files = Object.values(DICE_WALLPAPERS).map((item) => item.image)
    expect(new Set(files).size).toBe(files.length)
  })
})
