import { useState, useEffect } from 'react'
import {
  FileText,
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
  Search,
  Printer,
  Download,
  Building2,
  Settings,
  Pin,
  Calendar,
  Sparkles,
  Sliders,
  Smartphone,
  PhoneCall,
  Check,
} from 'lucide-react'
import api from '../../lib/api'
import NoticeDeleteAlert from '../components/NoticeDeleteAlert'
import NoticePadModal from '../../components/modals/NoticePadModal'

const INITIAL_PAD_CONFIG = {
  schoolName: 'Mirashani Polytechnic Academy',
  schoolNameBn: 'মিরাশানী পলিটেকনিক একাডেমি',
  subHeader: 'An Exemplary Institution of Excellence & Character',
  subHeaderBn: 'একটি আদর্শ ও ঐতিহ্যবাহী বিদ্যাপীঠ',
  address: 'Mirashani, Madhavpur, Habiganj, Sylhet, Bangladesh',
  addressBn: 'মিরাশানী, মাধবপুর, হবিগঞ্জ, সিলেট, বাংলাদেশ',
  phone: '+880 1712-345678',
  email: 'info@mirashaniacademy.edu.bd',
  website: 'www.mirashaniacademy.edu.bd',
  eiin: '129485',
  estd: '1998',
  schoolCode: '4521',
  logoText: 'MPA',
  logoUrl: '',
  watermarkText: 'MIRASHANI ACADEMY',
  signatoryTitle: 'Headmaster / Principal',
  signatoryTitleBn: 'প্রধান শিক্ষক',
  signatoryName: 'Md. Rafiqul Islam',
  signatoryNameBn: 'মোঃ রফিকুল ইসলাম',
  signatureUrl: '',
  sealUrl: '',
}

const INITIAL_NOTICES = [
  {
    id: 'notice-1',
    cat: 'Exam',
    catBn: 'পরীক্ষা',
    pinned: true,
    date: '25 Sep 2026',
    dateBn: '২৫ সেপ্টেম্বর ২০২৬',
    title: 'Half-Yearly Examination 2026 Routine & Admit Card Distribution',
    titleBn: 'অর্ধ-বার্ষিক পরীক্ষা ২০২৬ রুটিন ও প্রবেশপত্র বিতরণ',
    text: 'Examinations for Classes Six to Ten commence on 10 October 2026. The comprehensive subject schedule is available for download. All tuition dues must be cleared before receiving official admit cards.',
    textBn: '৬ষ্ঠ থেকে ১০ম শ্রেণির পরীক্ষা ১০ অক্টোবর ২০২৬ থেকে শুরু হবে। বিস্তারিত সময়সূচি ডাউনলোড করা যাবে। প্রবেশপত্র পেতে সব বেতন পরিশোধ করতে হবে।',
    author: 'Exam Controller Desk',
    authorBn: 'পরীক্ষা নিয়ন্ত্রক',
    memoNo: 'MA/EXAM/2026/089',
    file: '#',
    views: 620,
    order: 1,
    isActive: true,
  },
  {
    id: 'notice-2',
    cat: 'Admission',
    catBn: 'ভর্তি',
    pinned: true,
    date: '20 Sep 2026',
    dateBn: '২০ সেপ্টেম্বর ২০২৬',
    title: 'Admission Circular Session 2027 (Classes 6 to 9)',
    titleBn: 'সেশন ২০২৭ ভর্তি বিজ্ঞপ্তি (৬ষ্ঠ থেকে ৯ম শ্রেণি)',
    text: 'Online and in-person admission registration opens from 01 November 2026. Seats are available for Science, Business Studies, and Humanities streams in Class 9.',
    textBn: '১ নভেম্বর ২০২৬ থেকে অনলাইন ও অফলাইন ভর্তি আবেদন শুরু। ৯ম শ্রেণিতে বিজ্ঞান, ব্যবসায় শিক্ষা ও মানবিক বিভাগে ভর্তি নেওয়া হবে।',
    author: 'Admission Committee',
    authorBn: 'ভর্তি কমিটি',
    memoNo: 'MA/ADM/2026/112',
    file: '#',
    views: 1140,
    order: 2,
    isActive: true,
  },
  {
    id: 'notice-3',
    cat: 'Holiday',
    catBn: 'ছুটি',
    pinned: false,
    date: '22 Sep 2026',
    dateBn: '২২ সেপ্টেম্বর ২০২৬',
    title: 'School Closure on National Public Holiday',
    titleBn: 'জাতীয় সরকারি ছুটিতে বৃহস্পতিবার বিদ্যালয় বন্ধ',
    text: 'Academic classes and administrative offices will remain closed tomorrow in observance of the declared government holiday. Regular classes resume Sunday at 08:30 AM.',
    textBn: 'সকল একাডেমিক ক্লাস ও প্রশাসনিক কার্যালয় বন্ধ থাকবে। রবিবার সকাল ৮:৩০টায় স্বাভাবিক ক্লাস শুরু হবে।',
    author: 'Headmaster Office',
    authorBn: 'প্রধান শিক্ষকের দপ্তর',
    memoNo: 'MA/ADMIN/2026/045',
    file: '#',
    views: 410,
    order: 3,
    isActive: true,
  },
  {
    id: 'notice-4',
    cat: 'Result',
    catBn: 'ফলাফল',
    pinned: false,
    date: '15 Sep 2026',
    dateBn: '১৫ সেপ্টেম্বর ২০২৬',
    title: 'Class 10 SSC Model Test Official Results Published',
    titleBn: '১০ম শ্রেণির প্রাক-পরীক্ষা / মডেল টেস্টের ফলাফল প্রকাশিত',
    text: 'SSC Model Test results have been published on the online portal. Guardians are requested to review performance metrics with the respective Class Teacher.',
    textBn: 'এসএসসি পরীক্ষার্থীদের মডেল টেস্টের ফলাফল অনলাইন পোর্টালে প্রকাশিত হয়েছে। অভিভাবকদের সংশ্লিষ্ট শ্রেণিশিক্ষকের সাথে ফলাফল পর্যালোচনার অনুরোধ করা হচ্ছে।',
    author: 'Academic Council',
    authorBn: 'একাডেমিক পরিষদ',
    memoNo: 'MA/RES/2026/067',
    file: '#',
    views: 1480,
    order: 4,
    isActive: true,
  },
  {
    id: 'notice-5',
    cat: 'Club',
    catBn: 'ক্লাব',
    pinned: false,
    date: '12 Sep 2026',
    dateBn: '১২ সেপ্টেম্বর ২০২৬',
    title: 'Annual Science Fair & Inter-Class Math Olympiad Registration',
    titleBn: 'বার্ষিক বিজ্ঞান মেলা ও আন্তঃশ্রেণি গণিত অলিম্পিয়াডে নিবন্ধন',
    text: 'Students from Classes Six to Ten can submit working science models and register for the Math Olympiad before 30 September 2026.',
    textBn: '৬ষ্ঠ থেকে ১০ম শ্রেণির শিক্ষার্থীরা কার্যকরী পদার্থ/রসায়ন প্রজেক্ট মডেল জমা দিতে ও গণিত অলিম্পিয়াডে নিবন্ধন করতে পারবে।',
    author: 'Science & Math Club',
    authorBn: 'বিজ্ঞান ও গণিত ক্লাব',
    memoNo: 'MA/CLUB/2026/018',
    file: '#',
    views: 790,
    order: 5,
    isActive: true,
  },
  {
    id: 'notice-6',
    cat: 'Scouts',
    catBn: 'স্কাউট',
    pinned: false,
    date: '08 Sep 2026',
    dateBn: '০৮ সেপ্টেম্বর ২০২৬',
    title: 'Bangladesh Scouts & Girl Guides Annual Campfire & Training',
    titleBn: 'বাংলাদেশ স্কাউট ও গার্ল গাইড বার্ষিক ক্যাম্পফায়ার ও প্রশিক্ষণ শিবির',
    text: 'Registered Scout troop members and Girl Guides will participate in a 3-day regional outdoor leadership & survival camp.',
    textBn: 'স্কুলের স্কাউট দল ও গার্ল গাইডের নিবন্ধিত সদস্যরা ৩ দিনের আঞ্চলিক প্রশিক্ষণ শিবিরে অংশগ্রহণ করবে।',
    author: 'Scout Leader Desk',
    authorBn: 'স্কাউট দলনেতা',
    memoNo: 'MA/SCT/2026/011',
    file: '#',
    views: 520,
    order: 6,
    isActive: true,
  },
]

const INITIAL_SMS_ALERT = {
  isActive: true,
  title: 'Get Instant Notices via SMS Alert',
  titleBn: 'এসএমএস অ্যালার্টের মাধ্যমে নোটিশ পান',
  subtitle: 'Guardians can subscribe their mobile number to receive exam schedules and emergency school closures directly.',
  subtitleBn: 'অভিভাবকগণ মোবাইল নম্বর নিবন্ধন করে সরাসরি পরীক্ষার রুটিন ও জরুরি ছুটির বার্তা পেতে পারেন।',
  inputPlaceholder: 'e.g. 017XXXXXXXX',
  inputPlaceholderBn: 'যেমন: ০১৭XXXXXXXX',
  buttonText: 'Subscribe Free',
  buttonTextBn: 'বিনামূল্যে সাবস্ক্রাইব',
  successMsg: 'Thank you! Your mobile number has been registered for notice alerts.',
  successMsgBn: 'ধন্যবাদ! আপনার মোবাইল নম্বর নোটিশ অ্যালার্টের জন্য নিবন্ধিত হয়েছে।',
}

const INITIAL_DATA = {
  isActive: true,
  tag: 'Official Circulars & Notice Board',
  tagBn: 'অফিসিয়াল সার্কুলার ও নোটিশ বোর্ড',
  title: 'School Notice Board',
  titleBn: 'বিদ্যালয় নোটিশ বোর্ড',
  subtitle:
    'Stay updated with academic examination routines, holiday declarations, admission circulars, and official announcements.',
  subtitleBn:
    'মিরাশানী একাডেমি প্রশাসন কর্তৃক প্রকাশিত সকল একাডেমিক পরীক্ষার রুটিন, ছুটির ঘোষণা, ভর্তি সার্কুলার এবং গুরুত্বপূর্ণ নোটিশ এক নজরে দেখুন।',
  padConfig: INITIAL_PAD_CONFIG,
  smsAlert: INITIAL_SMS_ALERT,
  notices: INITIAL_NOTICES,
}

export default function NoticeManager() {
  const [activeTab, setActiveTab] = useState('notices') // 'notices' | 'pad' | 'section' | 'sms-alert' | 'preview'
  const [data, setData] = useState(INITIAL_DATA)
  const [subscribers, setSubscribers] = useState([])
  const [loadingSubscribers, setLoadingSubscribers] = useState(false)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [saveSuccess, setSaveSuccess] = useState(false)
  const [statusMsg, setStatusMsg] = useState('')

  // Item Modal State
  const [editingItem, setEditingItem] = useState(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [deleteTarget, setDeleteTarget] = useState(null)
  const [deleting, setDeleting] = useState(false)

  // PDF Preview State
  const [previewNotice, setPreviewNotice] = useState(null)
  const [previewLang, setPreviewLang] = useState('bn')

  // Search in notices table
  const [tableSearch, setTableSearch] = useState('')

  useEffect(() => {
    fetchData()
    fetchSubscribers()
  }, [])

  const fetchSubscribers = async () => {
    setLoadingSubscribers(true)
    try {
      const res = await api.getSubmissions('type=subscriber')
      if (res && res.data) {
        setSubscribers(res.data)
      }
    } catch (err) {
      console.warn('Could not load subscribers', err)
    } finally {
      setLoadingSubscribers(false)
    }
  }

  const fetchData = async () => {
    setLoading(true)
    try {
      const res = await api.getNotices()
      if (res && res.data) {
        setData({
          ...INITIAL_DATA,
          ...res.data,
          padConfig: {
            ...INITIAL_PAD_CONFIG,
            ...(res.data.padConfig || {}),
          },
          smsAlert: {
            ...INITIAL_SMS_ALERT,
            ...(res.data.smsAlert || {}),
          },
          notices: Array.isArray(res.data.notices) && res.data.notices.length > 0
            ? res.data.notices
            : INITIAL_NOTICES,
        })
      }
    } catch (err) {
      console.error('Could not fetch notices from Database', err)
    } finally {
      setLoading(false)
    }
  }

  const notifyChange = () => {
    try {
      localStorage.removeItem('mpa_notices_section')
    } catch (_) {}
    window.dispatchEvent(new Event('mpa_notices_updated'))
  }

  const handleSaveAll = async () => {
    setSaving(true)
    setStatusMsg('')
    try {
      const res = await api.updateNotices(data)
      if (res && res.success && res.data) {
        setData(res.data)
        notifyChange()
        setSaveSuccess(true)
        setStatusMsg('All Notices & School Pad settings saved directly to Database!')
      } else {
        throw new Error(res?.message || 'Database update failed')
      }
      setTimeout(() => {
        setSaveSuccess(false)
        setStatusMsg('')
      }, 3500)
    } catch (err) {
      console.error('Failed to save notices to backend DB', err)
      alert(`Error saving to Database: ${err.message}`)
    } finally {
      setSaving(false)
    }
  }

  const handleReset = async () => {
    if (!window.confirm('Are you sure you want to reset all notices and official school letterhead pad in Database to defaults?')) {
      return
    }
    setSaving(true)
    try {
      const res = await api.resetNotices()
      if (res && res.success && res.data) {
        setData(res.data)
      } else {
        setData(INITIAL_DATA)
      }
      notifyChange()
      setStatusMsg('Notice Board & Letterhead Pad successfully reset in Database!')
      setSaveSuccess(true)
      setTimeout(() => {
        setSaveSuccess(false)
        setStatusMsg('')
      }, 3000)
    } catch (err) {
      console.error('Reset error in DB', err)
      alert('Failed to reset in Database')
    } finally {
      setSaving(false)
    }
  }

  // Notice Item Actions
  const handleOpenAddModal = () => {
    setEditingItem({
      id: `notice-${Date.now()}`,
      title: '',
      titleBn: '',
      cat: 'Exam',
      catBn: 'পরীক্ষা',
      text: '',
      textBn: '',
      date: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
      dateBn: new Date().toLocaleDateString('bn-BD', { day: 'numeric', month: 'long', year: 'numeric' }),
      author: 'Headmaster Office',
      authorBn: 'প্রধান শিক্ষকের দপ্তর',
      memoNo: `MA/NOT/${new Date().getFullYear()}/${Math.floor(100 + Math.random() * 900)}`,
      pinned: false,
      file: '#',
      views: 100,
      order: (data.notices?.length || 0) + 1,
      isActive: true,
    })
    setIsModalOpen(true)
  }

  const handleOpenEditModal = (item) => {
    setEditingItem({ ...item })
    setIsModalOpen(true)
  }

  const handleSaveModalItem = async (e) => {
    e.preventDefault()
    if (!editingItem.title.trim() && !editingItem.titleBn.trim()) {
      alert('Please enter at least a Title in English or Bengali.')
      return
    }

    const exists = data.notices.some((n) => n.id === editingItem.id)
    let updatedNotices = []
    if (exists) {
      updatedNotices = data.notices.map((n) => (n.id === editingItem.id ? editingItem : n))
    } else {
      updatedNotices = [editingItem, ...data.notices]
    }

    const updatedData = { ...data, notices: updatedNotices }
    setData(updatedData)
    setIsModalOpen(false)
    setEditingItem(null)

    // Direct save to Database immediately
    try {
      const res = await api.updateNotices(updatedData)
      if (res && res.success && res.data) {
        setData(res.data)
        notifyChange()
      }
    } catch (err) {
      console.error('Failed to save notice item to database', err)
      alert('Notice saved in view, please click "Save All Changes" to sync to database.')
    }
  }

  const handleDeleteItem = async () => {
    if (!deleteTarget) return
    setDeleting(true)
    try {
      const updatedNotices = data.notices.filter((n) => n.id !== deleteTarget.id && n._id !== deleteTarget.id)
      const updatedData = { ...data, notices: updatedNotices }
      setData(updatedData)

      // Direct delete from Database
      try {
        await api.deleteNoticeItem(deleteTarget.id || deleteTarget._id)
      } catch (e) {
        // Fallback to updateNotices
        await api.updateNotices(updatedData)
      }
      notifyChange()
      setDeleteTarget(null)
    } catch (err) {
      console.error('Error deleting notice from DB', err)
    } finally {
      setDeleting(false)
    }
  }

  const handleMoveOrder = async (index, direction) => {
    const targetIndex = index + direction
    if (targetIndex < 0 || targetIndex >= data.notices.length) return
    const newItems = [...data.notices]
    const temp = newItems[index]
    newItems[index] = newItems[targetIndex]
    newItems[targetIndex] = temp

    newItems.forEach((item, idx) => {
      item.order = idx + 1
    })

    const updatedData = { ...data, notices: newItems }
    setData(updatedData)
    try {
      await api.updateNotices(updatedData)
      notifyChange()
    } catch (err) {
      console.error('Failed to sync reorder to DB', err)
    }
  }

  const handleTogglePinned = async (id) => {
    const updatedNotices = data.notices.map((n) => {
      if (n.id === id || n._id === id) {
        return { ...n, pinned: !n.pinned }
      }
      return n
    })
    const updatedData = { ...data, notices: updatedNotices }
    setData(updatedData)
    try {
      await api.updateNotices(updatedData)
      notifyChange()
    } catch (err) {
      console.error('Failed to sync pin to DB', err)
    }
  }

  const handleToggleActive = async (id) => {
    const updatedNotices = data.notices.map((n) => {
      if (n.id === id || n._id === id) {
        return { ...n, isActive: !n.isActive }
      }
      return n
    })
    const updatedData = { ...data, notices: updatedNotices }
    setData(updatedData)
    try {
      await api.updateNotices(updatedData)
      notifyChange()
    } catch (err) {
      console.error('Failed to sync active status to DB', err)
    }
  }

  // Filter notices for manager list
  const filteredNoticesList = (data.notices || []).filter((n) => {
    if (!tableSearch) return true
    const q = tableSearch.toLowerCase()
    return (
      (n.title && n.title.toLowerCase().includes(q)) ||
      (n.titleBn && n.titleBn.toLowerCase().includes(q)) ||
      (n.cat && n.cat.toLowerCase().includes(q)) ||
      (n.memoNo && n.memoNo.toLowerCase().includes(q))
    )
  })

  return (
    <div className="space-y-6 animate-fadeIn pb-16">
      {/* Top Header Card */}
      <div className="rounded-2xl bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 border border-slate-800 p-6 shadow-xl relative overflow-hidden">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 relative z-10">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
              <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
              <span>Full Dynamic CMS & Official Letterhead Pad</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight flex items-center gap-3">
              <span>Notice Board & School Pad Manager</span>
            </h1>
            <p className="text-xs sm:text-sm text-slate-400 max-w-2xl">
              Manage dynamic notice announcements, category filters, and customize the official School Letterhead Pad (Header, EIIN, Estd, Logo, Seal, Signatures) for crisp, printable PDF downloads.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5 shrink-0">
            <button
              onClick={handleReset}
              disabled={saving}
              className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold text-slate-300 hover:text-white bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700 transition cursor-pointer disabled:opacity-50"
              title="Reset all notices and pad to default content"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset</span>
            </button>

            <a
              href="/notices"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold text-indigo-300 hover:text-white bg-indigo-950/60 hover:bg-indigo-900/60 border border-indigo-700/50 transition cursor-pointer"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span>Live Notices Page</span>
            </a>

            <button
              onClick={handleSaveAll}
              disabled={saving}
              className="inline-flex items-center gap-2 px-5 py-2 rounded-xl text-xs sm:text-sm font-bold text-white bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 shadow-lg shadow-indigo-950/50 transition active:scale-95 cursor-pointer disabled:opacity-50"
            >
              {saving ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
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

        {/* Status banner */}
        {saveSuccess && (
          <div className="mt-4 p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center gap-2.5 text-emerald-400 text-xs sm:text-sm animate-fadeIn">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span className="font-semibold">{statusMsg}</span>
          </div>
        )}
      </div>

      {/* Navigation Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-800 pb-2 overflow-x-auto no-scrollbar">
        <button
          onClick={() => setActiveTab('notices')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition-all cursor-pointer whitespace-nowrap ${
            activeTab === 'notices'
              ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
          }`}
        >
          <FileText className="w-4 h-4" />
          <span>Notices List ({data.notices?.length || 0})</span>
        </button>

        <button
          onClick={() => setActiveTab('pad')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition-all cursor-pointer whitespace-nowrap ${
            activeTab === 'pad'
              ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
          }`}
        >
          <Building2 className="w-4 h-4" />
          <span>School Letterhead Pad Settings</span>
        </button>

        <button
          onClick={() => setActiveTab('section')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition-all cursor-pointer whitespace-nowrap ${
            activeTab === 'section'
              ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
          }`}
        >
          <Sliders className="w-4 h-4" />
          <span>Page Headings & Metadata</span>
        </button>

        <button
          onClick={() => setActiveTab('sms-alert')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition-all cursor-pointer whitespace-nowrap ${
            activeTab === 'sms-alert'
              ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
          }`}
        >
          <Smartphone className="w-4 h-4" />
          <span>SMS Alert Box & Subscribers ({subscribers.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('preview')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition-all cursor-pointer whitespace-nowrap ${
            activeTab === 'preview'
              ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
          }`}
        >
          <Eye className="w-4 h-4" />
          <span>Live Pad Simulation</span>
        </button>
      </div>

      {/* TAB 1: NOTICES LIST */}
      {activeTab === 'notices' && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-slate-900/60 p-4 rounded-2xl border border-slate-800">
            <div className="relative flex-1 max-w-md">
              <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={tableSearch}
                onChange={(e) => setTableSearch(e.target.value)}
                placeholder="Search notices by title, category, or memo..."
                className="w-full pl-9 pr-4 py-2 bg-slate-950/80 border border-slate-800 rounded-xl text-xs sm:text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-indigo-500"
              />
            </div>

            <button
              onClick={handleOpenAddModal}
              className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs sm:text-sm font-bold shadow-lg shadow-indigo-600/20 transition cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Add New Notice</span>
            </button>
          </div>

          {/* Notices Grid / Table */}
          <div className="grid gap-3">
            {filteredNoticesList.length === 0 ? (
              <div className="text-center py-12 bg-slate-900/40 rounded-2xl border border-dashed border-slate-800">
                <FileText className="w-10 h-10 text-slate-600 mx-auto mb-2" />
                <p className="text-sm font-semibold text-slate-300">No notices found</p>
                <p className="text-xs text-slate-500 mt-0.5">Try searching with another keyword or create a new notice.</p>
              </div>
            ) : (
              filteredNoticesList.map((item, index) => (
                <div
                  key={item.id}
                  className="rounded-2xl bg-slate-900/80 border border-slate-800 hover:border-slate-700/80 p-4 sm:p-5 transition-all shadow-md flex flex-col md:flex-row items-start md:items-center justify-between gap-4"
                >
                  <div className="flex items-start gap-3.5 flex-1 min-w-0">
                    <div className="w-10 h-10 rounded-xl bg-indigo-600/15 border border-indigo-500/20 text-indigo-400 flex flex-col items-center justify-center font-bold text-xs shrink-0 mt-0.5">
                      <span>#{item.order || index + 1}</span>
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-2 mb-1">
                        <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-indigo-500/15 text-indigo-300 border border-indigo-500/25">
                          {item.cat} ({item.catBn || item.cat})
                        </span>
                        {item.pinned && (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-500/15 text-amber-300 border border-amber-500/25">
                            <Pin className="w-3 h-3 fill-amber-400" />
                            <span>Pinned</span>
                          </span>
                        )}
                        <span className="text-[11px] text-slate-500 font-mono">
                          {item.memoNo}
                        </span>
                        <span className="text-[11px] text-slate-400 flex items-center gap-1">
                          <Calendar className="w-3 h-3 text-slate-500" />
                          {item.date}
                        </span>
                      </div>

                      <h3 className="text-sm sm:text-base font-bold text-slate-100 truncate">
                        {item.title}
                      </h3>
                      {item.titleBn && (
                        <p className="text-xs text-slate-400 truncate mt-0.5 font-medium">
                          {item.titleBn}
                        </p>
                      )}

                      <p className="text-xs text-slate-500 line-clamp-1 mt-1">
                        {item.text}
                      </p>
                    </div>
                  </div>

                  {/* Right Actions */}
                  <div className="flex items-center gap-2 shrink-0 w-full md:w-auto justify-end pt-2 md:pt-0 border-t md:border-t-0 border-slate-800">
                    <button
                      onClick={() => {
                        setPreviewNotice(item)
                      }}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-950/80 hover:bg-indigo-900/80 text-indigo-300 text-xs font-semibold border border-indigo-800/50 transition cursor-pointer"
                      title="Preview this notice on the official School Pad"
                    >
                      <Printer className="w-3.5 h-3.5" />
                      <span>Pad & PDF</span>
                    </button>

                    <button
                      onClick={() => handleTogglePinned(item.id)}
                      className={`p-2 rounded-lg border transition cursor-pointer ${
                        item.pinned
                          ? 'bg-amber-500/20 border-amber-500/40 text-amber-300'
                          : 'bg-slate-800 border-slate-700 text-slate-400 hover:text-slate-200'
                      }`}
                      title={item.pinned ? 'Unpin Notice' : 'Pin Notice to Top'}
                    >
                      <Pin className="w-4 h-4" />
                    </button>

                    <div className="flex items-center gap-0.5 bg-slate-800 rounded-lg p-0.5 border border-slate-700">
                      <button
                        onClick={() => handleMoveOrder(index, -1)}
                        disabled={index === 0}
                        className="p-1 text-slate-400 hover:text-white disabled:opacity-30 transition cursor-pointer"
                        title="Move Up"
                      >
                        <ArrowUp className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleMoveOrder(index, 1)}
                        disabled={index === data.notices.length - 1}
                        className="p-1 text-slate-400 hover:text-white disabled:opacity-30 transition cursor-pointer"
                        title="Move Down"
                      >
                        <ArrowDown className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <button
                      onClick={() => handleOpenEditModal(item)}
                      className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 transition cursor-pointer"
                      title="Edit Notice"
                    >
                      <Edit3 className="w-4 h-4" />
                    </button>

                    <button
                      onClick={() => setDeleteTarget(item)}
                      className="p-2 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/30 transition cursor-pointer"
                      title="Delete Notice"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* TAB 2: SCHOOL LETTERHEAD PAD SETTINGS */}
      {activeTab === 'pad' && (
        <div className="space-y-6">
          <div className="bg-slate-900/90 rounded-2xl border border-slate-800 p-6 shadow-xl space-y-6">
            <div>
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <Building2 className="w-5 h-5 text-indigo-400" />
                <span>Official Institutional Letterhead Pad Configuration</span>
              </h2>
              <p className="text-xs text-slate-400 mt-1">
                Customize every word, title, metadata code, institutional watermark, and authority signature appearing on downloaded Notice PDFs.
              </p>
            </div>

            {/* School Names & Tagline */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1.5 uppercase tracking-wider">
                  School Name (English)
                </label>
                <input
                  type="text"
                  value={data.padConfig?.schoolName || ''}
                  onChange={(e) =>
                    setData({
                      ...data,
                      padConfig: { ...data.padConfig, schoolName: e.target.value },
                    })
                  }
                  className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-sm text-white focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1.5 uppercase tracking-wider">
                  School Name (Bengali)
                </label>
                <input
                  type="text"
                  value={data.padConfig?.schoolNameBn || ''}
                  onChange={(e) =>
                    setData({
                      ...data,
                      padConfig: { ...data.padConfig, schoolNameBn: e.target.value },
                    })
                  }
                  className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-sm text-white focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1.5 uppercase tracking-wider">
                  Sub-Header / Tagline (English)
                </label>
                <input
                  type="text"
                  value={data.padConfig?.subHeader || ''}
                  onChange={(e) =>
                    setData({
                      ...data,
                      padConfig: { ...data.padConfig, subHeader: e.target.value },
                    })
                  }
                  className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-sm text-white focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1.5 uppercase tracking-wider">
                  Sub-Header / Tagline (Bengali)
                </label>
                <input
                  type="text"
                  value={data.padConfig?.subHeaderBn || ''}
                  onChange={(e) =>
                    setData({
                      ...data,
                      padConfig: { ...data.padConfig, subHeaderBn: e.target.value },
                    })
                  }
                  className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-sm text-white focus:outline-none focus:border-indigo-500"
                />
              </div>
            </div>

            {/* Address */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1.5 uppercase tracking-wider">
                  Address (English)
                </label>
                <input
                  type="text"
                  value={data.padConfig?.address || ''}
                  onChange={(e) =>
                    setData({
                      ...data,
                      padConfig: { ...data.padConfig, address: e.target.value },
                    })
                  }
                  className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-sm text-white focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1.5 uppercase tracking-wider">
                  Address (Bengali)
                </label>
                <input
                  type="text"
                  value={data.padConfig?.addressBn || ''}
                  onChange={(e) =>
                    setData({
                      ...data,
                      padConfig: { ...data.padConfig, addressBn: e.target.value },
                    })
                  }
                  className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-sm text-white focus:outline-none focus:border-indigo-500"
                />
              </div>
            </div>

            {/* Institutional Identifiers */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 pt-2">
              <div>
                <label className="block text-[11px] font-bold text-slate-300 mb-1 uppercase tracking-wider">
                  EIIN Number
                </label>
                <input
                  type="text"
                  value={data.padConfig?.eiin || ''}
                  onChange={(e) =>
                    setData({
                      ...data,
                      padConfig: { ...data.padConfig, eiin: e.target.value },
                    })
                  }
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-300 mb-1 uppercase tracking-wider">
                  Established Year
                </label>
                <input
                  type="text"
                  value={data.padConfig?.estd || ''}
                  onChange={(e) =>
                    setData({
                      ...data,
                      padConfig: { ...data.padConfig, estd: e.target.value },
                    })
                  }
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-300 mb-1 uppercase tracking-wider">
                  School Code
                </label>
                <input
                  type="text"
                  value={data.padConfig?.schoolCode || ''}
                  onChange={(e) =>
                    setData({
                      ...data,
                      padConfig: { ...data.padConfig, schoolCode: e.target.value },
                    })
                  }
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-300 mb-1 uppercase tracking-wider">
                  Phone
                </label>
                <input
                  type="text"
                  value={data.padConfig?.phone || ''}
                  onChange={(e) =>
                    setData({
                      ...data,
                      padConfig: { ...data.padConfig, phone: e.target.value },
                    })
                  }
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-300 mb-1 uppercase tracking-wider">
                  Email
                </label>
                <input
                  type="text"
                  value={data.padConfig?.email || ''}
                  onChange={(e) =>
                    setData({
                      ...data,
                      padConfig: { ...data.padConfig, email: e.target.value },
                    })
                  }
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-300 mb-1 uppercase tracking-wider">
                  Website
                </label>
                <input
                  type="text"
                  value={data.padConfig?.website || ''}
                  onChange={(e) =>
                    setData({
                      ...data,
                      padConfig: { ...data.padConfig, website: e.target.value },
                    })
                  }
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-indigo-500"
                />
              </div>
            </div>

            {/* Logo & Watermark */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1.5 uppercase tracking-wider">
                  Logo Text (Monogram initials)
                </label>
                <input
                  type="text"
                  value={data.padConfig?.logoText || ''}
                  onChange={(e) =>
                    setData({
                      ...data,
                      padConfig: { ...data.padConfig, logoText: e.target.value },
                    })
                  }
                  placeholder="e.g. MPA"
                  className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-sm text-white focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1.5 uppercase tracking-wider">
                  Logo Image URL (Optional)
                </label>
                <input
                  type="text"
                  value={data.padConfig?.logoUrl || ''}
                  onChange={(e) =>
                    setData({
                      ...data,
                      padConfig: { ...data.padConfig, logoUrl: e.target.value },
                    })
                  }
                  placeholder="https://... (transparent PNG recommended)"
                  className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-sm text-white focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1.5 uppercase tracking-wider">
                  Background Watermark Text
                </label>
                <input
                  type="text"
                  value={data.padConfig?.watermarkText || ''}
                  onChange={(e) =>
                    setData({
                      ...data,
                      padConfig: { ...data.padConfig, watermarkText: e.target.value },
                    })
                  }
                  placeholder="e.g. MIRASHANI ACADEMY"
                  className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-sm text-white focus:outline-none focus:border-indigo-500"
                />
              </div>
            </div>

            {/* Signatory Details & Seal */}
            <div className="border-t border-slate-800 pt-5 space-y-4">
              <h3 className="text-sm font-bold text-slate-200">
                Signatory Authority & Official Seal
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1.5">
                    Signatory Name (EN)
                  </label>
                  <input
                    type="text"
                    value={data.padConfig?.signatoryName || ''}
                    onChange={(e) =>
                      setData({
                        ...data,
                        padConfig: { ...data.padConfig, signatoryName: e.target.value },
                      })
                    }
                    className="w-full px-3.5 py-2 bg-slate-950 border border-slate-800 rounded-xl text-sm text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1.5">
                    Signatory Name (BN)
                  </label>
                  <input
                    type="text"
                    value={data.padConfig?.signatoryNameBn || ''}
                    onChange={(e) =>
                      setData({
                        ...data,
                        padConfig: { ...data.padConfig, signatoryNameBn: e.target.value },
                      })
                    }
                    className="w-full px-3.5 py-2 bg-slate-950 border border-slate-800 rounded-xl text-sm text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1.5">
                    Signatory Title (EN)
                  </label>
                  <input
                    type="text"
                    value={data.padConfig?.signatoryTitle || ''}
                    onChange={(e) =>
                      setData({
                        ...data,
                        padConfig: { ...data.padConfig, signatoryTitle: e.target.value },
                      })
                    }
                    className="w-full px-3.5 py-2 bg-slate-950 border border-slate-800 rounded-xl text-sm text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1.5">
                    Signatory Title (BN)
                  </label>
                  <input
                    type="text"
                    value={data.padConfig?.signatoryTitleBn || ''}
                    onChange={(e) =>
                      setData({
                        ...data,
                        padConfig: { ...data.padConfig, signatoryTitleBn: e.target.value },
                      })
                    }
                    className="w-full px-3.5 py-2 bg-slate-950 border border-slate-800 rounded-xl text-sm text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-slate-300 mb-1.5">
                    Digital Signature Image URL (Optional)
                  </label>
                  <input
                    type="text"
                    value={data.padConfig?.signatureUrl || ''}
                    onChange={(e) =>
                      setData({
                        ...data,
                        padConfig: { ...data.padConfig, signatureUrl: e.target.value },
                      })
                    }
                    placeholder="Transparent signature image URL"
                    className="w-full px-3.5 py-2 bg-slate-950 border border-slate-800 rounded-xl text-sm text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-slate-300 mb-1.5">
                    Official Round Seal Image URL (Optional)
                  </label>
                  <input
                    type="text"
                    value={data.padConfig?.sealUrl || ''}
                    onChange={(e) =>
                      setData({
                        ...data,
                        padConfig: { ...data.padConfig, sealUrl: e.target.value },
                      })
                    }
                    placeholder="Transparent round stamp seal image URL"
                    className="w-full px-3.5 py-2 bg-slate-950 border border-slate-800 rounded-xl text-sm text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                onClick={handleSaveAll}
                disabled={saving}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold text-white bg-indigo-600 hover:bg-indigo-500 shadow-lg shadow-indigo-600/30 transition cursor-pointer"
              >
                <Save className="w-4 h-4" />
                <span>Save School Pad Settings</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: SECTION HEADINGS & METADATA */}
      {activeTab === 'section' && (
        <div className="bg-slate-900/90 rounded-2xl border border-slate-800 p-6 shadow-xl space-y-6">
          <div>
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <Sliders className="w-5 h-5 text-indigo-400" />
              <span>Public Page Titles & Bilingual Headings</span>
            </h2>
            <p className="text-xs text-slate-400 mt-1">
              Word-to-word customization of page banners, tags, and descriptive subtitles.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1.5 uppercase tracking-wider">
                Badge / Tag (English)
              </label>
              <input
                type="text"
                value={data.tag || ''}
                onChange={(e) => setData({ ...data, tag: e.target.value })}
                className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-sm text-white focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1.5 uppercase tracking-wider">
                Badge / Tag (Bengali)
              </label>
              <input
                type="text"
                value={data.tagBn || ''}
                onChange={(e) => setData({ ...data, tagBn: e.target.value })}
                className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-sm text-white focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1.5 uppercase tracking-wider">
                Page Title (English)
              </label>
              <input
                type="text"
                value={data.title || ''}
                onChange={(e) => setData({ ...data, title: e.target.value })}
                className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-sm text-white focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1.5 uppercase tracking-wider">
                Page Title (Bengali)
              </label>
              <input
                type="text"
                value={data.titleBn || ''}
                onChange={(e) => setData({ ...data, titleBn: e.target.value })}
                className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-sm text-white focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-xs font-bold text-slate-300 mb-1.5 uppercase tracking-wider">
                Banner Subtitle (English)
              </label>
              <textarea
                rows={2}
                value={data.subtitle || ''}
                onChange={(e) => setData({ ...data, subtitle: e.target.value })}
                className="w-full px-4 py-2 bg-slate-950 border border-slate-800 rounded-xl text-sm text-white focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-xs font-bold text-slate-300 mb-1.5 uppercase tracking-wider">
                Banner Subtitle (Bengali)
              </label>
              <textarea
                rows={2}
                value={data.subtitleBn || ''}
                onChange={(e) => setData({ ...data, subtitleBn: e.target.value })}
                className="w-full px-4 py-2 bg-slate-950 border border-slate-800 rounded-xl text-sm text-white focus:outline-none focus:border-indigo-500"
              />
            </div>
          </div>

          <div className="pt-2 flex justify-end">
            <button
              onClick={handleSaveAll}
              disabled={saving}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold text-white bg-indigo-600 hover:bg-indigo-500 shadow-lg shadow-indigo-600/30 transition cursor-pointer"
            >
              <Save className="w-4 h-4" />
              <span>Save Headings</span>
            </button>
          </div>
        </div>
      )}

      {/* TAB: SMS ALERT BOX & SUBSCRIBERS */}
      {activeTab === 'sms-alert' && (
        <div className="space-y-6">
          {/* Card 1: Live SMS Alert Configuration */}
          <div className="bg-slate-900/90 rounded-2xl border border-slate-800 p-6 shadow-xl space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
              <div>
                <h2 className="text-lg font-bold text-white flex items-center gap-2">
                  <Smartphone className="w-5 h-5 text-indigo-400" />
                  <span>"Get Instant Notices via SMS Alert" Section Customizer</span>
                </h2>
                <p className="text-xs text-slate-400 mt-1">
                  Control the public SMS subscription banner shown on the Notice Board page. Word-to-word bilingual customization.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={data.smsAlert?.isActive !== false}
                    onChange={(e) =>
                      setData({
                        ...data,
                        smsAlert: { ...(data.smsAlert || INITIAL_SMS_ALERT), isActive: e.target.checked },
                      })
                    }
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-slate-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-500"></div>
                  <span className="ml-3 text-xs font-bold text-slate-300">
                    {data.smsAlert?.isActive !== false ? 'Section Visible' : 'Section Hidden'}
                  </span>
                </label>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1.5 uppercase tracking-wider">
                  Banner Heading (English)
                </label>
                <input
                  type="text"
                  value={data.smsAlert?.title || ''}
                  onChange={(e) =>
                    setData({
                      ...data,
                      smsAlert: { ...(data.smsAlert || INITIAL_SMS_ALERT), title: e.target.value },
                    })
                  }
                  placeholder="Get Instant Notices via SMS Alert"
                  className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-sm text-white focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1.5 uppercase tracking-wider">
                  Banner Heading (Bengali)
                </label>
                <input
                  type="text"
                  value={data.smsAlert?.titleBn || ''}
                  onChange={(e) =>
                    setData({
                      ...data,
                      smsAlert: { ...(data.smsAlert || INITIAL_SMS_ALERT), titleBn: e.target.value },
                    })
                  }
                  placeholder="এসএমএস অ্যালার্টের মাধ্যমে নোটিশ পান"
                  className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-sm text-white focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-xs font-bold text-slate-300 mb-1.5 uppercase tracking-wider">
                  Banner Description (English)
                </label>
                <textarea
                  rows={2}
                  value={data.smsAlert?.subtitle || ''}
                  onChange={(e) =>
                    setData({
                      ...data,
                      smsAlert: { ...(data.smsAlert || INITIAL_SMS_ALERT), subtitle: e.target.value },
                    })
                  }
                  placeholder="Guardians can subscribe their mobile number..."
                  className="w-full px-4 py-2 bg-slate-950 border border-slate-800 rounded-xl text-sm text-white focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-xs font-bold text-slate-300 mb-1.5 uppercase tracking-wider">
                  Banner Description (Bengali)
                </label>
                <textarea
                  rows={2}
                  value={data.smsAlert?.subtitleBn || ''}
                  onChange={(e) =>
                    setData({
                      ...data,
                      smsAlert: { ...(data.smsAlert || INITIAL_SMS_ALERT), subtitleBn: e.target.value },
                    })
                  }
                  placeholder="অভিভাবকগণ মোবাইল নম্বর নিবন্ধন করে..."
                  className="w-full px-4 py-2 bg-slate-950 border border-slate-800 rounded-xl text-sm text-white focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1.5 uppercase tracking-wider">
                  Input Placeholder (English)
                </label>
                <input
                  type="text"
                  value={data.smsAlert?.inputPlaceholder || ''}
                  onChange={(e) =>
                    setData({
                      ...data,
                      smsAlert: { ...(data.smsAlert || INITIAL_SMS_ALERT), inputPlaceholder: e.target.value },
                    })
                  }
                  className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-sm text-white focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1.5 uppercase tracking-wider">
                  Input Placeholder (Bengali)
                </label>
                <input
                  type="text"
                  value={data.smsAlert?.inputPlaceholderBn || ''}
                  onChange={(e) =>
                    setData({
                      ...data,
                      smsAlert: { ...(data.smsAlert || INITIAL_SMS_ALERT), inputPlaceholderBn: e.target.value },
                    })
                  }
                  className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-sm text-white focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1.5 uppercase tracking-wider">
                  Button Text (English)
                </label>
                <input
                  type="text"
                  value={data.smsAlert?.buttonText || ''}
                  onChange={(e) =>
                    setData({
                      ...data,
                      smsAlert: { ...(data.smsAlert || INITIAL_SMS_ALERT), buttonText: e.target.value },
                    })
                  }
                  className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-sm text-white focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1.5 uppercase tracking-wider">
                  Button Text (Bengali)
                </label>
                <input
                  type="text"
                  value={data.smsAlert?.buttonTextBn || ''}
                  onChange={(e) =>
                    setData({
                      ...data,
                      smsAlert: { ...(data.smsAlert || INITIAL_SMS_ALERT), buttonTextBn: e.target.value },
                    })
                  }
                  className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-sm text-white focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1.5 uppercase tracking-wider">
                  Success Notification Message (English)
                </label>
                <input
                  type="text"
                  value={data.smsAlert?.successMsg || ''}
                  onChange={(e) =>
                    setData({
                      ...data,
                      smsAlert: { ...(data.smsAlert || INITIAL_SMS_ALERT), successMsg: e.target.value },
                    })
                  }
                  className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-sm text-white focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1.5 uppercase tracking-wider">
                  Success Notification Message (Bengali)
                </label>
                <input
                  type="text"
                  value={data.smsAlert?.successMsgBn || ''}
                  onChange={(e) =>
                    setData({
                      ...data,
                      smsAlert: { ...(data.smsAlert || INITIAL_SMS_ALERT), successMsgBn: e.target.value },
                    })
                  }
                  className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-sm text-white focus:outline-none focus:border-indigo-500"
                />
              </div>
            </div>

            {/* Live Visual Simulation inside Dashboard */}
            <div className="pt-2">
              <label className="block text-xs font-bold text-slate-400 mb-2 uppercase tracking-wider">
                Live Public Box Preview (Bilingual)
              </label>
              <div className="bg-gradient-to-r from-slate-950 via-slate-900 to-indigo-950 rounded-2xl p-6 border border-slate-700 text-white flex flex-col md:flex-row items-center justify-between gap-6 shadow-inner">
                <div className="space-y-1 text-center md:text-left flex-1">
                  <div className="flex items-center justify-center md:justify-start gap-2">
                    <span className="p-1.5 rounded-lg bg-amber-400/20 text-amber-400">
                      <Smartphone className="w-5 h-5" />
                    </span>
                    <h3 className="font-bold text-base sm:text-lg text-white">
                      {data.smsAlert?.titleBn || data.smsAlert?.title || 'Get Instant Notices via SMS Alert'}
                    </h3>
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed max-w-xl">
                    {data.smsAlert?.subtitleBn || data.smsAlert?.subtitle || 'Guardians can subscribe their mobile number...'}
                  </p>
                </div>

                <div className="flex flex-col sm:flex-row items-center gap-2 w-full md:w-auto">
                  <div className="px-4 py-2.5 rounded-xl bg-white/10 text-white placeholder-slate-400 border border-white/20 text-xs w-full sm:w-48">
                    {data.smsAlert?.inputPlaceholderBn || data.smsAlert?.inputPlaceholder || '017XXXXXXXX'}
                  </div>
                  <div className="px-5 py-2.5 rounded-xl bg-amber-400 text-slate-950 font-bold text-xs shadow shrink-0 text-center">
                    {data.smsAlert?.buttonTextBn || data.smsAlert?.buttonText || 'Subscribe Free'}
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                onClick={handleSaveAll}
                disabled={saving}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold text-white bg-indigo-600 hover:bg-indigo-500 shadow-lg shadow-indigo-600/30 transition cursor-pointer"
              >
                <Save className="w-4 h-4" />
                <span>Save SMS Alert Settings</span>
              </button>
            </div>
          </div>

          {/* Card 2: Registered Mobile Subscribers List */}
          <div className="bg-slate-900/90 rounded-2xl border border-slate-800 p-6 shadow-xl space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <PhoneCall className="w-5 h-5 text-emerald-400" />
                  <span>Subscribed Guardian Mobile Numbers ({subscribers.length})</span>
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Mobile numbers submitted by guardians from the public SMS alert box on Notice Board page.
                </p>
              </div>

              <button
                onClick={fetchSubscribers}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold transition"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Refresh List</span>
              </button>
            </div>

            {loadingSubscribers ? (
              <div className="py-8 text-center text-xs text-slate-400">Loading subscribers...</div>
            ) : subscribers.length === 0 ? (
              <div className="py-10 text-center bg-slate-950/60 rounded-xl border border-dashed border-slate-800 text-slate-500 text-xs">
                No mobile subscribers registered yet. Submissions from the public SMS alert box will appear here live.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="border-b border-slate-800 text-slate-400">
                      <th className="py-2.5 px-3">SL</th>
                      <th className="py-2.5 px-3">Mobile Number</th>
                      <th className="py-2.5 px-3">Status</th>
                      <th className="py-2.5 px-3">Language</th>
                      <th className="py-2.5 px-3">Subscribed Date</th>
                      <th className="py-2.5 px-3 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60 text-slate-300">
                    {subscribers.map((sub, idx) => (
                      <tr key={sub._id || sub.id || idx} className="hover:bg-slate-800/40">
                        <td className="py-2.5 px-3 font-mono text-slate-500">{idx + 1}</td>
                        <td className="py-2.5 px-3 font-mono font-bold text-white">
                          {sub.phone || sub.guardianPhone || sub.data?.phone || '—'}
                        </td>
                        <td className="py-2.5 px-3">
                          <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                            {sub.status || 'Active'}
                          </span>
                        </td>
                        <td className="py-2.5 px-3 uppercase text-[11px] text-slate-400">
                          {sub.data?.lang || 'bn'}
                        </td>
                        <td className="py-2.5 px-3 font-mono text-slate-400 text-[11px]">
                          {sub.createdAt ? new Date(sub.createdAt).toLocaleDateString() : 'Recent'}
                        </td>
                        <td className="py-2.5 px-3 text-right">
                          <button
                            onClick={async () => {
                              if (window.confirm('Delete this subscriber?')) {
                                await api.deleteSubmission(sub._id || sub.id)
                                fetchSubscribers()
                              }
                            }}
                            className="p-1 rounded text-slate-400 hover:text-rose-400 transition"
                            title="Delete subscriber"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB 4: LIVE PAD SIMULATION */}
      {activeTab === 'preview' && (
        <div className="space-y-4">
          <div className="bg-slate-900/80 p-4 rounded-2xl border border-slate-800 flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-slate-300">Preview Language:</span>
              <button
                type="button"
                onClick={() => setPreviewLang('bn')}
                className={`px-3 py-1 rounded-lg text-xs font-bold transition cursor-pointer ${
                  previewLang === 'bn' ? 'bg-indigo-600 text-white' : 'bg-slate-800 text-slate-400'
                }`}
              >
                বাংলা (Bengali)
              </button>
              <button
                type="button"
                onClick={() => setPreviewLang('en')}
                className={`px-3 py-1 rounded-lg text-xs font-bold transition cursor-pointer ${
                  previewLang === 'en' ? 'bg-indigo-600 text-white' : 'bg-slate-800 text-slate-400'
                }`}
              >
                English
              </button>
            </div>

            <div className="text-xs text-slate-400">
              Pick a notice below to preview inside the custom School Letterhead Pad:
            </div>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {data.notices?.map((n) => (
              <div
                key={n.id}
                onClick={() => setPreviewNotice(n)}
                className="p-4 rounded-xl bg-slate-900 border border-slate-800 hover:border-indigo-500/50 hover:bg-slate-800/60 transition cursor-pointer flex flex-col justify-between group"
              >
                <div>
                  <div className="flex items-center justify-between text-[11px] text-slate-400 mb-2">
                    <span className="font-bold text-indigo-400">{n.cat}</span>
                    <span className="font-mono">{n.date}</span>
                  </div>
                  <h4 className="text-sm font-bold text-slate-100 group-hover:text-indigo-300 transition line-clamp-2">
                    {previewLang === 'bn' ? n.titleBn || n.title : n.title}
                  </h4>
                </div>

                <div className="mt-3 pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs text-indigo-400 font-semibold">
                  <span>Click to Preview & Download</span>
                  <Printer className="w-4 h-4" />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Notice Add / Edit Modal */}
      {isModalOpen && editingItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm overflow-y-auto animate-fadeIn">
          <div className="relative w-full max-w-2xl bg-slate-900 border border-slate-700/80 rounded-2xl shadow-2xl overflow-hidden my-6">
            <div className="flex items-center justify-between px-6 py-4 bg-slate-800/90 border-b border-slate-700">
              <h3 className="font-bold text-base text-white flex items-center gap-2">
                <FileText className="w-5 h-5 text-indigo-400" />
                <span>{editingItem.id && data.notices.some((n) => n.id === editingItem.id) ? 'Edit Notice' : 'Add New Notice'}</span>
              </h3>
              <button
                type="button"
                onClick={() => {
                  setIsModalOpen(false)
                  setEditingItem(null)
                }}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-700 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveModalItem} className="p-6 space-y-4 max-h-[80vh] overflow-y-auto">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">
                    Notice Category (English)
                  </label>
                  <input
                    type="text"
                    required
                    value={editingItem.cat || ''}
                    onChange={(e) => setEditingItem({ ...editingItem, cat: e.target.value })}
                    placeholder="e.g. Exam, Admission, Holiday"
                    className="w-full px-3.5 py-2 bg-slate-950 border border-slate-800 rounded-xl text-sm text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">
                    Notice Category (Bengali)
                  </label>
                  <input
                    type="text"
                    value={editingItem.catBn || ''}
                    onChange={(e) => setEditingItem({ ...editingItem, catBn: e.target.value })}
                    placeholder="যেমন: পরীক্ষা, ভর্তি, ছুটি"
                    className="w-full px-3.5 py-2 bg-slate-950 border border-slate-800 rounded-xl text-sm text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">
                  Notice Title (English)
                </label>
                <input
                  type="text"
                  required
                  value={editingItem.title || ''}
                  onChange={(e) => setEditingItem({ ...editingItem, title: e.target.value })}
                  placeholder="Official Notice Title in English"
                  className="w-full px-3.5 py-2 bg-slate-950 border border-slate-800 rounded-xl text-sm text-white focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">
                  Notice Title (Bengali)
                </label>
                <input
                  type="text"
                  value={editingItem.titleBn || ''}
                  onChange={(e) => setEditingItem({ ...editingItem, titleBn: e.target.value })}
                  placeholder="বাংলায় নোটিশ শিরোনাম"
                  className="w-full px-3.5 py-2 bg-slate-950 border border-slate-800 rounded-xl text-sm text-white focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">
                  Notice Body Text (English)
                </label>
                <textarea
                  rows={3}
                  value={editingItem.text || ''}
                  onChange={(e) => setEditingItem({ ...editingItem, text: e.target.value })}
                  placeholder="Comprehensive announcement details..."
                  className="w-full px-3.5 py-2 bg-slate-950 border border-slate-800 rounded-xl text-sm text-white focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">
                  Notice Body Text (Bengali)
                </label>
                <textarea
                  rows={3}
                  value={editingItem.textBn || ''}
                  onChange={(e) => setEditingItem({ ...editingItem, textBn: e.target.value })}
                  placeholder="বিস্তারিত বিজ্ঞপ্তির বিবরণ..."
                  className="w-full px-3.5 py-2 bg-slate-950 border border-slate-800 rounded-xl text-sm text-white focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">
                    Memo Reference No.
                  </label>
                  <input
                    type="text"
                    value={editingItem.memoNo || ''}
                    onChange={(e) => setEditingItem({ ...editingItem, memoNo: e.target.value })}
                    placeholder="MA/ADM/2026/01"
                    className="w-full px-3.5 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">
                    Date (English)
                  </label>
                  <input
                    type="text"
                    value={editingItem.date || ''}
                    onChange={(e) => setEditingItem({ ...editingItem, date: e.target.value })}
                    className="w-full px-3.5 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">
                    Date (Bengali)
                  </label>
                  <input
                    type="text"
                    value={editingItem.dateBn || ''}
                    onChange={(e) => setEditingItem({ ...editingItem, dateBn: e.target.value })}
                    className="w-full px-3.5 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">
                    Author / Desk (English)
                  </label>
                  <input
                    type="text"
                    value={editingItem.author || ''}
                    onChange={(e) => setEditingItem({ ...editingItem, author: e.target.value })}
                    className="w-full px-3.5 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">
                    Author / Desk (Bengali)
                  </label>
                  <input
                    type="text"
                    value={editingItem.authorBn || ''}
                    onChange={(e) => setEditingItem({ ...editingItem, authorBn: e.target.value })}
                    className="w-full px-3.5 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>

              {/* Toggles */}
              <div className="flex items-center gap-6 pt-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={editingItem.pinned || false}
                    onChange={(e) => setEditingItem({ ...editingItem, pinned: e.target.checked })}
                    className="w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500"
                  />
                  <span className="text-xs font-semibold text-slate-300">Pin as Urgent Notice</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={editingItem.isActive !== false}
                    onChange={(e) => setEditingItem({ ...editingItem, isActive: e.target.checked })}
                    className="w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500"
                  />
                  <span className="text-xs font-semibold text-slate-300">Active / Published</span>
                </label>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => {
                    setIsModalOpen(false)
                    setEditingItem(null)
                  }}
                  className="px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold text-slate-400 hover:text-white bg-slate-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl text-xs sm:text-sm font-bold text-white bg-indigo-600 hover:bg-indigo-500 shadow-md"
                >
                  Save Notice
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Alert */}
      {deleteTarget && (
        <NoticeDeleteAlert
          notice={deleteTarget}
          deleting={deleting}
          onConfirm={handleDeleteItem}
          onCancel={() => setDeleteTarget(null)}
        />
      )}

      {/* Notice Pad Printable Modal */}
      {previewNotice && (
        <NoticePadModal
          notice={previewNotice}
          padConfig={data.padConfig}
          lang={previewLang}
          onClose={() => setPreviewNotice(null)}
        />
      )}
    </div>
  )
}
