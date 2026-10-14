import { useEffect, useRef } from 'react'

/**
 * Soft glow that follows the cursor + 3D tilt on any element marked with `data-tilt`.
 */
export default function CursorGlow() {
  const glow = useRef(null)

  useEffect(() => {
    let last = null

    const onMove = (e) => {
      if (glow.current) glow.current.style.transform = `translate(${e.clientX - 200}px,${e.clientY - 200}px)`

      const card = e.target instanceof Element ? e.target.closest('[data-tilt]') : null
      if (last && last !== card) last.style.transform = ''
      if (card) {
        const r = card.getBoundingClientRect()
        const x = (e.clientX - r.left) / r.width - 0.5
        const y = (e.clientY - r.top) / r.height - 0.5
        card.style.transform = `perspective(700px) rotateY(${x * 14}deg) rotateX(${-y * 14}deg) translateY(-6px) scale(1.03)`
      }
      last = card
    }
    const reset = () => {
      if (last) last.style.transform = ''
      last = null
    }

    addEventListener('mousemove', onMove, { passive: true })
    document.addEventListener('mouseleave', reset)
    return () => {
      removeEventListener('mousemove', onMove)
      document.removeEventListener('mouseleave', reset)
    }
  }, [])

  return (
    <div
      ref={glow}
      className="glow fixed top-0 left-0 w-[400px] h-[400px] rounded-full pointer-events-none z-0"
      style={{ background: 'radial-gradient(circle,rgba(91,61,245,.16),transparent 65%)' }}
      aria-hidden="true"
    />
  )
}
