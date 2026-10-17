import { describe, it, expect, vi, afterEach } from 'vitest'
import { render, screen, act, cleanup } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'

import HomeCardsPage from '../pages/HomeCardsPage'
import HomePage from '../pages/HomePage'
import { INDEX_CARDS, INDEX_GROUPS, cardsOf, sectionIdOf } from '../data/indexCards'

/** 路由表里真实存在的站内路径（与 src/App.jsx 保持一致） */
const REAL_ROUTES = ['/', '/home', '/about', '/glimmer', '/guestbook', '/sources']

/** HomePage 的首页区块 id（与各组件里 section 的 id 一致） */
const REAL_SECTIONS = ['features', 'fragments', 'story', 'slot']

const renderPage = () =>
  render(
    <MemoryRouter initialEntries={['/home']}>
      <HomeCardsPage />
    </MemoryRouter>,
  )

afterEach(() => {
  cleanup()
  vi.useRealTimers()
  vi.restoreAllMocks()
})

describe('站点索引 · 数据层', () => {
  it('三组都有卡片，且卡 id 唯一', () => {
    for (const group of INDEX_GROUPS) {
      expect(cardsOf(group.id).length).toBeGreaterThan(0)
    }
    const ids = INDEX_CARDS.map((c) => c.id)
    expect(new Set(ids).size).toBe(ids.length)
  })

  it('每张站内卡都指向真实路由或真实首页区块（防 /collection 式死链复发）', () => {
    const broken = []
    for (const card of INDEX_CARDS) {
      if (card.external) {
        expect(card.href, `${card.id} 外部卡缺 href`).toMatch(/blog\/$/)
        continue
      }
      const path = card.to.split('#')[0].split('?')[0]
      if (!REAL_ROUTES.includes(path)) broken.push(`${card.id} → ${card.to}`)
      const section = sectionIdOf(card)
      if (section && !REAL_SECTIONS.includes(section)) broken.push(`${card.id} → #${section}`)
    }
    expect(broken).toEqual([])
  })

  it('首页片段卡全部带 ?nointro（不然开场层会挡住锚点跳转）', () => {
    const sectionCards = INDEX_CARDS.filter((c) => c.group === 'sections')
    expect(sectionCards.length).toBeGreaterThan(0)
    for (const card of sectionCards) {
      expect(card.to.startsWith('/?nointro#'), `${card.id} 缺少 ?nointro`).toBe(true)
    }
  })
})

describe('站点索引 · 页面', () => {
  it('渲染三组卡片与全部卡片项', () => {
    renderPage()
    for (const group of INDEX_GROUPS) {
      expect(screen.getByTestId(`group-${group.id}`)).toBeTruthy()
    }
    for (const card of INDEX_CARDS) {
      expect(screen.getByTestId(`card-${card.id}`), `${card.id} 没渲染`).toBeTruthy()
    }
  })

  it('站内卡渲染成 <a href="/…">，博客卡指向 blog 子站', () => {
    renderPage()
    const about = screen.getByTestId('card-about')
    expect(about.getAttribute('href')).toBe('/about')
    const blog = screen.getByTestId('card-blog')
    expect(blog.getAttribute('href')).toMatch(/blog\/$/)
  })
})

describe('首页锚点滚动', () => {
  it('带 hash 进入首页时滚到对应区块', () => {
    vi.useFakeTimers()
    // jsdom 没有真实布局，scrollIntoView 也不存在：给目标元素挂个替身，
    // 断言「滚到了哪个元素、用什么参数」即可
    const target = { id: 'features', scrollIntoView: vi.fn() }
    const getElementSpy = vi
      .spyOn(document, 'getElementById')
      .mockImplementation((id) => (id === target.id ? target : null))

    window.history.replaceState({}, '', '/?nointro#features')
    render(
      <MemoryRouter initialEntries={['/?nointro#features']}>
        <HomePage />
      </MemoryRouter>,
    )
    act(() => {
      vi.advanceTimersByTime(300)
    })

    expect(getElementSpy).toHaveBeenCalledWith('features')
    expect(target.scrollIntoView).toHaveBeenCalledWith({ behavior: 'smooth', block: 'start' })
  })

  it('没有 hash 时不滚动', () => {
    vi.useFakeTimers()
    const getElementSpy = vi.spyOn(document, 'getElementById')

    window.history.replaceState({}, '', '/?nointro')
    render(
      <MemoryRouter initialEntries={['/?nointro']}>
        <HomePage />
      </MemoryRouter>,
    )
    act(() => {
      vi.advanceTimersByTime(300)
    })

    expect(getElementSpy).not.toHaveBeenCalled()
  })
})
