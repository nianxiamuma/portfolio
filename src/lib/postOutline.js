/**
 * 文章正文的结构化解析（受控 Markdown 子集）。
 *
 * 约定：正文是纯文本，支持三种结构记号——
 *   ## 标题        → 目录条目 + 渲染为 h2（含稳定 id 供锚点跳转）
 *   ``` 围栏       → 代码块（保留原样，不语法高亮）
 *   > 引用         → 引用块
 * 其余按空行切块渲染为段落。
 *
 * extractOutline 与 renderBodyBlocks 必须用同一套标题/围栏判定，
 * 保证目录 id 与正文锚点一一对应。
 */

/** 判断一行是否为 ## 级标题（行首恰好两个井号 + 空格） */
const isHeading = (line) => /^##\s+\S/.test(line)

/**
 * 从正文提取目录。
 * - 只认行首 `## `；### 及以下不入目录（本文站只有一层结构）
 * - 代码块内的 # / ## 不算标题
 * - 重复标题追加序号保证 id 稳定
 * - 无标题返回 []（调用方按「不渲染 TOC」降级）
 */
export function extractOutline(body) {
  if (!body || typeof body !== 'string') return []

  const outline = []
  const seen = new Map()
  let inFence = false

  for (const line of body.split('\n')) {
    if (line.startsWith('```')) {
      inFence = !inFence
      continue
    }
    if (inFence) continue
    if (!isHeading(line)) continue

    const text = line.replace(/^##\s+/, '').trim()
    if (!text) continue

    const count = seen.get(text) || 0
    seen.set(text, count + 1)
    const id = count === 0 ? `h-${text}` : `h-${text}-${count + 1}`
    outline.push({ id, text, level: 2 })
  }

  return outline
}

/**
 * 把正文切成渲染块。
 * 返回数组元素形如：
 *   { type: 'p', text }
 *   { type: 'h2', id, text }
 *   { type: 'code', lang, text }
 *   { type: 'quote', text }
 */
export function renderBodyBlocks(body) {
  if (!body || typeof body !== 'string') return []

  const blocks = []
  const outline = extractOutline(body)
  const outlineQueue = [...outline]

  let inFence = false
  let codeLines = []
  let codeLang = ''
  let para = []

  const flushPara = () => {
    if (para.length) {
      blocks.push({ type: 'p', text: para.join('\n') })
      para = []
    }
  }

  const flushCode = () => {
    if (inFence) {
      blocks.push({ type: 'code', lang: codeLang, text: codeLines.join('\n') })
      codeLines = []
      codeLang = ''
      inFence = false
    }
  }

  for (const line of body.split('\n')) {
    // 围栏开关（```xxx 或 ```）
    if (line.startsWith('```')) {
      if (inFence) {
        flushCode()
      } else {
        flushPara()
        inFence = true
        codeLang = line.slice(3).trim()
      }
      continue
    }

    if (inFence) {
      codeLines.push(line)
      continue
    }

    if (isHeading(line)) {
      flushPara()
      const head = outlineQueue.shift()
      // renderBodyBlocks 与 extractOutline 扫描同一正文，正常情况必然对得上；
      // 防御性兜底：取不到时仍渲染标题，id 现场生成
      const text = line.replace(/^##\s+/, '').trim()
      blocks.push({ type: 'h2', id: head ? head.id : `h-${text}`, text })
      continue
    }

    if (/^>\s?/.test(line)) {
      flushPara()
      blocks.push({ type: 'quote', text: line.replace(/^>\s?/, '') })
      continue
    }

    if (line.trim() === '') {
      flushPara()
      continue
    }

    para.push(line)
  }

  flushPara()
  flushCode()

  return blocks
}
