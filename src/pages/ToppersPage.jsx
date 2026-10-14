import { useState, useMemo, useEffect } from 'react'
import { Link } from 'react-router-dom'
import {
  Award,
  Crown,
  Medal,
  Search,
  Sparkles,
  Star,
  Trophy,
  ArrowRight,
  TrendingUp,
  Flame,
} from 'lucide-react'
import { toppers as defaultToppers, classes } from '../data/content'
import { useLanguage } from '../context/LanguageContext'
import api from '../lib/api'

export default function ToppersPage() {
  const { lang, num } = useLanguage()
  const classKeys = classes.keys
  const classLabels = classes[lang] || classes.bn

  const [selectedClass, setSelectedClass] = useState('Ten')
  const [searchName, setSearchName] = useState('')

  const [dbToppers, setDbToppers] = useState(() => {
    try {
      const cached = localStorage.getItem('mpa_toppers_cache')
      return cached ? JSON.parse(cached) : null
    } catch {
      return null
    }
  })

  const fetchToppers = async () => {
    try {
      const res = await api.getToppers()
      if (res && res.success && Array.isArray(res.data) && res.data.length > 0) {
        setDbToppers(res.data)
        localStorage.setItem('mpa_toppers_cache', JSON.stringify(res.data))
      }
    } catch (err) {
      console.warn('Could not fetch toppers from backend', err)
    }
  }

  useEffect(() => {
    fetchToppers()
    const handleUpdate = () => fetchToppers()
    window.addEventListener('mpa_toppers_updated', handleUpdate)
    window.addEventListener('storage', handleUpdate)
    return () => {
      window.removeEventListener('mpa_toppers_updated', handleUpdate)
      window.removeEventListener('storage', handleUpdate)
    }
  }, [])

  // Topper list for selected class
  const list = useMemo(() => {
    if (dbToppers && dbToppers.length > 0) {
      const classFiltered = dbToppers.filter(
        (t) => (t.className || '').toLowerCase() === selectedClass.toLowerCase() && t.isActive !== false
      )
      if (classFiltered.length > 0) {
        return classFiltered.map((t) => ({
          id: t._id || t.id,
          name: t.name,
          nameEn: t.nameEn || t.name,
          roll: String(t.roll),
          gpa: t.gpa || '5.00',
          gpaEn: t.gpaEn || t.gpa || '5.00',
          marks: t.marks || '680/700',
          marksEn: t.marksEn || t.marks || '680/700',
          photo: t.photo || 'https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=400&q=80',
          badge: t.badge || 'শীর্ষ ১০',
          badgeEn: t.badgeEn || 'Top 10',
          quote: t.quote || '',
          quoteEn: t.quoteEn || '',
        }))
      }
    }
    return defaultToppers[selectedClass] || []
  }, [dbToppers, selectedClass])

  const filtered = useMemo(() => {
    if (!searchName.trim()) return list
    const q = searchName.toLowerCase()
    return list.filter((s) => {
      const matchBn = s.name && s.name.toLowerCase().includes(q)
      const matchEn = s.nameEn && s.nameEn.toLowerCase().includes(q)
      return matchBn || matchEn
    })
  }, [list, searchName])

  const top1 = list[0]
  const top2 = list[1]
  const top3 = list[2]
  const rest = filtered.filter((s) => s.roll !== '1' && s.roll !== '2' && s.roll !== '3')

  const currentClassLabel = classLabels[classKeys.indexOf(selectedClass)] || selectedClass

  return (
    <div className="min-h-screen bg-paper py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Banner */}
        <div className="bg-gradient-to-r from-board via-boardlt to-iris rounded-3xl p-8 sm:p-12 text-chalk mb-12 shadow-xl relative overflow-hidden">
          <div className="max-w-3xl relative z-10">
            <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold bg-white/10 text-gold border border-white/15 mb-3">
              <Trophy className="w-3.5 h-3.5 text-gold" />
              <span>{lang === 'bn' ? 'একাডেমিক হল অব ফেম ও মেধা তালিকা' : 'Academic Hall of Fame & Merit Board'}</span>
            </span>
            <h1 className="font-display font-extrabold text-3xl sm:text-5xl text-white tracking-tight">
              {lang === 'bn' ? 'সকল শ্রেণির শীর্ষ ১০ মেধাবী শিক্ষার্থী' : 'Top 10 Achievers of Every Class'}
            </h1>
            <p className="mt-3 text-sm sm:text-base text-chalk/80 leading-relaxed">
              {lang === 'bn'
                ? 'যাদের নিয়মিত অধ্যবসায়, কঠোর নিয়মানুবর্তিতা ও চমৎকার ফলাফল মিরাশানী একাডেমির গৌরব ও শ্রেষ্ঠত্বের প্রতীক।'
                : 'Celebrating our brightest stars whose determination, discipline, and pursuit of excellence set the benchmark for Mirashani Academy.'}
            </p>
          </div>
          <div className="absolute right-6 -bottom-8 opacity-10 pointer-events-none">
            <Trophy className="w-80 h-80 text-gold" />
          </div>
        </div>

        {/* Class Selection & Search Filter */}
        <div className="bg-white rounded-2xl p-5 border border-ink/10 shadow-md mb-12 flex flex-col md:flex-row items-center justify-between gap-4">
          {/* Class Tabs */}
          <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto pb-2 md:pb-0">
            {classKeys.map((cls, idx) => (
              <button
                key={cls}
                onClick={() => {
                  setSelectedClass(cls)
                  setSearchName('')
                }}
                className={`px-5 py-2.5 rounded-full text-xs sm:text-sm font-bold whitespace-nowrap transition-all flex items-center gap-1.5 cursor-pointer ${
                  selectedClass === cls
                    ? 'bg-board text-gold shadow-lg scale-105'
                    : 'bg-paper text-ink/75 hover:bg-ink/10'
                }`}
              >
                <Crown className="w-3.5 h-3.5 text-gold" />
                <span>{classLabels[idx]}</span>
              </button>
            ))}
          </div>

          {/* Search Box */}
          <div className="relative w-full md:w-72">
            <Search className="w-4 h-4 text-ink/40 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder={lang === 'bn' ? 'শিক্ষার্থীর নাম দিয়ে খুঁজুন...' : 'Search student by name...'}
              value={searchName}
              onChange={(e) => setSearchName(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-xl border border-ink/20 text-xs sm:text-sm focus:ring-2 focus:ring-iris/30 focus:border-iris outline-none"
            />
          </div>
        </div>

        {/* Podium for Top 3 (When no search query is active) */}
        {!searchName && top1 && (
          <div className="mb-16">
            <div className="text-center mb-8">
              <span className="text-xs font-bold uppercase tracking-wider text-gold bg-gold/20 px-3.5 py-1 rounded-full">
                {lang === 'bn' ? `পদকজয়ী কৃতি শিক্ষার্থী · ${currentClassLabel}` : `Medal Winners · Class ${selectedClass}`}
              </span>
              <h2 className="mt-2 font-display font-black text-2xl sm:text-3xl text-board">
                {lang === 'bn' ? 'শীর্ষ ৩ চ্যাম্পিয়ন পোডিয়াম' : 'The Champions Podium'}
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-end max-w-5xl mx-auto">
              {/* 2nd Place (Silver) */}
              {top2 && (
                <div className="bg-white rounded-3xl p-6 text-center border-2 border-slate-300 shadow-xl order-2 md:order-1 transform hover:-translate-y-2 transition-all">
                  <div className="inline-flex items-center gap-1 text-xs font-black uppercase tracking-wider text-slate-600 bg-slate-100 px-3 py-1 rounded-full mb-4">
                    <span>🥈 {lang === 'bn' ? '২য় স্থান (রৌপ্য)' : '2nd Position'}</span>
                  </div>

                  <div className="relative w-28 h-28 mx-auto mb-4">
                    <img
                      src={top2.photo}
                      alt={lang === 'bn' ? top2.name : top2.nameEn}
                      className="w-full h-full rounded-full object-cover ring-4 ring-slate-300 shadow-lg"
                    />
                    <span className="absolute bottom-0 right-0 w-8 h-8 rounded-full bg-slate-600 text-white font-black text-sm grid place-items-center shadow-md">
                      #২
                    </span>
                  </div>

                  <h3 className="font-display font-extrabold text-xl text-board">
                    {lang === 'bn' ? top2.name : top2.nameEn || top2.name}
                  </h3>
                  <p className="text-xs text-ink/60 font-medium mt-0.5">
                    {lang === 'bn' ? `রোল ${num(top2.roll)} · ${currentClassLabel}` : `Roll ${top2.roll} · Class ${selectedClass}`}
                  </p>

                  <div className="mt-4 pt-4 border-t border-ink/10 flex items-center justify-center gap-3">
                    <span className="text-xs font-bold text-mint bg-mint/10 px-2.5 py-1 rounded-md">
                      GPA {lang === 'bn' ? top2.gpa : top2.gpaEn || top2.gpa}
                    </span>
                    <span className="text-xs font-bold text-slate-700">
                      {lang === 'bn' ? top2.marks : top2.marksEn || top2.marks}
                    </span>
                  </div>

                  <Link
                    to={`/results?cls=${encodeURIComponent(selectedClass)}&roll=${encodeURIComponent(top2.roll)}`}
                    className="mt-4 inline-flex items-center gap-1 text-xs font-bold text-iris hover:underline"
                  >
                    <span>{lang === 'bn' ? 'নম্বরপত্র দেখুন' : 'View Transcript'}</span>
                    <ArrowRight className="w-3 h-3" />
                  </Link>
                </div>
              )}

              {/* 1st Place (Gold) - Elevated & Grand */}
              {top1 && (
                <div className="bg-gradient-to-b from-[#fff6cf] via-white to-white rounded-3xl p-8 text-center border-4 border-gold shadow-2xl order-1 md:order-2 md:-translate-y-6 transform hover:-translate-y-8 transition-all relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-24 h-24 bg-gold/20 rounded-full blur-2xl" />

                  <div className="inline-flex items-center gap-1.5 text-xs font-black uppercase tracking-wider text-ink bg-gold px-4 py-1.5 rounded-full mb-4 shadow-md">
                    <Crown className="w-4 h-4 fill-ink" />
                    <span>🥇 {lang === 'bn' ? 'চ্যাম্পিয়ন · ১ম স্থান (স্বর্ণ)' : 'Champion · 1st Position'}</span>
                  </div>

                  <div className="relative w-36 h-36 mx-auto mb-4">
                    <img
                      src={top1.photo}
                      alt={lang === 'bn' ? top1.name : top1.nameEn}
                      className="w-full h-full rounded-full object-cover ring-4 ring-gold shadow-2xl"
                    />
                    <span className="absolute bottom-1 right-1 w-10 h-10 rounded-full bg-board text-gold font-black text-base grid place-items-center shadow-lg border-2 border-white">
                      #১
                    </span>
                  </div>

                  <h3 className="font-display font-black text-2xl text-board">
                    {lang === 'bn' ? top1.name : top1.nameEn || top1.name}
                  </h3>
                  <p className="text-xs text-ink/70 font-bold mt-1">
                    {lang === 'bn' ? (top1.badge || 'গোল্ডেন এ+ অর্জনকারী') : (top1.badgeEn || 'Golden A+ Achiever')} &middot; {lang === 'bn' ? `রোল ${num(top1.roll)}` : `Roll ${top1.roll}`}
                  </p>

                  <div className="mt-5 pt-4 border-gold/40 flex items-center justify-center gap-3">
                    <span className="text-sm font-black text-ink bg-gold/30 px-3 py-1 rounded-lg">
                      GPA {lang === 'bn' ? top1.gpa : top1.gpaEn || top1.gpa} ({lang === 'bn' ? 'গোল্ডেন' : 'Golden'})
                    </span>
                    <span className="text-sm font-extrabold text-board">
                      {lang === 'bn' ? top1.marks : top1.marksEn || top1.marks}
                    </span>
                  </div>

                  <Link
                    to={`/results?cls=${encodeURIComponent(selectedClass)}&roll=${encodeURIComponent(top1.roll)}`}
                    className="btn mt-5 inline-flex items-center gap-1.5 px-5 py-2.5 rounded-full bg-board text-chalk text-xs font-bold hover:bg-boardlt shadow-md"
                  >
                    <span>{lang === 'bn' ? 'গোল্ডেন নম্বরপত্র পরিদর্শন' : 'Inspect Golden Marksheet'}</span>
                    <ArrowRight className="w-3.5 h-3.5 text-gold" />
                  </Link>
                </div>
              )}

              {/* 3rd Place (Bronze) */}
              {top3 && (
                <div className="bg-white rounded-3xl p-6 text-center border-2 border-amber-600/40 shadow-xl order-3 md:order-3 transform hover:-translate-y-2 transition-all">
                  <div className="inline-flex items-center gap-1 text-xs font-black uppercase tracking-wider text-amber-800 bg-amber-100 px-3 py-1 rounded-full mb-4">
                    <span>🥉 {lang === 'bn' ? '৩য় স্থান (ব্রোঞ্জ)' : '3rd Position'}</span>
                  </div>

                  <div className="relative w-28 h-28 mx-auto mb-4">
                    <img
                      src={top3.photo}
                      alt={lang === 'bn' ? top3.name : top3.nameEn}
                      className="w-full h-full rounded-full object-cover ring-4 ring-amber-600/40 shadow-lg"
                    />
                    <span className="absolute bottom-0 right-0 w-8 h-8 rounded-full bg-amber-700 text-white font-black text-sm grid place-items-center shadow-md">
                      #৩
                    </span>
                  </div>

                  <h3 className="font-display font-extrabold text-xl text-board">
                    {lang === 'bn' ? top3.name : top3.nameEn || top3.name}
                  </h3>
                  <p className="text-xs text-ink/60 font-medium mt-0.5">
                    {lang === 'bn' ? `রোল ${num(top3.roll)} · ${currentClassLabel}` : `Roll ${top3.roll} · Class ${selectedClass}`}
                  </p>

                  <div className="mt-4 pt-4 border-t border-ink/10 flex items-center justify-center gap-3">
                    <span className="text-xs font-bold text-mint bg-mint/10 px-2.5 py-1 rounded-md">
                      GPA {lang === 'bn' ? top3.gpa : top3.gpaEn || top3.gpa}
                    </span>
                    <span className="text-xs font-bold text-amber-800">
                      {lang === 'bn' ? top3.marks : top3.marksEn || top3.marks}
                    </span>
                  </div>

                  <Link
                    to={`/results?cls=${encodeURIComponent(selectedClass)}&roll=${encodeURIComponent(top3.roll)}`}
                    className="mt-4 inline-flex items-center gap-1 text-xs font-bold text-iris hover:underline"
                  >
                    <span>{lang === 'bn' ? 'নম্বরপত্র দেখুন' : 'View Transcript'}</span>
                    <ArrowRight className="w-3 h-3" />
                  </Link>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Rest of the Top 10 List */}
        <div>
          <div className="flex items-center gap-2 mb-6">
            <Flame className="w-5 h-5 text-brick" />
            <h2 className="font-display font-extrabold text-2xl text-board">
              {lang === 'bn' ? `${currentClassLabel} মেধা তালিকা` : `Class ${selectedClass} Merit List`}
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {(searchName ? filtered : rest).map((student) => (
              <div
                key={student.id || student.roll}
                className="bg-white rounded-3xl p-5 border border-ink/10 shadow-md hover:shadow-xl transition-all flex items-center justify-between gap-4"
              >
                <div className="flex items-center gap-4">
                  <div className="relative">
                    <img
                      src={student.photo}
                      alt={lang === 'bn' ? student.name : student.nameEn}
                      className="w-14 h-14 rounded-2xl object-cover ring-2 ring-gold/40 shadow-sm"
                    />
                    <span className="absolute -top-1.5 -left-1.5 bg-board text-gold text-[10px] font-black px-1.5 py-0.5 rounded-md border border-gold/40 shadow">
                      #{student.roll}
                    </span>
                  </div>

                  <div>
                    <h3 className="font-display font-bold text-sm text-board">
                      {lang === 'bn' ? student.name : student.nameEn || student.name}
                    </h3>
                    <p className="text-[11px] text-ink/60 font-semibold">
                      {lang === 'bn' ? `রোল ${num(student.roll)}` : `Roll ${student.roll}`} &middot;{' '}
                      <span className="text-mint font-bold">GPA {lang === 'bn' ? student.gpa : student.gpaEn || student.gpa}</span>
                    </p>
                    <span className="inline-block text-[10px] font-bold text-iris bg-iris/10 px-2 py-0.5 rounded-full mt-1">
                      {lang === 'bn' ? student.badge : student.badgeEn || student.badge}
                    </span>
                  </div>
                </div>

                <Link
                  to={`/results?cls=${encodeURIComponent(selectedClass)}&roll=${encodeURIComponent(student.roll)}`}
                  className="w-9 h-9 rounded-xl bg-paper hover:bg-board hover:text-gold text-ink/60 grid place-items-center transition-all shrink-0 shadow-sm"
                  title={lang === 'bn' ? 'ফলাফল দেখুন' : 'View result'}
                >
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
