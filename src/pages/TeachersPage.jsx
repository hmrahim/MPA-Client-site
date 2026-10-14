import { useState, useMemo, useEffect } from 'react'
import {
  Users,
  Search,
  Mail,
  Phone,
  Briefcase,
  GraduationCap,
  Sparkles,
} from 'lucide-react'
import { teachers as defaultTeachers } from '../data/content'
import { useLanguage } from '../context/LanguageContext'
import api from '../lib/api'

export default function TeachersPage() {
  const { lang, num } = useLanguage()

  const [dbTeachers, setDbTeachers] = useState(() => {
    try {
      const cached = localStorage.getItem('mpa_teachers_cache')
      return cached ? JSON.parse(cached) : null
    } catch {
      return null
    }
  })

  const fetchTeachers = async () => {
    try {
      const res = await api.getTeachers()
      if (res && res.success && Array.isArray(res.data) && res.data.length > 0) {
        setDbTeachers(res.data)
        localStorage.setItem('mpa_teachers_cache', JSON.stringify(res.data))
      }
    } catch (err) {
      console.warn('Could not fetch teachers from backend', err)
    }
  }

  useEffect(() => {
    fetchTeachers()
    const handleUpdate = () => fetchTeachers()
    window.addEventListener('mpa_teachers_updated', handleUpdate)
    window.addEventListener('storage', handleUpdate)
    return () => {
      window.removeEventListener('mpa_teachers_updated', handleUpdate)
      window.removeEventListener('storage', handleUpdate)
    }
  }, [])

  // Format teacher items from DB or fallback
  const teacherList = useMemo(() => {
    if (dbTeachers && dbTeachers.length > 0) {
      return dbTeachers
        .filter((t) => t.isActive !== false)
        .map((t) => ({
          id: t._id || t.id,
          n: lang === 'bn' ? (t.nameBn || t.name) : (t.name || t.nameBn),
          r: lang === 'bn' ? (t.designationBn || t.designation) : (t.designation || t.designationBn),
          dept: t.department || 'Science',
          deg: t.qualification || '',
          exp: lang === 'bn' ? (t.experienceBn || t.experience) : (t.experience || t.experienceBn),
          email: t.email || 'info@mirashani.edu.bd',
          phone: t.phone || '+880 1711-000000',
          photo: t.photo || 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=400&q=80',
          bio: lang === 'bn' ? (t.bioBn || t.bio) : (t.bio || t.bioBn),
        }))
    }
    return defaultTeachers[lang] || defaultTeachers.bn
  }, [dbTeachers, lang])

  const departments = lang === 'bn' ? [
    { id: 'All', label: 'সকল শিক্ষক' },
    { id: 'Administration', label: 'প্রশাসন' },
    { id: 'Science', label: 'বিজ্ঞান' },
    { id: 'Commerce', label: 'বাণিজ্য' },
    { id: 'Humanities', label: 'মানবিক' },
    { id: 'Languages', label: 'ভাষা' },
    { id: 'ICT & STEM', label: 'আইসিটি ও এসটিইএম' },
  ] : [
    { id: 'All', label: 'All' },
    { id: 'Administration', label: 'Administration' },
    { id: 'Science', label: 'Science' },
    { id: 'Commerce', label: 'Commerce' },
    { id: 'Humanities', label: 'Humanities' },
    { id: 'Languages', label: 'Languages' },
    { id: 'ICT & STEM', label: 'ICT & STEM' },
  ]

  const [selectedDept, setSelectedDept] = useState('All')
  const [searchQuery, setSearchQuery] = useState('')

  const filteredTeachers = useMemo(() => {
    return teacherList.filter((t) => {
      const dept = t.dept || ''
      const matchDept = selectedDept === 'All' ||
        dept === selectedDept ||
        (selectedDept === 'Administration' && (dept === 'প্রশাসন' || dept === 'Administration')) ||
        (selectedDept === 'Science' && (dept === 'বিজ্ঞান' || dept === 'Science')) ||
        (selectedDept === 'Commerce' && (dept === 'বাণিজ্য' || dept === 'Commerce')) ||
        (selectedDept === 'Humanities' && (dept === 'মানবিক' || dept === 'Humanities')) ||
        (selectedDept === 'Languages' && (dept === 'ভাষা' || dept === 'Languages')) ||
        (selectedDept === 'ICT & STEM' && (dept === 'আইসিটি ও এসটিইএম' || dept === 'ICT & STEM'))

      const q = searchQuery.toLowerCase()
      const matchSearch =
        (t.n && t.n.toLowerCase().includes(q)) ||
        (t.r && t.r.toLowerCase().includes(q)) ||
        (dept && dept.toLowerCase().includes(q))
      return matchDept && matchSearch
    })
  }, [teacherList, selectedDept, searchQuery])

  return (
    <div className="min-h-screen bg-paper py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Banner */}
        <div className="bg-gradient-to-r from-board via-boardlt to-iris rounded-3xl p-8 sm:p-12 text-chalk mb-12 shadow-xl relative overflow-hidden">
          <div className="max-w-3xl relative z-10">
            <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold bg-white/10 text-gold border border-white/15 mb-3">
              <Users className="w-3.5 h-3.5 text-gold" />
              <span>{lang === 'bn' ? 'নিবেদিতপ্রাণ শিক্ষকমণ্ডলী ও নির্দেশক' : 'Dedicated Faculty & Academic Mentors'}</span>
            </span>
            <h1 className="font-display font-extrabold text-3xl sm:text-5xl text-white tracking-tight">
              {lang === 'bn' ? 'আমাদের সম্মানিত শিক্ষক ও অনুষদ' : 'Our Respected Teachers & Faculty'}
            </h1>
            <p className="mt-3 text-sm sm:text-base text-chalk/80 leading-relaxed">
              {lang === 'bn'
                ? 'অভিজ্ঞ বিষয়ভিত্তিক শিক্ষক, প্রধান শিক্ষক ও দিকনির্দেশকদের সাথে পরিচিত হোন যারা প্রতিটি সাধারণ মাধ্যমিক শিক্ষার্থীর জ্ঞান, চরিত্র ও শৃঙ্খলা গঠনে নিবেদিত।'
                : 'Meet our team of experienced subject teachers, headmaster, and mentors devoted to cultivating intellectual curiosity, moral discipline, and academic excellence in every general high school student.'}
            </p>
          </div>
        </div>

        {/* Filter and Search Bar */}
        <div className="bg-white rounded-2xl p-5 border border-ink/10 shadow-md mb-12 flex flex-col md:flex-row items-center justify-between gap-4">
          {/* Department Tabs */}
          <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto pb-2 md:pb-0">
            {departments.map((dept) => (
              <button
                key={dept.id}
                onClick={() => setSelectedDept(dept.id)}
                className={`px-4 py-2 rounded-full text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                  selectedDept === dept.id
                    ? 'bg-board text-gold shadow-md scale-105'
                    : 'bg-paper text-ink/75 hover:bg-ink/10'
                }`}
              >
                {dept.label}
              </button>
            ))}
          </div>

          {/* Search Box */}
          <div className="relative w-full md:w-72">
            <Search className="w-4 h-4 text-ink/40 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder={lang === 'bn' ? 'শিক্ষকের নাম বা বিষয়ে খুঁজুন...' : 'Search by teacher name or subject...'}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-xl border border-ink/20 text-xs sm:text-sm focus:ring-2 focus:ring-iris/30 focus:border-iris outline-none"
            />
          </div>
        </div>

        {/* Teachers Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {filteredTeachers.map((teacher, idx) => (
            <div
              key={teacher.id || idx}
              className="bg-white rounded-3xl p-6 border border-ink/10 shadow-md hover:shadow-2xl transition-all transform hover:-translate-y-2 flex flex-col justify-between"
            >
              <div>
                <div className="relative w-28 h-28 mx-auto mb-4">
                  <img
                    src={teacher.photo}
                    alt={teacher.n}
                    className="w-full h-full rounded-2xl object-cover ring-4 ring-gold/40 shadow-md"
                  />
                  <span className="absolute -bottom-2 right-2 bg-board text-gold text-[10px] font-bold px-2 py-0.5 rounded-full border border-gold/40 shadow">
                    {teacher.dept}
                  </span>
                </div>

                <div className="text-center">
                  <h3 className="font-display font-extrabold text-lg text-board leading-snug">{teacher.n}</h3>
                  <p className="text-xs font-bold text-iris mt-0.5">{teacher.r}</p>
                  <p className="text-[11px] text-ink/60 mt-1 font-medium">{teacher.deg}</p>
                  <span className="inline-block mt-2 text-[10px] font-bold uppercase tracking-wider text-mint bg-mint/10 px-2 py-0.5 rounded-md">
                    {teacher.exp}
                  </span>
                </div>

                <p className="mt-4 pt-3 border-t border-ink/10 text-xs text-ink/75 leading-relaxed italic text-center">
                  "{teacher.bio}"
                </p>
              </div>

              <div className="mt-5 pt-3 border-t border-ink/10 space-y-1.5 text-xs text-ink/70">
                <a
                  href={`mailto:${teacher.email}`}
                  className="flex items-center gap-2 hover:text-iris transition-colors truncate"
                  title={teacher.email}
                >
                  <Mail className="w-3.5 h-3.5 text-brick shrink-0" />
                  <span className="truncate">{teacher.email}</span>
                </a>
                <a
                  href={`tel:${teacher.phone}`}
                  className="flex items-center gap-2 hover:text-iris transition-colors"
                >
                  <Phone className="w-3.5 h-3.5 text-mint shrink-0" />
                  <span>{num(teacher.phone)}</span>
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
