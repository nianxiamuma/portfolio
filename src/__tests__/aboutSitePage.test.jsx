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
})
