/**
 * 「神谕」的内容源。
 *
 * 两条线：
 *  - GLIMMER_ALBUMS：相册。封面与照片都不引用任何外部图片，只给出 hue（色相）
 *    与 shape（几何母题），由页面用 CSS 渐变 + 图形现画。
 *  - GLIMMER_NOTES：碎语。日期 / 分类 / 一句中文短句，按时间倒序。
 */

/** 生成式画布支持的几何母题（GlimmerPage 里一一对应一层图形） */
export const GLIMMER_SHAPES = ['rings', 'streaks', 'grid', 'arc', 'dots', 'prism']

export const GLIMMER_ALBUMS = [
  {
    id: 'rain-street',
    title: '雨街',
    label: 'Rain Street',
    desc: '下过雨的路面，把招牌又翻了一遍。',
    accent: '#7c5cff',
    hue: 268,
    shape: 'streaks',
    photos: [
      { id: 'rain-01', title: '便利店玻璃', hue: 268, shape: 'rings' },
      { id: 'rain-02', title: '伞下的霓虹', hue: 286, shape: 'streaks' },
      { id: 'rain-03', title: '倒影里的路牌', hue: 258, shape: 'grid' },
      { id: 'rain-04', title: '斑马线与水洼', hue: 300, shape: 'arc' },
      { id: 'rain-05', title: '末班车尾灯', hue: 340, shape: 'dots' },
      { id: 'rain-06', title: '铺面的卷帘门', hue: 252, shape: 'prism' },
    ],
  },
  {
    id: 'night-tide',
    title: '夜海',
    label: 'Night Tide',
    desc: '退潮之后，沙滩上留着一条亮线。',
    accent: '#4fb7dd',
    hue: 196,
    shape: 'arc',
    photos: [
      { id: 'tide-01', title: '潮线', hue: 196, shape: 'arc' },
      { id: 'tide-02', title: '远处的灯塔', hue: 172, shape: 'prism' },
      { id: 'tide-03', title: '船灯三点', hue: 210, shape: 'dots' },
      { id: 'tide-04', title: '无风的那一段', hue: 186, shape: 'grid' },
    ],
  },
  {
    id: 'old-lanes',
    title: '旧巷',
    label: 'Old Lanes',
    desc: '巷子窄，光只肯在中午落进来一会儿。',
    accent: '#ffe7b8',
    hue: 42,
    shape: 'grid',
    photos: [
      { id: 'lane-01', title: '晾衣绳', hue: 42, shape: 'streaks' },
      { id: 'lane-02', title: '门牌号', hue: 28, shape: 'prism' },
      { id: 'lane-03', title: '猫与藤椅', hue: 52, shape: 'rings' },
      { id: 'lane-04', title: '石板缝里的草', hue: 34, shape: 'grid' },
      { id: 'lane-05', title: '傍晚的巷口', hue: 16, shape: 'dots' },
    ],
  },
  {
    id: 'window-light',
    title: '窗光',
    label: 'Window Light',
    desc: '同一扇窗，早上和下午是两种颜色。',
    accent: '#edff66',
    hue: 92,
    shape: 'dots',
    photos: [
      { id: 'light-01', title: '早班的光', hue: 92, shape: 'prism' },
      { id: 'light-02', title: '桌角的灰', hue: 108, shape: 'rings' },
      { id: 'light-03', title: '半开的百叶', hue: 84, shape: 'streaks' },
      { id: 'light-04', title: '落灰的玻璃', hue: 130, shape: 'arc' },
    ],
  },
]

export const GLIMMER_NOTES = [
  {
    id: 'note-2025-11-02',
    year: 2025,
    date: '11.02',
    category: '夜行',
    line: '十一点半的便利店，热柜的灯比月亮亮。',
  },
  {
    id: 'note-2025-09-18',
    year: 2025,
    date: '09.18',
    category: '手记',
    line: '把没说完的话写下来，纸上就安静了。',
  },
  {
    id: 'note-2025-06-30',
    year: 2025,
    date: '06.30',
    category: '影像',
    line: '暴雨收尾的傍晚，天边裂开一道橘色的缝。',
  },
  {
    id: 'note-2025-03-12',
    year: 2025,
    date: '03.12',
    category: '散步',
    line: '樱花落下时没有声音，但整条路都慢了。',
  },
  {
    id: 'note-2024-12-24',
    year: 2024,
    date: '12.24',
    category: '友人',
    line: '四个人分一碗汤，冷天也就不算冷。',
  },
  {
    id: 'note-2024-08-07',
    year: 2024,
    date: '08.07',
    category: '阅读',
    line: '读到一半合上书，窗外正好开始下雨。',
  },
  {
    id: 'note-2024-05-21',
    year: 2024,
    date: '05.21',
    category: '清晨',
    line: '五点的天空是藏青色的，像还没干透的墨。',
  },
  {
    id: 'note-2023-10-09',
    year: 2023,
    date: '10.09',
    category: '夜行',
    line: '末班地铁里，疲惫的人都在偷偷发光。',
  },
]

/** 分类 → 强调色（页面上用于时间线圆点与分类标签） */
export const GLIMMER_CATEGORY_TONES = {
  夜行: '#7c5cff',
  手记: '#edff66',
  影像: '#4fb7dd',
  散步: '#90e8d6',
  友人: '#ff8fab',
  阅读: '#ffe7b8',
  清晨: '#a5e4fd',
}

/** 年份由新到旧；分类按首次出现顺序 */
export const GLIMMER_YEARS = [...new Set(GLIMMER_NOTES.map((note) => note.year))].sort(
  (a, b) => b - a,
)

export const GLIMMER_CATEGORIES = [...new Set(GLIMMER_NOTES.map((note) => note.category))]

export const GLIMMER_STATS = {
  albumCount: GLIMMER_ALBUMS.length,
  photoCount: GLIMMER_ALBUMS.reduce((sum, album) => sum + album.photos.length, 0),
  noteCount: GLIMMER_NOTES.length,
}
