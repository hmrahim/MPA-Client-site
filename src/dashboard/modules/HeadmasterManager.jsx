import { useState, useEffect, useRef } from 'react'
import {
  Award,
  UploadCloud,
  Check,
  X,
  Plus,
  Trash2,
  RotateCcw,
  Save,
  Eye,
  Sparkles,
  Image as ImageIcon,
  Link as LinkIcon,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  ExternalLink,
  ShieldCheck,
  Star,
  Users,
  ArrowRight,
  Globe,
  Loader2,
} from 'lucide-react'
import api from '../../lib/api'
import { uploadToImgbb } from '../../lib/imgbb'

const PRESET_PORTRAITS = [
  {
    label: 'Current Headmaster',
    url: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=800&q=80',
  },
  {
    label: 'Academic Dignitary 1',
    url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80',
  },
  {
    label: 'Academic Dignitary 2',
    url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=800&q=80',
  },
  {
    label: 'Academic Dignitary 3',
    url: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=800&q=80',
  },
]

const INITIAL_DATA = {
  isActive: true,
  name: 'Mr. Md. Abdul Jalil Mia',
  nameBn: 'জনাব মো. আবদুল জলিল মিয়া',
  role: 'Headmaster',
  roleBn: 'প্রধান শিক্ষক',
  degree: 'M.Sc (Physics), M.Ed (1st Class, DU) · 22+ Years in Secondary Education',
  degreeBn: 'এম.এসসি (পদার্থবিজ্ঞান), এম.এড (প্রথম শ্রেণি, ঢাবি) · শিক্ষাক্ষেত্রে ২২+ বছরের অভিজ্ঞতা',
  imageUrl: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=800&q=80',
  imageAlt: 'Headmaster Mr. Md. Abdul Jalil Mia',

  showBadge: true,
  badgeText: 'Ranked Top Model General Secondary School in the District',
  badgeTextBn: 'উপজেলা ও জেলা পর্যায়ের সেরা মডেল মাধ্যমিক বিদ্যালয়',
  badgeIcon: '★',

  tag: 'Welcome to Mirashani Academy',
  tagBn: 'মিরাশানী একাডেমিতে স্বাগতম',
  title: 'Inspiring Moral Character, Creative Thought & Academic Excellence',
  titleBn: 'নৈতিক চরিত্র, সৃজনশীল চিন্তা ও সাধারণ শিক্ষায় শ্রেষ্ঠত্ব',

  description:
    'Established in 2005, Mirashani Academy is a premier general secondary high school (Classes 6 to 10) dedicated to cultivating enlightened human beings. Following the National Curriculum (NCTB) and Board of Intermediate and Secondary Education standards, we nurture students through disciplined morning assemblies, well-equipped science laboratories, rich library reading habits, and communicative fluency.',
  descriptionBn:
    '২০০৫ সালে প্রতিষ্ঠিত মিরাশানী একাডেমি জাতীয় শিক্ষাক্রম ও পাঠ্যপুস্তক বোর্ড (NCTB) এবং মাধ্যমিক ও উচ্চ মাধ্যমিক শিক্ষা বোর্ডের অধীনে পরিচালিত একটি প্রথম সারির সাধারণ মাধ্যমিক বিদ্যালয়। আমরা কেবল পুঁথিগত শিক্ষায় সীমাবদ্ধ না থেকে প্রতিটি শিক্ষার্থীর নৈতিক চরিত্র, দেশপ্রেম, নিয়মানুবর্তিতা ও বিজ্ঞানমনস্ক দৃষ্টিভঙ্গি গঠনে নিবেদিতপ্রাণ।',

  showEmpowerBox: true,
  empowerIcon: '🌱',
  empowerText: 'We empower students through:',
  empowerTextBn: 'আমরা শিক্ষার্থীদের গড়ে তুলি:',
  empowerSkills: [
    'Creative Thinking & Problem Solving',
    'ICT & Coding Literacy',
    'Moral Discipline & Leadership',
    'Science & Practical Innovation',
  ],
  empowerSkillsBn: [
    'সৃজনশীল চিন্তা ও সমস্যা সমাধান',
    'আইসিটি ও ডিজিটাল স্বাক্ষরতা',
    'নৈতিক মূল্যবোধ ও নেতৃত্ব',
    'বিজ্ঞানচর্চা ও ব্যবহারিক উদ্ভাবন',
  ],

  features: [
    {
      id: '1',
      text: 'Modern Science Labs (Physics, Chemistry, Biology)',
      textBn: 'আধুনিক বিজ্ঞান ল্যাব (পদার্থ, রসায়ন ও জীববিজ্ঞান)',
      icon: 'check',
    },
    {
      id: '2',
      text: 'Digital Multimedia Classrooms & ICT Computer Center',
      textBn: 'ডিজিটাল মাল্টিমিডিয়া ক্লাসরুম ও কম্পিউটার আইসিটি ল্যাব',
      icon: 'check',
    },
    {
      id: '3',
      text: 'Active Scouts, Girl Guides & Debating Clubs',
      textBn: 'সক্রিয় বাংলাদেশ স্কাউটস, গার্ল গাইডস ও বিতর্ক পরিষদ',
      icon: 'check',
    },
    {
      id: '4',
      text: 'Large Sports Field, Shaheed Minar & Cultural Stage',
      textBn: 'প্রশস্ত সবুজ খেলার মাঠ, স্থায়ী শহীদ মিনার ও সাংস্কৃতিক মঞ্চ',
      icon: 'check',
    },
  ],

  btn1Show: true,
  btn1Text: 'General School Curriculum',
  btn1TextBn: 'সাধারণ শিক্ষাক্রম জানুন',
  btn1Link: '/academics',

  btn2Show: true,
  btn2Text: 'Meet Respected Teachers',
  btn2TextBn: 'শ্রদ্ধেয় শিক্ষকমণ্ডলী',
  btn2Link: '/teachers',
}

export default function HeadmasterManager() {
  const [data, setData] = useState(INITIAL_DATA)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [toast, setToast] = useState(null)
  const [uploadingImage, setUploadingImage] = useState(false)
  const [previewLang, setPreviewLang] = useState('bn') // 'bn' | 'en'
  const [activeTab, setActiveTab] = useState('persona') // 'persona' | 'badge' | 'content' | 'features' | 'actions'
  const fileInputRef = useRef(null)

  const showToast = (message, type = 'success') => {
    setToast({ message, type })
    setTimeout(() => setToast(null), 4000)
  }

  // Load Headmaster Data from Backend / LocalStorage
  const loadData = async () => {
    setLoading(true)
    try {
      const cached = localStorage.getItem('mpa_headmaster_section')
      if (cached) {
        setData(JSON.parse(cached))
      }

      const res = await api.getHeadmaster()
      if (res && res.success && res.data) {
        setData(res.data)
        localStorage.setItem('mpa_headmaster_section', JSON.stringify(res.data))
      }
    } catch (err) {
      console.warn('Could not load from API, using cached data', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadData()
  }, [])

  // Save changes to API & LocalStorage
  const handleSave = async (e) => {
    if (e) e.preventDefault()
    setSaving(true)
    try {
      const res = await api.updateHeadmaster(data)
      if (res && res.success) {
        setData(res.data)
        localStorage.setItem('mpa_headmaster_section', JSON.stringify(res.data))
        showToast('Headmaster section updated successfully! 🚀')
      } else {
        localStorage.setItem('mpa_headmaster_section', JSON.stringify(data))
        showToast('Saved locally in browser!', 'success')
      }
    } catch (err) {
      console.error(err)
      localStorage.setItem('mpa_headmaster_section', JSON.stringify(data))
      showToast('Saved locally in browser!', 'success')
    } finally {
      setSaving(false)
    }
  }

  // Reset to school default content
  const handleReset = async () => {
    if (!window.confirm('Reset all Headmaster section data to school defaults?')) return
    setSaving(true)
    try {
      const res = await api.resetHeadmaster()
      if (res && res.success) {
        setData(res.data)
        localStorage.setItem('mpa_headmaster_section', JSON.stringify(res.data))
        showToast('Restored school defaults!')
      } else {
        setData(INITIAL_DATA)
        localStorage.setItem('mpa_headmaster_section', JSON.stringify(INITIAL_DATA))
        showToast('Restored defaults locally!')
      }
    } catch (err) {
      setData(INITIAL_DATA)
      localStorage.setItem('mpa_headmaster_section', JSON.stringify(INITIAL_DATA))
      showToast('Restored defaults locally!')
    } finally {
      setSaving(false)
    }
  }

  // Upload local image directly to ImgBB
  const handleFileSelect = async (e) => {
    const file = e.target.files?.[0]
    if (!file) return

    if (!file.type.startsWith('image/')) {
      showToast('Please select a valid image file (PNG, JPG, WebP)', 'error')
      return
    }

    setUploadingImage(true)
    try {
      const res = await uploadToImgbb(file)
      if (res && res.success && res.url) {
        setData((prev) => ({ ...prev, imageUrl: res.url }))
        showToast('Portrait image uploaded to ImgBB! ☁️')
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

  // Feature Points Management
  const addFeature = () => {
    const newFeature = {
      id: Date.now().toString(),
      text: 'New Academic Facility / Highlight',
      textBn: 'নতুন প্রাতিষ্ঠানিক সুযোগ-সুবিধা',
      icon: 'check',
    }
    setData((prev) => ({
      ...prev,
      features: [...(prev.features || []), newFeature],
    }))
  }

  const updateFeature = (index, field, value) => {
    setData((prev) => {
      const updated = [...(prev.features || [])]
      updated[index] = { ...updated[index], [field]: value }
      return { ...prev, features: updated }
    })
  }

  const removeFeature = (index) => {
    setData((prev) => ({
      ...prev,
      features: (prev.features || []).filter((_, i) => i !== index),
    }))
  }

  // Empower Skills Management
  const addSkill = (langKey) => {
    const val = prompt('Enter keyword or phrase to add:')
    if (!val || !val.trim()) return
    setData((prev) => ({
      ...prev,
      [langKey]: [...(prev[langKey] || []), val.trim()],
    }))
  }

  const removeSkill = (langKey, index) => {
    setData((prev) => ({
      ...prev,
      [langKey]: (prev[langKey] || []).filter((_, i) => i !== index),
    }))
  }

  if (loading) {
    return (
      <div className="p-12 flex flex-col items-center justify-center gap-3">
        <Loader2 className="w-8 h-8 text-[#6c63ff] animate-spin" />
        <span className="text-sm font-bold text-slate-400">Loading Headmaster Section...</span>
      </div>
    )
  }

  return (
    <div className="space-y-6 pb-16">
      {/* Toast Notification */}
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

      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-2xl bg-gradient-to-r from-[#181824] via-[#151520] to-[#12121c] border border-[#222234] shadow-lg">
        <div>
          <div className="flex items-center gap-2.5">
            <span className="p-2 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
              <Award className="w-5 h-5" />
            </span>
            <div>
              <span className="text-[11px] font-extrabold uppercase tracking-widest text-emerald-400">
                Website CMS · Homepage
              </span>
              <h1 className="text-xl sm:text-2xl font-black text-white font-display">
                Headmaster Welcome & Vision Section
              </h1>
            </div>
          </div>
          <p className="text-xs text-slate-400 mt-2 max-w-2xl leading-relaxed">
            Manage the headmaster's photo, floating top-ranked badge, greeting speech, school vision, facility bullets, and buttons in real time.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            type="button"
            onClick={handleReset}
            className="px-3.5 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 border border-white/10 text-xs font-bold transition flex items-center gap-1.5"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Defaults</span>
          </button>

          <a
            href="/#headmaster"
            target="_blank"
            rel="noreferrer"
            className="px-3.5 py-2 rounded-xl bg-[#6c63ff]/20 text-[#a78bfa] hover:bg-[#6c63ff]/30 border border-[#6c63ff]/30 text-xs font-bold transition flex items-center gap-1.5"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            <span>View Public Site</span>
          </a>

          <button
            type="button"
            onClick={handleSave}
            disabled={saving}
            className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#6c63ff] to-[#8b5cf6] text-white font-bold text-xs shadow-lg shadow-[#6c63ff]/30 hover:opacity-90 active:scale-95 transition flex items-center gap-2 disabled:opacity-50"
          >
            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            <span>{saving ? 'Saving...' : 'Save All Changes'}</span>
          </button>
        </div>
      </div>

      {/* Main Grid: Left Editor + Right Live Preview */}
      <div className="grid lg:grid-cols-12 gap-6 items-start">

        {/* ── LEFT: Content Configuration Form (7 cols) ── */}
        <div className="lg:col-span-7 space-y-5">

          {/* Section Visibility Card */}
          <div className="p-4 rounded-xl bg-[#14141e] border border-[#252538] flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className={`w-3 h-3 rounded-full ${data.isActive ? 'bg-emerald-400 shadow-[0_0_10px_#10b981]' : 'bg-slate-600'}`} />
              <div>
                <p className="text-sm font-bold text-white">Publish on Homepage</p>
                <p className="text-xs text-slate-400">Toggle whether this section appears on the public website</p>
              </div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={data.isActive}
                onChange={(e) => setData({ ...data, isActive: e.target.checked })}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-[#252538] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#6c63ff]"></div>
            </label>
          </div>

          {/* Navigation Tabs */}
          <div className="flex overflow-x-auto gap-2 p-1.5 rounded-xl bg-[#14141e] border border-[#252538] creative-tab-scroll pb-2">
            {[
              { id: 'persona', label: '1. Photo & Headmaster', icon: ImageIcon },
              { id: 'badge', label: '2. Ranked Badge (★)', icon: Star },
              { id: 'content', label: '3. Message & Vision', icon: Globe },
              { id: 'features', label: '4. Highlights & Facilities', icon: CheckCircle2 },
              { id: 'actions', label: '5. Action Buttons', icon: LinkIcon },
            ].map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-bold whitespace-nowrap transition ${
                  activeTab === tab.id
                    ? 'bg-[#6c63ff] text-white shadow-md'
                    : 'text-slate-400 hover:text-white hover:bg-white/5'
                }`}
              >
                <tab.icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
              </button>
            ))}
          </div>

          {/* ── TAB 1: Photo & Persona ── */}
          {activeTab === 'persona' && (
            <div className="p-5 rounded-2xl bg-[#14141e] border border-[#252538] space-y-4">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <ImageIcon className="w-4 h-4 text-[#a78bfa]" />
                Headmaster Portrait & Identity
              </h3>

              {/* Image Picker */}
              <div className="space-y-3">
                <label className="text-xs font-bold text-slate-300">Portrait Image Source</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={data.imageUrl}
                    onChange={(e) => setData({ ...data, imageUrl: e.target.value })}
                    placeholder="https://... image URL"
                    className="flex-1 bg-[#0e0e14] border border-[#26263a] rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-[#6c63ff]"
                  />
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileSelect}
                    accept="image/*"
                    className="hidden"
                  />
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={uploadingImage}
                    className="px-4 py-2.5 rounded-xl bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-xs font-bold hover:bg-emerald-500/30 transition flex items-center gap-1.5 shrink-0"
                  >
                    {uploadingImage ? <Loader2 className="w-4 h-4 animate-spin" /> : <UploadCloud className="w-4 h-4" />}
                    <span>{uploadingImage ? 'Uploading...' : 'Upload ImgBB'}</span>
                  </button>
                </div>

                {/* Portrait Presets */}
                <div className="flex flex-wrap items-center gap-2 pt-1">
                  <span className="text-[10px] text-slate-500 font-bold uppercase">Presets:</span>
                  {PRESET_PORTRAITS.map((p, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => setData({ ...data, imageUrl: p.url })}
                      className={`text-[11px] px-2.5 py-1 rounded-md border transition ${
                        data.imageUrl === p.url
                          ? 'bg-[#6c63ff]/20 text-[#a78bfa] border-[#6c63ff]/40 font-bold'
                          : 'bg-white/5 text-slate-400 border-white/5 hover:text-white'
                      }`}
                    >
                      {p.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Name (English & Bengali) */}
              <div className="grid sm:grid-cols-2 gap-3 pt-2">
                <div>
                  <label className="text-xs font-bold text-slate-300">Name (English)</label>
                  <input
                    type="text"
                    value={data.name}
                    onChange={(e) => setData({ ...data, name: e.target.value })}
                    className="w-full mt-1 bg-[#0e0e14] border border-[#26263a] rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#6c63ff]"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-300">নাম (বাংলা)</label>
                  <input
                    type="text"
                    value={data.nameBn}
                    onChange={(e) => setData({ ...data, nameBn: e.target.value })}
                    className="w-full mt-1 bg-[#0e0e14] border border-[#26263a] rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#6c63ff]"
                  />
                </div>
              </div>

              {/* Role (English & Bengali) */}
              <div className="grid sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-300">Designation (English)</label>
                  <input
                    type="text"
                    value={data.role}
                    onChange={(e) => setData({ ...data, role: e.target.value })}
                    className="w-full mt-1 bg-[#0e0e14] border border-[#26263a] rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#6c63ff]"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-300">পদবি (বাংলা)</label>
                  <input
                    type="text"
                    value={data.roleBn}
                    onChange={(e) => setData({ ...data, roleBn: e.target.value })}
                    className="w-full mt-1 bg-[#0e0e14] border border-[#26263a] rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#6c63ff]"
                  />
                </div>
              </div>

              {/* Degree / Experience (English & Bengali) */}
              <div className="grid sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-300">Degree & Experience (English)</label>
                  <input
                    type="text"
                    value={data.degree}
                    onChange={(e) => setData({ ...data, degree: e.target.value })}
                    className="w-full mt-1 bg-[#0e0e14] border border-[#26263a] rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#6c63ff]"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-300">ডিগ্রি ও অভিজ্ঞতা (বাংলা)</label>
                  <input
                    type="text"
                    value={data.degreeBn}
                    onChange={(e) => setData({ ...data, degreeBn: e.target.value })}
                    className="w-full mt-1 bg-[#0e0e14] border border-[#26263a] rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#6c63ff]"
                  />
                </div>
              </div>
            </div>
          )}

          {/* ── TAB 2: Ranked Top Floating Badge ── */}
          {activeTab === 'badge' && (
            <div className="p-5 rounded-2xl bg-[#14141e] border border-[#252538] space-y-4">
              <div className="flex items-center justify-between border-b border-[#252538] pb-3">
                <div>
                  <h3 className="text-sm font-bold text-white flex items-center gap-2">
                    <Star className="w-4 h-4 text-amber-400" />
                    Floating Model / Ranked Badge (Photo Overlay)
                  </h3>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Controls the prestigious badge model that floats on the corner of the headmaster's photo.
                  </p>
                </div>

                {/* Show/Hide Badge Checkbox */}
                <label className="flex items-center gap-2 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={data.showBadge}
                    onChange={(e) => setData({ ...data, showBadge: e.target.checked })}
                    className="w-4 h-4 rounded text-amber-500 bg-[#0e0e14] border-[#26263a] focus:ring-0"
                  />
                  <span className="text-xs font-bold text-amber-400">Show Badge</span>
                </label>
              </div>

              {/* Badge Icon Picker */}
              <div>
                <label className="text-xs font-bold text-slate-300">Badge Icon / Emoji</label>
                <div className="flex items-center gap-2 mt-1">
                  <input
                    type="text"
                    value={data.badgeIcon}
                    onChange={(e) => setData({ ...data, badgeIcon: e.target.value })}
                    className="w-20 bg-[#0e0e14] border border-[#26263a] rounded-xl px-3 py-2 text-center text-sm font-bold text-white focus:outline-none focus:border-[#6c63ff]"
                  />
                  <div className="flex gap-1.5">
                    {['★', '🏆', '🥇', '🎖️', '👑', '✨'].map((emoji) => (
                      <button
                        key={emoji}
                        type="button"
                        onClick={() => setData({ ...data, badgeIcon: emoji })}
                        className="w-8 h-8 rounded-lg bg-white/5 hover:bg-white/10 text-white text-sm grid place-items-center border border-white/5 transition"
                      >
                        {emoji}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Badge Text (English & Bengali) */}
              <div className="space-y-3">
                <div>
                  <label className="text-xs font-bold text-slate-300">Badge Text (English)</label>
                  <input
                    type="text"
                    value={data.badgeText}
                    onChange={(e) => setData({ ...data, badgeText: e.target.value })}
                    placeholder="e.g. Ranked Top Model General Secondary School in the District"
                    className="w-full mt-1 bg-[#0e0e14] border border-[#26263a] rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-[#6c63ff]"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-300">ব্যাজ টেক্সট (বাংলা)</label>
                  <input
                    type="text"
                    value={data.badgeTextBn}
                    onChange={(e) => setData({ ...data, badgeTextBn: e.target.value })}
                    placeholder="e.g. উপজেলা ও জেলা পর্যায়ের সেরা মডেল মাধ্যমিক বিদ্যালয়"
                    className="w-full mt-1 bg-[#0e0e14] border border-[#26263a] rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-[#6c63ff]"
                  />
                </div>
              </div>
            </div>
          )}

          {/* ── TAB 3: Message & Vision Content ── */}
          {activeTab === 'content' && (
            <div className="p-5 rounded-2xl bg-[#14141e] border border-[#252538] space-y-4">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Globe className="w-4 h-4 text-[#a78bfa]" />
                Section Title, Heading & Speech Body
              </h3>

              {/* Tag / Header pill */}
              <div className="grid sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-300">Tagline Pill (English)</label>
                  <input
                    type="text"
                    value={data.tag}
                    onChange={(e) => setData({ ...data, tag: e.target.value })}
                    className="w-full mt-1 bg-[#0e0e14] border border-[#26263a] rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#6c63ff]"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-300">ট্যাগ পিল (বাংলা)</label>
                  <input
                    type="text"
                    value={data.tagBn}
                    onChange={(e) => setData({ ...data, tagBn: e.target.value })}
                    className="w-full mt-1 bg-[#0e0e14] border border-[#26263a] rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#6c63ff]"
                  />
                </div>
              </div>

              {/* Main Title Heading */}
              <div className="grid sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-300">Main Title (English)</label>
                  <input
                    type="text"
                    value={data.title}
                    onChange={(e) => setData({ ...data, title: e.target.value })}
                    className="w-full mt-1 bg-[#0e0e14] border border-[#26263a] rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#6c63ff]"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-300">প্রধান শিরোনাম (বাংলা)</label>
                  <input
                    type="text"
                    value={data.titleBn}
                    onChange={(e) => setData({ ...data, titleBn: e.target.value })}
                    className="w-full mt-1 bg-[#0e0e14] border border-[#26263a] rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#6c63ff]"
                  />
                </div>
              </div>

              {/* Full Speech / Description Paragraph */}
              <div className="space-y-3 pt-2">
                <div>
                  <label className="text-xs font-bold text-slate-300">Welcome Speech Body (English)</label>
                  <textarea
                    rows={4}
                    value={data.description}
                    onChange={(e) => setData({ ...data, description: e.target.value })}
                    className="w-full mt-1 bg-[#0e0e14] border border-[#26263a] rounded-xl p-3 text-xs text-white focus:outline-none focus:border-[#6c63ff] leading-relaxed creative-textarea-scroll"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-300">বক্তব্যের মূল বিবরণ (বাংলা)</label>
                  <textarea
                    rows={4}
                    value={data.descriptionBn}
                    onChange={(e) => setData({ ...data, descriptionBn: e.target.value })}
                    className="w-full mt-1 bg-[#0e0e14] border border-[#26263a] rounded-xl p-3 text-xs text-white focus:outline-none focus:border-[#6c63ff] leading-relaxed creative-textarea-scroll"
                  />
                </div>
              </div>

              {/* Empower Box Toggle & Settings */}
              <div className="p-4 rounded-xl bg-[#181826] border border-[#252538] space-y-3 mt-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-lg">{data.empowerIcon}</span>
                    <span className="text-xs font-bold text-white">Empower Quote Box</span>
                  </div>
                  <label className="flex items-center gap-2 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={data.showEmpowerBox}
                      onChange={(e) => setData({ ...data, showEmpowerBox: e.target.checked })}
                      className="w-4 h-4 rounded text-[#6c63ff] bg-[#0e0e14] border-[#26263a]"
                    />
                    <span className="text-xs font-bold text-slate-300">Show Empower Box</span>
                  </label>
                </div>

                <div className="grid sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-[11px] font-bold text-slate-400">Prefix Text (English)</label>
                    <input
                      type="text"
                      value={data.empowerText}
                      onChange={(e) => setData({ ...data, empowerText: e.target.value })}
                      className="w-full mt-1 bg-[#0e0e14] border border-[#26263a] rounded-lg px-2.5 py-1.5 text-xs text-white"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] font-bold text-slate-400">প্রিফিক্স টেক্সট (বাংলা)</label>
                    <input
                      type="text"
                      value={data.empowerTextBn}
                      onChange={(e) => setData({ ...data, empowerTextBn: e.target.value })}
                      className="w-full mt-1 bg-[#0e0e14] border border-[#26263a] rounded-lg px-2.5 py-1.5 text-xs text-white"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ── TAB 4: Highlights & Facilities Checklist ── */}
          {activeTab === 'features' && (
            <div className="p-5 rounded-2xl bg-[#14141e] border border-[#252538] space-y-4">
              <div className="flex items-center justify-between border-b border-[#252538] pb-3">
                <div>
                  <h3 className="text-sm font-bold text-white flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    Key Facilities & Checklist Points
                  </h3>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Green checkmarked facility highlights shown beneath the speech.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={addFeature}
                  className="px-3 py-1.5 rounded-lg bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-xs font-bold hover:bg-emerald-500/30 transition flex items-center gap-1"
                >
                  <Plus className="w-3.5 h-3.5" /> Add Point
                </button>
              </div>

              <div className="space-y-3">
                {(data.features || []).map((feat, idx) => (
                  <div
                    key={feat.id || idx}
                    className="p-3.5 rounded-xl bg-[#181826] border border-[#252538] space-y-2 relative group"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-bold text-emerald-400 flex items-center gap-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5" /> Point #{idx + 1}
                      </span>
                      <button
                        type="button"
                        onClick={() => removeFeature(idx)}
                        className="p-1 rounded-md text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 transition"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <div className="grid sm:grid-cols-2 gap-2">
                      <input
                        type="text"
                        value={feat.text}
                        onChange={(e) => updateFeature(idx, 'text', e.target.value)}
                        placeholder="English point..."
                        className="bg-[#0e0e14] border border-[#26263a] rounded-lg px-2.5 py-1.5 text-xs text-white"
                      />
                      <input
                        type="text"
                        value={feat.textBn}
                        onChange={(e) => updateFeature(idx, 'textBn', e.target.value)}
                        placeholder="বাংলা পয়েন্ট..."
                        className="bg-[#0e0e14] border border-[#26263a] rounded-lg px-2.5 py-1.5 text-xs text-white"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ── TAB 5: Action Buttons (CTA) ── */}
          {activeTab === 'actions' && (
            <div className="p-5 rounded-2xl bg-[#14141e] border border-[#252538] space-y-4">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <LinkIcon className="w-4 h-4 text-[#a78bfa]" />
                Call To Action Buttons
              </h3>

              {/* Button 1 */}
              <div className="p-4 rounded-xl bg-[#181826] border border-[#252538] space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-white">Button 1 (Primary - Curriculum)</span>
                  <label className="flex items-center gap-2 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={data.btn1Show}
                      onChange={(e) => setData({ ...data, btn1Show: e.target.checked })}
                      className="w-4 h-4 rounded text-[#6c63ff] bg-[#0e0e14] border-[#26263a]"
                    />
                    <span className="text-xs font-bold text-slate-300">Show Button 1</span>
                  </label>
                </div>

                <div className="grid sm:grid-cols-3 gap-2.5">
                  <div>
                    <label className="text-[11px] font-bold text-slate-400">Text (English)</label>
                    <input
                      type="text"
                      value={data.btn1Text}
                      onChange={(e) => setData({ ...data, btn1Text: e.target.value })}
                      className="w-full mt-1 bg-[#0e0e14] border border-[#26263a] rounded-lg px-2.5 py-1.5 text-xs text-white"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] font-bold text-slate-400">টেক্সট (বাংলা)</label>
                    <input
                      type="text"
                      value={data.btn1TextBn}
                      onChange={(e) => setData({ ...data, btn1TextBn: e.target.value })}
                      className="w-full mt-1 bg-[#0e0e14] border border-[#26263a] rounded-lg px-2.5 py-1.5 text-xs text-white"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] font-bold text-slate-400">Target Link</label>
                    <input
                      type="text"
                      value={data.btn1Link}
                      onChange={(e) => setData({ ...data, btn1Link: e.target.value })}
                      className="w-full mt-1 bg-[#0e0e14] border border-[#26263a] rounded-lg px-2.5 py-1.5 text-xs text-white"
                    />
                  </div>
                </div>
              </div>

              {/* Button 2 */}
              <div className="p-4 rounded-xl bg-[#181826] border border-[#252538] space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-white">Button 2 (Secondary - Teachers)</span>
                  <label className="flex items-center gap-2 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={data.btn2Show}
                      onChange={(e) => setData({ ...data, btn2Show: e.target.checked })}
                      className="w-4 h-4 rounded text-[#6c63ff] bg-[#0e0e14] border-[#26263a]"
                    />
                    <span className="text-xs font-bold text-slate-300">Show Button 2</span>
                  </label>
                </div>

                <div className="grid sm:grid-cols-3 gap-2.5">
                  <div>
                    <label className="text-[11px] font-bold text-slate-400">Text (English)</label>
                    <input
                      type="text"
                      value={data.btn2Text}
                      onChange={(e) => setData({ ...data, btn2Text: e.target.value })}
                      className="w-full mt-1 bg-[#0e0e14] border border-[#26263a] rounded-lg px-2.5 py-1.5 text-xs text-white"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] font-bold text-slate-400">টেক্সট (বাংলা)</label>
                    <input
                      type="text"
                      value={data.btn2TextBn}
                      onChange={(e) => setData({ ...data, btn2TextBn: e.target.value })}
                      className="w-full mt-1 bg-[#0e0e14] border border-[#26263a] rounded-lg px-2.5 py-1.5 text-xs text-white"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] font-bold text-slate-400">Target Link</label>
                    <input
                      type="text"
                      value={data.btn2Link}
                      onChange={(e) => setData({ ...data, btn2Link: e.target.value })}
                      className="w-full mt-1 bg-[#0e0e14] border border-[#26263a] rounded-lg px-2.5 py-1.5 text-xs text-white"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Bottom Save Bar */}
          <div className="pt-2 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={handleSave}
              disabled={saving}
              className="px-6 py-3 rounded-xl bg-gradient-to-r from-[#6c63ff] to-[#8b5cf6] text-white font-bold text-sm shadow-xl shadow-[#6c63ff]/30 hover:opacity-95 active:scale-95 transition flex items-center gap-2 disabled:opacity-50"
            >
              {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
              <span>{saving ? 'Saving Changes...' : 'Save & Publish Live'}</span>
            </button>
          </div>
        </div>

        {/* ── RIGHT: Real-time Live Website Preview (5 cols) ── */}
        <div className="lg:col-span-5 sticky top-6 space-y-3">
          <div className="flex items-center justify-between px-1">
            <span className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
              <Eye className="w-3.5 h-3.5 text-[#a78bfa]" />
              Real-time Live Preview
            </span>
            {/* Language preview toggle */}
            <div className="flex rounded-lg bg-[#14141e] border border-[#252538] p-0.5">
              <button
                type="button"
                onClick={() => setPreviewLang('bn')}
                className={`px-2 py-0.5 rounded text-[10px] font-bold transition ${
                  previewLang === 'bn' ? 'bg-[#6c63ff] text-white' : 'text-slate-400 hover:text-white'
                }`}
              >
                বাংলা
              </button>
              <button
                type="button"
                onClick={() => setPreviewLang('en')}
                className={`px-2 py-0.5 rounded text-[10px] font-bold transition ${
                  previewLang === 'en' ? 'bg-[#6c63ff] text-white' : 'text-slate-400 hover:text-white'
                }`}
              >
                English
              </button>
            </div>
          </div>

          {/* Preview Window Frame */}
          <div className="rounded-2xl border border-[#252538] bg-[#f8f6fc] text-slate-900 p-5 shadow-2xl overflow-hidden space-y-5">
            {/* Simulated Headmaster Card */}
            <div className="relative">
              <div className="relative rounded-2xl overflow-hidden shadow-xl border-2 border-white aspect-[4/5] bg-slate-800">
                <img
                  src={data.imageUrl}
                  alt={data.imageAlt || 'Headmaster'}
                  className="w-full h-full object-cover object-top"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent" />
                <div className="absolute bottom-4 left-4 right-4 text-white">
                  <span className="text-[10px] uppercase tracking-wider text-amber-300 font-bold">
                    {previewLang === 'bn' ? data.roleBn || data.role : data.role}
                  </span>
                  <h4 className="font-bold text-base text-white truncate">
                    {previewLang === 'bn' ? data.nameBn || data.name : data.name}
                  </h4>
                  <p className="text-[10px] text-slate-200 line-clamp-1">
                    {previewLang === 'bn' ? data.degreeBn || data.degree : data.degree}
                  </p>
                </div>
              </div>

              {/* Floating Top-Ranked Badge Preview */}
              {data.showBadge && (
                <div className="absolute -bottom-4 -right-2 bg-white p-2.5 rounded-xl shadow-xl border border-slate-200 flex items-center gap-2 max-w-[210px] animate-fadeIn">
                  <div className="w-7 h-7 rounded-lg bg-amber-100 text-amber-600 grid place-items-center font-bold text-sm shrink-0">
                    {data.badgeIcon || '★'}
                  </div>
                  <p className="text-[10px] font-bold text-slate-800 leading-tight">
                    {previewLang === 'bn' ? data.badgeTextBn || data.badgeText : data.badgeText}
                  </p>
                </div>
              )}
            </div>

            {/* Simulated Content Preview */}
            <div className="space-y-3 pt-2">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-600 bg-indigo-50 px-2.5 py-0.5 rounded-full">
                  {previewLang === 'bn' ? data.tagBn || data.tag : data.tag}
                </span>
                <h2 className="mt-1.5 font-bold text-base text-slate-900 leading-snug line-clamp-2">
                  {previewLang === 'bn' ? data.titleBn || data.title : data.title}
                </h2>
              </div>

              <p className="text-xs text-slate-600 leading-relaxed line-clamp-4">
                {previewLang === 'bn' ? data.descriptionBn || data.description : data.description}
              </p>

              {/* Empower Box Preview */}
              {data.showEmpowerBox && (
                <div className="p-2.5 rounded-xl bg-white border border-slate-200 flex items-center gap-2">
                  <span className="text-base">{data.empowerIcon || '🌱'}</span>
                  <p className="text-[11px] font-semibold text-slate-800">
                    {previewLang === 'bn' ? data.empowerTextBn : data.empowerText}{' '}
                    <span className="text-indigo-600 font-bold">
                      {previewLang === 'bn' ? data.empowerSkillsBn?.[0] : data.empowerSkills?.[0]}
                    </span>
                  </p>
                </div>
              )}

              {/* Features List Preview */}
              <div className="grid grid-cols-1 gap-1.5 text-[11px] text-slate-700">
                {(data.features || []).slice(0, 4).map((f, i) => (
                  <div key={i} className="flex items-center gap-1.5 truncate">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span className="truncate">{previewLang === 'bn' ? f.textBn || f.text : f.text}</span>
                  </div>
                ))}
              </div>

              {/* Action Buttons Preview */}
              <div className="flex flex-wrap items-center gap-2 pt-1">
                {data.btn1Show && (
                  <span className="px-3 py-1.5 rounded-full bg-slate-900 text-white font-bold text-[10px] flex items-center gap-1">
                    <span>{previewLang === 'bn' ? data.btn1TextBn || data.btn1Text : data.btn1Text}</span>
                    <ArrowRight className="w-3 h-3 text-amber-400" />
                  </span>
                )}
                {data.btn2Show && (
                  <span className="px-3 py-1.5 rounded-full bg-white text-slate-900 font-bold text-[10px] border border-slate-300 flex items-center gap-1">
                    <Users className="w-3 h-3 text-indigo-600" />
                    <span>{previewLang === 'bn' ? data.btn2TextBn || data.btn2Text : data.btn2Text}</span>
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  )
}
