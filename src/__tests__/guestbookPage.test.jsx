/**
 * 「留言板」页的回归测试。
 *
 * 覆盖：页头/种子数据渲染、发布留言后置顶并落 localStorage、
 * 200 字上限与实时计数、局部回复框（回复同样只落本地）。
 */
import { describe, it, expect, afterEach, beforeEach } from 'vitest'
import { render, screen, fireEvent, cleanup } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'

import GuestbookPage from '../pages/GuestbookPage'
import { GUESTBOOK_SEED } from '../data/guestbookSeed'

const STORAGE_KEY = 'guestbook-local'

beforeEach(() => {
  window.localStorage.clear()
})

afterEach(cleanup)

const renderPage = () => {
  const view = render(
    <MemoryRouter>
      <GuestbookPage />
    </MemoryRouter>,
  )
  return { ...view, list: () => view.container.querySelector('ul') }
}

const typeMessage = (nickname, content) => {
  fireEvent.change(screen.getByPlaceholderText('怎么称呼你'), { target: { value: nickname } })
  fireEvent.change(screen.getByPlaceholderText('想说的话，写在下面'), { target: { value: content } })
}

const submitForm = () => {
  const textarea = screen.getByPlaceholderText('想说的话，写在下面')
  fireEvent.submit(textarea.closest('form'))
}

describe('留言板页', () => {
  it('渲染页头、种子留言与初始计数', () => {
    const { list } = renderPage()

    expect(screen.getByText(/留一句/)).toBeTruthy()
    expect(screen.getByText('Messages')).toBeTruthy()
    expect(screen.getByText(`${GUESTBOOK_SEED.length} 条`)).toBeTruthy()
    expect(list().children).toHaveLength(GUESTBOOK_SEED.length)

    for (const seed of GUESTBOOK_SEED) {
      expect(screen.getAllByText(seed.nickname).length, seed.id).toBeGreaterThan(0)
    }
    expect(screen.getByText('0/200')).toBeTruthy()
  })

  it('提交后新留言出现在顶部，并写入 localStorage', () => {
    const { list } = renderPage()

    typeMessage('路人甲', '这个站看着挺舒服，先留个脚印。')
    submitForm()

    const first = list().children[0]
    expect(first.textContent).toContain('路人甲')
    expect(first.textContent).toContain('这个站看着挺舒服，先留个脚印。')
    expect(list().children).toHaveLength(GUESTBOOK_SEED.length + 1)

    const stored = JSON.parse(window.localStorage.getItem(STORAGE_KEY))
    expect(stored.messages).toHaveLength(1)
    expect(stored.messages[0]).toMatchObject({
      nickname: '路人甲',
      content: '这个站看着挺舒服，先留个脚印。',
    })
    expect(screen.getByRole('status').textContent).toContain('已贴到顶部')
  })

  it('正文超过 200 字被截断，计数实时更新', () => {
    renderPage()

    const textarea = screen.getByPlaceholderText('想说的话，写在下面')
    fireEvent.change(textarea, { target: { value: '好'.repeat(250) } })

    expect(textarea.value).toHaveLength(200)
    expect(screen.getByText('200/200')).toBeTruthy()
  })

  it('回复走局部输入框，只写入本地存储', () => {
    const { list } = renderPage()

    fireEvent.click(screen.getAllByText('回复')[0])
    expect(screen.getByPlaceholderText(`回复 ${GUESTBOOK_SEED[0].nickname}`)).toBeTruthy()

    fireEvent.change(screen.getByPlaceholderText('怎么称呼你'), { target: { value: '夜行者' } })
    fireEvent.change(screen.getByPlaceholderText(`回复 ${GUESTBOOK_SEED[0].nickname}`), {
      target: { value: '同感，收藏了。' },
    })
    fireEvent.click(screen.getByText('发送'))

    const stored = JSON.parse(window.localStorage.getItem(STORAGE_KEY))
    expect(stored.replies[GUESTBOOK_SEED[0].id]).toHaveLength(1)
    expect(stored.replies[GUESTBOOK_SEED[0].id][0]).toMatchObject({
      nickname: '夜行者',
      content: '同感，收藏了。',
    })
    expect(list().children[0].textContent).toContain('同感，收藏了。')
  })

  it('种子数据 5 条且字段完整，时间戳均为过去', () => {
    expect(GUESTBOOK_SEED).toHaveLength(5)
    for (const seed of GUESTBOOK_SEED) {
      for (const key of ['id', 'nickname', 'content', 'createdAt', 'accent']) {
        expect(seed[key], `${seed.id}.${key}`).toBeTruthy()
      }
      expect(seed.createdAt, seed.id).toBeLessThan(Date.now())
      expect(seed.content.length, seed.id).toBeLessThanOrEqual(200)
      expect(seed.accent, seed.id).toMatch(/^#[0-9a-f]{6}$/i)
    }
  })
})
