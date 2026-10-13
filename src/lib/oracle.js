/**
 * 抽奖机的纯逻辑：号码 → 纸条 + 壁纸。
 * 与视图解耦，便于单测。
 *
 * 原来这里是「号码 → 去哪个页面」的三档奖励（藏书/游戏/友链），
 * 2026-10-14 按需求改为抽一张纸条配一张壁纸。
 */
import { ORACLE_SLIPS, ORACLE_WALLPAPERS } from '../data/oracle'

export const MAX_NUMBER = 998

/** 夹到 0..998；非数字一律当 0，宁可给张纸也不抛 */
export const clampNumber = (n) => {
  const value = Number.isFinite(n) ? Math.trunc(n) : 0
  return Math.max(0, Math.min(MAX_NUMBER, value))
}

/** 号码拆成三位数字（补零），给卷轴用 */
export const digitsOf = (n) => String(clampNumber(n)).padStart(3, '0').split('')

const BASE = import.meta.env.BASE_URL

/** 壁纸文件名 → 可访问 URL（必须拼部署基路径） */
export const wallpaperSrc = (file) => `${BASE}wallpapers/oracle/${file}`

/*
 * 壁纸用与纸条不同的步长取：纸条是 n % 纸条数，壁纸是 (n*31+7) % 壁纸数。
 * 31 与壁纸数（42）互质，保证 0..998 内每张壁纸都够得着；步长错开则避免
 * 号码一动纸条和壁纸同步变（那样看着像只有几组固定搭配）。
 */
const WALLPAPER_STRIDE = 31
const WALLPAPER_OFFSET = 7

/**
 * 抽一次：号码 → { number, slip, wallpaper }。
 * slips / wallpapers 可注入，便于测试与将来换池子。
 */
export function drawFor(n, options = {}) {
  const slips = options.slips ?? ORACLE_SLIPS
  const wallpapers = options.wallpapers ?? ORACLE_WALLPAPERS
  const number = clampNumber(n)

  return {
    number,
    slip: slips.length ? slips[number % slips.length] : null,
    wallpaper: wallpapers.length
      ? wallpapers[(number * WALLPAPER_STRIDE + WALLPAPER_OFFSET) % wallpapers.length]
      : null,
  }
}
