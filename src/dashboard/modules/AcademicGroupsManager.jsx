import { useState, useEffect } from 'react'
import {
  GraduationCap,
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
  Layers,
  BookOpen,
  X,
  Check,
  Tag,
  Link as LinkIcon,
  Palette,
  Compass,
} from 'lucide-react'
import api from '../../lib/api'
import AcademicDeleteAlert from '../components/AcademicDeleteAlert'

// Preset styling options for academic groups
const COLOR_PRESETS = [
  {
    name: 'Cyan (Science)',
    border: 'border-cyan-500/30',
    color: 'from-blue-500/20 to-cyan-500/20',
    bgBadge: 'bg-cyan-50 text-cyan-700 border-cyan-200',
    dot: 'bg-cyan-500',
  },
  {
    name: 'Amber (Business/Commerce)',
    border: 'border-amber-500/30',
    color: 'from-amber-500/20 to-orange-500/20',
    bgBadge: 'bg-amber-50 text-amber-700 border-amber-200',
    dot: 'bg-amber-500',
  },
  {
    name: 'Emerald (Humanities/Arts)',
    border: 'border-emerald-500/30',
    color: 'from-emerald-500/20 to-teal-500/20',
    bgBadge: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    dot: 'bg-emerald-500',
  },
  {
    name: 'Purple (Junior/Foundation)',
    border: 'border-purple-500/30',
    color: 'from-purple-500/20 to-pink-500/20',
    bgBadge: 'bg-purple-50 text-purple-700 border-purple-200',
    dot: 'bg-purple-500',
  },
  {
    name: 'Indigo (Technology/IT)',
    border: 'border-indigo-500/30',
    color: 'from-indigo-500/20 to-violet-500/20',
    bgBadge: 'bg-indigo-50 text-indigo-700 border-indigo-200',
    dot: 'bg-indigo-500',
  },
  {
    name: 'Rose (Special / Honors)',
    border: 'border-rose-500/30',
    color: 'from-rose-500/20 to-pink-500/20',
    bgBadge: 'bg-rose-50 text-rose-700 border-rose-200',
    dot: 'bg-rose-500',
  },
]

const EMOJI_PRESETS = ['🔬', '📊', '📜', '📚', '💻', '🎨', '⚙️', '🧬', '📐', '🌍', '🏅', '📘']

const INITIAL_DATA = {
  isActive: true,
  tag: 'General Secondary Curriculum (Classes 6 to 10)',
  tagBn: 'সাধারণ মাধ্যমিক শিক্ষাক্রম (৬ষ্ঠ হতে ১০ম)',
  title: 'Academic Groups & Disciplines',
  titleBn: 'একাডেমিক বিভাগ ও পাঠ্য বিষয়সমূহ',
  subtitle:
    'Our secondary curriculum prepares general students comprehensively for the Secondary School Certificate (SSC) board examinations.',
  subtitleBn:
    'জাতীয় শিক্ষাক্রম পাঠ্যপুস্তক বোর্ড অনুমোদিত সাধারণ মাধ্যমিক শিক্ষাক্রম (এসএসসি) অনুযায়ী পাঠদান নিশ্চিত করে প্রতিটি শিক্ষার্থীর মেধা বিকাশ।',
  keySubjectsLabel: 'Key Subjects',
  keySubjectsLabelBn: 'মূল বিষয়সমূহ',
  pathwayLabel: 'Career Pathway:',
  pathwayLabelBn: 'ভবিষ্যৎ ক্যারিয়ার:',
  groups: [
    {
      id: 'group-science',
      icon: '🔬',
      name: 'Science Group (বিজ্ঞান বিভাগ)',
      nameBn: 'বিজ্ঞান বিভাগ',
      desc: 'Rigorous national curriculum in Physics, Chemistry, Biology, and Higher Mathematics supported by daily hands-on laboratory sessions. Ideal for future doctors, engineers, and scientists.',
      descBn: 'পদার্থবিজ্ঞান, রসায়ন, জীববিজ্ঞান এবং উচ্চতর গণিতের গভীর পাঠ ও নিয়মিত ব্যবহারিক ল্যাব ক্লাস। ভবিষ্যৎ প্রকৌশলী, চিকিৎসক ও বিজ্ঞানী গড়ার আদর্শ বিভাগ।',
      subjects: ['Physics', 'Chemistry', 'Biology', 'Higher Math', 'General Math', 'ICT'],
      subjectsBn: ['পদার্থবিজ্ঞান', 'রসায়ন', 'জীববিজ্ঞান', 'উচ্চতর গণিত', 'সাধারণ গণিত', 'আইসিটি'],
      pathway: 'HSC Science, Medical (MBBS), Engineering (BUET), Technology & Research',
      pathwayBn: 'উচ্চ মাধ্যমিক (বিজ্ঞান), মেডিকেল (MBBS), বুয়েট/প্রকৌশল বিশ্ববিদ্যালয় ও বৈজ্ঞানিক গবেষণা',
      border: 'border-cyan-500/30',
      color: 'from-blue-500/20 to-cyan-500/20',
      buttonText: 'Curriculum Details',
      buttonTextBn: 'পাঠ্যক্রমের বিবরণ',
      buttonLink: '/academics',
      badge: 'Popular',
      badgeBn: 'জনপ্রিয়',
      order: 1,
      isActive: true,
    },
    {
      id: 'group-commerce',
      icon: '📊',
      name: 'Business Studies (ব্যবসায় শিক্ষা)',
      nameBn: 'ব্যবসায় শিক্ষা বিভাগ',
      desc: 'Accounting, Business Entrepreneurship, and Finance & Banking. Developing analytical thinking, commercial acumen, financial management, and leadership skills.',
      descBn: 'হিসাববিজ্ঞান, ব্যবসায় উদ্যোগ এবং ফিন্যান্স ও ব্যাংকিং। শিক্ষার্থীদের ব্যবসায়িক দূরদর্শিতা, আর্থিক হিসাব ও ব্যবস্থাপনা দক্ষতা বৃদ্ধি করে।',
      subjects: ['Accounting', 'Business Ent.', 'Finance & Banking', 'General Science', 'General Math'],
      subjectsBn: ['হিসাববিজ্ঞান', 'ব্যবসায় উদ্যোগ', 'ফিন্যান্স ও ব্যাংকিং', 'সাধারণ বিজ্ঞান', 'গণিত'],
      pathway: 'HSC Commerce, BBA/MBA (IBA), Chartered Accountancy (CA), Corporate Finance',
      pathwayBn: 'উচ্চ মাধ্যমিক (ব্যবসায় শিক্ষা), বিবিএ (IBA/DU), চার্টার্ড একাউন্টেন্সি (CA) ও করপোরেট ব্যবস্থাপনা',
      border: 'border-amber-500/30',
      color: 'from-amber-500/20 to-orange-500/20',
      buttonText: 'Curriculum Details',
      buttonTextBn: 'পাঠ্যক্রমের বিবরণ',
      buttonLink: '/academics',
      badge: 'Commerce',
      badgeBn: 'বাণিজ্য',
      order: 2,
      isActive: true,
    },
    {
      id: 'group-humanities',
      icon: '📜',
      name: 'Humanities (মানবিক বিভাগ)',
      nameBn: 'মানবিক বিভাগ',
      desc: 'History, Geography & Environment, Civics, Economics, and Social Science. Cultivating social responsibility, ethical leadership, legal insight, and public policy understanding.',
      descBn: 'বাংলাদেশ ও বিশ্বসভ্যতার ইতিহাস, ভূগোল ও পরিবেশ, পৌরনীতি ও নাগরিকতা এবং অর্থনীতি। সামাজিক সচেতনতা, আইন ও প্রশাসনিক দক্ষতা গড়ে তোলে।',
      subjects: ['History & Civ.', 'Geography', 'Civics & Citizen.', 'Economics', 'General Science'],
      subjectsBn: ['ইতিহাস ও বিশ্বসভ্যতা', 'ভূগোল ও পরিবেশ', 'পৌরনীতি ও নাগরিকতা', 'অর্থনীতি', 'আইসিটি'],
      pathway: 'HSC Humanities, Law (LLB), Civil Services (BCS), Journalism & Public Policy',
      pathwayBn: 'উচ্চ মাধ্যমিক (মানবিক), আইন (LLB), বিসিএস/প্রশাসনিক ক্যাডার, সাংবাদিকতা ও আন্তর্জাতিক সম্পর্ক',
      border: 'border-emerald-500/30',
      color: 'from-emerald-500/20 to-teal-500/20',
      buttonText: 'Curriculum Details',
      buttonTextBn: 'পাঠ্যক্রমের বিবরণ',
      buttonLink: '/academics',
      badge: 'Arts',
      badgeBn: 'মানবিক',
      order: 3,
      isActive: true,
    },
    {
      id: 'group-junior',
      icon: '📚',
      name: 'Junior Section (৬ষ্ঠ - ৮ম শ্রেণি)',
      nameBn: 'জুনিয়র সেকশন (৬ষ্ঠ - ৮ম শ্রেণি)',
      desc: 'Bangla grammar, conversational English, general mathematics, integrated science, and ICT. Establishing a strong intellectual and moral foundation for secondary education.',
      descBn: 'বাংলা ব্যাকরণ ও সাহিত্য, ইংরেজি কথোপকথন, সাধারণ গণিত, সমন্বিত বিজ্ঞান এবং তথ্য ও যোগাযোগ প্রযুক্তির মজবুত ভিত্তি।',
      subjects: ['Bangla', 'English', 'Mathematics', 'General Science', 'BGS', 'Religion'],
      subjectsBn: ['বাংলা (১ম ও ২য়)', 'ইংরেজি গ্রামার', 'গণিত', 'সাধারণ বিজ্ঞান', 'বিজিএস', 'ধর্ম'],
      pathway: 'High grade foundation for SSC Science, Commerce or Humanities stream entry',
      pathwayBn: '৯ম শ্রেণিতে বিজ্ঞান, বাণিজ্য বা মানবিক বিভাগে উত্তীর্ণ হওয়ার দৃঢ় একাডেমিক ভিত্তি',
      border: 'border-purple-500/30',
      color: 'from-purple-500/20 to-pink-500/20',
      buttonText: 'Curriculum Details',
      buttonTextBn: 'পাঠ্যক্রমের বিবরণ',
      buttonLink: '/academics',
      badge: 'Foundation',
      badgeBn: 'ভিত্তি',
      order: 4,
      isActive: true,
    },
  ],
}

export default function AcademicGroupsManager() {
  const [data, setData] = useState(INITIAL_DATA)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [toast, setToast] = useState(null)
  const [previewLang, setPreviewLang] = useState('bn')
  const [activeTab, setActiveTab] = useState('groups') // 'groups' | 'headers' | 'preview'

  // Modal State for Add / Edit
  const [modalOpen, setModalOpen] = useState(false)
  const [editingGroup, setEditingGroup] = useState(null)
  const [newSubEn, setNewSubEn] = useState('')
  const [newSubBn, setNewSubBn] = useState('')

  // Delete Alert State (Custom Modal from Slider Page)
  const [groupToDelete, setGroupToDelete] = useState(null)
  const [deletingGroup, setDeletingGroup] = useState(false)

  const showToast = (message, type = 'success') => {
    setToast({ message, type })
    setTimeout(() => setToast(null), 4000)
  }

  // Load from Backend or Cached LocalStorage
  const loadData = async () => {
    setLoading(true)
    try {
      const cached = localStorage.getItem('mpa_academic_groups_section')
      if (cached) {
        try {
          setData(JSON.parse(cached))
        } catch (_) {}
      }

      const res = await api.getAcademicGroups()
      if (res?.success && res.data) {
        setData(res.data)
        localStorage.setItem('mpa_academic_groups_section', JSON.stringify(res.data))
      }
    } catch (err) {
      console.warn('Could not load academic groups data from API, using fallback:', err)
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
      const res = await api.updateAcademicGroups(updatedData)
      if (res?.success && res.data) {
        setData(res.data)
        localStorage.setItem('mpa_academic_groups_section', JSON.stringify(res.data))
        window.dispatchEvent(new Event('mpa_academic_groups_updated'))
        showToast('Academic Groups & Disciplines updated successfully! 🎉')
      } else {
        localStorage.setItem('mpa_academic_groups_section', JSON.stringify(updatedData))
        setData(updatedData)
        window.dispatchEvent(new Event('mpa_academic_groups_updated'))
        showToast('Updated and saved locally!')
      }
    } catch (err) {
      console.error('Save failed:', err)
      localStorage.setItem('mpa_academic_groups_section', JSON.stringify(updatedData))
      setData(updatedData)
      window.dispatchEvent(new Event('mpa_academic_groups_updated'))
      showToast('Saved to local storage!', 'info')
    } finally {
      setSaving(false)
    }
  }

  // Reset to school defaults
  const handleReset = async () => {
    if (!window.confirm('Reset all Academic Groups & Disciplines section data to school defaults?')) return
    setSaving(true)
    try {
      const res = await api.resetAcademicGroups()
      if (res?.success && res.data) {
        setData(res.data)
        localStorage.setItem('mpa_academic_groups_section', JSON.stringify(res.data))
        window.dispatchEvent(new Event('mpa_academic_groups_updated'))
        showToast('Section reset to defaults successfully! ✨')
      } else {
        setData(INITIAL_DATA)
        localStorage.setItem('mpa_academic_groups_section', JSON.stringify(INITIAL_DATA))
        window.dispatchEvent(new Event('mpa_academic_groups_updated'))
        showToast('Reset to default values!')
      }
    } catch (err) {
      setData(INITIAL_DATA)
      localStorage.setItem('mpa_academic_groups_section', JSON.stringify(INITIAL_DATA))
      window.dispatchEvent(new Event('mpa_academic_groups_updated'))
      showToast('Reset completed!', 'info')
    } finally {
      setSaving(false)
    }
  }

  // Reorder Groups
  const moveGroup = (index, direction) => {
    const targetIndex = index + direction
    if (targetIndex < 0 || targetIndex >= data.groups.length) return
    const updated = [...data.groups]
    const temp = updated[index]
    updated[index] = updated[targetIndex]
    updated[targetIndex] = temp
    const nextData = { ...data, groups: updated }
    setData(nextData)
    handleSave(nextData)
  }

  // Delete Group - open custom alert modal (same as slider page)
  const handleDeleteGroup = (group) => {
    setGroupToDelete(group)
  }

  // Confirm and execute delete from custom alert modal
  const handleConfirmDelete = async () => {
    if (!groupToDelete) return
    const id = groupToDelete.id || groupToDelete._id
    setDeletingGroup(true)
    try {
      if (id && !String(id).startsWith('group-default-')) {
        await api.deleteAcademicGroupItem(id).catch(() => {})
      }
      const updated = data.groups.filter((g) => g.id !== id && g._id !== id)
      const nextData = { ...data, groups: updated }
      setData(nextData)
      await handleSave(nextData)
      showToast(`Academic group "${groupToDelete.name || groupToDelete.nameBn || 'Group'}" deleted successfully! 🗑️`)
      setGroupToDelete(null)
    } catch (err) {
      console.error(err)
      showToast('Error deleting academic group', 'error')
    } finally {
      setDeletingGroup(false)
    }
  }

  // Toggle active status of a group
  const toggleGroupActive = (id) => {
    const updated = data.groups.map((g) => {
      if (g.id === id || g._id === id) {
        return { ...g, isActive: g.isActive === false }
      }
      return g
    })
    const nextData = { ...data, groups: updated }
    setData(nextData)
    handleSave(nextData)
  }

  // Open Modal for New Group
  const openAddModal = () => {
    setEditingGroup({
      id: `group-${Date.now()}`,
      icon: '📘',
      name: '',
      nameBn: '',
      desc: '',
      descBn: '',
      subjects: [],
      subjectsBn: [],
      pathway: '',
      pathwayBn: '',
      border: 'border-cyan-500/30',
      color: 'from-blue-500/20 to-cyan-500/20',
      buttonText: 'Curriculum Details',
      buttonTextBn: 'পাঠ্যক্রমের বিবরণ',
      buttonLink: '/academics',
      badge: '',
      badgeBn: '',
      isActive: true,
    })
    setNewSubEn('')
    setNewSubBn('')
    setModalOpen(true)
  }

  // Open Modal for Edit
  const openEditModal = (group) => {
    setEditingGroup(JSON.parse(JSON.stringify(group)))
    setNewSubEn('')
    setNewSubBn('')
    setModalOpen(true)
  }

  // Save Modal Group
  const handleSaveModalGroup = (e) => {
    e.preventDefault()
    if (!editingGroup.name && !editingGroup.nameBn) {
      alert('Please enter at least an English or Bengali group name!')
      return
    }

    let updatedGroups
    const exists = data.groups.some(
      (g) => (editingGroup.id && g.id === editingGroup.id) || (editingGroup._id && g._id === editingGroup._id)
    )

    if (exists) {
      updatedGroups = data.groups.map((g) =>
        (editingGroup.id && g.id === editingGroup.id) || (editingGroup._id && g._id === editingGroup._id)
          ? editingGroup
          : g
      )
    } else {
      updatedGroups = [...data.groups, editingGroup]
    }

    const nextData = { ...data, groups: updatedGroups }
    setData(nextData)
    setModalOpen(false)
    setEditingGroup(null)
    handleSave(nextData)
    showToast('Academic group saved successfully! 🎉')
  }

  // Add subject tag helper
  const addSubjectEn = () => {
    if (!newSubEn.trim()) return
    setEditingGroup({
      ...editingGroup,
      subjects: [...(editingGroup.subjects || []), newSubEn.trim()],
    })
    setNewSubEn('')
  }

  const removeSubjectEn = (index) => {
    setEditingGroup({
      ...editingGroup,
      subjects: (editingGroup.subjects || []).filter((_, i) => i !== index),
    })
  }

  const addSubjectBn = () => {
    if (!newSubBn.trim()) return
    setEditingGroup({
      ...editingGroup,
      subjectsBn: [...(editingGroup.subjectsBn || []), newSubBn.trim()],
    })
    setNewSubBn('')
  }

  const removeSubjectBn = (index) => {
    setEditingGroup({
      ...editingGroup,
      subjectsBn: (editingGroup.subjectsBn || []).filter((_, i) => i !== index),
    })
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin" />
          <span className="text-sm font-bold text-slate-400">Loading Academic Groups Section...</span>
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

      {/* World-Class Custom Academic Group Delete Confirmation Alert (from Slider Page) */}
      {groupToDelete && (
        <AcademicDeleteAlert
          group={groupToDelete}
          deleting={deletingGroup}
          onConfirm={handleConfirmDelete}
          onCancel={() => {
            if (!deletingGroup) setGroupToDelete(null)
          }}
        />
      )}

      {/* Top Header Card */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 relative z-10">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
              <GraduationCap className="w-3.5 h-3.5" />
              <span>Website CMS · Academic Groups & Disciplines</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Academic Groups & Disciplines
            </h1>
            <p className="text-sm text-slate-300 max-w-2xl leading-relaxed">
              Create, edit, and organize all academic groups (Science, Business Studies, Humanities, Junior Section, etc.) 
              with full word-to-word bilingual editing for headings, subjects, badges, pathways, and button actions.
            </p>
          </div>

          {/* Quick Actions */}
          <div className="flex flex-wrap items-center gap-3">
            <a
              href="/#academics"
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
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-white font-bold text-xs inline-flex items-center gap-2 shadow-lg shadow-emerald-500/20 transition cursor-pointer disabled:opacity-50"
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
                className="w-4 h-4 rounded text-emerald-500 focus:ring-emerald-400 cursor-pointer"
              />
              <span className="text-xs font-bold text-slate-300">
                {data.isActive !== false ? 'Section is Active (Visible on Homepage)' : 'Section is Hidden'}
              </span>
            </label>
            <span className="text-xs px-2.5 py-1 rounded-full bg-slate-800 border border-slate-700 text-slate-400">
              {data.groups?.length || 0} Groups Configured
            </span>
          </div>

          {/* Preview Language Switcher */}
          <div className="flex items-center gap-2 bg-slate-800/80 p-1 rounded-xl border border-slate-700">
            <span className="text-[11px] font-bold text-slate-400 px-2">Preview In:</span>
            <button
              onClick={() => setPreviewLang('bn')}
              className={`px-3 py-1 rounded-lg text-xs font-bold transition cursor-pointer ${
                previewLang === 'bn'
                  ? 'bg-emerald-500 text-white shadow'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              বাংলা (BN)
            </button>
            <button
              onClick={() => setPreviewLang('en')}
              className={`px-3 py-1 rounded-lg text-xs font-bold transition cursor-pointer ${
                previewLang === 'en'
                  ? 'bg-emerald-500 text-white shadow'
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
          onClick={() => setActiveTab('groups')}
          className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 transition cursor-pointer ${
            activeTab === 'groups'
              ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/20'
              : 'text-slate-400 hover:text-white hover:bg-slate-800'
          }`}
        >
          <Layers className="w-4 h-4" />
          <span>Academic Groups Cards ({data.groups?.length || 0})</span>
        </button>

        <button
          onClick={() => setActiveTab('headers')}
          className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 transition cursor-pointer ${
            activeTab === 'headers'
              ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/20'
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
              ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/20'
              : 'text-slate-400 hover:text-white hover:bg-slate-800'
          }`}
        >
          <Eye className="w-4 h-4" />
          <span>Live Homepage Simulation</span>
        </button>
      </div>

      {/* ── TAB 1: ACADEMIC GROUPS CARDS ── */}
      {activeTab === 'groups' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-slate-900/60 p-5 rounded-2xl border border-slate-800">
            <div>
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <span>Manage Academic Groups</span>
                <span className="text-xs px-2 py-0.5 rounded-md bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                  {data.groups.length} Cards
                </span>
              </h2>
              <p className="text-xs text-slate-400 mt-1">
                Drag or reorder groups, edit subject tags, career pathways, colors, and links.
              </p>
            </div>
            <button
              onClick={openAddModal}
              className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs inline-flex items-center gap-2 shadow-lg shadow-indigo-600/25 transition cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Create New Academic Group</span>
            </button>
          </div>

          {/* Cards Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-2 gap-5">
            {data.groups?.map((group, index) => (
              <div
                key={group.id || group._id || index}
                className={`bg-slate-900/90 rounded-2xl border transition-all p-5 flex flex-col justify-between ${
                  group.isActive === false
                    ? 'border-slate-800 opacity-60'
                    : 'border-slate-800 hover:border-indigo-500/50 shadow-xl'
                }`}
              >
                <div>
                  {/* Card Header */}
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div className="flex items-center gap-3">
                      <span className="text-3xl p-2.5 rounded-2xl bg-slate-800 border border-slate-700/80 shadow-inner">
                        {group.icon || '📘'}
                      </span>
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="font-extrabold text-base text-white">
                            {previewLang === 'bn' ? group.nameBn || group.name : group.name || group.nameBn}
                          </h3>
                          {group.isActive === false && (
                            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-800 text-slate-400 border border-slate-700">
                              Inactive
                            </span>
                          )}
                        </div>
                        <p className="text-[11px] text-slate-400">
                          {previewLang === 'bn' ? group.name : group.nameBn}
                        </p>
                      </div>
                    </div>

                    {/* Reorder / Status Controls */}
                    <div className="flex items-center gap-1 bg-slate-800/80 p-1 rounded-xl border border-slate-700">
                      <button
                        onClick={() => moveGroup(index, -1)}
                        disabled={index === 0}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-700 disabled:opacity-20 cursor-pointer"
                        title="Move Up / Left"
                      >
                        <ArrowUp className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => moveGroup(index, 1)}
                        disabled={index === data.groups.length - 1}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-700 disabled:opacity-20 cursor-pointer"
                        title="Move Down / Right"
                      >
                        <ArrowDown className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  {/* Description */}
                  <p className="text-xs text-slate-300 leading-relaxed mb-4 line-clamp-3">
                    {previewLang === 'bn' ? group.descBn || group.desc : group.desc || group.descBn}
                  </p>

                  {/* Subjects Chips */}
                  <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800/80 mb-3">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-2">
                      {previewLang === 'bn'
                        ? data.keySubjectsLabelBn || 'মূল বিষয়সমূহ'
                        : data.keySubjectsLabel || 'Key Subjects'}
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {(previewLang === 'bn'
                        ? group.subjectsBn?.length
                          ? group.subjectsBn
                          : group.subjects
                        : group.subjects?.length
                        ? group.subjects
                        : group.subjectsBn
                      )?.map((sub, sIdx) => (
                        <span
                          key={sIdx}
                          className="text-[11px] font-medium px-2 py-0.5 rounded-md bg-slate-800 text-slate-200 border border-slate-700"
                        >
                          {sub}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Career Pathway */}
                  <div className="text-[11px] text-indigo-300/90 font-medium p-2.5 rounded-xl bg-indigo-950/30 border border-indigo-900/40 mb-3">
                    <strong className="text-indigo-200">
                      {previewLang === 'bn'
                        ? data.pathwayLabelBn || 'ভবিষ্যৎ ক্যারিয়ার:'
                        : data.pathwayLabel || 'Career Pathway:'}{' '}
                    </strong>
                    {previewLang === 'bn' ? group.pathwayBn || group.pathway : group.pathway || group.pathwayBn}
                  </div>
                </div>

                {/* Footer Buttons */}
                <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between gap-3 mt-2">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => toggleGroupActive(group.id || group._id)}
                      className={`text-[11px] font-bold px-2.5 py-1 rounded-lg border transition cursor-pointer ${
                        group.isActive !== false
                          ? 'bg-emerald-500/10 text-emerald-300 border-emerald-500/30'
                          : 'bg-slate-800 text-slate-400 border-slate-700'
                      }`}
                    >
                      {group.isActive !== false ? '● Visible' : '○ Hidden'}
                    </button>
                    <span className="text-[10px] text-slate-500 font-mono">
                      {group.border}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => openEditModal(group)}
                      className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold inline-flex items-center gap-1.5 transition cursor-pointer border border-slate-700"
                    >
                      <Edit3 className="w-3.5 h-3.5 text-indigo-400" />
                      <span>Edit</span>
                    </button>

                    <button
                      onClick={() => handleDeleteGroup(group)}
                      className="p-1.5 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/30 transition cursor-pointer"
                      title="Delete Group"
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
                <Tag className="w-4 h-4 text-indigo-400" />
                <span>Word to Word Section Headers & Labels</span>
              </h2>
              <p className="text-xs text-slate-400 mt-1">
                Customize every single title, subtitle, badge tag, and box label in both Bengali and English.
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              {/* Badge Tag EN */}
              <div className="space-y-2">
                <label className="block text-xs font-bold text-slate-300">
                  Top Tag Badge (English)
                </label>
                <input
                  type="text"
                  value={data.tag || ''}
                  onChange={(e) => setData({ ...data, tag: e.target.value })}
                  placeholder="General Secondary Curriculum (Classes 6 to 10)"
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:border-indigo-500 focus:outline-none"
                />
              </div>

              {/* Badge Tag BN */}
              <div className="space-y-2">
                <label className="block text-xs font-bold text-slate-300">
                  Top Tag Badge (বাংলা)
                </label>
                <input
                  type="text"
                  value={data.tagBn || ''}
                  onChange={(e) => setData({ ...data, tagBn: e.target.value })}
                  placeholder="সাধারণ মাধ্যমিক শিক্ষাক্রম (৬ষ্ঠ হতে ১০ম)"
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:border-indigo-500 focus:outline-none"
                />
              </div>

              {/* Title EN */}
              <div className="space-y-2">
                <label className="block text-xs font-bold text-slate-300">
                  Main Section Heading (English)
                </label>
                <input
                  type="text"
                  value={data.title || ''}
                  onChange={(e) => setData({ ...data, title: e.target.value })}
                  placeholder="Academic Groups & Disciplines"
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:border-indigo-500 focus:outline-none font-bold"
                />
              </div>

              {/* Title BN */}
              <div className="space-y-2">
                <label className="block text-xs font-bold text-slate-300">
                  Main Section Heading (বাংলা)
                </label>
                <input
                  type="text"
                  value={data.titleBn || ''}
                  onChange={(e) => setData({ ...data, titleBn: e.target.value })}
                  placeholder="একাডেমিক বিভাগ ও পাঠ্য বিষয়সমূহ"
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:border-indigo-500 focus:outline-none font-bold"
                />
              </div>

              {/* Subtitle EN */}
              <div className="space-y-2">
                <label className="block text-xs font-bold text-slate-300">
                  Section Subtitle / Description (English)
                </label>
                <textarea
                  rows={3}
                  value={data.subtitle || ''}
                  onChange={(e) => setData({ ...data, subtitle: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:border-indigo-500 focus:outline-none leading-relaxed"
                />
              </div>

              {/* Subtitle BN */}
              <div className="space-y-2">
                <label className="block text-xs font-bold text-slate-300">
                  Section Subtitle / Description (বাংলা)
                </label>
                <textarea
                  rows={3}
                  value={data.subtitleBn || ''}
                  onChange={(e) => setData({ ...data, subtitleBn: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:border-indigo-500 focus:outline-none leading-relaxed"
                />
              </div>

              {/* Key Subjects Label EN */}
              <div className="space-y-2">
                <label className="block text-xs font-bold text-slate-300">
                  "Key Subjects" Label (English)
                </label>
                <input
                  type="text"
                  value={data.keySubjectsLabel || ''}
                  onChange={(e) => setData({ ...data, keySubjectsLabel: e.target.value })}
                  placeholder="Key Subjects"
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:border-indigo-500 focus:outline-none"
                />
              </div>

              {/* Key Subjects Label BN */}
              <div className="space-y-2">
                <label className="block text-xs font-bold text-slate-300">
                  "Key Subjects" Label (বাংলা)
                </label>
                <input
                  type="text"
                  value={data.keySubjectsLabelBn || ''}
                  onChange={(e) => setData({ ...data, keySubjectsLabelBn: e.target.value })}
                  placeholder="মূল বিষয়সমূহ"
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:border-indigo-500 focus:outline-none"
                />
              </div>

              {/* Pathway Label EN */}
              <div className="space-y-2">
                <label className="block text-xs font-bold text-slate-300">
                  "Career Pathway:" Label (English)
                </label>
                <input
                  type="text"
                  value={data.pathwayLabel || ''}
                  onChange={(e) => setData({ ...data, pathwayLabel: e.target.value })}
                  placeholder="Career Pathway:"
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:border-indigo-500 focus:outline-none"
                />
              </div>

              {/* Pathway Label BN */}
              <div className="space-y-2">
                <label className="block text-xs font-bold text-slate-300">
                  "Career Pathway:" Label (বাংলা)
                </label>
                <input
                  type="text"
                  value={data.pathwayLabelBn || ''}
                  onChange={(e) => setData({ ...data, pathwayLabelBn: e.target.value })}
                  placeholder="ভবিষ্যৎ ক্যারিয়ার:"
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:border-indigo-500 focus:outline-none"
                />
              </div>
            </div>

            <div className="pt-4 border-t border-slate-800 flex justify-end">
              <button
                onClick={() => handleSave()}
                disabled={saving}
                className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs inline-flex items-center gap-2 shadow-lg transition cursor-pointer"
              >
                <Save className="w-4 h-4" />
                <span>Save Section Headings</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── TAB 3: LIVE HOMEPAGE SIMULATION ── */}
      {activeTab === 'preview' && (
        <div className="space-y-6">
          <div className="bg-slate-900/60 p-4 rounded-2xl border border-slate-800 flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400">
              Interactive preview rendered using current {previewLang === 'bn' ? 'বাংলা' : 'English'} data:
            </span>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setPreviewLang('bn')}
                className={`px-3 py-1 rounded-lg text-xs font-bold transition cursor-pointer ${
                  previewLang === 'bn' ? 'bg-indigo-600 text-white' : 'text-slate-400 bg-slate-800'
                }`}
              >
                বাংলা
              </button>
              <button
                onClick={() => setPreviewLang('en')}
                className={`px-3 py-1 rounded-lg text-xs font-bold transition cursor-pointer ${
                  previewLang === 'en' ? 'bg-indigo-600 text-white' : 'text-slate-400 bg-slate-800'
                }`}
              >
                English
              </button>
            </div>
          </div>

          {/* Actual Homepage Replica Box */}
          <div className="bg-[#f8fafc] text-slate-800 rounded-3xl p-8 sm:p-12 border border-slate-200 shadow-2xl overflow-hidden">
            <div className="text-center max-w-2xl mx-auto mb-14">
              <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 bg-indigo-50 px-3.5 py-1.5 rounded-full border border-indigo-100 inline-block">
                {previewLang === 'bn' ? data.tagBn || data.tag : data.tag || data.tagBn}
              </span>
              <h2 className="mt-4 font-display font-extrabold text-3xl sm:text-4xl text-slate-900">
                {previewLang === 'bn' ? data.titleBn || data.title : data.title || data.titleBn}
              </h2>
              <p className="mt-3 text-sm sm:text-base text-slate-600 leading-relaxed">
                {previewLang === 'bn' ? data.subtitleBn || data.subtitle : data.subtitle || data.subtitleBn}
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {data.groups
                ?.filter((g) => g.isActive !== false)
                .map((group, idx) => (
                  <div
                    key={idx}
                    className={`bg-white rounded-3xl p-6 border ${group.border} shadow-lg flex flex-col justify-between`}
                  >
                    <div>
                      <div className="text-4xl mb-4 p-3 rounded-2xl bg-slate-50 inline-block shadow-inner border border-slate-100">
                        {group.icon}
                      </div>
                      <h3 className="font-display font-bold text-xl text-slate-900 mb-2">
                        {previewLang === 'bn' ? group.nameBn || group.name : group.name || group.nameBn}
                      </h3>
                      <p className="text-xs text-slate-600 leading-relaxed mb-4">
                        {previewLang === 'bn' ? group.descBn || group.desc : group.desc || group.descBn}
                      </p>

                      <div className="pt-3 border-t border-slate-100">
                        <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-2">
                          {previewLang === 'bn'
                            ? data.keySubjectsLabelBn || 'মূল বিষয়সমূহ'
                            : data.keySubjectsLabel || 'Key Subjects'}
                        </span>
                        <div className="flex flex-wrap gap-1.5 mb-3">
                          {(previewLang === 'bn'
                            ? group.subjectsBn?.length
                              ? group.subjectsBn
                              : group.subjects
                            : group.subjects?.length
                            ? group.subjects
                            : group.subjectsBn
                          )?.map((sub, sIdx) => (
                            <span
                              key={sIdx}
                              className="text-[11px] font-medium px-2 py-0.5 rounded-md bg-slate-50 text-slate-700 border border-slate-200"
                            >
                              {sub}
                            </span>
                          ))}
                        </div>

                        <div className="text-[11px] text-indigo-600 font-semibold mt-2 pt-2 border-t border-slate-100">
                          <strong>
                            {previewLang === 'bn'
                              ? data.pathwayLabelBn || 'ভবিষ্যৎ ক্যারিয়ার:'
                              : data.pathwayLabel || 'Career Pathway:'}{' '}
                          </strong>
                          {previewLang === 'bn'
                            ? group.pathwayBn || group.pathway
                            : group.pathway || group.pathwayBn}
                        </div>
                      </div>
                    </div>

                    <div className="mt-6 text-xs font-bold text-indigo-600 inline-flex items-center gap-1">
                      <span>
                        {previewLang === 'bn'
                          ? group.buttonTextBn || 'পাঠ্যক্রমের বিবরণ'
                          : group.buttonText || 'Curriculum Details'}
                      </span>
                      <span>→</span>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        </div>
      )}

      {/* ── MODAL: CREATE / EDIT ACADEMIC GROUP ── */}
      {modalOpen && editingGroup && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-3xl shadow-2xl overflow-hidden my-8 animate-fadeIn">
            {/* Modal Header */}
            <div className="p-6 border-b border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="text-3xl p-2 rounded-xl bg-slate-800 border border-slate-700">
                  {editingGroup.icon || '📘'}
                </span>
                <div>
                  <h3 className="text-lg font-extrabold text-white">
                    {editingGroup.name ? `Edit: ${editingGroup.name}` : 'Create New Academic Group'}
                  </h3>
                  <p className="text-xs text-slate-400">
                    Provide bilingual details, subject tags, colors, and links.
                  </p>
                </div>
              </div>
              <button
                onClick={() => setModalOpen(false)}
                className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <form onSubmit={handleSaveModalGroup} className="p-6 space-y-6 max-h-[75vh] overflow-y-auto">
              {/* 1. Icon & Names */}
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <div className="space-y-1.5 w-24">
                    <label className="block text-xs font-bold text-slate-300">Emoji Icon</label>
                    <input
                      type="text"
                      value={editingGroup.icon || ''}
                      onChange={(e) => setEditingGroup({ ...editingGroup, icon: e.target.value })}
                      className="w-full text-center text-2xl px-2 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white focus:border-indigo-500 focus:outline-none"
                    />
                  </div>

                  <div className="flex-1 space-y-1.5">
                    <span className="text-[11px] font-bold text-slate-400">Quick Emoji Presets:</span>
                    <div className="flex flex-wrap gap-1.5">
                      {EMOJI_PRESETS.map((emoji) => (
                        <button
                          key={emoji}
                          type="button"
                          onClick={() => setEditingGroup({ ...editingGroup, icon: emoji })}
                          className={`text-lg p-1.5 rounded-lg border transition cursor-pointer ${
                            editingGroup.icon === emoji
                              ? 'bg-indigo-600/30 border-indigo-500'
                              : 'bg-slate-950 border-slate-800 hover:bg-slate-800'
                          }`}
                        >
                          {emoji}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="block text-xs font-bold text-slate-300">
                      Group Name (English) *
                    </label>
                    <input
                      type="text"
                      required
                      value={editingGroup.name || ''}
                      onChange={(e) => setEditingGroup({ ...editingGroup, name: e.target.value })}
                      placeholder="e.g. Science Group"
                      className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:border-indigo-500 focus:outline-none font-bold"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="block text-xs font-bold text-slate-300">
                      Group Name (বাংলা) *
                    </label>
                    <input
                      type="text"
                      required
                      value={editingGroup.nameBn || ''}
                      onChange={(e) => setEditingGroup({ ...editingGroup, nameBn: e.target.value })}
                      placeholder="যেমন: বিজ্ঞান বিভাগ"
                      className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:border-indigo-500 focus:outline-none font-bold"
                    />
                  </div>
                </div>
              </div>

              {/* 2. Descriptions */}
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-slate-300">
                    Description (English)
                  </label>
                  <textarea
                    rows={3}
                    value={editingGroup.desc || ''}
                    onChange={(e) => setEditingGroup({ ...editingGroup, desc: e.target.value })}
                    placeholder="Full English details of this discipline curriculum..."
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:border-indigo-500 focus:outline-none leading-relaxed"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-slate-300">
                    Description (বাংলা)
                  </label>
                  <textarea
                    rows={3}
                    value={editingGroup.descBn || ''}
                    onChange={(e) => setEditingGroup({ ...editingGroup, descBn: e.target.value })}
                    placeholder="এই একাডেমিক বিভাগের বিস্তারিত বিবরণ বাংলায় লিখুন..."
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:border-indigo-500 focus:outline-none leading-relaxed"
                  />
                </div>
              </div>

              {/* 3. Subjects Tags Builder */}
              <div className="grid md:grid-cols-2 gap-4 p-4 rounded-2xl bg-slate-950 border border-slate-800">
                {/* English Subjects */}
                <div className="space-y-2">
                  <label className="block text-xs font-bold text-slate-300">
                    Subjects (English Tags)
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={newSubEn}
                      onChange={(e) => setNewSubEn(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault()
                          addSubjectEn()
                        }
                      }}
                      placeholder="e.g. Physics"
                      className="flex-1 px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-white text-xs focus:border-indigo-500 focus:outline-none"
                    />
                    <button
                      type="button"
                      onClick={addSubjectEn}
                      className="px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold transition cursor-pointer"
                    >
                      Add
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-1.5 min-h-[36px] pt-1">
                    {(editingGroup.subjects || []).map((sub, idx) => (
                      <span
                        key={idx}
                        className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-slate-800 text-slate-200 border border-slate-700 text-[11px]"
                      >
                        <span>{sub}</span>
                        <button
                          type="button"
                          onClick={() => removeSubjectEn(idx)}
                          className="text-slate-400 hover:text-rose-400 cursor-pointer"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </span>
                    ))}
                  </div>
                </div>

                {/* Bengali Subjects */}
                <div className="space-y-2">
                  <label className="block text-xs font-bold text-slate-300">
                    Subjects (বাংলা ট্যাগ)
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={newSubBn}
                      onChange={(e) => setNewSubBn(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault()
                          addSubjectBn()
                        }
                      }}
                      placeholder="যেমন: পদার্থবিজ্ঞান"
                      className="flex-1 px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-white text-xs focus:border-indigo-500 focus:outline-none"
                    />
                    <button
                      type="button"
                      onClick={addSubjectBn}
                      className="px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold transition cursor-pointer"
                    >
                      Add
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-1.5 min-h-[36px] pt-1">
                    {(editingGroup.subjectsBn || []).map((sub, idx) => (
                      <span
                        key={idx}
                        className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-slate-800 text-slate-200 border border-slate-700 text-[11px]"
                      >
                        <span>{sub}</span>
                        <button
                          type="button"
                          onClick={() => removeSubjectBn(idx)}
                          className="text-slate-400 hover:text-rose-400 cursor-pointer"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* 4. Career Pathways */}
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-slate-300">
                    Career Pathway (English)
                  </label>
                  <textarea
                    rows={2}
                    value={editingGroup.pathway || ''}
                    onChange={(e) => setEditingGroup({ ...editingGroup, pathway: e.target.value })}
                    placeholder="e.g. HSC Science, Engineering, Medical..."
                    className="w-full px-4 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:border-indigo-500 focus:outline-none"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-slate-300">
                    Career Pathway (বাংলা)
                  </label>
                  <textarea
                    rows={2}
                    value={editingGroup.pathwayBn || ''}
                    onChange={(e) => setEditingGroup({ ...editingGroup, pathwayBn: e.target.value })}
                    placeholder="যেমন: উচ্চ মাধ্যমিক (বিজ্ঞান), মেডিকেল, বুয়েট..."
                    className="w-full px-4 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:border-indigo-500 focus:outline-none"
                  />
                </div>
              </div>

              {/* 5. Color Presets */}
              <div className="space-y-2">
                <label className="block text-xs font-bold text-slate-300 flex items-center gap-2">
                  <Palette className="w-3.5 h-3.5 text-indigo-400" />
                  <span>Card Border & Accent Style Theme</span>
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                  {COLOR_PRESETS.map((preset) => (
                    <button
                      key={preset.name}
                      type="button"
                      onClick={() =>
                        setEditingGroup({
                          ...editingGroup,
                          border: preset.border,
                          color: preset.color,
                        })
                      }
                      className={`p-2.5 rounded-xl border text-left flex items-center gap-2.5 transition cursor-pointer ${
                        editingGroup.border === preset.border
                          ? 'bg-indigo-950/60 border-indigo-500 ring-2 ring-indigo-500/30'
                          : 'bg-slate-950 border-slate-800 hover:border-slate-700'
                      }`}
                    >
                      <span className={`w-3.5 h-3.5 rounded-full ${preset.dot} shrink-0`} />
                      <span className="text-xs font-bold text-white truncate">{preset.name}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* 6. Button Text & Link */}
              <div className="grid md:grid-cols-3 gap-4">
                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-slate-300">Button Text (EN)</label>
                  <input
                    type="text"
                    value={editingGroup.buttonText || ''}
                    onChange={(e) => setEditingGroup({ ...editingGroup, buttonText: e.target.value })}
                    placeholder="Curriculum Details"
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:border-indigo-500 focus:outline-none"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-slate-300">Button Text (BN)</label>
                  <input
                    type="text"
                    value={editingGroup.buttonTextBn || ''}
                    onChange={(e) => setEditingGroup({ ...editingGroup, buttonTextBn: e.target.value })}
                    placeholder="পাঠ্যক্রমের বিবরণ"
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:border-indigo-500 focus:outline-none"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-slate-300">Button Link URL</label>
                  <input
                    type="text"
                    value={editingGroup.buttonLink || ''}
                    onChange={(e) => setEditingGroup({ ...editingGroup, buttonLink: e.target.value })}
                    placeholder="/academics"
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:border-indigo-500 focus:outline-none"
                  />
                </div>
              </div>

              {/* 7. Active Status */}
              <div className="flex items-center justify-between p-3 rounded-xl bg-slate-950 border border-slate-800">
                <div>
                  <span className="text-xs font-bold text-white block">Group Active Status</span>
                  <span className="text-[11px] text-slate-400">
                    If disabled, this group will be hidden from the public website cards.
                  </span>
                </div>
                <input
                  type="checkbox"
                  checked={editingGroup.isActive !== false}
                  onChange={(e) => setEditingGroup({ ...editingGroup, isActive: e.target.checked })}
                  className="w-5 h-5 rounded text-emerald-500 focus:ring-emerald-400 cursor-pointer"
                />
              </div>

              {/* Modal Actions */}
              <div className="pt-4 border-t border-slate-800 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold transition cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-500 hover:to-indigo-400 text-white text-xs font-bold shadow-lg shadow-indigo-600/30 transition cursor-pointer"
                >
                  Save Group
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
