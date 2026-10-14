import React, { useEffect, useState, useMemo } from 'react'
import {
  Sparkles,
  PartyPopper,
  CheckCircle2,
  ExternalLink,
  Plus,
  Eye,
  X,
  Layers,
  ArrowRight,
  ShieldCheck,
  CloudCheck,
  Flame,
} from 'lucide-react'

// Elegant multi-tone Web Audio synthesizer chime
const playChime = () => {
  try {
    const AudioContext = window.AudioContext || window.webkitAudioContext
    if (!AudioContext) return
    const ctx = new AudioContext()
    const now = ctx.currentTime

    // Musical chord: C5 -> E5 -> G5 -> C6 with warm harmonics
    const notes = [
      { freq: 523.25, time: 0.0 },
      { freq: 659.25, time: 0.08 },
      { freq: 783.99, time: 0.16 },
      { freq: 1046.5, time: 0.24 },
    ]

    notes.forEach(({ freq, time }) => {
      const osc = ctx.createOscillator()
      const gain = ctx.createGain()
      osc.type = 'sine'
      osc.frequency.setValueAtTime(freq, now + time)

      gain.gain.setValueAtTime(0.0001, now + time)
      gain.gain.exponentialRampToValueAtTime(0.16, now + time + 0.03)
      gain.gain.exponentialRampToValueAtTime(0.0001, now + time + 0.6)

      osc.connect(gain)
      gain.connect(ctx.destination)
      osc.start(now + time)
      osc.stop(now + time + 0.65)
    })
  } catch {
    // Silently continue if audio policy blocks autoplay
  }
}

export default function SliderSuccessAlert({
  slide,
  isEdit = false,
  onClose,
  onCreateAnother,
  autoCloseMs = 9000,
}) {
  const [isPaused, setIsPaused] = useState(false)
  const [progress, setProgress] = useState(100)

  useEffect(() => {
    // Play celebratory sound
    playChime()
  }, [])

  // Auto-dismiss countdown bar
  useEffect(() => {
    if (isPaused) return
    const interval = 50
    const step = (interval / autoCloseMs) * 100

    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev <= step) {
          clearInterval(timer)
          onClose?.()
          return 0
        }
        return prev - step
      })
    }, interval)

    return () => clearInterval(timer)
  }, [isPaused, autoCloseMs, onClose])

  // Count active buttons
  const activeButtonsCount = useMemo(() => {
    if (!slide) return 0
    let count = 0
    if (slide.btn1Show !== false && (slide.btn1Text || slide.primaryBtnText)) count++
    if (slide.btn2Show !== false && (slide.btn2Text || slide.secondaryBtnText)) count++
    if (slide.btn3Show !== false && slide.btn3Text) count++
    return count
  }, [slide])

  // Confetti particles generator
  const confettiParticles = useMemo(() => {
    const colors = [
      '#10B981', // Emerald
      '#F59E0B', // Amber
      '#06B6D4', // Cyan
      '#EC4899', // Pink
      '#8B5CF6', // Purple
      '#3B82F6', // Blue
      '#EAB308', // Gold
    ]
    return Array.from({ length: 32 }).map((_, i) => ({
      id: i,
      color: colors[i % colors.length],
      left: Math.random() * 100,
      size: Math.random() * 8 + 6,
      delay: Math.random() * 0.8,
      duration: Math.random() * 2.5 + 2.5,
      isCircle: i % 2 === 0,
      rotation: Math.random() * 360,
    }))
  }, [])

  if (!slide) return null

  const isImgbb =
    slide.imageUrl?.includes('ibb.co') || slide.url?.includes('ibb.co')

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      role="dialog"
      aria-modal="true"
    >
      {/* Backdrop with cinematic blur & ambient glow */}
      <div
        className="fixed inset-0 bg-slate-950/80 backdrop-blur-md transition-opacity animate-fadeIn"
        onClick={onClose}
      />

      {/* Floating Confetti Particles */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-10">
        {confettiParticles.map((p) => (
          <span
            key={p.id}
            className="absolute top-0 opacity-90 animate-bounce"
            style={{
              left: `${p.left}%`,
              width: `${p.size}px`,
              height: `${p.size * (p.isCircle ? 1 : 1.5)}px`,
              backgroundColor: p.color,
              borderRadius: p.isCircle ? '9999px' : '3px',
              animation: `floatDown ${p.duration}s ease-in-out infinite`,
              animationDelay: `${p.delay}s`,
              transform: `rotate(${p.rotation}deg)`,
            }}
          />
        ))}
      </div>

      {/* Inline styles for custom keyframe animations */}
      <style>{`
        @keyframes floatDown {
          0% {
            transform: translateY(-20px) rotate(0deg) scale(0.8);
            opacity: 1;
          }
          70% {
            opacity: 0.9;
          }
          100% {
            transform: translateY(105vh) rotate(720deg) scale(1);
            opacity: 0;
          }
        }
        @keyframes pulseGlow {
          0%, 100% {
            transform: scale(1);
            opacity: 0.6;
          }
          50% {
            transform: scale(1.15);
            opacity: 0.9;
          }
        }
        @keyframes shimmerBorder {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
      `}</style>

      {/* Main Designer Modal Container */}
      <div className="relative z-20 w-full max-w-xl my-auto transform transition-all animate-in fade-in zoom-in-95 duration-300">
        {/* Animated Gradient Border Frame */}
        <div
          className="relative rounded-3xl p-[2px] shadow-[0_25px_70px_-15px_rgba(16,185,129,0.35)]"
          style={{
            background:
              'linear-gradient(135deg, rgba(16,185,129,0.9), rgba(245,158,11,0.8), rgba(139,92,246,0.8), rgba(6,182,212,0.9))',
            backgroundSize: '200% 200%',
            animation: 'shimmerBorder 6s ease infinite',
          }}
        >
          {/* Card Body */}
          <div className="relative rounded-[22px] bg-slate-900/95 backdrop-blur-2xl px-6 py-7 sm:px-8 sm:py-8 text-white overflow-hidden">
            {/* Top Close Button */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 p-2 rounded-full text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
              aria-label="Close alert"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Ambient Background Aura Lights */}
            <div
              className="absolute -top-24 -left-24 w-64 h-64 rounded-full bg-emerald-500/20 blur-3xl pointer-events-none"
              style={{ animation: 'pulseGlow 5s ease-in-out infinite' }}
            />
            <div
              className="absolute -bottom-24 -right-24 w-64 h-64 rounded-full bg-amber-500/20 blur-3xl pointer-events-none"
              style={{ animation: 'pulseGlow 5s ease-in-out infinite 2.5s' }}
            />

            {/* Header: Glowing Icon & Badges */}
            <div className="flex flex-col items-center text-center">
              {/* Central Glowing Icon with Concentric Rings */}
              <div className="relative mb-4">
                <div className="absolute inset-0 rounded-full bg-emerald-400/30 blur-xl animate-pulse" />
                <div className="relative flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-tr from-emerald-500 via-teal-400 to-amber-300 p-0.5 shadow-xl">
                  <div className="w-full h-full rounded-full bg-slate-950 flex items-center justify-center">
                    <PartyPopper className="w-9 h-9 text-emerald-400 animate-bounce" />
                  </div>
                </div>
                {/* Floating mini sparkles */}
                <span className="absolute -top-1 -right-1 flex h-6 w-6 items-center justify-center rounded-full bg-amber-400 text-slate-950 shadow-lg">
                  <Sparkles className="w-3.5 h-3.5" />
                </span>
                <span className="absolute -bottom-1 -left-1 flex h-6 w-6 items-center justify-center rounded-full bg-emerald-400 text-slate-950 shadow-lg">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                </span>
              </div>

              {/* Status Pill */}
              <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs font-semibold tracking-wide uppercase mb-2">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                <span>{isEdit ? 'স্লাইডার আপডেট সম্পন্ন' : 'স্লাইডার সফলভাবে তৈরি হয়েছে'}</span>
              </div>

              {/* Title & Description */}
              <h3 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight drop-shadow-md">
                {isEdit ? '🎉 স্লাইডার আপডেট সফল!' : '🎉 নতুন স্লাইডার লাইভ হয়েছে!'}
              </h3>
              <p className="mt-1.5 text-xs sm:text-sm text-slate-300 max-w-md leading-relaxed">
                {isEdit
                  ? 'আপনার পরিবর্তনগুলো তাৎক্ষণিকভাবে হোমপেজের হিরো ব্যানারে আপডেট হয়ে গেছে।'
                  : 'আপনার নতুন স্লাইডারটি ডাটাবেজে সংরক্ষিত হয়েছে এবং হোমপেজের হিরো ব্যানারে দৃশ্যমান হচ্ছে।'}
              </p>
            </div>

            {/* Visual Slide Showcase Card */}
            <div className="mt-6 rounded-2xl bg-slate-950/70 border border-white/10 p-3 sm:p-4 shadow-inner relative overflow-hidden group">
              <div className="flex flex-col sm:flex-row gap-3.5 items-center">
                {/* Image Preview Thumbnail */}
                <div className="relative w-full sm:w-44 h-28 sm:h-28 rounded-xl overflow-hidden bg-slate-800 shrink-0 border border-white/10 shadow-md">
                  <img
                    src={slide.imageUrl || slide.url}
                    alt={slide.title || 'Created Slide'}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent" />
                  {isImgbb && (
                    <span className="absolute top-1.5 left-1.5 px-2 py-0.5 rounded-md text-[10px] font-bold bg-sky-500/90 text-white backdrop-blur shadow flex items-center gap-1">
                      ☁️ ImgBB
                    </span>
                  )}
                  <span className="absolute bottom-1.5 right-1.5 px-2 py-0.5 rounded-md text-[10px] font-bold bg-black/70 text-slate-200 backdrop-blur">
                    #{slide.order || 1}
                  </span>
                </div>

                {/* Meta details */}
                <div className="flex-1 min-w-0 text-left w-full">
                  <div className="flex flex-wrap items-center gap-1.5 mb-1">
                    {slide.badge && (
                      <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-amber-400/20 text-amber-300 border border-amber-400/30">
                        {slide.badgeBn || slide.badge}
                      </span>
                    )}
                    <span className="px-2 py-0.5 rounded text-[10px] font-medium bg-white/10 text-slate-300">
                      {slide.dateBn || slide.date || 'Active'}
                    </span>
                  </div>

                  <h4 className="text-sm font-bold text-white truncate">
                    {slide.title}
                  </h4>
                  {slide.titleBn && (
                    <p className="text-xs text-slate-400 truncate mt-0.5 font-medium">
                      {slide.titleBn}
                    </p>
                  )}

                  {/* Badges / Features list */}
                  <div className="mt-2.5 flex flex-wrap items-center gap-2 text-[11px] text-slate-300">
                    <span className="inline-flex items-center gap-1 text-emerald-400 font-semibold bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                      <ShieldCheck className="w-3 h-3" />
                      {activeButtonsCount}টি বাটন সক্রিয়
                    </span>
                    <span className="inline-flex items-center gap-1 text-amber-300 font-medium bg-amber-500/10 px-2 py-0.5 rounded-full border border-amber-500/20">
                      <Flame className="w-3 h-3" />
                      লাইভ ডিসপ্লে
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Action Buttons */}
            <div className="mt-6 flex flex-col sm:flex-row items-center gap-2.5">
              {/* Primary Action: View live on Homepage */}
              <a
                href="/"
                target="_blank"
                rel="noreferrer"
                className="w-full sm:flex-1 py-3 px-4 rounded-xl font-bold text-xs sm:text-sm text-slate-950 bg-gradient-to-r from-amber-400 via-emerald-400 to-teal-400 hover:brightness-110 shadow-lg shadow-emerald-500/25 transition-all transform hover:-translate-y-0.5 flex items-center justify-center gap-2"
              >
                <Eye className="w-4 h-4" />
                <span>ওয়েবসাইটে সরাসরি দেখুন</span>
                <ExternalLink className="w-3.5 h-3.5 opacity-80" />
              </a>

              {/* Secondary Action: Create Another */}
              {!isEdit && onCreateAnother && (
                <button
                  type="button"
                  onClick={() => {
                    onClose?.()
                    onCreateAnother?.()
                  }}
                  className="w-full sm:w-auto py-3 px-4 rounded-xl font-semibold text-xs sm:text-sm text-white bg-white/10 hover:bg-white/15 border border-white/20 transition-all flex items-center justify-center gap-2"
                >
                  <Plus className="w-4 h-4 text-emerald-400" />
                  <span>আরও একটি তৈরি করুন</span>
                </button>
              )}

              {/* Dismiss button */}
              <button
                type="button"
                onClick={onClose}
                className="w-full sm:w-auto py-3 px-4 rounded-xl font-medium text-xs sm:text-sm text-slate-300 hover:text-white hover:bg-white/5 transition-all text-center"
              >
                ঠিক আছে
              </button>
            </div>

            {/* Auto-Dismiss Progress Bar */}
            <div className="mt-5 w-full bg-slate-800/80 rounded-full h-1 overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-emerald-400 via-amber-400 to-teal-400 transition-all duration-75 ease-linear rounded-full"
                style={{ width: `${progress}%` }}
              />
            </div>
            <div className="mt-1.5 flex items-center justify-between text-[10px] text-slate-500 font-medium">
              <span>{isPaused ? 'সময় গণনা স্থগিত (মাউস সরানো হলে শুরু হবে)' : 'স্বয়ংক্রিয় বন্ধ হচ্ছে...'}</span>
              <span>{Math.ceil((progress / 100) * (autoCloseMs / 1000))} সে.</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
