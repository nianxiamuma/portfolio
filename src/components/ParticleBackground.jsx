import { useEffect, useRef } from 'react'

const PALETTE = [
  [125, 211, 252], // ice-400
  [99, 102, 241], // indigo-500
  [34, 211, 238], // cyan-400
]

const rand = (a, b) => a + Math.random() * (b - a)

/**
 * 轻量 canvas 粒子场：冷色微粒 + 邻近连线 + 指针视差。
 * 不依赖任何第三方粒子库，尺寸随容器自适应，尊重 prefers-reduced-motion。
 */
export default function ParticleBackground({ className = '', density = 1, interactive = true }) {
  const canvasRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return undefined
    const ctx = canvas.getContext('2d', { alpha: true })
    if (!ctx) return undefined

    const reduce =
      typeof window.matchMedia === 'function' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches

    let width = 0
    let height = 0
    let particles = []
    let raf = 0
    let t = 0
    const pointer = { x: 0.5, y: 0.5 }

    const build = () => {
      const count = Math.round(Math.min(110, Math.max(40, (width * height) / 26000)))
      particles = Array.from({ length: Math.round(count * density) }, () => ({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: rand(-0.16, 0.16),
        vy: rand(-0.16, 0.16),
        r: rand(0.7, 2.2),
        base: rand(0.24, 0.72),
        phase: Math.random() * Math.PI * 2,
        speed: rand(0.4, 1.1),
        c: PALETTE[Math.floor(Math.random() * PALETTE.length)],
      }))
    }

    const resize = () => {
      const rect = canvas.getBoundingClientRect()
      const dpr = Math.min(window.devicePixelRatio || 1, 2)
      width = Math.max(1, rect.width)
      height = Math.max(1, rect.height)
      canvas.width = Math.floor(width * dpr)
      canvas.height = Math.floor(height * dpr)
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      build()
    }

    const draw = () => {
      t += 0.016
      ctx.clearRect(0, 0, width, height)

      const ox = (pointer.x - 0.5) * 18
      const oy = (pointer.y - 0.5) * 18

      const linkDist = Math.min(160, Math.max(90, width / 12))
      const limit = linkDist * linkDist

      for (let i = 0; i < particles.length; i += 1) {
        const a = particles[i]
        for (let j = i + 1; j < particles.length; j += 1) {
          const b = particles[j]
          const dx = a.x - b.x
          const dy = a.y - b.y
          const d2 = dx * dx + dy * dy
          if (d2 > limit) continue
          const alpha = (1 - Math.sqrt(d2) / linkDist) * 0.13
          ctx.strokeStyle = `rgba(125,211,252,${alpha})`
          ctx.lineWidth = 0.6
          ctx.beginPath()
          ctx.moveTo(a.x + ox, a.y + oy)
          ctx.lineTo(b.x + ox, b.y + oy)
          ctx.stroke()
        }
      }

      for (let i = 0; i < particles.length; i += 1) {
        const p = particles[i]
        if (!reduce) {
          p.x += p.vx
          p.y += p.vy
          if (p.x < -20) p.x = width + 20
          if (p.x > width + 20) p.x = -20
          if (p.y < -20) p.y = height + 20
          if (p.y > height + 20) p.y = -20
        }
        const twinkle = 0.6 + 0.4 * Math.sin(t * p.speed + p.phase)
        const [r, g, b] = p.c
        ctx.beginPath()
        ctx.arc(p.x + ox, p.y + oy, p.r, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(${r},${g},${b},${p.base * twinkle})`
        ctx.fill()
      }

      raf = requestAnimationFrame(draw)
    }

    const onPointer = (e) => {
      pointer.x = e.clientX / window.innerWidth
      pointer.y = e.clientY / window.innerHeight
    }

    resize()
    draw()

    const ro = new ResizeObserver(resize)
    ro.observe(canvas)
    if (interactive) window.addEventListener('pointermove', onPointer, { passive: true })

    return () => {
      cancelAnimationFrame(raf)
      ro.disconnect()
      if (interactive) window.removeEventListener('pointermove', onPointer)
    }
  }, [density, interactive])

  return <canvas ref={canvasRef} aria-hidden className={className} />
}
