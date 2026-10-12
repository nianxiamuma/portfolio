/**
 * 我常用的 AI 工具 / 网站收藏。
 *
 * 来源：用户提供的 10 条链接。其中若干条原文被截断（结尾带 …），
 * 这里按域名补全到可访问路径。
 */

export const TOOLS = [
  {
    id: 'aiart',
    name: 'AIART.PICS',
    domain: 'aiart.pics',
    url: 'https://aiart.pics',
    tag: 'AI 绘画',
    featured: true,
    accent: '#7c5cff',
    desc: '出图与风格参考一站式的画站，常用来找构图灵感。',
  },
  {
    id: 'meigen',
    name: 'MeiGen',
    domain: 'meigen.ai',
    url: 'https://www.meigen.ai',
    tag: 'AI 绘画',
    accent: '#ff8fab',
    desc: '提示词与成图对照着看，调参效率高。',
  },
  {
    id: 'youmind',
    name: 'YouMind',
    domain: 'youmind.com',
    url: 'https://youmind.com/zh-TW/prompts',
    tag: '提示词库',
    accent: '#4fb7dd',
    desc: '中文提示词库，分类清楚，适合直接抄作业。',
  },
  {
    id: 'gptimage-gallery',
    name: 'GPT-Image2 提示画廊',
    domain: 'gpt-image2.canghe.ai',
    url: 'https://gpt-image2.canghe.ai',
    tag: '提示词库',
    accent: '#edff66',
    desc: '按效果反查提示词，找风格最快的一站。',
  },
  {
    id: 'banana',
    name: 'Banana Pro AI',
    domain: 'bananaproai.com',
    url: 'https://bananaproai.com/zh/prompts/',
    tag: '提示词库',
    accent: '#ffe7b8',
    desc: '偏实用向的提示词集合，出图稳定。',
  },
  {
    id: 'cyberbara',
    name: 'Cyberbara',
    domain: 'cyberbara.com',
    url: 'https://cyberbara.com/zh/',
    tag: '提示词库',
    accent: '#90e8d6',
    desc: '偏风格化的提示词，做封面图时常用。',
  },
  {
    id: 'cuty',
    name: 'cuty.ai',
    domain: 'cuty.ai',
    url: 'https://www.cuty.ai/zh-CN/prompts/',
    tag: '提示词库',
    accent: '#ff8fab',
    desc: '人像与插画类提示词较多。',
  },
  {
    id: 'leader',
    name: 'Leader Prompt Gallery',
    domain: 'leaderai.top',
    url: 'https://www.leaderai.top/',
    tag: '提示词库',
    accent: '#7c5cff',
    desc: '提示词画廊，按模型分类。',
  },
  {
    id: 'davidwuw',
    name: 'GPT Image 2 提示词大全',
    domain: 'davidwuw0811-boop.github.io',
    url: 'https://davidwuw0811-boop.github.io/',
    tag: '提示词库',
    accent: '#4fb7dd',
    desc: '个人整理的提示词大全，收录很全。',
  },
  {
    id: '2slides',
    name: '2slides',
    domain: '2slides.com',
    url: 'https://2slides.com/zh-CN/products/',
    tag: '效率工具',
    accent: '#edff66',
    desc: '把内容一键转成幻灯片，做分享页很省事。',
  },
]

export const FEATURED_TOOL = TOOLS.find((t) => t.featured) || TOOLS[0]
export const BENTO_TOOLS = TOOLS.filter((t) => !t.featured).slice(0, 5)
