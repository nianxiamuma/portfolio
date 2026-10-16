import { describe, it, expect } from 'vitest'
import { MAX_NUMBER, SLOT_PRIZES, digitsOf, prizeForNumber } from '../lib/slotMachine'

describe('slotMachine', () => {
  it('奖品档位覆盖 0..998 且无空隙', () => {
    expect(SLOT_PRIZES[SLOT_PRIZES.length - 1].max).toBe(MAX_NUMBER)
    expect(SLOT_PRIZES.map((p) => p.max)).toEqual([332, 998]) // 友链档已删（#6）
  })

  it('号码映射到正确档位（含边界）', () => {
    expect(prizeForNumber(0).key).toBe('collection')
    expect(prizeForNumber(332).key).toBe('collection')
    expect(prizeForNumber(333).key).toBe('games')
    expect(prizeForNumber(665).key).toBe('games')
    expect(prizeForNumber(666).key).toBe('games')
    expect(prizeForNumber(998).key).toBe('games') // 友链档已删，games 承接到底
  })

  it('越界号码被夹紧到合法区间', () => {
    expect(prizeForNumber(-10).key).toBe('collection')
    expect(prizeForNumber(99999).key).toBe('games')
  })

  it('号码拆成三位数字', () => {
    expect(digitsOf(7)).toEqual(['0', '0', '7'])
    expect(digitsOf(42)).toEqual(['0', '4', '2'])
    expect(digitsOf(998)).toEqual(['9', '9', '8'])
  })
})
