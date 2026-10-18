/**
 * 骰子壁纸池 —— 主页右上角那颗骰子投出的点数对应的壁纸。
 *
 * 点数 1–6 各一张；0（未投掷）= 默认那张「剑」。
 * 素材同样来自 Wallpaper Engine 创意工坊，已抽成 1920 宽放在 public/wallpapers/dice/。
 *
 * 与另外两套壁纸的分工：
 *   wallpapers.js 的 MONTH_COVERS —— 按月轮换的 12 张（罗盘选择）
 *   backgrounds.js 的 SCENES     —— 各页面/区块铺底的场景图
 *   diceWallpapers.js（本文件）  —— 骰子随机切的这一池，投掷后覆盖首屏
 */

/** 部署基路径；字符串资源路径必须手动拼上它 */
const BASE = import.meta.env.BASE_URL

export const DICE_FACES = [1, 2, 3, 4, 5, 6]

/**
 * 点数 → 壁纸。key 用字符串 'default'，与数字点数共处一个对象里。
 * 加新图只改这里 + 往 public/wallpapers/dice/ 放文件。
 */
export const DICE_WALLPAPERS = {
  default: { name: '剑', image: 'wallpapers/dice/default-sword.jpg' },
  1: { name: '雏田', image: 'wallpapers/dice/1-hinata.jpg' },
  2: { name: '画眉丸', image: 'wallpapers/dice/2-gabimaru.jpg' },
  3: { name: '日落', image: 'wallpapers/dice/3-sunset.jpg' },
  4: { name: 'Saber', image: 'wallpapers/dice/4-saber.jpg' },
  5: { name: '初音未来', image: 'wallpapers/dice/5-miku.jpg' },
  6: { name: '初音未来 · 夜', image: 'wallpapers/dice/6-miku-b.jpg' },
}

/**
 * 投一次骰子，返回 1–6。
 * random 可注入（测试用固定序列），返回任何值都会收敛到合法点数。
 */
export function rollDie(random = Math.random) {
  const r = typeof random === 'function' ? Number(random()) : Math.random()
  const safe = Number.isFinite(r) ? Math.min(0.999999, Math.max(0, r)) : 0
  return Math.floor(safe * 6) + 1
}

/**
 * 骰子壁纸的中性配色。首屏的徽章、名片卡、罗盘都从 wallpaper.theme 取色，
 * 骰子池不逐张配主题，统一给一套冷白，避免任何一处读到 undefined。
 */
const NEUTRAL_THEME = {
  accent: '#f2f6ff',
  line: 'rgba(242, 246, 255, 0.5)',
  soft: 'rgba(180, 205, 255, 0.2)',
  glow: 'rgba(210, 225, 255, 0.3)',
  overlay: 'rgba(6, 10, 20, 0.6)',
}

/**
 * 点数 → 可直接喂给 WallpaperScene 的壁纸对象。
 * 未知/越界点数落回默认那张，绝不返回 undefined。
 */
export function getDiceWallpaper(face) {
  const item = DICE_WALLPAPERS[face] || DICE_WALLPAPERS.default
  return {
    index: null,
    name: item.name,
    dim: 0,
    theme: NEUTRAL_THEME,
    scene: { image: `${BASE}${item.image}` },
  }
}
