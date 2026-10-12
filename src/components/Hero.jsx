import { useCallback, useEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import { useGSAP } from '@gsap/react'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { ArrowUpRight } from 'lucide-react'

import WallpaperScene from './WallpaperScene'
import HeroWordmark from './HeroWordmark'
import HeroProfileCard from './HeroProfileCard'
import Petals from './Petals'
import {
  ALL_COVERS,
  COMPASS_CARD_POSITIONS,
  COMPASS_TICKS,
  getWallpaper,
} from '../lib/wallpapers'
import {
  indexFromRotation,
  pointerAngleFromRect,
  snapTarget,
  toContinuousRotation,
} from '../lib/compassMath'

gsap.registerPlugin(ScrollTrigger)

const COMPASS_ITEMS = ALL_COVERS.map(({ index, angle, label }) => ({ index, angle, label }))

export default function Hero() {
  const [current, setCurrent] = useState(1)
  const [previous, setPrevious] = useState(1)
  const [hasSwitched, setHasSwitched] = useState(false)
  const [isTransitioning, setIsTransitioning] = useState(false)
  const [selectorOpen, setSelectorOpen] = useState(false)
  const [rotation, setRotation] = useState(0)

  const frameRef = useRef(null)
  const sceneRef = useRef(null)
  const prevLayerRef = useRef(null)
  const washRef = useRef(null)
  const compassRef = useRef(null)
  const dragRef = useRef(null)

  const pointedIndex = indexFromRotation(rotation, COMPASS_ITEMS)
  const activeWallpaper = getWallpaper(selectorOpen ? pointedIndex : current)
  const pointed = getWallpaper(pointedIndex)
  const theme = activeWallpaper.theme

  /* 导航栏的 SWITCH COVER 按钮通过全局事件唤起选择器 */
  useEffect(() => {
    const open = () => {
      const active = ALL_COVERS.find((w) => w.index === current)
      setRotation(active ? active.angle : 0)
      setSelectorOpen(true)
    }
    window.addEventListener('showHeroPreview', open)
    return () => window.removeEventListener('showHeroPreview', open)
  }, [current])

  useEffect(() => {
    if (!selectorOpen) return undefined
    const onKey = (e) => {
      if (e.key === 'Escape') setSelectorOpen(false)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [selectorOpen])

  /* 换图转场：前层淡出放大 / 新层从放大归位 / 一道光带扫过 */
  useGSAP(
    () => {
      if (!hasSwitched || !prevLayerRef.current || !sceneRef.current) return
      const tl = gsap.timeline({ onComplete: () => setIsTransitioning(false) })

      gsap.set(prevLayerRef.current, { autoAlpha: 1, scale: 1 })
      gsap.set(sceneRef.current, { scale: 1.06, autoAlpha: 0.35, transformOrigin: 'center center' })
      gsap.set(washRef.current, { autoAlpha: 0, xPercent: -42, scaleX: 0.55 })

      tl.to(
        prevLayerRef.current,
        { autoAlpha: 0, scale: 1.04, duration: 1.05, ease: 'power2.out' },
        0,
      )
        .to(sceneRef.current, { scale: 1, autoAlpha: 1, duration: 1.28, ease: 'power3.inOut' }, 0)
        .to(
          washRef.current,
          { autoAlpha: 0.3, xPercent: -6, scaleX: 1, duration: 0.48, ease: 'power2.out' },
          0.04,
        )
        .to(
          washRef.current,
          { autoAlpha: 0, xPercent: 38, scaleX: 1.25, duration: 0.72, ease: 'power3.inOut' },
          0.45,
        )
    },
    { dependencies: [current, hasSwitched], revertOnUpdate: true },
  )

  /* 滚动时轻微收形（用 transform，避免逐帧重绘 clip-path 造成掉帧） */
  useGSAP(() => {
    if (!frameRef.current) return
    gsap.fromTo(
      frameRef.current,
      { scale: 1, filter: 'brightness(1)' },
      {
        scale: 0.94,
        filter: 'brightness(0.72)',
        ease: 'none',
        scrollTrigger: {
          trigger: frameRef.current,
          start: 'top top',
          end: 'bottom top',
          scrub: true,
        },
      },
    )
  })

  const selectWallpaper = useCallback(
    (next, { close = true } = {}) => {
      if (close) setSelectorOpen(false)
      if (next === current) return
      setPrevious(current)
      setHasSwitched(true)
      setIsTransitioning(true)
      setCurrent(next)
    },
    [current],
  )

  const angleAt = (e) =>
    pointerAngleFromRect({ x: e.clientX, y: e.clientY }, compassRef.current.getBoundingClientRect())

  const onPointerDown = (e) => {
    e.preventDefault()
    e.stopPropagation()
    const next = toContinuousRotation(rotation, angleAt(e))
    dragRef.current = { id: e.pointerId, rotation: next }
    setRotation(next)
    e.currentTarget.setPointerCapture(e.pointerId)
  }

  const onPointerMove = (e) => {
    if (dragRef.current?.id !== e.pointerId) return
    const next = toContinuousRotation(dragRef.current.rotation, angleAt(e))
    dragRef.current.rotation = next
    setRotation(next)
  }

  const onPointerUp = (e) => {
    if (dragRef.current?.id !== e.pointerId) return
    const finalRotation = toContinuousRotation(dragRef.current.rotation, angleAt(e))
    const target = snapTarget(finalRotation, COMPASS_ITEMS)
    dragRef.current = null
    e.currentTarget.releasePointerCapture(e.pointerId)
    if (!target) return
    setRotation(target.angle)
    selectWallpaper(target.index, { close: false })
  }

  return (
    <section className="relative h-dvh w-screen overflow-hidden">
      <div ref={frameRef} className="relative z-10 h-dvh w-screen overflow-hidden bg-void-950">
        {/* 当前壁纸 */}
        <div ref={sceneRef} className="absolute inset-0">
          <WallpaperScene wallpaper={getWallpaper(current)} />
        </div>

        {/* 转场中的上一张 */}
        {isTransitioning ? (
          <div ref={prevLayerRef} className="pointer-events-none absolute inset-0 z-30">
            <WallpaperScene wallpaper={getWallpaper(previous)} />
          </div>
        ) : null}

        {/* 扫过的光带 */}
        <div
          ref={washRef}
          className="pointer-events-none absolute inset-y-0 left-1/2 z-[35] hidden w-[42vw] -translate-x-1/2 bg-[linear-gradient(90deg,transparent,rgba(255,255,255,0.1),rgba(190,220,255,0.12),rgba(255,255,255,0.08),transparent)] opacity-0 blur-2xl mix-blend-screen md:block"
        />

        <Petals className="z-[36]" />

        <HeroWordmark
          wallpaper={getWallpaper(current)}
          className="right-6 top-24 md:right-14 md:top-32"
        />

        {/* 个人名片卡（融合自参考站 rainzt.cn）
            z-50 而不是 z-40：下面那层主文案是 absolute inset-0 z-40，铺满全屏且在 DOM 里更靠后，
            同 z 值时它盖在名片卡上面，把卡里所有按钮的点击全吞掉（命中测试实测 reachable=false）。
            名片卡本来就是要浮在主文案之上的，所以给它更高的 z。 */}
        <div className="absolute right-6 top-1/2 z-50 hidden -translate-y-1/2 lg:block xl:right-14">
          <HeroProfileCard />
        </div>

        {/* 主文案 */}
        <div className="absolute inset-0 z-40 flex flex-col justify-between px-6 pb-10 pt-28 md:px-14 md:pb-14">
          <div className="flex-1" />

          <div>
            <h1 className="text-[clamp(3.4rem,12vw,11rem)] font-extrabold leading-[0.88] tracking-tightest text-white">
              WELCOME
            </h1>
            <p className="mt-4 text-sm font-light text-white/70 md:text-base">
              This is only the beginning
            </p>
            <a
              href="#about"
              className="mt-8 inline-flex items-center gap-2 rounded-full bg-neon-lime px-7 py-3 text-[11px] font-bold uppercase tracking-[0.22em] text-void-950 transition-all duration-500 ease-expo-out hover:shadow-glow-lime"
            >
              Explore
              <ArrowUpRight className="h-3.5 w-3.5" />
            </a>
          </div>

          <div className="mt-12 flex items-center gap-6">
            <span className="font-mono text-[10px] uppercase tracking-[0.34em] text-white/35">
              scroll ↓
            </span>
          </div>
        </div>
      </div>

      {/* ── 指南针壁纸选择器 ── */}
      {selectorOpen ? (
        <div
          className="absolute inset-0 z-50 hidden overflow-hidden px-8 py-20 backdrop-blur-xl md:block"
          style={{ background: `linear-gradient(135deg, rgba(8, 11, 22, 0.84), ${theme.overlay})` }}
        >
          <WallpaperScene wallpaper={pointed} className="scale-110 opacity-40 blur-2xl saturate-150" />
          <div
            className="pointer-events-none absolute inset-0"
            style={{
              background:
                'radial-gradient(circle at 50% 48%, transparent 0 15rem, rgba(8,15,26,0.1) 27rem, rgba(6,8,18,0.72) 100%)',
            }}
          />

          <button
            type="button"
            aria-label="关闭壁纸选择器"
            className="absolute inset-0 cursor-default"
            onClick={() => setSelectorOpen(false)}
          />

          <div className="pointer-events-none relative z-10 mx-auto h-full max-w-7xl">
            <p className="absolute left-0 top-0 font-mono text-[10px] uppercase tracking-[0.45em] text-white/55">
              Choose Cover
            </p>

            {/* 同心环 / 十字轴 */}
            {[42, 35].map((size) => (
              <div
                key={size}
                className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full border"
                style={{
                  width: `min(${size + 24}vh, ${size}rem)`,
                  height: `min(${size + 24}vh, ${size}rem)`,
                  borderColor: theme.line,
                  opacity: 0.6,
                }}
              />
            ))}
            <div
              className="absolute left-1/2 top-1/2 h-px w-[78%] -translate-x-1/2"
              style={{
                backgroundImage: `linear-gradient(90deg, transparent, ${theme.line}, transparent)`,
              }}
            />
            <div
              className="absolute left-1/2 top-1/2 h-[78%] w-px -translate-y-1/2"
              style={{
                backgroundImage: `linear-gradient(180deg, transparent, ${theme.line}, transparent)`,
              }}
            />

            {/* 罗盘 */}
            <div
              ref={compassRef}
              onPointerDown={onPointerDown}
              onPointerMove={onPointerMove}
              onPointerUp={onPointerUp}
              onPointerCancel={onPointerUp}
              className="pointer-events-auto absolute left-1/2 top-1/2 z-20 flex size-72 cursor-grab touch-none select-none items-center justify-center rounded-full border active:cursor-grabbing"
              style={{
                borderColor: theme.line,
                background: `radial-gradient(circle, rgba(255,255,255,0.10), ${theme.soft} 46%, rgba(8,12,24,0.72) 74%)`,
                boxShadow: `0 28px 110px ${theme.glow}`,
                transform: 'translate(-50%, -50%)',
              }}
            >
              <div className="absolute inset-4 rounded-full border" style={{ borderColor: theme.line }}>
                {Array.from({ length: COMPASS_TICKS }).map((_, tick) => (
                  <span
                    key={tick}
                    className={`absolute left-1/2 top-1/2 block -translate-x-1/2 ${
                      tick % 4 === 0 ? 'h-5 w-px' : 'h-2.5 w-px opacity-55'
                    }`}
                    style={{
                      backgroundColor: theme.accent,
                      transform: `translateX(-50%) rotate(${tick * (360 / COMPASS_TICKS)}deg) translateY(-124px)`,
                    }}
                  />
                ))}
              </div>

              {/* 中心头像位 —— 用站点标记代替真人头像 */}
              <div
                className="absolute inset-12 overflow-hidden rounded-full border"
                style={{ borderColor: theme.line, background: 'rgba(6,9,18,0.85)' }}
              >
                <div className="grid h-full w-full place-items-center">
                  <span className="neon-text font-mono text-4xl font-bold" style={{ color: theme.accent }}>
                    牧
                  </span>
                </div>
              </div>

              {/* 指针 */}
              <div
                className="pointer-events-none absolute inset-0 transition-transform duration-200 ease-out"
                style={{ transform: `rotate(${rotation}deg)` }}
              >
                <div
                  className="absolute left-1/2 top-5 h-[7.6rem] w-1 -translate-x-1/2 rounded-full"
                  style={{
                    background: `linear-gradient(180deg, ${theme.accent}, rgba(255,255,255,0.4) 56%, transparent)`,
                    boxShadow: `0 0 26px ${theme.glow}`,
                  }}
                />
                <div
                  className="absolute left-1/2 top-3 -translate-x-1/2"
                  style={{
                    borderLeft: '0.85rem solid transparent',
                    borderRight: '0.85rem solid transparent',
                    borderBottom: `4.9rem solid ${theme.accent}`,
                  }}
                />
              </div>
            </div>

            {/* 四张封面卡 */}
            {ALL_COVERS.map((wp) => {
              const isPointed = wp.index === pointedIndex
              return (
                <button
                  key={wp.index}
                  type="button"
                  onClick={() => {
                    setRotation(wp.angle)
                    selectWallpaper(wp.index, { close: false })
                  }}
                  className={`pointer-events-auto absolute z-20 overflow-hidden rounded-lg border text-left transition-all duration-500 ease-expo-out ${COMPASS_CARD_POSITIONS[wp.index]}`}
                  style={{
                    width: 'clamp(150px, 13.5vw, 234px)',
                    aspectRatio: '16 / 9',
                    borderColor: isPointed ? theme.accent : 'rgba(255,255,255,0.14)',
                    boxShadow: isPointed
                      ? `0 18px 60px ${theme.glow}`
                      : '0 12px 40px rgba(0,0,0,0.5)',
                    transform: isPointed ? 'scale(1.04)' : 'scale(1)',
                  }}
                >
                  <WallpaperScene wallpaper={wp} />
                  <span className="absolute inset-x-0 bottom-0 flex items-center justify-between bg-gradient-to-t from-black/80 to-transparent px-3 py-2">
                    <span className="text-xs font-semibold text-white">{wp.name}</span>
                    <span className="font-mono text-[10px] uppercase tracking-[0.24em] text-white/60">
                      {wp.direction}
                    </span>
                  </span>
                </button>
              )
            })}

            {/* 诗句 */}
            <div className="absolute bottom-2 left-0 max-w-[30rem]">
              <p
                className="font-mono text-[10px] uppercase tracking-[0.48em]"
                style={{ color: theme.accent }}
              >
                锦瑟 0{pointedIndex}
              </p>
              <div className="mt-4 space-y-1 font-serif text-[clamp(1.9rem,2.8vw,3.4rem)] font-semibold leading-[1.12] tracking-[0.06em]">
                {pointed.poem.map((line) => (
                  <p
                    key={line}
                    className="bg-clip-text text-transparent"
                    style={{
                      backgroundImage: `linear-gradient(115deg, rgba(255,255,255,0.94), ${theme.accent} 48%, rgba(255,255,255,0.6))`,
                      textShadow: `0 0 22px ${theme.glow}`,
                    }}
                  >
                    {line}
                  </p>
                ))}
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </section>
  )
}
