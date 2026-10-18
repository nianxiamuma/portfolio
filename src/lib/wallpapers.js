import { activeMonth, monthWallpaper } from './monthWallpapers'

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

/** 罗盘上所有可选封面 = 8 张现有封面（扩 12 月方案见下方 MONTH_COVERS） */
export const ALL_COVERS = [...WALLPAPERS, ...EXTRA_COVERS]

export const getWallpaper = (index) =>
  ALL_COVERS.find((item) => item.index === index) || ALL_COVERS[0]

/**
 * 12 个月的背景图。
 *
 * 2026-10-18 换血：原来从 oracle 壁纸池取 12 张，那批图里本身就有角色特写，
 * 和叠在上面的美少女立绘撞成"两个人站在同一屏"，主次分不清。
 * 现在改用 public/wallpapers/scene/ 下同一套场景摄影图（1920×1080，全站统一调性），
 * 背景退到后面当氛围，立绘才是主体。
 */
const MONTH_BG = [
  'scene/scene-blog-2.jpg', // 云海落日
  'scene/scene-fragments-2.jpg', // 蓝天草原
  'scene/scene-friends.jpg', // 海岸礁石
  'scene/scene-home-about.jpg', // 山谷雪峰
  'scene/scene-home-features-2.jpg', // 绿谷
  'scene/scene-home-features.jpg', // 云海
  'scene/scene-blog.jpg', // 雪山星空
  'scene/scene-hero-2.jpg', // 星海
  'scene/scene-about.jpg', // 工业废墟
  'scene/scene-home-about-2.jpg', // 城市天际线
  'scene/scene-blog-2.jpg', // 循环（纯风景只有 10 张，凑满 12 个月）
  'scene/scene-fragments-2.jpg',
]

/**
 * ── 12 月份罗盘方案 ──
 * 12 张封面按月份排列在罗盘上（每张占 30°），并各配一张「依月份生成的美少女立绘」。
 * 立绘文件放在 public/portraits/m{n}.png（如 m1.png = 一月）。
 * 立绘生成后放置到位即可；文件不存在时立绘层自动隐藏，页面不白屏。
 *
 * 月份 → 角度：1月=0°(正上)，之后每月 +30°，12月=330°。
 */
export const MONTH_COVERS = [
  { month: 1, index: 1, name: '睦月', character: '宫野志保', angle: 0, poem: ['寒宵正是读书天', '一盏青灯伴雪眠'], style: '灰原哀式娇小身形、茶棕内扣波波头、奶白居家毛衣' },
  { month: 2, index: 2, name: '如月', character: '雪之下雪乃', angle: 30, poem: ['梅心已自暖', '不必待春风'], style: '新中式少女、黑长直红发饰、改良旗袍马面裙' },
  { month: 3, index: 3, name: '弥生', character: '樱岛麻衣', angle: 60, poem: ['春路雨添花', '花动一山春色'], style: '元气少女、高马尾、JK制服白色堆堆袜' },
  { month: 4, index: 4, name: '卯月', character: '后藤一里', angle: 90, poem: ['人间四月芳菲尽', '山寺桃花始盛开'], style: '开朗大姐姐、鱿鱼须发型、卫衣鸭舌帽大长腿' },
  { month: 5, index: 5, name: '皋月', character: '中野三玖', angle: 120, poem: ['绿树阴浓夏日长', '楼台倒影入池塘'], style: '优雅大小姐、金色大波浪卷发、洋装礼帽阳伞' },
  { month: 6, index: 6, name: '水无月', character: '栗山未来', angle: 150, poem: ['黄梅时节家家雨', '青草池塘处处蛙'], style: '神秘哥特少女、姬发式公主切、洛丽塔白丝乐福鞋' },
  { month: 7, index: 7, name: '文月', character: '02', angle: 180, poem: ['接天莲叶无穷碧', '映日荷花别样红'], style: '运动系少女、侧马尾、运动背心牛仔短裤' },
  { month: 8, index: 8, name: '叶月', character: '远坂凛', angle: 210, poem: ['银烛秋光冷画屏', '轻罗小扇扑流萤'], style: '元气少女、双马尾、吊带白裙草帽' },
  { month: 9, index: 9, name: '长月', character: '蕾塞', angle: 240, poem: ['秋风起兮白云飞', '草木黄落兮雁南归'], style: '温柔文学少女、鱼骨编发、针织开衫长裙' },
  { month: 10, index: 10, name: '神无月', character: '上杉绘梨衣', angle: 270, poem: ['霜叶红于二月花', '白云生处有人家'], style: '侦探少女、丸子头、贝雷帽风衣长靴' },
  { month: 11, index: 11, name: '霜月', character: '友利奈绪', angle: 300, poem: ['晚来天欲雪', '能饮一杯无'], style: '高冷御姐、银灰长直发、呢子大衣皮手套' },
  { month: 12, index: 12, name: '师走', character: '薇尔莉特', angle: 330, poem: ['绿蚁新醅酒', '红泥小火炉'], style: '成熟OL姐姐、大波浪卷发、职业装黑丝大衣' },
].map((item, i) => ({
  ...item,
  direction: `M${item.month}`,
  label: `${item.month}月`,
  portrait: `${BASE}portraits/m${item.month}.png`,
  /* 背景暂从 oracle 图库按序取用；立绘到位后可逐月换成当月主题图 */
  theme: {
    accent: ['#f2f6ff', '#ffd9ec', '#ffe7b8', '#d9fff3', '#c8f0ff', '#e3d4ff', '#ffe0e6', '#fff3c4', '#ffd9b8', '#ffb8b8', '#d4e5ff', '#e8dcff'][i],
    line: 'rgba(255,255,255,0.35)',
    soft: 'rgba(150,180,255,0.15)',
    glow: 'rgba(190,215,255,0.3)',
    /* 12 月背景是给立绘当底的：压到 0.78，让照片退成氛围，人物才是主体 */
    overlay: 'rgba(4, 7, 14, 0.78)',
  },
  scene: {
    /* 该月配了「主页壁纸」（壁纸 1）就用它；没配则回退月份背景池 */
    image: monthWallpaper('hero', item.month) || `${BASE}wallpapers/${MONTH_BG[i]}`,
  },
}))

/** 12 月方案的完整封面清单（罗盘与立绘层的数据源） */
export const MONTH_LIST = MONTH_COVERS

/** 按 index 取月份封面（12 月方案专用，与旧 8 项清单互不干扰） */
export const getMonthCover = (index) =>
  MONTH_COVERS.find((item) => item.index === index) || MONTH_COVERS[0]

/** 按访客当地月份返回 12 月方案的封面 index（罗盘仍可手动切换，此处只是初值） */
export function monthlyCoverIndex(date = new Date()) {
  const month = activeMonth(date)
  return MONTH_COVERS.find((item) => item.month === month)?.index || 1
}

/** 罗盘 32 刻度 */
export const COMPASS_TICKS = 32

/**
 * 罗盘卡片布点：按 cover.angle 把卡片均匀放到以罗盘为圆心的椭圆轨道上。
 * 12 张卡用三角函数自动布点，不再手写每个方位的类名。
 * 返回内联样式（left/top/translate），角度 0° = 正上，顺时针为正，与罗盘角度一致。
 */
export function compassCardStyle(angle, { rx = 42, ry = 40 } = {}) {
  const rad = ((angle - 90) * Math.PI) / 180 // 0°在正上 → 数学角 90°
  const x = 50 + rx * Math.cos(rad)
  const y = 50 + ry * Math.sin(rad)
  return {
    left: `${x}%`,
    top: `${y}%`,
    transform: 'translate(-50%, -50%)',
  }
}
