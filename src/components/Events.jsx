import { useState, useEffect, useMemo } from 'react'
import Reveal from './Reveal'
import { scene } from '../lib/art'
import { events, gallery } from '../data/content'
import { useLanguage } from '../context/LanguageContext'
import api from '../lib/api'

export default function Events() {
  const { lang, t } = useLanguage()

  const [dbEvents, setDbEvents] = useState(() => {
    try {
      const cached = localStorage.getItem('mpa_events_cache')
      return cached ? JSON.parse(cached) : null
    } catch {
      return null
    }
  })

  const [dbGallery, setDbGallery] = useState(() => {
    try {
      const cached = localStorage.getItem('mpa_gallery_cache')
      return cached ? JSON.parse(cached) : null
    } catch {
      return null
    }
  })

  useEffect(() => {
    const handleUpdate = () => {
      try {
        const ce = localStorage.getItem('mpa_events_cache')
        if (ce) setDbEvents(JSON.parse(ce))
        const cg = localStorage.getItem('mpa_gallery_cache')
        if (cg) setDbGallery(JSON.parse(cg))
      } catch {}
    }
    window.addEventListener('mpa_events_updated', handleUpdate)
    window.addEventListener('mpa_gallery_updated', handleUpdate)
    window.addEventListener('storage', handleUpdate)
    return () => {
      window.removeEventListener('mpa_events_updated', handleUpdate)
      window.removeEventListener('mpa_gallery_updated', handleUpdate)
      window.removeEventListener('storage', handleUpdate)
    }
  }, [])

  const eventList = useMemo(() => {
    if (dbEvents && dbEvents.length > 0) {
      return dbEvents
        .filter((e) => e.isActive !== false)
        .slice(0, 5)
        .map((e) => ({
          id: e._id || e.id,
          d: lang === 'bn' ? e.fullDateBn || e.fullDate : e.fullDate || e.fullDateBn,
          t: lang === 'bn' ? e.titleBn || e.title : e.title || e.titleBn,
        }))
    }
    return events[lang] || events.bn
  }, [dbEvents, lang])

  const galleryList = useMemo(() => {
    if (dbGallery && dbGallery.length > 0) {
      return dbGallery
        .filter((g) => g.isActive !== false)
        .slice(0, 6)
        .map((g) => ({
          label: lang === 'bn' ? g.titleBn || g.title : g.title || g.titleBn,
          src: g.imageUrl,
        }))
    }
    return gallery[lang] || gallery.bn
  }, [dbGallery, lang])

  const tiles = useMemo(
    () =>
      galleryList.map((g) => ({
        ...g,
        src: g.src || scene(g.emoji, g.a, g.b, 400, 400),
      })),
    [galleryList]
  )

  return (
    <section id="events" className="max-w-6xl mx-auto px-4 py-16 scroll-mt-24">
      <div className="grid md:grid-cols-2 gap-12">
        <Reveal>
          <h2 className="sec-title font-display">
            {lang === 'bn' ? 'আসন্ন ইভেন্টসমূহ' : 'Upcoming events'}
          </h2>
          <ul className="pop-in mt-6 space-y-3">
            {eventList.map((v) => (
              <li key={v.id} data-tilt className="card flex gap-4 items-center">
                <span className="event-date w-16 text-center font-display font-bold rounded-md py-2 text-sm">{v.d}</span>
                <span className="font-medium">{v.t}</span>
              </li>
            ))}
          </ul>
        </Reveal>

        <Reveal delay={90}>
          <h2 className="sec-title font-display">
            {lang === 'bn' ? 'গ্যালারি' : 'Gallery'}
          </h2>
          <div className="pop-in mt-6 grid grid-cols-3 gap-2">
            {tiles.map((g) => (
              <div key={g.label} className="tile relative aspect-square rounded-[1.1rem] overflow-hidden shadow-lg">
                <img src={g.src} alt={g.label} className="w-full h-full object-cover" />
                <span className="absolute inset-x-0 bottom-0 bg-black/45 text-white text-xs font-medium p-2">{g.label}</span>
              </div>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  )
}
