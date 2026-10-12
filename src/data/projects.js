/**
 * 「关于我」页面的项目与技能数据。
 *
 * 纯前端假数据，无后端。项目卡片只用首字母 + 渐变做视觉，
 * 不引用任何外部图片。
 */

export const PROJECTS = [
  {
    id: 'portfolio',
    name: '个人站',
    initial: 'P',
    url: 'https://github.com/',
    accent: '#edff66',
    desc: '你正在看的这个站。深空底、霓虹点缀，内容全部手写，没有模板。',
    tags: ['React', 'Vite', 'Tailwind', 'GSAP'],
  },
  {
    id: 'collection',
    name: '收藏站',
    initial: 'C',
    url: 'https://github.com/',
    accent: '#7c5cff',
    desc: '把翻得最多的站点、书和游戏收进一张网格里，顺手记一句为什么留着。',
    tags: ['React', 'Router', 'LocalStorage'],
  },
  {
    id: 'slot',
    name: '小工具 · 抽签器',
    initial: 'S',
    url: 'https://github.com/',
    accent: '#90e8d6',
    desc: '选择困难时拉一下拉杆，随机指一个去处，带滚动动画和抽取历史。',
    tags: ['JavaScript', 'CSS 动画'],
  },
  {
    id: 'wallpaper',
    name: '壁纸画廊',
    initial: 'W',
    url: 'https://github.com/',
    accent: '#4fb7dd',
    desc: '四方位的纯 CSS 场景壁纸，用渐变和几何线条凑出画面，零图片资源。',
    tags: ['Canvas', 'SVG', 'CSS 渐变'],
  },
  {
    id: 'reader',
    name: '阅读器',
    initial: 'R',
    url: 'https://github.com/',
    accent: '#ff8fab',
    desc: '为长文准备的沉浸阅读页，字号行距可调，进度条按章节走。',
    tags: ['React', 'TypeScript'],
  },
  {
    id: 'tools',
    name: 'AI 工具索引',
    initial: 'T',
    url: 'https://github.com/',
    accent: '#ffe7b8',
    desc: '把出图、提示词、做分享页的站点分好类，按常用度排序，随时跳转。',
    tags: ['数据结构', 'JSON', 'UI'],
  },
]

export const SKILLS = [
  { name: 'JavaScript', accent: '#edff66' },
  { name: 'TypeScript', accent: '#4fb7dd' },
  { name: 'React', accent: '#7c5cff' },
  { name: 'Vite', accent: '#edff66' },
  { name: 'Tailwind CSS', accent: '#90e8d6' },
  { name: 'CSS 动画', accent: '#ff8fab' },
  { name: 'GSAP', accent: '#7c5cff' },
  { name: 'Node.js', accent: '#90e8d6' },
  { name: 'Git', accent: '#ffe7b8' },
  { name: 'Python', accent: '#4fb7dd' },
  { name: 'UI 设计', accent: '#ff8fab' },
  { name: 'Figma', accent: '#edff66' },
]
