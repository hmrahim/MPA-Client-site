import { useState, useEffect, useMemo } from 'react'
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
  Tag,
  Save,
  Check,
  Calendar,
  Layers,
  AlertCircle,
  Maximize2,
} from 'lucide-react'
import api from '../../lib/api'
import { uploadToImgbb } from '../../lib/imgbb'
import EventDeleteAlert from '../components/EventDeleteAlert'

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

const EVENT_CATEGORIES = [
  { id: 'All', en: 'All', bn: 'সকল' },
  { id: 'Academic', en: 'Academic', bn: 'একাডেমিক' },
  { id: 'Exam', en: 'Exam', bn: 'পরীক্ষা' },
  { id: 'Sports', en: 'Sports', bn: 'ক্রীড়া' },
  { id: 'Cultural', en: 'Cultural', bn: 'সাংস্কৃতিক' },
  { id: 'Science', en: 'Science', bn: 'বিজ্ঞান' },
  { id: 'National', en: 'National', bn: 'জাতীয় দিবস' },
  { id: 'Awards', en: 'Awards', bn: 'পুরস্কার' },
]

const EVENT_STATUSES = [
  { id: 'Upcoming', en: 'Upcoming', bn: 'আসন্ন' },
  { id: 'Registration Open', en: 'Registration Open', bn: 'নিবন্ধন চলছে' },
  { id: 'Ongoing', en: 'Ongoing', bn: 'চলমান' },
  { id: 'Completed', en: 'Completed', bn: 'সম্পন্ন' },
]

const DEFAULT_CONFIG = {
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

export default function EventsGalleryManager({ initialSubTab = 'events' }) {
  const [subTab, setSubTab] = useState(initialSubTab) // 'events' | 'gallery' | 'headers' | 'preview'
  const [events, setEvents] = useState([])
  const [gallery, setGallery] = useState([])
  const [config, setConfig] = useState(DEFAULT_CONFIG)
  const [loading, setLoading] = useState(true)
  const [savingConfig, setSavingConfig] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedGalleryCategory, setSelectedGalleryCategory] = useState('All')
  const [selectedGalleryVisibility, setSelectedGalleryVisibility] = useState('All')
  const [selectedGalleryYear, setSelectedGalleryYear] = useState('All')
  const [selectedEventCategory, setSelectedEventCategory] = useState('All')
  const [selectedEventStatus, setSelectedEventStatus] = useState('All')
  const [selectedEventVisibility, setSelectedEventVisibility] = useState('All')
  const [toastMessage, setToastMessage] = useState(null)
  const [uploadingImage, setUploadingImage] = useState(false)
  const [previewLang, setPreviewLang] = useState('bn')
  const [previewLightbox, setPreviewLightbox] = useState(null)

  const availableYears = useMemo(() => {
    const set = new Set()
    gallery.forEach((g) => {
      if (g.date) set.add(String(g.date).trim())
    })
    return Array.from(set).sort().reverse()
  }, [gallery])

  // Delete Alert Modal state
  const [itemToDelete, setItemToDelete] = useState(null)
  const [deleteType, setDeleteType] = useState('event') // 'event' | 'photo'
  const [isDeleting, setIsDeleting] = useState(false)

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

  const showToast = (msg, type = 'success') => {
    setToastMessage({ text: msg, type })
    setTimeout(() => setToastMessage(null), 3500)
  }

  const broadcastEventsUpdated = () => {
    window.dispatchEvent(new CustomEvent('mpa_events_updated'))
  }

  const broadcastGalleryUpdated = () => {
    window.dispatchEvent(new CustomEvent('mpa_gallery_updated'))
  }

  const broadcastConfigUpdated = () => {
    window.dispatchEvent(new CustomEvent('mpa_events_config_updated'))
  }

  const fetchData = async () => {
    setLoading(true)
    try {
      const [eventsRes, galleryRes, configRes] = await Promise.all([
        api.getEvents(),
        api.getGallery(),
        api.getEventPageConfig(),
      ])

      if (eventsRes && eventsRes.success && Array.isArray(eventsRes.data)) {
        setEvents(eventsRes.data)
        localStorage.setItem('mpa_events_cache', JSON.stringify(eventsRes.data))
      }
      if (galleryRes && galleryRes.success && Array.isArray(galleryRes.data)) {
        setGallery(galleryRes.data)
        localStorage.setItem('mpa_gallery_cache', JSON.stringify(galleryRes.data))
      }
      if (configRes && configRes.success && configRes.data) {
        setConfig(configRes.data)
        localStorage.setItem('mpa_events_config_cache', JSON.stringify(configRes.data))
      }
    } catch (err) {
      console.warn('Error fetching events or gallery', err)
      showToast('⚠ Could not connect to backend server', 'error')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  /* ─────────────── PAGE HEADERS SAVE ─────────────── */
  const handleSaveConfig = async (e) => {
    if (e) e.preventDefault()
    setSavingConfig(true)
    try {
      const res = await api.updateEventPageConfig(config)
      if (res && res.success) {
        setConfig(res.data)
        localStorage.setItem('mpa_events_config_cache', JSON.stringify(res.data))
        broadcastConfigUpdated()
        showToast('✓ Word-to-word section headings saved successfully! 🎉')
      } else {
        showToast('⚠ Failed to save page settings', 'error')
      }
    } catch (err) {
      console.error(err)
      showToast('⚠ Error saving page settings', 'error')
    } finally {
      setSavingConfig(false)
    }
  }

  const handleResetConfig = async () => {
    if (!window.confirm('Reset all Event & Gallery page headings to default bilingual texts?')) return
    try {
      const res = await api.resetEventPageConfig()
      if (res && res.success) {
        setConfig(res.data)
        localStorage.setItem('mpa_events_config_cache', JSON.stringify(res.data))
        broadcastConfigUpdated()
        showToast('✓ Page headings reset to default')
      }
    } catch (err) {
      console.error(err)
      showToast('⚠ Reset error', 'error')
    }
  }

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
      dateBadge: ev.dateBadge || 'OCT 10',
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

  const handleToggleEventActive = async (ev) => {
    const id = ev._id || ev.id
    const newStatus = ev.isActive === false ? true : false
    try {
      const res = await api.updateEvent(id, { isActive: newStatus })
      if (res && res.success) {
        setEvents((prev) =>
          prev.map((item) => ((item._id || item.id) === id ? { ...item, isActive: newStatus } : item))
        )
        broadcastEventsUpdated()
        showToast(`✓ Event marked as ${newStatus ? 'Active' : 'Hidden'}`)
      }
    } catch (err) {
      console.error(err)
      showToast('⚠ Failed to update status', 'error')
    }
  }

  const handleUploadEventImage = async (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    setUploadingImage(true)
    try {
      const res = await uploadToImgbb(file)
      const finalUrl = typeof res === 'string' ? res : (res?.url || res?.data?.url || '')
      if (finalUrl) {
        setEventFormData((prev) => ({ ...prev, image: finalUrl }))
        showToast('✓ Event image uploaded to ImgBB successfully!')
      } else {
        showToast(res?.message || '⚠ Image upload failed', 'error')
      }
    } catch (err) {
      console.error(err)
      showToast('⚠ Image upload failed: ' + (err.message || ''), 'error')
    } finally {
      setUploadingImage(false)
      if (e.target) e.target.value = ''
    }
  }

  const handleSaveEvent = async (e) => {
    e.preventDefault()
    if (!eventFormData.title.trim()) {
      showToast('⚠ Event title is required', 'error')
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
          showToast(`✓ Event "${eventFormData.title}" published successfully!`)
        }
      }
      setIsEventModalOpen(false)
      await fetchData()
      broadcastEventsUpdated()
    } catch (err) {
      console.error(err)
      showToast('⚠ Server error saving event', 'error')
    }
  }

  const triggerDeleteEvent = (ev) => {
    setItemToDelete(ev)
    setDeleteType('event')
  }

  const handleResetEvents = async () => {
    if (!window.confirm('Reset all events to default school calendar data?')) return
    try {
      const res = await api.resetEvents()
      if (res && res.success) {
        showToast('✓ Events reset to default seed data')
        await fetchData()
        broadcastEventsUpdated()
      }
    } catch (err) {
      console.error(err)
      showToast('⚠ Reset error', 'error')
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

  const handleToggleGalleryActive = async (g) => {
    const id = g._id || g.id
    const newStatus = g.isActive === false ? true : false
    try {
      const res = await api.updateGalleryItem(id, { isActive: newStatus })
      if (res && res.success) {
        setGallery((prev) =>
          prev.map((item) => ((item._id || item.id) === id ? { ...item, isActive: newStatus } : item))
        )
        broadcastGalleryUpdated()
        showToast(`✓ Photo marked as ${newStatus ? 'Active' : 'Hidden'}`)
      }
    } catch (err) {
      console.error(err)
      showToast('⚠ Failed to update status', 'error')
    }
  }

  const handleUploadGalleryImage = async (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    setUploadingImage(true)
    try {
      const res = await uploadToImgbb(file)
      const finalUrl = typeof res === 'string' ? res : (res?.url || res?.data?.url || '')
      if (finalUrl) {
        setGalleryFormData((prev) => ({ ...prev, imageUrl: finalUrl }))
        showToast('✓ Photo uploaded to ImgBB successfully!')
      } else {
        showToast(res?.message || '⚠ Photo upload failed', 'error')
      }
    } catch (err) {
      console.error(err)
      showToast('⚠ Photo upload failed: ' + (err.message || ''), 'error')
    } finally {
      setUploadingImage(false)
      if (e.target) e.target.value = ''
    }
  }

  const handleSaveGallery = async (e) => {
    e.preventDefault()
    if (!galleryFormData.title.trim() || !galleryFormData.imageUrl.trim()) {
      showToast('⚠ Photo title and image URL are required', 'error')
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
      broadcastGalleryUpdated()
    } catch (err) {
      console.error(err)
      showToast('⚠ Server error saving gallery item', 'error')
    }
  }

  const triggerDeleteGallery = (g) => {
    setItemToDelete(g)
    setDeleteType('photo')
  }

  const handleResetGallery = async () => {
    if (!window.confirm('Reset photo gallery to default campus photography?')) return
    try {
      const res = await api.resetGallery()
      if (res && res.success) {
        showToast('✓ Photo gallery restored to default seed')
        await fetchData()
        broadcastGalleryUpdated()
      }
    } catch (err) {
      console.error(err)
      showToast('⚠ Reset error', 'error')
    }
  }

  /* ─────────────── CONFIRM DELETE HANDLER ─────────────── */
  const handleConfirmDelete = async () => {
    if (!itemToDelete) return
    setIsDeleting(true)
    const id = itemToDelete._id || itemToDelete.id
    try {
      if (deleteType === 'event') {
        const res = await api.deleteEvent(id)
        if (res && res.success) {
          showToast(`✓ Event "${itemToDelete.title}" deleted`)
          await fetchData()
          broadcastEventsUpdated()
        }
      } else {
        const res = await api.deleteGalleryItem(id)
        if (res && res.success) {
          showToast(`✓ Photo "${itemToDelete.title}" removed from gallery`)
          await fetchData()
          broadcastGalleryUpdated()
        }
      }
      setItemToDelete(null)
    } catch (err) {
      console.error(err)
      showToast('⚠ Delete failed', 'error')
    } finally {
      setIsDeleting(false)
    }
  }

  /* ─────────────── FILTERING ─────────────── */
  const filteredEvents = useMemo(() => {
    return events.filter((e) => {
      const q = searchQuery.toLowerCase().trim()
      const matchQ =
        !q ||
        (e.title && e.title.toLowerCase().includes(q)) ||
        (e.titleBn && e.titleBn.toLowerCase().includes(q)) ||
        (e.location && e.location.toLowerCase().includes(q)) ||
        (e.category && e.category.toLowerCase().includes(q))

      const matchCat =
        selectedEventCategory === 'All' ||
        (e.category && e.category.toLowerCase() === selectedEventCategory.toLowerCase())

      const matchStatus =
        selectedEventStatus === 'All' ||
        (e.status && e.status.toLowerCase() === selectedEventStatus.toLowerCase())

      const matchVisibility =
        selectedEventVisibility === 'All' ||
        (selectedEventVisibility === 'active' ? e.isActive !== false : e.isActive === false)

      return matchQ && matchCat && matchStatus && matchVisibility
    })
  }, [events, searchQuery, selectedEventCategory, selectedEventStatus, selectedEventVisibility])

  const filteredGallery = useMemo(() => {
    return gallery.filter((g) => {
      const q = searchQuery.toLowerCase().trim()
      const matchQ =
        !q ||
        (g.title && g.title.toLowerCase().includes(q)) ||
        (g.titleBn && g.titleBn.toLowerCase().includes(q)) ||
        (g.caption && g.caption.toLowerCase().includes(q))

      const matchCat =
        selectedGalleryCategory === 'All' ||
        (g.category || '').toLowerCase() === selectedGalleryCategory.toLowerCase()

      const matchVisibility =
        selectedGalleryVisibility === 'All' ||
        (selectedGalleryVisibility === 'active' ? g.isActive !== false : g.isActive === false)

      const matchYear =
        selectedGalleryYear === 'All' ||
        (g.date && String(g.date).trim() === String(selectedGalleryYear).trim())

      return matchQ && matchCat && matchVisibility && matchYear
    })
  }, [gallery, searchQuery, selectedGalleryCategory, selectedGalleryVisibility, selectedGalleryYear])

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-16">
      {/* Toast Alert */}
      {toastMessage && (
        <div
          className={`fixed top-5 right-5 z-[100] px-5 py-3.5 rounded-2xl shadow-2xl backdrop-blur-md border font-bold text-xs flex items-center gap-2.5 transition-all animate-bounce ${
            toastMessage.type === 'error'
              ? 'bg-rose-900/90 text-white border-rose-500/50'
              : 'bg-emerald-900/90 text-white border-emerald-500/50'
          }`}
        >
          {toastMessage.type === 'error' ? (
            <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
          ) : (
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          )}
          <span>{toastMessage.text}</span>
        </div>
      )}

      {/* Delete Confirmation Alert Modal */}
      {itemToDelete && (
        <EventDeleteAlert
          item={itemToDelete}
          type={deleteType}
          deleting={isDeleting}
          onConfirm={handleConfirmDelete}
          onCancel={() => {
            if (!isDeleting) setItemToDelete(null)
          }}
        />
      )}

      {/* Top Banner Card */}
      <div className="bg-gradient-to-r from-[#14141f] via-[#1a1a2e] to-[#14141f] border border-[#202030] rounded-3xl p-6 sm:p-8 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-sky-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 relative z-10">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold bg-sky-500/20 text-sky-300 border border-sky-500/30">
              <CalendarDays className="w-3.5 h-3.5" />
              <span>Website CMS · Academic Events & Campus Photography</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight flex items-center gap-2.5">
              <span>Events & Photo Gallery Manager</span>
              <span className="text-[11px] bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 px-2.5 py-0.5 rounded-full font-bold">
                MongoDB Live
              </span>
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 max-w-2xl leading-relaxed">
              Complete word-to-word bilingual management for school calendar events, examination dates, cultural festivals,
              and high-resolution campus photography gallery.
            </p>
          </div>

          {/* Quick Action Buttons */}
          <div className="flex flex-wrap items-center gap-2.5">
            <a
              href="/events"
              target="_blank"
              rel="noreferrer"
              className="px-4 py-2.5 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-bold inline-flex items-center gap-2 transition cursor-pointer"
            >
              <Eye className="w-3.5 h-3.5 text-slate-400" />
              <span>Live Events Page</span>
              <ExternalLink className="w-3 h-3 text-slate-500" />
            </a>

            {subTab === 'events' && (
              <>
                <button
                  onClick={handleResetEvents}
                  className="px-3.5 py-2.5 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 border border-rose-500/30 text-xs font-bold inline-flex items-center gap-1.5 transition cursor-pointer"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Reset Events</span>
                </button>
                <button
                  onClick={handleOpenAddEvent}
                  className="px-4 py-2.5 rounded-xl text-xs font-bold bg-gradient-to-r from-sky-500 to-[#6c63ff] hover:from-sky-400 hover:to-[#5a52e0] text-white shadow-lg shadow-sky-500/20 transition inline-flex items-center gap-2 cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  <span>Publish New Event</span>
                </button>
              </>
            )}

            {subTab === 'gallery' && (
              <>
                <button
                  onClick={handleResetGallery}
                  className="px-3.5 py-2.5 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 border border-rose-500/30 text-xs font-bold inline-flex items-center gap-1.5 transition cursor-pointer"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Reset Photos</span>
                </button>
                <button
                  onClick={handleOpenAddGallery}
                  className="px-4 py-2.5 rounded-xl text-xs font-bold bg-gradient-to-r from-sky-500 to-[#6c63ff] hover:from-sky-400 hover:to-[#5a52e0] text-white shadow-lg shadow-sky-500/20 transition inline-flex items-center gap-2 cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add Photo to Gallery</span>
                </button>
              </>
            )}

            {subTab === 'headers' && (
              <>
                <button
                  onClick={handleResetConfig}
                  className="px-3.5 py-2.5 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 border border-rose-500/30 text-xs font-bold inline-flex items-center gap-1.5 transition cursor-pointer"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Reset Headings</span>
                </button>
                <button
                  onClick={handleSaveConfig}
                  disabled={savingConfig}
                  className="px-5 py-2.5 rounded-xl text-xs font-bold bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-white shadow-lg shadow-emerald-500/20 transition inline-flex items-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  {savingConfig ? (
                    <>
                      <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>Saving...</span>
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4" />
                      <span>Save Word-to-Word Texts</span>
                    </>
                  )}
                </button>
              </>
            )}
          </div>
        </div>

        {/* Status bar */}
        <div className="mt-6 pt-5 border-t border-[#202030] flex flex-wrap items-center justify-between gap-4 text-xs">
          <div className="flex items-center gap-4 flex-wrap">
            <span className="text-slate-400 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-sky-400 animate-pulse" />
              <span><strong>{events.length}</strong> Events in Database</span>
            </span>
            <span className="text-slate-400 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-[#a78bfa]" />
              <span><strong>{gallery.length}</strong> Gallery Photos</span>
            </span>
            <span className="text-slate-400 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400" />
              <span>Bilingual: <strong>English + বাংলা</strong></span>
            </span>
          </div>

          <div className="flex items-center gap-2 bg-[#101018] px-2.5 py-1 rounded-xl border border-[#202030]">
            <span className="text-[11px] font-bold text-slate-400">Preview Language:</span>
            <button
              onClick={() => setPreviewLang('bn')}
              className={`px-2.5 py-0.5 rounded-lg text-[11px] font-bold transition cursor-pointer ${
                previewLang === 'bn' ? 'bg-sky-500 text-slate-950 font-black shadow' : 'text-slate-400 hover:text-white'
              }`}
            >
              বাংলা (BN)
            </button>
            <button
              onClick={() => setPreviewLang('en')}
              className={`px-2.5 py-0.5 rounded-lg text-[11px] font-bold transition cursor-pointer ${
                previewLang === 'en' ? 'bg-sky-500 text-slate-950 font-black shadow' : 'text-slate-400 hover:text-white'
              }`}
            >
              English (EN)
            </button>
          </div>
        </div>
      </div>

      {/* Main Tabs Navigation */}
      <div className="flex items-center justify-between gap-4 flex-wrap border-b border-[#1e1e2e] pb-3">
        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={() => setSubTab('events')}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold transition flex items-center gap-2 cursor-pointer ${
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
            className={`px-4 py-2.5 rounded-xl text-xs font-bold transition flex items-center gap-2 cursor-pointer ${
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

          <button
            onClick={() => setSubTab('headers')}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold transition flex items-center gap-2 cursor-pointer ${
              subTab === 'headers'
                ? 'bg-sky-500 text-slate-950 shadow-md shadow-sky-500/20'
                : 'bg-[#16161f] text-slate-400 hover:text-white hover:bg-[#1f1f2e] border border-[#1e1e2e]'
            }`}
          >
            <Tag className="w-4 h-4" />
            <span>Word-to-Word Page & Section Texts</span>
          </button>

          <button
            onClick={() => setSubTab('preview')}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold transition flex items-center gap-2 cursor-pointer ${
              subTab === 'preview'
                ? 'bg-sky-500 text-slate-950 shadow-md shadow-sky-500/20'
                : 'bg-[#16161f] text-slate-400 hover:text-white hover:bg-[#1f1f2e] border border-[#1e1e2e]'
            }`}
          >
            <Eye className="w-4 h-4" />
            <span>Live Page Simulation</span>
          </button>
        </div>

        {/* Search Bar for Events or Gallery */}
        {(subTab === 'events' || subTab === 'gallery') && (
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
        )}
      </div>

      {/* ───────────────── SUBTAB: EVENTS ───────────────── */}
      {subTab === 'events' && (
        <div className="space-y-4">
          {/* Event Filter Bar (Dropdowns) */}
          <div className="bg-[#16161f] border border-[#1e1e2e] p-3 rounded-2xl flex flex-wrap items-center justify-between gap-3 shadow-md">
            <div className="flex flex-wrap items-center gap-2.5 flex-1 min-w-[260px]">
              {/* Category Dropdown */}
              <div className="flex items-center gap-2 bg-[#12121a] border border-[#222233] focus-within:border-sky-500/50 rounded-xl px-3 py-1.5 transition">
                <Filter className="w-3.5 h-3.5 text-sky-400 shrink-0" />
                <span className="text-[11px] font-bold text-slate-400 shrink-0">Category:</span>
                <select
                  value={selectedEventCategory}
                  onChange={(e) => setSelectedEventCategory(e.target.value)}
                  className="bg-transparent text-xs font-semibold text-white outline-none cursor-pointer pr-1"
                >
                  <option value="All" className="bg-[#16161f] text-white">
                    All Categories ({events.length})
                  </option>
                  {EVENT_CATEGORIES.filter((c) => c.id !== 'All').map((cat) => {
                    const count = events.filter(
                      (e) => (e.category || '').toLowerCase() === cat.id.toLowerCase()
                    ).length
                    return (
                      <option key={cat.id} value={cat.id} className="bg-[#16161f] text-white">
                        {cat.en} ({cat.bn}) — {count}
                      </option>
                    )
                  })}
                </select>
              </div>

              {/* Status Dropdown */}
              <div className="flex items-center gap-2 bg-[#12121a] border border-[#222233] focus-within:border-sky-500/50 rounded-xl px-3 py-1.5 transition">
                <Clock className="w-3.5 h-3.5 text-gold shrink-0" />
                <span className="text-[11px] font-bold text-slate-400 shrink-0">Status:</span>
                <select
                  value={selectedEventStatus}
                  onChange={(e) => setSelectedEventStatus(e.target.value)}
                  className="bg-transparent text-xs font-semibold text-white outline-none cursor-pointer pr-1"
                >
                  <option value="All" className="bg-[#16161f] text-white">All Statuses</option>
                  {EVENT_STATUSES.map((st) => (
                    <option key={st.id} value={st.id} className="bg-[#16161f] text-white">
                      {st.en} ({st.bn})
                    </option>
                  ))}
                </select>
              </div>

              {/* Visibility Dropdown */}
              <div className="flex items-center gap-2 bg-[#12121a] border border-[#222233] focus-within:border-sky-500/50 rounded-xl px-3 py-1.5 transition">
                <Eye className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span className="text-[11px] font-bold text-slate-400 shrink-0">Visibility:</span>
                <select
                  value={selectedEventVisibility}
                  onChange={(e) => setSelectedEventVisibility(e.target.value)}
                  className="bg-transparent text-xs font-semibold text-white outline-none cursor-pointer pr-1"
                >
                  <option value="All" className="bg-[#16161f] text-white">All (Active & Hidden)</option>
                  <option value="active" className="bg-[#16161f] text-white">
                    Active Only ({events.filter((e) => e.isActive !== false).length})
                  </option>
                  <option value="hidden" className="bg-[#16161f] text-white">
                    Hidden Only ({events.filter((e) => e.isActive === false).length})
                  </option>
                </select>
              </div>

              {/* Reset Filters button */}
              {(selectedEventCategory !== 'All' ||
                selectedEventStatus !== 'All' ||
                selectedEventVisibility !== 'All' ||
                searchQuery) && (
                <button
                  type="button"
                  onClick={() => {
                    setSelectedEventCategory('All')
                    setSelectedEventStatus('All')
                    setSelectedEventVisibility('All')
                    setSearchQuery('')
                  }}
                  className="text-[11px] font-bold text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 px-2.5 py-1.5 rounded-xl border border-rose-500/20 transition cursor-pointer flex items-center gap-1"
                >
                  <X className="w-3 h-3" />
                  <span>Reset Filters</span>
                </button>
              )}
            </div>

            <div className="text-[11px] text-slate-400 font-medium">
              Showing <strong className="text-white">{filteredEvents.length}</strong> of {events.length} events
            </div>
          </div>

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
                No events found matching your filter. Click "Publish New Event" to add a program or "Reset Events" to restore school defaults.
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
                        src={
                          ev.image ||
                          'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?auto=format&fit=crop&w=800&q=80'
                        }
                        alt={ev.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        onError={(e) => {
                          e.target.src =
                            'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?auto=format&fit=crop&w=800&q=80'
                        }}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#16161f] via-transparent to-black/40" />

                      {/* Date Badge */}
                      <div className="absolute top-3 left-3 bg-sky-500 text-slate-950 font-black text-xs px-2.5 py-1 rounded-lg shadow-lg font-mono">
                        {ev.dateBadge || 'EVT'}
                      </div>

                      {/* Status */}
                      <div className="absolute top-3 right-3 bg-black/60 backdrop-blur-md border border-white/10 text-white font-bold text-[10px] px-2.5 py-0.5 rounded-full">
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
                    <button
                      onClick={() => handleToggleEventActive(ev)}
                      className={`text-[10px] font-bold px-2.5 py-1 rounded-full transition cursor-pointer flex items-center gap-1.5 ${
                        ev.isActive !== false
                          ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                          : 'bg-slate-500/15 text-slate-400 border border-slate-500/30'
                      }`}
                    >
                      <span className={`w-1.5 h-1.5 rounded-full ${ev.isActive !== false ? 'bg-emerald-400' : 'bg-slate-500'}`} />
                      <span>{ev.isActive !== false ? 'Active (Live)' : 'Hidden'}</span>
                    </button>

                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => handleOpenEditEvent(ev)}
                        className="p-1.5 rounded-lg bg-[#1c1c28] hover:bg-[#252538] text-slate-300 hover:text-white transition cursor-pointer"
                        title="Edit event details"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => triggerDeleteEvent(ev)}
                        className="p-1.5 rounded-lg bg-[#1c1c28] hover:bg-rose-500/20 text-slate-400 hover:text-rose-400 transition cursor-pointer"
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
        </div>
      )}

      {/* ───────────────── SUBTAB: GALLERY ───────────────── */}
      {subTab === 'gallery' && (
        <div className="space-y-4">
          {/* Gallery Filter Bar (Dropdowns) */}
          <div className="bg-[#16161f] border border-[#1e1e2e] p-3 rounded-2xl flex flex-wrap items-center justify-between gap-3 shadow-md">
            <div className="flex flex-wrap items-center gap-2.5 flex-1 min-w-[260px]">
              {/* Category Dropdown */}
              <div className="flex items-center gap-2 bg-[#12121a] border border-[#222233] focus-within:border-sky-500/50 rounded-xl px-3 py-1.5 transition">
                <Images className="w-3.5 h-3.5 text-sky-400 shrink-0" />
                <span className="text-[11px] font-bold text-slate-400 shrink-0">Category:</span>
                <select
                  value={selectedGalleryCategory}
                  onChange={(e) => setSelectedGalleryCategory(e.target.value)}
                  className="bg-transparent text-xs font-semibold text-white outline-none cursor-pointer pr-1"
                >
                  <option value="All" className="bg-[#16161f] text-white">
                    All Categories ({gallery.length})
                  </option>
                  {GALLERY_CATEGORIES.filter((c) => c !== 'All').map((cat) => {
                    const count = gallery.filter(
                      (g) => (g.category || '').toLowerCase() === cat.toLowerCase()
                    ).length
                    return (
                      <option key={cat} value={cat} className="bg-[#16161f] text-white">
                        {cat} ({count})
                      </option>
                    )
                  })}
                </select>
              </div>

              {/* Visibility Dropdown */}
              <div className="flex items-center gap-2 bg-[#12121a] border border-[#222233] focus-within:border-sky-500/50 rounded-xl px-3 py-1.5 transition">
                <Eye className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span className="text-[11px] font-bold text-slate-400 shrink-0">Visibility:</span>
                <select
                  value={selectedGalleryVisibility}
                  onChange={(e) => setSelectedGalleryVisibility(e.target.value)}
                  className="bg-transparent text-xs font-semibold text-white outline-none cursor-pointer pr-1"
                >
                  <option value="All" className="bg-[#16161f] text-white">All (Active & Hidden)</option>
                  <option value="active" className="bg-[#16161f] text-white">
                    Active Only ({gallery.filter((g) => g.isActive !== false).length})
                  </option>
                  <option value="hidden" className="bg-[#16161f] text-white">
                    Hidden Only ({gallery.filter((g) => g.isActive === false).length})
                  </option>
                </select>
              </div>

              {/* Year Dropdown */}
              {availableYears.length > 0 && (
                <div className="flex items-center gap-2 bg-[#12121a] border border-[#222233] focus-within:border-sky-500/50 rounded-xl px-3 py-1.5 transition">
                  <Calendar className="w-3.5 h-3.5 text-gold shrink-0" />
                  <span className="text-[11px] font-bold text-slate-400 shrink-0">Year:</span>
                  <select
                    value={selectedGalleryYear}
                    onChange={(e) => setSelectedGalleryYear(e.target.value)}
                    className="bg-transparent text-xs font-semibold text-white outline-none cursor-pointer pr-1 font-mono"
                  >
                    <option value="All" className="bg-[#16161f] text-white">All Years</option>
                    {availableYears.map((yr) => (
                      <option key={yr} value={yr} className="bg-[#16161f] text-white">
                        {yr}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {/* Reset Filters button */}
              {(selectedGalleryCategory !== 'All' ||
                selectedGalleryVisibility !== 'All' ||
                selectedGalleryYear !== 'All' ||
                searchQuery) && (
                <button
                  type="button"
                  onClick={() => {
                    setSelectedGalleryCategory('All')
                    setSelectedGalleryVisibility('All')
                    setSelectedGalleryYear('All')
                    setSearchQuery('')
                  }}
                  className="text-[11px] font-bold text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 px-2.5 py-1.5 rounded-xl border border-rose-500/20 transition cursor-pointer flex items-center gap-1"
                >
                  <X className="w-3 h-3" />
                  <span>Reset Filters</span>
                </button>
              )}
            </div>

            <div className="text-[11px] text-slate-400 font-medium">
              Showing <strong className="text-white">{filteredGallery.length}</strong> of {gallery.length} photos
            </div>
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
                No photos in this category. Click "Add Photo to Gallery" or "Reset Photos" to restore default photography.
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
                    {item.titleBn && <p className="text-[11px] text-slate-400 truncate">{item.titleBn}</p>}

                    <div className="flex items-center justify-between pt-2 border-t border-[#1e1e2e]">
                      <button
                        onClick={() => handleToggleGalleryActive(item)}
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full transition cursor-pointer flex items-center gap-1 ${
                          item.isActive !== false
                            ? 'bg-emerald-500/10 text-emerald-400'
                            : 'bg-slate-500/10 text-slate-400'
                        }`}
                      >
                        <span className={`w-1.5 h-1.5 rounded-full ${item.isActive !== false ? 'bg-emerald-400' : 'bg-slate-500'}`} />
                        <span>{item.isActive !== false ? 'Active' : 'Hidden'}</span>
                      </button>

                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={() => handleOpenEditGallery(item)}
                          className="p-1 rounded-md bg-[#1c1c28] hover:bg-[#252538] text-slate-300 hover:text-white transition cursor-pointer"
                          title="Edit photo details"
                        >
                          <Edit2 className="w-3 h-3" />
                        </button>
                        <button
                          onClick={() => triggerDeleteGallery(item)}
                          className="p-1 rounded-md bg-[#1c1c28] hover:bg-rose-500/20 text-slate-400 hover:text-rose-400 transition cursor-pointer"
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
        </div>
      )}

      {/* ───────────────── SUBTAB: HEADERS (WORD TO WORD EDITING) ───────────────── */}
      {subTab === 'headers' && (
        <form onSubmit={handleSaveConfig} className="space-y-6">
          {/* Card 1: Main Page Hero Banner */}
          <div className="bg-[#16161f] border border-[#1e1e2e] rounded-2xl p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-[#202030] pb-3">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-gold" />
                <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                  Top Page Banner (Hero Gradient)
                </h3>
              </div>
              <span className="text-[11px] text-slate-400">Controls the main header on /events</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Tag / Small Badge (English)
                </label>
                <input
                  type="text"
                  value={config.badge || ''}
                  onChange={(e) => setConfig({ ...config, badge: e.target.value })}
                  placeholder="e.g. Campus Vibrancy & Student Life"
                  className="w-full bg-[#12121a] border border-[#202030] focus:border-sky-500/50 rounded-xl px-3 py-2 text-xs text-white outline-none transition"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Tag / Small Badge (বাংলা)
                </label>
                <input
                  type="text"
                  value={config.badgeBn || ''}
                  onChange={(e) => setConfig({ ...config, badgeBn: e.target.value })}
                  placeholder="যেমন: ক্যাম্পাস জীবন ও উৎসবের মুহূর্ত"
                  className="w-full bg-[#12121a] border border-[#202030] focus:border-sky-500/50 rounded-xl px-3 py-2 text-xs text-white outline-none transition"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Main Headline (English)
                </label>
                <input
                  type="text"
                  value={config.title || ''}
                  onChange={(e) => setConfig({ ...config, title: e.target.value })}
                  placeholder="e.g. Events Calendar & Photo Gallery"
                  className="w-full bg-[#12121a] border border-[#202030] focus:border-sky-500/50 rounded-xl px-3 py-2 text-xs text-white font-bold outline-none transition"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Main Headline (বাংলা)
                </label>
                <input
                  type="text"
                  value={config.titleBn || ''}
                  onChange={(e) => setConfig({ ...config, titleBn: e.target.value })}
                  placeholder="যেমন: ইভেন্ট ক্যালেন্ডার ও ফটো গ্যালারি"
                  className="w-full bg-[#12121a] border border-[#202030] focus:border-sky-500/50 rounded-xl px-3 py-2 text-xs text-white font-bold outline-none transition"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Banner Subtitle / Description (English)
                </label>
                <textarea
                  rows={2}
                  value={config.subtitle || ''}
                  onChange={(e) => setConfig({ ...config, subtitle: e.target.value })}
                  placeholder="Detailed banner description in English..."
                  className="w-full bg-[#12121a] border border-[#202030] focus:border-sky-500/50 rounded-xl px-3 py-2 text-xs text-white outline-none transition"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Banner Subtitle / Description (বাংলা)
                </label>
                <textarea
                  rows={2}
                  value={config.subtitleBn || ''}
                  onChange={(e) => setConfig({ ...config, subtitleBn: e.target.value })}
                  placeholder="ব্যানারের বিস্তারিত বিবরণ বাংলায়..."
                  className="w-full bg-[#12121a] border border-[#202030] focus:border-sky-500/50 rounded-xl px-3 py-2 text-xs text-white outline-none transition"
                />
              </div>
            </div>
          </div>

          {/* Card 2: Events Timeline Section Headings */}
          <div className="bg-[#16161f] border border-[#1e1e2e] rounded-2xl p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-[#202030] pb-3">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-sky-400" />
                <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                  Section 1: Academic Calendar & Events Headings
                </h3>
              </div>
              <span className="text-[11px] text-slate-400">Upcoming events timeline header</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Events Badge / Tag (English)
                </label>
                <input
                  type="text"
                  value={config.eventsBadge || ''}
                  onChange={(e) => setConfig({ ...config, eventsBadge: e.target.value })}
                  placeholder="e.g. School Calendar"
                  className="w-full bg-[#12121a] border border-[#202030] focus:border-sky-500/50 rounded-xl px-3 py-2 text-xs text-white outline-none transition"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Events Badge / Tag (বাংলা)
                </label>
                <input
                  type="text"
                  value={config.eventsBadgeBn || ''}
                  onChange={(e) => setConfig({ ...config, eventsBadgeBn: e.target.value })}
                  placeholder="যেমন: একাডেমিক ক্যালেন্ডার"
                  className="w-full bg-[#12121a] border border-[#202030] focus:border-sky-500/50 rounded-xl px-3 py-2 text-xs text-white outline-none transition"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Section Title (English)
                </label>
                <input
                  type="text"
                  value={config.eventsTitle || ''}
                  onChange={(e) => setConfig({ ...config, eventsTitle: e.target.value })}
                  placeholder="e.g. Academic Calendar & Upcoming Events"
                  className="w-full bg-[#12121a] border border-[#202030] focus:border-sky-500/50 rounded-xl px-3 py-2 text-xs text-white font-bold outline-none transition"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Section Title (বাংলা)
                </label>
                <input
                  type="text"
                  value={config.eventsTitleBn || ''}
                  onChange={(e) => setConfig({ ...config, eventsTitleBn: e.target.value })}
                  placeholder="যেমন: একাডেমিক ক্যালেন্ডার ও আসন্ন অনুষ্ঠান"
                  className="w-full bg-[#12121a] border border-[#202030] focus:border-sky-500/50 rounded-xl px-3 py-2 text-xs text-white font-bold outline-none transition"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Section Subtitle (English)
                </label>
                <textarea
                  rows={2}
                  value={config.eventsSubtitle || ''}
                  onChange={(e) => setConfig({ ...config, eventsSubtitle: e.target.value })}
                  placeholder="Optional explanatory subtitle..."
                  className="w-full bg-[#12121a] border border-[#202030] focus:border-sky-500/50 rounded-xl px-3 py-2 text-xs text-white outline-none transition"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Section Subtitle (বাংলা)
                </label>
                <textarea
                  rows={2}
                  value={config.eventsSubtitleBn || ''}
                  onChange={(e) => setConfig({ ...config, eventsSubtitleBn: e.target.value })}
                  placeholder="ঐচ্ছিক পরিচিতিমূলক সাবটাইটেল..."
                  className="w-full bg-[#12121a] border border-[#202030] focus:border-sky-500/50 rounded-xl px-3 py-2 text-xs text-white outline-none transition"
                />
              </div>
            </div>
          </div>

          {/* Card 3: Photo Gallery Section Headings */}
          <div className="bg-[#16161f] border border-[#1e1e2e] rounded-2xl p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-[#202030] pb-3">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-[#a78bfa]" />
                <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                  Section 2: Campus Photo Gallery Headings
                </h3>
              </div>
              <span className="text-[11px] text-slate-400">Campus photography & lightbox header</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Gallery Badge / Tag (English)
                </label>
                <input
                  type="text"
                  value={config.galleryBadge || ''}
                  onChange={(e) => setConfig({ ...config, galleryBadge: e.target.value })}
                  placeholder="e.g. Memories & Moments"
                  className="w-full bg-[#12121a] border border-[#202030] focus:border-sky-500/50 rounded-xl px-3 py-2 text-xs text-white outline-none transition"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Gallery Badge / Tag (বাংলা)
                </label>
                <input
                  type="text"
                  value={config.galleryBadgeBn || ''}
                  onChange={(e) => setConfig({ ...config, galleryBadgeBn: e.target.value })}
                  placeholder="যেমন: স্মৃতি ও সোনালী মুহূর্ত"
                  className="w-full bg-[#12121a] border border-[#202030] focus:border-sky-500/50 rounded-xl px-3 py-2 text-xs text-white outline-none transition"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Gallery Headline (English)
                </label>
                <input
                  type="text"
                  value={config.galleryTitle || ''}
                  onChange={(e) => setConfig({ ...config, galleryTitle: e.target.value })}
                  placeholder="e.g. Campus Life Photo Gallery"
                  className="w-full bg-[#12121a] border border-[#202030] focus:border-sky-500/50 rounded-xl px-3 py-2 text-xs text-white font-bold outline-none transition"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Gallery Headline (বাংলা)
                </label>
                <input
                  type="text"
                  value={config.galleryTitleBn || ''}
                  onChange={(e) => setConfig({ ...config, galleryTitleBn: e.target.value })}
                  placeholder="যেমন: ক্যাম্পাস জীবন ফটো গ্যালারি"
                  className="w-full bg-[#12121a] border border-[#202030] focus:border-sky-500/50 rounded-xl px-3 py-2 text-xs text-white font-bold outline-none transition"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Gallery Subtitle / Lightbox Hint (English)
                </label>
                <textarea
                  rows={2}
                  value={config.gallerySubtitle || ''}
                  onChange={(e) => setConfig({ ...config, gallerySubtitle: e.target.value })}
                  placeholder="e.g. Click any image to view in high definition lightbox"
                  className="w-full bg-[#12121a] border border-[#202030] focus:border-sky-500/50 rounded-xl px-3 py-2 text-xs text-white outline-none transition"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Gallery Subtitle / Lightbox Hint (বাংলা)
                </label>
                <textarea
                  rows={2}
                  value={config.gallerySubtitleBn || ''}
                  onChange={(e) => setConfig({ ...config, gallerySubtitleBn: e.target.value })}
                  placeholder="যেমন: পূর্ণাঙ্গ আকারে দেখতে যেকোনো ছবিতে ক্লিক করুন"
                  className="w-full bg-[#12121a] border border-[#202030] focus:border-sky-500/50 rounded-xl px-3 py-2 text-xs text-white outline-none transition"
                />
              </div>
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={handleResetConfig}
              className="px-4 py-2.5 rounded-xl bg-[#1c1c28] hover:bg-[#252538] text-slate-300 border border-[#2a2a3d] text-xs font-bold transition cursor-pointer"
            >
              Reset to School Defaults
            </button>
            <button
              type="submit"
              disabled={savingConfig}
              className="px-6 py-2.5 rounded-xl text-xs font-bold bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-white shadow-lg shadow-emerald-500/20 transition flex items-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {savingConfig ? (
                <>
                  <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Saving Changes...</span>
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  <span>Save All Word-to-Word Texts</span>
                </>
              )}
            </button>
          </div>
        </form>
      )}

      {/* ───────────────── SUBTAB: LIVE PREVIEW SIMULATION ───────────────── */}
      {subTab === 'preview' && (
        <div className="space-y-8 bg-paper p-6 sm:p-10 rounded-3xl border border-ink/10 text-ink">
          {/* Banner Preview */}
          <div className="bg-gradient-to-r from-board via-boardlt to-iris rounded-3xl p-8 sm:p-10 text-chalk shadow-xl relative overflow-hidden">
            <div className="max-w-3xl relative z-10">
              <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold bg-white/10 text-gold border border-white/15 mb-3">
                <Calendar className="w-3.5 h-3.5 text-gold" />
                <span>
                  {previewLang === 'bn'
                    ? config.badgeBn || config.badge
                    : config.badge || config.badgeBn}
                </span>
              </span>
              <h2 className="font-display font-extrabold text-2xl sm:text-4xl text-white tracking-tight">
                {previewLang === 'bn'
                  ? config.titleBn || config.title
                  : config.title || config.titleBn}
              </h2>
              <p className="mt-3 text-xs sm:text-sm text-chalk/80 leading-relaxed max-w-2xl">
                {previewLang === 'bn'
                  ? config.subtitleBn || config.subtitle
                  : config.subtitle || config.subtitleBn}
              </p>
            </div>
          </div>

          {/* Events Preview */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Calendar className="w-5 h-5 text-iris" />
              <h3 className="font-display font-extrabold text-xl text-board">
                {previewLang === 'bn'
                  ? config.eventsTitleBn || config.eventsTitle
                  : config.eventsTitle || config.eventsTitleBn}
              </h3>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              {events
                .filter((e) => e.isActive !== false)
                .slice(0, 4)
                .map((ev, i) => (
                  <div
                    key={ev._id || i}
                    className="bg-white rounded-2xl p-4 border border-ink/10 shadow-sm flex flex-col sm:flex-row gap-4 items-start"
                  >
                    {ev.image ? (
                      <div className="w-24 h-24 rounded-xl overflow-hidden shrink-0 relative bg-board">
                        <img src={ev.image} alt="" className="w-full h-full object-cover" />
                        <div className="absolute top-1 left-1 bg-board/90 text-gold text-[10px] font-black px-1.5 py-0.5 rounded font-mono">
                          {ev.dateBadge}
                        </div>
                      </div>
                    ) : (
                      <div className="w-16 h-16 rounded-xl bg-board text-gold grid place-items-center text-center p-1 shrink-0 font-display font-black text-xs">
                        {ev.dateBadge}
                      </div>
                    )}

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-1 mb-1">
                        <span className="text-[10px] font-bold text-iris uppercase bg-iris/10 px-2 py-0.5 rounded-full">
                          {previewLang === 'bn' ? ev.categoryBn || ev.category : ev.category}
                        </span>
                        <span className="text-[10px] font-bold text-mint bg-mint/10 px-1.5 py-0.5 rounded">
                          {previewLang === 'bn' ? ev.statusBn || ev.status : ev.status}
                        </span>
                      </div>
                      <h4 className="font-bold text-sm text-board truncate">
                        {previewLang === 'bn' ? ev.titleBn || ev.title : ev.title}
                      </h4>
                      <p className="text-xs text-ink/70 line-clamp-1 mt-1">
                        {previewLang === 'bn' ? ev.descBn || ev.desc : ev.desc}
                      </p>
                      <div className="mt-2 text-[10px] text-ink/50 flex items-center gap-3">
                        <span>{previewLang === 'bn' ? ev.timeBn || ev.time : ev.time}</span>
                        <span>•</span>
                        <span>{previewLang === 'bn' ? ev.locationBn || ev.location : ev.location}</span>
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          </div>

          {/* Gallery Preview */}
          <div>
            <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-4 gap-2">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-gold bg-gold/20 px-2.5 py-0.5 rounded-full">
                  {previewLang === 'bn'
                    ? config.galleryBadgeBn || config.galleryBadge
                    : config.galleryBadge || config.galleryBadgeBn}
                </span>
                <h3 className="font-display font-extrabold text-xl text-board mt-1">
                  {previewLang === 'bn'
                    ? config.galleryTitleBn || config.galleryTitle
                    : config.galleryTitle || config.galleryTitleBn}
                </h3>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {gallery
                .filter((g) => g.isActive !== false)
                .slice(0, 8)
                .map((item, i) => (
                  <div
                    key={item._id || i}
                    onClick={() => setPreviewLightbox(item)}
                    className="group relative rounded-2xl overflow-hidden aspect-[4/3] bg-board cursor-pointer shadow-md hover:shadow-xl transition-all"
                  >
                    <img
                      src={item.imageUrl}
                      alt={item.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex items-end p-2.5">
                      <div className="text-white">
                        <span className="text-[9px] font-bold text-gold uppercase bg-gold/20 px-1.5 py-0.5 rounded">
                          {previewLang === 'bn' ? item.categoryBn || item.category : item.category}
                        </span>
                        <h5 className="font-bold text-xs truncate mt-1">
                          {previewLang === 'bn' ? item.titleBn || item.title : item.title}
                        </h5>
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          </div>

          {/* Lightbox Modal Preview */}
          {previewLightbox && (
            <div
              className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md grid place-items-center p-4"
              onClick={() => setPreviewLightbox(null)}
            >
              <div
                className="relative max-w-2xl w-full bg-board rounded-3xl overflow-hidden shadow-2xl border border-white/20"
                onClick={(e) => e.stopPropagation()}
              >
                <button
                  onClick={() => setPreviewLightbox(null)}
                  className="absolute top-4 right-4 z-10 w-9 h-9 rounded-full bg-black/60 text-white grid place-items-center cursor-pointer"
                >
                  <X className="w-5 h-5 text-brick" />
                </button>
                <img
                  src={previewLightbox.imageUrl}
                  alt=""
                  className="w-full max-h-[60vh] object-contain bg-black"
                />
                <div className="p-4 bg-board text-chalk">
                  <span className="text-xs font-bold text-gold uppercase">
                    {previewLang === 'bn' ? previewLightbox.categoryBn || previewLightbox.category : previewLightbox.category}
                  </span>
                  <h4 className="font-bold text-base text-white mt-0.5">
                    {previewLang === 'bn' ? previewLightbox.titleBn || previewLightbox.title : previewLightbox.title}
                  </h4>
                  {(previewLightbox.caption || previewLightbox.captionBn) && (
                    <p className="text-xs text-chalk/80 mt-1">
                      {previewLang === 'bn' ? previewLightbox.captionBn || previewLightbox.caption : previewLightbox.caption}
                    </p>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ───────────────── EVENT ADD/EDIT MODAL ───────────────── */}
      {isEventModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto">
          <div className="bg-[#16161f] border border-[#2a2a3d] rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto moom-scrollbar shadow-2xl p-6 relative">
            <button
              onClick={() => setIsEventModalOpen(false)}
              className="absolute top-5 right-5 text-slate-400 hover:text-white p-1 rounded-lg bg-[#1c1c28] hover:bg-[#252538] transition cursor-pointer"
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
                  <label className="block text-slate-300 font-semibold mb-1">Date Badge (Square Tag)</label>
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
                  <label className="block text-slate-300 font-semibold mb-1">Time (English)</label>
                  <input
                    type="text"
                    value={eventFormData.time}
                    onChange={(e) => setEventFormData({ ...eventFormData, time: e.target.value })}
                    placeholder="e.g. 9:00 AM - 1:00 PM"
                    className="w-full bg-[#12121a] border border-[#202030] focus:border-sky-500/50 rounded-xl px-3 py-2.5 text-white outline-none transition"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Time (বাংলা)</label>
                  <input
                    type="text"
                    value={eventFormData.timeBn}
                    onChange={(e) => setEventFormData({ ...eventFormData, timeBn: e.target.value })}
                    placeholder="যেমন: সকাল ৯:০০ - দুপুর ১:০০"
                    className="w-full bg-[#12121a] border border-[#202030] focus:border-sky-500/50 rounded-xl px-3 py-2.5 text-white outline-none transition"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Location / Venue (English)</label>
                  <input
                    type="text"
                    value={eventFormData.location}
                    onChange={(e) => setEventFormData({ ...eventFormData, location: e.target.value })}
                    placeholder="e.g. School Playground & Auditorium"
                    className="w-full bg-[#12121a] border border-[#202030] focus:border-sky-500/50 rounded-xl px-3 py-2.5 text-white outline-none transition"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Location / Venue (বাংলা)</label>
                  <input
                    type="text"
                    value={eventFormData.locationBn}
                    onChange={(e) => setEventFormData({ ...eventFormData, locationBn: e.target.value })}
                    placeholder="যেমন: প্রধান একাডেমিক ভবন ও মাঠ"
                    className="w-full bg-[#12121a] border border-[#202030] focus:border-sky-500/50 rounded-xl px-3 py-2.5 text-white outline-none transition"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Category</label>
                  <select
                    value={eventFormData.category}
                    onChange={(e) => {
                      const selected = e.target.value
                      const match = EVENT_CATEGORIES.find((c) => c.id === selected)
                      setEventFormData({
                        ...eventFormData,
                        category: selected,
                        categoryBn: match?.bn || eventFormData.categoryBn,
                      })
                    }}
                    className="w-full bg-[#12121a] border border-[#202030] focus:border-sky-500/50 rounded-xl px-3 py-2.5 text-white outline-none transition"
                  >
                    <option value="Academic">Academic (একাডেমিক)</option>
                    <option value="Exam">Exam (পরীক্ষা)</option>
                    <option value="Sports">Sports (ক্রীড়া)</option>
                    <option value="Cultural">Cultural (সাংস্কৃতিক)</option>
                    <option value="Science">Science (বিজ্ঞান)</option>
                    <option value="National">National Day (জাতীয় দিবস)</option>
                    <option value="Awards">Awards (পুরস্কার)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Status</label>
                  <select
                    value={eventFormData.status}
                    onChange={(e) => {
                      const selected = e.target.value
                      const match = EVENT_STATUSES.find((s) => s.id === selected)
                      setEventFormData({
                        ...eventFormData,
                        status: selected,
                        statusBn: match?.bn || eventFormData.statusBn,
                      })
                    }}
                    className="w-full bg-[#12121a] border border-[#202030] focus:border-sky-500/50 rounded-xl px-3 py-2.5 text-white outline-none transition"
                  >
                    <option value="Upcoming">Upcoming (আসন্ন)</option>
                    <option value="Registration Open">Registration Open (নিবন্ধন চলছে)</option>
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
                      src={
                        eventFormData.image ||
                        'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?auto=format&fit=crop&w=800&q=80'
                      }
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
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleUploadEventImage}
                      disabled={uploadingImage}
                    />
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

              {/* Active Toggle */}
              <div className="flex items-center gap-2 pt-2">
                <input
                  type="checkbox"
                  id="eventActive"
                  checked={eventFormData.isActive !== false}
                  onChange={(e) => setEventFormData({ ...eventFormData, isActive: e.target.checked })}
                  className="w-4 h-4 rounded text-sky-500 cursor-pointer"
                />
                <label htmlFor="eventActive" className="text-slate-300 text-xs font-semibold cursor-pointer">
                  Make event active and visible on public website
                </label>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#1e1e2e]">
                <button
                  type="button"
                  onClick={() => setIsEventModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-[#1c1c28] text-slate-300 hover:text-white border border-[#2a2a3d] font-semibold transition cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-gradient-to-r from-sky-500 to-[#6c63ff] hover:from-sky-400 hover:to-[#5a52e0] text-white font-bold shadow-lg shadow-sky-500/20 transition flex items-center gap-1.5 cursor-pointer"
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
              className="absolute top-5 right-5 text-slate-400 hover:text-white p-1 rounded-lg bg-[#1c1c28] hover:bg-[#252538] transition cursor-pointer"
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
                    <option value="Campus">Campus & Buildings (ক্যাম্পাস)</option>
                    <option value="Sports">Sports & Athletics (খেলাধুলা)</option>
                    <option value="Science">Science & Lab (বিজ্ঞান)</option>
                    <option value="Cultural">Cultural & Arts (সাংস্কৃতিক)</option>
                    <option value="Scouts">Scouts & BNCC (স্কাউট)</option>
                    <option value="Awards">Awards & Honors (পুরস্কার)</option>
                    <option value="Academic">Academic Classrooms (একাডেমিক)</option>
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
                      src={
                        galleryFormData.imageUrl ||
                        'https://images.unsplash.com/photo-1546410531-bb4caa6b424d?auto=format&fit=crop&w=800&q=80'
                      }
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
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleUploadGalleryImage}
                      disabled={uploadingImage}
                    />
                  </label>
                </div>
              </div>

              {/* Caption */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Short Caption (English)</label>
                  <textarea
                    rows={2}
                    value={galleryFormData.caption}
                    onChange={(e) => setGalleryFormData({ ...galleryFormData, caption: e.target.value })}
                    placeholder="Brief description of this photo..."
                    className="w-full bg-[#12121a] border border-[#202030] focus:border-sky-500/50 rounded-xl px-3 py-2 text-white outline-none transition text-xs"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Short Caption (বাংলা)</label>
                  <textarea
                    rows={2}
                    value={galleryFormData.captionBn}
                    onChange={(e) => setGalleryFormData({ ...galleryFormData, captionBn: e.target.value })}
                    placeholder="ছবির সংক্ষিপ্ত পরিচিতি বাংলায়..."
                    className="w-full bg-[#12121a] border border-[#202030] focus:border-sky-500/50 rounded-xl px-3 py-2 text-white outline-none transition text-xs"
                  />
                </div>
              </div>

              {/* Active Toggle */}
              <div className="flex items-center gap-2 pt-2">
                <input
                  type="checkbox"
                  id="galleryActive"
                  checked={galleryFormData.isActive !== false}
                  onChange={(e) => setGalleryFormData({ ...galleryFormData, isActive: e.target.checked })}
                  className="w-4 h-4 rounded text-sky-500 cursor-pointer"
                />
                <label htmlFor="galleryActive" className="text-slate-300 text-xs font-semibold cursor-pointer">
                  Display photo in public campus gallery
                </label>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#1e1e2e]">
                <button
                  type="button"
                  onClick={() => setIsGalleryModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-[#1c1c28] text-slate-300 hover:text-white border border-[#2a2a3d] font-semibold transition cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-gradient-to-r from-sky-500 to-[#6c63ff] hover:from-sky-400 hover:to-[#5a52e0] text-white font-bold shadow-lg shadow-sky-500/20 transition flex items-center gap-1.5 cursor-pointer"
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
