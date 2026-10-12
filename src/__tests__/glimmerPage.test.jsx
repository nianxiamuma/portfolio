/**
 * 「浮光集」页面回归测试。
 *
 * 覆盖：数据自洽、无外部图片（硬约束）、相册展开/收起、碎语年份与分类筛选。
 * 注：本文件最初是临时探针（文件名前缀 _probe_ 由此而来）；无头 worker 里
 * 删除/改名被硬闸门拦下，故就地保留为正式测试。
 */
import { describe, it, expect, afterEach } from 'vitest'
import { render, screen, fireEvent, cleanup } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'

import GlimmerPage from '../pages/GlimmerPage'
import { GLIMMER_ALBUMS, GLIMMER_NOTES, GLIMMER_STATS } from '../data/glimmer'

afterEach(cleanup)

const renderPage = () =>
  render(
    <MemoryRouter>
      <GlimmerPage />
    </MemoryRouter>,
  )

/** 相册卡片：带 aria-expanded 的按钮 */
const albumCard = (title) =>
  screen
    .getAllByRole('button')
    .find((btn) => btn.hasAttribute('aria-expanded') && btn.textContent.includes(title))

const clickButton = (name) => fireEvent.click(screen.getByRole('button', { name }))

describe('浮光集 · 数据', () => {
  it('4 册 / 19 张 / 8 条碎语', () => {
    expect(GLIMMER_ALBUMS).toHaveLength(4)
    expect(GLIMMER_STATS.albumCount).toBe(4)
    expect(GLIMMER_STATS.photoCount).toBe(19)
    expect(GLIMMER_NOTES).toHaveLength(8)
  })

  it('每册都有名称、色相、几何母题与照片', () => {
    for (const album of GLIMMER_ALBUMS) {
      expect(album.title, album.id).toBeTruthy()
      expect(album.photos.length, album.id).toBeGreaterThan(0)
      expect(typeof album.hue, album.id).toBe('number')
      expect(album.shape, album.id).toBeTruthy()
    }
  })
})

describe('浮光集 · 页面', () => {
  it('两个板块都在，且不引用任何外部图片', () => {
    const { container } = renderPage()
    expect(screen.getByText('相册集')).toBeTruthy()
    expect(screen.getByText('碎语')).toBeTruthy()
    expect(container.querySelectorAll('img, iframe, video, source')).toHaveLength(0)
    expect(/url\(["']?https?:/i.test(container.innerHTML)).toBe(false)
  })

  it('默认展开第一册，点另一册换内容，再点收起', () => {
    renderPage()
    expect(screen.getByText('便利店玻璃')).toBeTruthy()
    expect(screen.getAllByRole('button', { expanded: true })).toHaveLength(1)

    fireEvent.click(albumCard('夜海'))
    expect(screen.getByText('潮线')).toBeTruthy()
    expect(screen.queryByText('便利店玻璃')).toBeNull()

    fireEvent.click(albumCard('夜海'))
    expect(screen.queryByText('潮线')).toBeNull()
    expect(screen.getByText(/四本相册都收起来了/)).toBeTruthy()
  })

  it('年份 / 分类筛选生效，可重置', () => {
    renderPage()
    expect(screen.getByText(/8 \/ 8 条/)).toBeTruthy()

    clickButton('2024')
    expect(screen.getByText(/3 \/ 8 条/)).toBeTruthy()
    expect(screen.getByText('四个人分一碗汤，冷天也就不算冷。')).toBeTruthy()
    expect(screen.queryByText('十一点半的便利店，热柜的灯比月亮亮。')).toBeNull()

    clickButton('清晨')
    expect(screen.getByText(/1 \/ 8 条/)).toBeTruthy()

    // 该组合（2024 + 夜行）无结果
    clickButton('夜行')
    expect(screen.getByText(/0 \/ 8 条/)).toBeTruthy()
    expect(screen.getByText(/没有留下句子/)).toBeTruthy()

    clickButton(/重置/)
    expect(screen.getByText(/8 \/ 8 条/)).toBeTruthy()
  })
})
