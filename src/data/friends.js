/**
 * 友链数据。
 *
 * 首条「桃之夭夭」为指定收录对象，务必保留。
 * 其余条目为占位示例（域名统一用 example.com，便于一眼识别），
 * 接入真实友站时，按同样的结构替换 name / url / domain / desc / accent 即可。
 *
 * 字段：
 * - id      唯一键，用于 React list key
 * - name    站点名（头像取首个字符）
 * - url     外链地址
 * - domain  展示用域名
 * - desc    一句话描述
 * - accent  头像渐变与光晕的品牌色
 */

export const FRIENDS = [
  {
    id: 'taozhiyy',
    name: '桃之夭夭',
    url: 'https://www.taozhiyy.top',
    domain: 'taozhiyy.top',
    desc: '参考与学习的对象',
    accent: '#ff8fab',
  },
  {
    id: 'shiguang',
    name: '拾光笔记',
    url: 'https://shiguang.example.com',
    domain: 'shiguang.example.com',
    desc: '白天写代码，夜里写字，把日子过成文档。',
    accent: '#edff66',
  },
  {
    id: 'xingye',
    name: '星野小站',
    url: 'https://xingye.example.com',
    domain: 'xingye.example.com',
    desc: '一个安静的角落，放些天文与摄影。',
    accent: '#4fb7dd',
  },
  {
    id: 'muyu',
    name: '木鱼书斋',
    url: 'https://muyu.example.com',
    domain: 'muyu.example.com',
    desc: '读书笔记与长文，写得慢但写得认真。',
    accent: '#90e8d6',
  },
  {
    id: 'banzhan',
    name: '半盏清茶',
    url: 'https://banzhan.example.com',
    domain: 'banzhan.example.com',
    desc: '生活碎记与一点前端心得，茶凉了也不急着走。',
    accent: '#ffe7b8',
  },
  {
    id: 'manzhe',
    name: '代码漫游者',
    url: 'https://manzhe.example.com',
    domain: 'manzhe.example.com',
    desc: '折腾各种语言与工具，踩坑记录都留在这里。',
    accent: '#7c5cff',
  },
  {
    id: 'yunjian',
    name: '云间札记',
    url: 'https://yunjian.example.com',
    domain: 'yunjian.example.com',
    desc: '设计、排版与一点自留地式的手工感。',
    accent: '#4fb7dd',
  },
  {
    id: 'guangnian',
    name: '光年之外',
    url: 'https://guangnian.example.com',
    domain: 'guangnian.example.com',
    desc: '科幻爱好者的小站，偶尔也写点技术。',
    accent: '#edff66',
  },
]
