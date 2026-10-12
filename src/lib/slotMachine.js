/**
 * 街机抽奖的纯逻辑：号码 → 奖品映射、号码 → 三位数字。
 * 与视图解耦，便于单测。
 */

export const MAX_NUMBER = 998

export const SLOT_PRIZES = [
  {
    max: 332,
    key: 'collection',
    label: '藏书',
    to: '/collection',
    accent: '#edff66',
    desc: '去书架把书抽出来看看',
  },
  {
    max: 665,
    key: 'games',
    label: '游戏',
    to: '/collection?tab=games',
    accent: '#7c5cff',
    desc: '开一局，或者只是看看',
  },
  {
    max: MAX_NUMBER,
    key: 'friends',
    label: '友链',
    to: '/friends',
    accent: '#4fb7dd',
    desc: '去别的地方逛逛也不错',
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
