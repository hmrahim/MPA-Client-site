import React, { useEffect, useState, useMemo } from 'react'
import { Trash2, AlertTriangle, X } from 'lucide-react'

// Dramatic warning sound effect
const playWarningSound = () => {
  try {
    const AudioContext = window.AudioContext || window.webkitAudioContext
    if (!AudioContext) return
    const ctx = new AudioContext()
    const now = ctx.currentTime

    // Descending warning tones
    const notes = [
      { freq: 392.0, time: 0.0 },
      { freq: 329.63, time: 0.12 },
      { freq: 261.63, time: 0.24 },
    ]

    notes.forEach(({ freq, time }) => {
      const osc = ctx.createOscillator()
      const gain = ctx.createGain()
      osc.type = 'triangle'
      osc.frequency.setValueAtTime(freq, now + time)

      gain.gain.setValueAtTime(0.0001, now + time)
      gain.gain.exponentialRampToValueAtTime(0.12, now + time + 0.04)
      gain.gain.exponentialRampToValueAtTime(0.0001, now + time + 0.45)

      osc.connect(gain)
      gain.connect(ctx.destination)
      osc.start(now + time)
      osc.stop(now + time + 0.5)
    })
  } catch {
    // Silently fail
  }
}

export default function FacilityDeleteAlert({
  facility,
  onConfirm,
  onCancel,
  deleting = false,
}) {
  const [mounted, setMounted] = useState(false)
  const [shaking, setShaking] = useState(false)

  useEffect(() => {
    playWarningSound()
    requestAnimationFrame(() => setMounted(true))
  }, [])

  // Shake effect on mount
  useEffect(() => {
    const t = setTimeout(() => setShaking(true), 150)
    const t2 = setTimeout(() => setShaking(false), 750)
    return () => {
      clearTimeout(t)
      clearTimeout(t2)
    }
  }, [])

  // Close on Escape key
  useEffect(() => {
    const handleKey = (e) => {
      if (e.key === 'Escape' && !deleting) onCancel?.()
    }
    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [onCancel, deleting])

  // Floating danger particles
  const particles = useMemo(() => {
    return Array.from({ length: 20 }).map((_, i) => ({
      id: i,
      left: Math.random() * 100,
      size: Math.random() * 4 + 2,
      delay: Math.random() * 3,
      duration: Math.random() * 4 + 4,
      opacity: Math.random() * 0.3 + 0.1,
    }))
  }, [])

  if (!facility) return null

  const facilityTitle = facility.title || facility.titleBn || 'Untitled Facility'
  const facilityTitleBn = facility.titleBn || ''
  const facilityDesc = facility.desc || facility.descBn || ''
  const facilityMetric = facility.metric || facility.metricBn || ''

  return (
    <div
      className={`fixed inset-0 z-[70] flex items-center justify-center p-4 sm:p-6 transition-opacity duration-300 ${
        mounted ? 'opacity-100' : 'opacity-0'
      }`}
      role="dialog"
      aria-modal="true"
      aria-label="Delete facility confirmation"
    >
      {/* Backdrop with dark dramatic overlay */}
      <div
        className="fixed inset-0 bg-black/80 backdrop-blur-md transition-all duration-500"
        onClick={() => {
          if (!deleting) onCancel?.()
        }}
      />

      {/* Floating danger particles */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-10">
        {particles.map((p) => (
          <span
            key={p.id}
            className="absolute rounded-full"
            style={{
              left: `${p.left}%`,
              bottom: '-10px',
              width: `${p.size}px`,
              height: `${p.size}px`,
              backgroundColor: '#ef4444',
              opacity: p.opacity,
              animation: `floatUpDelete ${p.duration}s ease-in ${p.delay}s infinite`,
            }}
          />
        ))}
      </div>

      {/* Main Card */}
      <div
        className={`relative z-20 w-full max-w-md rounded-2xl overflow-hidden transition-all duration-500 ${
          mounted ? 'scale-100 translate-y-0' : 'scale-90 translate-y-8'
        } ${shaking ? 'animate-shakeDelete' : ''}`}
        style={{
          background: 'linear-gradient(180deg, #1a1020 0%, #140a0a 50%, #0d0607 100%)',
          boxShadow:
            '0 0 80px rgba(239, 68, 68, 0.15), 0 0 200px rgba(239, 68, 68, 0.05), 0 25px 50px rgba(0,0,0,0.5)',
        }}
      >
        {/* Top danger gradient strip */}
        <div className="h-1 w-full bg-gradient-to-r from-red-600 via-rose-500 to-red-600" />

        {/* Close button */}
        <button
          onClick={onCancel}
          disabled={deleting}
          className="absolute top-4 right-4 z-30 p-1.5 rounded-full bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition-all duration-200 hover:rotate-90 disabled:opacity-30 cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Content */}
        <div className="px-6 pt-6 pb-7">
          {/* Warning Icon with glow */}
          <div className="flex justify-center mb-5">
            <div className="relative">
              {/* Glow ring */}
              <div
                className="absolute inset-0 rounded-full animate-pulse"
                style={{
                  background: 'radial-gradient(circle, rgba(239,68,68,0.3) 0%, transparent 70%)',
                  transform: 'scale(2.5)',
                }}
              />
              <div
                className="relative p-4 rounded-full border-2 border-red-500/30"
                style={{
                  background:
                    'linear-gradient(135deg, rgba(239,68,68,0.2) 0%, rgba(185,28,28,0.1) 100%)',
                }}
              >
                <Trash2 className="w-8 h-8 text-red-400" strokeWidth={1.5} />
              </div>
            </div>
          </div>

          {/* Title */}
          <h2 className="text-center text-xl font-extrabold text-white mb-1.5 tracking-tight">
            Delete Facility Card?
          </h2>
          <p className="text-center text-sm text-slate-400 mb-5 leading-relaxed">
            This action is <span className="text-red-400 font-semibold">permanent</span> and will remove this facility from the campus infrastructure section.
          </p>

          {/* Facility Preview Card */}
          <div
            className="rounded-xl border border-red-500/20 overflow-hidden mb-5"
            style={{
              background: 'linear-gradient(135deg, rgba(239,68,68,0.08) 0%, rgba(0,0,0,0.4) 100%)',
            }}
          >
            <div className="flex items-start gap-3.5 p-3.5">
              {/* Emoji Icon Badge */}
              <div className="flex-shrink-0 w-14 h-14 rounded-xl bg-slate-900/90 border border-red-500/30 flex items-center justify-center text-3xl shadow-inner">
                {facility.icon || '🏢'}
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <p className="text-sm font-extrabold text-white truncate">{facilityTitle}</p>
                {facilityTitleBn && (
                  <p className="text-xs text-slate-400 truncate mt-0.5">{facilityTitleBn}</p>
                )}
                {facilityDesc && (
                  <p className="text-[11px] text-slate-400/80 line-clamp-1 mt-1">{facilityDesc}</p>
                )}

                <div className="flex items-center gap-2 mt-2">
                  <span
                    className={`inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-md ${
                      facility.isActive !== false
                        ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/20'
                        : 'bg-slate-500/15 text-slate-400 border border-slate-500/20'
                    }`}
                  >
                    {facility.isActive !== false ? '● Active' : '○ Hidden'}
                  </span>

                  {facilityMetric && (
                    <span className="text-[10px] text-indigo-300 font-medium px-2 py-0.5 rounded bg-indigo-500/10 border border-indigo-500/20">
                      {facilityMetric}
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Warning info box */}
          <div
            className="flex items-start gap-2.5 px-3.5 py-3 rounded-xl mb-6 border border-amber-500/20"
            style={{
              background: 'linear-gradient(135deg, rgba(245,158,11,0.08) 0%, rgba(0,0,0,0.2) 100%)',
            }}
          >
            <AlertTriangle className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />
            <div className="text-xs text-amber-200/80 leading-relaxed">
              <span className="font-semibold text-amber-300">Warning:</span> Removing this facility will immediately update the live homepage and remove its card from the campus infrastructure grid.
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-3">
            <button
              onClick={onCancel}
              disabled={deleting}
              className="flex-1 py-3 px-4 rounded-xl border border-slate-700 bg-slate-800 hover:bg-slate-700 text-slate-200 text-sm font-semibold transition cursor-pointer disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              onClick={onConfirm}
              disabled={deleting}
              className="flex-1 py-3 px-4 rounded-xl bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white text-sm font-bold shadow-lg shadow-red-600/30 transition cursor-pointer disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {deleting ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Deleting...</span>
                </>
              ) : (
                <>
                  <Trash2 className="w-4 h-4" />
                  <span>Yes, Delete</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
