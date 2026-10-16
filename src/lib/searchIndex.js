/**
 * 站内文章全文搜索 —— 内存倒排索引（对标 Yuimi Lab 的 Pagefind，但纯前端内存版）。
 *
 * 设计：
 * - 模块加载时对 POSTS 建一次索引（3 篇文章规模下零感知；百篇量级也仍是毫秒级）
 * - 词元 = 连续的非分隔符片段（中英文通吃：中文整句按 2-gram 切，英文按词切）
 * - 字段权重：标题 ×6 > 标签 ×4 > 分类 ×3 > 摘要 ×2 > 正文 ×1
 * - 多词查询取交集；命中文档按总分排序
 */

import { POSTS } from '../data/posts'

/** 中英文分隔符：空白 + 常见标点 */
const SPLIT_RE = /[\s，。、；：？！""''「」『』（）《》<>【】\[\]{}()·—…！？,.;:?!"'`|\\/]+/

/** 把一段文本切成词元序列 */
export function tokenize(text) {
  if (!text) return []
  const tokens = []
  for (const seg of String(text).split(SPLIT_RE)) {
    if (!seg) continue
    // 纯 ASCII（英文单词/标签）：整段小写作为一个词元
    if (/^[a-z0-9+#.]+$/i.test(seg)) {
      tokens.push(seg.toLowerCase())
      continue
    }
    // CJK：2-gram 覆盖（1 字词用原字补位）
    const chars = [...seg]
    if (chars.length === 1) {
      tokens.push(chars[0])
      continue
    }
    for (let i = 0; i < chars.length - 1; i += 1) {
      tokens.push(chars[i] + chars[i + 1])
    }
  }
  return tokens
}

const FIELD_WEIGHTS = [
  ['title', 6],
  ['tags', 4],
  ['category', 3],
  ['summary', 2],
  ['body', 1],
]

/** 模块级索引：token -> Map(slug -> score) */
const INDEX = new Map()
const DOCS = new Map(POSTS.map((post) => [post.slug, post]))

for (const post of POSTS) {
  for (const [field, weight] of FIELD_WEIGHTS) {
    const value = field === 'tags' ? post.tags.join(' ') : post[field]
    for (const token of new Set(tokenize(value))) {
      if (!INDEX.has(token)) INDEX.set(token, new Map())
      const docScores = INDEX.get(token)
      docScores.set(post.slug, (docScores.get(post.slug) || 0) + weight)
    }
  }
}

/**
 * 搜索文章。
 * 返回 [{ ...post, score, reason }]，按 score 降序；query 为空返回 []。
 * reason 是可读的命中来源说明（"标题"/"标签"/"正文"等）。
 */
export function searchPosts(query) {
  if (!query || typeof query !== 'string' || !query.trim()) return []

  const terms = tokenize(query)
  if (!terms.length) return []

  // 按 token 求交集：每个 token 取命中 slug 集合，累加分数
  const acc = new Map()
  for (const term of terms) {
    const docScores = INDEX.get(term)
    if (!docScores) continue
    for (const [slug, score] of docScores) {
      acc.set(slug, (acc.get(slug) || 0) + score)
    }
  }
  if (!acc.size) return []

  const FIELD_LABEL = { title: '标题', tags: '标签', category: '分类', summary: '摘要', body: '正文' }
  const lowerQuery = query.trim().toLowerCase()

  return [...acc.entries()]
    .map(([slug, score]) => {
      const post = DOCS.get(slug)
      const hitField =
        FIELD_WEIGHTS.find(([field]) => {
          const value = field === 'tags' ? post.tags.join(' ') : post[field]
          return value && String(value).toLowerCase().includes(lowerQuery)
        })?.[0] || 'body'
      return { ...post, score, reason: FIELD_LABEL[hitField] }
    })
    .sort((a, b) => b.score - a.score || (a.date < b.date ? 1 : -1))
}
