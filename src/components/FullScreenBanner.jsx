import { useEffect, useState, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { ChevronLeft, ChevronRight, Calendar, ArrowRight, Sparkles, Award, ShieldCheck, RefreshCw } from 'lucide-react'
import { useLanguage } from '../context/LanguageContext'
import api from '../lib/api'

// Fallback slides in case backend is offline or empty
const FALLBACK_SLIDES = [
  {
    _id: 'default-1',
    imageUrl: 'https://images.unsplash.com/photo-1580582932707-520aed937b7b?auto=format&fit=crop&w=1920&q=85',
    title: 'Knowledge, Character & Excellence in Secondary Education',
    titleBn: 'নৈতিক চরিত্র, মেধা ও মানবিক মূল্যবোধের বিকাশ',
    subtitle: 'Mirashani Academy provides premier general secondary education across Science, Commerce & Arts with modern labs and passionate teachers.',
    subtitleBn: 'মিরাশানী একাডেমি আধুনিক মাল্টিমিডিয়া ক্লাসরুম, সমৃদ্ধ বিজ্ঞানাগার এবং অভিজ্ঞ শিক্ষকমণ্ডলীর মাধ্যমে সাধারণ মাধ্যমিক শিক্ষায় অগ্রণী ভূমিকা পালন করছে।',
    badge: 'Morning Assembly & Campus Life',
    badgeBn: 'প্রাত্যহিক সমাবেশ ও সুশৃঙ্খল ক্যাম্পাস জীবন',
    date: 'Session 2026-2027',
    dateBn: 'শিক্ষাবর্ষ ২০২৬-২০২৭',
    primaryBtnText: 'Explore Academics',
    primaryBtnTextBn: 'শিক্ষা কার্যক্রম দেখুন',
    primaryBtnLink: '/academics',
    secondaryBtnText: 'Check Result',
    secondaryBtnTextBn: 'ফলাফল অনুসন্ধান',
    secondaryBtnLink: '/results',
    isActive: true,
  },
  {
    _id: 'default-2',
    imageUrl: 'https://images.unsplash.com/photo-1532094349884-543bc11b234d?auto=format&fit=crop&w=1920&q=85',
    title: 'Advanced Science Labs & Practical Discovery',
    titleBn: 'আধুনিক বিজ্ঞানাগার ও বাস্তবমুখী বিজ্ঞান চর্চা',
    subtitle: 'Dedicated air-conditioned laboratories for Physics, Chemistry and Biology where students discover the beauty of science hands-on.',
    subtitleBn: 'পদার্থবিজ্ঞান, রসায়ন ও জীববিজ্ঞানের পৃথক শীতাতপ নিয়ন্ত্রিত ল্যাবরেটরি, যেখানে শিক্ষার্থীরা হাতে-কলমে পরীক্ষার মাধ্যমে বিজ্ঞানের আনন্দ আবিষ্কার করে।',
    badge: 'Science Fair & Olympiads',
    badgeBn: 'বিজ্ঞান মেলা ও অলিম্পিয়াড',
    date: 'Lab Work Daily',
    dateBn: 'নিয়মিত প্র্যাকটিক্যাল ল্যাব',
    primaryBtnText: 'Science Group Info',
    primaryBtnTextBn: 'বিজ্ঞান বিভাগ জানুন',
    primaryBtnLink: '/academics',
    secondaryBtnText: 'View Facilities',
    secondaryBtnTextBn: 'সুযোগ-সুবিধা দেখুন',
    secondaryBtnLink: '/academics',
    isActive: true,
  },
  {
    _id: 'default-3',
    imageUrl: 'https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?auto=format&fit=crop&w=1920&q=85',
    title: 'Rich Central Library & World of Books',
    titleBn: 'সমৃদ্ধ কেন্দ্রীয় পাঠাগার ও উন্মুক্ত জ্ঞানভাণ্ডার',
    subtitle: 'Over 10,000 national and international books, science encyclopedias, and literature building deep reading habits.',
    subtitleBn: '১০,০০০ এরও বেশি দেশি-বিদেশি সাহিত্য, পাঠ্যবই, বিশ্বকোষ ও বিজ্ঞান সাময়িকী সমৃদ্ধ পাঠাগার যা শিক্ষার্থীদের গভীর পাঠাভ্যাস গড়ে তোলে।',
    badge: 'Open Daily 8 AM - 4 PM',
    badgeBn: 'জ্ঞান ও পাঠাভ্যাস',
    date: '10,000+ Books',
    dateBn: '১০,০০০+ বই সংগ্রহ',
    primaryBtnText: 'Library Tour',
    primaryBtnTextBn: 'লাইব্রেরি পরিদর্শন',
    primaryBtnLink: '/academics',
    secondaryBtnText: 'Student Portal',
    secondaryBtnTextBn: 'শিক্ষার্থী পোর্টাল',
    secondaryBtnLink: '/student-dashboard',
    isActive: true,
  },
  {
    _id: 'default-4',
    imageUrl: 'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?auto=format&fit=crop&w=1920&q=85',
    title: 'Annual Sports Tournament & Championship',
    titleBn: 'বার্ষিক আন্তঃহাউস ক্রীড়া প্রতিযোগিতা ও চ্যাম্পিয়নশিপ',
    subtitle: 'Vibrant athletic meets, football cups, cricket tournaments, sprinting, and physical fitness training on our expansive green field.',
    subtitleBn: 'বিশাল সবুজ খেলার মাঠে ১০০ মিটার স্প্রিন্ট, ফুটবল লিগ, ক্রিকেট টুর্নামেন্ট, হাই জাম্প ও শরীরচর্চা প্রতিযোগিতার প্রাণবন্ত আসর।',
    badge: 'Sports & Physical Fitness',
    badgeBn: 'ক্রীড়া ও শারীরিক প্রশিক্ষণ',
    date: 'Annual Tournament',
    dateBn: 'বার্ষিক ক্রীড়া উৎসব',
    primaryBtnText: 'Sports & Clubs',
    primaryBtnTextBn: 'খেলাধুলা ও শরীরচর্চা',
    primaryBtnLink: '/events',
    secondaryBtnText: 'School Events',
    secondaryBtnTextBn: 'স্কুল ইভেন্টস',
    secondaryBtnLink: '/events',
    isActive: true,
  },
]

const DURATION = 6000

export default function FullScreenBanner() {
  const { lang, num } = useLanguage()
  const [slides, setSlides] = useState(() => {
    // Check local storage cached slides first for instant display
    try {
      const cached = localStorage.getItem('mpa_custom_slides')
      if (cached) {
        const parsed = JSON.parse(cached)
        if (Array.isArray(parsed) && parsed.length > 0) return parsed.filter((s) => s.isActive !== false)
      }
    } catch {}
    return FALLBACK_SLIDES
  })
  const [current, setCurrent] = useState(0)
  const [isPaused, setIsPaused] = useState(false)
  const [loading, setLoading] = useState(false)

  // Fetch dynamic slides from backend API
  const fetchSlides = async () => {
    try {
      setLoading(true)
      const res = await api.getActiveSliders()
      if (res && res.success && Array.isArray(res.data) && res.data.length > 0) {
        setSlides(res.data)
        try {
          localStorage.setItem('mpa_custom_slides', JSON.stringify(res.data))
        } catch {}
      }
    } catch (err) {
      console.warn('[FullScreenBanner] Falling back to local slides', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchSlides()

    // Listen for storage updates triggered by dashboard
    const handleStorageChange = () => {
      try {
        const cached = localStorage.getItem('mpa_custom_slides')
        if (cached) {
          const parsed = JSON.parse(cached)
          if (Array.isArray(parsed) && parsed.length > 0) {
            setSlides(parsed.filter((s) => s.isActive !== false))
          }
        }
      } catch {}
    }

    window.addEventListener('storage', handleStorageChange)
    window.addEventListener('mpa_slides_updated', handleStorageChange)

    return () => {
      window.removeEventListener('storage', handleStorageChange)
      window.removeEventListener('mpa_slides_updated', handleStorageChange)
    }
  }, [])

  const activeSlides = useMemo(() => {
    const list = slides.filter((s) => s.isActive !== false)
    return list.length > 0 ? list : FALLBACK_SLIDES
  }, [slides])

  // Reset current index if it exceeds active slide length
  useEffect(() => {
    if (current >= activeSlides.length) {
      setCurrent(0)
    }
  }, [activeSlides.length, current])

  // Autoplay timer
  useEffect(() => {
    if (isPaused || activeSlides.length <= 1) return
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % activeSlides.length)
    }, DURATION)

    return () => clearInterval(timer)
  }, [current, isPaused, activeSlides.length])

  const nextSlide = () => {
    setCurrent((prev) => (prev + 1) % activeSlides.length)
  }

  const prevSlide = () => {
    setCurrent((prev) => (prev - 1 + activeSlides.length) % activeSlides.length)
  }

  const goToSlide = (idx) => {
    setCurrent(idx)
  }

  const active = activeSlides[current] || activeSlides[0]

  // Dynamic localized fields
  const displayTitle = lang === 'bn' ? (active.titleBn || active.title) : (active.title || active.titleBn)
  const displaySubtitle = lang === 'bn' ? (active.subtitleBn || active.subtitle) : (active.subtitle || active.subtitleBn)
  const displayBadge = lang === 'bn' ? (active.badgeBn || active.badge) : (active.badge || active.badgeBn)
  const displayDate = lang === 'bn' ? (active.dateBn || active.date) : (active.date || active.dateBn)

  // ── Button 1 (Primary CTA) ──
  const showBtn1 = active.btn1Show !== false
  const btn1Text = lang === 'bn'
    ? (active.btn1TextBn || active.primaryBtnTextBn || active.btn1Text || active.primaryBtnText || 'শিক্ষা কার্যক্রম দেখুন')
    : (active.btn1Text || active.primaryBtnText || 'Explore Academics')
  const btn1Link = active.btn1Link || active.primaryBtnLink || '/academics'

  // ── Button 2 (Secondary CTA) ──
  const showBtn2 = active.btn2Show !== false
  const btn2Text = lang === 'bn'
    ? (active.btn2TextBn || active.secondaryBtnTextBn || active.btn2Text || active.secondaryBtnText || 'ফলাফল অনুসন্ধান')
    : (active.btn2Text || active.secondaryBtnText || 'Check Result')
  const btn2Link = active.btn2Link || active.secondaryBtnLink || '/results'

  // ── Button 3 (Tertiary CTA / Admission / Portal / Custom) ──
  const showBtn3 = active.btn3Show !== false
  const btn3Text = lang === 'bn'
    ? (active.btn3TextBn || active.btn3Text || 'অনলাইন ভর্তি')
    : (active.btn3Text || 'Online Admission')
  const btn3Link = active.btn3Link || '/admission'

  return (
    <div
      className="relative w-full h-[85vh] sm:h-[88vh] min-h-[520px] sm:min-h-[640px] max-h-[900px] overflow-hidden bg-board select-none group/banner"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      role="region"
      aria-label="Campus Highlights Slideshow"
    >
      {/* Background Slides */}
      {activeSlides.map((slide, idx) => {
        const imgUrl = slide.imageUrl || slide.url
        return (
          <div
            key={slide._id || slide.id || idx}
            className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
              idx === current ? 'opacity-100 z-10' : 'opacity-0 z-0 pointer-events-none'
            }`}
          >
            <img
              src={imgUrl}
              alt={slide.title || 'Campus slide'}
              className={`w-full h-full object-cover object-center ${
                idx === current ? 'scale-105 transition-transform duration-[7000ms] ease-out' : 'scale-100'
              }`}
            />
            {/* Dual Overlay Gradients for deep contrast and cinematic feel */}
            <div className="absolute inset-0 bg-gradient-to-r from-board/95 via-board/75 to-transparent/30" />
            <div className="absolute inset-0 bg-gradient-to-t from-board via-transparent/40 to-board/60" />
            {/* Subtle noise/mesh texture */}
            <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_center,_rgba(255,255,255,0.15)_1px,_transparent_1px)] bg-[length:24px_24px]" />
          </div>
        )
      })}

      {/* Main Slide Content Area */}
      <div className="relative z-20 h-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col justify-center pb-16 pt-12 sm:pb-20 sm:pt-16">
        <div className="max-w-3xl">
          {/* Top Badges */}
          <div className="flex flex-wrap items-center gap-2 sm:gap-3 mb-3 sm:mb-4 animate-fadeIn">
            {displayBadge && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 sm:px-3.5 sm:py-1.5 rounded-full text-[11px] sm:text-xs font-bold tracking-wide uppercase bg-gold/20 text-gold border border-gold/40 backdrop-blur-md">
                <Sparkles className="w-3 sm:w-3.5 h-3 sm:h-3.5 animate-spin" style={{ animationDuration: '6s' }} />
                {displayBadge}
              </span>
            )}
            {displayDate && (
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 sm:px-3 rounded-full text-[11px] sm:text-xs font-medium text-chalk/90 bg-white/10 backdrop-blur-md border border-white/15">
                <Calendar className="w-3 sm:w-3.5 h-3 sm:h-3.5 text-mint" />
                {num(displayDate)}
              </span>
            )}
          </div>

          {/* Headline */}
          <h1
            key={`title-${current}-${lang}`}
            className="font-display font-extrabold text-2xl sm:text-5xl lg:text-6xl text-white tracking-tight leading-[1.18] sm:leading-[1.15] drop-shadow-lg"
          >
            {displayTitle}
          </h1>

          {/* Subtitle */}
          {displaySubtitle && (
            <p
              key={`sub-${current}-${lang}`}
              className="mt-3 sm:mt-5 text-sm sm:text-lg lg:text-xl text-chalk/85 leading-relaxed max-w-2xl font-normal drop-shadow line-clamp-3 sm:line-clamp-none"
            >
              {displaySubtitle}
            </p>
          )}

          {/* ── 3 Action Buttons (Independently toggled & linked per slide) ── */}
          <div className="mt-6 sm:mt-8 flex flex-wrap items-center gap-2.5 sm:gap-4">
            {/* Button 1 */}
            {showBtn1 && btn1Text && (
              <Link
                to={btn1Link}
                className="btn group inline-flex items-center gap-2 px-5 py-2.5 sm:px-7 sm:py-3.5 rounded-full font-bold text-xs sm:text-base text-ink bg-gold hover:brightness-110 shadow-[0_10px_25px_-5px_rgba(255,194,51,0.5)] transition-all transform hover:-translate-y-0.5"
              >
                <span>{btn1Text}</span>
                <ArrowRight className="w-3.5 h-3.5 sm:w-4 sm:h-4 transition-transform group-hover:translate-x-1" />
              </Link>
            )}

            {/* Button 2 */}
            {showBtn2 && btn2Text && (
              <Link
                to={btn2Link}
                className="btn inline-flex items-center gap-1.5 px-4 py-2.5 sm:px-6 sm:py-3.5 rounded-full font-bold text-xs sm:text-base text-white bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/25 transition-all transform hover:-translate-y-0.5"
              >
                <Award className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-gold" />
                <span>{btn2Text}</span>
              </Link>
            )}

            {/* Button 3 */}
            {showBtn3 && btn3Text && (
              <Link
                to={btn3Link}
                className="btn inline-flex items-center gap-2 px-5 py-2.5 sm:px-6 sm:py-3.5 rounded-full font-bold text-xs sm:text-base text-chalk bg-iris/80 hover:bg-iris border border-white/20 backdrop-blur-md transition-all transform hover:-translate-y-0.5"
              >
                <ShieldCheck className="w-4 h-4 text-mint" />
                <span>{btn3Text}</span>
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* Floating Left/Right Controls */}
      {activeSlides.length > 1 && (
        <>
          <div className="absolute z-20 left-2 sm:left-8 top-1/2 -translate-y-1/2">
            <button
              onClick={prevSlide}
              aria-label="Previous slide"
              className="w-9 h-9 sm:w-12 sm:h-12 rounded-full grid place-items-center bg-white/10 hover:bg-white/25 text-white backdrop-blur-md border border-white/20 transition-all hover:scale-110 active:scale-95 shadow-xl cursor-pointer"
            >
              <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6" />
            </button>
          </div>

          <div className="absolute z-20 right-2 sm:right-8 top-1/2 -translate-y-1/2">
            <button
              onClick={nextSlide}
              aria-label="Next slide"
              className="w-9 h-9 sm:w-12 sm:h-12 rounded-full grid place-items-center bg-white/10 hover:bg-white/25 text-white backdrop-blur-md border border-white/20 transition-all hover:scale-110 active:scale-95 shadow-xl cursor-pointer"
            >
              <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6" />
            </button>
          </div>

          {/* Minimal Slide Dots */}
          <div className="absolute z-20 bottom-8 left-1/2 -translate-x-1/2 flex items-center gap-2 pointer-events-auto">
            {activeSlides.map((_, idx) => (
              <button
                key={idx}
                onClick={() => goToSlide(idx)}
                aria-label={`Go to slide ${idx + 1}`}
                className={`transition-all duration-300 rounded-full cursor-pointer ${
                  idx === current
                    ? 'w-8 h-2.5 bg-gold shadow-md'
                    : 'w-2.5 h-2.5 bg-white/40 hover:bg-white/80'
                }`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  )
}
