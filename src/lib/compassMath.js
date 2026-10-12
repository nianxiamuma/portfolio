/**
 * 指南针选择器的纯数学部分（与视图解耦，便于单测）。
 *
 * 交互模型：指针相对罗盘中心的角度 → 连续旋转量（保留圈数，避免 0°/360°
 * 处方向跳变）→ 按角度环距取最近方位 → 松手吸附到该方位的连续角。
 */

/** 归一化到 [0, 360) */
export const normalizeAngle = (angle) => ((angle % 360) + 360) % 360

/** 两个角度的环距（0..180） */
export const angleDistance = (a, b) => {
  const diff = Math.abs(normalizeAngle(a) - normalizeAngle(b))
  return Math.min(diff, 360 - diff)
}

/**
 * 把新角度折算成与上一次旋转最接近的等价角（可跨圈累积）。
 * 例：previous=350, next=10 → 370（继续正向转 20°），而不是跳回 10。
 */
export const toContinuousRotation = (previous, next) => {
  let delta = normalizeAngle(next) - normalizeAngle(previous)
  if (delta > 180) delta -= 360
  if (delta <= -180) delta += 360
  return previous + delta
}

/** 指针相对元素中心的角度（0° 指向正上方） */
export const pointerAngleFromRect = ({ x, y }, rect) => {
  const cx = rect.left + rect.width / 2
  const cy = rect.top + rect.height / 2
  return (Math.atan2(y - cy, x - cx) * 180) / Math.PI + 90
}

/** 角度环距最近的方位项 */
export const nearestByAngle = (rotation, items) => {
  let best = null
  let bestDistance = Infinity
  for (const item of items) {
    const distance = angleDistance(rotation, item.angle)
    if (distance < bestDistance) {
      bestDistance = distance
      best = item
    }
  }
  return best
}

/** 当前实时指向的索引 */
export const indexFromRotation = (rotation, items) => {
  const best = nearestByAngle(rotation, items)
  return best ? best.index : items[0].index
}

/** 松手吸附：返回最近方位的 index 与其连续角 */
export const snapTarget = (rotation, items) => {
  const best = nearestByAngle(rotation, items)
  if (!best) return null
  const turns = Math.round((rotation - best.angle) / 360)
  return { index: best.index, angle: best.angle + turns * 360 }
}
