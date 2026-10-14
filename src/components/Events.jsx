import { useMemo } from 'react'
import Reveal from './Reveal'
import { scene } from '../lib/art'
import { events, gallery } from '../data/content'
import { useLanguage } from '../context/LanguageContext'

export default function Events() {
  const { lang, t } = useLanguage()
  const eventList = events[lang] || events.bn
  const galleryList = gallery[lang] || gallery.bn
  const tiles = useMemo(() => galleryList.map((g) => ({ ...g, src: g.src || scene(g.emoji, g.a, g.b, 400, 400) })), [galleryList])

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
