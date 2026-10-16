import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import Segments from '../components/Segments'

function renderSegments() {
  return render(
    <MemoryRouter>
      <Segments />
    </MemoryRouter>
  )
}

describe('Segments 片段叙事段', () => {
  it('六个片段齐全（01–06）', () => {
    renderSegments()
    for (const i of ['01', '02', '03', '04', '05', '06']) {
      expect(screen.getByTestId(`segment-${i}`)).toBeTruthy()
    }
  })

  it('编号顺序渲染（01 在最前，06 在最后）', () => {
    const { container } = renderSegments()
    const cards = container.querySelectorAll('[data-testid^="segment-"]')
    expect(cards[0].getAttribute('data-testid')).toBe('segment-01')
    expect(cards[cards.length - 1].getAttribute('data-testid')).toBe('segment-06')
    expect(cards).toHaveLength(6)
  })

  it('有路由的片段是 Link 且 to 正确（单源数据断言）', () => {
    renderSegments()
    expect(screen.getByTestId('segment-01').getAttribute('href')).toBe('/')
    expect(screen.getByTestId('segment-02').getAttribute('href')).toBe('/about')
    expect(screen.getByTestId('segment-03').getAttribute('href')).toBe('/glimmer')
  })

  it('visualOnly 片段无文案层但有壁纸图；soon 片段无链接', () => {
    renderSegments()
    const s04 = screen.getByTestId('segment-04')
    expect(s04.querySelector('img')).toBeTruthy()
    expect(s04.getAttribute('href')).toBeNull()
    expect(s04.textContent).not.toContain('进入')

    const s05 = screen.getByTestId('segment-05')
    expect(s05.textContent).toContain('More coming soon.')
    expect(s05.getAttribute('href')).toBeNull()
  })

  it('壁纸路径带部署基路径前缀', () => {
    renderSegments()
    const img = screen.getByTestId('segment-04').querySelector('img')
    expect(img.getAttribute('src')).toContain('/wallpapers/scene/scene-glimmer.jpg')
  })

  it('文字卡标题渲染', () => {
    renderSegments()
    expect(screen.getByText('藏书与游戏')).toBeTruthy()
    expect(screen.getByText('神谕')).toBeTruthy()
    expect(screen.getByText('这个站的门面')).toBeTruthy()
  })
})
