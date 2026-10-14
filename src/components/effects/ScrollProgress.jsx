import { useEffect, useRef } from 'react'

export default function ScrollProgress() {
  const bar = useRef(null)

  useEffect(() => {
    const onScroll = () => {
      const h = document.documentElement
      const max = h.scrollHeight - h.clientHeight
      if (bar.current) bar.current.style.width = (max > 0 ? (h.scrollTop / max) * 100 : 0) + '%'
    }
    onScroll()
    addEventListener('scroll', onScroll, { passive: true })
    return () => removeEventListener('scroll', onScroll)
  }, [])

  return <div ref={bar} className="fixed top-0 left-0 h-1 bg-brick z-50 w-0" aria-hidden="true" />
}
