import { useState, useEffect, useRef } from 'react'
import {
  Sliders,
  Plus,
  Trash2,
  Edit3,
  Eye,
  ArrowUp,
  ArrowDown,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  Sparkles,
  Image as ImageIcon,
  Link as LinkIcon,
  RotateCcw,
  Calendar,
  Layers,
  Save,
  X,
  Check,
  Award,
  UploadCloud,
  Loader2,
  CloudUpload,
} from 'lucide-react'
import api from '../../lib/api'
import { uploadToImgbb } from '../../lib/imgbb'
import SliderSuccessAlert from '../components/SliderSuccessAlert'
import SliderDeleteAlert from '../components/SliderDeleteAlert'

// Recommended high-resolution presets from school themes
const IMAGE_PRESETS = [
  {
    name: 'Campus Main',
    url: 'https://images.unsplash.com/photo-1580582932707-520aed937b7b?auto=format&fit=crop&w=1920&q=85',
  },
  {
    name: 'Science Lab',
    url: 'https://images.unsplash.com/photo-1532094349884-543bc11b234d?auto=format&fit=crop&w=1920&q=85',
  },
  {
    name: 'Central Library',
    url: 'https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?auto=format&fit=crop&w=1920&q=85',
  },
  {
    name: 'Sports Ground',
    url: 'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?auto=format&fit=crop&w=1920&q=85',
  },
  {
    name: 'Computer Lab',
    url: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=1920&q=85',
  },
  {
    name: 'Award Ceremony',
    url: 'https://images.unsplash.com/photo-1523580494863-6f3031224c94?auto=format&fit=crop&w=1920&q=85',
  },
]

const QUICK_ROUTES = [
  { label: 'Academics', path: '/academics' },
  { label: 'Admission', path: '/admission' },
  { label: 'Results', path: '/results' },
  { label: 'Notices', path: '/notices' },
  { label: 'Events', path: '/events' },
  { label: 'Teachers', path: '/teachers' },
  { label: 'Contact', path: '/contact' },
  { label: 'Student Portal', path: '/student-dashboard' },
]

const INITIAL_FORM = {
  title: '',
  titleBn: '',
  subtitle: '',
  subtitleBn: '',
  imageUrl: '',
  badge: 'Campus Highlights',
  badgeBn: 'ক্যাম্পাস হাইলাইটস',
  date: 'Session 2026-2027',
  dateBn: 'শিক্ষাবর্ষ ২০২৬-২০২৭',
  // Button 1 (Primary CTA)
  btn1Show: true,
  btn1Text: 'Explore Academics',
  btn1TextBn: 'শিক্ষা কার্যক্রম দেখুন',
  btn1Link: '/academics',
  // Button 2 (Secondary CTA)
  btn2Show: true,
  btn2Text: 'Check Result',
  btn2TextBn: 'ফলাফল অনুসন্ধান',
  btn2Link: '/results',
  // Button 3 (Tertiary CTA)
  btn3Show: true,
  btn3Text: 'Online Admission',
  btn3TextBn: 'অনলাইন ভর্তি',
  btn3Link: '/admission',
  order: 1,
  isActive: true,
}

export default function HeroSliderManager() {
  const [slides, setSlides] = useState([])
  const [loading, setLoading] = useState(true)
  const [toast, setToast] = useState(null)
  const [modalOpen, setModalOpen] = useState(false)
  const [editingSlide, setEditingSlide] = useState(null)
  const [formData, setFormData] = useState(INITIAL_FORM)
  const [previewSlideIdx, setPreviewSlideIdx] = useState(0)
  const fileInputRef = useRef(null)
  const [uploadingImage, setUploadingImage] = useState(false)
  const [uploadSuccess, setUploadSuccess] = useState(false)
  const [successCelebration, setSuccessCelebration] = useState(null)
  const [slideToDelete, setSlideToDelete] = useState(null)
  const [deletingSlide, setDeletingSlide] = useState(false)

  const showToast = (message, type = 'success') => {
    setToast({ message, type })
    setTimeout(() => setToast(null), 4000)
  }

  // Handle local file upload directly to ImgBB
  const handleFileSelect = async (e) => {
    const file = e.target.files?.[0]
    if (!file) return

    if (!file.type.startsWith('image/')) {
      showToast('Please select a valid image file (PNG, JPG, WebP)', 'error')
      return
    }

    setUploadingImage(true)
    setUploadSuccess(false)
    try {
      const res = await uploadToImgbb(file)
      if (res && res.success && res.url) {
        setFormData((prev) => ({ ...prev, imageUrl: res.url }))
        setUploadSuccess(true)
        showToast('Image uploaded to ImgBB successfully! ☁️')
      } else {
        showToast(res.message || 'ImgBB upload failed', 'error')
      }
    } catch (err) {
      showToast(err.message || 'Upload failed', 'error')
    } finally {
      setUploadingImage(false)
      if (fileInputRef.current) fileInputRef.current.value = ''
    }
  }

  // Upload currently entered URL to ImgBB
  const handleConvertUrlToImgbb = async () => {
    if (!formData.imageUrl || !formData.imageUrl.startsWith('http')) {
      showToast('Please provide a valid image URL first', 'error')
      return
    }
    if (formData.imageUrl.includes('ibb.co')) {
      showToast('This image is already hosted on ImgBB!')
      return
    }

    setUploadingImage(true)
    try {
      const res = await uploadToImgbb(formData.imageUrl)
      if (res && res.success && res.url) {
        setFormData((prev) => ({ ...prev, imageUrl: res.url }))
        setUploadSuccess(true)
        showToast('Image uploaded to ImgBB successfully! ☁️')
      } else {
        showToast(res.message || 'Could not upload to ImgBB', 'error')
      }
    } catch (err) {
      showToast(err.message || 'Upload error', 'error')
    } finally {
      setUploadingImage(false)
    }
  }

  // Load slides from backend API or local cache
  const loadSlides = async () => {
    setLoading(true)
    try {
      const res = await api.getSliders()
      if (res && res.success && Array.isArray(res.data) && res.data.length > 0) {
        setSlides(res.data)
        localStorage.setItem('mpa_custom_slides', JSON.stringify(res.data))
      } else {
        // Fallback to local storage if API returned no data
        const cached = localStorage.getItem('mpa_custom_slides')
        if (cached) {
          setSlides(JSON.parse(cached))
        }
      }
    } catch (err) {
      console.warn('API error, using localStorage', err)
      const cached = localStorage.getItem('mpa_custom_slides')
      if (cached) {
        setSlides(JSON.parse(cached))
      }
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadSlides()
  }, [])

  // Sync state to local storage & trigger live event for website
  const syncLocal = (updated) => {
    localStorage.setItem('mpa_custom_slides', JSON.stringify(updated))
    window.dispatchEvent(new Event('mpa_slides_updated'))
  }

  // Open modal for Create
  const handleOpenCreate = () => {
    setEditingSlide(null)
    setUploadSuccess(false)
    setUploadingImage(false)
    setFormData({
      ...INITIAL_FORM,
      order: slides.length + 1,
      imageUrl: '',
    })
    setModalOpen(true)
  }

  // Open modal for Edit
  const handleOpenEdit = (slide) => {
    setEditingSlide(slide)
    setUploadSuccess(false)
    setUploadingImage(false)
    setFormData({
      title: slide.title || '',
      titleBn: slide.titleBn || '',
      subtitle: slide.subtitle || '',
      subtitleBn: slide.subtitleBn || '',
      imageUrl: slide.imageUrl || slide.url || '',
      badge: slide.badge || 'Campus Highlights',
      badgeBn: slide.badgeBn || 'ক্যাম্পাস হাইলাইটস',
      date: slide.date || 'Session 2026-2027',
      dateBn: slide.dateBn || 'শিক্ষাবর্ষ ২০২৬-২০২৭',
      // Button 1
      btn1Show: slide.btn1Show !== false,
      btn1Text: slide.btn1Text || slide.primaryBtnText || 'Explore Academics',
      btn1TextBn: slide.btn1TextBn || slide.primaryBtnTextBn || 'শিক্ষা কার্যক্রম দেখুন',
      btn1Link: slide.btn1Link || slide.primaryBtnLink || '/academics',
      // Button 2
      btn2Show: slide.btn2Show !== false,
      btn2Text: slide.btn2Text || slide.secondaryBtnText || 'Check Result',
      btn2TextBn: slide.btn2TextBn || slide.secondaryBtnTextBn || 'ফলাফল অনুসন্ধান',
      btn2Link: slide.btn2Link || slide.secondaryBtnLink || '/results',
      // Button 3
      btn3Show: slide.btn3Show !== false,
      btn3Text: slide.btn3Text || 'Online Admission',
      btn3TextBn: slide.btn3TextBn || 'অনলাইন ভর্তি',
      btn3Link: slide.btn3Link || '/admission',
      order: slide.order || 1,
      isActive: slide.isActive !== false,
    })
    setModalOpen(true)
  }

  // Submit Add or Edit
  const handleSaveSlide = async (e) => {
    e.preventDefault()
    if (!formData.title.trim()) {
      showToast('English Title is required', 'error')
      return
    }
    if (!formData.imageUrl.trim()) {
      showToast('Slide Image URL is required', 'error')
      return
    }

    try {
      if (editingSlide) {
        const id = editingSlide._id || editingSlide.id
        // Call backend API
        let apiSuccess = false
        if (id && !String(id).startsWith('default-')) {
          const res = await api.updateSlider(id, formData)
          if (res && res.success) apiSuccess = true
        }

        const savedSlide = { ...editingSlide, ...formData, _id: id }
        const updated = slides.map((s) =>
          (s._id || s.id) === id ? savedSlide : s
        )
        setSlides(updated)
        syncLocal(updated)
        showToast('Slide updated successfully!')
        setSuccessCelebration({ slide: savedSlide, isEdit: true })
      } else {
        // Create new
        let newSlide = null
        const res = await api.createSlider(formData)
        if (res && res.success && res.data) {
          newSlide = res.data
        } else {
          newSlide = {
            ...formData,
            _id: 'custom-' + Date.now(),
            createdAt: new Date().toISOString(),
          }
        }

        const updated = [...slides, newSlide]
        setSlides(updated)
        syncLocal(updated)
        showToast('New slide created successfully!')
        // Trigger celebration designer success alert
        setSuccessCelebration({ slide: newSlide, isEdit: false })
      }
      setModalOpen(false)
    } catch (err) {
      console.error(err)
      showToast('Failed to save slide', 'error')
    }
  }

  // Delete slide - open custom alert modal
  const handleDeleteSlide = (slide) => {
    setSlideToDelete(slide)
  }

  // Confirm and execute delete from custom alert modal
  const handleConfirmDelete = async () => {
    if (!slideToDelete) return

    const id = slideToDelete._id || slideToDelete.id
    setDeletingSlide(true)
    try {
      if (id && !String(id).startsWith('default-')) {
        await api.deleteSlider(id)
      }
      const updated = slides.filter((s) => (s._id || s.id) !== id)
      setSlides(updated)
      syncLocal(updated)
      showToast(`Slide "${slideToDelete.title || 'Untitled'}" deleted successfully! 🗑️`)
      setSlideToDelete(null)
    } catch (err) {
      console.error(err)
      showToast('Error deleting slide', 'error')
    } finally {
      setDeletingSlide(false)
    }
  }

  // Toggle active status
  const handleToggleActive = async (slide) => {
    const id = slide._id || slide.id
    const newStatus = !slide.isActive
    try {
      if (id && !String(id).startsWith('default-')) {
        await api.updateSlider(id, { isActive: newStatus })
      }
      const updated = slides.map((s) =>
        (s._id || s.id) === id ? { ...s, isActive: newStatus } : s
      )
      setSlides(updated)
      syncLocal(updated)
      showToast(newStatus ? 'Slide activated' : 'Slide hidden')
    } catch (err) {
      console.error(err)
    }
  }

  // Move slide up
  const handleMoveUp = async (index) => {
    if (index === 0) return
    const updated = [...slides]
    const temp = updated[index - 1]
    updated[index - 1] = updated[index]
    updated[index] = temp

    // Update orders
    updated.forEach((s, idx) => {
      s.order = idx + 1
    })

    setSlides(updated)
    syncLocal(updated)

    try {
      const items = updated.map((s) => ({ id: s._id || s.id, order: s.order }))
      await api.reorderSliders(items)
    } catch {}
  }

  // Move slide down
  const handleMoveDown = async (index) => {
    if (index === slides.length - 1) return
    const updated = [...slides]
    const temp = updated[index + 1]
    updated[index + 1] = updated[index]
    updated[index] = temp

    // Update orders
    updated.forEach((s, idx) => {
      s.order = idx + 1
    })

    setSlides(updated)
    syncLocal(updated)

    try {
      const items = updated.map((s) => ({ id: s._id || s.id, order: s.order }))
      await api.reorderSliders(items)
    } catch {}
  }

  // Reset / Seed Default Slides
  const handleSeedDefaults = async () => {
    if (!window.confirm('Reset slides to school default banners? Any custom changes will be overwritten.')) return
    try {
      setLoading(true)
      const res = await api.seedSliders()
      if (res && res.success && res.data) {
        setSlides(res.data)
        syncLocal(res.data)
        showToast('Default slides restored!')
      } else {
        localStorage.removeItem('mpa_custom_slides')
        window.location.reload()
      }
    } catch (err) {
      console.error(err)
      showToast('Could not reset slides', 'error')
    } finally {
      setLoading(false)
    }
  }

  const activeSlidesCount = slides.filter((s) => s.isActive !== false).length
  const currentPreviewSlide = slides[previewSlideIdx] || slides[0]

  return (
    <div className="space-y-6 pb-12">
      {/* Toast Alert */}
      {toast && (
        <div
          className={`fixed top-4 right-4 z-50 px-4 py-3 rounded-xl border shadow-xl flex items-center gap-2 text-xs font-bold transition-all ${
            toast.type === 'error'
              ? 'bg-rose-950/90 border-rose-500/30 text-rose-300'
              : 'bg-emerald-950/90 border-emerald-500/30 text-emerald-300'
          }`}
        >
          {toast.type === 'error' ? <AlertCircle className="w-4 h-4" /> : <CheckCircle2 className="w-4 h-4" />}
          <span>{toast.message}</span>
        </div>
      )}

      {/* World-Class Designer Celebration Success Alert */}
      {successCelebration && (
        <SliderSuccessAlert
          slide={successCelebration.slide}
          isEdit={successCelebration.isEdit}
          onClose={() => setSuccessCelebration(null)}
          onCreateAnother={() => {
            setSuccessCelebration(null)
            handleOpenCreate()
          }}
        />
      )}

      {/* World-Class Custom Slide Delete Confirmation Alert */}
      {slideToDelete && (
        <SliderDeleteAlert
          slide={slideToDelete}
          deleting={deletingSlide}
          onConfirm={handleConfirmDelete}
          onCancel={() => {
            if (!deletingSlide) setSlideToDelete(null)
          }}
        />
      )}

      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-2xl bg-gradient-to-r from-[#181824] via-[#151520] to-[#12121c] border border-[#222234] shadow-lg">
        <div>
          <div className="flex items-center gap-2.5">
            <span className="p-2 rounded-xl bg-[#6c63ff]/20 text-[#a78bfa] border border-[#6c63ff]/30">
              <Sliders className="w-5 h-5" />
            </span>
            <div>
              <span className="text-[11px] font-extrabold uppercase tracking-widest text-[#a78bfa]">
                Website CMS · Hero Section
              </span>
              <h1 className="text-xl sm:text-2xl font-black text-white font-display">
                Hero Slider Manager
              </h1>
            </div>
          </div>
          <p className="text-xs text-slate-400 mt-2 max-w-2xl">
            Control the full-screen homepage slider dynamically. Add custom images, headlines, subtitles, badges, and CTA action buttons with instant live updates.
          </p>
        </div>

        <div className="flex items-center gap-2.5 flex-wrap">
          <button
            onClick={handleSeedDefaults}
            title="Reset to default school slides"
            className="px-3 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white border border-white/10 text-xs font-semibold inline-flex items-center gap-1.5 transition"
          >
            <RotateCcw className="w-3.5 h-3.5 text-slate-400" />
            <span>Reset Defaults</span>
          </button>

          <a
            href="/"
            target="_blank"
            rel="noreferrer"
            className="px-3.5 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white border border-white/10 text-xs font-bold inline-flex items-center gap-1.5 transition"
          >
            <ExternalLink className="w-3.5 h-3.5 text-[#a78bfa]" />
            <span>Live Website</span>
          </a>

          <button
            onClick={handleOpenCreate}
            className="moom-btn-primary px-4 py-2 rounded-xl text-xs font-bold inline-flex items-center gap-2 shadow-lg"
          >
            <Plus className="w-4 h-4" />
            <span>Add New Slide</span>
          </button>
        </div>
      </div>

      {/* Stats Counter Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
        <div className="p-4 rounded-xl bg-[#14141e] border border-[#1e1e2e]">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Total Slides</span>
          <span className="text-2xl font-black text-white mt-1 block font-display">{slides.length}</span>
        </div>
        <div className="p-4 rounded-xl bg-[#14141e] border border-[#1e1e2e]">
          <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider block">Active On Site</span>
          <span className="text-2xl font-black text-emerald-400 mt-1 block font-display">{activeSlidesCount}</span>
        </div>
        <div className="p-4 rounded-xl bg-[#14141e] border border-[#1e1e2e]">
          <span className="text-[10px] font-bold text-amber-400 uppercase tracking-wider block">Hidden / Draft</span>
          <span className="text-2xl font-black text-amber-400 mt-1 block font-display">{slides.length - activeSlidesCount}</span>
        </div>
        <div className="p-4 rounded-xl bg-[#14141e] border border-[#1e1e2e]">
          <span className="text-[10px] font-bold text-[#a78bfa] uppercase tracking-wider block">Slide Rotation</span>
          <span className="text-xs font-bold text-slate-200 mt-2 block">Autoplay · 6s Interval</span>
        </div>
      </div>

      {/* Live Interactive Preview Box */}
      {currentPreviewSlide && (
        <div className="rounded-2xl bg-[#12121a] border border-[#222232] overflow-hidden shadow-2xl">
          <div className="px-4 py-2.5 bg-[#161622] border-b border-[#222232] flex items-center justify-between text-xs">
            <div className="flex items-center gap-2">
              <Eye className="w-4 h-4 text-[#a78bfa]" />
              <span className="font-bold text-white">Live Slide Preview</span>
              <span className="text-[10px] text-slate-400">
                (Slide {previewSlideIdx + 1} of {slides.length})
              </span>
            </div>
            {slides.length > 1 && (
              <div className="flex items-center gap-1.5">
                {slides.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setPreviewSlideIdx(i)}
                    className={`w-5 h-5 rounded-md text-[10px] font-bold transition ${
                      previewSlideIdx === i
                        ? 'bg-[#6c63ff] text-white shadow'
                        : 'bg-white/5 text-slate-400 hover:bg-white/10'
                    }`}
                  >
                    {i + 1}
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="relative h-64 sm:h-80 w-full overflow-hidden flex flex-col justify-end p-6 sm:p-10 select-none">
            <img
              src={currentPreviewSlide.imageUrl || currentPreviewSlide.url}
              alt=""
              className="absolute inset-0 w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/70 to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/30" />

            <div className="relative z-10 max-w-2xl space-y-2">
              <div className="flex items-center gap-2">
                {currentPreviewSlide.badge && (
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#ffc233]/20 text-[#ffc233] border border-[#ffc233]/40">
                    ★ {currentPreviewSlide.badge}
                  </span>
                )}
                {currentPreviewSlide.date && (
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-medium text-slate-300 bg-white/10 border border-white/15">
                    {currentPreviewSlide.date}
                  </span>
                )}
              </div>

              <h2 className="text-xl sm:text-2xl font-black text-white leading-tight font-display drop-shadow">
                {currentPreviewSlide.title}
              </h2>

              {currentPreviewSlide.subtitle && (
                <p className="text-xs sm:text-sm text-slate-300 line-clamp-2 drop-shadow">
                  {currentPreviewSlide.subtitle}
                </p>
              )}

              <div className="flex items-center gap-2 pt-2 flex-wrap">
                {currentPreviewSlide.btn1Show !== false && (currentPreviewSlide.btn1Text || currentPreviewSlide.primaryBtnText) && (
                  <span className="px-3.5 py-1.5 rounded-full bg-[#ffc233] text-black font-bold text-xs shadow">
                    {currentPreviewSlide.btn1Text || currentPreviewSlide.primaryBtnText} →
                  </span>
                )}
                {currentPreviewSlide.btn2Show !== false && (currentPreviewSlide.btn2Text || currentPreviewSlide.secondaryBtnText) && (
                  <span className="px-3.5 py-1.5 rounded-full bg-white/10 text-white font-semibold text-xs border border-white/20">
                    {currentPreviewSlide.btn2Text || currentPreviewSlide.secondaryBtnText}
                  </span>
                )}
                {currentPreviewSlide.btn3Show !== false && currentPreviewSlide.btn3Text && (
                  <span className="px-3.5 py-1.5 rounded-full bg-[#6c63ff]/80 text-white font-bold text-xs border border-white/20">
                    🛡️ {currentPreviewSlide.btn3Text}
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Slides Management List */}
      <div className="space-y-3">
        <div className="flex items-center justify-between px-1">
          <h2 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
            <Layers className="w-4 h-4 text-[#a78bfa]" />
            <span>All Hero Slides ({slides.length})</span>
          </h2>
          <span className="text-xs text-slate-500">Drag or use arrows to change order</span>
        </div>

        {slides.length === 0 ? (
          <div className="p-12 text-center rounded-2xl bg-[#14141e] border border-[#1e1e2e]">
            <Sliders className="w-10 h-10 text-slate-600 mx-auto mb-3" />
            <p className="text-sm font-bold text-white">No slides created yet</p>
            <p className="text-xs text-slate-400 mt-1 mb-4">Click below to add your first slide or reset default templates.</p>
            <button onClick={handleOpenCreate} className="moom-btn-primary px-4 py-2 rounded-xl text-xs font-bold inline-flex items-center gap-1.5">
              <Plus className="w-4 h-4" /> Add Slide
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            {slides.map((slide, index) => {
              const id = slide._id || slide.id
              const imgUrl = slide.imageUrl || slide.url
              return (
                <div
                  key={id || index}
                  className={`p-4 rounded-2xl border transition-all ${
                    slide.isActive !== false
                      ? 'bg-[#14141e] border-[#202030] hover:border-[#6c63ff]/40 shadow-sm'
                      : 'bg-[#0f0f16] border-[#181824] opacity-60'
                  }`}
                >
                  <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                    {/* Left: Thumbnail & Info */}
                    <div className="flex items-start sm:items-center gap-3.5 flex-1 min-w-0">
                      {/* Thumbnail */}
                      <div className="relative w-24 h-16 sm:w-32 sm:h-20 rounded-xl overflow-hidden shrink-0 border border-white/10 bg-black">
                        <img src={imgUrl} alt="" className="w-full h-full object-cover" />
                        <span className="absolute top-1 left-1 px-1.5 py-0.5 rounded-md bg-black/70 text-[9px] font-mono text-white">
                          #{index + 1}
                        </span>
                      </div>

                      {/* Details */}
                      <div className="min-w-0 flex-1 space-y-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span
                            className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider ${
                              slide.isActive !== false
                                ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                                : 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                            }`}
                          >
                            {slide.isActive !== false ? 'Active' : 'Hidden'}
                          </span>
                          {slide.badge && (
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-[#6c63ff]/15 text-[#a78bfa] border border-[#6c63ff]/25 truncate max-w-[150px]">
                              {slide.badge}
                            </span>
                          )}
                          {slide.date && (
                            <span className="text-[10px] text-slate-400 font-mono">
                              {slide.date}
                            </span>
                          )}
                          {imgUrl && (imgUrl.includes('ibb.co') || imgUrl.includes('imgbb')) && (
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-sky-500/15 text-sky-400 border border-sky-500/30 flex items-center gap-1">
                              ☁️ ImgBB
                            </span>
                          )}
                        </div>

                        <h3 className="text-sm font-bold text-white truncate font-display">
                          {slide.title}
                        </h3>

                        {slide.titleBn && (
                          <p className="text-xs text-slate-400 truncate font-bengali">
                            {slide.titleBn}
                          </p>
                        )}

                        <div className="flex items-center gap-2.5 pt-1 text-[11px] text-slate-400 flex-wrap">
                          {/* Btn 1 */}
                          <span className={`inline-flex items-center gap-1 ${slide.btn1Show !== false ? 'text-slate-300' : 'text-slate-500 line-through'}`}>
                            <span className={`w-1.5 h-1.5 rounded-full ${slide.btn1Show !== false ? 'bg-[#ffc233]' : 'bg-slate-600'}`} />
                            <b>Btn 1:</b> {slide.btn1Text || slide.primaryBtnText || 'Academics'} ({slide.btn1Link || slide.primaryBtnLink || '/academics'})
                            {slide.btn1Show === false && <span className="text-[9px] text-rose-400 font-mono no-underline">(Hidden)</span>}
                          </span>

                          {/* Btn 2 */}
                          <span className={`inline-flex items-center gap-1 ${slide.btn2Show !== false ? 'text-slate-300' : 'text-slate-500 line-through'}`}>
                            <span className={`w-1.5 h-1.5 rounded-full ${slide.btn2Show !== false ? 'bg-sky-400' : 'bg-slate-600'}`} />
                            <b>Btn 2:</b> {slide.btn2Text || slide.secondaryBtnText || 'Result'} ({slide.btn2Link || slide.secondaryBtnLink || '/results'})
                            {slide.btn2Show === false && <span className="text-[9px] text-rose-400 font-mono no-underline">(Hidden)</span>}
                          </span>

                          {/* Btn 3 */}
                          <span className={`inline-flex items-center gap-1 ${slide.btn3Show !== false ? 'text-slate-300' : 'text-slate-500 line-through'}`}>
                            <span className={`w-1.5 h-1.5 rounded-full ${slide.btn3Show !== false ? 'bg-[#a78bfa]' : 'bg-slate-600'}`} />
                            <b>Btn 3:</b> {slide.btn3Text || 'Admission'} ({slide.btn3Link || '/admission'})
                            {slide.btn3Show === false && <span className="text-[9px] text-rose-400 font-mono no-underline">(Hidden)</span>}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Right: Actions */}
                    <div className="flex items-center gap-1.5 sm:gap-2 self-end lg:self-center shrink-0 pt-2 lg:pt-0 border-t lg:border-t-0 border-white/5 w-full lg:w-auto justify-end">
                      {/* Reorder Arrows */}
                      <button
                        onClick={() => handleMoveUp(index)}
                        disabled={index === 0}
                        title="Move Up"
                        className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white disabled:opacity-30 disabled:pointer-events-none transition"
                      >
                        <ArrowUp className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleMoveDown(index)}
                        disabled={index === slides.length - 1}
                        title="Move Down"
                        className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white disabled:opacity-30 disabled:pointer-events-none transition"
                      >
                        <ArrowDown className="w-4 h-4" />
                      </button>

                      {/* Preview Button */}
                      <button
                        onClick={() => setPreviewSlideIdx(index)}
                        title="Preview above"
                        className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white transition"
                      >
                        <Eye className="w-4 h-4 text-[#a78bfa]" />
                      </button>

                      {/* Active Toggle */}
                      <button
                        onClick={() => handleToggleActive(slide)}
                        title={slide.isActive !== false ? 'Hide slide' : 'Activate slide'}
                        className={`px-2.5 py-1.5 rounded-lg text-xs font-bold border transition ${
                          slide.isActive !== false
                            ? 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30 hover:bg-emerald-500/25'
                            : 'bg-rose-500/15 text-rose-400 border-rose-500/30 hover:bg-rose-500/25'
                        }`}
                      >
                        {slide.isActive !== false ? 'Active' : 'Hidden'}
                      </button>

                      {/* Edit */}
                      <button
                        onClick={() => handleOpenEdit(slide)}
                        title="Edit slide content"
                        className="p-2 rounded-lg bg-[#6c63ff]/20 text-[#a78bfa] hover:bg-[#6c63ff]/30 border border-[#6c63ff]/30 transition"
                      >
                        <Edit3 className="w-4 h-4" />
                      </button>

                      {/* Delete */}
                      <button
                        onClick={() => handleDeleteSlide(slide)}
                        title="Delete slide"
                        className="p-2 rounded-lg bg-rose-500/10 text-rose-400 hover:bg-rose-500/20 border border-rose-500/20 transition"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>

      {/* ── Slide Add / Edit Modal ── */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto">
          <div className="relative w-full max-w-3xl my-8 rounded-2xl bg-[#14141e] border border-[#252538] shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
            {/* Modal Header */}
            <div className="px-6 py-4 bg-[#181826] border-b border-[#252538] flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <span className="p-2 rounded-lg bg-[#6c63ff]/20 text-[#a78bfa]">
                  <Sliders className="w-4 h-4" />
                </span>
                <h3 className="text-base font-bold text-white font-display">
                  {editingSlide ? 'Edit Hero Slide' : 'Create New Hero Slide'}
                </h3>
              </div>
              <button
                onClick={() => setModalOpen(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/5 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body Form */}
            <form onSubmit={handleSaveSlide} className="p-6 overflow-y-auto space-y-5 flex-1 moom-scrollbar text-xs">
              {/* ── ImgBB Image Upload & Management ── */}
              <div className="space-y-3 p-4 rounded-2xl bg-[#101018] border border-[#222234]">
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <label className="font-bold text-slate-200 flex items-center gap-1.5 text-xs">
                    <CloudUpload className="w-4 h-4 text-[#a78bfa]" />
                    <span>Slide Image (ImgBB Cloud Hosting) *</span>
                  </label>
                  {formData.imageUrl && formData.imageUrl.includes('ibb.co') && (
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-sky-500/20 text-sky-400 border border-sky-500/30 inline-flex items-center gap-1">
                      ☁️ Hosted on ImgBB
                    </span>
                  )}
                </div>

                {/* Hidden File Input */}
                <input
                  type="file"
                  ref={fileInputRef}
                  accept="image/png,image/jpeg,image/jpg,image/webp,image/gif"
                  className="hidden"
                  onChange={handleFileSelect}
                />

                {/* Upload Zone / Dropzone Button */}
                <div
                  onClick={() => !uploadingImage && fileInputRef.current?.click()}
                  className={`p-5 rounded-xl border-2 border-dashed transition-all cursor-pointer text-center select-none flex flex-col items-center justify-center gap-2 ${
                    uploadingImage
                      ? 'border-[#6c63ff] bg-[#6c63ff]/10 pointer-events-none'
                      : 'border-[#2e2e42] hover:border-[#6c63ff]/80 hover:bg-white/[0.02] bg-[#0c0c12]'
                  }`}
                >
                  {uploadingImage ? (
                    <div className="flex flex-col items-center gap-2 py-2">
                      <Loader2 className="w-8 h-8 text-[#a78bfa] animate-spin" />
                      <p className="text-xs font-bold text-white">Uploading image to ImgBB...</p>
                      <p className="text-[10px] text-slate-400">Please wait while the image link is being generated</p>
                    </div>
                  ) : (
                    <>
                      <div className="w-12 h-12 rounded-2xl bg-[#6c63ff]/10 text-[#a78bfa] border border-[#6c63ff]/20 flex items-center justify-center">
                        <UploadCloud className="w-6 h-6" />
                      </div>
                      <div className="space-y-0.5">
                        <p className="text-xs font-bold text-white">
                          Click to upload an image from your computer
                        </p>
                        <p className="text-[10px] text-slate-400">
                          PNG, JPG, WebP, GIF (Max 32MB) · Automatically uploads to ImgBB and saves to database
                        </p>
                      </div>
                      <button
                        type="button"
                        className="mt-1 px-4 py-1.5 rounded-lg bg-[#6c63ff] text-white text-[11px] font-bold hover:bg-[#5b52f0] transition shadow-md inline-flex items-center gap-1.5"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>Choose File from PC</span>
                      </button>
                    </>
                  )}
                </div>

                {/* Direct ImgBB Link Input with Convert Button */}
                <div className="space-y-1 pt-1">
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="text-slate-400 font-semibold">Image URL (ImgBB / Web Link):</span>
                    {formData.imageUrl && !formData.imageUrl.includes('ibb.co') && (
                      <button
                        type="button"
                        onClick={handleConvertUrlToImgbb}
                        disabled={uploadingImage}
                        className="text-[#a78bfa] hover:underline font-bold inline-flex items-center gap-1 text-[10px]"
                      >
                        <UploadCloud className="w-3 h-3" />
                        <span>Upload this URL to ImgBB</span>
                      </button>
                    )}
                  </div>
                  <input
                    type="url"
                    required
                    placeholder="https://i.ibb.co/..."
                    value={formData.imageUrl}
                    onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl bg-[#0a0a0f] border border-[#26263a] text-white text-xs outline-none focus:border-[#6c63ff]"
                  />
                </div>

                {/* Sample Presets */}
                <div className="flex items-center gap-1.5 flex-wrap pt-1">
                  <span className="text-[10px] text-slate-500 font-bold uppercase mr-1">Sample Photos:</span>
                  {IMAGE_PRESETS.map((preset) => (
                    <button
                      key={preset.name}
                      type="button"
                      onClick={() => setFormData({ ...formData, imageUrl: preset.url })}
                      className="px-2 py-0.5 rounded-md bg-white/5 hover:bg-[#6c63ff]/20 text-[10px] text-slate-300 hover:text-white border border-white/5 transition"
                    >
                      {preset.name}
                    </button>
                  ))}
                </div>

                {/* Live Image Preview Card */}
                {formData.imageUrl && (
                  <div className="mt-2 relative h-40 rounded-xl overflow-hidden border border-white/10 bg-black">
                    <img src={formData.imageUrl} alt="" className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-transparent to-black/30" />
                    <div className="absolute bottom-2.5 left-3 right-3 flex items-center justify-between text-[10px] text-slate-300">
                      <span className="font-semibold truncate max-w-[70%]">
                        {formData.imageUrl}
                      </span>
                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="px-2 py-1 rounded bg-white/20 hover:bg-white/30 text-white font-bold backdrop-blur transition"
                      >
                        Change Image
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Title Section (English & Bangla) */}
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="font-bold text-slate-200">
                    Headline / Title (English) *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Knowledge, Character & Excellence"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#0e0e14] border border-[#26263a] text-white text-xs outline-none focus:border-[#6c63ff]"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="font-bold text-slate-200">
                    Headline / Title (বাংলা)
                  </label>
                  <input
                    type="text"
                    placeholder="যেমন: জ্ঞান, চরিত্র ও শ্রেষ্ঠত্ব"
                    value={formData.titleBn}
                    onChange={(e) => setFormData({ ...formData, titleBn: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#0e0e14] border border-[#26263a] text-white text-xs outline-none focus:border-[#6c63ff]"
                  />
                </div>
              </div>

              {/* Subtitle Section (English & Bangla) */}
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="font-bold text-slate-200">
                    Subtitle / Description (English)
                  </label>
                  <textarea
                    rows={3}
                    placeholder="Brief description for the slide..."
                    value={formData.subtitle}
                    onChange={(e) => setFormData({ ...formData, subtitle: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#0e0e14] border border-[#26263a] text-white text-xs outline-none focus:border-[#6c63ff]"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="font-bold text-slate-200">
                    Subtitle / Description (বাংলা)
                  </label>
                  <textarea
                    rows={3}
                    placeholder="স্লাইডের বিস্তারিত বিবরণ..."
                    value={formData.subtitleBn}
                    onChange={(e) => setFormData({ ...formData, subtitleBn: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#0e0e14] border border-[#26263a] text-white text-xs outline-none focus:border-[#6c63ff]"
                  />
                </div>
              </div>

              {/* Badges & Date */}
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="font-bold text-slate-200">
                    Top Badge Tag (English / বাংলা)
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    <input
                      type="text"
                      placeholder="Campus Life"
                      value={formData.badge}
                      onChange={(e) => setFormData({ ...formData, badge: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl bg-[#0e0e14] border border-[#26263a] text-white text-xs outline-none focus:border-[#6c63ff]"
                    />
                    <input
                      type="text"
                      placeholder="ক্যাম্পাস জীবন"
                      value={formData.badgeBn}
                      onChange={(e) => setFormData({ ...formData, badgeBn: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl bg-[#0e0e14] border border-[#26263a] text-white text-xs outline-none focus:border-[#6c63ff]"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="font-bold text-slate-200">
                    Date / Session Tag (English / বাংলা)
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    <input
                      type="text"
                      placeholder="Session 2026-2027"
                      value={formData.date}
                      onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl bg-[#0e0e14] border border-[#26263a] text-white text-xs outline-none focus:border-[#6c63ff]"
                    />
                    <input
                      type="text"
                      placeholder="শিক্ষাবর্ষ ২০২৬-২০২৭"
                      value={formData.dateBn}
                      onChange={(e) => setFormData({ ...formData, dateBn: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl bg-[#0e0e14] border border-[#26263a] text-white text-xs outline-none focus:border-[#6c63ff]"
                    />
                  </div>
                </div>
              </div>

              {/* ── 3 Action Buttons Manager (Show / Hide + Custom URLs per slide) ── */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-white text-xs uppercase tracking-wider flex items-center gap-2">
                    <Award className="w-4 h-4 text-[#ffc233]" />
                    <span>Slide Action Buttons (3 Buttons · Custom Links & Hide/Show)</span>
                  </span>
                  <span className="text-[10px] text-slate-400">Toggle each button on or off for this slide</span>
                </div>

                {/* ── Button 1 (Primary Gold Button) ── */}
                <div className={`p-4 rounded-xl border transition-all ${formData.btn1Show ? 'bg-[#101018] border-[#302a18]' : 'bg-[#0c0c12] border-[#1e1e2c] opacity-60'}`}>
                  <div className="flex items-center justify-between pb-3 border-b border-white/5">
                    <div className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-[#ffc233]" />
                      <span className="font-bold text-[#ffc233] text-xs">Button 1 (Primary CTA)</span>
                    </div>
                    <label className="flex items-center gap-2 cursor-pointer select-none">
                      <input
                        type="checkbox"
                        checked={formData.btn1Show}
                        onChange={(e) => setFormData({ ...formData, btn1Show: e.target.checked })}
                        className="w-4 h-4 rounded text-[#ffc233] bg-[#0e0e14] border-[#26263a]"
                      />
                      <span className={`text-xs font-bold ${formData.btn1Show ? 'text-[#ffc233]' : 'text-slate-400'}`}>
                        {formData.btn1Show ? 'Visible on slide' : 'Hidden'}
                      </span>
                    </label>
                  </div>

                  {formData.btn1Show && (
                    <div className="pt-3 space-y-3">
                      <div className="grid sm:grid-cols-3 gap-3">
                        <div>
                          <label className="font-semibold text-slate-400 block mb-1">Text (English)</label>
                          <input
                            type="text"
                            placeholder="Explore Academics"
                            value={formData.btn1Text}
                            onChange={(e) => setFormData({ ...formData, btn1Text: e.target.value })}
                            className="w-full px-3 py-2 rounded-xl bg-[#0a0a0f] border border-[#26263a] text-white text-xs outline-none focus:border-[#ffc233]"
                          />
                        </div>
                        <div>
                          <label className="font-semibold text-slate-400 block mb-1">Text (বাংলা)</label>
                          <input
                            type="text"
                            placeholder="শিক্ষা কার্যক্রম দেখুন"
                            value={formData.btn1TextBn}
                            onChange={(e) => setFormData({ ...formData, btn1TextBn: e.target.value })}
                            className="w-full px-3 py-2 rounded-xl bg-[#0a0a0f] border border-[#26263a] text-white text-xs outline-none focus:border-[#ffc233]"
                          />
                        </div>
                        <div>
                          <label className="font-semibold text-slate-400 block mb-1">Custom Route Link</label>
                          <input
                            type="text"
                            placeholder="/academics"
                            value={formData.btn1Link}
                            onChange={(e) => setFormData({ ...formData, btn1Link: e.target.value })}
                            className="w-full px-3 py-2 rounded-xl bg-[#0a0a0f] border border-[#26263a] text-white text-xs outline-none focus:border-[#ffc233]"
                          />
                        </div>
                      </div>

                      {/* Quick Links for Btn 1 */}
                      <div className="flex items-center gap-1.5 flex-wrap pt-0.5">
                        <span className="text-[10px] text-slate-500 font-bold uppercase mr-1">Quick Links:</span>
                        {QUICK_ROUTES.map((route) => (
                          <button
                            key={route.path}
                            type="button"
                            onClick={() => setFormData({ ...formData, btn1Link: route.path })}
                            className="px-2 py-0.5 rounded bg-white/5 hover:bg-white/10 text-[10px] text-slate-400 hover:text-white transition"
                          >
                            {route.label}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* ── Button 2 (Secondary Glass Button) ── */}
                <div className={`p-4 rounded-xl border transition-all ${formData.btn2Show ? 'bg-[#101018] border-[#222838]' : 'bg-[#0c0c12] border-[#1e1e2c] opacity-60'}`}>
                  <div className="flex items-center justify-between pb-3 border-b border-white/5">
                    <div className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-sky-400" />
                      <span className="font-bold text-sky-300 text-xs">Button 2 (Secondary CTA)</span>
                    </div>
                    <label className="flex items-center gap-2 cursor-pointer select-none">
                      <input
                        type="checkbox"
                        checked={formData.btn2Show}
                        onChange={(e) => setFormData({ ...formData, btn2Show: e.target.checked })}
                        className="w-4 h-4 rounded text-sky-400 bg-[#0e0e14] border-[#26263a]"
                      />
                      <span className={`text-xs font-bold ${formData.btn2Show ? 'text-sky-300' : 'text-slate-400'}`}>
                        {formData.btn2Show ? 'Visible on slide' : 'Hidden'}
                      </span>
                    </label>
                  </div>

                  {formData.btn2Show && (
                    <div className="pt-3 space-y-3">
                      <div className="grid sm:grid-cols-3 gap-3">
                        <div>
                          <label className="font-semibold text-slate-400 block mb-1">Text (English)</label>
                          <input
                            type="text"
                            placeholder="Check Result"
                            value={formData.btn2Text}
                            onChange={(e) => setFormData({ ...formData, btn2Text: e.target.value })}
                            className="w-full px-3 py-2 rounded-xl bg-[#0a0a0f] border border-[#26263a] text-white text-xs outline-none focus:border-sky-400"
                          />
                        </div>
                        <div>
                          <label className="font-semibold text-slate-400 block mb-1">Text (বাংলা)</label>
                          <input
                            type="text"
                            placeholder="ফলাফল অনুসন্ধান"
                            value={formData.btn2TextBn}
                            onChange={(e) => setFormData({ ...formData, btn2TextBn: e.target.value })}
                            className="w-full px-3 py-2 rounded-xl bg-[#0a0a0f] border border-[#26263a] text-white text-xs outline-none focus:border-sky-400"
                          />
                        </div>
                        <div>
                          <label className="font-semibold text-slate-400 block mb-1">Custom Route Link</label>
                          <input
                            type="text"
                            placeholder="/results"
                            value={formData.btn2Link}
                            onChange={(e) => setFormData({ ...formData, btn2Link: e.target.value })}
                            className="w-full px-3 py-2 rounded-xl bg-[#0a0a0f] border border-[#26263a] text-white text-xs outline-none focus:border-sky-400"
                          />
                        </div>
                      </div>

                      {/* Quick Links for Btn 2 */}
                      <div className="flex items-center gap-1.5 flex-wrap pt-0.5">
                        <span className="text-[10px] text-slate-500 font-bold uppercase mr-1">Quick Links:</span>
                        {QUICK_ROUTES.map((route) => (
                          <button
                            key={route.path}
                            type="button"
                            onClick={() => setFormData({ ...formData, btn2Link: route.path })}
                            className="px-2 py-0.5 rounded bg-white/5 hover:bg-white/10 text-[10px] text-slate-400 hover:text-white transition"
                          >
                            {route.label}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* ── Button 3 (Tertiary Accent Button) ── */}
                <div className={`p-4 rounded-xl border transition-all ${formData.btn3Show ? 'bg-[#101018] border-[#2c223a]' : 'bg-[#0c0c12] border-[#1e1e2c] opacity-60'}`}>
                  <div className="flex items-center justify-between pb-3 border-b border-white/5">
                    <div className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-[#a78bfa]" />
                      <span className="font-bold text-[#a78bfa] text-xs">Button 3 (Tertiary CTA / Admission / Portal)</span>
                    </div>
                    <label className="flex items-center gap-2 cursor-pointer select-none">
                      <input
                        type="checkbox"
                        checked={formData.btn3Show}
                        onChange={(e) => setFormData({ ...formData, btn3Show: e.target.checked })}
                        className="w-4 h-4 rounded text-[#a78bfa] bg-[#0e0e14] border-[#26263a]"
                      />
                      <span className={`text-xs font-bold ${formData.btn3Show ? 'text-[#a78bfa]' : 'text-slate-400'}`}>
                        {formData.btn3Show ? 'Visible on slide' : 'Hidden'}
                      </span>
                    </label>
                  </div>

                  {formData.btn3Show && (
                    <div className="pt-3 space-y-3">
                      <div className="grid sm:grid-cols-3 gap-3">
                        <div>
                          <label className="font-semibold text-slate-400 block mb-1">Text (English)</label>
                          <input
                            type="text"
                            placeholder="Online Admission"
                            value={formData.btn3Text}
                            onChange={(e) => setFormData({ ...formData, btn3Text: e.target.value })}
                            className="w-full px-3 py-2 rounded-xl bg-[#0a0a0f] border border-[#26263a] text-white text-xs outline-none focus:border-[#a78bfa]"
                          />
                        </div>
                        <div>
                          <label className="font-semibold text-slate-400 block mb-1">Text (বাংলা)</label>
                          <input
                            type="text"
                            placeholder="অনলাইন ভর্তি"
                            value={formData.btn3TextBn}
                            onChange={(e) => setFormData({ ...formData, btn3TextBn: e.target.value })}
                            className="w-full px-3 py-2 rounded-xl bg-[#0a0a0f] border border-[#26263a] text-white text-xs outline-none focus:border-[#a78bfa]"
                          />
                        </div>
                        <div>
                          <label className="font-semibold text-slate-400 block mb-1">Custom Route Link</label>
                          <input
                            type="text"
                            placeholder="/admission"
                            value={formData.btn3Link}
                            onChange={(e) => setFormData({ ...formData, btn3Link: e.target.value })}
                            className="w-full px-3 py-2 rounded-xl bg-[#0a0a0f] border border-[#26263a] text-white text-xs outline-none focus:border-[#a78bfa]"
                          />
                        </div>
                      </div>

                      {/* Quick Links for Btn 3 */}
                      <div className="flex items-center gap-1.5 flex-wrap pt-0.5">
                        <span className="text-[10px] text-slate-500 font-bold uppercase mr-1">Quick Links:</span>
                        {QUICK_ROUTES.map((route) => (
                          <button
                            key={route.path}
                            type="button"
                            onClick={() => setFormData({ ...formData, btn3Link: route.path })}
                            className="px-2 py-0.5 rounded bg-white/5 hover:bg-white/10 text-[10px] text-slate-400 hover:text-white transition"
                          >
                            {route.label}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Order & Status */}
              <div className="flex items-center justify-between p-4 rounded-xl bg-[#101018] border border-[#202030]">
                <div className="flex items-center gap-3">
                  <label className="font-bold text-slate-200">Sort Order Position:</label>
                  <input
                    type="number"
                    min="1"
                    value={formData.order}
                    onChange={(e) => setFormData({ ...formData, order: parseInt(e.target.value) || 1 })}
                    className="w-20 px-3 py-1.5 rounded-lg bg-[#0e0e14] border border-[#26263a] text-white text-xs outline-none text-center"
                  />
                </div>

                <label className="flex items-center gap-2 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={formData.isActive}
                    onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                    className="w-4 h-4 rounded text-[#6c63ff] bg-[#0e0e14] border-[#26263a]"
                  />
                  <span className="font-bold text-white text-xs">Publish on Website (Active)</span>
                </label>
              </div>

              {/* Modal Footer Actions */}
              <div className="pt-4 border-t border-[#252538] flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 font-bold transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="moom-btn-primary px-6 py-2.5 rounded-xl font-bold inline-flex items-center gap-2 shadow-lg"
                >
                  <Save className="w-4 h-4" />
                  <span>{editingSlide ? 'Save Changes' : 'Create Slide'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
