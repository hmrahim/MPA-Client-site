import { useEffect, useState, useMemo } from 'react'
import { events } from '../data/content'
import { useLanguage } from '../context/LanguageContext'
import { translations } from '../data/translations'

const INTERVAL = 6000

export default function Banner() {
  const { lang, num } = useLanguage()
  const [dbEvents, setDbEvents] = useState(() => {
    try {
      const cached = localStorage.getItem('mpa_events_cache')
      return cached ? JSON.parse(cached) : null
    } catch {
      return null
    }
  })

  useEffect(() => {
    const handleUpdate = () => {
      try {
        const cached = localStorage.getItem('mpa_events_cache')
        if (cached) setDbEvents(JSON.parse(cached))
      } catch {}
    }
    window.addEventListener('mpa_events_updated', handleUpdate)
    window.addEventListener('storage', handleUpdate)
    return () => {
      window.removeEventListener('mpa_events_updated', handleUpdate)
      window.removeEventListener('storage', handleUpdate)
    }
  }, [])

  const eventList = useMemo(() => {
    if (dbEvents && dbEvents.length > 0) {
      return dbEvents.filter((e) => e.isActive !== false).map((e) => ({
        id: e._id || e.id,
        d: lang === 'bn' ? (e.fullDateBn || e.fullDate) : (e.fullDate || e.fullDateBn),
        t: lang === 'bn' ? (e.titleBn || e.title) : (e.title || e.titleBn),
      }))
    }
    return events[lang] || events.bn
  }, [dbEvents, lang])

  const slideList = (translations[lang] && translations[lang].slides) || translations.bn.slides
  const [si, setSi] = useState(0)
  const [hold, setHold] = useState(false)
  const [cycle, setCycle] = useState(0)

  useEffect(() => {
    if (hold) return
    const id = setTimeout(() => setSi((s) => (s + 1) % slideList.length), INTERVAL)
    return () => clearTimeout(id)
  }, [si, hold, cycle, slideList.length])

  const go = (i) => setSi((i + slideList.length) % slideList.length)
  const ev = eventList[si % eventList.length]
  const currentSlide = slideList[si] || slideList[0]

  return (
    <div
      className="banner relative overflow-hidden shadow-2xl aspect-[16/10] sm:aspect-[16/9] min-h-[250px] sm:min-h-[320px] bg-boardlt rounded-2xl sm:rounded-3xl"
      role="region"
      aria-roledescription="carousel"
      aria-label="School events"
      onMouseEnter={() => setHold(true)}
      onMouseLeave={() => {
        setHold(false)
        setCycle((c) => c + 1)
      }}
    >
      <div className="absolute inset-0">
        {slideList.map((s, i) => (
          <div
            key={s.title}
            className={`slide absolute inset-0 overflow-hidden transition-opacity duration-700 ${i === si ? 'opacity-100 z-10' : 'opacity-0 z-0'}`}
            aria-hidden={i !== si}
          >
            <div className="w-full h-full bg-gradient-to-tr from-board via-boardlt to-iris flex items-center justify-center p-6 sm:p-8 pb-14 sm:pb-16">
              <div className="text-center max-w-lg">
                <span className="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-gold bg-gold/20 px-2.5 py-0.5 sm:px-3 sm:py-1 rounded-full mb-2 sm:mb-3 inline-block">
                  {s.badge}
                </span>
                <h3 className="font-display font-extrabold text-base sm:text-2xl text-white line-clamp-2">{s.title}</h3>
                <p className="text-xs sm:text-sm text-chalk/80 mt-1 sm:mt-2 line-clamp-2">{s.subtitle}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black/80 to-transparent pointer-events-none z-10" />

      <div key={si} className="cap absolute left-4 sm:left-6 right-14 sm:right-16 bottom-7 sm:bottom-9 text-chalk z-20 pointer-events-none" aria-live="polite">
        <div className="flex items-center gap-2">
          <span className="text-gold text-[11px] sm:text-xs font-bold">{ev?.d}</span>
          <span className="text-white/40 text-xs hidden sm:inline">•</span>
          <p className="text-chalk/90 text-xs truncate hidden sm:block">{ev?.t}</p>
        </div>
      </div>

      <button
        onClick={() => go(si - 1)}
        aria-label="Previous event"
        className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-board/70 text-chalk text-xl leading-none hover:bg-gold hover:text-ink grid place-items-center z-20 cursor-pointer shadow-md"
      >
        &lsaquo;
      </button>
      <button
        onClick={() => go(si + 1)}
        aria-label="Next event"
        className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-board/70 text-chalk text-xl leading-none hover:bg-gold hover:text-ink grid place-items-center z-20 cursor-pointer shadow-md"
      >
        &rsaquo;
      </button>

      <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-2 z-20">
        {slideList.map((s, i) => (
          <button
            key={s.title}
            aria-label={`Slide ${i + 1}`}
            aria-current={i === si}
            onClick={() => go(i)}
            className={`h-2 rounded-full transition-all cursor-pointer ${i === si ? 'w-6 bg-gold' : 'w-2 bg-white/50'}`}
          />
        ))}
      </div>

      <div key={`${si}-${cycle}`} className="bar absolute top-0 left-0 h-1 bg-gold z-30" />
    </div>
  )
}
