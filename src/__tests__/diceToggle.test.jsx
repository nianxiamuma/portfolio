import { describe, it, expect, afterEach, vi } from 'vitest'
import { render, cleanup, fireEvent, act } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'

import DiceToggle from '../components/DiceToggle'
import { BackgroundProvider, useBackgroundScene } from '../context/BackgroundContext'

afterEach(() => {
  cleanup()
  vi.useRealTimers()
})

function FaceProbe() {
  const { diceFace } = useBackgroundScene()
  return <span data-testid="face">{diceFace}</span>
}

const setup = () =>
  render(
    <MemoryRouter>
      <BackgroundProvider>
        <DiceToggle />
        <FaceProbe />
      </BackgroundProvider>
    </MemoryRouter>,
  )

/** 点一下投骰子（带 9 帧跳动的定时器） */
const rollOnce = (btn) => {
  fireEvent.click(btn)
  act(() => {
    vi.advanceTimersByTime(1000)
  })
}

describe('骰子的长按复位', () => {
  it('长按约半秒后回到默认那张（剑，diceFace = 0）', () => {
    vi.useFakeTimers()
    const { getByLabelText, getByTestId } = setup()
    const btn = getByLabelText('投骰子，换一张壁纸')

    rollOnce(btn)
    expect(Number(getByTestId('face').textContent)).toBeGreaterThan(0)

    fireEvent.pointerDown(btn)
    act(() => {
      vi.advanceTimersByTime(700)
    })
    expect(getByTestId('face').textContent).toBe('0')
  })

  it('短按不会触发复位（仍然正常投骰子）', () => {
    vi.useFakeTimers()
    const { getByLabelText, getByTestId } = setup()
    const btn = getByLabelText('投骰子，换一张壁纸')

    rollOnce(btn)
    const first = Number(getByTestId('face').textContent)

    // 按下立刻松开 —— 不到长按阈值
    fireEvent.pointerDown(btn)
    act(() => {
      vi.advanceTimersByTime(120)
    })
    fireEvent.pointerUp(btn)
    act(() => {
      vi.advanceTimersByTime(300)
    })

    // 没有回到 0（可能又投了一次，但绝不是「长按复位」那种确定性的 0）
    expect(Number(getByTestId('face').textContent)).not.toBe(0)
    expect(first).toBeGreaterThan(0)
  })
})
