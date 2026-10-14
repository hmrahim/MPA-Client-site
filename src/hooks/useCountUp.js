import { useEffect, useState } from 'react'

const reduced = () => typeof matchMedia !== 'undefined' && matchMedia('(prefers-reduced-motion: reduce)').matches

/** Counts up to a display string like "1,200+", "98%" or "2005". */
export default function useCountUp(value, duration = 1600) {
  const target = parseInt(value.replace(/\D/g, ''), 10)
  const comma = value.includes(',')
  const suffix = value.replace(/[\d,]/g, '')
  const [n, setN] = useState(reduced() ? target : 0)

  useEffect(() => {
    if (reduced()) return
    let raf
    const t0 = performance.now()
    const tick = (now) => {
      const p = Math.min((now - t0) / duration, 1)
      setN(Math.round(target * (1 - Math.pow(1 - p, 3))))
      if (p < 1) raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [target, duration])

  return (comma ? n.toLocaleString('en-US') : n) + suffix
}
