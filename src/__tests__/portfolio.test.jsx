import { describe, it, expect, afterEach } from 'vitest'
import { render, screen, cleanup } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'

import Footer from '../components/Footer'
import { BENTO_TOOLS, FEATURED_TOOL, TOOLS } from '../data/tools'
import { WALLPAPERS } from '../lib/wallpapers'

afterEach(cleanup)

describe('壁纸数据', () => {
  it('四张壁纸，方位角按 90° 均分', () => {
    expect(WALLPAPERS).toHaveLength(4)
    expect(WALLPAPERS.map((w) => w.angle)).toEqual([0, 90, 180, 270])
    expect(WALLPAPERS.map((w) => w.direction)).toEqual(['N', 'E', 'S', 'W'])
  })

  it('每张都带配色主题与两行诗句', () => {
    for (const w of WALLPAPERS) {
      for (const key of ['accent', 'line', 'soft', 'glow', 'overlay']) {
        expect(w.theme[key], `${w.name}.${key}`).toBeTruthy()
      }
      expect(w.poem).toHaveLength(2)
      expect(w.scene.base).toBeTruthy()
    }
  })
})

describe('AI 工具收藏数据', () => {
  it('共 10 条，字段完整且 URL 合法', () => {
    expect(TOOLS).toHaveLength(10)
    for (const tool of TOOLS) {
      expect(tool.name, tool.id).toBeTruthy()
      expect(tool.tag, tool.id).toBeTruthy()
      expect(tool.url, tool.id).toMatch(/^https?:\/\/.+/)
    }
  })

  it('id 唯一，且主展位不在 bento 列表中', () => {
    expect(new Set(TOOLS.map((t) => t.id)).size).toBe(TOOLS.length)
    expect(FEATURED_TOOL).toBeTruthy()
    expect(BENTO_TOOLS.map((t) => t.id)).not.toContain(FEATURED_TOOL.id)
  })
})

describe('页脚', () => {
  it('展示 QQ 邮箱与站点地图', () => {
    render(
      <MemoryRouter>
        <Footer />
      </MemoryRouter>,
    )
    expect(screen.getAllByText('807273679@qq.com').length).toBeGreaterThan(0)
    expect(screen.getByText('关于我')).toBeTruthy()
    expect(screen.getByText('留言板')).toBeTruthy()
  })
})
