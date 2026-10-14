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

export default function NoticeDeleteAlert({
  notice,
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

  const noticeNameEn = notice?.title || 'Notice'
  const noticeNameBn = notice?.titleBn || ''

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="alert-dialog-title"
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 overflow-y-auto"
      style={{
        backgroundColor: mounted ? 'rgba(5, 7, 15, 0.78)' : 'rgba(5, 7, 15, 0)',
        backdropFilter: mounted ? 'blur(8px)' : 'blur(0px)',
        WebkitBackdropFilter: mounted ? 'blur(8px)' : 'blur(0px)',
        transition: 'all 240ms cubic-bezier(0.16, 1, 0.3, 1)',
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget && !deleting) onCancel?.()
      }}
    >
      <div
        className={`relative w-full max-w-lg overflow-hidden rounded-2xl shadow-2xl transition-all duration-300 ${
          mounted ? 'scale-100 opacity-100 translate-y-0' : 'scale-95 opacity-0 translate-y-4'
        } ${shaking ? 'animate-[shake_0.5s_ease-in-out]' : ''}`}
        style={{
          background: 'linear-gradient(145deg, #181926 0%, #11121d 100%)',
          border: '1px solid rgba(239, 68, 68, 0.35)',
          boxShadow: '0 25px 60px -15px rgba(239, 68, 68, 0.25), 0 0 0 1px rgba(239, 68, 68, 0.15)',
        }}
      >
        {/* Glowing top line */}
        <div
          className="h-1 w-full"
          style={{
            background: 'linear-gradient(90deg, #ef4444, #f97316, #ef4444)',
          }}
        />

        {/* Close Button */}
        <button
          onClick={onCancel}
          disabled={deleting}
          className="absolute top-4 right-4 p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition disabled:opacity-50"
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="p-6 sm:p-7">
          {/* Header with Danger Icon */}
          <div className="flex items-start gap-4">
            <div
              className="flex-shrink-0 w-12 h-12 rounded-xl flex items-center justify-center"
              style={{
                background: 'radial-gradient(circle, rgba(239, 68, 68, 0.25) 0%, rgba(239, 68, 68, 0.08) 100%)',
                border: '1px solid rgba(239, 68, 68, 0.4)',
              }}
            >
              <AlertTriangle className="w-6 h-6 text-red-400 animate-pulse" />
            </div>

            <div className="flex-1 pr-6">
              <span className="inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold tracking-wider uppercase text-red-400 bg-red-500/10 border border-red-500/20 mb-1.5">
                Permanent Action
              </span>
              <h3 id="alert-dialog-title" className="text-lg font-bold text-white tracking-tight">
                Delete Official Notice?
              </h3>
              <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                Are you sure you want to delete this notice? This action will immediately remove it from the public notice board and letterhead preview.
              </p>
            </div>
          </div>

          {/* Target Preview Box */}
          <div
            className="mt-5 p-4 rounded-xl border"
            style={{
              background: 'rgba(239, 68, 68, 0.04)',
              borderColor: 'rgba(239, 68, 68, 0.2)',
            }}
          >
            <div className="flex items-start gap-3">
              <span className="w-8 h-8 rounded-lg bg-red-500/15 border border-red-500/30 flex items-center justify-center shrink-0 text-red-300 font-bold text-xs">
                {notice?.cat?.slice(0, 3)?.toUpperCase() || 'NOT'}
              </span>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold text-slate-100 truncate">{noticeNameEn}</p>
                {noticeNameBn && (
                  <p className="text-xs text-slate-400 truncate mt-0.5 font-medium">{noticeNameBn}</p>
                )}
                <div className="flex items-center gap-2 mt-2 text-[11px] text-slate-400">
                  <span className="text-slate-500">Memo:</span>
                  <span className="font-mono text-slate-300">{notice?.memoNo || 'N/A'}</span>
                  <span>•</span>
                  <span>{notice?.date || 'N/A'}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="mt-6 flex items-center justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onCancel}
              disabled={deleting}
              className="px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold text-slate-300 hover:text-white bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700 transition cursor-pointer disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={onConfirm}
              disabled={deleting}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold text-white bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 shadow-lg shadow-red-900/40 transition active:scale-95 cursor-pointer disabled:opacity-50"
            >
              {deleting ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Deleting...</span>
                </>
              ) : (
                <>
                  <Trash2 className="w-4 h-4" />
                  <span>Confirm Delete</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
