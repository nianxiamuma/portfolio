/**
 * 四张 Hero 壁纸。
 *
 * 图片来自用户提供的素材（原图在 图片\头像\，已复制到 public/wallpapers/）。
 * scene.image 存在时优先渲染图片；图片缺失则回退到同色系渐变，不会白屏。
 * 每张携带 direction / angle / poem / theme —— 罗盘选中后配色与诗句随之切换。
 *
 * 想换图：把新图放进 public/wallpapers/ 覆盖 wp1~wp4.jpg 即可，无需改代码。
 */

export const WALLPAPERS = [
  {
    index: 1,
    direction: 'N',
    label: 'North',
    name: '初雪',
    angle: 0,
    poem: ['锦瑟无端五十弦', '一弦一柱思华年'],
    theme: {
      accent: '#f2f6ff',
      line: 'rgba(242, 246, 255, 0.5)',
      soft: 'rgba(180, 205, 255, 0.2)',
      glow: 'rgba(210, 225, 255, 0.3)',
      overlay: 'rgba(6, 10, 20, 0.6)',
    },
    scene: {
      image: '/wallpapers/wp1.jpg',
      base: 'linear-gradient(165deg, #1a2540 0%, #0d1428 48%, #04060f 100%)',
      blobA: 'radial-gradient(circle, rgba(122, 168, 255, 0.46), transparent 62%)',
      blobB: 'radial-gradient(circle, rgba(56, 88, 190, 0.34), transparent 66%)',
      blobAPos: '-10% 18%',
      blobBPos: '78% 72%',
      horizon: 'rgba(150, 190, 255, 0.5)',
      star: '#dde8ff',
    },
  },
  {
    index: 2,
    direction: 'E',
    label: 'East',
    name: '晴空',
    angle: 90,
    poem: ['庄生晓梦迷蝴蝶', '望帝春心托杜鹃'],
    theme: {
      accent: '#ffe7b8',
      line: 'rgba(255, 231, 184, 0.5)',
      soft: 'rgba(255, 202, 128, 0.18)',
      glow: 'rgba(255, 221, 170, 0.3)',
      overlay: 'rgba(16, 12, 18, 0.6)',
    },
    scene: {
      image: '/wallpapers/wp2.jpg',
      base: 'linear-gradient(165deg, #2a1a12 0%, #1a1020 46%, #0a0610 100%)',
      blobA: 'radial-gradient(circle, rgba(255, 190, 110, 0.42), transparent 60%)',
      blobB: 'radial-gradient(circle, rgba(210, 110, 80, 0.3), transparent 66%)',
      blobAPos: '72% 12%',
      blobBPos: '12% 78%',
      horizon: 'rgba(255, 214, 150, 0.5)',
      star: '#ffe7b8',
    },
  },
  {
    index: 3,
    direction: 'S',
    label: 'South',
    name: '晚风',
    angle: 180,
    poem: ['沧海月明珠有泪', '蓝田日暖玉生烟'],
    theme: {
      accent: '#f7d8ff',
      line: 'rgba(247, 216, 255, 0.5)',
      soft: 'rgba(214, 165, 255, 0.18)',
      glow: 'rgba(235, 202, 255, 0.3)',
      overlay: 'rgba(12, 9, 22, 0.6)',
    },
    scene: {
      image: '/wallpapers/wp3.jpg',
      base: 'linear-gradient(165deg, #241735 0%, #170f2a 46%, #080512 100%)',
      blobA: 'radial-gradient(circle, rgba(200, 140, 255, 0.42), transparent 60%)',
      blobB: 'radial-gradient(circle, rgba(255, 130, 200, 0.26), transparent 66%)',
      blobAPos: '24% 8%',
      blobBPos: '80% 66%',
      horizon: 'rgba(230, 180, 255, 0.5)',
      star: '#f7d8ff',
    },
  },
  {
    index: 4,
    direction: 'W',
    label: 'West',
    name: '远山',
    angle: 270,
    poem: ['此情可待成追忆', '只是当时已惘然'],
    theme: {
      accent: '#d9fff3',
      line: 'rgba(217, 255, 243, 0.5)',
      soft: 'rgba(144, 232, 214, 0.18)',
      glow: 'rgba(184, 255, 239, 0.3)',
      overlay: 'rgba(6, 14, 16, 0.6)',
    },
    scene: {
      image: '/wallpapers/wp4.jpg',
      base: 'linear-gradient(165deg, #0d2a2b 0%, #08191f 46%, #03080c 100%)',
      blobA: 'radial-gradient(circle, rgba(120, 240, 210, 0.38), transparent 60%)',
      blobB: 'radial-gradient(circle, rgba(90, 170, 220, 0.3), transparent 66%)',
      blobAPos: '68% 22%',
      blobBPos: '16% 70%',
      horizon: 'rgba(180, 255, 238, 0.5)',
      star: '#d9fff3',
    },
  },
]

export const getWallpaper = (index) =>
  WALLPAPERS.find((item) => item.index === index) || WALLPAPERS[0]

/** 罗盘 32 刻度 */
export const COMPASS_TICKS = 32

/** 罗盘卡片在四个方位的定位（对应上 / 右 / 下 / 左） */
export const COMPASS_CARD_POSITIONS = {
  1: 'left-1/2 top-[-2%] -translate-x-1/2',
  2: 'left-[78%] top-1/2 -translate-x-1/2 -translate-y-1/2',
  3: 'left-1/2 top-[102%] -translate-x-1/2 -translate-y-full',
  4: 'left-[22%] top-1/2 -translate-x-1/2 -translate-y-1/2',
}
