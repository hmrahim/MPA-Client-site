import { useState, useEffect } from 'react'
import {
  BookOpen,
  Microscope,
  Clock,
  Download,
  CheckCircle2,
  Calendar,
  Layers,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Building,
  TrendingUp,
  Landmark,
} from 'lucide-react'
import { academicGroups } from '../data/content'
import { useLanguage } from '../context/LanguageContext'
import api from '../lib/api'

export default function AcademicsPage() {
  const { lang, num } = useLanguage()
  const [academicData, setAcademicData] = useState(() => {
    try {
      const cached = localStorage.getItem('mpa_academic_groups_section')
      return cached ? JSON.parse(cached) : null
    } catch {
      return null
    }
  })

  const [routineSection, setRoutineSection] = useState(() => {
    try {
      const cached = localStorage.getItem('mpa_routine_section')
      return cached ? JSON.parse(cached) : null
    } catch {
      return null
    }
  })

  const [schoolInfo, setSchoolInfo] = useState(() => {
    try {
      const cached = localStorage.getItem('mpa_school_info_cache')
      return cached ? JSON.parse(cached) : null
    } catch {
      return null
    }
  })

  useEffect(() => {
    let isMounted = true

    api.getAcademicGroups().then((res) => {
      if (res?.success && res.data && isMounted) {
        setAcademicData(res.data)
        localStorage.setItem('mpa_academic_groups_section', JSON.stringify(res.data))
      }
    }).catch(() => {})

    api.getRoutine().then((res) => {
      if (res?.success && res.data && isMounted) {
        setRoutineSection(res.data)
        localStorage.setItem('mpa_routine_section', JSON.stringify(res.data))
      }
    }).catch(() => {})

    api.getSchoolInfo().then((res) => {
      if (res?.success && res.data && isMounted) {
        setSchoolInfo(res.data)
        localStorage.setItem('mpa_school_info_cache', JSON.stringify(res.data))
      }
    }).catch(() => {})

    const onUpdate = () => {
      try {
        const cached = localStorage.getItem('mpa_academic_groups_section')
        if (cached) setAcademicData(JSON.parse(cached))
        const cachedR = localStorage.getItem('mpa_routine_section')
        if (cachedR) setRoutineSection(JSON.parse(cachedR))
        const cachedS = localStorage.getItem('mpa_school_info_cache')
        if (cachedS) setSchoolInfo(JSON.parse(cachedS))
      } catch (_) {}
    }

    window.addEventListener('storage', onUpdate)
    window.addEventListener('mpa_academic_groups_updated', onUpdate)
    window.addEventListener('mpa_routine_updated', onUpdate)
    window.addEventListener('mpa_school_info_updated', onUpdate)
    return () => {
      isMounted = false
      window.removeEventListener('storage', onUpdate)
      window.removeEventListener('mpa_academic_groups_updated', onUpdate)
      window.removeEventListener('mpa_routine_updated', onUpdate)
      window.removeEventListener('mpa_school_info_updated', onUpdate)
    }
  }, [])

  const groupsList = (academicData?.groups && academicData.groups.length > 0)
    ? academicData.groups.filter((g) => g.isActive !== false).map((g) => ({
        id: g.id || g._id,
        name: lang === 'bn' ? (g.nameBn || g.name) : (g.name || g.nameBn),
        icon: g.icon || '📘',
        desc: lang === 'bn' ? (g.descBn || g.desc) : (g.desc || g.descBn),
        subjects: (lang === 'bn'
          ? (g.subjectsBn?.length ? g.subjectsBn : g.subjects)
          : (g.subjects?.length ? g.subjects : g.subjectsBn)) || [],
        border: g.border || 'border-cyan-500/30',
        pathway: lang === 'bn' ? (g.pathwayBn || g.pathway) : (g.pathway || g.pathwayBn),
        color: g.color || 'from-blue-500/20 to-cyan-500/20',
      }))
    : (academicGroups[lang] || academicGroups.bn)

  const [activeTab, setActiveTab] = useState('groups')

  const defaultRoutineBn = [
    { period: 'প্রাত্যহিক সমাবেশ ও পিটি', time: 'সকাল ৮:৪৫ - ৯:০০', description: 'জাতীয় সংগীত, শারীরিক কসরত ও নৈতিক অনুশাসন সমাবেশ' },
    { period: '১ম পিরিয়ড', time: 'সকাল ৯:০০ - ৯:৪৫', description: 'বাংলা ১ম / ২য় পত্র' },
    { period: '২য় পিরিয়ড', time: 'সকাল ৯:৪৫ - ১০:৩০', description: 'ইংরেজি যোগাযোগমূলক ব্যাকরণ ও সাহিত্য' },
    { period: '৩য় পিরিয়ড', time: 'সকাল ১০:৩০ - ১১:১৫', description: 'সাধারণ গণিত / উচ্চতর গণিত' },
    { period: '৪র্থ পিরিয়ড', time: 'সকাল ১১:১৫ - ১২:০০', description: 'পদার্থবিজ্ঞান / হিসাববিজ্ঞান / ইতিহাস' },
    { period: 'টিফিন বিরতি ও জোহরের নামাজ', time: 'দুপুর ১২:০০ - ১২:৪৫', description: 'স্বাস্থ্যকর দুপুরের খাবার, জামাতে নামাজ ও বিনোদন' },
    { period: '৫ম পিরিয়ড (বিজ্ঞান ল্যাব)', time: 'দুপুর ১২:৪৫ - ১:৪৫', description: 'রসায়ন / জীববিজ্ঞান / ফিন্যান্স / ভূগোল ব্যবহারিক' },
    { period: '৬ষ্ঠ পিরিয়ড (আইসিটি ও সহ-শিক্ষা)', time: 'দুপুর ১:৪৫ - ২:৩০', description: 'কম্পিউটার ডিজিটাল ল্যাব / বিতর্ক / স্কাউট / লাইব্রেরি' },
  ]
  const defaultRoutineEn = [
    { period: 'Assembly & Physical Drill', time: '8:45 AM - 9:00 AM', description: 'National anthem, physical exercises & moral assembly' },
    { period: '1st Period', time: '9:00 AM - 9:45 AM', description: 'Bangla 1st / 2nd Paper' },
    { period: '2nd Period', time: '9:45 AM - 10:30 AM', description: 'English Communicative & Grammar' },
    { period: '3rd Period', time: '10:30 AM - 11:15 AM', description: 'General Mathematics / Higher Math' },
    { period: '4th Period', time: '11:15 AM - 12:00 PM', description: 'Physics / Accounting / History' },
    { period: 'Tiffin & Prayer Break', time: '12:00 PM - 12:45 PM', description: 'Lunch, Zohr prayer & recreation' },
    { period: '5th Period (Science/Lab)', time: '12:45 PM - 1:45 PM', description: 'Chemistry / Biology / Finance / Geography' },
    { period: '6th Period (ICT & Co-Curricular)', time: '1:45 PM - 2:30 PM', description: 'Computer ICT Lab / Debate / Scouts / Library' },
  ]

  const routineData = useMemo(() => {
    if (routineSection?.schedule && routineSection.schedule.length > 0) {
      return routineSection.schedule.map((slot) => ({
        period: lang === 'bn' ? (slot.titleBn || slot.title) : (slot.title || slot.titleBn),
        time: lang === 'bn' ? (slot.timeBn || slot.time) : (slot.time || slot.timeBn),
        description: lang === 'bn' ? (slot.descBn || slot.desc) : (slot.desc || slot.descBn),
      }))
    }
    return lang === 'bn' ? defaultRoutineBn : defaultRoutineEn
  }, [routineSection, lang])

  const defaultSyllabusBn = [
    '৬ষ্ঠ শ্রেণির পূর্ণাঙ্গ পাঠ্যবই তালিকা ও বার্ষিক সিলেবাস',
    '৭ম শ্রেণির একাডেমিক পাঠ্যক্রম সিলেবাস ও নম্বর বণ্টন',
    '৮ম শ্রেণির জুনিয়র বৃত্তি পরীক্ষার রুটিন ও মডেল প্রশ্ন',
    '৯ম শ্রেণির বিজ্ঞান বিভাগ পাঠ্যক্রম ও ল্যাব ম্যানুয়াল',
    '৯ম শ্রেণির ব্যবসায় শিক্ষা ও মানবিক পাঠ্যক্রম',
    '১০ম শ্রেণির এসএসসি মডেল টেস্ট সিলেবাস ও টেস্ট পেপার',
  ]
  const defaultSyllabusEn = [
    'Class 6 Comprehensive Booklist & Annual Syllabus',
    'Class 7 Academic Curriculum & Mark Distribution',
    'Class 8 Junior Scholarship Exam Routine & Models',
    'Class 9 Science Group Curriculum & Lab Manual',
    'Class 9 Business Studies & Humanities Guide',
    'Class 10 SSC Model Test Exam Guidelines',
  ]

  const syllabusList = useMemo(() => {
    if (schoolInfo) {
      if (lang === 'bn' && schoolInfo.syllabusList?.length) return schoolInfo.syllabusList
      if (lang === 'en' && schoolInfo.syllabusListEn?.length) return schoolInfo.syllabusListEn
    }
    return lang === 'bn' ? defaultSyllabusBn : defaultSyllabusEn
  }, [schoolInfo, lang])

  return (
    <div className="min-h-screen bg-paper py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Banner */}
        <div className="bg-gradient-to-r from-board via-boardlt to-iris rounded-3xl p-8 sm:p-12 text-chalk mb-10 shadow-xl relative overflow-hidden">
          <div className="max-w-3xl relative z-10">
            <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold bg-white/10 text-gold border border-white/15 mb-3">
              <BookOpen className="w-3.5 h-3.5 text-gold" />
              <span>{lang === 'bn' ? 'জাতীয় শিক্ষাক্রম ও পাঠ্য বিভাগ' : 'National Curriculum & Disciplines'}</span>
            </span>
            <h1 className="font-display font-extrabold text-3xl sm:text-5xl text-white tracking-tight">
              {lang === 'bn' ? 'একাডেমিক শিক্ষাক্রম ও বিভাগসমূহ' : 'Academic Curriculum & Disciplines'}
            </h1>
            <p className="mt-3 text-sm sm:text-base text-chalk/80 leading-relaxed">
              {lang === 'bn'
                ? 'মিরাশানী একাডেমি এনসিটিবি অনুমোদিত আধুনিক সাধারণ মাধ্যমিক শিক্ষাক্রম প্রদান করে। ৬ষ্ঠ থেকে ৮ম শ্রেণিতে সাধারণ শিক্ষা এবং ৯ম-১০ম শ্রেণিতে বিজ্ঞান, ব্যবসায় শিক্ষা ও মানবিক বিভাগ।'
                : 'Mirashani Academy offers standard National Curriculum (NCTB) for Junior Secondary (Classes 6-8) and Secondary (Classes 9-10) with Science, Business Studies, and Humanities groups.'}
            </p>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center gap-2 overflow-x-auto bg-white p-2 rounded-2xl border border-ink/10 shadow-sm mb-8 sm:mb-10 no-scrollbar">
          <button
            onClick={() => setActiveTab('groups')}
            className={`px-4 sm:px-5 py-2.5 sm:py-3 rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all flex items-center gap-2 cursor-pointer ${
              activeTab === 'groups'
                ? 'bg-board text-chalk shadow-md'
                : 'text-ink/75 hover:bg-ink/5'
            }`}
          >
            <Layers className="w-4 h-4 text-gold" />
            <span>{lang === 'bn' ? 'একাডেমিক বিভাগ (বিজ্ঞান, বাণিজ্য, মানবিক)' : 'Academic Groups (Science, Commerce, Arts)'}</span>
          </button>

          <button
            onClick={() => setActiveTab('routine')}
            className={`px-4 sm:px-5 py-2.5 sm:py-3 rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all flex items-center gap-2 cursor-pointer ${
              activeTab === 'routine'
                ? 'bg-board text-chalk shadow-md'
                : 'text-ink/75 hover:bg-ink/5'
            }`}
          >
            <Clock className="w-4 h-4 text-mint" />
            <span>{lang === 'bn' ? 'শ্রেণির সময়সূচি ও রুটিন' : 'Class Timetable & Routine'}</span>
          </button>

          <button
            onClick={() => setActiveTab('facilities')}
            className={`px-4 sm:px-5 py-2.5 sm:py-3 rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all flex items-center gap-2 cursor-pointer ${
              activeTab === 'facilities'
                ? 'bg-board text-chalk shadow-md'
                : 'text-ink/75 hover:bg-ink/5'
            }`}
          >
            <Building className="w-4 h-4 text-brick" />
            <span>{lang === 'bn' ? 'ল্যাব ও ক্যাম্পাস সুবিধাসমূহ' : 'Labs & Campus Facilities'}</span>
          </button>
        </div>

        {/* Tab 1: Academic Groups */}
        {activeTab === 'groups' && (
          <div className="space-y-12 animate-fadeIn">
            <div className="grid md:grid-cols-2 gap-8 items-center">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-iris bg-iris/10 px-3 py-1 rounded-full">
                  {lang === 'bn' ? 'এনসিটিবি শিক্ষাক্রম' : 'NCTB Curriculum'}
                </span>
                <h2 className="font-display font-extrabold text-3xl text-board mt-2 mb-4">
                  {lang === 'bn' ? 'প্রতিটি একাডেমিক বিভাগে শ্রেষ্ঠত্ব' : 'Excellence Across All Academic Streams'}
                </h2>
                <p className="text-sm text-ink/80 leading-relaxed mb-6">
                  {lang === 'bn'
                    ? '৯ম শ্রেণিতে শিক্ষার্থীরা তাদের পছন্দ ও ভবিষ্যতের লক্ষ্য অনুযায়ী উপযুক্ত বিভাগ নির্বাচন করে। আমাদের অভিজ্ঞ শিক্ষকবৃন্দ এসএসসি পরীক্ষার জন্য প্রতিটি শিক্ষার্থীকে গভীর প্রস্তুতি নিশ্চিত করেন।'
                    : 'In Class 9, students choose their specialized stream based on their academic strengths and future career aspirations. Our faculty ensures rigorous preparation for Board Examinations (SSC).'}
                </p>

                <div className="space-y-3">
                  <div className="p-4 rounded-2xl bg-white border border-ink/10 flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-mint shrink-0 mt-0.5" />
                    <div>
                      <h4 className="font-bold text-sm text-board">
                        {lang === 'bn' ? 'বিজ্ঞান বিভাগ' : 'Science Group (বিজ্ঞান)'}
                      </h4>
                      <p className="text-xs text-ink/70">
                        {lang === 'bn'
                          ? 'পদার্থবিজ্ঞান, রসায়ন, জীববিজ্ঞান ও উচ্চতর গণিতের সার্বক্ষণিক ল্যাবরেটরি ক্লাস।'
                          : 'Physics, Chemistry, Biology, and Higher Mathematics with hands-on lab experiments.'}
                      </p>
                    </div>
                  </div>

                  <div className="p-4 rounded-2xl bg-white border border-ink/10 flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-mint shrink-0 mt-0.5" />
                    <div>
                      <h4 className="font-bold text-sm text-board">
                        {lang === 'bn' ? 'ব্যবসায় শিক্ষা' : 'Business Studies (ব্যবসায় শিক্ষা)'}
                      </h4>
                      <p className="text-xs text-ink/70">
                        {lang === 'bn'
                          ? 'হিসাববিজ্ঞান, ব্যবসায় উদ্যোগ এবং ফিন্যান্স ও ব্যাংকিং শেখার আধুনিক পদ্ধতি।'
                          : 'Accounting, Business Entrepreneurship, and Finance & Banking with practical commerce projects.'}
                      </p>
                    </div>
                  </div>

                  <div className="p-4 rounded-2xl bg-white border border-ink/10 flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-mint shrink-0 mt-0.5" />
                    <div>
                      <h4 className="font-bold text-sm text-board">
                        {lang === 'bn' ? 'মানবিক বিভাগ' : 'Humanities Group (মানবিক)'}
                      </h4>
                      <p className="text-xs text-ink/70">
                        {lang === 'bn'
                          ? 'ইতিহাস, ভূগোল ও পরিবেশ, পৌরনীতি ও অর্থনীতি যা বিশ্লেষণধর্মী চিন্তাভাবনা গড়ে তোলে।'
                          : 'History, Geography & Environment, Civics, and Economics developing analytical minds.'}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="relative rounded-3xl overflow-hidden shadow-xl border-4 border-white">
                <img
                  src="https://images.unsplash.com/photo-1580582932707-520aed937b7b?auto=format&fit=crop&w=800&q=80"
                  alt="Classroom learning"
                  className="w-full h-[400px] object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-board/80 to-transparent flex items-end p-6">
                  <div className="text-white">
                    <p className="font-display font-bold text-xl">
                      {lang === 'bn' ? 'ডিজিটাল স্মার্ট ক্লাসরুম' : 'Digital Smart Classrooms'}
                    </p>
                    <p className="text-xs text-chalk/80">
                      {lang === 'bn'
                        ? 'মাল্টিমিডিয়া প্রজেক্টরের মাধ্যমে জটিল বিষয়কে সহজবোধ্য পাঠদান'
                        : 'Interactive audio-visual learning for better concept retention'}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Academic Groups Detail Cards */}
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {groupsList.map((g) => (
                <div key={g.id || g.name} className={`bg-white rounded-3xl p-6 border ${g.border || 'border-ink/10'} shadow-md flex flex-col justify-between`}>
                  <div>
                    <span className="text-4xl block mb-3">{g.icon}</span>
                    <h3 className="font-display font-bold text-lg text-board mb-2">{g.name}</h3>
                    <p className="text-xs text-ink/70 mb-4">{g.desc}</p>
                    <div className="pt-3 border-t border-ink/10">
                      <span className="text-[10px] font-bold text-ink/50 uppercase tracking-wider block mb-1">
                        {lang === 'bn' ? 'পাঠ্য বিষয়সমূহ:' : 'Curriculum Subjects:'}
                      </span>
                      <div className="flex flex-wrap gap-1 mb-2">
                        {g.subjects?.map((s, sIdx) => (
                          <span key={sIdx} className="text-[10px] font-semibold px-2 py-0.5 rounded bg-paper text-board border border-ink/10">
                            {s}
                          </span>
                        ))}
                      </div>
                      {g.pathway && (
                        <div className="text-[10px] text-iris font-semibold mt-2 pt-2 border-t border-ink/5">
                          <strong>{lang === 'bn' ? 'ভবিষ্যৎ ক্যারিয়ার: ' : 'Career Pathway: '}</strong>
                          {g.pathway}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Syllabus Download Cards */}
            <div className="bg-white rounded-3xl p-8 border border-ink/10 shadow-md">
              <h3 className="font-display font-bold text-xl text-board mb-4">
                {lang === 'bn' ? 'অফিসিয়াল সিলেবাস ও বুক-লিস্ট (২০২৬-২০২৭)' : 'Official Syllabus & Booklists (2026-2027)'}
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {syllabusList.map((item) => (
                  <div key={item} className="p-4 rounded-2xl bg-paper border border-ink/10 flex items-center justify-between gap-3">
                    <div className="flex items-center gap-2.5">
                      <BookOpen className="w-4 h-4 text-iris" />
                      <span className="font-bold text-xs sm:text-sm text-board">{item}</span>
                    </div>
                    <button
                      onClick={() => alert(lang === 'bn' ? `ডাউনলোড করা হচ্ছে: ${item}` : `Downloading PDF for ${item}`)}
                      className="p-2 rounded-lg bg-board text-gold hover:bg-boardlt transition-colors cursor-pointer"
                      title="Download PDF"
                    >
                      <Download className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Class Timetable */}
        {activeTab === 'routine' && (
          <div className="space-y-8 animate-fadeIn">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="font-display font-extrabold text-2xl sm:text-3xl text-board">
                  {lang === 'bn' ? 'প্রাত্যহিক ক্লাস ও সমাবেশ সময়সূচি' : 'Daily Class & Assembly Timetable'}
                </h2>
                <p className="text-xs sm:text-sm text-ink/70">
                  {lang === 'bn'
                    ? 'রবিবার থেকে বৃহস্পতিবার ৬ষ্ঠ থেকে ১০ম শ্রেণির জন্য প্রযোজ্য'
                    : 'Applicable Sunday through Thursday for Classes Six to Ten'}
                </p>
              </div>

              <button
                onClick={() => alert(lang === 'bn' ? 'রুটিন পিডিএফ ডাউনলোড শুরু হচ্ছে...' : 'Downloading official class routine PDF...')}
                className="btn inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-board text-chalk text-xs sm:text-sm font-bold hover:bg-boardlt shadow-md shrink-0 cursor-pointer"
              >
                <Download className="w-4 h-4 text-gold" />
                <span>{lang === 'bn' ? 'রুটিন পিডিএফ ডাউনলোড' : 'Download Routine PDF'}</span>
              </button>
            </div>

            <div className="bg-white rounded-2xl sm:rounded-3xl overflow-hidden border border-ink/10 shadow-lg">
              <div className="overflow-x-auto no-scrollbar">
                <table className="w-full min-w-[540px] text-left text-xs sm:text-sm">
                  <thead className="bg-board text-chalk font-display font-bold">
                    <tr>
                      <th className="py-3.5 sm:py-4 px-4 sm:px-6">{lang === 'bn' ? 'সেশন / পিরিয়ড' : 'Session / Period'}</th>
                      <th className="py-3.5 sm:py-4 px-4 sm:px-6">{lang === 'bn' ? 'সময়' : 'Time Slot'}</th>
                      <th className="py-3.5 sm:py-4 px-4 sm:px-6">{lang === 'bn' ? 'পাঠদান কার্যক্রম' : 'Curriculum Activity'}</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-ink/10 font-medium">
                    {routineData.map((row, idx) => (
                      <tr
                        key={row.period}
                        className={
                          row.period.includes('বিরতি') || row.period.includes('Break')
                            ? 'bg-gold/15 font-bold text-board'
                            : idx % 2 === 0
                            ? 'bg-white'
                            : 'bg-paper/80'
                        }
                      >
                        <td className="py-3 sm:py-3.5 px-4 sm:px-6 font-display font-bold text-board">{row.period}</td>
                        <td className="py-3 sm:py-3.5 px-4 sm:px-6 font-mono text-ink/75 whitespace-nowrap">{row.time}</td>
                        <td className="py-3 sm:py-3.5 px-4 sm:px-6 text-ink/80">{row.description}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Tab 3: Facilities */}
        {activeTab === 'facilities' && (
          <div className="grid md:grid-cols-2 gap-8 animate-fadeIn">
            <div className="bg-white rounded-3xl p-6 border border-ink/10 shadow-md flex gap-4 items-start">
              <div className="w-12 h-12 rounded-2xl bg-iris/10 text-iris grid place-items-center shrink-0">
                <Microscope className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-display font-bold text-lg text-board">
                  {lang === 'bn' ? 'বিজ্ঞানাগার (পদার্থ, রসায়ন, জীববিজ্ঞান)' : 'Science Laboratories (Physics, Chemistry, Bio)'}
                </h3>
                <p className="text-xs sm:text-sm text-ink/75 mt-1 leading-relaxed">
                  {lang === 'bn'
                    ? 'পৃথক পৃথক এক্সপেরিমেন্ট টেবিল, প্রয়োজনীয় রাসায়নিক বিকারক, লেন্স, অণুবীক্ষণ যন্ত্র এবং মানবদেহের এনাটমি মডেল সহ সজ্জিত।'
                    : 'Individual experiment tables with chemical reagents, optical lenses, galvanometers, compound microscopes, and anatomical models.'}
                </p>
              </div>
            </div>

            <div className="bg-white rounded-3xl p-6 border border-ink/10 shadow-md flex gap-4 items-start">
              <div className="w-12 h-12 rounded-2xl bg-gold/20 text-gold grid place-items-center shrink-0">
                <BookOpen className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-display font-bold text-lg text-board">
                  {lang === 'bn' ? 'কেন্দ্রীয় পাঠাগার ও পাঠকক্ষ' : 'Academy Central Library'}
                </h3>
                <p className="text-xs sm:text-sm text-ink/75 mt-1 leading-relaxed">
                  {lang === 'bn'
                    ? '১০,০০০ এর অধিক জাতীয় শিক্ষাক্রম বই, রেফারেন্স বিশ্বকোষ, সাহিত্য এবং দৈনিক জাতীয় পত্রিকা সহ নীরব অধ্যয়নের সুবিধাযুক্ত।'
                    : 'Over 10,000 academic titles, reference encyclopedias, Bengali literature, and daily national newspapers with a dedicated silent study hall.'}
                </p>
              </div>
            </div>

            <div className="bg-white rounded-3xl p-6 border border-ink/10 shadow-md flex gap-4 items-start">
              <div className="w-12 h-12 rounded-2xl bg-mint/15 text-mint grid place-items-center shrink-0">
                <Building className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-display font-bold text-lg text-board">
                  {lang === 'bn' ? 'কেন্দ্রীয় খেলার মাঠ ও ক্রীড়া কমপ্লেক্স' : 'Central Playground & Sports Complex'}
                </h3>
                <p className="text-xs sm:text-sm text-ink/75 mt-1 leading-relaxed">
                  {lang === 'bn'
                    ? 'বিশাল ঘাসে ঢাকা খেলার মাঠ, ফুটবল গোলপোস্ট, ক্রিকেট প্র্যাকটিস নেট, ব্যাডমিন্টন কোর্ট এবং উন্মুক্ত সাংস্কৃতিক মঞ্চ।'
                    : 'Full-size green athletic playground, football pitch, cricket practice nets, badminton court, and permanent cultural stage.'}
                </p>
              </div>
            </div>

            <div className="bg-white rounded-3xl p-6 border border-ink/10 shadow-md flex gap-4 items-start">
              <div className="w-12 h-12 rounded-2xl bg-brick/10 text-brick grid place-items-center shrink-0">
                <Sparkles className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-display font-bold text-lg text-board">
                  {lang === 'bn' ? 'কম্পিউটার ও ডিজিটাল আইসিটি ল্যাব' : 'Computer & Digital ICT Lab'}
                </h3>
                <p className="text-xs sm:text-sm text-ink/75 mt-1 leading-relaxed">
                  {lang === 'bn'
                    ? 'উচ্চগতির ব্রডব্যান্ড ইন্টারনেট সংযুক্ত ৪০টি ওয়ার্কস্টেশন, টাচ টাইপিং সফটওয়্যার এবং মৌলিক কোডিং প্রশিক্ষণ কেন্দ্র।'
                    : 'High-speed internet workstations with touch typing software, Microsoft Office suites, and basic programming tools.'}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
