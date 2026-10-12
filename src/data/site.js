/**
 * 站点身份信息 —— 集中一处，改这里全站生效。
 * 名字 / 签名 / 头像 / 快捷入口 / 社交，都被 Hero 名片卡与页脚读取。
 */

export const SITE = {
  name: '年下牧马',
  romaji: 'NIANXIA MUMA',
  tagline: '把喜欢的东西，留在手边。',
  avatar: '/avatar.png',
  email: '807273679@qq.com',
  /** Hero 名片卡上的快捷入口 */
  shortcuts: [
    { label: '文章', to: '/blog' },
    { label: '浮光集', to: '/glimmer' },
    { label: '藏书', to: '/collection' },
    { label: '友链', to: '/friends' },
    { label: '留言板', to: '/guestbook' },
  ],
  /** 名片卡底部的社交按钮 */
  socials: [
    { key: 'mail', label: '邮件', href: 'mailto:807273679@qq.com' },
    { key: 'guestbook', label: '留言板', to: '/guestbook' },
    { key: 'github', label: 'GitHub', href: 'https://github.com/' },
  ],
}
