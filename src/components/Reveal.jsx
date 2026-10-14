import { useEffect, useRef, useState } from 'react'

/** Fades + slides its content in the first time it scrolls into view. */
export default function Reveal({ as: Tag = 'div', delay = 0, className = '', style, children, ...rest }) {
  const ref = useRef(null)
  const [shown, setShown] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setShown(true)
          io.disconnect()
        }
      },
      { threshold: 0.12 },
    )
    io.observe(el)
    return () => io.disconnect()
  }, [])

  return (
    <Tag
      ref={ref}
      className={`rv ${shown ? 'in' : ''} ${className}`}
      style={{ transitionDelay: `${delay}ms`, ...style }}
      {...rest}
    >
      {children}
    </Tag>
  )
}
