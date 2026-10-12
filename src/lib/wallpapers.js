/**
 * 四张 Hero 壁纸。
 *
 * 图片来自用户提供的素材（原图在 图片\头像\，已复制到 public/wallpapers/）。
 * scene.image 存在时优先渲染图片；图片缺失则回退到同色系渐变，不会白屏。
 * 每张携带 direction / angle / poem / theme —— 罗盘选中后配色与诗句随之切换。
 *
 * 想换图：把新图放进 public/wallpapers/ 覆盖 wp1~wp4.jpg 即可，无需改代码。
 */

/** 部署基路径（GitHub Pages 项目页形如 /repo/）；字符串资源路径必须手动拼上它，Vite 不会改写字符串 */
const BASE = import.meta.env.BASE_URL

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
      image: `${BASE}wallpapers/wp1.jpg`,
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
      image: `${BASE}wallpapers/wp2.jpg`,
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
      image: `${BASE}wallpapers/wp3.jpg`,
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
      image: `${BASE}wallpapers/wp4.jpg`,
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

/**
 * 追加的 4 张封面 —— 用户反馈「选择器里可选壁纸太少」，从 4 张扩到 8 张。
 * 只有 scene.image（图直接铺满），不带生成式渐变；WallpaperScene 在有图时不会走渐变分支。
 * 配色沿用上面四套主题，诗句换成另外四位，避免《锦瑟》八句被用两遍。
 */
export const EXTRA_COVERS = [
  {
    index: 5,
    direction: 'NE',
    label: 'North-East',
    name: '晨雾',
    angle: 45,
    poem: ['行到水穷处', '坐看云起时'],
    theme: {
      accent: '#d9fff3',
      line: 'rgba(217, 255, 243, 0.5)',
      soft: 'rgba(144, 232, 214, 0.2)',
      glow: 'rgba(184, 255, 239, 0.3)',
      overlay: 'rgba(8, 18, 20, 0.6)',
    },
    scene: { image: `${BASE}wallpapers/scene/scene-home-about-2.jpg` },
  },
  {
    index: 6,
    direction: 'SE',
    label: 'South-East',
    name: '花信',
    angle: 135,
    poem: ['人生如逆旅', '我亦是行人'],
    theme: {
      accent: '#f7d8ff',
      line: 'rgba(247, 216, 255, 0.5)',
      soft: 'rgba(214, 165, 255, 0.2)',
      glow: 'rgba(235, 202, 255, 0.3)',
      overlay: 'rgba(14, 9, 22, 0.6)',
    },
    scene: { image: `${BASE}wallpapers/scene/scene-glimmer-2.jpg` },
  },
  {
    index: 7,
    direction: 'SW',
    label: 'South-West',
    name: '远帆',
    angle: 225,
    poem: ['山随平野尽', '江入大荒流'],
    theme: {
      accent: '#ffe7b8',
      line: 'rgba(255, 231, 184, 0.5)',
      soft: 'rgba(255, 202, 128, 0.2)',
      glow: 'rgba(255, 221, 170, 0.3)',
      overlay: 'rgba(16, 13, 18, 0.6)',
    },
    scene: { image: `${BASE}wallpapers/scene/scene-friends.jpg` },
  },
  {
    index: 8,
    direction: 'NW',
    label: 'North-West',
    name: '孤星',
    angle: 315,
    poem: ['星垂平野阔', '月涌大江流'],
    theme: {
      accent: '#f2f6ff',
      line: 'rgba(242, 246, 255, 0.5)',
      soft: 'rgba(180, 205, 255, 0.2)',
      glow: 'rgba(210, 225, 255, 0.3)',
      overlay: 'rgba(6, 10, 20, 0.6)',
    },
    scene: { image: `${BASE}wallpapers/scene/scene-blog-2.jpg` },
  },
]

/** 罗盘上所有可选封面 = 原来 4 张 + 追加 4 张 */
export const ALL_COVERS = [...WALLPAPERS, ...EXTRA_COVERS]

export const getWallpaper = (index) =>
  ALL_COVERS.find((item) => item.index === index) || ALL_COVERS[0]

/** 罗盘 32 刻度 */
export const COMPASS_TICKS = 32

/**
 * 罗盘卡片的屏幕方位，按 **cover.index** 索引 —— 必须与该 cover 的 angle 一一对应，
 * 否则指针指的方向和卡片所在的位置会错位。
 * 角度 → 方位：0=N上 / 45=NE右上 / 90=E右 / 135=SE右下 / 180=S下 / 225=SW左下 / 270=W左 / 315=NW左上
 */
export const COMPASS_CARD_POSITIONS = {
  1: 'left-1/2 top-[-2%] -translate-x-1/2', // 0° N
  2: 'left-[80%] top-1/2 -translate-x-1/2 -translate-y-1/2', // 90° E
  3: 'left-1/2 top-[96%] -translate-x-1/2 -translate-y-full', // 180° S
  4: 'left-[20%] top-1/2 -translate-x-1/2 -translate-y-1/2', // 270° W
  5: 'left-[74%] top-[9%] -translate-x-1/2', // 45° NE
  6: 'left-[74%] top-[71%] -translate-x-1/2', // 135° SE
  7: 'left-[26%] top-[71%] -translate-x-1/2', // 225° SW
  8: 'left-[26%] top-[9%] -translate-x-1/2', // 315° NW
}
