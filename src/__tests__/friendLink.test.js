import { describe, it, expect } from 'vitest'

import { SITE } from '../data/site'
import {
  FRIEND_ISSUE_BASE,
  buildFriendIssueUrl,
  validateFriendForm,
} from '../lib/friendLink'

/**
 * 友链申请原来是假动作（FriendsPage 的 onSubmit 只 setSubmitted(true)）。
 * 这里钉住「真动作」：拼出一个能打开 GitHub Issue 新建页的链接。
 */
describe('友链 Issue 链接', () => {
  it('仓库地址来自 SITE.socials 的单一真源，不另写一份', () => {
    const github = SITE.socials.find((item) => item.key === 'github').href.replace(/\/$/, '')
    expect(FRIEND_ISSUE_BASE).toBe(`${github}/issues/new`)
  })

  it('链接指向 issues/new 且带模板参数', () => {
    const url = buildFriendIssueUrl({ nickname: '阿岚', url: 'https://a.example', desc: '一句话' })
    expect(url.startsWith(FRIEND_ISSUE_BASE)).toBe(true)
    expect(url).toContain('template=friend-link.yml')
  })

  it('三个字段都进了 title / body', () => {
    const url = buildFriendIssueUrl({
      nickname: '阿岚',
      url: 'https://a.example',
      desc: '喜欢你的书架',
    })
    const decoded = decodeURIComponent(url)
    expect(decoded).toContain('阿岚')
    expect(decoded).toContain('https://a.example')
    expect(decoded).toContain('喜欢你的书架')
  })

  it('特殊字符被正确编码（不能让 & # 之类的把 query 撕开）', () => {
    const url = buildFriendIssueUrl({
      nickname: 'a&b#c',
      url: 'https://x.example/?q=1&r=2',
      desc: '换行\n也要活下来',
    })
    // 未编码的裸 & 只能出现在参数分隔处：逐个参数都必须是 key=value 形态
    const query = url.slice(url.indexOf('?') + 1)
    for (const pair of query.split('&')) {
      expect(pair.split('=').length).toBeGreaterThanOrEqual(2)
    }
    expect(url).not.toContain('a&b#c')
    const decoded = decodeURIComponent(url)
    expect(decoded).toContain('a&b#c')
    expect(decoded).toContain('换行')
  })

  it('缺字段不抛，给出可读的占位', () => {
    const url = buildFriendIssueUrl({})
    expect(url.startsWith(FRIEND_ISSUE_BASE)).toBe(true)
    expect(decodeURIComponent(url)).toContain('未填写')
  })
})

describe('友链表单校验', () => {
  it('三项合规时通过', () => {
    const r = validateFriendForm({ nickname: '阿岚', url: 'https://a.example', desc: 'hi' })
    expect(r.ok).toBe(true)
    expect(r.errors).toEqual({})
  })

  it('昵称必填', () => {
    const r = validateFriendForm({ nickname: '   ', url: 'https://a.example', desc: '' })
    expect(r.ok).toBe(false)
    expect(r.errors.nickname).toBeTruthy()
  })

  it('网址必须带协议头，且要像域名', () => {
    expect(validateFriendForm({ nickname: 'x', url: 'a.example' }).errors.url).toBeTruthy()
    expect(validateFriendForm({ nickname: 'x', url: 'ftp://a.example' }).errors.url).toBeTruthy()
    expect(validateFriendForm({ nickname: 'x', url: 'http://a.example' }).ok).toBe(true)
  })

  it('描述可留空', () => {
    expect(validateFriendForm({ nickname: 'x', url: 'https://a.example' }).ok).toBe(true)
  })
})
