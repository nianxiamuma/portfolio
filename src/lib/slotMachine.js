/**
 * ⚠ 已被取代（2026-10-14）：抽奖机改成了「号码 → 纸条 + 壁纸」，
 * 逻辑搬到了 src/lib/oracle.js，Contact.jsx 也不再引用本文件。
 * MAX_NUMBER / digitsOf 在 oracle.js 里也有一份 —— 这里现在是死代码，
 * 等确认后应删除（连同 src/__tests__/slotMachine.test.js）。
 *
 * 街机抽奖的纯逻辑：号码 → 奖品映射、号码 → 三位数字。
 * 与视图解耦，便于单测。
 */

export const MAX_NUMBER = 998

export const SLOT_PRIZES = [
  {
    max: 332,
    key: 'collection',
    label: '藏书',
    to: '/about',
    accent: '#edff66',
    desc: '去书架把书抽出来看看',
  },
  {
    max: MAX_NUMBER,
    key: 'games',
    label: '游戏',
    to: '/about#games',
    accent: '#7c5cff',
    desc: '开一局，或者只是看看',
  },
]
const clamp = (n) => Math.max(0, Math.min(MAX_NUMBER, Math.floor(n)))

/** 号码落在哪一档 */
export function prizeForNumber(n) {
  const value = clamp(n)
  return SLOT_PRIZES.find((p) => value <= p.max) || SLOT_PRIZES[SLOT_PRIZES.length - 1]
}

/** 号码拆成三位数字（补零） */
export function digitsOf(n) {
  return String(clamp(n)).padStart(3, '0').split('')
}
