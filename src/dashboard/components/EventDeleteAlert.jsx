import React, { useEffect, useState, useMemo } from 'react'
import { Trash2, AlertTriangle, X } from 'lucide-react'

// Dramatic warning sound effect
const playWarningSound = () => {
  try {
    const AudioContext = window.AudioContext || window.webkitAudioContext
    if (!AudioContext) return
    const ctx = new AudioContext()
    const now = ctx.currentTime

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

export default function EventDeleteAlert({
  item,
  type = 'event', // 'event' | 'photo'
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
    return Array.from({ length: 16 }).map((_, i) => ({
      id: i,
      left: Math.random() * 100,
      size: Math.random() * 4 + 2,
      delay: Math.random() * 3,
      duration: Math.random() * 4 + 4,
      opacity: Math.random() * 0.3 + 0.1,
    }))
  }, [])

  if (!item) return null

  const title = item.title || item.titleBn || (type === 'photo' ? 'Untitled Photo' : 'Untitled Event')
  const titleBn = item.titleBn || ''
  const subtitle = type === 'photo' ? item.caption || item.captionBn : item.location || item.fullDate

  return (
    <div
      className={`fixed inset-0 z-[70] flex items-center justify-center p-4 sm:p-6 transition-opacity duration-300 ${
        mounted ? 'opacity-100' : 'opacity-0'
      }`}
      role="dialog"
      aria-modal="true"
      aria-label={`Delete ${type} confirmation`}
    >
      {/* Backdrop */}
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
          onClick={() => {
            if (!deleting) onCancel?.()
          }}
          disabled={deleting}
          className="absolute top-3.5 right-3.5 p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition disabled:opacity-30 cursor-pointer"
          aria-label="Close"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="p-6">
          {/* Animated Warning Icon */}
          <div className="relative mx-auto w-14 h-14 mb-4">
            <div className="absolute inset-0 rounded-full bg-red-500/20 animate-ping" style={{ animationDuration: '2s' }} />
            <div className="relative w-full h-full rounded-full bg-gradient-to-br from-red-500 to-rose-700 flex items-center justify-center text-white shadow-lg shadow-red-500/30">
              <AlertTriangle className="w-7 h-7" />
            </div>
          </div>

          {/* Heading */}
          <div className="text-center mb-4">
            <h3 className="text-lg font-black text-white tracking-tight">
              Delete {type === 'photo' ? 'Gallery Photo' : 'School Event'}?
            </h3>
            <p className="text-xs text-slate-400 mt-1">
              This action will permanently delete this item from MongoDB and remove it from the public website.
            </p>
          </div>

          {/* Item Preview Card */}
          <div className="bg-red-950/20 border border-red-500/20 rounded-xl p-3.5 mb-5 flex items-center gap-3">
            {(item.image || item.imageUrl) ? (
              <img
                src={item.image || item.imageUrl}
                alt=""
                className="w-12 h-12 rounded-lg object-cover shrink-0 border border-white/10"
              />
            ) : (
              <div className="w-12 h-12 rounded-lg bg-red-500/20 text-red-300 font-bold flex items-center justify-center shrink-0">
                {item.dateBadge || 'EVT'}
              </div>
            )}
            <div className="min-w-0 flex-1">
              <h4 className="text-xs font-bold text-white truncate">{title}</h4>
              {titleBn && <p className="text-[11px] text-slate-300 truncate">{titleBn}</p>}
              {subtitle && <p className="text-[10px] text-slate-400 truncate mt-0.5">{subtitle}</p>}
            </div>
          </div>

          {/* Buttons */}
          <div className="flex items-center gap-2.5">
            <button
              type="button"
              onClick={onCancel}
              disabled={deleting}
              className="flex-1 py-2.5 px-4 rounded-xl text-xs font-bold bg-white/5 hover:bg-white/10 text-slate-300 border border-white/10 transition disabled:opacity-50 cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={onConfirm}
              disabled={deleting}
              className="flex-1 py-2.5 px-4 rounded-xl text-xs font-bold bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white shadow-lg shadow-red-500/30 transition disabled:opacity-50 flex items-center justify-center gap-1.5 cursor-pointer"
            >
              {deleting ? (
                <>
                  <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Deleting...</span>
                </>
              ) : (
                <>
                  <Trash2 className="w-3.5 h-3.5" />
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
