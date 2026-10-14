import React, { useState, useEffect } from 'react'
import {
  Clock,
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
  Sparkles,
  Calendar,
  Layers,
  X,
  Check,
  Tag,
  Sliders,
} from 'lucide-react'
import api from '../../lib/api'
import RoutineDeleteAlert from '../components/RoutineDeleteAlert'

const INITIAL_ROUTINE_DATA = {
  isActive: true,
  tag: 'Discipline & Routine',
  tagBn: 'শৃঙ্খলা ও সময়ানুবর্তিতা',
  title: 'A Day in Mirashani School Life',
  titleBn: 'বিদ্যালয়ের একটি সাধারণ কর্মদিবস',
  subtitle:
    'A disciplined, vibrant daily routine from morning national assembly to afternoon co-curricular activities.',
  subtitleBn:
    'সকালের প্রাত্যহিক সমাবেশ ও জাতীয় সংগীত থেকে শুরু করে অপরাহ্নের খেলাধুলা ও সহ-শিক্ষা কার্যক্রমের সুবিন্যস্ত সূচি।',
  items: [
    {
      id: 'routine-1',
      time: '08:30 AM - 09:00 AM',
      timeBn: 'সকাল ৮:৩০ - ৯:০০',
      title: 'Morning Assembly & Physical Drill',
      titleBn: 'প্রাত্যহিক সমাবেশ ও শারীরিক কসরত',
      desc: 'National anthem, scripture recitation, school oath, and PT fitness drill in main ground.',
      descBn: 'পবিত্র কোরআন ও ধর্মগ্রন্থ পাঠ, জাতীয় সংগীত, শপথ বাক্য পাঠ এবং মাঠভর্তি শরীরচর্চা (PT)।',
      order: 1,
      isActive: true,
    },
    {
      id: 'routine-2',
      time: '09:00 AM - 10:30 AM',
      timeBn: 'সকাল ৯:০০ - ১০:৩০',
      title: '1st & 2nd Academic Periods',
      titleBn: '১ম ও ২য় পিরিয়ড (মূল তাত্ত্বিক বিষয়)',
      desc: 'Core academic subjects: Bangla 1st/2nd Paper, English Communicative Grammar, and Mathematics.',
      descBn: 'বাংলা সাহিত্য ও ব্যাকরণ, ইংরেজি কমিউনিকেটিভ গ্রামার এবং বীজগণিত-জ্যামিতি।',
      order: 2,
      isActive: true,
    },
    {
      id: 'routine-3',
      time: '10:30 AM - 12:00 PM',
      timeBn: 'সকাল ১০:৩০ - ১২:০০',
      title: '3rd & 4th Academic Periods',
      titleBn: '৩য় ও ৪র্থ পিরিয়ড (বিভাগীয় বিষয়)',
      desc: 'Discipline subjects: Physics, Chemistry, Accounting, History, Geography, and Higher Mathematics.',
      descBn: 'পদার্থবিজ্ঞান, রসায়ন, হিসাববিজ্ঞান, বাংলাদেশ ও বিশ্বপরিচয় এবং সাধারণ বিজ্ঞান।',
      order: 3,
      isActive: true,
    },
    {
      id: 'routine-4',
      time: '12:00 PM - 12:45 PM',
      timeBn: 'দুপুর ১২:০০ - ১২:৪৫',
      title: 'Mid-Day Tiffin & Dhuhr Prayer Break',
      titleBn: 'টিফিন বিরতি ও যোহরের নামাজ',
      desc: 'Nutritious lunch tiffin, socializing, and congregational Zohr prayer in school prayer room.',
      descBn: 'স্বাস্থ্যকর টিফিন গ্রহণ, সহপাঠীদের সাথে সামাজিকীকরণ ও নামাজকক্ষে জামাতে নামাজ।',
      order: 4,
      isActive: true,
    },
    {
      id: 'routine-5',
      time: '12:45 PM - 02:15 PM',
      timeBn: 'দুপুর ১২:৪৫ - ২:১৫',
      title: '5th & 6th Academic Periods',
      titleBn: '৫ম ও ৬ষ্ঠ পিরিয়ড (ব্যবহারিক ল্যাব)',
      desc: 'Science Laboratory Practicals, ICT Computer Lab lessons, Biology experiments, and BGS lectures.',
      descBn: 'বিজ্ঞান ল্যাবে যন্ত্রপাতি নিয়ে পরীক্ষা, আইসিটি কম্পিউটার ল্যাবে টাইপিং ও প্রোগ্রামিং।',
      order: 5,
      isActive: true,
    },
    {
      id: 'routine-6',
      time: '02:15 PM - 03:00 PM',
      timeBn: 'দুপুর ২:১৫ - ৩:০০',
      title: '7th Period & Class Review',
      titleBn: '৭ম পিরিয়ড ও ক্লাস ডায়রি মূল্যায়ন',
      desc: 'Doubt clearing, homework diary checking, library reference reading, and moral guidance.',
      descBn: 'হোমওয়ার্ক চেক, পাঠাগার থেকে বই আদান-প্রদান এবং শিক্ষকদের বিশেষ পরামর্শ গ্রহণ।',
      order: 6,
      isActive: true,
    },
    {
      id: 'routine-7',
      time: '03:00 PM - 04:30 PM',
      timeBn: 'বিকাল ৩:০০ - ৪:৩০',
      title: 'Co-Curricular & Outdoor Activities',
      titleBn: 'সহ-শিক্ষা ও ক্রীড়া প্রশিক্ষণ',
      desc: 'Bangladesh Scouts parade, debate practice, football/cricket games, and science club projects.',
      descBn: 'বাংলাদেশ স্কাউটস প্যারেড, সংসদীয় বিতর্ক কর্মশালা, ফুটবল ও ক্রিকেট অনুশীলন।',
      order: 7,
      isActive: true,
    },
  ],
}

// Quick presets for new routine slots
const PRESET_TEMPLATES = [
  {
    label: 'Assembly & Physical Drill',
    time: '08:30 AM - 09:00 AM',
    timeBn: 'সকাল ৮:৩০ - ৯:০০',
    title: 'Morning Assembly & Physical Drill',
    titleBn: 'প্রাত্যহিক সমাবেশ ও শারীরিক কসরত',
    desc: 'National anthem, scripture recitation, oath and physical drill in assembly ground.',
    descBn: 'পবিত্র ধর্মগ্রন্থ পাঠ, জাতীয় সংগীত, শপথ বাক্য পাঠ এবং শরীরচর্চা (PT)।',
  },
  {
    label: 'Morning Theory Periods',
    time: '09:00 AM - 10:30 AM',
    timeBn: 'সকাল ৯:০০ - ১০:৩০',
    title: 'Core Academic Lessons',
    titleBn: 'মূল তাত্ত্বিক পাঠদান ও ক্লাস',
    desc: 'Bangla, English and General Mathematics subject lectures and exercises.',
    descBn: 'বাংলা, ইংরেজি ও গণিত বিষয়ের নিবিড় পাঠদান ও অনুশীলনী।',
  },
  {
    label: 'Tiffin & Prayer Break',
    time: '12:00 PM - 12:45 PM',
    timeBn: 'দুপুর ১২:০০ - ১২:৪৫',
    title: 'Mid-Day Tiffin & Dhuhr Prayer',
    titleBn: 'টিফিন বিরতি ও যোহরের নামাজ',
    desc: 'Nutritious tiffin, peer socializing and congregational Zohr prayer in prayer hall.',
    descBn: 'স্বাস্থ্যকর টিফিন গ্রহণ, সহপাঠীদের সঙ্গে মতবিনিময় ও নামাজকক্ষে জামাতে নামাজ।',
  },
  {
    label: 'Science & Computer Lab',
    time: '12:45 PM - 02:15 PM',
    timeBn: 'দুপুর ১২:৪৫ - ২:১৫',
    title: 'Laboratory Practicals & ICT Session',
    titleBn: 'ব্যবহারিক বিজ্ঞান ল্যাব ও আইসিটি সেশন',
    desc: 'Hands-on laboratory experiments and digital computer training.',
    descBn: 'বিজ্ঞানাগারে হাতে-কলমে বৈজ্ঞানিক পরীক্ষা ও ডিজিটাল কম্পিউটার ক্লাসরুম।',
  },
  {
    label: 'Co-Curricular & Sports',
    time: '03:00 PM - 04:30 PM',
    timeBn: 'বিকাল ৩:০০ - ৪:৩০',
    title: 'Co-Curricular Clubs & Sports',
    titleBn: 'সহ-শিক্ষা ও ক্রীড়া অনুশীলন',
    desc: 'Scouts parade, debate, football, cricket, language club and cultural practice.',
    descBn: 'স্কাউটস প্যারেড, বিতর্ক, ফুটবল, ক্রিকেট এবং বিতর্ক ও বিজ্ঞান ক্লাবের কাজ।',
  },
]

export default function RoutineManager() {
  const [data, setData] = useState(INITIAL_ROUTINE_DATA)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [toast, setToast] = useState(null)
  const [activeTab, setActiveTab] = useState('editor') // 'editor' | 'preview'
  const [previewLang, setPreviewLang] = useState('bn') // 'bn' | 'en'
  const [modalItem, setModalItem] = useState(null) // null or item object being added/edited
  const [itemToDelete, setItemToDelete] = useState(null)
  const [deleting, setDeleting] = useState(false)

  const showToast = (message, type = 'success') => {
    setToast({ message, type })
    setTimeout(() => setToast(null), 4000)
  }

  // Load section data on mount
  useEffect(() => {
    let isMounted = true
    const fetchData = async () => {
      try {
        setLoading(true)
        const res = await api.getRoutine()
        if (res?.success && res.data && isMounted) {
          setData(res.data)
          localStorage.setItem('mpa_routine_section', JSON.stringify(res.data))
        } else {
          // Check local cache
          const cached = localStorage.getItem('mpa_routine_section')
          if (cached && isMounted) {
            setData(JSON.parse(cached))
          }
        }
      } catch (err) {
        console.warn('Could not fetch routine data, using defaults/cached', err)
        const cached = localStorage.getItem('mpa_routine_section')
        if (cached && isMounted) {
          setData(JSON.parse(cached))
        }
      } finally {
        if (isMounted) setLoading(false)
      }
    }

    fetchData()
    return () => {
      isMounted = false
    }
  }, [])

  // Save changes to API & update cache
  const handleSaveAll = async (overrideData = null) => {
    const updatedData = overrideData || data
    try {
      setSaving(true)
      const res = await api.updateRoutine(updatedData)
      if (res?.success && res.data) {
        setData(res.data)
        localStorage.setItem('mpa_routine_section', JSON.stringify(res.data))
        window.dispatchEvent(new Event('mpa_routine_updated'))
        showToast('Discipline & Routine section saved successfully! 🎉')
      } else {
        // Fallback to local save
        localStorage.setItem('mpa_routine_section', JSON.stringify(updatedData))
        window.dispatchEvent(new Event('mpa_routine_updated'))
        showToast('Saved locally to browser cache!', 'info')
      }
    } catch (err) {
      console.error('Failed to save routine section', err)
      localStorage.setItem('mpa_routine_section', JSON.stringify(updatedData))
      window.dispatchEvent(new Event('mpa_routine_updated'))
      showToast('Saved locally (network error with server)', 'warning')
    } finally {
      setSaving(false)
    }
  }

  // Reset to default data
  const handleReset = async () => {
    if (
      !window.confirm(
        'Reset all Discipline & Routine section data to original school defaults?'
      )
    ) {
      return
    }

    try {
      setSaving(true)
      const res = await api.resetRoutine()
      if (res?.success && res.data) {
        setData(res.data)
        localStorage.setItem('mpa_routine_section', JSON.stringify(res.data))
        window.dispatchEvent(new Event('mpa_routine_updated'))
        showToast('Discipline & Routine reset to default values! 🔄')
      } else {
        setData(INITIAL_ROUTINE_DATA)
        localStorage.setItem(
          'mpa_routine_section',
          JSON.stringify(INITIAL_ROUTINE_DATA)
        )
        window.dispatchEvent(new Event('mpa_routine_updated'))
        showToast('Reset to default values locally.', 'info')
      }
    } catch (err) {
      setData(INITIAL_ROUTINE_DATA)
      localStorage.setItem(
        'mpa_routine_section',
        JSON.stringify(INITIAL_ROUTINE_DATA)
      )
      window.dispatchEvent(new Event('mpa_routine_updated'))
      showToast('Reset locally (server unreachable).', 'info')
    } finally {
      setSaving(false)
    }
  }

  // Handle section text change
  const handleSectionChange = (field, value) => {
    setData((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  // Toggle active status for section
  const handleToggleActive = () => {
    const updated = { ...data, isActive: !data.isActive }
    setData(updated)
    handleSaveAll(updated)
  }

  // Toggle active status for single item
  const handleToggleItemActive = (itemId) => {
    const updatedItems = (data.items || []).map((item) => {
      if (item.id === itemId || item._id === itemId) {
        return { ...item, isActive: item.isActive === false ? true : false }
      }
      return item
    })
    const updated = { ...data, items: updatedItems }
    setData(updated)
    handleSaveAll(updated)
  }

  // Move item up / down
  const handleMoveItem = (index, direction) => {
    const items = [...(data.items || [])]
    const targetIndex = direction === 'up' ? index - 1 : index + 1
    if (targetIndex < 0 || targetIndex >= items.length) return

    const temp = items[index]
    items[index] = items[targetIndex]
    items[targetIndex] = temp

    // Reassign order
    const updatedItems = items.map((item, idx) => ({
      ...item,
      order: idx + 1,
    }))

    const updated = { ...data, items: updatedItems }
    setData(updated)
    handleSaveAll(updated)
  }

  // Delete item confirm
  const handleConfirmDelete = async () => {
    if (!itemToDelete) return
    try {
      setDeleting(true)
      const targetId = itemToDelete.id || itemToDelete._id
      const res = await api.deleteRoutineItem(targetId)
      if (res?.success && res.data) {
        setData(res.data)
        localStorage.setItem('mpa_routine_section', JSON.stringify(res.data))
        window.dispatchEvent(new Event('mpa_routine_updated'))
      } else {
        const filtered = (data.items || []).filter(
          (i) => i.id !== targetId && i._id !== targetId
        )
        const updated = { ...data, items: filtered }
        setData(updated)
        localStorage.setItem('mpa_routine_section', JSON.stringify(updated))
        window.dispatchEvent(new Event('mpa_routine_updated'))
      }
      showToast('Routine period deleted successfully! 🗑️')
    } catch (err) {
      console.error('Delete error', err)
      const targetId = itemToDelete.id || itemToDelete._id
      const filtered = (data.items || []).filter(
        (i) => i.id !== targetId && i._id !== targetId
      )
      const updated = { ...data, items: filtered }
      setData(updated)
      localStorage.setItem('mpa_routine_section', JSON.stringify(updated))
      window.dispatchEvent(new Event('mpa_routine_updated'))
      showToast('Deleted locally.', 'info')
    } finally {
      setDeleting(false)
      setItemToDelete(null)
    }
  }

  // Save item from modal (Add or Edit)
  const handleSaveModalItem = async (e) => {
    e.preventDefault()
    if (!modalItem) return

    const isEditing = Boolean(modalItem.id || modalItem._id)
    const currentItems = [...(data.items || [])]

    let updatedItems = []
    if (isEditing) {
      updatedItems = currentItems.map((item) => {
        if (item.id === modalItem.id || item._id === modalItem._id) {
          return { ...modalItem }
        }
        return item
      })
    } else {
      const newItem = {
        ...modalItem,
        id: `routine-${Date.now()}`,
        order: currentItems.length + 1,
        isActive: modalItem.isActive !== false,
      }
      updatedItems = [...currentItems, newItem]
    }

    const updated = { ...data, items: updatedItems }
    setData(updated)
    setModalItem(null)
    await handleSaveAll(updated)
    showToast(
      isEditing
        ? 'Routine period updated! ✨'
        : 'New routine period added! 🎉'
    )
  }

  const activeCount = (data.items || []).filter(
    (i) => i.isActive !== false
  ).length
  const totalCount = (data.items || []).length

  return (
    <div className="space-y-6 pb-20 animate-fadeIn text-slate-100">
      {/* Toast Alert */}
      {toast && (
        <div className="fixed top-6 right-6 z-50 flex items-center gap-3 px-5 py-3.5 rounded-2xl bg-slate-900/95 border border-amber-500/30 text-white shadow-2xl backdrop-blur-md animate-slideDown">
          {toast.type === 'error' ? (
            <AlertCircle className="w-5 h-5 text-red-400 shrink-0" />
          ) : (
            <CheckCircle2 className="w-5 h-5 text-amber-400 shrink-0" />
          )}
          <span className="text-sm font-semibold">{toast.message}</span>
        </div>
      )}

      {/* Delete Confirmation Alert Modal */}
      {itemToDelete && (
        <RoutineDeleteAlert
          item={itemToDelete}
          onConfirm={handleConfirmDelete}
          onCancel={() => setItemToDelete(null)}
          deleting={deleting}
        />
      )}

      {/* Page Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 p-6 rounded-3xl bg-slate-900/80 border border-slate-800 shadow-xl backdrop-blur-md">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider text-amber-400 bg-amber-400/10 px-3 py-1 rounded-full border border-amber-400/20 flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5" /> Website CMS · Discipline & Routine
            </span>
            <span className="text-xs px-2.5 py-0.5 rounded-full font-medium bg-slate-800 text-slate-300 border border-slate-700">
              Word-to-Word Dynamic
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight flex items-center gap-3">
            <span>Discipline & Routine Manager</span>
            <Sparkles className="w-6 h-6 text-amber-400 animate-pulse" />
          </h1>
          <p className="mt-1 text-sm text-slate-400 max-w-2xl">
            Fully control the "A Day in Mirashani School Life" section on the homepage. Edit section headers, subheadings, time periods, descriptions, and active status in both English and Bengali.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <a
            href="/"
            target="_blank"
            rel="noreferrer"
            className="px-4 py-2.5 rounded-xl bg-slate-800/80 hover:bg-slate-700/80 text-slate-300 hover:text-white text-xs font-bold transition flex items-center gap-1.5 border border-slate-700"
          >
            <ExternalLink className="w-3.5 h-3.5" /> View Website
          </a>

          <button
            onClick={handleReset}
            disabled={saving || loading}
            type="button"
            className="px-4 py-2.5 rounded-xl bg-slate-800/80 hover:bg-red-950/40 text-slate-300 hover:text-red-400 text-xs font-bold transition flex items-center gap-1.5 border border-slate-700 hover:border-red-500/30 disabled:opacity-50"
            title="Reset to default school routine"
          >
            <RotateCcw className="w-3.5 h-3.5" /> Reset Defaults
          </button>

          <button
            onClick={() => handleSaveAll()}
            disabled={saving || loading}
            type="button"
            className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 text-xs font-extrabold shadow-lg shadow-amber-500/25 transition flex items-center gap-2 disabled:opacity-50 cursor-pointer"
          >
            {saving ? (
              <>
                <span className="w-4 h-4 border-2 border-slate-950/30 border-t-slate-950 rounded-full animate-spin" />
                <span>Saving Changes...</span>
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

      {/* Tabs: Editor vs Live Preview */}
      <div className="flex items-center gap-2 border-b border-slate-800 pb-2">
        <button
          onClick={() => setActiveTab('editor')}
          className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition flex items-center gap-2 ${
            activeTab === 'editor'
              ? 'bg-amber-500/15 text-amber-400 border border-amber-500/30 shadow-sm'
              : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
          }`}
        >
          <Sliders className="w-4 h-4" />
          <span>Editor & Timeline Slots</span>
          <span className="px-2 py-0.5 rounded-full text-[10px] bg-slate-800 text-slate-300">
            {totalCount} slots
          </span>
        </button>

        <button
          onClick={() => setActiveTab('preview')}
          className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition flex items-center gap-2 ${
            activeTab === 'preview'
              ? 'bg-amber-500/15 text-amber-400 border border-amber-500/30 shadow-sm'
              : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
          }`}
        >
          <Eye className="w-4 h-4" />
          <span>Live Website Preview</span>
        </button>
      </div>

      {activeTab === 'editor' ? (
        <div className="space-y-6">
          {/* Section Visibility & Live Status Card */}
          <div className="p-5 sm:p-6 rounded-3xl bg-slate-900/60 border border-slate-800 backdrop-blur-md flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3.5">
              <div
                className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 transition-colors ${
                  data.isActive
                    ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                    : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                }`}
              >
                <Clock className="w-6 h-6" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-base font-bold text-white">
                    Homepage Routine Section Status
                  </h3>
                  <span
                    className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full border ${
                      data.isActive
                        ? 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30'
                        : 'bg-amber-500/15 text-amber-400 border-amber-500/30'
                    }`}
                  >
                    {data.isActive ? 'Active & Live' : 'Hidden from Website'}
                  </span>
                </div>
                <p className="text-xs text-slate-400 mt-0.5">
                  {data.isActive
                    ? 'This section is currently visible to students and visitors on the homepage.'
                    : 'This section is disabled and completely hidden from the public homepage.'}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 self-end sm:self-center">
              <span className="text-xs font-semibold text-slate-300">
                {data.isActive ? 'Section Enabled' : 'Section Disabled'}
              </span>
              <button
                type="button"
                onClick={handleToggleActive}
                className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                  data.isActive ? 'bg-emerald-500' : 'bg-slate-700'
                }`}
                role="switch"
                aria-checked={data.isActive}
              >
                <span
                  className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                    data.isActive ? 'translate-x-5' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>
          </div>

          {/* Section Headers (Word-to-Word Bilingual Settings) */}
          <div className="p-6 rounded-3xl bg-slate-900/60 border border-slate-800 backdrop-blur-md space-y-6">
            <div className="flex items-center justify-between border-b border-slate-800/80 pb-4">
              <div>
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <Tag className="w-4 h-4 text-amber-400" />
                  <span>Section Headers & Headings (Word to Word)</span>
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Customize the badge tag, main heading, and subtitle description for both English and Bengali audiences.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* English Meta */}
              <div className="space-y-4 p-5 rounded-2xl bg-slate-950/40 border border-slate-800">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-blue-500" /> English Version
                  </span>
                  <span className="text-[11px] text-slate-500">Default Website Language</span>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Section Tag / Badge (English)
                  </label>
                  <input
                    type="text"
                    value={data.tag || ''}
                    onChange={(e) => handleSectionChange('tag', e.target.value)}
                    placeholder="Discipline & Routine"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-amber-400 transition"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Main Heading / Title (English)
                  </label>
                  <input
                    type="text"
                    value={data.title || ''}
                    onChange={(e) => handleSectionChange('title', e.target.value)}
                    placeholder="A Day in Mirashani School Life"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-sm font-bold text-white placeholder-slate-500 focus:outline-none focus:border-amber-400 transition"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Subtitle Description (English)
                  </label>
                  <textarea
                    rows={3}
                    value={data.subtitle || ''}
                    onChange={(e) => handleSectionChange('subtitle', e.target.value)}
                    placeholder="A disciplined, vibrant daily routine from morning national assembly to afternoon co-curricular activities."
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-400 transition leading-relaxed resize-none"
                  />
                </div>
              </div>

              {/* Bengali Meta */}
              <div className="space-y-4 p-5 rounded-2xl bg-slate-950/40 border border-slate-800">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-amber-400 flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-amber-400" /> বাংলা ভার্সন (Bengali Version)
                  </span>
                  <span className="text-[11px] text-slate-500">বাংলা ব্যবহারকারীদের জন্য</span>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    সেকশন ট্যাগ / ব্যাজ (বাংলা)
                  </label>
                  <input
                    type="text"
                    value={data.tagBn || ''}
                    onChange={(e) => handleSectionChange('tagBn', e.target.value)}
                    placeholder="শৃঙ্খলা ও সময়ানুবর্তিতা"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-amber-400 transition font-bengali"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    মূল শিরোনাম / হেডিং (বাংলা)
                  </label>
                  <input
                    type="text"
                    value={data.titleBn || ''}
                    onChange={(e) => handleSectionChange('titleBn', e.target.value)}
                    placeholder="বিদ্যালয়ের একটি সাধারণ কর্মদিবস"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-sm font-bold text-white placeholder-slate-500 focus:outline-none focus:border-amber-400 transition font-bengali"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    উপ-শিরোনাম / বিবরণ (বাংলা)
                  </label>
                  <textarea
                    rows={3}
                    value={data.subtitleBn || ''}
                    onChange={(e) => handleSectionChange('subtitleBn', e.target.value)}
                    placeholder="সকালের প্রাত্যহিক সমাবেশ ও জাতীয় সংগীত থেকে শুরু করে অপরাহ্নের খেলাধুলা ও সহ-শিক্ষা কার্যক্রমের সুবিন্যস্ত সূচি।"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-400 transition leading-relaxed resize-none font-bengali"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Routine Timeline Items List Manager */}
          <div className="p-6 rounded-3xl bg-slate-900/60 border border-slate-800 backdrop-blur-md space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800/80 pb-4">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-base font-bold text-white flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-amber-400" />
                    <span>Daily Schedule Timeline Slots</span>
                  </h3>
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-400/10 text-amber-400 border border-amber-400/20">
                    {activeCount} Active / {totalCount} Total
                  </span>
                </div>
                <p className="text-xs text-slate-400 mt-0.5">
                  Manage each time slot, period name, practical activity, and description. Reorder with up/down arrows.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() =>
                    setModalItem({
                      time: '08:30 AM - 09:00 AM',
                      timeBn: 'সকাল ৮:৩০ - ৯:০০',
                      title: '',
                      titleBn: '',
                      desc: '',
                      descBn: '',
                      isActive: true,
                    })
                  }
                  className="px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold transition flex items-center gap-1.5 shadow-md shadow-amber-500/20 cursor-pointer"
                >
                  <Plus className="w-4 h-4" /> Add Routine Slot
                </button>
              </div>
            </div>

            {/* Empty state */}
            {(!data.items || data.items.length === 0) && (
              <div className="p-12 text-center rounded-2xl bg-slate-950/30 border border-dashed border-slate-800 space-y-3">
                <div className="w-12 h-12 rounded-full bg-slate-800 flex items-center justify-center mx-auto text-slate-400">
                  <Clock className="w-6 h-6" />
                </div>
                <p className="text-sm font-semibold text-slate-300">No routine slots configured</p>
                <p className="text-xs text-slate-500 max-w-sm mx-auto">
                  Click below to add a new slot or reset to the 7 default school schedule periods.
                </p>
                <div className="flex justify-center gap-3 pt-2">
                  <button
                    onClick={handleReset}
                    type="button"
                    className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-bold text-slate-200"
                  >
                    Load 7 Default Slots
                  </button>
                </div>
              </div>
            )}

            {/* Routine Items Grid / List */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {(data.items || []).map((item, idx) => (
                <div
                  key={item.id || item._id || idx}
                  className={`p-5 rounded-2xl border transition-all flex flex-col justify-between group ${
                    item.isActive === false
                      ? 'bg-slate-950/40 border-slate-800/60 opacity-60'
                      : 'bg-slate-950/70 border-slate-800 hover:border-amber-500/30 hover:shadow-lg'
                  }`}
                >
                  <div>
                    {/* Card Top: Time badge, slot number, actions */}
                    <div className="flex items-center justify-between gap-2 mb-3">
                      <span className="text-xs font-bold text-amber-400 bg-amber-400/10 border border-amber-400/20 px-2.5 py-1 rounded-full flex items-center gap-1.5">
                        <Clock className="w-3 h-3 text-amber-400" />
                        <span className="truncate max-w-[140px]">{item.time || item.timeBn}</span>
                      </span>

                      <div className="flex items-center gap-1.5">
                        <span className="text-xs font-black text-slate-500 font-mono">
                          #{String(idx + 1).padStart(2, '0')}
                        </span>
                        <button
                          type="button"
                          onClick={() => handleToggleItemActive(item.id || item._id)}
                          title={item.isActive === false ? 'Enable slot' : 'Disable slot'}
                          className={`w-6 h-6 rounded-lg flex items-center justify-center transition text-xs ${
                            item.isActive !== false
                              ? 'text-emerald-400 bg-emerald-400/10 hover:bg-emerald-400/20'
                              : 'text-slate-500 bg-slate-800 hover:bg-slate-700'
                          }`}
                        >
                          {item.isActive !== false ? '●' : '○'}
                        </button>
                      </div>
                    </div>

                    {/* Bengali Time Pill (if different) */}
                    {item.timeBn && item.timeBn !== item.time && (
                      <p className="text-[11px] text-slate-400 font-bengali mb-2 flex items-center gap-1">
                        <span className="text-slate-500">বাংলা সময়:</span> {item.timeBn}
                      </p>
                    )}

                    {/* English Title & Bengali Title */}
                    <h4 className="font-bold text-sm text-white mb-1 group-hover:text-amber-300 transition line-clamp-1">
                      {item.title || 'Untitled Period'}
                    </h4>
                    {item.titleBn && (
                      <p className="text-xs font-medium text-amber-400/90 font-bengali mb-2 line-clamp-1">
                        {item.titleBn}
                      </p>
                    )}

                    {/* Description preview */}
                    <p className="text-xs text-slate-400 leading-relaxed line-clamp-3 mb-2">
                      {item.desc || 'No English description provided.'}
                    </p>
                    {item.descBn && (
                      <p className="text-[11px] text-slate-400 font-bengali leading-relaxed line-clamp-2 border-t border-slate-800/80 pt-1.5">
                        {item.descBn}
                      </p>
                    )}
                  </div>

                  {/* Card Bottom: Edit, Move, Delete controls */}
                  <div className="pt-4 mt-3 border-t border-slate-800/80 flex items-center justify-between">
                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        disabled={idx === 0}
                        onClick={() => handleMoveItem(idx, 'up')}
                        title="Move Up"
                        className="p-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white transition disabled:opacity-30 disabled:hover:bg-slate-900"
                      >
                        <ArrowUp className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        disabled={idx === (data.items || []).length - 1}
                        onClick={() => handleMoveItem(idx, 'down')}
                        title="Move Down"
                        className="p-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white transition disabled:opacity-30 disabled:hover:bg-slate-900"
                      >
                        <ArrowDown className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <div className="flex items-center gap-1.5">
                      <button
                        type="button"
                        onClick={() => setModalItem({ ...item })}
                        className="px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-amber-500/20 text-slate-300 hover:text-amber-400 text-xs font-bold transition flex items-center gap-1"
                      >
                        <Edit3 className="w-3 h-3" /> Edit
                      </button>
                      <button
                        type="button"
                        onClick={() => setItemToDelete(item)}
                        className="p-1.5 rounded-lg bg-slate-800 hover:bg-red-500/20 text-slate-400 hover:text-red-400 transition"
                        title="Delete slot"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : (
        /* Live Preview Mode (mirrors HomePage layout) */
        <div className="space-y-6">
          <div className="flex items-center justify-between p-4 rounded-2xl bg-slate-900/60 border border-slate-800">
            <div className="flex items-center gap-2">
              <Eye className="w-4 h-4 text-amber-400" />
              <span className="text-xs font-bold text-white">Previewing exact homepage view:</span>
            </div>
            <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-xl border border-slate-800">
              <button
                type="button"
                onClick={() => setPreviewLang('bn')}
                className={`px-3 py-1 rounded-lg text-xs font-bold transition ${
                  previewLang === 'bn'
                    ? 'bg-amber-500 text-slate-950'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                বাংলা (Bengali)
              </button>
              <button
                type="button"
                onClick={() => setPreviewLang('en')}
                className={`px-3 py-1 rounded-lg text-xs font-bold transition ${
                  previewLang === 'en'
                    ? 'bg-amber-500 text-slate-950'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                English
              </button>
            </div>
          </div>

          {/* Render section simulating homepage */}
          <div className="rounded-3xl bg-[#fdfaf5] text-slate-900 p-8 sm:p-14 border border-slate-200 shadow-2xl relative overflow-hidden">
            {!data.isActive && (
              <div className="mb-6 p-3 rounded-xl bg-amber-50 border border-amber-200 text-amber-800 text-xs font-semibold text-center">
                ⚠️ Notice: This section is currently DISABLED. On the live website it will not be displayed.
              </div>
            )}

            <div className="text-center max-w-2xl mx-auto mb-12">
              <span className="text-xs font-bold uppercase tracking-wider text-[#4f46e5] bg-[#4f46e5]/10 px-3.5 py-1.5 rounded-full inline-block">
                {previewLang === 'bn'
                  ? data.tagBn || data.tag || 'শৃঙ্খলা ও সময়ানুবর্তিতা'
                  : data.tag || data.tagBn || 'Discipline & Routine'}
              </span>
              <h2 className="mt-3 font-extrabold text-3xl sm:text-4xl text-[#1e1b4b] tracking-tight">
                {previewLang === 'bn'
                  ? data.titleBn || data.title || 'বিদ্যালয়ের একটি সাধারণ কর্মদিবস'
                  : data.title || data.titleBn || 'A Day in Mirashani School Life'}
              </h2>
              <p className="mt-2 text-sm text-slate-600 leading-relaxed">
                {previewLang === 'bn'
                  ? data.subtitleBn ||
                    data.subtitle ||
                    'সকালের প্রাত্যহিক সমাবেশ ও জাতীয় সংগীত থেকে শুরু করে অপরাহ্নের খেলাধুলা ও সহ-শিক্ষা কার্যক্রমের সুবিন্যস্ত সূচি।'
                  : data.subtitle ||
                    data.subtitleBn ||
                    'A disciplined, vibrant daily routine from morning national assembly to afternoon co-curricular activities.'}
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {(data.items || [])
                .filter((item) => item.isActive !== false)
                .map((item, idx) => (
                  <div
                    key={item.id || idx}
                    className="p-6 rounded-3xl bg-white border border-slate-200 shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-xs font-bold text-[#4f46e5] bg-[#4f46e5]/10 px-2.5 py-1 rounded-full flex items-center gap-1">
                          <Clock className="w-3 h-3 text-[#4f46e5]" />
                          {previewLang === 'bn'
                            ? item.timeBn || item.time
                            : item.time || item.timeBn}
                        </span>
                        <span className="text-xs font-black text-slate-400 font-mono">
                          {String(idx + 1).padStart(2, '0')}
                        </span>
                      </div>
                      <h4 className="font-bold text-base text-[#1e1b4b] mb-2">
                        {previewLang === 'bn'
                          ? item.titleBn || item.title
                          : item.title || item.titleBn}
                      </h4>
                      <p className="text-xs text-slate-600 leading-relaxed">
                        {previewLang === 'bn'
                          ? item.descBn || item.desc
                          : item.desc || item.descBn}
                      </p>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        </div>
      )}

      {/* Add / Edit Routine Slot Modal */}
      {modalItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/80 backdrop-blur-sm animate-fadeIn">
          <div className="w-full max-w-2xl rounded-3xl bg-slate-900 border border-slate-800 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
            {/* Modal Header */}
            <div className="p-5 sm:p-6 border-b border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center">
                  <Clock className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white">
                    {modalItem.id || modalItem._id
                      ? 'Edit Routine Period Slot'
                      : 'Add New Routine Period Slot'}
                  </h3>
                  <p className="text-xs text-slate-400">
                    Bilingual details for this routine period
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setModalItem(null)}
                className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Quick Presets */}
            {!(modalItem.id || modalItem._id) && (
              <div className="px-6 pt-4 pb-2 border-b border-slate-800/60 bg-slate-950/40">
                <p className="text-[11px] font-semibold text-slate-400 mb-2">
                  Quick Preset Templates:
                </p>
                <div className="flex flex-wrap gap-1.5 pb-2">
                  {PRESET_TEMPLATES.map((tmpl) => (
                    <button
                      key={tmpl.label}
                      type="button"
                      onClick={() =>
                        setModalItem((prev) => ({
                          ...prev,
                          time: tmpl.time,
                          timeBn: tmpl.timeBn,
                          title: tmpl.title,
                          titleBn: tmpl.titleBn,
                          desc: tmpl.desc,
                          descBn: tmpl.descBn,
                        }))
                      }
                      className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-amber-500/20 text-[11px] font-medium text-slate-300 hover:text-amber-400 transition border border-slate-700 hover:border-amber-500/30"
                    >
                      + {tmpl.label}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Modal Body Form */}
            <form onSubmit={handleSaveModalItem} className="p-6 space-y-5 overflow-y-auto flex-1">
              {/* Active Switch */}
              <div className="flex items-center justify-between p-3 rounded-xl bg-slate-950 border border-slate-800">
                <span className="text-xs font-semibold text-slate-300">
                  Active Status for this Period
                </span>
                <button
                  type="button"
                  onClick={() =>
                    setModalItem((prev) => ({
                      ...prev,
                      isActive: prev.isActive === false ? true : false,
                    }))
                  }
                  className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out ${
                    modalItem.isActive !== false ? 'bg-emerald-500' : 'bg-slate-700'
                  }`}
                >
                  <span
                    className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                      modalItem.isActive !== false ? 'translate-x-4' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>

              {/* Time Fields */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Time Interval (English) *
                  </label>
                  <input
                    type="text"
                    required
                    value={modalItem.time || ''}
                    onChange={(e) =>
                      setModalItem((prev) => ({ ...prev, time: e.target.value }))
                    }
                    placeholder="e.g. 08:30 AM - 09:00 AM"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-amber-400 transition"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1 font-bengali">
                    সময়সূচি (বাংলা) *
                  </label>
                  <input
                    type="text"
                    required
                    value={modalItem.timeBn || ''}
                    onChange={(e) =>
                      setModalItem((prev) => ({ ...prev, timeBn: e.target.value }))
                    }
                    placeholder="যেমন: সকাল ৮:৩০ - ৯:০০"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-amber-400 transition font-bengali"
                  />
                </div>
              </div>

              {/* Title Fields */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Period Title (English) *
                  </label>
                  <input
                    type="text"
                    required
                    value={modalItem.title || ''}
                    onChange={(e) =>
                      setModalItem((prev) => ({ ...prev, title: e.target.value }))
                    }
                    placeholder="Morning Assembly & Physical Drill"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-sm font-bold text-white placeholder-slate-500 focus:outline-none focus:border-amber-400 transition"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1 font-bengali">
                    পিরিয়ডের শিরোনাম (বাংলা) *
                  </label>
                  <input
                    type="text"
                    required
                    value={modalItem.titleBn || ''}
                    onChange={(e) =>
                      setModalItem((prev) => ({ ...prev, titleBn: e.target.value }))
                    }
                    placeholder="প্রাত্যহিক সমাবেশ ও শারীরিক কসরত"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-sm font-bold text-white placeholder-slate-500 focus:outline-none focus:border-amber-400 transition font-bengali"
                  />
                </div>
              </div>

              {/* Description Fields */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Description (English)
                  </label>
                  <textarea
                    rows={4}
                    value={modalItem.desc || ''}
                    onChange={(e) =>
                      setModalItem((prev) => ({ ...prev, desc: e.target.value }))
                    }
                    placeholder="Details about what happens during this period..."
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-400 transition leading-relaxed resize-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1 font-bengali">
                    বিস্তারিত বিবরণ (বাংলা)
                  </label>
                  <textarea
                    rows={4}
                    value={modalItem.descBn || ''}
                    onChange={(e) =>
                      setModalItem((prev) => ({ ...prev, descBn: e.target.value }))
                    }
                    placeholder="এই পিরিয়ডে যেসকল কার্যক্রম অনুষ্ঠিত হয়..."
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-400 transition leading-relaxed resize-none font-bengali"
                  />
                </div>
              </div>

              {/* Modal Footer */}
              <div className="pt-4 border-t border-slate-800 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setModalItem(null)}
                  className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-bold text-slate-300 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-extrabold shadow-lg shadow-amber-500/20 transition flex items-center gap-2 cursor-pointer"
                >
                  <Check className="w-4 h-4" /> Save Routine Period
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
