/**
 * 站点身份信息 —— 集中一处，改这里全站生效。
 * 名字 / 签名 / 头像 / 快捷入口 / 社交，都被 Hero 名片卡与页脚读取。
 */

export const SITE = {
  name: '年下牧马',
  romaji: 'NIANXIA MUMA',
  tagline: '把喜欢的东西，留在手边。',
  // 部署基路径（GitHub Pages 项目页形如 /repo/）；字符串资源路径必须手动拼上它
  // 头像 2026-10-13 更换为 IMG_6742.JPG（存为 avatar.jpg；内容是 JPEG，别改成 .png 免得 MIME 与内容不符）
  avatar: `${import.meta.env.BASE_URL}avatar.jpg`,
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
