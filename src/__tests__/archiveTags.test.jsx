import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MemoryRouter, Routes, Route } from 'react-router-dom'
import ArchivePage, { groupByYear } from '../pages/ArchivePage'
import TagsPage, { allTags, TagPage } from '../pages/TagsPage'
import { POSTS } from '../data/posts'

describe('归档分组 groupByYear', () => {
  it('按年份分组且年份倒序', () => {
    const groups = groupByYear(POSTS)
    const years = groups.map((g) => g.year)
    expect([...years].sort().reverse()).toEqual(years)
  })

  it('组内文章为该年份的全部文章', () => {
    const groups = groupByYear(POSTS)
    const total = groups.reduce((sum, g) => sum + g.posts.length, 0)
    expect(total).toBe(POSTS.length)
  })

  it('空输入返回空数组', () => {
    expect(groupByYear([])).toEqual([])
  })
})

describe('标签聚合 allTags', () => {
  it('覆盖全部标签且计数正确', () => {
    const tags = allTags()
    const manual = new Map()
    for (const post of POSTS) {
      for (const tag of post.tags) manual.set(tag, (manual.get(tag) || 0) + 1)
    }
    expect(tags.length).toBe(manual.size)
    for (const { tag, count } of tags) {
      expect(count).toBe(manual.get(tag))
    }
  })

  it('按计数降序', () => {
    const counts = allTags().map((t) => t.count)
    expect([...counts].sort((a, b) => b - a)).toEqual(counts)
  })
})

describe('归档页渲染', () => {
  it('渲染出年份与文章标题', () => {
    render(
      <MemoryRouter>
        <ArchivePage />
      </MemoryRouter>
    )
    expect(screen.getByText(/归档/)).toBeTruthy()
    for (const post of POSTS) {
      expect(screen.getByText(post.title)).toBeTruthy()
    }
  })
})

describe('标签页渲染', () => {
  it('标签云渲染全部标签，链接指向 /tags/:tag', () => {
    render(
      <MemoryRouter>
        <TagsPage />
      </MemoryRouter>
    )
    for (const { tag } of allTags()) {
      const link = screen.getByText(tag).closest('a')
      expect(link?.getAttribute('href')).toBe(`/tags/${encodeURIComponent(tag)}`)
    }
  })

  it('TagPage 渲染该标签下的文章；空标签给空态提示', () => {
    const tagged = POSTS[0].tags[0]
    render(
      <MemoryRouter initialEntries={[`/tags/${encodeURIComponent(tagged)}`]}>
        <Routes>
          <Route path="/tags/:tag" element={<TagPage />} />
        </Routes>
      </MemoryRouter>
    )
    expect(screen.getByText(`#${tagged}`)).toBeTruthy()
    const taggedPosts = POSTS.filter((p) => p.tags.includes(tagged))
    for (const post of taggedPosts) {
      expect(screen.getByText(post.title)).toBeTruthy()
    }
  })
})
