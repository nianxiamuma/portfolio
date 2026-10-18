/**
 * 月度壁纸表 —— 每月三张，分别铺在三个位置：
 *   hero  主页首屏（图三，Hero / 开场门）
 *   story 主页信封区（图二，「From the desk of」）
 *   about 关于我（/about）
 *
 * 素材来自本机 Wallpaper Engine 创意工坊（scene.pkg 解包 / 视频抽帧），
 * 统一缩成 1920 宽放在 public/wallpapers/month/。文件名 `NN-slot.jpg`，NN 是两位月份。
 *
 * 缺月不是错误：没有配置的月份由各调用方回退到原有场景图（backgrounds.js）或
 * 月份背景池（wallpapers.js 的 MONTH_BG），页面不会因为少一张图而白屏。
 */

/** 部署基路径（GitHub Pages 项目页形如 /repo/）；字符串资源路径必须手动拼上它 */
const BASE = import.meta.env.BASE_URL

/** 三个槽位，顺序即页面上从上到下的出现顺序 */
export const MONTH_SLOTS = ['hero', 'story', 'about']

/**
 * 已配置的月份。加新月份只需往这里补一条，并在 public/wallpapers/month/ 放三张图。
 * 只写文件名（相对 public），由 monthWallpaper 统一拼 BASE。
 */
export const MONTH_WALLPAPERS = {
  1: {
    hero: 'wallpapers/month/01-hero.jpg',
    story: 'wallpapers/month/01-story.jpg',
    about: 'wallpapers/month/01-about.jpg',
  },
}

/** 1–12 的标准月份号；非法日期收敛到 1，绝不返回 NaN */
export function monthNumber(date = new Date()) {
  const m = typeof date?.getMonth === 'function' ? date.getMonth() : 0
  return Math.min(12, Math.max(1, m + 1))
}

/** 该月是否配了至少一张壁纸 */
export function hasMonthWallpaper(month) {
  const slots = MONTH_WALLPAPERS[Math.trunc(month)]
  return Boolean(slots && MONTH_SLOTS.some((slot) => slots[slot]))
}

/** 已配置壁纸的月份列表（升序） */
export function configuredMonths() {
  return Object.keys(MONTH_WALLPAPERS)
    .map(Number)
    .filter((m) => Number.isInteger(m) && m >= 1 && m <= 12 && hasMonthWallpaper(m))
    .sort((a, b) => a - b)
}

/**
 * 距离某月最近的已配置月份（按 12 个月环距算，跨年也算近）。
 * 一个都没配时返回 null。
 */
export function nearestConfiguredMonth(month = monthNumber()) {
  const months = configuredMonths()
  if (!months.length) return null
  const target = Math.trunc(month)
  let best = months[0]
  let bestDist = 13
  for (const m of months) {
    const raw = Math.abs(m - target) % 12
    const dist = Math.min(raw, 12 - raw)
    if (dist < bestDist) {
      bestDist = dist
      best = m
    }
  }
  return best
}

/**
 * 当前生效的壁纸月份。优先级：
 *   1. 地址栏 `?month=N` —— 用来预览指定月份（哪怕该月还没配图，也会照实回退）
 *   2. 访客当地月份，前提是那个月配了壁纸
 *   3. 否则退到最近的已配置月份 —— 只配了 1 月时，全年都显示这套，
 *      站长不必等自己生日那个月才看得到自己配的图
 *   4. 一张都没配时返回当地月份（各区块全部走原有场景图）
 */
export function activeMonth(date = new Date()) {
  if (typeof window !== 'undefined' && window.location) {
    const raw = new URLSearchParams(window.location.search).get('month')
    const n = Number(raw)
    if (Number.isInteger(n) && n >= 1 && n <= 12) return n
  }
  const local = monthNumber(date)
  if (hasMonthWallpaper(local)) return local
  return nearestConfiguredMonth(local) ?? local
}

/**
 * 取某月某槽位的壁纸 URL。
 * @param {'hero'|'story'|'about'} slot
 * @param {number|Date} month 月份号 1–12，或一个 Date（取它的当月）
 * @returns {string|null} 完整资源路径；该月未配置返回 null（交给调用方回退）
 */
export function monthWallpaper(slot, month = new Date()) {
  if (!MONTH_SLOTS.includes(slot)) return null
  const m = typeof month === 'number' ? month : monthNumber(month)
  if (!Number.isFinite(m)) return null
  const file = MONTH_WALLPAPERS[Math.trunc(m)]?.[slot]
  return file ? `${BASE}${file}` : null
}
