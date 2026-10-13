import { describe, it, expect } from 'vitest'
import fs from 'node:fs'
import path from 'node:path'

import { ORACLE_KINDS, ORACLE_SLIPS, ORACLE_WALLPAPERS } from '../data/oracle'
import { MAX_NUMBER, clampNumber, digitsOf, drawFor, wallpaperSrc } from '../lib/oracle'

describe('纸条库', () => {
  it('每条纸条字段齐全、id 唯一', () => {
    const ids = new Set()
    for (const slip of ORACLE_SLIPS) {
      expect(slip.id, JSON.stringify(slip)).toBeTruthy()
      expect(slip.text, slip.id).toBeTruthy()
      expect(slip.source, slip.id).toBeTruthy()
      expect(ids.has(slip.id), `重复 id: ${slip.id}`).toBe(false)
      ids.add(slip.id)
    }
  })

  it('kind 都在登记表里，且每类都有足够条数', () => {
    for (const slip of ORACLE_SLIPS) {
      expect(Object.keys(ORACLE_KINDS), slip.id).toContain(slip.kind)
    }
    for (const kind of Object.keys(ORACLE_KINDS)) {
      const count = ORACLE_SLIPS.filter((s) => s.kind === kind).length
      expect(count, `${kind} 只有 ${count} 条`).toBeGreaterThanOrEqual(6)
    }
  })

  it('答案之书那类是本站原创，不冒名出处', () => {
    for (const slip of ORACLE_SLIPS.filter((s) => s.kind === 'answer')) {
      expect(slip.source).toBe('答案之书')
    }
  })
})

describe('壁纸池', () => {
  it('池子非空、文件名不重复', () => {
    expect(ORACLE_WALLPAPERS.length).toBeGreaterThan(20)
    expect(new Set(ORACLE_WALLPAPERS).size).toBe(ORACLE_WALLPAPERS.length)
  })

  it('每个文件名在 public/wallpapers/oracle/ 下真实存在（配置指向 ≠ 文件存在）', () => {
    for (const file of ORACLE_WALLPAPERS) {
      const abs = path.resolve(process.cwd(), 'public', 'wallpapers', 'oracle', file)
      expect(fs.existsSync(abs), `缺文件: ${file}`).toBe(true)
      expect(fs.statSync(abs).size, `空文件: ${file}`).toBeGreaterThan(1024)
    }
  })

  it('wallpaperSrc 拼了部署基路径', () => {
    expect(wallpaperSrc('x.jpg')).toBe(`${import.meta.env.BASE_URL}wallpapers/oracle/x.jpg`)
  })
})

describe('drawFor（号码 → 纸条 + 壁纸）', () => {
  it('确定性：同一个号码给同样的结果', () => {
    const a = drawFor(123)
    const b = drawFor(123)
    expect(a.slip.id).toBe(b.slip.id)
    expect(a.wallpaper).toBe(b.wallpaper)
  })

  it('0..998 每个号码都抽得出纸条与壁纸，且都在池子范围内', () => {
    for (let n = 0; n <= MAX_NUMBER; n++) {
      const { number, slip, wallpaper } = drawFor(n)
      expect(number).toBe(n)
      expect(ORACLE_SLIPS).toContain(slip)
      expect(ORACLE_WALLPAPERS).toContain(wallpaper)
    }
  })

  it('全部纸条与全部壁纸都够得着（不是只有前几条）', () => {
    const slips = new Set()
    const walls = new Set()
    for (let n = 0; n <= MAX_NUMBER; n++) {
      const d = drawFor(n)
      slips.add(d.slip.id)
      walls.add(d.wallpaper)
    }
    expect(slips.size).toBe(ORACLE_SLIPS.length)
    expect(walls.size).toBe(ORACLE_WALLPAPERS.length)
  })

  it('纸条与壁纸不是同步的（同一条纸能配到不同壁纸）', () => {
    const bySlip = new Map()
    for (let n = 0; n <= MAX_NUMBER; n++) {
      const d = drawFor(n)
      if (!bySlip.has(d.slip.id)) bySlip.set(d.slip.id, new Set())
      bySlip.get(d.slip.id).add(d.wallpaper)
    }
    const withVariety = [...bySlip.values()].filter((s) => s.size > 1).length
    expect(withVariety).toBeGreaterThan(ORACLE_SLIPS.length / 2)
  })

  it('越界号码被夹紧到 0..998', () => {
    expect(drawFor(-5).number).toBe(0)
    expect(drawFor(99999).number).toBe(MAX_NUMBER)
    expect(clampNumber(-1)).toBe(0)
    expect(clampNumber(1000)).toBe(MAX_NUMBER)
  })

  it('空池不抛，返回 null 而不是崩', () => {
    expect(drawFor(5, { slips: [], wallpapers: [] })).toEqual({
      number: 5,
      slip: null,
      wallpaper: null,
    })
    expect(drawFor(5, { slips: ORACLE_SLIPS, wallpapers: [] }).slip).toBeTruthy()
    expect(drawFor(5, { slips: ORACLE_SLIPS, wallpapers: [] }).wallpaper).toBeNull()
  })

  it('号码拆成三位数字', () => {
    expect(digitsOf(7)).toEqual(['0', '0', '7'])
    expect(digitsOf(998)).toEqual(['9', '9', '8'])
  })
})
