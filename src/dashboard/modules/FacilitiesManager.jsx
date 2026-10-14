import { useState, useEffect } from 'react'
import {
  Sparkles,
  Plus,
  Trash2,
  Edit3,
  Eye,
  ArrowUp,
  ArrowDown,
  RotateCcw,
  Save,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  Layers,
  X,
  Check,
  Tag,
  Building2,
  Smile,
} from 'lucide-react'
import api from '../../lib/api'
import FacilityDeleteAlert from '../components/FacilityDeleteAlert'

const EMOJI_PRESETS = [
  '🔬', '🖥️', '📚', '💻', '⚽', '🏛️', '💧', '🛡️',
  '🏫', '🎨', '🎵', '🌿', '🚌', '🧪', '🔭', '🩺',
  '💡', '🏀', '📖', '🌟', '🏆', '🎯', '⚙️', '🌐'
]

const INITIAL_DATA = {
  isActive: true,
  tag: 'Modern Facilities',
  tagBn: 'ক্যাম্পাস অবকাঠামো',
  title: 'Campus Infrastructure & Learning Spaces',
  titleBn: 'আধুনিক সুযোগ-সুবিধা ও শিক্ষাঙ্গন',
  subtitle:
    'A secure, verdant, and technologically equipped campus built to foster academic concentration and physical vitality.',
  subtitleBn:
    'একটি নিরাপদ, সুশৃঙ্খল ও সবুজ ক্যাম্পাস যা শিক্ষার্থীদের পড়াশোনার অনুকূল পরিবেশ নিশ্চিত করে।',
  facilities: [
    {
      id: 'fac-1',
      icon: '🔬',
      metric: '3 Specialized Labs',
      metricBn: '৩টি পৃথক ল্যাব',
      title: 'Modern Science Labs',
      titleBn: 'আধুনিক ৩টি বিজ্ঞানাগার',
      desc: 'Separate, fully equipped laboratories for Physics, Chemistry, and Biology with microscopes, burners, glassware, and certified reagents.',
      descBn: 'পদার্থ, রসায়ন ও জীববিজ্ঞানের পৃথক শীতাতপ নিয়ন্ত্রিত ল্যাবরেটরি যেখানে শতভাগ ব্যবহারিক ক্লাস নিশ্চিত করা হয়।',
      order: 1,
      isActive: true,
    },
    {
      id: 'fac-2',
      icon: '🖥️',
      metric: 'Smart Displays',
      metricBn: 'স্মার্ট ক্লাসরুম',
      title: 'Multimedia Digital Classrooms',
      titleBn: 'ডিজিটাল মাল্টিমিডিয়া ক্লাসরুম',
      desc: 'Interactive smart projectors and audiovisual setups making abstract science, math, and geography topics easy to understand.',
      descBn: 'প্রজেক্টর ও স্মার্ট ডিসপ্লে সুবিধা সম্বলিত আধুনিক ক্লাসরুম যা জটিল বৈজ্ঞানিক তত্ত্বকে সহজবোধ্য করে তোলে।',
      order: 2,
      isActive: true,
    },
    {
      id: 'fac-3',
      icon: '📚',
      metric: '10,000+ Books',
      metricBn: '১০,০০০+ বই',
      title: 'Central Academic Library',
      titleBn: 'সমৃদ্ধ কেন্দ্রীয় পাঠাগার',
      desc: 'Rich collection of over 10,000+ national textbook guides, encyclopedias, literature, and quiet reading booths.',
      descBn: '১০,০০০ এরও বেশি পাঠ্যপুস্তক গাইড, বিশ্বকোষ, বাংলা ও বিশ্বসাহিত্যের বই এবং শান্ত পড়াশোনার পরিবেশ।',
      order: 3,
      isActive: true,
    },
    {
      id: 'fac-4',
      icon: '💻',
      metric: '40 Workstations',
      metricBn: '৪০টি ওয়ার্কস্টেশন',
      title: 'ICT & Computer Lab',
      titleBn: 'আইসিটি ও কম্পিউটার ল্যাব',
      desc: '40 modern networked computers with high-speed broadband internet, digital typing stations, and introductory programming.',
      descBn: 'উচ্চগতির ব্রডব্যান্ড ইন্টারনেট এবং ৪০টি আধুনিক কম্পিউটার সম্বলিত আধুনিক ডিজিটাল ল্যাবরেটরি।',
      order: 4,
      isActive: true,
    },
    {
      id: 'fac-5',
      icon: '⚽',
      metric: 'Full-size Ground',
      metricBn: 'পূর্ণাঙ্গ খেলার মাঠ',
      title: 'Large Green Sports Playground',
      titleBn: 'বিশাল সবুজ খেলার মাঠ',
      desc: 'Expansive field with football goalposts, cricket pitch, volleyball court, and running track for daily physical exercise.',
      descBn: 'ফুটবল গোলপোস্ট, ক্রিকেট পিচ এবং দৌড়ের ট্র্যাক সম্বলিত সুপ্রশস্ত ঘাসে ঢাকা স্কুল মাঠ।',
      order: 5,
      isActive: true,
    },
    {
      id: 'fac-6',
      icon: '🏛️',
      metric: 'Open Cultural Plaza',
      metricBn: 'সাংস্কৃতিক চত্বর',
      title: 'Shaheed Minar & Cultural Stage',
      titleBn: 'স্থায়ী শহীদ মিনার ও সাংস্কৃতিক মঞ্চ',
      desc: 'Architectural monument for Language Day (21st February), Victory Day, Independence Day, and school open-air assemblies.',
      descBn: 'একুশে ফেব্রুয়ারি, স্বাধীনতা দিবস ও বিজয় দিবসে শ্রদ্ধা নিবেদন এবং সাংস্কৃতিক অনুষ্ঠানের কেন্দ্রবিন্দু।',
      order: 6,
      isActive: true,
    },
    {
      id: 'fac-7',
      icon: '💧',
      metric: 'RO Filtered Pure Water',
      metricBn: 'RO ফিল্টার পানি',
      title: 'Pure Drinking Water & Cafeteria',
      titleBn: 'বিশুদ্ধ পানীয় জল ও স্বাস্থ্যকর ক্যান্টিন',
      desc: 'Multi-stage RO filtered drinking water points and hygienic canteen providing fresh, nutritious tiffin snacks.',
      descBn: 'আরও (RO) ফিল্টারযুক্ত বিশুদ্ধ খাবার পানির প্ল্যান্ট এবং পরিচ্ছন্ন খাবার সরবরাহকারী ক্যান্টিন।',
      order: 7,
      isActive: true,
    },
    {
      id: 'fac-8',
      icon: '🛡️',
      metric: '24/7 Safe Campus',
      metricBn: '২৪/৭ নিরাপদ ক্যাম্পাস',
      title: 'Campus Safety & CCTV Security',
      titleBn: 'নিরাপদ ক্যাম্পাস ও সিসিটিভি নজরদারি',
      desc: 'Secured boundary perimeter, 24/7 CCTV surveillance cameras across all corridors, and dedicated girls’ common room.',
      descBn: 'সম্পূর্ণ প্রাচীরঘেরা ক্যাম্পাস, সার্বক্ষণিক সিসিটিভি ক্যামেরা এবং ছাত্রীদের জন্য পৃথক কমনরুম।',
      order: 8,
      isActive: true,
    },
  ],
}

export default function FacilitiesManager() {
  const [data, setData] = useState(INITIAL_DATA)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [toast, setToast] = useState(null)
  const [previewLang, setPreviewLang] = useState('bn')
  const [activeTab, setActiveTab] = useState('facilities') // 'facilities' | 'headers' | 'preview'

  // Modal State for Add / Edit
  const [modalOpen, setModalOpen] = useState(false)
  const [editingFacility, setEditingFacility] = useState(null)

  // Delete Alert State
  const [facilityToDelete, setFacilityToDelete] = useState(null)
  const [deletingFacility, setDeletingFacility] = useState(false)

  const showToast = (message, type = 'success') => {
    setToast({ message, type })
    setTimeout(() => setToast(null), 4000)
  }

  // Load from Backend or Cached LocalStorage
  const loadData = async () => {
    setLoading(true)
    try {
      const cached = localStorage.getItem('mpa_facilities_section')
      if (cached) {
        try {
          setData(JSON.parse(cached))
        } catch (_) {}
      }

      const res = await api.getFacilities()
      if (res?.success && res.data) {
        setData(res.data)
        localStorage.setItem('mpa_facilities_section', JSON.stringify(res.data))
      }
    } catch (err) {
      console.warn('Could not load facilities data from API, using fallback:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadData()
  }, [])

  // Save changes to API & local cache
  const handleSave = async (updatedData = data) => {
    setSaving(true)
    try {
      const res = await api.updateFacilities(updatedData)
      if (res?.success && res.data) {
        setData(res.data)
        localStorage.setItem('mpa_facilities_section', JSON.stringify(res.data))
        window.dispatchEvent(new Event('mpa_facilities_updated'))
        showToast('Modern Facilities section updated successfully! 🎉')
      } else {
        localStorage.setItem('mpa_facilities_section', JSON.stringify(updatedData))
        setData(updatedData)
        window.dispatchEvent(new Event('mpa_facilities_updated'))
        showToast('Updated and saved locally!')
      }
    } catch (err) {
      console.error('Save failed:', err)
      localStorage.setItem('mpa_facilities_section', JSON.stringify(updatedData))
      setData(updatedData)
      window.dispatchEvent(new Event('mpa_facilities_updated'))
      showToast('Saved to local storage!', 'info')
    } finally {
      setSaving(false)
    }
  }

  // Reset to school defaults
  const handleReset = async () => {
    if (!window.confirm('Reset Modern Facilities section data to school defaults?')) return
    setSaving(true)
    try {
      const res = await api.resetFacilities()
      if (res?.success && res.data) {
        setData(res.data)
        localStorage.setItem('mpa_facilities_section', JSON.stringify(res.data))
        window.dispatchEvent(new Event('mpa_facilities_updated'))
        showToast('Modern Facilities section reset to defaults! ✨')
      } else {
        setData(INITIAL_DATA)
        localStorage.setItem('mpa_facilities_section', JSON.stringify(INITIAL_DATA))
        window.dispatchEvent(new Event('mpa_facilities_updated'))
        showToast('Reset to default values!')
      }
    } catch (err) {
      setData(INITIAL_DATA)
      localStorage.setItem('mpa_facilities_section', JSON.stringify(INITIAL_DATA))
      window.dispatchEvent(new Event('mpa_facilities_updated'))
      showToast('Reset completed!', 'info')
    } finally {
      setSaving(false)
    }
  }

  // Reorder Facilities
  const moveFacility = (index, direction) => {
    const targetIndex = index + direction
    if (targetIndex < 0 || targetIndex >= data.facilities.length) return
    const updated = [...data.facilities]
    const temp = updated[index]
    updated[index] = updated[targetIndex]
    updated[targetIndex] = temp
    const nextData = { ...data, facilities: updated }
    setData(nextData)
    handleSave(nextData)
  }

  // Delete Facility - open custom alert modal
  const handleDeleteFacility = (facility) => {
    setFacilityToDelete(facility)
  }

  // Confirm and execute delete from custom alert modal
  const handleConfirmDelete = async () => {
    if (!facilityToDelete) return
    const id = facilityToDelete.id || facilityToDelete._id
    setDeletingFacility(true)
    try {
      if (id && !String(id).startsWith('fac-default-')) {
        await api.deleteFacilityItem(id).catch(() => {})
      }
      const updated = data.facilities.filter((f) => f.id !== id && f._id !== id)
      const nextData = { ...data, facilities: updated }
      setData(nextData)
      await handleSave(nextData)
      showToast(`Facility "${facilityToDelete.title || facilityToDelete.titleBn || 'Facility'}" deleted successfully! 🗑️`)
      setFacilityToDelete(null)
    } catch (err) {
      console.error(err)
      showToast('Error deleting facility', 'error')
    } finally {
      setDeletingFacility(false)
    }
  }

  // Toggle active status of a facility
  const toggleFacilityActive = (id) => {
    const updated = data.facilities.map((f) => {
      if (f.id === id || f._id === id) {
        return { ...f, isActive: f.isActive === false }
      }
      return f
    })
    const nextData = { ...data, facilities: updated }
    setData(nextData)
    handleSave(nextData)
  }

  // Open Modal for New Facility
  const openAddModal = () => {
    setEditingFacility({
      id: `fac-${Date.now()}`,
      icon: '🏢',
      metric: '',
      metricBn: '',
      title: '',
      titleBn: '',
      desc: '',
      descBn: '',
      order: (data.facilities?.length || 0) + 1,
      isActive: true,
    })
    setModalOpen(true)
  }

  // Open Modal for Edit
  const openEditModal = (facility) => {
    setEditingFacility(JSON.parse(JSON.stringify(facility)))
    setModalOpen(true)
  }

  // Save Modal Facility
  const handleSaveModalFacility = (e) => {
    e.preventDefault()
    if (!editingFacility.title && !editingFacility.titleBn) {
      alert('Please enter at least an English or Bengali facility title!')
      return
    }

    let updatedFacilities
    const exists = data.facilities.some(
      (f) =>
        (editingFacility.id && f.id === editingFacility.id) ||
        (editingFacility._id && f._id === editingFacility._id)
    )

    if (exists) {
      updatedFacilities = data.facilities.map((f) =>
        (editingFacility.id && f.id === editingFacility.id) ||
        (editingFacility._id && f._id === editingFacility._id)
          ? editingFacility
          : f
      )
    } else {
      updatedFacilities = [...data.facilities, editingFacility]
    }

    const nextData = { ...data, facilities: updatedFacilities }
    setData(nextData)
    setModalOpen(false)
    setEditingFacility(null)
    handleSave(nextData)
    showToast('Facility item saved successfully! 🎉')
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-mint border-t-transparent rounded-full animate-spin" />
          <span className="text-sm font-bold text-slate-400">Loading Modern Facilities Section...</span>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-16">
      {/* Toast Notification */}
      {toast && (
        <div
          className={`fixed bottom-6 right-6 z-50 px-5 py-3.5 rounded-2xl shadow-2xl flex items-center gap-3 text-sm font-bold border transition-all animate-bounce ${
            toast.type === 'error'
              ? 'bg-rose-900/90 text-rose-100 border-rose-500/50'
              : toast.type === 'info'
              ? 'bg-blue-900/90 text-blue-100 border-blue-500/50'
              : 'bg-emerald-900/90 text-emerald-100 border-emerald-500/50'
          }`}
        >
          {toast.type === 'error' ? (
            <AlertCircle className="w-5 h-5 text-rose-400" />
          ) : (
            <CheckCircle2 className="w-5 h-5 text-emerald-400" />
          )}
          <span>{toast.message}</span>
        </div>
      )}

      {/* Delete Confirmation Alert Modal */}
      {facilityToDelete && (
        <FacilityDeleteAlert
          facility={facilityToDelete}
          deleting={deletingFacility}
          onConfirm={handleConfirmDelete}
          onCancel={() => {
            if (!deletingFacility) setFacilityToDelete(null)
          }}
        />
      )}

      {/* Top Header Card */}
      <div className="bg-gradient-to-r from-slate-900 via-teal-950 to-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 relative z-10">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold bg-teal-500/20 text-teal-300 border border-teal-500/30">
              <Building2 className="w-3.5 h-3.5" />
              <span>Website CMS · Campus Infrastructure & Learning Spaces</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Modern Facilities & Campus Infrastructure
            </h1>
            <p className="text-sm text-slate-300 max-w-2xl leading-relaxed">
              Manage all campus facilities (Science Labs, Digital Classrooms, Central Library, Computer Lab, Sports Ground, etc.)
              with complete word-to-word bilingual editing for tags, headings, subtitles, icons, metrics, and descriptions.
            </p>
          </div>

          {/* Quick Actions */}
          <div className="flex flex-wrap items-center gap-3">
            <a
              href="/#facilities"
              target="_blank"
              rel="noreferrer"
              className="px-4 py-2.5 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-bold inline-flex items-center gap-2 transition cursor-pointer"
            >
              <Eye className="w-4 h-4 text-slate-400" />
              <span>View On Website</span>
              <ExternalLink className="w-3.5 h-3.5 text-slate-500" />
            </a>

            <button
              onClick={handleReset}
              disabled={saving}
              className="px-4 py-2.5 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 border border-rose-500/30 text-xs font-bold inline-flex items-center gap-2 transition cursor-pointer disabled:opacity-50"
              title="Reset all fields to school defaults"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Reset Defaults</span>
            </button>

            <button
              onClick={() => handleSave()}
              disabled={saving}
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-teal-500 to-emerald-500 hover:from-teal-400 hover:to-emerald-400 text-white font-bold text-xs inline-flex items-center gap-2 shadow-lg shadow-teal-500/20 transition cursor-pointer disabled:opacity-50"
            >
              {saving ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Saving...</span>
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  <span>Save All Changes</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Global Controls Strip */}
        <div className="mt-6 pt-6 border-t border-slate-800/80 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <label className="flex items-center gap-2.5 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={data.isActive !== false}
                onChange={(e) => {
                  const nextData = { ...data, isActive: e.target.checked }
                  setData(nextData)
                  handleSave(nextData)
                }}
                className="w-4 h-4 rounded text-teal-500 focus:ring-teal-400 cursor-pointer"
              />
              <span className="text-xs font-bold text-slate-300">
                {data.isActive !== false ? 'Section is Active (Visible on Homepage)' : 'Section is Hidden'}
              </span>
            </label>
            <span className="text-xs px-2.5 py-1 rounded-full bg-slate-800 border border-slate-700 text-slate-400">
              {data.facilities?.length || 0} Facilities Configured
            </span>
          </div>

          {/* Preview Language Switcher */}
          <div className="flex items-center gap-2 bg-slate-800/80 p-1 rounded-xl border border-slate-700">
            <span className="text-[11px] font-bold text-slate-400 px-2">Preview In:</span>
            <button
              onClick={() => setPreviewLang('bn')}
              className={`px-3 py-1 rounded-lg text-xs font-bold transition cursor-pointer ${
                previewLang === 'bn'
                  ? 'bg-teal-500 text-white shadow'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              বাংলা (BN)
            </button>
            <button
              onClick={() => setPreviewLang('en')}
              className={`px-3 py-1 rounded-lg text-xs font-bold transition cursor-pointer ${
                previewLang === 'en'
                  ? 'bg-teal-500 text-white shadow'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              English (EN)
            </button>
          </div>
        </div>
      </div>

      {/* Tabs navigation */}
      <div className="flex items-center gap-2 border-b border-slate-800 pb-2">
        <button
          onClick={() => setActiveTab('facilities')}
          className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 transition cursor-pointer ${
            activeTab === 'facilities'
              ? 'bg-teal-600 text-white shadow-md shadow-teal-600/20'
              : 'text-slate-400 hover:text-white hover:bg-slate-800'
          }`}
        >
          <Layers className="w-4 h-4" />
          <span>Facilities Cards ({data.facilities?.length || 0})</span>
        </button>

        <button
          onClick={() => setActiveTab('headers')}
          className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 transition cursor-pointer ${
            activeTab === 'headers'
              ? 'bg-teal-600 text-white shadow-md shadow-teal-600/20'
              : 'text-slate-400 hover:text-white hover:bg-slate-800'
          }`}
        >
          <Tag className="w-4 h-4" />
          <span>Section Headings & Word Labels</span>
        </button>

        <button
          onClick={() => setActiveTab('preview')}
          className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 transition cursor-pointer ${
            activeTab === 'preview'
              ? 'bg-teal-600 text-white shadow-md shadow-teal-600/20'
              : 'text-slate-400 hover:text-white hover:bg-slate-800'
          }`}
        >
          <Eye className="w-4 h-4" />
          <span>Live Homepage Simulation</span>
        </button>
      </div>

      {/* ── TAB 1: FACILITIES CARDS ── */}
      {activeTab === 'facilities' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-slate-900/60 p-5 rounded-2xl border border-slate-800">
            <div>
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <span>Manage Facilities Cards</span>
                <span className="text-xs px-2 py-0.5 rounded-md bg-teal-500/20 text-teal-300 border border-teal-500/30">
                  {data.facilities?.length || 0} Cards
                </span>
              </h2>
              <p className="text-xs text-slate-400 mt-1">
                Reorder facilities, change icons, update highlight badges (metrics), and edit titles and descriptions.
              </p>
            </div>
            <button
              onClick={openAddModal}
              className="px-4 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-500 text-white font-bold text-xs inline-flex items-center gap-2 shadow-lg shadow-teal-600/25 transition cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Create New Facility Card</span>
            </button>
          </div>

          {/* Cards Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-5">
            {data.facilities?.map((fac, index) => (
              <div
                key={fac.id || fac._id || index}
                className={`bg-slate-900/90 rounded-2xl border transition-all p-5 flex flex-col justify-between ${
                  fac.isActive === false
                    ? 'border-slate-800 opacity-60'
                    : 'border-slate-800 hover:border-teal-500/50 shadow-xl'
                }`}
              >
                <div>
                  {/* Card Top Strip */}
                  <div className="flex items-start justify-between gap-2 mb-3">
                    <span className="text-3xl p-2 rounded-2xl bg-slate-800 border border-slate-700/80 shadow-inner">
                      {fac.icon || '🏢'}
                    </span>

                    {/* Reorder / Status Controls */}
                    <div className="flex items-center gap-1 bg-slate-800/80 p-1 rounded-xl border border-slate-700">
                      <button
                        onClick={() => moveFacility(index, -1)}
                        disabled={index === 0}
                        className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-700 disabled:opacity-20 cursor-pointer"
                        title="Move Left / Up"
                      >
                        <ArrowUp className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => moveFacility(index, 1)}
                        disabled={index === data.facilities.length - 1}
                        className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-700 disabled:opacity-20 cursor-pointer"
                        title="Move Right / Down"
                      >
                        <ArrowDown className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  {/* Metric Badge */}
                  <span className="text-[11px] font-bold text-teal-400 uppercase tracking-wider block mb-1">
                    {previewLang === 'bn' ? fac.metricBn || fac.metric : fac.metric || fac.metricBn}
                  </span>

                  {/* Title */}
                  <h3 className="font-extrabold text-base text-white mb-2 leading-snug">
                    {previewLang === 'bn' ? fac.titleBn || fac.title : fac.title || fac.titleBn}
                  </h3>

                  {/* Secondary Title (other language) */}
                  <p className="text-[11px] text-slate-400 mb-2">
                    {previewLang === 'bn' ? fac.title : fac.titleBn}
                  </p>

                  {/* Description */}
                  <p className="text-xs text-slate-300 leading-relaxed mb-4 line-clamp-3">
                    {previewLang === 'bn' ? fac.descBn || fac.desc : fac.desc || fac.descBn}
                  </p>
                </div>

                {/* Footer Controls */}
                <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between gap-2 mt-2">
                  <button
                    onClick={() => toggleFacilityActive(fac.id || fac._id)}
                    className={`text-[11px] font-bold px-2.5 py-1 rounded-lg border transition cursor-pointer ${
                      fac.isActive !== false
                        ? 'bg-emerald-500/10 text-emerald-300 border-emerald-500/30'
                        : 'bg-slate-800 text-slate-400 border-slate-700'
                    }`}
                  >
                    {fac.isActive !== false ? '● Visible' : '○ Hidden'}
                  </button>

                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => openEditModal(fac)}
                      className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold inline-flex items-center gap-1 transition cursor-pointer border border-slate-700"
                    >
                      <Edit3 className="w-3 h-3 text-teal-400" />
                      <span>Edit</span>
                    </button>

                    <button
                      onClick={() => handleDeleteFacility(fac)}
                      className="p-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/30 transition cursor-pointer"
                      title="Delete Facility"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── TAB 2: SECTION HEADINGS & WORD LABELS ── */}
      {activeTab === 'headers' && (
        <div className="space-y-6">
          <div className="bg-slate-900/90 rounded-2xl border border-slate-800 p-6 space-y-6">
            <div>
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <Tag className="w-4 h-4 text-teal-400" />
                <span>Word-to-Word Section Headers (Bilingual)</span>
              </h2>
              <p className="text-xs text-slate-400 mt-1">
                Customize the top section badge tag, the main headline, and the descriptive subtitle in both English and Bengali.
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              {/* Badge Tag EN */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-300 flex items-center justify-between">
                  <span>Section Tag (English)</span>
                  <span className="text-[10px] text-teal-400 font-mono">Modern Facilities</span>
                </label>
                <input
                  type="text"
                  value={data.tag || ''}
                  onChange={(e) => setData({ ...data, tag: e.target.value })}
                  placeholder="e.g. Modern Facilities"
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white text-sm focus:border-teal-500 focus:outline-none"
                />
              </div>

              {/* Badge Tag BN */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-300 flex items-center justify-between">
                  <span>Section Tag (বাংলা)</span>
                  <span className="text-[10px] text-teal-400 font-mono">ক্যাম্পাস অবকাঠামো</span>
                </label>
                <input
                  type="text"
                  value={data.tagBn || ''}
                  onChange={(e) => setData({ ...data, tagBn: e.target.value })}
                  placeholder="যেমন: ক্যাম্পাস অবকাঠামো"
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white text-sm focus:border-teal-500 focus:outline-none"
                />
              </div>

              {/* Title EN */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-300 flex items-center justify-between">
                  <span>Main Title / Heading (English)</span>
                  <span className="text-[10px] text-teal-400 font-mono">Campus Infrastructure & Learning Spaces</span>
                </label>
                <input
                  type="text"
                  value={data.title || ''}
                  onChange={(e) => setData({ ...data, title: e.target.value })}
                  placeholder="e.g. Campus Infrastructure & Learning Spaces"
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white text-sm focus:border-teal-500 focus:outline-none"
                />
              </div>

              {/* Title BN */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-300 flex items-center justify-between">
                  <span>Main Title / Heading (বাংলা)</span>
                  <span className="text-[10px] text-teal-400 font-mono">আধুনিক সুযোগ-সুবিধা ও শিক্ষাঙ্গন</span>
                </label>
                <input
                  type="text"
                  value={data.titleBn || ''}
                  onChange={(e) => setData({ ...data, titleBn: e.target.value })}
                  placeholder="যেমন: আধুনিক সুযোগ-সুবিধা ও শিক্ষাঙ্গন"
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white text-sm focus:border-teal-500 focus:outline-none"
                />
              </div>

              {/* Subtitle EN */}
              <div className="space-y-2 md:col-span-2">
                <label className="text-xs font-bold text-slate-300">
                  Section Subtitle / Description (English)
                </label>
                <textarea
                  rows={2}
                  value={data.subtitle || ''}
                  onChange={(e) => setData({ ...data, subtitle: e.target.value })}
                  placeholder="Descriptive paragraph about the campus infrastructure..."
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white text-sm focus:border-teal-500 focus:outline-none"
                />
              </div>

              {/* Subtitle BN */}
              <div className="space-y-2 md:col-span-2">
                <label className="text-xs font-bold text-slate-300">
                  Section Subtitle / Description (বাংলা)
                </label>
                <textarea
                  rows={2}
                  value={data.subtitleBn || ''}
                  onChange={(e) => setData({ ...data, subtitleBn: e.target.value })}
                  placeholder="ক্যাম্পাস অবকাঠামো সম্পর্কিত বিস্তারিত পরিচিতি..."
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white text-sm focus:border-teal-500 focus:outline-none"
                />
              </div>
            </div>

            <div className="pt-4 border-t border-slate-800 flex justify-end">
              <button
                onClick={() => handleSave()}
                disabled={saving}
                className="px-6 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-500 text-white font-bold text-sm inline-flex items-center gap-2 shadow-lg shadow-teal-600/30 transition cursor-pointer disabled:opacity-50"
              >
                <Save className="w-4 h-4" />
                <span>Save Headings</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── TAB 3: LIVE HOMEPAGE SIMULATION ── */}
      {activeTab === 'preview' && (
        <div className="bg-slate-950/80 rounded-3xl border border-slate-800 p-6 sm:p-10 space-y-8">
          <div className="flex items-center justify-between border-b border-slate-800 pb-4">
            <div>
              <span className="text-xs font-bold text-teal-400 uppercase tracking-widest">
                Live Simulation
              </span>
              <h3 className="text-lg font-bold text-white">How this section appears on the homepage</h3>
            </div>
            <div className="flex items-center gap-2 bg-slate-800 p-1 rounded-xl border border-slate-700">
              <button
                onClick={() => setPreviewLang('bn')}
                className={`px-3 py-1 rounded-lg text-xs font-bold ${
                  previewLang === 'bn' ? 'bg-teal-500 text-white' : 'text-slate-400'
                }`}
              >
                বাংলা
              </button>
              <button
                onClick={() => setPreviewLang('en')}
                className={`px-3 py-1 rounded-lg text-xs font-bold ${
                  previewLang === 'en' ? 'bg-teal-500 text-white' : 'text-slate-400'
                }`}
              >
                English
              </button>
            </div>
          </div>

          {/* Simulated Section Content */}
          <section className="max-w-7xl mx-auto py-6">
            <div className="text-center max-w-2xl mx-auto mb-14">
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-400 bg-emerald-400/15 px-3 py-1 rounded-full">
                {previewLang === 'bn' ? data.tagBn || data.tag : data.tag || data.tagBn}
              </span>
              <h2 className="mt-2 font-display font-extrabold text-3xl sm:text-4xl text-white">
                {previewLang === 'bn' ? data.titleBn || data.title : data.title || data.titleBn}
              </h2>
              <p className="mt-3 text-sm text-slate-300">
                {previewLang === 'bn' ? data.subtitleBn || data.subtitle : data.subtitle || data.subtitleBn}
              </p>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {data.facilities
                ?.filter((fac) => fac.isActive !== false)
                .map((fac) => (
                  <div
                    key={fac.id || fac._id || fac.title}
                    className="bg-white rounded-3xl p-6 border border-slate-200 shadow-md hover:shadow-xl transition-all transform hover:-translate-y-1.5 flex flex-col justify-between"
                  >
                    <div>
                      <div className="text-3xl mb-3">{fac.icon || '🏢'}</div>
                      <span className="text-[11px] font-bold text-indigo-600 uppercase tracking-wider block mb-1">
                        {previewLang === 'bn' ? fac.metricBn || fac.metric : fac.metric || fac.metricBn}
                      </span>
                      <h4 className="font-display font-bold text-lg text-slate-900 mb-2">
                        {previewLang === 'bn' ? fac.titleBn || fac.title : fac.title || fac.titleBn}
                      </h4>
                      <p className="text-xs text-slate-600 leading-relaxed">
                        {previewLang === 'bn' ? fac.descBn || fac.desc : fac.desc || fac.descBn}
                      </p>
                    </div>
                  </div>
                ))}
            </div>
          </section>
        </div>
      )}

      {/* ── MODAL: CREATE / EDIT FACILITY ── */}
      {modalOpen && editingFacility && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-xl w-full p-6 sm:p-8 space-y-6 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <div>
                <h3 className="text-lg font-bold text-white">
                  {editingFacility.id && data.facilities.some((f) => f.id === editingFacility.id)
                    ? 'Edit Facility Item'
                    : 'Create New Facility Card'}
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Set emoji icon, highlight metric tag, title, and description.
                </p>
              </div>
              <button
                onClick={() => setModalOpen(false)}
                className="p-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveModalFacility} className="space-y-4">
              {/* Icon / Emoji Picker */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-300 flex items-center gap-2">
                  <Smile className="w-3.5 h-3.5 text-teal-400" />
                  <span>Emoji Icon</span>
                </label>
                <div className="flex items-center gap-3">
                  <input
                    type="text"
                    value={editingFacility.icon || ''}
                    onChange={(e) => setEditingFacility({ ...editingFacility, icon: e.target.value })}
                    className="w-16 text-center text-2xl py-2 bg-slate-950 border border-slate-700 rounded-xl text-white"
                  />
                  <div className="flex flex-wrap gap-1.5 max-h-20 overflow-y-auto p-1.5 bg-slate-950/60 rounded-xl border border-slate-800">
                    {EMOJI_PRESETS.map((emoji) => (
                      <button
                        key={emoji}
                        type="button"
                        onClick={() => setEditingFacility({ ...editingFacility, icon: emoji })}
                        className={`text-lg p-1 rounded hover:bg-slate-800 cursor-pointer ${
                          editingFacility.icon === emoji ? 'bg-teal-500/20 border border-teal-500' : ''
                        }`}
                      >
                        {emoji}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Metric Tag EN & BN */}
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-300">
                    Metric Tag (English)
                  </label>
                  <input
                    type="text"
                    value={editingFacility.metric || ''}
                    onChange={(e) => setEditingFacility({ ...editingFacility, metric: e.target.value })}
                    placeholder="e.g. 3 Specialized Labs"
                    className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white text-sm focus:border-teal-500 focus:outline-none"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-300">
                    Metric Tag (বাংলা)
                  </label>
                  <input
                    type="text"
                    value={editingFacility.metricBn || ''}
                    onChange={(e) => setEditingFacility({ ...editingFacility, metricBn: e.target.value })}
                    placeholder="যেমন: ৩টি পৃথক ল্যাব"
                    className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white text-sm focus:border-teal-500 focus:outline-none"
                  />
                </div>
              </div>

              {/* Title EN & BN */}
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-300">
                    Title (English) *
                  </label>
                  <input
                    type="text"
                    value={editingFacility.title || ''}
                    onChange={(e) => setEditingFacility({ ...editingFacility, title: e.target.value })}
                    placeholder="e.g. Modern Science Labs"
                    className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white text-sm focus:border-teal-500 focus:outline-none"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-300">
                    Title (বাংলা) *
                  </label>
                  <input
                    type="text"
                    value={editingFacility.titleBn || ''}
                    onChange={(e) => setEditingFacility({ ...editingFacility, titleBn: e.target.value })}
                    placeholder="যেমন: আধুনিক ৩টি বিজ্ঞানাগার"
                    className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white text-sm focus:border-teal-500 focus:outline-none"
                  />
                </div>
              </div>

              {/* Description EN & BN */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-300">
                  Description (English)
                </label>
                <textarea
                  rows={2}
                  value={editingFacility.desc || ''}
                  onChange={(e) => setEditingFacility({ ...editingFacility, desc: e.target.value })}
                  placeholder="Detailed description of equipment, facilities and features..."
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white text-sm focus:border-teal-500 focus:outline-none"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-300">
                  Description (বাংলা)
                </label>
                <textarea
                  rows={2}
                  value={editingFacility.descBn || ''}
                  onChange={(e) => setEditingFacility({ ...editingFacility, descBn: e.target.value })}
                  placeholder="যন্ত্রপাতি ও সুবিধা সম্পর্কিত বাংলা বর্ণনা..."
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white text-sm focus:border-teal-500 focus:outline-none"
                />
              </div>

              {/* Active Toggle */}
              <div className="pt-2">
                <label className="flex items-center gap-2 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={editingFacility.isActive !== false}
                    onChange={(e) =>
                      setEditingFacility({ ...editingFacility, isActive: e.target.checked })
                    }
                    className="w-4 h-4 rounded text-teal-500 focus:ring-teal-400 cursor-pointer"
                  />
                  <span className="text-xs font-bold text-slate-300">
                    Visible on website (Active)
                  </span>
                </label>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold transition cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-teal-600 hover:bg-teal-500 text-white text-xs font-bold shadow-lg shadow-teal-600/30 transition cursor-pointer"
                >
                  Save Facility Card
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
