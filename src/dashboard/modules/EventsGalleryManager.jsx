import { useState, useEffect } from 'react'
import {
  CalendarDays,
  Images,
  Plus,
  Search,
  CheckCircle2,
  X,
  Edit2,
  Trash2,
  UploadCloud,
  RotateCcw,
  Sparkles,
  ExternalLink,
  MapPin,
  Clock,
  Filter,
  Eye,
} from 'lucide-react'
import api from '../../lib/api'
import { uploadToImgbb } from '../../lib/imgbb'

const GALLERY_CATEGORIES = [
  'All',
  'Campus',
  'Sports',
  'Science',
  'Cultural',
  'Scouts',
  'Awards',
  'Academic',
]

export default function EventsGalleryManager({ initialSubTab = 'events' }) {
  const [subTab, setSubTab] = useState(initialSubTab) // 'events' | 'gallery'
  const [events, setEvents] = useState([])
  const [gallery, setGallery] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedGalleryCategory, setSelectedGalleryCategory] = useState('All')
  const [toastMessage, setToastMessage] = useState(null)
  const [uploadingImage, setUploadingImage] = useState(false)

  // Event modal state
  const [isEventModalOpen, setIsEventModalOpen] = useState(false)
  const [editingEventId, setEditingEventId] = useState(null)
  const initialEventForm = {
    title: '',
    titleBn: '',
    dateBadge: 'OCT 10',
    fullDate: '10 Oct 2026',
    fullDateBn: '১০ অক্টো ২০২৬',
    time: '9:00 AM - 1:00 PM',
    timeBn: 'সকাল ৯:০০ - দুপুর ১:০০',
    location: 'School Main Auditorium',
    locationBn: 'বিদ্যালয় প্রধান অডিটোরিয়াম',
    desc: '',
    descBn: '',
    category: 'Academic',
    categoryBn: 'একাডেমিক',
    image: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?auto=format&fit=crop&w=800&q=80',
    status: 'Upcoming',
    statusBn: 'আসন্ন',
    isActive: true,
  }
  const [eventFormData, setEventFormData] = useState(initialEventForm)

  // Gallery modal state
  const [isGalleryModalOpen, setIsGalleryModalOpen] = useState(false)
  const [editingGalleryId, setEditingGalleryId] = useState(null)
  const initialGalleryForm = {
    title: '',
    titleBn: '',
    category: 'Campus',
    categoryBn: 'ক্যাম্পাস',
    imageUrl: 'https://images.unsplash.com/photo-1541829070764-84a7d30dd3f3?auto=format&fit=crop&w=800&q=80',
    caption: '',
    captionBn: '',
    date: '2026',
    isActive: true,
  }
  const [galleryFormData, setGalleryFormData] = useState(initialGalleryForm)

  const showToast = (msg) => {
    setToastMessage(msg)
    setTimeout(() => setToastMessage(null), 3500)
  }

  const fetchData = async () => {
    setLoading(true)
    try {
      const [eventsRes, galleryRes] = await Promise.all([
        api.getEvents(),
        api.getGallery(),
      ])
      if (eventsRes && eventsRes.success && Array.isArray(eventsRes.data)) {
        setEvents(eventsRes.data)
        localStorage.setItem('mpa_events_cache', JSON.stringify(eventsRes.data))
      }
      if (galleryRes && galleryRes.success && Array.isArray(galleryRes.data)) {
        setGallery(galleryRes.data)
        localStorage.setItem('mpa_gallery_cache', JSON.stringify(galleryRes.data))
      }
    } catch (err) {
      console.warn('Error fetching events or gallery', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  /* ─────────────── EVENT HANDLERS ─────────────── */
  const handleOpenAddEvent = () => {
    setEditingEventId(null)
    setEventFormData(initialEventForm)
    setIsEventModalOpen(true)
  }

  const handleOpenEditEvent = (ev) => {
    setEditingEventId(ev._id || ev.id)
    setEventFormData({
      title: ev.title || '',
      titleBn: ev.titleBn || '',
      dateBadge: ev.dateBadge || 'EVT',
      fullDate: ev.fullDate || '',
      fullDateBn: ev.fullDateBn || '',
      time: ev.time || '',
      timeBn: ev.timeBn || '',
      location: ev.location || '',
      locationBn: ev.locationBn || '',
      desc: ev.desc || '',
      descBn: ev.descBn || '',
      category: ev.category || 'Academic',
      categoryBn: ev.categoryBn || 'একাডেমিক',
      image: ev.image || '',
      status: ev.status || 'Upcoming',
      statusBn: ev.statusBn || 'আসন্ন',
      isActive: ev.isActive !== false,
    })
    setIsEventModalOpen(true)
  }

  const handleUploadEventImage = async (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    setUploadingImage(true)
    try {
      const url = await uploadToImgbb(file)
      if (url) {
        setEventFormData((prev) => ({ ...prev, image: url }))
        showToast('✓ Event image uploaded to ImgBB')
      }
    } catch (err) {
      console.error(err)
      showToast('⚠ Image upload failed')
    } finally {
      setUploadingImage(false)
    }
  }

  const handleSaveEvent = async (e) => {
    e.preventDefault()
    if (!eventFormData.title.trim()) {
      showToast('⚠ Event title is required')
      return
    }

    try {
      if (editingEventId) {
        const res = await api.updateEvent(editingEventId, eventFormData)
        if (res && res.success) {
          showToast(`✓ Event "${eventFormData.title}" updated successfully!`)
        }
      } else {
        const res = await api.createEvent(eventFormData)
        if (res && res.success) {
          showToast(`✓ Event "${eventFormData.title}" created successfully!`)
        }
      }
      setIsEventModalOpen(false)
      await fetchData()
      window.dispatchEvent(new Event('mpa_events_updated'))
    } catch (err) {
      console.error(err)
      showToast('⚠ Server error saving event')
    }
  }

  const handleDeleteEvent = async (id, title) => {
    if (!window.confirm(`Delete event "${title}"?`)) return
    try {
      const res = await api.deleteEvent(id)
      if (res && res.success) {
        showToast(`✓ Event "${title}" deleted`)
        await fetchData()
        window.dispatchEvent(new Event('mpa_events_updated'))
      }
    } catch (err) {
      console.error(err)
      showToast('⚠ Delete failed')
    }
  }

  const handleResetEvents = async () => {
    if (!window.confirm('Reset events to default seed data from MongoDB?')) return
    try {
      const res = await api.resetEvents()
      if (res && res.success) {
        showToast('✓ Events reset to default seed data')
        await fetchData()
        window.dispatchEvent(new Event('mpa_events_updated'))
      }
    } catch (err) {
      console.error(err)
      showToast('⚠ Reset error')
    }
  }

  /* ─────────────── GALLERY HANDLERS ─────────────── */
  const handleOpenAddGallery = () => {
    setEditingGalleryId(null)
    setGalleryFormData(initialGalleryForm)
    setIsGalleryModalOpen(true)
  }

  const handleOpenEditGallery = (g) => {
    setEditingGalleryId(g._id || g.id)
    setGalleryFormData({
      title: g.title || '',
      titleBn: g.titleBn || '',
      category: g.category || 'Campus',
      categoryBn: g.categoryBn || 'ক্যাম্পাস',
      imageUrl: g.imageUrl || '',
      caption: g.caption || '',
      captionBn: g.captionBn || '',
      date: g.date || '2026',
      isActive: g.isActive !== false,
    })
    setIsGalleryModalOpen(true)
  }

  const handleUploadGalleryImage = async (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    setUploadingImage(true)
    try {
      const url = await uploadToImgbb(file)
      if (url) {
        setGalleryFormData((prev) => ({ ...prev, imageUrl: url }))
        showToast('✓ Photo uploaded to ImgBB')
      }
    } catch (err) {
      console.error(err)
      showToast('⚠ Image upload failed')
    } finally {
      setUploadingImage(false)
    }
  }

  const handleSaveGallery = async (e) => {
    e.preventDefault()
    if (!galleryFormData.title.trim() || !galleryFormData.imageUrl.trim()) {
      showToast('⚠ Title and Image URL are required')
      return
    }

    try {
      if (editingGalleryId) {
        const res = await api.updateGalleryItem(editingGalleryId, galleryFormData)
        if (res && res.success) {
          showToast(`✓ Photo "${galleryFormData.title}" updated!`)
        }
      } else {
        const res = await api.createGalleryItem(galleryFormData)
        if (res && res.success) {
          showToast(`✓ New photo "${galleryFormData.title}" added to gallery!`)
        }
      }
      setIsGalleryModalOpen(false)
      await fetchData()
      window.dispatchEvent(new Event('mpa_gallery_updated'))
    } catch (err) {
      console.error(err)
      showToast('⚠ Server error saving gallery item')
    }
  }

  const handleDeleteGallery = async (id, title) => {
    if (!window.confirm(`Delete photo "${title}" from gallery?`)) return
    try {
      const res = await api.deleteGalleryItem(id)
      if (res && res.success) {
        showToast(`✓ Removed photo "${title}"`)
        await fetchData()
        window.dispatchEvent(new Event('mpa_gallery_updated'))
      }
    } catch (err) {
      console.error(err)
      showToast('⚠ Delete failed')
    }
  }

  const handleResetGallery = async () => {
    if (!window.confirm('Reset photo gallery to default seed photos?')) return
    try {
      const res = await api.resetGallery()
      if (res && res.success) {
        showToast('✓ Photo gallery restored to default seed')
        await fetchData()
        window.dispatchEvent(new Event('mpa_gallery_updated'))
      }
    } catch (err) {
      console.error(err)
      showToast('⚠ Reset error')
    }
  }

  /* ─────────────── FILTERING ─────────────── */
  const filteredEvents = events.filter((e) => {
    const q = searchQuery.toLowerCase().trim()
    if (!q) return true
    return (
      (e.title && e.title.toLowerCase().includes(q)) ||
      (e.titleBn && e.titleBn.toLowerCase().includes(q)) ||
      (e.location && e.location.toLowerCase().includes(q))
    )
  })

  const filteredGallery = gallery.filter((g) => {
    const matchCat =
      selectedGalleryCategory === 'All' ||
      (g.category || '').toLowerCase() === selectedGalleryCategory.toLowerCase()
    const q = searchQuery.toLowerCase().trim()
    const matchQ =
      !q ||
      (g.title && g.title.toLowerCase().includes(q)) ||
      (g.titleBn && g.titleBn.toLowerCase().includes(q))
    return matchCat && matchQ
  })

  return (
    <div className="space-y-6">
      {/* Toast Alert */}
      {toastMessage && (
        <div className="fixed top-5 right-5 z-[100] bg-emerald-500/90 text-white px-5 py-3 rounded-xl shadow-2xl backdrop-blur-md border border-emerald-400/30 font-medium text-sm flex items-center gap-2 animate-bounce">
          <CheckCircle2 className="w-5 h-5 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Header Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-[#16161f] p-6 rounded-2xl border border-[#1e1e2e]">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-sky-400 uppercase tracking-wider mb-1">
            <CalendarDays className="w-4 h-4 text-sky-400" />
            <span>School Events Calendar & Photo Gallery</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-black text-white flex items-center gap-2">
            Events & Gallery Manager <span className="text-xs bg-sky-500/10 text-sky-400 border border-sky-500/20 px-2.5 py-0.5 rounded-full font-bold">Live DB</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Manage upcoming school programs, competitions, academic events, and the campus photography showcase.
          </p>
        </div>

        <div className="flex items-center gap-2.5 flex-wrap">
          <a
            href="/events"
            target="_blank"
            rel="noreferrer"
            className="px-4 py-2 rounded-xl text-xs font-semibold bg-[#1c1c28] text-slate-300 hover:text-white hover:bg-[#252538] border border-[#2a2a3d] transition flex items-center gap-1.5"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            <span>Live Page</span>
          </a>

          {subTab === 'events' ? (
            <>
              <button
                onClick={handleResetEvents}
                className="px-3.5 py-2 rounded-xl text-xs font-semibold bg-[#1c1c28] text-slate-400 hover:text-sky-400 hover:bg-[#252538] border border-[#2a2a3d] transition flex items-center gap-1.5"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reset Defaults</span>
              </button>
              <button
                onClick={handleOpenAddEvent}
                className="px-4 py-2 rounded-xl text-xs font-bold bg-gradient-to-r from-sky-500 to-[#6c63ff] hover:from-sky-400 hover:to-[#5a52e0] text-white shadow-lg shadow-sky-500/20 transition flex items-center gap-1.5"
              >
                <Plus className="w-4 h-4" />
                <span>Publish New Event</span>
              </button>
            </>
          ) : (
            <>
              <button
                onClick={handleResetGallery}
                className="px-3.5 py-2 rounded-xl text-xs font-semibold bg-[#1c1c28] text-slate-400 hover:text-sky-400 hover:bg-[#252538] border border-[#2a2a3d] transition flex items-center gap-1.5"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reset Photos</span>
              </button>
              <button
                onClick={handleOpenAddGallery}
                className="px-4 py-2 rounded-xl text-xs font-bold bg-gradient-to-r from-sky-500 to-[#6c63ff] hover:from-sky-400 hover:to-[#5a52e0] text-white shadow-lg shadow-sky-500/20 transition flex items-center gap-1.5"
              >
                <Plus className="w-4 h-4" />
                <span>Add Photo to Gallery</span>
              </button>
            </>
          )}
        </div>
      </div>

      {/* Main Tabs Strip (Events vs Gallery) */}
      <div className="flex items-center justify-between gap-4 flex-wrap border-b border-[#1e1e2e] pb-3">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setSubTab('events')}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold transition flex items-center gap-2 ${
              subTab === 'events'
                ? 'bg-sky-500 text-slate-950 shadow-md shadow-sky-500/20'
                : 'bg-[#16161f] text-slate-400 hover:text-white hover:bg-[#1f1f2e] border border-[#1e1e2e]'
            }`}
          >
            <CalendarDays className="w-4 h-4" />
            <span>School Calendar Events</span>
            <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-black/20 font-mono font-bold">
              {events.length}
            </span>
          </button>

          <button
            onClick={() => setSubTab('gallery')}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold transition flex items-center gap-2 ${
              subTab === 'gallery'
                ? 'bg-sky-500 text-slate-950 shadow-md shadow-sky-500/20'
                : 'bg-[#16161f] text-slate-400 hover:text-white hover:bg-[#1f1f2e] border border-[#1e1e2e]'
            }`}
          >
            <Images className="w-4 h-4" />
            <span>Campus Photo Gallery</span>
            <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-black/20 font-mono font-bold">
              {gallery.length}
            </span>
          </button>
        </div>

        {/* Search */}
        <div className="relative w-full sm:w-64">
          <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder={subTab === 'events' ? 'Search events...' : 'Search gallery photos...'}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-[#16161f] border border-[#1e1e2e] focus:border-sky-500/50 rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder-slate-500 outline-none transition"
          />
        </div>
      </div>

      {/* ───────────────── SUBTAB: EVENTS ───────────────── */}
      {subTab === 'events' && (
        <>
          {loading ? (
            <div className="py-20 text-center">
              <div className="w-10 h-10 border-4 border-sky-500/20 border-t-sky-500 rounded-full animate-spin mx-auto mb-3" />
              <p className="text-xs text-slate-400">Loading events from MongoDB...</p>
            </div>
          ) : filteredEvents.length === 0 ? (
            <div className="bg-[#16161f] border border-[#1e1e2e] rounded-2xl p-12 text-center">
              <CalendarDays className="w-12 h-12 text-slate-600 mx-auto mb-3" />
              <p className="text-sm font-bold text-white">No Events Found</p>
              <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
                No events currently scheduled. Click "Publish New Event" or "Reset Defaults" to add.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredEvents.map((ev, idx) => (
                <div
                  key={ev._id || ev.id || idx}
                  className="bg-[#16161f] border border-[#1e1e2e] hover:border-sky-500/40 rounded-2xl overflow-hidden transition-all duration-300 flex flex-col justify-between group shadow-lg hover:shadow-sky-500/5"
                >
                  <div>
                    {/* Event Banner */}
                    <div className="relative h-44 w-full bg-[#101016] overflow-hidden">
                      <img
                        src={ev.image || 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?auto=format&fit=crop&w=800&q=80'}
                        alt={ev.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        onError={(e) => {
                          e.target.src = 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?auto=format&fit=crop&w=800&q=80'
                        }}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#16161f] via-transparent to-black/40" />

                      {/* Date Badge */}
                      <div className="absolute top-3 left-3 bg-sky-500 text-slate-950 font-black text-xs px-2.5 py-1 rounded-lg shadow-lg font-mono">
                        {ev.dateBadge || 'EVT'}
                      </div>

                      {/* Status */}
                      <div className="absolute top-3 right-3 bg-black/60 backdrop-blur-md border border-white/10 text-white font-bold text-[10px] px-2 py-0.5 rounded-full">
                        {ev.status || 'Upcoming'}
                      </div>
                    </div>

                    {/* Content */}
                    <div className="p-4 space-y-2.5">
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-[#6c63ff]/15 text-[#a78bfa] border border-[#6c63ff]/20">
                          {ev.category || 'Academic'}
                        </span>
                        <span className="text-[11px] text-slate-400 font-medium">
                          {ev.fullDate || ev.fullDateBn}
                        </span>
                      </div>

                      <h3 className="text-sm font-bold text-white group-hover:text-sky-400 transition line-clamp-1">
                        {ev.title}
                      </h3>
                      {ev.titleBn && (
                        <p className="text-xs text-slate-300 font-medium line-clamp-1">{ev.titleBn}</p>
                      )}

                      <div className="space-y-1 pt-1 text-[11px] text-slate-400">
                        <div className="flex items-center gap-1.5 truncate">
                          <Clock className="w-3.5 h-3.5 text-sky-400 shrink-0" />
                          <span>{ev.time || ev.timeBn || 'Schedule TBA'}</span>
                        </div>
                        <div className="flex items-center gap-1.5 truncate">
                          <MapPin className="w-3.5 h-3.5 text-rose-400 shrink-0" />
                          <span>{ev.location || ev.locationBn || 'School Campus'}</span>
                        </div>
                      </div>

                      {(ev.desc || ev.descBn) && (
                        <p className="text-[11px] text-slate-400 line-clamp-2 pt-1 border-t border-[#1e1e2e]">
                          {ev.desc || ev.descBn}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="p-4 pt-0 flex items-center justify-between border-t border-[#1e1e2e] mt-3">
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${ev.isActive !== false ? 'bg-emerald-500/10 text-emerald-400' : 'bg-slate-500/10 text-slate-400'}`}>
                      {ev.isActive !== false ? 'Active' : 'Hidden'}
                    </span>

                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => handleOpenEditEvent(ev)}
                        className="p-1.5 rounded-lg bg-[#1c1c28] hover:bg-[#252538] text-slate-300 hover:text-white transition"
                        title="Edit event"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleDeleteEvent(ev._id || ev.id, ev.title)}
                        className="p-1.5 rounded-lg bg-[#1c1c28] hover:bg-rose-500/20 text-slate-400 hover:text-rose-400 transition"
                        title="Delete event"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}

      {/* ───────────────── SUBTAB: GALLERY ───────────────── */}
      {subTab === 'gallery' && (
        <>
          {/* Gallery Category Filter Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
            {GALLERY_CATEGORIES.map((cat) => {
              const count = cat === 'All' ? gallery.length : gallery.filter((g) => (g.category || '').toLowerCase() === cat.toLowerCase()).length
              const isSelected = selectedGalleryCategory === cat
              return (
                <button
                  key={cat}
                  onClick={() => setSelectedGalleryCategory(cat)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-2 whitespace-nowrap ${
                    isSelected
                      ? 'bg-sky-500 text-slate-950 shadow-md shadow-sky-500/20'
                      : 'bg-[#16161f] text-slate-400 hover:text-white hover:bg-[#1f1f2e] border border-[#1e1e2e]'
                  }`}
                >
                  <span>{cat}</span>
                  <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono ${isSelected ? 'bg-black/20 text-slate-950 font-black' : 'bg-white/10 text-slate-300'}`}>
                    {count}
                  </span>
                </button>
              )
            })}
          </div>

          {loading ? (
            <div className="py-20 text-center">
              <div className="w-10 h-10 border-4 border-sky-500/20 border-t-sky-500 rounded-full animate-spin mx-auto mb-3" />
              <p className="text-xs text-slate-400">Loading gallery photos from MongoDB...</p>
            </div>
          ) : filteredGallery.length === 0 ? (
            <div className="bg-[#16161f] border border-[#1e1e2e] rounded-2xl p-12 text-center">
              <Images className="w-12 h-12 text-slate-600 mx-auto mb-3" />
              <p className="text-sm font-bold text-white">No Photos Found</p>
              <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
                No photos in this category. Click "Add Photo to Gallery" or "Reset Photos" to restore defaults.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {filteredGallery.map((item, idx) => (
                <div
                  key={item._id || item.id || idx}
                  className="bg-[#16161f] border border-[#1e1e2e] hover:border-sky-500/40 rounded-2xl overflow-hidden transition-all duration-300 flex flex-col justify-between group shadow-lg hover:shadow-sky-500/5"
                >
                  <div className="relative aspect-video w-full bg-[#101016] overflow-hidden">
                    <img
                      src={item.imageUrl}
                      alt={item.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-3">
                      <p className="text-[11px] text-white line-clamp-2">
                        {item.caption || item.captionBn || item.title}
                      </p>
                    </div>
                    <div className="absolute top-2 left-2 bg-black/60 backdrop-blur-md border border-white/10 text-white font-bold text-[10px] px-2 py-0.5 rounded-full">
                      {item.category || 'Campus'}
                    </div>
                  </div>

                  <div className="p-3.5 space-y-2">
                    <h3 className="text-xs font-bold text-white group-hover:text-sky-400 transition truncate">
                      {item.title}
                    </h3>
                    {item.titleBn && (
                      <p className="text-[11px] text-slate-400 truncate">{item.titleBn}</p>
                    )}

                    <div className="flex items-center justify-between pt-2 border-t border-[#1e1e2e]">
                      <span className="text-[10px] text-slate-500 font-mono">{item.date || '2026'}</span>

                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={() => handleOpenEditGallery(item)}
                          className="p-1 rounded-md bg-[#1c1c28] hover:bg-[#252538] text-slate-300 hover:text-white transition"
                          title="Edit photo details"
                        >
                          <Edit2 className="w-3 h-3" />
                        </button>
                        <button
                          onClick={() => handleDeleteGallery(item._id || item.id, item.title)}
                          className="p-1 rounded-md bg-[#1c1c28] hover:bg-rose-500/20 text-slate-400 hover:text-rose-400 transition"
                          title="Delete photo"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}

      {/* ───────────────── EVENT ADD/EDIT MODAL ───────────────── */}
      {isEventModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto">
          <div className="bg-[#16161f] border border-[#2a2a3d] rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto moom-scrollbar shadow-2xl p-6 relative">
            <button
              onClick={() => setIsEventModalOpen(false)}
              className="absolute top-5 right-5 text-slate-400 hover:text-white p-1 rounded-lg bg-[#1c1c28] hover:bg-[#252538] transition"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2 mb-6">
              <CalendarDays className="w-6 h-6 text-sky-400" />
              <h2 className="text-lg font-bold text-white">
                {editingEventId ? 'Edit Event Schedule' : 'Publish New School Event'}
              </h2>
            </div>

            <form onSubmit={handleSaveEvent} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">
                    Event Title (English) <span className="text-rose-400">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={eventFormData.title}
                    onChange={(e) => setEventFormData({ ...eventFormData, title: e.target.value })}
                    placeholder="e.g. Annual Sports & Athletic Meet 2026"
                    className="w-full bg-[#12121a] border border-[#202030] focus:border-sky-500/50 rounded-xl px-3 py-2.5 text-white placeholder-slate-600 outline-none transition"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Event Title (বাংলা)</label>
                  <input
                    type="text"
                    value={eventFormData.titleBn}
                    onChange={(e) => setEventFormData({ ...eventFormData, titleBn: e.target.value })}
                    placeholder="যেমন: বার্ষিক ক্রীড়া প্রতিযোগিতা ২০২৬"
                    className="w-full bg-[#12121a] border border-[#202030] focus:border-sky-500/50 rounded-xl px-3 py-2.5 text-white placeholder-slate-600 outline-none transition"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Date Badge (Card)</label>
                  <input
                    type="text"
                    value={eventFormData.dateBadge}
                    onChange={(e) => setEventFormData({ ...eventFormData, dateBadge: e.target.value })}
                    placeholder="e.g. OCT 10"
                    className="w-full bg-[#12121a] border border-[#202030] focus:border-sky-500/50 rounded-xl px-3 py-2.5 text-white outline-none transition font-mono uppercase"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Full Date (English)</label>
                  <input
                    type="text"
                    value={eventFormData.fullDate}
                    onChange={(e) => setEventFormData({ ...eventFormData, fullDate: e.target.value })}
                    placeholder="e.g. 10 Oct 2026"
                    className="w-full bg-[#12121a] border border-[#202030] focus:border-sky-500/50 rounded-xl px-3 py-2.5 text-white outline-none transition"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Full Date (বাংলা)</label>
                  <input
                    type="text"
                    value={eventFormData.fullDateBn}
                    onChange={(e) => setEventFormData({ ...eventFormData, fullDateBn: e.target.value })}
                    placeholder="যেমন: ১০ অক্টো ২০২৬"
                    className="w-full bg-[#12121a] border border-[#202030] focus:border-sky-500/50 rounded-xl px-3 py-2.5 text-white outline-none transition"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Time (English / Bn)</label>
                  <input
                    type="text"
                    value={eventFormData.time}
                    onChange={(e) => setEventFormData({ ...eventFormData, time: e.target.value })}
                    placeholder="e.g. 9:00 AM - 1:00 PM"
                    className="w-full bg-[#12121a] border border-[#202030] focus:border-sky-500/50 rounded-xl px-3 py-2.5 text-white outline-none transition"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Location / Venue</label>
                  <input
                    type="text"
                    value={eventFormData.location}
                    onChange={(e) => setEventFormData({ ...eventFormData, location: e.target.value })}
                    placeholder="e.g. School Playground & Auditorium"
                    className="w-full bg-[#12121a] border border-[#202030] focus:border-sky-500/50 rounded-xl px-3 py-2.5 text-white outline-none transition"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Category</label>
                  <select
                    value={eventFormData.category}
                    onChange={(e) => setEventFormData({ ...eventFormData, category: e.target.value })}
                    className="w-full bg-[#12121a] border border-[#202030] focus:border-sky-500/50 rounded-xl px-3 py-2.5 text-white outline-none transition"
                  >
                    <option value="Academic">Academic (একাডেমিক)</option>
                    <option value="Sports">Sports (ক্রীড়া)</option>
                    <option value="Cultural">Cultural (সাংস্কৃতিক)</option>
                    <option value="Science">Science Fair (বিজ্ঞান মেলা)</option>
                    <option value="National">National Day (জাতীয় দিবস)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Status</label>
                  <select
                    value={eventFormData.status}
                    onChange={(e) => setEventFormData({ ...eventFormData, status: e.target.value })}
                    className="w-full bg-[#12121a] border border-[#202030] focus:border-sky-500/50 rounded-xl px-3 py-2.5 text-white outline-none transition"
                  >
                    <option value="Upcoming">Upcoming (আসন্ন)</option>
                    <option value="Ongoing">Ongoing (চলমান)</option>
                    <option value="Completed">Completed (সম্পন্ন)</option>
                  </select>
                </div>
              </div>

              {/* Event Cover Image */}
              <div>
                <label className="block text-slate-300 font-semibold mb-1">Cover Image</label>
                <div className="flex flex-col sm:flex-row gap-3 items-center">
                  <div className="relative w-20 h-12 shrink-0 rounded-xl overflow-hidden border border-[#2a2a3d] bg-black">
                    <img
                      src={eventFormData.image || 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?auto=format&fit=crop&w=800&q=80'}
                      alt="Event Preview"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <input
                    type="text"
                    value={eventFormData.image}
                    onChange={(e) => setEventFormData({ ...eventFormData, image: e.target.value })}
                    placeholder="https://... image URL"
                    className="flex-1 w-full bg-[#12121a] border border-[#202030] focus:border-sky-500/50 rounded-xl px-3 py-2 text-white outline-none transition text-xs"
                  />
                  <label className="cursor-pointer px-3.5 py-2 rounded-xl bg-[#1c1c28] hover:bg-[#26263a] text-slate-300 hover:text-white border border-[#2a2a3d] font-semibold flex items-center gap-1.5 shrink-0 transition">
                    <UploadCloud className="w-4 h-4 text-sky-400" />
                    <span>{uploadingImage ? 'Uploading...' : 'Upload Image'}</span>
                    <input type="file" accept="image/*" className="hidden" onChange={handleUploadEventImage} disabled={uploadingImage} />
                  </label>
                </div>
              </div>

              {/* Description */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Description (English)</label>
                  <textarea
                    rows={3}
                    value={eventFormData.desc}
                    onChange={(e) => setEventFormData({ ...eventFormData, desc: e.target.value })}
                    placeholder="Event details, schedule outline..."
                    className="w-full bg-[#12121a] border border-[#202030] focus:border-sky-500/50 rounded-xl px-3 py-2 text-white outline-none transition text-xs"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Description (বাংলা)</label>
                  <textarea
                    rows={3}
                    value={eventFormData.descBn}
                    onChange={(e) => setEventFormData({ ...eventFormData, descBn: e.target.value })}
                    placeholder="ইভেন্টের বিস্তারিত তথ্য ও সময়সূচি..."
                    className="w-full bg-[#12121a] border border-[#202030] focus:border-sky-500/50 rounded-xl px-3 py-2 text-white outline-none transition text-xs"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#1e1e2e]">
                <button
                  type="button"
                  onClick={() => setIsEventModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-[#1c1c28] text-slate-300 hover:text-white border border-[#2a2a3d] font-semibold transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-gradient-to-r from-sky-500 to-[#6c63ff] hover:from-sky-400 hover:to-[#5a52e0] text-white font-bold shadow-lg shadow-sky-500/20 transition flex items-center gap-1.5"
                >
                  <CalendarDays className="w-4 h-4" />
                  <span>{editingEventId ? 'Save Changes' : 'Publish Event'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ───────────────── GALLERY ADD/EDIT MODAL ───────────────── */}
      {isGalleryModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto">
          <div className="bg-[#16161f] border border-[#2a2a3d] rounded-2xl w-full max-w-xl max-h-[90vh] overflow-y-auto moom-scrollbar shadow-2xl p-6 relative">
            <button
              onClick={() => setIsGalleryModalOpen(false)}
              className="absolute top-5 right-5 text-slate-400 hover:text-white p-1 rounded-lg bg-[#1c1c28] hover:bg-[#252538] transition"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2 mb-6">
              <Images className="w-6 h-6 text-sky-400" />
              <h2 className="text-lg font-bold text-white">
                {editingGalleryId ? 'Edit Photo Information' : 'Add Photo to School Gallery'}
              </h2>
            </div>

            <form onSubmit={handleSaveGallery} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">
                    Photo Title (English) <span className="text-rose-400">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={galleryFormData.title}
                    onChange={(e) => setGalleryFormData({ ...galleryFormData, title: e.target.value })}
                    placeholder="e.g. Science Fair Innovation Lab"
                    className="w-full bg-[#12121a] border border-[#202030] focus:border-sky-500/50 rounded-xl px-3 py-2.5 text-white placeholder-slate-600 outline-none transition"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Photo Title (বাংলা)</label>
                  <input
                    type="text"
                    value={galleryFormData.titleBn}
                    onChange={(e) => setGalleryFormData({ ...galleryFormData, titleBn: e.target.value })}
                    placeholder="যেমন: বিজ্ঞান মেলা ও উদ্ভাবনী ল্যাব"
                    className="w-full bg-[#12121a] border border-[#202030] focus:border-sky-500/50 rounded-xl px-3 py-2.5 text-white placeholder-slate-600 outline-none transition"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Category</label>
                  <select
                    value={galleryFormData.category}
                    onChange={(e) => setGalleryFormData({ ...galleryFormData, category: e.target.value })}
                    className="w-full bg-[#12121a] border border-[#202030] focus:border-sky-500/50 rounded-xl px-3 py-2.5 text-white outline-none transition"
                  >
                    <option value="Campus">Campus & Buildings</option>
                    <option value="Sports">Sports & Athletics</option>
                    <option value="Science">Science & Lab</option>
                    <option value="Cultural">Cultural & Arts</option>
                    <option value="Scouts">Scouts & BNCC</option>
                    <option value="Awards">Awards & Honors</option>
                    <option value="Academic">Academic Classrooms</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Year</label>
                  <input
                    type="text"
                    value={galleryFormData.date}
                    onChange={(e) => setGalleryFormData({ ...galleryFormData, date: e.target.value })}
                    placeholder="2026"
                    className="w-full bg-[#12121a] border border-[#202030] focus:border-sky-500/50 rounded-xl px-3 py-2.5 text-white outline-none transition font-mono"
                  />
                </div>
              </div>

              {/* Photo Upload / URL */}
              <div>
                <label className="block text-slate-300 font-semibold mb-1">
                  Photo URL <span className="text-rose-400">*</span>
                </label>
                <div className="flex flex-col sm:flex-row gap-3 items-center">
                  <div className="relative w-16 h-12 shrink-0 rounded-xl overflow-hidden border border-[#2a2a3d] bg-black">
                    <img
                      src={galleryFormData.imageUrl}
                      alt="Gallery Preview"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <input
                    type="text"
                    required
                    value={galleryFormData.imageUrl}
                    onChange={(e) => setGalleryFormData({ ...galleryFormData, imageUrl: e.target.value })}
                    placeholder="https://... photo link or upload below"
                    className="flex-1 w-full bg-[#12121a] border border-[#202030] focus:border-sky-500/50 rounded-xl px-3 py-2 text-white outline-none transition text-xs"
                  />
                  <label className="cursor-pointer px-3.5 py-2 rounded-xl bg-[#1c1c28] hover:bg-[#26263a] text-slate-300 hover:text-white border border-[#2a2a3d] font-semibold flex items-center gap-1.5 shrink-0 transition">
                    <UploadCloud className="w-4 h-4 text-sky-400" />
                    <span>{uploadingImage ? 'Uploading...' : 'Upload'}</span>
                    <input type="file" accept="image/*" className="hidden" onChange={handleUploadGalleryImage} disabled={uploadingImage} />
                  </label>
                </div>
              </div>

              {/* Caption */}
              <div>
                <label className="block text-slate-300 font-semibold mb-1">Short Caption / Description</label>
                <textarea
                  rows={2}
                  value={galleryFormData.caption}
                  onChange={(e) => setGalleryFormData({ ...galleryFormData, caption: e.target.value })}
                  placeholder="Optional brief description of this photo..."
                  className="w-full bg-[#12121a] border border-[#202030] focus:border-sky-500/50 rounded-xl px-3 py-2 text-white outline-none transition text-xs"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#1e1e2e]">
                <button
                  type="button"
                  onClick={() => setIsGalleryModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-[#1c1c28] text-slate-300 hover:text-white border border-[#2a2a3d] font-semibold transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-gradient-to-r from-sky-500 to-[#6c63ff] hover:from-sky-400 hover:to-[#5a52e0] text-white font-bold shadow-lg shadow-sky-500/20 transition flex items-center gap-1.5"
                >
                  <Images className="w-4 h-4" />
                  <span>{editingGalleryId ? 'Save Changes' : 'Add to Gallery'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
