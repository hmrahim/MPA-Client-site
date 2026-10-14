import { useMemo, useState, useEffect } from 'react'

// Rich collection of realistic school elements, formulas, Bangla/English alphabets, and academic instruments
const schoolElements = [
  // General School Math & Science Formulas
  { id: 'f1', type: 'formula', text: '(a + b)² = a² + 2ab + b²', color: 'text-iris', size: 'text-sm sm:text-base font-bold' },
  { id: 'f2', type: 'formula', text: 'E = mc²', color: 'text-amber-500', size: 'text-base sm:text-lg font-black' },
  { id: 'f3', type: 'formula', text: 'sin²θ + cos²θ = 1', color: 'text-mint', size: 'text-xs sm:text-sm font-bold' },
  { id: 'f4', type: 'formula', text: 'π ≈ 3.14159', color: 'text-purple-600', size: 'text-base font-bold' },
  { id: 'f5', type: 'formula', text: 'F = m · a', color: 'text-brick', size: 'text-sm sm:text-base font-bold' },
  { id: 'f6', type: 'formula', text: 'H₂O + CO₂', color: 'text-cyan-600', size: 'text-sm font-semibold' },
  { id: 'f7', type: 'formula', text: '√144 = 12', color: 'text-emerald-600', size: 'text-sm font-bold' },
  { id: 'f8', type: 'formula', text: 'V = I · R', color: 'text-rose-500', size: 'text-xs sm:text-sm font-bold' },
  { id: 'f9', type: 'formula', text: 'a² + b² = c²', color: 'text-blue-600', size: 'text-sm font-bold' },
  { id: 'f10', type: 'formula', text: 'x = (-b ± √D) / 2a', color: 'text-indigo-500', size: 'text-xs font-mono font-bold' },

  // Bengali & English School Letters
  { id: 'l1', type: 'letter', text: 'অ', color: 'text-brick', size: 'text-2xl sm:text-3xl font-black' },
  { id: 'l2', type: 'letter', text: 'আ', color: 'text-iris', size: 'text-2xl sm:text-3xl font-black' },
  { id: 'l3', type: 'letter', text: 'ক', color: 'text-emerald-600', size: 'text-2xl sm:text-3xl font-black' },
  { id: 'l4', type: 'letter', text: 'খ', color: 'text-amber-500', size: 'text-2xl sm:text-3xl font-black' },
  { id: 'l5', type: 'letter', text: 'A B C', color: 'text-indigo-600', size: 'text-base font-extrabold tracking-widest' },
  { id: 'l6', type: 'letter', text: '1 2 3', color: 'text-pink-600', size: 'text-base font-extrabold tracking-widest' },
  { id: 'l7', type: 'letter', text: 'GPA 5.00', color: 'text-gold font-black', size: 'text-xs sm:text-sm font-black' },

  // School Objects & Stationery Emojis / Glyphs
  { id: 'e1', type: 'object', char: '📚', label: 'Books', size: 'text-3xl sm:text-4xl' },
  { id: 'e2', type: 'object', char: '✏️', label: 'Pencil', size: 'text-2xl sm:text-3xl' },
  { id: 'e3', type: 'object', char: '📐', label: 'Ruler & Triangle', size: 'text-3xl' },
  { id: 'e4', type: 'object', char: '🎓', label: 'Graduation Cap', size: 'text-3xl sm:text-4xl' },
  { id: 'e5', type: 'object', char: '🎒', label: 'School Bag', size: 'text-3xl' },
  { id: 'e6', type: 'object', char: '🔔', label: 'School Bell', size: 'text-2xl sm:text-3xl' },
  { id: 'e7', type: 'object', char: '🔬', label: 'Microscope', size: 'text-3xl' },
  { id: 'e8', type: 'object', char: '🧪', label: 'Chemistry Flask', size: 'text-2xl sm:text-3xl' },
  { id: 'e9', type: 'object', char: '🌍', label: 'Earth Globe', size: 'text-3xl' },
  { id: 'e10', type: 'object', char: '📝', label: 'Exam Paper', size: 'text-2xl sm:text-3xl' },
  { id: 'e11', type: 'object', char: '⭐', label: 'Merit Star', size: 'text-2xl text-gold' },
  { id: 'e12', type: 'object', char: '🏆', label: 'Trophy', size: 'text-3xl text-amber-500' },
  { id: 'e13', type: 'object', char: '⚛️', label: 'Science Atom', size: 'text-3xl text-cyan-600' },
  { id: 'e14', type: 'object', char: '🎨', label: 'Art Palette', size: 'text-2xl' },
  { id: 'e15', type: 'object', char: '⚽', label: 'Sports Football', size: 'text-2xl' },
  { id: 'e16', type: 'object', char: '🧭', label: 'Geometry Compass', size: 'text-2xl' },
]

export default function SchoolBackgroundAnimation() {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 })

  // Subtle interactive parallax mouse tracking
  useEffect(() => {
    const handleMouseMove = (e) => {
      const x = (e.clientX / window.innerWidth - 0.5) * 16
      const y = (e.clientY / window.innerHeight - 0.5) * 16
      setMousePos({ x, y })
    }
    window.addEventListener('mousemove', handleMouseMove, { passive: true })
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [])

  // Position items nicely spread across screen coordinates
  const items = useMemo(() => {
    return schoolElements.map((item, idx) => {
      const top = (idx * 6.1 + 3) % 92
      const left = ((idx * 16.3 + 4) % 91) + 2
      const duration = 16 + (idx % 8) * 3 // 16s to 37s smooth float
      const delay = (idx % 6) * -3.2
      const rotate = ((idx * 43) % 50) - 25
      const depthFactor = 0.5 + (idx % 5) * 0.2 // depth for parallax

      return {
        ...item,
        style: {
          top: `${top}%`,
          left: `${left}%`,
          animation: `floatSchoolDoodle ${duration}s ease-in-out infinite`,
          animationDelay: `${delay}s`,
          transform: `rotate(${rotate}deg)`,
        },
        depth: depthFactor,
      }
    })
  }, [])

  // Generate glowing chalk dust particles
  const dustParticles = useMemo(() => {
    return Array.from({ length: 18 }).map((_, i) => ({
      id: i,
      top: `${(i * 13 + 5) % 95}%`,
      left: `${(i * 21 + 7) % 94}%`,
      size: `${3 + (i % 4) * 2}px`,
      duration: `${10 + (i % 6) * 4}s`,
      delay: `${(i % 5) * -2}s`,
    }))
  }, [])

  return (
    <div
      className="fixed inset-0 pointer-events-none -z-10 overflow-hidden select-none"
      aria-hidden="true"
    >
      {/* 1. Luminous Ambient Gradient Aurora Clouds */}
      <div
        className="absolute top-10 left-1/4 w-[550px] h-[550px] bg-gradient-to-tr from-purple-200/20 via-indigo-200/15 to-transparent rounded-full blur-3xl animate-pulse"
        style={{ animationDuration: '9s' }}
      />
      <div
        className="absolute top-1/2 -right-28 w-[600px] h-[600px] bg-gradient-to-bl from-amber-200/25 via-rose-100/20 to-transparent rounded-full blur-3xl animate-pulse"
        style={{ animationDuration: '11s' }}
      />
      <div
        className="absolute -bottom-20 left-10 w-[500px] h-[500px] bg-gradient-to-tr from-cyan-100/25 via-emerald-100/15 to-transparent rounded-full blur-3xl animate-pulse"
        style={{ animationDuration: '13s' }}
      />

      {/* 2. Paper Airplane 1: Gliding across the sky */}
      <div className="paper-airplane-1 absolute opacity-25 text-iris">
        <svg
          className="w-10 h-10 drop-shadow-md"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="m2 12 20-9-9 20-2-8-9-3Z" />
          <path d="M13 15.5V9l-8.5 3" />
        </svg>
      </div>

      {/* Paper Airplane 2: Secondary gentle glider */}
      <div className="paper-airplane-2 absolute opacity-20 text-brick">
        <svg
          className="w-8 h-8 drop-shadow-sm"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="m2 12 20-9-9 20-2-8-9-3Z" />
          <path d="M13 15.5V9l-8.5 3" />
        </svg>
      </div>

      {/* 3. Subtle Geometry & Compass Circle Wireframe */}
      <div className="absolute top-24 right-16 w-72 h-72 rounded-full border border-iris/10 border-dashed animate-spin pointer-events-none" style={{ animationDuration: '90s' }}>
        <div className="absolute inset-4 rounded-full border border-gold/10 border-dotted" />
        <div className="absolute top-1/2 left-0 right-0 h-[1px] bg-iris/10" />
        <div className="absolute top-0 bottom-0 left-1/2 w-[1px] bg-iris/10" />
      </div>

      <div className="absolute bottom-32 left-12 w-64 h-64 rounded-full border border-mint/10 animate-spin pointer-events-none" style={{ animationDuration: '120s' }}>
        <div className="absolute inset-8 rounded-full border border-brick/10 border-dashed" />
      </div>

      {/* 4. Classroom Chalk Dust / Sparkle Particles */}
      {dustParticles.map((p) => (
        <div
          key={p.id}
          className="absolute rounded-full bg-gold/30 blur-[1px] animate-floatDust"
          style={{
            top: p.top,
            left: p.left,
            width: p.size,
            height: p.size,
            animationDuration: p.duration,
            animationDelay: p.delay,
          }}
        />
      ))}

      {/* 5. Floating School Doodles, Bengali/English Alphabets & Formulas */}
      <div
        className="absolute inset-0 transition-transform duration-700 ease-out"
        style={{
          transform: `translate(${mousePos.x}px, ${mousePos.y}px)`,
        }}
      >
        {items.map((it) => (
          <div
            key={it.id}
            style={it.style}
            className="absolute opacity-[0.24] hover:opacity-60 transition-opacity duration-300 transform pointer-events-auto"
            title={it.label || it.text}
          >
            {it.type === 'formula' && (
              <span className={`font-mono ${it.color} ${it.size} select-none drop-shadow-sm tracking-tight bg-white/40 px-2 py-0.5 rounded-lg border border-black/5`}>
                {it.text}
              </span>
            )}

            {it.type === 'letter' && (
              <span className={`font-display ${it.color} ${it.size} select-none drop-shadow-sm`}>
                {it.text}
              </span>
            )}

            {it.type === 'object' && (
              <span className={`${it.size} select-none filter contrast-125 hover:scale-110 transition-transform inline-block`}>
                {it.char}
              </span>
            )}
          </div>
        ))}
      </div>

      {/* Custom Keyframe Animations */}
      <style>{`
        @keyframes floatSchoolDoodle {
          0%, 100% {
            transform: translateY(0px) rotate(0deg) scale(1);
          }
          25% {
            transform: translateY(-22px) translateX(10px) rotate(6deg) scale(1.04);
          }
          50% {
            transform: translateY(-38px) translateX(-8px) rotate(-4deg) scale(0.97);
          }
          75% {
            transform: translateY(-16px) translateX(14px) rotate(8deg) scale(1.02);
          }
        }

        @keyframes paperAirplaneFly1 {
          0% {
            transform: translate(-10vw, 85vh) rotate(24deg) scale(0.8);
            opacity: 0;
          }
          10% {
            opacity: 0.35;
          }
          50% {
            transform: translate(50vw, 45vh) rotate(16deg) scale(1.05);
          }
          90% {
            opacity: 0.35;
          }
          100% {
            transform: translate(110vw, 5vh) rotate(22deg) scale(0.9);
            opacity: 0;
          }
        }

        @keyframes paperAirplaneFly2 {
          0% {
            transform: translate(-10vw, 40vh) rotate(18deg) scale(0.7);
            opacity: 0;
          }
          15% {
            opacity: 0.28;
          }
          50% {
            transform: translate(45vw, 15vh) rotate(12deg) scale(0.95);
          }
          85% {
            opacity: 0.28;
          }
          100% {
            transform: translate(105vw, -10vh) rotate(15deg) scale(0.85);
            opacity: 0;
          }
        }

        @keyframes floatDust {
          0%, 100% {
            transform: translateY(0) translateX(0);
            opacity: 0.2;
          }
          50% {
            transform: translateY(-35px) translateX(15px);
            opacity: 0.6;
          }
        }

        .paper-airplane-1 {
          animation: paperAirplaneFly1 28s cubic-bezier(0.4, 0, 0.2, 1) infinite;
          animation-delay: 2s;
        }

        .paper-airplane-2 {
          animation: paperAirplaneFly2 36s cubic-bezier(0.4, 0, 0.2, 1) infinite;
          animation-delay: 16s;
        }

        .animate-floatDust {
          animation: floatDust ease-in-out infinite;
        }
      `}</style>
    </div>
  )
}
