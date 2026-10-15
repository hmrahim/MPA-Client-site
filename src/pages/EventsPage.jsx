import { useState, useMemo, useEffect } from 'react'
import {
  Calendar,
  MapPin,
  Clock,
  Filter,
  Sparkles,
  X,
  Maximize2,
  ChevronRight,
  Trophy,
  Images,
  Tag,
} from 'lucide-react'
import { events as defaultEvents, gallery as defaultGallery } from '../data/content'
import { useLanguage } from '../context/LanguageContext'
import api from '../lib/api'

const DEFAULT_PAGE_CONFIG = {
  badge: 'Campus Vibrancy & Student Life',
  badgeBn: 'ক্যাম্পাস জীবন ও উৎসবের মুহূর্ত',
  title: 'Events Calendar & Photo Gallery',
  titleBn: 'ইভেন্ট ক্যালেন্ডার ও ফটো গ্যালারি',
  subtitle:
    'Explore our colorful campus festivities: from athletic championships and robotics exhibitions to national day celebrations and graduation ceremonies.',
  subtitleBn:
    'বার্ষিক ক্রীড়া প্রতিযোগিতা, বিজ্ঞান মেলা, সাংস্কৃতিক উৎসব ও জাতীয় দিবস উদযাপনের স্মৃতির অ্যালবাম।',
  eventsBadge: 'School Calendar',
  eventsBadgeBn: 'একাডেমিক ক্যালেন্ডার',
  eventsTitle: 'Academic Calendar & Upcoming Events',
  eventsTitleBn: 'একাডেমিক ক্যালেন্ডার ও আসন্ন অনুষ্ঠান',
  eventsSubtitle:
    'Stay updated with scheduled examinations, science olympiads, cultural meets, and national day observances.',
  eventsSubtitleBn:
    'পরীক্ষার সময়সূচি, বিজ্ঞান অলিম্পিয়াড, সাংস্কৃতিক সমাবেশ ও জাতীয় দিবসের সময়সূচি।',
  galleryBadge: 'Memories & Moments',
  galleryBadgeBn: 'স্মৃতি ও সোনালী মুহূর্ত',
  galleryTitle: 'Campus Life Photo Gallery',
  galleryTitleBn: 'ক্যাম্পাস জীবন ফটো গ্যালারি',
  gallerySubtitle: 'Click any image to view in high definition lightbox',
  gallerySubtitleBn: 'পূর্ণাঙ্গ আকারে দেখতে যেকোনো ছবিতে ক্লিক করুন',
}

export default function EventsPage() {
  const { lang, num } = useLanguage()

  // 1. Events State
  const [dbEvents, setDbEvents] = useState(() => {
    try {
      const cached = localStorage.getItem('mpa_events_cache')
      return cached ? JSON.parse(cached) : null
    } catch {
      return null
    }
  })

  // 2. Gallery State
  const [dbGallery, setDbGallery] = useState(() => {
    try {
      const cached = localStorage.getItem('mpa_gallery_cache')
      return cached ? JSON.parse(cached) : null
    } catch {
      return null
    }
  })

  // 3. Word-to-Word Page Configuration State
  const [config, setConfig] = useState(() => {
    try {
      const cached = localStorage.getItem('mpa_events_config_cache')
      return cached ? JSON.parse(cached) : DEFAULT_PAGE_CONFIG
    } catch {
      return DEFAULT_PAGE_CONFIG
    }
  })

  const [loading, setLoading] = useState(!dbEvents && !dbGallery)

  const fetchAllEventsData = async () => {
    try {
      const [eventsRes, galleryRes, configRes] = await Promise.all([
        api.getEvents(),
        api.getGallery(),
        api.getEventPageConfig(),
      ])

      if (eventsRes && eventsRes.success && Array.isArray(eventsRes.data) && eventsRes.data.length > 0) {
        setDbEvents(eventsRes.data)
        localStorage.setItem('mpa_events_cache', JSON.stringify(eventsRes.data))
      }
      if (galleryRes && galleryRes.success && Array.isArray(galleryRes.data) && galleryRes.data.length > 0) {
        setDbGallery(galleryRes.data)
        localStorage.setItem('mpa_gallery_cache', JSON.stringify(galleryRes.data))
      }
      if (configRes && configRes.success && configRes.data) {
        setConfig(configRes.data)
        localStorage.setItem('mpa_events_config_cache', JSON.stringify(configRes.data))
      }
    } catch (err) {
      console.warn('Could not fetch events/gallery from backend', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchAllEventsData()
    const handleUpdate = () => fetchAllEventsData()

    window.addEventListener('mpa_events_updated', handleUpdate)
    window.addEventListener('mpa_gallery_updated', handleUpdate)
    window.addEventListener('mpa_events_config_updated', handleUpdate)
    window.addEventListener('storage', handleUpdate)

    return () => {
      window.removeEventListener('mpa_events_updated', handleUpdate)
      window.removeEventListener('mpa_gallery_updated', handleUpdate)
      window.removeEventListener('mpa_events_config_updated', handleUpdate)
      window.removeEventListener('storage', handleUpdate)
    }
  }, [])

  // Localized Dynamic Events List
  const eventList = useMemo(() => {
    if (dbEvents && dbEvents.length > 0) {
      return dbEvents
        .filter((e) => e.isActive !== false)
        .sort((a, b) => (a.order || 0) - (b.order || 0))
        .map((e) => ({
          id: e._id || e.id,
          d: lang === 'bn' ? e.fullDateBn || e.fullDate : e.fullDate || e.fullDateBn,
          dateBadge: e.dateBadge || 'EVT',
          t: lang === 'bn' ? e.titleBn || e.title : e.title || e.titleBn,
          desc: lang === 'bn' ? e.descBn || e.desc : e.desc || e.descBn,
          time: lang === 'bn' ? e.timeBn || e.time : e.time || e.timeBn,
          location: lang === 'bn' ? e.locationBn || e.location : e.location || e.locationBn,
          category: lang === 'bn' ? e.categoryBn || e.category : e.category || e.categoryBn,
          image:
            e.image ||
            'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?auto=format&fit=crop&w=800&q=80',
          status: lang === 'bn' ? e.statusBn || e.status : e.status || e.statusBn,
        }))
    }
    return defaultEvents[lang] || defaultEvents.bn
  }, [dbEvents, lang])

  // Localized Dynamic Gallery List
  const galleryList = useMemo(() => {
    if (dbGallery && dbGallery.length > 0) {
      return dbGallery
        .filter((g) => g.isActive !== false)
        .sort((a, b) => (a.order || 0) - (b.order || 0))
        .map((g) => ({
          id: g._id || g.id,
          label: lang === 'bn' ? g.titleBn || g.title : g.title || g.titleBn,
          category: g.category || 'Campus',
          categoryBn: g.categoryBn || 'ক্যাম্পাস',
          src: g.imageUrl,
          caption: lang === 'bn' ? g.captionBn || g.caption : g.caption || g.captionBn,
          date: g.date || '2026',
        }))
    }
    return defaultGallery[lang] || defaultGallery.bn
  }, [dbGallery, lang])

  const [selectedCategory, setSelectedCategory] = useState('All')
  const [lightboxImage, setLightboxImage] = useState(null)

  const categories =
    lang === 'bn'
      ? [
          { id: 'All', label: 'সকল ছবি' },
          { id: 'Sports', label: 'খেলাধুলা' },
          { id: 'Science', label: 'বিজ্ঞান' },
          { id: 'Academic', label: 'একাডেমিক' },
          { id: 'Cultural', label: 'সাংস্কৃতিক' },
          { id: 'Scouts', label: 'স্কাউট' },
          { id: 'Awards', label: 'পুরস্কার' },
          { id: 'Campus', label: 'ক্যাম্পাস' },
        ]
      : [
          { id: 'All', label: 'All' },
          { id: 'Sports', label: 'Sports' },
          { id: 'Science', label: 'Science' },
          { id: 'Academic', label: 'Academic' },
          { id: 'Cultural', label: 'Cultural' },
          { id: 'Scouts', label: 'Scouts' },
          { id: 'Awards', label: 'Awards' },
          { id: 'Campus', label: 'Campus' },
        ]

  const filteredGallery = useMemo(() => {
    if (selectedCategory === 'All') return galleryList
    const sel = selectedCategory.toLowerCase()
    return galleryList.filter((item) => {
      const cat = (item.category || '').toLowerCase()
      const catBn = (item.categoryBn || '').toLowerCase()
      return (
        cat === sel ||
        catBn === sel ||
        (selectedCategory === 'Sports' && (cat === 'খেলাধুলা' || cat === 'sports')) ||
        (selectedCategory === 'Science' && (cat === 'বিজ্ঞান' || cat === 'science')) ||
        (selectedCategory === 'Academic' && (cat === 'একাডেমিক' || cat === 'academic')) ||
        (selectedCategory === 'Cultural' && (cat === 'সাংস্কৃতিক' || cat === 'cultural')) ||
        (selectedCategory === 'Scouts' && (cat === 'স্কাউট' || cat === 'scouts')) ||
        (selectedCategory === 'Awards' && (cat === 'পুরস্কার' || cat === 'awards')) ||
        (selectedCategory === 'Campus' && (cat === 'ক্যাম্পাস' || cat === 'campus'))
      )
    })
  }, [galleryList, selectedCategory])

  // Word-to-word bilingual strings
  const bannerBadge = lang === 'bn' ? config.badgeBn || config.badge : config.badge || config.badgeBn
  const bannerTitle = lang === 'bn' ? config.titleBn || config.title : config.title || config.titleBn
  const bannerSubtitle =
    lang === 'bn' ? config.subtitleBn || config.subtitle : config.subtitle || config.subtitleBn

  const eventsBadge =
    lang === 'bn' ? config.eventsBadgeBn || config.eventsBadge : config.eventsBadge || config.eventsBadgeBn
  const eventsHeading =
    lang === 'bn' ? config.eventsTitleBn || config.eventsTitle : config.eventsTitle || config.eventsTitleBn
  const eventsSub =
    lang === 'bn'
      ? config.eventsSubtitleBn || config.eventsSubtitle
      : config.eventsSubtitle || config.eventsSubtitleBn

  const galleryBadge =
    lang === 'bn' ? config.galleryBadgeBn || config.galleryBadge : config.galleryBadge || config.galleryBadgeBn
  const galleryHeading =
    lang === 'bn' ? config.galleryTitleBn || config.galleryTitle : config.galleryTitle || config.galleryTitleBn
  const gallerySub =
    lang === 'bn'
      ? config.gallerySubtitleBn || config.gallerySubtitle
      : config.gallerySubtitle || config.gallerySubtitleBn

  return (
    <div className="min-h-screen bg-paper py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* ── 1. Page Hero Banner (Word-to-Word Dynamic) ── */}
        <div className="bg-gradient-to-r from-board via-boardlt to-iris rounded-3xl p-8 sm:p-12 text-chalk mb-12 shadow-xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-80 h-80 bg-gold/10 rounded-full blur-3xl pointer-events-none" />

          <div className="max-w-3xl relative z-10">
            <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold bg-white/10 text-gold border border-white/15 mb-3">
              <Calendar className="w-3.5 h-3.5 text-gold" />
              <span>{bannerBadge}</span>
            </span>
            <h1 className="font-display font-extrabold text-3xl sm:text-5xl text-white tracking-tight leading-tight">
              {bannerTitle}
            </h1>
            <p className="mt-3 text-sm sm:text-base text-chalk/80 leading-relaxed">
              {bannerSubtitle}
            </p>
          </div>
        </div>

        {/* ── 2. Academic Calendar & Upcoming Events Section (Word-to-Word Dynamic) ── */}
        <div className="mb-16">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-3">
            <div>
              {eventsBadge && (
                <span className="text-xs font-bold uppercase tracking-wider text-iris bg-iris/10 px-3 py-1 rounded-full inline-flex items-center gap-1.5 mb-2">
                  <Calendar className="w-3 h-3 text-iris" />
                  <span>{eventsBadge}</span>
                </span>
              )}
              <h2 className="font-display font-extrabold text-2xl sm:text-3xl text-board">
                {eventsHeading}
              </h2>
              {eventsSub && (
                <p className="text-xs sm:text-sm text-ink/65 mt-1 max-w-2xl leading-relaxed">
                  {eventsSub}
                </p>
              )}
            </div>

            <span className="text-xs font-bold text-ink/60 bg-ink/5 px-3 py-1.5 rounded-full shrink-0">
              {lang === 'bn' ? `মোট ${num(eventList.length)}টি ইভেন্ট` : `${eventList.length} Scheduled Events`}
            </span>
          </div>

          {eventList.length === 0 ? (
            <div className="bg-white rounded-3xl p-12 text-center border border-ink/10 shadow-sm">
              <Calendar className="w-12 h-12 text-ink/30 mx-auto mb-3" />
              <p className="font-display font-bold text-lg text-board">
                {lang === 'bn' ? 'কোনো আসন্ন ইভেন্ট নেই' : 'No Upcoming Events Scheduled'}
              </p>
              <p className="text-xs text-ink/60 mt-1">
                {lang === 'bn'
                  ? 'শীঘ্রই নতুন পরীক্ষা ও অনুষ্ঠানের সময়সূচি প্রকাশ করা হবে।'
                  : 'Check back soon for upcoming examination dates, sports tournaments and cultural programs.'}
              </p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 gap-6">
              {eventList.map((evt, idx) => (
                <div
                  key={evt.id || idx}
                  className="bg-white rounded-3xl p-5 sm:p-6 border border-ink/10 shadow-md hover:shadow-xl transition-all flex flex-col sm:flex-row gap-5 items-start group"
                >
                  {/* Event Thumbnail & Date Badge */}
                  <div className="w-full sm:w-36 h-32 sm:h-36 rounded-2xl overflow-hidden shrink-0 relative bg-board shadow-md">
                    <img
                      src={evt.image}
                      alt={evt.t}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      onError={(e) => {
                        e.target.src =
                          'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?auto=format&fit=crop&w=800&q=80'
                      }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-board/80 via-transparent to-transparent sm:hidden" />

                    {/* Date Badge */}
                    <div className="absolute top-2 left-2 bg-board/90 backdrop-blur-md text-gold px-2.5 py-1 rounded-xl text-xs font-black font-display shadow-lg border border-gold/30">
                      {evt.dateBadge}
                    </div>

                    <div className="absolute bottom-2 left-2 right-2 text-[10px] text-chalk/90 font-medium truncate sm:hidden">
                      {evt.d}
                    </div>
                  </div>

                  {/* Event Details */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2 mb-2 flex-wrap">
                      <span className="text-[11px] font-bold text-iris uppercase tracking-wider bg-iris/10 px-2.5 py-0.5 rounded-full">
                        {evt.category}
                      </span>
                      <span className="text-[11px] font-bold text-mint bg-mint/10 px-2 py-0.5 rounded-md">
                        {evt.status}
                      </span>
                    </div>

                    <h3 className="font-display font-bold text-lg text-board leading-snug group-hover:text-iris transition-colors">
                      {evt.t}
                    </h3>
                    <p className="text-xs sm:text-sm text-ink/75 mt-1.5 leading-relaxed line-clamp-2">
                      {evt.desc}
                    </p>

                    <div className="mt-3.5 pt-3 border-t border-ink/10 flex flex-wrap items-center gap-3.5 text-xs text-ink/65">
                      <span className="flex items-center gap-1.5 font-medium">
                        <Clock className="w-3.5 h-3.5 text-gold shrink-0" />
                        <span>{evt.time}</span>
                      </span>
                      <span className="flex items-center gap-1.5 font-medium truncate">
                        <MapPin className="w-3.5 h-3.5 text-brick shrink-0" />
                        <span className="truncate">{evt.location}</span>
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* ── 3. Photo Lightbox Gallery Section (Word-to-Word Dynamic) ── */}
        <div>
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-gold bg-gold/20 px-3.5 py-1 rounded-full inline-flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-gold" />
                <span>{galleryBadge}</span>
              </span>
              <h2 className="mt-2 font-display font-extrabold text-2xl sm:text-3xl text-board">
                {galleryHeading}
              </h2>
              <p className="text-xs sm:text-sm text-ink/65 mt-1 leading-relaxed">
                {gallerySub}
              </p>
            </div>

            {/* Category Filter Pills */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-2 sm:pb-0">
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                    selectedCategory === cat.id
                      ? 'bg-board text-gold shadow-md scale-105'
                      : 'bg-white text-ink/75 hover:bg-ink/10 border border-ink/10'
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>
          </div>

          {/* Image Grid */}
          {filteredGallery.length === 0 ? (
            <div className="bg-white rounded-3xl p-12 text-center border border-ink/10 shadow-sm">
              <Images className="w-12 h-12 text-ink/30 mx-auto mb-3" />
              <p className="font-display font-bold text-lg text-board">
                {lang === 'bn' ? 'এই বিভাগে কোনো ছবি নেই' : 'No Photos Found in this Category'}
              </p>
              <p className="text-xs text-ink/60 mt-1">
                {lang === 'bn' ? 'অন্য বিভাগ নির্বাচন করুন।' : 'Please choose another category.'}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {filteredGallery.map((item, idx) => (
                <div
                  key={item.id || idx}
                  onClick={() => setLightboxImage(item)}
                  className="group relative rounded-3xl overflow-hidden aspect-[4/3] bg-board cursor-pointer shadow-md hover:shadow-2xl transition-all transform hover:-translate-y-1.5 border border-ink/10"
                >
                  <img
                    src={item.src}
                    alt={item.label}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />

                  <div className="absolute inset-0 bg-gradient-to-t from-board via-transparent/40 to-transparent opacity-85 group-hover:opacity-95 transition-opacity" />

                  <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity p-2 rounded-full bg-white/20 backdrop-blur-md text-white">
                    <Maximize2 className="w-4 h-4" />
                  </div>

                  <div className="absolute bottom-4 left-4 right-4 text-white">
                    <div className="flex items-center gap-1.5">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-gold bg-gold/20 px-2 py-0.5 rounded-md backdrop-blur-md border border-gold/30">
                        {lang === 'bn' ? item.categoryBn || item.category : item.category}
                      </span>
                      {item.date && (
                        <span className="text-[10px] text-chalk/70 font-mono">
                          {num(item.date)}
                        </span>
                      )}
                    </div>
                    <h4 className="font-display font-bold text-sm sm:text-base text-white mt-1 leading-snug drop-shadow">
                      {item.label}
                    </h4>
                    {item.caption && (
                      <p className="text-[11px] text-chalk/80 line-clamp-1 mt-0.5">{item.caption}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* ── 4. Lightbox Modal ── */}
        {lightboxImage && (
          <div
            className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md grid place-items-center p-4 sm:p-8 animate-fadeIn"
            onClick={() => setLightboxImage(null)}
          >
            <div
              className="relative max-w-4xl w-full bg-board rounded-3xl overflow-hidden shadow-2xl border border-white/20"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => setLightboxImage(null)}
                className="absolute top-4 right-4 z-10 w-10 h-10 rounded-full bg-black/60 hover:bg-black/90 text-white grid place-items-center transition-all border border-white/20 cursor-pointer"
                aria-label="Close lightbox"
              >
                <X className="w-6 h-6 text-brick" />
              </button>

              <div className="max-h-[70vh] overflow-hidden bg-black grid place-items-center">
                <img
                  src={lightboxImage.src}
                  alt={lightboxImage.label}
                  className="w-full h-full max-h-[70vh] object-contain"
                />
              </div>

              <div className="p-6 bg-board text-chalk">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xs font-bold text-gold uppercase tracking-wider">
                    {lang === 'bn'
                      ? lightboxImage.categoryBn || lightboxImage.category
                      : lightboxImage.category}
                  </span>
                  {lightboxImage.date && (
                    <span className="text-xs text-chalk/60 font-mono">
                      • {num(lightboxImage.date)}
                    </span>
                  )}
                </div>
                <h3 className="font-display font-black text-xl text-white">
                  {lightboxImage.label}
                </h3>
                {lightboxImage.caption && (
                  <p className="text-sm text-chalk/80 mt-1">{lightboxImage.caption}</p>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
