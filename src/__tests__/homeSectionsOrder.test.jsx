import { describe, it, expect, afterEach } from 'vitest'
import { render, cleanup } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'

import HomePage from '../pages/HomePage'

afterEach(cleanup)

/**
 * 用户级验收：在主页向下滑动时的区块先后。
 * DOM 顺序 = 视觉上的上下顺序，所以直接断言 section 出现次序，
 * 等价于「先看到哪个区块」。
 */
describe('主页区块顺序', () => {
  it('信封区（#story）排在工具箱（#features）之前', () => {
    const { container } = render(
      <MemoryRouter>
        <HomePage />
      </MemoryRouter>,
    )

    const ids = [...container.querySelectorAll('section[id]')].map((el) => el.id)
    const story = ids.indexOf('story')
    const features = ids.indexOf('features')

    expect(ids, `区块顺序：${ids.join(' → ')}`).toContain('story')
    expect(ids, `区块顺序：${ids.join(' → ')}`).toContain('features')
    expect(story, `区块顺序：${ids.join(' → ')}`).toBeLessThan(features)
  })
})
