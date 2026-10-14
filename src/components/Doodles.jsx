import { useState } from 'react'

const ICONS = {
  book: (<><path d="M4 5a2 2 0 0 1 2-2h13v16H6a2 2 0 0 0-2 2z" /><path d="M4 5v16M8 7h7" /></>),
  pencil: (<><path d="M4 20l1-5L16 4l4 4L9 19z" /><path d="M14 6l4 4" /></>),
  pen: (<><path d="M12 3l5 6-2 8-3 4-3-4-2-8z" /><path d="M12 12v4" /></>),
  ruler: (<><rect x="2" y="8" width="20" height="8" rx="1" /><path d="M6 8v3M10 8v4M14 8v3M18 8v4" /></>),
  cap: (<><path d="M2 9l10-5 10 5-10 5z" /><path d="M6 11v5c0 1.5 3 3 6 3s6-1.5 6-3v-5M22 9v6" /></>),
  star: <path d="M12 3l2.7 5.6 6.1.9-4.4 4.3 1 6.1L12 17l-5.4 2.9 1-6.1L3.2 9.5l6.1-.9z" />,
  flask: <path d="M9 3h6M10 3v6l-5 9a2 2 0 0 0 2 3h10a2 2 0 0 0 2-3l-5-9V3" />,
  bulb: <path d="M9 18h6M10 21h4M12 3a6 6 0 0 0-4 10c1 1 1 2 1 3h6c0-1 0-2 1-3a6 6 0 0 0-4-10z" />,
  abc: <text x="1" y="16" fontSize="10" fontWeight="700" fill="currentColor" stroke="none">ABC</text>,
}
const KEYS = Object.keys(ICONS)

/** Floating school doodles (book, pencil, ruler, cap…). Positions are random but fixed per mount. */
export default function Doodles({ count = 27 }) {
  const [items] = useState(() =>
    Array.from({ length: count }, (_, i) => ({
      key: KEYS[i % KEYS.length],
      size: 30 + Math.random() * 40,
      left: Math.random() * 94,
      top: Math.random() * 90,
      rot: Math.random() * 60 - 30,
      dur: 6 + Math.random() * 7,
      delay: Math.random() * 8,
    })),
  )

  return items.map((d, i) => (
    <span
      key={i}
      className="dd"
      style={{
        left: `${d.left}%`,
        top: `${d.top}%`,
        width: d.size,
        height: d.size,
        '--r': `${d.rot}deg`,
        animationDuration: `${d.dur}s`,
        animationDelay: `-${d.delay}s`,
      }}
    >
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" className="w-full h-full">
        {ICONS[d.key]}
      </svg>
    </span>
  ))
}
