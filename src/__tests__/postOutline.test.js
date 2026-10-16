import { describe, it, expect } from 'vitest'
import { extractOutline, renderBodyBlocks } from '../lib/postOutline'

describe('extractOutline 提取目录', () => {
  it('多层 ## 标题生成有序目录', () => {
    const body = [
      '开篇段落。',
      '',
      '## 缘起',
      '',
      '一段正文。',
      '',
      '## 踩坑',
      '',
      '另一段正文。',
    ].join('\n')
    const outline = extractOutline(body)
    expect(outline).toHaveLength(2)
    expect(outline[0]).toEqual({ id: 'h-缘起', text: '缘起', level: 2 })
    expect(outline[1]).toEqual({ id: 'h-踩坑', text: '踩坑', level: 2 })
  })

  it('跳过非 ## 级标题（### 不入目录）', () => {
    const body = ['## 顶层', '', '### 子节不该入目录', '', '正文。'].join('\n')
    const outline = extractOutline(body)
    expect(outline).toHaveLength(1)
    expect(outline[0].text).toBe('顶层')
  })

  it('无标题正文返回空数组（优雅降级，TOC 不渲染）', () => {
    expect(extractOutline('只有段落，没有标题。')).toEqual([])
    expect(extractOutline('')).toEqual([])
    expect(extractOutline(null)).toEqual([])
  })

  it('标题前后空格被修剪；行中井号不误判', () => {
    const body = [
      '##  两边都有空格  ',
      '',
      '跑题的 # 一级标题不是行首井号',
      '',
      '正文 ## 也不是标题',
    ].join('\n')
    const outline = extractOutline(body)
    expect(outline).toHaveLength(1)
    expect(outline[0].text).toBe('两边都有空格')
  })

  it('代码块内的 ## 不算标题', () => {
    const body = ['正文。', '', '```bash', '# 注释', '## 不是标题', '```', '', '## 真标题'].join('\n')
    const outline = extractOutline(body)
    expect(outline).toHaveLength(1)
    expect(outline[0].text).toBe('真标题')
  })

  it('id 稳定：相同标题重复出现时加序号', () => {
    const body = ['## 重复', '', 'a', '', '## 重复', '', 'b'].join('\n')
    const outline = extractOutline(body)
    expect(outline[0].id).not.toBe(outline[1].id)
    expect(outline[1].id).toBe('h-重复-2')
  })
})

describe('renderBodyBlocks 受控 Markdown 渲染块', () => {
  it('段落按空行切块', () => {
    const blocks = renderBodyBlocks('段落一。\n\n段落二。')
    expect(blocks).toHaveLength(2)
    expect(blocks[0]).toEqual({ type: 'p', text: '段落一。' })
    expect(blocks[1]).toEqual({ type: 'p', text: '段落二。' })
  })

  it('## 标题块带稳定 id（与 extractOutline 一致）', () => {
    const blocks = renderBodyBlocks('## 缘起\n\n正文。')
    expect(blocks[0]).toEqual({ type: 'h2', id: 'h-缘起', text: '缘起' })
  })

  it('代码块整体保留为 code 块，语言字段可选', () => {
    const body = ['前置。', '', '```js', 'const a = 1', '```', '', '后置。'].join('\n')
    const blocks = renderBodyBlocks(body)
    expect(blocks).toHaveLength(3)
    expect(blocks[1]).toEqual({ type: 'code', lang: 'js', text: 'const a = 1' })
  })

  it('无语言围栏代码块 lang 为空字符串', () => {
    const blocks = renderBodyBlocks('```\nplain\n```')
    expect(blocks[0]).toEqual({ type: 'code', lang: '', text: 'plain' })
  })

  it('引用块 > 前缀剥离', () => {
    const blocks = renderBodyBlocks('> 引用一行。\n\n普通段落。')
    expect(blocks[0]).toEqual({ type: 'quote', text: '引用一行。' })
    expect(blocks[1].type).toBe('p')
  })

  it('null / 空串容错', () => {
    expect(renderBodyBlocks(null)).toEqual([])
    expect(renderBodyBlocks('')).toEqual([])
  })
})
