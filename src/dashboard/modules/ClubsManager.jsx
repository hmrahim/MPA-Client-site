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
  Tag,
  Smile,
  Trophy,
} from 'lucide-react'
import api from '../../lib/api'
import ClubDeleteAlert from '../components/ClubDeleteAlert'

const EMOJI_PRESETS = [
  '🚀', '🎙️', '🏕️', '🎭', '🏆', '📖',
  '🎨', '🎵', '🌿', '⚽', '♟️', '🔬',
  '💻', '📸', '🎸', '🥋', '🏸', '🏊‍♂️',
  '🤖', '💡', '🌟', '🎯', '🧩', '🌎'
]

const INITIAL_DATA = {
  isActive: true,
  tag: 'Holistic Student Life',
  tagBn: 'সহ-শিক্ষা কার্যক্রম',
  title: 'Co-Curricular Clubs & Activities',
  titleBn: 'শিক্ষার্থী ক্লাব ও প্রতিভা বিকাশ',
  subtitle:
    'Beyond the classroom, our students discover leadership, teamwork, public speaking, and creative expression.',
  subtitleBn:
    'শ্রেণিকক্ষের বাইরে নেতৃত্ব, জনসম্মুখে বক্তৃতা, বিতর্ক ও শরীরচর্চায় শিক্ষার্থীদের স্বতঃস্ফূর্ত অংশগ্রহণ।',
  clubs: [
    {
      id: 'club-1',
      icon: '🚀',
      name: 'Science & Innovation Club',
      nameBn: 'বিজ্ঞান ও উদ্ভাবন ক্লাব',
      desc: 'Weekly practical experiments, science model displays, astronomy sky-watching, and Math Olympiad workshops.',
      descBn: 'সাপ্তাহিক বৈজ্ঞানিক প্রজেক্ট প্রদর্শনী, টেলিস্কোপে আকাশ পর্যবেক্ষণ এবং গণিত অলিম্পিয়াড প্রশিক্ষণ।',
      order: 1,
      isActive: true,
    },
    {
      id: 'club-2',
      icon: '🎙️',
      name: 'School Debating Society',
      nameBn: 'স্কুল ডিবেটিং সোসাইটি (বিতর্ক পরিষদ)',
      desc: 'Parliamentary and traditional debate in Bangla & English, extempore speech, and championship.',
      descBn: 'বাংলা ও ইংরেজি ভাষায় সনাতনী ও সংসদীয় বিতর্ক কর্মশালা এবং আন্তঃস্কুল বিতর্ক প্রতিযোগিতা।',
      order: 2,
      isActive: true,
    },
    {
      id: 'club-3',
      icon: '🏕️',
      name: 'Bangladesh Scouts & Girl Guides',
      nameBn: 'বাংলাদেশ স্কাউটস ও গার্ল গাইডস',
      desc: 'Character building, outdoor camping, first aid, traffic awareness, and national disaster relief.',
      descBn: 'নৈতিক চরিত্র গঠন, ক্যাম্পিং, প্রাথমিক চিকিৎসা ও ট্রাফিক সচেতনতা এবং সামাজিক মানবসেবা।',
      order: 3,
      isActive: true,
    },
    {
      id: 'club-4',
      icon: '🎭',
      name: 'Cultural & Performing Arts',
      nameBn: 'সাংস্কৃতিক ও সাহিত্য সংসদ',
      desc: 'Patriotic songs, Nazrul-Rabindra sangeet, recitation, theatre staging, and national celebrations.',
      descBn: 'দেশাত্মবোধক গান, রবীন্দ্র-নজরুল সঙ্গীত, আবৃত্তি, নাট্যমঞ্চায়ন ও বার্ষিক দেয়াল পত্রিকা প্রকাশনা।',
      order: 4,
      isActive: true,
    },
    {
      id: 'club-5',
      icon: '🏆',
      name: 'Sports & Athletics Association',
      nameBn: 'ক্রীড়া ও অ্যাথলেটিক্স পরিষদ',
      desc: 'Football cup tournaments, cricket leagues, badminton tournaments, 100m sprint, and athletic meets.',
      descBn: 'আন্তঃহাউস ফুটবল ও ক্রিকেট টুর্নামেন্ট, ১০০ মিটার স্প্রিন্ট, ব্যাডমিন্টন ও হ্যান্ডবল প্রতিযোগিতা।',
      order: 5,
      isActive: true,
    },
    {
      id: 'club-6',
      icon: '📖',
      name: 'Language & Literary Club',
      nameBn: 'ভাষা ও ইংরেজি ক্লাব',
      desc: 'Spelling bee contests, creative writing, poetry recitations, and publishing the school annual wall magazine.',
      descBn: 'স্পেলিং বি প্রতিযোগিতা, ক্রিয়েটিভ ইংরেজি রাইটিং এবং সাবলীল উচ্চারণ ও কথোপকথন চর্চা।',
      order: 6,
      isActive: true,
    },
  ],
}

export default function ClubsManager() {
  const [data, setData] = useState(INITIAL_DATA)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [toast, setToast] = useState(null)
  const [previewLang, setPreviewLang] = useState('bn')
  const [activeTab, setActiveTab] = useState('clubs') // 'clubs' | 'headers' | 'preview'

  // Modal State for Add / Edit
  const [modalOpen, setModalOpen] = useState(false)
  const [editingClub, setEditingClub] = useState(null)

  // Delete Alert State
  const [clubToDelete, setClubToDelete] = useState(null)
  const [deletingClub, setDeletingClub] = useState(false)

  const showToast = (message, type = 'success') => {
    setToast({ message, type })
    setTimeout(() => setToast(null), 4000)
  }

  // Load from Backend or Cached LocalStorage
  const loadData = async () => {
    setLoading(true)
    try {
      const cached = localStorage.getItem('mpa_clubs_section')
      if (cached) {
        try {
          setData(JSON.parse(cached))
        } catch (_) {}
      }

      const res = await api.getClubs()
      if (res?.success && res.data) {
        setData(res.data)
        localStorage.setItem('mpa_clubs_section', JSON.stringify(res.data))
      }
    } catch (err) {
      console.warn('Could not load clubs data from API, using fallback:', err)
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
      const res = await api.updateClubs(updatedData)
      if (res?.success && res.data) {
        setData(res.data)
        localStorage.setItem('mpa_clubs_section', JSON.stringify(res.data))
        window.dispatchEvent(new Event('mpa_clubs_updated'))
        showToast('Co-Curricular Clubs section updated successfully! 🎉')
      } else {
        localStorage.setItem('mpa_clubs_section', JSON.stringify(updatedData))
        setData(updatedData)
        window.dispatchEvent(new Event('mpa_clubs_updated'))
        showToast('Updated and saved locally!')
      }
    } catch (err) {
      console.error('Save failed:', err)
      localStorage.setItem('mpa_clubs_section', JSON.stringify(updatedData))
      setData(updatedData)
      window.dispatchEvent(new Event('mpa_clubs_updated'))
      showToast('Saved to local storage!', 'info')
    } finally {
      setSaving(false)
    }
  }

  // Reset to school defaults
  const handleReset = async () => {
    if (!window.confirm('Reset Co-Curricular Clubs section data to school defaults?')) return
    setSaving(true)
    try {
      const res = await api.resetClubs()
      if (res?.success && res.data) {
        setData(res.data)
        localStorage.setItem('mpa_clubs_section', JSON.stringify(res.data))
        window.dispatchEvent(new Event('mpa_clubs_updated'))
        showToast('Co-Curricular Clubs section reset to defaults! ✨')
      } else {
        setData(INITIAL_DATA)
        localStorage.setItem('mpa_clubs_section', JSON.stringify(INITIAL_DATA))
        window.dispatchEvent(new Event('mpa_clubs_updated'))
        showToast('Reset to default values!')
      }
    } catch (err) {
      setData(INITIAL_DATA)
      localStorage.setItem('mpa_clubs_section', JSON.stringify(INITIAL_DATA))
      window.dispatchEvent(new Event('mpa_clubs_updated'))
      showToast('Reset completed!', 'info')
    } finally {
      setSaving(false)
    }
  }

  // Reorder Clubs
  const moveClub = (index, direction) => {
    const targetIndex = index + direction
    if (targetIndex < 0 || targetIndex >= data.clubs.length) return
    const updated = [...data.clubs]
    const temp = updated[index]
    updated[index] = updated[targetIndex]
    updated[targetIndex] = temp
    const nextData = { ...data, clubs: updated }
    setData(nextData)
    handleSave(nextData)
  }

  // Delete Club
  const handleDeleteClub = (club) => {
    setClubToDelete(club)
  }

  // Confirm and execute delete from custom alert modal
  const handleConfirmDelete = async () => {
    if (!clubToDelete) return
    const id = clubToDelete.id || clubToDelete._id
    setDeletingClub(true)
    try {
      if (id && !String(id).startsWith('club-default-')) {
        await api.deleteClubItem(id).catch(() => {})
      }
      const updated = data.clubs.filter((c) => c.id !== id && c._id !== id)
      const nextData = { ...data, clubs: updated }
      setData(nextData)
      await handleSave(nextData)
      showToast(`Club "${clubToDelete.name || clubToDelete.nameBn || 'Club'}" deleted successfully! 🗑️`)
      setClubToDelete(null)
    } catch (err) {
      console.error(err)
      showToast('Error deleting club', 'error')
    } finally {
      setDeletingClub(false)
    }
  }

  // Toggle active status of a club
  const toggleClubActive = (id) => {
    const updated = data.clubs.map((c) => {
      if (c.id === id || c._id === id) {
        return { ...c, isActive: c.isActive === false }
      }
      return c
    })
    const nextData = { ...data, clubs: updated }
    setData(nextData)
    handleSave(nextData)
  }

  // Open Modal for New Club
  const openAddModal = () => {
    setEditingClub({
      id: `club-${Date.now()}`,
      icon: '🎯',
      name: '',
      nameBn: '',
      desc: '',
      descBn: '',
      order: (data.clubs?.length || 0) + 1,
      isActive: true,
    })
    setModalOpen(true)
  }

  // Open Modal for Edit
  const openEditModal = (club) => {
    setEditingClub(JSON.parse(JSON.stringify(club)))
    setModalOpen(true)
  }

  // Save Modal Club
  const handleSaveModalClub = (e) => {
    e.preventDefault()
    if (!editingClub.name && !editingClub.nameBn) {
      alert('Please enter at least an English or Bengali club name!')
      return
    }

    let updatedClubs
    const exists = data.clubs.some(
      (c) =>
        (editingClub.id && c.id === editingClub.id) ||
        (editingClub._id && c._id === editingClub._id)
    )

    if (exists) {
      updatedClubs = data.clubs.map((c) =>
        (editingClub.id && c.id === editingClub.id) ||
        (editingClub._id && c._id === editingClub._id)
          ? editingClub
          : c
      )
    } else {
      updatedClubs = [...data.clubs, editingClub]
    }

    const nextData = { ...data, clubs: updatedClubs }
    setData(nextData)
    setModalOpen(false)
    setEditingClub(null)
    handleSave(nextData)
    showToast('Club item saved successfully! 🎉')
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-brick border-t-transparent rounded-full animate-spin" />
          <span className="text-sm font-bold text-slate-400">Loading Co-Curricular Clubs Section...</span>
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
      {clubToDelete && (
        <ClubDeleteAlert
          club={clubToDelete}
          deleting={deletingClub}
          onConfirm={handleConfirmDelete}
          onCancel={() => {
            if (!deletingClub) setClubToDelete(null)
          }}
        />
      )}

      {/* Top Header Card */}
      <div className="bg-gradient-to-r from-slate-900 via-rose-950 to-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-rose-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 relative z-10">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold bg-rose-500/20 text-rose-300 border border-rose-500/30">
              <Trophy className="w-3.5 h-3.5" />
              <span>Website CMS · Holistic Student Life & Co-Curricular Clubs</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Co-Curricular Clubs & Activities
            </h1>
            <p className="text-sm text-slate-300 max-w-2xl leading-relaxed">
              Create, edit, and organize all school clubs (Science Club, Debating Society, Scouts, Cultural Arts, Sports, Language Club, etc.)
              with complete word-to-word bilingual editing for tags, headings, subtitles, icons, titles, and descriptions.
            </p>
          </div>

          {/* Quick Actions */}
          <div className="flex flex-wrap items-center gap-3">
            <a
              href="/#clubs"
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
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-rose-500 to-amber-500 hover:from-rose-400 hover:to-amber-400 text-white font-bold text-xs inline-flex items-center gap-2 shadow-lg shadow-rose-500/20 transition cursor-pointer disabled:opacity-50"
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
                className="w-4 h-4 rounded text-rose-500 focus:ring-rose-400 cursor-pointer"
              />
              <span className="text-xs font-bold text-slate-300">
                {data.isActive !== false ? 'Section is Active (Visible on Homepage)' : 'Section is Hidden'}
              </span>
            </label>
            <span className="text-xs px-2.5 py-1 rounded-full bg-slate-800 border border-slate-700 text-slate-400">
              {data.clubs?.length || 0} Clubs Configured
            </span>
          </div>

          {/* Preview Language Switcher */}
          <div className="flex items-center gap-2 bg-slate-800/80 p-1 rounded-xl border border-slate-700">
            <span className="text-[11px] font-bold text-slate-400 px-2">Preview In:</span>
            <button
              onClick={() => setPreviewLang('bn')}
              className={`px-3 py-1 rounded-lg text-xs font-bold transition cursor-pointer ${
                previewLang === 'bn'
                  ? 'bg-rose-500 text-white shadow'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              বাংলা (BN)
            </button>
            <button
              onClick={() => setPreviewLang('en')}
              className={`px-3 py-1 rounded-lg text-xs font-bold transition cursor-pointer ${
                previewLang === 'en'
                  ? 'bg-rose-500 text-white shadow'
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
          onClick={() => setActiveTab('clubs')}
          className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 transition cursor-pointer ${
            activeTab === 'clubs'
              ? 'bg-rose-600 text-white shadow-md shadow-rose-600/20'
              : 'text-slate-400 hover:text-white hover:bg-slate-800'
          }`}
        >
          <Layers className="w-4 h-4" />
          <span>Clubs Cards ({data.clubs?.length || 0})</span>
        </button>

        <button
          onClick={() => setActiveTab('headers')}
          className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 transition cursor-pointer ${
            activeTab === 'headers'
              ? 'bg-rose-600 text-white shadow-md shadow-rose-600/20'
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
              ? 'bg-rose-600 text-white shadow-md shadow-rose-600/20'
              : 'text-slate-400 hover:text-white hover:bg-slate-800'
          }`}
        >
          <Eye className="w-4 h-4" />
          <span>Live Homepage Simulation</span>
        </button>
      </div>

      {/* ── TAB 1: CLUBS CARDS ── */}
      {activeTab === 'clubs' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-slate-900/60 p-5 rounded-2xl border border-slate-800">
            <div>
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <span>Manage Student Clubs</span>
                <span className="text-xs px-2 py-0.5 rounded-md bg-rose-500/20 text-rose-300 border border-rose-500/30">
                  {data.clubs?.length || 0} Cards
                </span>
              </h2>
              <p className="text-xs text-slate-400 mt-1">
                Reorder clubs, customize icons, and update club names and descriptions in English and Bengali.
              </p>
            </div>
            <button
              onClick={openAddModal}
              className="px-4 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs inline-flex items-center gap-2 shadow-lg shadow-rose-600/25 transition cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Create New Club Card</span>
            </button>
          </div>

          {/* Cards Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
            {data.clubs?.map((club, index) => (
              <div
                key={club.id || club._id || index}
                className={`bg-slate-900/90 rounded-2xl border transition-all p-5 flex flex-col justify-between ${
                  club.isActive === false
                    ? 'border-slate-800 opacity-60'
                    : 'border-slate-800 hover:border-rose-500/50 shadow-xl'
                }`}
              >
                <div>
                  {/* Card Top Strip */}
                  <div className="flex items-start justify-between gap-2 mb-3">
                    <span className="text-3xl p-2 rounded-2xl bg-slate-800 border border-slate-700/80 shadow-inner">
                      {club.icon || '🎯'}
                    </span>

                    {/* Reorder / Status Controls */}
                    <div className="flex items-center gap-1 bg-slate-800/80 p-1 rounded-xl border border-slate-700">
                      <button
                        onClick={() => moveClub(index, -1)}
                        disabled={index === 0}
                        className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-700 disabled:opacity-20 cursor-pointer"
                        title="Move Left / Up"
                      >
                        <ArrowUp className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => moveClub(index, 1)}
                        disabled={index === data.clubs.length - 1}
                        className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-700 disabled:opacity-20 cursor-pointer"
                        title="Move Right / Down"
                      >
                        <ArrowDown className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  {/* Title */}
                  <h3 className="font-extrabold text-base text-white mb-1.5 leading-snug">
                    {previewLang === 'bn' ? club.nameBn || club.name : club.name || club.nameBn}
                  </h3>

                  {/* Secondary Title (other language) */}
                  <p className="text-[11px] text-slate-400 mb-2">
                    {previewLang === 'bn' ? club.name : club.nameBn}
                  </p>

                  {/* Description */}
                  <p className="text-xs text-slate-300 leading-relaxed mb-4 line-clamp-3">
                    {previewLang === 'bn' ? club.descBn || club.desc : club.desc || club.descBn}
                  </p>
                </div>

                {/* Footer Controls */}
                <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between gap-2 mt-2">
                  <button
                    onClick={() => toggleClubActive(club.id || club._id)}
                    className={`text-[11px] font-bold px-2.5 py-1 rounded-lg border transition cursor-pointer ${
                      club.isActive !== false
                        ? 'bg-emerald-500/10 text-emerald-300 border-emerald-500/30'
                        : 'bg-slate-800 text-slate-400 border-slate-700'
                    }`}
                  >
                    {club.isActive !== false ? '● Visible' : '○ Hidden'}
                  </button>

                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => openEditModal(club)}
                      className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold inline-flex items-center gap-1 transition cursor-pointer border border-slate-700"
                    >
                      <Edit3 className="w-3 h-3 text-rose-400" />
                      <span>Edit</span>
                    </button>

                    <button
                      onClick={() => handleDeleteClub(club)}
                      className="p-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/30 transition cursor-pointer"
                      title="Delete Club"
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
                <Tag className="w-4 h-4 text-rose-400" />
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
                  <span className="text-[10px] text-rose-400 font-mono">Holistic Student Life</span>
                </label>
                <input
                  type="text"
                  value={data.tag || ''}
                  onChange={(e) => setData({ ...data, tag: e.target.value })}
                  placeholder="e.g. Holistic Student Life"
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white text-sm focus:border-rose-500 focus:outline-none"
                />
              </div>

              {/* Badge Tag BN */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-300 flex items-center justify-between">
                  <span>Section Tag (বাংলা)</span>
                  <span className="text-[10px] text-rose-400 font-mono">সহ-শিক্ষা কার্যক্রম</span>
                </label>
                <input
                  type="text"
                  value={data.tagBn || ''}
                  onChange={(e) => setData({ ...data, tagBn: e.target.value })}
                  placeholder="যেমন: সহ-শিক্ষা কার্যক্রম"
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white text-sm focus:border-rose-500 focus:outline-none"
                />
              </div>

              {/* Title EN */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-300 flex items-center justify-between">
                  <span>Main Title / Heading (English)</span>
                  <span className="text-[10px] text-rose-400 font-mono">Co-Curricular Clubs & Activities</span>
                </label>
                <input
                  type="text"
                  value={data.title || ''}
                  onChange={(e) => setData({ ...data, title: e.target.value })}
                  placeholder="e.g. Co-Curricular Clubs & Activities"
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white text-sm focus:border-rose-500 focus:outline-none"
                />
              </div>

              {/* Title BN */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-300 flex items-center justify-between">
                  <span>Main Title / Heading (বাংলা)</span>
                  <span className="text-[10px] text-rose-400 font-mono">শিক্ষার্থী ক্লাব ও প্রতিভা বিকাশ</span>
                </label>
                <input
                  type="text"
                  value={data.titleBn || ''}
                  onChange={(e) => setData({ ...data, titleBn: e.target.value })}
                  placeholder="যেমন: শিক্ষার্থী ক্লাব ও প্রতিভা বিকাশ"
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white text-sm focus:border-rose-500 focus:outline-none"
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
                  placeholder="Beyond the classroom, our students discover leadership..."
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white text-sm focus:border-rose-500 focus:outline-none"
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
                  placeholder="শ্রেণিকক্ষের বাইরে নেতৃত্ব, জনসম্মুখে বক্তৃতা..."
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white text-sm focus:border-rose-500 focus:outline-none"
                />
              </div>
            </div>

            <div className="pt-4 border-t border-slate-800 flex justify-end">
              <button
                onClick={() => handleSave()}
                disabled={saving}
                className="px-6 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-sm inline-flex items-center gap-2 shadow-lg shadow-rose-600/30 transition cursor-pointer disabled:opacity-50"
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
              <span className="text-xs font-bold text-rose-400 uppercase tracking-widest">
                Live Simulation
              </span>
              <h3 className="text-lg font-bold text-white">How this section appears on the homepage</h3>
            </div>
            <div className="flex items-center gap-2 bg-slate-800 p-1 rounded-xl border border-slate-700">
              <button
                onClick={() => setPreviewLang('bn')}
                className={`px-3 py-1 rounded-lg text-xs font-bold ${
                  previewLang === 'bn' ? 'bg-rose-500 text-white' : 'text-slate-400'
                }`}
              >
                বাংলা
              </button>
              <button
                onClick={() => setPreviewLang('en')}
                className={`px-3 py-1 rounded-lg text-xs font-bold ${
                  previewLang === 'en' ? 'bg-rose-500 text-white' : 'text-slate-400'
                }`}
              >
                English
              </button>
            </div>
          </div>

          {/* Simulated Section Content */}
          <section className="bg-lilac/30 rounded-3xl py-12 px-6">
            <div className="text-center max-w-2xl mx-auto mb-14">
              <span className="text-xs font-bold uppercase tracking-wider text-rose-400 bg-rose-400/15 px-3 py-1 rounded-full">
                {previewLang === 'bn' ? data.tagBn || data.tag : data.tag || data.tagBn}
              </span>
              <h2 className="mt-2 font-display font-extrabold text-3xl sm:text-4xl text-white">
                {previewLang === 'bn' ? data.titleBn || data.title : data.title || data.titleBn}
              </h2>
              <p className="mt-3 text-sm text-slate-300">
                {previewLang === 'bn' ? data.subtitleBn || data.subtitle : data.subtitle || data.subtitleBn}
              </p>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {data.clubs
                ?.filter((club) => club.isActive !== false)
                .map((club) => (
                  <div
                    key={club.id || club._id || club.name}
                    className="p-6 rounded-3xl bg-white border border-slate-200 shadow-sm hover:shadow-md transition-all flex items-start gap-4"
                  >
                    <div className="text-3xl p-2 rounded-2xl bg-slate-100 shadow-sm shrink-0">
                      {club.icon || '🎯'}
                    </div>
                    <div>
                      <h4 className="font-display font-bold text-base text-slate-900">
                        {previewLang === 'bn' ? club.nameBn || club.name : club.name || club.nameBn}
                      </h4>
                      <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                        {previewLang === 'bn' ? club.descBn || club.desc : club.desc || club.descBn}
                      </p>
                    </div>
                  </div>
                ))}
            </div>
          </section>
        </div>
      )}

      {/* ── MODAL: CREATE / EDIT CLUB ── */}
      {modalOpen && editingClub && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-xl w-full p-6 sm:p-8 space-y-6 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <div>
                <h3 className="text-lg font-bold text-white">
                  {editingClub.id && data.clubs.some((c) => c.id === editingClub.id)
                    ? 'Edit Student Club'
                    : 'Create New Club Card'}
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Set emoji icon, club names and descriptions in both languages.
                </p>
              </div>
              <button
                onClick={() => setModalOpen(false)}
                className="p-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveModalClub} className="space-y-4">
              {/* Icon / Emoji Picker */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-300 flex items-center gap-2">
                  <Smile className="w-3.5 h-3.5 text-rose-400" />
                  <span>Emoji Icon</span>
                </label>
                <div className="flex items-center gap-3">
                  <input
                    type="text"
                    value={editingClub.icon || ''}
                    onChange={(e) => setEditingClub({ ...editingClub, icon: e.target.value })}
                    className="w-16 text-center text-2xl py-2 bg-slate-950 border border-slate-700 rounded-xl text-white"
                  />
                  <div className="flex flex-wrap gap-1.5 max-h-20 overflow-y-auto p-1.5 bg-slate-950/60 rounded-xl border border-slate-800">
                    {EMOJI_PRESETS.map((emoji) => (
                      <button
                        key={emoji}
                        type="button"
                        onClick={() => setEditingClub({ ...editingClub, icon: emoji })}
                        className={`text-lg p-1 rounded hover:bg-slate-800 cursor-pointer ${
                          editingClub.icon === emoji ? 'bg-rose-500/20 border border-rose-500' : ''
                        }`}
                      >
                        {emoji}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Name EN & BN */}
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-300">
                    Club Name (English) *
                  </label>
                  <input
                    type="text"
                    value={editingClub.name || ''}
                    onChange={(e) => setEditingClub({ ...editingClub, name: e.target.value })}
                    placeholder="e.g. Science & Innovation Club"
                    className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white text-sm focus:border-rose-500 focus:outline-none"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-300">
                    Club Name (বাংলা) *
                  </label>
                  <input
                    type="text"
                    value={editingClub.nameBn || ''}
                    onChange={(e) => setEditingClub({ ...editingClub, nameBn: e.target.value })}
                    placeholder="যেমন: বিজ্ঞান ও উদ্ভাবন ক্লাব"
                    className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white text-sm focus:border-rose-500 focus:outline-none"
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
                  value={editingClub.desc || ''}
                  onChange={(e) => setEditingClub({ ...editingClub, desc: e.target.value })}
                  placeholder="Weekly practical experiments, science model displays..."
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white text-sm focus:border-rose-500 focus:outline-none"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-300">
                  Description (বাংলা)
                </label>
                <textarea
                  rows={2}
                  value={editingClub.descBn || ''}
                  onChange={(e) => setEditingClub({ ...editingClub, descBn: e.target.value })}
                  placeholder="সাপ্তাহিক বৈজ্ঞানিক প্রজেক্ট প্রদর্শনী..."
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white text-sm focus:border-rose-500 focus:outline-none"
                />
              </div>

              {/* Active Toggle */}
              <div className="pt-2">
                <label className="flex items-center gap-2 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={editingClub.isActive !== false}
                    onChange={(e) =>
                      setEditingClub({ ...editingClub, isActive: e.target.checked })
                    }
                    className="w-4 h-4 rounded text-rose-500 focus:ring-rose-400 cursor-pointer"
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
                  className="px-5 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold shadow-lg shadow-rose-600/30 transition cursor-pointer"
                >
                  Save Club Card
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
