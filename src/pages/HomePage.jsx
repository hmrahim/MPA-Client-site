import { useState, useEffect, useMemo } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import api from '../lib/api'
import {
  Sparkles,
  ArrowRight,
  Award,
  BookOpen,
  Calendar,
  Users,
  Search,
  CheckCircle2,
  Quote,
  Star,
  ExternalLink,
  GraduationCap,
  Microscope,
  TrendingUp,
  Landmark,
  Compass,
  Trophy,
  Clock,
  ShieldCheck,
  ChevronDown,
  HelpCircle,
  MapPin,
  FileText,
  Activity,
  Check,
} from 'lucide-react'
import FullScreenBanner from '../components/FullScreenBanner'
import Ticker from '../components/Ticker'
import Reveal from '../components/Reveal'
import useCountUp from '../hooks/useCountUp'
import useTypewriter from '../hooks/useTypewriter'
import { useLanguage } from '../context/LanguageContext'
import {
  notices,
  toppers,
  events,
  gallery,
  reviews,
  teachWords,
  schoolFaqs,
} from '../data/content'

function StatItem({ icon, label, value }) {
  const animatedValue = useCountUp(value)
  return (
    <div className="bg-white/90 backdrop-blur-md rounded-2xl sm:rounded-3xl p-3.5 sm:p-6 border border-ink/10 shadow-lg hover:shadow-2xl transition-all transform hover:-translate-y-1 text-center relative overflow-hidden group">
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-iris via-gold to-brick opacity-0 group-hover:opacity-100 transition-opacity" />
      <div className="text-2xl sm:text-3xl mb-1.5 sm:mb-2 transform group-hover:scale-110 transition-transform">{icon}</div>
      <dd className="font-display font-black text-2xl sm:text-3xl lg:text-4xl text-board tracking-tight whitespace-nowrap">{animatedValue}</dd>
      <dt className="text-[11px] sm:text-sm font-semibold text-ink/70 mt-1 line-clamp-1">{label}</dt>
    </div>
  )
}

export default function HomePage() {
  const navigate = useNavigate()
  const { lang, t, num } = useLanguage()

  const [headmaster, setHeadmaster] = useState(() => {
    try {
      const cached = localStorage.getItem('mpa_headmaster_section')
      return cached ? JSON.parse(cached) : null
    } catch {
      return null
    }
  })

  const [academicSection, setAcademicSection] = useState(() => {
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

  const [facilitiesSection, setFacilitiesSection] = useState(() => {
    try {
      const cached = localStorage.getItem('mpa_facilities_section')
      return cached ? JSON.parse(cached) : null
    } catch {
      return null
    }
  })

  const [clubsSection, setClubsSection] = useState(() => {
    try {
      const cached = localStorage.getItem('mpa_clubs_section')
      return cached ? JSON.parse(cached) : null
    } catch {
      return null
    }
  })

  const [noticeSection, setNoticeSection] = useState(null)
  const [dbToppers, setDbToppers] = useState(() => {
    try {
      const cached = localStorage.getItem('mpa_toppers_cache')
      return cached ? JSON.parse(cached) : null
    } catch {
      return null
    }
  })
  const [dbGallery, setDbGallery] = useState(() => {
    try {
      const cached = localStorage.getItem('mpa_gallery_cache')
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
    api.getHeadmaster()
      .then((res) => {
        if (res && res.success && res.data && isMounted) {
          setHeadmaster(res.data)
          localStorage.setItem('mpa_headmaster_section', JSON.stringify(res.data))
        }
      })
      .catch((err) => console.warn('Could not load headmaster data', err))

    const loadAcademic = () => {
      api.getAcademicGroups()
        .then((res) => {
          if (res && res.success && res.data && isMounted) {
            setAcademicSection(res.data)
            localStorage.setItem('mpa_academic_groups_section', JSON.stringify(res.data))
          }
        })
        .catch((err) => console.warn('Could not load academic groups data', err))
    }

    const loadRoutine = () => {
      api.getRoutine()
        .then((res) => {
          if (res && res.success && res.data && isMounted) {
            setRoutineSection(res.data)
            localStorage.setItem('mpa_routine_section', JSON.stringify(res.data))
          }
        })
        .catch((err) => console.warn('Could not load routine data', err))
    }

    const loadFacilities = () => {
      api.getFacilities()
        .then((res) => {
          if (res && res.success && res.data && isMounted) {
            setFacilitiesSection(res.data)
            localStorage.setItem('mpa_facilities_section', JSON.stringify(res.data))
          }
        })
        .catch((err) => console.warn('Could not load facilities data', err))
    }

    const loadClubs = () => {
      api.getClubs()
        .then((res) => {
          if (res && res.success && res.data && isMounted) {
            setClubsSection(res.data)
            localStorage.setItem('mpa_clubs_section', JSON.stringify(res.data))
          }
        })
        .catch((err) => console.warn('Could not load clubs data', err))
    }

    const loadNotices = () => {
      api.getNotices()
        .then((res) => {
          if (res && res.success && res.data && isMounted) {
            setNoticeSection(res.data)
          }
        })
        .catch((err) => console.warn('Could not load notices data', err))
    }

    const loadToppers = () => {
      api.getToppers()
        .then((res) => {
          if (res && res.success && res.data && isMounted) {
            setDbToppers(res.data)
            localStorage.setItem('mpa_toppers_cache', JSON.stringify(res.data))
          }
        })
        .catch(() => {})
    }

    const loadGallery = () => {
      api.getGallery()
        .then((res) => {
          if (res && res.success && res.data && isMounted) {
            setDbGallery(res.data)
            localStorage.setItem('mpa_gallery_cache', JSON.stringify(res.data))
          }
        })
        .catch(() => {})
    }

    const loadSchoolInfo = () => {
      api.getSchoolInfo()
        .then((res) => {
          if (res && res.success && res.data && isMounted) {
            setSchoolInfo(res.data)
            localStorage.setItem('mpa_school_info_cache', JSON.stringify(res.data))
          }
        })
        .catch(() => {})
    }

    loadAcademic()
    loadRoutine()
    loadFacilities()
    loadClubs()
    loadNotices()
    loadToppers()
    loadGallery()
    loadSchoolInfo()

    const onUpdate = () => {
      try {
        const cached = localStorage.getItem('mpa_academic_groups_section')
        if (cached) setAcademicSection(JSON.parse(cached))
      } catch (_) {}
    }

    const onRoutineUpdate = () => {
      try {
        const cached = localStorage.getItem('mpa_routine_section')
        if (cached) setRoutineSection(JSON.parse(cached))
      } catch (_) {}
    }

    const onFacilitiesUpdate = () => {
      try {
        const cached = localStorage.getItem('mpa_facilities_section')
        if (cached) setFacilitiesSection(JSON.parse(cached))
      } catch (_) {}
    }

    const onClubsUpdate = () => {
      try {
        const cached = localStorage.getItem('mpa_clubs_section')
        if (cached) setClubsSection(JSON.parse(cached))
      } catch (_) {}
    }

    const onNoticesUpdate = () => {
      loadNotices()
    }

    const onToppersUpdate = () => {
      loadToppers()
    }

    const onGalleryUpdate = () => {
      loadGallery()
    }

    const onSchoolInfoUpdate = () => {
      loadSchoolInfo()
    }

    window.addEventListener('storage', onUpdate)
    window.addEventListener('storage', onRoutineUpdate)
    window.addEventListener('storage', onFacilitiesUpdate)
    window.addEventListener('storage', onClubsUpdate)
    window.addEventListener('mpa_academic_groups_updated', onUpdate)
    window.addEventListener('mpa_routine_updated', onRoutineUpdate)
    window.addEventListener('mpa_facilities_updated', onFacilitiesUpdate)
    window.addEventListener('mpa_clubs_updated', onClubsUpdate)
    window.addEventListener('mpa_notices_updated', onNoticesUpdate)
    window.addEventListener('mpa_toppers_updated', onToppersUpdate)
    window.addEventListener('mpa_gallery_updated', onGalleryUpdate)
    window.addEventListener('mpa_school_info_updated', onSchoolInfoUpdate)

    return () => {
      isMounted = false
      window.removeEventListener('storage', onUpdate)
      window.removeEventListener('storage', onRoutineUpdate)
      window.removeEventListener('storage', onFacilitiesUpdate)
      window.removeEventListener('storage', onClubsUpdate)
      window.removeEventListener('mpa_academic_groups_updated', onUpdate)
      window.removeEventListener('mpa_routine_updated', onRoutineUpdate)
      window.removeEventListener('mpa_facilities_updated', onFacilitiesUpdate)
      window.removeEventListener('mpa_clubs_updated', onClubsUpdate)
      window.removeEventListener('mpa_notices_updated', onNoticesUpdate)
      window.removeEventListener('mpa_toppers_updated', onToppersUpdate)
      window.removeEventListener('mpa_gallery_updated', onGalleryUpdate)
      window.removeEventListener('mpa_school_info_updated', onSchoolInfoUpdate)
    }
  }, [])

  const defaultDynamicWords = lang === 'bn'
    ? ['বিজ্ঞান ও উদ্ভাবন', 'গণিত ও যুক্তিশাস্ত্র', 'সাহিত্য ও মাতৃভাষা', 'নৈতিক শৃঙ্খলা', 'খেলাধুলা ও নেতৃত্ব']
    : teachWords

  const dynamicWords = lang === 'bn'
    ? (headmaster?.empowerSkillsBn?.length ? headmaster.empowerSkillsBn : defaultDynamicWords)
    : (headmaster?.empowerSkills?.length ? headmaster.empowerSkills : defaultDynamicWords)

  const dynamicSkill = useTypewriter(dynamicWords)
  const [quickClass, setQuickClass] = useState('Ten')
  const [quickRoll, setQuickRoll] = useState('')
  const [activeFaq, setActiveFaq] = useState(null)
  const [activeGalleryCat, setActiveGalleryCat] = useState('All')

  const handleQuickResult = (e) => {
    e.preventDefault()
    if (!quickRoll) return
    navigate(`/results?cls=${encodeURIComponent(quickClass)}&roll=${encodeURIComponent(quickRoll)}`)
  }

  const toggleFaq = (idx) => {
    setActiveFaq(activeFaq === idx ? null : idx)
  }

  const classOptions = [
    { value: 'Six', label: lang === 'bn' ? '৬ষ্ঠ শ্রেণি' : 'Class Six' },
    { value: 'Seven', label: lang === 'bn' ? '৭ম শ্রেণি' : 'Class Seven' },
    { value: 'Eight', label: lang === 'bn' ? '৮ম শ্রেণি' : 'Class Eight' },
    { value: 'Nine', label: lang === 'bn' ? '৯ম শ্রেণি' : 'Class Nine' },
    { value: 'Ten', label: lang === 'bn' ? '১০ম শ্রেণি' : 'Class Ten' },
  ]

  // Localized Statistics (Dynamic from schoolInfo)
  const localizedHeroStats = [
    {
      icon: '🎓',
      label: t('statStudents'),
      value: num(schoolInfo?.stats?.studentsCount ? (lang === 'bn' ? schoolInfo.stats.studentsCountBn || schoolInfo.stats.studentsCount : schoolInfo.stats.studentsCount) : '1,850+'),
    },
    {
      icon: '👩‍🏫',
      label: t('statTeachers'),
      value: num(schoolInfo?.stats?.teachersCount ? (lang === 'bn' ? schoolInfo.stats.teachersCountBn || schoolInfo.stats.teachersCount : schoolInfo.stats.teachersCount) : '54'),
    },
    {
      icon: '🏆',
      label: t('statPassRate'),
      value: num(schoolInfo?.stats?.passRate ? (lang === 'bn' ? schoolInfo.stats.passRateBn || schoolInfo.stats.passRate : schoolInfo.stats.passRate) : '99.4%'),
    },
    {
      icon: '🏫',
      label: t('statHeritage'),
      value: num(schoolInfo?.stats?.heritageYears ? (lang === 'bn' ? schoolInfo.stats.heritageYearsBn || schoolInfo.stats.heritageYears : schoolInfo.stats.heritageYears) : '21 Yrs'),
    },
  ]

  // Localized Academic Groups
  const localizedGroups = [
    {
      name: t('groupScienceName'),
      icon: '🔬',
      desc: t('groupScienceDesc'),
      subjects: lang === 'bn'
        ? ['পদার্থবিজ্ঞান', 'রসায়ন', 'জীববিজ্ঞান', 'উচ্চতর গণিত', 'সাধারণ গণিত', 'আইসিটি']
        : ['Physics', 'Chemistry', 'Biology', 'Higher Math', 'General Math', 'ICT'],
      border: 'border-cyan-500/30',
      pathway: lang === 'bn'
        ? 'উচ্চ মাধ্যমিক (বিজ্ঞান), মেডিকেল (MBBS), বুয়েট/প্রকৌশল বিশ্ববিদ্যালয় ও বৈজ্ঞানিক গবেষণা'
        : 'HSC Science, Medical (MBBS), Engineering (BUET), Technology & Research',
    },
    {
      name: t('groupCommerceName'),
      icon: '📊',
      desc: t('groupCommerceDesc'),
      subjects: lang === 'bn'
        ? ['হিসাববিজ্ঞান', 'ব্যবসায় উদ্যোগ', 'ফিন্যান্স ও ব্যাংকিং', 'সাধারণ বিজ্ঞান', 'গণিত']
        : ['Accounting', 'Business Ent.', 'Finance & Banking', 'General Science', 'General Math'],
      border: 'border-amber-500/30',
      pathway: lang === 'bn'
        ? 'উচ্চ মাধ্যমিক (ব্যবসায় শিক্ষা), বিবিএ (IBA/DU), চার্টার্ড একাউন্টেন্সি (CA) ও করপোরেট ব্যবস্থাপনা'
        : 'HSC Commerce, BBA/MBA (IBA), Chartered Accountancy (CA), Corporate Finance',
    },
    {
      name: t('groupHumanitiesName'),
      icon: '📜',
      desc: t('groupHumanitiesDesc'),
      subjects: lang === 'bn'
        ? ['ইতিহাস ও বিশ্বসভ্যতা', 'ভূগোল ও পরিবেশ', 'পৌরনীতি ও নাগরিকতা', 'অর্থনীতি', 'আইসিটি']
        : ['History & Civ.', 'Geography', 'Civics & Citizen.', 'Economics', 'General Science'],
      border: 'border-emerald-500/30',
      pathway: lang === 'bn'
        ? 'উচ্চ মাধ্যমিক (মানবিক), আইন (LLB), বিসিএস/প্রশাসনিক ক্যাডার, সাংবাদিকতা ও আন্তর্জাতিক সম্পর্ক'
        : 'HSC Humanities, Law (LLB), Civil Services (BCS), Journalism & Public Policy',
    },
    {
      name: t('groupJuniorName'),
      icon: '📚',
      desc: t('groupJuniorDesc'),
      subjects: lang === 'bn'
        ? ['বাংলা (১ম ও ২য়)', 'ইংরেজি গ্রামার', 'গণিত', 'সাধারণ বিজ্ঞান', 'বিজিএস', 'ধর্ম']
        : ['Bangla', 'English', 'Mathematics', 'General Science', 'BGS', 'Religion'],
      border: 'border-purple-500/30',
      pathway: lang === 'bn'
        ? '৯ম শ্রেণিতে বিজ্ঞান, বাণিজ্য বা মানবিক বিভাগে উত্তীর্ণ হওয়ার দৃঢ় একাডেমিক ভিত্তি'
        : 'High grade foundation for SSC Science, Commerce or Humanities stream entry',
    },
  ]

  // Dynamic Academic Groups from Dashboard / Backend API
  const isAcademicActive = academicSection?.isActive !== false
  const academicTag = (lang === 'bn' ? academicSection?.tagBn || academicSection?.tag : academicSection?.tag || academicSection?.tagBn) || t('academicHeading')
  const academicTitle = (lang === 'bn' ? academicSection?.titleBn || academicSection?.title : academicSection?.title || academicSection?.titleBn) || (lang === 'bn' ? 'একাডেমিক বিভাগ ও পাঠ্য বিষয়সমূহ' : 'Academic Groups & Disciplines')
  const academicSubtitle = (lang === 'bn' ? academicSection?.subtitleBn || academicSection?.subtitle : academicSection?.subtitle || academicSection?.subtitleBn) || t('academicSub')
  const keySubjectsLabel = (lang === 'bn' ? academicSection?.keySubjectsLabelBn || academicSection?.keySubjectsLabel : academicSection?.keySubjectsLabel || academicSection?.keySubjectsLabelBn) || t('keySubjects')
  const pathwayLabel = (lang === 'bn' ? academicSection?.pathwayLabelBn || academicSection?.pathwayLabel : academicSection?.pathwayLabel || academicSection?.pathwayLabelBn) || t('pathwayLabel')

  const groupsToDisplay = (academicSection?.groups && academicSection.groups.length > 0)
    ? academicSection.groups.filter((g) => g.isActive !== false).map((g) => ({
        id: g.id || g._id,
        name: lang === 'bn' ? (g.nameBn || g.name) : (g.name || g.nameBn),
        icon: g.icon || '📘',
        desc: lang === 'bn' ? (g.descBn || g.desc) : (g.desc || g.descBn),
        subjects: (lang === 'bn'
          ? (g.subjectsBn?.length ? g.subjectsBn : g.subjects)
          : (g.subjects?.length ? g.subjects : g.subjectsBn)) || [],
        border: g.border || 'border-cyan-500/30',
        pathway: lang === 'bn' ? (g.pathwayBn || g.pathway) : (g.pathway || g.pathwayBn),
        buttonText: (lang === 'bn' ? (g.buttonTextBn || g.buttonText) : (g.buttonText || g.buttonTextBn)) || t('curriculumDetails'),
        buttonLink: g.buttonLink || '/academics',
      }))
    : localizedGroups

  // Default Daily Routine (Fallback)
  const defaultRoutineList = lang === 'bn' ? [
    { time: 'সকাল ৮:৩০ - ৯:০০', title: 'প্রাত্যহিক সমাবেশ ও শারীরিক কসরত', desc: 'পবিত্র কোরআন ও ধর্মগ্রন্থ পাঠ, জাতীয় সংগীত, শপথ বাক্য পাঠ এবং মাঠভর্তি শরীরচর্চা (PT)।' },
    { time: 'সকাল ৯:০০ - ১০:৩০', title: '১ম ও ২য় পিরিয়ড (মূল তাত্ত্বিক বিষয়)', desc: 'বাংলা সাহিত্য ও ব্যাকরণ, ইংরেজি কমিউনিকেটিভ গ্রামার এবং বীজগণিত-জ্যামিতি।' },
    { time: 'সকাল ১০:৩০ - ১২:০০', title: '৩য় ও ৪র্থ পিরিয়ড (বিভাগীয় বিষয়)', desc: 'পদার্থবিজ্ঞান, রসায়ন, হিসাববিজ্ঞান, বাংলাদেশ ও বিশ্বপরিচয় এবং সাধারণ বিজ্ঞান।' },
    { time: 'দুপুর ১২:০০ - ১২:৪৫', title: 'টিফিন বিরতি ও যোহরের নামাজ', desc: 'স্বাস্থ্যকর টিফিন গ্রহণ, সহপাঠীদের সাথে সামাজিকীকরণ ও নামাজকক্ষে জামাতে নামাজ।' },
    { time: 'দুপুর ১২:৪৫ - ২:১৫', title: '৫ম ও ৬ষ্ঠ পিরিয়ড (ব্যবহারিক ল্যাব)', desc: 'বিজ্ঞান ল্যাবে যন্ত্রপাতি নিয়ে পরীক্ষা, আইসিটি কম্পিউটার ল্যাবে টাইপিং ও প্রোগ্রামিং।' },
    { time: 'দুপুর ২:১৫ - ৩:০০', title: '৭ম পিরিয়ড ও ক্লাস ডায়রি মূল্যায়ন', desc: 'হোমওয়ার্ক চেক, পাঠাগার থেকে বই আদান-প্রদান এবং শিক্ষকদের বিশেষ পরামর্শ গ্রহণ।' },
    { time: 'বিকাল ৩:০০ - ৪:৩০', title: 'সহ-শিক্ষা ও ক্রীড়া প্রশিক্ষণ', desc: 'বাংলাদেশ স্কাউটস প্যারেড, সংসদীয় বিতর্ক কর্মশালা, ফুটবল ও ক্রিকেট অনুশীলন।' },
  ] : [
    { time: '08:30 AM - 09:00 AM', title: 'Morning Assembly & Physical Drill', desc: 'National anthem, scripture recitation, school oath, and PT fitness drill in main ground.' },
    { time: '09:00 AM - 10:30 AM', title: '1st & 2nd Academic Periods', desc: 'Core academic subjects: Bangla 1st/2nd Paper, English Communicative Grammar, and Mathematics.' },
    { time: '10:30 AM - 12:00 PM', title: '3rd & 4th Academic Periods', desc: 'Discipline subjects: Physics, Chemistry, Accounting, History, Geography, and Higher Mathematics.' },
    { time: '12:00 PM - 12:45 PM', title: 'Mid-Day Tiffin & Dhuhr Prayer Break', desc: 'Nutritious lunch tiffin, socializing, and congregational Zohr prayer in school prayer room.' },
    { time: '12:45 PM - 02:15 PM', title: '5th & 6th Academic Periods', desc: 'Science Laboratory Practicals, ICT Computer Lab lessons, Biology experiments, and BGS lectures.' },
    { time: '02:15 PM - 03:00 PM', title: '7th Period & Class Review', desc: 'Doubt clearing, homework diary checking, library reference reading, and moral guidance.' },
    { time: '03:00 PM - 04:30 PM', title: 'Co-Curricular & Outdoor Activities', desc: 'Bangladesh Scouts parade, debate practice, football/cricket games, and science club projects.' },
  ]

  // Dynamic Discipline & Routine Section from Dashboard / Backend API
  const isRoutineActive = routineSection?.isActive !== false
  const routineTag = (lang === 'bn' ? (routineSection?.tagBn || routineSection?.tag) : (routineSection?.tag || routineSection?.tagBn)) || t('routineTag')
  const routineTitle = (lang === 'bn' ? (routineSection?.titleBn || routineSection?.title) : (routineSection?.title || routineSection?.titleBn)) || t('routineHeading')
  const routineSubtitle = (lang === 'bn' ? (routineSection?.subtitleBn || routineSection?.subtitle) : (routineSection?.subtitle || routineSection?.subtitleBn)) || t('routineSub')

  const localizedRoutine = (routineSection?.items && routineSection.items.length > 0)
    ? routineSection.items
        .filter((item) => item.isActive !== false)
        .sort((a, b) => (a.order || 0) - (b.order || 0))
        .map((item) => ({
          id: item.id || item._id,
          time: lang === 'bn' ? (item.timeBn || item.time) : (item.time || item.timeBn),
          title: lang === 'bn' ? (item.titleBn || item.title) : (item.title || item.titleBn),
          desc: lang === 'bn' ? (item.descBn || item.desc) : (item.desc || item.descBn),
        }))
    : defaultRoutineList

  // Dynamic Facilities & Infrastructure Section from Dashboard / Backend API
  const isFacilitiesActive = facilitiesSection?.isActive !== false
  const facilitiesTag = (lang === 'bn' ? (facilitiesSection?.tagBn || facilitiesSection?.tag) : (facilitiesSection?.tag || facilitiesSection?.tagBn)) || t('facilitiesTag')
  const facilitiesHeading = (lang === 'bn' ? (facilitiesSection?.titleBn || facilitiesSection?.title) : (facilitiesSection?.title || facilitiesSection?.titleBn)) || t('facilitiesHeading')
  const facilitiesSub = (lang === 'bn' ? (facilitiesSection?.subtitleBn || facilitiesSection?.subtitle) : (facilitiesSection?.subtitle || facilitiesSection?.subtitleBn)) || t('facilitiesSub')

  const defaultFacilitiesList = lang === 'bn' ? [
    { id: 'fac-1', title: 'আধুনিক ৩টি বিজ্ঞানাগার', desc: 'পদার্থ, রসায়ন ও জীববিজ্ঞানের পৃথক শীতাতপ নিয়ন্ত্রিত ল্যাবরেটরি যেখানে শতভাগ ব্যবহারিক ক্লাস নিশ্চিত করা হয়।', icon: '🔬', metric: '৩টি পৃথক ল্যাব' },
    { id: 'fac-2', title: 'ডিজিটাল মাল্টিমিডিয়া ক্লাসরুম', desc: 'প্রজেক্টর ও স্মার্ট ডিসপ্লে সুবিধা সম্বলিত আধুনিক ক্লাসরুম যা জটিল বৈজ্ঞানিক তত্ত্বকে সহজবোধ্য করে তোলে।', icon: '🖥️', metric: 'স্মার্ট ক্লাসরুম' },
    { id: 'fac-3', title: 'সমৃদ্ধ কেন্দ্রীয় পাঠাগার', desc: '১০,০০০ এরও বেশি পাঠ্যপুস্তক গাইড, বিশ্বকোষ, বাংলা ও বিশ্বসাহিত্যের বই এবং শান্ত পড়াশোনার পরিবেশ।', icon: '📚', metric: '১০,০০০+ বই' },
    { id: 'fac-4', title: 'আইসিটি ও কম্পিউটার ল্যাব', desc: 'উচ্চগতির ব্রডব্যান্ড ইন্টারনেট এবং ৪০টি আধুনিক কম্পিউটার সম্বলিত আধুনিক ডিজিটাল ল্যাবরেটরি।', icon: '💻', metric: '৪০টি ওয়ার্কস্টেশন' },
    { id: 'fac-5', title: 'বিশাল সবুজ খেলার মাঠ', desc: 'ফুটবল গোলপোস্ট, ক্রিকেট পিচ এবং দৌড়ের ট্র্যাক সম্বলিত সুপ্রশস্ত ঘাসে ঢাকা স্কুল মাঠ।', icon: '⚽', metric: 'পূর্ণাঙ্গ খেলার মাঠ' },
    { id: 'fac-6', title: 'স্থায়ী শহীদ মিনার ও সাংস্কৃতিক মঞ্চ', desc: 'একুশে ফেব্রুয়ারি, স্বাধীনতা দিবস ও বিজয় দিবসে শ্রদ্ধা নিবেদন এবং সাংস্কৃতিক অনুষ্ঠানের কেন্দ্রবিন্দু।', icon: '🏛️', metric: 'সাংস্কৃতিক চত্বর' },
    { id: 'fac-7', title: 'বিশুদ্ধ পানীয় জল ও স্বাস্থ্যকর ক্যান্টিন', desc: 'আরও (RO) ফিল্টারযুক্ত বিশুদ্ধ খাবার পানির প্ল্যান্ট এবং পরিচ্ছন্ন খাবার সরবরাহকারী ক্যান্টিন।', icon: '💧', metric: 'RO ফিল্টার পানি' },
    { id: 'fac-8', title: 'নিরাপদ ক্যাম্পাস ও সিসিটিভি নজরদারি', desc: 'সম্পূর্ণ প্রাচীরঘেরা ক্যাম্পাস, সার্বক্ষণিক সিসিটিভি ক্যামেরা এবং ছাত্রীদের জন্য পৃথক কমনরুম।', icon: '🛡️', metric: '২৪/৭ নিরাপদ ক্যাম্পাস' },
  ] : [
    { id: 'fac-1', title: 'Modern Science Labs', desc: 'Separate, fully equipped laboratories for Physics, Chemistry, and Biology with microscopes, burners, glassware, and certified reagents.', icon: '🔬', metric: '3 Specialized Labs' },
    { id: 'fac-2', title: 'Multimedia Digital Classrooms', desc: 'Interactive smart projectors and audiovisual setups making abstract science, math, and geography topics easy to understand.', icon: '🖥️', metric: 'Smart Displays' },
    { id: 'fac-3', title: 'Central Academic Library', desc: 'Rich collection of over 10,000+ national textbook guides, encyclopedias, literature, and quiet reading booths.', icon: '📚', metric: '10,000+ Books' },
    { id: 'fac-4', title: 'ICT & Computer Lab', desc: '40 modern networked computers with high-speed broadband internet, digital typing stations, and introductory programming.', icon: '💻', metric: '40 Workstations' },
    { id: 'fac-5', title: 'Large Green Sports Playground', desc: 'Expansive field with football goalposts, cricket pitch, volleyball court, and running track for daily physical exercise.', icon: '⚽', metric: 'Full-size Ground' },
    { id: 'fac-6', title: 'Shaheed Minar & Cultural Stage', desc: 'Architectural monument for Language Day (21st February), Victory Day, Independence Day, and school open-air assemblies.', icon: '🏛️', metric: 'Open Cultural Plaza' },
    { id: 'fac-7', title: 'Pure Drinking Water & Cafeteria', desc: 'Multi-stage RO filtered drinking water points and hygienic canteen providing fresh, nutritious tiffin snacks.', icon: '💧', metric: 'RO Filtered Pure Water' },
    { id: 'fac-8', title: 'Campus Safety & CCTV Security', desc: 'Secured boundary perimeter, 24/7 CCTV surveillance cameras across all corridors, and dedicated girls’ common room.', icon: '🛡️', metric: '24/7 Safe Campus' },
  ]

  const localizedFacilities = (facilitiesSection?.facilities && facilitiesSection.facilities.length > 0)
    ? facilitiesSection.facilities
        .filter((fac) => fac.isActive !== false)
        .sort((a, b) => (a.order || 0) - (b.order || 0))
        .map((fac) => ({
          id: fac.id || fac._id,
          icon: fac.icon || '🏢',
          metric: lang === 'bn' ? (fac.metricBn || fac.metric) : (fac.metric || fac.metricBn),
          title: lang === 'bn' ? (fac.titleBn || fac.title) : (fac.title || fac.titleBn),
          desc: lang === 'bn' ? (fac.descBn || fac.desc) : (fac.desc || fac.descBn),
        }))
    : defaultFacilitiesList

  // Dynamic Co-Curricular & Student Clubs Section from Dashboard / Backend API
  const isClubsActive = clubsSection?.isActive !== false
  const clubsTag = (lang === 'bn' ? (clubsSection?.tagBn || clubsSection?.tag) : (clubsSection?.tag || clubsSection?.tagBn)) || t('clubsTag')
  const clubsHeading = (lang === 'bn' ? (clubsSection?.titleBn || clubsSection?.title) : (clubsSection?.title || clubsSection?.titleBn)) || t('clubsHeading')
  const clubsSub = (lang === 'bn' ? (clubsSection?.subtitleBn || clubsSection?.subtitle) : (clubsSection?.subtitle || clubsSection?.subtitleBn)) || t('clubsSub')

  const defaultClubsList = lang === 'bn' ? [
    { id: 'club-1', name: 'বিজ্ঞান ও উদ্ভাবন ক্লাব', icon: '🚀', desc: 'সাপ্তাহিক বৈজ্ঞানিক প্রজেক্ট প্রদর্শনী, টেলিস্কোপে আকাশ পর্যবেক্ষণ এবং গণিত অলিম্পিয়াড প্রশিক্ষণ।' },
    { id: 'club-2', name: 'স্কুল ডিবেটিং সোসাইটি (বিতর্ক পরিষদ)', icon: '🎙️', desc: 'বাংলা ও ইংরেজি ভাষায় সনাতনী ও সংসদীয় বিতর্ক কর্মশালা এবং আন্তঃস্কুল বিতর্ক প্রতিযোগিতা।' },
    { id: 'club-3', name: 'বাংলাদেশ স্কাউটস ও গার্ল গাইডস', icon: '🏕️', desc: 'নৈতিক চরিত্র গঠন, ক্যাম্পিং, প্রাথমিক চিকিৎসা ও ট্রাফিক সচেতনতা এবং সামাজিক মানবসেবা।' },
    { id: 'club-4', name: 'সাংস্কৃতিক ও সাহিত্য সংসদ', icon: '🎭', desc: 'দেশাত্মবোধক গান, রবীন্দ্র-নজরুল সঙ্গীত, আবৃত্তি, নাট্যমঞ্চায়ন ও বার্ষিক দেয়াল পত্রিকা প্রকাশনা।' },
    { id: 'club-5', name: 'ক্রীড়া ও অ্যাথলেটিক্স পরিষদ', icon: '🏆', desc: 'আন্তঃহাউস ফুটবল ও ক্রিকেট টুর্নামেন্ট, ১০০ মিটার স্প্রিন্ট, ব্যাডমিন্টন ও হ্যান্ডবল প্রতিযোগিতা।' },
    { id: 'club-6', name: 'ভাষা ও ইংরেজি ক্লাব', icon: '📖', desc: 'স্পেলিং বি প্রতিযোগিতা, ক্রিয়েটিভ ইংরেজি রাইটিং এবং সাবলীল উচ্চারণ ও কথোপকথন চর্চা।' },
  ] : [
    { id: 'club-1', name: 'Science & Innovation Club', icon: '🚀', desc: 'Weekly practical experiments, science model displays, astronomy sky-watching, and Math Olympiad workshops.' },
    { id: 'club-2', name: 'School Debating Society', icon: '🎙️', desc: 'Parliamentary and traditional debate in Bangla & English, extempore speech, and championship.' },
    { id: 'club-3', name: 'Bangladesh Scouts & Girl Guides', icon: '🏕️', desc: 'Character building, outdoor camping, first aid, traffic awareness, and national disaster relief.' },
    { id: 'club-4', name: 'Cultural & Performing Arts', icon: '🎭', desc: 'Patriotic songs, Nazrul-Rabindra sangeet, recitation, theatre staging, and national celebrations.' },
    { id: 'club-5', name: 'Sports & Athletics Association', icon: '🏆', desc: 'Football cup tournaments, cricket leagues, badminton tournaments, 100m sprint, and athletic meets.' },
    { id: 'club-6', name: 'Language & Literary Club', icon: '📖', desc: 'Spelling bee contests, creative writing, poetry recitations, and publishing the school annual wall magazine.' },
  ]

  const localizedClubs = (clubsSection?.clubs && clubsSection.clubs.length > 0)
    ? clubsSection.clubs
        .filter((club) => club.isActive !== false)
        .sort((a, b) => (a.order || 0) - (b.order || 0))
        .map((club) => ({
          id: club.id || club._id,
          icon: club.icon || '🎯',
          name: lang === 'bn' ? (club.nameBn || club.name) : (club.name || club.nameBn),
          desc: lang === 'bn' ? (club.descBn || club.desc) : (club.desc || club.descBn),
        }))
    : defaultClubsList

  // Localized Notices (Dynamic from noticeSection, fallback to content.js)
  const defaultNoticeList = notices[lang] || notices.bn || []
  const localizedNotices = (noticeSection?.notices && noticeSection.notices.length > 0)
    ? noticeSection.notices
        .filter((n) => n.isActive !== false)
        .sort((a, b) => {
          // Pinned first, then order
          if (a.pinned && !b.pinned) return -1
          if (!a.pinned && b.pinned) return 1
          return (a.order || 0) - (b.order || 0)
        })
        .slice(0, 3)
        .map((n) => ({
          id: n.id || n._id,
          cat: lang === 'bn' ? (n.catBn || n.cat) : (n.cat || n.catBn),
          date: lang === 'bn' ? (n.dateBn || n.date) : (n.date || n.dateBn),
          title: lang === 'bn' ? (n.titleBn || n.title) : (n.title || n.titleBn),
          text: lang === 'bn' ? (n.textBn || n.text) : (n.text || n.textBn),
          pinned: n.pinned,
        }))
    : defaultNoticeList.slice(0, 3)

  // Localized Notice Section Titles (word-to-word dynamic)
  const noticeSectionTag = (lang === 'bn' ? (noticeSection?.tagBn || noticeSection?.tag) : (noticeSection?.tag || noticeSection?.tagBn)) || t('noticeTag')
  const noticeSectionTitle = (lang === 'bn' ? (noticeSection?.titleBn || noticeSection?.title) : (noticeSection?.title || noticeSection?.titleBn)) || t('noticeHeading')

  // Localized FAQs
  const localizedFaqs = schoolFaqs[lang] || schoolFaqs.bn

  const previewToppers = useMemo(() => {
    if (dbToppers && dbToppers.length > 0) {
      const tenToppers = dbToppers.filter((t) => (t.className || '').toLowerCase() === 'ten' && t.isActive !== false)
      if (tenToppers.length > 0) {
        return tenToppers.slice(0, 4).map((t) => ({
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
        }))
      }
    }
    return toppers.Ten.slice(0, 4)
  }, [dbToppers])

  const galleryCategories = lang === 'bn'
    ? [
        { id: 'All', label: 'সকল ছবি' },
        { id: 'Sports', label: 'খেলাধুলা' },
        { id: 'Science', label: 'বিজ্ঞান মেলা' },
        { id: 'Campus', label: 'ক্যাম্পাস' },
        { id: 'Cultural', label: 'সাংস্কৃতিক' },
        { id: 'Awards', label: 'পুরস্কার বিতরণ' },
      ]
    : [
        { id: 'All', label: 'All' },
        { id: 'Sports', label: 'Sports' },
        { id: 'Science', label: 'Science' },
        { id: 'Campus', label: 'Campus' },
        { id: 'Cultural', label: 'Cultural' },
        { id: 'Awards', label: 'Awards' },
      ]

  const rawGallery = useMemo(() => {
    if (dbGallery && dbGallery.length > 0) {
      return dbGallery.filter((g) => g.isActive !== false).map((g) => ({
        id: g._id || g.id,
        label: lang === 'bn' ? (g.titleBn || g.title) : (g.title || g.titleBn),
        category: g.category || 'Campus',
        categoryBn: g.categoryBn || 'ক্যাম্পাস',
        src: g.imageUrl,
        caption: lang === 'bn' ? (g.captionBn || g.caption) : (g.caption || g.captionBn),
      }))
    }
    return gallery[lang] || gallery.bn
  }, [dbGallery, lang])

  const filteredGallery = activeGalleryCat === 'All'
    ? rawGallery.slice(0, 6)
    : rawGallery.filter((g) => {
        const cat = (g.category || '').toLowerCase()
        const sel = activeGalleryCat.toLowerCase()
        return cat === sel ||
          (activeGalleryCat === 'Sports' && (cat === 'খেলাধুলা' || cat === 'sports')) ||
          (activeGalleryCat === 'Science' && (cat === 'বিজ্ঞান' || cat === 'science')) ||
          (activeGalleryCat === 'Campus' && (cat === 'ক্যাম্পাস' || cat === 'campus')) ||
          (activeGalleryCat === 'Cultural' && (cat === 'সাংস্কৃতিক' || cat === 'cultural')) ||
          (activeGalleryCat === 'Awards' && (cat === 'পুরস্কার' || cat === 'awards'))
      }).slice(0, 6)

  return (
    <div className="w-full">
      {/* 1. Full-Screen Grand School Events Banner */}
      <FullScreenBanner />

      {/* 2. Breaking Announcement Ticker */}
      <Ticker />

      {/* 3. Fast Action & Quick Result Checker Bar */}
      <section className="relative z-30 -mt-8 sm:-mt-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-2xl sm:rounded-3xl shadow-2xl border border-ink/10 p-4 sm:p-6 md:p-8 grid md:grid-cols-12 gap-6 md:gap-8 items-center">
          {/* Left: Quick Result Form */}
          <div className="md:col-span-7 border-b md:border-b-0 md:border-r border-ink/10 pb-6 md:pb-0 md:pr-8">
            <div className="flex items-center gap-2 mb-2">
              <span className="w-2.5 h-2.5 rounded-full bg-gold animate-ping" />
              <h3 className="font-display font-bold text-lg text-board">{t('marksheetTitle')}</h3>
              <span className="text-xs text-mint font-bold px-2 py-0.5 rounded-full bg-mint/10 border border-mint/20">
                {t('marksheetBadge')}
              </span>
            </div>
            <p className="text-xs sm:text-sm text-ink/70 mb-4">
              {t('marksheetDesc')}
            </p>

            <form onSubmit={handleQuickResult} className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <select
                value={quickClass}
                onChange={(e) => setQuickClass(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-ink/20 text-sm font-medium focus:ring-2 focus:ring-iris/30 focus:border-iris outline-none bg-paper cursor-pointer"
              >
                {classOptions.map((c) => (
                  <option key={c.value} value={c.value}>
                    {c.label}
                  </option>
                ))}
              </select>

              <input
                type="text"
                placeholder={t('rollPlaceholder')}
                value={quickRoll}
                onChange={(e) => setQuickRoll(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-ink/20 text-sm font-medium focus:ring-2 focus:ring-iris/30 focus:border-iris outline-none"
                required
              />

              <button
                type="submit"
                className="btn w-full px-4 py-2.5 rounded-xl bg-board text-chalk font-bold text-sm hover:bg-boardlt shadow-md transition-all flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <Search className="w-4 h-4 text-gold" />
                <span>{t('getMarksheet')}</span>
              </button>
            </form>
          </div>

          {/* Right: Quick Highlights */}
          <div className="md:col-span-5 flex flex-col justify-center space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-ink/60 uppercase tracking-wider">{t('admissionSession')}</span>
              <Link to="/admission" className="text-xs font-bold text-iris hover:underline flex items-center gap-1">
                <span>{t('applyOnlineLink')}</span>
                <ArrowRight className="w-3 h-3" />
              </Link>
            </div>
            <p className="font-display font-extrabold text-xl text-board leading-snug">
              {t('admissionNoticeText')}
            </p>
            <div className="flex items-center gap-3 pt-1">
              <Link
                to="/admission"
                className="btn px-4 py-2 rounded-xl bg-gold text-ink text-xs font-bold hover:brightness-105 shadow-sm"
              >
                {t('onlineAdmissionBtn')}
              </Link>
              <Link
                to="/notices"
                className="px-4 py-2 rounded-xl bg-ink/5 hover:bg-ink/10 text-ink text-xs font-bold transition-colors"
              >
                {t('viewNoticeBoard')}
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Statistics Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {localizedHeroStats.map((stat) => (
            <StatItem key={stat.label} icon={stat.icon} label={stat.label} value={stat.value} />
          ))}
        </div>
      </section>

      {/* 5. Headmaster's Welcome Note & School Vision (Fully Dynamic from CMS) */}
      {headmaster?.isActive !== false && (
        <section id="headmaster" className="bg-lilac py-16 sm:py-20 relative overflow-hidden">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid lg:grid-cols-12 gap-12 items-center">
            <Reveal className="lg:col-span-5 relative">
              <div className="relative rounded-3xl overflow-hidden shadow-2xl border-4 border-white bg-slate-900">
                <img
                  src={headmaster?.imageUrl || "https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=800&q=80"}
                  alt={headmaster?.imageAlt || (lang === 'bn' ? headmaster?.nameBn : headmaster?.name) || "Headmaster"}
                  className="w-full h-[460px] object-cover object-top"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-board via-transparent/30 to-transparent" />
                <div className="absolute bottom-6 left-6 right-6 text-chalk">
                  <span className="text-xs uppercase tracking-widest text-gold font-bold">
                    {(lang === 'bn' ? headmaster?.roleBn || headmaster?.role : headmaster?.role) || t('headmasterRole')}
                  </span>
                  <h4 className="font-display font-bold text-xl text-white">
                    {(lang === 'bn' ? headmaster?.nameBn || headmaster?.name : headmaster?.name) || t('headmasterName')}
                  </h4>
                  <p className="text-xs text-chalk/80">
                    {(lang === 'bn' ? headmaster?.degreeBn || headmaster?.degree : headmaster?.degree) || t('headmasterDegree')}
                  </p>
                </div>
              </div>

              {/* Dynamic Floating Model / Ranked Badge (Checkable & Fully Customizable) */}
              {headmaster?.showBadge !== false && (
                <div className="absolute -bottom-6 -right-4 bg-white p-4 rounded-2xl shadow-xl border border-ink/10 hidden sm:flex items-center gap-3 max-w-[270px] animate-fadeIn">
                  <div className="w-10 h-10 rounded-xl bg-gold/20 text-gold grid place-items-center font-bold text-lg shrink-0">
                    {headmaster?.badgeIcon || '★'}
                  </div>
                  <p className="text-xs font-semibold text-board leading-snug">
                    {(lang === 'bn' ? headmaster?.badgeTextBn || headmaster?.badgeText : headmaster?.badgeText) || t('headmasterBadge')}
                  </p>
                </div>
              )}
            </Reveal>

            <Reveal delay={90} className="lg:col-span-7 space-y-6">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-iris bg-iris/10 px-3 py-1 rounded-full">
                  {(lang === 'bn' ? headmaster?.tagBn || headmaster?.tag : headmaster?.tag) || t('welcomeTag')}
                </span>
                <h2 className="mt-3 font-display font-extrabold text-3xl sm:text-4xl text-board leading-tight">
                  {(lang === 'bn' ? headmaster?.titleBn || headmaster?.title : headmaster?.title) || t('welcomeTitle')}
                </h2>
              </div>

              <p className="text-base text-ink/80 leading-relaxed whitespace-pre-line">
                {(lang === 'bn' ? headmaster?.descriptionBn || headmaster?.description : headmaster?.description) || t('welcomeDesc')}
              </p>

              {/* Dynamic Empower Quote Box */}
              {headmaster?.showEmpowerBox !== false && (
                <div className="p-4 rounded-2xl bg-white/70 border border-ink/10 flex items-center gap-3">
                  <span className="text-2xl">{headmaster?.empowerIcon || '🌱'}</span>
                  <p className="text-sm font-semibold text-board">
                    {(lang === 'bn' ? headmaster?.empowerTextBn || headmaster?.empowerText : headmaster?.empowerText) || t('empowerText')}{' '}
                    <span className="text-iris font-bold">{dynamicSkill}</span>
                  </p>
                </div>
              )}

              {/* Dynamic Key Facility & Checkpoint Highlights */}
              <div className="grid sm:grid-cols-2 gap-3 text-sm">
                {(headmaster?.features?.length > 0 ? headmaster.features : [
                  { text: t('checkLab'), textBn: t('checkLab') },
                  { text: t('checkDigital'), textBn: t('checkDigital') },
                  { text: t('checkScout'), textBn: t('checkScout') },
                  { text: t('checkGround'), textBn: t('checkGround') },
                ]).map((feat, idx) => (
                  <div key={feat.id || idx} className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-mint shrink-0" />
                    <span className="text-ink/85 font-medium">
                      {lang === 'bn' ? feat.textBn || feat.text : feat.text}
                    </span>
                  </div>
                ))}
              </div>

              {/* Dynamic Action Buttons */}
              <div className="pt-2 flex flex-wrap items-center gap-4">
                {headmaster?.btn1Show !== false && (
                  <Link
                    to={headmaster?.btn1Link || '/academics'}
                    className="btn inline-flex items-center gap-2 px-6 py-3 rounded-full bg-board text-chalk font-bold text-sm hover:bg-boardlt shadow-md transition"
                  >
                    <span>
                      {(lang === 'bn' ? headmaster?.btn1TextBn || headmaster?.btn1Text : headmaster?.btn1Text) || t('btnCurriculum')}
                    </span>
                    <ArrowRight className="w-4 h-4 text-gold" />
                  </Link>
                )}
                {headmaster?.btn2Show !== false && (
                  <Link
                    to={headmaster?.btn2Link || '/teachers'}
                    className="btn inline-flex items-center gap-2 px-5 py-3 rounded-full bg-white text-board font-bold text-sm border border-ink/15 hover:bg-ink/5 transition"
                  >
                    <Users className="w-4 h-4 text-iris" />
                    <span>
                      {(lang === 'bn' ? headmaster?.btn2TextBn || headmaster?.btn2Text : headmaster?.btn2Text) || t('btnMeetTeachers')}
                    </span>
                  </Link>
                )}
              </div>
            </Reveal>
          </div>
        </section>
      )}

      {/* 6. General School Academic Groups (Fully Dynamic from Dashboard / CMS) */}
      {isAcademicActive && (
        <section id="academics" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <span className="text-xs font-bold uppercase tracking-wider text-iris bg-iris/10 px-3 py-1 rounded-full">
              {academicTag}
            </span>
            <h2 className="mt-3 font-display font-extrabold text-3xl sm:text-4xl text-board">
              {academicTitle}
            </h2>
            <p className="mt-3 text-sm sm:text-base text-ink/70">
              {academicSubtitle}
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {groupsToDisplay.map((group) => (
              <div
                key={group.id || group.name}
                className={`bg-white rounded-3xl p-6 border ${group.border} shadow-lg hover:shadow-2xl transition-all transform hover:-translate-y-2 flex flex-col justify-between`}
              >
                <div>
                  <div className="text-4xl mb-4 p-3 rounded-2xl bg-paper inline-block shadow-inner">
                    {group.icon}
                  </div>
                  <h3 className="font-display font-bold text-xl text-board mb-2">{group.name}</h3>
                  <p className="text-xs text-ink/75 leading-relaxed mb-4">{group.desc}</p>

                  <div className="pt-3 border-t border-ink/10">
                    <span className="text-[11px] font-bold text-ink/60 uppercase tracking-wider block mb-2">
                      {keySubjectsLabel}
                    </span>
                    <div className="flex flex-wrap gap-1.5 mb-3">
                      {group.subjects.map((sub, sIdx) => (
                        <span key={sIdx} className="text-[11px] font-medium px-2 py-0.5 rounded-md bg-paper text-board border border-ink/10">
                          {sub}
                        </span>
                      ))}
                    </div>

                    {group.pathway && (
                      <div className="text-[11px] text-iris font-semibold mt-2 pt-2 border-t border-ink/5">
                        <strong>{pathwayLabel}</strong> {group.pathway}
                      </div>
                    )}
                  </div>
                </div>

                <Link
                  to={group.buttonLink || '/academics'}
                  className="mt-6 text-xs font-bold text-iris hover:underline inline-flex items-center gap-1"
                >
                  <span>{group.buttonText || t('curriculumDetails')}</span>
                  <ArrowRight className="w-3 h-3" />
                </Link>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* 7. A Day in School Life / Daily Schedule Timeline */}
      {isRoutineActive && (
        <section className="bg-paper py-20 border-y border-ink/10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-2xl mx-auto mb-14">
              <span className="text-xs font-bold uppercase tracking-wider text-iris bg-iris/10 px-3 py-1 rounded-full">
                {routineTag}
              </span>
              <h2 className="mt-3 font-display font-extrabold text-3xl sm:text-4xl text-board">
                {routineTitle}
              </h2>
              <p className="mt-2 text-sm text-ink/70">
                {routineSubtitle}
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {localizedRoutine.map((item, idx) => (
                <div
                  key={item.id || item.title || idx}
                  className="p-6 rounded-3xl bg-white border border-ink/10 shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-xs font-bold text-iris bg-iris/10 px-2.5 py-1 rounded-full flex items-center gap-1">
                        <Clock className="w-3 h-3 text-iris" />
                        {item.time}
                      </span>
                      <span className="text-xs font-black text-ink/40">{num(String(idx + 1).padStart(2, '0'))}</span>
                    </div>
                    <h4 className="font-display font-bold text-base text-board mb-2">{item.title}</h4>
                    <p className="text-xs text-ink/70 leading-relaxed">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* 8. School Campus Facilities & Infrastructure */}
      {isFacilitiesActive && (
        <section id="facilities" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <span className="text-xs font-bold uppercase tracking-wider text-mint bg-mint/15 px-3 py-1 rounded-full">
              {facilitiesTag}
            </span>
            <h2 className="mt-2 font-display font-extrabold text-3xl sm:text-4xl text-board">
              {facilitiesHeading}
            </h2>
            <p className="mt-3 text-sm text-ink/70">
              {facilitiesSub}
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {localizedFacilities.map((fac, idx) => (
              <div
                key={fac.id || fac.title || idx}
                className="bg-white rounded-3xl p-6 border border-ink/10 shadow-md hover:shadow-xl transition-all transform hover:-translate-y-1.5 flex flex-col justify-between"
              >
                <div>
                  <div className="text-3xl mb-3">{fac.icon}</div>
                  <span className="text-[11px] font-bold text-iris uppercase tracking-wider block mb-1">
                    {fac.metric}
                  </span>
                  <h4 className="font-display font-bold text-lg text-board mb-2">{fac.title}</h4>
                  <p className="text-xs text-ink/70 leading-relaxed">{fac.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* 9. Co-Curricular & Student Clubs */}
      {isClubsActive && (
        <section id="clubs" className="bg-lilac py-20 border-t border-ink/10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-2xl mx-auto mb-14">
              <span className="text-xs font-bold uppercase tracking-wider text-brick bg-brick/10 px-3 py-1 rounded-full">
                {clubsTag}
              </span>
              <h2 className="mt-2 font-display font-extrabold text-3xl sm:text-4xl text-board">
                {clubsHeading}
              </h2>
              <p className="mt-3 text-sm text-ink/70">
                {clubsSub}
              </p>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {localizedClubs.map((club, idx) => (
                <div
                  key={club.id || club.name || idx}
                  className="p-6 rounded-3xl bg-white border border-ink/10 shadow-sm hover:shadow-md transition-all flex items-start gap-4"
                >
                  <div className="text-3xl p-2 rounded-2xl bg-paper shadow-sm shrink-0">
                    {club.icon}
                  </div>
                  <div>
                    <h4 className="font-display font-bold text-base text-board">{club.name}</h4>
                    <p className="text-xs text-ink/70 mt-1 leading-relaxed">{club.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* 10. Latest Notices & Announcements Spotlight */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-10 gap-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-brick bg-brick/10 px-3 py-1 rounded-full">
              {noticeSectionTag}
            </span>
            <h2 className="mt-2 font-display font-extrabold text-3xl text-board">{noticeSectionTitle}</h2>
          </div>
          <Link
            to="/notices"
            className="inline-flex items-center gap-1.5 text-sm font-bold text-iris hover:underline group cursor-pointer"
          >
            <span>{t('viewAllNotices')}</span>
            <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {localizedNotices.map((n) => (
            <div
              key={n.id}
              className={`bg-white rounded-3xl p-6 border-t-4 ${
                n.pinned ? 'border-brick ring-1 ring-brick/20' : 'border-iris'
              } shadow-md hover:shadow-xl transition-all flex flex-col justify-between`}
            >
              <div>
                <div className="flex items-center justify-between text-xs mb-3">
                  <span
                    className={`font-bold uppercase tracking-wide px-2.5 py-0.5 rounded-full ${
                      n.pinned
                        ? 'bg-brick/10 text-brick'
                        : 'bg-iris/10 text-iris'
                    }`}
                  >
                    {n.cat} {n.pinned ? `· ${lang === 'bn' ? 'জরুরি' : 'Urgent'}` : ''}
                  </span>
                  <span className="text-ink/60">{num(n.date)}</span>
                </div>
                <h4 className="font-display font-bold text-lg text-board mb-2 line-clamp-2">{n.title}</h4>
                <p className="text-xs sm:text-sm text-ink/75 leading-relaxed line-clamp-3 mb-4 whitespace-pre-line">{n.text}</p>
              </div>
              <Link
                to="/notices"
                className="text-xs font-bold text-board hover:text-iris inline-flex items-center gap-1.5 pt-2 border-t border-ink/10 cursor-pointer"
              >
                <span>{t('readCircular')}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          ))}
        </div>
      </section>

      {/* 11. Top Students / Hall of Fame Preview */}
      <section className="bg-lilac py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-12 gap-4">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-gold bg-gold/20 px-3 py-1 rounded-full">
                {t('topperTag')}
              </span>
              <h2 className="mt-2 font-display font-extrabold text-3xl sm:text-4xl text-board">
                {t('topperHeading')}
              </h2>
              <p className="mt-1 text-sm text-ink/70">
                {t('topperSub')}
              </p>
            </div>
            <Link
              to="/toppers"
              className="btn px-5 py-2.5 rounded-full bg-board text-chalk text-xs sm:text-sm font-bold hover:bg-boardlt inline-flex items-center gap-2 shadow-md shrink-0"
            >
              <Award className="w-4 h-4 text-gold" />
              <span>{t('btnAllToppers')}</span>
            </Link>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5 sm:gap-6">
            {previewToppers.map((student, i) => (
              <div
                key={student.name}
                className={`rounded-2xl sm:rounded-3xl p-3.5 sm:p-5 text-center transition-all transform hover:-translate-y-1.5 relative ${
                  i === 0
                    ? 'bg-gradient-to-b from-[#fff6d6] to-white border-2 border-gold shadow-xl'
                    : 'bg-white border border-ink/10 shadow-md hover:shadow-lg'
                }`}
              >
                {i === 0 && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-gold text-ink text-[10px] sm:text-[11px] font-black uppercase tracking-wider px-2.5 sm:px-3 py-0.5 rounded-full shadow-md whitespace-nowrap">
                    {t('pos1')}
                  </div>
                )}

                <div className="relative w-16 h-16 sm:w-24 sm:h-24 mx-auto mb-3 sm:mb-4 mt-1 sm:mt-2">
                  <img
                    src={student.photo}
                    alt={student.name}
                    className="w-full h-full rounded-full object-cover ring-2 sm:ring-4 ring-gold/40 shadow-inner"
                  />
                  <span className="absolute bottom-0 right-0 w-5 h-5 sm:w-7 sm:h-7 rounded-full bg-board text-gold text-[10px] sm:text-xs font-black grid place-items-center border sm:border-2 border-white shadow">
                    #{num(student.roll)}
                  </span>
                </div>

                <h4 className="font-display font-bold text-sm sm:text-lg text-board line-clamp-1">
                  {lang === 'bn' ? student.name : student.nameEn || student.name}
                </h4>
                <p className="text-[11px] sm:text-xs text-ink/60 font-medium mt-0.5">
                  {lang === 'bn' ? `১০ম শ্রেণি · রোল ${num(student.roll)}` : `Class Ten · Roll ${student.roll}`}
                </p>

                <div className="mt-2.5 sm:mt-3 pt-2.5 sm:pt-3 border-t border-ink/10 flex items-center justify-center gap-1.5 sm:gap-3 flex-wrap">
                  <span className="text-[10px] sm:text-xs font-bold text-mint bg-mint/10 px-1.5 sm:px-2 py-0.5 rounded-md">
                    {t('gpaLabel')} {num(student.gpa)}
                  </span>
                  <span className="text-[10px] sm:text-xs font-bold text-iris">{num(student.marks)}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 12. Student Fun Portal Callout */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-board via-boardlt to-iris text-chalk p-8 sm:p-12 shadow-2xl border border-white/10">
          <div className="relative z-10 max-w-2xl space-y-4">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full text-xs font-bold bg-gold/20 text-gold border border-gold/40">
              <Sparkles className="w-4 h-4 text-gold animate-spin" style={{ animationDuration: '6s' }} />
              <span>{t('portalTag')}</span>
            </div>
            <h2 className="font-display font-black text-3xl sm:text-4xl text-white leading-tight">
              {t('portalTitle')}
            </h2>
            <p className="text-chalk/80 text-sm sm:text-base leading-relaxed">
              {t('portalDesc')}
            </p>
            <div className="pt-2 flex flex-wrap items-center gap-4">
              <Link
                to="/student-dashboard"
                className="btn px-6 py-3.5 rounded-full bg-gold text-ink font-bold text-sm hover:brightness-110 shadow-lg inline-flex items-center gap-2"
              >
                <span>{t('btnLaunchPortal')}</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                to="/results"
                className="btn px-6 py-3.5 rounded-full bg-white/10 hover:bg-white/20 text-white font-bold text-sm border border-white/20 inline-flex items-center gap-2"
              >
                <Award className="w-4 h-4 text-mint" />
                <span>{t('btnCheckMarks')}</span>
              </Link>
            </div>
          </div>

          {/* Decorative floating badges */}
          <div className="hidden lg:block absolute right-12 top-1/2 -translate-y-1/2 space-y-3">
            <div className="bg-white/10 backdrop-blur-md border border-white/20 p-4 rounded-2xl flex items-center gap-3 shadow-lg transform translate-x-4">
              <span className="text-3xl">🧮</span>
              <div>
                <p className="text-xs text-chalk/60 font-semibold">টুল ০১</p>
                <p className="text-sm font-bold text-white">{t('toolGpa')}</p>
              </div>
            </div>
            <div className="bg-white/10 backdrop-blur-md border border-white/20 p-4 rounded-2xl flex items-center gap-3 shadow-lg transform -translate-x-2">
              <span className="text-3xl">📅</span>
              <div>
                <p className="text-xs text-chalk/60 font-semibold">টুল ০২</p>
                <p className="text-sm font-bold text-white">{t('toolRoutine')}</p>
              </div>
            </div>
            <div className="bg-white/10 backdrop-blur-md border border-white/20 p-4 rounded-2xl flex items-center gap-3 shadow-lg transform translate-x-3">
              <span className="text-3xl">🪪</span>
              <div>
                <p className="text-xs text-chalk/60 font-semibold">টুল ০৩</p>
                <p className="text-sm font-bold text-white">{t('toolId')}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 13. Campus Life Gallery */}
      <section className="bg-paper py-20 border-t border-ink/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-10 gap-4">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-iris bg-iris/10 px-3 py-1 rounded-full">
                {t('galleryTag')}
              </span>
              <h2 className="mt-2 font-display font-extrabold text-3xl sm:text-4xl text-board">
                {t('galleryHeading')}
              </h2>
            </div>

            {/* Gallery Category Filter */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-2 sm:pb-0">
              {galleryCategories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setActiveGalleryCat(cat.id)}
                  className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
                    activeGalleryCat === cat.id
                      ? 'bg-board text-gold shadow-md'
                      : 'bg-white text-ink/70 hover:bg-ink/5 border border-ink/10'
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredGallery.map((item) => (
              <div
                key={item.label}
                className="group relative rounded-3xl overflow-hidden shadow-lg border border-ink/10 bg-white aspect-[4/3] flex flex-col justify-end"
              >
                <img
                  src={item.src}
                  alt={item.label}
                  className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-board/90 via-board/40 to-transparent opacity-80 group-hover:opacity-95 transition-opacity" />
                <div className="relative z-10 p-5 text-white">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-gold bg-gold/20 px-2 py-0.5 rounded-md backdrop-blur-sm">
                    {item.category}
                  </span>
                  <h4 className="font-display font-bold text-lg text-white mt-1.5">{item.label}</h4>
                  <p className="text-xs text-chalk/80 mt-0.5 line-clamp-2">{item.caption}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 14. Parent & Guardian Testimonials */}
      <section className="bg-white py-20 border-t border-ink/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <span className="text-xs font-bold uppercase tracking-wider text-mint bg-mint/15 px-3 py-1 rounded-full">
              {t('reviewsTag')}
            </span>
            <h2 className="mt-2 font-display font-extrabold text-3xl sm:text-4xl text-board">
              {t('reviewsHeading')}
            </h2>
            <p className="mt-2 text-sm text-ink/70">
              {t('reviewsSub')}
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {(reviews[lang] || reviews.bn).map((rev) => (
              <div
                key={rev.n}
                className="bg-paper rounded-3xl p-6 border border-ink/10 shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center gap-1 text-gold mb-3">
                    {[...Array(rev.s)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-gold text-gold" />
                    ))}
                  </div>
                  <p className="text-xs sm:text-sm text-ink/80 leading-relaxed italic mb-4">"{rev.t}"</p>
                </div>

                <div className="flex items-center gap-3 pt-3 border-t border-ink/10">
                  <img src={rev.avatar} alt={rev.n} className="w-10 h-10 rounded-full object-cover ring-2 ring-gold/40" />
                  <div>
                    <h5 className="font-display font-bold text-xs text-board">{rev.n}</h5>
                    <p className="text-[11px] text-ink/60">{rev.c}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 15. General School FAQs */}
      <section className="bg-lilac py-20 border-t border-ink/10">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <span className="text-xs font-bold uppercase tracking-wider text-iris bg-iris/10 px-3 py-1 rounded-full">
              {t('faqTag')}
            </span>
            <h2 className="mt-2 font-display font-extrabold text-3xl sm:text-4xl text-board">
              {t('faqHeading')}
            </h2>
            <p className="mt-2 text-sm text-ink/70">
              {t('faqSub')}
            </p>
          </div>

          <div className="space-y-4">
            {localizedFaqs.map((faq, idx) => (
              <div
                key={faq.q}
                className="bg-white rounded-2xl border border-ink/10 overflow-hidden shadow-sm transition-all"
              >
                <button
                  onClick={() => toggleFaq(idx)}
                  className="w-full text-left p-5 flex items-center justify-between gap-4 font-display font-bold text-base text-board cursor-pointer"
                >
                  <span className="flex items-center gap-3">
                    <HelpCircle className="w-5 h-5 text-iris shrink-0" />
                    <span>{faq.q}</span>
                  </span>
                  <ChevronDown
                    className={`w-5 h-5 text-ink/40 transition-transform ${
                      activeFaq === idx ? 'rotate-180 text-iris' : ''
                    }`}
                  />
                </button>
                {activeFaq === idx && (
                  <div className="px-5 pb-5 pt-1 text-sm text-ink/75 leading-relaxed border-t border-ink/5">
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 16. Final Admission CTA Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="bg-gradient-to-r from-board via-boardlt to-iris rounded-3xl p-8 sm:p-12 text-center text-chalk shadow-2xl relative overflow-hidden">
          <div className="relative z-10 max-w-2xl mx-auto space-y-4">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-gold/20 text-gold border border-gold/30">
              <Sparkles className="w-3.5 h-3.5" />
              <span>{t('ctaTag')}</span>
            </span>
            <h2 className="font-display font-black text-3xl sm:text-4xl text-white">
              {t('ctaTitle')}
            </h2>
            <p className="text-chalk/80 text-sm sm:text-base leading-relaxed">
              {t('ctaDesc')}
            </p>
            <div className="pt-2 flex flex-wrap items-center justify-center gap-4">
              <Link
                to="/admission"
                className="btn px-8 py-3.5 rounded-full bg-gold text-ink font-bold text-sm hover:brightness-110 shadow-lg cursor-pointer"
              >
                {t('btnApplyNow')}
              </Link>
              <Link
                to="/contact"
                className="btn px-7 py-3.5 rounded-full bg-white/10 hover:bg-white/20 text-white font-bold text-sm border border-white/20 cursor-pointer"
              >
                {t('btnContactOffice')}
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
