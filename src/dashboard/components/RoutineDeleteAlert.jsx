import React, { useEffect, useState, useMemo } from 'react'
import { Trash2, AlertTriangle, X, Clock } from 'lucide-react'

// Warning sound effect
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
    // Silently fail if audio not allowed
  }
}

export default function RoutineDeleteAlert({
  item,
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

  useEffect(() => {
    const t = setTimeout(() => setShaking(true), 150)
    const t2 = setTimeout(() => setShaking(false), 750)
    return () => {
      clearTimeout(t)
      clearTimeout(t2)
    }
  }, [])

  useEffect(() => {
    const handleKey = (e) => {
      if (e.key === 'Escape' && !deleting) onCancel?.()
    }
    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [onCancel, deleting])

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

  const itemTitle = item.title || item.titleBn || 'Untitled Routine Slot'
  const itemTitleBn = item.titleBn || ''
  const itemTime = item.time || item.timeBn || ''

  return (
    <div
      className={`fixed inset-0 z-[70] flex items-center justify-center p-4 sm:p-6 transition-opacity duration-300 ${
        mounted ? 'opacity-100' : 'opacity-0'
      }`}
      role="dialog"
      aria-modal="true"
      aria-label="Delete routine item confirmation"
    >
      <div
        className="fixed inset-0 bg-black/80 backdrop-blur-md transition-all duration-500"
        onClick={() => {
          if (!deleting) onCancel?.()
        }}
      />

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
            }}
          />
        ))}
      </div>

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
        <div className="h-1 w-full bg-gradient-to-r from-red-600 via-rose-500 to-red-600" />

        <div className="p-6">
          <div className="flex items-start justify-between">
            <div className="w-12 h-12 rounded-xl bg-red-500/10 border border-red-500/20 flex items-center justify-center text-red-400">
              <AlertTriangle className="w-6 h-6 animate-pulse" />
            </div>
            <button
              onClick={onCancel}
              disabled={deleting}
              className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-white/5 transition disabled:opacity-50"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="mt-4">
            <h3 className="text-lg font-bold text-white tracking-wide">
              Delete Routine Period?
            </h3>
            <p className="mt-1 text-xs text-slate-400">
              Are you sure you want to remove this period from the school schedule? This change will be saved.
            </p>
          </div>

          <div className="mt-4 p-3 rounded-xl bg-red-950/20 border border-red-500/20 space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-amber-400 bg-amber-400/10 px-2 py-0.5 rounded-md flex items-center gap-1">
                <Clock className="w-3 h-3" />
                {itemTime}
              </span>
            </div>
            <p className="text-sm font-semibold text-slate-200 mt-1">{itemTitle}</p>
            {itemTitleBn && (
              <p className="text-xs text-slate-400 font-bengali">{itemTitleBn}</p>
            )}
          </div>

          <div className="mt-6 flex items-center justify-end gap-3">
            <button
              onClick={onCancel}
              disabled={deleting}
              type="button"
              className="px-4 py-2 rounded-xl border border-white/10 text-xs font-bold text-slate-300 hover:bg-white/5 hover:text-white transition disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              onClick={onConfirm}
              disabled={deleting}
              type="button"
              className="px-5 py-2 rounded-xl bg-red-600 hover:bg-red-500 text-xs font-bold text-white shadow-lg shadow-red-600/30 transition flex items-center gap-2 disabled:opacity-50"
            >
              {deleting ? (
                <>
                  <span className="w-3.5 h-3.5 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                  <span>Deleting...</span>
                </>
              ) : (
                <>
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Delete Period</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
