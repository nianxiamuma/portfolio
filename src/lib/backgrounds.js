/**
 * 背景场景表 —— 全站背景的唯一真源。
 *
 * 页面和区块只声明「我是哪个场景」，由这里查表得到用哪张壁纸、哪个视频。
 * 换背景只改这张表；新增页面只加一行路由映射。
 *
 * 与 wallpapers.js 的分工：
 *   wallpapers.js —— 壁纸本身长什么样（图 / 视频 / 配色 / 诗句）
 *   backgrounds.js —— 谁在什么时候用哪张壁纸（本文件）
 */
import { getWallpaper } from './wallpapers'

/** 解析不出场景时的兜底 */
export const DEFAULT_SCENE = 'home-hero'

/**
 * 场景 → 背景定义。
 * wallpaper：WALLPAPERS 里的 index
 *
 * 关于视频：2026-10-13 用户看过 53 个候选后决定「视频不用了」，
 * 因此这里不再挂任何视频。WallpaperScene 在 scene.video 缺失时自动回落到静态图，
 * 要恢复视频只需在此加一个 video 字段并把它接进 wallpapers.js。
 */
export const SCENES = {
  'home-hero': { wallpaper: 1 },
  'home-about': { wallpaper: 2 },
  'home-features': { wallpaper: 3 },
  'home-story': { wallpaper: 4 },
  'home-slot': { wallpaper: 1 },
  about: { wallpaper: 2 },
  glimmer: { wallpaper: 3 },
  collection: { wallpaper: 4 },
  friends: { wallpaper: 2 },
  guestbook: { wallpaper: 3 },
  blog: { wallpaper: 1 },
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

/** 场景 → 壁纸对象（含 scene 图层定义）。未知场景回落默认场景。 */
export function sceneWallpaper(key) {
  const scene = SCENES[key] || SCENES[DEFAULT_SCENE]
  return getWallpaper(scene.wallpaper)
}

/** 场景 → 视频文件名（相对 public/wallpapers/）；没有则 null */
export function sceneVideo(key) {
  const scene = SCENES[key] || SCENES[DEFAULT_SCENE]
  return scene.video || null
}

/**
 * 从「各区块相对视口的位置」中挑出当前生效的区块场景。
 *
 * rects 需按文档顺序给出（DOM 顺序），每项 { key, top, bottom }（top/bottom 来自
 * getBoundingClientRect）。规则：取最后一个 top <= 0 的区块 —— 也就是「已经把视口
 * 顶端盖过」的最靠下那个；还没滚到任何区块时返回 null，交回路由默认场景。
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
