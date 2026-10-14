import { useState, useEffect } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import {
  Menu,
  X,
  GraduationCap,
  Sparkles,
  PhoneCall,
  UserCheck,
  FileText,
  Calendar,
  Award,
  BookOpen,
  Users,
  Compass,
  LayoutDashboard,
  Globe,
} from 'lucide-react'
import { contact } from '../data/content'
import { useLanguage } from '../context/LanguageContext'

export default function Header() {
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const location = useLocation()
  const { lang, t, num, toggleLanguage } = useLanguage()

  // Close mobile menu on route change
  useEffect(() => {
    setOpen(false)
  }, [location])

  // Track scroll position for navbar styling
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 40)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const navLinksList = [
    { href: '/', label: t('navHome') },
    { href: '/notices', label: t('navNotices') },
    { href: '/results', label: t('navResults') },
    { href: '/toppers', label: t('navToppers') },
    { href: '/academics', label: t('navAcademics') },
    { href: '/events', label: t('navEvents') },
    { href: '/teachers', label: t('navTeachers') },
    { href: '/admission', label: t('navAdmission') },
    { href: '/contact', label: t('navContact') },
    { href: '/student-dashboard', label: t('navStudentPortal') },
    { href: '/dashboard', label: lang === 'bn' ? 'স্কুল ড্যাশবোর্ড' : 'School Dashboard', highlight: true },
  ]

  return (
    <>
      {/* Top micro bar with contact & emergency */}
      <div className="bg-board text-chalk/75 text-xs py-1.5 px-4 border-b border-white/10 hidden md:block">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-6">
            <span className="flex items-center gap-1.5">
              <PhoneCall className="w-3.5 h-3.5 text-mint" />
              <span>{lang === 'bn' ? 'অফিস হেল্পলাইন:' : 'Office:'} {num(contact.phone)}</span>
            </span>
            <span className="text-white/30">|</span>
            <span className="text-chalk/60">
              {lang === 'bn' ? 'রবি - বৃহস্পতি: সকাল ৮:০০ - বিকাল ৪:০০' : contact.hours}
            </span>
          </div>
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1 text-gold font-medium">
              <Sparkles className="w-3.5 h-3.5" />
              {lang === 'bn' ? 'ইআইআইএন: ১০৮৪২০ · স্থাপিত: ২০০৫' : 'EIIN: 108420 · Est. 2005'}
            </span>
            {/* Language Toggle Button */}
            <button
              onClick={toggleLanguage}
              className="flex items-center gap-1.5 text-white bg-white/15 hover:bg-white/25 px-2.5 py-1 rounded-full text-[11px] font-bold tracking-wide transition-all border border-white/20"
              aria-label="Toggle Language"
            >
              <Globe className="w-3.5 h-3.5 text-mint" />
              <span>{lang === 'bn' ? 'English' : 'বাংলা'}</span>
            </button>
            <Link
              to="/student-dashboard"
              className="text-white bg-iris hover:bg-iris/80 px-2.5 py-0.5 rounded-full text-[11px] font-bold tracking-wide transition-all shadow-sm"
            >
              {t('studentPortalPill')}
            </Link>
            <Link
              to="/dashboard"
              className="text-ink bg-gold hover:bg-gold/90 px-3 py-0.5 rounded-full text-[11px] font-black tracking-wide transition-all shadow-md flex items-center gap-1.5"
            >
              <LayoutDashboard className="w-3 h-3 text-ink" />
              <span>{lang === 'bn' ? 'স্কুল ড্যাশবোর্ড' : 'ERP Dashboard'}</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Main Sticky Header */}
      <header
        className={`sticky top-0 z-50 transition-all duration-300 ${
          scrolled
            ? 'bg-board/90 backdrop-blur-xl shadow-2xl border-b border-white/10 py-2.5'
            : 'bg-board/70 backdrop-blur-lg border-b border-white/10 py-3.5'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-4">
          {/* Logo & School Name */}
          <Link to="/" className="group flex items-center gap-3 shrink-0">
            <div className="relative">
              <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-iris via-brick to-gold grid place-items-center text-white shadow-lg transition-transform duration-500 group-hover:scale-105 group-hover:rotate-6">
                <GraduationCap className="w-6 h-6" />
              </div>
              <span className="absolute -top-1 -right-1 w-3.5 h-3.5 rounded-full bg-mint border-2 border-board animate-pulse" />
            </div>

            <div>
              <div className="font-display font-black text-lg sm:text-xl text-white tracking-tight leading-none group-hover:text-gold transition-colors">
                {lang === 'bn' ? 'মিরাশানী একাডেমি' : 'MIRASHANI'}
              </div>
              <div className="text-[11px] sm:text-xs font-semibold text-chalk/70 tracking-wider">
                {lang === 'bn' ? 'উচ্চ বিদ্যালয় · সাধারণ মাধ্যমিক শিক্ষা' : 'Academy · High School'}
              </div>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-1 text-sm font-medium" aria-label="Main Navigation">
            {navLinksList.map((link) => {
              if (link.highlight) {
                return (
                  <NavLink
                    key={link.href}
                    to={link.href}
                    className={({ isActive }) =>
                      `relative inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full font-bold text-xs uppercase tracking-wider transition-all ml-1.5 ${
                        isActive
                          ? 'bg-gradient-to-r from-gold to-brick text-ink shadow-md scale-105'
                          : 'bg-white/10 text-gold hover:bg-white/20 border border-gold/30'
                      }`
                    }
                  >
                    <Sparkles className="w-3.5 h-3.5 text-ink animate-spin" style={{ animationDuration: '4s' }} />
                    <span>{link.label}</span>
                  </NavLink>
                )
              }

              return (
                <NavLink
                  key={link.href}
                  to={link.href}
                  end={link.href === '/'}
                  className={({ isActive }) =>
                    `px-2.5 py-1.5 rounded-lg text-sm transition-all font-medium ${
                      isActive
                        ? 'bg-white/15 text-gold font-bold shadow-inner'
                        : 'text-chalk/80 hover:text-white hover:bg-white/10'
                    }`
                  }
                >
                  {link.label}
                </NavLink>
              )
            })}
          </nav>

          <div className="flex items-center gap-2">
            {/* Mobile language toggle */}
            <button
              onClick={toggleLanguage}
              className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white border border-white/20 transition-all flex items-center gap-1.5"
              aria-label="Toggle Language"
            >
              <Globe className="w-4 h-4 text-mint" />
              <span className="text-xs font-bold">{lang === 'bn' ? 'EN' : 'বাং'}</span>
            </button>
            {/* Mobile menu hamburger toggle */}
            <button
              onClick={() => setOpen((o) => !o)}
              className="lg:hidden p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white border border-white/20 transition-all"
              aria-label="Toggle navigation menu"
              aria-expanded={open}
            >
              {open ? <X className="w-6 h-6 text-brick" /> : <Menu className="w-6 h-6 text-gold" />}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Drawer */}
        {open && (
          <div className="lg:hidden fixed inset-x-0 top-full bg-board/95 backdrop-blur-2xl border-b border-white/15 shadow-2xl p-4 sm:p-5 max-h-[calc(100dvh-4.5rem)] overflow-y-auto animate-fadeIn">
            <div className="grid grid-cols-2 gap-2 text-xs sm:text-sm">
              <NavLink
                to="/"
                className={({ isActive }) =>
                  `flex items-center gap-2 sm:gap-2.5 p-2.5 sm:p-3 rounded-xl transition-all ${
                    isActive ? 'bg-white/20 text-gold font-bold' : 'text-chalk/85 hover:bg-white/10'
                  }`
                }
              >
                <Compass className="w-4 h-4 text-mint" />
                <span>{t('navHome')}</span>
              </NavLink>

              <NavLink
                to="/notices"
                className={({ isActive }) =>
                  `flex items-center gap-2.5 p-3 rounded-xl transition-all ${
                    isActive ? 'bg-white/20 text-gold font-bold' : 'text-chalk/85 hover:bg-white/10'
                  }`
                }
              >
                <FileText className="w-4 h-4 text-brick" />
                <span>{t('navNotices')}</span>
              </NavLink>

              <NavLink
                to="/results"
                className={({ isActive }) =>
                  `flex items-center gap-2.5 p-3 rounded-xl transition-all ${
                    isActive ? 'bg-white/20 text-gold font-bold' : 'text-chalk/85 hover:bg-white/10'
                  }`
                }
              >
                <Award className="w-4 h-4 text-gold" />
                <span>{t('navResults')}</span>
              </NavLink>

              <NavLink
                to="/toppers"
                className={({ isActive }) =>
                  `flex items-center gap-2.5 p-3 rounded-xl transition-all ${
                    isActive ? 'bg-white/20 text-gold font-bold' : 'text-chalk/85 hover:bg-white/10'
                  }`
                }
              >
                <Award className="w-4 h-4 text-mint" />
                <span>{t('navToppers')}</span>
              </NavLink>

              <NavLink
                to="/academics"
                className={({ isActive }) =>
                  `flex items-center gap-2.5 p-3 rounded-xl transition-all ${
                    isActive ? 'bg-white/20 text-gold font-bold' : 'text-chalk/85 hover:bg-white/10'
                  }`
                }
              >
                <BookOpen className="w-4 h-4 text-iris" />
                <span>{t('navAcademics')}</span>
              </NavLink>

              <NavLink
                to="/events"
                className={({ isActive }) =>
                  `flex items-center gap-2.5 p-3 rounded-xl transition-all ${
                    isActive ? 'bg-white/20 text-gold font-bold' : 'text-chalk/85 hover:bg-white/10'
                  }`
                }
              >
                <Calendar className="w-4 h-4 text-gold" />
                <span>{t('navEvents')}</span>
              </NavLink>

              <NavLink
                to="/teachers"
                className={({ isActive }) =>
                  `flex items-center gap-2.5 p-3 rounded-xl transition-all ${
                    isActive ? 'bg-white/20 text-gold font-bold' : 'text-chalk/85 hover:bg-white/10'
                  }`
                }
              >
                <Users className="w-4 h-4 text-mint" />
                <span>{t('navTeachers')}</span>
              </NavLink>

              <NavLink
                to="/admission"
                className={({ isActive }) =>
                  `flex items-center gap-2.5 p-3 rounded-xl transition-all ${
                    isActive ? 'bg-white/20 text-gold font-bold' : 'text-chalk/85 hover:bg-white/10'
                  }`
                }
              >
                <UserCheck className="w-4 h-4 text-brick" />
                <span>{t('navAdmission')}</span>
              </NavLink>

              <NavLink
                to="/contact"
                className={({ isActive }) =>
                  `flex items-center gap-2.5 p-3 rounded-xl transition-all ${
                    isActive ? 'bg-white/20 text-gold font-bold' : 'text-chalk/85 hover:bg-white/10'
                  }`
                }
              >
                <PhoneCall className="w-4 h-4 text-gold" />
                <span>{t('navContact')}</span>
              </NavLink>

              <NavLink
                to="/student-dashboard"
                className={({ isActive }) =>
                  `flex items-center gap-2.5 p-3 rounded-xl font-bold bg-gradient-to-r from-iris to-brick text-white transition-all shadow-md ${
                    isActive ? 'ring-2 ring-gold' : ''
                  }`
                }
              >
                <Sparkles className="w-4 h-4 text-gold" />
                <span>{t('navStudentPortal')}</span>
              </NavLink>

              <NavLink
                to="/dashboard"
                className={({ isActive }) =>
                  `col-span-2 flex items-center justify-center gap-2.5 p-3 rounded-xl font-black bg-gradient-to-r from-gold to-amber-500 text-ink transition-all shadow-md ${
                    isActive ? 'ring-2 ring-white' : ''
                  }`
                }
              >
                <LayoutDashboard className="w-4 h-4 text-ink" />
                <span>{lang === 'bn' ? 'স্কুল ড্যাশবোর্ড (ERP Portal)' : 'School ERP Dashboard'}</span>
              </NavLink>
            </div>

            <div className="mt-4 pt-3 border-t border-white/10 flex items-center justify-between text-xs text-chalk/70">
              <span>{lang === 'bn' ? 'হেল্পলাইন:' : 'Helpline:'} {num(contact.phone)}</span>
              <span className="text-mint font-bold">
                {lang === 'bn' ? 'সকাল ৮:০০ - বিকাল ৪:০০' : '8:00 AM - 4:00 PM'}
              </span>
            </div>
          </div>
        )}
      </header>
    </>
  )
}
