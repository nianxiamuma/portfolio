/**
 * 站点索引卡片（/home）的唯一数据源。
 *
 * 三组卡片，各自的去处不同：
 * - `pages`：真实路由（/about、/glimmer、/guestbook、/sources）
 * - `sections`：首页区块锚点。带 `?nointro` 跳过开场动画——
 *   不然从索引点进去要先被开场挡 4 秒，锚点跳转等于白做
 * - `external`：同仓的 Astro 博客子站，走真实 `<a href>`（SPA 路由切不过去）
 *
 * icon 只存字符串键，由页面映射到 lucide 组件：数据层保持纯数据，测试不需要 JSX。
 */
const BASE = import.meta.env.BASE_URL

export const INDEX_GROUPS = [
  { id: 'pages', label: '页面', hint: 'PAGES' },
  { id: 'sections', label: '首页片段', hint: 'SECTIONS' },
  { id: 'external', label: '子站', hint: 'EXTERNAL' },
]

export const INDEX_CARDS = [
  {
    id: 'about',
    group: 'pages',
    icon: 'user',
    title: '关于我',
    subtitle: 'About',
    desc: '自我介绍、书架与游戏机，还有一枚头像',
    to: '/about',
  },
  {
    id: 'glimmer',
    group: 'pages',
    icon: 'sparkles',
    title: '神谕',
    subtitle: 'Glimmer',
    desc: '这一年捡到的画面，按年份与分类收着',
    to: '/glimmer',
  },
  {
    id: 'guestbook',
    group: 'pages',
    icon: 'message',
    title: '留言板',
    subtitle: 'Guestbook',
    desc: '想说什么都行，关掉页面也不会丢',
    to: '/guestbook',
  },
  {
    id: 'sources',
    group: 'pages',
    icon: 'shield',
    title: '来源与致谢',
    subtitle: 'Sources',
    desc: '素材从哪来、授权边界画在哪',
    to: '/sources',
  },
  {
    id: 'features',
    group: 'sections',
    icon: 'wrench',
    title: 'AI 工具箱',
    subtitle: 'Features',
    desc: '主展位与 Bento 网格里的一排工具站',
    to: '/?nointro#features',
  },
  {
    id: 'fragments',
    group: 'sections',
    icon: 'grid',
    title: '散落的片段',
    subtitle: 'Fragments',
    desc: '六个片段，编号 01–06，卡里是壁纸静帧',
    to: '/?nointro#fragments',
  },
  {
    id: 'story',
    group: 'sections',
    icon: 'mail',
    title: '一封信',
    subtitle: 'Story',
    desc: '写给点开这个站的人，打开信封才看得到',
    to: '/?nointro#story',
  },
  {
    id: 'slot',
    group: 'sections',
    icon: 'send',
    title: '抽奖机',
    subtitle: 'Contact',
    desc: '拉一下拉杆，抽一张纸条和一张壁纸',
    to: '/?nointro#slot',
  },
  {
    id: 'blog',
    group: 'external',
    icon: 'pen',
    title: '博客',
    subtitle: 'Blog',
    desc: '独立的 Astro 子站，长文都写在那里',
    href: `${BASE}blog/`,
    external: true,
  },
]

/** 按分组切卡片；组内保持 INDEX_CARDS 的顺序 */
export function cardsOf(groupId, cards = INDEX_CARDS) {
  return cards.filter((card) => card.group === groupId)
}

/**
 * 首页锚点卡片是否合法（防止再出现 `/collection` 那种「页面删了、链接还在」的死链）。
 * 只允许：以 `/?nointro#` 开头的首页锚点，或本文件里登记过的真实页面路由。
 */
export const HOME_SECTION_PREFIX = '/?nointro#'

export function targetsHomeSection(card) {
  return Boolean(card?.to && card.to.startsWith(HOME_SECTION_PREFIX))
}

export function sectionIdOf(card) {
  return targetsHomeSection(card) ? card.to.slice(HOME_SECTION_PREFIX.length) : null
}
