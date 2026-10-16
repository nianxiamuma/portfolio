/**
 * 「今日一句」——按日期从站内纸条库稳定取一条（对标 imsyy/home 的 Hitokoto 一言，
 * 但不引外部 API：52 条 oracle 纸条已是站内资产且逐条带出处）。
 *
 * 同一天全站同一句；跨天自然轮换。哈希用字符串逐字符 31 进制折叠。
 */

import { ORACLE_SLIPS, ORACLE_KINDS } from '../data/oracle'

/** 日期字符串 → 稳定非负整数哈希 */
function hashDate(dateStr) {
  let h = 0
  for (let i = 0; i < dateStr.length; i += 1) {
    h = (h * 31 + dateStr.charCodeAt(i)) >>> 0
  }
  return h
}

/**
 * 取「某一天」的纸条。dateStr 形如 '2026-10-16'（用 todayStr 生成）。
 * slips 参数供测试注入；空库返回 null。
 */
export function slipOfDay(dateStr, slips = ORACLE_SLIPS) {
  if (!Array.isArray(slips) || slips.length === 0) return null
  const slip = slips[hashDate(String(dateStr)) % slips.length]
  return {
    ...slip,
    kindLabel: ORACLE_KINDS[slip.kind]?.label || slip.kind,
  }
}

/** 本地日期字符串 YYYY-MM-DD（不用 toISOString —— 那是 UTC，会在中国凌晨错位一天） */
export function todayStr(now = new Date()) {
  const p = (n) => String(n).padStart(2, '0')
  return `${now.getFullYear()}-${p(now.getMonth() + 1)}-${p(now.getDate())}`
}
