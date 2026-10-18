import { useState } from 'react'

import { useBackgroundScene } from '../context/BackgroundContext'
import { rollDie } from '../lib/diceWallpapers'

/** 骰子点阵：3×3 网格里哪些格子点亮（0 左上 → 8 右下） */
const PIPS = {
  1: [4],
  2: [0, 8],
  3: [0, 4, 8],
  4: [0, 2, 6, 8],
  5: [0, 2, 4, 6, 8],
  6: [0, 2, 3, 5, 6, 8],
}

/**
 * 主页右上角的骰子。
 *
 * 点击投掷：先快速乱跳几帧（滚动感），停下后把点数写进全局 diceFace，
 * 首屏壁纸跟着换成该点数的图。点数 0 表示「默认那张（剑）」。
 */
export default function DiceToggle() {
  const { diceFace, setDiceFace } = useBackgroundScene()
  const [rolling, setRolling] = useState(false)

  const roll = () => {
    if (rolling) return
    setRolling(true)
    let ticks = 0
    const timer = window.setInterval(() => {
      setDiceFace(rollDie())
      ticks += 1
      if (ticks >= 9) {
        window.clearInterval(timer)
        setRolling(false)
      }
    }, 70)
  }

  const pips = PIPS[diceFace] || []
  const label = diceFace > 0 ? `D${diceFace}` : 'ROLL'

  return (
    <div className="flex flex-col items-end gap-1.5">
      <button
        type="button"
        onClick={roll}
        aria-label="投骰子，换一张壁纸"
        title="投骰子换壁纸"
        className={`group grid h-11 w-11 place-items-center rounded-xl border border-white/15 bg-white/[0.06] backdrop-blur-md transition-all duration-300 ease-expo-out hover:border-neon-lime/60 hover:bg-white/[0.1] active:scale-95 ${
          rolling ? 'animate-[spin_0.7s_linear_infinite] border-neon-lime/50' : ''
        }`}
      >
        <span className="grid h-6 w-6 grid-cols-3 grid-rows-3 gap-[2px]">
          {Array.from({ length: 9 }, (_, i) => (
            <span
              key={i}
              className={`rounded-full transition-colors duration-150 ${
                pips.includes(i) ? 'bg-white' : 'bg-transparent'
              }`}
            />
          ))}
        </span>
      </button>
      <span
        className={`font-mono text-[9px] uppercase tracking-[0.24em] transition-colors ${
          diceFace > 0 ? 'text-neon-lime/80' : 'text-white/35'
        }`}
      >
        {label}
      </span>
    </div>
  )
}
