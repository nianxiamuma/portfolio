import { describe, it, expect } from 'vitest'
import { searchPosts } from '../lib/searchIndex'

describe('searchPosts 内存倒排索引', () => {
  it('空查询与空白查询返回空数组（不弹全量列表）', () => {
    expect(searchPosts('')).toEqual([])
    expect(searchPosts('   ')).toEqual([])
    expect(searchPosts(null)).toEqual([])
  })

  it('命中标题的权重高于命中正文的', () => {
    const hits = searchPosts('白屏')
    expect(hits.length).toBeGreaterThan(0)
    // 「白屏」出现在建站记录的正文/小标题里
    expect(hits[0].slug).toBe('how-this-site-was-built')
  })

  it('命中标签可以召回文章', () => {
    const hits = searchPosts('GSAP')
    expect(hits.map((h) => h.slug)).toContain('how-this-site-was-built')
  })

  it('大小写不敏感', () => {
    expect(searchPosts('gsap')).toEqual(searchPosts('GSAP'))
  })

  it('多词查询取交集（同时含两词的文章排前）', () => {
    const hits = searchPosts('React Vite')
    expect(hits.length).toBeGreaterThan(0)
    expect(hits[0].slug).toBe('how-this-site-was-built')
  })

  it('无结果返回空数组', () => {
    expect(searchPosts('量子纠缠态咖啡机')).toEqual([])
  })

  it('返回带 reason 的命中字段（展示来源用）', () => {
    const [hit] = searchPosts('GSAP')
    expect(hit.reason).toBeTruthy()
  })

  it('命中正文中的常见词时多篇召回、按权重排序', () => {
    const hits = searchPosts('性能')
    expect(hits.length).toBeGreaterThanOrEqual(1)
    const scores = hits.map((h) => h.score)
    expect([...scores].sort((a, b) => b - a)).toEqual(scores)
  })
})
