/**
 * 背景场景表 —— 全站背景的唯一真源。
 *
 * 页面和区块只声明「我是哪个场景」，由这里查表得到用哪张图。
 * 换背景只改这张表；新增页面只加一行路由映射。
 *
 * 与 wallpapers.js 的分工：
 *   wallpapers.js —— Hero 罗盘可选的 4 张「封面壁纸」（带配色 / 诗句 / 四方位）
 *   backgrounds.js —— 各页面/区块铺底用的「场景壁纸」（每个场景一张，互不相同）
 *
 * 场景图来自本机 Wallpaper Engine 素材 imgs\，已复制到 public\wallpapers\scene\。
 * 挑图标准：内容页优先暗调、低细节，免得压住正文；首页首屏可以用人物/星空。
 */
const BASE = import.meta.env.BASE_URL

/** 解析不出场景时的兜底 */
export const DEFAULT_SCENE = 'home-hero'

/**
 * 场景 → 背景定义。
 *   image：public/wallpapers/scene/ 下的文件名
 *   name：这张图的内部代号（只用于排查，不展示）
 *   dim：可选，额外压暗强度 0~1。内容页文字多，压暗一点可读性更好。
 */
export const SCENES = {
  'home-hero': { image: 'scene-hero.jpg', name: '星野', dim: 0.15 },
  'home-about': { image: 'scene-home-about.jpg', name: '长河', dim: 0.35 },
  'home-features': { image: 'scene-home-features.jpg', name: '晴空', dim: 0.4 },
  'home-story': { image: 'scene-home-story.jpg', name: '落花', dim: 0.45 },
  'home-slot': { image: 'scene-home-slot.jpg', name: '暗翼', dim: 0.35 },
  about: { image: 'scene-about.jpg', name: '旧城', dim: 0.5 },
  glimmer: { image: 'scene-glimmer.jpg', name: '春信', dim: 0.4 },
  collection: { image: 'scene-collection.jpg', name: '古街', dim: 0.4 },
  friends: { image: 'scene-friends.jpg', name: '礁岸', dim: 0.45 },
  guestbook: { image: 'scene-guestbook.jpg', name: '夜归', dim: 0.45 },
  blog: { image: 'scene-blog.jpg', name: '雪线', dim: 0.5 },
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

/**
 * 场景 → 壁纸对象（形状与 wallpapers.js 的条目兼容，好让 WallpaperScene 直接吃）。
 * 未知场景回落默认场景。
 * 注意 index 为 null —— 场景壁纸不在罗盘壁纸表里，没有罗盘序号。
 */
export function sceneWallpaper(key) {
  const scene = SCENES[key] || SCENES[DEFAULT_SCENE]
  return {
    index: null,
    name: scene.name,
    dim: typeof scene.dim === 'number' ? scene.dim : 0,
    scene: { image: `${BASE}wallpapers/scene/${scene.image}` },
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
