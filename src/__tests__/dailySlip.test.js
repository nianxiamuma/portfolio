import { describe, it, expect } from 'vitest'
import { slipOfDay, todayStr } from '../lib/dailySlip'
import { ORACLE_SLIPS } from '../data/oracle'

describe('slipOfDay 今日一句', () => {
  it('同一日期两次取值稳定', () => {
    expect(slipOfDay('2026-10-16')).toEqual(slipOfDay('2026-10-16'))
  })

  it('落在纸条库范围内且带 kindLabel', () => {
    const s = slipOfDay('2026-10-16')
    expect(ORACLE_SLIPS).toContainEqual(
      expect.objectContaining({ id: s.id })
    )
    expect(typeof s.kindLabel).toBe('string')
    expect(s.kindLabel.length).toBeGreaterThan(0)
  })

  it('跨天轮换：连续 30 天至少出现 5 种不同纸条', () => {
    const seen = new Set()
    for (let d = 1; d <= 30; d += 1) {
      seen.add(slipOfDay(`2026-09-${String(d).padStart(2, '0')}`).id)
    }
    expect(seen.size).toBeGreaterThanOrEqual(5)
  })

  it('空库返回 null', () => {
    expect(slipOfDay('2026-10-16', [])).toBeNull()
  })

  it('自定义注入小库时哈希可复算', () => {
    const tiny = [
      { id: 'a', kind: 'poem', text: '甲', source: 'x' },
      { id: 'b', kind: 'poem', text: '乙', source: 'y' },
    ]
    // 同一库同一日期稳定；两日期可能不同但必属 {a,b}
    const r1 = slipOfDay('2026-10-16', tiny)
    const r2 = slipOfDay('2026-10-17', tiny)
    expect(['a', 'b']).toContain(r1.id)
    expect(['a', 'b']).toContain(r2.id)
    expect(r1.id).toBe(slipOfDay('2026-10-16', tiny).id)
  })

  it('真实库 52 条全量调用不抛错', () => {
    expect(ORACLE_SLIPS.length).toBe(52)
    for (const s of ORACLE_SLIPS) {
      expect(slipOfDay(s.id)).toBeTruthy()
    }
  })
})

describe('todayStr 本地日期', () => {
  it('补零格式 YYYY-MM-DD', () => {
    expect(todayStr(new Date(2026, 9, 16))).toBe('2026-10-16')
  })
  it('单月单日补零', () => {
    expect(todayStr(new Date(2026, 0, 5))).toBe('2026-01-05')
  })
  it('与 toISOString 的 UTC 差异：本地时区下日期部分取本地值', () => {
    const d = new Date(2026, 9, 16, 23, 30) // 本地 23:30
    // 若时区为 UTC+8，toISOString 会是 15:30 同日；无论时区，todayStr 必须等于本地日期
    expect(todayStr(d)).toBe('2026-10-16')
  })
})
