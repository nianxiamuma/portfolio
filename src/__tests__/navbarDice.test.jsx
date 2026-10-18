import { describe, it, expect, afterEach } from 'vitest'
import { render, screen, cleanup } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'

import Navbar from '../components/Navbar'
import { BackgroundProvider } from '../context/BackgroundContext'

afterEach(cleanup)

const renderNav = (path) =>
  render(
    <MemoryRouter initialEntries={[path]}>
      <BackgroundProvider>
        <Navbar />
      </BackgroundProvider>
    </MemoryRouter>,
  )

/**
 * 骰子挂在导航栏右上角，只在主页出现。
 * 之前错误地挂在了首屏 Hero 里（一进门那块），滚动就跟着走了。
 */
describe('导航栏右上角的骰子', () => {
  it('主页的导航栏里有骰子按钮', () => {
    renderNav('/')
    expect(screen.getByLabelText('投骰子，换一张壁纸')).toBeTruthy()
  })

  it('非主页（关于我）不显示骰子', () => {
    renderNav('/about')
    expect(screen.queryByLabelText('投骰子，换一张壁纸')).toBeNull()
  })
})
