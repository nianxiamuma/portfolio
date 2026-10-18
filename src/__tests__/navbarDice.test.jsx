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
 * 骰子挂在导航栏，只在「主页」出现 —— 导航里的「主页」指向 /home（站点索引页），
 * 不是首屏 /。它改的是那一页的背景，首屏仍按月份走。
 */
describe('导航栏右上角的骰子', () => {
  it('主页（/home 站点索引）的导航栏里有骰子按钮', () => {
    renderNav('/home')
    expect(screen.getByLabelText('投骰子，换一张壁纸')).toBeTruthy()
  })

  it('首屏（/）不显示骰子', () => {
    renderNav('/')
    expect(screen.queryByLabelText('投骰子，换一张壁纸')).toBeNull()
  })

  it('非主页（关于我）不显示骰子', () => {
    renderNav('/about')
    expect(screen.queryByLabelText('投骰子，换一张壁纸')).toBeNull()
  })
})
