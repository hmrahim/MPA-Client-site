import { useState, useEffect } from 'react'
import {
  Trophy,
  Award,
  Crown,
  Medal,
  UserPlus,
  Search,
  CheckCircle2,
  X,
  Edit2,
  Trash2,
  UploadCloud,
  RotateCcw,
  Sparkles,
  ExternalLink,
  GraduationCap,
} from 'lucide-react'
import api from '../../lib/api'
import { uploadToImgbb } from '../../lib/imgbb'

const CLASSES = [
  { id: 'All', labelEn: 'All Classes', labelBn: 'সকল শ্রেণি' },
  { id: 'Ten', labelEn: 'Class 10', labelBn: '১০ম শ্রেণি' },
  { id: 'Nine', labelEn: 'Class 9', labelBn: '৯ম শ্রেণি' },
  { id: 'Eight', labelEn: 'Class 8', labelBn: '৮ম শ্রেণি' },
  { id: 'Seven', labelEn: 'Class 7', labelBn: '৭ম শ্রেণি' },
  { id: 'Six', labelEn: 'Class 6', labelBn: '৬ষ্ঠ শ্রেণি' },
]

export default function ToppersManager() {
  const [toppers, setToppers] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedClass, setSelectedClass] = useState('All')
  const [searchQuery, setSearchQuery] = useState('')
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingId, setEditingId] = useState(null)
  const [toastMessage, setToastMessage] = useState(null)
  const [uploadingImage, setUploadingImage] = useState(false)

  const initialForm = {
    name: '',
    nameEn: '',
    className: 'Ten',
    roll: '1',
    gpa: '৫.০০',
    gpaEn: '5.00',
    marks: '৬৮০/৭০০',
    marksEn: '680/700',
    photo: 'https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=400&q=80',
    badge: '১ম স্থান (গোল্ডেন এ+)',
    badgeEn: '1st in Class (Golden A+)',
    quote: 'নিয়মিত অধ্যয়ন এবং শিক্ষকদের সঠিক দিকনির্দেশনাই সাফল্যের মূল চাবিকাঠি।',
    quoteEn: 'Consistent study and guidance from our teachers paved my path to success.',
    year: '2026',
    isActive: true,
  }

  const [formData, setFormData] = useState(initialForm)

  const fetchToppers = async () => {
    setLoading(true)
    try {
      const res = await api.getToppers()
      if (res && res.success && Array.isArray(res.data)) {
        setToppers(res.data)
        localStorage.setItem('mpa_toppers_cache', JSON.stringify(res.data))
      }
    } catch (err) {
      console.warn('Error fetching toppers', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchToppers()
  }, [])

  const showToast = (msg) => {
    setToastMessage(msg)
    setTimeout(() => setToastMessage(null), 3500)
  }

  const handleOpenAdd = () => {
    setEditingId(null)
    setFormData({
      ...initialForm,
      className: selectedClass === 'All' ? 'Ten' : selectedClass,
    })
    setIsModalOpen(true)
  }

  const handleOpenEdit = (t) => {
    setEditingId(t._id || t.id)
    setFormData({
      name: t.name || '',
      nameEn: t.nameEn || '',
      className: t.className || 'Ten',
      roll: String(t.roll || '1'),
      gpa: t.gpa || '৫.০০',
      gpaEn: t.gpaEn || '5.00',
      marks: t.marks || '৬৮০/৭০০',
      marksEn: t.marksEn || '680/700',
      photo: t.photo || '',
      badge: t.badge || 'শীর্ষ স্থান',
      badgeEn: t.badgeEn || 'Top Performer',
      quote: t.quote || '',
      quoteEn: t.quoteEn || '',
      year: t.year || '2026',
      isActive: t.isActive !== false,
    })
    setIsModalOpen(true)
  }

  const handleImageUpload = async (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    setUploadingImage(true)
    try {
      const result = await uploadToImgbb(file)
      if (result && result.success && result.url) {
        setFormData((prev) => ({ ...prev, photo: result.url }))
        showToast('✓ Photo uploaded successfully to ImgBB')
      } else {
        showToast(`⚠ Image upload failed: ${result?.message || 'Unknown error. Please use direct URL.'}`)
      }
    } catch (err) {
      console.error(err)
      showToast('⚠ Image upload error: ' + (err.message || 'Network issue'))
    } finally {
      setUploadingImage(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!formData.name.trim() || !formData.className || !formData.roll) {
      showToast('⚠ Please fill required fields (Name, Class, Roll)')
      return
    }

    try {
      if (editingId) {
        const res = await api.updateTopper(editingId, formData)
        if (res && res.success) {
          showToast(`✓ Topper "${formData.name}" updated successfully!`)
        } else {
          showToast('⚠ Failed to update topper')
        }
      } else {
        const res = await api.createTopper(formData)
        if (res && res.success) {
          showToast(`✓ New Topper "${formData.name}" added successfully!`)
        } else {
          showToast('⚠ Failed to add topper')
        }
      }
      setIsModalOpen(false)
      await fetchToppers()
      window.dispatchEvent(new Event('mpa_toppers_updated'))
    } catch (err) {
      console.error(err)
      showToast('⚠ Network or server error')
    }
  }

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Are you sure you want to remove ${name} from merit board?`)) return
    try {
      const res = await api.deleteTopper(id)
      if (res && res.success) {
        showToast(`✓ Removed ${name} from toppers list`)
        await fetchToppers()
        window.dispatchEvent(new Event('mpa_toppers_updated'))
      } else {
        showToast('⚠ Delete failed')
      }
    } catch (err) {
      console.error(err)
      showToast('⚠ Delete error')
    }
  }

  const handleReset = async () => {
    if (!window.confirm('Reset toppers to official default seed data from MongoDB?')) return
    try {
      const res = await api.resetToppers()
      if (res && res.success) {
        showToast('✓ Reset completed with official toppers seed!')
        await fetchToppers()
        window.dispatchEvent(new Event('mpa_toppers_updated'))
      }
    } catch (err) {
      console.error(err)
      showToast('⚠ Reset error')
    }
  }

  const filteredToppers = toppers.filter((t) => {
    const matchClass = selectedClass === 'All' || (t.className || '').toLowerCase() === selectedClass.toLowerCase()
    const q = searchQuery.toLowerCase().trim()
    const matchSearch =
      !q ||
      (t.name && t.name.toLowerCase().includes(q)) ||
      (t.nameEn && t.nameEn.toLowerCase().includes(q)) ||
      String(t.roll).includes(q)
    return matchClass && matchSearch
  })

  return (
    <div className="space-y-6">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-5 right-5 z-[100] bg-emerald-500/90 text-white px-5 py-3 rounded-xl shadow-2xl backdrop-blur-md border border-emerald-400/30 font-medium text-sm flex items-center gap-2 animate-bounce">
          <CheckCircle2 className="w-5 h-5 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Header Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-[#16161f] p-6 rounded-2xl border border-[#1e1e2e]">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-[#a78bfa] uppercase tracking-wider mb-1">
            <Trophy className="w-4 h-4 text-amber-400" />
            <span>Academic Excellence & Merit Board CMS</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-black text-white flex items-center gap-2">
            Class Toppers Manager <span className="text-xs bg-amber-500/10 text-amber-400 border border-amber-500/20 px-2.5 py-0.5 rounded-full font-bold">Live DB</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Manage top performers for Classes 6 to 10. Updates immediately sync to website Toppers Page & Homepage Honors.
          </p>
        </div>

        <div className="flex items-center gap-2.5 flex-wrap">
          <a
            href="/toppers"
            target="_blank"
            rel="noreferrer"
            className="px-4 py-2 rounded-xl text-xs font-semibold bg-[#1c1c28] text-slate-300 hover:text-white hover:bg-[#252538] border border-[#2a2a3d] transition flex items-center gap-1.5"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            <span>Live Page</span>
          </a>

          <button
            onClick={handleReset}
            title="Reset to default seed data"
            className="px-3.5 py-2 rounded-xl text-xs font-semibold bg-[#1c1c28] text-slate-400 hover:text-amber-400 hover:bg-[#252538] border border-[#2a2a3d] transition flex items-center gap-1.5"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Defaults</span>
          </button>

          <button
            onClick={handleOpenAdd}
            className="px-4 py-2 rounded-xl text-xs font-bold bg-gradient-to-r from-amber-500 to-[#6c63ff] hover:from-amber-400 hover:to-[#5a52e0] text-white shadow-lg shadow-amber-500/20 transition flex items-center gap-1.5"
          >
            <UserPlus className="w-4 h-4" />
            <span>Add Top Performer</span>
          </button>
        </div>
      </div>

      {/* Class Selector Tabs & Search */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
        {/* Class Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
          {CLASSES.map((cls) => {
            const count = cls.id === 'All' ? toppers.length : toppers.filter((t) => (t.className || '').toLowerCase() === cls.id.toLowerCase()).length
            const isSelected = selectedClass === cls.id
            return (
              <button
                key={cls.id}
                onClick={() => setSelectedClass(cls.id)}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 whitespace-nowrap ${
                  isSelected
                    ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
                    : 'bg-[#16161f] text-slate-400 hover:text-white hover:bg-[#1f1f2e] border border-[#1e1e2e]'
                }`}
              >
                <span>{cls.labelEn}</span>
                <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono ${isSelected ? 'bg-black/20 text-slate-950 font-black' : 'bg-white/10 text-slate-300'}`}>
                  {count}
                </span>
              </button>
            )
          })}
        </div>

        {/* Search Input */}
        <div className="relative w-full sm:w-64">
          <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by student name or roll..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-[#16161f] border border-[#1e1e2e] focus:border-amber-500/50 rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder-slate-500 outline-none transition"
          />
        </div>
      </div>

      {/* Grid of Toppers */}
      {loading ? (
        <div className="py-20 text-center">
          <div className="w-10 h-10 border-4 border-amber-500/20 border-t-amber-500 rounded-full animate-spin mx-auto mb-3" />
          <p className="text-xs text-slate-400">Loading merit board from MongoDB...</p>
        </div>
      ) : filteredToppers.length === 0 ? (
        <div className="bg-[#16161f] border border-[#1e1e2e] rounded-2xl p-12 text-center">
          <Trophy className="w-12 h-12 text-slate-600 mx-auto mb-3" />
          <p className="text-sm font-bold text-white">No Toppers Found</p>
          <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
            No top performers matched your filter or search query. Click "Add Top Performer" or "Reset Defaults" to populate.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filteredToppers.map((t, idx) => {
            const isRank1 = t.roll === '1' || t.roll === '০১'
            const isRank2 = t.roll === '2' || t.roll === '০২'
            const isRank3 = t.roll === '3' || t.roll === '০৩'

            return (
              <div
                key={t._id || t.id || idx}
                className="bg-[#16161f] border border-[#1e1e2e] hover:border-amber-500/40 rounded-2xl p-4 transition-all duration-300 flex flex-col justify-between group relative overflow-hidden shadow-lg hover:shadow-amber-500/5"
              >
                {/* Top Corner Rank Accent */}
                {isRank1 && (
                  <div className="absolute top-0 right-0 bg-gradient-to-bl from-amber-500 to-amber-600 text-slate-950 font-black text-[10px] px-3 py-1 rounded-bl-xl shadow flex items-center gap-1">
                    <Crown className="w-3 h-3 fill-current" />
                    <span>1st Rank</span>
                  </div>
                )}
                {isRank2 && (
                  <div className="absolute top-0 right-0 bg-gradient-to-bl from-slate-300 to-slate-400 text-slate-950 font-black text-[10px] px-3 py-1 rounded-bl-xl shadow flex items-center gap-1">
                    <Medal className="w-3 h-3 fill-current" />
                    <span>2nd Rank</span>
                  </div>
                )}
                {isRank3 && (
                  <div className="absolute top-0 right-0 bg-gradient-to-bl from-amber-700 to-amber-800 text-white font-black text-[10px] px-3 py-1 rounded-bl-xl shadow flex items-center gap-1">
                    <Medal className="w-3 h-3 fill-current" />
                    <span>3rd Rank</span>
                  </div>
                )}

                <div>
                  {/* Photo & Identity */}
                  <div className="flex items-center gap-3.5 mb-3.5">
                    <div className="relative">
                      <img
                        src={t.photo || 'https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=400&q=80'}
                        alt={t.name}
                        className="w-14 h-14 rounded-2xl object-cover border-2 border-[#2a2a3d] group-hover:border-amber-500/50 transition shadow"
                        onError={(e) => {
                          e.target.src = 'https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=400&q=80'
                        }}
                      />
                      <div className="absolute -bottom-1 -right-1 bg-[#1c1c28] border border-[#2a2a3d] text-amber-400 font-mono font-bold text-[9px] px-1.5 rounded-full shadow">
                        #{t.roll}
                      </div>
                    </div>

                    <div className="min-w-0 flex-1">
                      <h3 className="text-sm font-bold text-white truncate group-hover:text-amber-400 transition">
                        {t.name}
                      </h3>
                      {t.nameEn && <p className="text-[11px] text-slate-400 truncate font-medium">{t.nameEn}</p>}
                      <div className="flex items-center gap-1.5 mt-1">
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-[#6c63ff]/15 text-[#a78bfa] border border-[#6c63ff]/20">
                          Class {t.className}
                        </span>
                        <span className="text-[10px] font-mono text-slate-400">Roll {t.roll}</span>
                      </div>
                    </div>
                  </div>

                  {/* Badges & Scores */}
                  <div className="space-y-2 bg-[#12121a] p-3 rounded-xl border border-[#1a1a26] mb-3">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-slate-400 flex items-center gap-1">
                        <Sparkles className="w-3.5 h-3.5 text-amber-400" /> GPA
                      </span>
                      <span className="font-mono font-bold text-amber-400">{t.gpaEn || t.gpa || '5.00'}</span>
                    </div>
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-slate-400">Total Marks</span>
                      <span className="font-mono font-medium text-slate-200">{t.marksEn || t.marks || '—'}</span>
                    </div>
                    <div className="pt-1.5 border-t border-[#1e1e2e]">
                      <span className="text-[10px] font-medium text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-md block truncate">
                        {t.badge || t.badgeEn || 'Class Topper'}
                      </span>
                    </div>
                  </div>

                  {/* Quote if any */}
                  {t.quote && (
                    <p className="text-[11px] text-slate-400 italic line-clamp-2 mb-3 bg-[#161622] p-2 rounded-lg border border-[#202030]">
                      "{t.quote}"
                    </p>
                  )}
                </div>

                {/* Card Actions */}
                <div className="pt-3 border-t border-[#1e1e2e] flex items-center justify-between">
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${t.isActive !== false ? 'bg-emerald-500/10 text-emerald-400' : 'bg-slate-500/10 text-slate-400'}`}>
                    {t.isActive !== false ? 'Active' : 'Inactive'}
                  </span>

                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => handleOpenEdit(t)}
                      className="p-1.5 rounded-lg bg-[#1c1c28] hover:bg-[#252538] text-slate-300 hover:text-white transition"
                      title="Edit topper"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleDelete(t._id || t.id, t.name)}
                      className="p-1.5 rounded-lg bg-[#1c1c28] hover:bg-rose-500/20 text-slate-400 hover:text-rose-400 transition"
                      title="Delete topper"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}

      {/* Add / Edit Topper Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto">
          <div className="bg-[#16161f] border border-[#2a2a3d] rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto moom-scrollbar shadow-2xl p-6 relative">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-5 right-5 text-slate-400 hover:text-white p-1 rounded-lg bg-[#1c1c28] hover:bg-[#252538] transition"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2 mb-6">
              <Trophy className="w-6 h-6 text-amber-400" />
              <h2 className="text-lg font-bold text-white">
                {editingId ? 'Edit Merit Board Performer' : 'Add Top Performer to Merit Board'}
              </h2>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              {/* Row 1: Names */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">
                    Student Name (বাংলা) <span className="text-rose-400">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="যেমন: তানভীর আহমেদ"
                    className="w-full bg-[#12121a] border border-[#202030] focus:border-amber-500/50 rounded-xl px-3 py-2.5 text-white placeholder-slate-600 outline-none transition"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Student Name (English)</label>
                  <input
                    type="text"
                    value={formData.nameEn}
                    onChange={(e) => setFormData({ ...formData, nameEn: e.target.value })}
                    placeholder="e.g. Tanvir Ahmed"
                    className="w-full bg-[#12121a] border border-[#202030] focus:border-amber-500/50 rounded-xl px-3 py-2.5 text-white placeholder-slate-600 outline-none transition"
                  />
                </div>
              </div>

              {/* Row 2: Class, Roll, Year */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">
                    Class <span className="text-rose-400">*</span>
                  </label>
                  <select
                    value={formData.className}
                    onChange={(e) => setFormData({ ...formData, className: e.target.value })}
                    className="w-full bg-[#12121a] border border-[#202030] focus:border-amber-500/50 rounded-xl px-3 py-2.5 text-white outline-none transition"
                  >
                    <option value="Ten">Class 10 (দশম)</option>
                    <option value="Nine">Class 9 (নবম)</option>
                    <option value="Eight">Class 8 (অষ্টম)</option>
                    <option value="Seven">Class 7 (সপ্তম)</option>
                    <option value="Six">Class 6 (ষষ্ঠ)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">
                    Roll Number <span className="text-rose-400">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.roll}
                    onChange={(e) => setFormData({ ...formData, roll: e.target.value })}
                    placeholder="e.g. 1"
                    className="w-full bg-[#12121a] border border-[#202030] focus:border-amber-500/50 rounded-xl px-3 py-2.5 text-white outline-none transition font-mono"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Academic Year</label>
                  <input
                    type="text"
                    value={formData.year}
                    onChange={(e) => setFormData({ ...formData, year: e.target.value })}
                    placeholder="2026"
                    className="w-full bg-[#12121a] border border-[#202030] focus:border-amber-500/50 rounded-xl px-3 py-2.5 text-white outline-none transition font-mono"
                  />
                </div>
              </div>

              {/* Row 3: GPA & Marks */}
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">GPA (English)</label>
                  <input
                    type="text"
                    value={formData.gpaEn}
                    onChange={(e) => setFormData({ ...formData, gpaEn: e.target.value })}
                    placeholder="5.00"
                    className="w-full bg-[#12121a] border border-[#202030] focus:border-amber-500/50 rounded-xl px-3 py-2.5 text-white outline-none transition font-mono"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">GPA (বাংলা)</label>
                  <input
                    type="text"
                    value={formData.gpa}
                    onChange={(e) => setFormData({ ...formData, gpa: e.target.value })}
                    placeholder="৫.০০"
                    className="w-full bg-[#12121a] border border-[#202030] focus:border-amber-500/50 rounded-xl px-3 py-2.5 text-white outline-none transition font-mono"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Total Marks (En)</label>
                  <input
                    type="text"
                    value={formData.marksEn}
                    onChange={(e) => setFormData({ ...formData, marksEn: e.target.value })}
                    placeholder="680/700"
                    className="w-full bg-[#12121a] border border-[#202030] focus:border-amber-500/50 rounded-xl px-3 py-2.5 text-white outline-none transition font-mono"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Total Marks (Bn)</label>
                  <input
                    type="text"
                    value={formData.marks}
                    onChange={(e) => setFormData({ ...formData, marks: e.target.value })}
                    placeholder="৬৮০/৭০০"
                    className="w-full bg-[#12121a] border border-[#202030] focus:border-amber-500/50 rounded-xl px-3 py-2.5 text-white outline-none transition font-mono"
                  />
                </div>
              </div>

              {/* Row 4: Badge Title (Bn & En) */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Achievement Badge (বাংলা)</label>
                  <input
                    type="text"
                    value={formData.badge}
                    onChange={(e) => setFormData({ ...formData, badge: e.target.value })}
                    placeholder="যেমন: ১ম স্থান (গোল্ডেন এ+)"
                    className="w-full bg-[#12121a] border border-[#202030] focus:border-amber-500/50 rounded-xl px-3 py-2.5 text-white outline-none transition"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Achievement Badge (English)</label>
                  <input
                    type="text"
                    value={formData.badgeEn}
                    onChange={(e) => setFormData({ ...formData, badgeEn: e.target.value })}
                    placeholder="e.g. 1st in Class (Golden A+)"
                    className="w-full bg-[#12121a] border border-[#202030] focus:border-amber-500/50 rounded-xl px-3 py-2.5 text-white outline-none transition"
                  />
                </div>
              </div>

              {/* Row 5: Photo and ImgBB Uploader */}
              <div>
                <label className="block text-slate-300 font-semibold mb-1">Student Photo</label>
                <div className="flex flex-col sm:flex-row gap-3 items-center">
                  <div className="relative w-14 h-14 shrink-0 rounded-xl overflow-hidden border border-[#2a2a3d] bg-black">
                    <img
                      src={formData.photo || 'https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=400&q=80'}
                      alt="Preview"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <input
                    type="text"
                    value={formData.photo}
                    onChange={(e) => setFormData({ ...formData, photo: e.target.value })}
                    placeholder="https://... or upload below"
                    className="flex-1 w-full bg-[#12121a] border border-[#202030] focus:border-amber-500/50 rounded-xl px-3 py-2 text-white outline-none transition text-xs"
                  />
                  <label className="cursor-pointer px-3.5 py-2 rounded-xl bg-[#1c1c28] hover:bg-[#26263a] text-slate-300 hover:text-white border border-[#2a2a3d] font-semibold flex items-center gap-1.5 shrink-0 transition">
                    <UploadCloud className="w-4 h-4 text-[#a78bfa]" />
                    <span>{uploadingImage ? 'Uploading...' : 'Upload Photo'}</span>
                    <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} disabled={uploadingImage} />
                  </label>
                </div>
              </div>

              {/* Row 6: Quotes */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Success Quote / Advice (বাংলা)</label>
                  <textarea
                    rows={2}
                    value={formData.quote}
                    onChange={(e) => setFormData({ ...formData, quote: e.target.value })}
                    placeholder="শিক্ষার্থীদের উদ্দেশ্যে সাফল্যের পরামর্শ..."
                    className="w-full bg-[#12121a] border border-[#202030] focus:border-amber-500/50 rounded-xl px-3 py-2 text-white outline-none transition text-xs"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Success Quote / Advice (English)</label>
                  <textarea
                    rows={2}
                    value={formData.quoteEn}
                    onChange={(e) => setFormData({ ...formData, quoteEn: e.target.value })}
                    placeholder="Advice or motivational quote for juniors..."
                    className="w-full bg-[#12121a] border border-[#202030] focus:border-amber-500/50 rounded-xl px-3 py-2 text-white outline-none transition text-xs"
                  />
                </div>
              </div>

              {/* Active Toggle */}
              <div className="flex items-center gap-2 pt-2">
                <input
                  type="checkbox"
                  id="isActive"
                  checked={formData.isActive}
                  onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                  className="rounded border-[#2a2a3d] text-amber-500 focus:ring-0 w-4 h-4 cursor-pointer"
                />
                <label htmlFor="isActive" className="text-slate-300 font-medium cursor-pointer">
                  Display this student on public merit board
                </label>
              </div>

              {/* Submit Buttons */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#1e1e2e]">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-[#1c1c28] text-slate-300 hover:text-white border border-[#2a2a3d] font-semibold transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-[#6c63ff] hover:from-amber-400 hover:to-[#5a52e0] text-white font-bold shadow-lg shadow-amber-500/20 transition flex items-center gap-1.5"
                >
                  <Trophy className="w-4 h-4" />
                  <span>{editingId ? 'Save Changes' : 'Publish Topper'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
