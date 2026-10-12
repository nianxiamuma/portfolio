import { describe, it, expect } from 'vitest'
import {
  normalizeAngle,
  angleDistance,
  toContinuousRotation,
  pointerAngleFromRect,
  indexFromRotation,
  snapTarget,
} from '../lib/compassMath'

const ITEMS = [
  { index: 1, direction: 'N', angle: 0 },
  { index: 2, direction: 'E', angle: 90 },
  { index: 3, direction: 'S', angle: 180 },
  { index: 4, direction: 'W', angle: 270 },
]

describe('compassMath', () => {
  it('normalizeAngle 处理负数与超界', () => {
    expect(normalizeAngle(-90)).toBe(270)
    expect(normalizeAngle(450)).toBe(90)
    expect(normalizeAngle(0)).toBe(0)
  })

  it('angleDistance 取环距而非差值', () => {
    expect(angleDistance(350, 10)).toBe(20)
    expect(angleDistance(10, 350)).toBe(20)
    expect(angleDistance(0, 180)).toBe(180)
  })

  it('toContinuousRotation 跨 0° 时不跳变', () => {
    expect(toContinuousRotation(350, 10)).toBe(370)
    expect(toContinuousRotation(10, 350)).toBe(-10)
  })

  it('pointerAngleFromRect 以正上方为 0°', () => {
    const rect = { left: 0, top: 0, width: 200, height: 200 }
    expect(Math.round(pointerAngleFromRect({ x: 100, y: 0 }, rect))).toBe(0)
    expect(Math.round(pointerAngleFromRect({ x: 200, y: 100 }, rect))).toBe(90)
    expect(Math.round(pointerAngleFromRect({ x: 100, y: 200 }, rect))).toBe(180)
  })

  it('indexFromRotation 命中最近方位', () => {
    expect(indexFromRotation(0, ITEMS)).toBe(1)
    expect(indexFromRotation(80, ITEMS)).toBe(2)
    expect(indexFromRotation(185, ITEMS)).toBe(3)
    expect(indexFromRotation(300, ITEMS)).toBe(4)
  })

  it('snapTarget 吸附到最近方位并保留圈数', () => {
    expect(snapTarget(88, ITEMS)).toEqual({ index: 2, angle: 90 })
    expect(snapTarget(370, ITEMS)).toEqual({ index: 1, angle: 360 })
    expect(snapTarget(-20, ITEMS)).toEqual({ index: 1, angle: 0 })
  })
})
