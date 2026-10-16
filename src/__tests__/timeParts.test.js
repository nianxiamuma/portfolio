import { describe, it, expect } from 'vitest'
import { greetingFor, yearProgress, clockText, dateText } from '../lib/timeParts'

describe('greetingFor 时段问候', () => {
  const cases = [
    [0, '夜深了'], [4, '夜深了'],
    [5, '早上好'], [10, '早上好'],
    [11, '中午好'], [12, '中午好'],
    [13, '下午好'], [17, '下午好'],
    [18, '晚上好'], [22, '晚上好'],
    [23, '夜深了'],
  ]
  for (const [hour, want] of cases) {
    it(`${hour} 点 → ${want}`, () => expect(greetingFor(hour)).toBe(want))
  }
})

describe('yearProgress 时光进度', () => {
  it('年初 1 月 1 日 00:00 为 0', () => {
    expect(yearProgress(new Date(2026, 0, 1, 0, 0, 0, 0))).toBe(0)
  })

  it('平年年末 12 月 31 日 23:59:59 接近 1 但小于 1', () => {
    const v = yearProgress(new Date(2026, 11, 31, 23, 59, 59))
    expect(v).toBeGreaterThan(0.999)
    expect(v).toBeLessThan(1)
  })

  it('闰年分母含 2 月 29 日：3 月 1 日约 16.4%', () => {
    // 2024 闰年：1月31 + 2月29 = 60 天过去，全年 366 天
    const v = yearProgress(new Date(2024, 2, 1, 0, 0, 0))
    expect(v).toBeCloseTo(60 / 366, 3)
  })

  it('平年 7 月 1 日约等于全年一半（365 天过 181 天）', () => {
    const v = yearProgress(new Date(2026, 6, 1, 0, 0, 0))
    expect(v).toBeCloseTo(181 / 365, 3)
  })

  it('结果恒在 [0,1]', () => {
    for (const d of [new Date(2025, 0, 1), new Date(2024, 5, 15), new Date(2030, 11, 31, 23, 59, 59, 999)]) {
      const v = yearProgress(d)
      expect(v).toBeGreaterThanOrEqual(0)
      expect(v).toBeLessThanOrEqual(1)
    }
  })
})

describe('clockText 时钟', () => {
  it('补零到两位', () => {
    expect(clockText(new Date(2026, 9, 16, 8, 5, 3))).toBe('08:05:03')
  })
  it('23:59:59 原样', () => {
    expect(clockText(new Date(2026, 9, 16, 23, 59, 59))).toBe('23:59:59')
  })
})

describe('dateText 日期', () => {
  it('2026-10-16 是周五', () => {
    expect(dateText(new Date(2026, 9, 16))).toBe('10月16日 · 周五')
  })
})
