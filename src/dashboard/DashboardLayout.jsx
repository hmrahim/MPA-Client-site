import { useState } from 'react'
import { Link } from 'react-router-dom'
import {
  LayoutDashboard,
  CalendarCheck2,
  Users,
  GraduationCap,
  Clock,
  Award,
  DollarSign,
  BookOpen,
  Bus,
  Send,
  Settings,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Search,
  Bell,
  UserPlus,
  ExternalLink,
  Shield,
  Receipt,
  FileSpreadsheet,
  FileText,
  X
} from 'lucide-react'
import { useDashboard } from './context/DashboardContext'
import { useNewSubmissionCount } from '../lib/siteStore'
import { getCmsNavGroups, isCmsTab, CmsPage, CMS_TAB_LABELS } from './cms/cmsRoutes'
import './dashboard.css'

// Modules
import DashboardOverview from './modules/DashboardOverview'
import AttendanceManager from './modules/AttendanceManager'
import StudentManager from './modules/StudentManager'
import FeeCollectionDesk from './modules/FeeCollectionDesk'
import ExamResultManager from './modules/ExamResultManager'
import RoutineManager from './modules/RoutineManager'
import TeacherManager from './modules/TeacherManager'
import LibraryManager from './modules/LibraryManager'
import TransportHostelManager from './modules/TransportHostelManager'
import NoticeManager from './modules/NoticeManager'
import NoticeSmsManager from './modules/NoticeSmsManager'
import SchoolSettings from './modules/SchoolSettings'
import HeroSliderManager from './modules/HeroSliderManager'
import HeadmasterManager from './modules/HeadmasterManager'
import AcademicGroupsManager from './modules/AcademicGroupsManager'
import FacilitiesManager from './modules/FacilitiesManager'
import ClubsManager from './modules/ClubsManager'
import ToppersManager from './modules/ToppersManager'
import EventsGalleryManager from './modules/EventsGalleryManager'

// Modals
import MoneyReceiptModal from './modals/MoneyReceiptModal'
import StudentIdCardModal from './modals/StudentIdCardModal'
import ReportCardModal from './modals/ReportCardModal'
import TransferCertificateModal from './modals/TransferCertificateModal'

export default function DashboardLayout() {
  const { schoolInfo, activeRole, setActiveRole, notifications } = useDashboard()

  const [activeTab, setActiveTab] = useState('overview')
  const [collapsed, setCollapsed] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [isAddStudentOpen, setIsAddStudentOpen] = useState(false)
  const [notificationsOpen, setNotificationsOpen] = useState(false)
  const [collapsedGroups, setCollapsedGroups] = useState({})
  const [tabParam, setTabParam] = useState(undefined) // inner tab for CMS pages (e.g. 'gallery')
  const inboxCount = useNewSubmissionCount()

  const goTo = (id, param) => {
    setActiveTab(id)
    setTabParam(param)
    setMobileOpen(false)
  }

  const toggleGroup = (id) => {
    if (collapsed) return
    setCollapsedGroups((prev) => ({ ...prev, [id]: !prev[id] }))
  }

  // Navigation Groups (Exact moom24 hierarchy)
  const NAV_GROUPS = [
    {
      id: 'main',
      label: 'Main Navigation',
      items: [
        { id: 'overview', label: 'Dashboard', icon: LayoutDashboard },
        { id: 'attendance', label: 'Attendance', icon: CalendarCheck2, badge: 'Live', badgeColor: 'emerald' },
        { id: 'students', label: 'Students', icon: Users, badge: '1,250' },
        { id: 'teachers', label: 'Teachers & Staff', icon: GraduationCap }
      ]
    },
    {
      id: 'academic',
      label: 'Academics',
      items: [
        { id: 'routine', label: 'Class Routine', icon: Clock },
        { id: 'exams', label: 'Exams & Results', icon: Award }
      ]
    },
    {
      id: 'finance',
      label: 'Finance & POS',
      items: [
        { id: 'fees', label: 'Fee Collection POS', icon: DollarSign, badge: 'POS', badgeColor: 'violet' }
      ]
    },
    {
      id: 'management',
      label: 'Administration',
      items: [
        { id: 'library', label: 'Digital Library', icon: BookOpen },
        { id: 'logistics', label: 'Transport & Hostel', icon: Bus },
        { id: 'notice-board', label: 'Notice Board & Pad', icon: FileText, badge: 'Official', badgeColor: 'indigo' },
        { id: 'notices', label: 'SMS Broadcast', icon: Send },
        { id: 'settings', label: 'School Settings', icon: Settings }
      ]
    }
  ]

  // Website CMS menu is visible to Headmaster / Admin roles only
  const canManageSite = activeRole === 'admin' || activeRole === 'principal'
  const navGroups = canManageSite ? [...NAV_GROUPS, ...getCmsNavGroups(inboxCount)] : NAV_GROUPS
  const activeLabel = CMS_TAB_LABELS[activeTab] || activeTab

  const roleLabels = {
    admin: 'Headmaster (Admin)',
    teacher: 'Class Teacher',
    accountant: 'Senior Accountant',
    librarian: 'Head Librarian'
  }

  return (
    <div className="moom-dashboard-root flex w-full h-[100dvh] overflow-hidden text-slate-200">
      {/* Mobile Backdrop */}
      {mobileOpen && (
        <div
          onClick={() => setMobileOpen(false)}
          className="fixed inset-0 z-40 bg-black/80 backdrop-blur-sm lg:hidden"
        />
      )}

      {/* ── Sidebar (moom24 style) ── */}
      <aside
        className={`moom-sidebar fixed lg:static top-0 bottom-0 left-0 z-50 h-full flex flex-col shrink-0 border-r border-[#1e1e2e] transition-all duration-300 ${
          collapsed ? 'w-[68px] min-w-[68px]' : 'w-[260px] min-w-[260px]'
        } ${mobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}
      >
        {/* Desktop collapse toggle — floats on the sidebar edge so the logo always stays visible */}
        <button
          onClick={() => setCollapsed(!collapsed)}
          title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          className="hidden lg:flex absolute top-[22px] -right-3 z-[60] w-6 h-6 items-center justify-center rounded-full bg-[#1c1c28] border border-[#2a2a3d] text-slate-300 hover:text-white hover:bg-[#6c63ff] hover:border-[#6c63ff] shadow-lg transition"
        >
          <ChevronLeft className={`w-3.5 h-3.5 transition-transform duration-300 ${collapsed ? 'rotate-180' : ''}`} />
        </button>

        <div className="relative flex flex-col h-full min-h-0 overflow-hidden">
          {/* Ambient Glow */}
          <div className="moom-ambient-glow" />

          {/* Logo Bar */}
          <div className={`h-[64px] flex items-center border-b border-[#1e1e2e] shrink-0 relative z-10 ${collapsed && !mobileOpen ? 'justify-center px-0' : 'justify-between px-3.5'}`}>
            <Link to="/" className="flex items-center gap-2.5 overflow-hidden">
              <div className="w-[34px] h-[34px] min-w-[34px] rounded-[10px] bg-gradient-to-tr from-[#6c63ff] to-[#a78bfa] flex items-center justify-center font-black text-sm text-white shadow-[0_0_20px_rgba(108,99,255,0.4)]">
                MA
              </div>
              {(!collapsed || mobileOpen) && (
                <div className="flex flex-col min-w-0 transition-opacity duration-300">
                  <span className="font-extrabold text-sm text-white truncate tracking-tight font-display">
                    Mirashani
                  </span>
                  <span className="text-[10px] text-[#6c63ff] font-bold tracking-wider uppercase">
                    School ERP
                  </span>
                </div>
              )}
            </Link>

            {/* Mobile Close Button */}
            <button
              onClick={() => setMobileOpen(false)}
              className="lg:hidden p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/5 transition"
              aria-label="Close sidebar"
            >
              <X className="w-5 h-5" />
            </button>

          </div>

          {/* Navigation Links Scroll Area */}
          <nav className="moom-nav-scroll flex-1 min-h-0 overflow-y-auto overscroll-contain px-2.5 py-4 space-y-5 relative z-10" aria-label="Dashboard menu">
            {navGroups.map((group) => {
              const isGroupCollapsed = !!collapsedGroups[group.id]
              return (
                <div key={group.id} className={`space-y-1 ${collapsed ? 'moom-group-rail' : ''}`}>
                  {!collapsed && (
                    <div
                      onClick={() => toggleGroup(group.id)}
                      className="moom-group-label"
                    >
                      <span>{group.label}</span>
                      <ChevronDown
                        className={`w-3 h-3 transition-transform duration-200 ${
                          isGroupCollapsed ? '-rotate-90' : ''
                        }`}
                      />
                    </div>
                  )}

                  <div
                    className={`space-y-0.5 overflow-hidden transition-all duration-300 ${
                      isGroupCollapsed && !collapsed ? 'max-h-0 opacity-0' : 'max-h-[800px] opacity-100'
                    }`}
                  >
                    {group.items.map((item) => {
                      const Icon = item.icon
                      const isActive = activeTab === item.id
                      return (
                        <button
                          key={item.id}
                          onClick={() => goTo(item.id)}
                          className={`w-full moom-nav-item ${isActive ? 'active' : ''}`}
                          aria-current={isActive ? 'page' : undefined}
                          title={collapsed ? item.label : undefined}
                        >
                          {isActive && <span className="moom-active-bar" />}
                          <span className="moom-nav-icon"><Icon className="w-[15px] h-[15px]" /></span>

                          {!collapsed && (
                            <span className="truncate flex-1 text-left font-medium">
                              {item.label}
                            </span>
                          )}

                          {!collapsed && item.badge && (
                            <span
                              className={`text-[9px] font-extrabold px-1.5 py-0.5 rounded-full ${
                                item.badgeColor === 'emerald'
                                  ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                                  : item.badgeColor === 'violet'
                                  ? 'bg-[#6c63ff]/20 text-[#a78bfa] border border-[#6c63ff]/30'
                                  : 'bg-white/10 text-slate-300'
                              }`}
                            >
                              {item.badge}
                            </span>
                          )}
                        </button>
                      )
                    })}
                  </div>
                </div>
              )
            })}
          </nav>

          {/* Footer Card */}
          <div className="moom-sidebar-footer p-2.5 space-y-2 shrink-0 relative z-10">
            <Link
              to="/"
              className="moom-btn-ghost w-full flex items-center justify-center gap-2 py-2 px-2.5 rounded-xl text-xs font-semibold"
            >
              <ExternalLink className="w-3.5 h-3.5 text-[#a78bfa]" />
              {!collapsed && <span>Main Website</span>}
            </Link>

            <div className="flex items-center gap-2.5 p-2 rounded-xl bg-white/[0.03] border border-white/[0.06]">
              <div className="relative w-8 h-8 rounded-lg bg-gradient-to-tr from-[#6c63ff] to-[#38bdf8] flex items-center justify-center font-bold text-xs text-white shrink-0 shadow">
                MR
                <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-emerald-400 border-2 border-[#111118]" />
              </div>
              {!collapsed && (
                <div className="min-w-0 flex-1">
                  <p className="text-xs font-semibold text-white truncate">Md. Rafiqul Islam</p>
                  <p className="text-[10px] text-slate-400 truncate">{roleLabels[activeRole]}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </aside>

      {/* ── Main Layout ── */}
      <div className="flex-1 min-w-0 flex flex-col h-full min-h-0 overflow-hidden bg-[#0a0a0f]">
        {/* ── Top Header (moom24 style) ── */}
        <header className="h-[64px] bg-[#111118] border-b border-[#1e1e2e] px-3 sm:px-6 flex items-center justify-between gap-3 sm:gap-4 shrink-0 z-30">
          <div className="flex items-center gap-2.5 sm:gap-3">
            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setMobileOpen(true)}
              className="lg:hidden p-2 rounded-lg bg-[#16161f] border border-[#1e1e2e] text-slate-400 hover:text-white"
              aria-label="Open sidebar"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>

            {/* Breadcrumb / Status */}
            <div className="hidden sm:flex items-center gap-2 text-xs font-medium text-slate-400">
              <span className="text-white font-semibold">Mirashani Academy ERP</span>
              <span>/</span>
              <span className="text-[#a78bfa] capitalize font-bold">{activeLabel}</span>
            </div>
          </div>

          {/* Search Bar */}
          <div className="flex-1 max-w-sm hidden md:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[#16161f] border border-[#1e1e2e] text-slate-400 focus-within:border-[#6c63ff]/60 transition">
            <Search className="w-4 h-4 text-slate-400 shrink-0" />
            <input
              type="text"
              placeholder="Search students, staff, vouchers..."
              className="bg-transparent border-none outline-none text-xs text-white placeholder-slate-500 w-full"
            />
            <span className="font-mono text-[10px] bg-white/5 border border-white/10 px-1.5 py-0.5 rounded text-slate-400 shrink-0">
              ⌘K
            </span>
          </div>

          {/* Right Action Icons */}
          <div className="flex items-center gap-2 sm:gap-2.5">
            {/* Role Badge */}
            <div className="hidden lg:flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#16161f] border border-[#1e1e2e] text-xs font-semibold text-[#a78bfa]">
              <Shield className="w-3.5 h-3.5 text-[#6c63ff]" />
              <span>{roleLabels[activeRole]}</span>
            </div>

            {/* Enroll Student CTA */}
            <button
              onClick={() => setIsAddStudentOpen(true)}
              className="moom-btn-primary px-3 sm:px-3.5 py-1.5 rounded-lg text-xs font-bold inline-flex items-center gap-1.5 shrink-0"
            >
              <UserPlus className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Add Student</span>
              <span className="sm:hidden">Add</span>
            </button>

            {/* Notifications with pulsing dot */}
            <div className="relative">
              <button
                onClick={() => setNotificationsOpen(!notificationsOpen)}
                className="w-[34px] h-[34px] rounded-lg bg-[#16161f] border border-[#1e1e2e] flex items-center justify-center text-slate-400 hover:text-white transition relative shrink-0"
                aria-label="Notifications"
              >
                <Bell className="w-4 h-4" />
                <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-rose-500 moom-pulse-dot" />
              </button>

              {notificationsOpen && (
                <div className="absolute right-0 mt-2 w-[calc(100vw-2rem)] max-w-xs sm:w-80 bg-[#16161f] rounded-2xl shadow-2xl border border-[#1e1e2e] p-4 z-50 text-xs space-y-3">
                  <div className="flex items-center justify-between border-b border-[#1e1e2e] pb-2">
                    <span className="font-bold text-white">System Notifications</span>
                    <span className="text-[10px] text-[#a78bfa] cursor-pointer hover:underline">Mark all read</span>
                  </div>
                  <div className="divide-y divide-[#1e1e2e] space-y-2">
                    {notifications.map((n) => (
                      <div key={n.id} className="pt-2">
                        <span className="font-bold text-slate-200 block">{n.title}</span>
                        <p className="text-[11px] text-slate-400 mt-0.5">{n.desc}</p>
                        <span className="text-[9px] font-mono text-slate-500 mt-1 block">{n.time}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Header User Avatar */}
            <div className="w-[34px] h-[34px] rounded-lg bg-gradient-to-tr from-[#6c63ff] to-[#a78bfa] flex items-center justify-center font-bold text-xs text-white shadow-[0_0_12px_rgba(108,99,255,0.4)] shrink-0">
              RI
            </div>
          </div>
        </header>

        {/* ── Main Dynamic Content Area ── */}
        <main className="flex-1 min-h-0 min-w-0 overflow-y-auto moom-scrollbar">
          <div className="p-3 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto space-y-6">
          {activeTab === 'overview' && (
            <DashboardOverview
              setActiveTab={setActiveTab}
              onOpenAddStudent={setIsAddStudentOpen}
            />
          )}

          {activeTab === 'attendance' && <AttendanceManager />}

          {activeTab === 'students' && (
            <StudentManager
              isAddModalOpen={isAddStudentOpen}
              setIsAddModalOpen={setIsAddStudentOpen}
              setActiveTab={setActiveTab}
            />
          )}

          {activeTab === 'teachers' && <TeacherManager />}

          {activeTab === 'routine' && <RoutineManager />}

          {activeTab === 'exams' && <ExamResultManager />}

          {activeTab === 'fees' && <FeeCollectionDesk />}

          {activeTab === 'library' && <LibraryManager />}

          {activeTab === 'logistics' && <TransportHostelManager />}

          {(activeTab === 'notice-board' || activeTab === 'notice-manager') && <NoticeManager />}

          {activeTab === 'notices' && <NoticeSmsManager />}

          {activeTab === 'settings' && <SchoolSettings />}
          {(activeTab === 'hero-slider' || activeTab === 'slider') && <HeroSliderManager />}
          {activeTab === 'headmaster' && <HeadmasterManager />}
          {(activeTab === 'academic-groups' || activeTab === 'academicGroups' || activeTab === 'groups') && (
            <AcademicGroupsManager />
          )}
          {(activeTab === 'facilities' || activeTab === 'facilities-manager') && (
            <FacilitiesManager />
          )}
          {(activeTab === 'clubs' || activeTab === 'student-clubs') && (
            <ClubsManager />
          )}
          {(activeTab === 'toppers' || activeTab === 'merit') && (
            <ToppersManager />
          )}
          {(activeTab === 'events-gallery' || activeTab === 'gallery-manager') && (
            <EventsGalleryManager />
          )}

          {/* ── Website CMS (public site management) ── */}
          {isCmsTab(activeTab) &&
            (canManageSite ? (
              <CmsPage tab={activeTab} param={tabParam} onNavigate={goTo} setActiveTab={goTo} />
            ) : (
              <div className="moom-card p-10 text-center">
                <Shield className="w-8 h-8 text-[#a78bfa] mx-auto mb-3" />
                <p className="text-sm font-bold text-white">Website CMS is restricted</p>
                <p className="text-xs text-slate-400 mt-1">
                  Switch to the Headmaster or Admin role in School Settings → Access Control to manage the public website.
                </p>
              </div>
            ))}
          </div>
        </main>
      </div>

      {/* Global Modals for Printing */}
      <MoneyReceiptModal />
      <StudentIdCardModal />
      <ReportCardModal />
      <TransferCertificateModal />
    </div>
  )
}
