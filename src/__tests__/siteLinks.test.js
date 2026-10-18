import { afterEach, describe, expect, it, vi } from 'vitest'

import { blogEntryHref } from '../lib/siteLinks'

/**
 * blogEntryHref 的两个分支必须都锁住：
 * - dev：主站 vite(:5173) 与博客 astro dev(:4321) 是两个服务器，返回对端完整地址。
 *   回归对象：本地点「博客」落到 `/blog/`（5173 上不存在）返回 404。
 * - 线上：同域不同路径，必须回相对路径，前缀由 BASE_URL 决定。
 *   回归对象：写死 `:4321` 会把线上访客打到 localhost。
 */
describe('blogEntryHref', () => {
  afterEach(() => {
    vi.unstubAllEnvs()
  })

  it('本地 dev：返回对端 astro dev 端口的完整地址', () => {
    vi.stubEnv('DEV', true)
    // jsdom 默认 location 为 http://localhost:3000/，端口不等于 4321
    expect(blogEntryHref()).toBe('http://localhost:4321/portfolio/blog/')
  })

  it('线上构建：返回相对路径，前缀交给 BASE_URL', () => {
    vi.stubEnv('DEV', false)
    expect(blogEntryHref()).toBe('/blog/')
  })
})
