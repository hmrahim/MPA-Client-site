import { useEffect, useRef } from 'react'

const COLORS = ['#ff4d7a', '#ffc233', '#22d3a6', '#5b3df5', '#0ea5e9']

/** Confetti burst on load and whenever a bold button/link is clicked. */
export default function Confetti() {
  const canvas = useRef(null)

  useEffect(() => {
    const cv = canvas.current
    const cx = cv.getContext('2d')
    let particles = []
    let running = false
    let raf

    const fit = () => {
      cv.width = innerWidth
      cv.height = innerHeight
    }
    fit()

    const loop = () => {
      cx.clearRect(0, 0, cv.width, cv.height)
      particles = particles.filter((p) => p.l > 0)
      particles.forEach((p) => {
        p.vy += 0.35
        p.x += p.vx
        p.y += p.vy
        p.a += 0.2
        p.l -= 0.012
        cx.globalAlpha = Math.max(p.l, 0)
        cx.fillStyle = p.c
        cx.save()
        cx.translate(p.x, p.y)
        cx.rotate(p.a)
        cx.fillRect(-p.r, -p.r / 2, p.r * 2, p.r)
        cx.restore()
      })
      if (particles.length) raf = requestAnimationFrame(loop)
      else {
        running = false
        cx.clearRect(0, 0, cv.width, cv.height)
      }
    }

    const boom = (x, y) => {
      if (matchMedia('(prefers-reduced-motion: reduce)').matches) return
      for (let i = 0; i < 70; i++) {
        particles.push({
          x, y,
          vx: (Math.random() - 0.5) * 13,
          vy: Math.random() * -13 - 2,
          r: Math.random() * 6 + 3,
          c: COLORS[i % 5],
          a: Math.random() * 6,
          l: 1,
        })
      }
      if (!running) {
        running = true
        loop()
      }
    }

    const onClick = (e) => {
      if (e.target instanceof Element && e.target.closest('a.font-bold,button.font-bold')) boom(e.clientX, e.clientY)
    }

    const first = setTimeout(() => boom(innerWidth / 2, 180), 700)
    addEventListener('resize', fit)
    document.addEventListener('click', onClick)
    return () => {
      clearTimeout(first)
      cancelAnimationFrame(raf)
      removeEventListener('resize', fit)
      document.removeEventListener('click', onClick)
    }
  }, [])

  return <canvas ref={canvas} className="fixed inset-0 pointer-events-none z-[60]" aria-hidden="true" />
}
