/**
 * 留言板初始数据（纯前端假数据，无后端依赖）。
 *
 * 用途：后端未接入时，页面也有像样的内容可展示；
 * 用户自己发的留言与回复保存在 localStorage（键 `guestbook-local`），
 * 与本文件的数据合并后按时间倒序渲染，二者互不覆盖。
 *
 * 字段：
 * - id        唯一键，用于 React list key 与本地回复的归属
 * - nickname  昵称（头像取首个字符）
 * - email     邮箱，选填；仅本地留存，不在页面上展示
 * - content   留言正文
 * - createdAt 时间戳（毫秒），由相对偏移算出，保证任何时候打开都是「x 小时前」
 * - accent    头像渐变与光晕的品牌色
 * - replies   本条留言的回复（结构同留言，可省略）
 */

const MINUTE = 60 * 1000
const HOUR = 60 * MINUTE
const DAY = 24 * HOUR

/** 头像渐变可用的品牌色（与 tailwind 的 neon 色板同源） */
export const GUESTBOOK_ACCENTS = [
  '#edff66',
  '#7c5cff',
  '#4fb7dd',
  '#90e8d6',
  '#ff8fab',
  '#ffe7b8',
]

/** 相对偏移 → 时间戳，避免写死日期导致「3 天前」变成「两年前」 */
const ago = (ms) => Date.now() - ms

export const GUESTBOOK_SEED = [
  {
    id: 'seed-linxi',
    nickname: '临溪',
    email: '',
    content: '从友链翻过来的。暗色底加粒子那一段看得很舒服，已经收进书签了。',
    createdAt: ago(42 * MINUTE),
    accent: '#edff66',
    replies: [],
  },
  {
    id: 'seed-aqi',
    nickname: '阿柒',
    email: 'aqi@example.com',
    content: '小说阅读器做得比我想的完整，翻页和字号都调过吧？什么时候把书架一起放出来。',
    createdAt: ago(5 * HOUR),
    accent: '#7c5cff',
    replies: [],
  },
  {
    id: 'seed-wangyue',
    nickname: '望月',
    email: '',
    content: '凌晨三点逛到这儿，留言板终于有了。顺嘴说一句：代码再好看也别熬这么晚。',
    createdAt: ago(28 * HOUR),
    accent: '#4fb7dd',
    replies: [],
  },
  {
    id: 'seed-zhoutian',
    nickname: '周天',
    email: '',
    content:
      '上面那位说得在理。站做得干净，就是首页那段开场有点长，第一次进来差点以为卡住了。',
    createdAt: ago(3 * DAY + 4 * HOUR),
    accent: '#90e8d6',
    replies: [
      {
        id: 'seed-reply-zhou-1',
        nickname: '临溪',
        content: '第二遍看就顺了，我倒觉得挺有仪式感。',
        createdAt: ago(2 * DAY + 6 * HOUR),
      },
      {
        id: 'seed-reply-zhou-2',
        nickname: '站长',
        content: '收到，回头把跳过按钮做得明显一点。',
        createdAt: ago(2 * DAY),
      },
    ],
  },
  {
    id: 'seed-moyu',
    nickname: '墨鱼',
    email: '',
    content: '标题用的是 Noto Serif SC 吧？中文标题这个衬线取舍很舒服，想在自留地里抄一份排版。',
    createdAt: ago(6 * DAY),
    accent: '#ffe7b8',
    replies: [],
  },
]
