import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { useLocation } from 'react-router-dom'
import { DEFAULT_SCENE, pickActiveScene, resolveScene } from '../lib/backgrounds'

/**
 * 当前生效的背景场景。
 *
 * 两个来源，优先级：区块覆盖 > 路由默认。
 *   路由默认 —— 换页时由 resolveScene 从 pathname 算出
 *   区块覆盖 —— 页面上写了 data-bg-scene 的容器，滚到它时接管背景
 *
 * 这样「每页不同壁纸」和「首页向下滑每段不同壁纸」用同一套机制，不必各写一遍。
 */
const BackgroundContext = createContext(null)

/** 区块标记属性名：容器上写 data-bg-scene="场景key" 即可参与背景切换 */
export const SCENE_ATTR = 'data-bg-scene'

export function BackgroundProvider({ children }) {
  const { pathname } = useLocation()
  const routeScene = useMemo(() => resolveScene(pathname), [pathname])
  const [sectionScene, setSectionScene] = useState(null)

  // 换页时清掉区块覆盖，否则上一页的区块场景会跟着过来
  useEffect(() => {
    setSectionScene(null)
  }, [pathname])

  /*
   * 滚动时挑出当前区块场景。
   * 用 rAF 节流（滚动事件可能每帧触发多次），并且只在结果真的变了才 setState，
   * 免得每帧都触发一次 React 渲染。
   */
  useEffect(() => {
    if (typeof window === 'undefined' || typeof document === 'undefined') return undefined

    let raf = 0
    let last = null

    const measure = () => {
      raf = 0
      const rects = []
      document.querySelectorAll(`[${SCENE_ATTR}]`).forEach((node) => {
        rects.push({ key: node.getAttribute(SCENE_ATTR), top: node.getBoundingClientRect().top })
      })
      // 判定线放在视口 80% 高度处：下一个区块露头就切背景。
      // 用 0（区块顶到视口顶端）会有一段「卡片已经看见了，壁纸还是上一张」的空窗。
      const next = pickActiveScene(rects, window.innerHeight * 0.8)
      if (next !== last) {
        last = next
        setSectionScene(next)
      }
    }

    const schedule = () => {
      if (raf) return
      raf = window.requestAnimationFrame(measure)
    }

    measure()
    window.addEventListener('scroll', schedule, { passive: true })
    window.addEventListener('resize', schedule)
    return () => {
      if (raf) window.cancelAnimationFrame(raf)
      window.removeEventListener('scroll', schedule)
      window.removeEventListener('resize', schedule)
    }
  }, [pathname])

  const value = useMemo(
    () => ({ scene: sectionScene || routeScene, routeScene, sectionScene }),
    [sectionScene, routeScene],
  )

  return <BackgroundContext.Provider value={value}>{children}</BackgroundContext.Provider>
}

/**
 * 读当前生效的场景 key。
 * 没有 Provider 时回落到默认场景而不是抛 —— 背景是装饰层，不该把页面带崩。
 */
export function useBackgroundScene() {
  const ctx = useContext(BackgroundContext)
  return ctx || { scene: DEFAULT_SCENE, routeScene: DEFAULT_SCENE, sectionScene: null }
}
