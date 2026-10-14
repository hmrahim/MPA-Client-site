import { useState } from 'react'
import { Link } from 'react-router-dom'
import {
  LayoutDashboard, GraduationCap, Wallet, Clock, CalendarCheck2, BookOpen, Megaphone, User,
  LogOut, ChevronLeft, ExternalLink, X, Menu
} from 'lucide-react'
import { DashboardProvider, useDashboard } from '../dashboard/context/DashboardContext'
import ExamResultsPanel from '../dashboard/components/ExamResultsPanel'
import ReportCardModal from '../dashboard/modals/ReportCardModal'
import MoneyReceiptModal from '../dashboard/modals/MoneyReceiptModal'
import StudentIdCardModal from '../dashboard/modals/StudentIdCardModal'
import '../dashboard/dashboard.css'
import StudentLogin from './StudentLogin'
import {
  OverviewSection, FeesSection, RoutineSection, AttendanceSection,
  LibrarySection, NoticesSection, ProfileSection
} from './StudentSections'

const SESSION_KEY = 'mpa_student_portal_session'

const NAV = [
  { id: 'overview', label: 'Overview', icon: LayoutDashboard },
  { id: 'results', label: 'Exam Results', icon: GraduationCap },
  { id: 'fees', label: 'Fees & Payments', icon: Wallet },
  { id: 'routine', label: 'Class Routine', icon: Clock },
  { id: 'attendance', label: 'Attendance', icon: CalendarCheck2 },
  { id: 'library', label: 'My Library', icon: BookOpen },
  { id: 'notices', label: 'Notices', icon: Megaphone },
  { id: 'profile', label: 'My Profile', icon: User }
]

const readSession = () => {
  try { return sessionStorage.getItem(SESSION_KEY) } catch { return null }
}

function PortalInner() {
  const { students, schoolInfo, feeTransactions } = useDashboard()
  const [studentId, setStudentId] = useState(readSession)
  const [tab, setTab] = useState('overview')
  const [collapsed, setCollapsed] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)

  const student = students.find((s) => s.id === studentId)

  const login = (id) => {
    try { sessionStorage.setItem(SESSION_KEY, id) } catch { /* ignore */ }
    setStudentId(id)
    setTab('overview')
  }
  const logout = () => {
    try { sessionStorage.removeItem(SESSION_KEY) } catch { /* ignore */ }
    setStudentId(null)
  }

  if (!student) return <StudentLogin onLogin={login} />

  const goTo = (id) => {
    setTab(id)
    setMobileOpen(false)
  }
  const pending = student.feeDue || 0
  const active = NAV.find((n) => n.id === tab)
  const railed = collapsed && !mobileOpen

  return (
    <div className="moom-dashboard-root flex w-full h-[100dvh] overflow-hidden text-slate-200">
      {mobileOpen && <div onClick={() => setMobileOpen(false)} className="fixed inset-0 z-40 bg-black/80 backdrop-blur-sm lg:hidden" />}

      <aside
        className={`moom-sidebar fixed lg:static top-0 bottom-0 left-0 z-50 h-full flex flex-col shrink-0 border-r border-[#1e1e2e] transition-all duration-300 ${
          collapsed ? 'lg:w-[68px] lg:min-w-[68px]' : 'lg:w-[260px] lg:min-w-[260px]'
        } w-[260px] ${mobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}
      >
        <button
          onClick={() => setCollapsed(!collapsed)}
          aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          className="hidden lg:flex absolute top-[22px] -right-3 z-[60] w-6 h-6 items-center justify-center rounded-full bg-[#1c1c28] border border-[#2a2a3d] text-slate-300 hover:text-white hover:bg-[#6c63ff] hover:border-[#6c63ff] shadow-lg transition"
        >
          <ChevronLeft className={`w-3.5 h-3.5 transition-transform duration-300 ${collapsed ? 'rotate-180' : ''}`} />
        </button>

        <div className="relative flex flex-col h-full min-h-0 overflow-hidden">
          <div className="moom-ambient-glow" />
          <div className={`h-[64px] flex items-center border-b border-[#1e1e2e] shrink-0 relative z-10 ${railed ? 'justify-center px-0' : 'justify-between px-3.5'}`}>
            <Link to="/" className="flex items-center gap-2.5 overflow-hidden">
              <div className="w-[34px] h-[34px] min-w-[34px] rounded-[10px] bg-gradient-to-tr from-[#6c63ff] to-[#a78bfa] flex items-center justify-center font-black text-sm text-white shadow-[0_0_20px_rgba(108,99,255,0.4)]">MA</div>
              {!railed && (
                <div className="flex flex-col min-w-0">
                  <span className="font-extrabold text-sm text-white truncate tracking-tight font-display">Mirashani</span>
                  <span className="text-[10px] text-[#6c63ff] font-bold tracking-wider uppercase">Student Portal</span>
                </div>
              )}
            </Link>
            <button onClick={() => setMobileOpen(false)} className="lg:hidden p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/5" aria-label="Close menu">
              <X className="w-5 h-5" />
            </button>
          </div>

          <nav className="moom-nav-scroll flex-1 min-h-0 overflow-y-auto overscroll-contain px-2.5 py-4 space-y-1 relative z-10" aria-label="Student menu">
            {NAV.map((item) => {
              const Icon = item.icon
              const isActive = tab === item.id
              return (
                <button key={item.id} onClick={() => goTo(item.id)} title={railed ? item.label : undefined} aria-current={isActive ? 'page' : undefined} className={`w-full moom-nav-item ${isActive ? 'active' : ''}`}>
                  {isActive && <span className="moom-active-bar" />}
                  <span className="moom-nav-icon"><Icon className="w-[15px] h-[15px]" /></span>
                  {!railed && <span className="truncate flex-1 text-left font-medium">{item.label}</span>}
                  {!railed && item.id === 'fees' && pending > 0 && (
                    <span className="text-[9px] font-extrabold px-1.5 py-0.5 rounded-full bg-rose-500/20 text-rose-400 border border-rose-500/30">DUE</span>
                  )}
                </button>
              )
            })}
          </nav>

          <div className="moom-sidebar-footer p-2.5 space-y-2 shrink-0 relative z-10">
            <Link to="/" className="moom-btn-ghost w-full flex items-center justify-center gap-2 py-2 px-2.5 rounded-xl text-xs font-semibold">
              <ExternalLink className="w-3.5 h-3.5 text-[#a78bfa]" />
              {!railed && <span>Main Website</span>}
            </Link>
            <div className="flex items-center gap-2.5 p-2 rounded-xl bg-white/[0.03] border border-white/[0.06]">
              <img src={student.avatar} alt="" className="w-8 h-8 rounded-lg object-cover shrink-0" />
              {!railed && (
                <>
                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-semibold text-white truncate">{student.name}</p>
                    <p className="text-[10px] text-slate-400 truncate">{student.className} · {student.section} · Roll {student.roll}</p>
                  </div>
                  <button onClick={logout} title="Sign out" className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-white/5">
                    <LogOut className="w-4 h-4" />
                  </button>
                </>
              )}
            </div>
            {railed && (
              <button onClick={logout} title="Sign out" className="w-full flex justify-center p-2 rounded-xl text-slate-400 hover:text-rose-400 hover:bg-white/5">
                <LogOut className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </aside>

      <div className="flex-1 min-w-0 flex flex-col h-full min-h-0 overflow-hidden bg-[#0a0a0f]">
        <header className="h-[64px] bg-[#111118] border-b border-[#1e1e2e] px-3 sm:px-6 flex items-center justify-between gap-3 shrink-0 z-30">
          <div className="flex items-center gap-3 min-w-0">
            <button onClick={() => setMobileOpen(true)} className="lg:hidden p-2 rounded-lg bg-[#16161f] border border-[#1e1e2e] text-slate-400 hover:text-white" aria-label="Open menu">
              <Menu className="w-5 h-5" />
            </button>
            <div className="min-w-0">
              <p className="text-sm font-black text-white truncate">{active?.label}</p>
              <p className="text-[10px] text-slate-500 truncate hidden sm:block">{schoolInfo.name} · Session {schoolInfo.currentSession}</p>
            </div>
          </div>
          <div className="hidden sm:flex items-center gap-2 text-xs font-semibold text-[#a78bfa] px-3 py-1 rounded-full bg-[#16161f] border border-[#1e1e2e]">
            <GraduationCap className="w-3.5 h-3.5 text-[#6c63ff]" />
            {student.className} · {student.section}
          </div>
        </header>

        <main className="flex-1 min-h-0 min-w-0 overflow-y-auto moom-scrollbar">
          <div className="p-3 sm:p-6 lg:p-8 max-w-6xl w-full mx-auto">
            {tab === 'overview' && <OverviewSection student={student} goTo={goTo} />}
            {tab === 'results' && <ExamResultsPanel student={student} />}
            {tab === 'fees' && <FeesSection student={student} />}
            {tab === 'routine' && <RoutineSection student={student} />}
            {tab === 'attendance' && <AttendanceSection student={student} />}
            {tab === 'library' && <LibrarySection student={student} />}
            {tab === 'notices' && <NoticesSection />}
            {tab === 'profile' && <ProfileSection student={student} />}
          </div>
        </main>
      </div>

      <ReportCardModal />
      <MoneyReceiptModal />
      <StudentIdCardModal />
    </div>
  )
}

export default function StudentPortalApp() {
  return (
    <DashboardProvider>
      <PortalInner />
    </DashboardProvider>
  )
}
