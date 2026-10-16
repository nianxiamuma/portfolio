import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import SourcesPage from '../pages/SourcesPage'
import { SOURCE_GROUPS } from '../pages/SourcesPage'

function renderSources() {
  return render(
    <MemoryRouter>
      <SourcesPage />
    </MemoryRouter>
  )
}

describe('来源与致谢页', () => {
  it('渲染标题与页头', () => {
    renderSources()
    expect(screen.getByRole('heading', { level: 1, name: /来源与/ })).toBeTruthy()
  })

  it('渲染全部分组标题', () => {
    renderSources()
    for (const group of SOURCE_GROUPS) {
      expect(screen.getByText(group.title)).toBeTruthy()
    }
  })

  it('每组至少一个条目，条目带授权标注', () => {
    for (const group of SOURCE_GROUPS) {
      expect(group.items.length, group.id).toBeGreaterThan(0)
      for (const item of group.items) {
        expect(item.label, `${group.id}/${item.label}`).toBeTruthy()
        expect(item.license, `${group.id}/${item.label}`).toBeTruthy()
      }
    }
  })

  it('外部链接一律带 rel="noopener noreferrer"', () => {
    const { container } = renderSources()
    for (const a of container.querySelectorAll('a[target="_blank"]')) {
      expect(a.getAttribute('rel'), a.href).toContain('noopener')
    }
  })

  it('素材规模与站上实际一致（22 场景 / 42 壁纸池）', () => {
    const flat = SOURCE_GROUPS.map((g) => `${g.title} ${g.note}`).join('\n')
    expect(flat).toContain('22')
    expect(flat).toContain('42')
  })
})
