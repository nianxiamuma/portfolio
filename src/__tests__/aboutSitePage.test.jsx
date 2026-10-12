/**
 * 「关于我」页的回归测试。
 *
 * 说明：文件名前缀 `temp-` 是首次验证时留下的（本 worker 运行在无审批的无头环境里，
 * 删除/改名操作被安全闸门拦截）。内容是按长期回归测试写的，建议后续重命名为
 * `aboutSitePage.test.jsx`。
 */
import { describe, it, expect, afterEach } from 'vitest'
import { render, screen, cleanup } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'

import AboutSitePage from '../pages/AboutSitePage'
import { PROJECTS, SKILLS } from '../data/projects'
import { SITE } from '../data/site'

afterEach(cleanup)

const renderPage = () =>
  render(
    <MemoryRouter>
      <AboutSitePage />
    </MemoryRouter>,
  )

describe('关于我页', () => {
  it('渲染页头自我介绍与联系方式', () => {
    renderPage()
    expect(screen.getAllByText(/不知名的/).length).toBeGreaterThan(0)
    expect(screen.getAllByText('807273679@qq.com').length).toBeGreaterThan(0)
    expect(screen.getAllByText('点击复制').length).toBeGreaterThan(0)
  })

  it('项目数据 6 条，字段完整', () => {
    expect(PROJECTS).toHaveLength(6)
    for (const p of PROJECTS) {
      for (const k of ['id', 'name', 'initial', 'desc', 'url', 'accent']) {
        expect(p[k], `${p.id}.${k}`).toBeTruthy()
      }
      expect(p.tags.length, `${p.id}.tags`).toBeGreaterThan(0)
      expect(p.url, p.id).toMatch(/^https?:\/\/.+/)
    }
  })

  it('项目卡片与技能标签全部渲染', () => {
    renderPage()
    for (const p of PROJECTS) expect(screen.getByText(p.name), p.id).toBeTruthy()
    for (const s of SKILLS) expect(screen.getAllByText(s.name).length, s.name).toBeGreaterThan(0)
  })

  it('GitHub 卡片与名片卡指向同一处，且不是裸域名', () => {
    renderPage()
    const social = SITE.socials.find((item) => item.key === 'github')
    const label = social.href.replace(/^https?:\/\//, '').replace(/\/$/, '')
    // 按展示文本定位到「联系」卡片本身；页面上还有项目卡等其它 github 链接（见下一条）
    const link = screen.getByText(label).closest('a')
    expect(link).toBeTruthy()
    expect(link.getAttribute('href')).toBe(social.href)
    // 裸的 https://github.com/ 点进去等于没去，属于假链接
    expect(link.getAttribute('href')).not.toBe('https://github.com/')
  })

  /**
   * 已知遗留：6 个项目卡的 url 全是裸 'https://github.com/'（src/data/projects.js:13/22/31/40/49/58）。
   * 真实地址只有作者知道，不能替他编 —— 这条测试只是把现状钉住，等补上真地址后应改为
   * 断言「没有任何项目 url 等于裸域名」。
   */
  it('项目卡链接现状：6 条全部是裸 github.com（待补真实地址）', () => {
    const bare = PROJECTS.filter((p) => p.url === 'https://github.com/')
    expect(bare).toHaveLength(6)
  })
})
