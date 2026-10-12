import { describe, it, expect, afterEach } from 'vitest'
import { render, screen, cleanup } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'

import HeroProfileCard from '../components/HeroProfileCard'
import Petals from '../components/Petals'
import { SITE } from '../data/site'

afterEach(cleanup)

const renderCard = () =>
  render(
    <MemoryRouter>
      <HeroProfileCard />
    </MemoryRouter>,
  )

describe('Hero 名片卡', () => {
  it('渲染站点身份：头像、名字、拼音、签名', () => {
    renderCard()
    expect(screen.getByAltText(SITE.name)).toBeTruthy()
    expect(screen.getByText(SITE.name)).toBeTruthy()
    expect(screen.getByText(SITE.romaji)).toBeTruthy()
    expect(screen.getByText(SITE.tagline)).toBeTruthy()
  })

  it('快捷入口逐个渲染且指向配置的路由', () => {
    const { container } = renderCard()
    for (const item of SITE.shortcuts) {
      expect(screen.getByText(item.label)).toBeTruthy()
      expect(container.querySelector(`a[href="${item.to}"]`)).not.toBeNull()
    }
  })

  it('社交按钮按配置渲染（含 mailto 与外部链接）', () => {
    const { container } = renderCard()
    for (const item of SITE.socials) {
      expect(screen.getByLabelText(item.label)).toBeTruthy()
    }
    expect(container.querySelector(`a[href="mailto:${SITE.email}"]`)).not.toBeNull()
  })
})

describe('花瓣氛围层', () => {
  it('渲染固定数量花瓣，且不拦截指针、对读屏隐藏', () => {
    const { container } = render(<Petals />)
    expect(container.querySelectorAll('.petal')).toHaveLength(16)

    const root = container.firstElementChild
    expect(root.className).toContain('pointer-events-none')
    expect(root.getAttribute('aria-hidden')).toBe('true')
  })

  it('花瓣位置与时长是确定性推算（同参数两次渲染一致）', () => {
    const first = render(<Petals />).container.innerHTML
    cleanup()
    const second = render(<Petals />).container.innerHTML
    expect(first).toBe(second)
  })
})
