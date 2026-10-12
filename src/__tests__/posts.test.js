import { describe, it, expect } from 'vitest'
import {
  POSTS,
  allCategories,
  getPost,
  readingMinutes,
  sortedPosts,
  wordCount,
} from '../data/posts'

describe('文章数据', () => {
  it('slug 唯一，字段完整', () => {
    expect(new Set(POSTS.map((p) => p.slug)).size).toBe(POSTS.length)
    for (const post of POSTS) {
      expect(post.title, post.slug).toBeTruthy()
      expect(post.date, post.slug).toMatch(/^\d{4}-\d{2}-\d{2}$/)
      expect(post.category, post.slug).toBeTruthy()
      expect(Array.isArray(post.tags), post.slug).toBe(true)
      expect(post.body.length, post.slug).toBeGreaterThan(50)
    }
  })

  it('getPost 按 slug 命中；未命中返回 undefined', () => {
    expect(getPost(POSTS[0].slug).title).toBe(POSTS[0].title)
    expect(getPost('does-not-exist')).toBeUndefined()
  })

  it('wordCount 不计空白，容错空输入', () => {
    expect(wordCount({ body: 'a b\nc\td' })).toBe(4)
    expect(wordCount(null)).toBe(0)
    expect(wordCount({})).toBe(0)
  })

  it('readingMinutes 至少 1 分钟，且随字数线性增长', () => {
    expect(readingMinutes({ body: '短' })).toBe(1)
    expect(readingMinutes({ body: 'x'.repeat(400) })).toBe(1)
    expect(readingMinutes({ body: 'x'.repeat(4000) })).toBe(10)
  })

  it('sortedPosts 按日期倒序', () => {
    const dates = sortedPosts().map((p) => p.date)
    expect([...dates].sort().reverse()).toEqual(dates)
  })

  it('sortedPosts 不改动原数组', () => {
    const before = POSTS.map((p) => p.slug)
    sortedPosts()
    expect(POSTS.map((p) => p.slug)).toEqual(before)
  })

  it('allCategories 去重', () => {
    const cats = allCategories()
    expect(new Set(cats).size).toBe(cats.length)
    expect(cats.length).toBeGreaterThan(0)
  })
})
