import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'

import HomeIntro from '../components/HomeIntro'
import Hero from '../components/Hero'
import About from '../components/About'
import Features from '../components/Features'
import Segments from '../components/Segments'
import Story from '../components/Story'
import Contact from '../components/Contact'

export default function HomePage() {
  const { hash } = useLocation()

  /**
   * 索引页（/home）的「首页片段」卡片用 `/?nointro#features` 这类地址跳过来。
   * React Router 切路由不会替浏览器做锚点滚动，这里等一帧布局稳定后手动滚过去；
   * `?nointro` 保证开场层不挡在前面（否则滚动是发生了，用户却只能看到门）。
   */
  useEffect(() => {
    if (!hash) return undefined
    const id = hash.slice(1)
    const timer = window.setTimeout(() => {
      document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }, 160)
    return () => window.clearTimeout(timer)
  }, [hash])

  return (
    <>
      <HomeIntro />
      <Hero />
      <About />
      <Features />
      <Segments />
      <Story />
      <Contact />
    </>
  )
}
