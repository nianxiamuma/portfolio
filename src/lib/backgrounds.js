/**
 * 背景场景表 —— 全站背景的唯一真源。
 *
 * 页面和区块只声明「我是哪个场景」，由这里查表得到用哪张图。
 * 换背景只改这张表；新增页面只加一行路由映射。
 *
 * 与 wallpapers.js 的分工：
 *   wallpapers.js —— Hero 罗盘可选的「封面壁纸」（带配色 / 诗句 / 方位）
 *   backgrounds.js —— 各页面/区块铺底用的「场景壁纸」
 *
 * 场景图来自本机 Wallpaper Engine 素材 imgs\，已复制到 public\wallpapers\scene\。
 * 每个场景给 2 张，由 BackgroundStage 定时轮换 —— 满足「每页多几张轮换」。
 * 挑图标准：内容页优先暗调、低细节，免得压住正文；首页首屏可以用人物/星空。
 */
const BASE = import.meta.env.BASE_URL

/** 解析不出场景时的兜底 */
export const DEFAULT_SCENE = 'home-hero'

/**
 * 场景 → 背景定义。
 *   images：public/wallpapers/scene/ 下的文件名，可多张（轮换顺序即数组顺序）
 *   name：这组图的内部代号（只用于排查，不展示）
 *   dim：可选，额外压暗强度 0~1。内容页文字多，压暗一点可读性更好。
 */
export const SCENES = {
  'home-hero': { name: '星野', dim: 0.15, images: ['scene-hero.jpg', 'scene-hero-2.jpg'] },
  'home-about': {
    name: '长河',
    dim: 0.35,
    images: ['scene-home-about.jpg', 'scene-home-about-2.jpg'],
  },
  'home-features': {
    name: '晴空',
    dim: 0.4,
    images: ['scene-home-features.jpg', 'scene-home-features-2.jpg'],
  },
  'home-story': {
    name: '落花',
    dim: 0.45,
    images: ['scene-home-story.jpg', 'scene-home-story-2.jpg'],
  },
  'home-slot': { name: '暗翼', dim: 0.35, images: ['scene-home-slot.jpg', 'scene-home-slot-2.jpg'] },
  about: { name: '旧城', dim: 0.5, images: ['scene-about.jpg', 'scene-about-2.jpg'] },
  glimmer: { name: '春信', dim: 0.4, images: ['scene-glimmer.jpg', 'scene-glimmer-2.jpg'] },
  collection: {
    name: '古街',
    dim: 0.4,
    images: ['scene-collection.jpg', 'scene-collection-2.jpg'],
  },
  friends: { name: '礁岸', dim: 0.45, images: ['scene-friends.jpg', 'scene-friends-2.jpg'] },
  guestbook: {
    name: '夜归',
    dim: 0.45,
    images: ['scene-guestbook.jpg', 'scene-guestbook-2.jpg'],
  },
  blog: { name: '雪线', dim: 0.5, images: ['scene-blog.jpg', 'scene-blog-2.jpg'] },
}

/** 顶部路由 → 场景 */
export const ROUTE_SCENES = {
  '/': 'home-hero',
  '/about': 'about',
  '/glimmer': 'glimmer',
  '/collection': 'collection',
  '/friends': 'friends',
  '/guestbook': 'guestbook',
  '/blog': 'blog',
}

const normalize = (pathname) => String(pathname ?? '').split('?')[0].split('#')[0]

/**
 * 路径 → 场景 key。
 * 未知路径回落默认场景，永不抛 —— 背景层不该因为一个没见过的路由把整页带崩。
 */
export function resolveScene(pathname) {
  const path = normalize(pathname)
  if (!path) return DEFAULT_SCENE

  const clean = path.length > 1 && path.endsWith('/') ? path.slice(0, -1) : path
  if (ROUTE_SCENES[clean]) return ROUTE_SCENES[clean]

  // 前缀匹配（/blog/some-slug → blog）。取最长前缀，避免 /blog 吃掉 /blogroll 这类兄弟路径。
  const hit = Object.keys(ROUTE_SCENES)
    .filter((route) => route !== '/' && clean.startsWith(`${route}/`))
    .sort((a, b) => b.length - a.length)[0]

  return hit ? ROUTE_SCENES[hit] : DEFAULT_SCENE
}

/** 场景有几张可轮换的图（至少 1，配错时空数组也不会把轮换逻辑除以零） */
export function sceneImageCount(key) {
  const scene = SCENES[key] || SCENES[DEFAULT_SCENE]
  return Array.isArray(scene.images) && scene.images.length ? scene.images.length : 0
}

/** 把任意整数收敛到 [0, count) —— 轮换到第 100 张也不会越界 */
export function wrapVariant(variant, count) {
  if (!count) return 0
  const n = Number.isFinite(variant) ? Math.trunc(variant) : 0
  return ((n % count) + count) % count
}

/**
 * 场景 → 壁纸对象（形状与 wallpapers.js 的条目兼容，好让 WallpaperScene 直接吃）。
 * variant 用来在同场景的多张图之间轮换；越界会自动绕回。
 * 未知场景回落默认场景。
 * 注意 index 为 null —— 场景壁纸不在罗盘壁纸表里，没有罗盘序号。
 */
export function sceneWallpaper(key, variant = 0) {
  const scene = SCENES[key] || SCENES[DEFAULT_SCENE]
  const images = Array.isArray(scene.images) ? scene.images : []
  if (!images.length) return null

  return {
    index: null,
    name: scene.name,
    dim: typeof scene.dim === 'number' ? scene.dim : 0,
    scene: { image: `${BASE}wallpapers/scene/${images[wrapVariant(variant, images.length)]}` },
  }
}

/**
 * 从「各区块相对视口的位置」中挑出当前生效的区块场景。
 *
 * rects 需按文档顺序给出（DOM 顺序），每项 { key, top }（top 来自 getBoundingClientRect）。
 * 规则：取最后一个 top <= 0 的区块 —— 也就是「已经把视口顶端盖过」的最靠下那个；
 * 还没滚到任何区块时返回 null，交回路由默认场景。
 *
 * 抽成纯函数是为了能在 jsdom 里直接测，不必真的滚动页面。
 */
export function pickActiveScene(rects) {
  if (!Array.isArray(rects)) return null
  let active = null
  for (const rect of rects) {
    if (!rect || typeof rect.top !== 'number' || !rect.key) continue
    if (rect.top <= 0) active = rect.key
  }
  return active
}
