import { describe, it, expect, afterEach, vi } from 'vitest'
import { render, screen, cleanup, fireEvent, within, waitFor } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'

import MusicPlayer from '../components/MusicPlayer'
import { MUSIC_TRACKS, trackSrc } from '../data/music'

afterEach(cleanup)

const renderPlayer = (props = {}) =>
  render(
    <MemoryRouter>
      <MusicPlayer open onClose={() => {}} {...props} />
    </MemoryRouter>,
  )

describe('唱机播放器', () => {
  it('打开时渲染唱盘、唱片架与音频元素', () => {
    const { container } = renderPlayer()
    expect(screen.getByTestId('music-panel')).toBeTruthy()
    // 曲名会同时出现在唱片标签和唱片架里，所以查询要限定在唱片架范围内
    const shelf = within(screen.getByLabelText('唱片架'))
    for (const track of MUSIC_TRACKS) {
      expect(shelf.getByText(track.title)).toBeTruthy()
    }
    expect(container.querySelector('audio')).toBeTruthy()
  })

  it('音频路径拼了部署基路径（否则子路径部署下 404）', () => {
    const { container } = renderPlayer()
    const src = container.querySelector('audio')?.getAttribute('src') || ''
    expect(src).toBe(trackSrc(MUSIC_TRACKS[0]))
    expect(src.startsWith(import.meta.env.BASE_URL)).toBe(true)
  })

  it('关闭时不渲染面板', () => {
    render(
      <MemoryRouter>
        <MusicPlayer open={false} onClose={() => {}} />
      </MemoryRouter>,
    )
    expect(screen.queryByTestId('music-panel')).toBeNull()
  })

  it('面板关闭时音频元素仍在 —— 关掉面板不该中断播放', () => {
    const { container } = render(
      <MemoryRouter>
        <MusicPlayer open={false} onClose={() => {}} />
      </MemoryRouter>,
    )
    // 这条钉住用户报的问题：早先 audio 写在面板里，一关面板组件卸载、歌就断了
    const audio = container.querySelector('audio')
    expect(audio).toBeTruthy()
    expect(audio.getAttribute('src')).toBe(trackSrc(MUSIC_TRACKS[0]))
  })

  it('面板里有进度条', () => {
    renderPlayer()
    expect(screen.getByLabelText('播放进度')).toBeTruthy()
  })

  it('在唱片架点另一首会换片并开始播放', () => {
    const seen = []
    const { container } = renderPlayer({ onPlayingChange: (v) => seen.push(v) })
    fireEvent.click(within(screen.getByLabelText('唱片架')).getByText(MUSIC_TRACKS[1].title))
    const src = container.querySelector('audio')?.getAttribute('src') || ''
    expect(src).toBe(trackSrc(MUSIC_TRACKS[1]))
    expect(seen).toContain(true)
  })

  it('上一首/下一首会在清单里环绕', () => {
    const { container } = renderPlayer()
    const srcOf = () => container.querySelector('audio')?.getAttribute('src')
    fireEvent.click(screen.getByLabelText('上一首'))
    expect(srcOf()).toBe(trackSrc(MUSIC_TRACKS[MUSIC_TRACKS.length - 1]))
    fireEvent.click(screen.getByLabelText('下一首'))
    expect(srcOf()).toBe(trackSrc(MUSIC_TRACKS[0]))
  })
})

describe('曲目清单为空时的降级', () => {
  it('Navbar 不渲染音乐入口 —— 不留一个点了没反应的按钮', async () => {
    vi.resetModules()
    vi.doMock('../data/music', () => ({
      MUSIC_TRACKS: [],
      musicAvailable: () => false,
      trackSrc: () => '',
    }))
    const { default: Navbar } = await import('../components/Navbar')
    render(
      <MemoryRouter>
        <Navbar />
      </MemoryRouter>,
    )
    expect(screen.queryByLabelText('打开唱片机')).toBeNull()
    vi.doUnmock('../data/music')
    vi.resetModules()
  })
})

/**
 * 只判「清单非空」是不够的：.gitignore 把 public/music/* 挡在仓库外，
 * 公开站点上清单非空但文件不存在 —— 那样会留下一个点了没反应的死按钮。
 * 这两条钉住运行期探测。
 */
describe('音乐入口的运行期探测', () => {
  const mockMusic = (overrides = {}) => {
    vi.resetModules()
    vi.doMock('../data/music', () => ({
      MUSIC_TRACKS: [{ id: 't', title: 'T', artist: 'A', file: 't.mp3' }],
      musicAvailable: () => true,
      trackSrc: () => '/music/t.mp3',
      ...overrides,
    }))
  }

  afterEach(() => {
    vi.doUnmock('../data/music')
    vi.unstubAllGlobals()
    vi.resetModules()
  })

  it('音频可取到 → 入口出现', async () => {
    mockMusic()
    vi.stubGlobal('fetch', vi.fn(() => Promise.resolve({ ok: true })))
    const { default: Navbar } = await import('../components/Navbar')
    render(
      <MemoryRouter>
        <Navbar />
      </MemoryRouter>,
    )
    expect(await screen.findByLabelText('打开唱片机')).toBeTruthy()
  })

  it('音频取不到（线上未部署）→ 入口不出现', async () => {
    mockMusic()
    vi.stubGlobal('fetch', vi.fn(() => Promise.resolve({ ok: false })))
    const { default: Navbar } = await import('../components/Navbar')
    render(
      <MemoryRouter>
        <Navbar />
      </MemoryRouter>,
    )
    await waitFor(() => expect(screen.queryByLabelText('打开唱片机')).toBeNull())
  })

  it('资源被回退成 HTML（SPA 站点上缺失文件返回 200）→ 同样不出现', async () => {
    mockMusic()
    vi.stubGlobal(
      'fetch',
      vi.fn(() =>
        Promise.resolve({ ok: true, headers: { get: () => 'text/html; charset=utf-8' } }),
      ),
    )
    const { default: Navbar } = await import('../components/Navbar')
    render(
      <MemoryRouter>
        <Navbar />
      </MemoryRouter>,
    )
    await waitFor(() => expect(screen.queryByLabelText('打开唱片机')).toBeNull())
  })

  it('探测请求本身失败（网络/跨域）→ 同样不出现，不抛', async () => {
    mockMusic()
    vi.stubGlobal('fetch', vi.fn(() => Promise.reject(new Error('boom'))))
    const { default: Navbar } = await import('../components/Navbar')
    render(
      <MemoryRouter>
        <Navbar />
      </MemoryRouter>,
    )
    await waitFor(() => expect(screen.queryByLabelText('打开唱片机')).toBeNull())
  })
})
