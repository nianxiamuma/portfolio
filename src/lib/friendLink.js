/**
 * 友链申请的「真动作」：把表单内容拼成一个能直接打开 GitHub Issue 新建页的链接。
 *
 * 为什么这么做：本站是纯静态托管（GitHub Pages），没有后端接不了表单提交。
 * 原来 FriendsPage 的 onSubmit 只 setSubmitted(true) —— 界面上提示「已收到」，
 * 实际什么都没发生，是个假动作。改成打开预填好的 Issue 页：用户点提交 → 真的发出去了。
 *
 * 仓库地址取自 SITE.socials 的单一真源，不在这里另写一份 ——
 * 之前名片卡/页脚/关于我页各写一份，结果漂移成裸 https://github.com/（假链接）。
 */
import { SITE } from '../data/site'

const REPO_URL =
  SITE.socials.find((item) => item.key === 'github')?.href || 'https://github.com/nianxiamuma'

/** Issue 新建页基址；模板文件在 .github/ISSUE_TEMPLATE/friend-link.yml */
export const FRIEND_ISSUE_BASE = `${REPO_URL.replace(/\/$/, '')}/issues/new`

export const FRIEND_ISSUE_TEMPLATE = 'friend-link.yml'

const PLACEHOLDER = {
  nickname: '未填写昵称',
  url: '未填写网址',
  desc: '（没有留言）',
}

const clean = (value, key) => {
  const text = typeof value === 'string' ? value.trim() : ''
  return text || PLACEHOLDER[key]
}

/**
 * 表单值 → Issue 新建链接。
 * URLSearchParams 负责编码，所以昵称里的 & # 换行都不会把 query 撕开。
 */
export function buildFriendIssueUrl({ nickname, url, desc } = {}) {
  const params = new URLSearchParams({
    template: FRIEND_ISSUE_TEMPLATE,
    title: `[友链申请] ${clean(nickname, 'nickname')}`,
    body: [
      `**昵称**：${clean(nickname, 'nickname')}`,
      `**网址**：${clean(url, 'url')}`,
      `**描述**：${clean(desc, 'desc')}`,
      '',
      '_由站点「友链申请」表单生成_',
    ].join('\n'),
  })
  return `${FRIEND_ISSUE_BASE}?${params.toString()}`
}

/** 提交前本地校验：能当场发现的问题就别让用户开完 Issue 才发现 */
export function validateFriendForm({ nickname, url, desc } = {}) {
  const errors = {}
  const name = typeof nickname === 'string' ? nickname.trim() : ''
  const link = typeof url === 'string' ? url.trim() : ''

  if (!name) errors.nickname = '请填一个称呼'

  // 必须是 http(s) 且带像样的域名（至少一个点），否则多半是随手打的
  if (!/^https?:\/\/[^\s/]+\.[^\s/]+/.test(link)) {
    errors.url = '网址要带 http:// 或 https://，并包含完整域名'
  }

  return { ok: Object.keys(errors).length === 0, errors }
}
