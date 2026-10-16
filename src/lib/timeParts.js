/**
 * 站点小部件的时间纯函数（对标 imsyy/home 的时钟与时光进度条，自写实现）。
 * 全部接受注入的时间，不依赖真实时钟 —— 测试用固定时间断言边界。
 */

/** 问候语按时段：5-11 早上 / 11-13 中午 / 13-18 下午 / 18-23 晚上 / 23-5 夜深 */
export function greetingFor(hour) {
  if (hour >= 5 && hour < 11) return '早上好'
  if (hour >= 11 && hour < 13) return '中午好'
  if (hour >= 13 && hour < 18) return '下午好'
  if (hour >= 18 && hour < 23) return '晚上好'
  return '夜深了'
}

/**
 * 时光进度条：今年已过百分比（0~1）。
 * 分母用「今年总毫秒数」，闰年自然多一天；年末最后一刻接近但不等于 1。
 */
export function yearProgress(now) {
  const year = now.getFullYear()
  const start = new Date(year, 0, 1).getTime()
  const end = new Date(year + 1, 0, 1).getTime()
  return Math.min(1, Math.max(0, (now.getTime() - start) / (end - start)))
}

/** 时钟显示 hh:mm:ss（补零） */
export function clockText(now) {
  const p = (n) => String(n).padStart(2, '0')
  return `${p(now.getHours())}:${p(now.getMinutes())}:${p(now.getSeconds())}`
}

/** 日期显示 M月D日 · 周X */
const WEEKDAYS = ['日', '一', '二', '三', '四', '五', '六']
export function dateText(now) {
  return `${now.getMonth() + 1}月${now.getDate()}日 · 周${WEEKDAYS[now.getDay()]}`
}
