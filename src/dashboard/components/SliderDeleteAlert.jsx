import React, { useEffect, useState, useMemo, useCallback } from 'react'
import { Trash2, AlertTriangle, X, ShieldAlert, ImageOff } from 'lucide-react'

// Dramatic warning sound effect
const playWarningSound = () => {
  try {
    const AudioContext = window.AudioContext || window.webkitAudioContext
    if (!AudioContext) return
    const ctx = new AudioContext()
    const now = ctx.currentTime

    // Descending warning tones: G4 -> E4 -> C4
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

export default function SliderDeleteAlert({
  slide,
  onConfirm,
  onCancel,
  deleting = false,
}) {
  const [mounted, setMounted] = useState(false)
  const [shaking, setShaking] = useState(false)
  const [holdProgress, setHoldProgress] = useState(0)
  const [holding, setHolding] = useState(false)
  const [imgError, setImgError] = useState(false)

  useEffect(() => {
    playWarningSound()
    // Trigger mount animation
    requestAnimationFrame(() => setMounted(true))
  }, [])

  // Shake effect on mount
  useEffect(() => {
    const t = setTimeout(() => setShaking(true), 150)
    const t2 = setTimeout(() => setShaking(false), 750)
    return () => { clearTimeout(t); clearTimeout(t2) }
  }, [])

  // Close on Escape key
  useEffect(() => {
    const handleKey = (e) => {
      if (e.key === 'Escape') onCancel?.()
    }
    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [onCancel])

  // Hold-to-delete progress
  useEffect(() => {
    if (!holding) {
      setHoldProgress(0)
      return
    }
    const interval = setInterval(() => {
      setHoldProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval)
          onConfirm?.()
          return 100
        }
        return prev + 2.5
      })
    }, 25)
    return () => clearInterval(interval)
  }, [holding, onConfirm])

  // Floating particles
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

  if (!slide) return null

  const slideTitle = slide.title || slide.titleBn || 'Untitled Slide'
  const slideImage = slide.imageUrl || slide.image

  return (
    <div
      className={`fixed inset-0 z-[60] flex items-center justify-center p-4 sm:p-6 transition-opacity duration-300 ${
        mounted ? 'opacity-100' : 'opacity-0'
      }`}
      role="dialog"
      aria-modal="true"
      aria-label="Delete slide confirmation"
    >
      {/* Backdrop with dark dramatic overlay */}
      <div
        className="fixed inset-0 bg-black/80 backdrop-blur-md transition-all duration-500"
        onClick={onCancel}
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
          boxShadow: '0 0 80px rgba(239, 68, 68, 0.15), 0 0 200px rgba(239, 68, 68, 0.05), 0 25px 50px rgba(0,0,0,0.5)',
        }}
      >
        {/* Top danger gradient strip */}
        <div className="h-1 w-full bg-gradient-to-r from-red-600 via-rose-500 to-red-600" />

        {/* Close button */}
        <button
          onClick={onCancel}
          className="absolute top-4 right-4 z-30 p-1.5 rounded-full bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition-all duration-200 hover:rotate-90"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Content */}
        <div className="px-6 pt-6 pb-7">

          {/* Warning Icon with glow */}
          <div className="flex justify-center mb-5">
            <div className="relative">
              {/* Glow ring */}
              <div className="absolute inset-0 rounded-full animate-pulse" style={{
                background: 'radial-gradient(circle, rgba(239,68,68,0.3) 0%, transparent 70%)',
                transform: 'scale(2.5)',
              }} />
              <div className="relative p-4 rounded-full border-2 border-red-500/30" style={{
                background: 'linear-gradient(135deg, rgba(239,68,68,0.2) 0%, rgba(185,28,28,0.1) 100%)',
              }}>
                <Trash2 className="w-8 h-8 text-red-400" strokeWidth={1.5} />
              </div>
            </div>
          </div>

          {/* Title */}
          <h2 className="text-center text-xl font-extrabold text-white mb-1.5 tracking-tight">
            Delete This Slide?
          </h2>
          <p className="text-center text-sm text-slate-400 mb-5 leading-relaxed">
            This action is <span className="text-red-400 font-semibold">permanent</span> and cannot be undone.
          </p>

          {/* Slide Preview Card */}
          <div className="rounded-xl border border-red-500/15 overflow-hidden mb-5" style={{
            background: 'linear-gradient(135deg, rgba(239,68,68,0.05) 0%, rgba(0,0,0,0.3) 100%)',
          }}>
            <div className="flex items-start gap-3 p-3.5">
              {/* Thumbnail */}
              <div className="flex-shrink-0 w-20 h-14 rounded-lg overflow-hidden bg-slate-800/80 border border-white/5">
                {slideImage && !imgError ? (
                  <img
                    src={slideImage}
                    alt={slideTitle}
                    className="w-full h-full object-cover opacity-75"
                    onError={() => setImgError(true)}
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <ImageOff className="w-5 h-5 text-slate-600" />
                  </div>
                )}
              </div>
              {/* Info */}
              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold text-white truncate">{slideTitle}</p>
                {slide.subtitle && (
                  <p className="text-xs text-slate-400 truncate mt-0.5">{slide.subtitle}</p>
                )}
                <div className="flex items-center gap-2 mt-1.5">
                  <span className={`inline-flex items-center gap-1 text-[10px] font-bold px-1.5 py-0.5 rounded-md ${
                    slide.isActive !== false
                      ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/20'
                      : 'bg-slate-500/15 text-slate-400 border border-slate-500/20'
                  }`}>
                    {slide.isActive !== false ? '● Active' : '○ Hidden'}
                  </span>
                  {slide.order && (
                    <span className="text-[10px] text-slate-500 font-medium">
                      Position #{slide.order}
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Warning info box */}
          <div className="flex items-start gap-2.5 px-3.5 py-3 rounded-xl mb-6 border border-amber-500/15" style={{
            background: 'linear-gradient(135deg, rgba(245,158,11,0.08) 0%, rgba(0,0,0,0.2) 100%)',
          }}>
            <AlertTriangle className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />
            <div className="text-xs text-amber-200/70 leading-relaxed">
              <span className="font-semibold text-amber-300">Warning:</span> The slide image and all content data will be permanently removed from the server. Visitors will no longer see this slide on the website.
            </div>
          </div>

            {/* Action Buttons */}
          <div className="flex items-center gap-3">
            {/* Cancel */}
            <button
              type="button"
              onClick={onCancel}
              disabled={deleting}
              className="flex-1 py-3 px-4 rounded-xl text-sm font-bold text-slate-300 transition-all duration-200 border border-white/10 hover:border-white/20 hover:bg-white/5 active:scale-[0.98] disabled:opacity-50 cursor-pointer"
              style={{ background: 'rgba(255,255,255,0.03)' }}
            >
              Cancel
            </button>

            {/* Confirm Delete Button */}
            <button
              type="button"
              onClick={onConfirm}
              disabled={deleting}
              className="relative flex-1 py-3 px-4 rounded-xl text-sm font-bold text-white transition-all duration-200 overflow-hidden active:scale-[0.98] disabled:opacity-70 border border-red-500/40 hover:border-red-500/70 shadow-lg shadow-red-950/50 hover:shadow-red-900/40 group cursor-pointer"
              style={{
                background: 'linear-gradient(135deg, #dc2626 0%, #b91c1c 50%, #991b1b 100%)',
              }}
            >
              {/* Animated highlight sheen */}
              <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 bg-gradient-to-r from-transparent via-white/20 to-transparent" />
              <span className="relative z-10 flex items-center justify-center gap-2">
                {deleting ? (
                  <>
                    <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Deleting...
                  </>
                ) : (
                  <>
                    <Trash2 className="w-4 h-4 transition-transform group-hover:scale-110" />
                    Yes, Delete Slide
                  </>
                )}
              </span>
            </button>
          </div>

          {/* Micro hint */}
          <p className="text-center text-[11px] text-slate-500 mt-3 select-none flex items-center justify-center gap-1.5">
            <span>Press <kbd className="px-1.5 py-0.5 rounded bg-white/5 border border-white/10 text-slate-400 font-mono text-[10px]">Esc</kbd> to dismiss</span>
          </p>
        </div>
      </div>

      {/* Keyframe animations */}
      <style>{`
        @keyframes floatUpDelete {
          0% {
            transform: translateY(0) scale(1);
            opacity: 0;
          }
          10% {
            opacity: var(--particle-opacity, 0.3);
          }
          90% {
            opacity: var(--particle-opacity, 0.1);
          }
          100% {
            transform: translateY(-100vh) scale(0.3);
            opacity: 0;
          }
        }
        @keyframes shakeDelete {
          0%, 100% { transform: translateX(0); }
          10% { transform: translateX(-6px) rotate(-0.5deg); }
          20% { transform: translateX(5px) rotate(0.5deg); }
          30% { transform: translateX(-4px) rotate(-0.3deg); }
          40% { transform: translateX(4px) rotate(0.3deg); }
          50% { transform: translateX(-2px); }
          60% { transform: translateX(2px); }
          70% { transform: translateX(-1px); }
          80% { transform: translateX(1px); }
        }
        .animate-shakeDelete {
          animation: shakeDelete 0.6s ease-in-out;
        }
      `}</style>
    </div>
  )
}
